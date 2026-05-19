import React, { useState } from 'react';
import { 
  Dialog, DialogContent, Box, Typography, Stack, IconButton, 
  Divider, useTheme, Button
} from '@mui/material';
import { 
  CloseRounded, 
  OpenInFull, 
  CloseFullscreen, 
  HelpOutlineRounded,
  CategoryRounded
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { FaqEntry } from '../types';
import { AppStatusChip } from '@/components';

interface FaqViewerModalProps {
  open: boolean;
  onClose: () => void;
  faq: FaqEntry | null;
}

export const FaqViewerModal: React.FC<FaqViewerModalProps> = ({ open, onClose, faq }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  if (!faq) return null;

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      maxWidth={false}
      fullWidth={true}
      disableEscapeKeyDown
      PaperProps={{
        sx: { 
          borderRadius: isFullscreen ? 0 : 4,
          width: isFullscreen ? '98vw' : '70vw',
          height: isFullscreen ? '96vh' : '80vh',
          maxHeight: '96vh',
          bgcolor: 'background.default',
          backgroundImage: 'none',
          boxShadow: isFullscreen ? 'none' : '0 30px 60px -12px rgba(0,0,0,0.3)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: isFullscreen ? 'none' : '1px solid',
          borderColor: 'divider',
          m: 'auto'
        }
      }}
      slotProps={{
        backdrop: {
          sx: { 
            bgcolor: 'rgba(15, 23, 42, 0.75)', 
            backdropFilter: 'blur(12px)',
          }
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        px: 3, 
        py: 2.5, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: 3, 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.3)'
          }}>
            <HelpOutlineRounded fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              Knowledge Base
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <CategoryRounded sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {faq.category} • {faq.audience}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={toggleFullscreen}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{ px: 2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            startIcon={isFullscreen ? <CloseFullscreen /> : <OpenInFull />}
          >
            {isFullscreen ? 'Restore' : 'Maximize'}
          </Button>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'text.secondary',
              bgcolor: 'rgba(0,0,0,0.03)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.08)', color: 'text.primary' }
            }}
          >
            <CloseRounded />
          </IconButton>
        </Stack>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Box sx={{ 
          maxWidth: 900, 
          mx: 'auto', 
          width: '100%', 
          px: { xs: 3, md: 6 }, 
          py: 6,
          flexGrow: 1
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Stack spacing={4}>
                <Box>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <AppStatusChip label={faq.category} status="info" />
                    <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500 }}>•</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      Updated {new Date(faq.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900, 
                    color: 'text.primary', 
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    mb: 3
                  }}>
                    {faq.question}
                  </Typography>
                  <Divider sx={{ opacity: 0.5 }} />
                </Box>

                <Box 
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: 'text.primary',
                    '& h1, & h2, & h3': { fontWeight: 800, letterSpacing: '-0.02em', mt: 4, mb: 2 },
                    '& p': { mb: 2.5 },
                    '& ul, & ol': { pl: 3, mb: 3 },
                    '& img': { borderRadius: 4, my: 4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' },
                    '& blockquote': { 
                      borderLeft: '4px solid', 
                      borderColor: 'primary.main', 
                      pl: 3, 
                      py: 1,
                      fontStyle: 'italic', 
                      color: 'text.secondary', 
                      bgcolor: 'rgba(37, 99, 235, 0.03)',
                      borderRadius: '0 8px 8px 0',
                      my: 4 
                    },
                    '& code': { bgcolor: 'rgba(0,0,0,0.05)', px: 0.8, py: 0.2, borderRadius: 1, fontFamily: 'monospace' }
                  }}
                />

                <Box sx={{ mt: 8, p: 4, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                   <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Was this helpful?</Typography>
                   <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Help us improve our knowledge base by providing feedback on this article.</Typography>
                   <Stack direction="row" spacing={2}>
                      <Button variant="outlined" sx={{ borderRadius: 2, px: 3 }}>Yes, thanks!</Button>
                      <Button variant="outlined" sx={{ borderRadius: 2, px: 3 }}>Not really</Button>
                   </Stack>
                </Box>
              </Stack>
            </motion.div>
          </AnimatePresence>
        </Box>
      </DialogContent>

      <Box sx={{ 
        px: 3, 
        py: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider', 
        display: 'flex', 
        justifyContent: 'flex-end',
        bgcolor: 'background.paper' 
      }}>
        <Button 
          onClick={onClose}
          variant="contained" 
          disableElevation
          sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};
