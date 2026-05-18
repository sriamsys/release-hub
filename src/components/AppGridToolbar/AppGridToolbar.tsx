import React from 'react';
import { 
  Box, 
  Stack, 
  TextField, 
  InputAdornment, 
  Tooltip, 
  IconButton, 
  Divider, 
  Typography 
} from '@mui/material';
import { 
  SearchRounded, 
  AddRounded, 
  FilterListRounded, 
  ViewColumnRounded, 
  RestartAltRounded,
  HelpOutlineRounded,
  ViewListRounded
} from '@mui/icons-material';
import { AppButton } from '../AppButton/AppButton';

interface AppGridToolbarProps {
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  onAddClick?: () => void;
  addLabel?: string;
  onFiltersClick?: () => void;
  onColumnsClick?: () => void;
  onResetClick?: () => void;
  onDocsClick?: () => void;
  onConfigClick?: () => void;
  totalCount?: number;
  countLabel?: string;
  actions?: React.ReactNode;
}

export const AppGridToolbar: React.FC<AppGridToolbarProps> = ({
  searchPlaceholder = 'Search...',
  onSearchChange,
  onAddClick,
  addLabel = 'Create New',
  onFiltersClick,
  onColumnsClick,
  onResetClick,
  onDocsClick,
  onConfigClick,
  totalCount,
  countLabel = 'Results',
  actions
}) => {
  return (
    <Box sx={{ 
      px: 2, 
      py: 1, 
      borderBottom: '1px solid', 
      borderColor: 'divider',
      bgcolor: 'background.paper',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 52
    }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
        <TextField
          placeholder={searchPlaceholder}
          size="small"
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ fontSize: 16, color: "text.disabled" }} />
              </InputAdornment>
            ),
            sx: { 
              height: 32, 
              fontSize: '0.875rem', 
              maxWidth: 300, 
              bgcolor: 'background.default',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider'
              }
            }
          }}
        />
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, my: 'auto' }} />

        <Stack direction="row" spacing={0.5}>
          {onFiltersClick && (
            <AppButton 
              variant="text" 
              size="small" 
              color="secondary" 
              startIcon={<FilterListRounded sx={{ fontSize: 14 }} />}
              onClick={onFiltersClick}
              sx={{ height: 32, fontWeight: 600, color: 'text.secondary', px: 1 }}
            >
              Filters
            </AppButton>
          )}
          {onColumnsClick && (
            <AppButton 
              variant="text" 
              size="small" 
              color="secondary" 
              startIcon={<ViewColumnRounded sx={{ fontSize: 14 }} />}
              onClick={onColumnsClick}
              sx={{ height: 32, fontWeight: 600, color: 'text.secondary', px: 1 }}
            >
              Columns
            </AppButton>
          )}
          {onResetClick && (
            <Tooltip title="Reset View">
              <IconButton 
                size="small" 
                onClick={onResetClick}
                sx={{ color: 'text.secondary', width: 32, height: 32 }}
              >
                <RestartAltRounded sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        {totalCount !== undefined && (
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05em', display: { xs: 'none', md: 'block' } }}>
            {totalCount} {countLabel}
          </Typography>
        )}

        {onDocsClick && (
          <Tooltip title="Documentation">
            <IconButton size="small" onClick={onDocsClick} sx={{ color: 'text.secondary' }}>
              <HelpOutlineRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
        
        {onConfigClick && (
          <Tooltip title="Configuration">
            <IconButton size="small" onClick={onConfigClick} sx={{ color: 'text.secondary' }}>
              <ViewListRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
        
        {actions}

        {onAddClick && (
          <AppButton 
            variant="contained" 
            size="small" 
            startIcon={<AddRounded sx={{ fontSize: 16 }} />}
            onClick={onAddClick}
            sx={{ height: 32, px: 2, fontWeight: 700 }}
          >
            {addLabel}
          </AppButton>
        )}
      </Stack>
    </Box>
  );
};
