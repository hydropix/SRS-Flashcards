import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Deck, EnhancedDeckStats, Subject, SUBJECT_COLORS, SUBJECT_LABELS } from '../types';

interface Recommendation {
  type: 'urgent' | 'new' | 'continue' | 'mastery' | 'break';
  deck: Deck;
  stats: EnhancedDeckStats;
  message: string;
  priority: number; // 1-10, plus c'est élevé, plus c'est important
}

interface DailyRecommendationsProps {
  decks: Deck[];
  deckStats: Record<string, EnhancedDeckStats>;
  onDeckPress: (deck: Deck) => void;
  onReviewAllPress?: (subject: Subject) => void;
}

/**
 * Génère des recommandations intelligentes basées sur l'état des decks
 */
function generateRecommendations(
  decks: Deck[],
  deckStats: Record<string, EnhancedDeckStats>
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  decks.forEach(deck => {
    const stats = deckStats[deck.id];
    if (!stats || stats.total === 0) return;
    
    // Priorité 1 : Cartes urgentes (dues maintenant)
    if (stats.due > 0) {
      const isLate = stats.due > 5; // Beaucoup de cartes en retard
      recommendations.push({
        type: 'urgent',
        deck,
        stats,
        message: isLate 
          ? `🔥 ${stats.due} cartes en attente - Prioritaire !`
          : `⚡ ${stats.due} carte${stats.due > 1 ? 's' : ''} à réviser`,
        priority: isLate ? 10 : 8,
      });
      return;
    }
    
    // Priorité 2 : Nouveau chapitre jamais commencé (max 2) - deviendra mode apprentissage
    if (!stats.hasBeenStarted && recommendations.filter(r => r.type === 'new').length < 2) {
      recommendations.push({
        type: 'new',
        deck,
        stats,
        message: `🚀 Commence l'apprentissage : ${stats.total} cartes`,
        priority: 6,
      });
      return;
    }
    
    // Priorité 3 : Proche de la maîtrise (80% -> objectif)
    if (stats.hasBeenStarted && !stats.isMastered && stats.maturePercent >= 60) {
      const remaining = Math.ceil((stats.total - stats.unseen) * (0.8 - stats.maturePercent / 100));
      recommendations.push({
        type: 'mastery',
        deck,
        stats,
        message: `🎯 Plus que ~${remaining} cartes pour maîtriser ce chapitre`,
        priority: 5,
      });
      return;
    }
  });
  
  // Trier par priorité décroissante
  recommendations.sort((a, b) => b.priority - a.priority);
  
  // Limiter à 3 recommandations max
  return recommendations.slice(0, 3);
}

/**
 * Formate le temps estimé de révision
 */
