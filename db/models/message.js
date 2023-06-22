const db = require('../db')
const { DataTypes } = require("sequelize");

const Message = db.define("message", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  }
})

module.exports = Message;
