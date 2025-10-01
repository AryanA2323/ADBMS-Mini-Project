import React, { useState } from 'react';
import axios from 'axios';

// Helper function to get availability badge colors
const getAvailabilityColor = (availability) => {
  switch (availability) {
    case 'Available':
      return { bg: '#dcfce7', text: '#166534' }; // Green
    case 'Borrowed':
      return { bg: '#fef3c7', text: '#92400e' }; // Yellow/Orange
    case 'Not Available':
      return { bg: '#fef2f2', text: '#991b1b' }; // Red
    case 'Reserved':
      return { bg: '#e0e7ff', text: '#3730a3' }; // Blue
    default:
      return { bg: '#f3f4f6', text: '#374151' }; // Gray
  }
};

function Retrive() {
  const [bookId, setBookId] = useState('');
  const [bookDetails, setBookDetails] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showPopup = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${bookId}`);
      setBookDetails(response.data);
      setMessage('');
      setShowAllBooks(false);  // Hide all books when showing single book
    } catch (error) {
      if (error.response?.status === 404) {
        showPopup(`Book with ID "${bookId}" doesn't exist in the database.`);
      } else {
        setMessage('Error retrieving book: ' + (error.response?.data?.message || error.message));
        setTimeout(() => setMessage(''), 3000);
      }
      setBookDetails(null);
    }
  };

  const handleShowAllBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setAllBooks(response.data);
      setShowAllBooks(true);
      setBookDetails(null);  // Hide single book when showing all books
      setMessage('');
    } catch (error) {
      setMessage('Error retrieving all books: ' + (error.response?.data?.message || error.message));
      setAllBooks([]);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={styles.container}>
        <style>
          {`
            .table-row:hover {
              background-color: #f8fafc !important;
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
            @media (max-width: 768px) {
              .table-container {
                overflow-x: scroll;
              }
            }
          `}
        </style>
        <h1 style={styles.mainHeading}>Library Management System</h1>
        <div style={styles.headerLine}></div>
        <h2 style={styles.heading}>Retrieve Book Information</h2>
        
        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: "#f8d7da",
            color: "#721c24"
          }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Enter Book ID:</label>
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Retrieve Book Details
        </button>
      </form>

      <div style={styles.divider}>
        <span style={styles.dividerText}>OR</span>
      </div>

      <button 
        onClick={handleShowAllBooks} 
        style={{...styles.button, backgroundColor: '#059669', marginBottom: '20px'}}
      >
        Display All Books
      </button>

      {bookDetails && !showAllBooks && (
        <div style={styles.allBooksContainer}>
          <h2 style={styles.resultHeading}>Book Details:</h2>
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
                <tr style={styles.tableRow} className="table-row">
                  <td style={styles.tableCell}>{bookDetails.BookID}</td>
                  <td style={styles.tableCell}>{bookDetails.BookTitle}</td>
                  <td style={styles.tableCell}>{bookDetails.BookAuthor}</td>
                  <td style={styles.tableCell}>₹{bookDetails.BookPrice}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.availabilityBadge,
                      backgroundColor: getAvailabilityColor(bookDetails.BookAvailability).bg,
                      color: getAvailabilityColor(bookDetails.BookAvailability).text
                    }}>
                      {bookDetails.BookAvailability}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAllBooks && allBooks.length > 0 && (
        <div style={styles.allBooksContainer}>
          <h2 style={styles.resultHeading}>All Books ({allBooks.length} records found):</h2>
          <div style={styles.tableContainer} className="table-container">
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader} className="table-header">Book ID</th>
                  <th style={styles.tableHeader} className="table-header">Title</th>
                  <th style={styles.tableHeader} className="table-header">Price</th>
                  <th style={styles.tableHeader} className="table-header">Author</th>
                  <th style={styles.tableHeader} className="table-header">Availability</th>
                </tr>
              </thead>
              <tbody>
                {allBooks.map((book, index) => (
                  <tr key={book._id || index} style={styles.tableRow} className="table-row">
                    <td style={styles.tableCell}>{book.BookID}</td>
                    <td style={styles.tableCell}>{book.BookTitle}</td>
                    <td style={styles.tableCell}>₹{book.BookPrice}</td>
                    <td style={styles.tableCell}>{book.BookAuthor}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.availabilityBadge,
                        backgroundColor: getAvailabilityColor(book.BookAvailability).bg,
                        color: getAvailabilityColor(book.BookAvailability).text
                      }}>
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

      {showAllBooks && allBooks.length === 0 && (
        <div style={styles.resultCard}>
          <h2 style={styles.resultHeading}>No Books Found</h2>
          <p>The library database is currently empty.</p>
        </div>
      )}

      {/* Modal for ID validation */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Book Not Found</h3>
            <p style={styles.modalMessage}>{modalMessage}</p>
            <button style={styles.modalButton} onClick={closeModal}>
              OK
            </button>
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
  message: {
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid transparent",
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    position: 'relative',
  },
  dividerText: {
    backgroundColor: '#f8f9fa',
    padding: '0 15px',
    color: '#6c757d',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  resultHeading: {
    fontSize: '20px',
    color: '#1e3a8a',
    marginBottom: '15px',
  },
  detailRow: {
    display: 'flex',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  detailLabel: {
    fontWeight: 'bold',
    width: '120px',
    color: '#333',
  },
  allBooksContainer: {
    marginTop: '20px',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginTop: '20px',
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
    cursor: 'pointer',
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
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
  },
  modalTitle: {
    color: '#dc2626',
    marginBottom: '15px',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  modalMessage: {
    marginBottom: '20px',
    fontSize: '16px',
    color: '#333',
    lineHeight: '1.5',
  },
  modalButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Retrive;