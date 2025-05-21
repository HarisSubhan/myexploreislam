import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
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
  ThemeProvider,
  createTheme
} from '@mui/material';
import ParentHeader from '../../../src/components/parent/ParentHeader';
import {
  Home as HomeIcon,
  Article as ArticleIcon,
  OndemandVideo as VideosIcon,
  Info as AboutIcon,
  Dashboard as DashboardIcon,
  BarChart as ReportsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const NAVIGATION = [
  { kind: 'header', title: 'Main Menu' },
  { path: '/parent', title: 'Home', icon: <HomeIcon /> },
  { path: '/parent/subscription', title: 'Subscription', icon: <ArticleIcon /> },
  { path: '/parent/payments', title: 'Payments', icon: <VideosIcon /> },
  { kind: 'divider' },
  { 
    path: '/parent/profile', 
    title: 'Profile', 
    icon: <DashboardIcon />,
  },
  {
    path: '/parent/changepassword',
    title: 'Change Password',
    icon: <ReportsIcon />,
  }
];

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const ParentApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => { 
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <ParentHeader 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          drawerWidth={drawerWidth}
        />
        
        <Drawer
          variant="persistent"
          open={isSidebarOpen}
          sx={{
            width: isSidebarOpen ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              marginTop: '64px',
              height: 'calc(100vh - 64px)',
              borderRight: 'none',
            },
          }}
        >
          <List component="nav">
            {NAVIGATION.map((item, index) => (
              item.kind === 'header' ? (
                <ListSubheader key={index}>{item.title}</ListSubheader>
              ) : item.kind === 'divider' ? (
                <Divider key={index} />
              ) : (
                <ListItemButton 
                  key={item.path} 
                  component={Link} 
                  to={item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              )
            ))}
          </List>
        </Drawer>
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px',
            width: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)`,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ParentApp;