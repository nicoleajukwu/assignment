import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const signToken = (user) => jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });


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

// Health check endpoint
app.get('/', (_req, res) => {
  res.send('Server is running');
});

// Get users endpoint
app.get('/api/users', (_req, res) => {
  const sql = 'SELECT id, name, email, address, phone FROM users ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fetch users error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Register users endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, address, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, address, phone, password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, address, phone, hashed], (err, result) => {
      if (err) {
        console.error('Register error:', err);
        if (err && err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      const user = { id: result.insertId, name, email };
      const token = signToken(user);
      res.json({ success: true, user, token });
    });
  } catch (e) {
    console.error('Register hash error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const sql = 'SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!results || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = results[0];
    try {
      let valid = false;
      if (typeof user.password === 'string' && user.password.startsWith('$2')) {
        valid = await bcrypt.compare(password, user.password);
      } else {
        valid = password === user.password;
      }
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const safeUser = { id: user.id, name: user.name, email: user.email };
      const token = signToken(safeUser);
      return res.json({ success: true, user: safeUser, token });
    } catch (e) {
      console.error('Login compare error:', e);
      return res.status(500).json({ error: 'Server error' });
    }
  });
});

// Meetings endpoints
app.get('/api/users/:id/meetings', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM meetings WHERE user_id = ? ORDER BY datetime DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Fetch meetings error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Schedule meeting endpoint
app.post('/api/schedule', (req, res) => {
  const { user_id, title, description, datetime } = req.body;
  if (!user_id || !title || !datetime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO meetings (user_id, title, description, datetime) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id, title, description, datetime], (err, result) => {
    if (err) {
      console.error('Schedule error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));