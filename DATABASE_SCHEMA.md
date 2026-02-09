# Database Schema Documentation

This document describes the database schema for the Candidate Management API.

## Overview

The database uses MongoDB with Mongoose ODM. There are two main collections: `users` and `candidates`.

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER Collection                          │
├─────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (Primary Key)                                      │
│ name: String (required)                                          │
│ email: String (required, unique, indexed)                         │
│ password: String (required, hashed, not returned by default)    │
│ role: String (enum: ['Candidate', 'Recruiter'], required)        │
│ createdAt: Date (auto)                                           │
│ updatedAt: Date (auto)                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (appliedBy, movedBy)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CANDIDATE Collection                        │
├─────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (Primary Key)                                      │
│ name: String (required)                                          │
│ email: String (required, unique, indexed)                        │
│ role: String (required) - Job role applying for                  │
│ resumeText: String (required)                                    │
│ stage: String (enum: ['APPLIED', 'SCREENING', 'INTERVIEW',       │
│                       'HIRED', 'REJECTED'], default: 'APPLIED')  │
│ appliedBy: ObjectId (ref: 'User', required)                      │
│ movedBy: ObjectId (ref: 'User', optional)                        │
│ stageHistory: Array [                                            │
│   {                                                              │
│     stage: String (enum),                                        │
│     movedBy: ObjectId (ref: 'User'),                             │
│     movedAt: Date,                                               │
│     notes: String (optional)                                     │
│   }                                                              │
│ ]                                                                 │
│ createdAt: Date (auto)                                           │
│ updatedAt: Date (auto)                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Schema

### User Model

**Collection Name:** `users`

| Field       | Type     | Constraints                                                      | Description              |
| ----------- | -------- | ---------------------------------------------------------------- | ------------------------ |
| `_id`       | ObjectId | Primary Key, Auto                                                | Unique identifier        |
| `name`      | String   | Required, Trimmed                                                | User's full name         |
| `email`     | String   | Required, Unique, Lowercase, Indexed, Email format               | User's email address     |
| `password`  | String   | Required, Min 6 chars, Not returned by default                   | Hashed password          |
| `role`      | String   | Required, Enum: ['Candidate', 'Recruiter'], Default: 'Candidate' | User role for RBAC       |
| `createdAt` | Date     | Auto                                                             | Timestamp of creation    |
| `updatedAt` | Date     | Auto                                                             | Timestamp of last update |

**Indexes:**

- `email`: Unique index

**Methods:**

- `comparePassword(candidatePassword)`: Compares plain text password with hashed password

**Pre-save Hooks:**

- Automatically hashes password before saving (if modified)

**Example Document:**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$hashedpassword...",
  "role": "Candidate",
}
```

### Candidate Model

**Collection Name:** `candidates`

| Field          | Type     | Constraints                                                                                    | Description                            |
| -------------- | -------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- |
| `_id`          | ObjectId | Primary Key, Auto                                                                              | Unique identifier                      |
| `name`         | String   | Required, Trimmed                                                                              | Candidate's full name                  |
| `email`        | String   | Required, Unique, Lowercase, Indexed, Email format                                             | Candidate's email                      |
| `role`         | String   | Required, Trimmed                                                                              | Job role the candidate is applying for |
| `resumeText`   | String   | Required, Trimmed                                                                              | Resume content/text                    |
| `stage`        | String   | Required, Enum: ['APPLIED', 'SCREENING', 'INTERVIEW', 'HIRED', 'REJECTED'], Default: 'APPLIED' | Current pipeline stage                 |
| `appliedBy`    | ObjectId | Required, Ref: 'User'                                                                          | User who created the application       |
| `movedBy`      | ObjectId | Optional, Ref: 'User'                                                                          | Recruiter who last moved the candidate |
| `stageHistory` | Array    | Auto-populated                                                                                 | History of all stage changes           |
| `createdAt`    | Date     | Auto                                                                                           | Timestamp of creation                  |
| `updatedAt`    | Date     | Auto                                                                                           | Timestamp of last update               |

### User → Candidate (One-to-Many)

- One User can create multiple Candidates (`appliedBy`)
- One User (Recruiter) can move multiple Candidates (`movedBy`)

### Candidate → User (Many-to-One)

- Each Candidate is created by one User (`appliedBy`)
- Each Candidate can be moved by one User at a time (`movedBy`)
- Each Candidate tracks all Users who moved them (`stageHistory[].movedBy`)

## Pipeline Stages

The candidate pipeline follows this flow:

```
APPLIED → SCREENING → INTERVIEW → HIRED
                              ↘ REJECTED
```

**Stage Rules:**

1. All candidates start at `APPLIED`
2. Sequential progression: APPLIED → SCREENING → INTERVIEW
3. Can move to `HIRED` or `REJECTED` from any stage
4. Cannot move backward in sequential stages
5. `HIRED` and `REJECTED` are terminal stages

## Database Queries Examples

### Find all candidates by a recruiter

```javascript
Candidate.find({ movedBy: recruiterId });
```

### Find candidates at a specific stage

```javascript
Candidate.find({ stage: "INTERVIEW" });
```

### Find candidate's application history

```javascript
Candidate.findById(candidateId)
  .populate("appliedBy", "name email")
  .populate("movedBy", "name email")
  .populate("stageHistory.movedBy", "name email");
```

### Find all candidates created by a user

```javascript
Candidate.find({ appliedBy: userId });
```

## Indexes for Performance

**User Collection:**

- `email`: Unique index (for fast login lookups)

**Candidate Collection:**

- `email`: Unique index (for duplicate prevention)
- `appliedBy`: Index (for filtering by creator)
- `stage`: Index (for filtering by stage)
- `createdAt`: Index (for sorting by date)

## Data Validation

### User Validation

- Email must be valid format
- Password minimum 6 characters
- Role must be 'Candidate' or 'Recruiter'

### Candidate Validation

- Email must be valid format and unique
- Stage must be one of the enum values
- All required fields must be present

## Security Considerations

1. **Password Hashing**: Passwords are hashed using bcryptjs before storage
2. **Password Selection**: Passwords are not returned in queries by default (`select: false`)
3. **Email Uniqueness**: Enforced at database level
4. **Input Validation**: Mongoose schema validation on all fields
5. **Reference Integrity**: Foreign key relationships maintained via ObjectId references
