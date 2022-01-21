import React, { useState } from 'react';
import axios from 'axios';
import { GithubOutlined } from '@ant-design/icons';
import ParticleBG from './ParticleBG'
import { makeStyles } from '@mui/styles'
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/user';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    color: '#fff',
    fontWeight: 'bold',
    width: '100vw',
    [theme.breakpoints.down("sm")]: {
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '0 1 50%',
    justifyContent: 'center',
    fontSize: 30,
    [theme.breakpoints.down("sm")]: {
      flex: '0 1 100%',
      height: '50vh',
      fontSize: 20,
    },
    "& > *": {
      marginTop: 20
    }
  },
  joinRoom: {
    backgroundColor: 'black',
    boxShadow: '10px 0px 40px white'
  },
  errorMessage: {
    color: '#ff0033',
    fontWeight: 'bold',
    margin: '10px auto',
    fontSize: '1rem'
  }
}))

const MainPage = (props) => {
  const classes = useStyles()
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [joinError, setJoinError] = useState("")
  const [creationError, setCreationError] = useState("")
  const dispatch = useDispatch()

  const joinRoom = async () => {
    if (username === "" || roomId === '') {
      return setJoinError('room id or username can not be empty')
    }
    try {
      const { data: { room } } = await axios.get(`/api/rooms/${roomId}`)
      if (room.currentUsers.includes(username)) {
        setJoinError('Username has been taken.')
      } else {
        dispatch(setUser({ username }))
        props.history.push(`/room/${room.id}`)
      }
    } catch (e) {
      setJoinError(e.response.data.error)
    }
  }

  const createRoom = async () => {
    if (!username) {
      return setCreationError('Username can not be empty')
    }
    try {
      const { data: { room } } = await axios.post(`/api/rooms`, { owner: username })
      dispatch(setUser({ username }))
      props.history.push(`/room/${room.id}`)
    } catch (e) {
      setCreationError(e.response.data.error)
    }
  }

  return (
    <div className={classes.root}>
      <GithubOutlined className='githubIcon'
        onClick={() => window.open('https://github.com/JANICECY/react-express-chat-room')}
      />
      <div className={classes.section}>
        <label>
          Create a new room
          <span>🤓</span>
        </label>
        <input
          value={username}
          placeholder='Username'
          onChange={e => setUsername(e.target.value)}
        />
        <button onClick={createRoom}>Create</button>
        <span className={classes.errorMessage} >
          {creationError}
        </span>
      </div>
      <div className={classNames(classes.section, classes.joinRoom)}>
        <ParticleBG />
        <label>
          Join a private room
          <span>🧐</span>
        </label>
        <input
          value={roomId}
          placeholder='Room ID'
          onChange={e => setRoomId(e.target.value)}
        />
        <input
          value={username}
          placeholder='Username'
          onChange={e => setUsername(e.target.value)}
        />
        <button onClick={joinRoom}>Join</button>
        <span className={classes.errorMessage}>
          {joinError}
        </span>
      </div>
    </div>
  )
}

export default MainPage