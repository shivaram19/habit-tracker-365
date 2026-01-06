import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useListItems } from '@/hooks/useListItems';
import { ListItemForm } from './ListItemForm';
import { ListItemCard } from './ListItemCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ListItem } from '@/types';
import { Plus, Filter } from 'lucide-react-native';
import { CATEGORIES } from '@/utils/categories';

interface ListItemsManagerProps {
  userId: string;
  dayId: string;
  date: string;
  onItemsChange?: () => void;
}

export const ListItemsManager: React.FC<ListItemsManagerProps> = ({
  userId,
  dayId,
  date,
  onItemsChange,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItem | undefined>();
  const [filterCategory, setFilterCategory] = useState<number | undefined>();

  const { items, loading, error, addItem, deleteItem, updateItem } = useListItems({
    userId,
    dayId,
    autoFetch: true,
  });

  const handleAddItem = async (itemData: Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'>) => {
    await addItem(itemData, dayId);
    onItemsChange?.();
  };

  const handleUpdateItem = async (itemData: Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'>) => {
    if (!editingItem) return;
    await updateItem(editingItem.id, itemData);
    setEditingItem(undefined);
    onItemsChange?.();
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(itemId);
            onItemsChange?.();
          },
        },
      ]
    );
  };

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
  const spendingCategories = CATEGORIES.filter(c => c.requiresSpending);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Spending Items</Text>
          <Text style={styles.totalText}>
            Total: ${totalSpend.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.filterContainer}>
        <Filter size={16} color="#6B7280" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterCategory === undefined ? styles.filterChipActive : styles.filterChipInactive
            ]}
            onPress={() => setFilterCategory(undefined)}
          >
            <Text style={filterCategory === undefined ? styles.filterTextActive : styles.filterTextInactive}>
              All
            </Text>
          </TouchableOpacity>
          {spendingCategories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filterCategory === cat.id ? cat.color : '#F3F4F6',
                  borderColor: filterCategory === cat.id ? cat.color : '#E5E7EB',
                }
              ]}
              onPress={() => setFilterCategory(cat.id)}
            >
              <Text style={filterCategory === cat.id ? styles.filterTextActive : styles.filterTextInactive}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <EmptyState
            title="No items yet"
            message="Add spending items to track what you bought today"
          />
        ) : (
          filteredItems.map(item => (
            <ListItemCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))
        )}
      </ScrollView>

      <ListItemForm
        visible={showForm}
        onClose={handleCloseForm}
        onSubmit={editingItem ? handleUpdateItem : handleAddItem}
        initialData={editingItem}
        defaultDate={date}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  filterScroll: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipInactive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  filterTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterTextInactive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  listContainer: {
    flex: 1,
  },
});
