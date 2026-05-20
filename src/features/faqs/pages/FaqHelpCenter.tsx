import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Box, Grid, Typography, TextField, InputAdornment, Stack, 
  Accordion, AccordionSummary, AccordionDetails, List, 
  ListItemButton, ListItemIcon, ListItemText, Paper, 
  Chip, Divider, IconButton, Breadcrumbs, Link,
  Skeleton, Tooltip, Zoom, Fade, Button,
  Tab, Tabs, Alert
} from '@mui/material';
import { 
  SearchRounded, 
  ExpandMoreRounded, 
  HelpOutlineRounded, 
  ChevronRightRounded,
  StarRounded,
  PushPinRounded,
  CategoryRounded,
  LaunchRounded,
  ThumbUpRounded,
  ThumbDownRounded,
  ContentCopyRounded,
  PlayCircleRounded,
  LightbulbRounded,
  HistoryRounded,
  WhatshotRounded,
  CheckCircleRounded,
  MenuBookRounded,
  SearchOffRounded,
  OpenInFullRounded,
  CampaignRounded
} from '@mui/icons-material';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useFaqs } from '../hooks/useFaqs';
import { FaqEntry } from '../types';
import { FaqViewerModal } from '../components/FaqViewerModal';
import { ReleaseFeed } from '@/features/releaseNotes/components/ReleaseFeed';
import { AppStatusChip } from '@/components';
import { motion, AnimatePresence } from 'motion/react';

// --- Sub-components ---

const FaqFeedback: React.FC<{ faqId: string }> = ({ faqId }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    setSubmitted(true);
    // In a real app, send to analytics/backend
    console.log(`Feedback for ${faqId}: ${type}`);
  };

  if (submitted) {
    return (
      <Fade in>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, color: 'success.main' }}>
          <CheckCircleRounded sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Thanks for your feedback!</Typography>
        </Stack>
      </Fade>
    );
  }

  return (
    <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
        Was this helpful?
      </Typography>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Helpful" TransitionComponent={Zoom}>
          <IconButton 
            size="small" 
            onClick={() => handleFeedback('up')}
            sx={{ 
              color: feedback === 'up' ? 'success.main' : 'text.disabled',
              '&:hover': { bgcolor: 'success.50', color: 'success.main' }
            }}
          >
            <ThumbUpRounded sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Not helpful" TransitionComponent={Zoom}>
          <IconButton 
            size="small" 
            onClick={() => handleFeedback('down')}
            sx={{ 
              color: feedback === 'down' ? 'error.main' : 'text.disabled',
              '&:hover': { bgcolor: 'error.50', color: 'error.main' }
            }}
          >
            <ThumbDownRounded sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

const HighlightingText: React.FC<{ text: string, highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => (
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Box component="mark" key={i} sx={{ bgcolor: 'amber.200', color: 'inherit', px: 0.2, borderRadius: 0.5 }}>{part}</Box>
        ) : part
      ))}
    </>
  );
};

const HelpSkeleton = () => (
  <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, mt: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={3}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} variant="rectangular" height={64} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      </Grid>
      <Grid item xs={12} md={3}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} variant="rectangular" width={60} height={32} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Grid>
    </Grid>
  </Box>
);

// --- Main Component ---

