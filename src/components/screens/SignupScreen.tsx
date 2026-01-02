import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
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

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
    }
  };

  const handleSignup = async () => {
    const validation = validateSignupForm(email, password, confirmPassword, name);

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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1 px-6 justify-center"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-gray-600 text-lg">Start tracking your life by the hour</Text>
          </View>

          <View className="mb-6">
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
              <View className="mb-4">
                <View className="flex-row items-center">
                  <View className="flex-1 h-1 bg-gray-200 rounded mr-2">
                    <View className={`h-full ${getStrengthColor()} rounded`} style={{ width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' }} />
                  </View>
                  <Text className="text-sm text-gray-600 capitalize">{passwordStrength}</Text>
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

          <Button title="Sign Up" onPress={handleSignup} loading={loading} fullWidth />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
