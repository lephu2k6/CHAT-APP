const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { app , server } = require("./config/socket");
dotenv.config()

// Kết Nối database
const connectDB = require('./config/db')



// const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use(cookieParser())
app.use(cors(
  {origin: 'http://localhost:5173',
  credentials : true}
))


// route
app.use('/api/auth' , require('./routes/auth.route'))
app.use('/api/messages' , require('./routes/message.route'))

server.listen(process.env.PORT, () => {
  connectDB()
  console.log(`kết nối thành công tại cổng${process.env.PORT}!!!`)
})