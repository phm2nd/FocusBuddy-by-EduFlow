import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Settings, 
  Palette as PaletteIcon, 
  Clock, 
  Flame, 
  Plus, 
  Edit3,
  Check,
  Camera,
  Smile,
  X
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

export const ProfileScreen = () => {
  const { 
    user, displayName, setDisplayName, 
    emoji, setEmoji, streak, 
    occupation, setOccupation, 
    focus, setFocus, 
    mobileOptimized, tabletMode,
    t 
  } = useUser();
  const { theme, setTheme } = useTheme();
  const isNarrow = mobileOptimized || tabletMode;
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(displayName);
  const [newOccupation, setNewOccupation] = useState(occupation);
  const [newFocus, setNewFocus] = useState(focus);
  const [isEmojiPicker, setIsEmojiPicker] = useState(false);

  const emojis = ['🧠', '🧬', '⚛️', '📚', '🖋️', '🎨', '🚀', '🌟', '⚙️', '🛡️', '⚡', '☕'];

  const handleSave = () => {
    setDisplayName(newName);
    setOccupation(newOccupation);
    setFocus(newFocus);
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="pb-32 space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div>
           <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 dark:text-zinc-500 mb-2">{t('myProfile')}</div>
           <h2 className="text-4xl italic-serif text-on-surface leading-none">{t('portfolio')}</h2>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-3 border border-outline-variant/30 hover:border-on-surface/20 text-on-surface text-[10px] uppercase tracking-[0.2em] px-8 h-12 rounded-sm transition-all active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {isEditing ? t('cancel') : t('editProfile')}
        </button>
      </div>

      <div className={`grid grid-cols-1 gap-12 ${isNarrow ? '' : 'md:grid-cols-12'}`}>
        {/* Profile Card */}
        <div className={`${isNarrow ? 'md:col-span-1' : 'md:col-span-8'} bg-surface-container-low/50 border border-outline-variant/30 rounded-[32px] p-10 card-shadow relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-12 group backdrop-blur-xl`}>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] opacity-10 pointer-events-none group-hover:opacity-20 transition-all" />
          
          <div className="relative group/avatar">
            <div className="relative w-44 h-44 rounded-full overflow-hidden border border-outline-variant/30 shadow-2xl flex items-center justify-center bg-surface-container transition-all duration-700">
               <div className="text-7xl">{emoji}</div>
            </div>
            <button 
              onClick={() => setIsEmojiPicker(true)}
              className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-on-surface text-surface flex items-center justify-center shadow-xl opacity-0 group-hover/avatar:opacity-100 transition-all hover:scale-110 active:scale-95"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 flex-grow pt-4">
            <div className="flex items-center gap-2 mb-4">
               <span className={`w-1.5 h-1.5 rounded-full ${streak > 0 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-primary'}`} />
               <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 font-medium">{streak > 0 ? t('activeLearner') : t('readyToStart')}</span>
            </div>
            
            {isEditing ? (
              <div className="w-full space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Display Name</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-4xl italic-serif text-on-surface bg-transparent border-b border-primary/30 focus:border-primary focus:outline-none w-full pb-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Occupation</label>
                    <input 
                      type="text" 
                      value={newOccupation}
                      onChange={(e) => setNewOccupation(e.target.value)}
                      className="text-sm text-on-surface bg-transparent border-b border-outline-variant/30 focus:border-primary focus:outline-none w-full pb-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Focus</label>
                    <input 
                      type="text" 
                      value={newFocus}
                      onChange={(e) => setNewFocus(e.target.value)}
                      className="text-sm text-on-surface bg-transparent border-b border-outline-variant/30 focus:border-primary focus:outline-none w-full pb-2"
                    />
                  </div>
                </div>
                <button onClick={handleSave} className="bg-on-surface text-surface text-[9px] uppercase tracking-[0.2em] font-bold px-8 h-12 rounded-sm shadow-xl shadow-on-surface/10 hover:opacity-90 transition-all mt-4">{t('saveChanges')}</button>
              </div>
            ) : (
              <>
                <h3 className={`italic-serif text-on-surface mb-2 leading-none ${isNarrow ? 'text-3xl' : 'text-5xl'}`}>{displayName}</h3>
                <p className="text-on-surface-variant italic-serif text-lg py-2 mb-8 border-b border-outline-variant/10 w-full">{occupation} · {focus}</p>
              </>
            )}
            
            <div className={`grid gap-8 w-full mt-auto ${isNarrow ? 'grid-cols-1' : 'grid-cols-2'}`}>
               <div className="p-6 rounded-2xl bg-surface-container/30 border border-outline-variant/10">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-2">Member Since</div>
                  <div className="text-sm font-medium text-on-surface-variant">
                    {user?.metadata.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
               </div>
               <div className="p-6 rounded-2xl bg-surface-container/30 border border-outline-variant/10">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-2">Interface Focus</div>
                  <div className="text-sm font-medium text-on-surface-variant">
                    {mobileOptimized ? "Mobile Terminal" : tabletMode ? "Tablet Logic" : "Desktop Node"}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className={`${isNarrow ? 'md:col-span-1' : 'md:col-span-4'} flex flex-col gap-6`}>
          <div className="bg-surface-container-low/50 border border-outline-variant/30 rounded-3xl p-8 card-shadow flex items-center gap-6 group hover:bg-surface-container transition-all">
            <div className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest leading-none mb-2">{t('studyHours')}</p>
              <p className="text-3xl italic-serif text-on-surface">0<span className="text-xs italic text-zinc-600 ml-1">Hrs</span></p>
            </div>
          </div>
          <div className="bg-surface-container-low/50 border border-outline-variant/30 rounded-3xl p-8 card-shadow flex items-center gap-6 group hover:bg-surface-container transition-all">
            <div className={`w-12 h-12 rounded-full border ${streak > 0 ? 'border-orange-500/30' : 'border-outline-variant/30'} flex items-center justify-center ${streak > 0 ? 'text-orange-500 bg-orange-500/5' : 'text-zinc-600'} group-hover:text-orange-500 transition-colors`}>
              <Flame className={`w-5 h-5 ${streak > 0 ? 'fill-orange-500' : ''}`} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest leading-none mb-2">{t('daysActive')}</p>
              <p className="text-3xl italic-serif text-on-surface">{streak}<span className="text-xs italic text-zinc-600 ml-1">{t('dayStreak').split(' ')[0]}</span></p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEmojiPicker && (
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
              <button onClick={() => setIsEmojiPicker(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-on-surface transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h4 className="text-xl italic-serif text-on-surface text-center mb-8">{t('selectEmoji')}</h4>
              <div className="grid grid-cols-4 gap-4">
                {emojis.map((e) => (
                  <button 
                    key={e} 
                    onClick={() => { setEmoji(e); setIsEmojiPicker(false); }}
                    className={`text-3xl p-4 rounded-2xl hover:bg-surface-container transition-all ${emoji === e ? 'bg-primary/20 scale-110' : ''}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
