import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { categories, type Category } from '../../utils/categories';
import type { ListItem } from './ListItemCard';

interface ListItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ListItem, 'id'>) => Promise<void>;
  initialData?: ListItem;
  defaultDate: string;
}

export function ListItemForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultDate,
}: ListItemFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<number>(0);
  const [date, setDate] = useState(defaultDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show categories that require spending
  const spendingCategories = categories.filter((c: Category) => c.requiresSpending);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
    } else {
      setName('');
      setPrice('');
      setCategory(spendingCategories[0]?.id || 0);
      setDate(defaultDate);
    }
    setError(null);
  }, [initialData, defaultDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter an item name');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid price');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        price: priceNum,
        category,
        date,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Item' : 'Add Item'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 border-2 rounded-lg font-mono text-sm"
            style={{
              backgroundColor: 'var(--brick-red, #cb4154)',
              color: 'var(--paper-bg, #fdfbf7)',
              borderColor: 'var(--ink-color, #2c2c2c)',
            }}
          >
            {error}
          </motion.div>
        )}

        <Input
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Coffee, Lunch, etc."
          autoFocus
        />

        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
        />

        <div>
          <label 
            className="block font-mono text-sm font-bold mb-2"
            style={{ color: 'var(--ink-color, #2c2c2c)' }}
          >
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {spendingCategories.map((cat) => (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`
                  p-2 border-2 font-mono text-xs sm:text-sm
                  flex items-center gap-2 truncate
                `}
                style={{
                  borderRadius: '12px 8px 10px 9px / 9px 10px 8px 12px',
                  borderColor: category === cat.id ? cat.color : 'var(--ink-color, #2c2c2c)',
                  backgroundColor: category === cat.id ? `${cat.color}20` : 'transparent',
                  color: 'var(--ink-color, #2c2c2c)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="truncate">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            fullWidth
          >
            {initialData ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
