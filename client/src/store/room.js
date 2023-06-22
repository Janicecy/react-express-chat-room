export const SET_ROOM = 'SET_ROOM'
export const USER_JOIN = 'USER_JOIN'
export const USER_LEAVE = 'USER_LEAVE'
export const NEW_MESSAGE = 'NEW_MESSAGE'

export const MESSAGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  USER_JOIN: 'USER_JOIN',
  USER_LEAVE: 'USER_LEAVE'
}

export const setRoom = (room) => {
  return {
    type: SET_ROOM,
    room
  }
}

export const userJoin = (sender) => {
  return {
    type: USER_JOIN,
    sender
  }
}

export const userLeave = (sender) => {
  return {
    type: USER_LEAVE,
    sender
  }
}

export const newMessage = (message) => {
  return {
    type: NEW_MESSAGE,
    message
  }
}

const initialState = {
  messages: [],
  currentUsers: []
}
const reducer = (state = initialState, action) => {
  const { currentUsers, messages } = state
  switch (action.type) {
    case SET_ROOM:
      return action.room
    case USER_JOIN:
      return {
        ...state,
        messages: [...messages, { type: MESSAGE_TYPES.USER_JOIN, sender: action.sender }],
        currentUsers: [...currentUsers, action.sender]
      }
    case USER_LEAVE:
      return {
        ...state,
        messages: [...messages, { type: MESSAGE_TYPES.USER_LEAVE, sender: action.sender }],
        currentUsers: currentUsers.filter(name => name !== action.sender)
      }
    case NEW_MESSAGE:
      return {
        ...state,
        messages: [...messages, action.message]
      }
    default:
      return state
  }
}

export default reducer 