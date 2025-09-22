import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
    // Ensure users table exists
    const createUsers = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        address VARCHAR(255),
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `;
    db.query(createUsers, (e) => {
      if (e) {
        console.error('Failed to ensure users table:', e);
      } else {
        console.log('Users table is ready');
      }
    });
  }
});


app.get('/', (_req, res) => {
  res.send('Server is running');
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const { name, email, address, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO users (name, email, address, phone, password) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, address, phone, password], (err, result) => {
    if (err) {
      console.error('Register error:', err);
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));