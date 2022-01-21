import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles'
import socket from '../../socket';
import { useDispatch, useSelector } from 'react-redux';
import Input from './Input';
import Messages from './Messages';
import UserList from './UserList';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { setRoom } from '../../store/room';
import GroupIcon from '@mui/icons-material/Group';
import { nanoid } from 'nanoid'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '70vw',
    margin: '2vh auto',
    boxShadow: "0 1px 2px -2px rgba(0,0,0,.16), 0 3px 6px 0 rgba(0,0,0,.12), 0 5px 12px 4px rgba(0,0,0,.09)",
    height: '96vh',
    backgroundColor: 'var(--chat-room-bg)',
    [theme.breakpoints.down("sm")]: {
      width: '100vw',
      position: 'fixed',
      top: '6vh',
      height: '94vh',
      margin: 0,
    },
  },
  chat: {
    flex: '0 0 75%',
    [theme.breakpoints.down("sm")]: {
      flex: '0 0 100%',
      margin: 0,
    },
  },
  mobileHeader: {
    position: 'fixed',
    top: 0,
    width: '100%',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#2a2f32',
    alignItems: 'center',
    height: '6vh',
    color: '#fff',
    [theme.breakpoints.up("sm")]: {
      display: 'none',
    },
  }
}))

const Room = (props) => {
  const dispatch = useDispatch()
  const room = useSelector(state => state.room)
  const { username } = useSelector(state => state.user)
  const { messages } = room
  const { roomId } = useParams()

  const [userListVisible, setUserListVisible] = useState(window.innerWidth > 600);
  const toggleUserList = () => setUserListVisible(!userListVisible)
  const classes = useStyles(toggleUserList)

  const fetchRoom = () => {
    axios.get(`/api/rooms/${roomId}`)
      .then(res => {
        const { room } = res.data
        dispatch(setRoom(room))
        socket.emit('join_room', username, room.id)
      })
      .catch(e => props.history.push('/'))
  }

  useEffect(() => {
    fetchRoom()
  }, []);

  useEffect(() => {
    if (!username || !roomId) {
      return props.history.push('/')
    }
  }, [username, roomId]);

  const handleNewMessage = (message) => {
    socket.emit('new_message', {
      ...message,
      createdAt: Date.now(),
      author: username,
      id: nanoid()
    }, room.id)
  }

  return (
    <div className={classes.root}>
      <div className={classes.mobileHeader}>
        <GroupIcon onClick={() => setUserListVisible(!userListVisible)} />
      </div>
      {userListVisible && <UserList room={room} currentUser={username} />}
      <div className={classes.chat}>
        <Messages messages={messages} currentUser={username} />
        <Input onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
}

export default Room;
