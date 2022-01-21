const activeRooms = require('./activeRooms')

class Socket {
  setSocket(io) {
    this.io = io;
    let _roomId = null
    let _username = null
    io.on('connection', (socket) => {
      socket.on('join_room', (username, roomId) => {
        console.log(`user: ${username} joined the room: ${roomId}`);
        socket.join(roomId);

        _roomId = roomId
        _username = username

        const room = activeRooms.get(roomId)
        room.currentUsers.push(username)
        activeRooms.set(roomId, { ...room })

        this.io.to(roomId).emit('chat_room', {
          eventType: 'USER_JOIN',
          payload: username
        })
      })

      socket.on('leave_room', () => {
        if (!_roomId) return
        const room = activeRooms.get(_roomId)
        room.currentUsers = room.currentUsers.filter(name => name !== _username)
        activeRooms.set(_roomId, { ...room })

        this.io.to(_roomId).emit('chat_room', {
          eventType: 'USER_LEAVE',
          payload: _username
        })
      })

      socket.on('disconnect', () => {
        console.log('socket disconnected');
        if (!_roomId) return
        const room = activeRooms.get(_roomId)
        room.currentUsers = room.currentUsers.filter(name => name !== _username)
        activeRooms.set(_roomId, { ...room })

        this.io.to(_roomId).emit('chat_room', {
          eventType: 'USER_LEAVE',
          payload: _username
        })
      })

      socket.on('new_message', (message, roomId) => {
        const room = activeRooms.get(roomId)
        room.messages = [...room.messages, message]
        activeRooms.set(roomId, { ...room })

        this.io.to(roomId).emit('chat_room', {
          eventType: 'NEW_MESSAGE',
          payload: message
        })
      })
    })
  }
}

module.exports = new Socket()