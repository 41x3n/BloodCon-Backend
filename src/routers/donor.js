const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Donor = require('../models/donor')
const { dAuth } = require('../middleware/auth')
const router = new express.Router()


// Demo Route
router.get('/', async (req, res) => {
  res.send({ anindya: 'chowdhury'})
})

// Route to create a Donor Account
router.post('/donors', async (req, res) => {
  const donor = new Donor(req.body)
  try {
    await donor.save()
    const token = await donor.generateAuthToken()
    res.status(201).send({ donor, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to login a donor Account
router.post('/donors/login', async (req, res) => {
  try {
    const donor = await Donor.findByCredentials(req.body.email, req.body.password)
    const token = await donor.generateAuthToken()
    res.send({ donor: donor, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to logout a donor account
router.post('/donors/logout', dAuth, async (req, res) => {
  try {
    req.donor.tokens = req.donor.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.donor.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

// Route to log out from everywhere
router.post('/donors/logoutAll', dAuth, async (req, res) => {
  try {
    req.donor.tokens = []
    await req.donor.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

// Route to get donor details
router.get('/donors/me', dAuth, async(req, res) => {
  try {
    res.send(req.donor)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to get a donor details
router.get('/donors/:id', async(req, res) => {
  const _id = req.params.id
  try {
    const donor = await Donor.findOne({ _id })
    res.send(donor)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to update Donor information
router.patch('/donors/me', dAuth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["name", "address", "city", "state", "zipCode", "country", "phone", "email", "password", "age", "weight", "bloodGroup"]
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if(!isValidOperation) {
    res.status(400).send({ error: 'Invalid Updates!'})
  }

  try {
    updates.forEach((update) => {
      req.donor[update] = req.body[update]
    })
    await req.donor.save()
    res.status(200).send(req.donor)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to delete Donor
router.delete('/donors/me', dAuth, async (req, res) => {
  try {
    await req.donor.remove()
    res.status(200).send(req.user)
  } catch (error) {
    res.status(400).send(error)
  }
})


module.exports = router