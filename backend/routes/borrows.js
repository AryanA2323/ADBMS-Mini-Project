const express = require('express');
const router = express.Router();
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// POST - Create a new borrow record
router.post('/', async (req, res) => {
  try {
    const { bookId, borrowFromDate, borrowToDate, borrowerName, borrowerPhone } = req.body;
    
    // Validate required fields
    if (!bookId || !borrowFromDate || !borrowToDate || !borrowerName || !borrowerPhone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if the book exists and is available
    const book = await Book.findOne({ BookID: bookId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.BookAvailability !== 'Available') {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }
    
    // Validate dates
    const fromDate = new Date(borrowFromDate);
    const toDate = new Date(borrowToDate);
    const today = new Date();
    
    if (fromDate >= toDate) {
      return res.status(400).json({ message: 'Return date must be after borrow date' });
    }
    
    if (fromDate < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: 'Borrow date cannot be in the past' });
    }
    
    // Create borrow record
    const borrow = new Borrow({
      bookId,
      borrowFromDate: fromDate,
      borrowToDate: toDate,
      borrowerName: borrowerName.trim(),
      borrowerPhone: borrowerPhone.trim()
    });
    
    // Update book availability
    book.BookAvailability = 'Borrowed';
    
    // Save both records
    await Promise.all([
      borrow.save(),
      book.save()
    ]);
    
    console.log(`📖 Book borrowed: ${book.BookTitle} (${bookId}) by ${borrowerName}`);
    
    res.status(201).json({
      message: 'Book borrowed successfully',
      borrow: borrow,
      book: {
        BookID: book.BookID,
        BookTitle: book.BookTitle,
        BookAuthor: book.BookAuthor
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating borrow record:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET all active borrows
router.get('/', async (req, res) => {
  try {
    const borrows = await Borrow.find({ status: 'Active' }).sort({ borrowDate: -1 });
    console.log(`📋 Retrieved active borrows: ${borrows.length} records found`);
    res.json(borrows);
  } catch (error) {
    console.error('❌ Error retrieving borrows:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET borrows by phone number
router.get('/phone/:phone', async (req, res) => {
  try {
    const borrows = await Borrow.find({ 
      borrowerPhone: req.params.phone,
      status: 'Active'
    }).sort({ borrowDate: -1 });
    
    console.log(`📋 Retrieved borrows for phone ${req.params.phone}: ${borrows.length} records`);
    res.json(borrows);
  } catch (error) {
    console.error('❌ Error retrieving borrows by phone:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// PUT - Return a book
router.put('/:id/return', async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }
    
    if (borrow.status !== 'Active') {
      return res.status(400).json({ message: 'Book has already been returned' });
    }
    
    // Update borrow record
    borrow.returnDate = new Date();
    borrow.status = 'Returned';
    
    // Update book availability
    const book = await Book.findOne({ BookID: borrow.bookId });
    if (book) {
      book.BookAvailability = 'Available';
      await book.save();
    }
    
    await borrow.save();
    
    console.log(`📚 Book returned: ${borrow.bookId} by ${borrow.borrowerName}`);
    
    res.json({
      message: 'Book returned successfully',
      borrow: borrow
    });
    
  } catch (error) {
    console.error('❌ Error returning book:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET overdue books
router.get('/overdue', async (req, res) => {
  try {
    const today = new Date();
    const overdueBooks = await Borrow.find({
      status: 'Active',
      borrowToDate: { $lt: today }
    }).sort({ borrowToDate: 1 });
    
    // Update status to overdue
    if (overdueBooks.length > 0) {
      await Borrow.updateMany(
        {
          status: 'Active',
          borrowToDate: { $lt: today }
        },
        { status: 'Overdue' }
      );
    }
    
    console.log(`⚠️ Found ${overdueBooks.length} overdue books`);
    res.json(overdueBooks);
  } catch (error) {
    console.error('❌ Error retrieving overdue books:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;