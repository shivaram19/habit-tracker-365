import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface PainterGridProps {
  hourlyLogs: number[]; // Array of 24 integers (0-23) representing category IDs
  selectedCategory: number; // Currently selected category ID
  onHourChange: (hour: number, categoryId: number) => void;
  onBatchChange: (hours: number[], categoryId: number) => void;
}

interface CategoryColor {
  [key: number]: string;
}

// Category color mapping (matching mobile app)
const categoryColors: CategoryColor = {
  0: '#e5e5e5',  // Empty/None
  1: '#4ade80',  // Work - Green
  2: '#3b82f6',  // Sleep - Blue
  3: '#fb923c',  // Exercise - Orange
  4: '#ef4444',  // Food - Red
  5: '#a855f7',  // Shopping - Purple
  6: '#ec4899',  // Social - Pink
  7: '#facc15',  // Entertainment - Yellow
  8: '#14b8a6',  // Travel - Teal
  9: '#6366f1',  // Learning - Indigo
  10: '#94a3b8', // Chores - Gray
  11: '#06b6d4', // Health - Cyan
  12: '#71717a', // Other - Neutral
};

export default function PainterGrid({
  hourlyLogs,
  selectedCategory,
  onHourChange,
  onBatchChange,
}: PainterGridProps) {
  const [isPainting, setIsPainting] = useState(false);
  const [paintedHours, setPaintedHours] = useState<Set<number>>(new Set());
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
  const [pendingHours, setPendingHours] = useState<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Handle mouse down - start painting
  const handleMouseDown = (hour: number) => {
    const existingCategory = hourlyLogs[hour];
    
    // Check if overwriting
    if (existingCategory !== 0 && existingCategory !== selectedCategory) {
      setPendingHours([hour]);
      setShowOverwriteWarning(true);
      return;
    }

    setIsPainting(true);
    const newPainted = new Set<number>();
    newPainted.add(hour);
    setPaintedHours(newPainted);
    onHourChange(hour, selectedCategory);
  };

  // Handle mouse enter - continue painting
  const handleMouseEnter = (hour: number) => {
    if (!isPainting) return;

    const existingCategory = hourlyLogs[hour];
    
    // Skip if already painted in this drag session or if it's an overwrite
    if (paintedHours.has(hour)) return;
    if (existingCategory !== 0 && existingCategory !== selectedCategory) return;

    const newPainted = new Set(paintedHours);
    newPainted.add(hour);
    setPaintedHours(newPainted);
    onHourChange(hour, selectedCategory);
  };

  // Handle mouse up - end painting
  const handleMouseUp = () => {
    if (isPainting && paintedHours.size > 1) {
      // Batch change for undo support
      onBatchChange(Array.from(paintedHours), selectedCategory);
    }
    
    setIsPainting(false);
    setPaintedHours(new Set());
  };

  // Confirm overwrite
  const handleConfirmOverwrite = () => {
    if (pendingHours.length === 1) {
      onHourChange(pendingHours[0], selectedCategory);
    } else {
      onBatchChange(pendingHours, selectedCategory);
    }
    setShowOverwriteWarning(false);
    setPendingHours([]);
  };

  // Cancel overwrite
  const handleCancelOverwrite = () => {
    setShowOverwriteWarning(false);
    setPendingHours([]);
  };

  // Format hour display
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <>
      <div
        ref={gridRef}
        className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-2xl"
        style={{
          border: '3px solid var(--ink-color, #2c2c2c)',
          backgroundColor: 'var(--paper-bg, #fdf6e3)',
          opacity: 0.9,
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {hourlyLogs.map((categoryId, hour) => {
          const bgColor = categoryColors[categoryId] || categoryColors[0];
          const isCurrentlyPainting = paintedHours.has(hour);

          return (
            <motion.div
              key={hour}
              className="aspect-square relative cursor-pointer flex items-center justify-center rounded-lg"
              style={{
                backgroundColor: bgColor,
                border: isCurrentlyPainting 
                  ? '3px solid var(--ink-color, #2c2c2c)' 
                  : '2px solid var(--ink-color, #2c2c2c)',
              }}
              onMouseDown={() => handleMouseDown(hour)}
              onMouseEnter={() => handleMouseEnter(hour)}
              onTouchStart={() => handleMouseDown(hour)}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isCurrentlyPainting ? 1.1 : 1,
                rotate: isCurrentlyPainting ? 2 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span 
                className="text-[10px] sm:text-xs md:text-sm font-bold"
                style={{ color: 'var(--ink-color, #2c2c2c)' }}
              >
                {hour}
              </span>
              
              {/* Hour label tooltip on hover - hidden on mobile */}
              <div 
                className="hidden sm:block absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-mono whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10"
                style={{
                  backgroundColor: 'var(--ink-color, #2c2c2c)',
                  color: 'var(--paper-bg, #fdf6e3)',
                }}
              >
                {formatHour(hour)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overwrite Warning Modal */}
      <AnimatePresence>
        {showOverwriteWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleCancelOverwrite}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 5 }}
              transition={{ type: 'spring', damping: 20 }}
              className="max-w-md w-full p-6 sm:p-8 rounded-2xl"
              style={{
                backgroundColor: 'var(--paper-bg, #fdf6e3)',
                border: '3px solid var(--ink-color, #2c2c2c)',
                transform: 'rotate(1deg)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <AlertCircle 
                  className="flex-shrink-0" 
                  size={28}
                  style={{ color: 'var(--burnt-orange, #cc5500)' }}
                />
                <div>
                  <h3 
                    className="font-heading text-xl sm:text-2xl mb-2"
                    style={{ color: 'var(--ink-color, #2c2c2c)' }}
                  >
                    Overwrite Hour?
                  </h3>
                  <p 
                    className="font-mono text-xs sm:text-sm"
                    style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}
                  >
                    This hour is already logged with a different activity. Do you want to replace it?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 justify-end">
                <button
                  onClick={handleCancelOverwrite}
                  className="px-4 py-2 rounded-xl font-heading text-sm sm:text-base transition-transform hover:scale-105"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid var(--ink-color, #2c2c2c)',
                    color: 'var(--ink-color, #2c2c2c)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOverwrite}
                  className="px-4 py-2 rounded-xl font-heading text-sm sm:text-base transition-transform hover:scale-105"
                  style={{
                    backgroundColor: '#ef4444',
                    border: '2px solid var(--ink-color, #2c2c2c)',
                    color: '#fff',
                  }}
                >
                  Replace
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div 
        className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl"
        style={{
          backgroundColor: 'rgba(250, 204, 21, 0.2)',
          border: '2px solid var(--ink-color, #2c2c2c)',
        }}
      >
        <p 
          className="font-mono text-xs sm:text-sm"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.8 }}
        >
          💡 <strong>Tip:</strong> Click and drag to paint multiple hours at once!
        </p>
      </div>
    </>
  );
}
