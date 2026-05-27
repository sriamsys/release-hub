import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, 
  FormControlLabel, Switch, Typography, Stack, Divider,
  Paper, Chip, Tooltip, IconButton, Dialog, DialogContent, 
  Button, useTheme, alpha, SelectChangeEvent, Autocomplete
} from '@mui/material';
import { 
  PaletteRounded, 
  CheckRounded,
  CloseRounded,
  FullscreenRounded,
  FullscreenExitRounded,
  LocalOfferRounded,
  PublicRounded
} from '@mui/icons-material';
import { AppStatusChip, AppButton } from '@/components';
import { ReleaseNote, ReleaseAudience, ReleaseType, ReleaseStatus } from '../types';
import { generateNextVersion } from '../utils/versioning';

// Import Toast UI Editor stylesheet and component
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

interface ReleaseEditorToastModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (note: ReleaseNote) => void;
  existingNotes: ReleaseNote[];
  initialNote?: ReleaseNote | null;
}

const AUDIENCES: ReleaseAudience[] = ['All', 'Managers', 'HR', 'Engineering', 'Admin'];
const TYPES: ReleaseType[] = ['Feature', 'Enhancement', 'Bug Fix', 'Security', 'Infrastructure'];
const STATUSES: ReleaseStatus[] = ['Draft', 'Published', 'Internal', 'Deprecated'];

