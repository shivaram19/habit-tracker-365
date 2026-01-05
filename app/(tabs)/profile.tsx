import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
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
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Profile</Text>
        <Text className="text-gray-600 text-lg mb-8">Manage your account</Text>

        <View className="bg-gray-50 rounded-xl p-6 mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center mr-4">
              <User size={32} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-600 mb-1">Email</Text>
              <Text className="text-base font-semibold text-gray-900">{user?.email}</Text>
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
              <View className="flex-row gap-2 mt-4">
                <View className="flex-1">
                  <Button
                    title="Cancel"
                    onPress={handleCancelEdit}
                    variant="secondary"
                    fullWidth
                  />
                </View>
                <View className="flex-1">
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
              <Text className="text-sm text-gray-600 mb-1">Display Name</Text>
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                {profile?.name || 'Not set'}
              </Text>
              <Button title="Edit Name" onPress={handleStartEdit} variant="secondary" fullWidth />
            </View>
          )}
        </View>

        <View className="mb-4">
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
