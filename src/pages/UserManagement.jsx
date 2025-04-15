import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Button,
  Modal, TextField, Box, IconButton, MenuItem, Checkbox, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const roles = ['admin', 'operator', 'viewer']; // Add custom roles here
const pages = ['dashboard', 'live-metrics', 'user-management', 'settings'];

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper',
  boxShadow: 24, p: 4, borderRadius: '8px'
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '', password: '', name: '', email: '', role: 'admin', access: []
  });

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(
      user || { username: '', password: '', name: '', email: '', role: 'admin', access: [] }
    );
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormData({ username: '', password: '', name: '', email: '', role: 'admin', access: [] });
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
    if (editingUser) {
      await axios.put(`http://localhost:5000/users/${editingUser.id}`, formData);
    } else {
      await axios.post('http://localhost:5000/users', formData);
    }
    handleClose();
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Management</h2>
      <Button variant="contained" onClick={() => handleOpen()}>Add New User</Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell><TableCell>Username</TableCell><TableCell>Email</TableCell>
            <TableCell>Role</TableCell><TableCell>Access</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
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
          ))}
        </TableBody>
      </Table>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h3>{editingUser ? 'Edit User' : 'Add User'}</h3>
          <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" />
          <TextField fullWidth select label="Role" name="role" value={formData.role} onChange={handleChange} margin="normal">
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
