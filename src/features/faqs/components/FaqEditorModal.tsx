import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, 
  FormControlLabel, Switch, Typography, Stack, Tabs, Tab, Divider,
  FormHelperText, Paper
} from '@mui/material';
import { AppFullscreenEditor, RichTextEditor, AppStatusChip, useAppFullscreen } from '@/components';
import { FaqEntry, FaqStatus, FaqAudience } from '../types';

interface FaqEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (faq: FaqEntry) => void;
  initialFaq: FaqEntry | null;
  allFaqs?: FaqEntry[];
}

const AUDIENCES: FaqAudience[] = ['All', 'Customers', 'Internal', 'Administrators'];
const STATUSES: FaqStatus[] = ['Draft', 'Published', 'Hidden'];
const CATEGORIES = ['Payments', 'Authentication', 'Dashboard', 'Reports', 'User Management', 'Security', 'General'];

const FaqEditorContent: React.FC<{ activeTab: number; formData: Partial<FaqEntry>; setFormData: React.Dispatch<React.SetStateAction<Partial<FaqEntry>>>; errors: Record<string, string>; allFaqs: FaqEntry[]; initialFaq: FaqEntry | null }> = ({ activeTab, formData, setFormData, errors, allFaqs, initialFaq }) => {
  const { isMaximized } = useAppFullscreen();

  if (activeTab !== 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', flexGrow: 1, overflowY: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <AppStatusChip label={formData.category || 'General'} status="info" />
            <AppStatusChip label={formData.audience || 'All'} />
            {formData.isGroup && <AppStatusChip label="GROUP" status="warning" />}
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
            {formData.question || 'Untitled Question'}
          </Typography>
          {formData.tags && formData.tags.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {formData.tags.map(tag => <AppStatusChip key={tag} label={tag} variant="outlined" />)}
            </Stack>
          )}
          <Divider />
        </Box>
        <Box 
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: formData.answer || 'No answer content provided.' }}
          sx={{
            '& h1': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 2 },
            '& ul, & ol': { pl: 3, mb: 2 },
            '& blockquote': { borderLeft: '4px solid', borderColor: 'divider', pl: 2, fontStyle: 'italic', color: 'text.secondary', my: 2 }
          }}
        />
      </Paper>
    );
  }

  return (
    <Grid container spacing={4} sx={{ flexGrow: 1, height: '100%', minHeight: 0 }}>
      <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack spacing={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <TextField
            label="Question"
            fullWidth
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            error={!!errors.question}
            helperText={errors.question}
            placeholder="e.g. How do I change my workspace settings?"
          />

          <Box sx={{ mb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: isMaximized ? 400 : 300 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
              Detailed Answer
            </Typography>
            <RichTextEditor 
              value={formData.answer || ''}
              onChange={(val) => setFormData(prev => ({ ...prev, answer: val }))}
              sx={{ flexGrow: 1 }}
              minHeight={isMaximized ? 'calc(100vh - 260px)' : '600px'}
            />
            {errors.answer && (
              <FormHelperText error sx={{ mt: 1 }}>{errors.answer}</FormHelperText>
            )}
          </Box>
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
          <Stack spacing={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Publishing Info</Typography>
            
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as FaqStatus }))}
              >
                {STATUSES.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Audience</InputLabel>
              <Select
                value={formData.audience}
                label="Audience"
                onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value as FaqAudience }))}
              >
                {AUDIENCES.map(aud => (
                  <MenuItem key={aud} value={aud}>{aud}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Tags"
              size="small"
              fullWidth
              placeholder="Comma separated tags"
              value={formData.tags?.join(', ')}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
            />

            <Divider />

            <FormControlLabel
              control={<Switch checked={formData.isGroup} onChange={(e) => setFormData(prev => ({ ...prev, isGroup: e.target.checked }))} size="small" />}
              label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Create as Group</Typography>}
            />

            {!formData.isGroup && (
              <FormControl fullWidth size="small">
                <InputLabel>Parent Group</InputLabel>
                <Select
                  value={formData.parentId || ''}
                  label="Parent Group"
                  onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value || null }))}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {allFaqs.filter(f => f.isGroup && f.id !== initialFaq?.id).map(g => (
                    <MenuItem key={g.id} value={g.id}>{g.question}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              label="Display Order"
              type="number"
              size="small"
              fullWidth
              value={formData.displayOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
            />

            <Divider />

            <FormControlLabel
              control={<Switch checked={formData.pinned} onChange={(e) => setFormData(prev => ({ ...prev, pinned: e.target.checked }))} size="small" />}
              label={<Typography variant="body2">Pin to Top</Typography>}
            />
            <FormControlLabel
              control={<Switch checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} size="small" />}
              label={<Typography variant="body2">Feature on Help Center</Typography>}
            />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export const FaqEditorModal: React.FC<FaqEditorModalProps> = ({
  open,
  onClose,
  onSave,
  initialFaq,
  allFaqs = []
}) => {
  const [formData, setFormData] = useState<Partial<FaqEntry>>({
    question: '',
    answer: '',
    category: 'General',
    status: 'Draft',
    audience: 'All',
    displayOrder: 0,
    tags: [],
    pinned: false,
    featured: false,
    isGroup: false,
    parentId: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialFaq) {
        setFormData(initialFaq);
      } else {
        setFormData({
          question: '',
          answer: '',
          category: 'General',
          status: 'Draft',
          audience: 'All',
          displayOrder: 0,
          tags: [],
          pinned: false,
          featured: false,
          isGroup: false,
          parentId: null
        });
      }
      setErrors({});
    }
  }, [open, initialFaq]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.question) newErrors.question = 'Question is required';
    if (!formData.answer) newErrors.answer = 'Answer is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const finalFaq: FaqEntry = {
      id: initialFaq?.id || `f-${Date.now()}`,
      question: formData.question!,
      answer: formData.answer!,
      category: formData.category!,
      status: formData.status!,
      audience: formData.audience!,
      displayOrder: Number(formData.displayOrder) || 0,
      tags: formData.tags || [],
      pinned: !!formData.pinned,
      featured: !!formData.featured,
      isGroup: !!formData.isGroup,
      parentId: formData.parentId || null,
      createdBy: initialFaq?.createdBy || 'Current User',
      createdAt: initialFaq?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(finalFaq);
    onClose();
  };

  return (
    <AppFullscreenEditor
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={initialFaq ? 'Edit FAQ Entry' : 'Create New FAQ'}
      saveLabel={initialFaq ? 'Update FAQ' : 'Save FAQ'}
      tabs={['Content & Settings', 'Live Preview']}
    >
      {(activeTab) => (
        <FaqEditorContent 
          activeTab={activeTab} 
          formData={formData} 
          setFormData={setFormData} 
          errors={errors} 
          allFaqs={allFaqs} 
          initialFaq={initialFaq}
        />
      )}
    </AppFullscreenEditor>
  );
};
