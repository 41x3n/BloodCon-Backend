const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const donorSchema = new mongoose.Schema({
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
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 65
  },
  weight: {
    type: Number,
    required: true,
    min: 55
  },
  bloodGroup: {
    type: String,
    required: true,
    trim: true
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

// Generate Authentication Token
donorSchema.methods.generateAuthToken = async function () {
  const donor = this
  const token = jwt.sign({ 
    _id: donor._id.toString() 
  }, process.env.JWT_SECRET, {expiresIn: "60 days" })
  donor.tokens = donor.tokens.concat({ token })

  await donor.save()
  return token
}

// Hashing password before saving
donorSchema.pre('save', async function (next) {
  const donor = this

  if(donor.isModified('password')) {
    donor.password = await bcrypt.hash(donor.password, 8)
  }

  next()
})

// Cleansing donor data before sending it off to client
donorSchema.methods.toJSON = function () {
  const donor = this
  const donorObject = donor.toObject()

  delete donorObject.password
  delete donorObject.tokens

  return donorObject
}

// Login details checking
donorSchema.statics.findByCredentials = async (email, password) => {
  const donor = await Donor.findOne({ email })

  if(!donor) {
    throw new Error('Unable to login!')
  }

  const isMatch = await bcrypt.compare(password, donor.password)

  if(!isMatch) {
    throw new Error('Unable to login!')
  }

  return donor
}


const Donor = mongoose.model('Donor', donorSchema)

module.exports = Donor