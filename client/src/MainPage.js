import React, { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';
import { ENDPOINT } from './constants.js';
import bg_img from './bg_img.jpg'
const MainPage = (props) => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [roomNotExist, setRoomNotExist] = useState(false);
    const [roomIsTaken, setRoomIsTaken] = useState(false)

    const joinRoom = () => {
        if (!roomId || !username) {
            return;
        }
        axios.post("/api/join-room/", { roomId, username })
        .then((res) => {
            routeToRoom(roomId)
        })
        .catch(() => {
            setRoomNotExist(true);
        })
    }

    const routeToRoom = (roomId)=> {
        props.history.push( {pathname: "/room/" + roomId, state: { username }});
    }

    const createRoom = () => {
        if (!username) return;
        axios.post('/api/create-room', { owner: username })
        .then((res) => {
            routeToRoom(res.data)
        })
        .catch(() => {
            setRoomIsTaken(true);
        })
    }

    return (
        <div id='main-page'>
            <script src="particles.js"></script>
            <div id="particles-js"></div>
            
            <div id='main-page-left'>
                <span>Join an existing room: </span>
                <input value={roomId} placeholder='room id' onChange={e => setRoomId(e.target.value)}/>
                <input value={username} placeholder='username' onChange={e => setUsername(e.target.value)}/>
                <span className='error-message' style={ { display: roomNotExist ? "" : "none" }}>Room doesn't exit!</span>
                <button onClick={joinRoom}>Join</button>

            </div>
            <div id='main-page-right'>
                <span>Create a new room</span>
                <input value={username} placeholder='username' onChange={e => setUsername(e.target.value)}/>
                <span className='error-message' style={ { display: roomIsTaken ? "" : "none" }}>Room id has been taken!</span>
                <button onClick={createRoom}>Create</button>
            </div>
        </div>
    )
}

export default MainPage