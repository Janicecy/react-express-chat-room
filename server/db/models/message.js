const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: String, required: true },
  createdAt: { type: Number, required: true },
  roomId: { type: String, required: true },
})

const Message = mongoose.model("Message", messageSchema, "Messages");

module.exports = Message;