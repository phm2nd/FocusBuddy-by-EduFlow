import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Search, 
  Layout, 
  MoreVertical,
  Filter,
  Check,
  X,
  Type,
  Flag
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { 
  db, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query 
} from '../lib/firebase';

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'completed';
  due: string;
  priority: 'low' | 'medium' | 'high';
}

export const TasksScreen = () => {
  const { tasksCompleted, setTasksCompleted, streak, setStreak, user, t, mobileOptimized, tabletMode } = useUser();
  const isNarrow = mobileOptimized || tabletMode;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    category: '',
    priority: 'medium',
    due: 'Today'
  });

  // Sync with Firestore if logged in
  useEffect(() => {
    if (!user) {
      // If not logged in, use local state (initialized empty)
      return;
    }

    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(fetchedTasks.sort((a, b) => b.id.localeCompare(a.id)));
    }, (error) => {
      console.error("Firestore Error in TasksScreen:", error);
    });

    return unsubscribe;
  }, [user]);

  const addTask = async () => {
    if (!newTask.title) return;
    
    const taskData: Omit<Task, 'id'> = {
      title: newTask.title,
      category: newTask.category || 'General',
      status: 'pending',
      due: newTask.due || 'Today',
      priority: (newTask.priority as any) || 'medium'
    };

    if (user) {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), taskData);
    } else {
      const task: Task = {
        id: Date.now().toString(),
        ...taskData
      };
      setTasks([task, ...tasks]);
    }

    setIsModalOpen(false);
    setNewTask({ title: '', category: '', priority: 'medium', due: 'Today' });
  };

  const toggleTask = async (task: Task) => {
    const isCompleting = task.status === 'pending';
    const newStatus = isCompleting ? 'completed' : 'pending';

    if (isCompleting) {
      setTasksCompleted(tasksCompleted + 1);
      if (streak === 0) setStreak(1);
    }

    if (user) {
      const taskRef = doc(db, 'users', user.uid, 'tasks', task.id);
      await updateDoc(taskRef, { status: newStatus });
    } else {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    }
  };

  const deleteTask = async (taskId: string) => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId));
    } else {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="pb-32 space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div>
           <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 dark:text-zinc-500 mb-2">Study List</div>
           <h2 className="text-4xl italic-serif text-on-surface leading-none">{t('tasks')}</h2>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/50" />
            <input 
              type="text" 
              placeholder={t('searchTasks')} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-surface-container-low border border-outline-variant focus:border-primary/50 focus:outline-none rounded-xl text-xs uppercase tracking-widest text-on-surface-variant transition-all w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-on-surface text-surface px-8 h-12 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-2xl"
          >
            <Plus className="w-4 h-4" />
            {t('addNewTask')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8">
        {/* Active Tasks */}
        <div className="md:col-span-12 flex flex-col gap-8">
           <div className="flex items-center gap-4">
            <span className="text-[9px] font-serif italic text-primary/80">01.</span>
            <div className="h-[1px] flex-1 bg-outline-variant/30" />
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant">Active Operations</h3>
          </div>

          <div className="space-y-4">
            {pendingTasks.length === 0 && (
              <div className="py-12 border border-dashed border-outline-variant/30 rounded-[32px] flex flex-col items-center justify-center text-center opacity-40">
                <Layout className="w-10 h-10 mb-4" />
                <p className="text-[10px] uppercase tracking-[0.4em]">No tasks left for now</p>
              </div>
            )}
            <AnimatePresence>
              {pendingTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ x: 4 }}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 flex items-center justify-between group hover:bg-surface-container transition-all cursor-pointer"
                  onClick={() => toggleTask(task)}
                >
                  <div className="flex items-center gap-6">
                    <button className="text-on-surface-variant group-hover:text-primary transition-colors">
                      <Circle className="w-6 h-6 stroke-1 group-hover:stroke-2" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-on-surface-variant font-medium">{task.category}</span>
                        {task.priority === 'high' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        )}
                      </div>
                      <h4 className="text-lg italic-serif text-on-surface leading-tight">{task.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Log Target</span>
                      <span className="text-xs text-on-surface-variant">{task.due}</span>
                    </div>
                    <MoreVertical className="w-4 h-4 text-outline-variant group-hover:text-on-surface transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <div className="md:col-span-12 flex flex-col gap-8 pt-4">
             <div className="flex items-center gap-4">
              <span className="text-[9px] font-serif italic text-on-surface-variant/30">02.</span>
              <div className="h-[1px] flex-1 bg-outline-variant/20" />
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-700 dark:text-zinc-800 font-bold">Done</h3>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-surface-container-low/30 border border-outline-variant/10 rounded-2xl p-5 flex items-center justify-between opacity-60 group hover:opacity-80 transition-all cursor-pointer"
                    onClick={() => toggleTask(task)}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-6 h-6 rounded-full border border-outline-variant/50 flex items-center justify-center bg-primary/10">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-on-surface-variant opacity-60 font-medium">{task.category}</span>
                        <h4 className="text-base italic-serif text-on-surface line-through decoration-on-surface-variant/30 leading-tight">{task.title}</h4>
                      </div>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">Done</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* New Task Modal */}
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
              className="bg-surface-container-low border border-outline-variant/30 rounded-[40px] p-8 md:p-12 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-zinc-600 hover:text-on-surface transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-10">
                 <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mb-2">Operation Config</div>
                 <h4 className="text-3xl italic-serif text-on-surface">{t('addNewTask')}</h4>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold ml-1">Objective Descriptor</label>
                  <div className="relative">
                    <Type className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      type="text" 
                      placeholder="e.g. Design Cognition Framework"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full h-16 pl-14 pr-8 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-2xl text-md italic-serif text-on-surface placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold ml-1">Classification Pool</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Studio 01"
                        value={newTask.category}
                        onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                        className="w-full h-14 px-6 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-xl text-xs uppercase tracking-widest text-on-surface"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold ml-1">Urgency Level</label>
                      <select 
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                        className="w-full h-14 px-6 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-xl text-xs uppercase tracking-widest text-on-surface appearance-none"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold ml-1">Deadline Sequence</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Today, 18:00"
                    value={newTask.due}
                    onChange={(e) => setNewTask({...newTask, due: e.target.value})}
                    className="w-full h-14 px-6 bg-surface-container border border-outline-variant focus:border-primary/50 focus:outline-none rounded-xl text-xs uppercase tracking-widest text-on-surface"
                  />
                </div>

                <button 
                  onClick={addTask}
                  className="w-full h-18 bg-on-surface text-surface rounded-2xl flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl hover:opacity-90 transition-all mt-6"
                >
                  <Plus className="w-5 h-5" />
                  {t('addNewTask')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
