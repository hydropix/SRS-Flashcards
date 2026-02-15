import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
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
  isUrgent: boolean;
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
      isUrgent: false,
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
      isUrgent: false,
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
        newText = `${discoveryCount} en attente (max 10/jour)`;
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
      isUrgent: due > 0, // Urgent uniquement s'il y a des cartes dues
    };
  }
  
  // ÉTAT 3: EN SOMMEIL (commencé mais rien à faire maintenant)
  return {
    state: 'sleeping',
    badgeIcon: 'sleep',
    badgeColor: '#94a3b8', // Gris plus neutre pour le sommeil
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
    isUrgent: false,
  };
}

/**
 * Composant de badge animé avec effet pulse
 */
function PulsingBadge({ 
  icon, 
  color, 
  text, 
  isPulsing 
}: { 
  icon: string; 
  color: string; 
  text: string; 
  isPulsing: boolean;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isPulsing) {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
      return;
    }

    // Animation de pulse simultanée pour l'échelle et la lueur
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [isPulsing, pulseAnim, glowAnim]);

  // Interpolation pour la lueur
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <View style={styles.badgeWrapper}>
      {/* Cercle de lueur animé (derrière le badge) */}
      {isPulsing && (
        <Animated.View
          style={[
            styles.badgeGlow,
            { 
              backgroundColor: color,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            }
          ]}
        />
      )}
      
      {/* Badge principal avec animation d'échelle */}
      <Animated.View
        style={[
          styles.badge,
          { 
            backgroundColor: color,
            shadowColor: color,
            transform: [{ scale: pulseAnim }],
          }
        ]}
      >
        <MaterialCommunityIcons 
          name={icon as any} 
          size={16} 
          color="#fff" 
        />
        {text && text !== 'zZ' && (
          <Text style={styles.badgeText}>{text}</Text>
        )}
      </Animated.View>
    </View>
  );
}

export function DeckCard({ deck, stats, onPress }: DeckCardProps) {
  const deckState = getDeckState(stats);
  const total = stats.total || 0;
  
  // Détermine si le deck est en sommeil (pour appliquer le style atténué)
  const isSleeping = deckState.state === 'sleeping';
  const isMastered = deckState.state === 'mastered';
  const isInactive = isSleeping || isMastered;
  
  // Détermine la couleur de la bordure gauche selon l'état
  const getBorderColor = () => {
    switch (deckState.state) {
      case 'locked': return '#06b6d4';  // Cyan vif pour nouveau contenu
      case 'discovery': return deckState.badgeColor; // rouge ou orange
      case 'sleeping': return '#94a3b8'; // Gris pour sommeil
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
        !isClickable && styles.containerDisabled,
        isInactive && styles.containerInactive,
      ]} 
      onPress={onPress}
      activeOpacity={isClickable ? 0.8 : 1}
      disabled={!isClickable}
    >
      <View style={[
        styles.content,
        isInactive && styles.contentInactive
      ]}>
        {/* Nom du deck */}
        <Text style={[
          styles.name,
          isInactive && styles.textInactive
        ]}>{deck.name}</Text>
        
        {/* Description si présente */}
        {deck.description && (
          <Text style={[
            styles.description, 
            isInactive && styles.descriptionInactive
          ]} numberOfLines={1}>
            {deck.description}
          </Text>
        )}
        
        {/* Barre de progression segmentée */}
        <View style={[
          styles.progressBar,
          isInactive && styles.progressBarInactive
        ]}>
          {deckState.progressSegments.map((segment, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                { 
                  backgroundColor: isInactive 
                    ? adjustColorOpacity(segment.color, 0.5) 
                    : segment.color,
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
            <MaterialCommunityIcons 
              name="cards-outline" 
              size={12} 
              color={isInactive ? '#94a3b8' : '#64748b'} 
            />
            <Text style={[
              styles.statText,
              isInactive && styles.statTextInactive
            ]}>{total}</Text>
          </View>
          
          {/* Texte d'état */}
          <Text style={[
            styles.subText, 
            isInactive && styles.subTextInactive
          ]} numberOfLines={1}>
            {deckState.subText}
          </Text>
        </View>
      </View>
      
      {/* Badge droit avec animation pulse si urgent */}
      <PulsingBadge
        icon={deckState.badgeIcon}
        color={deckState.badgeColor}
        text={deckState.badgeText}
        isPulsing={deckState.isUrgent}
      />
    </TouchableOpacity>
  );
}

/**
 * Ajuste l'opacité d'une couleur hexadécimale
 */
function adjustColorOpacity(hexColor: string, opacity: number): string {
  // Pour les couleurs hex simples (#RRGGBB)
  if (hexColor.startsWith('#') && hexColor.length === 7) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Mélanger avec du gris clair (#e0e5ec - la couleur de fond)
    const bgR = 224;
    const bgG = 229;
    const bgB = 236;
    
    const newR = Math.round(r * opacity + bgR * (1 - opacity));
    const newG = Math.round(g * opacity + bgG * (1 - opacity));
    const newB = Math.round(b * opacity + bgB * (1 - opacity));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  }
  return hexColor;
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
  containerInactive: {
    opacity: 0.75,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: '#e6ebf2', // Légèrement différent du fond
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentInactive: {
    opacity: 0.85,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  textInactive: {
    color: '#64748b',
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  descriptionInactive: {
    color: '#94a3b8',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#d1d9e6',
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarInactive: {
    backgroundColor: '#d8dde6',
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
  statTextInactive: {
    color: '#94a3b8',
  },
  subText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  subTextInactive: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  badgeWrapper: {
    width: 44,
    height: 44,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
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
