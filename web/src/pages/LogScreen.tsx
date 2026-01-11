import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, Check, Cloud, CloudOff } from 'lucide-react';
import PainterGrid from '../components/PainterGrid';
import CategoryBubble from '../components/CategoryBubble';
import { ListItemsManager } from '../components/features/ListItemsManager';
import { Button } from '../components/shared/Button';
import { categories } from '../utils/categories';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

interface DayData {
  date: string;
  hourlyLogs: number[];
  totalSpend: number;
  highlight: string;
}

export default function LogScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to Work
  const [dailyData, setDailyData] = useLocalStorage<{ [key: string]: DayData }>('chromalife-days', {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { user } = useAuth();

  const dateKey = selectedDate.toISOString().split('T')[0];
  const currentDayData = dailyData[dateKey] || {
    date: dateKey,
    hourlyLogs: Array(24).fill(0),
    totalSpend: 0,
    highlight: '',
  };

  // Reset save status after showing success
  useEffect(() => {
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    setHasUnsavedChanges(false);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    setHasUnsavedChanges(false);
  };

  // Go to today
  const goToToday = () => {
    setSelectedDate(new Date());
    setHasUnsavedChanges(false);
  };

  // Update single hour
  const handleHourChange = (hour: number, categoryId: number) => {
    const newLogs = [...currentDayData.hourlyLogs];
    newLogs[hour] = categoryId;

    setDailyData({
      ...dailyData,
      [dateKey]: {
        ...currentDayData,
        hourlyLogs: newLogs,
      },
    });
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
  };

  // Update multiple hours (batch)
  const handleBatchChange = (hours: number[], categoryId: number) => {
    const newLogs = [...currentDayData.hourlyLogs];
    hours.forEach(hour => {
      newLogs[hour] = categoryId;
    });

    setDailyData({
      ...dailyData,
      [dateKey]: {
        ...currentDayData,
        hourlyLogs: newLogs,
      },
    });
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
  };

  // Save to Supabase (if configured) or just confirm local save
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      if (isSupabaseConfigured && supabase && user) {
        // Save to Supabase
        const { error } = await supabase
          .from('days')
          .upsert({
            user_id: user.id,
            date: dateKey,
            hourly_logs: currentDayData.hourlyLogs,
            total_spend: currentDayData.totalSpend,
            highlight: currentDayData.highlight,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,date',
          });

        if (error) throw error;
      }
      
      // Data is already in localStorage, just confirm save
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [dateKey, currentDayData, user]);

  // Format date display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const isToday = dateKey === new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-heading mb-2"
          style={{ color: 'var(--burnt-orange, #cc5500)', transform: 'rotate(-1.5deg)' }}
        >
          Daily Log
        </h1>
        <p 
          className="font-mono text-sm sm:text-base"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}
        >
          Paint your day with colors ✨
        </p>
      </motion.div>

      {/* Date Navigation */}
      <div 
        className="card flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--paper-bg, #fdfbf7)',
          borderColor: 'var(--ink-color, #2c2c2c)',
        }}
      >
        <button
          onClick={goToPreviousDay}
          className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <div className="flex flex-col items-center gap-2 order-first sm:order-none">
          <div 
            className="flex items-center gap-2 font-mono text-sm sm:text-lg font-bold text-center"
            style={{ color: 'var(--ink-color, #2c2c2c)' }}
          >
            <CalendarIcon size={20} />
            <span className="hidden sm:inline">{formatDate(selectedDate)}</span>
            <span className="sm:hidden">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          {!isToday && (
            <button
              onClick={goToToday}
              className="text-xs sm:text-sm font-mono hover:underline"
              style={{ color: 'var(--cerulean, #007ba7)' }}
            >
              Jump to Today
            </button>
          )}
        </div>

        <button
          onClick={goToNextDay}
          className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Category Selector */}
      <div 
        className="card"
        style={{
          backgroundColor: 'var(--paper-bg, #fdfbf7)',
          borderColor: 'var(--ink-color, #2c2c2c)',
        }}
      >
        <h2 
          className="font-heading text-xl sm:text-2xl mb-4"
          style={{ color: 'var(--ink-color, #2c2c2c)' }}
        >
          Select Activity
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-6 justify-items-center">
          {categories.slice(1).map((category) => (
            <CategoryBubble
              key={category.id}
              category={category}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Painter Grid */}
      <div 
        className="card"
        style={{
          backgroundColor: 'var(--paper-bg, #fdfbf7)',
          borderColor: 'var(--ink-color, #2c2c2c)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 
            className="font-heading text-xl sm:text-2xl"
            style={{ color: 'var(--ink-color, #2c2c2c)' }}
          >
            24-Hour Canvas
          </h2>
          
          {/* Save Button */}
          <div className="flex items-center gap-3">
            {/* Sync Status Indicator */}
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}>
              {isSupabaseConfigured ? (
                <>
                  <Cloud size={14} />
                  <span className="hidden sm:inline">Cloud sync</span>
                </>
              ) : (
                <>
                  <CloudOff size={14} />
                  <span className="hidden sm:inline">Local only</span>
                </>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {saveStatus === 'saved' ? (
                <motion.div
                  key="saved"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm"
                  style={{ 
                    backgroundColor: 'var(--forest-green, #228b22)', 
                    color: '#fff',
                    border: '2px solid var(--ink-color, #2c2c2c)',
                  }}
                >
                  <Check size={16} />
                  <span className="hidden sm:inline">Saved!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="save-button"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    loading={isSaving}
                    variant={hasUnsavedChanges ? 'primary' : 'secondary'}
                    size="sm"
                    icon={Save}
                  >
                    <span className="hidden sm:inline">
                      {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Save'}
                    </span>
                    <span className="sm:hidden">
                      {isSaving ? '...' : 'Save'}
                    </span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <PainterGrid
          hourlyLogs={currentDayData.hourlyLogs}
          selectedCategory={selectedCategory}
          onHourChange={handleHourChange}
          onBatchChange={handleBatchChange}
        />
      </div>

      {/* Spending Tracker */}
      <div 
        className="card"
        style={{
          backgroundColor: 'var(--paper-bg, #fdfbf7)',
          borderColor: 'var(--ink-color, #2c2c2c)',
        }}
      >
        <ListItemsManager date={dateKey} />
      </div>

      {/* Summary Stats */}
      <motion.div 
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 123, 167, 0.15) 0%, rgba(99, 102, 241, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
          borderColor: 'var(--ink-color, #2c2c2c)',
          borderWidth: '3px',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ 
              backgroundColor: 'var(--dandelion, #ffd700)',
              border: '2px solid var(--ink-color, #2c2c2c)',
            }}
          >
            📊
          </div>
          <h3 
            className="font-heading text-xl sm:text-2xl"
            style={{ color: 'var(--ink-color, #2c2c2c)' }}
          >
            Today's Summary
          </h3>
        </div>
        
        {currentDayData.hourlyLogs.filter(cat => cat > 0).length === 0 ? (
          <div 
            className="text-center py-6 font-mono"
            style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
          >
            <span className="text-3xl mb-2 block">🎨</span>
            <p>Start painting your day to see the summary!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 font-mono">
            {categories.slice(1).map((category) => {
              const count = currentDayData.hourlyLogs.filter(
                (cat) => cat === category.id
              ).length;
              
              if (count === 0) return null;

              const percentage = Math.round((count / 24) * 100);

              return (
                <motion.div
                  key={category.id}
                  className="relative overflow-hidden p-2 sm:p-3 border-2 text-xs sm:text-sm"
                  style={{
                    backgroundColor: 'var(--paper-bg, #fdfbf7)',
                    borderColor: 'var(--ink-color, #2c2c2c)',
                    borderRadius: '15px 10px 13px 11px / 11px 13px 10px 15px',
                  }}
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Background fill indicator */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{ 
                      backgroundColor: category.color,
                      width: `${percentage}%`,
                    }}
                  />
                  
                  <div className="relative flex items-center gap-2">
                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px]"
                      style={{ 
                        backgroundColor: category.color,
                        borderColor: 'var(--ink-color, #2c2c2c)',
                      }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span 
                        className="block truncate font-bold"
                        style={{ color: 'var(--ink-color, #2c2c2c)' }}
                      >
                        {category.name}
                      </span>
                      <span 
                        className="text-[10px] sm:text-xs"
                        style={{ color: 'var(--burnt-orange, #cc5500)' }}
                      >
                        {count}h ({percentage}%)
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Total hours logged */}
        {currentDayData.hourlyLogs.filter(cat => cat > 0).length > 0 && (
          <div 
            className="mt-4 pt-4 border-t-2 flex items-center justify-between font-mono text-sm"
            style={{ borderColor: 'var(--ink-color, #2c2c2c)', opacity: 0.3 }}
          >
            <span style={{ color: 'var(--ink-color, #2c2c2c)' }}>
              Total logged: <strong>{currentDayData.hourlyLogs.filter(cat => cat > 0).length}h</strong> / 24h
            </span>
            <span style={{ color: 'var(--burnt-orange, #cc5500)' }}>
              {Math.round((currentDayData.hourlyLogs.filter(cat => cat > 0).length / 24) * 100)}% complete
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
