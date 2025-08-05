import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, useTheme, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
<<<<<<< HEAD
import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom'; // For MenuItem links
=======
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // For MenuItem links
>>>>>>> 536343f9ad65f3ee96a1d9a0cc802b70d513fb93


import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import logo from "@images/logo.png"; 

const ParentHeader = ({
  toggleSidebar,
  darkMode,
  toggleTheme
}) => {
  const muiTheme = useTheme();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

 const handleLogout = () => {
<<<<<<< HEAD
    localStorage.removeItem("token");
    navigate("/login"); 
    // console.log("Logout action triggered");
    handleCloseUserMenu(); 
  };
=======
   localStorage.removeItem("token"); 
   handleCloseUserMenu();
   navigate("/login");
 };
>>>>>>> 536343f9ad65f3ee96a1d9a0cc802b70d513fb93

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        marginLeft: 0,
        zIndex: muiTheme.zIndex.drawer + 1,
        // No need to adjust width/marginLeft based on sidebar for a fixed AppBar
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: { xs: 1, sm: 2 } }} // Slightly less margin on xs
        >
          <MenuIcon />
        </IconButton>

        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            height: { xs: 30, sm: 40, lg:60 }, // Responsive logo height
            mr: 2,
            // display: { xs: 'none', sm: 'block' } // Keep if you want to hide on xs
          }}
        />

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: 'none', sm: 'block' } // Hide title on very small screens
          }}
        >
          Explore Islam
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            title="Toggle Theme"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton
            onClick={handleOpenUserMenu}
            color="inherit"
            title="User Profile"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar-user"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem
              component={RouterLink}
              to="/parent/profile"
              onClick={handleCloseUserMenu}
            >
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/parent/defaulttheme" 
              onClick={handleCloseUserMenu}
            >
              <Typography textAlign="center">Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ParentHeader;