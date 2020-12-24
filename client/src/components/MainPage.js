import React, { useState } from 'react';
import axios from 'axios';
import { GithubOutlined } from '@ant-design/icons';
import styles from './MainPage.css'
import ParticleBG from './ParticleBG'

const MainPage = (props) => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [joinError, setJoinError] = useState({ visible: false, text: '' })
  const [creationError, setCreationError] = useState({ visible: false, text: '' }) // control the visilibity and text of error message 

  const joinRoom = () => {
    if (!username) {
      setJoinError({
        visible: true,
        text: 'Username can not be empty',
      })
    }
    else if (!roomId) {
      setJoinError({
        visible: true,
        text: 'Room Id can not be empty'
      })
    }
    else {
      axios.get(`/api/room/${roomId}`)
        .then(res => {
          if (res.data) routeToRoom(res.data)
        })
        .catch(e => {
          setJoinError({ visible: true, text: 'Room does not exist' })
        })
    }

  }

  const routeToRoom = (roomData) => {
    props.history.push({ pathname: "/room/" + roomData.roomId, state: { username, roomData } });
  }

  const createRoom = () => {
    if (!username) {
      setCreationError({
        visible: true,
        text: 'Username can not be empty'
      })
    }
    else {
      axios
        .post('/api/room/create', { owner: username })
        .then((res) => {
          routeToRoom(res.data)
        })
        .catch(() => {
          setCreationError({
            visible: true,
            text: 'Someething went wrong... Please try again later'
          })
        })
    }
  }

  return (
    <div id='main-page'>
      <GithubOutlined id='githubIcon'
        onClick={() => window.open('https://github.com/JANICECY/react-express-chat-room')}
      />

      <div id='create-room'>
        <label>
          Create a new room
          <span>🤓</span>
        </label>
        <input value={username} placeholder='Username' onChange={e => setUsername(e.target.value)} />

        <button onClick={createRoom}>Create</button>
        <span className='error-message' style={{ display: creationError.visible ? "" : "none" }}>{creationError.text}</span>
      </div>
      <div id='join-room'>
        <ParticleBG />
        <label>
          Join a private room
          <span>🧐</span>
        </label>
        <input value={roomId} placeholder='Room Id' onChange={e => setRoomId(e.target.value)} />
        <input value={username} placeholder='Username' onChange={e => setUsername(e.target.value)} />
        <button onClick={joinRoom}>Join</button>
        <span className='error-message' style={{ display: joinError.visible ? "" : "none" }}>{joinError.text}</span>

      </div>
    </div>
  )
}

export default MainPage