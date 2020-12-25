import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './ChatRoom.css'
import socketIOClient from 'socket.io-client'
import { ENDPOINT, EVENT_TYPE, MESSAGE_TYPES } from '../constants'
import UserList from './UserList'
import { getBase64 } from '../helpers'
import PropTypes from 'prop-types';
import imgIcon from '../assets/images/img_icon1.png'
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import useWindowSize from './useWindowSize'
import { useHistory, useLocation } from 'react-router-dom'

// remove given element and return new araray 
Array.prototype.removeElement = function (ele) {
  const index = this.indexOf(ele)
  if (~index) {
    return [...this.slice(0, index), ...this.slice(index + 1, this.length)]
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
  const socket = socketIOClient(ENDPOINT, { query: { roomId: roomData.roomId, username } });

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
      switch (res.eventType) {
        case EVENT_TYPE.USER_JOIN:
          _currentUsers = [..._currentUsers, res.data]
          _messsages = [..._messsages, { type: MESSAGE_TYPES.USER_JOIN, username: res.data }]
          setCurrentUsers(_currentUsers)
          setMessages(_messsages)
          break;
        case EVENT_TYPE.NEW_MESSAGE:
          _messsages = [..._messsages, res.data]
          console.log('new message' + res.data);
          setMessages(_messsages);
          // scrollToBottom();
          break;
        case EVENT_TYPE.USER_LEAVE:
          _messsages = [..._messsages, { type: MESSAGE_TYPES.USER_LEAVE, username: res.data }]
          _currentUsers = _currentUsers.removeElement(res.data);
          setCurrentUsers(_currentUsers)
          setMessages(_messsages)
          break;
        default:
          break;
      }
    })
  }, [])

  const scrollToBottom = () => {
    const targetEle = document.getElementsByClassName('message-wrapper');
    if (targetEle) {
      console.log(targetEle[0]);
      window.scrollTo(0, targetEle[targetEle.length - 1].scrollHeight);
    }
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
              <GithubOutlined style={{ color: 'white' }} onClick={() => window.open('https://github.com/JANICECY/react-express-chat-room')} />
              <UserOutlined onClick={() => toggleUserList(!isUserListOpen)} style={{ color: 'white' }} />
            </div>
          )
          : <GithubOutlined className='githubIcon' style={{ color: 'white' }} onClick={() => window.open('https://github.com/JANICECY/react-express-chat-room')} />
      }

      {windowWidth > 500 || isUserListOpen
        ? <UserList roomOwner={roomData.owner} currentUsers={currentUsers} roomId={roomData.roomId} />
        : null
      }

      <div id='chat-box-wrapper'>
        <ContentBox username={username} messages={messages} />
        {/* rawMessage: { type: String, content: String/File } */}
        <InputBox onNewMessage={(rawMessage, clearInput) => {
          const formattedMsg = _constructMessage(rawMessage, username);
          adddNewMessage(formattedMsg, clearInput);
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
  const renderMessages = (messages, index) => {
    return messages.map((message) => {
      const getRenderedMessage = message => {
        switch (message.type) {
          case MESSAGE_TYPES.TEXT:
            return <div id='message-content'>{message.content}</div>
          case MESSAGE_TYPES.IMAGE:
            return <img className='preview-img' src={message.content} />
          case MESSAGE_TYPES.USER_JOIN:
            return <div className='user-event-message'><span style={{ color: '#60a3bc', fontWeight: 'bold' }}>{message.username}</span> has joined the room 👋</div>
          case MESSAGE_TYPES.USER_LEAVE:
            return <div className='user-event-message'><span style={{ color: '#60a3bc', fontWeight: 'bold' }}>{message.username}</span> has left the room</div>
        }
      }

      const isAuthor = message.author == username;

      const floated = [MESSAGE_TYPES.IMAGE, MESSAGE_TYPES.TEXT].includes(message.type);
      if (floated) {
        return (
          <div className='message-wrapper' id={`message-${index}`}>
            <div
              id='message'
              style={{ backgroundColor: isAuthor ? "#056162" : "", float: isAuthor ? 'right' : 'left' }}
            >
              {!isAuthor ? <span id='message-author'>~{message.author}</span> : null}
              {getRenderedMessage(message)}
              <span id='message-time'>{message.time}</span>
            </div>
          </div>
        )
      }

      return (
        <div>
          {getRenderedMessage(message)}
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
        onKeyUp={(event) => {
          if (event.key === 'Enter') sendText();
        }}
      />

      <button value='Send' onClick={sendText} style={{ flex: '0 1 20%' }}>Send</button>
    </div>
  )
}

export default ChatRoom