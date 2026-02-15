// Types pour le système de flashcards DNB

export interface Card {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  explanation?: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReviewLog {
  id: string;
  cardId: string;
  rating: ReviewRating;
  timestamp: number;
  responseTimeMs?: number;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface SRSCardState {
  cardId: string;
  easeFactor: number;      // Facteur de facilité (défaut: 2.5)
  interval: number;        // Intervalle en jours
  repetitions: number;     // Nombre de répétitions réussies consécutives
  dueDate: number;         // Timestamp de la prochaine révision
  isNew: boolean;          // Carte jamais vue
}

export interface Deck {
  id: string;
  name: string;
  subject: Subject;
  description?: string;
  color: string;
  icon: string;
  isBuiltin: boolean;
  createdAt: number;
}

export type Subject = 
  | 'maths' 
  | 'francais' 
  | 'histoire-geo' 
  | 'svt' 
  | 'physique-chimie' 
  | 'technologie' 
  | 'anglais';

export interface StudySession {
  id: string;
  deckId?: string;
  startedAt: number;
  endedAt?: number;
  cardsReviewed: number;
  correctCount: number;
}

export interface DailyStats {
  date: string;           // YYYY-MM-DD
  cardsReviewed: number;
  newCardsLearned: number;
  studyTimeMinutes: number;
}

// Couleurs par matière
export const SUBJECT_COLORS: Record<Subject, string> = {
  'maths': '#4CAF50',
  'francais': '#2196F3',
  'histoire-geo': '#FF9800',
  'svt': '#8BC34A',
  'physique-chimie': '#9C27B0',
  'technologie': '#607D8B',
  'anglais': '#E91E63',
};

// Labels des matières
export const SUBJECT_LABELS: Record<Subject, string> = {
  'maths': 'Mathématiques',
  'francais': 'Français',
  'histoire-geo': 'Histoire-Géographie',
  'svt': 'SVT',
  'physique-chimie': 'Physique-Chimie',
  'technologie': 'Technologie',
  'anglais': 'Anglais',
};
