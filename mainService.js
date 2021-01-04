/**
 * This class defines the basic functionalities of chat room, like join, create and leave chat room 
 */
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

  // return true if user is added to room successfully false otherwise 
  joinRoom(roomId, username) {
    const room = this.existingRooms[roomId];
    if (room) {
      if (room.currentUsers.includes(username)) return false;
      room.currentUsers.push(username)
      return true;
    }
    return false;
  }

  // generates a string consisting of n random chars 
  static generateKey(n) {
    let result = '';
    for (let i = 0; i < n; i++)
      result += String.fromCharCode(64 + Math.floor((Math.random() * 23) + 1));
    return result;
  }

  leaveRoom(roomId, username) {
    const room = this.existingRooms[roomId];
    if (room) {
      const index = room.currentUsers.indexOf(username);
      if (~index) {
        room.currentUsers.splice(index, 1);
        // delete room if no users 
        if (room.currentUsers.length === 0) {
          delete this.existingRooms[roomId];
        }
        return true
      }
      return false;
    }
    return false;
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

  getRoom(roomId, username) {
    const room = this.existingRooms[roomId]
    if (!room) throw new Error("Room does not exist");
    if (room.currentUsers.includes(username)) throw new Error('Username was taken');
    return this.existingRooms[roomId];
  }
}

const chatRoomManager = new ChatRoomManager()


class Socket {
  setSocket(io) {
    this.io = io;
    io.on('connection', (socket) => {
      const { roomId, username } = socket.handshake.query
      // subscribe to new user join event 
      socket.on('join', (username) => {
        console.log(`user: ${username} joined the room: ${roomId}`);
        if (chatRoomManager.joinRoom(roomId, username)) {
          socket.join(roomId);
          this.io.to(roomId).emit('chat_room', {
            eventType: 'USER_JOIN',
            data: username
          })
        }
      })

      socket.on('disconnect', () => {
        console.log(`user: ${username} left the room: ${roomId}`);
        if (chatRoomManager.leaveRoom(roomId, username)) {
          this.io.to(roomId).emit('chat_room', {
            eventType: 'USER_LEAVE',
            data: username
          })
        }
      })

      socket.on('message', (newMessage) => {
        console.log('receive new message...');
        try {
          this.io.to(roomId).emit('chat_room', {
            eventType: 'NEW_MESSAGE',
            data: newMessage
          })
        }
        catch (e) {
          console.log("emitting message failed: " + e.message)
        }
      })
    })

  }
}

const socketService = new Socket();

module.exports = { socket: socketService, chatRoomService: chatRoomManager }