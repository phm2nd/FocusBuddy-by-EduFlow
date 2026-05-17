import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  MoreHorizontal, 
  TrendingUp,
  Flame,
  Clock,
  Check,
  Plus,
  AlertTriangle,
  BrainCircuit
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const DashboardScreen = () => {
  const { displayName, streak, tasksCompleted, setActiveTab, t } = useUser();

  const firstName = displayName.split(' ')[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 space-y-12"
    >
      {/* Editorial Hero Section */}
      <section className="h-[280px] md:h-[360px] relative rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl flex items-end group">
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent z-10"></div>
        {/* Abstract Background Gradient */}
        <div className="absolute inset-0 bg-surface-container-low">
          <div className="absolute inset-0 opacity-40 dark:opacity-20" style={{ background: "radial-gradient(circle at top right, var(--color-primary), transparent), radial-gradient(circle at bottom left, var(--color-surface-container-highest), transparent)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-outline-variant/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-outline-variant/10" />
        </div>
        
        <div className="relative z-20 p-6 md:p-10 flex justify-between items-end w-full">
          <div className="max-w-xl">
            <div className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">Today's Focus</div>
            <h2 className="text-4xl md:text-6xl italic-serif leading-[1.1] text-on-surface underline decoration-primary/30 underline-offset-8">Hello, {firstName}.</h2>
            <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed font-light mt-4 md:mt-6 max-w-sm">Ready to learn something new? You're doing great so far!</p>
          </div>
          <div className="hidden md:flex flex-col items-end">
             <div className="text-[40px] italic-serif text-on-surface/90">{(tasksCompleted * 10) % 100}%</div>
             <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Progress</div>
          </div>
        </div>
      </section>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Daily Goal Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-8 card-shadow flex flex-col md:flex-row items-center gap-8 group"
        >
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-1">Goals</h3>
                <div className="text-3xl italic-serif text-on-surface">{t('dailyProgress')}</div>
              </div>
              <div className="text-2xl italic-serif text-primary">{tasksCompleted}</div>
            </div>
            <div className="w-full h-[2px] bg-outline-variant/30 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(tasksCompleted * 10, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">Total Tasks Finished</span>
            </div>
          </div>
        </motion.div>

        {/* Streak Stats Card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-8 card-shadow flex items-center justify-between group">
          <div className="flex flex-col">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-1">{t('studyStreak')}</h3>
            <div className="text-4xl italic-serif text-on-surface tracking-tighter">{streak} {t('dayStreak')}</div>
            <div className="mt-4 flex gap-1.5 items-end h-6">
              {[0.2, 0.4, 0.35, 0.6, 0.5, 0.8, streak > 0 ? 1 : 0.1].map((h, i) => (
                <div key={i} className={`flex-1 ${i === 6 && streak > 0 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-outline-variant/30'} rounded-sm`} style={{ height: `${h * 100}%` }} />
              ))}
            </div>
          </div>
          <div className={`w-16 h-16 rounded-full border ${streak > 0 ? 'border-orange-500/30 bg-orange-500/5' : 'border-outline-variant/30 bg-surface'} flex items-center justify-center ${streak > 0 ? 'text-orange-500' : 'text-zinc-700/30'} shadow-2xl transition-all duration-700 group-hover:scale-110`}>
            <Flame className={`w-8 h-8 ${streak > 0 ? 'fill-orange-500 animate-pulse' : ''}`} />
          </div>
        </div>
      </div>

      {/* Quick Launch */}
      <div className="pt-8">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[9px] font-serif italic text-primary/80">01.</span>
          <div className="h-[1px] flex-1 bg-outline-variant/30" />
          <h3 className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant">Rapid Access</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => setActiveTab('flashcards')}
              className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-3xl text-left hover:bg-surface-container transition-all group"
            >
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current" />
               </div>
               <h4 className="text-lg italic-serif text-on-surface mb-1">{t('studyFlashcards')}</h4>
               <p className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">{t('openSession')}</p>
            </button>
            <button 
              onClick={() => setActiveTab('tasks')}
              className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-3xl text-left hover:bg-surface-container transition-all group"
            >
               <div className="w-10 h-10 rounded-full bg-zinc-600/10 flex items-center justify-center mb-6 text-zinc-600 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
               </div>
               <h4 className="text-lg italic-serif text-on-surface mb-1">{t('addNewTask')}</h4>
               <p className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">{t('quickLabel')}</p>
            </button>
            <button 
              onClick={() => setActiveTab('tutor')}
              className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-3xl text-left hover:bg-surface-container transition-all group"
            >
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-4 h-4" />
               </div>
               <h4 className="text-lg italic-serif text-on-surface mb-1">{t('talkToAi')}</h4>
               <p className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">{t('expertHelp')}</p>
            </button>
        </div>
      </div>
    </motion.div>
  );
};
