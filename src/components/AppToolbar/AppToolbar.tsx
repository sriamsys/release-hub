import React from 'react';
import { Box, Stack, Divider, Typography } from '@mui/material';

interface AppToolbarProps {
  title?: string;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  noDivider?: boolean;
}

/**
 * Enterprise toolbar for page-level actions
 */
export const AppToolbar: React.FC<AppToolbarProps> = ({ 
  title, 
  leftActions, 
  rightActions,
  noDivider = false
}) => {
  return (
    <Box>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ minHeight: 56, py: 1 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
              {title}
            </Typography>
          )}
          {leftActions}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {rightActions}
        </Stack>
      </Stack>
      {!noDivider && <Divider />}
    </Box>
  );
};
