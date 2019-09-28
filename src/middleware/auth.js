const jwt = require('jsonwebtoken')
const Donor = require('../models/donor')
const Receiver = require('../models/receiver')

// Authenticating Donor Account
const dAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const donor = await Donor.findOne({ _id: decoded._id, 'tokens.token': token })
    if(!donor) {
      throw new Error()
    }
    req.token = token
    req.donor = donor
    next()
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.'})
  }
}

// Authenticating Receiver Account
const rAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const receiver = await Receiver.findOne({ _id: decoded._id, 'tokens.token': token })
    if(!receiver) {
      throw new Error()
    }
    req.token = token
    req.receiver = receiver
    next()
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.'})
  }
}


module.exports = { dAuth, rAuth }