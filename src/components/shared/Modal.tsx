import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
  Dimensions,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const { height } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({ visible, onClose, children }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
  },
});
