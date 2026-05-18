import React from 'react';
import { 
  Paper, 
  Typography, 
  IconButton, 
  Box, 
  useTheme,
  alpha
} from '@mui/material';
import { 
  CloseRounded, 
  InfoRounded, 
  WarningRounded, 
  CheckCircleRounded, 
  ErrorRounded, 
  WifiOffRounded 
} from '@mui/icons-material';
import { motion } from 'motion/react';
import { Notification, NotificationType } from '../types';

interface NotificationBannerProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const getIcon = (type: NotificationType) => {
  const sx = { fontSize: 20 };
  switch (type) {
    case 'info': return <InfoRounded sx={sx} />;
    case 'warning': return <WarningRounded sx={sx} />;
    case 'success': return <CheckCircleRounded sx={sx} />;
    case 'error': return <ErrorRounded sx={sx} />;
    case 'outage': return <WifiOffRounded sx={sx} />;
    default: return <InfoRounded sx={sx} />;
  }
};

const getColorMapping = (type: NotificationType, theme: any) => {
  switch (type) {
    case 'info': return {
      bg: theme.palette.info.light,
      border: theme.palette.info.main,
      text: theme.palette.info.contrastText,
      icon: theme.palette.info.main
    };
    case 'warning': return {
      bg: theme.palette.warning.light,
      border: theme.palette.warning.main,
      text: theme.palette.warning.contrastText,
      icon: theme.palette.warning.main
    };
    case 'success': return {
      bg: theme.palette.success.light,
      border: theme.palette.success.main,
      text: theme.palette.success.contrastText,
      icon: theme.palette.success.main
    };
    case 'error': return {
      bg: theme.palette.error.light,
      border: theme.palette.error.main,
      text: theme.palette.error.contrastText,
      icon: theme.palette.error.main
    };
    case 'outage': return {
      bg: theme.palette.common.black,
      border: theme.palette.error.main,
      text: theme.palette.common.white,
      icon: theme.palette.error.main,
      isStrong: true
    };
    default: return {
      bg: theme.palette.background.paper,
      border: theme.palette.divider,
      text: theme.palette.text.primary,
      icon: theme.palette.primary.main
    };
  }
};

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification, onDismiss }) => {
  const theme = useTheme();
  const colors = getColorMapping(notification.type, theme);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, scaleY: 0 }}
      animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
      exit={{ opacity: 0, height: 0, scaleY: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      layout
    >
      <Paper
        elevation={0}
        sx={{
          mb: 1,
          p: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: colors.border,
          bgcolor: colors.bg,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          overflow: 'hidden',
          ...(colors.isStrong && {
            animation: 'pulseOutage 2s infinite cubic-bezier(0.4, 0, 0.6, 1)',
            '@keyframes pulseOutage': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.92 },
            }
          })
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, px: notification.dismissible ? 4 : 2 }}>
          <Box sx={{ color: colors.icon, display: 'flex' }}>
            {getIcon(notification.type)}
          </Box>
          
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, color: colors.isStrong ? 'white' : 'inherit' }}>
              {notification.title}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.9, color: colors.isStrong ? 'rgba(255,255,255,0.8)' : 'inherit' }}>
              {notification.description}
            </Typography>
            {notification.validUntil && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic', opacity: 0.7, color: colors.isStrong ? 'rgba(255,255,255,0.6)' : 'inherit' }}>
                Valid until: {new Date(notification.validUntil).toLocaleString()}
              </Typography>
            )}
          </Box>

          {notification.dismissible && (
            <IconButton 
              size="small" 
              onClick={() => onDismiss(notification.id)}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                color: colors.isStrong ? 'white' : 'inherit',
                opacity: 0.7,
                '&:hover': { opacity: 1 }
              }}
            >
              <CloseRounded fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};