const PRESET_COLORS = [
  { label: 'Blue', value: '#2563EB' },
  { label: 'Green', value: '#10B981' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Dark Slate', value: '#334155' },
  { label: 'Teal', value: '#14B8A6' },
];

const SAMPLE_IMAGES = [
  { label: 'Technology Gradient', value: '/assets/release-backgrounds/tech-gradient.jpg' },
  { label: 'Modern Workspace', value: '/assets/release-backgrounds/workspace.jpg' },
  { label: 'Dashboard UI', value: '/assets/release-backgrounds/dashboard-ui.jpg' },
  { label: 'Geometric Pattern', value: '/assets/release-backgrounds/geometric-pattern.jpg' },
];

const DEFAULT_MARKDOWN_SAMPLE = `## 🚀 Features & Enhancements

We are excited to share some major product improvements and refinements designed to empower your workflows.

### 📊 Optimized Reporting Visualizations
Our unified intelligence cards now load and aggregate metrics instantly.

| Component | Response Time | Memory Footprint | Stability |
| :--- | :---: | :---: | :---: |
| BI Widget v2 | < 120ms | 14MB | **99.99%** |
| Real-time Map | < 300ms | 28MB | Beta |
| SIEM Audit Feed | Auto | 5MB | Stable |

### 🛠️ Key Improvements in RBAC
* **Granular Inherited Permissions:** Automatically propagate policies through parent containers.
* **OpenID Session Baseline:** Refresh identities directly with Azure AD and Okta pipelines.

\`\`\`typescript
// Advanced Authorization Guard Configuration
export function checkPermission(user: User, action: string, scope: string): boolean {
  if (user.roles.includes('Admin')) return true;
  return user.permissions.some(p => p.action === action && p.scope === scope);
}
\`\`\`

> "Enterprise software demands strict control with elegant accessibility. Security and speed can go hand in hand."

*Got questions about this release? Reach out to your regional technical administrator or visit our [API Docs](https://api.example.com).*`;

export const ReleaseEditorToastModal: React.FC<ReleaseEditorToastModalProps> = ({
  open,
  onClose,
  onSave,
  existingNotes,
  initialNote
}) => {
  const theme = useTheme();
  const editorRef = useRef<any>(null);

  // States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<Partial<ReleaseNote>>({
    title: '',
    version: '',
    audience: 'All',
    releaseType: 'Feature',
    status: 'Published',
    description: '',
    content: '',
    createdBy: 'Current User',
    createdAt: '',
    tags: [],
    pinned: false,
    featured: false,
    heroStyle: 'solid',
    heroColor: '#2563EB',
    heroImage: SAMPLE_IMAGES[0].value,
    markdownContent: '',
    htmlContent: ''
  });

  // Track state for Public Link Enabled
  const [publicLinkEnabled, setPublicLinkEnabled] = useState(true);

  // Sync initial note when opening
  useEffect(() => {
    if (open) {
      if (initialNote) {
        setFormData({
          ...initialNote,
          tags: initialNote.tags || [],
          pinned: initialNote.pinned || false,
          featured: initialNote.featured || false,
          heroStyle: initialNote.heroStyle || 'solid',
          heroColor: initialNote.heroColor || '#2563EB',
          heroImage: initialNote.heroImage || SAMPLE_IMAGES[0].value,
          markdownContent: initialNote.markdownContent || '',
          htmlContent: initialNote.htmlContent || ''
        });
        setPublicLinkEnabled(initialNote.status === 'Published');
      } else {
        const nextVersion = generateNextVersion(existingNotes.map(n => n.version));
        setFormData({
          title: '',
          version: nextVersion,
          audience: 'All',
          releaseType: 'Feature',
          status: 'Published',
          description: '',
          content: '',
          createdBy: 'Jane Doe',
          createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          tags: ['enterprise', 'vNext'],
          pinned: false,
          featured: false,
          heroStyle: 'solid',
          heroColor: '#2563EB',
          heroImage: SAMPLE_IMAGES[0].value,
          markdownContent: DEFAULT_MARKDOWN_SAMPLE,
          htmlContent: ''
        });
        setPublicLinkEnabled(true);
      }
      setErrors({});
    }
  }, [open, initialNote, existingNotes]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.version?.trim()) newErrors.version = 'Version identifiers are required';
    if (existingNotes.find(n => n.version === formData.version && n.id !== formData.id)) {
      newErrors.version = 'Version identifiers must be unique';
    }
    if (!formData.description?.trim()) newErrors.description = 'Summary is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (statusToSave?: ReleaseStatus) => {
    if (!validate()) return;

    // Get content from Toast Editor
    const editorInstance = editorRef.current?.getInstance();
    const markdown = editorInstance?.getMarkdown() || '';
    const html = editorInstance?.getHTML() || '';

    const finalStatus = statusToSave || formData.status || 'Published';

    const finalNote: ReleaseNote = {
      id: formData.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
      title: formData.title || '',
      version: formData.version || '',
      audience: (formData.audience as ReleaseAudience) || 'All',
      releaseType: (formData.releaseType as ReleaseType) || 'Feature',
      status: finalStatus as ReleaseStatus,
      description: formData.description || '',
      content: html, // Sync detailed view compatibility
      createdBy: formData.createdBy || 'Jane Doe',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || [],
      pinned: formData.pinned || false,
      featured: formData.featured || false,
      heroStyle: formData.heroStyle || 'solid',
      heroColor: formData.heroColor || '#2563EB',
      heroImage: formData.heroImage || SAMPLE_IMAGES[0].value,
      markdownContent: markdown,
      htmlContent: html
    };

    onSave(finalNote);
    onClose();
  };

  const handleAddTag = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tagToRemove) || []
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          heroStyle: 'image',
          heroImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // We build a key for the editor based on note ID & Open status to destroy/reset cleanly 
  const editorKey = open ? `toast-editor-${formData.id || 'new'}` : 'toast-editor-closed';

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return; // Must click Discard/Close to avoid auto closing
        onClose();
      }}
      maxWidth={false}
      fullWidth
      slotProps={{
        backdrop: {
          sx: { 
            bgcolor: 'rgba(15, 23, 42, 0.4)', 
            backdropFilter: 'blur(8px)',
          }
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: isFullscreen ? 0 : 3,
          width: isFullscreen ? '100vw' : '90vw',
          height: isFullscreen ? '100vh' : '90vh',
          maxWidth: isFullscreen ? '100vw' : '1500px',
          maxHeight: isFullscreen ? '100vh' : '1000px',
          bgcolor: 'background.default',
          backgroundImage: 'none',
          boxShadow: isFullscreen ? 'none' : '0 24px 48px -12px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          m: isFullscreen ? 0 : 'auto',
          border: isFullscreen ? 'none' : '1px solid',
          borderColor: 'divider'
        }
      }}
    >
      {/* Dynamic Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        px: 3, 
        py: 2, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'background.paper',
        zIndex: 10,
        position: 'sticky',
        top: 0
      }}>
        {/* Left Actions: Close, Maximize, Title */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title="Discard Changes">
            <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
              <CloseRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFullscreen ? "Minimize modal Size" : "Go Fullscreen"}>
            <IconButton onClick={() => setIsFullscreen(!isFullscreen)} size="small" sx={{ color: 'text.secondary' }}>
              {isFullscreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Hanken Grotesk', color: 'text.primary', ml: 1 }}>
            {initialNote ? `Edit Release: v${initialNote.version}` : 'Create Release'}
          </Typography>
        </Stack>

        {/* Right Actions: Discard, Save Draft, Publish */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button 
            onClick={onClose} 
            variant="text" 
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Discard
          </Button>
          <Button 
            onClick={() => handleSave('Draft')} 
            variant="outlined" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: 1.5,
              borderColor: 'outline-variant',
              color: 'text.primary',
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.02)
              }
            }}
          >
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave('Published')} 
            variant="contained" 
            disableElevation
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              color: 'white',
              px: 2.5,
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            Publish Release
          </Button>
        </Stack>
      </Box>

      {/* Main Column Containers */}
      <DialogContent sx={{ p: 0, overflow: 'hidden', height: '100%', bgcolor: 'background.default' }}>
        <Grid container sx={{ height: '100%' }}>
          
          {/* LEFT COLUMN - 70% Width Content Section with its own scroll */}
          <Grid item xs={12} md={8.4} sx={{ 
            height: '100%', 
            overflowY: 'auto', 
            borderRight: '1px solid', 
            borderColor: 'divider',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            bgcolor: 'background.paper'
          }} className="custom-scrollbar">

            {/* Title Input */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', display: 'block', mb: 1 }}>
                Release Title *
              </Typography>
              <TextField 
                placeholder="e.g. WYSIWYG Editor Improvements or Cumulative Security Updates..."
                fullWidth
                size="medium"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                error={!!errors.title}
                helperText={errors.title}
                InputProps={{
                  sx: { 
                    borderRadius: 2, 
                    fontWeight: 700, 
                    fontSize: '1.25rem',
                    fontFamily: 'Hanken Grotesk',
                    '& fieldset': { borderColor: alpha(theme.palette.divider, 0.8) }
                  }
                }}
              />
            </Box>

            {/* Version and Date Row */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', display: 'block', mb: 1 }}>
                  Version Identifier *
                </Typography>
                <TextField 
                  placeholder="e.g. 2026.05.15"
                  fullWidth
                  required
                  size="small"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  error={!!errors.version}
                  helperText={errors.version}
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', display: 'block', mb: 1 }}>
                  Published Date
                </Typography>
                <TextField 
                  type="date"
                  fullWidth
                  size="small"
                  value={formData.createdAt ? formData.createdAt.split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, createdAt: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </Grid>
            </Grid>

            {/* Short Summary Card */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', display: 'block', mb: 1 }}>
                Short Summary *
              </Typography>
              <TextField 
                placeholder="Provide a concise 1-2 sentence executive summary of this update for bulletin views..."
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                error={!!errors.description}
                helperText={errors.description}
                InputProps={{ sx: { borderRadius: 2, fontSize: '0.95rem', lineHeight: 1.5 } }}
              />
            </Box>

            {/* Detailed Toast UI Editor Surface */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '620px', mt: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', display: 'block', mb: 1.5 }}>
                Detailed Release Notes (Toast UI - Markdown / WYSIWYG Editor)
              </Typography>
              
              {/* Box container for the editor with subtle outline */}
              <Box sx={{ 
                flexGrow: 1, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 2, 
                overflow: 'hidden',
                bgcolor: 'white',
                '& .toastui-editor-defaultUI': {
                  border: 'none !important'
                }
              }}>
                {open && (
                  <Editor
                    key={editorKey}
                    ref={editorRef}
                    initialValue={formData.markdownContent || formData.content || ''}
                    previewStyle="vertical"
                    height="600px"
                    initialEditType="wysiwyg"
                    useCommandShortcut={true}
                    toolbarItems={[
                      ['heading', 'bold', 'italic', 'strike'],
                      ['hr', 'quote'],
                      ['ul', 'ol', 'task', 'indent', 'outdent'],
                      ['table', 'image', 'link'],
                      ['code', 'codeblock'],
                    ]}
                  />
                )}
              </Box>
            </Box>
          </Grid>

          {/* RIGHT COLUMN - 30% Width Settings panel with metadata */}
          <Grid item xs={12} md={3.6} sx={{ 
            height: '100%', 
            overflowY: 'auto', 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            bgcolor: '#f8fafc' // Subtle premium neutral grey background
          }} className="custom-scrollbar">

            {/* Metadata Setting Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, fontFamily: 'Hanken Grotesk', fontSize: '0.95rem' }}>
                Release Metadata
              </Typography>
              <Stack spacing={2.5}>
                
                {/* Audience Selection */}
                <FormControl fullWidth size="small">
                  <InputLabel id="toast-audience-label">Audience Focus</InputLabel>
                  <Select 
                    labelId="toast-audience-label"
                    label="Audience Focus" 
                    value={formData.audience || 'All'}
                    onChange={(e: SelectChangeEvent) => setFormData(prev => ({ ...prev, audience: e.target.value as ReleaseAudience }))}
                    sx={{ borderRadius: 1.5 }}
                  >
                    {AUDIENCES.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </Select>
                </FormControl>

                {/* Release Type */}
                <FormControl fullWidth size="small">
                  <InputLabel id="toast-type-label">Release Category</InputLabel>
                  <Select 
                    labelId="toast-type-label"
                    label="Release Category"
                    value={formData.releaseType || 'Feature'}
                    onChange={(e: SelectChangeEvent) => setFormData(prev => ({ ...prev, releaseType: e.target.value as ReleaseType }))}
                    sx={{ borderRadius: 1.5 }}
                  >
                    {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>

                {/* Status Selection */}
                <FormControl fullWidth size="small">
                  <InputLabel id="toast-status-label">Publishing Status</InputLabel>
                  <Select 
                    labelId="toast-status-label"
                    label="Publishing Status"
                    value={formData.status || 'Published'}
                    onChange={(e: SelectChangeEvent) => setFormData(prev => ({ ...prev, status: e.target.value as ReleaseStatus }))}
                    sx={{ borderRadius: 1.5 }}
                  >
                    {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>

                {/* Author Input */}
                <TextField 
                  label="Document Author"
                  fullWidth
                  size="small"
                  value={formData.createdBy || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, createdBy: e.target.value }))}
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />

                {/* Tags Section */}
                <Divider />
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <LocalOfferRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>TAG TAXONOMY</Typography>
                  </Stack>
                  <TextField 
                    placeholder="Type tag & press Enter..."
                    fullWidth
                    size="small"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    InputProps={{ sx: { borderRadius: 1.5 } }}
                  />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
                    {formData.tags?.map(tag => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{ fontSize: '11px', fontWeight: 600, borderRadius: 1 }}
                      />
                    ))}
                    {(!formData.tags || formData.tags.length === 0) && (
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                        No tags assigned
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Paper>

            {/* Appearance Setting Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
                <PaletteRounded sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'Hanken Grotesk', fontSize: '0.95rem' }}>
                  Branded Appearance
                </Typography>
              </Stack>
              
              <Stack spacing={2.5}>
                
                {/* Hero Style Selection */}
                <FormControl fullWidth size="small">
                  <InputLabel id="toast-hero-label">Cover Banner Style</InputLabel>
                  <Select 
                    labelId="toast-hero-label"
                    value={formData.heroStyle || 'solid'}
                    label="Cover Banner Style"
                    onChange={(e: SelectChangeEvent) => setFormData(prev => ({ ...prev, heroStyle: e.target.value as any }))}
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="solid">Solid Palette Color</MenuItem>
                    <MenuItem value="image">Uploaded Cover Image</MenuItem>
                  </Select>
                </FormControl>

                {/* Style Sub-elements */}
                {formData.heroStyle === 'solid' ? (
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '10px', letterSpacing: '0.05em' }}>PRESET COLOR SCENARIOS</Typography>
                    <Grid container spacing={1}>
                      {PRESET_COLORS.map(color => (
                        <Grid item key={color.value} xs={3}>
                          <Box 
                            onClick={() => setFormData(prev => ({ ...prev, heroColor: color.value }))}
                            sx={{ 
                              height: 32, 
                              bgcolor: color.value, 
                              borderRadius: 1.25, 
                              cursor: 'pointer',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              border: '2px solid',
                              borderColor: formData.heroColor === color.value ? 'primary.main' : 'transparent',
                              transition: 'transform 0.1s',
                              '&:active': { transform: 'scale(0.95)' }
                            }}
                          >
                            {formData.heroColor === color.value && <CheckRounded sx={{ fontSize: 16, color: 'white' }} />}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <TextField 
                      size="small" 
                      fullWidth 
                      label="Custom Cover HEX"
                      value={formData.heroColor || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, heroColor: e.target.value }))}
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                     <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '10px', letterSpacing: '0.05em' }}>SELECT THEME COVER BACKGROUND</Typography>
                     <Grid container spacing={1}>
                      {SAMPLE_IMAGES.map(img => (
                        <Grid item xs={6} key={img.value}>
                          <Box 
                            onClick={() => setFormData(prev => ({ ...prev, heroImage: img.value }))}
                            sx={{ 
                              height: 48, 
                              borderRadius: 1.5, 
                              cursor: 'pointer',
                              backgroundImage: `url(${img.value})`, 
                              backgroundSize: 'cover', 
                              backgroundPosition: 'center',
                              border: '2px solid',
                              borderColor: formData.heroImage === img.value ? 'primary.main' : 'transparent',
                              position: 'relative',
                              transition: 'transform 0.15s',
                              '&:hover': { opacity: 0.9 }
                            }}
                          >
                             {formData.heroImage === img.value && (
                               <Box sx={{ 
                                 position: 'absolute', 
                                 top: 4, 
                                 right: 4, 
                                 bgcolor: 'primary.main', 
                                 borderRadius: '50%', 
                                 width: 16, 
                                 height: 16, 
                                 display: 'flex', 
                                 alignItems: 'center', 
                                 justifyContent: 'center' 
                               }}>
                                 <CheckRounded sx={{ color: 'white', fontSize: 10 }} />
                               </Box>
                             )}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="toast-hero-image-upload"
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="toast-hero-image-upload">
                        <Button 
                          component="span" 
                          variant="outlined" 
                          fullWidth 
                          size="small"
                          sx={{ textTransform: 'none', borderRadius: 1.5, borderColor: 'outline-variant' }}
                        >
                          Upload Custom Cover image
                        </Button>
                      </label>
                    </Box>

                    {formData.heroImage?.startsWith('data:') && (
                      <Box sx={{ position: 'relative' }}>
                        <Typography variant="caption" color="text.secondary">Custom Upload Cover:</Typography>
                        <Box sx={{ mt: 0.5, height: 60, borderRadius: 1.5, backgroundImage: `url(${formData.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid', borderColor: 'divider' }} />
                      </Box>
                    )}
                  </Stack>
                )}
              </Stack>
            </Paper>

            {/* Publishing Settings Checkbox Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, fontFamily: 'Hanken Grotesk', fontSize: '0.95rem' }}>
                Distribution & Sharing
              </Typography>
              <Stack spacing={1.5}>
                <FormControlLabel
                  control={<Switch checked={formData.pinned || false} onChange={(e) => setFormData(prev => ({ ...prev, pinned: e.target.checked }))} size="small" />}
                  label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Pin to User Dashboard</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={formData.featured || false} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} size="small" />}
                  label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Mark as Featured Bulletin</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={publicLinkEnabled} onChange={(e) => setPublicLinkEnabled(e.target.checked)} size="small" />}
                  label={
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Enable Public Direct Link</Typography>
                      <Tooltip title="When enabled, anyone with the system route can view the bulletin.">
                        <PublicRounded sx={{ fontSize: 13, color: 'text.disabled' }} />
                      </Tooltip>
                    </Stack>
                  }
                />
              </Stack>
            </Paper>

          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
