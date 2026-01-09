import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

interface MonthSelectorProps {
  selectedMonth: number;
  year: number;
  onMonthSelect: (month: number) => void;
  onTodayPress: () => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  year,
  onMonthSelect,
  onTodayPress,
}) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MONTHS.map((month, index) => {
          const isSelected = selectedMonth === index;
          const isCurrent = currentMonth === index && currentYear === year;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onMonthSelect(index)}
              activeOpacity={0.7}
            >
              <MotiView
                animate={{
                  backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6',
                  scale: isSelected ? 1.05 : 1,
                }}
                transition={{ type: 'timing', duration: 200 }}
                style={styles.monthChip}
              >
                <Text
                  style={[
                    styles.monthText,
                    isSelected && styles.monthTextSelected,
                    isCurrent && styles.monthTextCurrent
                  ]}
                >
                  {month}
                </Text>
              </MotiView>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        onPress={onTodayPress}
        style={styles.todayButton}
        activeOpacity={0.7}
      >
        <Text style={styles.todayButtonText}>Today</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  monthChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  monthTextSelected: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  monthTextCurrent: {
    fontWeight: '700',
  },
  todayButton: {
    marginLeft: 8,
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#10B981',
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
