import bcrypt from 'bcryptjs';
import db from '../models/schema.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

// Register a new user
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                                  [username, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error during registration:", error);  
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateTokenAndSetCookie(res, user.id); 
    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

