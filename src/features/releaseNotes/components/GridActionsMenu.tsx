import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { MoreHorizontal, Eye, Edit2, Copy, Trash2 } from 'lucide-react';

interface GridActionsMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const GridActionsMenu: React.FC<GridActionsMenuProps> = ({
  onView,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={handleClick}>
          <MoreHorizontal size={18} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 160, borderRadius: 1.5, mt: 0.5 }
        }}
      >
        <MenuItem onClick={() => { onView(); handleClose(); }}>
          <ListItemIcon><Eye size={16} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onEdit(); handleClose(); }}>
          <ListItemIcon><Edit2 size={16} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onDuplicate(); handleClose(); }}>
          <ListItemIcon><Copy size={16} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onDelete(); handleClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><Trash2 size={16} color="currentColor" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
