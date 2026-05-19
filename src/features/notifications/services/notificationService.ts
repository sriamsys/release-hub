import { createBaseService } from '@/services/baseService';
import { Notification, NotificationSessionState } from '../types';
import { NOTIFICATION_STORAGE_KEYS } from '../constants';
import { persistence } from '@/services/persistence';

const base = createBaseService<Notification>(NOTIFICATION_STORAGE_KEYS.DATA);

const INITIAL_SESSION_STATE: NotificationSessionState = {
  viewedIds: [],
  dismissedIds: [],
  persistDismissedIds: [],
  lastShownAt: {}
};

export const notificationService = {
  // Base CRUD
  getNotifications: base.getAll,
  saveNotifications: base.saveAll,
  addNotification: base.add,
  updateNotification: base.update,
  deleteNotification: base.delete,
  getNotificationById: base.getById,

  // Persistent State Management (LocalStorage)
  getPersistentDismissedIds: (): string[] => {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.PERSISTENT_STATE);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  updatePersistentDismissedIds: (ids: string[]): void => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.PERSISTENT_STATE, JSON.stringify(ids));
  },

  // Session State Management (Using sessionStorage as requested)
  getSessionState: (): NotificationSessionState => {
    const raw = sessionStorage.getItem(NOTIFICATION_STORAGE_KEYS.SESSION_STATE);
    const persistDismissedIds = notificationService.getPersistentDismissedIds();
    
    if (!raw) return { ...INITIAL_SESSION_STATE, persistDismissedIds };
    
    try {
      const sessionData = JSON.parse(raw);
      return {
        ...INITIAL_SESSION_STATE,
        ...sessionData,
        persistDismissedIds
      };
    } catch {
      return { ...INITIAL_SESSION_STATE, persistDismissedIds };
    }
  },

  updateSessionState: (state: Partial<NotificationSessionState>): void => {
    const currentState = notificationService.getSessionState();
    const newState = {
      ...currentState,
      ...state
    };
    // Don't store persistDismissedIds in sessionStorage, they live in localStorage
    const { persistDismissedIds, ...toStore } = newState;
    sessionStorage.setItem(NOTIFICATION_STORAGE_KEYS.SESSION_STATE, JSON.stringify(toStore));
  },

  markAsDismissed: (id: string, persist: boolean = false): void => {
    const now = new Date().toISOString();
    const state = notificationService.getSessionState();

    if (persist) {
      const persisted = notificationService.getPersistentDismissedIds();
      if (!persisted.includes(id)) {
        notificationService.updatePersistentDismissedIds([...persisted, id]);
      }
    } else {
      if (!state.dismissedIds.includes(id)) {
        notificationService.updateSessionState({
          dismissedIds: [...state.dismissedIds, id],
          lastShownAt: { ...state.lastShownAt, [id]: now }
        });
      }
    }
  },

  markAsViewed: (id: string): void => {
    const state = notificationService.getSessionState();
    const now = new Date().toISOString();
    
    const newViewedIds = state.viewedIds.includes(id) 
      ? state.viewedIds 
      : [...state.viewedIds, id];
      
    notificationService.updateSessionState({
      viewedIds: newViewedIds,
      lastShownAt: { ...state.lastShownAt, [id]: now }
    });
  }
};
