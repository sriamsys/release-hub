import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, 
  Button, Stack, Box 
} from '@mui/material';
import { WarningRounded } from '@mui/icons-material';

interface AppDeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName?: string;
  message?: string;
}

export const AppDeleteConfirmationModal: React.FC<AppDeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  itemName = 'this item',
  message
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'error.light', color: 'error.main', display: 'flex' }}>
            <WarningRounded sx={{ fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message || (
            <>
              Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
            </>
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Delete Permanently</Button>
      </DialogActions>
    </Dialog>
  );
};
