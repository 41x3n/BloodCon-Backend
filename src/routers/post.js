const express = require('express')
const Post = require('../models/post')
const Donor = require('../models/donor.js')
const { rAuth } = require('../middleware/auth')
const { needBlood } = require('../twilio/account')
const { needBloodEmail } = require('../emails/account')
const router = new express.Router()

// Route to post a post
router.post('/posts', rAuth, async (req, res) => {
  const post = new Post({
    ...req.body,
    owner: req.receiver._id
  })

  try {
    await post.save()
    let area = post.area
    const list = await Donor.find({ area: `${area}` })
    list.forEach(element => {
      needBlood(element.phone, post.bloodGroup, post.hospital, post.phone)
      needBloodEmail(element.email, post.bloodGroup, post.hospital, post.phone)
      console.log('okay')
    });
    console.log(list)
    res.status(201).send(post)
  } catch (error) {
    res.status(200).send(error)
  }
})

// Route to get all post on basis of URL queries
router.get('/postsAll', async (req, res) => {
  try {
    const queryList = Object.keys(req.query)
    console.log(queryList);
    const list = {}
    queryList.forEach((query) => {
      console.log(query);
      if(query !== 'limit' && query !== 'skip') {
        list[query] = req.query[query]
      }
    })
    console.log(list);
    const posts = await Post.find( list ).limit(parseInt(req.query.limit)).sort( '-createdAt' ).skip(parseInt(req.query.skip))
    res.status(200).send(posts)
  } catch (error) {
    res.status(500).send()
  }
})

// Route to get all posts by the logged in receiver
router.get('/posts', rAuth, async (req, res) => {
  try {
    await req.receiver.populate({
      path: 'posts'
    }).execPopulate()
    res.status(200).send(req.receiver.posts)
  } catch (error) {
    res.status(500).send()
  }
})

// Route to get a post by ID
router.get('/posts/:id', rAuth, async (req, res) => {
  const _id = req.params.id

  try {
    const post = await Post.findOne({ _id, owner: req.receiver._id})
    if(!post) {
      return res.status(404).send()
    }
    res.status(200).send(post)
  } catch (error) {
    res.status(500).send()
  }
})

// Route to update a post
router.patch('/posts/:id', rAuth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['desc', "hospital", "address", "area", "city", "state", "zipCode", "country", "phone", "bloodGroup"]
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if(!isValidOperation) {
    res.status(400).send({ error: 'Invalid updates!'})
  }

  try {
    const post = await Post.findOne({ _id: req.params.id, owner: req.receiver._id })

    if(!post){
      return res.status(404).send()
    }

    updates.forEach((update) => post[update] = req.body[update])
    await post.save()
    res.status(200).send(post)
  } catch (error) {
    res.status(400).send()
  }
})

// Route to delete a post
router.delete("/posts/:id", rAuth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, owner: req.receiver._id })
    if(!post){
      return res.status(404).send()
    }
    res.status(200).send(post)
  } catch (error) {
    res.status(400).send()
  }
})


module.exports = router