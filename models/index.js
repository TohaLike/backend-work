require("dotenv").config()
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: process.env.MYSQL_DIALECT,
})

const db = {};
db.sequelize = sequelize
db.models = {}
db.models.User = require("./user-schema")(sequelize, Sequelize.DataTypes)
db.models.Token = require("./token-schema")(sequelize, Sequelize.DataTypes)

module.exports = db