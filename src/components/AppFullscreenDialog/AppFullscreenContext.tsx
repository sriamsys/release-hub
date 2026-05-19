import React, { createContext, useContext, useState } from 'react';

interface AppFullscreenContextType {
  isMaximized: boolean;
  setIsMaximized: (val: boolean) => void;
  toggleMaximize: () => void;
}

const AppFullscreenContext = createContext<AppFullscreenContextType | undefined>(undefined);

export const AppFullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => setIsMaximized(prev => !prev);

  return (
    <AppFullscreenContext.Provider value={{ isMaximized, setIsMaximized, toggleMaximize }}>
      {children}
    </AppFullscreenContext.Provider>
  );
};

export const useAppFullscreen = () => {
  const context = useContext(AppFullscreenContext);
  if (context === undefined) {
    throw new Error('useAppFullscreen must be used within an AppFullscreenProvider');
  }
  return context;
};
