// Main Services 
const EVENT_TYPE = {
  NEW_USER: 'NEW_USER',
  NEW_MESSAGE: 'NEW_MESSAGE'
}

const CHAT_ROOM_EVENT = {
  JON: 'JON',
  LEAVE: 'LEAVE',
}

class ChatRoomManager {
  constructor() {
    this.existingRooms = {
      'public': {
        owner: 'Ying Chen',
        messages: [
          {
            type: "TEXT",
            content: "heelo",
            time: 'July 19, 2020',
            author: 'yingch',
          },
        ],
        currentUsers: ['Ying Chen']
      }
    }
  }

  joinRoom(roomId, username) {
    if (this.existingRooms[roomId]) {
      this.existingRooms[roomId].currentUsers.push(username)
    }
    else throw new Error("Room doesn't exist!");
  }

  // generates a string consisting of n random chars 
  static generateKey(n) {
    let result = '';
    for (let i = 0; i < n; i++)
      result += String.fromCharCode(64 + Math.floor((Math.random() * 23) + 1));
    return result;
  }

  leaveRoom(roomId, username) {
    if (this.existingRooms[roomId]) {
      const index = this.existingRooms[roomId].currentUsers.indexOf(username);
      if (~index)
        this.existingRooms.splice(index, 1);
    }
  }

  createRoom(owner) {
    const room = {
      owner: owner,
      currentUsers: [],
      messages: []
    }
    let roomId = ChatRoomManager.generateKey(4);

    while (this.existingRooms[roomId])
      roomId = ChatRoomManager.generateKey(4);

    room.roomId = roomId;
    this.existingRooms[roomId] = room;
    return room;
  }

  getRoom(roomId) {
    if (!this.existingRooms[roomId]) throw new Error("Room doesn't exist!");
    return this.existingRooms[roomId];
  }

  addMessage(data) {
    const { roomId, message } = data;
    if (!this.existingRooms[roomId]) throw new Error('Room does not exist!')
    this.existingRooms[roomId].messages.push(message);
    socketService.emitToChatRoom(
      roomId,
      { eventType: EVENT_TYPE.NEW_MESSAGE, data: message }
    )
  }
}

const chatRoomManager = new ChatRoomManager()


class Socket {
  setSocket(io) {
    this.io = io;
    io.on('connection', (socket) => {
      const roomId = socket.handshake.query.roomId;

      // subscribe to new user join event 
      socket.on('join', (username) => {
        console.log(`user: ${username} joined the room: ${roomId}`);
        chatRoomManager.joinRoom(roomId, username)
        socket.join(roomId);
        this.io.to(roomId).emit('chat_room', {
          eventType: 'USER_JOIN',
          data: username
        })
      })

      socket.on('disconnect', (username) => {
        chatRoomManager.leaveRoom(roomId, username)
        this.io.to(roomId).emit({
          eventType: 'USER_LEAVE',
          data: username
        })
      })

      socket.on('message', (newMessage) => {
        console.log('receive new message...', newMessage);
        this.io.to(roomId).emit('chat_room', {
          eventType: 'NEW_MESSAGE',
          data: newMessage
        })
      })
    })

  }
}

const socketService = new Socket();

module.exports = { socket: socketService, chatRoomService: chatRoomManager }