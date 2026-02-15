import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Deck, EnhancedDeckStats } from '../types';

// Nous utilisons EnhancedDeckStats, mais on garde la compatibilité avec l'ancien format
type DeckStats = EnhancedDeckStats | {
  total: number;
  due: number;
  new?: number;
  unseen?: number;
  learning?: number;
  review?: number;
  sleeping?: number;
  maturePercent?: number;
  nextReviewDate?: number | null;
  hasBeenStarted?: boolean;
  isMastered?: boolean;
  discoveryCount?: number;
};

interface DeckCardProps {
  deck: Deck;
  stats: DeckStats;
  onPress: () => void;
}

/**
 * Formate un délai en texte lisible
 * "dans 2 heures", "demain", "dans 3 jours"
 */
function formatTimeUntil(timestamp: number | null | undefined): string {
  if (!timestamp) return 'bientôt';
  
  const now = Date.now();
  const diff = timestamp - now;
  const hours = Math.ceil(diff / (1000 * 60 * 60));
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (hours < 1) return 'maintenant';
  if (hours < 24) return `dans ${hours}h`;
  if (days === 1) return 'demain';
  if (days < 7) return `dans ${days}j`;
  if (days < 30) return `dans ${Math.floor(days / 7)} sem.`;
  return `dans ${Math.floor(days / 30)} mois`;
}

/**
 * Détermine lequel des 4 états afficher
 * 
 * ÉTATS :
 * 1. 🔒 LOCKED (Jamais commencé) : unseen === total
 * 2. 📖 DISCOVERY (En découverte) : hasBeenStarted && !isMastered && (due > 0 || discoveryCount > 0)
 * 3. ⏳ SLEEPING (En sommeil) : hasBeenStarted && due === 0 && !isMastered
 * 4. ✅ MASTERED (Maîtrisé) : isMastered (maturePercent >= 80)
 */
function getDeckState(stats: DeckStats): {
  state: 'locked' | 'discovery' | 'sleeping' | 'mastered';
  badgeIcon: string;
  badgeColor: string;
  badgeText: string;
  actionText: string;
  subText: string;
  progressSegments: { color: string; percent: number }[];
} {
  const total = stats.total || 0;
  const unseen = stats.unseen || 0;
  const newCount = stats.new || 0;
  const learning = stats.learning || 0;
  const review = stats.review || 0;
  const due = stats.due || 0;
  const hasBeenStarted = stats.hasBeenStarted ?? (total - unseen > 0);
  const isMastered = stats.isMastered ?? ((stats.maturePercent || 0) >= 80);
  const discoveryCount = stats.discoveryCount ?? (unseen + newCount);
  const nextReviewDate = stats.nextReviewDate;
  
  // Pour éviter division par zéro
  const safeTotal = total > 0 ? total : 1;
  
  // Calcul des pourcentages pour la barre
  const unseenPercent = (unseen / safeTotal) * 100;
  const newPercent = (newCount / safeTotal) * 100;
  const learningPercent = (learning / safeTotal) * 100;
  const reviewPercent = (review / safeTotal) * 100;
  
  // ÉTAT 4: MAÎTRISÉ (prioritaire)
  if (isMastered) {
    return {
      state: 'mastered',
      badgeIcon: 'check-circle',
      badgeColor: '#22c55e',
      badgeText: '✓',
      actionText: 'Réviser',
      subText: nextReviewDate 
        ? `Maîtrisé · Prochaine révision ${formatTimeUntil(nextReviewDate)}`
        : 'Chapitre maîtrisé 🎉',
      progressSegments: [
        { color: '#22c55e', percent: 100 },
      ],
    };
  }
  
  // ÉTAT 1: JAMAIS COMMENCÉ (Prêt pour apprentissage)
  if (!hasBeenStarted) {
    return {
      state: 'locked',
      badgeIcon: 'rocket-launch',  // Icône départ
      badgeColor: '#06b6d4',  // Cyan vif
      badgeText: `${total}`,
      actionText: 'Commencer',
      subText: `🚀 ${total} carte${total > 1 ? 's' : ''} à apprendre`,
      progressSegments: [
        { color: '#67e8f9', percent: 100 },  // Cyan clair
      ],
    };
  }
  
  // ÉTAT 2: EN DÉCOUVERTE (cartes dues ou nouvelles à voir)
  if (due > 0 || discoveryCount > 0) {
    const dueText = due > 0 ? `${due} à réviser` : '';
    
    // Message différent selon le contexte
    let newText = '';
    if (discoveryCount > 0 && due === 0) {
      // Que des nouvelles cartes (pas de révision due)
      const unseenInDeck = unseen;
      const newInLearning = newCount;
      
      if (unseenInDeck > 0 && newInLearning === 0) {
        // Cartes jamais vues mais pas encore ajoutées à l'apprentissage (limite atteinte)
        newText = `${discoveryCount} carte${discoveryCount > 1 ? 's' : ''} en file d'attente (max 10/jour)`;
      } else if (newInLearning > 0 && unseenInDeck > 0) {
        // Mix : certaines en apprentissage, d'autres en attente
        newText = `${newInLearning} à apprendre · ${unseenInDeck} en attente`;
      } else {
        // Juste des nouvelles cartes à voir aujourd'hui
        newText = `${discoveryCount} nouvelle${discoveryCount > 1 ? 's' : ''} à découvrir`;
      }
    }
    
    const separator = dueText && newText ? ' · ' : '';
    
    return {
      state: 'discovery',
      badgeIcon: 'book-open-variant',
      badgeColor: due > 0 ? '#ef4444' : '#f59e0b',
      badgeText: due > 0 ? `${due}` : `${discoveryCount}`,
      actionText: due > 0 ? 'Réviser' : 'Continuer',
      subText: `${dueText}${separator}${newText}`.trim() || 'En apprentissage',
      progressSegments: [
        { color: '#22c55e', percent: reviewPercent },
        { color: '#f59e0b', percent: learningPercent + newPercent },
        { color: '#cbd5e1', percent: unseenPercent },
      ].filter(s => s.percent > 0),
    };
  }
  
  // ÉTAT 3: EN SOMMEIL (commencé mais rien à faire maintenant)
  return {
    state: 'sleeping',
    badgeIcon: 'sleep',
    badgeColor: '#3b82f6',
    badgeText: 'zZ',
    actionText: 'S\'entraîner',
    subText: nextReviewDate 
      ? `En sommeil · Reviens ${formatTimeUntil(nextReviewDate)}`
      : 'Tout est à jour',
    progressSegments: [
      { color: '#22c55e', percent: reviewPercent },
      { color: '#f59e0b', percent: learningPercent + newPercent },
      { color: '#cbd5e1', percent: unseenPercent },
    ].filter(s => s.percent > 0),
  };
}

