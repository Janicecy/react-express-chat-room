import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles';
import Message from './Message';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'black',
    overflow: 'auto',
    height: '90%',
    color: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column'
  },
  userEventMessage: {
    fontSize: '0.8em',
    textAlign: 'center',
    opacity: 0.8,
    margin: '5px auto'
  },
  author: {
    color: '#60a3bc', 
    fontWeight: 'bold',
  },
}))


const Messages = (props) => {
  const classes = useStyles()
  const { messages, currentUser } = props

  const UserActionMessage = ({ author, type }) => (
    <div className={classes.userEventMessage}>
      <span className={classes.author}>
        {author}
      </span>
      {type === 'USER_JOIN' ? ' just joined the room 👋' : ' just left the room'}
    </div>
  )

  return (
    <div className={classes.root}>
      {messages.map(message => {
        const { author, type } = message
        return ['USER_LEAVE', 'USER_JOIN'].includes(type)
          ? (<UserActionMessage author={author} type={type} />)
          : (<Message isSender={author === currentUser} message={message} />)
      })}
    </div>
  );
}

Messages.propTypes = {
  messages: PropTypes.array,
  currentUser: PropTypes.string
}

export default Messages;
