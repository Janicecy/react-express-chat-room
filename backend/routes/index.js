var express = require('express');
const { route } = require('../app');
var router = express.Router();
const { chatRoomService } = require('../mainService')
router.post('/join-room/', (req, res) => {
  try {
    chatRoomService.joinRoom(req.body.roomId, req.body.username)
    res.sendStatus(200)
  }
  catch (e) {
    res.status(400).send(e.message)
  }
})

router.post('/message/add', (req, res) => {
  try {
    chatRoomService.addMessage(req.body.data)
    res.sendStatus(200)
  }
  catch (e) {
    res.status(400).send(e.message)
  }
})

router.post("/room/create", (req, res) => {
  try {
    const roomId = chatRoomService.createRoom(req.body.owner)
    res.status(200).send(roomId)
  }
  catch (e) {
    res.status(400).send(e.message)
  }
})


router.get('/room/:roomId', (req, res) => {
  try {
    const roomInfo = chatRoomService.getRoom(req.params.roomId)
    res.status(200).send(roomInfo)
  }
  catch (e) {
    res.status(400).send(e.message)
  }

})

module.exports = router;
