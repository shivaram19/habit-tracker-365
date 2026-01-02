import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TopItem } from '@/types';

interface TopItemsListProps {
  title: string;
  items: TopItem[];
  showSpend?: boolean;
}

export const TopItemsList: React.FC<TopItemsListProps> = ({
  title,
  items,
  showSpend = false,
}) => {
  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.listContainer}>
        {items.map((item, index) => (
          <View key={`${item.name}-${index}`} style={styles.itemRow}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.itemStats}>
                <Text style={styles.itemCount}>{item.count}x</Text>
                {showSpend && (
                  <>
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.itemSpend}>
                      ${item.totalSpend.toFixed(2)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  listContainer: {
    maxHeight: 400,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  separator: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  itemSpend: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
});
