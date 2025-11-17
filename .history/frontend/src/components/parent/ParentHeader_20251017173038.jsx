import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "@images/logo.png";


const ParentHeader = ({ toggleSidebar, darkMode, toggleTheme }) => {
  const muiTheme = useTheme();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      // Call the logout API with role
      await authAPI.logout("parent");

      // Clear local storage and redirect regardless of API success
      localStorage.removeItem("token");
      handleCloseUserMenu();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Even if API fails, clear local storage and redirect
      localStorage.removeItem("token");
      handleCloseUserMenu();
      navigate("/login");
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        marginLeft: 0,
        zIndex: muiTheme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: { xs: 1, sm: 2 } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            height: { xs: 30, sm: 40, lg: 60 },
            mr: 2,
          }}
        />

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "block" },
          }}
        >
          Explore Islam
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            sx={{ mt: "45px" }}
            id="menu-appbar-user"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
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
