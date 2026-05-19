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

// --- Types ---
const RELEASE_TYPES: ReleaseType[] = ['Feature', 'Enhancement', 'Bug Fix', 'Security', 'Infrastructure'];

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

  const getTypeColor = (type: ReleaseType) => {
    switch (type) {
      case 'Feature': return 'primary';
      case 'Bug Fix': return 'error';
      case 'Security': return 'warning';
      case 'Infrastructure': return 'info';
      case 'Enhancement': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ position: 'relative', pl: { xs: 4, sm: 8 }, mb: 0.5 }}>
      {/* Timeline Indicator */}
      <Box sx={{ 
        position: 'absolute', 
        left: { xs: 15, sm: 31 }, 
        top: 0, 
        bottom: 0, 
        width: 2, 
        bgcolor: alpha(theme.palette.divider, 0.4),
        zIndex: 0
      }} />
      
      {/* Timeline Bullet/Point */}
      <Box sx={{ 
        position: 'absolute', 
        left: { xs: 8, sm: 24 }, 
        top: 18, 
        width: 16, 
        height: 16, 
        borderRadius: '50%', 
        bgcolor: isLatest ? 'primary.main' : 'background.paper',
        border: '3px solid',
        borderColor: isLatest ? alpha(theme.palette.primary.main, 0.2) : 'divider',
        zIndex: 1,
        boxShadow: isLatest ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}` : 'none'
      }} />

      <Accordion 
        expanded={isExpanded}
        onChange={onToggle}
        disableGutters
        elevation={0}
        sx={{ 
          borderRadius: 2,
          border: '1px solid',
          borderColor: isLatest ? alpha(theme.palette.primary.main, 0.2) : 'divider',
          bgcolor: isLatest ? alpha(theme.palette.primary.main, 0.02) : 'transparent',
          '&:before': { display: 'none' },
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: isLatest ? 'primary.main' : 'slate.400',
            bgcolor: isLatest ? alpha(theme.palette.primary.main, 0.03) : 'slate.50',
          },
          ...(isExpanded && {
            borderColor: 'primary.main',
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[2]
          })
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreRounded sx={{ fontSize: 20 }} />}
          sx={{ 
            minHeight: 64,
            px: 3,
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              my: 1.5
            },
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'text.secondary',
              order: 3
            }
          }}
        >
          {/* LEFT: Timeline indicator & NEW badge handled by parent Box and this first item */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 48 }}>
             {isNew && (
                <Chip 
                  label="NEW" 
                  size="small" 
                  color="error" 
                  sx={{ 
                    height: 18, 
                    fontWeight: 900, 
                    fontSize: '0.6rem', 
                    px: 0.5,
                    borderRadius: 1
                  }} 
                />
              )}
          </Box>

          {/* CENTER: Title, Version, Type */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 0.5, sm: 2 } 
          }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {release.title}
            </Typography>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                v{release.version}
              </Typography>
              <Chip 
                label={release.releaseType} 
                size="small" 
                color={getTypeColor(release.releaseType)}
                sx={{ 
                  height: 20, 
                  fontSize: '0.7rem', 
                  fontWeight: 700,
                  bgcolor: (theme) => alpha(theme.palette[getTypeColor(release.releaseType)].main, 0.1),
                  color: (theme) => theme.palette[getTypeColor(release.releaseType)].main,
                  borderRadius: 1,
                  border: 'none'
                }} 
              />
            </Stack>
          </Box>

          {/* RIGHT: Date, Read Time */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 2,
            color: 'text.disabled',
            minWidth: 140,
            justifyContent: 'flex-end',
            mr: 1
          }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formattedDate}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeRounded sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{readTime}m</Typography>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
          <Box sx={{ px: 3, pb: 3 }}>
            <Divider sx={{ mb: 4, opacity: 0.4 }} />
            
            {/* Action Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 0, md: 4 } }}>
               <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.disabled', letterSpacing: '0.1em' }}>
                Release Documentation
              </Typography>
              <Tooltip title="Copy Permalink">
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?version=${release.version}`);
                  }}
                  sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}
                >
                  <ContentCopyRounded sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Rich Text Content */}
            <Box 
              sx={{ 
                maxWidth: 900, 
                mx: 'auto',
                color: 'text.primary',
                '& .markdown-body': {
                   fontSize: '0.95rem',
                   lineHeight: 1.7,
                   '& h1, h2, h3': { fontWeight: 800, mt: 4, mb: 2, color: 'slate.900' },
                   '& p': { mb: 2.5 },
                   '& ul, ol': { mb: 3, pl: 3 },
                   '& li': { mb: 1 },
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
                      '& th, td': {
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1.5,
                        textAlign: 'left'
                      },
                      '& th': { bgcolor: 'slate.50', fontWeight: 700 }
                   }
                }
              }}
            >
              <div className="markdown-body" dangerouslySetInnerHTML={{ __html: release.content }} />
            </Box>

            {/* Footer */}
            <Divider sx={{ mt: 6, mb: 2, opacity: 0.4 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: { xs: 0, md: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                Published on {formattedDate}
              </Typography>
              <Button 
                size="small" 
                onClick={onToggle}
                sx={{ textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
              >
                Collapse
              </Button>
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
  const [selectedType, setSelectedType] = useState<ReleaseType | 'All'>('All');
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
          // Scroll logic handled in a separate useEffect
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

  const toggleExpand = (id: string, version: string) => {
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
      const matchesType = selectedType === 'All' || r.releaseType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [releases, searchQuery, selectedType]);

  if (loading) return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <HistoryToggleOffRounded sx={{ fontSize: 40, color: 'text.disabled', mb: 2, animation: 'spin 2s linear infinite' }} />
      <Typography color="text.secondary">Fetching latest updates...</Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 4 }}>
      {/* Toolbar - Sticky */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 1.5, 
          mb: 4, 
          borderRadius: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search updates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 2, 
              bgcolor: 'background.paper',
              '& fieldset': { borderColor: 'divider' }
            }
          }}
        />
        
        <Stack direction="row" spacing={0.5} sx={{ overflowX: 'auto', py: 0.5, flexShrink: 0 }}>
          <Chip 
            label="All" 
            onClick={() => setSelectedType('All')}
            color={selectedType === 'All' ? 'primary' : 'default'}
            size="small"
            sx={{ fontWeight: 700, borderRadius: 1.5 }}
          />
          {RELEASE_TYPES.map(type => (
            <Chip 
              key={type}
              label={type} 
              onClick={() => setSelectedType(type)}
              color={selectedType === type ? 'primary' : 'default'}
              variant={selectedType === type ? 'filled' : 'outlined'}
              size="small"
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
          ))}
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />

        <Stack direction="row" spacing={0.5}>
           <Tooltip title="Expand All">
            <IconButton size="small" onClick={expandAll} sx={{ color: 'text.secondary' }}>
              <UnfoldMoreRounded fontSize="small" />
            </IconButton>
          </Tooltip>
           <Tooltip title="Collapse All">
            <IconButton size="small" onClick={collapseAll} sx={{ color: 'text.secondary' }}>
              <UnfoldLessRounded fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Latest">
            <IconButton size="small" onClick={jumpToLatest} sx={{ color: 'primary.main' }}>
              <AutoAwesomeRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {/* Feed List */}
      <Box sx={{ position: 'relative' }}>
        <AnimatePresence mode="popLayout">
          {filteredReleases.length > 0 ? (
            filteredReleases.map((release, index) => (
              <motion.div 
                key={release.id} 
                id={`release-${release.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                 <ReleaseFeedItem 
                  release={release}
                  isLatest={index === 0}
                  isExpanded={expandedIds.has(release.id)}
                  isNew={index === 0 && !viewedIds.has(release.id)}
                  onToggle={() => toggleExpand(release.id, release.version)}
                />
              </motion.div>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <NewReleasesRounded sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>No matching updates</Typography>
              <Typography variant="body2" color="text.secondary">Try a different search term or filter.</Typography>
            </Box>
          )}
        </AnimatePresence>
      </Box>

      {/* Bottom Footer */}
      <Box sx={{ mt: 8, pb: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
          End of feed • Check back soon
        </Typography>
      </Box>
    </Box>
  );
};
