import React, { useState } from "react";

const HomeScreen = () => {
  const [bookData, setBookData] = useState({
    BookID: "",
    BookTitle: "",
    BookAvailability: "",
    BookPrice: "",
    BookAuthor: "",
  });

  // Track hover states
  const [isAddHover, setIsAddHover] = useState(false);
  const [isDeleteHover, setIsDeleteHover] = useState(false);

  const handleInputChange = (name, value) => {
    setBookData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Book Data:", bookData);
  };

  const handleDelete = () => {
    console.log("Delete book with ISBN:", bookData.isbn);
  };

  return (
    <div style={style.container}>
        <h1 style={style.mainHeading}>Library Management System</h1>
        <div style={style.headerLine}></div>
        <h2 style={style.heading}>Insert Book Information</h2>

      <div style={style.inputContainer}>
        <input
          style={style.input}
          type="number"
          placeholder="Book ID"
          value={bookData.BookID}
          onChange={(e) => handleInputChange("BookID", e.target.value)}
        />
        <input
          style={style.input}
          type="text"
          placeholder="Book Title"
          value={bookData.BookTitle}
          onChange={(e) => handleInputChange("BookTitle", e.target.value)}
        />
        <input
          style={style.input}
          type="text"
          placeholder="Book Availability"
          value={bookData.BookAvailability}
          onChange={(e) => handleInputChange("BookAvailability", e.target.value)}
        />
        <input
          style={style.input}
          type="number"
          placeholder="Book Price"
          value={bookData.BookPrice}
          onChange={(e) => handleInputChange("BookPrice", e.target.value)}
        />
        <input
          style={style.input}
          type="text"
          placeholder="Book Author"
          value={bookData.BookAuthor}
          onChange={(e) => handleInputChange("BookAuthor", e.target.value)}
        />

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
    // borderBottom: "2px solid #007bff",
  },
  inputContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  input: {
    width: "100%",
    height: "40px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "15px",
    padding: "0 10px",
    boxSizing: "border-box",
  },
    buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  button: {
    padding: "15px 40px",
    borderRadius: "5px",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  addButton: {
    backgroundColor: "#007bff",
  },
  addButtonHover: {
    backgroundColor: "#0056b3",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  deleteButtonHover: {
    backgroundColor: "#c82333",
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
};

export default HomeScreen;
