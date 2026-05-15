import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

/**
 * Standardized enterprise dialog wrapper
 */
export const AppDialog: React.FC<AppDialogProps> = ({ 
  open, 
  onClose, 
  title, 
  children, 
  actions, 
  maxWidth = 'sm', 
  fullWidth = true 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={maxWidth} 
      fullWidth={fullWidth}
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
          size="small"
        >
          <CloseRounded sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
