const express = require('express')
require('./db/mongoose')
const morgan = require('morgan')
const bcrypt = require('bcryptjs')
const multer  = require('multer')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')

const userRouter = require('./routers/user')
const postRouter = require('./routers/post')

const app = express()
const upload = multer({ dest: 'uploads/' })
const port = process.env.PORT || 3000

app.use(express.json())
app.use(morgan('dev'))
app.use(userRouter)
app.use(postRouter)

app.listen(port, () => {
  console.log('Server is running now................ ' + port);
})