export function DeckCard({ deck, stats, onPress }: DeckCardProps) {
  const deckState = getDeckState(stats);
  const total = stats.total || 0;
  
  // Détermine la couleur de la bordure gauche selon l'état
  const getBorderColor = () => {
    switch (deckState.state) {
      case 'locked': return '#06b6d4';  // Cyan vif pour nouveau contenu
      case 'discovery': return deckState.badgeColor; // rouge ou orange
      case 'sleeping': return '#3b82f6';
      case 'mastered': return '#22c55e';
      default: return deck.color;
    }
  };
  
  // Détermine si la carte est cliquable
  const isClickable = total > 0;
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { borderLeftColor: getBorderColor() },
        !isClickable && styles.containerDisabled
      ]} 
      onPress={onPress}
      activeOpacity={isClickable ? 0.8 : 1}
      disabled={!isClickable}
    >
      <View style={styles.content}>
        {/* Nom du deck */}
        <Text style={styles.name}>{deck.name}</Text>
        
        {/* Description si présente */}
        {deck.description && (
          <Text style={styles.description} numberOfLines={1}>
            {deck.description}
          </Text>
        )}
        
        {/* Barre de progression segmentée */}
        <View style={styles.progressBar}>
          {deckState.progressSegments.map((segment, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                { 
                  backgroundColor: segment.color,
                  width: `${segment.percent}%`,
                  borderTopLeftRadius: index === 0 ? 3 : 0,
                  borderBottomLeftRadius: index === 0 ? 3 : 0,
                  borderTopRightRadius: index === deckState.progressSegments.length - 1 ? 3 : 0,
                  borderBottomRightRadius: index === deckState.progressSegments.length - 1 ? 3 : 0,
                }
              ]}
            />
          ))}
        </View>
        
        {/* Ligne de stats */}
        <View style={styles.statsRow}>
          {/* Total cartes */}
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="cards-outline" size={12} color="#64748b" />
            <Text style={styles.statText}>{total}</Text>
          </View>
          
          {/* Texte d'état */}
          <Text style={styles.subText} numberOfLines={1}>
            {deckState.subText}
          </Text>
        </View>
      </View>
      
      {/* Badge droit */}
      <View style={[
        styles.badge,
        { 
          backgroundColor: deckState.badgeColor,
          shadowColor: deckState.badgeColor,
        }
      ]}>
        <MaterialCommunityIcons 
          name={deckState.badgeIcon as any} 
          size={16} 
          color="#fff" 
        />
        {deckState.state !== 'sleeping' && deckState.state !== 'mastered' && (
          <Text style={styles.badgeText}>{deckState.badgeText}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 6,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderLeftWidth: 5,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#d1d9e6',
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressSegment: {
    height: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  subText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    flexDirection: 'column',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
