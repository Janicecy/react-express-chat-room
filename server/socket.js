const { joinRoom, leaveRoom, addNewMessage } = require('./controllers/room')

class Socket {
  setSocket(io) {
    this.io = io;
    io.on('connection', (socket) => {
      let _roomId = null
      let _username = null
      socket.on('join_room', (username, roomId) => {
        if (!username) return
        console.log(`user: ${username} joined the room: ${roomId}`);
        socket.join(roomId);
        _roomId = roomId
        _username = username
        joinRoom(roomId, username)

        this.io.to(roomId).emit('chat_room', {
          eventType: 'USER_JOIN',
          payload: username
        })
      })

      socket.on('leave_room', () => {
        leaveRoom(_roomId, _username)
        this.io.to(_roomId).emit('chat_room', {
          eventType: 'USER_LEAVE',
          payload: _username
        })
        _roomId = null
      })

      socket.on('disconnect', () => {
        if (!_roomId) return
        leaveRoom(_roomId, _username)
        this.io.to(_roomId).emit('chat_room', {
          eventType: 'USER_LEAVE',
          payload: _username
        })

        _roomId = null
        _username = null
      })

      socket.on('new_message', (message, roomId) => {
        addNewMessage(roomId, message)
        this.io.to(roomId).emit('chat_room', {
          eventType: 'NEW_MESSAGE',
          payload: message
        })
      })
    })
  }
}

module.exports = new Socket()