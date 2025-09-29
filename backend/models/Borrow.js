const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
    ref: 'Book'
  },
  borrowFromDate: {
    type: Date,
    required: true
  },
  borrowToDate: {
    type: Date,
    required: true
  },
  borrowerName: {
    type: String,
    required: true,
    trim: true
  },
  borrowerPhone: {
    type: String,
    required: true,
    trim: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Active', 'Returned', 'Overdue'],
    default: 'Active'
  }
}, {
  timestamps: true,
  collection: 'Borrows'  // Explicitly specify the collection name as 'Borrows'
});

// Index for efficient queries
borrowSchema.index({ bookId: 1 });
borrowSchema.index({ borrowerPhone: 1 });
borrowSchema.index({ status: 1 });

module.exports = mongoose.model('Borrow', borrowSchema);