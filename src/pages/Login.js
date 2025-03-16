import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Alert, Paper, Typography, Box } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Paper elevation={3} className="p-8 max-w-md w-full">
        <Typography variant="h4" component="h1" className="text-center mb-6">
          Login
        </Typography>
        
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Box className="space-y-4">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            className="mt-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </div>
  );
}
