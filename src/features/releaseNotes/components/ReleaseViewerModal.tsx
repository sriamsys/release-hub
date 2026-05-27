import React, { useState } from 'react';
import { 
  Box, Typography, Stack, Divider, Paper, IconButton,
  Container, Chip, Dialog, DialogContent, DialogActions,
  Tooltip, Zoom, Link, Grid, CircularProgress
} from '@mui/material';
import { 
  CloseRounded, 
  CalendarTodayRounded, 
  PersonRounded, 
  CampaignRounded, 
  LocalOfferRounded, 
  OpenInFull, 
  CloseFullscreen, 
  CheckRounded, 
  PrintRounded, 
  ShareRounded 
} from '@mui/icons-material';
import { ReleaseNote } from '../types';
import { AppStatusChip, AppButton } from '@/components';
import { motion, AnimatePresence } from 'motion/react';
import { SPRINGS } from '@/constants/motion';

interface ReleaseViewerModalProps {
  open: boolean;
  onClose: () => void;
  note: ReleaseNote | null;
}

/**
 * Enterprise Branded Release Bulletin
 * Centered modal system with a premium "Announcement" aesthetic.
 */
export const ReleaseViewerModal: React.FC<ReleaseViewerModalProps> = ({ open, onClose, note }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastNote, setLastNote] = useState<ReleaseNote | null>(null);

  // Keep track of the last valid note to show during closing transitions
  React.useEffect(() => {
    if (note) {
      setLastNote(note);
    }
  }, [note]);

  const displayNote = note || lastNote;

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {!displayNote ? (
        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          {/* Absolute Header Controls */}
          <Box sx={{ 
            position: 'absolute', 
            top: 20, 
            right: 20, 
            zIndex: 100, 
            display: 'flex', 
            gap: 1 
          }}>
            <Tooltip title={isFullscreen ? "Restore" : "Maximize"}>
              <IconButton 
                onClick={toggleFullscreen} 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)', 
                  color: 'white',
                  backdropFilter: 'blur(4px)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                {isFullscreen ? <CloseFullscreen sx={{ fontSize: 18 }} /> : <OpenInFull sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>
            <IconButton 
              onClick={onClose}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white',
                backdropFilter: 'blur(4px)',
                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#fee2e2' }
              }}
            >
              <CloseRounded sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: 0, bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }} className="custom-scrollbar">
              {/* Branded Hero Section */}
              <Box sx={{ 
                position: 'relative', 
                bgcolor: displayNote.heroStyle === 'solid' ? (displayNote.heroColor || '#2563EB') : '#0f172a',
                backgroundImage: displayNote.heroStyle === 'image' 
                  ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${displayNote.heroImage || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop'})` 
                  : `linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                pt: { xs: 8, md: 10 },
                pb: { xs: 10, md: 14 },
                px: { xs: 3, md: 6 },
                overflow: 'hidden',
                transition: 'all 0.5s ease'
              }}>
                {/* Background Decorative Elements - Only show on solid style for subtle texture */}
                {displayNote.heroStyle === 'solid' && (
                  <>
                    <Box sx={{ 
                      position: 'absolute', 
                      top: -100, 
                      right: -50, 
                      width: 400, 
                      height: 400, 
                      borderRadius: '50%', 
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                      zIndex: 0
                    }} />
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: -20, 
                      left: '10%', 
                      width: 300, 
                      height: 300, 
                      bgcolor: 'white',
                      opacity: 0.05,
                      filter: 'blur(100px)',
                      zIndex: 0
                    }} />
                  </>
                )}
                
                {/* Geometric Angled Cut */}
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: '25%', 
                  bgcolor: 'background.default',
                  clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
                  zIndex: 1
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={SPRINGS.tight}
                  >
                    <Stack spacing={4} alignItems="flex-start">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                          px: 2, 
                          py: 0.75, 
                          borderRadius: 2, 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                        }}>
                          RELEASE HUB
                        </Box>
                        <Typography variant="caption" sx={{ color: 'slate.400', fontWeight: 600, letterSpacing: '0.05em' }}>
                          SYSTEM ANNOUNCEMENT • v{displayNote.version}
                        </Typography>
                      </Stack>

                      <Box sx={{ maxWidth: '900px' }}>
                        <Typography 
                          variant="h1" 
                          sx={{ 
                            fontWeight: 900, 
                            letterSpacing: '-0.04em', 
                            lineHeight: { xs: 1.2, md: 1.1 },
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            mb: 3,
                            textShadow: '0 2px 20px rgba(0,0,0,0.2)'
                          }}
                        >
                          {displayNote.title}
                        </Typography>

                        <Stack direction="row" spacing={1.5} flexWrap="wrap">
                          <AppStatusChip label={displayNote.audience} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                          <AppStatusChip label={displayNote.releaseType} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                          <AppStatusChip label={displayNote.status} status={displayNote.status === 'Published' ? 'success' : 'warning'} />
                        </Stack>
                      </Box>
                    </Stack>
                  </motion.div>
                </Container>
              </Box>

              {/* Bulletin Content Section */}
              <Container maxWidth="lg" sx={{ mt: -6, pb: 10, position: 'relative', zIndex: 5 }}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRINGS.gentle, delay: 0.2 }}
                >
                  <Paper 
                    elevation={0}
                    sx={{ 
                      borderRadius: 4, 
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Grid container>
                      {/* Left Metadata Bar */}
                      <Grid item xs={12} md={3.5} sx={{ borderRight: { md: '1px solid' }, borderColor: 'divider', bgcolor: '#f8fafc' }}>
                        <Box sx={{ p: 4 }}>
                          <Stack spacing={4}>
                            <Box>
                              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, mb: 2, display: 'block' }}>Document Details</Typography>
                              <Stack spacing={2.5}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'flex' }}>
                                    <PersonRounded sx={{ fontSize: 16 }} />
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>Publisher</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{displayNote.createdBy}</Typography>
                                  </Box>
                                </Stack>

                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'flex' }}>
                                    <CalendarTodayRounded sx={{ fontSize: 16 }} />
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>Release Date</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                      {new Date(displayNote.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </Typography>
                                  </Box>
                                </Stack>

                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'flex' }}>
                                    <LocalOfferRounded sx={{ fontSize: 16 }} />
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>Taxonomy</Typography>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" pt={0.5}>
                                      {displayNote.tags.map(t => <Chip key={t} label={t} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 800 }} />)}
                                    </Stack>
                                  </Box>
                                </Stack>
                              </Stack>
                            </Box>

                            <Box sx={{ 
                              p: 2, 
                              bgcolor: displayNote.heroStyle === 'solid' ? `${displayNote.heroColor}15` : 'primary.light', 
                              borderRadius: 2, 
                              color: displayNote.heroStyle === 'solid' ? (displayNote.heroColor || 'primary.main') : 'primary.contrastText',
                              position: 'relative', 
                              overflow: 'hidden',
                              border: displayNote.heroStyle === 'solid' ? '1px solid' : 'none',
                              borderColor: `${displayNote.heroColor}30`
                            }}>
                              <CampaignRounded sx={{ fontSize: 40, position: 'absolute', right: -10, bottom: -10, opacity: 0.1, transform: 'rotate(-20deg)' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>Executive Summary</Typography>
                              <Typography variant="caption" sx={{ lineHeight: 1.5, opacity: 0.9, display: 'block', color: 'text.primary' }}>
                                {displayNote.description}
                              </Typography>
                            </Box>

                            <Stack direction="row" spacing={1} pt={2}>
                              <AppButton variant="text" size="small" startIcon={<PrintRounded sx={{ fontSize: 14 }} />} sx={{ fontSize: '0.7rem' }}>Download PDF</AppButton>
                              <AppButton variant="text" size="small" startIcon={<ShareRounded sx={{ fontSize: 14 }} />} sx={{ fontSize: '0.7rem' }}>Archive</AppButton>
                            </Stack>
                          </Stack>
                        </Box>
                      </Grid>

                      {/* Right Main Body */}
                      <Grid item xs={12} md={8.5}>
                        <Box sx={{ p: { xs: 4, md: 8 }, bgcolor: 'white' }}>
                          <Box 
                            dangerouslySetInnerHTML={{ __html: displayNote.htmlContent || displayNote.content }}
                            className="markdown-body"
                            sx={{
                              '& h1': { fontSize: '2.25rem', fontWeight: 900, mt: 0, mb: 4, letterSpacing: '-0.03em', color: 'slate.900' },
                              '& h2': { fontSize: '1.75rem', fontWeight: 800, mt: 6, mb: 3, letterSpacing: '-0.02em', color: 'slate.900' },
                              '& h3': { fontSize: '1.25rem', fontWeight: 700, mt: 4, mb: 2, color: 'slate.800' },
                              '& p': { fontSize: '1.125rem', lineHeight: 1.8, color: 'slate.600', mb: 4 },
                              '& ul, & ol': { pl: 4, mb: 4 },
                              '& li': { mb: 2, color: 'slate.600', fontSize: '1.125rem' },
                              '& blockquote': { 
                                borderLeft: '5px solid', 
                                borderColor: 'primary.main', 
                                pl: 4, 
                                py: 1, 
                                my: 6,
                                bgcolor: 'slate.50',
                                borderRadius: '0 12px 12px 0',
                                '& p': { mb: 0, fontStyle: 'italic', fontWeight: 500, color: 'slate.800' }
                              },
                              '& code': { 
                                bgcolor: 'slate.100', 
                                px: 1, 
                                py: 0.25, 
                                borderRadius: 1, 
                                fontFamily: 'JetBrains Mono, monospace', 
                                fontSize: '0.9em',
                                color: 'primary.main',
                                fontWeight: 600
                              },
                              '& pre': {
                                bgcolor: 'slate.900',
                                color: 'slate.50',
                                p: 4,
                                borderRadius: 3,
                                overflowX: 'auto',
                                my: 5,
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                '& code': { bgcolor: 'transparent', p: 0, color: 'inherit', fontWeight: 'normal' }
                              },
                              '& table': {
                                width: '100%',
                                borderCollapse: 'separate',
                                borderSpacing: 0,
                                my: 5,
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                                '& th, & td': {
                                  p: 2,
                                  textAlign: 'left',
                                  borderBottom: '1px solid',
                                  borderColor: 'divider'
                                },
                                '& th': {
                                  bgcolor: 'slate.50',
                                  fontWeight: 700,
                                  color: 'slate.900'
                                }
                              }
                            }}
                          />
                          
                          <Divider sx={{ my: 6, borderStyle: 'dashed' }} />
                          
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              End of Bulletin • Internal Reference #{displayNote.id.substring(0, 8).toUpperCase()}
                            </Typography>
                            <Link href="#" variant="caption" sx={{ fontWeight: 700, textDecoration: 'none' }}>
                              View Document History
                            </Link>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              </Container>
            </Box>
          </DialogContent>

          {/* Branded Sticky Footer */}
          <DialogActions sx={{ 
            p: 3, 
            bgcolor: 'background.paper', 
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            zIndex: 10
          }}>
            <AppButton 
              variant="outlined" 
              startIcon={copied ? <CheckRounded sx={{ fontSize: 18 }} /> : <ShareRounded sx={{ fontSize: 18 }} />}
              onClick={handleCopyLink}
              sx={{ height: 52, px: 4, borderRadius: 3, color: copied ? 'success.main' : 'text.primary' }}
            >
              {copied ? 'Link Copied' : 'Share Bulletin'}
            </AppButton>
            <AppButton 
              variant="contained" 
              onClick={onClose} 
              sx={{ 
                minWidth: 280,
                height: 52,
                borderRadius: 3,
                fontSize: '1rem',
                boxShadow: (theme) => `0 12px 24px -10px ${theme.palette.primary.main}60`
              }}
            >
              I've Read the Release
            </AppButton>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

