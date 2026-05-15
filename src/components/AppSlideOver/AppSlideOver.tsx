import React from 'react';
import { Box, Drawer, Typography, IconButton, Stack, Divider, styled } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';

import { SPRINGS } from '@/constants/motion';

const DRAWER_WIDTH = 380;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    borderLeft: `1px solid ${theme.palette.divider}`,
    boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.08)',
    bgcolor: theme.palette.background.default
  },
}));

interface AppSlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Enterprise slide-over panel foundation
 */
export const AppSlideOver: React.FC<AppSlideOverProps> = ({
  open,
  onClose,
  title,
  children,
  actions
}) => {
  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      BackdropProps={{ sx: { bgcolor: 'rgba(15, 23, 42, 0.1)', backdropFilter: 'blur(1px)' } }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            {title}
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseRounded sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        
        <Divider />
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRINGS.gentle, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </Box>
        
        {actions && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              {actions}
            </Box>
          </>
        )}
      </Box>
    </StyledDrawer>
  );
};
