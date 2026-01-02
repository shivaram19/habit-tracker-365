import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, List } from 'lucide-react-native';
import { addDays, subDays } from 'date-fns';
import { PainterGrid } from '@/components/features/PainterGrid';
import { CategoryBubble } from '@/components/features/CategoryBubble';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { ListItemsManager } from '@/components/features/ListItemsManager';
import { useDayLog, useUpsertDay } from '@/hooks/useLogs';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/utils/categories';
import { formatDisplayDate, formatDate, getTodayDate, isToday, isFutureDate } from '@/utils/formatters';
import { categoryRequiresSpending } from '@/utils/categories';

export default function LogScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [hourlyLogs, setHourlyLogs] = useState<number[]>(Array(24).fill(-1));
  const [totalSpend, setTotalSpend] = useState('0');
  const [highlight, setHighlight] = useState('');
  const [showItemsManager, setShowItemsManager] = useState(false);

  const { user } = useAuth();
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <Text className="text-3xl font-bold text-gray-900">Time Painter</Text>
          <Text className="text-gray-600 mt-1">Paint your day by the hour</Text>
        </View>

        <View className="flex-row items-center justify-between px-6 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={handlePreviousDay} className="p-2">
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleToday}>
            <Text className="text-lg font-semibold text-gray-900">
              {formatDisplayDate(selectedDate)}
            </Text>
            {isFutureDate(selectedDate) && (
              <Text className="text-xs text-blue-600 text-center">Future</Text>
            )}
            {isToday(selectedDate) && (
              <Text className="text-xs text-green-600 text-center">Today</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextDay} className="p-2">
            <ChevronRight size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-4 border-b border-gray-200"
          contentContainerStyle={{ paddingHorizontal: 16 }}
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

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4C6EF5" />
          </View>
        ) : (
          <View className="flex-1">
            <PainterGrid
              hourlyLogs={hourlyLogs}
              selectedCategory={selectedCategory}
              onHourChange={handleHourChange}
              onBatchChange={handleBatchChange}
            />
          </View>
        )}

        <View className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {showSpendingInput && (
            <View className="mb-4">
              <View className="flex-row items-end gap-2">
                <View className="flex-1">
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
                    className="bg-blue-600 p-4 rounded-xl mb-1"
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
