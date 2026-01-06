import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
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
      <View style={styles.emptySection}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.listScroll}>
        {items.map((item, index) => (
          <MotiView
            key={`${item.name}-${index}`}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300, delay: index * 50 }}
            style={styles.itemCard}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>#{index + 1}</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>
                {item.name}
              </Text>
              <View style={styles.itemStats}>
                <Text style={styles.countText}>
                  {item.count}x
                </Text>
                {showSpend && (
                  <>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.spendText}>
                      ${item.totalSpend.toFixed(2)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  emptySection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  listScroll: {
    maxHeight: 400,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: {
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
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dot: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  spendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});
