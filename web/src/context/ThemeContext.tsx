import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ColorScheme = 'light' | 'dark';

interface ThemeColors {
  paper: string;
  ink: string;
  burntOrange: string;
  dandelion: string;
  cerulean: string;
  brickRed: string;
}

interface ThemeContextType {
  colorScheme: ColorScheme;
  theme: ColorScheme; // Alias for colorScheme
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (scheme: ColorScheme) => void;
}

const lightColors: ThemeColors = {
  paper: '#fdfbf7',
  ink: '#2c2c2c',
  burntOrange: '#cc5500',
  dandelion: '#ffd700',
  cerulean: '#007ba7',
  brickRed: '#cb4154',
};

const darkColors: ThemeColors = {
  paper: '#1a1a1a',
  ink: '#e5e5e5',
  burntOrange: '#ff7733',
  dandelion: '#ffe066',
  cerulean: '#33a5cc',
  brickRed: '#e05566',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'iconscious_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--paper-bg', colors.paper);
    root.style.setProperty('--ink-color', colors.ink);
    root.style.setProperty('--burnt-orange', colors.burntOrange);
    root.style.setProperty('--dandelion', colors.dandelion);
    root.style.setProperty('--cerulean', colors.cerulean);
    root.style.setProperty('--brick-red', colors.brickRed);
    
    // Update body background
    document.body.style.backgroundColor = colors.paper;
    document.body.style.color = colors.ink;
    
    // Add/remove dark class
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Persist to localStorage
    localStorage.setItem(THEME_KEY, colorScheme);
  }, [colorScheme, colors]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(THEME_KEY);
      if (!stored) {
        setColorScheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setColorScheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((scheme: ColorScheme) => {
    setColorScheme(scheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ colorScheme, theme: colorScheme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
