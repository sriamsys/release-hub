import React, { useState } from 'react';
import { Box, Tabs, Tab, Stack } from '@mui/material';
import { AppFullscreenDialog, AppButton } from '@/components';
import { motion, AnimatePresence } from 'motion/react';

interface AppFullscreenEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  saveLabel?: string;
  cancelLabel?: string;
  tabs?: string[];
  children: React.ReactNode | ((activeTab: number) => React.ReactNode);
  maxWidth?: number | string;
  isSaving?: boolean;
}

export const AppFullscreenEditor: React.FC<AppFullscreenEditorProps> = ({
  open,
  onClose,
  onSave,
  title,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  tabs = ['Editor', 'Preview'],
  children,
  maxWidth = 1200,
  isSaving = false
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderContent = () => {
    if (typeof children === 'function') {
      return children(activeTab);
    }
    
    // Default Tab behavior if children is not a function
    const childrenArray = React.Children.toArray(children);
    return childrenArray[activeTab] || childrenArray[0];
  };

  return (
    <AppFullscreenDialog
      open={open}
      onClose={onClose}
      title={title}
      action={
        <Stack direction="row" spacing={1}>
          <AppButton onClick={onClose} variant="text" color="inherit">
            {cancelLabel}
          </AppButton>
          <AppButton onClick={onSave} variant="contained" color="primary" loading={isSaving}>
            {saveLabel}
          </AppButton>
        </Stack>
      }
    >
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        maxWidth: maxWidth === 1200 ? '100%' : maxWidth, // Allow expansion if default
        mx: 'auto',
        overflow: 'hidden'
      }}>
        {tabs.length > 1 && (
          <Box sx={{ px: { xs: 2, md: 4 }, pt: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, val) => setActiveTab(val)} 
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {tabs.map((tab, idx) => (
                <Tab key={idx} label={tab} id={`editor-tab-${idx}`} />
              ))}
            </Tabs>
          </Box>
        )}

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </AppFullscreenDialog>
  );
};
