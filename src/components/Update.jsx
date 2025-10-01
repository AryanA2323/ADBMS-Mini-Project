import React, { useState } from 'react';
import axios from 'axios';

function Update() {
  const [bookId, setBookId] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [newValue, setNewValue] = useState('');
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { [selectedField]: newValue };
      const response = await axios.put(`http://localhost:5000/api/books/${bookId}`, updateData);
      setMessage('Book updated successfully!');
      setBookId('');
      setSelectedField('');
      setNewValue('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      if (error.response?.status === 404) {
        showPopup(`Book with ID "${bookId}" doesn't exist in the database.`);
      } else {
        setMessage('Error updating book: ' + (error.response?.data?.message || error.message));
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeading}>Library Management System</h1>
      <div style={styles.headerLine}></div>
      <h2 style={styles.heading}>Update Book Information</h2>
      
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.includes("Error") ? "#f8d7da" : "#d4edda",
          color: message.includes("Error") ? "#721c24" : "#155724"
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleUpdate} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Book ID:</label>
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Field to Update:</label>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select a field</option>
            <option value="BookID">Book Id</option>
            <option value="BookTitle">Book Title</option>
            <option value="BookAvailability">Book Availability</option>
            <option value="BookPrice">Book Price</option>
            <option value="BookAuthor">Book Author</option>
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

export default Update;