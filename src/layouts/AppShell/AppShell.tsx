import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider, useTheme } from '@mui/material';
import { 
  DashboardRounded, 
  CampaignRounded, 
  DescriptionRounded, 
  SettingsRounded, 
  MenuBookRounded, 
  ChevronLeftRounded, 
  ChevronRightRounded,
  HelpCenterRounded
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationBannerContainer } from '@/features/notifications/components/NotificationBannerContainer';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardRounded sx={{ fontSize: 18 }} />, path: '/' },
  { label: 'Release Notes', icon: <CampaignRounded sx={{ fontSize: 18 }} />, path: '/release-notes' },
  { label: 'Help Center', icon: <HelpCenterRounded sx={{ fontSize: 18 }} />, path: '/help' },
  { label: 'Knowledge Base', icon: <MenuBookRounded sx={{ fontSize: 18 }} />, path: '/faqs' },
  { label: 'Notifications', icon: <CampaignRounded sx={{ fontSize: 18, transform: 'rotate(15deg)' }} />, path: '/notifications' },
];

const DEMO_ITEMS = [
  { label: 'Basic Demo', icon: <ChevronRightRounded sx={{ fontSize: 16 }} />, path: '/basic-demo' },
  { label: 'Advanced Demo', icon: <ChevronRightRounded sx={{ fontSize: 16 }} />, path: '/advanced-demo' },
  { label: 'Enterprise Demo', icon: <ChevronRightRounded sx={{ fontSize: 16 }} />, path: '/enterprise-demo' },
];

const SECONDARY_NAV_ITEMS = [
  { label: 'Documentation', icon: <DescriptionRounded sx={{ fontSize: 18 }} />, path: '/docs' },
  { label: 'Configuration', icon: <SettingsRounded sx={{ fontSize: 18 }} />, path: '/config' },
];

/**
 * Enterprise App Shell
 * Provides the main navigation and structural layout
 */
export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', width: '100%' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar variant="dense">
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <CampaignRounded sx={{ fontSize: 20, color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'primary.main' }}>
              ReleaseHub
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: DRAWER_WIDTH, 
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          },
        }}
      >
        <Toolbar variant="dense" />
        <Box sx={{ overflow: 'auto', py: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List dense sx={{ px: 1 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton 
                    selected={isActive}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 1.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '& .MuiListItemIcon-root': { color: 'inherit' },
                        '&:hover': { bgcolor: 'primary.dark' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }} 
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ mt: 2 }}>
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>
              Showcase Demos
            </Typography>
            <List dense sx={{ px: 1 }}>
              {DEMO_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                      selected={isActive}
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: 1.5,
                        '&.Mui-selected': {
                          bgcolor: 'secondary.light',
                          color: 'secondary.contrastText',
                          '& .MuiListItemIcon-root': { color: 'inherit' },
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: isActive ? 600 : 500 }}/>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          
          <Box sx={{ mt: 'auto', p: 1 }}>
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>
              System
            </Typography>
            <List dense>
              {SECONDARY_NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                      selected={isActive}
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: 1.5,
                        '&.Mui-selected': {
                          bgcolor: 'secondary.main',
                          color: 'common.white',
                          '& .MuiListItemIcon-root': { color: 'inherit' },
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}/>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          pt: 8,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <NotificationBannerContainer />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};
