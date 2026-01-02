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
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialData ? 'Edit Item' : 'Add Item'}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Lunch at Cafe"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {spendingCategories.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    isSelected && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={onClose}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title={initialData ? 'Update' : 'Add'}
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 500,
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
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});
