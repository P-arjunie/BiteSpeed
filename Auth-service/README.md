# Auth-service
Authentication service for the Cloud-Native Food Ordering & Delivery System. This service handles registration and login for all user roles (customer, driver, restaurant admin) and provides JWT-based authentication.

## Features

- User registration (role-based)
- Secure password hashing with bcrypt
- Login with JWT token generation
- Role support: customer, driver, restaurant-admin
- MongoDB for credential storage

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Dotenv for environment variables

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB running locally or via cloud (MongoDB Atlas)

### Installation

Clone the repository and install dependencies:

### Environment Setup

Create a .env file in the root directory and add the following:

```env
PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
```

Replace the values as needed.

### Running the Service

Start the development server:

```bash
npm run dev
```

Or for production:

```bash
npm start
```

The server will start at http://localhost:5000 by default.

## API Endpoints

Base URL: `/api/auth`

### POST /register

Registers a new user.

Request Body:

```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "role": "customer"
}
```

Response:

```json
{
  "message": "User registered successfully",
  "userId": "64f..."
}
```

### POST /login

Logs in a registered user.

Request Body:

```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

Response:

```json
{
  "token": "your_jwt_token_here"
}
```
