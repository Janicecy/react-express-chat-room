const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  currentUsers: [{ type: String }]
})
const Room = mongoose.model("Room", roomSchema, "Rooms");

module.exports = Room