import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Clock, Flame, Calendar, DollarSign, Award } from 'lucide-react-native';
import { useAvailableYears, useWrappedStats } from '@/hooks/useStats';
import { YearSelector } from '@/components/features/wrapped/YearSelector';
import { DonutChart } from '@/components/features/wrapped/DonutChart';
import { LineChart } from '@/components/features/wrapped/LineChart';
import { StatCard } from '@/components/features/wrapped/StatCard';
import { TopItemsList } from '@/components/features/wrapped/TopItemsList';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/shared/Card';
import { format } from 'date-fns';

export default function WrappedScreen() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: availableYears, isLoading: yearsLoading } = useAvailableYears();
  const { data: stats, isLoading: statsLoading, refetch } = useWrappedStats(selectedYear);

  const isLoading = yearsLoading || statsLoading;

  const mostActiveCategory = useMemo(() => {
    if (!stats || stats.categories.length === 0) return null;
    return stats.categories[0];
  }, [stats]);

  const busiestMonth = useMemo(() => {
    if (!stats || stats.monthlySpending.length === 0) return null;
    const sorted = [...stats.monthlySpending].sort((a, b) => b.total - a.total);
    if (sorted[0].total === 0) return null;
    return format(new Date(sorted[0].month + '-01'), 'MMMM');
  }, [stats]);

  const totalSpending = useMemo(() => {
    if (!stats) return 0;
    return stats.monthlySpending.reduce((sum, month) => sum + month.total, 0);
  }, [stats]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (!stats || !availableYears) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={TrendingUp}
          title="No Data Available"
          description="Start logging your days to see your wrapped analytics."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <YearSelector
        years={availableYears}
        selectedYear={selectedYear}
        onYearSelect={setSelectedYear}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Clock}
              label="Total Hours"
              value={stats.totalHours}
              color="#3B82F6"
              delay={0}
            />
            {mostActiveCategory && (
              <StatCard
                icon={Award}
                label="Top Category"
                value={mostActiveCategory.name}
                color={mostActiveCategory.color}
                delay={100}
              />
            )}
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Flame}
              label="Work Streak"
              value={`${stats.streaks.longestWorkStreak} days`}
              color="#F59F00"
              delay={200}
            />
            <StatCard
              icon={Flame}
              label="Exercise Streak"
              value={`${stats.streaks.longestExerciseStreak} days`}
              color="#EC4899"
              delay={300}
            />
          </View>
          {busiestMonth && (
            <View style={styles.statsGrid}>
              <StatCard
                icon={Calendar}
                label="Busiest Month"
                value={busiestMonth}
                color="#8B5CF6"
                delay={400}
              />
              <StatCard
                icon={DollarSign}
                label="Total Spending"
                value={`$${totalSpending.toFixed(2)}`}
                color="#10B981"
                delay={500}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Distribution</Text>
          <Card>
            <DonutChart data={stats.categories} totalHours={stats.totalHours} />
          </Card>
        </View>

        {totalSpending > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Spending Trend</Text>
            <Card>
              <LineChart data={stats.monthlySpending} />
            </Card>
          </View>
        )}

        {stats.topItems.food.length > 0 && (
          <View style={styles.section}>
            <Card>
              <TopItemsList
                title="Top Food Items"
                items={stats.topItems.food}
                showSpend={true}
              />
            </Card>
          </View>
        )}

        {stats.topItems.shopping.length > 0 && (
          <View style={styles.section}>
            <Card>
              <TopItemsList
                title="Top Shopping Items"
                items={stats.topItems.shopping}
                showSpend={true}
              />
            </Card>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  bottomPadding: {
    height: 32,
  },
});
