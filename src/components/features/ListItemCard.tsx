import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem } from '@/types';
import { CATEGORIES } from '@/utils/categories';
import { Trash2, Edit } from 'lucide-react-native';

interface ListItemCardProps {
  item: ListItem;
  onEdit?: (item: ListItem) => void;
  onDelete?: (itemId: string) => void;
}

export const ListItemCard: React.FC<ListItemCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const category = CATEGORIES.find(c => c.id === item.category);
  const categoryColor = category?.color || '#6B7280';

  return (
    <View style={styles.container}>
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.category}>{category?.name || 'Other'}</Text>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(item)}
          >
            <Edit size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(item.id)}
          >
            <Trash2 size={18} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  date: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
});
