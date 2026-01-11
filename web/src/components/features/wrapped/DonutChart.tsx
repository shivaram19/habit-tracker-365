import { motion } from 'framer-motion';

interface CategoryStats {
  id: number;
  name: string;
  color: string;
  hours: number;
  percentage: number;
}

interface DonutChartProps {
  data: CategoryStats[];
  totalHours: number;
}

export function DonutChart({ data, totalHours }: DonutChartProps) {
  const topCategories = data
    .filter(cat => cat.hours > 0)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 6);

  if (topCategories.length === 0) {
    return (
      <div className="p-8 text-center">
        <p 
          className="font-mono"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.5 }}
        >
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Total Hours Display */}
      <div className="text-center mb-6">
        <motion.p
          className="text-5xl sm:text-6xl font-heading"
          style={{ color: 'var(--burnt-orange, #cc5500)' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {totalHours}
        </motion.p>
        <p 
          className="font-mono text-sm"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
        >
          hours tracked
        </p>
      </div>

      {/* Category Bars */}
      <div className="space-y-3">
        {topCategories.map((cat, index) => (
          <motion.div
            key={cat.id}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Color Dot */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />

            {/* Category Name */}
            <p 
              className="font-mono text-sm w-24 truncate flex-shrink-0"
              style={{ color: 'var(--ink-color, #2c2c2c)' }}
            >
              {cat.name}
            </p>

            {/* Progress Bar */}
            <div 
              className="flex-1 h-4 border-2 rounded-full overflow-hidden"
              style={{ 
                borderColor: 'var(--ink-color, #2c2c2c)',
                backgroundColor: 'var(--paper-bg, #fdfbf7)',
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: cat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${cat.percentage}%` }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span 
                className="font-mono text-sm font-bold"
                style={{ color: 'var(--ink-color, #2c2c2c)' }}
              >
                {cat.hours}h
              </span>
              <span 
                className="font-mono text-xs"
                style={{ color: cat.color }}
              >
                {cat.percentage.toFixed(0)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
