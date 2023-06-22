const Message = require('./message')
const Room = require('./room')

Room.hasMany(Message)
Message.belongsTo(Room)

module.exports = {
  Message,
  Room
}