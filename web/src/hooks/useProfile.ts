import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => user ? profileService.ensureProfile(user.id) : Promise.resolve(null),
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => {
      if (!user) throw new Error('Not authenticated');
      return profileService.updateProfile(user.id, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const updateDividerPositionMutation = useMutation({
    mutationFn: ({ position }: { position: number }) => {
      if (!user) throw new Error('Not authenticated');
      return profileService.updateDividerPosition(user.id, position);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateDividerPosition: updateDividerPositionMutation.mutateAsync,
  };
};
