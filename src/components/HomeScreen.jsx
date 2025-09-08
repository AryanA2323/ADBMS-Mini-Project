import React, { useState } from 'react';
import Insert from './Insert';
import Update from './Update';
import Delete from './Delete';
import Retrive from './Retrive';


const HomeScreen = () => {
  const [activePage, setActivePage] = useState("home");

  return (
    <div style={styles.appContainer}>
      <div style={styles.sidebar}>

        <ul style={styles.navList}>
          <li 
            style={{
              ...styles.navItem,
              ...(activePage === "home" ? styles.activeNavItem : {})
            }}
            onClick={() => setActivePage("home")}
          >
            Home
          </li>
          <li 
            style={{
              ...styles.navItem,
              ...(activePage === "insert" ? styles.activeNavItem : {})
            }}
            onClick={() => setActivePage("insert")}
          >
            Insert Book Info
          </li>
          <li 
            style={{
              ...styles.navItem,
              ...(activePage === "update" ? styles.activeNavItem : {})
            }}
            onClick={() => setActivePage("update")}
          >
            Update Book Info
          </li>
          <li 
            style={{
              ...styles.navItem,
              ...(activePage === "delete" ? styles.activeNavItem : {})
            }}
            onClick={() => setActivePage("delete")}
          >
            Delete Book Record
          </li>
          <li 
            style={{
              ...styles.navItem,
              ...(activePage === "retrieve" ? styles.activeNavItem : {})
            }}
            onClick={() => setActivePage("retrieve")}
          >
            Retrieve Book Record
          </li>
        </ul>
      </div>

      <div style={styles.content}>
        {activePage === "home" ? (
          <>
            <h1 style={styles.heading}>Library Management System</h1>
            <div style={styles.card}>
              <p style={styles.text}>
                The Library Management System is a mini-project developed as part of the Advanced Database Management Systems (ADBMS) course, focusing on the use of MongoDB, a NoSQL database, for managing and organizing library resources efficiently.
              </p>
              <p style={styles.text}>
                This project demonstrates the implementation of all CRUD (Create, Read, Update, Delete) operations to manage book records in a library database. Each book entry contains attributes such as Title, Author, ISBN, Category, and Quantity.
              </p>
            </div>
          </>
        ) : activePage === "insert" ? (
          <Insert />
        ) : activePage === "update" ? (
          <Update />
        ) : activePage === "retrieve" ? (
          <Retrive />
        ) : (
          <Delete />
        )}
      </div>
    </div>
  );
};
const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#1e3a8a",
    color: "#fff",
    padding: "20px",
  },
  navHeading: {
    fontSize: "20px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "bold",
  },
  navList: {
    listStyle: "none",
    padding: 0,
  },
  navItem: {
    padding: "12px 15px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background 0.3s ease",
    '&:hover': {
      backgroundColor: "#3b82f6",
    }
  },
  activeNavItem: {
    backgroundColor: "#3b82f6",
  },
  content: {
    flex: 1,
    padding: "40px",
    backgroundColor: "#f0f4f8",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: "30px",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: "1.7",
  },
  text: {
    fontSize: "18px",
    color: "#334155",
    marginBottom: "15px",
  }
};

export default HomeScreen;