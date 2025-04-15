import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';  // Adding JWT for token generation
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Path to the db.json file
const dbPath = path.join(__dirname, '../../db.json');
let dbData = {};

// Load mock data from db.json
try {
  const rawData = fs.readFileSync(dbPath, 'utf-8');
  dbData = JSON.parse(rawData);
  console.log('✅ Mock data loaded from db.json');
} catch (err) {
  console.error('❌ Failed to load db.json', err);
}

// ----------------- Login Route -----------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received with:', { username, password });

  const user = dbData.users.find(
    (u) => u.username === username && u.password === password
  );
  
  if (user) {
    console.log('User found:', user);
    const { password, ...safeUser } = user;

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respond with the user data and JWT token
    res.json({
      success: true,
      user: safeUser,
      token: token,
    });
  } else {
    console.log('Invalid credentials');
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ------------- Middleware for Token Validation -------------
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token from "Authorization: Bearer <token>"

  if (!token) {
    return res.status(403).json({ success: false, message: 'Token is missing' });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = decoded;  // Store the decoded user data in the request object
    next();
  });
};

// ------------- Protected Route (example: dashboard) -------------
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Welcome to the dashboard!', user: req.user });
});

// ------------- Fallback Route -------------
app.get('/', (req, res) => {
  res.send('Mock EMS API running ✅');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Mock server running at http://localhost:${PORT}`);
});
