import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CATEGORIES, EMPTY_CATEGORY } from '@/utils/categories';

export const CategoryLegend: React.FC = () => {
  const allCategories = [...CATEGORIES, EMPTY_CATEGORY];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {allCategories.map((category) => (
          <View key={category.id} style={styles.legendItem}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: category.color },
              ]}
            />
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
});
