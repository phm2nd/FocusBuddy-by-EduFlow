import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Clock, 
  Video, 
  BookOpen, 
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Event {
  id: string;
  time: string;
  type: string;
  title: string;
  subtitle?: string;
  location: string;
  duration: string;
  isStudyBlock?: boolean;
}

const initialEvents: Event[] = [
  {
    id: '1',
    time: '09:00',
    type: 'Lecture',
    title: 'Advanced Physics',
    subtitle: 'Quantum Mechanics & Thermodynamics',
    location: 'Science Hall, Room 302',
    duration: '1.5 hrs',
  },
  {
    id: '2',
    time: '11:00',
    type: 'Seminar',
    title: 'Creative Writing',
    subtitle: 'Workshop: Character Development',
    location: 'Zoom Link',
    duration: '1.5 hrs',
  },
  {
    id: '3',
    time: '13:30',
    type: 'Self-Study',
    title: 'Self Study Block',
    location: 'Library Annex',
    duration: '1.5 hrs',
    isStudyBlock: true,
  }
];

export const ScheduleScreen = () => {
  const { t } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate dates for the current week (starting Monday)
  const days = React.useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday
    const monday = new Date(now);
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    monday.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: d.getDate().toString(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        isToday: d.toDateString() === new Date().toDateString()
      };
    });
  }, []);

  // Set today as default selected day
  const todayIndex = days.findIndex(d => d.isToday);
  const [selectedDay, setSelectedDay] = useState(todayIndex !== -1 ? todayIndex : 0);

  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    time: '08:00',
    type: 'Lecture',
    location: '',
    duration: '1 hr'
  });

  // Remove static days array

  const addEvent = () => {
    if (!newEvent.title) return;
    const event: Event = {
      id: Date.now().toString(),
      time: newEvent.time || '08:00',
      type: newEvent.type || 'Lecture',
      title: newEvent.title,
      location: newEvent.location || 'Unknown',
      duration: newEvent.duration || '1 hr',
    };
    setEvents([...events, event].sort((a,b) => a.time.localeCompare(b.time)));
    setIsModalOpen(false);
    setNewEvent({ title: '', time: '08:00', type: 'Lecture', location: '', duration: '1 hr' });
  };

  const dayLabel = days[selectedDay].name;
  const dateLabel = days[selectedDay].date;
  const monthLabel = days[selectedDay].month;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="pb-32 space-y-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant/80 mb-2">Calendar</div>
          <h2 className="text-4xl italic-serif text-on-surface leading-none">{t('schedule')}</h2>
          <p className="text-on-surface-variant text-sm mt-2">{dayLabel}, {monthLabel} {dateLabel}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-on-surface text-surface px-8 h-12 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all flex items-center gap-3 shadow-2xl"
        >
          <Plus className="w-4 h-4" />
          {t('addNewTask')}
        </button>
      </div>

      {/* Weekly Calendar strip */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-1 overflow-x-auto no-scrollbar shadow-xl">
        <div className="flex justify-between items-center min-w-[600px] md:min-w-full">
          {days.map((day, idx) => (
            <button
              key={`${day.date}-${day.month}`}
              onClick={() => setSelectedDay(idx)}
              className={`flex-1 flex flex-col items-center justify-center py-5 rounded-xl transition-all duration-300
                ${selectedDay === idx 
                  ? 'bg-surface text-on-surface border border-outline-variant shadow-2xl relative' 
                  : 'text-on-surface-variant hover:text-on-surface'}
              `}
            >
              {(selectedDay === idx || day.isToday) && (
                <div className={`absolute top-2 w-1.5 h-1.5 rounded-full ${day.isToday ? 'bg-primary animate-pulse' : 'bg-outline-variant'} shadow-[0_0_8px_rgba(251,191,36,0.8)]`} />
              )}
              <span className="text-[9px] uppercase tracking-[0.2em] mb-2">{day.name}</span>
              <span className={`text-xl italic-serif ${selectedDay === idx ? 'text-primary' : ''} ${day.isToday && selectedDay !== idx ? 'border-b-2 border-primary/30' : ''}`}>
                {day.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline View */}
      <div className="relative max-w-4xl mx-auto pl-8 md:pl-24 pt-8">
        {/* Timeline Line */}
        <div className="absolute left-[38px] md:left-[82px] top-4 bottom-0 w-[1px] bg-outline-variant/30" />

        <div className="flex flex-col gap-12">
          {events.length === 0 && (
            <div className="py-20 text-center opacity-30 flex flex-col items-center">
              <CalendarIcon className="w-12 h-12 mb-4" />
              <p className="text-[10px] uppercase tracking-[0.4em]">Nothing scheduled for this day</p>
            </div>
          )}
          {events.map((event) => {
            return (
              <div key={event.id} className="relative flex group items-start">
                <div className="absolute -left-[38px] md:-left-[82px] w-12 md:w-16 text-right pr-4 md:pr-6 pt-1">
                  <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest leading-none">{event.time}</span>
                </div>

                <div className="absolute -left-[3px] top-2.5 w-1.5 h-1.5 rounded-full bg-surface border border-outline-variant group-hover:bg-primary transition-colors shadow-2xl z-10" />

                <div className="flex-grow pl-8 md:pl-0">
                  {event.isStudyBlock ? (
                    <motion.div 
                      whileHover={{ x: 4 }}
                      className="bg-surface-container-low border border-dashed border-outline-variant/30 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-surface-container"
                    >
                      <div className="flex items-center gap-4 text-zinc-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">{event.title}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant italic opacity-50">Private Session</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      whileHover={{ y: -4 }}
                      className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-8 hover:bg-surface-container transition-all cursor-pointer relative overflow-hidden group shadow-xl"
                    >
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 mb-2">{event.type}</div>
                            <h3 className="text-2xl italic-serif text-on-surface tracking-tight leading-tight">{event.title}</h3>
                         </div>
                         <div className="w-10 h-10 rounded-xl border border-outline-variant/30 flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors bg-surface-container">
                            {event.type === 'Lecture' ? <MapPin className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                         </div>
                      </div>
                      
                      {event.subtitle && (
                        <p className="text-on-surface-variant text-sm font-light italic mb-8 border-l border-primary/20 pl-4">{event.subtitle}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-outline-variant/10">
                        <div className="flex flex-col">
                           <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-700 mb-1">Locate</span>
                           <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{event.location}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-700 mb-1">Duration</span>
                           <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{event.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface-container-low border border-outline-variant/30 rounded-[40px] p-10 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-zinc-600 hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8">
                 <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mb-2">Temporal Log</div>
                 <h4 className="text-2xl italic-serif text-on-surface">New Access Entry</h4>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold ml-1">Event Directive</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Quantum Cryptography Lab"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full h-14 px-6 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-xl text-sm italic-serif text-on-surface"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold ml-1">Time Marker</label>
                       <input 
                         type="time" 
                         value={newEvent.time}
                         onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                         className="w-full h-14 px-6 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-xl text-xs uppercase"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold ml-1">Classification</label>
                       <select 
                         value={newEvent.type}
                         onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                         className="w-full h-14 px-6 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-xl text-xs uppercase appearance-none"
                       >
                         <option>Lecture</option>
                         <option>Seminar</option>
                         <option>Lab</option>
                         <option>Study</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold ml-1">Coordinates</label>
                    <input 
                      type="text" 
                      placeholder="Room 402 or Virtual Link"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full h-14 px-6 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-xl text-xs uppercase tracking-widest"
                    />
                 </div>

                 <button 
                  onClick={addEvent}
                  className="w-full h-16 bg-on-surface text-surface rounded-xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all mt-4"
                 >
                   <Plus className="w-4 h-4" />
                   Confirm Log
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
