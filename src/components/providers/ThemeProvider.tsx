
import React, { createContext, useContext, useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';

type ThemeContextType = {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  
  const value = useMemo(() => ({
    theme,
    setTheme,
  }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
