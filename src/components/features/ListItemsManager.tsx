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
      <View className="flex-1 justify-center items-center">
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xl font-bold text-gray-900">Spending Items</Text>
          <Text className="text-sm font-semibold text-green-600 mt-0.5">
            Total: ${totalSpend.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center gap-1.5 bg-blue-500 px-4 py-2.5 rounded-lg"
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text className="text-white text-sm font-semibold">Add</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View className="bg-red-100 p-3 rounded-lg mb-4">
          <Text className="text-red-600 text-sm font-medium">{error}</Text>
        </View>
      )}

      <View className="flex-row items-center gap-2 mb-4">
        <Filter size={16} color="#6B7280" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          <TouchableOpacity
            className={`px-3 py-1.5 rounded-full border ${
              filterCategory === undefined
                ? 'bg-blue-500 border-blue-500'
                : 'bg-gray-100 border-gray-200'
            }`}
            onPress={() => setFilterCategory(undefined)}
          >
            <Text
              className={`text-xs font-medium ${
                filterCategory === undefined ? 'text-white' : 'text-gray-600'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          {spendingCategories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              className="px-3 py-1.5 rounded-full border"
              style={{
                backgroundColor: filterCategory === cat.id ? cat.color : '#F3F4F6',
                borderColor: filterCategory === cat.id ? cat.color : '#E5E7EB',
              }}
              onPress={() => setFilterCategory(cat.id)}
            >
              <Text
                className={`text-xs ${
                  filterCategory === cat.id ? 'text-white font-semibold' : 'text-gray-600 font-medium'
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
