import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Switch, Stack, Button } from '@mui/material';
import { AppSlideOver } from '@/components';
import { DragIndicatorRounded } from '@mui/icons-material';

interface ColumnsPanelProps {
  open: boolean;
  onClose: () => void;
}

const COLUMNS = [
  { id: 'version', label: 'Version', visible: true },
  { id: 'title', label: 'Title', visible: true },
  { id: 'audience', label: 'Audience', visible: true },
  { id: 'releaseType', label: 'Type', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'createdBy', label: 'Author', visible: true },
  { id: 'createdAt', label: 'Created', visible: true },
  { id: 'updatedAt', label: 'Updated', visible: false },
];

export const ColumnsPanel: React.FC<ColumnsPanelProps> = ({ open, onClose }) => {
  return (
    <AppSlideOver 
      open={open} 
      onClose={onClose} 
      title="Manage Columns"
      actions={
        <Button variant="outlined" fullWidth onClick={onClose}>Reset to Default</Button>
      }
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Toggle column visibility for the release notes grid.
      </Typography>
      
      <List dense sx={{ width: '100%' }}>
        {COLUMNS.map((col) => (
          <ListItem
            key={col.id}
            sx={{ 
              px: 1, 
              mb: 0.5, 
              borderRadius: 1, 
              '&:hover': { bgcolor: 'background.default' } 
            }}
            secondaryAction={
              <Switch
                edge="end"
                size="small"
                checked={col.visible}
                disableRipple
              />
            }
          >
            <Box sx={{ mr: 1, color: 'text.disabled', display: 'flex' }}>
              <DragIndicatorRounded sx={{ fontSize: 16 }} />
            </Box>
            <ListItemText 
              primary={col.label} 
              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
            />
          </ListItem>
        ))}
      </List>
      
      <Typography variant="caption" color="text.disabled" sx={{ mt: 3, display: 'block' }}>
        Column reordering via drag-and-drop will be available in Phase 3.
      </Typography>
    </AppSlideOver>
  );
};
