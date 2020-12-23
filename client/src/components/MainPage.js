import React, { useState } from 'react';
import axios from 'axios';
import useWindowSize from './useWindowSize';
import { GithubOutlined } from '@ant-design/icons';
import styles from './MainPage.css'
import ParticleBG from './ParticleBG'
const MainPage = (props) => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [roomNotExist, setRoomNotExist] = useState(false);
  const [roomIsTaken, setRoomIsTaken] = useState(false)

  const { width: windowWidth } = useWindowSize
  const joinRoom = () => {
    if (!roomId || !username) {
      return;
    }
    axios.get(`/api/room/${roomId}`)
      .then(res => {
        if (res.data) routeToRoom(res.data)
      })
      .catch(e => {
        // room does not exist 
      })
  }

  const routeToRoom = (roomData) => {
    props.history.push({ pathname: "/room/" + roomData.roomId, state: { username, roomData } });
  }

  const createRoom = () => {
    if (!username) return;
    axios.post('/api/room/create', { owner: username })
      .then((res) => {
        routeToRoom(res.data)
      })
      .catch(() => {
        setRoomIsTaken(true);
      })
  }

  return (
    <div id='main-page'>
      <GithubOutlined id='githubIcon'
        onClick={() => window.open('https://github.com/JANICECY/react-express-chat-room')}
      />

<div id='create-room'>
        <label style={{ fontSize: '2rem' }}>
          Create a new room
          <span>🤓</span>
        </label>
        <input value={username} placeholder='Username' onChange={e => setUsername(e.target.value)} />
        <span className='error-message' style={{ display: roomIsTaken ? "" : "none" }}>Room id has been taken!</span>
        <button onClick={createRoom}>Create</button>
      </div>
      <div id='join-room'>
        <ParticleBG />
        <label style={{ fontSize: '2rem' }}>
          Join a private room
          <span>🧐</span>
        </label>
        <input value={roomId} placeholder='Room Id' onChange={e => setRoomId(e.target.value)} />
        <input value={username} placeholder='Username' onChange={e => setUsername(e.target.value)} />
        <span className='error-message' style={{ display: roomNotExist ? "" : "none" }}>Room doesn't exit!</span>
        <button onClick={joinRoom}>Join</button>

      </div>
    </div>
  )
}

export default MainPage