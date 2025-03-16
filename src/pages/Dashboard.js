import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, get, set } from 'firebase/database';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    netlifyRepo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  async function loadUserData() {
    if (!currentUser) return;
    
    try {
      const userRef = ref(db, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData(data);
        setFormData({
          name: data.name || '',
          netlifyRepo: data.netlifyRepo || ''
        });
      }
    } catch (error) {
      setError('Failed to load user data: ' + error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      await set(ref(db, `users/${currentUser.uid}`), {
        ...userData,
        ...formData,
        email: currentUser.email
      });
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
      loadUserData();
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out: ' + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Box maxWidth="md" margin="auto">
        <Typography variant="h4" component="h1" className="mb-6">
          Dashboard
        </Typography>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        {success && <Alert severity="success" className="mb-4">{success}</Alert>}

        <Card className="mb-6">
          <CardContent>
            <Typography variant="h6" className="mb-4">Profile Information</Typography>
            
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                />
                
                <TextField
                  label="Netlify Repository URL"
                  value={formData.netlifyRepo}
                  onChange={(e) => setFormData({ ...formData, netlifyRepo: e.target.value })}
                  fullWidth
                  helperText="Enter the URL of your Netlify repository"
                />

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography>{currentUser?.email}</Typography>
                </div>
                
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                  <Typography>{userData?.name || 'Not set'}</Typography>
                </div>
                
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Netlify Repository</Typography>
                  {userData?.netlifyRepo ? (
                    <Link href={userData.netlifyRepo} target="_blank" rel="noopener noreferrer">
                      {userData.netlifyRepo}
                    </Link>
                  ) : (
                    <Typography>Not set</Typography>
                  )}
                </div>

                <Button
                  onClick={() => setEditing(true)}
                  variant="contained"
                  color="primary"
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
        >
          Log Out
        </Button>
      </Box>
    </div>
  );
}
