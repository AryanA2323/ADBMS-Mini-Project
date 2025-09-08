import React, { useState } from 'react';

function Update() {
  const [bookId, setBookId] = useState('');
  const [showFieldSelection, setShowFieldSelection] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleBookIdSubmit = (e) => {
    e.preventDefault();
    setShowFieldSelection(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Updating book:', {
      bookId,
      field: selectedField,
      newValue
    });
    // Add your MongoDB update logic here
  };

  return (
    <div style={styles.container}>
        <h1 style={styles.mainHeading}>Library Management System</h1>
        <div style={styles.headerLine}></div>
        <h2 style={styles.heading}>Update Book Information</h2>
      
      {!showFieldSelection ? (
        <form onSubmit={handleBookIdSubmit} style={styles.form}>
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
            Next
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Field to Update:</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select a field</option>
              <option value="title">Book Id</option>
              <option value="author">Book Title</option>
              <option value="isbn">Book Availability</option>
              <option value="category">Book Price</option>
              <option value="quantity">Book Author</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>New Value:</label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Update Book
          </button>
        </form>
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
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    backgroundColor: 'white',
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
};

export default Update;