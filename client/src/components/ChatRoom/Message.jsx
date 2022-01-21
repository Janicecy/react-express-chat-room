import React from 'react';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { MESSAGE_TYPES } from '../../store/room';

const useStyles = makeStyles(theme => ({
  userEventMessage: {
    fontSize: '0.8em',
    textAlign: 'center',
    opacity: 0.8,
    margin: '5px auto'
  },
  username: {
    color: '#60a3bc', fontWeight: 'bold',
  },
  message: {
    backgroundColor: '#262d31',
    borderRadius: 8,
    marginTop: 10,
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '5px 10px',
    alignSelf: 'flex-start',
    maxWidth: '50%',
    wordBreak: 'break-word'
  },
  author: {
    color: '#acacac',
    fontSize: 12,
    margin: '4px 0'
  },
  time: {
    color: ' #8b8c8b',
    alignSelf: 'flex-end',
    marginTop: 5,
    fontSize: '0.5em'
  },
  sender: {
    backgroundColor: '#056162',
    alignSelf: 'flex-end'
  },
  imgMessage: {
    width: '100%',
  }
}))

function Message({ message, isSender }) {
  const classes = useStyles()
  const { content, author, createdAt } = message

  const getContent = () => {
    switch (message.type) {
      case MESSAGE_TYPES.TEXT:
        return (<div className={classes.text}>{content}</div>)
      case MESSAGE_TYPES.IMAGE:
        return (<img alt='message' className={classes.imgMessage} src={content} />)
      default:
        return null
    }
  }
  return (
    <div className={classNames(classes.message, isSender && classes.sender)}  >
      <div className={classes.author}>~{author}</div>
      {getContent()}
      <div className={classes.time}>{new Date(createdAt).toLocaleDateString()}</div>
    </div>
  )
}

export default Message 