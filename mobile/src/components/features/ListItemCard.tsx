import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
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
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 200 }}
      style={[styles.card, Platform.OS === 'android' && styles.androidShadow]}
    >
      <View
        style={[styles.categoryBar, { backgroundColor: categoryColor }]}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.price}>
            ${item.price.toFixed(2)}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.category}>
            {category?.name || 'Other'}
          </Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
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
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {},
    }),
  },
  androidShadow: {
    elevation: 2,
  },
  categoryBar: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  date: {
    fontSize: 12,
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
