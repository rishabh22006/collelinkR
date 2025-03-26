
import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('theme', theme);
    
    // Update document class
    const root = window.document.documentElement;
    
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  return { theme, setTheme };
}
