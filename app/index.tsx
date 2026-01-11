import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { user, loading, error } = useAuth();

  console.log('[Index] Render - Loading:', loading, 'User:', user?.email || 'none', 'Error:', error);

  if (loading) {
    console.log('[Index] Showing loading spinner');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4C6EF5" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.log('[Index] Showing error:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (user) {
    console.log('[Index] Redirecting to /(tabs)/log');
    return <Redirect href="/(tabs)/log" />;
  }

  console.log('[Index] Redirecting to /auth/login');
  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#000000',
  },
  errorText: {
    fontSize: 14,
    color: '#FF0000',
    padding: 16,
  },
});
