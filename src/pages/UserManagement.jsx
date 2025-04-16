import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Button,
  Modal, TextField, Box, IconButton, MenuItem, Checkbox, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const roles = ['admin', 'operator', 'viewer'];
const pages = ['dashboard', 'live-metrics', 'user-management', 'settings'];

const modalStyle = {
  position: 'absolute',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper',
  boxShadow: 24, p: 4, borderRadius: '8px'
};

// ✅ Use sessionStorage and correct token key
const getAuthConfig = () => {
  const token = sessionStorage.getItem('authToken');
  console.log('Retrieved token from sessionStorage:', token);
  if (!token) console.warn('⚠️ No token found in sessionStorage');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '', password: '', name: '', email: '', role: 'admin', access: []
  });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users', getAuthConfig());
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error('Invalid response format:', res.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err.response?.data || err.message);
      setError('Failed to fetch users. Please login again or try later.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(user || {
      username: '', password: '', name: '', email: '', role: 'admin', access: []
    });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormData({ username: '', password: '', name: '', email: '', role: 'admin', access: [] });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (page) => {
    setFormData(prev => ({
      ...prev,
      access: prev.access.includes(page)
        ? prev.access.filter(p => p !== page)
        : [...prev.access, page]
    }));
  };

  const handleSubmit = async () => {
    const { username, password, name, email } = formData;

    if (!username || (!editingUser && !password) || !name || !email) {
      setError('All fields (except password during edit) are required.');
      return;
    }

    try {
      if (editingUser) {
        // Don't send empty password if unchanged
        const payload = { ...formData };
        if (!formData.password) delete payload.password;

        await axios.put(
          `http://localhost:5000/users/${editingUser.id}`,
          payload,
          getAuthConfig()
        );
      } else {
        await axios.post('http://localhost:5000/users', formData, getAuthConfig());
      }
      handleClose();
      fetchUsers();
    } catch (err) {
      console.error('Save failed:', err.response?.data || err.message);
      setError('Failed to save user. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, getAuthConfig());
      fetchUsers();
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
      setError('Failed to delete user.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Management</h2>
      <Button variant="contained" onClick={() => handleOpen()}>Add New User</Button>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Access</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">No users found</TableCell>
            </TableRow>
          ) : (
            users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.access?.join(', ')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(user)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h3>{editingUser ? 'Edit User' : 'Add User'}</h3>
          <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} margin="normal" />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            placeholder={editingUser ? 'Leave blank to keep existing' : ''}
          />
          <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" />
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Page Access:</strong></p>
            {pages.map(page => (
              <FormControlLabel
                key={page}
                control={
                  <Checkbox
                    checked={formData.access.includes(page)}
                    onChange={() => handleCheckboxChange(page)}
                  />
                }
                label={page}
              />
            ))}
          </div>
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            {editingUser ? 'Update User' : 'Create User'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserManagement;
