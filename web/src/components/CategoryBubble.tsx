import { motion } from 'framer-motion';

interface CategoryBubbleProps {
  category: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
  selected: boolean;
  onPress: () => void;
}

export default function CategoryBubble({ category, selected, onPress }: CategoryBubbleProps) {
  return (
    <motion.button
      onClick={onPress}
      className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer"
      whileHover={{ scale: 1.1, rotate: selected ? 0 : 5 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        scale: selected ? 1.15 : 1,
        rotate: selected ? 0 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all duration-200"
        style={{
          backgroundColor: category.color,
          border: '3px solid var(--ink-color, #2c2c2c)',
          transform: selected ? 'translateY(-2px)' : 'none',
          boxShadow: selected ? '3px 3px 0px var(--ink-color, #2c2c2c)' : 'none',
        }}
      >
        {category.icon}
      </div>
      <span 
        className="font-mono text-[10px] sm:text-xs font-bold text-center max-w-[60px] truncate"
        style={{ 
          color: selected ? 'var(--burnt-orange, #cc5500)' : 'var(--ink-color, #2c2c2c)',
          opacity: selected ? 1 : 0.7,
        }}
      >
        {category.name}
      </span>
    </motion.button>
  );
}
