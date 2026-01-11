import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center"
    >
      {Icon && (
        <motion.div
          animate={{ 
            rotate: [-5, 5, -5],
            y: [0, -5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: 'easeInOut',
          }}
          className="mb-4 p-4 rounded-full"
          style={{ 
            backgroundColor: 'var(--dandelion, #ffd700)',
            opacity: 0.3,
          }}
        >
          <Icon 
            size={48} 
            style={{ color: 'var(--ink-color, #2c2c2c)' }}
          />
        </motion.div>
      )}

      <h3 
        className="text-xl sm:text-2xl font-heading mb-2"
        style={{ color: 'var(--ink-color, #2c2c2c)' }}
      >
        {title}
      </h3>

      {description && (
        <p 
          className="font-mono text-sm max-w-xs mb-6"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
        >
          {description}
        </p>
      )}

      {action}
    </motion.div>
  );
}