function formatStudyTime(minutes: number): string {
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Calcule la charge de travail totale (temps estimé)
 */
function calculateWorkload(recommendations: Recommendation[]): number {
  // Estimation : 30 secondes par carte
  const totalCards = recommendations.reduce((sum, r) => {
    if (r.type === 'urgent') return sum + r.stats.due;
    if (r.type === 'new') return sum + Math.min(5, r.stats.total); // 5 cartes max pour nouveau
    if (r.type === 'mastery') return sum + 5; // 5 cartes pour finaliser
    return sum;
  }, 0);
  
  return Math.ceil((totalCards * 30) / 60);
}

export function DailyRecommendations({ 
  decks, 
  deckStats, 
  onDeckPress,
  onReviewAllPress 
}: DailyRecommendationsProps) {
  const recommendations = generateRecommendations(decks, deckStats);
  const workload = calculateWorkload(recommendations);
  
  // Calcul des stats globales pour le header
  const totalDue = Object.values(deckStats).reduce((sum, s) => sum + s.due, 0);
  const totalNew = Object.values(deckStats).reduce((sum, s) => sum + s.discoveryCount, 0);
  const masteredCount = Object.values(deckStats).filter(s => s.isMastered).length;
  const totalDecks = Object.values(deckStats).filter(s => s.total > 0).length;
  
  // Calcule le temps jusqu'à la prochaine révision
  const getNextReviewTime = (): string => {
    let nextTime: number | null = null;
    decks.forEach(deck => {
      const stats = deckStats[deck.id];
      if (stats?.nextReviewDate && stats.nextReviewDate > Date.now()) {
        if (!nextTime || stats.nextReviewDate < nextTime) {
          nextTime = stats.nextReviewDate;
        }
      }
    });
    
    if (!nextTime) return 'demain';
    
    const diff = nextTime - Date.now();
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 24) return `dans ${hours}h`;
    if (days === 1) return 'demain';
    return `dans ${days}j`;
  };

  if (recommendations.length === 0) {
    const nextReview = getNextReviewTime();
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="check-circle-outline" size={48} color="#22c55e" />
          <Text style={styles.emptyTitle}>Pause ! 🎉</Text>
          <Text style={styles.emptyText}>
            Reviens {nextReview} pour réviser.{'\n'}
            La répétition espacée optimise la mémorisation.
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header avec charge de travail */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>💡 Recommandations du jour</Text>
            <Text style={styles.headerSubtitle}>
              {totalDue > 0 
                ? `${totalDue} carte${totalDue > 1 ? 's' : ''} à réviser · ${formatStudyTime(workload)}`
                : totalNew > 0
                ? `${totalNew} nouvelle${totalNew > 1 ? 's' : ''} carte${totalNew > 1 ? 's' : ''} à découvrir`
                : 'Objectif du jour atteint !'}
            </Text>
          </View>
          
          {/* Cercle de progression */}
          <View style={styles.progressCircle}>
            <Text style={styles.progressNumber}>{masteredCount}</Text>
            <Text style={styles.progressLabel}>/{totalDecks}</Text>
          </View>
        </View>
        
        {/* Barre de progression de la journée */}
        <View style={styles.dailyProgress}>
          <View style={styles.dailyProgressBar}>
            <View 
              style={[
                styles.dailyProgressFill,
                { 
                  width: `${Math.min(100, (masteredCount / Math.max(1, totalDecks)) * 100)}%`,
                  backgroundColor: masteredCount === totalDecks ? '#22c55e' : '#6366f1'
                }
              ]} 
            />
          </View>
          <Text style={styles.dailyProgressText}>
            {masteredCount === totalDecks 
              ? '🏆 Tous les chapitres maîtrisés !'
              : `${masteredCount}/${totalDecks} chapitres maîtrisés`}
          </Text>
        </View>
      </View>
      
      {/* Liste des recommandations */}
      <View style={styles.recommendationsList}>
        {recommendations.map((rec, index) => {
          const subjectColor = SUBJECT_COLORS[rec.deck.subject];
          const isFirst = index === 0;
          
          return (
            <TouchableOpacity
              key={rec.deck.id}
              style={[
                styles.recommendationCard,
                isFirst && styles.recommendationCardPriority,
                { borderLeftColor: subjectColor }
              ]}
              onPress={() => onDeckPress(rec.deck)}
              activeOpacity={0.8}
            >
              {/* Indicateur de priorité */}
              {isFirst && (
                <View style={[styles.priorityBadge, { backgroundColor: subjectColor }]}>
                  <Text style={styles.priorityText}>À FAIRE</Text>
                </View>
              )}
              
              <View style={styles.cardContent}>
                {/* Icône et type */}
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons 
                    name={
                      rec.type === 'urgent' ? 'fire' :
                      rec.type === 'new' ? 'star-outline' :
                      rec.type === 'mastery' ? 'trophy-outline' :
                      'book-open-variant'
                    }
                    size={20}
                    color={
                      rec.type === 'urgent' ? '#ef4444' :
                      rec.type === 'new' ? '#f59e0b' :
                      rec.type === 'mastery' ? '#22c55e' :
                      '#6366f1'
                    }
                  />
                  <Text style={[styles.subjectLabel, { color: subjectColor }]}>
                    {SUBJECT_LABELS[rec.deck.subject]}
                  </Text>
                </View>
                
                {/* Nom du chapitre */}
                <Text style={styles.deckName}>{rec.deck.name}</Text>
                
                {/* Message contextuel */}
                <Text style={styles.message}>{rec.message}</Text>
                
                {/* Stats rapides */}
                <View style={styles.quickStats}>
                  <View style={styles.quickStat}>
                    <MaterialCommunityIcons name="cards-outline" size={12} color="#64748b" />
                    <Text style={styles.quickStatText}>{rec.stats.total} cartes</Text>
                  </View>
                  
                  {rec.stats.maturePercent > 0 && (
                    <View style={styles.quickStat}>
                      <MaterialCommunityIcons name="chart-line" size={12} color="#22c55e" />
                      <Text style={styles.quickStatText}>{rec.stats.maturePercent}% maîtrisé</Text>
                    </View>
                  )}
                  
                  {rec.stats.nextReviewDate && rec.stats.due === 0 && (
                    <View style={styles.quickStat}>
                      <MaterialCommunityIcons name="clock-outline" size={12} color="#3b82f6" />
                      <Text style={styles.quickStatText}>
                        {Math.ceil((rec.stats.nextReviewDate - Date.now()) / (1000 * 60 * 60 * 24))}j
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              {/* Flèche */}
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color="#94a3b8"
                style={styles.chevron}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Tip du jour */}
      <View style={styles.tipContainer}>
        <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#f59e0b" />
        <Text style={styles.tipText}>
          {totalDue > 10 
            ? "Conseil : Commence par les chapitres en retard"
            : totalDue > 0
            ? "Conseil : Les chapitres rouges sont prioritaires"
            : totalNew > 0
            ? "Conseil : Clique sur un nouveau chapitre pour commencer l'apprentissage"
            : "Conseil : Repose-toi, tu as bien travaillé ! 🎉"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e5ec',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
  },
  progressNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  dailyProgress: {
    marginTop: 4,
  },
  dailyProgressBar: {
    height: 8,
    backgroundColor: '#d1d9e6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  dailyProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  dailyProgressText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  recommendationsList: {
    gap: 10,
  },
  recommendationCard: {
    backgroundColor: '#e0e5ec',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  recommendationCardPriority: {
    shadowColor: '#6366f1',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  priorityBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  subjectLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deckName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickStatText: {
    fontSize: 11,
    color: '#64748b',
  },
  chevron: {
    marginLeft: 8,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16,
  },
  emptyState: {
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
