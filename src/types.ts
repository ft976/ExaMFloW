export type ExamType = 'Quiz' | 'Midterm' | 'Final' | 'Assignment';

export interface Subject {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  subjectId: string;
  type: ExamType;
  date: string;
  time: string;
  duration: number; // in minutes
  room: string;
  color: string;
  notes: string;
  reminderEnabled: boolean;
  reminderTime: string; // e.g., "30m", "1h", "1d"
  reminderNotified?: boolean;
  completed: boolean;
  checklist: ChecklistItem[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'pdf';
  url: string; // base64
  name: string;
}

export interface Note {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  reminderAt?: string; // ISO string
  reminderNotified: boolean;
}

export interface UserProfile {
  name: string;
  pfp?: string; // base64
}

export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'dashboard' 
  | 'calendar' 
  | 'add-exam' 
  | 'edit-exam'
  | 'exam-list' 
  | 'exam-detail' 
  | 'checklist' 
  | 'notes' 
  | 'add-note' 
  | 'edit-note'
  | 'note-detail'
  | 'add-subject'
  | 'subject-detail'
  | 'reminders' 
  | 'profile'
  | 'pdf-viewer';
