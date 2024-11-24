# Contact Book Web Application

A web-based contact book application built to manage and organize user contacts efficiently. This application supports adding, editing, soft-deleting, and searching contacts, along with an intuitive and user-friendly interface.

---

## Features

### Functional Features
- Add a new contact with fields like **First Name**, **Middle Name**, **Last Name**, **Email**, **Phone Numbers**, and **Address**.
- Edit existing contacts seamlessly.
- View all contacts in a **paginated format**.
- Soft delete a contact with the ability to restore it later.
- Search contacts by any field (**name**, **email**, **phone number**, etc.) in under 1 second.
- Sort all contacts by **Full Name** by default.

### Non-Functional Features
- Capable of handling **1 million contacts** efficiently.
- Operations like adding, searching, or editing contacts are optimized to take no more than 1 second.
- Clean and intuitive **User Interface**.

---

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js with Express.js
- **Database**: MySQL

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
## API Endpoints
- User Profile
GET /profile: Fetch the user profile.
Middleware: verifyToken
Contact Management
```
POST /add: Add a new contact.
PUT /edit/:id: Edit an existing contact by ID.
GET /edit/:id: Fetch contact details for editing.
GET /search-all: Search and list all contacts.
GET /search-one: Search for a single contact.
PUT /delete/:id: Soft delete a contact by ID.
GET /deleted: List all soft-deleted contacts.
PUT /restore/:id: Restore a soft-deleted contact.
```

## Environment Variables
Configure the following environment variables in a .env file:
```
ACCESS_TOKEN
JWT_SECRET
NODE_ENV

DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
```
--- 

## How to Run Locally
Clone the Repository:

git clone https://github.com/vikramchaudharyTS/contact-book.git
cd contact-book
```Install Dependencies:
npm install
```

- Set Up Environment:
Create a .env file with the above variables.

- Run Migrations:
Execute the provided SQL scripts to set up the database.

Start the Application:

```npm start```

Access the Application:
Open http://localhost:5173 in your browser.

--- 
## Contribuitors 
- Vikram Shyamvir Chaudhary


