# MongoDB Atlas Setup Guide for LMS

## Step 1: Get Your MongoDB Atlas Connection String

1. **Log in to MongoDB Atlas** (https://cloud.mongodb.com/)
2. **Go to your LMS cluster**
3. **Click "Connect" button**
4. **Choose "Connect your application"**
5. **Copy the connection string** - it will look like:
   ```
   mongodb+srv://<username>:<password>@lms.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 2: Update Your .env File

1. **Open** `backend/.env` file
2. **Replace** the MONGODB_URI with your actual connection string:
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@lms.xxxxx.mongodb.net/LMS?retryWrites=true&w=majority
   ```
   
   **Important**: 
   - Replace `<username>` with your MongoDB Atlas username
   - Replace `<password>` with your MongoDB Atlas password
   - Add `/LMS` before the `?` to specify the database name
   - Make sure there are no `<` or `>` characters in the final string

## Step 3: Example Configuration

If your credentials are:
- Username: `john_doe`
- Password: `mypassword123`
- Cluster URL: `lms.abc12.mongodb.net`

Your .env file should have:
```
MONGODB_URI=mongodb+srv://john_doe:mypassword123@lms.abc12.mongodb.net/LMS?retryWrites=true&w=majority
PORT=5000
```

## Step 4: Test the Connection

1. **Start your backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Check the console** - you should see:
   ```
   Server running on port 5000
   MongoDB connected successfully
   ```

## Step 5: Database and Collection Structure

Your data will be stored in:
- **Database**: `LMS`
- **Collection**: `book`
- **Document Structure**:
  ```json
  {
    "_id": "ObjectId(...)",
    "BookID": "string",
    "BookTitle": "string", 
    "BookAvailability": "Available|Not Available|Reserved",
    "BookPrice": "number",
    "BookAuthor": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```

## Troubleshooting

**If connection fails:**
1. Check your username/password are correct
2. Make sure your IP address is whitelisted in Atlas
3. Verify the cluster name and connection string
4. Check if the database user has read/write permissions

**Security Notes:**
- Never commit your .env file to version control
- Use strong passwords for your database users
- Restrict IP access in Atlas security settings