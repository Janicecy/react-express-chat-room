import React, { useState } from 'react';
import axios from 'axios';
import useWindowSize from './useWindowSize';
import styles from './MainPage.css'
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
      <div id='join-room'>
        <span>Join an existing room</span>
        <input value={roomId} placeholder='room id' onChange={e => setRoomId(e.target.value)} />
        <input value={username} placeholder='username' onChange={e => setUsername(e.target.value)} />
        <span className='error-message' style={{ display: roomNotExist ? "" : "none" }}>Room doesn't exit!</span>
        <button onClick={joinRoom}>Join</button>

      </div>
      <div id='create-room'>
        <span>Create a new room</span>
        <input value={username} placeholder='username' onChange={e => setUsername(e.target.value)} />
        <span className='error-message' style={{ display: roomIsTaken ? "" : "none" }}>Room id has been taken!</span>
        <button onClick={createRoom}>Create</button>
      </div>
    </div>
  )
}

export default MainPage