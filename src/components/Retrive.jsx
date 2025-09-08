import React, { useState } from 'react';

function Retrive() {
  const [bookId, setBookId] = useState('');
  const [bookDetails, setBookDetails] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your MongoDB retrieve logic here
    console.log('Retrieving book with ID:', bookId);
    
    // Mockup data - replace with actual database fetch
    setBookDetails({
      id: bookId,
      title: "Sample Book",
      author: "Sample Author",
      price: "$29.99",
      availability: "Available"
    });
  };

  return (
    <div style={styles.container}>
        <h1 style={styles.mainHeading}>Library Management System</h1>
  <div style={styles.headerLine}></div>
  <h2 style={styles.heading}>Retrieve Book Information</h2>
      
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

      {bookDetails && (
        <div style={styles.resultCard}>
          <h2 style={styles.resultHeading}>Book Details:</h2>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Book ID:</span>
            <span>{bookDetails.id}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Title:</span>
            <span>{bookDetails.title}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Author:</span>
            <span>{bookDetails.author}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Price:</span>
            <span>{bookDetails.price}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Availability:</span>
            <span>{bookDetails.availability}</span>
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
    maxWidth: '800px',
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
  }
};

export default Retrive;