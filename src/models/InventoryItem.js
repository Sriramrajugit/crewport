const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Safety Equipment', 'Navigation Equipment', 'Engine Parts',
      'Deck Equipment', 'Medical Supplies', 'Food & Provisions',
      'Fuel & Lubricants', 'Tools & Hardware', 'Electrical Equipment', 'Other'
    ]
  },
  description: {
    type: String
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required']
  },
  minQuantity: {
    type: Number,
    default: 0
  },
  vessel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vessel',
    required: [true, 'Vessel is required']
  },
  location: {
    type: String
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

InventoryItemSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.minQuantity;
});

InventoryItemSchema.set('toJSON', { virtuals: true });
InventoryItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
