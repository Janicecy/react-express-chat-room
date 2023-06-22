const { Room, Message } = require('../db/models')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdef', 6)

async function leaveRoom(roomId, username) {
  const room = await Room.findRoomById(roomId)
  const currentUsers = room.toJSON().currentUsers.filter(name => name !== username)
  if (currentUsers.length === 0) {
    // clean up unused room and its associated messages 
    await Message.destroy({
      where: {
        roomId
      }
    })
    await room.destroy()
  } else {
    room.currentUsers = currentUsers
    await room.save()
  }
}

async function joinRoom(roomId, username) {
  const room = await Room.findRoomById(roomId)
  if (room) {
    const roomJSON = room.toJSON()
    room.currentUsers = [...roomJSON.currentUsers, username]
    await room.save()
  }
}

async function addNewMessage(roomId, message) {
  await Message.create({
    ...message,
    roomId
  })
}

const createRoom = async (req, res) => {
  const { owner } = req.body
  if (!owner) {
    return res.status(400).json({ error: 'username is not provided' })
  }
  const id = nanoid()
  const room = await Room.create({ owner, id })
  res.json(room)
}

const getRoom = async (req, res) => {
  const room = await Room.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Message
      }
    ]
  })
  if (!room) return res.status(401).json({ error: 'Room with the id does not exist.' })
  res.json(room.toJSON())
}

module.exports = {
  createRoom,
  getRoom,
  leaveRoom,
  joinRoom,
  addNewMessage,
}