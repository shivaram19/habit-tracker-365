import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { exportService } from '@/utils/export';
import { User } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();

  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleStartEdit = () => {
    setName(profile?.name || '');
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    try {
      await updateProfile({ name: name.trim() });
      showToast('Profile updated', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setName('');
  };

  const handleExportData = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      const message = await exportService.exportUserData(user.id);
      showToast(message, 'success');
    } catch (error) {
      showToast('Failed to export data', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showToast('Logged out successfully', 'success');
      router.replace('/auth/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      showToast(error?.message || 'Logout failed', 'error');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[600]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingHorizontal: theme.spacing[6], paddingVertical: theme.spacing[8] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing[2] }}>
          <View>
            <Text style={{
              fontSize: theme.typography.fontSizes['3xl'],
              fontWeight: theme.typography.fontWeights.bold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[2],
            }}>
              Profile
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSizes.lg,
              color: theme.colors.text.tertiary,
            }}>
              Manage your account
            </Text>
          </View>
          <ThemeToggle />
        </View>

        <View style={{
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          marginBottom: theme.spacing[4],
          marginTop: theme.spacing[8],
        }}>
          <View style={styles.profileHeader}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: theme.colors.primary[600],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing[4],
            }}>
              <User size={32} color={theme.colors.text.inverse} />
            </View>
            <View style={styles.emailContainer}>
              <Text style={{ fontSize: theme.typography.fontSizes.sm, color: theme.colors.text.tertiary, marginBottom: theme.spacing[1] }}>
                Email
              </Text>
              <Text style={{
                fontSize: theme.typography.fontSizes.base,
                fontWeight: theme.typography.fontWeights.semibold,
                color: theme.colors.text.primary,
              }}>
                {user?.email}
              </Text>
            </View>
          </View>

          {isEditing ? (
            <View>
              <Input
                label="Display Name"
                value={name}
                onChangeText={setName}
                placeholder="Your name"
              />
              <View style={styles.buttonRow}>
                <View style={styles.buttonHalf}>
                  <Button
                    title="Cancel"
                    onPress={handleCancelEdit}
                    variant="secondary"
                    fullWidth
                  />
                </View>
                <View style={styles.buttonHalf}>
                  <Button
                    title="Save"
                    onPress={handleSaveName}
                    loading={isUpdating}
                    fullWidth
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: theme.typography.fontSizes.sm, color: theme.colors.text.tertiary, marginBottom: theme.spacing[1] }}>
                Display Name
              </Text>
              <Text style={{
                fontSize: theme.typography.fontSizes.lg,
                fontWeight: theme.typography.fontWeights.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[4],
              }}>
                {profile?.name || 'Not set'}
              </Text>
              <Button title="Edit Name" onPress={handleStartEdit} variant="secondary" fullWidth />
            </View>
          )}
        </View>

        <View style={{ marginBottom: theme.spacing[4] }}>
          <Button
            title="Export My Data"
            onPress={handleExportData}
            loading={isExporting}
            variant="secondary"
            fullWidth
          />
        </View>

        <Button title="Sign Out" onPress={handleLogout} variant="danger" fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emailContainer: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  buttonHalf: {
    flex: 1,
  },
});
