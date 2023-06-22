const Sequelize = require("sequelize");

// Connect to pg db by creating a Sequelize instance 
const db = new Sequelize(process.env.DATABASE_URL || "postgres://postgres:1234qwer@localhost:5432/messenger", {
  logging: false
});

module.exports = db;
