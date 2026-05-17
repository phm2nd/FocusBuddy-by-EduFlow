import React from 'react';
import { motion } from 'motion/react';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Globe, 
  ChevronRight,
  LogOut,
  Info,
  Trash2,
  AlertTriangle,
  X,
  Smartphone,
  Tablet,
  Touchpad
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Language } from '../translations';
import { AnimatePresence } from 'motion/react';

export const SettingsScreen = () => {
  const { theme, setTheme } = useTheme();
  const { 
    user, login, logout, language, setLanguage, 
    notificationsEnabled, setNotificationsEnabled, 
    mobileOptimized, setMobileOptimized,
    tabletMode, setTabletMode,
    hapticsEnabled, setHapticsEnabled,
    resetProgress, t 
  } = useUser();
  const isNarrow = mobileOptimized || tabletMode;
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'ms', label: 'Malay' },
    { id: 'zh', label: 'Chinese' },
    { id: 'ta', label: 'Tamil' }
  ];

  const handleDeleteProgress = async () => {
    try {
      await resetProgress();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const sections = [
    {
      title: t('visualEnvironment'),
      description: "Customize the neural aesthetic of your workspace.",
      items: [
        { 
          icon: <Monitor className="w-4 h-4" />, 
          label: t('interfaceMode'), 
          action: (
            <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/30">
              {[
                { id: 'light', icon: <Sun className="w-3.5 h-3.5" /> },
                { id: 'dark', icon: <Moon className="w-3.5 h-3.5" /> },
                { id: 'system', icon: <Monitor className="w-3.5 h-3.5" /> }
              ].map((t_mode) => (
                <button
                  key={t_mode.id}
                  onClick={() => setTheme(t_mode.id as any)}
                  className={`p-2 rounded-md transition-all ${theme === t_mode.id ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {t_mode.icon}
                </button>
              ))}
            </div>
          )
        },
      ]
    },
    {
      title: "Identity & Sync",
      description: "Secure your progress across all your neural nodes.",
      items: [
        { 
          icon: <Globe className="w-4 h-4" />, 
          label: "Google Account", 
          action: (
            <button 
              onClick={user ? logout : login}
              className={`px-6 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${
                user 
                  ? 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20' 
                  : 'bg-primary text-on-primary border-primary hover:opacity-90'
              }`}
            >
              {user ? t('disconnectSession') : "Connect Google"}
            </button>
          )
        },
      ]
    },
    {
      title: t('synchronization'),
      description: "Manage how information reaches your awareness.",
      items: [
        { 
          icon: <Bell className="w-4 h-4" />, 
          label: t('pulseNotifications'), 
          toggle: notificationsEnabled,
          onToggle: () => setNotificationsEnabled(!notificationsEnabled)
        },
        { 
          icon: <Globe className="w-4 h-4" />, 
          label: t('language'), 
          action: (
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-surface-container-low text-on-surface text-[10px] font-bold uppercase tracking-widest border border-outline-variant/30 rounded-lg px-2 py-1 outline-none"
            >
              {languages.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          )
        },
      ]
    },
    {
      title: "Device Optimization",
      description: "Neural interface adjustments for physical mobile hardware.",
      items: [
        { 
          icon: <Smartphone className="w-4 h-4" />, 
          label: "Mobile Viewport", 
          description: "Optimize layout density for narrow screens.",
          toggle: mobileOptimized,
          onToggle: () => setMobileOptimized(!mobileOptimized)
        },
        { 
          icon: <Tablet className="w-4 h-4" />, 
          label: "Tablet Mode", 
          description: "Expand interface for larger touch surfaces.",
          toggle: tabletMode,
          onToggle: () => setTabletMode(!tabletMode)
        },
        { 
          icon: <Touchpad className="w-4 h-4" />, 
          label: "Haptic Feedback", 
          description: "Tactile response on neural triggers.",
          toggle: hapticsEnabled,
          onToggle: () => setHapticsEnabled(!hapticsEnabled)
        },
      ]
    },
    {
      title: "Repository Controls",
      description: "Destructive actions for your study session.",
      items: [
        { 
          icon: <Trash2 className="w-4 h-4 text-red-500" />, 
          label: t('deleteProgress'), 
          action: (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              {t('delete')}
            </button>
          )
        },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="pb-32 space-y-12"
    >
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface-container-low border border-outline-variant/30 rounded-[40px] p-10 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="absolute top-6 right-6 text-zinc-600 hover:text-on-surface transition-colors"
                id="close-delete-confirm"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h4 className="text-xl italic-serif text-on-surface">{t('deleteProgress')}?</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed px-4">
                  {t('deleteProgressConfirm')}
                </p>
                
                <div className="flex gap-4 w-full mt-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 border border-outline-variant/30 rounded-2xl hover:bg-surface-container transition-all"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    onClick={handleDeleteProgress}
                    className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/20 hover:opacity-90 transition-all"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div>
           <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 dark:text-zinc-500 mb-2">System Controls</div>
           <h2 className="text-4xl italic-serif text-on-surface leading-none">{t('configurations')}</h2>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-16 pt-8 ${isNarrow ? '' : 'md:grid-cols-12'}`}>
        <div className={isNarrow ? 'col-span-1' : 'md:col-span-4'}>
          <div className="sticky top-8 space-y-6">
            <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[32px] space-y-6 shadow-2xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Info className="w-8 h-8" />
                </div>
                <h4 className="text-xl italic-serif text-on-surface">{t('systemStatus')}</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-relaxed font-medium">Build 2.4.0-Beta<br/>{t('neuralLinkOptimized')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={isNarrow ? 'col-span-1 space-y-12' : 'md:col-span-8 space-y-12'}>
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-serif italic text-primary/80">{String(idx + 1).padStart(2, '0')}.</span>
                <div className="h-[1px] flex-1 bg-outline-variant/30" />
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant">{section.title}</h3>
              </div>
              
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] overflow-hidden shadow-xl">
                 {section.items.map((item, i) => (
                   <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-7 hover:bg-surface-container transition-all ${i !== section.items.length - 1 ? 'border-b border-outline-variant/10' : ''} gap-4`}>
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className={`p-3 md:p-4 rounded-2xl bg-surface border border-outline-variant/30 text-zinc-600 shrink-0`}>
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm font-medium text-on-surface-variant uppercase tracking-widest">{item.label}</span>
                          {item.description && (
                            <p className="text-[10px] text-zinc-500 mt-1 max-w-sm leading-relaxed">{item.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end gap-4 ml-14 sm:ml-0">
                         {item.action && item.action}
                         {item.toggle !== undefined && (
                           <button 
                            onClick={item.onToggle}
                            className={`w-10 h-5 rounded-full relative transition-colors ${item.toggle ? 'bg-primary' : 'bg-outline-variant/50'}`}
                           >
                              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all bg-white ${item.toggle ? 'left-6' : 'left-1'}`} />
                           </button>
                         )}
                         {!item.action && item.toggle === undefined && <ChevronRight className="w-4 h-4 text-outline-variant" />}
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
