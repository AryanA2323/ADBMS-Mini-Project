import React, { useState } from "react";
import axios from "axios";

const HomeScreen = () => {
  const [bookData, setBookData] = useState({
    BookID: "",
    BookTitle: "",
    BookAvailability: "Available",
    BookPrice: "",
    BookAuthor: "",
  });

  // Track hover states and validation errors
  const [isAddHover, setIsAddHover] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Validation functions
  const validateBookID = async (bookID) => {
    if (!bookID) {
      return "Book ID is required";
    }
    if (!/^\d+$/.test(bookID)) {
      return "Book ID must be numeric";
    }
    
    try {
      // Check if Book ID already exists
      setIsValidating(true);
      const response = await axios.get(`http://localhost:5000/api/books/id/${bookID}`);
      if (response.data) {
        return "Book ID already exists in database";
      }
    } catch (error) {
      // If error is 404, it means ID doesn't exist (which is good)
      if (error.response?.status !== 404) {
        return "Error checking Book ID";
      }
    } finally {
      setIsValidating(false);
    }
    return "";
  };

  const validateBookTitle = (title) => {
    if (!title.trim()) {
      return "Book title is required";
    }
    if (title.length > 50) {
      return "Book title must be 50 characters or less";
    }
    return "";
  };

  const validateBookPrice = (price) => {
    if (!price) {
      return "Book price is required";
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      return "Book price must be a valid number";
    }
    const numPrice = parseFloat(price);
    if (numPrice >= 10000) {
      return "Book price must be less than 10000";
    }
    if (numPrice <= 0) {
      return "Book price must be greater than 0";
    }
    return "";
  };

  const validateAuthor = (author) => {
    if (!author.trim()) {
      return "Author name is required";
    }
    if (author.length > 20) {
      return "Author name must be 20 characters or less";
    }
    if (!/^[a-zA-Z\s]+$/.test(author)) {
      return "Author name should only contain letters and spaces";
    }
    return "";
  };

  const handleInputChange = async (name, value) => {
    setBookData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear previous error for this field
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));

    // Real-time validation
    let error = "";
    switch (name) {
      case "BookID":
        if (value) {
          error = await validateBookID(value);
        }
        break;
      case "BookTitle":
        error = validateBookTitle(value);
        break;
      case "BookPrice":
        if (value) {
          error = validateBookPrice(value);
        }
        break;
      case "BookAuthor":
        error = validateAuthor(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate all fields
      const bookIDError = await validateBookID(bookData.BookID);
      const titleError = validateBookTitle(bookData.BookTitle);
      const priceError = validateBookPrice(bookData.BookPrice);
      const authorError = validateAuthor(bookData.BookAuthor);

      const validationErrors = {
        BookID: bookIDError,
        BookTitle: titleError,
        BookPrice: priceError,
        BookAuthor: authorError
      };

      setErrors(validationErrors);

      // Check if there are any errors
      const hasErrors = Object.values(validationErrors).some(error => error !== "");
      if (hasErrors) {
        setMessage("Please fix the validation errors before submitting.");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      // Submit the form if validation passes
      await axios.post('http://localhost:5000/api/books', bookData);
      setMessage("Book added successfully!");
      setBookData({
        BookID: "",
        BookTitle: "",
        BookAvailability: "Available",
        BookPrice: "",
        BookAuthor: "",
      });
      setErrors({});
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error adding book: " + (error.response?.data?.message || error.message));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div style={style.container}>
        <h1 style={style.mainHeading}>Library Management System</h1>
        <div style={style.headerLine}></div>
        <h2 style={style.heading}>Insert Book Information</h2>

        {message && (
          <div style={{
            ...style.message,
            backgroundColor: message.includes("Error") ? "#f8d7da" : "#d4edda",
            color: message.includes("Error") ? "#721c24" : "#155724"
          }}>
            {message}
          </div>
        )}

        <div style={style.inputContainer}>
          <div style={style.fieldGroup}>
            <label style={style.label}>Book ID *</label>
            <input
              style={{
                ...style.input,
                borderColor: errors.BookID ? "#dc3545" : "#ddd"
              }}
              type="number"
              placeholder="Enter numeric Book ID"
              value={bookData.BookID}
              onChange={(e) => handleInputChange("BookID", e.target.value)}
            />
            {errors.BookID && <div style={style.errorMessage}>{errors.BookID}</div>}
            {isValidating && <div style={style.validatingMessage}>Checking availability...</div>}
          </div>

          <div style={style.fieldGroup}>
            <label style={style.label}>Book Title *</label>
            <input
              style={{
                ...style.input,
                borderColor: errors.BookTitle ? "#dc3545" : "#ddd"
              }}
              type="text"
              placeholder="Enter book title"
              value={bookData.BookTitle}
              onChange={(e) => handleInputChange("BookTitle", e.target.value)}
              maxLength="50"
            />
            <div style={style.characterCount}>
              {bookData.BookTitle.length}/50 characters
            </div>
            {errors.BookTitle && <div style={style.errorMessage}>{errors.BookTitle}</div>}
          </div>

          <div style={style.fieldGroup}>
            <label style={style.label}>Book Availability *</label>
            <select
              style={{
                ...style.select,
                borderColor: errors.BookAvailability ? "#dc3545" : "#ddd"
              }}
              value={bookData.BookAvailability}
              onChange={(e) => handleInputChange("BookAvailability", e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
              <option value="Borrowed">Borrowed</option>
            </select>
            {errors.BookAvailability && <div style={style.errorMessage}>{errors.BookAvailability}</div>}
          </div>

          <div style={style.fieldGroup}>
            <label style={style.label}>Book Price *</label>
            <input
              style={{
                ...style.input,
                borderColor: errors.BookPrice ? "#dc3545" : "#ddd"
              }}
              type="number"
              step="0.01"
              min="0"
              max="9999.99"
              placeholder="Enter price (e.g., 299.99)"
              value={bookData.BookPrice}
              onChange={(e) => handleInputChange("BookPrice", e.target.value)}
            />
            {errors.BookPrice && <div style={style.errorMessage}>{errors.BookPrice}</div>}
          </div>

          <div style={style.fieldGroup}>
            <label style={style.label}>Author Name *</label>
            <input
              style={{
                ...style.input,
                borderColor: errors.BookAuthor ? "#dc3545" : "#ddd"
              }}
              type="text"
              placeholder="Enter author name"
              value={bookData.BookAuthor}
              onChange={(e) => handleInputChange("BookAuthor", e.target.value)}
              maxLength="20"
            />
            <div style={style.characterCount}>
              {bookData.BookAuthor.length}/20 characters
            </div>
            {errors.BookAuthor && <div style={style.errorMessage}>{errors.BookAuthor}</div>}
          </div>

         <div style={style.buttonContainer}>
          <button
            style={{
              ...style.button,
              ...style.addButton,
              ...(isAddHover ? style.addButtonHover : {}),
            }}
            onMouseEnter={() => setIsAddHover(true)}
            onMouseLeave={() => setIsAddHover(false)}
            onClick={handleSubmit}
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
};

const style = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    padding: "10px 0",
  },
  inputContainer: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    height: "40px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    padding: "0 10px",
    boxSizing: "border-box",
    fontSize: "16px",
    transition: "border-color 0.3s ease",
  },
  select: {
    width: "100%",
    height: "40px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    padding: "0 10px",
    boxSizing: "border-box",
    fontSize: "16px",
    backgroundColor: "white",
    transition: "border-color 0.3s ease",
  },
  errorMessage: {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "5px",
    fontWeight: "500",
  },
  validatingMessage: {
    color: "#6c757d",
    fontSize: "12px",
    marginTop: "5px",
    fontStyle: "italic",
  },
  characterCount: {
    fontSize: "12px",
    color: "#6c757d",
    marginTop: "2px",
    textAlign: "right",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  button: {
    padding: "15px 40px",
    borderRadius: "5px",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontSize: "16px",
  },
  addButton: {
    backgroundColor: "#007bff",
  },
  addButtonHover: {
    backgroundColor: "#0056b3",
  },
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
  message: {
    padding: "12px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid transparent",
    fontWeight: "500",
  },
};

export default HomeScreen;
