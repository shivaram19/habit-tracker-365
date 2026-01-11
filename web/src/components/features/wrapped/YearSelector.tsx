import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export function YearSelector({
  year,
  onYearChange,
  minYear = 2020,
  maxYear = new Date().getFullYear(),
}: YearSelectorProps) {
  const canGoBack = year > minYear;
  const canGoForward = year < maxYear;

  return (
    <div className="flex items-center justify-center gap-4">
      <motion.button
        onClick={() => canGoBack && onYearChange(year - 1)}
        className={`
          p-2 rounded-full border-2 transition-colors
          ${canGoBack ? 'hover:bg-dandelion/30' : 'opacity-30 cursor-not-allowed'}
        `}
        style={{
          borderColor: 'var(--ink-color, #2c2c2c)',
          color: 'var(--ink-color, #2c2c2c)',
        }}
        whileHover={canGoBack ? { scale: 1.1 } : undefined}
        whileTap={canGoBack ? { scale: 0.9 } : undefined}
        disabled={!canGoBack}
      >
        <ChevronLeft size={20} />
      </motion.button>

      <motion.span
        key={year}
        className="text-3xl sm:text-4xl font-heading min-w-[120px] text-center"
        style={{ color: 'var(--burnt-orange, #cc5500)' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        {year}
      </motion.span>

      <motion.button
        onClick={() => canGoForward && onYearChange(year + 1)}
        className={`
          p-2 rounded-full border-2 transition-colors
          ${canGoForward ? 'hover:bg-dandelion/30' : 'opacity-30 cursor-not-allowed'}
        `}
        style={{
          borderColor: 'var(--ink-color, #2c2c2c)',
          color: 'var(--ink-color, #2c2c2c)',
        }}
        whileHover={canGoForward ? { scale: 1.1 } : undefined}
        whileTap={canGoForward ? { scale: 0.9 } : undefined}
        disabled={!canGoForward}
      >
        <ChevronRight size={20} />
      </motion.button>
    </div>
  );
}
