import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exam, Note, Subject, Screen, UserProfile } from './types';
import { DEFAULT_SUBJECTS } from './constants';

interface AppContextType {
  exams: Exam[];
  notes: Note[];
  subjects: Subject[];
  userProfile: UserProfile;
  currentScreen: Screen;
  onboardingComplete: boolean;
  selectedExamId: string | null;
  selectedSubjectId: string | null;
  selectedNoteId: string | null;
  theme: 'dark' | 'light';
  notificationsEnabled: boolean;
  
  setScreen: (screen: Screen) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addSubject: (name: string, color: string, emoji: string) => void;
  deleteSubject: (id: string) => void;
  addExam: (exam: Omit<Exam, 'id' | 'completed' | 'checklist'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'reminderNotified'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  completeOnboarding: () => void;
  setSelectedExam: (id: string | null) => void;
  setSelectedSubject: (id: string | null) => void;
  setSelectedNote: (id: string | null) => void;
  clearAllData: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  goBack: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('ef_exams');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Migration: Ensure all exams have a checklist array
      return parsed.map((exam: any) => ({
        ...exam,
        checklist: exam.checklist || []
      }));
    } catch (e) {
      return [];
    }
  });
  
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('ef_notes');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Migration: Ensure all notes have an attachments array
      return parsed.map((note: any) => ({
        ...note,
        attachments: note.attachments || []
      }));
    } catch (e) {
      return [];
    }
  });
  
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('ef_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ef_profile');
    return saved ? JSON.parse(saved) : { name: '' };
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [history, setHistory] = useState<Screen[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem('ef_onboarding') === 'true';
  });
  
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ef_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('ef_notifications');
    return saved !== 'false'; // Default to true
  });

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('ef_theme', newTheme);
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem('ef_notifications', enabled.toString());
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ef_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('ef_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ef_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('ef_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('ef_onboarding', onboardingComplete.toString());
  }, [onboardingComplete]);

  const setScreen = (screen: Screen) => {
    if (screen !== currentScreen) {
      setHistory(prev => [...prev, currentScreen]);
      setCurrentScreen(screen);
    }
  };

  const goBack = () => {
    setHistory(prev => {
      const newHistory = [...prev];
      const last = newHistory.pop();
      if (last) {
        setCurrentScreen(last);
      } else {
        setCurrentScreen('dashboard'); // fallback
      }
      return newHistory;
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const addSubject = (name: string, color: string, emoji: string) => {
    const newSubject: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color,
      emoji
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setExams(prev => prev.filter(e => e.subjectId !== id));
    setNotes(prev => prev.filter(n => n.subjectId !== id));
  };

  const addExam = (examData: Omit<Exam, 'id' | 'completed' | 'checklist'>) => {
    const newExam: Exam = {
      ...examData,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      checklist: [],
      reminderNotified: false,
    };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'reminderNotified'>) => {
    const newNote: Note = {
      ...noteData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      reminderNotified: false,
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const completeOnboarding = () => {
    setOnboardingComplete(true);
    setScreen('dashboard');
  };

  const setSelectedExam = (id: string | null) => setSelectedExamId(id);
  const setSelectedSubject = (id: string | null) => setSelectedSubjectId(id);
  const setSelectedNote = (id: string | null) => setSelectedNoteId(id);

  const clearAllData = () => {
    localStorage.clear();
    setExams([]);
    setNotes([]);
    setSubjects(DEFAULT_SUBJECTS);
    setUserProfile({ name: '' });
    setOnboardingComplete(false);
    setCurrentScreen('splash');
    setTheme('dark');
    setNotificationsEnabled(true);
  };

  // Request notification permission
  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  const playNotificationSound = () => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 500]);
      }
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playPop = (timeOffset: number) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + timeOffset);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + timeOffset + 0.1);
        
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime + timeOffset);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + timeOffset + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(audioCtx.currentTime + timeOffset);
        oscillator.stop(audioCtx.currentTime + timeOffset + 0.1);
      };

      playPop(0);
      playPop(0.15);
    } catch (e) {
      console.error('Audio/Vibration not supported', e);
    }
  };

  // Simple reminder check
  useEffect(() => {
    if (!notificationsEnabled) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      
      // Check Note Reminders
      notes.forEach(note => {
        if (note.reminderAt && !note.reminderNotified) {
          const reminderTime = new Date(note.reminderAt);
          if (now >= reminderTime) {
            // Trigger Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              playNotificationSound();
              new Notification(`Study Reminder: ${note.title}`, {
                body: `Time to review your notes for ${subjects.find(s => s.id === note.subjectId)?.name || 'Subject'}`,
                icon: '/favicon.ico'
              });
            }
            
            setNotes(prev => prev.map(n => n.id === note.id ? { ...n, reminderNotified: true } : n));
          }
        }
      });

      // Check Exam Reminders
      exams.forEach(exam => {
        if (exam.reminderEnabled && !exam.completed && !exam.reminderNotified) {
          const examDate = new Date(`${exam.date}T${exam.time}`);
          let reminderTime = new Date(examDate);
          
          if (exam.reminderTime === '30m') reminderTime.setMinutes(reminderTime.getMinutes() - 30);
          else if (exam.reminderTime === '1h') reminderTime.setHours(reminderTime.getHours() - 1);
          else if (exam.reminderTime === '1d') reminderTime.setDate(reminderTime.getDate() - 1);

          if (now >= reminderTime) {
             if ('Notification' in window && Notification.permission === 'granted') {
              playNotificationSound();
              new Notification(`Upcoming Exam: ${subjects.find(s => s.id === exam.subjectId)?.name || 'Subject'}`, {
                body: `Your ${exam.type} starts at ${exam.time} in ${exam.room}`,
                icon: '/favicon.ico'
              });
            }
            setExams(prev => prev.map(e => e.id === exam.id ? { ...e, reminderNotified: true } : e));
          }
        }
      });
    }, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [notes, exams, subjects, notificationsEnabled]);

  return (
    <AppContext.Provider value={{
      exams, notes, subjects, userProfile, currentScreen, onboardingComplete, selectedExamId, selectedSubjectId, selectedNoteId, theme, notificationsEnabled,
      setScreen, updateProfile, addSubject, deleteSubject, addExam, updateExam, deleteExam, addNote, updateNote, deleteNote, completeOnboarding, setSelectedExam, setSelectedSubject, setSelectedNote, clearAllData, setTheme, setNotificationsEnabled, goBack
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
