import React from 'react';
import { Box, Stack, TextField, InputAdornment, Tooltip, IconButton, Divider, Typography, Button } from '@mui/material';
import { 
  SearchRounded, 
  AddRounded, 
  FilterListRounded, 
  ViewColumnRounded, 
  RestartAltRounded, 
  HelpOutlineRounded, 
  ViewListRounded 
} from '@mui/icons-material';
import { AppButton } from '@/components';

interface GridToolbarProps {
  onSearchChange: (value: string) => void;
  onAddClick?: () => void;
  onFiltersClick: () => void;
  onColumnsClick: () => void;
  onResetClick: () => void;
  onDocsClick?: () => void;
  onConfigClick?: () => void;
  totalCount: number;
}

/**
 * Enterprise toolbar for AG Grid
 */
export const GridToolbar: React.FC<GridToolbarProps> = ({
  onSearchChange,
  onAddClick,
  onFiltersClick,
  onColumnsClick,
  onResetClick,
  onDocsClick,
  onConfigClick,
  totalCount
}) => {
  return (
    <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
          <TextField
            size="small"
            placeholder="Search releases..."
            onChange={(e) => onSearchChange(e.target.value)}
            inputProps={{ 'aria-label': 'Search release notes' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ fontSize: 16, color: "#64748b" }} />
                </InputAdornment>
              ),
              sx: { height: 32, fontSize: '0.875rem', maxWidth: 300, bgcolor: 'background.default' }
            }}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, alignSelf: 'center' }} />
          
          <AppButton 
            variant="text" 
            size="small" 
            color="secondary" 
            startIcon={<FilterListRounded sx={{ fontSize: 14 }} />}
            onClick={onFiltersClick}
            aria-label="Toggle filters panel"
            sx={{ height: 32, fontWeight: 600, color: 'text.secondary' }}
          >
            Filters
          </AppButton>
          
          <AppButton 
            variant="text" 
            size="small" 
            color="secondary" 
            startIcon={<ViewColumnRounded sx={{ fontSize: 14 }} />}
            onClick={onColumnsClick}
            aria-label="Toggle column settings"
            sx={{ height: 32, fontWeight: 600, color: 'text.secondary' }}
          >
            Columns
          </AppButton>
          
          <Tooltip title="Reset Grid Layout">
            <IconButton 
              size="small" 
              onClick={onResetClick} 
              sx={{ color: 'text.secondary' }}
              aria-label="Reset grid layout and filters"
            >
              <RestartAltRounded sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 2, fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
            {totalCount} Results
          </Typography>
          
          {onDocsClick && (
            <Tooltip title="Documentation">
              <IconButton size="small" onClick={onDocsClick} sx={{ color: 'text.secondary' }}>
                <HelpOutlineRounded sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          
          {onConfigClick && (
            <Tooltip title="View Page Config">
              <IconButton size="small" onClick={onConfigClick} sx={{ color: 'text.secondary' }}>
                <ViewListRounded sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          
          {onAddClick && (
            <AppButton 
              variant="contained" 
              size="small" 
              startIcon={<AddRounded sx={{ fontSize: 16 }} />}
              onClick={onAddClick}
              sx={{ height: 32, px: 2 }}
            >
              Create Release
            </AppButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

