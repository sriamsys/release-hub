import React from 'react';
import { ReleaseNotesDashboard } from './ReleaseNotesDashboard';
import { basicConfig } from '../types/config';

export const BasicConfigPage: React.FC = () => {
  return <ReleaseNotesDashboard config={basicConfig} />;
};
