import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, get, set, remove } from 'firebase/database';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Typography,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function AdminPanel() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    netlifyRepo: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        setUsers(Object.entries(usersData).map(([id, data]) => ({ id, ...data })));
      }
    } catch (error) {
      setError('Failed to load users: ' + error.message);
    }
  }

  function handleOpenDialog(user = null) {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        netlifyRepo: user.netlifyRepo || '',
        role: user.role || 'user'
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        netlifyRepo: '',
        role: 'user'
      });
    }
    setOpenDialog(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const userId = selectedUser ? selectedUser.id : Date.now().toString();
      await set(ref(db, `users/${userId}`), formData);
      setSuccess(selectedUser ? 'User updated successfully!' : 'User added successfully!');
      setOpenDialog(false);
      loadUsers();
    } catch (error) {
      setError('Failed to save user: ' + error.message);
    }
  }

  async function handleDelete(userId) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await remove(ref(db, `users/${userId}`));
        setSuccess('User deleted successfully!');
        loadUsers();
      } catch (error) {
        setError('Failed to delete user: ' + error.message);
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add New User
        </Button>
      </div>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Netlify Repo</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.netlifyRepo}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <div className="space-y-4">
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Netlify Repository URL"
                value={formData.netlifyRepo}
                onChange={(e) => setFormData({ ...formData, netlifyRepo: e.target.value })}
                fullWidth
              />
              <TextField
                select
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </TextField>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedUser ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
