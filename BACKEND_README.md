# Backend Setup Instructions

## Prerequisites
- MongoDB installed on your computer OR MongoDB Atlas account

## Setup Steps

### Option 1: Local MongoDB (Easiest for development)

1. **Install MongoDB** (if not already installed):
   - Mac: `brew install mongodb-community`
   - Or download from: https://www.mongodb.com/try/download/community

2. **Start MongoDB**:
   ```bash
   brew services start mongodb-community
   ```
   Or manually: `mongod`

3. **Start the backend server**:
   ```bash
   npm run server
   ```

4. **In another terminal, start the frontend**:
   ```bash
   npm run dev
   ```

### Option 2: MongoDB Atlas (Cloud database)

1. **Create free account**: https://www.mongodb.com/cloud/atlas/register

2. **Create a cluster** and get connection string

3. **Update `.env` file**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hint-pe-hint
   ```

4. **Start servers** (same as Option 1, steps 3-4)

## API Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth token)

## Testing the App

1. Open browser: `http://localhost:8080`
2. Click "Sign Up" and create an account
3. All fields are required:
   - Username (unique)
   - Full Name
   - Email (unique)
   - Date of Birth
   - Password (min 6 characters)
   - Confirm Password
4. After signup, you're automatically logged in
5. Click profile icon to see user details
6. Click "Log out" to logout

## Database Structure

### User Schema:
- `userId` - Auto-generated unique ID (e.g., USERXYZ123)
- `username` - Unique username (lowercase)
- `name` - Full name
- `email` - Unique email (lowercase)
- `dateOfBirth` - Date of birth
- `password` - Hashed password (bcrypt)
- `createdAt` - Account creation timestamp

## Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Unique username and email validation
- ✅ Auto-generated unique user IDs
- ✅ Password confirmation validation
