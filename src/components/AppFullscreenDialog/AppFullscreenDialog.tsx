import React from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Box, Stack } from '@mui/material';
import { CloseRounded, OpenInFull, CloseFullscreen } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { motion, AnimatePresence } from 'motion/react';
import { SPRINGS, VARIANTS } from '@/constants/motion';
import { AppFullscreenProvider, useAppFullscreen } from './AppFullscreenContext';

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

const FullscreenDialogContent: React.FC<AppFullscreenDialogProps> = ({ 
  open, 
  onClose, 
  title, 
  children,
  action
}) => {
  const { isMaximized, toggleMaximize } = useAppFullscreen();

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        onClose();
      }}
      TransitionComponent={Transition}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: { 
          bgcolor: 'background.default',
          width: isMaximized ? '98vw' : '70vw',
          height: isMaximized ? '96vh' : '80vh',
          maxHeight: '96vh',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          m: 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: isMaximized ? 0 : 3
        }
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,0.4)' }
        }
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
            <CloseRounded sx={{ fontSize: 20 }} />
          </IconButton>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleMaximize(); }} sx={{ color: "text.secondary" }}>
              {isMaximized ? <CloseFullscreen sx={{ fontSize: 18 }} /> : <OpenInFull sx={{ fontSize: 18 }} />}
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }} variant="h6">
              {title}
            </Typography>
          </Stack>
          {action && <Box>{action}</Box>}
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'background.default' }}>
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={SPRINGS.gentle}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Dialog>
  );
};

export const AppFullscreenDialog: React.FC<AppFullscreenDialogProps> = (props) => {
  return (
    <AppFullscreenProvider>
      <FullscreenDialogContent {...props} />
    </AppFullscreenProvider>
  );
};
