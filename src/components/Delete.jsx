import React, { useState } from 'react';

function Delete() {
  const [bookId, setBookId] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    console.log('Deleting book with ID:', bookId);
    // Add your MongoDB delete logic here
    setConfirmDelete(false);
    setBookId('');
  };

  return (
    <div style={styles.container}>
        <h1 style={styles.mainHeading}>Library Management System</h1>
  <div style={styles.headerLine}></div>
  <h2 style={styles.heading}>Delete Book Record</h2>
      
      {!confirmDelete ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Enter Book ID :</label>
            <input
              type="text"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Delete Book
          </button>
        </form>
      ) : (
        <div style={styles.confirmDialog}>
          <p style={styles.confirmText}>
            Are you sure you want to delete book with ID: {bookId}?
          </p>
          <div style={styles.buttonGroup}>
            <button 
              onClick={handleConfirmDelete}
              style={{...styles.button, ...styles.deleteButton}}
            >
              Confirm Delete
            </button>
            <button 
              onClick={() => setConfirmDelete(false)}
              style={{...styles.button, ...styles.cancelButton}}
            >
              Cancel
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
  confirmDialog: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  confirmText: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    width: 'auto',
    padding: '12px 24px',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    width: 'auto',
    padding: '12px 24px',
  }
};

export default Delete;