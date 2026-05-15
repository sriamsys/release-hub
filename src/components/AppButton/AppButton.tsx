import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { motion } from 'motion/react';

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
  component?: any;
  to?: string;
}

/**
 * Reusable enterprise button with loading state and motion feedback.
 */
export const AppButton: React.FC<AppButtonProps> = ({ 
  children, 
  loading, 
  disabled, 
  startIcon, 
  sx,
  ...props 
}) => {
  return (
    <Button
      component={motion.button}
      // @ts-ignore - motion props compatible with MUI component prop
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 1.5,
        ...sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
