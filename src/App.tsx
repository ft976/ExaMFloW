import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, Home, List, User, Bell, 
  ChevronRight, CheckCircle2, Clock, MapPin, 
  BookOpen, FileText, Image as ImageIcon, File,
  Trash2, Check, ArrowLeft, Search, Filter,
  MoreVertical, Share2, Edit3, X, AlertCircle,
  Sun, Moon
} from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
import { Logo } from './components/Logo';
import { Subject, Exam, Note, ExamType } from './types';
import { EXAM_TYPES, REMINDER_OPTIONS } from './constants';

// --- UI Components ---

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  disabled = false
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'ghost' | 'danger' | 'disabled',
  className?: string,
  onClick?: () => void,
  disabled?: boolean
}) => {
  const variants = {
    primary: 'bg-lime text-bg',
    ghost: 'bg-transparent border border-white/15 text-text',
    danger: 'bg-coral text-white',
    disabled: 'bg-surface2 text-dim opacity-40 cursor-not-allowed'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled || variant === 'disabled'}
      className={`h-14 px-6 rounded-input font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick, ...props }: { children: React.ReactNode, className?: string, onClick?: () => void, [key: string]: any }) => (
  <div 
    {...props}
    onClick={onClick}
    className={`bg-surface1 rounded-card p-4 shadow-card border border-white/5 ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
  >
    {children}
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-muted text-sm font-medium ml-1">{label}</label>}
    <input 
      {...props}
      className="h-[52px] bg-surface2 border border-transparent focus:border-lime rounded-input px-4 text-text outline-none transition-all placeholder:text-dim"
    />
  </div>
);

// --- Screens ---

const SplashScreen = () => {
  const { setScreen, onboardingComplete } = useApp();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen(onboardingComplete ? 'dashboard' : 'onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime/20 blur-[100px] rounded-full" />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 z-10"
      >
        <div className="w-20 h-20 bg-lime rounded-2xl flex items-center justify-center glow-lime">
          <Logo className="text-bg w-12 h-12" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl tracking-tight">ExamFlow</h1>
          <p className="text-muted mt-1">You Add It. We Show It. Always.</p>
        </div>
      </motion.div>
      
      <div className="absolute bottom-16 w-48 h-1 bg-surface2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-lime"
        />
      </div>
    </div>
  );
};

const OnboardingScreen = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const { completeOnboarding, updateProfile } = useApp();
  
  const slides = [
    {
      title: "Plan Your Success",
      desc: "Organize your exams, quizzes, and assignments in one beautiful place.",
      icon: <Calendar className="w-20 h-20 text-lime" />,
      color: "lime"
    },
    {
      title: "Track Every Detail",
      desc: "Never miss a room number or duration. Real-time countdowns keep you ready.",
      icon: <Clock className="w-20 h-20 text-sky" />,
      color: "sky"
    },
    {
      title: "Study Smarter",
      desc: "Create checklists and save subject-specific notes with reminders.",
      icon: <BookOpen className="w-20 h-20 text-violet" />,
      color: "violet"
    },
    {
      title: "What's your name?",
      desc: "We'll use this to personalize your experience.",
      icon: <User className="w-20 h-20 text-lime" />,
      color: "lime",
      isNameStep: true
    }
  ];

  const next = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      if (!name.trim()) return;
      updateProfile({ name });
      completeOnboarding();
    }
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="flex flex-col items-center gap-8 w-full"
        >
          <div className={`p-8 rounded-full bg-surface1 border border-white/5 shadow-card`}>
            {slides[step].icon}
          </div>
          <div className="w-full">
            <h2 className="text-3xl mb-4">{slides[step].title}</h2>
            <p className="text-muted leading-relaxed max-w-[280px] mx-auto mb-8">
              {slides[step].desc}
            </p>
            
            {slides[step].isNameStep && (
              <div className="w-full max-w-[280px] mx-auto">
                <input 
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 bg-surface2 border border-transparent focus:border-lime rounded-input px-4 text-text outline-none transition-all text-center text-lg font-bold"
                  autoFocus
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="flex flex-col gap-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-lime' : 'w-2 bg-surface2'}`} 
            />
          ))}
        </div>
        <Button onClick={next} disabled={slides[step].isNameStep && !name.trim()}>
          {step === slides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface1 p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-card">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button className="flex-1 bg-coral text-white" onClick={onConfirm}>Yes, Delete</Button>
        </div>
      </div>
    </div>
  );
};

