import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { logsService } from '@/services/logs';
import { profileService } from '@/services/profile';

export interface ExportData {
  profile: any;
  days: any[];
  listItems: any[];
  exportedAt: string;
  version: string;
}

export const exportService = {
  async exportUserData(userId: string): Promise<string> {
    const profile = await profileService.getProfile(userId);

    const startDate = '2020-01-01';
    const endDate = new Date().toISOString().split('T')[0];
    const days = await logsService.getDaysInRange(userId, startDate, endDate);

    const listItems = await logsService.getListItems(userId);

    const exportData: ExportData = {
      profile,
      days,
      listItems,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    if (Platform.OS === 'web') {
      return this.downloadForWeb(jsonString);
    } else {
      return this.shareForMobile(jsonString);
    }
  },

  downloadForWeb(jsonString: string): string {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-painter-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return 'Data exported successfully';
  },

  async shareForMobile(jsonString: string): Promise<string> {
    try {
      const fileName = `daily-painter-export-${new Date().toISOString().split('T')[0]}.json`;
      const file = new File(Paths.cache, fileName);

      await file.create();
      await file.write(jsonString);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Your Data',
          UTI: 'public.json',
        });
        return 'Data exported successfully';
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      throw new Error('Failed to export data');
    }
  },
};
