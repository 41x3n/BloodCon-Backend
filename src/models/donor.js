const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const donorSchema = new mongoose.Schema({

})

const Donor = mongoose.model('Donor', donorSchema)

module.exports = Donor