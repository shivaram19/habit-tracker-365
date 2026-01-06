import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { exportService } from '@/utils/export';
import { User } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account</Text>

        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User size={32} color="#FFFFFF" />
            </View>
            <View style={styles.emailContainer}>
              <Text style={styles.emailLabel}>Email</Text>
              <Text style={styles.emailText}>{user?.email}</Text>
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
              <Text style={styles.nameLabel}>Display Name</Text>
              <Text style={styles.nameText}>
                {profile?.name || 'Not set'}
              </Text>
              <Button title="Edit Name" onPress={handleStartEdit} variant="secondary" fullWidth />
            </View>
          )}
        </View>

        <View style={styles.exportButton}>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emailContainer: {
    flex: 1,
  },
  emailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  nameLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  buttonHalf: {
    flex: 1,
  },
  exportButton: {
    marginBottom: 16,
  },
});
