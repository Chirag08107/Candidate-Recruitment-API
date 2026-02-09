# Candidate Management API

A RESTful API to manage a candidate's journey from application to hiring, with role-based access control (RBAC).

## Features

- **Candidate Management**: Full CRUD operations for candidates
- **Fixed Pipeline**: Sequential stages (APPLIED → SCREENING → INTERVIEW → HIRED/REJECTED)
- **RBAC**: Two roles - Candidate (view own status) and Recruiter (view all, move candidates)
- **Authentication**: JWT-based authentication
- **Stage History**: Track all stage changes with timestamps

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository and navigate to the project:

```bash
cd MFCBackend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://root:root@cluster0.tmtkhuk.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

4. Start the server:

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register a new user

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Candidate"  // or "Recruiter"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get current user profile

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Candidate Endpoints

#### Create a new candidate

```http
POST /api/candidates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "Software Engineer",
  "resumeText": "Experienced software engineer with 5 years..."
}
```

#### Get all candidates

```http
GET /api/candidates
Authorization: Bearer <token>
```

**Access:**

- **Candidate role**: Returns only their own application
- **Recruiter role**: Returns all candidates

**Response:**

```json
{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["recruiter", "candidate"],
      required: true
    }
  },
  {
    timestamps: true
  }
```

#### Get single candidate by ID

```http
GET /api/candidates/:id
Authorization: Bearer <token>
```

**Access:**

- **Candidate role**: Can only view their own application
- **Recruiter role**: Can view any candidate

#### Update candidate

```http
PUT /api/candidates/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith Updated",
  "role": "Senior Software Engineer",
  "resumeText": "Updated resume text..."
}
```

**Access:**

- **Candidate role**: Can update their own application (name, role, resumeText only)
- **Recruiter role**: Can update any candidate and any field including stage

**Note:** Candidates cannot change their email or stage. Only Recruiters can change the stage.

#### Move candidate to next stage (Recruiter only)

```http
PATCH /api/candidates/:id/move-stage
Authorization: Bearer <token>
Content-Type: application/json

{
  "nextStage": "SCREENING",
  "notes": "Passed initial screening"
}
```

**Valid stages:** `APPLIED`, `SCREENING`, `INTERVIEW`, `HIRED`, `REJECTED`

**Stage Progression Rules:**

- Sequential: APPLIED → SCREENING → INTERVIEW → HIRED/REJECTED
- Can move to HIRED or REJECTED from any stage
- Cannot move backward in sequential stages

#### Delete candidate (Recruiter only)

```http
DELETE /api/candidates/:id
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Candidate deleted successfully",
  "data": {}
}
```

## Role-Based Access Control (RBAC)

### Candidate Role

- View own application status
- Create own application
- Update own application (name, role, resumeText only)
- Cannot view other candidates
- Cannot change stage
- Cannot delete candidates

### Recruiter Role

- View all candidates
- Create candidates
- Update any candidate
- Move candidates through stages
- Delete candidates

## Pipeline Stages

The candidate journey follows this fixed pipeline:

1. **APPLIED** - Initial application submitted
2. **SCREENING** - Initial screening/review
3. **INTERVIEW** - Interview stage
4. **HIRED** - Final stage - candidate hired
5. **REJECTED** - Final stage - candidate rejected

**Stage Progression:**

- Candidates start at `APPLIED`
- Can progress sequentially: APPLIED → SCREENING → INTERVIEW
- Can be moved to `HIRED` or `REJECTED` from any stage
- Cannot move backward in sequential stages

## Error Responses

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Testing the API

### Using cURL

1. **Register a Candidate:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Candidate"
  }'
```

2. **Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. **Create Candidate (use token from login):**

```bash
curl -X POST http://localhost:5000/api/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "Software Engineer",
    "resumeText": "Experienced developer..."
  }'
```

### Using Postman

1. Import the collection (if available)
2. Set environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (set after login)
3. Run requests in sequence: Register/Login → Create Candidate → etc.

## Database Schema

See `DATABASE_SCHEMA.md` for detailed database schema diagram and relationships.

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

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Role-based access control enforced on all routes
- Input validation on all endpoints
- MongoDB injection protection via Mongoose

## License

ISC

## Support

For issues or questions, please check the documentation or create an issue in the repository.
