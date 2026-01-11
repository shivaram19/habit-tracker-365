import { motion } from 'framer-motion';
import { getCategoryColor } from '../utils/categories';

interface HeatmapProps {
  days: Array<{
    date: string;
    hourlyLogs: number[];
  }>;
}

export default function Heatmap({ days }: HeatmapProps) {
  // Get last 365 days
  const getLast365Days = () => {
    const result = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayData = days.find(d => d.date === dateKey);
      
      result.push({
        date: dateKey,
        logs: dayData?.hourlyLogs || Array(24).fill(0),
      });
    }
    
    return result;
  };

  const allDays = getLast365Days();

  // Calculate intensity (percentage of hours logged)
  const getIntensity = (logs: number[]) => {
    const logged = logs.filter(h => h !== 0).length;
    return logged / 24;
  };

  // Get dominant category color
  const getDominantColor = (logs: number[]) => {
    const categoryCounts: { [key: number]: number } = {};
    
    logs.forEach(cat => {
      if (cat !== 0) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });

    const dominant = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0];

    return dominant ? getCategoryColor(Number(dominant[0])) : '#e5e5e5';
  };

  // Group by weeks
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="min-w-fit">
      <h2 
        className="font-heading text-xl sm:text-2xl mb-4 sm:mb-6"
        style={{ color: 'var(--ink-color, #2c2c2c)' }}
      >
        365-Day Heatmap
      </h2>
      
      {/* Day labels on left - hidden on mobile */}
      <div className="flex gap-0.5 sm:gap-1">
        <div className="hidden sm:flex flex-col gap-0.5 sm:gap-1 mr-1 sm:mr-2 text-[8px] sm:text-[10px] font-mono" style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.5 }}>
          {dayLabels.map((label, i) => (
            <div key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex items-center justify-center">
              {label}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div className="flex gap-0.5 sm:gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-0.5 sm:gap-1">
              {week.map((day) => {
                const intensity = getIntensity(day.logs);
                const dominantColor = getDominantColor(day.logs);
                const dateObj = new Date(day.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                });
                
                return (
                  <motion.div
                    key={day.date}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm cursor-pointer"
                    style={{
                      backgroundColor: dominantColor,
                      opacity: intensity === 0 ? 0.15 : 0.3 + (intensity * 0.7),
                      border: '1px solid rgba(44, 44, 44, 0.1)',
                    }}
                    whileHover={{ 
                      scale: 1.8, 
                      zIndex: 10,
                      transition: { duration: 0.1 }
                    }}
                    title={`${formattedDate}: ${Math.round(intensity * 24)}h logged`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div 
        className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono"
        style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}
      >
        <span>Less</span>
        <div className="flex gap-0.5 sm:gap-1">
          {[0.15, 0.35, 0.55, 0.75, 1].map((opacity) => (
            <div
              key={opacity}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm"
              style={{ 
                backgroundColor: 'var(--burnt-orange, #cc5500)',
                opacity,
                border: '1px solid var(--ink-color, #2c2c2c)',
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
