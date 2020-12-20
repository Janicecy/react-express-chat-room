import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './main.css'
import socketIOClient from 'socket.io-client'
import { ENDPOINT, CHAT_ROOM, EVENT_TYPE, MESSAGE_TYPES, dummyData } from '../constants'
import UserList from './UserList'
import { getBase64 } from '../helpers'
import PropTypes from 'prop-types';
import imgIcon from './img_icon.png'
import userIcon from './user_icon.png'
import { GithubOutlined } from '@ant-design/icons';
import useWindowSize from './useWindowSize'
import { useHistory, useLocation } from 'react-router-dom'

// remove given element and return new araray 
Array.prototype.removeElement = function (ele) {
  const index = this.indexOf(ele)
  if (~index) {
    return [...this.slice(0,index), ...this.slice(index + 1, this.length) ]
  }
  return this 
}

const ChatRoom = (props) => {
  const location = useLocation();
  if (!location.state) history.push('/')
  const { username, roomData } = location.state;
  // states
  const [messages, setMessages] = useState(roomData.messages);
  const [currentUsers, setCurrentUsers] = useState(roomData.currentUsers);
  const [isUserListOpen, toggleUserList] = useState(false);
  // custom hook 
  const { width: windowWidth } = useWindowSize();

  const history = useHistory();
  const socket = socketIOClient(ENDPOINT, { query: `roomId=${roomData.roomId}` });

  const _constructMessage = ({ type, content }, author) => {
    return {
      type,
      content,
      time: new Date().toLocaleDateString(),
      author
    }
  }

  // before connecting to websocket, make sure the room was created 
  useEffect(() => {
    console.log('client connecting to socket.....');
    socket.emit('join', username)

    // the changes of  outer `messages` will not be reflected here, so 
    let _messsages = messages; // create a closure variable tp keep track of current messages
    let _currentUsers = currentUsers;
    socket.on("chat_room", (res) => {
      console.log('new response ...' + res);
      switch (res.eventType) {
        case EVENT_TYPE.USER_JOIN:
          _currentUsers = [..._currentUsers, res.data]
          setCurrentUsers(_currentUsers)
          break;
        case EVENT_TYPE.NEW_MESSAGE:
          _messsages = [..._messsages, res.data]
          console.log('new message' + res.data);
          setMessages(_messsages);
        case EVENT_TYPE.USER_LEAVE:
            _currentUsers = _currentUsers.removeElement(res.data);
            setCurrentUsers(_currentUsers)
        default:
          break;
      }
    })
  }, [])

  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }

  const adddNewMessage = (newMessage, clearInput) => {
    socket.emit('message', newMessage)
    clearInput();
  }

  return (
    <div id='chat-room'>
      {
        windowWidth < 500
          ? (
            <div id='top-bar'>
              <GithubOutlined />
              <img id='user-toggle' onClick={() => toggleUserList(!isUserListOpen)} style={{ width: 22 }} src={userIcon} />
            </div>
          )
          : null
      }

      {windowWidth > 500 || isUserListOpen
        ? <UserList roomOwner={roomData.owner} currentUsers={currentUsers} />
        : null
      }

      <div id='chat-box-wrapper'>
        <ContentBox username={username} messages={messages} />
        {/* rawMessage: { type: String, content: String/File } */}
        <InputBox onNewMessage={(rawMessage, clearInput) => {
          const formattedMsg = _constructMessage(rawMessage, username);
          adddNewMessage(formattedMsg, clearInput);
          scrollToBottom();
        }} />
      </div>
    </div>
  )
}

ChatRoom.prototypes = {
  messages: PropTypes.array,
  username: PropTypes.string // the username of current user 
}

// content: time, username

const ContentBox = (props) => {
  const { username, messages } = props
  const renderMessages = (messages) => {
    return messages.map((message) => {
      const isAuthor = message.author == username;
      return (
        <div id='message-wrapper'
        >
          <Tail type={isAuthor ? "right" : "left"} />
          <div
            id='message'
            style={{ backgroundColor: isAuthor ? "#dbf8c6" : "", float: isAuthor ? 'right' : '' }}
          >
            {!isAuthor ? <span id='message-author'>{message.author}</span> : null}

            {message.type === MESSAGE_TYPES.TEXT
              ? <div id='message-content'>{message.content}</div>
              : <img className='preview-img' src={message.content} />
            }

            <span id='message-time'>{message.time}</span>
          </div>
        </div>
      )
    })
  }
  return (
    <div id='content-box'>
      {renderMessages(messages)}
    </div>
  )
}

const InputBox = (props) => {
  const [inputText, setInputText] = useState('');

  const sendText = () => {
    if (!inputText) {
      return;
    }
    props.onNewMessage({ type: MESSAGE_TYPES.TEXT, content: inputText }, clearInput)
  }

  const clearInput = () => { setInputText('') }

  const uploadImage = async e => {
    const res = await getBase64(e.target.files[0])
    console.log(res);
    props.onNewMessage({ type: MESSAGE_TYPES.IMAGE, content: res }, clearInput)
    console.log(e.target.files[0]);
  }

  return (
    <div id='input-box'>
      {/* Clicking a label ele paired with an input wiil activate/focus it */}
      <span className='img-input-wrapper' style={{ flex: '0 1 10%' }}>
        <label for='img-input'>
          <img src={imgIcon} id='img-uoload-icon' />
        </label>
        <input type="file" onChange={uploadImage} id='img-input' accept />
      </span>
      <input type='textarea'
        wrap="soft"
        placeholder='Type a message'
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        style={{ flex: '0 1 60%' }}
      />

      <button value='Send' onClick={sendText} style={{ flex: '0 1 20%' }}>Send</button>
    </div>
  )
}

const Tail = (props) => {
  const { type } = props;
  return (
    <div id='tail'>
      {
        type == "left"
          ? <span style={{ color: 'white', float: 'left' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path><path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path></svg></span>
          : <span style={{ color: "#dbf8c6", float: 'right' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg></span>
      }
    </div>
  )
}

export default ChatRoom