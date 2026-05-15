import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, 
  FormControlLabel, Switch, Typography, Stack, Tabs, Tab, Divider,
  FormHelperText, Paper
} from '@mui/material';
import { AppFullscreenDialog, AppButton, RichTextEditor, AppStatusChip } from '@/components';
import { ReleaseNote, ReleaseAudience, ReleaseType, ReleaseStatus } from '../types';
import { generateNextVersion } from '../utils/versioning';
import { motion, AnimatePresence } from 'motion/react';

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

export const ReleaseEditorModal: React.FC<ReleaseEditorModalProps> = ({
  open,
  onClose,
  onSave,
  existingNotes,
  initialNote
}) => {
  const [tabIndex, setTabIndex] = useState(0);
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
    featured: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialNote) {
        setFormData(initialNote);
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
          featured: false
        });
      }
      setTabIndex(0);
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
      featured: formData.featured || false
    };

    onSave(finalNote);
    onClose();
  };

  return (
    <AppFullscreenDialog
      open={open}
      onClose={onClose}
      title={initialNote ? `Edit Release ${initialNote.version}` : 'Create New Release'}
      action={
        <Stack direction="row" spacing={1}>
          <AppButton variant="text" onClick={onClose} color="inherit">
            Discard
          </AppButton>
          <AppButton variant="contained" onClick={handleSave}>
            {initialNote ? 'Update Release' : 'Publish Release'}
          </AppButton>
        </Stack>
      }
    >
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Editor" />
          <Tab label="Preview" />
        </Tabs>

        <AnimatePresence mode="wait">
          {tabIndex === 0 ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
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
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', minHeight: 600 }}>
                <Stack spacing={2} sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{formData.title || 'Untitled Release'}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AppStatusChip label={formData.version || 'v.x.x.x'} status="info" />
                    <AppStatusChip label={formData.audience} />
                    <AppStatusChip label={formData.releaseType} status="neutral" />
                  </Stack>
                </Stack>
                
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
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </AppFullscreenDialog>
  );
};
