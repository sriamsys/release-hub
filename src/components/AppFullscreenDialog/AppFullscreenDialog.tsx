import React from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Box, Stack } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SPRINGS, VARIANTS } from '@/constants/motion';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return (
    <Slide 
      direction="up" 
      ref={ref} 
      {...props} 
      easing={{ enter: 'cubic-bezier(0, 0, 0.2, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)' }}
      timeout={350}
    />
  );
});

interface AppFullscreenDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Standardized fullscreen dialog for complex workflows (e.g. Rich Text Editing)
 * Enhanced with spring motions and premium typography.
 */
export const AppFullscreenDialog: React.FC<AppFullscreenDialogProps> = ({ 
  open, 
  onClose, 
  title, 
  children,
  action
}) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: { bgcolor: 'background.default' }
      }}
    >
      <AppBar sx={{ position: 'relative', bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={{ mr: 2 }}
          >
            <X size={20} />
          </IconButton>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <Maximize2 size={16} color="#64748b" />
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }} variant="h6">
              {title}
            </Typography>
          </Stack>
          {action && <Box>{action}</Box>}
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 6 }, bgcolor: 'background.default' }}>
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={SPRINGS.gentle}
              style={{ height: '100%' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Dialog>
  );
};
