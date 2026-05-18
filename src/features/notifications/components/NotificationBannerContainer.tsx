import React from 'react';
import { Box, Container } from '@mui/material';
import { AnimatePresence } from 'motion/react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationBanner } from './NotificationBanner';

export const NotificationBannerContainer: React.FC = () => {
  const { notifications, dismiss } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <Box 
      sx={{ 
        width: '100%', 
        bgcolor: 'transparent',
        zIndex: (theme) => theme.zIndex.appBar - 1,
        // Ensure it doesn't have its own padding that conflicts with main container
        mb: 2
      }}
    >
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <NotificationBanner 
            key={notification.id} 
            notification={notification} 
            onDismiss={dismiss} 
          />
        ))}
      </AnimatePresence>
    </Box>
  );
};
