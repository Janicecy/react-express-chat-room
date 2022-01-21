import { makeStyles } from '@mui/styles';
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PropTypes from 'prop-types'
import socket from '../../socket';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/user';

const useStyles = makeStyles(theme => ({
  root: {
    background: '#16161a',
    flex: '0 0 25%',
    marginRight: 5,
    position: 'relative',
    [theme.breakpoints.down("sm")]: {
      flex: '0 0 100%',
      margin: 0,
      height: '94vh'
    },
  },
  title: {
    textAlign: 'center',
    color: '#fff'
  },
  owner: {
    color: '#048f81',
    border: '1px solid#048f81',
    borderRadius: 3,
    height: 'auto',
    padding: '2px 7px',
    fontSize: 12,
  },
  user: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '5px 10px',
    borderBottom: ' 1px solid #293136',
    color: '#fff',
    alignItems: 'center'
  },

  avatar: {
    flex: '0 0 20%',
    fontSize: 25
  },
  username: {
    flex: '0 0 20%'
  },
  logout: {
    color: '#60a3bc',
    cursor: 'pointer',
    position: 'absolute',
    bottom: 30,
    right: 30
  }
}))

export default function UserList({ room }) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const logout = () => {
    socket.emit('leave_room')
    dispatch(setUser({}))
  }

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>
        Chat Room - <span style={{ color: 'lightblue' }}>{room.id}</span>
      </h2>
      {room.currentUsers.map((username) => (
        <div className={classes.user} key={username}>
          <AccountCircleIcon fontSize='large' className={classes.avatar} />
          <span className={classes.username}>{username}</span>
          <span style={{ opacity: username !== room.owner && 0 }} className={classes.owner}>Owner</span>
        </div>
      ))}

      <div onClick={logout} className={classes.logout}>Logout</div>
    </div>
  )
}

UserList.propTypes = {
  room: PropTypes.object,
  currentUser: PropTypes.string
}