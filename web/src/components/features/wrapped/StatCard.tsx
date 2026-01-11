import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color = '#007ba7',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay, type: 'spring', damping: 20 }}
      className="flex-1 min-w-[140px] p-4 border-3 text-center"
      style={{
        backgroundColor: 'var(--paper-bg, #fdfbf7)',
        borderColor: 'var(--ink-color, #2c2c2c)',
        borderRadius: '20px 15px 18px 16px / 16px 18px 15px 20px',
      }}
    >
      <motion.div
        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      >
        <Icon size={24} style={{ color }} />
      </motion.div>
      
      <p 
        className="font-mono text-xs font-bold uppercase tracking-wide mb-1"
        style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
      >
        {label}
      </p>
      
      <motion.p
        className="text-2xl sm:text-3xl font-heading"
        style={{ color }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
