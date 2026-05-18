import { Notification, NotificationSessionState } from '../types';
import { CommonAudience } from '@/types/common';

export const isNotificationActive = (notification: Notification): boolean => {
  if (!notification.active) return false;
  
  const now = new Date();
  const start = new Date(notification.startDateTime);
  const end = new Date(notification.validUntil);
  
  return now >= start && now <= end;
};

export const canShowNotification = (
  notification: Notification, 
  sessionState: NotificationSessionState,
  userAudience: CommonAudience = 'All'
): boolean => {
  // Check if basic active/date status is valid
  if (!isNotificationActive(notification)) return false;

  // Check audience
  const hasAudience = notification.audience.includes('All') || 
                     notification.audience.includes(userAudience);
  if (!hasAudience) return false;

  // 1. Persistent Dismissal (Global)
  if (notification.persistDismissal && sessionState.persistDismissedIds.includes(notification.id)) {
    return false;
  }

  // 2. Session Dismissal
  if (sessionState.dismissedIds.includes(notification.id)) {
    // If repeat is enabled, dismissal might be temporary
    if (notification.repeatEnabled && notification.repeatIntervalMinutes) {
      const lastDismissedAtStr = sessionState.lastShownAt[notification.id]; // We use the same tracking for simplicity
      if (lastDismissedAtStr) {
        const lastDismissedAt = new Date(lastDismissedAtStr);
        const nextAllowed = new Date(lastDismissedAt.getTime() + notification.repeatIntervalMinutes * 60000);
        if (new Date() < nextAllowed) return false;
      }
    } else {
      // Not repeating, hidden for session
      return false;
    }
  }

  // 3. showOncePerSession (Hidden if viewed once in this session, even if not dismissed)
  // Note: Standard dismissal already covers "disappearing"
  if (notification.showOncePerSession && sessionState.viewedIds.includes(notification.id)) {
    // If it's repeating, showOncePerSession might conflict? 
    // Usually showOncePerSession and repeat are mutually exclusive in intent, 
    // but if both are present, showOncePerSession wins for the duration of the viewed state (session)
    return false;
  }

  // 4. Repeat Interval Check (General reappearance)
  if (notification.repeatEnabled && notification.repeatIntervalMinutes) {
    const lastShownStr = sessionState.lastShownAt[notification.id];
    if (lastShownStr) {
      const lastShown = new Date(lastShownStr);
      const nextAllowed = new Date(lastShown.getTime() + notification.repeatIntervalMinutes * 60000);
      if (new Date() < nextAllowed) return false;
    }
  }

  return true;
};

export const sortNotificationsByPriority = (notifications: Notification[]): Notification[] => {
  return [...notifications].sort((a, b) => b.priority - a.priority);
};
