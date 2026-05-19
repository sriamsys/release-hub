import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, 
  FormControlLabel, Switch, Typography, Stack, Divider,
  FormHelperText, Paper, Chip, OutlinedInput
} from '@mui/material';
import { AppFullscreenEditor, AppStatusChip } from '@/components';
import { Notification, NotificationType } from '../types';
import { NOTIFICATION_TYPES, NOTIFICATION_AUDIENCES, NOTIFICATION_PRIORITIES } from '../constants';
import { CommonAudience } from '@/types/common';

interface NotificationEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (notification: Notification) => void;
  initialNotification: Notification | null;
}

export const NotificationEditorModal: React.FC<NotificationEditorModalProps> = ({
  open,
  onClose,
  onSave,
  initialNotification
}) => {
  const [formData, setFormData] = useState<Partial<Notification>>({
    title: '',
    description: '',
    type: 'info',
    priority: NOTIFICATION_PRIORITIES.MEDIUM,
    audience: ['All'],
    startDateTime: new Date().toISOString().slice(0, 16),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    active: true,
    dismissible: true,
    showOncePerSession: false,
    repeatEnabled: false,
    repeatIntervalMinutes: 60,
    persistDismissal: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialNotification) {
        setFormData({
          ...initialNotification,
          startDateTime: new Date(initialNotification.startDateTime).toISOString().slice(0, 16),
          validUntil: new Date(initialNotification.validUntil).toISOString().slice(0, 16)
        });
      } else {
        setFormData({
          title: '',
          description: '',
          type: 'info',
          priority: NOTIFICATION_PRIORITIES.MEDIUM,
          audience: ['All'],
          startDateTime: new Date().toISOString().slice(0, 16),
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          active: true,
          dismissible: true,
          showOncePerSession: false,
          repeatEnabled: false,
          repeatIntervalMinutes: 60,
          persistDismissal: false
        });
      }
      setErrors({});
    }
  }, [open, initialNotification]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.startDateTime) newErrors.startDateTime = 'Start date is required';
    if (!formData.validUntil) newErrors.validUntil = 'Valid until date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const finalNotification: Notification = {
      id: initialNotification?.id || `n-${Date.now()}`,
      title: formData.title!,
      description: formData.description!,
      type: formData.type as NotificationType,
      priority: formData.priority!,
      audience: formData.audience as CommonAudience[],
      startDateTime: new Date(formData.startDateTime!).toISOString(),
      validUntil: new Date(formData.validUntil!).toISOString(),
      active: !!formData.active,
      dismissible: !!formData.dismissible,
      showOncePerSession: !!formData.showOncePerSession,
      repeatEnabled: !!formData.repeatEnabled,
      repeatIntervalMinutes: formData.repeatIntervalMinutes,
      persistDismissal: !!formData.persistDismissal,
      createdBy: initialNotification?.createdBy || 'Current User',
      createdAt: initialNotification?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || [],
      pinned: !!formData.pinned,
      featured: !!formData.featured
    };

    onSave(finalNotification);
    onClose();
  };

  return (
    <AppFullscreenEditor
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={initialNotification ? 'Edit Notification' : 'Create Notification'}
      saveLabel={initialNotification ? 'Update' : 'Create'}
      tabs={['Content & Settings', 'Preview']}
    >
      {(activeTab) => (
        activeTab === 0 ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <TextField
                  label="Notification Title"
                  fullWidth
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  error={!!errors.title}
                  helperText={errors.title}
                  placeholder="e.g. System Maintenance Scheduled"
                />

                <TextField
                  label="Description / Body"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Provide details about the notification..."
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start DateTime"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.startDateTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDateTime: e.target.value }))}
                      error={!!errors.startDateTime}
                      helperText={errors.startDateTime}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Valid Until"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.validUntil}
                      onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                      error={!!errors.validUntil}
                      helperText={errors.validUntil}
                    />
                  </Grid>
                </Grid>

                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
                    Repeat Logic
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={formData.repeatEnabled} 
                            onChange={(e) => setFormData(prev => ({ ...prev, repeatEnabled: e.target.checked }))} 
                          />
                        }
                        label="Enable Recurring Reappearance"
                      />
                      {formData.repeatEnabled && (
                        <TextField
                          label="Interval (Minutes)"
                          type="number"
                          size="small"
                          fullWidth
                          value={formData.repeatIntervalMinutes}
                          onChange={(e) => setFormData(prev => ({ ...prev, repeatIntervalMinutes: parseInt(e.target.value) || 0 }))}
                          helperText="How often the notification should reappear after dismissal"
                        />
                      )}
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                <Stack spacing={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Configuration</Typography>
                  
                  <FormControl fullWidth size="small">
                    <InputLabel>Type / Severity</InputLabel>
                    <Select
                      value={formData.type}
                      label="Type / Severity"
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as NotificationType }))}
                    >
                      {NOTIFICATION_TYPES.map(type => (
                        <MenuItem key={type} value={type}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: `${type}.main` }} />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                    >
                      {Object.entries(NOTIFICATION_PRIORITIES).map(([key, val]) => (
                        <MenuItem key={key} value={val}>{key}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Audience</InputLabel>
                    <Select
                      multiple
                      value={formData.audience || []}
                      input={<OutlinedInput label="Audience" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                      onChange={(e) => setFormData(prev => ({ ...prev, audience: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as any }))}
                    >
                      {NOTIFICATION_AUDIENCES.map(aud => (
                        <MenuItem key={aud} value={aud}>{aud}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Divider />

                  <Stack spacing={1}>
                    <FormControlLabel
                      control={<Switch checked={formData.active} onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))} size="small" />}
                      label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Active</Typography>}
                    />
                    <FormControlLabel
                      control={<Switch checked={formData.dismissible} onChange={(e) => setFormData(prev => ({ ...prev, dismissible: e.target.checked }))} size="small" />}
                      label={<Typography variant="body2">Allow Dismissal</Typography>}
                    />
                    <FormControlLabel
                      control={<Switch checked={formData.persistDismissal} onChange={(e) => setFormData(prev => ({ ...prev, persistDismissal: e.target.checked }))} size="small" />}
                      label={<Typography variant="body2">Persistent Dismissal (LocalStorage)</Typography>}
                    />
                    <FormControlLabel
                      control={<Switch checked={formData.showOncePerSession} onChange={(e) => setFormData(prev => ({ ...prev, showOncePerSession: e.target.checked }))} size="small" />}
                      label={<Typography variant="body2">Show Once Per Session</Typography>}
                    />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ p: 4 }}>
             <Typography variant="subtitle2" gutterBottom color="text.secondary">Banner Preview:</Typography>
             <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  bgcolor: formData.type === 'outage' ? 'common.black' : `${formData.type}.light`,
                  border: '1px solid',
                  borderColor: `${formData.type}.main`,
                  borderRadius: 2,
                  color: formData.type === 'outage' ? 'white' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  position: 'relative'
                }}
             >
                <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{formData.title || 'Untitled'}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{formData.description || 'No description'}</Typography>
                </Box>
                <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  X
                </Box>
             </Paper>
          </Box>
        )
      )}
    </AppFullscreenEditor>
  );
};
