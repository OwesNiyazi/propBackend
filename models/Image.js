const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  subtype: { type: String },
  price: Number,
  location: String,
  imageUrls: [String], // <-- Change from imageUrl to imageUrls (array)
  propertyType: { type: String, enum: ['Rent', 'Sale'], default: 'Sale' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
