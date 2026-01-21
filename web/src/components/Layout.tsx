import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, History, TrendingUp, User, Menu, X } from 'lucide-react';
import { ThemeToggle } from './shared/ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

type Tab = 'log' | 'history' | 'wrapped' | 'profile';

const APP_NAME = 'Iconscious';
const APP_TAGLINE = 'Track. Visualize. Achieve.';

const tabs = [
  { id: 'log' as Tab, label: 'Log', icon: Calendar },
  { id: 'history' as Tab, label: 'History', icon: History },
  { id: 'wrapped' as Tab, label: 'Wrapped', icon: TrendingUp },
  { id: 'profile' as Tab, label: 'Profile', icon: User },
];

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: 'var(--paper-bg, #fdfbf7)' }}>
      {/* Desktop Sidebar - Notebook Tabs */}
      <aside 
        className="hidden lg:flex lg:flex-col lg:w-64 border-r-3 p-6 gap-4"
        style={{ 
          backgroundColor: 'var(--paper-bg, #fdfbf7)',
          borderColor: 'var(--ink-color, #2c2c2c)',
        }}
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ rotate: -2 }}
          animate={{ rotate: 2 }}
          transition={{ repeat: Infinity, duration: 3, repeatType: 'reverse' }}
          className="mb-6"
        >
          <h1 
            className="text-3xl xl:text-4xl font-heading"
            style={{ color: 'var(--burnt-orange, #cc5500)', transform: 'rotate(-1.5deg)' }}
          >
            {APP_NAME}
          </h1>
          <p 
            className="font-mono text-xs xl:text-sm mt-2"
            style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}
          >
            {APP_TAGLINE}
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center gap-3 px-4 py-3 font-mono font-bold text-left border-3"
                style={{
                  backgroundColor: isActive ? 'var(--burnt-orange, #cc5500)' : 'var(--paper-bg, #fdfbf7)',
                  color: isActive ? 'var(--paper-bg, #fdfbf7)' : 'var(--ink-color, #2c2c2c)',
                  borderColor: 'var(--ink-color, #2c2c2c)',
                  borderRadius: '20px 15px 18px 16px / 16px 18px 15px 20px',
                }}
                whileHover={{ scale: 1.02, x: isActive ? 0 : 5 }}
                whileTap={{ scale: 0.98, y: 2 }}
              >
                <Icon size={20} />
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="mt-auto flex items-center justify-between">
          <ThemeToggle size="sm" />
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="font-mono text-xs"
            style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.3 }}
          >
            ✨
          </motion.div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header 
        className="lg:hidden border-b-3 p-3 sm:p-4 flex items-center justify-between"
        style={{ 
          backgroundColor: 'var(--paper-bg, #fdfbf7)',
          borderColor: 'var(--ink-color, #2c2c2c)',
        }}
      >
        <motion.h1
          className="text-xl sm:text-2xl font-heading"
          style={{ color: 'var(--burnt-orange, #cc5500)' }}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          {APP_NAME}
        </motion.h1>

        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border-2"
            style={{ 
              borderColor: 'var(--ink-color, #2c2c2c)',
              borderRadius: '15px 10px 13px 11px / 11px 13px 10px 15px',
              backgroundColor: 'var(--paper-bg, #fdfbf7)',
              color: 'var(--ink-color, #2c2c2c)',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(44, 44, 44, 0.3)' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-64 border-l-3 p-6"
              style={{ 
                backgroundColor: 'var(--paper-bg, #fdfbf7)',
                borderColor: 'var(--ink-color, #2c2c2c)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 
                  className="text-xl font-heading"
                  style={{ color: 'var(--ink-color, #2c2c2c)' }}
                >
                  Menu
                </h2>
                <button
                  title='h' 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: 'var(--ink-color, #2c2c2c)' }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-4 px-4 py-3 border-3 font-mono font-bold text-left"
                      style={{
                        backgroundColor: isActive ? 'var(--burnt-orange, #cc5500)' : 'var(--paper-bg, #fdfbf7)',
                        color: isActive ? 'var(--paper-bg, #fdfbf7)' : 'var(--ink-color, #2c2c2c)',
                        borderColor: 'var(--ink-color, #2c2c2c)',
                        borderRadius: '20px 15px 18px 16px / 16px 18px 15px 20px',
                      }}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-auto custom-scrollbar"
        style={{ backgroundColor: 'var(--paper-bg, #fdfbf7)' }}
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 border-t-3 flex justify-around p-2 safe-area-pb"
        style={{ 
          backgroundColor: 'var(--paper-bg, #fdfbf7)',
          borderColor: 'var(--ink-color, #2c2c2c)',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 px-3 py-2"
              style={{
                color: isActive ? 'var(--burnt-orange, #cc5500)' : 'var(--ink-color, #2c2c2c)',
                opacity: isActive ? 1 : 0.6,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={22} />
              <span className="text-xs font-mono font-bold">{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
