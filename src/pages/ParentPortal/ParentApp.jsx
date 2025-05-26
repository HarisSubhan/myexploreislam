import React, { useMemo, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  CssBaseline,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  ThemeProvider as MuiThemeProvider,
  createTheme,
  useTheme as useMuiTheme,
  useMediaQuery,
} from "@mui/material";
import ParentHeader from "../../../src/components/parent/ParentHeader";
import {
  Home as HomeIcon,
  Article as ArticleIcon,
  Payment as PaymentIcon,
  AccountCircle as ProfileIcon,
  LockReset as ChangePasswordIcon,
  Palette as ThemeIcon,
} from "@mui/icons-material";
import { useTheme } from "../../context/ThemeContext";

const drawerWidth = 240;

const NAVIGATION = [
  { kind: "header", title: "Main Menu" },
  { path: "/parent", title: "Home", icon: <HomeIcon /> },
  {
    path: "/parent/subscription",
    title: "Subscription",
    icon: <ArticleIcon />,
  },
  { path: "/parent/payments", title: "Payments", icon: <PaymentIcon /> },
  { kind: "divider" },
  {
    path: "/parent/profile",
    title: "Profile",
    icon: <ProfileIcon />,
  },
  {
    path: "/parent/changepassword",
    title: "Change Password",
    icon: <ChangePasswordIcon />,
  },
  {
    path: "/parent/defaulttheme",
    title: "Theme Settings",
    icon: <ThemeIcon />,
  },
];

const ParentApp = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { color: themeColor, textColor } = useTheme();
  const muiGlobalTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiGlobalTheme.breakpoints.down("md"));

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleThemeMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: themeColor,
            contrastText: textColor,
          },
          secondary: {
            main: darkMode ? "#90caf9" : "#1976d2",
          },
          background: {
            default: darkMode ? "#121212" : "#f5f5f5",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: themeColor,
                color: textColor,
                transition: "all 0.3s ease",
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
                transition: "all 0.3s ease",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                "&.Mui-selected": {
                  backgroundColor: `${themeColor} !important`,
                  color: textColor,
                  "& .MuiListItemIcon-root": {
                    color: textColor,
                  },
                },
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
                },
              },
            },
          },
        },
      }),
    [darkMode, themeColor, textColor]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <ParentHeader
          toggleSidebar={toggleSidebar}
          darkMode={darkMode}
          toggleTheme={toggleThemeMode}
        />
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          open={isSidebarOpen}
          onClose={toggleSidebar}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              marginTop: "64px",
              height: "calc(100vh - 64px)",
              borderRight: "none",
              ...(isMobile && {
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }),
            },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <List component="nav" sx={{ pt: 1 }}>
            {NAVIGATION.map((item, index) =>
              item.kind === "header" ? (
                <ListSubheader key={index} sx={{ bgcolor: "transparent" }}>
                  {item.title}
                </ListSubheader>
              ) : item.kind === "divider" ? (
                <Divider key={index} sx={{ my: 1 }} />
              ) : (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              )
            )}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: "64px",
            marginLeft: { md: isSidebarOpen ? `${drawerWidth}px` : 0 },
            width: { md: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </MuiThemeProvider>
  );
};

export default ParentApp;
