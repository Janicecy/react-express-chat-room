const db = require('../db')
const Message = require('./message')
const { DataTypes } = require("sequelize");

const Room = db.define('room', {
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  currentUsers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
})

Room.findRoomById = async (id) => {
  const room = await Room.findOne({
    where: { id }
  })
  return room 
}

module.exports = Room