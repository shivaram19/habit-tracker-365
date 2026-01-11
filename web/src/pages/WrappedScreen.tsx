import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Clock, Flame } from 'lucide-react';
import { StatCard } from '../components/features/wrapped/StatCard';
import { DonutChart } from '../components/features/wrapped/DonutChart';
import { TopItemsList } from '../components/features/wrapped/TopItemsList';
import { YearSelector } from '../components/features/wrapped/YearSelector';
import { Card } from '../components/shared/Card';
import { categories, type Category } from '../utils/categories';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DayData {
  date: string;
  hourlyLogs: number[];
  totalSpend: number;
  highlight: string;
}

interface CategoryStat {
  id: number;
  name: string;
  color: string;
  hours: number;
  percentage: number;
}

export default function WrappedScreen() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [dailyData] = useLocalStorage<{ [key: string]: DayData }>('chromalife-days', {});

  // Calculate stats from stored data
  const stats = useMemo(() => {
    const yearData = Object.entries(dailyData).filter(([date]) => 
      date.startsWith(year.toString())
    );

    let totalHours = 0;
    let daysLogged = 0;
    const categoryHours: { [key: number]: number } = {};

    yearData.forEach(([_, data]) => {
      const loggedHours = data.hourlyLogs.filter(cat => cat > 0).length;
      if (loggedHours > 0) {
        daysLogged++;
        totalHours += loggedHours;

        data.hourlyLogs.forEach(cat => {
          if (cat > 0) {
            categoryHours[cat] = (categoryHours[cat] || 0) + 1;
          }
        });
      }
    });

    // Calculate category stats
    const categoryStats: CategoryStat[] = categories.slice(1).map((cat: Category) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      hours: categoryHours[cat.id] || 0,
      percentage: totalHours > 0 ? ((categoryHours[cat.id] || 0) / totalHours) * 100 : 0,
    })).sort((a: CategoryStat, b: CategoryStat) => b.hours - a.hours);

    const topCategory = categoryStats[0];

    // Calculate streak (simplified)
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      const dayData = dailyData[dateKey];
      if (dayData && dayData.hourlyLogs.some(h => h > 0)) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalHours,
      daysLogged,
      topCategory,
      currentStreak,
      categoryStats,
    };
  }, [dailyData, year]);

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
          Wrapped
        </h1>
        <p 
          className="font-mono text-sm sm:text-base"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}
        >
          Your year in review 🎉
        </p>
      </motion.div>

      {/* Year Selector */}
      <YearSelector year={year} onYearChange={setYear} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          icon={Clock}
          label="Total Hours"
          value={stats.totalHours.toLocaleString()}
          color="#007ba7"
          delay={0}
        />
        <StatCard
          icon={Award}
          label="Top Activity"
          value={stats.topCategory?.name || 'N/A'}
          color={stats.topCategory?.color || '#cc5500'}
          delay={0.1}
        />
        <StatCard
          icon={Calendar}
          label="Days Logged"
          value={stats.daysLogged}
          color="#ffd700"
          delay={0.2}
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          color="#cb4154"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card padding="md">
          <h3 
            className="font-heading text-xl sm:text-2xl mb-4"
            style={{ color: 'var(--ink-color, #2c2c2c)' }}
          >
            Category Breakdown
          </h3>
          <DonutChart 
            data={stats.categoryStats}
            totalHours={stats.totalHours}
          />
        </Card>

        {/* Top Activities */}
        <Card padding="md">
          <TopItemsList
            title="Top Activities"
            items={stats.categoryStats.slice(0, 5).map((cat: CategoryStat) => ({
              id: cat.id,
              name: cat.name,
              hours: cat.hours,
              color: cat.color,
            }))}
          />
        </Card>
      </div>

      {/* Empty State */}
      {stats.totalHours === 0 && (
        <Card padding="lg">
          <div className="text-center py-8">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              📊
            </motion.div>
            <h3 
              className="font-heading text-xl sm:text-2xl mb-2"
              style={{ color: 'var(--ink-color, #2c2c2c)' }}
            >
              No data for {year}
            </h3>
            <p 
              className="font-mono text-sm max-w-md mx-auto"
              style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
            >
              Start logging your daily activities to see your stats appear here!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
