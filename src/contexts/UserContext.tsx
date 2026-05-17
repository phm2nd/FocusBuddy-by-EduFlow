import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Language, translations } from '../translations';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  displayName: string;
  setDisplayName: (name: string) => void;
  emoji: string;
  setEmoji: (emoji: string) => void;
  userPhoto: string;
  streak: number;
  setStreak: (s: number) => void;
  tasksCompleted: number;
  setTasksCompleted: (c: number) => void;
  occupation: string;
  setOccupation: (o: string) => void;
  focus: string;
  setFocus: (f: string) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
  mobileOptimized: boolean;
  setMobileOptimized: (v: boolean) => void;
  tabletMode: boolean;
  setTabletMode: (v: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (v: boolean) => void;
  resetProgress: () => Promise<void>;
  t: (key: string) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('User');
  const [emoji, setEmoji] = useState('🧠');
  const [streak, setStreak] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [occupation, setOccupation] = useState('College Student');
  const [focus, setFocus] = useState('Computer Science');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') !== 'false';
  });
  const [mobileOptimized, setMobileOptimizedState] = useState(() => {
    return localStorage.getItem('mobileOptimized') === 'true';
  });
  const [tabletMode, setTabletModeState] = useState(() => {
    return localStorage.getItem('tabletMode') === 'true';
  });

  const setMobileOptimized = (v: boolean) => {
    setMobileOptimizedState(v);
    if (v) setTabletModeState(false);
  };

  const setTabletMode = (v: boolean) => {
    setTabletModeState(v);
    if (v) setMobileOptimizedState(false);
  };
  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
    return localStorage.getItem('hapticsEnabled') !== 'false';
  });

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const userPhoto = user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}&backgroundColor=b71c1c,004d40,01579b,4a148c&fontSize=45`;

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
        // Reset to defaults or local storage if logged out
        setDisplayName(localStorage.getItem('displayName') || 'User');
        setEmoji(localStorage.getItem('userEmoji') || '🧠');
        setStreak(parseInt(localStorage.getItem('userStreak') || '0'));
        setTasksCompleted(parseInt(localStorage.getItem('tasksCompleted') || '0'));
        setOccupation(localStorage.getItem('userOccupation') || 'College Student');
        setFocus(localStorage.getItem('userFocus') || 'Computer Science');
        setLanguage((localStorage.getItem('language') as Language) || 'en');
        setNotificationsEnabled(localStorage.getItem('notificationsEnabled') !== 'false');
        setMobileOptimized(localStorage.getItem('mobileOptimized') === 'true');
        setTabletMode(localStorage.getItem('tabletMode') === 'true');
        setHapticsEnabled(localStorage.getItem('hapticsEnabled') !== 'false');
      }
    });
    return unsubscribe;
  }, []);

  // Firestore Sync Listener
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDisplayName(data.displayName || 'User');
        setEmoji(data.emoji || '🧠');
        setStreak(data.streak || 0);
        setTasksCompleted(data.tasksCompleted || 0);
        setOccupation(data.occupation || 'College Student');
        setFocus(data.focus || 'Computer Science');
        if (data.language) setLanguage(data.language);
        if (data.notificationsEnabled !== undefined) setNotificationsEnabled(data.notificationsEnabled);
        if (data.mobileOptimized !== undefined) setMobileOptimized(data.mobileOptimized);
        if (data.tabletMode !== undefined) setTabletMode(data.tabletMode);
        if (data.hapticsEnabled !== undefined) setHapticsEnabled(data.hapticsEnabled);
      } else {
        // Initialize user in Firestore if they don't exist
        setDoc(userRef, {
          displayName: user.displayName || 'User',
          emoji: '🧠',
          streak: 0,
          tasksCompleted: 0,
          occupation: 'College Student',
          focus: 'Computer Science',
          language: 'en',
          notificationsEnabled: true,
          mobileOptimized: false,
          tabletMode: false,
          hapticsEnabled: true,
          updatedAt: new Date().toISOString()
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed:", error);
      let message = t('loginError');
      
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        message = `Unauthorized domain: ${domain}. To fix this, please go to your Firebase Console > Authentication > Settings > Authorized domains, and add "${domain}" to the list.`;
      } else if (error.code === 'auth/popup-blocked') {
        message = "Popup blocked. Please allow popups for this site.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        setIsAuthenticating(false);
        return; 
      }
      
      alert(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Persist locally for non-logged in state
  useEffect(() => {
    localStorage.setItem('displayName', displayName);
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { displayName, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [displayName, user]);

  useEffect(() => {
    localStorage.setItem('userEmoji', emoji);
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { emoji, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [emoji, user]);

  useEffect(() => {
    localStorage.setItem('userStreak', streak.toString());
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { streak, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [streak, user]);

  useEffect(() => {
    localStorage.setItem('tasksCompleted', tasksCompleted.toString());
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { tasksCompleted, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [tasksCompleted, user]);

  useEffect(() => {
    localStorage.setItem('userOccupation', occupation);
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { occupation, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [occupation, user]);

  useEffect(() => {
    localStorage.setItem('userFocus', focus);
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { focus, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [focus, user]);

  useEffect(() => {
    localStorage.setItem('language', language);
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { language, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [language, user]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { notificationsEnabled, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [notificationsEnabled, user]);

  useEffect(() => {
    localStorage.setItem('mobileOptimized', mobileOptimized.toString());
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { mobileOptimized, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [mobileOptimized, user]);

  useEffect(() => {
    localStorage.setItem('tabletMode', tabletMode.toString());
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { tabletMode, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [tabletMode, user]);

  useEffect(() => {
    localStorage.setItem('hapticsEnabled', hapticsEnabled.toString());
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { hapticsEnabled, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [hapticsEnabled, user]);

  const resetProgress = async () => {
    if (!user) {
      setStreak(0);
      setTasksCompleted(0);
      localStorage.setItem('userStreak', '0');
      localStorage.setItem('tasksCompleted', '0');
      return;
    }

    try {
      // 1. Reset user profile stats in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        streak: 0,
        tasksCompleted: 0,
        updatedAt: new Date().toISOString()
      });

      // 2. Delete all tasks belonging to user
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // 3. Reset local state
      setStreak(0);
      setTasksCompleted(0);
      localStorage.setItem('userStreak', '0');
      localStorage.setItem('tasksCompleted', '0');
    } catch (error) {
      console.error("Failed to reset progress:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, loading, login, logout,
      displayName, setDisplayName, 
      emoji, setEmoji, 
      userPhoto,
      streak, setStreak,
      tasksCompleted, setTasksCompleted,
      occupation, setOccupation,
      focus, setFocus,
      activeTab, setActiveTab,
      language, setLanguage,
      notificationsEnabled, setNotificationsEnabled,
      mobileOptimized, setMobileOptimized,
      tabletMode, setTabletMode,
      hapticsEnabled, setHapticsEnabled,
      resetProgress,
      t
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};
