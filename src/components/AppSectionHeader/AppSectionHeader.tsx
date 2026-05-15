import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';

interface AppSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  noDivider?: boolean;
}

/**
 * Standardized section header for enterprise layouts
 */
export const AppSectionHeader: React.FC<AppSectionHeaderProps> = ({ 
  title, 
  subtitle, 
  action,
  noDivider = false
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Stack>
      {!noDivider && <Divider />}
    </Box>
  );
};
