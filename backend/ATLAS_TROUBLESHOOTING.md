# MongoDB Atlas Authentication Troubleshooting Guide

## 🔍 Current Issue: Authentication Failed

The error "bad auth : Authentication failed" typically occurs due to one of these reasons:

### 1. **Password Special Characters** (Most Likely)
Your password `DYXLkcjKjdósaetE` contains special characters that need URL encoding.

**Try these URL-encoded versions:**
```
Original: DYXLkcjKjdósaetE
Option 1: DYXLkcjKjd%C3%B3saetE  (current attempt)
Option 2: DYXLkcjKjd%C3%B3saetE  (alternative encoding)
```

### 2. **Username/Password Verification**
**Please verify in MongoDB Atlas:**
1. Go to Database Access in your Atlas dashboard
2. Check if username is exactly: `aryanadhav00_db_user`
3. Verify the password is: `DYXLkcjKjdósaetE`

### 3. **Create a New Database User (Recommended)**
To avoid special character issues:

1. **Go to MongoDB Atlas Dashboard**
2. **Click "Database Access"**
3. **Add New Database User**
4. **Use a simple password** (only letters and numbers)
5. **Grant "Atlas Admin" or "Read and write to any database" permissions**

Example new user:
- Username: `lms_admin`
- Password: `SimplePassword123` (no special characters)

### 4. **IP Whitelist Check**
1. Go to "Network Access" in Atlas
2. Make sure your IP is whitelisted
3. Or temporarily add `0.0.0.0/0` (allows all IPs - for testing only)

### 5. **Alternative Connection Strings to Try**

**Option A - Simple User:**
```
MONGODB_URI=mongodb+srv://lms_admin:SimplePassword123@lms.7p9bt4t.mongodb.net/LMS?retryWrites=true&w=majority
```

**Option B - Current user with different encoding:**
```
MONGODB_URI=mongodb+srv://aryanadhav00_db_user:DYXLkcjKjd%25C3%25B3saetE@lms.7p9bt4t.mongodb.net/LMS?retryWrites=true&w=majority
```

**Option C - Escape the password differently:**
```
MONGODB_URI=mongodb+srv://aryanadhav00_db_user:DYXLkcjKjdosaetE@lms.7p9bt4t.mongodb.net/LMS?retryWrites=true&w=majority
```

### 6. **Test Steps**
After making changes:
1. Save the `.env` file
2. Run: `node test-connection.js`
3. Look for "✅ Successfully connected"

### 7. **Quick Fix - Create New Simple User**
This is the fastest solution:
1. MongoDB Atlas → Database Access → Add New Database User
2. Username: `library_user`
3. Password: `Library123` (simple, no special chars)
4. Update .env:
   ```
   MONGODB_URI=mongodb+srv://library_user:Library123@lms.7p9bt4t.mongodb.net/LMS?retryWrites=true&w=majority
   ```

## 🎯 Recommended Action
Create a new database user with a simple password to avoid URL encoding issues entirely.