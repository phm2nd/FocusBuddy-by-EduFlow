import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Layers, 
  Play, 
  Sparkles,
  RefreshCcw,
  ChevronRight,
  BrainCircuit,
  MessageSquare,
  MoreVertical,
  ChevronLeft,
  CheckCircle2,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Flashcard {
  front: string;
  back: string;
  category: string;
}

export const FlashcardsScreen = () => {
  const { streak, setStreak, t, mobileOptimized, tabletMode } = useUser();
  const isNarrow = mobileOptimized || tabletMode;
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Flashcard[]>([]);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const generateFlashcards = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count: cardCount })
      });
      const data = await response.json();
      setGeneratedCards(data);
      setIsStudyMode(true);
      setIsFinished(false);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Flashcard generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = useCallback(() => {
    // Light up streak if it was 0 when they do a card
    if (streak === 0) {
      setStreak(1);
    }
    
    if (currentCardIndex === generatedCards.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentCardIndex((prev) => (prev + 1) % generatedCards.length);
      setIsFlipped(false);
    }
  }, [currentCardIndex, generatedCards.length, streak, setStreak]);

  const prevCard = useCallback(() => {
    setCurrentCardIndex((prev) => (prev - 1 + generatedCards.length) % generatedCards.length);
    setIsFlipped(false);
  }, [generatedCards.length]);

  const toggleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStudyMode || isFinished) return;
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          toggleFlip();
          break;
        case 'ArrowRight':
          nextCard();
          break;
        case 'ArrowLeft':
          prevCard();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStudyMode, isFinished, toggleFlip, nextCard, prevCard]);

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto space-y-8 pb-32 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Trophy className="w-12 h-12" />
        </div>
        <h2 className="text-4xl italic-serif text-on-surface">Great job!</h2>
        <p className="text-on-surface-variant max-w-md mx-auto">You finished studying {generatedCards.length} cards. You are getting better at this!</p>
        <button 
          onClick={() => { setIsStudyMode(false); setIsFinished(false); }}
          className="mt-8 flex items-center gap-3 bg-on-surface text-surface px-10 h-14 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all"
        >
          Go Back Home
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  if (isStudyMode && generatedCards.length > 0) {
    const card = generatedCards[currentCardIndex];
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto space-y-12 pb-32"
      >
        <div className="w-full flex justify-between items-center px-4">
          <button onClick={() => setIsStudyMode(false)} className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-on-surface transition-colors">
            Exit Session
          </button>
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
            Card {currentCardIndex + 1} of {generatedCards.length}
          </div>
          <div className="text-[9px] uppercase tracking-[0.4em] text-primary">{card.category}</div>
        </div>

        <div className="perspective-1000 w-full h-[400px] cursor-pointer" onClick={toggleFlip}>
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-full relative preserve-3d"
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-surface-container-low border border-outline-variant/30 rounded-[40px] flex items-center justify-center p-12 text-center shadow-2xl">
              <div className="flex flex-col items-center gap-8">
                <BrainCircuit className="w-8 h-8 text-zinc-700/50" />
                <h3 className="text-3xl italic-serif text-on-surface leading-snug">{card.front}</h3>
                <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-600 mt-8">Press Space to see the answer</span>
              </div>
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-surface-container border border-primary/20 rounded-[40px] flex items-center justify-center p-12 text-center shadow-2xl">
              <div className="flex flex-col items-center gap-8">
                <Sparkles className="w-8 h-8 text-primary/50" />
                <p className="text-xl italic-serif text-on-surface-variant leading-relaxed">{card.back}</p>
                <div className="flex gap-4 mt-8">
                   <div onClick={(e) => { e.stopPropagation(); nextCard(); }} className="px-4 py-2 rounded-full border border-outline-variant/30 text-[9px] uppercase tracking-[0.2em] text-zinc-600 hover:bg-surface-variant transition-colors">I know this</div>
                   <div onClick={(e) => { e.stopPropagation(); nextCard(); }} className="px-4 py-2 rounded-full border border-primary/30 text-[9px] uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors">Review later</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-8">
          <button onClick={(e) => { e.stopPropagation(); prevCard(); }} className="w-16 h-16 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextCard(); }} className="w-16 h-16 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div>
           <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 dark:text-zinc-500 mb-2">Study Helper</div>
           <h2 className="text-4xl italic-serif text-on-surface leading-none">{t('flashcards')}</h2>
        </div>
      </div>

      {/* AI Inspiration Bar */}
      <div className="bg-surface-container-low/50 border border-outline-variant/20 rounded-[32px] p-6 md:p-10 flex flex-col items-center gap-8 text-center backdrop-blur-xl">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-4">
          <h3 className="text-2xl italic-serif text-on-surface">{t('addNewTask')}</h3>
          <p className="text-sm text-on-surface-variant font-light px-4">Enter a topic and our AI tutor will create study cards for you.</p>
        </div>

        <div className="w-full max-w-xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. Quantum Entanglement..." 
              className="flex-1 px-6 md:px-8 h-14 md:h-16 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-2xl text-[10px] md:text-xs uppercase tracking-widest text-on-surface transition-all"
            />
            <button 
              onClick={generateFlashcards}
              disabled={isGenerating}
              className="h-14 md:h-16 px-8 bg-on-surface text-surface rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center shrink-0"
            >
              {isGenerating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
             <span className="text-[9px] uppercase tracking-widest text-zinc-600 mr-2">Count:</span>
             {[5, 10, 15, 20].map(n => (
               <button 
                 key={n}
                 onClick={() => setCardCount(n)}
                 className={`w-10 h-10 rounded-xl border transition-all text-[10px] font-bold ${cardCount === n ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/30 text-zinc-600 hover:border-outline-variant'}`}
               >
                 {n}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!isGenerating && generatedCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
           <Layers className="w-12 h-12 mb-4 text-zinc-600" />
           <p className="text-[10px] uppercase tracking-[0.4em]">No flashcards yet</p>
        </div>
      )}
    </motion.div>
  );
};
