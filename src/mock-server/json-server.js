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

// Load mock data from db.json
try {
  const rawData = fs.readFileSync(dbPath, 'utf-8');
  dbData = JSON.parse(rawData);
  console.log('✅ Mock data loaded from db.json');
} catch (err) {
  console.error('❌ Failed to load db.json', err);
}

// Load routes from routes.json
try {
  const rawRoutes = fs.readFileSync(routesPath, 'utf-8');
  routes = JSON.parse(rawRoutes);
  console.log('✅ Routes loaded from routes.json');
} catch (err) {
  console.error('❌ Failed to load routes.json', err);
}

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

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Mock server running at http://localhost:${PORT}`);
});
