import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Path to the db.json file and routes.json file
const dbPath = path.join(__dirname, '../../db.json');
const routesPath = path.join(__dirname, 'routes.json');
let dbData = {};
let routes = {};

// Function to load data asynchronously
const loadData = async () => {
  try {
    const rawData = await fs.promises.readFile(dbPath, 'utf-8');
    dbData = JSON.parse(rawData);
    console.log('✅ Mock data loaded from db.json');
  } catch (err) {
    console.error('❌ Failed to load db.json', err);
  }

  try {
    const rawRoutes = await fs.promises.readFile(routesPath, 'utf-8');
    routes = JSON.parse(rawRoutes);
    console.log('✅ Routes loaded from routes.json');
  } catch (err) {
    console.error('❌ Failed to load routes.json', err);
  }
};

// ----------------- Login Route -----------------
app.post(routes.login, (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received with:', { username, password });

  const user = dbData.users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    console.log('User found:', user);
    const { password, ...safeUser } = user;

    // Default session expiration time (30 minutes for testing)
    const expiresIn = 30 * 60 * 1000; // 30 minutes in milliseconds
    const sessionExpiryTime = Date.now() + expiresIn;

    // Generate JWT token with session expiry info
    const token = jwt.sign(
      { id: user.id, username: user.username, sessionExpiryTime },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h', // token expiration
      }
    );

    // Store sessionExpiryTime in response to frontend
    res.json({
      success: true,
      user: safeUser,
      token: token,
      sessionExpiryTime, // Send expiry time to frontend
    });
  } else {
    console.log('Invalid credentials');
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});


// ------------- Middleware for Token Validation -------------
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Token received:', token); // Debugging line

  if (!token) {
    return res.status(403).json({ success: false, message: 'Token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = decoded;  // Store the decoded user data in the request object
    console.log('Decoded token:', decoded); // Debugging line
    next();
  });
};

// ------------- Protected Route (example: dashboard) -------------
app.get(routes.dashboard, verifyToken, (req, res) => {
  res.json({ success: true, message: 'Welcome to the dashboard!', user: req.user });
});

// ------------- User Management Route (for Admin UI) -------------
app.get(routes.users, verifyToken, (req, res) => {
  const usersWithoutPasswords = dbData.users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

// ------------- Fallback Route -------------
app.get(routes.fallback, (req, res) => {
  res.send('Mock EMS API running ✅');
});

// Start the server and load data
app.listen(PORT, async () => {
  await loadData();  // Load the mock data before the server starts
  console.log(`🚀 Mock server running at http://localhost:${PORT}`);
});

app.post('/renew-token', verifyToken, (req, res) => {
  const { id, username } = req.user;

  // Extend session expiration by 30 minutes
  const newSessionExpiryTime = Date.now() + 1 * 60 * 1000;

  // Generate a new JWT token with updated session expiration
  const newToken = jwt.sign(
    { id, username, sessionExpiryTime: newSessionExpiryTime },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Send new token and updated session expiry time
  res.json({ success: true, token: newToken, sessionExpiryTime: newSessionExpiryTime });
});
