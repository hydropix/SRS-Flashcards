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

/**
 * Statistiques enrichies d'un deck pour le système de 4 états
 * 
 * ÉTATS :
 * 1. 🔒 JAMAIS COMMENCÉ : unseen === total
 * 2. 📖 EN DÉCOUVERTE : hasBeenStarted && !isMastered && (due > 0 || discoveryCount > 0)
 * 3. ⏳ EN SOMMEIL : hasBeenStarted && due === 0 && !isMastered
 * 4. ✅ MAÎTRISÉ : isMastered (maturePercent >= 80)
 */
export interface EnhancedDeckStats {
  total: number;
  unseen: number;           // Jamais vues
  new: number;              // Vues mais is_new = 1
  learning: number;         // is_new = 0, repetitions < 3
  review: number;           // repetitions >= 3
  due: number;              // Disponibles maintenant
  sleeping: number;         // Vues, pas dues (learning + review non dues)
  maturePercent: number;    // % de cartes matures
  nextReviewDate: number | null;  // Timestamp de la prochaine révision
  hasBeenStarted: boolean;  // Au moins une carte vue
  isMastered: boolean;      // >80% des cartes vues sont matures
  discoveryCount: number;   // unseen + new (cartes à découvrir)
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

/**
 * Statistiques de temps d'étude personnalisées
 * Stocke le temps moyen par carte pour chaque deck et matière
 * en se basant sur l'historique réel de l'utilisateur
 */
export interface StudyTimeStats {
  deckId: string;
  subject: Subject;
  avgTimePerCardSeconds: number;  // Temps moyen par carte (en secondes)
  totalReviews: number;           // Nombre total de révisions pour ce deck
  lastUpdated: number;            // Timestamp de dernière mise à jour
}

/**
 * Paramètres de l'estimation de temps
 * Valeur par défaut et configuration
 */
export const DEFAULT_TIME_PER_CARD_SECONDS = 30;  // 30 secondes par défaut
export const MIN_TIME_PER_CARD_SECONDS = 10;      // Minimum 10 secondes
export const MAX_TIME_PER_CARD_SECONDS = 120;     // Maximum 2 minutes

/**
 * Seuils pour les niveaux de charge de travail (en minutes)
 * Utilisés par WorkloadIndicator
 */
export const WORKLOAD_THRESHOLDS = {
  light: { maxCards: 10, maxMinutes: 10 },
  moderate: { maxCards: 25, maxMinutes: 20 },
  heavy: { maxCards: 50, maxMinutes: 40 },
};
