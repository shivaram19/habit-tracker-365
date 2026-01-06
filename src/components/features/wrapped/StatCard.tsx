import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color = '#3B82F6',
  delay = 0,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay }}
      style={[styles.card, Platform.OS === 'android' && styles.androidShadow]}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: `${color}20` }]}
      >
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.label}>
        {label}
      </Text>
      <Text style={[styles.value, { color }]}>
        {value}
      </Text>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minWidth: 150,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {},
    }),
  },
  androidShadow: {
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});
