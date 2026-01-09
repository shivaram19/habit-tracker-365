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
import { useTheme } from '@/context/ThemeContext';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const { height } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({ visible, onClose, children }) => {
  const { theme } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, styles.overlay]}
          activeOpacity={1}
          onPress={onClose}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        </TouchableOpacity>

        <MotiView
          from={{ translateY: height }}
          animate={{ translateY: visible ? 0 : height }}
          transition={{ type: 'timing', duration: theme.animation.duration.normal }}
          style={[
            {
              backgroundColor: theme.colors.background.primary,
              borderTopLeftRadius: theme.borderRadius['3xl'],
              borderTopRightRadius: theme.borderRadius['3xl'],
              maxHeight: height * 0.9,
            },
          ]}
        >
          {children}
        </MotiView>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
