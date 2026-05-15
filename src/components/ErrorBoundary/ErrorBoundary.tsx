import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear(); // Clear possibly corrupted persistence
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'background.default' }}>
          <Paper variant="outlined" sx={{ p: 4, maxWidth: 500, textAlign: 'center', borderRadius: 4 }}>
            <Stack spacing={3} alignItems="center">
              <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'error.light', color: 'error.main' }}>
                <AlertCircle size={48} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} gutterBottom>Something went wrong</Typography>
                <Typography variant="body2" color="text.secondary">
                  The application encountered an unexpected error. This might be due to corrupted local data or a temporary service issue.
                </Typography>
              </Box>
              
              <Box sx={{ width: '100%', p: 2, bgcolor: 'action.hover', borderRadius: 1, textAlign: 'left' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'error.main' }}>
                  {this.state.error?.message}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshCcw size={18} />}
                  onClick={() => window.location.reload()}
                >
                  Retry Session
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={this.handleReset}
                >
                  Clear All Data & Reset
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
