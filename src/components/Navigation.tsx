import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Layers, 
  User,
  Bell,
  Search,
  Settings,
  Plus,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  key?: string | number;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 relative group py-2 px-1 rounded-xl
      ${isActive ? 'text-on-surface' : 'text-zinc-500 hover:text-on-surface-variant'}
    `}
  >
    <Icon 
      className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-primary' : 'group-active:scale-90'}`} 
    />
    <span className="text-[8px] uppercase tracking-[0.2em] font-medium leading-none mt-1">{label}</span>
    {isActive && (
      <motion.div
        layoutId="nav-pill"
        className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-xl -z-10 shadow-2xl"
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
      />
    )}
  </button>
);

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNavBar = ({ activeTab, setActiveTab }: BottomNavBarProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: Layers },
    { id: 'flashcards', label: 'Study', icon: BrainCircuit },
    { id: 'tutor', label: 'Tutor', icon: Bot },
    { id: 'profile', label: 'User', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-t border-outline-variant/30 px-2 pt-2 pb-8 md:hidden">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
};

export const TopAppBar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { emoji, displayName, userPhoto, user, login, logout, notificationsEnabled, t } = useUser();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const desktopTabs = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'schedule', label: t('schedule'), icon: Calendar },
    { id: 'tasks', label: t('tasks'), icon: Layers },
    { id: 'flashcards', label: t('flashcards'), icon: BrainCircuit },
    { id: 'tutor', label: t('tutor'), icon: Bot },
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const notifications = [
    { id: 1, title: 'Welcome to FocusBuddy!', message: 'Firebase sync is now live. Login with Google to save your progress.', time: 'Just now' },
    { id: 2, title: 'New Update', message: 'EDUFLOW is now FocusBuddy. Fresh new look, same focus.', time: '2h ago' }
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between gap-8">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant/70">EduFlow</span>
            <h1 className="text-2xl italic-serif text-on-surface tracking-tight leading-none mt-1">FocusBuddy</h1>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 overflow-x-auto no-scrollbar">
          {desktopTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-[9px] uppercase tracking-[0.2em] transition-all relative group shrink-0
                  ${isActive ? 'text-on-surface' : 'text-zinc-500 hover:text-on-surface-variant'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl shadow-inner"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-primary' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 lg:gap-8 shrink-0">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              {user ? t('cloudSynced') : t('offlineMode')}
            </span>
            <button 
              onClick={user ? logout : login}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              {user ? t('logOut') : t('logIn')}
            </button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              disabled={!notificationsEnabled}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 border ${!notificationsEnabled ? 'opacity-20 grayscale cursor-not-allowed' : ''} ${showNotifications ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-container-low border-outline-variant/30 text-zinc-500 hover:text-on-surface'}`}
            >
              <div className="relative">
                {notificationsEnabled && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full border border-surface shadow-[0_0_8px_rgba(251,191,36,0.5)]" />}
                <Bell className="w-5 h-5" />
              </div>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 bg-surface-container-high border border-outline-variant rounded-3xl p-6 card-shadow-hover z-50"
                >
                  <h3 className="text-sm italic-serif text-on-surface mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {notifications.map(n => (
                      <div key={n.id} className="group cursor-pointer hover:bg-surface-container p-2 rounded-xl transition-colors">
                        <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">{n.title}</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-zinc-600 mt-2 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            onClick={() => setActiveTab('profile')}
            className={`w-12 h-12 rounded-full border border-outline-variant/30 overflow-hidden cursor-pointer flex items-center justify-center transition-all bg-surface-container-low hover:border-primary/50 text-2xl ${activeTab === 'profile' ? 'border-primary' : ''}`}
          >
            {emoji}
          </div>
        </div>
      </div>
    </header>
  );
};
