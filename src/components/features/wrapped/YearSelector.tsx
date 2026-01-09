import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearSelect: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  years,
  selectedYear,
  onYearSelect,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>View Year</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {years.map((year) => {
          const isSelected = selectedYear === year;
          const isCurrent = year === currentYear;

          return (
            <TouchableOpacity
              key={year}
              onPress={() => onYearSelect(year)}
              activeOpacity={0.7}
            >
              <MotiView
                animate={{
                  backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6',
                  scale: isSelected ? 1.05 : 1,
                }}
                transition={{ type: 'timing', duration: 200 }}
                style={styles.yearChip}
              >
                <Text style={[styles.yearText, isSelected && styles.yearTextSelected]}>
                  {year}
                </Text>
                {isCurrent && (
                  <View style={styles.currentIndicator} />
                )}
              </MotiView>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  scrollContent: {
    gap: 12,
  },
  yearChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    position: 'relative',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  yearTextSelected: {
    color: '#FFFFFF',
  },
  currentIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
});
