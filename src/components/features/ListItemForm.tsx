import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { ListItem } from '@/types';
import { CATEGORIES } from '@/utils/categories';
import { X } from 'lucide-react-native';

interface ListItemFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: ListItem;
  defaultDate: string;
}

export const ListItemForm: React.FC<ListItemFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  defaultDate,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<number>(0);
  const [date, setDate] = useState(defaultDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
    } else {
      setName('');
      setPrice('');
      setCategory(0);
      setDate(defaultDate);
    }
    setError(null);
  }, [initialData, defaultDate, visible]);

  const handleSubmit = async () => {
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

  const spendingCategories = CATEGORIES.filter(c => c.requiresSpending);

  return (
    <Modal visible={visible} onClose={onClose}>
      <View className="p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Item' : 'Add Item'}
          </Text>
          <TouchableOpacity onPress={onClose} className="p-1">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="max-h-[500px]">
          {error && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-600 text-sm font-medium">{error}</Text>
            </View>
          )}

          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Item Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Lunch at Cafe"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Price ($)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white"
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {spendingCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    className="px-4 py-2.5 rounded-lg border"
                    style={{
                      backgroundColor: isSelected ? cat.color : '#FFFFFF',
                      borderColor: isSelected ? cat.color : '#D1D5DB',
                    }}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected ? 'text-white font-semibold' : 'text-gray-600 font-medium'
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View className="flex-row gap-3 mt-6">
          <View className="flex-1">
            <Button
              title="Cancel"
              onPress={onClose}
              variant="secondary"
            />
          </View>
          <View className="flex-1">
            <Button
              title={initialData ? 'Update' : 'Add'}
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
