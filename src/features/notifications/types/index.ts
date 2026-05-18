import { BaseEntity, CommonAudience } from '@/types/common';

export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'outage';

export interface Notification extends BaseEntity {
  title: string;
  description: string;
  startDateTime: string; // ISO string
  validUntil: string;    // ISO string
  audience: CommonAudience[];
  type: NotificationType;
  priority: number;
  dismissible: boolean;
  repeatEnabled: boolean;
  repeatIntervalMinutes?: number;
  showOncePerSession: boolean;
  persistDismissal: boolean; // Added in Phase 3
  active: boolean;
}

export interface NotificationSessionState {
  viewedIds: string[];
  dismissedIds: string[]; // Session-based dismissals
  persistDismissedIds: string[]; // Persistent dismissals (loaded from localStorage)
  lastShownAt: Record<string, string>; // ID -> ISO string
}
