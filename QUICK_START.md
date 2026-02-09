# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js installed (v14 or higher)
- ✅ MongoDB running (local or cloud)
- ✅ npm or yarn installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (`MFCProject/.env`):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/candidate_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important:**

- Change `JWT_SECRET` to a strong, random string in production
- Update `MONGODB_URI` if using a remote MongoDB instance

### 3. Start MongoDB

**Local MongoDB:**

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**MongoDB Atlas (Cloud):**

- Use your connection string in `MONGODB_URI`

### 4. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

You should see:

```
Connected to MongoDB
Server running on http://localhost:5000
```

## Quick Test

### 1. Test Endpoint

```bash
curl http://localhost:5000/api/register
```

### 2. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Candidate"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response.

### 4. Create a Candidate

```bash
curl -X POST http://localhost:5000/api/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "Software Engineer",
    "resumeText": "Experienced software engineer with 5 years of experience..."
  }'
```

### 5. Get All Candidates

```bash
curl -X GET http://localhost:5000/api/candidates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

### MongoDB Connection Error

- **Error:** `MongoDB connection error`
- **Solution:** Ensure MongoDB is running and `MONGODB_URI` is correct

### Port Already in Use

- **Error:** `EADDRINUSE: address already in use`
- **Solution:** Change `PORT` in `.env` or stop the process using port 3000

### JWT Secret Missing

- **Error:** `JWT_SECRET is not defined`
- **Solution:** Ensure `.env` file exists with `JWT_SECRET` set

## Next Steps

1. Read the full [README.md](./README.md) for complete API documentation
2. Check [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for database structure
3. Review [database-schema-diagram.txt](./database-schema-diagram.txt) for visual schema

## Testing with Postman

1. Import the API endpoints into Postman
2. Set up environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (set after login)
3. Test the workflow:
   - Register → Login → Create Candidate → Get Candidates → Move Stage (Recruiter only)

## Project Structure

```
MFCBackend/
├── package.json                # Dependencies
├── .env                        # Environment variables (create this)
├── README.md                   # Full documentation
├── DATABASE_SCHEMA.md          # Database schema details
├── database-schema-diagram.txt # Visual schema diagram
├── QUICK_START.md             # This file
├── src/
│   ├── config/
          └── db.js
│   ├──controllers/         # Business logic
|         └── applicationController.js
|         └── authController.js
|         └── jobController.js
|         └── profileController.js
|
|   ├── middleware/
│         └── authMiddleware.js
|
|   ├── routes/                     # API routes
│       └── authRoutes.js
│       └── profileRoutes.js
|       └── jobRoutes.js
|       └── applicationRoutes.js
|
|   ├── models/                 # Database Structures
|       └── Application.js
|       └── Job.js
|       └── Profile.js
|       └── User.js
|
|   ├──server.js              # Main server file
```