export const FaqHelpCenter: React.FC = () => {
  const { faqs, loading } = useFaqs();
  const [searchParams, setSearchParams] = useSearchParams();
  const { version } = useParams<{ version?: string }>();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('c'));
  const [expandedId, setExpandedId] = useState<string | null>(searchParams.get('id'));
  
  // Determine active tab from URL or state
  const isReleaseNotesPath = window.location.pathname.includes('release-notes');
  const [activeTab, setActiveTab] = useState(isReleaseNotesPath ? 1 : 0);
  const [recentFaqs, setRecentFaqs] = useState<FaqEntry[]>([]);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqEntry | null>(null);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('c', selectedCategory);
    if (expandedId) params.set('id', expandedId);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, expandedId, setSearchParams]);

  // Keyboard Shortcuts (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Recently Viewed Logic
  useEffect(() => {
    const saved = localStorage.getItem('recent_faqs');
    if (saved && faqs.length > 0) {
      const ids = JSON.parse(saved) as string[];
      const recent = ids
        .map(id => faqs.find(f => f.id === id))
        .filter((f): f is FaqEntry => !!f);
      setRecentFaqs(recent);
    }
  }, [faqs]);

  const handleExpand = (id: string | null) => {
    setExpandedId(id);
    if (id) {
      // Update recents
      const saved = localStorage.getItem('recent_faqs');
      let ids = saved ? JSON.parse(saved) as string[] : [];
      ids = [id, ...ids.filter(i => i !== id)].slice(0, 5);
      localStorage.setItem('recent_faqs', JSON.stringify(ids));
      
      const faq = faqs.find(f => f.id === id);
      if (faq) {
        setRecentFaqs(prev => [faq, ...prev.filter(f => f.id !== id)].slice(0, 5));
      }
    }
  };

  const copyFaqLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const url = new URL(window.location.href);
    url.searchParams.set('id', id);
    navigator.clipboard.writeText(url.toString());
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 2000);
  };

  const handleOpenViewer = (e: React.MouseEvent, faq: FaqEntry) => {
    e.stopPropagation();
    setSelectedFaq(faq);
    setViewerOpen(true);
  };

  const categories = useMemo(() => {
    const cats = new Set(faqs.map(f => f.category));
    return Array.from(cats).sort();
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      const matchesSearch = 
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || f.category === selectedCategory;
      const isPublished = f.status === 'Published';
      const isNotGroup = !f.isGroup;

      return matchesSearch && matchesCategory && isPublished && isNotGroup;
    });
  }, [faqs, searchQuery, selectedCategory]);

  const featuredFaqs = useMemo(() => {
    return faqs.filter(f => f.featured && f.status === 'Published' && !f.isGroup);
  }, [faqs]);

  const pinnedFaqs = useMemo(() => {
    return faqs.filter(f => f.pinned && f.status === 'Published' && !f.isGroup);
  }, [faqs]);

  const hotTopics = useMemo(() => {
    // In a real app, this would be based on view counts
    return faqs.filter(f => f.featured).slice(0, 5);
  }, [faqs]);

  if (loading) {
    return (
      <Box sx={{ height: '100%', bgcolor: 'background.default', overflowY: 'auto' }}>
        <Box sx={{ bgcolor: 'primary.main', height: 200 }} />
        <HelpSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', bgcolor: 'background.default', overflowY: 'auto' }}>
      {/* Header / Hero Section (Hidden for Release Notes to match Stitch design) */}
      {activeTab !== 1 && (
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          pt: 8, 
          pb: 12, 
          px: 4, 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em' }}>
              How can we help?
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, mb: 6, fontWeight: 400 }}>
              Search our knowledge base or browse categories below.
            </Typography>
            
            <Paper sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              borderRadius: 3, 
              p: 0.5, 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              position: 'relative'
            }}>
              <TextField
                fullWidth
                inputRef={searchInputRef}
                placeholder="Search for questions, tutorials, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded sx={{ ml: 1, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ 
                        bgcolor: 'slate.100', 
                        color: 'text.secondary', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: 'divider',
                        mr: 1,
                        display: { xs: 'none', sm: 'block' }
                      }}>
                        /
                      </Box>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2.5,
                    '& fieldset': { border: 'none' },
                    height: 56,
                    fontSize: '1.125rem'
                  }
                }}
              />
            </Paper>
          </Box>
        </Box>
      )}

      {/* Copy Link Alert */}
      <Box sx={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <AnimatePresence>
          {showCopyAlert && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <Alert severity="success" sx={{ borderRadius: 2, boxShadow: 3 }}>
                Link copied to clipboard!
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, mt: activeTab === 1 ? 4 : -6, pb: 10 }}>
        {/* Content Type Tabs */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ borderRadius: 3, p: 0.5, bgcolor: 'background.paper' }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, v) => setActiveTab(v)}
              sx={{ minHeight: 48 }}
            >
              <Tab icon={<MenuBookRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Knowledge Base" sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }} />
              <Tab icon={<CampaignRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Release Notes" sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }} />
              <Tab icon={<PlayCircleRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Video Tutorials" sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }} />
              <Tab icon={<LightbulbRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Getting Started" sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }} />
            </Tabs>
          </Paper>
        </Box>

        {activeTab === 0 ? (
          <Grid container spacing={4}>
            {/* Left Column: Categories & Filters */}
            <Grid item xs={12} md={3}>
              <Stack spacing={3}>
                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: 'slate.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Browse Categories
                  </Typography>
                </Box>
                <List sx={{ p: 1 }}>
                  <ListItemButton 
                    selected={selectedCategory === null} 
                    onClick={() => setSelectedCategory(null)}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon><CategoryRounded sx={{ fontSize: 18 }} /></ListItemIcon>
                    <ListItemText primary="All Topics" primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItemButton>
                  {categories.map(cat => (
                    <ListItemButton 
                      key={cat} 
                      selected={selectedCategory === cat} 
                      onClick={() => setSelectedCategory(cat)}
                      sx={{ borderRadius: 2, mb: 0.5 }}
                    >
                      <ListItemIcon><ChevronRightRounded sx={{ fontSize: 18 }} /></ListItemIcon>
                      <ListItemText primary={cat} primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
                  Need more help?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Can't find what you're looking for? Reach out to our support team.
                </Typography>
                <Link href="#" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, textDecoration: 'none' }}>
                  Contact Support <LaunchRounded sx={{ fontSize: 14, ml: 0.5 }} />
                </Link>
              </Paper>
            </Stack>
          </Grid>

          {/* Center Column: Question List */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              {/* Featured / Pinned Section */}
              {!searchQuery && !selectedCategory && (pinnedFaqs.length > 0 || featuredFaqs.length > 0) && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <WhatshotRounded sx={{ color: 'orange.500' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Hot Topics</Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      {hotTopics.map(faq => (
                        <Grid item xs={12} sm={6} key={faq.id}>
                          <Paper 
                            onClick={() => handleExpand(faq.id)}
                            variant="outlined" 
                            sx={{ 
                              p: 2.5, 
                              borderRadius: 3, 
                              cursor: 'pointer',
                              '&:hover': { border: '1px solid', borderColor: 'primary.main', bgcolor: 'primary.50', transform: 'translateY(-2px)' },
                              transition: 'all 0.2s',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative'
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.dark' }}>
                                {faq.category}
                              </Typography>
                              {faq.featured && <StarRounded sx={{ color: 'amber.400', fontSize: 16 }} />}
                            </Stack>
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {faq.question}
                            </Typography>
                            <Box sx={{ mt: 'auto' }}>
                              <AppStatusChip label={faq.audience} size="small" />
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Main FAQ Accordions */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {selectedCategory || (searchQuery ? 'Search Results' : 'General Questions')}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {filteredFaqs.length} results
                    </Typography>
                  </Stack>

                  <AnimatePresence initial={false} mode="wait">
                    {filteredFaqs.length > 0 ? (
                      <Box key="results">
                        {filteredFaqs.map((faq, index) => (
                          <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Accordion 
                              expanded={expandedId === faq.id} 
                              onChange={(_, isExpanded) => handleExpand(isExpanded ? faq.id : null)}
                              sx={{ 
                                mb: 1.5, 
                                borderRadius: '12px !important',
                                border: '1px solid',
                                borderColor: expandedId === faq.id ? 'primary.light' : 'divider',
                                overflow: 'hidden',
                                '&:before': { display: 'none' },
                                boxShadow: expandedId === faq.id ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            >
                              <AccordionSummary 
                                expandIcon={<ExpandMoreRounded />}
                                sx={{ 
                                  '& .MuiAccordionSummary-content': { 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mr: 2
                                  } 
                                }}
                              >
                                <Stack direction="row" spacing={2} alignItems="center">
                                  {faq.pinned && <PushPinRounded sx={{ fontSize: 16, color: 'primary.main' }} />}
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    <HighlightingText text={faq.question} highlight={searchQuery} />
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} className="faq-actions">
                                  <Tooltip title="View Fullscreen">
                                    <IconButton size="small" onClick={(e) => handleOpenViewer(e, faq)}>
                                      <OpenInFullRounded sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Copy Link">
                                    <IconButton size="small" onClick={(e) => copyFaqLink(e, faq.id)}>
                                      <ContentCopyRounded sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </AccordionSummary>
                              <AccordionDetails sx={{ pt: 0, px: 3, pb: 3 }}>
                                <Divider sx={{ mb: 2.5, opacity: 0.5 }} />
                                <Box 
                                  className="markdown-body"
                                  sx={{ 
                                    color: 'text.secondary',
                                    '& p': { lineHeight: 1.7, mb: 2 }
                                  }}
                                >
                                  {/* Simple HTML rendering with highlighting logic would be complex for raw HTML, 
                                      so we just use the original content here as search highlight usually focuses on titles */}
                                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                </Box>
                                
                                {faq.tags.length > 0 && (
                                  <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                    {faq.tags.map(tag => (
                                      <Chip 
                                        key={tag} 
                                        label={`#${tag}`} 
                                        size="small" 
                                        variant="outlined" 
                                        sx={{ borderRadius: 1, fontSize: '0.75rem', fontWeight: 600 }} 
                                      />
                                    ))}
                                  </Stack>
                                )}

                                <FaqFeedback faqId={faq.id} />
                              </AccordionDetails>
                            </Accordion>
                          </motion.div>
                        ))}
                      </Box>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Box sx={{ py: 10, textAlign: 'center' }}>
                          <HelpOutlineRounded sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">No matching questions found</Typography>
                          <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>Try adjusting your search or category filters.</Typography>
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Button variant="outlined" size="small" onClick={() => setSearchQuery('')}>Clear Search</Button>
                            <Button variant="outlined" size="small" onClick={() => setSelectedCategory(null)}>Clear Filters</Button>
                          </Stack>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </Stack>
            </Grid>

            {/* Right Column: Related Search / Hot Topics */}
            <Grid item xs={12} md={3}>
              <Stack spacing={4}>
                {recentFaqs.length > 0 && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <HistoryRounded sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Recently Viewed
                      </Typography>
                    </Stack>
                    <List sx={{ p: 0 }}>
                      {recentFaqs.map(faq => (
                        <ListItemButton 
                          key={faq.id} 
                          onClick={() => handleExpand(faq.id)}
                          sx={{ px: 0, py: 1, '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
                        >
                          <ListItemText 
                            primary={faq.question} 
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 600, noWrap: true }} 
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Popular Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Array.from(new Set(faqs.flatMap(f => f.tags))).slice(0, 15).map(tag => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        onClick={() => {
                          setSearchQuery(tag);
                          setActiveTab(0);
                        }}
                        sx={{ 
                          borderRadius: 2, 
                          fontWeight: 600, 
                          bgcolor: searchQuery === tag ? 'primary.main' : 'slate.100',
                          color: searchQuery === tag ? 'white' : 'text.primary',
                          '&:hover': { bgcolor: searchQuery === tag ? 'primary.dark' : 'slate.200' }
                        }} 
                      />
                    ))}
                  </Box>
                </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Hot Topics
                </Typography>
                <Stack spacing={2}>
                  {hotTopics.map(f => (
                    <Box key={f.id}>
                      <Typography 
                        variant="body2" 
                        onClick={() => handleExpand(f.id)}
                        sx={{ 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          '&:hover': { color: 'primary.main', textDecoration: 'underline' } 
                        }}
                      >
                        {f.question}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

        </Grid>
      ) : activeTab === 1 ? (
        <ReleaseFeed initialSearchQuery={searchQuery} />
      ) : (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <Paper variant="outlined" sx={{ maxWidth: 600, mx: 'auto', p: 6, borderRadius: 4 }}>
            <PlayCircleRounded sx={{ fontSize: 64, color: 'text.disabled', mb: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>Coming Soon</Typography>
            <Typography color="text.secondary">
              We're currently building our {activeTab === 2 ? 'video tutorial library' : 'onboarding guides'}. 
              Stay tuned for interactive walkthroughs and visual content!
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 4, borderRadius: 2, px: 4 }}
              onClick={() => setActiveTab(0)}
            >
              Back to Knowledge Base
            </Button>
          </Paper>
        </Box>
      )}
      <FaqViewerModal 
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        faq={selectedFaq}
      />
    </Box>
  </Box>
);
};
