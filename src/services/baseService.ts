import { persistence } from './persistence';

export function createBaseService<T extends { id: string }>(storageKey: string) {
  return {
    getAll: (): T[] => {
      return persistence.get<T[]>(storageKey, []);
    },

    saveAll: (items: T[]): void => {
      persistence.set(storageKey, items);
    },

    add: (item: T, prepend: boolean = false): void => {
      const items = persistence.get<T[]>(storageKey, []);
      if (prepend) {
        persistence.set(storageKey, [item, ...items]);
      } else {
        persistence.set(storageKey, [...items, item]);
      }
    },

    update: (updatedItem: T): void => {
      const items = persistence.get<T[]>(storageKey, []);
      const index = items.findIndex(i => i.id === updatedItem.id);
      if (index !== -1) {
        items[index] = updatedItem;
        persistence.set(storageKey, items);
      }
    },

    delete: (id: string): void => {
      const items = persistence.get<T[]>(storageKey, []);
      persistence.set(storageKey, items.filter(i => i.id !== id));
    },

    getById: (id: string): T | undefined => {
      const items = persistence.get<T[]>(storageKey, []);
      return items.find(i => i.id === id);
    }
  };
}
