# Authentication API Project

<img src="https://github.com/user-attachments/assets/ea3b364d-5dba-489e-81b5-5142efd60212" alt="Screenshot" width="400" style="border-radius: 15px;" />

<img src="https://github.com/user-attachments/assets/887b67f3-03f7-4f53-adaa-ee70cbd01e45" alt="Screenshot" width="400" style="border-radius: 15px;" />

## Objective :
The goal of this project is to build a complete set of authentication APIs that include functionalities for user login, signup, password recovery, and token management.

## Tech Stack
**Backend:** Express.js - A web application framework for Node.js.

**Database:** MongoDB - A NoSQL database for storing user data and tokens.

## Core Features

1. Login API
Allows users to authenticate with their credentials (email & password).
Returns an access token and refresh token upon successful authentication.

2. Signup API
Allows new users to register by providing their details (e.g., name, email, password).
Hashes the password for security before storing it in the database.

3. Forgot Password API
Enables users to request a password reset if they’ve forgotten their password.
Sends an email with a reset link/token for password recovery.

4. Reset Password API
Users can set a new password using the token provided in the forgot password flow.
Validates the token and ensures it hasn’t expired before allowing the password reset.

5. Token Management
Access Token: Short-lived tokens used for authenticating API requests.
Refresh Token: Longer-lived tokens used to generate new access tokens without requiring the user to log in again.
Tokens are securely managed and stored in the database with expiration times.

## Installation and Setup
1. Clone the repository

```git clone https://github.com/hb99960/Coders-Boutique.git```

2. Navigate into the project directory:

```cd backend```

3. Create a .env file in the root directory and add your environment variables:
```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
4. Start the development server:

```npm run dev```


5. The API will be available at http://localhost:3000/api/auth


## API Endpoints

1. Signup

   POST `http://localhost:3000/api/auth/signup`
   
2. Logout

    POST `http://localhost:3000/api/auth/logout`
   
3. Login

   POST `http://localhost:3000/api/auth/login`
   
4. Forget Password

      POST `http://localhost:3000/api/auth/forgot-password`
   
5. Reset Password

     POST `http://localhost:3000/api/auth/reset/:token`
   
6. Reset Form

     GET `http://localhost:3000/api/auth/reset-password/:token`
