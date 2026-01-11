import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { categories, type Category } from '../../utils/categories';

export interface ListItem {
  id: string;
  name: string;
  price: number;
  category: number;
  date: string;
}

interface ListItemCardProps {
  item: ListItem;
  onEdit?: (item: ListItem) => void;
  onDelete?: (itemId: string) => void;
}

export function ListItemCard({ item, onEdit, onDelete }: ListItemCardProps) {
  const category = categories.find((c: Category) => c.id === item.category);
  const categoryColor = category?.color || '#6B7280';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 sm:p-4 border-2 mb-2"
      style={{
        backgroundColor: 'var(--paper-bg, #fdfbf7)',
        borderColor: 'var(--ink-color, #2c2c2c)',
        borderRadius: '12px 8px 10px 9px / 9px 10px 8px 12px',
      }}
    >
      {/* Category Color Bar */}
      <div
        className="w-1 h-12 rounded-full flex-shrink-0"
        style={{ backgroundColor: categoryColor }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p 
            className="font-mono font-bold text-sm sm:text-base truncate"
            style={{ color: 'var(--ink-color, #2c2c2c)' }}
          >
            {item.name}
          </p>
          <p 
            className="font-mono font-bold text-sm sm:text-base flex-shrink-0"
            style={{ color: categoryColor }}
          >
            ${item.price.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <span 
            className="font-mono text-xs px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            {category?.name || 'Other'}
          </span>
          <span 
            className="font-mono text-xs"
            style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.5 }}
          >
            {new Date(item.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {onEdit && (
          <motion.button
            onClick={() => onEdit(item)}
            className="p-2 rounded-full hover:bg-ink/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit size={16} style={{ color: 'var(--cerulean, #007ba7)' }} />
          </motion.button>
        )}
        {onDelete && (
          <motion.button
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-full hover:bg-ink/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} style={{ color: 'var(--brick-red, #cb4154)' }} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
