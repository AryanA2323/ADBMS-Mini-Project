const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Import routes
const bookRoutes = require('./routes/books');
const borrowRoutes = require('./routes/borrows');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/LMS')
.then(() => {
  console.log('MongoDB connected successfully to LMS database');
  console.log('📚 Books collection ready for storing records');
})
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Library Management System Backend API',
    database: 'LMS',
    collection: 'Books',
    status: 'Connected'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`📖 Ready to store book records in LMS.Books collection`);
});