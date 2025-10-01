import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReturnBook() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState(null);

  // Fetch borrowed books on component mount
  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/borrows/borrowed');
      setBorrowedBooks(response.data);
      if (response.data.length === 0) {
        setMessage('No books are currently borrowed.');
      } else {
        setMessage('');
      }
    } catch (error) {
      setMessage('Error fetching borrowed books: ' + (error.response?.data?.message || error.message));
      setBorrowedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (borrow) => {
    setSelectedBorrow(borrow);
    setShowModal(true);
  };

  const calculateDaysOverdue = (borrowToDate) => {
    const today = new Date();
    const returnDate = new Date(borrowToDate);
    const diffTime = today - returnDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const handleReturnSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/borrows/return/${selectedBorrow._id}`);
      
      setMessage(`Book "${selectedBorrow.bookTitle}" returned successfully!`);
      setShowModal(false);
      setSelectedBorrow(null);
      
      // Refresh borrowed books list
      fetchBorrowedBooks();
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error returning book: ' + (error.response?.data?.message || error.message));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBorrow(null);
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
          .overdue-row {
            background-color: #fef2f2 !important;
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
      <h2 style={styles.heading}>Return a Book</h2>
      
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
          📚 Loading borrowed books...
        </div>
      )}

      {!loading && borrowedBooks.length > 0 && (
        <div style={styles.booksContainer}>
          <h3 style={styles.subHeading}>Borrowed Books ({borrowedBooks.length} books)</h3>
          <p style={styles.instruction}>Click on any book to return it</p>
          
          <div style={styles.tableContainer} className="table-container">
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader} className="table-header">Book ID</th>
                  <th style={styles.tableHeader} className="table-header">Title</th>
                  <th style={styles.tableHeader} className="table-header">Author</th>
                  <th style={styles.tableHeader} className="table-header">Borrower</th>
                  <th style={styles.tableHeader} className="table-header">Phone</th>
                  <th style={styles.tableHeader} className="table-header">Borrowed Date</th>
                  <th style={styles.tableHeader} className="table-header">Return Date</th>
                  <th style={styles.tableHeader} className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map((borrow, index) => {
                  const daysOverdue = calculateDaysOverdue(borrow.borrowToDate);
                  const isOverdue = daysOverdue > 0;
                  
                  return (
                    <tr 
                      key={borrow._id || index} 
                      style={styles.tableRow} 
                      className={`table-row ${isOverdue ? 'overdue-row' : ''}`}
                      onClick={() => handleBookSelect(borrow)}
                    >
                      <td style={styles.tableCell}>{borrow.bookId}</td>
                      <td style={styles.tableCell}>{borrow.bookTitle}</td>
                      <td style={styles.tableCell}>{borrow.bookAuthor}</td>
                      <td style={styles.tableCell}>{borrow.borrowerName}</td>
                      <td style={styles.tableCell}>{borrow.borrowerPhone}</td>
                      <td style={styles.tableCell}>{formatDate(borrow.borrowFromDate)}</td>
                      <td style={styles.tableCell}>{formatDate(borrow.borrowToDate)}</td>
                      <td style={styles.tableCell}>
                        {isOverdue ? (
                          <span style={styles.overdueBadge}>
                            Overdue ({daysOverdue} days)
                          </span>
                        ) : (
                          <span style={styles.onTimeBadge}>
                            On Time
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && borrowedBooks.length === 0 && !message && (
        <div style={styles.emptyState}>
          <h3>No Books Currently Borrowed</h3>
          <p>There are no books currently borrowed. All books are available in the library.</p>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {showModal && selectedBorrow && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={closeModal}
            >
              ×
            </button>
            
            <h3 style={styles.modalTitle}>Return Book Confirmation</h3>
            
            <div style={styles.bookInfo}>
              <strong>Book:</strong> {selectedBorrow.bookTitle} <br />
              <strong>Author:</strong> {selectedBorrow.bookAuthor} <br />
              <strong>Book ID:</strong> {selectedBorrow.bookId} <br />
              <strong>Borrower:</strong> {selectedBorrow.borrowerName} <br />
              <strong>Phone:</strong> {selectedBorrow.borrowerPhone} <br />
              <strong>Borrowed Date:</strong> {formatDate(selectedBorrow.borrowFromDate)} <br />
              <strong>Due Date:</strong> {formatDate(selectedBorrow.borrowToDate)}
              
              {calculateDaysOverdue(selectedBorrow.borrowToDate) > 0 && (
                <div style={styles.overdueNotice}>
                  <strong>⚠️ OVERDUE: {calculateDaysOverdue(selectedBorrow.borrowToDate)} days late</strong>
                </div>
              )}
            </div>
            
            <div style={styles.confirmationText}>
              Are you sure you want to return this book?
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
                type="button"
                onClick={handleReturnSubmit}
                style={styles.returnButton}
              >
                Yes, Return Book
              </button>
            </div>
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
    minWidth: '1000px',
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
  onTimeBadge: {
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
  overdueBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'inline-block',
    minWidth: '80px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
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
  overdueNotice: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fef2f2',
    borderRadius: '6px',
    color: '#991b1b',
    border: '1px solid #fca5a5',
  },
  confirmationText: {
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#374151',
    marginBottom: '20px',
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
  returnButton: {
    padding: '10px 20px',
    backgroundColor: '#dc2626',
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

export default ReturnBook;