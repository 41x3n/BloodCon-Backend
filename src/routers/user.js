const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Donor = require('../models/donor')
const Receiver = require('../models/receiver')
const router = new express.Router()

router.get('/', async (req, res) => {
  res.send({ gg:"gg" })
})

module.exports = router