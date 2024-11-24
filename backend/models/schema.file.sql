-- This is the schema used in this project

-- User table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- contacts table
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Foreign key linking to the user who owns the contact
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone_number_1 VARCHAR(15),
    phone_number_2 VARCHAR(15),
    address TEXT,
    is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete flag
    deleted_at TIMESTAMP NULL DEFAULT NULL, -- Timestamp for soft delete tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Indexes for optimized searching
CREATE INDEX idx_full_name ON contacts (first_name, last_name);
CREATE INDEX idx_email ON contacts (email);
CREATE INDEX idx_phone_number ON contacts (phone_number_1, phone_number_2);
CREATE INDEX idx_is_deleted ON contacts (is_deleted);
