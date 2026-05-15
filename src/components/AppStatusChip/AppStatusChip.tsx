import React from 'react';
import { Chip, ChipProps, styled } from '@mui/material';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface AppStatusChipProps extends Omit<ChipProps, 'color'> {
  status?: StatusType;
}

const StyledChip = styled(Chip)<{ status: StatusType }>(({ theme, status }) => {
  const colors = {
    success: { bg: '#def7ec', text: '#03543f' },
    warning: { bg: '#fef3c7', text: '#92400e' },
    error: { bg: '#fde8e8', text: '#9b1c1c' },
    info: { bg: '#e1effe', text: '#1e429f' },
    neutral: { bg: '#f3f4f6', text: '#374151' },
  };

  const selected = colors[status] || colors.neutral;

  return {
    backgroundColor: selected.bg,
    color: selected.text,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 24,
    borderRadius: 4,
    '& .MuiChip-label': {
      paddingLeft: 8,
      paddingRight: 8,
    },
  };
});

/**
 * Enterprise status chip for standardized tagging
 */
export const AppStatusChip: React.FC<AppStatusChipProps> = ({ status = 'neutral', ...props }) => {
  return <StyledChip status={status} size="small" variant="filled" {...props} />;
};
