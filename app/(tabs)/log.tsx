import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, List } from 'lucide-react-native';
import { addDays, subDays } from 'date-fns';
import { PainterGrid } from '@/components/features/PainterGrid';
import { CategoryBubble } from '@/components/features/CategoryBubble';
import { DraggableHandle } from '@/components/shared/DraggableHandle';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { ListItemsManager } from '@/components/features/ListItemsManager';
import { useDayLog, useUpsertDay } from '@/hooks/useLogs';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/utils/categories';
import { formatDisplayDate, formatDate, getTodayDate, isToday, isFutureDate } from '@/utils/formatters';
import { categoryRequiresSpending } from '@/utils/categories';

const MIN_CATEGORIES_HEIGHT = 80;
const MAX_CATEGORIES_HEIGHT = 300;
const DEFAULT_CATEGORIES_HEIGHT = 140;

export default function LogScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [hourlyLogs, setHourlyLogs] = useState<number[]>(Array(24).fill(-1));
  const [totalSpend, setTotalSpend] = useState('0');
  const [highlight, setHighlight] = useState('');
  const [showItemsManager, setShowItemsManager] = useState(false);
  const [categoriesHeight, setCategoriesHeight] = useState(DEFAULT_CATEGORIES_HEIGHT);
  const [initialHeight, setInitialHeight] = useState(DEFAULT_CATEGORIES_HEIGHT);

  const { user } = useAuth();
  const { profile, updateDividerPosition } = useProfile();
  const { data: dayData, isLoading } = useDayLog(selectedDate);
  const upsertMutation = useUpsertDay();
  const { showToast } = useToast();

  useEffect(() => {
    if (dayData) {
      setHourlyLogs(dayData.hourly_logs || Array(24).fill(-1));
      setTotalSpend(String(dayData.total_spend || 0));
      setHighlight(dayData.highlight || '');
    } else {
      setHourlyLogs(Array(24).fill(-1));
      setTotalSpend('0');
      setHighlight('');
    }
  }, [dayData]);

  useEffect(() => {
    if (profile?.divider_position) {
      setCategoriesHeight(profile.divider_position);
      setInitialHeight(profile.divider_position);
    }
  }, [profile]);

  const handleDrag = (deltaY: number) => {
    const newHeight = Math.max(
      MIN_CATEGORIES_HEIGHT,
      Math.min(MAX_CATEGORIES_HEIGHT, initialHeight + deltaY)
    );
    setCategoriesHeight(newHeight);
  };

  const handleDragEnd = async () => {
    setInitialHeight(categoriesHeight);
    if (updateDividerPosition) {
      try {
        await updateDividerPosition({ position: Math.round(categoriesHeight) });
      } catch (error) {
        console.error('Failed to save divider position:', error);
      }
    }
  };

  const handleHourChange = (hour: number, categoryId: number) => {
    const newLogs = [...hourlyLogs];
    newLogs[hour] = categoryId;
    setHourlyLogs(newLogs);
  };

  const handleBatchChange = (hours: number[], categoryId: number) => {
    const newLogs = [...hourlyLogs];
    hours.forEach(hour => {
      newLogs[hour] = categoryId;
    });
    setHourlyLogs(newLogs);
  };

  const handleSave = async () => {
    try {
      await upsertMutation.mutateAsync({
        date: selectedDate,
        dayData: {
          hourlyLogs,
          totalSpend: parseFloat(totalSpend) || 0,
          highlight: highlight || undefined,
        },
      });
      showToast('Day saved successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to save', 'error');
    }
  };

  const handlePreviousDay = () => {
    const newDate = subDays(new Date(selectedDate), 1);
    setSelectedDate(formatDate(newDate, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const newDate = addDays(new Date(selectedDate), 1);
    setSelectedDate(formatDate(newDate, 'yyyy-MM-dd'));
  };

  const handleToday = () => {
    setSelectedDate(getTodayDate());
  };

  const showSpendingInput = categoryRequiresSpending(selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Time Painter</Text>
          <Text style={styles.subtitle}>Paint your day by the hour</Text>
        </View>

        <View style={styles.dateNav}>
          <TouchableOpacity onPress={handlePreviousDay} style={styles.navButton}>
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleToday}>
            <Text style={styles.dateText}>
              {formatDisplayDate(selectedDate)}
            </Text>
            {isFutureDate(selectedDate) && (
              <Text style={styles.futureLabel}>Future</Text>
            )}
            {isToday(selectedDate) && (
              <Text style={styles.todayLabel}>Today</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextDay} style={styles.navButton}>
            <ChevronRight size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.categoriesContainer, { height: categoriesHeight }]}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map(category => (
            <CategoryBubble
              key={category.id}
              category={category}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
            />
          ))}
        </ScrollView>

        <DraggableHandle onDrag={handleDrag} onDragEnd={handleDragEnd} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4C6EF5" />
          </View>
        ) : (
          <View style={styles.gridContainer}>
            <PainterGrid
              hourlyLogs={hourlyLogs}
              selectedCategory={selectedCategory}
              onHourChange={handleHourChange}
              onBatchChange={handleBatchChange}
            />
          </View>
        )}

        <View style={styles.footer}>
          {showSpendingInput && (
            <View style={styles.spendingContainer}>
              <View style={styles.spendingRow}>
                <View style={styles.spendingInput}>
                  <Input
                    label="Total Spending"
                    value={totalSpend}
                    onChangeText={setTotalSpend}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>
                {dayData?.id && user && (
                  <TouchableOpacity
                    onPress={() => setShowItemsManager(true)}
                    style={styles.listButton}
                  >
                    <List size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <Input
            label="Highlight (Optional)"
            value={highlight}
            onChangeText={setHighlight}
            placeholder="Memorable moment from today..."
          />

          <Button
            title="Save Day"
            onPress={handleSave}
            loading={upsertMutation.isPending}
            fullWidth
          />
        </View>
      </View>

      {showItemsManager && dayData?.id && user && (
        <Modal visible={showItemsManager} onClose={() => setShowItemsManager(false)}>
          <ListItemsManager
            userId={user.id}
            dayId={dayData.id}
            date={selectedDate}
            onItemsChange={() => {}}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 4,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  futureLabel: {
    fontSize: 12,
    color: '#2563EB',
    textAlign: 'center',
  },
  todayLabel: {
    fontSize: 12,
    color: '#10B981',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  spendingContainer: {
    marginBottom: 16,
  },
  spendingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  spendingInput: {
    flex: 1,
  },
  listButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 1,
  },
});
