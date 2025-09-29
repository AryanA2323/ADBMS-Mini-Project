import React, { useState, useEffect } from 'react';
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

function SearchByAttribute() {
  const [selectedAttribute, setSelectedAttribute] = useState('BookTitle');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Available attributes for search
  const attributes = [
    { value: 'BookTitle', label: 'Book Title' },
    { value: 'BookAuthor', label: 'Author' },
    { value: 'BookID', label: 'Book ID' },
    { value: 'BookAvailability', label: 'Availability' },
    { value: 'BookPrice', label: 'Price' }
  ];

  // Real-time search function
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.trim() !== '') {
        performSearch();
      } else {
        setSearchResults([]);
        setMessage('');
      }
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(delayDebounce);
  }, [searchValue, selectedAttribute]);

  const performSearch = async () => {
    setLoading(true);
    try {
      console.log(`Searching for: ${selectedAttribute} = "${searchValue}"`);
      
      const response = await axios.get(`http://localhost:5000/api/books/search`, {
        params: {
          attribute: selectedAttribute,
          value: searchValue
        }
      });
      
      console.log(`Search response:`, response.data);
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setMessage(`No books found matching "${searchValue}" in ${attributes.find(attr => attr.value === selectedAttribute)?.label}`);
      } else {
        setMessage('');
      }
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      setMessage('Error searching books: ' + errorMessage);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeChange = (e) => {
    setSelectedAttribute(e.target.value);
    setSearchValue('');
    setSearchResults([]);
    setMessage('');
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
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
      <h2 style={styles.heading}>Search Books by Attribute</h2>
      
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: searchResults.length === 0 ? "#f8d7da" : "#d1ecf1",
          color: searchResults.length === 0 ? "#721c24" : "#0c5460"
        }}>
          {message}
        </div>
      )}
      
      <div style={styles.searchContainer}>
        <div style={styles.searchForm}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Attribute to Search:</label>
            <select
              value={selectedAttribute}
              onChange={handleAttributeChange}
              style={styles.select}
            >
              {attributes.map(attr => (
                <option key={attr.value} value={attr.value}>
                  {attr.label}
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Enter {attributes.find(attr => attr.value === selectedAttribute)?.label}:
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              style={styles.input}
              placeholder={`Type ${attributes.find(attr => attr.value === selectedAttribute)?.label.toLowerCase()}...`}
            />
          </div>
          
          {loading && (
            <div style={styles.loadingIndicator}>
              🔍 Searching...
            </div>
          )}
        </div>
      </div>

      {searchResults.length > 0 && (
        <div style={styles.resultsContainer}>
          <h2 style={styles.resultHeading}>
            Search Results ({searchResults.length} books found):
          </h2>
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
                {searchResults.map((book, index) => {
                  const colorStyle = getAvailabilityColor(book.BookAvailability);
                  return (
                    <tr key={book._id || index} style={styles.tableRow} className="table-row">
                      <td style={styles.tableCell}>{book.BookID}</td>
                      <td style={styles.tableCell}>{book.BookTitle}</td>
                      <td style={styles.tableCell}>{book.BookAuthor}</td>
                      <td style={styles.tableCell}>₹{book.BookPrice}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.availabilityBadge,
                          backgroundColor: colorStyle.bg,
                          color: colorStyle.text
                        }}>
                          {book.BookAvailability}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid transparent",
    fontWeight: "500",
  },
  searchContainer: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '25px',
  },
  searchForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '20px',
    alignItems: 'end',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#374151',
    fontSize: '14px',
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    fontSize: '16px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
  },
  loadingIndicator: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  resultsContainer: {
    marginTop: '25px',
  },
  resultHeading: {
    fontSize: '20px',
    color: '#1e3a8a',
    marginBottom: '15px',
    fontWeight: 'bold',
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
  }
};

export default SearchByAttribute;