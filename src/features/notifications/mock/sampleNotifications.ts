import { Notification } from '../types';
import { NOTIFICATION_PRIORITIES } from '../constants';

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 7);

const past = new Date(now);
past.setHours(past.getHours() - 1);

export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Planned Maintenance',
    description: 'The system will be down for scheduled maintenance this Sunday from 2 AM to 4 AM UTC.',
    startDateTime: now.toISOString(),
    validUntil: nextWeek.toISOString(),
    audience: ['All'],
    type: 'warning',
    priority: NOTIFICATION_PRIORITIES.HIGH,
    dismissible: true,
    repeatEnabled: false,
    showOncePerSession: true,
    persistDismissal: true, // Persists across sessions
    active: true,
    createdBy: 'system',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    tags: ['maintenance', 'uptime'],
    pinned: true,
    featured: false
  },
  {
    id: 'notif-2',
    title: 'New Feature Announcement',
    description: 'We just launched the In-App Notifications module! Enhance your workflow with real-time alerts.',
    startDateTime: now.toISOString(),
    validUntil: nextWeek.toISOString(),
    audience: ['All'],
    type: 'success',
    priority: NOTIFICATION_PRIORITIES.MEDIUM,
    dismissible: true,
    repeatEnabled: false,
    showOncePerSession: false,
    persistDismissal: false,
    active: true,
    createdBy: 'product-team',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    tags: ['new-feature', 'release'],
    pinned: false,
    featured: true
  },
  {
    id: 'notif-3',
    title: 'System Outage - Region West',
    description: 'We are currently experiencing disruptions in core services for the West region. Our engineering team is investigating.',
    startDateTime: past.toISOString(),
    validUntil: tomorrow.toISOString(),
    audience: ['All'],
    type: 'outage',
    priority: NOTIFICATION_PRIORITIES.CRITICAL,
    dismissible: false,
    repeatEnabled: true,
    repeatIntervalMinutes: 30,
    showOncePerSession: false,
    persistDismissal: false,
    active: true,
    createdBy: 'infrastructure',
    createdAt: past.toISOString(),
    updatedAt: past.toISOString(),
    tags: ['incident', 'outage'],
    pinned: true,
    featured: false
  },
  {
    id: 'notif-4',
    title: 'Security Update Required',
    description: 'An important security patch has been deployed. Please refresh your browser to ensure you are on the latest version.',
    startDateTime: now.toISOString(),
    validUntil: nextWeek.toISOString(),
    audience: ['Administrators', 'Internal'],
    type: 'error',
    priority: NOTIFICATION_PRIORITIES.URGENT,
    dismissible: true,
    repeatEnabled: true,
    repeatIntervalMinutes: 60,
    showOncePerSession: false,
    persistDismissal: false,
    active: true,
    createdBy: 'security-team',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    tags: ['security', 'important'],
    pinned: true,
    featured: false
  },
  {
    id: 'notif-5',
    title: 'General Information',
    description: 'Don\'t forget to participate in our annual user satisfaction survey. Your feedback helps us improve!',
    startDateTime: now.toISOString(),
    validUntil: nextWeek.toISOString(),
    audience: ['Customers'],
    type: 'info',
    priority: NOTIFICATION_PRIORITIES.LOW,
    dismissible: true,
    repeatEnabled: false,
    showOncePerSession: true,
    persistDismissal: false,
    active: true,
    createdBy: 'growth',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    tags: ['survey', 'info'],
    pinned: false,
    featured: false
  }
];
