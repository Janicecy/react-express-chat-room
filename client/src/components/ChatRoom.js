import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
import './main.css'
// import socketIOClient from 'socket.io-client'
import { ENDPOINT, CONTENT_ROOM } from '../constants'
import UserList from './UserList'
import { getBase64 } from '../helpers'
import PropTypes from 'prop-types';
import imgIcon from './img_icon.png'
import userIcon from './user_icon.png'
import { GithubOutlined } from '@ant-design/icons';
import useWindowSize from './useWindowSize'
const MESSAGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE'

}

const dummyData = [
  { type: "TEXT", content: "heelo", time: 'July 19, 2020', author: 'cy' },
  { type: "TEXT", content: "heelo", time: 'July 19, 2020', author: 'cy' },
  { type: "TEXT", content: "heelo", time: 'July 19, 2020', author: 'cy' },
  { type: "TEXT", content: "heelo", time: 'July 19, 2020', author: 'yingch' },
]

const ChatRoom = (props) => {
  const [messages, setMessages] = useState(dummyData);
  const { width: windowWidth } = useWindowSize();
  const [isUserListOpen, toggleUserList] = useState(false);

  useEffect(() => {
    axios.get('/api/get-all-messages')
      .then((res) => {
        if (res.status == 200)
          setMessages(res.data);
      })
  })

  const _constructMessage = ({ type, content }) => {
    return {
      type,
      content,
      time: new Date().toLocaleDateString(),
      author: props.author
    }
  }

  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
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
        ? <UserList roomOwner='chenying' />
        : null
      }

      <div id='chat-box-wrapper'>
        <ContentBox username='yingch' messages={messages} />
        <InputBox handleAddNewMessage={(rawMessage) => {
          setMessages([...messages, _constructMessage(rawMessage)])
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

  // useEffect(() => {
  //     const socket = socketIOClient(ENDPOINT);
  //     socket.on(CONTENT_ROOM, data => {
  //         setMessages([...messages, data]);
  //         console.log(data)
  //     })
  // })

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

    props.handleAddNewMessage({ type: MESSAGE_TYPES.TEXT, content: inputText })
    // axios.post(ENDPOINT + '/api/add-content', {})
    //   .then((res) => {
    //     if (res.status === 200) {
    //       this.setState({ inputText: '' })
    //     }
    //   })
    //   .catch(e => console.log(e.message))
  }

  const uploadImage = async e => {
    const res = await getBase64(e.target.files[0])
    console.log(res);
    props.handleAddNewMessage({ type: MESSAGE_TYPES.IMAGE, content: res })
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