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
module.exports = activeRooms