import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, 
  FormControlLabel, Switch, Typography, Stack, Tabs, Tab, Divider,
  FormHelperText, Paper, Chip, Avatar, Tooltip, IconButton
} from '@mui/material';
import { 
  PaletteRounded, 
  CheckRounded
} from '@mui/icons-material';
import { AppFullscreenEditor, RichTextEditor, AppStatusChip, AppButton } from '@/components';
import { ReleaseNote, ReleaseAudience, ReleaseType, ReleaseStatus } from '../types';
import { generateNextVersion } from '../utils/versioning';

interface ReleaseEditorModalProps {
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
  { label: 'Technology Gradient', value: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop' },
  { label: 'Modern Workspace', value: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=200&auto=format&fit=crop' },
  { label: 'Dashboard UI', value: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=200&auto=format&fit=crop' },
  { label: 'Geometric Pattern', value: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop' },
];

export const ReleaseEditorModal: React.FC<ReleaseEditorModalProps> = ({
  open,
  onClose,
  onSave,
  existingNotes,
  initialNote
}) => {
  const [formData, setFormData] = useState<Partial<ReleaseNote>>({
    title: '',
    version: '',
    audience: 'All',
    releaseType: 'Feature',
    status: 'Published',
    description: '',
    content: '',
    tags: [],
    pinned: false,
    featured: false,
    heroStyle: 'solid',
    heroColor: '#2563EB',
    heroImage: SAMPLE_IMAGES[0].value
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialNote) {
        setFormData({
          heroStyle: 'solid',
          heroColor: '#2563EB',
          heroImage: SAMPLE_IMAGES[0].value,
          ...initialNote
        });
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
          tags: [],
          pinned: false,
          featured: false,
          heroStyle: 'solid',
          heroColor: '#2563EB',
          heroImage: SAMPLE_IMAGES[0].value
        });
      }
      setErrors({});
    }
  }, [open, initialNote, existingNotes]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.version?.trim()) newErrors.version = 'Version is required';
    if (existingNotes.find(n => n.version === formData.version && n.id !== formData.id)) {
      newErrors.version = 'Version must be unique';
    }
    if (!formData.description?.trim()) newErrors.description = 'Summary is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const finalNote: ReleaseNote = {
      id: formData.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
      title: formData.title || '',
      version: formData.version || '',
      audience: formData.audience as ReleaseAudience,
      releaseType: formData.releaseType as ReleaseType,
      status: formData.status as ReleaseStatus,
      description: formData.description || '',
      content: formData.content || '',
      createdBy: formData.createdBy || 'Current User',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || [],
      pinned: formData.pinned || false,
      featured: formData.featured || false,
      heroStyle: formData.heroStyle || 'solid',
      heroColor: formData.heroColor || '#2563EB',
      heroImage: formData.heroImage || SAMPLE_IMAGES[0].value
    };

    onSave(finalNote);
    onClose();
  };

  return (
    <AppFullscreenEditor
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={initialNote ? `Edit Release ${initialNote.version}` : 'Create New Release'}
      saveLabel={initialNote ? 'Update Release' : 'Publish Release'}
      cancelLabel="Discard"
      maxWidth={1000}
    >
      {(activeTab) => (
        activeTab === 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <TextField
                  label="Release Title"
                  fullWidth
                  size="small"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  error={!!errors.title}
                  helperText={errors.title}
                  inputProps={{ 'aria-label': 'Release title' }}
                />
                <TextField
                  label="Short Summary"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  error={!!errors.description}
                  helperText={errors.description}
                  inputProps={{ 'aria-label': 'Short summary of the release' }}
                />
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Detailed Notes</Typography>
                  <RichTextEditor 
                    value={formData.content || ''} 
                    onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                  />
                </Box>

                <Divider />

                <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                    <PaletteRounded sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Appearance Customization</Typography>
                  </Stack>
                  
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="hero-style-label">Hero Style</InputLabel>
                        <Select 
                          labelId="hero-style-label"
                          label="Hero Style"
                          value={formData.heroStyle}
                          onChange={(e) => setFormData(prev => ({ ...prev, heroStyle: e.target.value as any }))}
                        >
                          <MenuItem value="solid">Solid Color</MenuItem>
                          <MenuItem value="image">Image Background</MenuItem>
                        </Select>
                        <FormHelperText>Choose how the hero banner will be rendered</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={7}>
                      {formData.heroStyle === 'solid' ? (
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Brand Color
                          </Typography>
                          <Stack spacing={2}>
                            <Grid container spacing={1}>
                              {PRESET_COLORS.map(color => (
                                <Grid item key={color.value}>
                                  <Tooltip title={color.label}>
                                    <Box 
                                      onClick={() => setFormData(prev => ({ ...prev, heroColor: color.value }))}
                                      sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        bgcolor: color.value, 
                                        borderRadius: 1.5, 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid',
                                        borderColor: formData.heroColor === color.value ? 'primary.main' : 'transparent',
                                        boxShadow: formData.heroColor === color.value ? 2 : 0,
                                        '&:hover': { transform: 'translateY(-2px)' },
                                        transition: 'all 0.2s'
                                      }}
                                    >
                                      {formData.heroColor === color.value && <CheckRounded sx={{ fontSize: 18, color: 'white' }} />}
                                    </Box>
                                  </Tooltip>
                                </Grid>
                              ))}
                            </Grid>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                              <Box 
                                component="input" 
                                type="color" 
                                value={formData.heroColor}
                                onChange={(e: any) => setFormData(prev => ({ ...prev, heroColor: e.target.value }))}
                                sx={{ width: 40, height: 40, p: 0, border: '1px solid #ccc', borderRadius: 1, cursor: 'pointer', bgcolor: 'transparent' }}
                              />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>Custom Hex Code</Typography>
                                <TextField 
                                  size="small" 
                                  fullWidth
                                  value={formData.heroColor?.toUpperCase()}
                                  onChange={(e) => setFormData(prev => ({ ...prev, heroColor: e.target.value }))}
                                  inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.875rem' } }}
                                  sx={{ '& .MuiInputBase-root': { height: 32 } }}
                                />
                              </Box>
                            </Stack>
                          </Stack>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Background Image
                          </Typography>
                          <Stack spacing={2}>
                            <Grid container spacing={1.5}>
                              {SAMPLE_IMAGES.map(img => (
                                <Grid item xs={6} key={img.value}>
                                  <Box 
                                    onClick={() => setFormData(prev => ({ ...prev, heroImage: img.value }))}
                                    sx={{ 
                                      height: 60, 
                                      borderRadius: 1.5, 
                                      backgroundImage: `url(${img.value})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      cursor: 'pointer',
                                      position: 'relative',
                                      border: '2px solid',
                                      borderColor: formData.heroImage === img.value ? 'primary.main' : 'transparent',
                                      overflow: 'hidden',
                                      boxShadow: formData.heroImage === img.value ? 2 : 0,
                                      '&:hover': { opacity: 0.9 }
                                    }}
                                  >
                                    <Box sx={{ 
                                      position: 'absolute', 
                                      bottom: 0, 
                                      left: 0, 
                                      right: 0, 
                                      bgcolor: 'rgba(0,0,0,0.5)', 
                                      p: 0.5,
                                      backdropFilter: 'blur(2px)'
                                    }}>
                                      <Typography variant="caption" sx={{ color: 'white', fontSize: '9px', fontWeight: 700, display: 'block', textAlign: 'center' }}>
                                        {img.label}
                                      </Typography>
                                    </Box>
                                    {formData.heroImage === img.value && (
                                      <Box sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'primary.main', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckRounded sx={{ color: 'white', fontSize: 14 }} />
                                      </Box>
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                            <TextField 
                              label="Custom Image URL"
                              size="small"
                              fullWidth
                              placeholder="https://example.com/image.jpg"
                              value={formData.heroImage}
                              onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                            />
                          </Stack>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Stack spacing={3} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <TextField
                  label="Version Identifier"
                  fullWidth
                  size="small"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  error={!!errors.version}
                  helperText={errors.version}
                />
                
                <FormControl fullWidth size="small">
                  <InputLabel>Audience</InputLabel>
                  <Select 
                    label="Audience" 
                    value={formData.audience}
                    onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value as any }))}
                  >
                    {AUDIENCES.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Release Type</InputLabel>
                  <Select 
                    label="Release Type"
                    value={formData.releaseType}
                    onChange={(e) => setFormData(prev => ({ ...prev, releaseType: e.target.value as any }))}
                  >
                    {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select 
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  >
                    {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>

                <Divider />

                <FormControlLabel
                  control={<Switch checked={formData.pinned} onChange={(e) => setFormData(prev => ({ ...prev, pinned: e.target.checked }))} size="small" />}
                  label={<Typography variant="body2">Pin to Dashboard</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} size="small" />}
                  label={<Typography variant="body2">Mark as Featured</Typography>}
                />
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Paper 
            variant="outlined" 
            sx={{ 
              borderRadius: 2, 
              bgcolor: 'background.paper', 
              minHeight: 600,
              overflow: 'hidden'
            }}
          >
            {/* Hero Preview */}
            <Box sx={{ 
              p: 4, 
              bgcolor: formData.heroStyle === 'solid' ? (formData.heroColor || '#2563EB') : 'grey.900',
              backgroundImage: formData.heroStyle === 'image' ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${formData.heroImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              borderRadius: '8px 8px 0 0'
            }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{formData.title || 'Untitled Release'}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <AppStatusChip label={formData.version || 'v.x.x.x'} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <AppStatusChip label={formData.audience} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </Stack>
            </Box>

            <Box sx={{ p: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Summary</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {formData.description || 'No summary provided.'}
              </Typography>
              
              <Divider sx={{ mb: 4 }} />
              
              <Box 
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: formData.content || 'No detailed notes provided.' }}
                sx={{
                  '& h1': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 2 },
                  '& h2': { fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 2 },
                  '& ul, & ol': { pl: 3, mb: 2 },
                  '& li': { mb: 1 },
                  '& blockquote': { borderLeft: '4px solid', borderColor: 'divider', pl: 2, fontStyle: 'italic', color: 'text.secondary', my: 2 }
                }}
              />
            </Box>
          </Paper>
        )
      )}
    </AppFullscreenEditor>
  );
};
