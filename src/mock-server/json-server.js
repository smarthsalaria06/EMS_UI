import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints'; // Import the library

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
    console.log('✅ Routes object:', routes);
  } catch (err) {
    console.error('❌ Failed to load routes.json', err);
  }
};

// ------------- Root Route -------------
app.get('/', (req, res) => {
  res.send('EMS Mock Server is running ✅');
});

// ----------------- Login Route -----------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received with:', { username, password });

  // Find the user from dbData
  const user = dbData.users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    console.log('User found:', user);
    const { password, ...safeUser } = user;  // Exclude the password from the user data in the response

    // Get session expiration time from .env (default to 30 minutes if not set)
    const sessionExpiryTime = Date.now() + (process.env.TOKEN_EXPIRY || 30 * 60 * 1000); // Session expiration from .env or default 30 minutes

    // Generate JWT token with session expiry info
    const token = jwt.sign(
      { id: user.id, username: user.username, sessionExpiryTime },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRY || '1h', // token expiration from .env (or default 1 hour)
      }
    );

    // Send JSON response with user info, token, and session expiry time
    return res.json({
      success: true,
      user: safeUser,
      token: token,
      sessionExpiryTime,  // Send session expiration time to the client
    });
  } else {
    // If credentials are invalid, return a 401 status code with an error message
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ------------- Middleware for Token Validation -------------
const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  const token = tokenHeader?.split(' ')[1];

  console.log('[verifyToken] Header:', tokenHeader);
  console.log('[verifyToken] Token:', token);

  if (!token) {
    return res.status(403).json({ success: false, message: 'Token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('[verifyToken] Invalid token:', err);
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    if (decoded.sessionExpiryTime < Date.now()) {
      console.warn('[verifyToken] Session expired');
      return res.status(403).json({ success: false, message: 'Session has expired' });
    }

    console.log('[verifyToken] Valid token for user:', decoded.username);
    req.user = decoded;
    next();
  });
};


// ------------- Protected Route (example: dashboard) -------------
app.get(routes.dashboard, verifyToken, (req, res) => {
  res.json({ success: true, message: 'Welcome to the dashboard!', user: req.user });
});

// ------------- User Management Route (for Admin UI) -------------
app.get(routes.users, verifyToken, (_, res) => {
  const usersWithoutPasswords = dbData.users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

app.get('/debug-users', (req, res) => {
  try {
    const users = dbData.users || [];
    res.json(users); // Directly returns all users (including passwords, so use with care)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});
// Add this below the existing `/debug-users` route

// ------------------- Create User -------------------
app.post('/users', verifyToken, async (req, res) => {
  try {
    const { username, password, name, email, role, access } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const existing = dbData.users.find(u => u.username === username);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username already exists.' });
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      name,
      email,
      role: role || 'user',
      access: Array.isArray(access) ? access : []
    };

    dbData.users.push(newUser);
    await fs.promises.writeFile(dbPath, JSON.stringify(dbData, null, 2));

    const { password: _, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ------------------- Update User -------------------
app.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const index = dbData.users.findIndex(u => u.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = {
      ...dbData.users[index],
      ...req.body,
      id // Ensure ID is not changed
    };

    dbData.users[index] = updated;
    await fs.promises.writeFile(dbPath, JSON.stringify(dbData, null, 2));

    const { password: _, ...safeUser } = updated;
    res.json(safeUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ------------------- Delete User -------------------
app.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = dbData.users.length;
    dbData.users = dbData.users.filter(u => u.id !== id);

    if (dbData.users.length === initialLength) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await fs.promises.writeFile(dbPath, JSON.stringify(dbData, null, 2));
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ------------- Fallback Route -------------
app.get(routes.fallback, (req, res) => {
  res.send('Mock EMS API running ✅');
});

// ------------- Token Renewal Route -------------
app.post('/renew-token', verifyToken, (req, res) => {
  const { id, username } = req.user;

  // Extend session expiration by the value from the .env file
  const newSessionExpiryTime = Date.now() + (process.env.TOKEN_EXPIRY || 30 * 60 * 1000);

  // Generate a new JWT token with updated session expiration
  const newToken = jwt.sign(
    { id, username, sessionExpiryTime: newSessionExpiryTime },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY || '1h' }
  );

  // Send new token and updated session expiry time
  res.json({ success: true, token: newToken, sessionExpiryTime: newSessionExpiryTime });
});

// Start the server and load data
app.listen(PORT, async () => {
  await loadData();  // Load the mock data before the server starts
  console.log(`🚀 Mock server running at http://localhost:${PORT}`);

  // List all registered routes using express-list-endpoints
  const endpoints = listEndpoints(app);
  endpoints.forEach((endpoint) => {
    console.log(`${endpoint.methods.join(' | ')} ${endpoint.path}`);
  });
});
