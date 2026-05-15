import React from 'react';
import { ReleaseNotesDashboard } from './ReleaseNotesDashboard';
import { PageConfig, defaultConfig } from '../types/config';

const advancedConfig: PageConfig = {
  ...defaultConfig,
  ui: {
    ...defaultConfig.ui,
    compactDensity: false,
    showConfig: true,
  },
  grid: {
    ...defaultConfig.grid,
    rowHeight: 60,
    headerHeight: 64,
  }
};

export const AdvancedConfigPage: React.FC = () => {
  return <ReleaseNotesDashboard config={advancedConfig} />;
};
