import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllSRSStates, getReviewStatsForPeriod, getTodayReviewCount } from '../storage/database';
import { SRSCardState } from '../types';
import { calculateLearningStats } from '../algorithms/srs';

export function StatsScreen() {
  const [srsStates, setSrsStates] = useState<SRSCardState[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const states = await getAllSRSStates();
      setSrsStates(states);

      const today = await getTodayReviewCount();
      setTodayCount(today);

      const weekly = await getReviewStatsForPeriod(7);
      setWeeklyStats(weekly);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const stats = calculateLearningStats(srsStates);
  const dueCount = srsStates.filter(s => s.dueDate <= Date.now()).length;
  
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const hasReview = weeklyStats.some(s => s.date === dateStr);
      if (hasReview || i === 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistiques</Text>
      </View>

      {/* Cartes résumé */}
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: '#6366f1' }]}>{todayCount}</Text>
          <Text style={styles.summaryLabel}>Aujourd'hui</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: '#34d399' }]}>{streak}</Text>
          <Text style={styles.summaryLabel}>Jours consécutifs</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: '#fbbf24' }]}>{dueCount}</Text>
          <Text style={styles.summaryLabel}>À réviser</Text>
        </View>
      </View>

      {/* Stats détaillées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progression</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total cartes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.new}</Text>
            <Text style={styles.statLabel}>Nouvelles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.learning}</Text>
            <Text style={styles.statLabel}>En apprentissage</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.mature}</Text>
            <Text style={styles.statLabel}>Maîtrisées</Text>
          </View>
        </View>
      </View>

      {/* Ease factor moyen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Facilité moyenne</Text>
        <View style={styles.easeContainer}>
          <Text style={styles.easeValue}>{stats.averageEF.toFixed(2)}</Text>
          <Text style={styles.easeLabel}>
            Plus c'est haut, plus tu trouves les cartes faciles
          </Text>
        </View>
      </View>

      {/* Activité récente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activité des 7 derniers jours</Text>
        {weeklyStats.length === 0 ? (
          <Text style={styles.noDataText}>Pas encore d'activité enregistrée</Text>
        ) : (
          weeklyStats.map((day) => (
            <View key={day.date} style={styles.dayRow}>
              <Text style={styles.dayDate}>
                {new Date(day.date).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>
              <View style={styles.dayBar}>
                <View 
                  style={[
                    styles.dayProgress, 
                    { 
                      width: `${Math.min(100, (day.count / 50) * 100)}%`,
                      backgroundColor: day.count >= 20 ? '#34d399' : day.count >= 10 ? '#60a5fa' : '#fbbf24'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.dayCount}>{day.count}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#475569',
  },
  header: {
    backgroundColor: '#e0e5ec',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  summaryCards: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#e0e5ec',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#e0e5ec',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e0e5ec',
    borderRadius: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  easeContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0e5ec',
    borderRadius: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  easeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#34d399',
  },
  easeLabel: {
    fontSize: 12,
    color: '#475569',
    marginTop: 8,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayDate: {
    width: 80,
    fontSize: 13,
    color: '#475569',
  },
  dayBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e5ec',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
    shadowColor: '#ffffff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  dayProgress: {
    height: '100%',
    borderRadius: 4,
  },
  dayCount: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'right',
  },
  bottomPadding: {
    height: 40,
  },
});
