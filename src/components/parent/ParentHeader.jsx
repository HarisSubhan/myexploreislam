import React from 'react';
import { AppBar, Toolbar, IconButton, Box, TextField, InputAdornment } from '@mui/material';
import { FaBars, FaTimes } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';

const ParentHeader = ({ toggleSidebar, isSidebarOpen, drawerWidth }) => {
  return (
    <AppBar 
      position="fixed"
      sx={{ 
        width: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)`,
        backgroundColor: "white", 
        color: "black",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleSidebar} sx={{ mr: 2 }}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </IconButton>
          
          <Box>
            <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>
              EXPLORE ISLAM
            </h1>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
              Wisdom for Young Minds
            </p>
          </Box>
        </Box>
        
        <TextField
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "20px",
              width: "250px",
              backgroundColor: "#f5f5f5"
            }
          }}
          variant="outlined"
        />
      </Toolbar>
    </AppBar>
  );
};

export default ParentHeader;