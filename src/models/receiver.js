const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const receiverSchema = new mongoose.Schema({
  name: {
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
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password can not contain "password"')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

// Connecting to Post collection
receiverSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'owner'
})

// Generate Authentication Token
receiverSchema.methods.generateAuthToken = async function () {
  const receiver = this
  const token = jwt.sign({ 
    _id: receiver._id.toString() 
  }, process.env.JWT_SECRET, {expiresIn: "60 days" })
  receiver.tokens = receiver.tokens.concat({ token })

  await receiver.save()
  return token
}

// Hashing password before saving
receiverSchema.pre('save', async function (next) {
  const receiver = this

  if(receiver.isModified('password')) {
    receiver.password = await bcrypt.hash(receiver.password, 8)
  }

  next()
})

// Cleansing receiver data before sending it off to client
receiverSchema.methods.toJSON = function () {
  const receiver = this
  const receiverObject = receiver.toObject()

  delete receiverObject.password
  delete receiverObject.tokens

  return receiverObject
}

// Login details checking
receiverSchema.statics.findByCredentials = async (email, password) => {
  const receiver = await Receiver.findOne({ email })

  if(!receiver) {
    throw new Error('Unable to login!')
  }

  const isMatch = await bcrypt.compare(password, receiver.password)

  if(!isMatch) {
    throw new Error('Unable to login!')
  }

  return receiver
}


const Receiver = mongoose.model('Receiver', receiverSchema)

module.exports = Receiver