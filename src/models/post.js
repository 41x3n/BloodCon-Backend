const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
    trim: true
  },
  bloodGroup: {
    type: String,
    required: true,
    trim: true
  },
  hospital: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Receiver'
  }
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post