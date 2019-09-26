const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const receiverSchema = new mongoose.Schema({

})

const Receiver = mongoose.model('Receiver', receiverSchema)

module.exports = Receiver