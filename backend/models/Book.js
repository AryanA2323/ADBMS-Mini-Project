const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  BookID: {
    type: String,
    required: true,
    unique: true
  },
  BookTitle: {
    type: String,
    required: true
  },
  BookAvailability: {
    type: String,
    required: true,
    enum: ['Available', 'Borrowed', 'Not Available', 'Reserved']
  },
  BookPrice: {
    type: Number,
    required: true
  },
  BookAuthor: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'Books'  // Explicitly specify the collection name as 'Books'
});

module.exports = mongoose.model('Book', bookSchema);