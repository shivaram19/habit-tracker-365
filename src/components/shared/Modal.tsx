import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
  Dimensions,
} from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const { height } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({ visible, onClose, children }) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          className="bg-black/50"
          activeOpacity={1}
          onPress={onClose}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        </TouchableOpacity>

        <MotiView
          from={{ translateY: height }}
          animate={{ translateY: visible ? 0 : height }}
          transition={{ type: 'timing', duration: 300 }}
          className="bg-white rounded-t-3xl"
          style={{ maxHeight: height * 0.9 }}
        >
          {children}
        </MotiView>
      </View>
    </RNModal>
  );
};
