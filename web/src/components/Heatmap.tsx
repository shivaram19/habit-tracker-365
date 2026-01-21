import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { getCategoryColor, getCategoryById } from '../utils/categories';

interface HeatmapProps {
  days: Array<{
    date: string;
    hourlyLogs: number[];
  }>;
}

export default function Heatmap({ days }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Responsive: detect mobile vs desktop AND track container width
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);
      setIsMobile(width < 640); // Mobile breakpoint
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Get last 365 days aligned to weeks
  const getLast365Days = () => {
    const result = [];
    const today = new Date();
    
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    
    // Align to start of week (Sunday)
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - today.getDay()));
    
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateKey = current.toISOString().split('T')[0];
      const dayData = days.find(d => d.date === dateKey);
      
      result.push({
        date: dateKey,
        logs: dayData?.hourlyLogs || Array(24).fill(-1),
        isInRange: current >= new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000),
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return result;
  };

  const allDays = getLast365Days();

  // Group into weeks
  const weeks: Array<typeof allDays> = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  // Generate month labels
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = '';
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = new Date(week[0].date);
      const month = firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' });
      
      if (month !== lastMonth) {
        labels.push({ month, weekIndex });
        lastMonth = month;
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  // ============ DYNAMIC CELL SIZE CALCULATION ============
  const padding = 16; // Padding on each side
  const scrollbarWidth = 8; // Account for scrollbar
  const monthLabelWidth = 44; // Month label column width
  const dayLabelWidth = 44; // Day label column width (desktop)
  
  // Calculate dynamic cell size based on container width
  const calculateMobileCellSize = () => {
    if (containerWidth === 0) return { cellSize: 14, cellGap: 3 }; // Default while measuring
    
    const availableWidth = containerWidth - (padding * 2) - monthLabelWidth - scrollbarWidth;
    // 7 cells + 6 gaps = 7c + 6g, we want cells to be square so solve for optimal gap
    // Let's use a ratio: cell is roughly 4x the gap
    // 7c + 6g = available, and c = 4g → 7(4g) + 6g = 34g = available → g = available/34
    const totalUnits = 7 * 4 + 6; // 34 units
    const unitSize = availableWidth / totalUnits;
    const gap = Math.max(2, Math.round(unitSize));
    const cell = Math.round(unitSize * 4);
    
    return { cellSize: Math.max(12, cell), cellGap: gap };
  };

  const calculateDesktopCellSize = () => {
    if (containerWidth === 0) return { cellSize: 13, cellGap: 3 }; // Default while measuring
    
    const availableWidth = containerWidth - (padding * 2) - dayLabelWidth;
    const numWeeks = weeks.length;
    // Similar approach: cell is roughly 4x the gap
    const totalUnits = numWeeks * 4 + (numWeeks - 1);
    const unitSize = availableWidth / totalUnits;
    const gap = Math.max(2, Math.round(unitSize));
    const cell = Math.round(unitSize * 4);
    
    return { cellSize: Math.max(8, Math.min(cell, 16)), cellGap: gap };
  };

  const { cellSize, cellGap } = isMobile ? calculateMobileCellSize() : calculateDesktopCellSize();
  const getIntensityLevel = (logs: number[]): number => {
    const logged = logs.filter(h => h !== 0 && h !== -1).length;
    if (logged === 0) return 0;
    if (logged <= 4) return 1;
    if (logged <= 8) return 2;
    if (logged <= 16) return 3;
    return 4;
  };

  // Get dominant category
  const getDominantCategory = (logs: number[]): number => {
    const categoryCounts: { [key: number]: number } = {};
    logs.forEach(cat => {
      if (cat !== 0 && cat !== -1) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });
    const dominant = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0];
    return dominant ? Number(dominant[0]) : 0;
  };

  // Adjust color intensity
  const adjustColorIntensity = (hex: string, factor: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const blend = (c: number) => Math.round(c * factor + 255 * (1 - factor) * 0.3);
    return `rgb(${Math.min(255, blend(r))}, ${Math.min(255, blend(g))}, ${Math.min(255, blend(b))})`;
  };

  // Get color for a day
  const getDayColor = (logs: number[], isInRange: boolean): string => {
    if (!isInRange) return 'transparent';
    const intensityLevel = getIntensityLevel(logs);
    if (intensityLevel === 0) return '#d4d0c8';
    const baseColor = getCategoryColor(getDominantCategory(logs));
    const intensity = intensityLevel / 4;
    return adjustColorIntensity(baseColor, 0.5 + intensity * 0.5);
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayLabelsFull = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // ============ LEGEND COMPONENT (reused) ============
  const Legend = ({ sticky = false }: { sticky?: boolean }) => (
    <div 
      className={`${sticky ? 'sticky top-0 z-20 py-3' : 'mt-5 sm:mt-6'} space-y-2`}
      style={{ backgroundColor: sticky ? 'var(--paper-bg, #fdfbf7)' : 'transparent' }}
    >
      {/* Activity intensity legend */}
      <div 
        className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[10px] sm:text-[11px] font-mono"
        style={{ color: 'var(--ink-color, #2c2c2c)' }}
      >
        <span className="font-medium" style={{ opacity: 0.8 }}>Activity:</span>
        <div className="flex items-center gap-1">
          <div
            className="rounded-[3px]"
            style={{ 
              width: 12, 
              height: 12,
              backgroundColor: '#d4d0c8',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          />
          <span style={{ opacity: 0.6 }}>None</span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="rounded-[3px]"
              style={{ 
                width: 12, 
                height: 12,
                backgroundColor: adjustColorIntensity('#4ade80', 0.5 + (level / 4) * 0.5),
                border: '1px solid rgba(0,0,0,0.12)',
              }}
            />
          ))}
          <span style={{ opacity: 0.6 }}>More</span>
        </div>
      </div>

      {/* Category legend */}
      <div 
        className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[10px] sm:text-[11px] font-mono"
        style={{ color: 'var(--ink-color, #2c2c2c)' }}
      >
        <span className="font-medium" style={{ opacity: 0.8 }}>Categories:</span>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((catId) => {
          const cat = getCategoryById(catId);
          return (
            <div key={catId} className="flex items-center gap-0.5">
              <div
                className="rounded-[2px]"
                style={{ 
                  width: 12, 
                  height: 12,
                  backgroundColor: cat.color,
                  border: '1px solid rgba(0,0,0,0.12)',
                }}
              />
              <span style={{ opacity: 0.7 }}>{cat.icon}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ============ MOBILE LAYOUT (Rotated 90° clockwise) ============
  // Days on TOP, Months on LEFT, vertical scroll
  if (isMobile) {
    return (
      <div ref={containerRef} className="w-full" style={{ padding: `${padding}px` }}>
        {/* Title */}
        <h2 
          className="font-heading text-xl mb-3"
          style={{ color: 'var(--ink-color, #2c2c2c)' }}
        >
          365-Day Heatmap
        </h2>

        {/* STICKY LEGEND at top */}
        <Legend sticky />

        {/* Day labels on TOP (horizontal) - S M T W T F S - MUST match cell row structure exactly */}
        <div 
          className="flex items-center mb-2"
          style={{ marginTop: '8px' }}
        >
          {/* Empty spacer matching the month label column */}
          <div 
            className="flex-shrink-0 pr-2"
            style={{ width: `${monthLabelWidth}px` }}
          />
          {/* Day labels - same structure as cells container */}
          <div className="flex flex-1" style={{ gap: `${cellGap}px` }}>
            {dayLabels.map((label, i) => (
              <div
                key={i}
                className="text-[10px] sm:text-[11px] font-mono font-medium flex-1 text-center"
                style={{ 
                  color: 'var(--ink-color, #2c2c2c)',
                  opacity: 0.7,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable grid area (vertical scroll) */}
        <div 
          className="max-h-[60vh] overflow-y-auto custom-scrollbar"
          role="grid"
          aria-label="Habit activity heatmap"
          style={{ paddingRight: '4px' }}
        >
          {/* Each week is a ROW with month label on left */}
          {weeks.map((week, weekIndex) => {
            // Check if this week starts a new month
            const monthLabel = monthLabels.find(m => m.weekIndex === weekIndex);
            
            return (
              <div 
                key={weekIndex} 
                className="flex items-center"
                style={{ marginBottom: `${cellGap}px` }}
              >
                {/* Month label on LEFT */}
                <div 
                  className="text-[10px] sm:text-[11px] font-mono font-medium text-right pr-2 flex-shrink-0"
                  style={{ 
                    width: `${monthLabelWidth}px`,
                    color: 'var(--ink-color, #2c2c2c)',
                    opacity: monthLabel ? 0.8 : 0,
                  }}
                >
                  {monthLabel?.month || ''}
                </div>

                {/* Week cells (7 days horizontal) - use flex-1 to fill space */}
                <div className="flex flex-1" style={{ gap: `${cellGap}px` }}>
                  {week.map((day, dayIndex) => {
                    const intensityLevel = getIntensityLevel(day.logs);
                    const dominantCat = getDominantCategory(day.logs);
                    const dayColor = getDayColor(day.logs, day.isInRange);
                    const category = getCategoryById(dominantCat);
                    const hoursLogged = day.logs.filter(h => h !== 0 && h !== -1).length;
                    const dateObj = new Date(day.date);
                    const formattedDate = dateObj.toLocaleDateString('en-US', { 
                      weekday: 'short', month: 'short', day: 'numeric' 
                    });

                    if (!day.isInRange) {
                      return (
                        <div
                          key={dayIndex}
                          className="flex-1 aspect-square"
                        />
                      );
                    }

                    return (
                      <motion.div
                        key={dayIndex}
                        className="cursor-pointer flex-1 aspect-square"
                        style={{
                          backgroundColor: dayColor,
                          borderRadius: 3,
                          border: intensityLevel > 0 
                            ? '1px solid rgba(0, 0, 0, 0.12)' 
                            : '1px solid rgba(0, 0, 0, 0.06)',
                        }}
                        whileHover={{ 
                          scale: 1.4, 
                          zIndex: 50,
                          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                        }}
                        title={intensityLevel > 0 
                          ? `${formattedDate}\n${hoursLogged}h logged\n${category.icon} ${category.name}`
                          : `${formattedDate}\nNo activity`
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============ DESKTOP LAYOUT (Original - horizontal) ============
  // Months on TOP, Days on LEFT, horizontal scroll
  return (
    <div ref={containerRef} className="w-full" style={{ padding: `${padding}px` }}>
      {/* Title */}
      <h2 
        className="font-heading text-xl sm:text-2xl mb-4 sm:mb-6"
        style={{ color: 'var(--ink-color, #2c2c2c)' }}
      >
        365-Day Heatmap
      </h2>

      {/* MONTH LABELS on TOP */}
      <div 
        className="relative mb-2"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `40px repeat(${weeks.length}, ${cellSize}px)`,
          gap: `0 ${cellGap}px`,
          height: '20px',
        }}
      >
        <div /> {/* Spacer for day labels column */}
        {monthLabels.map(({ month, weekIndex }) => (
          <span
            key={`${month}-${weekIndex}`}
            className="text-[11px] md:text-[12px] font-mono font-medium whitespace-nowrap"
            style={{
              gridColumn: weekIndex + 2,
              color: 'var(--ink-color, #2c2c2c)',
              opacity: 0.8,
            }}
          >
            {month}
          </span>
        ))}
      </div>

      {/* MAIN GRID: Day labels LEFT + Heatmap */}
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: '40px 1fr',
          gap: '0 8px',
        }}
      >
        {/* Day labels on LEFT (vertical) */}
        <div 
          className="flex flex-col justify-between py-[1px]"
          style={{ height: `${7 * cellSize + 6 * cellGap}px` }}
        >
          {dayLabelsFull.map((label, i) => (
            <span
              key={i}
              className="text-[10px] font-mono text-right pr-1"
              style={{ 
                color: 'var(--ink-color, #2c2c2c)',
                opacity: i % 2 === 1 ? 0.7 : 0, // Show Mon, Wed, Fri
                lineHeight: `${cellSize}px`,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Heatmap Grid (horizontal scroll) */}
        <div 
          className="overflow-x-auto custom-scrollbar pb-2"
          role="grid"
          aria-label="Habit activity heatmap"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
              gridAutoRows: `${cellSize}px`,
              gap: `${cellGap}px`,
            }}
          >
            {weeks.map((week, weekIndex) => (
              week.map((day, dayIndex) => {
                const intensityLevel = getIntensityLevel(day.logs);
                const dominantCat = getDominantCategory(day.logs);
                const dayColor = getDayColor(day.logs, day.isInRange);
                const category = getCategoryById(dominantCat);
                const hoursLogged = day.logs.filter(h => h !== 0 && h !== -1).length;
                const dateObj = new Date(day.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                  weekday: 'short', month: 'short', day: 'numeric' 
                });

                if (!day.isInRange) {
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      style={{
                        gridColumn: weekIndex + 1,
                        gridRow: dayIndex + 1,
                        width: cellSize,
                        height: cellSize,
                      }}
                    />
                  );
                }

                return (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    className="cursor-pointer"
                    style={{
                      gridColumn: weekIndex + 1,
                      gridRow: dayIndex + 1,
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: dayColor,
                      borderRadius: 3,
                      border: intensityLevel > 0 
                        ? '1px solid rgba(0, 0, 0, 0.12)' 
                        : '1px solid rgba(0, 0, 0, 0.06)',
                      boxShadow: intensityLevel > 2 
                        ? 'inset 0 1px 2px rgba(255,255,255,0.25)' 
                        : 'none',
                    }}
                    whileHover={{ 
                      scale: 1.8, 
                      zIndex: 50,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      transition: { duration: 0.12 }
                    }}
                    title={intensityLevel > 0 
                      ? `${formattedDate}\n${hoursLogged}h logged\nMostly: ${category.icon} ${category.name}`
                      : `${formattedDate}\nNo activity`
                    }
                  />
                );
              })
            ))}
          </div>
        </div>
      </div>

      {/* LEGEND at bottom (not sticky on desktop) */}
      <Legend />
    </div>
  );
}
