const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

// Test MongoDB Atlas connection and Books collection
async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas LMS cluster!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    // Test Books collection specifically
    console.log('📖 Testing Books collection...');
    const bookCount = await Book.countDocuments();
    console.log(`📊 Current number of books in Books collection: ${bookCount}`);
    
    // Test creating a sample book (optional)
    console.log('🧪 Testing book creation...');
    const testBook = new Book({
      BookID: 'TEST001',
      BookTitle: 'Test Book',
      BookAvailability: 'Available',
      BookPrice: 25.99,
      BookAuthor: 'Test Author'
    });
    
    // Check if test book already exists
    const existingTestBook = await Book.findOne({ BookID: 'TEST001' });
    if (!existingTestBook) {
      await testBook.save();
      console.log('✅ Test book created successfully!');
      // Clean up test data
      await Book.deleteOne({ BookID: 'TEST001' });
      console.log('🧹 Test book cleaned up');
    } else {
      console.log('ℹ️  Test book already exists, skipping creation');
    }
    
    await mongoose.disconnect();
    console.log('🔌 Connection closed');
    console.log('\n🎉 Everything is working! Your Insert page will store records in the Books collection.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n📝 Make sure to:');
    console.log('1. Replace <db_password> in .env with your actual MongoDB Atlas password');
    console.log('2. Ensure your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Check your network connection');
  }
}

testConnection();