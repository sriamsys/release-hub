import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { Box, Typography } from '@mui/material';
import { 
  ReleaseNotesDashboard, 
  ReleaseNoteDetail, 
  BasicConfigPage, 
  AdvancedConfigPage, 
  EnterpriseDemoPage 
} from '@/features/releaseNotes/pages';

// Placeholder Pages
const Dashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700 }}>Dashboard</Typography>
    <Typography color="text.secondary">Welcome to ReleaseHub. Overview of system status and recent activity.</Typography>
  </Box>
);

const Docs = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700 }}>Documentation</Typography>
    <Typography color="text.secondary">Internal platform documentation and guides.</Typography>
  </Box>
);

const Config = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700 }}>Configuration</Typography>
    <Typography color="text.secondary">System settings and platform configuration.</Typography>
  </Box>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="release-notes" element={<ReleaseNotesDashboard />} />
        <Route path="release-notes/:version" element={<ReleaseNoteDetail />} />
        <Route path="basic-demo" element={<BasicConfigPage />} />
        <Route path="advanced-demo" element={<AdvancedConfigPage />} />
        <Route path="enterprise-demo" element={<EnterpriseDemoPage />} />
        <Route path="docs" element={<Docs />} />
        <Route path="config" element={<Config />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
