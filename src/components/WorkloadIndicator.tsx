import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EnhancedDeckStats, StudyTimeStats, DEFAULT_TIME_PER_CARD_SECONDS } from '../types';

interface WorkloadIndicatorProps {
  deckStats: Record<string, EnhancedDeckStats>;
  todayReviewCount: number;
  dailyGoal?: number; // Objectif quotidien de cartes (défaut: 20)
  studyTimeStats?: Record<string, StudyTimeStats>; // Stats de temps par deck
}

/**
 * Calcule les statistiques de charge de travail
 * Utilise les temps personnalisés si disponibles, sinon la valeur par défaut
 */
function calculateWorkloadStats(
  stats: Record<string, EnhancedDeckStats>,
  timeStats: Record<string, StudyTimeStats> = {}
) {
  const values = Object.values(stats);
  
  const totalCards = values.reduce((sum, s) => sum + s.total, 0);
  const totalDue = values.reduce((sum, s) => sum + s.due, 0);
  const totalNew = values.reduce((sum, s) => sum + s.discoveryCount, 0);
  const totalLearning = values.reduce((sum, s) => sum + s.learning + s.new, 0);
  const totalReview = values.reduce((sum, s) => sum + s.review, 0);
  const totalMastered = values.filter(s => s.isMastered).length;
  const startedDecks = values.filter(s => s.hasBeenStarted).length;
  const totalDecks = values.filter(s => s.total > 0).length;
  
  // Calcul du temps estimé avec statistiques personnalisées
  let totalEstimatedSeconds = 0;
  const deckTimeBreakdown: Record<string, { cards: number; timeSeconds: number; avgTimeSeconds: number }> = {};
  
  for (const [deckId, deckStat] of Object.entries(stats)) {
    if (deckStat.due === 0) continue;
    
    // Utiliser le temps personnalisé si disponible et fiable (≥3 révisions)
    const customTime = timeStats[deckId];
    const avgTimeSeconds = (customTime && customTime.totalReviews >= 3)
      ? customTime.avgTimePerCardSeconds
      : DEFAULT_TIME_PER_CARD_SECONDS;
    
    const deckTime = deckStat.due * avgTimeSeconds;
    totalEstimatedSeconds += deckTime;
    
    deckTimeBreakdown[deckId] = {
      cards: deckStat.due,
      timeSeconds: deckTime,
      avgTimeSeconds,
    };
  }
  
  const estimatedMinutes = Math.ceil(totalEstimatedSeconds / 60);
  
  // Prochaine date de révision parmi toutes les cartes
  const nextReviewTimestamps = values
    .map(s => s.nextReviewDate)
    .filter((d): d is number => d !== null && d > Date.now());
  
  const nextReviewDate = nextReviewTimestamps.length > 0 
    ? Math.min(...nextReviewTimestamps)
    : null;
  
  // Calcul de la "pression" : ratio cartes dues / cartes vues
  const seenCards = totalCards - values.reduce((sum, s) => sum + s.unseen, 0);
  const pressureRatio = seenCards > 0 ? (totalDue / seenCards) * 100 : 0;
  
  return {
    totalCards,
    totalDue,
    totalNew,
    totalLearning,
    totalReview,
    totalMastered,
    startedDecks,
    totalDecks,
    estimatedMinutes,
    nextReviewDate,
    pressureRatio,
    unseenCards: values.reduce((sum, s) => sum + s.unseen, 0),
    deckTimeBreakdown,
  };
}

/**
 * Détermine le niveau de charge et les couleurs associées
 */
function getWorkloadLevel(due: number, estimatedMinutes: number): {
  level: 'light' | 'moderate' | 'heavy' | 'overwhelming';
  color: string;
  bgColor: string;
  icon: string;
  message: string;
} {
  if (due === 0) {
    return {
      level: 'light',
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      icon: 'check-circle',
      message: 'Tout est à jour',
    };
  }
  
  if (due <= 10 && estimatedMinutes <= 10) {
    return {
      level: 'light',
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      icon: 'emoticon-happy',
      message: 'Charge légère',
    };
  }
  
  if (due <= 25 && estimatedMinutes <= 20) {
    return {
      level: 'moderate',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      icon: 'emoticon-neutral',
      message: 'Charge modérée',
    };
  }
  
  if (due <= 50 && estimatedMinutes <= 40) {
    return {
      level: 'heavy',
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.1)',
      icon: 'emoticon-cool',
      message: 'Charge importante',
    };
  }
  
  return {
    level: 'overwhelming',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: 'emoticon-sad',
    message: 'Charge très lourde',
  };
}

