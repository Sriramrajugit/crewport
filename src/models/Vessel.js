const mongoose = require('mongoose');

const VesselSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vessel name is required'],
    trim: true
  },
  imoNumber: {
    type: String,
    required: [true, 'IMO number is required'],
    unique: true
  },
  vesselType: {
    type: String,
    required: [true, 'Vessel type is required'],
    enum: ['Container', 'Tanker', 'Bulk Carrier', 'General Cargo', 'Passenger', 'Offshore', 'Tug', 'Other']
  },
  flag: {
    type: String,
    required: [true, 'Flag is required']
  },
  grossTonnage: {
    type: Number
  },
  yearBuilt: {
    type: Number
  },
  currentPort: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'decommissioned'],
    default: 'active'
  },
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vessel', VesselSchema);
