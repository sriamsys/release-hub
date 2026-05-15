import React, { useState, useEffect, useCallback } from 'react';
import { 
  Dialog, Box, InputBase, List, ListItemButton, ListItemIcon, 
  ListItemText, Typography, Divider, Stack, Chip, Fade
} from '@mui/material';
import { 
  SearchRounded, 
  CampaignRounded, 
  AddRounded, 
  SettingsRounded, 
  DescriptionRounded, 
  KeyboardCommandKeyRounded 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ReleaseNote } from '../types';
import { useReleaseNotes } from '../hooks/useReleaseNotes';
import { VARIANTS, SPRINGS } from '@/constants/motion';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onAction?: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, onAction }) => {
  const navigate = useNavigate();
  const { notes } = useReleaseNotes();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { id: 'new', title: 'New Release', icon: <AddRounded sx={{ fontSize: 18 }} />, group: 'Actions', shortcut: 'N' },
    { id: 'docs', title: 'View Documentation', icon: <DescriptionRounded sx={{ fontSize: 18 }} />, group: 'Support' },
    { id: 'settings', title: 'System Settings', icon: <SettingsRounded sx={{ fontSize: 18 }} />, group: 'Admin' },
  ];

  useEffect(() => {
    if (!query) {
      setResults([...actions, ...notes.slice(0, 3).map(n => ({ ...n, group: 'Recent Releases', id: n.id, type: 'release' }))]);
    } else {
      const filteredActions = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
      const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.version.includes(query))
        .map(n => ({ ...n, group: 'Releases', id: n.id, type: 'release' }));
      setResults([...filteredActions, ...filteredNotes]);
    }
    setSelectedIndex(0);
  }, [query, notes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item: any) => {
    if (!item) return;
    
    if (item.type === 'release') {
      navigate(`/release-notes/${item.version}`);
    } else if (item.id === 'new') {
      onAction?.('new');
    } else {
      // Other actions
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        component: motion.div,
        variants: VARIANTS.scaleUp,
        initial: "initial",
        animate: "animate",
        exit: "exit",
        transition: SPRINGS.tight,
        sx: { mt: '10vh', verticalAlign: 'top', borderRadius: 3, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
      }}
      BackdropProps={{
        sx: { bgcolor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <SearchRounded sx={{ fontSize: 20, color: "#64748b" }} />
        <InputBase 
          id="command-palette-search"
          placeholder="Search releases, actions, or docs..." 
          fullWidth
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ fontSize: '1rem' }}
          inputProps={{
            'aria-label': 'Search commands',
            'aria-expanded': true,
            'aria-controls': 'command-palette-results',
            'aria-activedescendant': results[selectedIndex]?.id ? `option-${results[selectedIndex].id}` : undefined
          }}
        />
        <Chip label="ESC" size="small" variant="outlined" sx={{ borderRadius: 1, fontSize: '0.6rem', height: 20 }} />
      </Box>
      <Box id="command-palette-results" sx={{ maxHeight: 400, overflowY: 'auto' }} role="listbox">
        <List sx={{ p: 0 }}>
          {results.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No results found for "{query}"</Typography>
            </Box>
          )}
          {results.map((item, index) => {
            const showGroup = index === 0 || results[index - 1].group !== item.group;
            const itemId = `option-${item.id}`;
            return (
              <React.Fragment key={item.id}>
                {showGroup && (
                  <Typography 
                    variant="caption" 
                    sx={{ px: 2, py: 1, display: 'block', bgcolor: 'action.hover', fontWeight: 600, color: 'text.secondary' }}
                    aria-hidden="true"
                  >
                    {item.group}
                  </Typography>
                )}
                <ListItemButton 
                  id={itemId}
                  role="option"
                  aria-selected={index === selectedIndex}
                  selected={index === selectedIndex}
                  onClick={() => handleSelect(item)}
                  sx={{ 
                    py: 1.5,
                    borderLeft: '4px solid transparent',
                    '&.Mui-selected': { 
                      borderLeftColor: 'primary.main',
                      bgcolor: 'action.selected'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon || <CampaignRounded sx={{ fontSize: 18 }} />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title} 
                    secondary={item.version && `v${item.version}`}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                  {item.shortcut && (
                    <Typography variant="caption" sx={{ opacity: 0.5 }}>{item.shortcut}</Typography>
                  )}
                </ListItemButton>
              </React.Fragment>
            );
          })}
        </List>
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <KeyboardCommandKeyRounded sx={{ fontSize: 12 }} />
            <Typography variant="caption">Navigate</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <KeyboardCommandKeyRounded sx={{ fontSize: 12 }} />
            <Typography variant="caption">Select</Typography>
          </Stack>
        </Stack>
        <Typography variant="caption" color="text.secondary">Enterprise Command Palette</Typography>
      </Box>
    </Dialog>
  );
};
