import { Subject } from './types';

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', color: '#7B61FF', emoji: '📐' },
  { id: 'science', name: 'Science', color: '#57C8FF', emoji: '🔬' },
  { id: 'english', name: 'English', color: '#FF6B57', emoji: '📖' },
  { id: 'history', name: 'History', color: '#FFD257', emoji: '🏛️' },
  { id: 'physics', name: 'Physics', color: '#43E97B', emoji: '⚡' },
  { id: 'chemistry', name: 'Chemistry', color: '#FF57C8', emoji: '🧪' },
  { id: 'geography', name: 'Geography', color: '#57FFD8', emoji: '🌍' },
  { id: 'computer', name: 'Computer', color: '#FF9A57', emoji: '💻' },
];

export const EXAM_TYPES = ['Quiz', 'Midterm', 'Final', 'Assignment'];

export const REMINDER_OPTIONS = [
  { label: '15 minutes before', value: '15m' },
  { label: '30 minutes before', value: '30m' },
  { label: '1 hour before', value: '1h' },
  { label: '2 hours before', value: '2h' },
  { label: '1 day before', value: '1d' },
];
