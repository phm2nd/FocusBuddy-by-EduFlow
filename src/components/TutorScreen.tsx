import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  RefreshCcw, 
  User, 
  Bot,
  BrainCircuit,
  Info,
  BookOpen
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const TutorScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Inquiries await, scholar. I am Aethelgard, your intellectual companion. What academic mystery shall we unravel together today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error("Tutor communication failed:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had a bit of a connection issue. Can you please repeat that?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto flex flex-col h-[70vh] md:h-[75vh]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
        <div>
           <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 dark:text-zinc-500 mb-2">AI Companion</div>
           <div className="flex items-center gap-3">
             <h2 className="text-4xl italic-serif text-on-surface leading-none">StudyMate</h2>
             <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               <span className="text-[8px] uppercase tracking-widest text-primary font-bold">Online</span>
             </div>
           </div>
        </div>
      </div>

      <div className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-[40px] flex flex-col overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-surface-container-low to-transparent z-10 pointer-events-none" />
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-6 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border border-outline-variant/30 ${m.role === 'user' ? 'bg-secondary text-on-secondary' : 'bg-surface text-primary'}`}>
                    {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`p-6 rounded-[28px] ${m.role === 'user' ? 'bg-on-surface text-surface rounded-tr-none' : 'bg-surface-container rounded-tl-none border border-outline-variant/20'}`}>
                    <p className={`text-sm leading-relaxed ${m.role === 'assistant' ? 'italic-serif text-on-surface-variant' : 'font-medium'}`}>
                      {m.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="px-6 py-4 bg-surface-container rounded-3xl border border-outline-variant/20">
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  </div>
               </div>
            </motion.div>
          )}
        </div>

        <div className="p-8 bg-surface-container/50 border-t border-outline-variant/30 backdrop-blur-md">
           <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                className="w-full h-16 pl-8 pr-20 bg-surface-container-low border border-outline-variant focus:border-primary/50 focus:outline-none rounded-2xl text-sm italic-serif text-on-surface transition-all placeholder:text-zinc-600"
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 bg-on-surface text-surface rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
           </div>
           <div className="flex items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                <BrainCircuit className="w-3 h-3" /> AI Active
              </div>
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                <BookOpen className="w-3 h-3" /> Study Helper
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
