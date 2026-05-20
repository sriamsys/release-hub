import React, { useState, useMemo, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Box, Typography, Stack, Chip, Paper, IconButton, 
  TextField, InputAdornment, Button, Tooltip, 
  Divider, useTheme, alpha
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
  const readTime = calculateReadTime(release.content || release.description);
  const formattedDate = format(new Date(release.createdAt), 'MMM dd, yyyy');

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        pl: 0, 
        mb: 2,
        transition: 'all 0.2s ease'
      }}
    >
      <Accordion 
        expanded={isExpanded}
        onChange={onToggle}
        disableGutters
        elevation={0}
        sx={{ 
          borderRadius: '12px !important',
          border: '1px solid',
          borderColor: isExpanded ? 'primary.main' : isLatest ? alpha(theme.palette.primary.main, 0.3) : 'divider',
          bgcolor: isLatest && !isExpanded ? alpha(theme.palette.primary.main, 0.02) : 'background.paper',
          '&:before': { display: 'none' },
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          boxShadow: isExpanded ? '0 4px 20px rgba(0,0,0,0.06)' : isLatest ? '0 2px 8px rgba(0,0,0,0.02)' : 'none',
          ...(isLatest && {
            borderLeft: `5px solid ${theme.palette.primary.main}`,
          })
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreRounded sx={{ fontSize: 20 }} />}
          sx={{ 
            minHeight: { xs: 72, sm: 64 },
            height: isExpanded ? 'auto' : { xs: 'auto', sm: 64 },
            px: 3,
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              my: 0.5
            }
          }}
        >
          {/* LEFT: Indicator + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 0 }}>
            {/* Dot indicator for non-latest, non-expanded items */}
            {!isLatest && !isExpanded && (
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'divider',
                  flexShrink: 0
                }} 
              />
            )}
            
            {isNew && isLatest && (
              <Chip 
                label="NEW" 
                size="small" 
                color="primary" 
                sx={{ 
                  height: 18, 
                  fontWeight: 900, 
                  fontSize: '0.6rem', 
                  px: 0.5,
                  borderRadius: '4px',
                  bgcolor: 'primary.main',
                  color: 'white',
                  letterSpacing: '0.05em'
                }} 
              />
            )}
            
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: isExpanded || isLatest ? 700 : 500, 
                color: isExpanded ? 'primary.main' : 'text.primary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.95rem',
                letterSpacing: '-0.01em'
              }}
            >
              {isLatest ? `Release - ${release.version} - ${release.title}` : `${release.version} - ${release.title}`}
            </Typography>
          </Box>

          {/* RIGHT: Date, Read Time */}
          <Box sx={{ 
            display: { xs: 'none', sm: 'flex' }, 
            alignItems: 'center', 
            gap: 2,
            color: 'text.disabled',
            flexShrink: 0
          }}>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
              {formattedDate}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled', opacity: 0.4 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{readTime} min read</Typography>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 0, pt: 0, pb: 0 }}>
          <Box 
            sx={{ 
              px: { xs: 3, md: 5 }, 
              pb: 4, 
              pt: isLatest ? 2 : 0,
              bgcolor: 'background.paper'
            }}
          >
            {isLatest && (
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  maxWidth: 800, 
                  fontStyle: 'italic', 
                  color: 'text.secondary',
                  lineHeight: 1.6
                }}
              >
                {release.description}
              </Typography>
            )}

            <Divider sx={{ mb: 3, opacity: 0.4 }} />
            
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 800, 
                color: 'primary.main', 
                mb: 2.5,
                fontSize: '0.875rem'
              }}
            >
              Release Summary
            </Typography>

            {/* Rich Text Content */}
            <Box 
              sx={{ 
                maxWidth: 900, 
                mx: 'auto',
                color: 'text.primary',
                '& .markdown-body': {
                   fontSize: '1rem',
                   lineHeight: 1.7,
                   '& h1, h2, h3': { fontWeight: 800, mt: 4, mb: 2, color: 'slate.900' },
                   '& p': { mb: 2.5 },
                   '& ul, ol': { mb: 3, pl: 2 },
                   '& li': { 
                      mb: 1.5, 
                      position: 'relative',
                      pl: 3.5,
                      '&:before': {
                        content: '"L"',
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        // Mask as a checkmark if possible, or just use a component approach
                      }
                   },
                   '& code': { 
                      bgcolor: 'slate.100', 
                      px: 0.8, 
                      py: 0.2, 
                      borderRadius: 1, 
                      fontFamily: 'monospace',
                      fontSize: '0.85em',
                      color: 'primary.dark'
                   },
                   '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 3,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      '& th, td': {
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1.5,
                        textAlign: 'left'
                      },
                      '& th': { 
                        bgcolor: 'slate.50', 
                        fontWeight: 700, 
                        fontSize: '0.7rem', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em' 
                      }
                   }
                }
              }}
            >
              <div 
                className="markdown-body" 
                dangerouslySetInnerHTML={{ __html: release.content }} 
                // We'll handle list styling specifically in the CSS above
                // But it's better to just use a custom component for lists if we could.
                // Since it's dangerouslySetInnerHTML, we stick to CSS.
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
            startIcon={<UnfoldMoreRounded />}
            onClick={expandAll}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', px: 2 }}
          >
            Expand All
          </Button>
          <Button 
            startIcon={<UnfoldLessRounded />}
            onClick={collapseAll}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', px: 2 }}
          >
            Collapse All
          </Button>
          
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />
          
          <Button 
            startIcon={<HistoryRounded />}
            onClick={jumpToLatest}
            variant="outlined"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              fontSize: '0.875rem', 
              borderRadius: 2,
              borderColor: 'divider',
              color: 'text.primary',
              bgcolor: 'background.paper',
              whiteSpace: 'nowrap',
              px: 3,
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
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

      {/* Bottom Footer */}
      <Box sx={{ mt: 6, pb: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
          Version History • Endeavor
        </Typography>
      </Box>
    </Box>
  );
};
