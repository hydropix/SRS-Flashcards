/**
 * Implémentation de l'algorithme SM-2 (SuperMemo 2)
 * Basé sur: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 * 
 * Principes:
 * - Ease Factor (EF): commence à 2.5, ajusté selon les performances
 * - Intervalle: démarre à 1 jour, puis 6 jours, puis croît exponentiellement
 * - Si réponse difficile: intervalle réinitialisé, EF diminué
 * - Si réponse facile: intervalle augmente, EF augmente légèrement
 */

import { ReviewRating, SRSCardState, DEFAULT_TIME_PER_CARD_SECONDS } from '../types';

// Configuration de l'algorithme
const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * Crée un nouvel état SRS pour une carte jamais vue
 */
export function createNewCardState(cardId: string): SRSCardState {
  return {
    cardId,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    dueDate: Date.now(),
    isNew: true,
  };
}

/**
 * Calcule le nouvel état SRS après une révision
 * @param currentState État actuel de la carte
 * @param rating Évaluation de la réponse (again/hard/good/easy)
 * @returns Nouvel état SRS
 */
export function calculateNextReview(
  currentState: SRSCardState,
  rating: ReviewRating
): SRSCardState {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  let { easeFactor, interval, repetitions } = currentState;
  
  // Convertir les ratings en qualité (0-5) pour SM-2
  // again = 0, hard = 3, good = 4, easy = 5
  const quality = ratingToQuality(rating);
  
  // Calcul du nouvel ease factor
  easeFactor = calculateEaseFactor(easeFactor, quality);
  
  if (rating === 'again') {
    // Échec: réinitialiser les répétitions, intervalle = 1 jour
    repetitions = 0;
    interval = 1;
  } else {
    // Succès: incrémenter les répétitions
    repetitions += 1;
    
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      // Intervalle = intervalle précédent * ease factor
      interval = Math.round(interval * easeFactor);
    }
    
    // Ajustements spécifiques au rating
    if (rating === 'hard') {
      interval = Math.max(1, Math.round(interval * 1.2));
    } else if (rating === 'easy' && repetitions > 2) {
      interval = Math.round(interval * 1.3);
    }
  }
  
  // Calcul de la date de prochaine révision
  const dueDate = now + (interval * oneDay);
  
  return {
    cardId: currentState.cardId,
    easeFactor,
    interval,
    repetitions,
    dueDate,
    isNew: false,
  };
}

/**
 * Convertit un rating en qualité SM-2 (0-5)
 */
function ratingToQuality(rating: ReviewRating): number {
  switch (rating) {
    case 'again': return 0;
    case 'hard': return 3;
    case 'good': return 4;
    case 'easy': return 5;
    default: return 4;
  }
}

/**
 * Calcule le nouvel ease factor selon SM-2
 * Formule: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
 */
function calculateEaseFactor(currentEF: number, quality: number): number {
  const newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return Math.max(MIN_EASE_FACTOR, newEF);
}

/**
 * Détermine si une carte est due pour révision
 */
export function isCardDue(state: SRSCardState): boolean {
  return state.dueDate <= Date.now();
}

/**
 * Retourne les cartes à réviser aujourd'hui (triées par priorité)
 */
export function getDueCards(states: SRSCardState[]): SRSCardState[] {
  return states
    .filter(isCardDue)
    .sort((a, b) => a.dueDate - b.dueDate);
}

/**
 * Calcule les statistiques d'apprentissage
 */
export function calculateLearningStats(states: SRSCardState[]) {
  const total = states.length;
  const newCards = states.filter(s => s.isNew).length;
  const dueCards = states.filter(isCardDue).length;
  const learningCards = states.filter(s => !s.isNew && s.repetitions < 3).length;
  const matureCards = states.filter(s => s.repetitions >= 3).length;
  
  const averageEF = states.length > 0
    ? states.reduce((sum, s) => sum + s.easeFactor, 0) / states.length
    : 0;
  
  return {
    total,
    newCards,
    dueCards,
    learningCards,
    matureCards,
    averageEF: Math.round(averageEF * 100) / 100,
  };
}

/**
 * Estime le temps de révision restant
 * Utilise la valeur par défaut configurée (30s par carte)
 * Pour une estimation personnalisée, utiliser estimateStudyTimeForDecks() de database.ts
 */
export function estimateStudyTime(dueCardsCount: number): number {
  // En minutes
  return Math.ceil((dueCardsCount * DEFAULT_TIME_PER_CARD_SECONDS) / 60);
}
