const { joinRoom, leaveRoom, addNewMessage } = require('./activeRooms')

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
      })

      socket.on('disconnect', () => {
        if (!_roomId) return
        console.log('socket disconnected');
        leaveRoom(_roomId, _username)
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