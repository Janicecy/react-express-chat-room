import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PropTypes from 'prop-types'
import { getBase64 } from '../../utils';
import { MESSAGE_TYPES } from '../../store/room';

const useStyles = makeStyles(theme => ({
  root: {
    height: '10%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--panel-bg)',
    justifyContent: 'space-between',
    padding: '0 5%',
    width: '100%'
  },
  uploadIcon: {
    color: 'grey',
    fontSize: '2rem'
  }
}))

const Input = (props) => {
  const classes = useStyles()
  const [inputText, setInputText] = useState('');

  const clearInput = () => setInputText('')

  const uploadImage = async (e) => {
    const res = await getBase64(e.target.files[0])
    props.onNewMessage({ type: MESSAGE_TYPES.IMAGE, content: res })
  }

  const sendText = () => {
    if (inputText !== '') {
      props.onNewMessage({ type: MESSAGE_TYPES.TEXT, content: inputText })
      clearInput()
    }
  }

  return (
    <div className={classes.root}>
      <div>
        <label for='upload'>
          <InsertPhotoIcon className={classes.uploadIcon} />
        </label>
        <input
          type="file"
          id='upload'
          onChange={uploadImage}
          accept="image/png, image/jpeg" />
      </div>
      <input type='textarea'
        className={classes.input}
        wrap="soft"
        placeholder='Type a message'
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        style={{ flex: '0 1 50%' }}
        onKeyUp={(event) => {
          if (event.key === 'Enter') sendText();
        }}
      />
      <button value='Send' onClick={sendText} style={{ flex: '0 1 20%' }}>Send</button>
    </div>
  );
}

Input.propTypes = {
  onNewMessage: PropTypes.func
}

export default Input;
