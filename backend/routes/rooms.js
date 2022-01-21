const router = require('express').Router();
const activeRooms = require('../activeRooms')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdef', 6)

router.post('/', (req, res) => {
  const { owner } = req.body
  if (!owner) {
    return res.status(400).json({ error: 'username is not provided' })
  }
  const id = nanoid()
  const room = {
    owner,
    currentUsers: [],
    messages: [],
    id
  }
  activeRooms.set(id, room)
  res.json({ room })
})

router.get('/:id', (req, res) => {
  const room = activeRooms.get(req.params.id)
  if (!room) return res.status(401).json({ error: 'Room with the id does not exist.' })
  res.json({ room })
})

router.put('/:id', (req, res) => {
  activeRooms.set(req.params.id, req.body.room)
  res.sendStatus(200)
})

router.patch('/:id', (req, res) => {
  const oldRoom = activeRooms.get(req.params.id)
  if (!oldRoom) return res.status(401).json({ error: 'Room with the id does not exist.' })
  const room = { ...oldRoom, ...req.body }
  activeRooms.set(req.params.id, room)
  res.json({ room })
})

module.exports = router


