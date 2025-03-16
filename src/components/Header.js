import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { sm: 'none' } }}
          onClick={handleMobileMenu}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component={RouterLink} to="/" sx={{ 
          flexGrow: 1,
          textDecoration: 'none',
          color: 'inherit'
        }}>
          Account Management
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          {currentUser && (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={RouterLink} to="/admin">
                Admin Panel
              </Button>
              <Button color="inherit" component={RouterLink} to="/import">
                Import Users
              </Button>
              <IconButton
                color="inherit"
                onClick={handleMenu}
                aria-label="account"
              >
                <AccountCircle />
              </IconButton>
            </>
          )}
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} component={RouterLink} to="/dashboard">
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleClose}
        >
          {currentUser && (
            <>
              <MenuItem onClick={handleClose} component={RouterLink} to="/dashboard">
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleClose} component={RouterLink} to="/admin">
                Admin Panel
              </MenuItem>
              <MenuItem onClick={handleClose} component={RouterLink} to="/import">
                Import Users
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
