import React from 'react';
import { Box, Typography, Stack, IconButton, Divider, Link as MuiLink } from '@mui/material';
import { X, BookOpen, ExternalLink, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VARIANTS, SPRINGS } from '@/constants/motion';

interface DeveloperDocsProps {
  open: boolean;
  onClose: () => void;
}

const DocSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.1em' }}>
      {title}
    </Typography>
    <Stack spacing={2} sx={{ mt: 1 }}>
      {children}
    </Stack>
  </Box>
);

const DocLink: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <Box sx={{ 
    p: 1.5, 
    borderRadius: 1, 
    border: '1px solid', 
    borderColor: 'divider', 
    cursor: 'pointer',
    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.light' }
  }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
      </Box>
      <ChevronRight size={16} />
    </Stack>
  </Box>
);

export const DeveloperDocs: React.FC<DeveloperDocsProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <Box
          // @ts-ignore
          component={motion.div}
          variants={VARIANTS.drawerRight}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={SPRINGS.tight}
          sx={{
            width: 350,
            bgcolor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            boxShadow: -4,
            zIndex: 10,
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <BookOpen size={18} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Developer Docs</Typography>
            </Stack>
            <IconButton size="small" onClick={onClose}>
              <X size={18} />
            </IconButton>
          </Box>
          
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
            <DocSection title="Architecture">
              <DocLink title="Config-Driven UI" subtitle="How components respond to configuration objects." />
              <DocLink title="Persistence Layer" subtitle="Harden storage with versioning and recovery." />
            </DocSection>

            <DocSection title="Components">
              <DocLink title="Enterprise Grid" subtitle="AG Grid implementation with custom toolbars." />
              <DocLink title="Rich Text Editor" subtitle="Tiptap integration with MUI5 styling." />
              <DocLink title="Modal Primitives" subtitle="Reusable fullscreen and slide-over dialogs." />
            </DocSection>

            <DocSection title="Workflows">
              <DocLink title="Release Cycle" subtitle="From draft to published with preview mode." />
              <DocLink title="Command Palette" subtitle="Fuzzy search and keyboard shortcuts." />
            </DocSection>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: 2, color: 'primary.contrastText' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>Need help?</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>
                Check out the official documentation for more detailed integration guides.
              </Typography>
              <MuiLink href="#" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
                Open Portal <ExternalLink size={12} />
              </MuiLink>
            </Box>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
};
