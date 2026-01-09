import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { GripHorizontal } from 'lucide-react-native';

interface DraggableHandleProps {
  onDrag: (deltaY: number) => void;
  onDragEnd: () => void;
}

export const DraggableHandle: React.FC<DraggableHandleProps> = ({ onDrag, onDragEnd }) => {
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withSpring(1.1);
    })
    .onUpdate((event) => {
      onDrag(event.translationY);
    })
    .onEnd(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSpring(1);
      onDragEnd();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.handleWrapper}>
          <View style={styles.line} />
          <View style={styles.iconContainer}>
            <GripHorizontal size={20} color="#9CA3AF" />
          </View>
          <View style={styles.line} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  handleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  iconContainer: {
    paddingHorizontal: 12,
    opacity: 0.6,
  },
});
