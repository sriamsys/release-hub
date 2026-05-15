import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, 
  Button, Stack, Box 
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'error.light', color: 'error.main', display: 'flex' }}>
            <AlertTriangle size={24} />
          </Box>
          <Typography variant="h6" fontWeight={700}>Delete Release?</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone and will permanently remove the release documentation.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Delete Permanently</Button>
      </DialogActions>
    </Dialog>
  );
};
