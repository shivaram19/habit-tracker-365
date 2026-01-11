import { motion } from 'framer-motion';

interface TopItem {
  id: number;
  name: string;
  hours: number;
  color: string;
}

interface TopItemsListProps {
  title: string;
  items: TopItem[];
  maxItems?: number;
}

export function TopItemsList({ title, items, maxItems = 5 }: TopItemsListProps) {
  const displayItems = items.slice(0, maxItems);
  
  if (displayItems.length === 0) {
    return (
      <div className="p-4 text-center">
        <p 
          className="font-mono text-sm"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.5 }}
        >
          No data yet
        </p>
      </div>
    );
  }

  const maxHours = Math.max(...displayItems.map(i => i.hours));

  return (
    <div>
      <h4 
        className="font-heading text-lg mb-4"
        style={{ color: 'var(--ink-color, #2c2c2c)' }}
      >
        {title}
      </h4>

      <div className="space-y-3">
        {displayItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Rank */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: index === 0 ? 'var(--dandelion, #ffd700)' :
                                index === 1 ? '#C0C0C0' :
                                index === 2 ? '#CD7F32' :
                                'var(--ink-color, #2c2c2c)',
                color: index < 3 ? 'var(--ink-color, #2c2c2c)' : 'var(--paper-bg, #fdfbf7)',
              }}
            >
              {index + 1}
            </div>

            {/* Name and Bar */}
            <div className="flex-1 min-w-0">
              <p 
                className="font-mono text-sm font-bold truncate mb-1"
                style={{ color: 'var(--ink-color, #2c2c2c)' }}
              >
                {item.name}
              </p>
              <div 
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--ink-color, #2c2c2c)', opacity: 0.1 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.hours / maxHours) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                />
              </div>
            </div>

            {/* Hours */}
            <span 
              className="font-mono text-sm font-bold flex-shrink-0"
              style={{ color: item.color }}
            >
              {item.hours}h
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
