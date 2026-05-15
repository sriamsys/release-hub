import React, { useMemo, useRef } from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Box, styled, Skeleton, CircularProgress, Typography, Stack } from '@mui/material';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Register all community modules for v33
ModuleRegistry.registerModules([AllCommunityModule]);

// Styled container to enforce enterprise look
/**
 * Hardens AG Grid for production: scroll normalization and performance
 */
const GridContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  '& .ag-theme-alpine': {
    '--ag-font-family': theme.typography.fontFamily,
    '--ag-font-size': '13px',
    '--ag-header-background-color': '#f8fafc',
    '--ag-header-foreground-color': theme.palette.text.secondary,
    '--ag-header-column-separator-display': 'block',
    '--ag-header-column-separator-color': theme.palette.divider,
    '--ag-border-color': theme.palette.divider,
    '--ag-row-hover-color': '#f1f5f9',
    '--ag-selected-row-background-color': '#e2e8f0',
    '--ag-font-weight-bold': 600,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
  },
  // Custom scrollbar refinement for enterprise density
  '& ::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '& ::-webkit-scrollbar-track': {
    backgroundColor: '#f1f5f9',
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#cbd5e1',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#94a3b8',
    },
  },
}));

interface AppGridProps extends AgGridReactProps {
  height?: string | number;
  loading?: boolean;
}

/**
 * Reusable AG Grid wrapper with enterprise defaults.
 * Optimized for React 19 and AG Grid v33.
 */
export const AppGrid: React.FC<AppGridProps> = ({ 
  height = 500, 
  columnDefs, 
  defaultColDef,
  loading = false,
  ...props 
}) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const gridDefaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    ...defaultColDef,
  }), [defaultColDef]);

  // Handle ResizeObserver loop errors that sometimes happen in dev or high-density grids
  React.useEffect(() => {
    const originalError = window.console.error;
    window.console.error = (...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && (
        msg.includes('ResizeObserver') || 
        msg.includes('ResizeObserver loop completed with undelivered notifications')
      )) {
        return;
      }
      originalError.apply(window.console, args);
    };
    return () => {
      window.console.error = originalError;
    };
  }, []);

  return (
    <GridContainer ref={gridContainerRef} sx={{ height, position: 'relative' }}>
      <AnimatePresence mode="wait">
        {loading && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Box 
                component={motion.div}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                sx={{ color: 'primary.main', display: 'flex' }}
              >
                <Loader2 size={32} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', letterSpacing: '0.05em' }}>
                SYNCING GRID DATA...
              </Typography>
            </Stack>
          </Box>
        )}
      </AnimatePresence>

      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={gridDefaultColDef}
          animateRows={true}
          rowSelection="multiple"
          // Suppress the specific ResizeObserver parameter 1 error if it persists during unmount
          {...props}
        />
      </div>
    </GridContainer>
  );
};
