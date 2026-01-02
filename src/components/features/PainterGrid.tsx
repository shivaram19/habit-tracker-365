import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Modal, Pressable } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { HourBlock } from './HourBlock';
import { Button } from '../shared/Button';

interface PainterGridProps {
  hourlyLogs: number[];
  selectedCategory: number;
  onHourChange: (hour: number, categoryId: number) => void;
  onBatchChange: (hours: number[], categoryId: number) => void;
}

export const PainterGrid: React.FC<PainterGridProps> = ({
  hourlyLogs,
  selectedCategory,
  onHourChange,
  onBatchChange,
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<number[]>([]);
  const lastHourRef = useRef<number | null>(null);
  const touchedHours = useRef<Set<number>>(new Set());

  const handleHourPress = (hour: number) => {
    const existingCategory = hourlyLogs[hour];

    if (existingCategory !== -1 && existingCategory !== selectedCategory) {
      setPendingChanges([hour]);
      setShowWarning(true);
    } else {
      onHourChange(hour, selectedCategory);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleConfirmOverwrite = () => {
    pendingChanges.forEach(hour => {
      onHourChange(hour, selectedCategory);
    });
    setShowWarning(false);
    setPendingChanges([]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCancelOverwrite = () => {
    setShowWarning(false);
    setPendingChanges([]);
  };

  const pan = Gesture.Pan()
    .onStart((event) => {
      touchedHours.current = new Set();
      lastHourRef.current = null;
    })
    .onUpdate((event) => {
      const hour = Math.floor(event.y / 60);

      if (hour >= 0 && hour < 24 && hour !== lastHourRef.current) {
        lastHourRef.current = hour;

        if (!touchedHours.current.has(hour)) {
          touchedHours.current.add(hour);

          const existingCategory = hourlyLogs[hour];
          if (existingCategory !== -1 && existingCategory !== selectedCategory) {
          } else {
            onHourChange(hour, selectedCategory);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
      }
    })
    .onEnd(() => {
      const hoursWithConflicts = Array.from(touchedHours.current).filter(
        hour => hourlyLogs[hour] !== -1 && hourlyLogs[hour] !== selectedCategory
      );

      if (hoursWithConflicts.length > 0) {
        setPendingChanges(hoursWithConflicts);
        setShowWarning(true);
      }

      touchedHours.current.clear();
      lastHourRef.current = null;
    });

  const getOverwriteMessage = () => {
    if (pendingChanges.length === 1) {
      const existingCat = hourlyLogs[pendingChanges[0]];
      return `Hour ${pendingChanges[0]} is already logged. Overwrite?`;
    }
    return `${pendingChanges.length} hours are already logged. Overwrite them?`;
  };

  return (
    <GestureHandlerRootView>
      <View className="flex-1">
        <GestureDetector gesture={pan}>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap gap-2 p-4">
              {Array.from({ length: 24 }, (_, i) => (
                <HourBlock
                  key={i}
                  hour={i}
                  categoryId={hourlyLogs[i]}
                  onPress={() => handleHourPress(i)}
                  size="large"
                />
              ))}
            </View>
          </ScrollView>
        </GestureDetector>

        <Modal
          visible={showWarning}
          transparent
          animationType="fade"
          onRequestClose={handleCancelOverwrite}
        >
          <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={handleCancelOverwrite}>
            <Pressable className="bg-white rounded-2xl p-6 mx-6 w-80" onPress={(e) => e.stopPropagation()}>
              <Text className="text-xl font-bold text-gray-900 mb-2">Overwrite Hours?</Text>
              <Text className="text-gray-600 mb-6">{getOverwriteMessage()}</Text>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Button
                    title="Cancel"
                    onPress={handleCancelOverwrite}
                    variant="secondary"
                    fullWidth
                  />
                </View>
                <View className="flex-1">
                  <Button
                    title="Overwrite"
                    onPress={handleConfirmOverwrite}
                    variant="primary"
                    fullWidth
                  />
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};
