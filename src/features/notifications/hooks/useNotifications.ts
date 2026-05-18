import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationSessionState } from '../types';
import { notificationService } from '../services/notificationService';
import { canShowNotification, sortNotificationsByPriority } from '../utils/notificationUtils';
import { SAMPLE_NOTIFICATIONS } from '../mock/sampleNotifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sessionState, setSessionState] = useState<NotificationSessionState>(
    notificationService.getSessionState()
  );

  // Load notifications and ensure sample data exists for demo purposes
  useEffect(() => {
    const list = notificationService.getNotifications();
    if (list.length === 0) {
      notificationService.saveNotifications(SAMPLE_NOTIFICATIONS);
      setNotifications(SAMPLE_NOTIFICATIONS);
    } else {
      setNotifications(list);
    }
  }, []);

  const activeNotifications = sortNotificationsByPriority(
    notifications.filter(n => canShowNotification(n, sessionState))
  );

  // Polling Engine: Re-evaluate state every 60 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // Small optimization: only update state if there are actually notifications to re-evaluate
      // or if date-based expiration has occurred.
      setSessionState(notificationService.getSessionState());
    }, 60000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    // Mark visible notifications as viewed in the background
    // This also tracks current time for repeat/reappearance logic
    let stateChanged = false;
    activeNotifications.forEach(n => {
      if (!sessionState.viewedIds.includes(n.id)) {
        notificationService.markAsViewed(n.id);
        stateChanged = true;
      }
    });

    if (stateChanged) {
      setSessionState(notificationService.getSessionState());
    }
  }, [activeNotifications, sessionState]);

  const dismiss = useCallback((id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    notificationService.markAsDismissed(id, notification.persistDismissal);
    setSessionState(notificationService.getSessionState());
  }, [notifications]);

  return {
    notifications: activeNotifications,
    dismiss,
    hasNotifications: activeNotifications.length > 0
  };
};
