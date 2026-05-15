import React from 'react';
import { ReleaseNotesDashboard } from './ReleaseNotesDashboard';
import { enterpriseDemoConfig } from '../types/config';

export const EnterpriseDemoPage: React.FC = () => {
  return <ReleaseNotesDashboard config={enterpriseDemoConfig} />;
};
