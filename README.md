# Fareed Al Sayegh Book Shop - Phase 2

## Project Description
This is an online bookstore application built with React for the frontend and Node.js/Express for the backend. It features user authentication and order management using a MySQL database.

## Features
- **User Authentication:** Sign up and Login functionality with JWT.
- **Book Catalog:** Browse available books.
- **Order Management:** Place and view orders (Backend implemented).
- **Responsive UI:** Built with Tailwind CSS and React.

## Technologies Used
- **Frontend:** React, React Router, Tailwind CSS
- **Backend:** Node.js, Express, MySQL, JWT, Bcrypt
- **Database:** MySQL

## Setup Instructions

### Prerequisites
- Node.js and npm
- MySQL Server

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASS=your_password
   DB_NAME=bookstore
   JWT_SECRET=your_secret
   ```
4. Start the server:
   ```bash
   node index.js
   ```

### Frontend Setup
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```

## Screenshots
*(Screenshots to be added in the final report)*
