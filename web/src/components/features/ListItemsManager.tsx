import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, DollarSign } from 'lucide-react';
import { ListItemCard } from './ListItemCard';
import type { ListItem } from './ListItemCard';
import { ListItemForm } from './ListItemForm';
import { Button } from '../shared/Button';
import { EmptyState } from '../shared/EmptyState';
import { categories, type Category } from '../../utils/categories';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ListItemsManagerProps {
  date: string;
}

export function ListItemsManager({ date }: ListItemsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItem | undefined>();
  const [filterCategory, setFilterCategory] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  // Store items in localStorage keyed by date
  const storageKey = `iconscious_items_${date}`;
  const [items, setItems] = useLocalStorage<ListItem[]>(storageKey, []);

  const handleAddItem = async (itemData: Omit<ListItem, 'id'>) => {
    const newItem: ListItem = {
      ...itemData,
      id: crypto.randomUUID(),
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = async (itemData: Omit<ListItem, 'id'>) => {
    if (!editingItem) return;
    setItems(items.map(item => 
      item.id === editingItem.id ? { ...item, ...itemData } : item
    ));
    setEditingItem(undefined);
  };

  const handleDeleteItem = useCallback((itemId: string) => {
    if (confirm('Delete this item?')) {
      setItems(items.filter(item => item.id !== itemId));
    }
  }, [items, setItems]);

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  const filteredItems = filterCategory !== undefined
    ? items.filter(item => item.category === filterCategory)
    : items;

  const totalSpend = filteredItems.reduce((sum, item) => sum + item.price, 0);
  const spendingCategories = categories.filter((c: Category) => c.requiresSpending);

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 
            className="text-lg sm:text-xl font-heading"
            style={{ color: 'var(--ink-color, #2c2c2c)' }}
          >
            Spending Log
          </h3>
          <p 
            className="font-mono text-sm"
            style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
          >
            Track your daily expenses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowForm(true)}
          >
            <span className="hidden sm:inline">Add Item</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-2 p-3 border-2 rounded-lg" style={{ borderColor: 'var(--ink-color, #2c2c2c)' }}>
              <button
                onClick={() => setFilterCategory(undefined)}
                className={`
                  px-3 py-1 font-mono text-xs border-2 rounded-full
                  transition-colors
                `}
                style={{
                  borderColor: 'var(--ink-color, #2c2c2c)',
                  backgroundColor: filterCategory === undefined ? 'var(--ink-color, #2c2c2c)' : 'transparent',
                  color: filterCategory === undefined ? 'var(--paper-bg, #fdfbf7)' : 'var(--ink-color, #2c2c2c)',
                }}
              >
                All
              </button>
              {spendingCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className="px-3 py-1 font-mono text-xs border-2 rounded-full transition-colors flex items-center gap-1"
                  style={{
                    borderColor: cat.color,
                    backgroundColor: filterCategory === cat.id ? cat.color : 'transparent',
                    color: filterCategory === cat.id ? '#fff' : 'var(--ink-color, #2c2c2c)',
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total Spend */}
      {items.length > 0 && (
        <motion.div
          className="flex items-center justify-between p-3 mb-4 border-2 rounded-lg"
          style={{
            backgroundColor: 'var(--dandelion, #ffd700)',
            borderColor: 'var(--ink-color, #2c2c2c)',
            opacity: 0.9,
          }}
        >
          <span className="font-mono font-bold text-sm" style={{ color: 'var(--ink-color, #2c2c2c)' }}>
            {filterCategory !== undefined ? 'Filtered Total' : 'Today\'s Total'}
          </span>
          <span className="font-mono font-bold text-lg" style={{ color: 'var(--ink-color, #2c2c2c)' }}>
            ${totalSpend.toFixed(2)}
          </span>
        </motion.div>
      )}

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No items yet"
          description="Start tracking your spending by adding an item"
          action={
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setShowForm(true)}
            >
              Add First Item
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Form Modal */}
      <ListItemForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={editingItem ? handleUpdateItem : handleAddItem}
        initialData={editingItem}
        defaultDate={date}
      />
    </div>
  );
}
