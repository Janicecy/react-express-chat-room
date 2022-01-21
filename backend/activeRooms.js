const activeRooms = new Map()
const publicRoom = {
  owner: 'Janice',
  messages: [
    {
      type: "TEXT",
      content: "hello",
      time: 'July 19, 2020',
      author: 'Janice',
    },
  ],
  id: 'public',
  currentUsers: []
}

activeRooms.set('public', publicRoom)

function leaveRoom(roomId, username) {
  const room = activeRooms.get(roomId)
  room.currentUsers = room.currentUsers.filter(name => name !== username)
  if (room.currentUsers.length === 0) {
    activeRooms.delete(roomId)
  } else {
    activeRooms.set(roomId, { ...room })
  }
}

function joinRoom(roomId, username) {
  const room = activeRooms.get(roomId)
  room.currentUsers = [...room.currentUsers, username]
  activeRooms.set(roomId, { ...room })
}

function addNewMessage(roomId, message) {
  const room = activeRooms.get(roomId)
  room.messages = [...room.messages, message]
  activeRooms.set(roomId, { ...room })
}

module.exports = {
  leaveRoom,
  joinRoom,
  addNewMessage,
  activeRooms
}