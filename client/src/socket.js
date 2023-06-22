import socketIOClient from 'socket.io-client'
import { USER_JOIN, USER_LEAVE, NEW_MESSAGE, userJoin, userLeave, newMessage } from './store/room'
import store from "./store";

const socket = socketIOClient('http://localhost:5000')

socket.on("chat_room", (data) => {
  switch (data.eventType) {
    case USER_JOIN:
      return store.dispatch(userJoin(data.payload))
    case NEW_MESSAGE:
      return store.dispatch(newMessage(data.payload))
    case USER_LEAVE:
      return store.dispatch(userLeave(data.payload))
    default:
      break;
  }
})

export default socket