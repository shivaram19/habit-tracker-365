import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { validateLoginForm } from '@/utils/validators';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();

  console.log('[LoginScreen] Rendering with theme:', {
    background: theme?.colors?.background?.primary,
    textPrimary: theme?.colors?.text?.primary,
    primary600: theme?.colors?.primary?.[600],
  });

  // Animation values - use useRef to prevent recreation on re-render
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    console.log('[LoginScreen] Starting animations...');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('[LoginScreen] Animations complete');
    });
  }, [fadeAnim, slideAnim]);

  const handleLogin = async () => {
    const validation = validateLoginForm(email, password);

    if (!validation.isValid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      showToast('Welcome back!', 'success');
    } catch (error: any) {
      // Handle network errors with a clearer message
      if (error?.message?.includes('Network request failed')) {
        showToast('No internet connection. Please check your network.', 'error');
      } else {
        showToast(error.message || 'Login failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme?.colors?.background?.primary || '#FFFFFF' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            paddingHorizontal: theme?.spacing?.[6] || 24,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={{ marginBottom: theme?.spacing?.[8] || 32 }}>
              <Text style={{
                fontSize: theme?.typography?.fontSizes?.['4xl'] || 36,
                fontWeight: theme?.typography?.fontWeights?.bold || '700',
                color: theme?.colors?.text?.primary || '#111827',
                marginBottom: theme?.spacing?.[2] || 8,
              }}>
                Welcome Back
              </Text>
              <Text style={{
                fontSize: theme?.typography?.fontSizes?.lg || 18,
                color: theme?.colors?.text?.tertiary || '#6B7280',
              }}>
                Sign in to continue tracking your life
              </Text>
            </View>

            <View style={{ marginBottom: theme?.spacing?.[6] || 24 }}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
            />

            <View style={styles.footer}>
              <Text style={{ color: theme?.colors?.text?.tertiary || '#6B7280' }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={{
                  color: theme?.colors?.primary?.[600] || '#2563EB',
                  fontWeight: theme?.typography?.fontWeights?.semibold || '600',
                }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  animatedContainer: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