const DashboardScreen = () => {
  const { exams, notes, setScreen, setSelectedExam, subjects, setSelectedSubject, userProfile, setSelectedNote } = useApp();
  
  const upcomingExams = exams
    .filter(e => !e.completed && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextExam = upcomingExams[0];
  const recentNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  
  const todayReminders = [
    ...exams.filter(e => e.reminderEnabled && !e.completed && e.date === new Date().toISOString().split('T')[0]),
    ...notes.filter(n => n.reminderAt && !n.reminderNotified && new Date(n.reminderAt).toDateString() === new Date().toDateString())
  ];

  return (
    <div className="h-full flex flex-col p-6 pb-24 overflow-y-auto">
      <header className="flex justify-between items-center mb-8 flex-shrink-0">
        <div>
          <h2 className="text-2xl">Hello, {userProfile.name || 'Student'}!</h2>
          <p className="text-muted text-sm">Ready for your exams?</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setScreen('reminders')}
            className="w-12 h-12 bg-surface2 rounded-full flex items-center justify-center border border-white/10 relative"
          >
            <Bell className="text-muted w-6 h-6" />
            {(exams.some(e => e.reminderEnabled && !e.completed) || notes.some(n => n.reminderAt && !n.reminderNotified)) && (
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-lime rounded-full border-2 border-surface2" />
            )}
          </button>
          <div className="w-12 h-12 bg-surface2 rounded-full flex items-center justify-center border border-white/10 overflow-hidden" onClick={() => setScreen('profile')}>
            {userProfile.pfp ? (
              <img src={userProfile.pfp} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="text-muted w-6 h-6" />
            )}
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 flex-shrink-0">
        <div className="bg-surface1 p-4 rounded-card border border-white/5 text-center">
          <p className="text-2xl font-bold text-lime">{exams.length}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-surface1 p-4 rounded-card border border-white/5 text-center">
          <p className="text-2xl font-bold text-green">{exams.filter(e => e.completed).length}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">Done</p>
        </div>
        <div className="bg-surface1 p-4 rounded-card border border-white/5 text-center">
          <p className="text-2xl font-bold text-sky">{upcomingExams.length}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">Upcoming</p>
        </div>
      </div>

      {/* Today's Reminders */}
      {todayReminders.length > 0 && (
        <section className="mb-8 flex-shrink-0">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gold" />
            Today's Reminders
          </h3>
          <div className="flex flex-col gap-3">
            {todayReminders.slice(0, 2).map((item: any, i) => (
              <Card key={i} className="flex items-center gap-4 py-3 border-l-4 border-l-gold">
                <div className="flex-1">
                  <h5 className="text-sm font-bold">{(item as Note).title || subjects.find(s => s.id === item.subjectId)?.name}</h5>
                  <p className="text-[10px] text-muted">
                    {item.reminderAt ? new Date(item.reminderAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `Exam at ${item.time}`}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-dim" />
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Subjects Grid */}
      <section className="mb-8 flex-shrink-0">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg">My Subjects</h3>
          <button className="text-lime text-xs font-bold" onClick={() => setScreen('add-subject')}>+ Add New</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {subjects.map(subject => (
            <Card 
              key={subject.id} 
              className="flex flex-col items-center justify-center py-6 text-center gap-2"
              onClick={() => {
                setSelectedSubject(subject.id);
                setScreen('subject-detail');
              }}
            >
              <div className="text-3xl">{subject.emoji}</div>
              <h4 className="text-sm font-bold">{subject.name}</h4>
              <p className="text-[10px] text-muted">
                {exams.filter(e => e.subjectId === subject.id).length} Exams • {notes.filter(n => n.subjectId === subject.id).length} Notes
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Next Exam */}
      <section className="mb-8 flex-shrink-0">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg">Upcoming Exam</h3>
          <button className="text-lime text-xs font-bold" onClick={() => setScreen('exam-list')}>View All</button>
        </div>
        
        {nextExam ? (
          <Card 
            className="relative overflow-hidden" 
            onClick={() => {
              setSelectedExam(nextExam.id);
              setScreen('exam-detail');
            }}
          >
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: nextExam.color }} />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-muted mb-2 inline-block">
                  {nextExam.type}
                </span>
                <h4 className="text-xl mb-1">{subjects.find(s => s.id === nextExam.subjectId)?.name || 'Subject'}</h4>
                <div className="flex items-center gap-4 text-muted text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(nextExam.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {nextExam.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lime font-bold text-lg">
                  {Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
                </div>
                <p className="text-[10px] text-muted uppercase">Left</p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-surface1/50 border border-dashed border-white/10 rounded-card p-8 text-center">
            <p className="text-muted text-sm mb-4">No exams scheduled yet.</p>
            <Button variant="ghost" className="h-10 text-xs" onClick={() => setScreen('add-exam')}>
              <Plus className="w-4 h-4" /> Add First Exam
            </Button>
          </div>
        )}
      </section>

      {/* Recent Notes */}
      <section className="mb-8 flex-shrink-0">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg">Recent Notes</h3>
          <button className="text-lime text-xs font-bold" onClick={() => setScreen('notes')}>View All</button>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentNotes.length > 0 ? recentNotes.map(note => (
            <Card 
              key={note.id} 
              className="flex items-center gap-4 py-3"
              onClick={() => {
                setSelectedNote(note.id);
                setScreen('note-detail');
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center">
                <FileText className="w-5 h-5 text-sky" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold truncate max-w-[180px]">{note.title}</h5>
                <p className="text-[10px] text-muted">
                  {subjects.find(s => s.id === note.subjectId)?.name} • {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-dim" />
            </Card>
          )) : (
            <div className="bg-surface1/50 border border-dashed border-white/10 rounded-card p-6 text-center">
              <p className="text-muted text-xs">No notes yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const AddSubjectScreen = () => {
  const { addSubject, setScreen, goBack } = useApp();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📚');
  const [color, setColor] = useState('#7B61FF');

  const colors = ['#7B61FF', '#57C8FF', '#FF6B57', '#FFD257', '#43E97B', '#FF57C8', '#57FFD8', '#FF9A57'];
  const emojis = ['📚', '📐', '🔬', '📖', '🏛️', '⚡', '🧪', '🌍', '💻', '🎨', '🎵', '⚽'];

  const handleSave = () => {
    if (!name.trim()) return;
    addSubject(name, color, emoji);
    goBack();
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      <header className="p-6 flex items-center gap-4">
        <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl">New Subject</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 pb-32">
        <div className="flex flex-col items-center gap-4 py-8">
          <div 
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg transition-all"
            style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
          >
            {emoji}
          </div>
          <p className="text-muted text-sm">Preview</p>
        </div>

        <Input 
          label="Subject Name" 
          placeholder="e.g. Advanced Calculus"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />

        <div className="flex flex-col gap-3">
          <label className="text-muted text-sm font-medium ml-1">Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {emojis.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`aspect-square rounded-lg flex items-center justify-center text-xl border transition-all ${
                  emoji === e ? 'bg-surface2 border-lime' : 'bg-surface1 border-white/5'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-muted text-sm font-medium ml-1">Color Theme</label>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full flex-shrink-0 border-4 transition-all ${
                  color === c ? 'border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-bg/80 backdrop-blur-md fixed bottom-0 left-0 right-0 border-t border-white/5">
        <Button className="w-full" onClick={handleSave}>Create Subject</Button>
      </div>
    </div>
  );
};

const SubjectDetailScreen = () => {
  const { subjects, exams, notes, selectedSubjectId, setScreen, goBack, setSelectedExam, setSelectedNote, deleteSubject } = useApp();
  const subject = subjects.find(s => s.id === selectedSubjectId);
  const [activeTab, setActiveTab] = useState<'notes' | 'exams'>('notes');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!subject) return null;

  const subjectExams = exams.filter(e => e.subjectId === subject.id);
  const subjectNotes = notes.filter(n => n.subjectId === subject.id);

  const handleDelete = () => {
    deleteSubject(subject.id);
    goBack();
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      <ConfirmModal 
        isOpen={showDeleteConfirm} 
        title="Delete Subject" 
        message="Are you sure you want to delete this subject? All related exams and notes will also be deleted." 
        onConfirm={handleDelete} 
        onCancel={() => setShowDeleteConfirm(false)} 
      />
      <header className="p-6 flex items-center justify-between gap-4" style={{ backgroundColor: `${subject.color}20` }}>
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.emoji}</span>
            <h2 className="text-2xl">{subject.name}</h2>
          </div>
        </div>
        <button onClick={() => setShowDeleteConfirm(true)} className="p-2 bg-surface1 rounded-lg text-coral">
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      <div className="flex p-6 gap-4">
        <button 
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-3 rounded-chip font-bold transition-all ${activeTab === 'notes' ? 'bg-lime text-bg' : 'bg-surface1 text-muted'}`}
        >
          Notes ({subjectNotes.length})
        </button>
        <button 
          onClick={() => setActiveTab('exams')}
          className={`flex-1 py-3 rounded-chip font-bold transition-all ${activeTab === 'exams' ? 'bg-lime text-bg' : 'bg-surface1 text-muted'}`}
        >
          Exams ({subjectExams.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 flex flex-col gap-4">
        {activeTab === 'notes' ? (
          subjectNotes.length > 0 ? subjectNotes.map(note => (
            <Card 
              key={note.id} 
              className="flex flex-col gap-3"
              onClick={() => {
                setSelectedNote(note.id);
                setScreen('note-detail');
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-sky" />
                </div>
                <div className="flex-1">
                  <h5 className="text-base font-bold">{note.title}</h5>
                  <p className="text-xs text-muted">{new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-muted line-clamp-2">{note.content}</p>
              {(note.attachments?.length || 0) > 0 && (
                <div className="flex gap-2 mt-1 overflow-x-auto no-scrollbar">
                  {note.attachments?.map(att => (
                    <div key={att.id} className="flex-shrink-0 w-12 h-12 rounded bg-surface2 border border-white/5 flex items-center justify-center overflow-hidden">
                      {att.type === 'image' ? (
                        <img src={att.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <File className="w-5 h-5 text-orange" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )) : (
            <div className="text-center py-20 opacity-50">
              <BookOpen className="w-16 h-16 mb-4 mx-auto text-dim" />
              <p className="text-muted">No notes for this subject yet.</p>
              <Button variant="ghost" className="mt-4 h-10 text-xs" onClick={() => setScreen('add-note')}>Add Note</Button>
            </div>
          )
        ) : (
          subjectExams.length > 0 ? subjectExams.map(exam => (
            <Card 
              key={exam.id} 
              className="flex items-center gap-4"
              onClick={() => {
                setSelectedExam(exam.id);
                setScreen('exam-detail');
              }}
            >
              <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center" style={{ backgroundColor: `${exam.color}20`, border: `1px solid ${exam.color}40` }}>
                <span className="text-[10px] font-bold uppercase" style={{ color: exam.color }}>{new Date(exam.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-lg font-bold" style={{ color: exam.color }}>{new Date(exam.date).getDate()}</span>
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold">{exam.type}</h5>
                <p className="text-[10px] text-muted">{exam.time} • {exam.room || 'No Room'}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-dim" />
            </Card>
          )) : (
            <div className="text-center py-20 opacity-50">
              <Calendar className="w-16 h-16 mb-4 mx-auto text-dim" />
              <p className="text-muted">No exams for this subject yet.</p>
              <Button variant="ghost" className="mt-4 h-10 text-xs" onClick={() => setScreen('add-exam')}>Add Exam</Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const AddExamScreen = ({ isEditing }: { isEditing?: boolean }) => {
  const { subjects, addExam, updateExam, exams, selectedExamId, setScreen, goBack } = useApp();
  
  const existingExam = isEditing ? exams.find(e => e.id === selectedExamId) : null;
  
  const [formData, setFormData] = useState({
    subjectId: existingExam?.subjectId || subjects[0]?.id || '',
    type: existingExam?.type || 'Quiz' as ExamType,
    date: existingExam?.date || '',
    time: existingExam?.time || '',
    duration: existingExam?.duration || 60,
    room: existingExam?.room || '',
    color: existingExam?.color || subjects[0]?.color || '#7B61FF',
    notes: existingExam?.notes || '',
    reminderEnabled: existingExam?.reminderEnabled || false,
    reminderTime: existingExam?.reminderTime || '30m'
  });

  const handleSave = () => {
    if (!formData.date || !formData.time) return;
    
    if (isEditing && selectedExamId) {
      updateExam(selectedExamId, formData);
      goBack();
    } else {
      addExam(formData);
      goBack();
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      <header className="p-6 flex items-center gap-4 flex-shrink-0">
        <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl">{isEditing ? 'Edit Exam' : 'Add New Exam'}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-32">
        <div className="flex flex-col gap-2">
          <label className="text-muted text-sm font-medium ml-1">Subject</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setFormData({ ...formData, subjectId: s.id, color: s.color })}
                className={`flex-shrink-0 px-4 py-2 rounded-chip border transition-all ${
                  formData.subjectId === s.id 
                    ? 'bg-lime text-bg border-lime' 
                    : 'bg-surface1 border-white/10 text-muted'
                }`}
              >
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-muted text-sm font-medium ml-1">Exam Type</label>
          <div className="grid grid-cols-2 gap-2">
            {EXAM_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFormData({ ...formData, type: t as ExamType })}
                className={`py-3 rounded-input border transition-all text-sm font-bold ${
                  formData.type === t 
                    ? 'bg-surface2 border-lime text-lime' 
                    : 'bg-surface1 border-white/5 text-muted'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Date" 
            type="date" 
            value={formData.date}
            onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input 
            label="Time" 
            type="time" 
            value={formData.time}
            onChange={(e: any) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-muted text-sm font-medium">Duration</label>
            <span className="text-lime text-sm font-bold">{formData.duration} min</span>
          </div>
          <input 
            type="range" 
            min="30" 
            max="240" 
            step="15"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="accent-lime"
          />
        </div>

        <Input 
          label="Room / Location" 
          placeholder="e.g. Hall A, Room 302"
          value={formData.room}
          onChange={(e: any) => setFormData({ ...formData, room: e.target.value })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-muted text-sm font-medium ml-1">Notes</label>
          <textarea 
            className="bg-surface2 border border-transparent focus:border-lime rounded-input p-4 text-text outline-none transition-all placeholder:text-dim min-h-[100px] resize-none"
            placeholder="Important topics, things to bring..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gold" />
            <div>
              <p className="text-sm font-bold">Set Reminder</p>
              <p className="text-[10px] text-muted">Get notified before exam</p>
            </div>
          </div>
          <button 
            onClick={() => setFormData({ ...formData, reminderEnabled: !formData.reminderEnabled })}
            className={`w-12 h-6 rounded-full relative transition-all ${formData.reminderEnabled ? 'bg-lime' : 'bg-surface2'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.reminderEnabled ? 'left-7' : 'left-1'}`} />
          </button>
        </Card>

        {formData.reminderEnabled && (
          <div className="flex flex-col gap-2">
            <label className="text-muted text-sm font-medium ml-1">Reminder Time</label>
            <select 
              className="h-[52px] bg-surface2 border border-transparent focus:border-lime rounded-input px-4 text-text outline-none"
              value={formData.reminderTime}
              onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
            >
              {REMINDER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="p-6 bg-bg/80 backdrop-blur-md fixed bottom-0 left-0 right-0 border-t border-white/5">
        <Button className="w-full" onClick={handleSave}>Save Exam</Button>
      </div>
    </div>
  );
};

const NotesScreen = () => {
  const { notes, subjects, setScreen, setSelectedSubject, selectedSubjectId, setSelectedNote } = useApp();
  
  const filteredNotes = selectedSubjectId 
    ? notes.filter(n => n.subjectId === selectedSubjectId)
    : notes;

  return (
    <div className="h-full flex flex-col p-6 pb-24 overflow-y-auto">
      <header className="flex justify-between items-center mb-8 flex-shrink-0">
        <h2 className="text-2xl">Study Notes</h2>
        <button onClick={() => setScreen('add-note')} className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center glow-lime">
          <Plus className="text-bg w-6 h-6" />
        </button>
      </header>

      {/* Subject Filter */}
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar flex-shrink-0">
        <button
          onClick={() => setSelectedSubject(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-chip border transition-all ${
            selectedSubjectId === null 
              ? 'bg-lime text-bg border-lime' 
              : 'bg-surface1 border-white/10 text-muted'
          }`}
        >
          All
        </button>
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-chip border transition-all ${
              selectedSubjectId === s.id 
                ? 'bg-lime text-bg border-lime' 
                : 'bg-surface1 border-white/10 text-muted'
            }`}
          >
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredNotes.length > 0 ? filteredNotes.map(note => (
          <Card 
            key={note.id} 
            className="flex flex-col gap-3"
            onClick={() => {
              setSelectedNote(note.id);
              setScreen('note-detail');
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center">
                <FileText className="w-5 h-5 text-sky" />
              </div>
              <div className="flex-1">
                <h5 className="text-base font-bold">{note.title}</h5>
                <p className="text-xs text-muted">{subjects.find(s => s.id === note.subjectId)?.name}</p>
              </div>
              <button className="p-2 text-muted">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted line-clamp-2">{note.content}</p>
            {(note.attachments?.length || 0) > 0 && (
              <div className="flex gap-2 mt-1 overflow-x-auto no-scrollbar">
                {note.attachments?.map(att => (
                  <div key={att.id} className="flex-shrink-0 w-12 h-12 rounded bg-surface2 border border-white/5 flex items-center justify-center overflow-hidden">
                    {att.type === 'image' ? (
                      <img src={att.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <File className="w-5 h-5 text-orange" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-[10px] text-dim">{new Date(note.createdAt).toLocaleDateString()}</span>
              {note.reminderAt && (
                <div className="flex items-center gap-1 text-gold text-[10px] font-bold">
                  <Bell className="w-3 h-3" />
                  {new Date(note.reminderAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </Card>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <BookOpen className="w-16 h-16 mb-4 text-dim" />
            <p className="text-muted">No notes found for this subject.</p>
            <Button variant="ghost" className="mt-4 h-10 text-xs" onClick={() => setScreen('add-note')}>
              Add Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const AddNoteScreen = ({ isEditing = false }: { isEditing?: boolean }) => {
  const { subjects, addNote, updateNote, notes, selectedNoteId, setScreen, goBack } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  const existingNote = isEditing ? notes.find(n => n.id === selectedNoteId) : null;
  
  const [formData, setFormData] = useState({
    subjectId: existingNote?.subjectId || subjects[0]?.id || '',
    title: existingNote?.title || '',
    content: existingNote?.content || '',
    attachments: existingNote?.attachments || [] as { id: string, type: 'image' | 'pdf', url: string, name: string }[],
    reminderAt: existingNote?.reminderAt || ''
  });

  const [uploadType, setUploadType] = useState<'image' | 'pdf'>('image');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach(file => {
      // Check file size (limit to 2MB for localStorage safety)
      if (file.size > 2 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Please select a file smaller than 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          type: file.type.startsWith('image/') ? 'image' : 'pdf' as 'image' | 'pdf',
          url: reader.result as string,
          name: file.name
        };
        setFormData(prev => ({ 
          ...prev, 
          attachments: [...prev.attachments, newAttachment] 
        }));
        setError(null);
      };
      reader.onerror = () => {
        setError(`Failed to read file ${file.name}. Please try again.`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      setError('Please fill in both title and content.');
      return;
    }
    
    if (isEditing && existingNote) {
      updateNote(existingNote.id, formData);
      goBack();
    } else {
      addNote(formData);
      goBack();
    }
  };

  const removeAttachment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== id)
    }));
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      <header className="p-6 flex items-center gap-4">
        <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl">{isEditing ? 'Edit Note' : 'Create Note'}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-32">
        {error && (
          <div className="bg-coral/10 border border-coral/20 text-coral p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-muted text-sm font-medium ml-1">Subject</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setFormData({ ...formData, subjectId: s.id })}
                className={`flex-shrink-0 px-4 py-2 rounded-chip border transition-all ${
                  formData.subjectId === s.id 
                    ? 'bg-lime text-bg border-lime' 
                    : 'bg-surface1 border-white/10 text-muted'
                }`}
              >
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </div>

        <Input 
          label="Title" 
          placeholder="e.g. Calculus Chapter 1"
          value={formData.title}
          onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-muted text-sm font-medium ml-1">Content</label>
          <textarea 
            className="bg-surface2 border border-transparent focus:border-lime rounded-input p-4 text-text outline-none transition-all placeholder:text-dim min-h-[150px] resize-none"
            placeholder="Write your notes here..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="text-muted text-sm font-medium ml-1">Attachments ({formData.attachments.length})</label>
            <div className="flex gap-2">
              <button 
                onClick={() => { setUploadType('image'); fileInputRef.current?.click(); }}
                className="p-2 bg-surface1 rounded-lg text-pink hover:bg-pink/10 transition-all"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { setUploadType('pdf'); fileInputRef.current?.click(); }}
                className="p-2 bg-surface1 rounded-lg text-orange hover:bg-orange/10 transition-all"
              >
                <File className="w-5 h-5" />
              </button>
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple
            accept={uploadType === 'image' ? 'image/*' : 'application/pdf'}
            onChange={handleFileChange}
          />

          <div className="grid grid-cols-2 gap-3">
            {formData.attachments.map(att => (
              <div key={att.id} className="relative group rounded-card overflow-hidden border border-white/5 bg-surface1 aspect-video flex items-center justify-center">
                {att.type === 'image' ? (
                  <img src={att.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <File className="w-8 h-8 text-orange" />
                    <span className="text-[10px] text-muted truncate max-w-[80px]">{att.name}</span>
                  </div>
                )}
                <button 
                  onClick={() => removeAttachment(att.id)}
                  className="absolute top-2 right-2 p-1.5 bg-coral/80 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => { setUploadType('image'); fileInputRef.current?.click(); }}
              className="border-2 border-dashed border-white/10 rounded-card aspect-video flex flex-col items-center justify-center text-dim hover:border-lime/50 hover:text-lime transition-all"
            >
              <Plus className="w-6 h-6" />
              <span className="text-[10px] uppercase font-bold mt-1">Add More</span>
            </button>
          </div>
        </div>

        <Input 
          label="Set Reminder (Optional)" 
          type="datetime-local" 
          value={formData.reminderAt}
          onChange={(e: any) => setFormData({ ...formData, reminderAt: e.target.value })}
        />
      </div>

      <div className="p-6 bg-bg/80 backdrop-blur-md fixed bottom-0 left-0 right-0 border-t border-white/5">
        <Button className="w-full" onClick={handleSave}>Save Note</Button>
      </div>
    </div>
  );
};


const CalendarScreen = () => {
  const { exams, subjects, setScreen, setSelectedExam } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Simple calendar logic
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getExamsForDate = (day: number) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return exams.filter(e => e.date === dateStr);
  };

  return (
    <div className="h-full flex flex-col p-6 pb-24 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl">Calendar</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
            className="p-2 bg-surface1 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
            className="p-2 bg-surface1 rounded-lg rotate-180"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="bg-surface1 rounded-card p-4 border border-white/5 mb-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-dim uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {padding.map(p => <div key={`p-${p}`} />)}
          {days.map(d => {
            const dateExams = getExamsForDate(d);
            const isToday = d === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth();
            return (
              <div 
                key={d} 
                className={`aspect-square flex flex-col items-center justify-center rounded-lg relative ${isToday ? 'bg-lime/10 border border-lime/20' : ''}`}
              >
                <span className={`text-sm ${isToday ? 'text-lime font-bold' : 'text-text'}`}>{d}</span>
                <div className="flex gap-0.5 mt-1">
                  {dateExams.slice(0, 3).map(e => (
                    <div key={e.id} className="w-1 h-1 rounded-full" style={{ backgroundColor: e.color }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <section>
        <h3 className="text-lg mb-4">Schedule</h3>
        <div className="flex flex-col gap-3">
          {exams.filter(e => new Date(e.date).getMonth() === selectedDate.getMonth()).length > 0 ? (
            exams
              .filter(e => new Date(e.date).getMonth() === selectedDate.getMonth())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(exam => (
                <Card 
                  key={exam.id} 
                  className="flex items-center gap-4"
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setScreen('exam-detail');
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center" style={{ backgroundColor: `${exam.color}20`, border: `1px solid ${exam.color}40` }}>
                    <span className="text-[10px] font-bold uppercase" style={{ color: exam.color }}>{new Date(exam.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-bold" style={{ color: exam.color }}>{new Date(exam.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold">{subjects.find(s => s.id === exam.subjectId)?.name}</h5>
                    <p className="text-[10px] text-muted">{exam.type} • {exam.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dim" />
                </Card>
              ))
          ) : (
            <div className="text-center py-10 opacity-50">
              <p className="text-muted text-sm">No exams this month.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ExamListScreen = () => {
  const { exams, subjects, setScreen, setSelectedExam, deleteExam, updateExam } = useApp();
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');

  const filteredExams = exams.filter(e => {
    if (filter === 'Upcoming') return !e.completed && new Date(e.date) >= new Date();
    if (filter === 'Past') return e.completed || new Date(e.date) < new Date();
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-full flex flex-col p-6 pb-24 overflow-y-auto">
      <header className="flex justify-between items-center mb-8 flex-shrink-0">
        <h2 className="text-2xl">All Exams</h2>
        <button onClick={() => setScreen('add-exam')} className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center glow-lime">
          <Plus className="text-bg w-6 h-6" />
        </button>
      </header>

      <div className="flex gap-2 mb-6 flex-shrink-0">
        {['All', 'Upcoming', 'Past'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`flex-1 py-2 rounded-chip border text-xs font-bold transition-all ${
              filter === f 
                ? 'bg-lime text-bg border-lime' 
                : 'bg-surface1 border-white/10 text-muted'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredExams.length > 0 ? filteredExams.map(exam => (
          <Card 
            key={exam.id} 
            className="relative overflow-hidden"
            onClick={() => {
              setSelectedExam(exam.id);
              setScreen('exam-detail');
            }}
          >
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: exam.color }} />
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-muted">
                    {exam.type}
                  </span>
                  {exam.completed && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-green/10 text-green">
                      Completed
                    </span>
                  )}
                </div>
                <h4 className="text-lg mb-1">{subjects.find(s => s.id === exam.subjectId)?.name}</h4>
                <div className="flex items-center gap-4 text-muted text-[10px]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(exam.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {exam.time}
                  </div>
                  {exam.room && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exam.room}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    updateExam(exam.id, { completed: !exam.completed });
                  }}
                  className={`p-2 rounded-lg ${exam.completed ? 'bg-green/20 text-green' : 'bg-surface2 text-dim'}`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this exam?')) deleteExam(exam.id);
                  }}
                  className="p-2 rounded-lg bg-coral/10 text-coral"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <List className="w-16 h-16 mb-4 text-dim" />
            <p className="text-muted">No exams found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ExamDetailScreen = () => {
  const { exams, subjects, setScreen, goBack, selectedExamId, updateExam, deleteExam } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const exam = exams.find(e => e.id === selectedExamId);
  const subject = subjects.find(s => s.id === exam?.subjectId);

  if (!exam) return null;

  const examDate = new Date(exam.date);
  const isValidDate = !isNaN(examDate.getTime());
  const daysLeft = isValidDate ? Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const progress = (exam.checklist?.length || 0) > 0 
    ? ((exam.checklist?.filter(i => i.completed).length || 0) / (exam.checklist?.length || 1)) * 100 
    : 0;

  const handleDelete = () => {
    deleteExam(exam.id);
    goBack();
  };

  return (
    <div className="h-full flex flex-col bg-bg overflow-y-auto pb-32">
      <ConfirmModal 
        isOpen={showDeleteConfirm} 
        title="Delete Exam" 
        message="Are you sure you want to delete this exam?" 
        onConfirm={handleDelete} 
        onCancel={() => setShowDeleteConfirm(false)} 
      />
      <div className="h-64 relative flex flex-col justify-end p-6" style={{ backgroundColor: exam.color }}>
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <button onClick={goBack} className="p-2 bg-black/20 backdrop-blur-md rounded-lg text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 bg-black/20 backdrop-blur-md rounded-lg text-coral">
              <Trash2 className="w-6 h-6" />
            </button>
            <button onClick={() => setScreen('edit-exam')} className="p-2 bg-black/20 backdrop-blur-md rounded-lg text-white">
              <Edit3 className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="z-10 text-white">
          <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/20 backdrop-blur-md mb-2 inline-block">
            {exam.type}
          </span>
          <h2 className="text-4xl mb-2">{subject?.name}</h2>
          <p className="text-white/80 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" /> {exam.time} • {exam.duration} mins
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="p-6 flex flex-col gap-6 -mt-8 z-10">
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-center py-6 text-center">
            <div className="text-3xl font-bold text-lime mb-1">{daysLeft > 0 ? daysLeft : 0}</div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Days Left</p>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6 text-center">
            <div className="text-3xl font-bold text-sky mb-1">{Math.round(progress)}%</div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Study Progress</p>
          </Card>
        </div>

        <section>
          <h3 className="text-lg mb-4">Exam Info</h3>
          <div className="flex flex-col gap-3">
            <Card className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-xs text-muted">Date</p>
                <p className="text-sm font-bold">{isValidDate ? examDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date'}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="text-sm font-bold">{exam.room || 'Not specified'}</p>
              </div>
            </Card>
            {exam.notes && (
              <Card className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted" />
                  <p className="text-xs text-muted">Notes</p>
                </div>
                <p className="text-sm leading-relaxed">{exam.notes}</p>
              </Card>
            )}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg">Study Checklist</h3>
            <button onClick={() => setScreen('checklist')} className="text-lime text-xs font-bold">Manage</button>
          </div>
          <Card className="flex flex-col gap-4">
            <div className="w-full h-2 bg-surface2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-lime"
              />
            </div>
            <div className="flex flex-col gap-2">
              {exam.checklist?.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${item.completed ? 'bg-lime border-lime' : 'border-white/20'}`}>
                    {item.completed && <Check className="w-3 h-3 text-bg" />}
                  </div>
                  <span className={`text-sm ${item.completed ? 'text-dim line-through' : 'text-text'}`}>{item.text}</span>
                </div>
              ))}
              {(exam.checklist?.length || 0) > 3 && (
                <p className="text-xs text-muted mt-1">+{(exam.checklist?.length || 0) - 3} more topics</p>
              )}
              {(exam.checklist?.length || 0) === 0 && (
                <p className="text-sm text-muted text-center py-2">No topics added yet.</p>
              )}
            </div>
          </Card>
        </section>
      </div>

      <div className="p-6 bg-bg/80 backdrop-blur-md fixed bottom-0 left-0 right-0 border-t border-white/5 flex gap-4">
        <Button 
          variant={exam.completed ? 'ghost' : 'primary'} 
          className="flex-1"
          onClick={() => updateExam(exam.id, { completed: !exam.completed })}
        >
          {exam.completed ? 'Mark Incomplete' : 'Mark as Completed'}
        </Button>
      </div>
    </div>
  );
};

const ChecklistScreen = () => {
  const { exams, setScreen, selectedExamId, updateExam, goBack } = useApp();
  const [newItem, setNewItem] = useState('');
  const exam = exams.find(e => e.id === selectedExamId);

  if (!exam) return null;

  const addItem = () => {
    if (!newItem.trim()) return;
    const item = { id: Math.random().toString(36).substr(2, 9), text: newItem, completed: false };
    updateExam(exam.id, { checklist: [...(exam.checklist || []), item] });
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    const newChecklist = (exam.checklist || []).map(i => i.id === id ? { ...i, completed: !i.completed } : i);
    updateExam(exam.id, { checklist: newChecklist });
  };

  const removeItem = (id: string) => {
    const newChecklist = (exam.checklist || []).filter(i => i.id !== id);
    updateExam(exam.id, { checklist: newChecklist });
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      <header className="p-6 flex items-center gap-4">
        <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl">Study Checklist</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 pb-32">
        <div className="flex gap-2">
          <input 
            className="flex-1 h-[52px] bg-surface2 border border-transparent focus:border-lime rounded-input px-4 text-text outline-none transition-all placeholder:text-dim"
            placeholder="Add topic to study..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem} className="w-[52px] h-[52px] bg-lime rounded-input flex items-center justify-center text-bg">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {exam.checklist?.map(item => (
            <Card key={item.id} className="flex items-center gap-4 py-3">
              <button 
                onClick={() => toggleItem(item.id)}
                className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${item.completed ? 'bg-lime border-lime' : 'border-white/20'}`}
              >
                {item.completed && <Check className="w-4 h-4 text-bg" />}
              </button>
              <span className={`flex-1 text-sm ${item.completed ? 'text-dim line-through' : 'text-text'}`}>{item.text}</span>
              <button onClick={() => removeItem(item.id)} className="p-1 text-coral/50 hover:text-coral">
                <X className="w-4 h-4" />
              </button>
            </Card>
          ))}
          {(exam.checklist?.length || 0) === 0 && (
            <div className="text-center py-20 opacity-50">
              <CheckCircle2 className="w-16 h-16 mb-4 mx-auto text-dim" />
              <p className="text-muted">No topics yet. Start adding your study plan!</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-bg/80 backdrop-blur-md fixed bottom-0 left-0 right-0 border-t border-white/5">
        <Button className="w-full" onClick={goBack}>Done</Button>
      </div>
    </div>
  );
};

const RemindersScreen = () => {
  const { exams, notes, subjects, setScreen, goBack } = useApp();
  
  const examReminders = exams.filter(e => e.reminderEnabled && !e.completed);
  const noteReminders = notes.filter(n => n.reminderAt && !n.reminderNotified);

  return (
    <div className="h-full flex flex-col p-6 pb-24 overflow-y-auto">
      <header className="flex items-center gap-4 mb-8 flex-shrink-0">
        <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl flex-1">Reminders</h2>
        <Bell className="text-lime w-6 h-6" />
      </header>

      <section className="mb-8">
        <h3 className="text-lg mb-4">Exams</h3>
        <div className="flex flex-col gap-3">
          {examReminders.length > 0 ? examReminders.map(exam => (
            <Card key={exam.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center">
                <Bell className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold">{subjects.find(s => s.id === exam.subjectId)?.name}</h5>
                <p className="text-[10px] text-muted">{exam.reminderTime} before exam • {exam.time}</p>
              </div>
            </Card>
          )) : (
            <p className="text-center py-4 text-muted text-xs">No active exam reminders.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg mb-4">Notes</h3>
        <div className="flex flex-col gap-3">
          {noteReminders.length > 0 ? noteReminders.map(note => (
            <Card key={note.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center">
                <FileText className="w-5 h-5 text-sky" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold">{note.title}</h5>
                <p className="text-[10px] text-muted">Scheduled for {new Date(note.reminderAt!).toLocaleString()}</p>
              </div>
            </Card>
          )) : (
            <p className="text-center py-4 text-muted text-xs">No active note reminders.</p>
          )}
        </div>
      </section>
    </div>
  );
};

const ProfileScreen = () => {
  const { exams, setScreen, userProfile, updateProfile, clearAllData, theme, setTheme, notificationsEnabled, setNotificationsEnabled, goBack } = useApp();
  const completedCount = exams.filter(e => e.completed).length;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);

  const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfile({ pfp: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const saveName = () => {
    if (!tempName.trim()) return;
    updateProfile({ name: tempName });
    setIsEditingName(false);
  };

  return (
    <div className="h-full flex flex-col p-6 pb-24 overflow-y-auto">
      <header className="flex items-center gap-4 mb-8 flex-shrink-0">
        <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl">Profile</h2>
      </header>

      <div className="flex flex-col items-center gap-4 mb-8">
        <div 
          className="w-24 h-24 bg-surface2 rounded-full flex items-center justify-center border-4 border-lime/20 relative overflow-hidden cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          {userProfile.pfp ? (
            <img src={userProfile.pfp} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-muted" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handlePfpChange} 
          />
        </div>
        
        <div className="text-center w-full px-4">
          {isEditingName ? (
            <div className="flex items-center gap-2 justify-center">
              <input 
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-surface2 border border-lime rounded-lg px-3 py-1 text-center text-xl font-bold outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
              />
              <button onClick={saveName} className="p-2 bg-lime rounded-lg text-bg">
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center">
              <h3 className="text-xl font-bold">{userProfile.name || 'Student User'}</h3>
              <button onClick={() => setIsEditingName(true)} className="p-1 text-muted hover:text-lime">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-muted text-sm mt-1">Ready to excel</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-2xl font-bold text-lime">{exams.length}</p>
          <p className="text-xs text-muted">Total Exams</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green">{completedCount}</p>
          <p className="text-xs text-muted">Completed</p>
        </Card>
      </div>

      <section className="flex flex-col gap-3">
        <h4 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Settings</h4>
        {[
          { icon: <Bell className="w-5 h-5" />, label: 'Notifications', value: notificationsEnabled ? 'On' : 'Off', action: 'notifications' },
          { icon: theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />, label: 'Theme', value: theme === 'dark' ? 'Dark' : 'Light', action: 'theme' },
          { icon: <Clock className="w-5 h-5" />, label: 'Time Format', value: '24h' },
          { icon: <Share2 className="w-5 h-5" />, label: 'Export Data', value: 'PDF' },
          { icon: <Trash2 className="w-5 h-5 text-coral" />, label: 'Clear All Data', danger: true, action: 'clear' },
        ].map((item, i) => (
          <Card 
            key={i} 
            className="flex items-center justify-between py-4"
            onClick={() => {
              if (item.action === 'clear') {
                if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                  clearAllData();
                }
              } else if (item.action === 'theme') {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              } else if (item.action === 'notifications') {
                setNotificationsEnabled(!notificationsEnabled);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center ${item.danger ? 'text-coral' : 'text-muted'}`}>
                {item.icon}
              </div>
              <span className={`text-sm font-bold ${item.danger ? 'text-coral' : ''}`}>{item.label}</span>
            </div>
            {item.value && <span className="text-xs text-dim">{item.value}</span>}
            {!item.value && <ChevronRight className="w-4 h-4 text-dim" />}
          </Card>
        ))}
      </section>
    </div>
  );
};

const PdfViewerScreen = () => {
  const { notes, selectedNoteId, setScreen, goBack } = useApp();
  const note = notes.find(n => n.id === selectedNoteId);
  const [activeAttachmentId, setActiveAttachmentId] = useState<string | null>(null);

  const pdfAttachments = note?.attachments?.filter(a => a.type === 'pdf') || [];
  const currentPdf = pdfAttachments.find(a => a.id === activeAttachmentId) || pdfAttachments[0];

  if (!note || pdfAttachments.length === 0) return null;

  return (
    <div className="h-full flex flex-col bg-bg">
      <header className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-lg font-bold truncate max-w-[180px]">{currentPdf?.name || note.title}</h2>
            <p className="text-[10px] text-muted uppercase tracking-widest">PDF Viewer</p>
          </div>
        </div>
        <button 
          onClick={() => {
            const link = document.createElement('a');
            link.href = currentPdf.url;
            link.download = currentPdf.name;
            link.click();
          }}
          className="p-2 bg-surface1 rounded-lg text-lime"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      {pdfAttachments.length > 1 && (
        <div className="flex gap-2 p-4 bg-surface1 overflow-x-auto no-scrollbar border-b border-white/5">
          {pdfAttachments.map(pdf => (
            <button
              key={pdf.id}
              onClick={() => setActiveAttachmentId(pdf.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                (currentPdf?.id === pdf.id) ? 'bg-lime text-bg border-lime' : 'bg-surface2 text-muted border-white/5'
              }`}
            >
              {pdf.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 bg-surface2 relative">
        {currentPdf && (
          <iframe 
            src={currentPdf.url} 
            className="w-full h-full border-none" 
            title={currentPdf.name}
          />
        )}
      </div>
    </div>
  );
};

const NoteDetailScreen = () => {
  const { notes, subjects, selectedNoteId, setScreen, goBack, setSelectedNote, deleteNote } = useApp();
  const note = notes.find(n => n.id === selectedNoteId);
  const subject = subjects.find(s => s.id === note?.subjectId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!note) return null;

  const handleDelete = () => {
    deleteNote(note.id);
    goBack();
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      <ConfirmModal 
        isOpen={showDeleteConfirm} 
        title="Delete Note" 
        message="Are you sure you want to delete this note?" 
        onConfirm={handleDelete} 
        onCancel={() => setShowDeleteConfirm(false)} 
      />
      <header className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 bg-surface1 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-lg font-bold truncate max-w-[180px]">{note.title}</h2>
            <p className="text-[10px] text-muted uppercase tracking-widest">{subject?.name || 'Note'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setScreen('edit-note')} className="p-2 bg-surface1 rounded-lg text-lime">
            <Edit3 className="w-5 h-5" />
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="p-2 bg-surface1 rounded-lg text-coral">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-32">
        <div className="bg-surface1 p-6 rounded-card border border-white/5">
          <p className="text-text leading-relaxed whitespace-pre-wrap">{note.content}</p>
        </div>

        {(note.attachments?.length || 0) > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider">Attachments ({note.attachments?.length || 0})</h3>
            <div className="grid grid-cols-1 gap-4">
              {note.attachments?.map(att => (
                <div key={att.id} className="rounded-card overflow-hidden border border-white/5 bg-surface1">
                  {att.type === 'image' ? (
                    <div className="flex flex-col">
                      <img src={att.url} alt="" className="w-full h-auto max-h-96 object-contain bg-black/20" />
                      <div className="p-3 flex justify-between items-center bg-surface2">
                        <span className="text-xs text-muted truncate max-w-[200px]">{att.name}</span>
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = att.url;
                            link.download = att.name;
                            link.click();
                          }}
                          className="text-lime text-xs font-bold"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center">
                          <File className="w-5 h-5 text-orange" />
                        </div>
                        <div>
                          <p className="text-sm font-bold truncate max-w-[150px]">{att.name}</p>
                          <p className="text-[10px] text-muted uppercase">PDF Document</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedNote(note.id);
                          setScreen('pdf-viewer');
                        }}
                        className="px-4 py-2 bg-lime/10 text-lime rounded-lg text-xs font-bold"
                      >
                        View PDF
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-dim text-xs">
            <Clock className="w-3 h-3" />
            Created on {new Date(note.createdAt).toLocaleString()}
          </div>
          {note.reminderAt && (
            <div className="flex items-center gap-2 text-gold text-xs font-bold">
              <Bell className="w-3 h-3" />
              Reminder set for {new Date(note.reminderAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const { currentScreen, setScreen } = useApp();
  
  const navItems = [
    { id: 'dashboard', icon: <Home className="w-6 h-6" />, label: 'Home' },
    { id: 'calendar', icon: <Calendar className="w-6 h-6" />, label: 'Calendar' },
    { id: 'add-exam', icon: <Plus className="w-8 h-8 text-bg" />, label: 'Add', fab: true },
    { id: 'notes', icon: <BookOpen className="w-6 h-6" />, label: 'Notes' },
    { id: 'exam-list', icon: <List className="w-6 h-6" />, label: 'Exams' },
  ];

  if (['splash', 'onboarding', 'add-exam', 'add-note', 'edit-note', 'add-subject', 'checklist', 'note-detail', 'pdf-viewer', 'subject-detail', 'exam-detail', 'edit-exam', 'reminders', 'profile'].includes(currentScreen)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-surface1 border-t border-white/5 flex items-center justify-around px-4 z-50">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id as any)}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            item.fab ? '-translate-y-6' : ''
          } ${currentScreen === item.id ? 'text-lime' : 'text-dim'}`}
        >
          {item.fab ? (
            <div className="w-14 h-14 bg-lime rounded-full flex items-center justify-center shadow-lg glow-lime">
              {item.icon}
            </div>
          ) : (
            <>
              {item.icon}
              <span className="text-[10px] font-bold">{item.label}</span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
};

// --- Main App ---

function AppContent() {
  const { currentScreen } = useApp();

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-bg relative overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          {currentScreen === 'splash' && <SplashScreen />}
          {currentScreen === 'onboarding' && <OnboardingScreen />}
          {currentScreen === 'dashboard' && <DashboardScreen />}
          {currentScreen === 'calendar' && <CalendarScreen />}
          {currentScreen === 'add-exam' && <AddExamScreen />}
          {currentScreen === 'edit-exam' && <AddExamScreen isEditing />}
          {currentScreen === 'exam-list' && <ExamListScreen />}
          {currentScreen === 'exam-detail' && <ExamDetailScreen />}
          {currentScreen === 'checklist' && <ChecklistScreen />}
          {currentScreen === 'notes' && <NotesScreen />}
          {currentScreen === 'add-note' && <AddNoteScreen />}
          {currentScreen === 'edit-note' && <AddNoteScreen isEditing />}
          {currentScreen === 'note-detail' && <NoteDetailScreen />}
          {currentScreen === 'add-subject' && <AddSubjectScreen />}
          {currentScreen === 'subject-detail' && <SubjectDetailScreen />}
          {currentScreen === 'reminders' && <RemindersScreen />}
          {currentScreen === 'profile' && <ProfileScreen />}
          {currentScreen === 'pdf-viewer' && <PdfViewerScreen />}
        </motion.div>
      </AnimatePresence>
      <Navigation />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
