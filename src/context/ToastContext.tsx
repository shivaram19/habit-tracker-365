import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

const ToastItem: React.FC<{ toast: ToastMessage; getBackgroundColor: (type: ToastType) => string; getIcon: (type: ToastType) => React.ReactElement }> = ({ toast, getBackgroundColor, getIcon }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      className="mb-2"
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateYAnim }],
      }}
    >
      <View
        className="flex-row items-center p-4 rounded-xl shadow-lg"
        style={{ backgroundColor: getBackgroundColor(toast.type) }}
      >
        <View className="mr-3">{getIcon(toast.type)}</View>
        <Text className="flex-1 text-gray-800 font-medium">{toast.message}</Text>
      </View>
    </Animated.View>
  );
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="#10B981" />;
      case 'error':
        return <XCircle size={20} color="#EF4444" />;
      case 'info':
        return <Info size={20} color="#3B82F6" />;
    }
  };

  const getBackgroundColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '#D1FAE5';
      case 'error':
        return '#FEE2E2';
      case 'info':
        return '#DBEAFE';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View className="absolute top-16 left-4 right-4 z-50" pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            getBackgroundColor={getBackgroundColor}
            getIcon={getIcon}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
