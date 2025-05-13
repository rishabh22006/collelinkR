
import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('collelink-theme') as Theme | null;
    
    // If stored, use it; otherwise check system preference
    if (storedTheme) {
      return storedTheme;
    }
    
    // If system prefers dark, use dark theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  // Apply theme to document when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('collelink-theme', theme);
  }, [theme]);
  
  return {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      console.log('Theme changed to:', newTheme);
    },
  };
};

export default useTheme;
