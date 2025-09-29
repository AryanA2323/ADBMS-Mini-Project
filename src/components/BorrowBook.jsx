import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BorrowBook() {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowDetails, setBorrowDetails] = useState({
    borrowFromDate: '',
    borrowToDate: '',
    borrowerName: '',
    borrowerPhone: ''
  });

  // Fetch available books on component mount
  useEffect(() => {
    fetchAvailableBooks();
  }, []);

  const fetchAvailableBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/books/available');
      setAvailableBooks(response.data);
      if (response.data.length === 0) {
        setMessage('No books are currently available for borrowing.');
      } else {
        setMessage('');
      }
    } catch (error) {
      setMessage('Error fetching available books: ' + (error.response?.data?.message || error.message));
      setAvailableBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setShowModal(true);
    // Set default dates (today to 2 weeks from today)
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);
    
    setBorrowDetails({
      borrowFromDate: today.toISOString().split('T')[0],
      borrowToDate: twoWeeksLater.toISOString().split('T')[0],
      borrowerName: '',
      borrowerPhone: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBorrowDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(borrowDetails.borrowFromDate) >= new Date(borrowDetails.borrowToDate)) {
      setMessage('Return date must be after borrow date.');
      return;
    }

    try {
      const borrowData = {
        bookId: selectedBook.BookID,
        ...borrowDetails
      };

      await axios.post('http://localhost:5000/api/borrows', borrowData);
      
      setMessage(`Book "${selectedBook.BookTitle}" borrowed successfully!`);
      setShowModal(false);
      setSelectedBook(null);
      setBorrowDetails({
        borrowFromDate: '',
        borrowToDate: '',
        borrowerName: '',
        borrowerPhone: ''
      });
      
      // Refresh available books
      fetchAvailableBooks();
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error borrowing book: ' + (error.response?.data?.message || error.message));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setBorrowDetails({
      borrowFromDate: '',
      borrowToDate: '',
      borrowerName: '',
      borrowerPhone: ''
    });
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          .table-row:hover {
            background-color: #f8fafc !important;
            cursor: pointer;
          }
          .table-row:nth-child(even) {
            background-color: #f9fafb;
          }
          .table-header:first-child {
            border-top-left-radius: 10px;
          }
          .table-header:last-child {
            border-top-right-radius: 10px;
          }
          .table-container {
            overflow-x: auto;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 500px;
            position: relative;
          }
          @media (max-width: 768px) {
            .table-container {
              overflow-x: scroll;
            }
          }
        `}
      </style>
      
      <h1 style={styles.mainHeading}>Library Management System</h1>
      <div style={styles.headerLine}></div>
      <h2 style={styles.heading}>Borrow a Book</h2>
      
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.includes('Error') ? "#f8d7da" : "#d1ecf1",
          color: message.includes('Error') ? "#721c24" : "#0c5460"
        }}>
          {message}
        </div>
      )}

      {loading && (
        <div style={styles.loadingIndicator}>
          📚 Loading available books...
        </div>
      )}

      {!loading && availableBooks.length > 0 && (
        <div style={styles.booksContainer}>
          <h3 style={styles.subHeading}>Available Books ({availableBooks.length} books)</h3>
          <p style={styles.instruction}>Click on any book to borrow it</p>
          
          <div style={styles.tableContainer} className="table-container">
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader} className="table-header">Book ID</th>
                  <th style={styles.tableHeader} className="table-header">Title</th>
                  <th style={styles.tableHeader} className="table-header">Author</th>
                  <th style={styles.tableHeader} className="table-header">Price</th>
                  <th style={styles.tableHeader} className="table-header">Availability</th>
                </tr>
              </thead>
              <tbody>
                {availableBooks.map((book, index) => (
                  <tr 
                    key={book._id || index} 
                    style={styles.tableRow} 
                    className="table-row"
                    onClick={() => handleBookSelect(book)}
                  >
                    <td style={styles.tableCell}>{book.BookID}</td>
                    <td style={styles.tableCell}>{book.BookTitle}</td>
                    <td style={styles.tableCell}>{book.BookAuthor}</td>
                    <td style={styles.tableCell}>₹{book.BookPrice}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.availabilityBadge}>
                        {book.BookAvailability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && availableBooks.length === 0 && !message && (
        <div style={styles.emptyState}>
          <h3>No Books Available</h3>
          <p>There are currently no books available for borrowing. Please check back later.</p>
        </div>
      )}

      {/* Borrow Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={closeModal}
            >
              ×
            </button>
            
            <h3 style={styles.modalTitle}>Borrow Book</h3>
            <div style={styles.bookInfo}>
              <strong>Book:</strong> {selectedBook?.BookTitle} <br />
              <strong>Author:</strong> {selectedBook?.BookAuthor} <br />
              <strong>Book ID:</strong> {selectedBook?.BookID}
            </div>
            
            <form onSubmit={handleBorrowSubmit} style={styles.modalForm}>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Borrow From Date:</label>
                  <input
                    type="date"
                    name="borrowFromDate"
                    value={borrowDetails.borrowFromDate}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Return Date:</label>
                  <input
                    type="date"
                    name="borrowToDate"
                    value={borrowDetails.borrowToDate}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Borrower Name:</label>
                <input
                  type="text"
                  name="borrowerName"
                  value={borrowDetails.borrowerName}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number:</label>
                <input
                  type="tel"
                  name="borrowerPhone"
                  value={borrowDetails.borrowerPhone}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div style={styles.modalButtons}>
                <button 
                  type="button" 
                  onClick={closeModal}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={styles.borrowButton}
                >
                  Borrow Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  mainHeading: {
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e3a8a",
    marginBottom: "10px",
  },
  headerLine: {
    width: "100%",
    height: "2px",
    backgroundColor: "#1e3a8a",
    margin: "0 auto 30px auto",
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#1e3a8a',
  },
  subHeading: {
    fontSize: '20px',
    color: '#1e3a8a',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  instruction: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  message: {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid transparent",
    fontWeight: "500",
  },
  loadingIndicator: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: '16px',
    margin: '40px 0',
  },
  booksContainer: {
    marginTop: '20px',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    minWidth: '800px',
  },
  tableHeaderRow: {
    backgroundColor: '#1e3a8a',
  },
  tableHeader: {
    padding: '15px 12px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'white',
    borderBottom: '2px solid #1e40af',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '14px',
    color: '#374151',
  },
  availabilityBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'inline-block',
    minWidth: '80px',
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  emptyState: {
    textAlign: 'center',
    color: '#6b7280',
    margin: '40px 0',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '20px',
    textAlign: 'center',
  },
  bookInfo: {
    backgroundColor: '#f8fafc',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    lineHeight: '1.6',
    color: '#374151',
    border: '1px solid #e2e8f0',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#374151',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '2px solid #e5e7eb',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  borrowButton: {
    padding: '10px 20px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '5px',
    lineHeight: '1',
  }
};

export default BorrowBook;