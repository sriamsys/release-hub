import React from 'react';
import { Box, Typography, Stack, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { AppSlideOver, AppButton } from '@/components';
import { ReleaseAudience, ReleaseType, ReleaseStatus } from '../types';

interface FiltersPanelProps {
  open: boolean;
  onClose: () => void;
  // In a real app we would pass current filters and setter
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ open, onClose }) => {
  return (
    <AppSlideOver 
      open={open} 
      onClose={onClose} 
      title="Filter Releases"
      actions={
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button variant="outlined" fullWidth onClick={onClose}>Reset</Button>
          <Button variant="contained" fullWidth onClick={onClose}>Apply Filters</Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Audience</InputLabel>
          <Select label="Audience" defaultValue="All">
            <MenuItem value="All">All Audiences</MenuItem>
            <MenuItem value="Managers">Managers</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Release Type</InputLabel>
          <Select label="Release Type" defaultValue="All">
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Feature">Feature</MenuItem>
            <MenuItem value="Enhancement">Enhancement</MenuItem>
            <MenuItem value="Bug Fix">Bug Fix</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Infrastructure">Infrastructure</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select label="Status" defaultValue="All">
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
            <MenuItem value="Internal">Internal</MenuItem>
            <MenuItem value="Deprecated">Deprecated</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="caption" color="text.secondary">
          Additional filter conditions like date range and tags will be implemented in the next phase.
        </Typography>
      </Stack>
    </AppSlideOver>
  );
};
