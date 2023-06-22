const router = require('express').Router();
const { createRoom, getRoom } = require('../controllers/room')

router.post('/', createRoom)
router.get('/:id', getRoom)

module.exports = router


