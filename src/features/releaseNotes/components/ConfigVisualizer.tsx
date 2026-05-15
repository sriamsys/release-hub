import React from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, Stack } from '@mui/material';
import { X, Code2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageConfig } from '../types/config';
import { VARIANTS, SPRINGS } from '@/constants/motion';

interface ConfigVisualizerProps {
  config: PageConfig;
  open: boolean;
  onClose: () => void;
}

export const ConfigVisualizer: React.FC<ConfigVisualizerProps> = ({ config, open, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <Code2 size={18} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Page Configuration</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Copy JSON">
                <IconButton size="small" onClick={handleCopy}>
                  {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                </IconButton>
              </Tooltip>
              <IconButton size="small" onClick={onClose}>
                <X size={18} />
              </IconButton>
            </Stack>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: '#0f172a' }}>
            <Typography
              component="pre"
              sx={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                color: '#94a3b8',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                '& .key': { color: '#7dd3fc' },
                '& .string': { color: '#bef264' },
                '& .boolean': { color: '#fb7185' },
                '& .number': { color: '#fcd34d' },
              }}
            >
              {JSON.stringify(config, null, 2)
                .replace(/"(\w+)":/g, '<span class="key">"$1"</span>:')
                .replace(/: "(.*?)"/g, ': <span class="string">"$1"</span>')
                .replace(/: (true|false)/g, ': <span class="boolean">$1</span>')
                .replace(/: (\d+)/g, ': <span class="number">$1</span>')}
            </Typography>
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              This configuration object drives the current page's features, UI density, and grid behavior dynamically.
            </Typography>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
};
