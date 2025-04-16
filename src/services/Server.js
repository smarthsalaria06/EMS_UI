import express from 'express';
import fetch from 'node-fetch'; // or axios
import cors from 'cors';

const app = express();
app.use(cors());

// Custom endpoint (proxy)
app.get('/api/users', async (req, res) => {
  const response = await fetch('http://localhost:5000/users');
  const users = await response.json();
  const sanitizedUsers = users.map(u => ({ id: u.id, name: u.name })); // Hide extra data
  res.json(sanitizedUsers);
});

app.listen(4000, () => console.log('Proxy server running at http://localhost:4000'));
