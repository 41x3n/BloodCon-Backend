const express = require('express')
require('./db/mongoose')
const morgan = require('morgan')
const bcrypt = require('bcryptjs')
const multer  = require('multer')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')
var cors = require('cors')

const donorRouter = require('./routers/donor')
const receiverRouter = require('./routers/receiver')
const postRouter = require('./routers/post')

const app = express()
app.use(cors())
const upload = multer({ dest: 'uploads/' })
const port = process.env.PORT

app.use(express.json())
app.use(morgan('dev'))
app.use(donorRouter)
app.use(receiverRouter)
app.use(postRouter)

app.listen(port, () => {
  console.log('Server is running now................ ' + port);
})
