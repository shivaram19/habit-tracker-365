import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4C6EF5" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/log" />;
  }

  return <Redirect href="/auth/login" />;
}
