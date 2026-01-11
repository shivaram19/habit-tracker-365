import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeMap = {
    sm: { icon: 16, padding: 'p-1.5' },
    md: { icon: 20, padding: 'p-2' },
    lg: { icon: 24, padding: 'p-3' },
  };

  const { icon: iconSize, padding } = sizeMap[size];

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        ${padding}
        rounded-full
        border-2
        transition-colors duration-200
      `}
      style={{
        backgroundColor: 'var(--paper-bg, #fdfbf7)',
        borderColor: 'var(--ink-color, #2c2c2c)',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        {theme === 'dark' ? (
          <Moon size={iconSize} style={{ color: 'var(--ink-color, #2c2c2c)' }} />
        ) : (
          <Sun size={iconSize} style={{ color: 'var(--burnt-orange, #cc5500)' }} />
        )}
      </motion.div>
    </motion.button>
  );
}
