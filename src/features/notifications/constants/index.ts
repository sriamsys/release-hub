import { NotificationType } from '../types';
import { CommonAudience } from '@/types/common';

export const NOTIFICATION_TYPES: NotificationType[] = ['info', 'warning', 'success', 'error', 'outage'];

export const NOTIFICATION_AUDIENCES: CommonAudience[] = [
  'All',
  'Internal',
  'Managers',
  'Engineering',
  'Customers',
  'Administrators'
];

export const NOTIFICATION_PRIORITIES = {
  LOW: 0,
  MEDIUM: 10,
  HIGH: 20,
  URGENT: 30,
  CRITICAL: 100
};

export const NOTIFICATION_STORAGE_KEYS = {
  DATA: 'notifications_data',
  SESSION_STATE: 'notifications_session_state',
  PERSISTENT_STATE: 'notifications_persistent_state'
};
