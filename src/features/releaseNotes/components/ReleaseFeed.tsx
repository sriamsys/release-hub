import React, { useState, useMemo, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Box, Typography, Stack, Chip, Paper, IconButton, 
  TextField, InputAdornment, Button, Tooltip, 
  Divider, Grid, Link, useTheme, alpha
} from '@mui/material';
import { 
  SearchRounded, 
  FilterListRounded,
  HistoryRounded,
  ContentCopyRounded,
  CheckCircleRounded,
  HistoryToggleOffRounded,
  AccessTimeRounded,
  ChevronRightRounded,
  ExpandMoreRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  StarRounded,
  NewReleasesRounded,
  AutoAwesomeRounded,
  UnfoldMoreRounded,
  UnfoldLessRounded,
  ArrowUpwardRounded
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ReleaseNote, ReleaseType } from '../types';
import { releaseService } from '../services/releaseService';
import { format } from 'date-fns';

// --- Utilities ---
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// --- Sub-components ---

interface ReleaseFeedItemProps {
  release: ReleaseNote;
  isLatest: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  isNew: boolean;
}

const ReleaseFeedItem: React.FC<ReleaseFeedItemProps> = ({ 
  release, 
  isLatest, 
  isExpanded, 
  onToggle,
  isNew
}) => {
  const theme = useTheme();
  const readTime = calculateReadTime(release.htmlContent || release.content || release.description);
  const formattedDate = format(new Date(release.createdAt), 'MMM dd, yyyy');

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        mb: 3, // Matches space-y-lg feel but compact
        transition: 'all 0.2s ease'
      }}
    >
      <Accordion 
        expanded={isExpanded}
        onChange={onToggle}
        disableGutters
        elevation={0}
        sx={{ 
          borderRadius: '8px !important',
          border: '1px solid',
          borderColor: 'outline-variant',
          bgcolor: 'background.paper',
          '&:before': { display: 'none' },
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'outline',
          },
          ...(isLatest && {
            borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
          }),
          ...(isExpanded && {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          })
        }}
      >
        <AccordionSummary 
          expandIcon={isExpanded ? <KeyboardArrowUpRounded sx={{ fontSize: 20 }} /> : <KeyboardArrowDownRounded sx={{ fontSize: 20 }} />}
          sx={{ 
            minHeight: isExpanded ? 72 : 64,
            px: 2,
            bgcolor: isLatest && isExpanded ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              my: 1
            },
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }
          }}
        >
          {/* LEFT: Version + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, minWidth: 0 }}>
            {!isLatest && !isExpanded && (
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'divider',
                  flexShrink: 0,
                  transition: 'background-color 0.2s',
                  '.MuiAccordion-root:hover &': {
                    bgcolor: 'primary.main'
                  }
                }} 
              />
            )}
            
            {isNew && (
              <Chip 
                label="NEW" 
                size="small" 
                sx={{ 
                  height: 18, 
                  fontWeight: 600, 
                  fontSize: '10px', 
                  px: 0.5,
                  borderRadius: '2px',
                  bgcolor: '#0097B2',
                  color: 'white',
                  letterSpacing: '0.05em'
                }} 
              />
            )}
            
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: isExpanded || isLatest ? 700 : 500, 
                color: 'text.primary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '1.25rem', // headline-md feel
                fontFamily: 'Hanken Grotesk, sans-serif'
              }}
            >
              {isLatest ? `Release - ${release.version} - ${release.title}` : `${release.version} - ${release.title}`}
            </Typography>
          </Box>

          {/* RIGHT: Date, Read Time */}
          <Box sx={{ 
            display: { xs: 'none', sm: 'flex' }, 
            alignItems: 'center', 
            gap: 1.5,
            color: 'on-surface-variant',
            flexShrink: 0
          }}>
            <Typography variant="body2" sx={{ fontWeight: 400, opacity: 0.8, fontSize: '0.875rem' }}>
              {formattedDate} • {readTime} min read
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 0, pt: 0, pb: 0 }}>
          <Box 
            sx={{ 
              px: { xs: 3, md: 5 }, 
              pb: 4, 
              pt: 3,
              bgcolor: 'background.paper'
            }}
          >
            {isExpanded && (
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  maxWidth: 800, 
                  fontStyle: 'italic', 
                  color: 'on-surface-variant',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}
              >
                {release.description}
              </Typography>
            )}

            <Divider sx={{ mb: 3, borderColor: 'outline-variant' }} />
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: 'primary.main', 
                mb: 3,
                fontSize: '1.25rem',
                fontFamily: 'Hanken Grotesk, sans-serif'
              }}
            >
              Detailed Notes
            </Typography>

            {/* Rich Text Content */}
            <Box 
              sx={{ 
                maxWidth: 900, 
                mx: 'auto',
                color: 'text.primary',
                '& .markdown-body': {
                   fontSize: '1rem',
                   lineHeight: 1.6,
                   '& h1, h2, h3, h4': { 
                      fontWeight: 700, 
                      mt: 4, 
                      mb: 2, 
                      color: 'primary.main',
                      fontFamily: 'Hanken Grotesk, sans-serif'
                   },
                   '& p': { mb: 2, color: 'on-surface-variant' },
                   '& ul, ol': { mb: 3, pl: 0, listStyle: 'none' },
                   '& li': { 
                      mb: 1.5, 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      gap: 2,
                      color: 'on-surface-variant',
                      '&:before': {
                        content: '"check_circle"',
                        fontFamily: '"Material Symbols Outlined"',
                        fontSize: '18px',
                        color: theme.palette.primary.main,
                        marginTop: '2px'
                      },
                      '& a': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                        textDecorationColor: alpha(theme.palette.primary.main, 0.3),
                        fontWeight: 600,
                        '&:hover': {
                          textDecorationColor: theme.palette.primary.main
                        }
                      }
                   },
                   '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 4,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'outline-variant',
                      '& th, td': {
                        border: '1px solid',
                        borderColor: 'outline-variant',
                        p: 2,
                        textAlign: 'left',
                        fontSize: '14px'
                      },
                      '& th': { 
                        bgcolor: 'surface-container-low', 
                        color: 'on-surface-variant',
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        fontSize: '11px'
                      },
                      '& td span': {
                        fontSize: '11px',
                        fontWeight: 700,
                        px: 1,
                        py: 0.5,
                        borderRadius: '2px'
                      }
                   }
                }
              }}
            >
              <div 
                className="markdown-body" 
                dangerouslySetInnerHTML={{ __html: release.htmlContent || release.content }} 
              />
            </Box>

            {/* Footer Actions */}
            <Divider sx={{ mt: 6, mb: 2, opacity: 0.4 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                Latest Update • {formattedDate}
              </Typography>
              
              <Stack direction="row" spacing={1}>
                <Button 
                  size="small" 
                  variant="text"
                  startIcon={<ContentCopyRounded sx={{ fontSize: '16px !important' }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?version=${release.version}`);
                  }}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 600, 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Copy Link
                </Button>
                <Button 
                  size="small" 
                  variant="text"
                  startIcon={<HistoryRounded sx={{ fontSize: '16px !important' }} />}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 600, 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                  onClick={() => window.print()}
                >
                  Export PDF
                </Button>
              </Stack>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// --- Main Feed Component ---

interface ReleaseFeedProps {
  initialSearchQuery?: string;
}

export const ReleaseFeed: React.FC<ReleaseFeedProps> = ({ initialSearchQuery = '' }) => {
  const theme = useTheme();
  const { version: routeVersion } = useParams<{ version?: string }>();
  const [searchParams] = useSearchParams();
  const [releases, setReleases] = useState<ReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  // Update internal search when prop changes
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      const data = await releaseService.getReleaseNotes();
      // Filter for published ones and sort by date descending
      const published = data
        .filter(r => r.status === 'Published')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setReleases(published);
      
      // Determine which ones to expand initially
      const initialExpands = new Set<string>();
      
      // Check version in route or search params
      const targetVersion = routeVersion || searchParams.get('version');
      
      if (targetVersion) {
        const release = published.find(r => r.version === targetVersion);
        if (release) {
          initialExpands.add(release.id);
        }
      } else if (published.length > 0) {
        // Default to expandable latest
        initialExpands.add(published[0].id);
      }
      
      setExpandedIds(initialExpands);

      // Load viewed session
      const saved = sessionStorage.getItem('viewed_releases');
      if (saved) setViewedIds(new Set(JSON.parse(saved)));

      setLoading(false);
    };
    fetchData();
  }, [routeVersion, searchParams]);

  // Handle Scroll to target
  useEffect(() => {
    if (!loading && releases.length > 0) {
      const targetVersion = routeVersion || searchParams.get('version');
      if (targetVersion) {
        const release = releases.find(r => r.version === targetVersion);
        if (release) {
          setTimeout(() => {
            const element = document.getElementById(`release-${release.id}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    }
  }, [loading, releases, routeVersion, searchParams]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    // Mark as viewed
    if (!viewedIds.has(id)) {
      setViewedIds(prev => {
        const next = new Set(prev);
        next.add(id);
        sessionStorage.setItem('viewed_releases', JSON.stringify(Array.from(next)));
        return next;
      });
    }
  };

  const expandAll = () => setExpandedIds(new Set(filteredReleases.map(r => r.id)));
  const collapseAll = () => setExpandedIds(new Set());
  const jumpToLatest = () => {
    if (releases.length > 0) {
      setExpandedIds(new Set([releases[0].id]));
      document.getElementById(`release-${releases[0].id}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredReleases = useMemo(() => {
    return releases.filter(r => {
      const matchesSearch = 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.version.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [releases, searchQuery]);

  if (loading) return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <HistoryToggleOffRounded sx={{ fontSize: 40, color: 'text.disabled', mb: 2, animation: 'spin 2s linear infinite' }} />
      <Typography color="text.secondary">Fetching latest updates...</Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 0 }}>
      {/* Page Title Section (Matches Stitch) */}
      <Box sx={{ mb: 6, mt: 2 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary', 
            mb: 1.5,
            fontSize: { xs: '2rem', md: '2.5rem' },
            letterSpacing: '-0.02em'
          }}
        >
          Release Notes
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            maxWidth: 700,
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          Stay updated with the latest product improvements and announcements across the ecosystem.
        </Typography>
      </Box>

      {/* Toolbar - Sticky (Matches Stitch) */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 1.5, 
          mb: 2, 
          borderRadius: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search releases"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 2, 
              bgcolor: 'background.paper',
              '& fieldset': { borderColor: alpha(theme.palette.divider, 0.8) }
            }
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', md: 'auto' }, justifyContent: 'flex-end' }}>
          <Button 
            startIcon={<UnfoldMoreRounded sx={{ fontSize: 20 }} />}
            onClick={expandAll}
            sx={{ 
              textTransform: 'none', 
              color: 'on-surface-variant', 
              fontWeight: 500, 
              fontSize: '14px', 
              px: 2,
              borderRadius: 1,
              '&:hover': {
                color: 'primary.main',
                bgcolor: 'surface-container-low'
              }
            }}
          >
            Expand All
          </Button>
          <Button 
            startIcon={<UnfoldLessRounded sx={{ fontSize: 20 }} />}
            onClick={collapseAll}
            sx={{ 
              textTransform: 'none', 
              color: 'on-surface-variant', 
              fontWeight: 500, 
              fontSize: '14px', 
              px: 2,
              borderRadius: 1,
              '&:hover': {
                color: 'primary.main',
                bgcolor: 'surface-container-low'
              }
            }}
          >
            Collapse All
          </Button>
          
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1, height: 24, alignSelf: 'center' }} />
          
          <Button 
            startIcon={<ArrowUpwardRounded sx={{ fontSize: 20 }} />}
            onClick={jumpToLatest}
            variant="outlined"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500, 
              fontSize: '14px', 
              borderRadius: 1,
              borderColor: 'outline-variant',
              color: 'on-surface',
              bgcolor: 'white',
              whiteSpace: 'nowrap',
              px: 2,
              py: 1,
              '&:hover': { 
                borderColor: 'primary.main', 
                color: 'primary.main',
                bgcolor: 'white'
              }
            }}
          >
            Jump to Latest
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }}>
          Showing {filteredReleases.length} releases
        </Typography>
      </Box>

      {/* Feed List */}
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AnimatePresence mode="popLayout">
          {filteredReleases.length > 0 ? (
            filteredReleases.map((release, index) => (
              <motion.div 
                key={release.id} 
                id={`release-${release.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                 <ReleaseFeedItem 
                  release={release}
                  isLatest={index === 0}
                  isExpanded={expandedIds.has(release.id)}
                  isNew={index === 0 && !viewedIds.has(release.id)}
                  onToggle={() => toggleExpand(release.id)}
                />
              </motion.div>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <NewReleasesRounded sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5 }} />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>No matching updates</Typography>
              <Typography variant="body2" color="text.secondary">Try a different search term.</Typography>
            </Box>
          )}
        </AnimatePresence>
      </Box>

      {/* Load More Button */}
      <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Button 
          variant="outlined" 
          sx={{ 
            borderRadius: '100px', 
            px: 4, 
            py: 1, 
            textTransform: 'none', 
            fontWeight: 500, 
            fontSize: '14px',
            borderColor: 'outline-variant',
            color: 'on-surface',
            bgcolor: 'white',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: 'white'
            }
          }}
        >
          Load Older Releases
        </Button>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Link href="#" sx={{ color: 'on-surface-variant', fontSize: '12px', fontWeight: 500, textDecoration: 'underline', '&:hover': { color: 'primary.main' } }}>Archived Notes 2025</Link>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'outline-variant' }} />
          <Link href="#" sx={{ color: 'on-surface-variant', fontSize: '12px', fontWeight: 500, textDecoration: 'underline', '&:hover': { color: 'primary.main' } }}>API Documentation</Link>
        </Stack>
      </Box>

      {/* Bento Aesthetic Support (Newsletter/Social) */}
      <Grid container spacing={3} sx={{ mt: 8 }}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              bgcolor: 'inverse-surface', 
              color: 'inverse-on-surface', 
              borderRadius: 4,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 450 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'inherit', fontFamily: 'Hanken Grotesk, sans-serif' }}>
                Never miss an update
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                Subscribe to our weekly release digest to get technical notes delivered directly to your inbox.
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="email@company.com" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    }
                  }}
                />
                <Button variant="contained" color="secondary" sx={{ borderRadius: 2, px: 3, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  Subscribe
                </Button>
              </Stack>
            </Box>
            <Box 
              sx={{ 
                position: 'absolute', 
                right: -40, 
                bottom: -40, 
                opacity: 0.1,
                userSelect: 'none'
              }}
            >
              <Box 
                component="span" 
                className="material-symbols-outlined" 
                sx={{ fontSize: '240px !important' }}
              >
                mail
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            variant="outlined"
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 4, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
              borderColor: 'outline-variant',
              bgcolor: 'surface-container-high',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box 
              component="span" 
              className="material-symbols-outlined" 
              sx={{ fontSize: '48px !important', color: 'primary.main', mb: 2 }}
            >
              help
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Hanken Grotesk, sans-serif' }}>
              Need Help?
            </Typography>
            <Typography variant="body2" sx={{ color: 'on-surface-variant' }}>
              Contact our engineering support team for integration questions.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Footer */}
      <Box sx={{ mt: 6, pb: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
          Version History • Endeavor
        </Typography>
      </Box>
    </Box>
  );
};
