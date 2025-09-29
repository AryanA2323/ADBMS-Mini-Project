const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    console.log(`📚 Retrieved all books from Books collection: ${books.length} books found`);
    res.json(books);
  } catch (error) {
    console.error('❌ Error retrieving all books:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET available books only
router.get('/available', async (req, res) => {
  try {
    const books = await Book.find({ BookAvailability: 'Available' });
    console.log(`📚 Retrieved available books: ${books.length} books available`);
    res.json(books);
  } catch (error) {
    console.error('❌ Error retrieving available books:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET books by attribute search
router.get('/search', async (req, res) => {
  try {
    const { attribute, value } = req.query;
    
    console.log(`🔍 Search request received: attribute="${attribute}", value="${value}"`);
    
    if (!attribute || !value) {
      return res.status(400).json({ message: 'Both attribute and value are required' });
    }

    // Create search query based on attribute
    let query = {};
    
    if (attribute === 'BookPrice') {
      // For price, do exact match (convert to number)
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        query[attribute] = numericValue;
      } else {
        return res.status(400).json({ message: 'Price must be a valid number' });
      }
    } else {
      // For text fields, use case-insensitive regex search
      query[attribute] = { $regex: value, $options: 'i' };
    }
    
    console.log(`🔍 MongoDB query:`, JSON.stringify(query));
    
    const books = await Book.find(query);
    console.log(`🔍 Search performed: ${attribute} = "${value}" | Found ${books.length} books`);
    
    if (books.length === 0) {
      console.log(`📚 Total books in database:`, await Book.countDocuments());
      console.log(`📋 Sample books:`, await Book.find().limit(3));
    }
    
    res.json(books);
  } catch (error) {
    console.error('❌ Error searching books:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET a specific book by BookID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ BookID: req.params.id });
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }
    console.log(`🔍 Book retrieved from Books collection: ${book.BookTitle} (ID: ${book.BookID})`);
    res.json(book);
  } catch (error) {
    console.error('❌ Error retrieving book:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// POST - Create a new book
router.post('/', async (req, res) => {
  const book = new Book({
    BookID: req.body.BookID,
    BookTitle: req.body.BookTitle,
    BookAvailability: req.body.BookAvailability,
    BookPrice: req.body.BookPrice,
    BookAuthor: req.body.BookAuthor
  });

  try {
    const newBook = await book.save();
    console.log(`📚 New book added to Books collection: ${newBook.BookTitle} (ID: ${newBook.BookID})`);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('❌ Error creating book:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update a book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ BookID: req.params.id });
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (req.body.BookTitle != null) {
      book.BookTitle = req.body.BookTitle;
    }
    if (req.body.BookAvailability != null) {
      book.BookAvailability = req.body.BookAvailability;
    }
    if (req.body.BookPrice != null) {
      book.BookPrice = req.body.BookPrice;
    }
    if (req.body.BookAuthor != null) {
      book.BookAuthor = req.body.BookAuthor;
    }

    const updatedBook = await book.save();
    console.log(`📝 Book updated in Books collection: ${updatedBook.BookTitle} (ID: ${updatedBook.BookID})`);
    res.json(updatedBook);
  } catch (error) {
    console.error('❌ Error updating book:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// DELETE a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ BookID: req.params.id });
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Book.deleteOne({ BookID: req.params.id });
    console.log(`🗑️ Book deleted from Books collection: ${book.BookTitle} (ID: ${req.params.id})`);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting book:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;