const mongoose = require('mongoose');

const CrewMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  rank: {
    type: String,
    required: [true, 'Rank is required'],
    enum: [
      'Captain', 'Chief Officer', 'Second Officer', 'Third Officer',
      'Chief Engineer', 'Second Engineer', 'Third Engineer',
      'Bosun', 'AB Seaman', 'OS Seaman', 'Cook', 'Wiper', 'Other'
    ]
  },
  vessel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vessel',
    default: null
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required']
  },
  passportNumber: {
    type: String,
    required: [true, 'Passport number is required'],
    unique: true
  },
  seamanBook: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  embarkDate: {
    type: Date
  },
  debarkDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['onboard', 'ashore', 'standby'],
    default: 'standby'
  },
  certifications: [
    {
      name: String,
      issuedDate: Date,
      expiryDate: Date,
      issuedBy: String
    }
  ],
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CrewMember', CrewMemberSchema);
