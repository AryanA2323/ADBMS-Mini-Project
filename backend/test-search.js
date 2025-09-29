const axios = require('axios');

async function testSearch() {
  try {
    // First, add a test book
    console.log('Adding a test book...');
    const addResponse = await axios.post('http://localhost:5000/api/books', {
      BookID: 'TEST001',
      BookTitle: 'Test Book Title',
      BookAuthor: 'Test Author',
      BookPrice: 25.99,
      BookAvailability: 'Available'
    });
    console.log('Book added:', addResponse.data);

    // Now test the search
    console.log('\nTesting search...');
    const searchResponse = await axios.get('http://localhost:5000/api/books/search', {
      params: {
        attribute: 'BookID',
        value: 'TEST001'
      }
    });
    console.log('Search results:', searchResponse.data);

    // Test partial search
    console.log('\nTesting partial search...');
    const partialResponse = await axios.get('http://localhost:5000/api/books/search', {
      params: {
        attribute: 'BookTitle',
        value: 'Test'
      }
    });
    console.log('Partial search results:', partialResponse.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testSearch();