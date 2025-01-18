require('dotenv').config()
const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyParser = require("body-parser")
const routers = require("./router/index.js")
const db = require("./models")
const errorMiddleware = require("./middlewares/error-middleware.js");
const session = require('express-session');

const app = express()
const PORT = process.env.PORT || 4000

app.use(session({
  secret: 'your secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(
  {
    credentials: true,
    origin: process.env.CLIENT_URL
  }
));

app.use("/api", routers)

app.use(errorMiddleware)

async function main() {
  try {
    await db.sequelize.sync()
    app.listen(PORT, (error) => console.log(`Server has been started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

main()