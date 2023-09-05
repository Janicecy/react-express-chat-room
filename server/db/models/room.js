const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  currentUsers: [{ type: String }]
})

roomSchema.statics.findById = function(id) {
  return this.findOne({ id })
}

const Room = mongoose.model("Room", roomSchema);
module.exports = Room