/**
 * Formate la date de prochaine révision
 */
function formatNextReview(timestamp: number | null): string {
  if (!timestamp) return 'Aucune planifiée';
  
  const now = Date.now();
  const diff = timestamp - now;
  const hours = Math.ceil(diff / (1000 * 60 * 60));
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (hours < 1) return 'Maintenant';
  if (hours < 24) return `Dans ${hours}h`;
  if (days === 1) return 'Demain';
  if (days < 7) return `Dans ${days}j`;
  return `Dans ${Math.floor(days / 7)} semaines`;
}

/**
 * Formate le temps estimé
 */
function formatDuration(minutes: number): string {
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
}

export function WorkloadIndicator({ 
  deckStats, 
  todayReviewCount,
  dailyGoal = 20,
  studyTimeStats = {}
}: WorkloadIndicatorProps) {
  const stats = calculateWorkloadStats(deckStats, studyTimeStats);
  const workload = getWorkloadLevel(stats.totalDue, stats.estimatedMinutes);
  
  // Progression vers l'objectif quotidien
  const goalProgress = Math.min(100, (todayReviewCount / dailyGoal) * 100);
  const goalRemaining = Math.max(0, dailyGoal - todayReviewCount);
  
  // Déterminer si on utilise des stats personnalisées
  const hasCustomStats = Object.keys(studyTimeStats).some(
    deckId => studyTimeStats[deckId]?.totalReviews >= 3
  );
  
  // Déterminer le message de motivation
  const getMotivationMessage = () => {
    if (todayReviewCount === 0 && stats.totalDue === 0) {
      return "Commence par découvrir un nouveau chapitre !";
    }
    if (todayReviewCount === 0) {
      return "C'est parti pour la session du jour 💪";
    }
    if (goalProgress >= 100) {
      return "Objectif atteint ! Tu peux t'arrêter ou continuer 🌟";
    }
    if (goalProgress >= 50) {
      return "Tu es à mi-parcours, continue comme ça !";
    }
    return `Encore ${goalRemaining} cartes pour atteindre ton objectif`;
  };
  
  return (
    <View style={styles.container}>
      {/* Row principale avec les 3 métriques clés */}
      <View style={styles.mainRow}>
        {/* Cartes dues */}
        <View style={styles.metricBox}>
          <View style={[styles.iconContainer, { backgroundColor: workload.bgColor }]}>
            <MaterialCommunityIcons 
              name={workload.icon as any} 
              size={20} 
              color={workload.color} 
            />
          </View>
          <View style={styles.metricContent}>
            <Text style={[styles.metricValue, { color: workload.color }]}>
              {stats.totalDue}
            </Text>
            <Text style={styles.metricLabel}>à réviser</Text>
          </View>
        </View>
        
        {/* Temps estimé */}
        <View style={styles.metricBox}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#6366f1" />
          </View>
          <View style={styles.metricContent}>
            <Text style={[styles.metricValue, { color: '#6366f1' }]}>
              {formatDuration(stats.estimatedMinutes)}
            </Text>
            <Text style={styles.metricLabel}>estimé</Text>
            {hasCustomStats && (
              <MaterialCommunityIcons 
                name="chart-line" 
                size={10} 
                color="#22c55e" 
                style={styles.personalizedIndicator}
              />
            )}
          </View>
        </View>
        
        {/* Progression objectif */}
        <View style={styles.metricBox}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
            <MaterialCommunityIcons name="target" size={20} color="#22c55e" />
          </View>
          <View style={styles.metricContent}>
            <Text style={[styles.metricValue, { color: '#22c55e' }]}>
              {todayReviewCount}
            </Text>
            <Text style={styles.metricLabel}>/{dailyGoal}</Text>
          </View>
        </View>
      </View>
      
      {/* Barre de progression vers l'objectif */}
      <View style={styles.goalSection}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>Objectif du jour</Text>
          <Text style={styles.goalPercentage}>{Math.round(goalProgress)}%</Text>
        </View>
        <View style={styles.goalBar}>
          <View 
            style={[
              styles.goalFill,
              { 
                width: `${goalProgress}%`,
                backgroundColor: goalProgress >= 100 ? '#22c55e' : '#6366f1'
              }
            ]} 
          />
        </View>
        <Text style={styles.motivationText}>{getMotivationMessage()}</Text>
      </View>
      
      {/* Stats détaillées */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="star-outline" size={14} color="#f59e0b" />
          <Text style={styles.detailText}>
            <Text style={styles.detailValue}>{stats.totalNew}</Text> nouvelles
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="book-open-variant" size={14} color="#3b82f6" />
          <Text style={styles.detailText}>
            <Text style={styles.detailValue}>{stats.totalLearning}</Text> en apprentissage
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="sleep" size={14} color="#64748b" />
          <Text style={styles.detailText}>
            Prochaine: <Text style={styles.detailValue}>{formatNextReview(stats.nextReviewDate)}</Text>
          </Text>
        </View>
      </View>
      
      {/* Indicateur de personnalisation */}
      {hasCustomStats && (
        <View style={styles.personalizedBanner}>
          <MaterialCommunityIcons name="brain" size={12} color="#22c55e" />
          <Text style={styles.personalizedText}>
            Temps estimé basé sur ton rythme réel
          </Text>
        </View>
      )}
      
      {/* Aperçu de la couverture globale */}
      <View style={styles.coverageSection}>
        <View style={styles.coverageHeader}>
          <Text style={styles.coverageTitle}>Progression globale</Text>
          <Text style={styles.coverageValue}>{stats.startedDecks}/{stats.totalDecks} chapitres</Text>
        </View>
        <View style={styles.coverageBar}>
          {stats.totalDecks > 0 && (
            <>
              {/* Partie maîtrisée (vert) */}
              <View 
                style={[
                  styles.coverageSegment, 
                  { 
                    backgroundColor: '#22c55e',
                    width: `${(stats.totalMastered / stats.totalDecks) * 100}%` 
                  }
                ]} 
              />
              {/* Partie commencée non maîtrisée (orange) */}
              <View 
                style={[
                  styles.coverageSegment, 
                  { 
                    backgroundColor: '#f59e0b',
                    width: `${((stats.startedDecks - stats.totalMastered) / stats.totalDecks) * 100}%` 
                  }
                ]} 
              />
              {/* Partie non commencée (gris) */}
              <View 
                style={[
                  styles.coverageSegment, 
                  { 
                    backgroundColor: '#cbd5e1',
                    width: `${((stats.totalDecks - stats.startedDecks) / stats.totalDecks) * 100}%` 
                  }
                ]} 
              />
            </>
          )}
        </View>
        <View style={styles.coverageLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.legendText}>{stats.totalMastered} maîtrisés</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>{stats.startedDecks - stats.totalMastered} en cours</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#cbd5e1' }]} />
            <Text style={styles.legendText}>{stats.totalDecks - stats.startedDecks} à découvrir</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  metricBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0, // Permet au flex de rétrécir sous la taille du contenu
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    flexShrink: 0, // Empêche l'icône de rétrécir
  },
  metricContent: {
    alignItems: 'flex-start',
    flexShrink: 1, // Permet au texte de rétrécir si nécessaire
    minWidth: 0,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: -2,
  },
  personalizedIndicator: {
    marginTop: 2,
  },
  goalSection: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  goalPercentage: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  goalBar: {
    height: 10,
    backgroundColor: '#d1d9e6',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalFill: {
    height: '100%',
    borderRadius: 5,
  },
  motivationText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d9e6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#64748b',
  },
  detailValue: {
    fontWeight: '600',
    color: '#1e293b',
  },
  personalizedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  personalizedText: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '500',
  },
  coverageSection: {
    marginTop: 4,
  },
  coverageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  coverageTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  coverageValue: {
    fontSize: 12,
    color: '#64748b',
  },
  coverageBar: {
    height: 12,
    backgroundColor: '#d1d9e6',
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  coverageSegment: {
    height: '100%',
  },
  coverageLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#64748b',
  },
});
