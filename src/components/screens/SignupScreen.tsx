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
import { validateSignupForm, getPasswordStrength } from '@/utils/validators';

export const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
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
    ]).start();
  }, []);

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return theme.colors.error[500];
      case 'medium':
        return theme.colors.warning[500];
      case 'strong':
        return theme.colors.success[500];
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak':
        return '33%';
      case 'medium':
        return '66%';
      case 'strong':
        return '100%';
    }
  };

  const handleSignup = async () => {
    const validation = validateSignupForm(
      email,
      password,
      confirmPassword,
      name
    );

    if (!validation.isValid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name);
      showToast('Account created successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            paddingHorizontal: theme.spacing[6],
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
            <View style={{ marginBottom: theme.spacing[8] }}>
              <Text style={{
                fontSize: theme.typography.fontSizes['4xl'],
                fontWeight: theme.typography.fontWeights.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[2],
              }}>
                Create Account
              </Text>
              <Text style={{
                fontSize: theme.typography.fontSizes.lg,
                color: theme.colors.text.tertiary,
              }}>
                Start tracking your life by the hour
              </Text>
            </View>

            <View style={{ marginBottom: theme.spacing[6] }}>
              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Your name"
              />

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
                placeholder="Create a password"
                secureTextEntry
              />

              {password.length > 0 && (
                <View style={{ marginBottom: theme.spacing[4] }}>
                  <View style={styles.strengthRow}>
                    <View style={{
                      flex: 1,
                      height: 4,
                      backgroundColor: theme.colors.neutral[200],
                      borderRadius: theme.borderRadius.sm,
                      marginRight: theme.spacing[2],
                    }}>
                      <View
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor: getStrengthColor(),
                            width: getStrengthWidth(),
                            borderRadius: theme.borderRadius.sm,
                          }
                        ]}
                      />
                    </View>
                    <Text style={{
                      fontSize: theme.typography.fontSizes.sm,
                      color: theme.colors.text.tertiary,
                      textTransform: 'capitalize',
                    }}>
                      {passwordStrength}
                    </Text>
                  </View>
                </View>
              )}

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
              />
            </View>

            <Button
              title="Sign Up"
              onPress={handleSignup}
              loading={loading}
              fullWidth
            />

            <View style={styles.footer}>
              <Text style={{ color: theme.colors.text.tertiary }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={{
                  color: theme.colors.primary[600],
                  fontWeight: theme.typography.fontWeights.semibold,
                }}>
                  Sign In
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
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthBar: {
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
