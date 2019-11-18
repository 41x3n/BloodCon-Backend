const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Receiver = require('../models/receiver')
const { rAuth } = require('../middleware/auth')
const router = new express.Router()


// Route to create a Receiver Account
router.post('/receivers', async (req, res) => {
  const receiver = new Receiver(req.body)
  try {
    await receiver.save()
    const token = await receiver.generateAuthToken()
    res.status(201).send({ receiver, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to login a receiver Account
router.post('/receivers/login', async (req, res) => {
  try {
    const receiver = await Receiver.findByCredentials(req.body.email, req.body.password)
    const token = await receiver.generateAuthToken()
    res.send({ receiver: receiver, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to logout a receiver account
router.post('/receivers/logout', rAuth, async (req, res) => {
  try {
    req.receiver.tokens = req.receiver.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.receiver.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

// Route to log out from everywhere
router.post('/receivers/logoutAll', rAuth, async (req, res) => {
  try {
    req.receiver.tokens = []
    await req.receiver.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

// Route to get receiver details
router.get('/receivers/me', rAuth, async(req, res) => {
  try {
    res.send(req.receiver)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to get a receiver details
router.get('/receivers/:id', async(req, res) => {
  const _id = req.params.id
  try {
    const receiver = await Receiver.findOne({ _id })
    res.send(receiver)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to update Receiver information
router.patch('/receivers/me', rAuth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["name", "address", "area", "city", "state", "zipCode", "country", "phone", "email", "password"]
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if(!isValidOperation) {
    res.status(400).send({ error: 'Invalid Updates!'})
  }

  try {
    updates.forEach((update) => {
      req.receiver[update] = req.body[update]
    })
    await req.receiver.save()
    res.status(200).send(req.receiver)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Route to delete Receiver
router.delete('/receivers/me', rAuth, async (req, res) => {
  try {
    await req.receiver.remove()
    res.status(200).send(req.user)
  } catch (error) {
    res.status(400).send(error)
  }
})


module.exports = router