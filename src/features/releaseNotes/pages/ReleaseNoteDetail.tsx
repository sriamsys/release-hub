import React from 'react';
import { ReleaseNotesDashboard } from './ReleaseNotesDashboard';

/**
 * ReleaseNoteDetail acts as a redirect bridge.
 * In a real app with nested routes, this might not be needed, but since we are
 * using a modal that responds to route params in the parent, we can just 
 * render the dashboard which handles the modal.
 */
export const ReleaseNoteDetail: React.FC = () => {
  return <ReleaseNotesDashboard />;
};
