import { motion } from 'framer-motion';
import { User, Mail, Download, Trash2, LogOut, Upload } from 'lucide-react';
import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    try {
      const data = window.localStorage.getItem('iconscious-days');
      const items = window.localStorage.getItem('iconscious_items_') || '{}';
      const exportData = {
        days: JSON.parse(data || '{}'),
        items: JSON.parse(items),
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iconscious-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported successfully! 📦', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export failed', 'error');
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (importedData.days) {
          window.localStorage.setItem('iconscious-days', JSON.stringify(importedData.days));
        }
        showToast('Data imported successfully! 🎉', 'success');
        window.location.reload();
      } catch (error) {
        showToast('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      // Clear all iconscious data from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('iconscious')) {
          localStorage.removeItem(key);
        }
      });
      showToast('All data cleared', 'info');
      window.location.reload();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('Signed out successfully', 'info');
    } catch (error) {
      showToast('Sign out failed', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-heading mb-2"
          style={{ color: 'var(--burnt-orange, #cc5500)', transform: 'rotate(1.5deg)' }}
        >
          Profile
        </h1>
        <p 
          className="font-mono text-sm sm:text-base"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}
        >
          Manage your account ⚙️
        </p>
      </motion.div>

      {/* Profile Info */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <motion.div 
            className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center border-3 flex-shrink-0"
            style={{ 
              backgroundColor: 'var(--burnt-orange, #cc5500)',
              borderColor: 'var(--ink-color, #2c2c2c)',
              borderRadius: '25px 18px 22px 19px / 19px 22px 18px 25px',
            }}
            whileHover={{ rotate: 5 }}
          >
            <User size={40} style={{ color: 'var(--paper-bg, #fdfbf7)' }} />
          </motion.div>
          <div className="text-center sm:text-left">
            <h2 
              className="font-heading text-2xl sm:text-3xl mb-1"
              style={{ color: 'var(--ink-color, #2c2c2c)' }}
            >
              {user?.name || 'Demo User'}
            </h2>
            <div 
              className="flex items-center justify-center sm:justify-start gap-2 font-mono text-sm"
              style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}
            >
              <Mail size={16} />
              {user?.email || 'demo@iconscious.app'}
            </div>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card padding="md">
        <h3 
          className="font-heading text-xl sm:text-2xl mb-4"
          style={{ color: 'var(--ink-color, #2c2c2c)' }}
        >
          Appearance
        </h3>

        <div 
          className="flex items-center justify-between p-3 sm:p-4 border-2"
          style={{ 
            borderColor: 'var(--ink-color, #2c2c2c)',
            borderRadius: '15px 10px 13px 11px / 11px 13px 10px 15px',
          }}
        >
          <div className="flex items-center gap-3">
            <span 
              className="font-mono font-bold text-sm sm:text-base"
              style={{ color: 'var(--ink-color, #2c2c2c)' }}
            >
              Theme
            </span>
            <span 
              className="font-mono text-xs sm:text-sm capitalize"
              style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
            >
              ({theme})
            </span>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Data Management */}
      <Card padding="md">
        <h3 
          className="font-heading text-xl sm:text-2xl mb-4"
          style={{ color: 'var(--ink-color, #2c2c2c)' }}
        >
          Data Management
        </h3>

        <div className="space-y-3">
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExportData}
            fullWidth
          >
            Export Data (JSON)
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
          <Button
            variant="outline"
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
            fullWidth
          >
            Import Data
          </Button>

          <Button
            variant="danger"
            icon={Trash2}
            onClick={handleClearData}
            fullWidth
          >
            Clear All Data
          </Button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card padding="md">
        <h3 
          className="font-heading text-xl sm:text-2xl mb-4"
          style={{ color: 'var(--ink-color, #2c2c2c)' }}
        >
          Account
        </h3>

        <Button
          variant="outline"
          icon={LogOut}
          onClick={handleSignOut}
          fullWidth
        >
          Sign Out
        </Button>
      </Card>

      {/* Footer */}
      <Card padding="md">
        <div 
          className="text-center py-2"
          style={{ 
            backgroundColor: 'var(--dandelion, #ffd700)',
            opacity: 0.3,
            margin: '-1rem',
            padding: '1rem',
            borderRadius: '17px 12px 15px 13px / 13px 15px 12px 17px',
          }}
        >
          <p 
            className="font-mono text-xs sm:text-sm"
            style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.8 }}
          >
            Iconscious Web v1.0.0
            <br />
            Built with ❤️ and a little chaos ✨
          </p>
        </div>
      </Card>
    </div>
  );
}
