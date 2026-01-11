import { motion } from 'framer-motion';
import Heatmap from '../components/Heatmap';
import { Card } from '../components/shared/Card';
import { EmptyState } from '../components/shared/EmptyState';
import { Calendar } from 'lucide-react';

export default function HistoryScreen() {
  // Get data from localStorage
  const getDaysData = () => {
    try {
      const stored = window.localStorage.getItem('chromalife-days');
      if (!stored) return [];
      
      const data = JSON.parse(stored);
      return Object.values(data).map((day: any) => ({
        date: day.date,
        hourlyLogs: day.hourlyLogs,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const days = getDaysData();

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
          style={{ color: 'var(--burnt-orange, #cc5500)', transform: 'rotate(1.5deg)' }}
        >
          History
        </h1>
        <p 
          className="font-mono text-sm sm:text-base"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}
        >
          Your journey through time 📅
        </p>
      </motion.div>

      {/* Heatmap */}
      <Card padding="md">
        <div className="overflow-x-auto custom-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
          <Heatmap days={days} />
        </div>
      </Card>

      {/* Empty State */}
      {days.length === 0 && (
        <Card padding="lg">
          <EmptyState
            icon={Calendar}
            title="No data yet"
            description="Start logging your days to see your beautiful heatmap appear here!"
          />
        </Card>
      )}
    </div>
  );
}
