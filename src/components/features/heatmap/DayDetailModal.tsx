import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal } from '@/components/shared/Modal';
import { Day } from '@/types';
import { getCategoryById, getCategoryColor, getCategoryName } from '@/utils/categories';
import { format } from 'date-fns';
import { X } from 'lucide-react-native';

interface DayDetailModalProps {
  visible: boolean;
  day: Day | null;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  visible,
  day,
  onClose,
}) => {
  if (!day) return null;

  const dateObj = new Date(day.date + 'T00:00:00');
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');

  const hourlyLogs = day.hourly_logs || Array(24).fill(-1);

  const categoryCounts: Record<number, number> = {};
  hourlyLogs.forEach((categoryId) => {
    if (categoryId !== -1) {
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    }
  });

  const categoryEntries = Object.entries(categoryCounts)
    .map(([id, hours]) => ({
      category: getCategoryById(Number(id)),
      hours,
    }))
    .sort((a, b) => b.hours - a.hours);

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.date}>{formattedDate}</Text>
            {day.highlight && (
              <Text style={styles.highlight}>"{day.highlight}"</Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>24-Hour Breakdown</Text>
            <View style={styles.breakdownList}>
              {hourlyLogs.map((categoryId, hour) => {
                const category = getCategoryById(categoryId);
                return (
                  <View key={hour} style={styles.hourRow}>
                    <Text style={styles.hourLabel}>
                      {hour.toString().padStart(2, '0')}:00
                    </Text>
                    <View
                      style={[styles.hourColorBlock, { backgroundColor: category.color }]}
                    />
                    <Text style={styles.hourCategory}>{category.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Summary</Text>
            {categoryEntries.map(({ category, hours }) => (
              <View key={category.id} style={styles.summaryRow}>
                <View
                  style={[styles.summaryDot, { backgroundColor: category.color }]}
                />
                <Text style={styles.summaryName}>
                  {category.name}
                </Text>
                <Text style={styles.summaryHours}>
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </Text>
              </View>
            ))}
          </View>

          {day.total_spend > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Total Spending</Text>
              <Text style={styles.totalSpend}>
                ${Number(day.total_spend).toFixed(2)}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  highlight: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  breakdownList: {
    gap: 8,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hourLabel: {
    width: 50,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  hourColorBlock: {
    width: 40,
    height: 20,
    borderRadius: 4,
  },
  hourCategory: {
    fontSize: 12,
    color: '#374151',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  summaryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  summaryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  summaryHours: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  totalSpend: {
    fontSize: 36,
    fontWeight: '700',
    color: '#10B981',
  },
});
