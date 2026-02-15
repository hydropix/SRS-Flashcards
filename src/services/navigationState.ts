/**
 * Service de state de navigation
 * Stocke le dernier sujet sélectionné pour restaurer l'état après un swipe back
 */

import { Subject } from '../types';

type NavigationContext = {
  subject: Subject;
  timestamp: number;
};

let navigationContext: NavigationContext | null = null;
const CONTEXT_VALIDITY_MS = 30000; // 30 secondes de validité

export const NavigationState = {
  setLastSubject(subject: Subject | null) {
    if (subject) {
      navigationContext = {
        subject,
        timestamp: Date.now()
      };
    } else {
      navigationContext = null;
    }
  },

  getLastSubject(): Subject | null {
    if (!navigationContext) return null;
    
    // Vérifier si le contexte est encore valide
    const now = Date.now();
    if (now - navigationContext.timestamp > CONTEXT_VALIDITY_MS) {
      navigationContext = null;
      return null;
    }
    
    return navigationContext.subject;
  },

  clear() {
    navigationContext = null;
  },

  // Pour déboguer
  getContext() {
    return navigationContext;
  }
};
