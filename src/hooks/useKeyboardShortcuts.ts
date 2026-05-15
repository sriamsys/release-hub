import { useEffect } from 'react';

type ShortcutMap = {
  [key: string]: () => void;
};

export const useKeyboardShortcuts = (shortcuts: ShortcutMap) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      
      // Don't trigger shortcuts if focus is in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if (isInput && !isCmdOrCtrl) return;

      const shortcutKey = `${isCmdOrCtrl ? 'cmd+' : ''}${key}`;
      
      if (shortcuts[shortcutKey]) {
        e.preventDefault();
        shortcuts[shortcutKey]();
      } else if (shortcuts[key] && !isCmdOrCtrl && !isInput) {
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
