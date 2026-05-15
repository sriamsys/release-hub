import React from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface AppEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * Standardized empty state component
 */
export const AppEmptyState: React.FC<AppEmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 6, 
        textAlign: 'center', 
        bgcolor: 'background.default', 
        borderStyle: 'dashed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300
      }}
    >
      {Icon && <Icon size={48} style={{ marginBottom: '16px', color: '#94a3b8' }} />}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
          {description}
        </Typography>
      )}
      {action && <Box>{action}</Box>}
    </Paper>
  );
};
