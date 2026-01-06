import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Modal, Pressable, StyleSheet } from 'react-native';
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
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <GestureDetector gesture={pan}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
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
          <Pressable style={styles.modalOverlay} onPress={handleCancelOverwrite}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Overwrite Hours?</Text>
              <Text style={styles.modalMessage}>{getOverwriteMessage()}</Text>

              <View style={styles.modalButtons}>
                <View style={styles.modalButtonHalf}>
                  <Button
                    title="Cancel"
                    onPress={handleCancelOverwrite}
                    variant="secondary"
                    fullWidth
                  />
                </View>
                <View style={styles.modalButtonHalf}>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    width: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonHalf: {
    flex: 1,
  },
});
