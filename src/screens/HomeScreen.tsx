import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllDecks, getDeckStats, getTodayReviewCount, initDatabase } from '../storage/database';
import { Deck } from '../types';
import { DeckCard } from '../components/DeckCard';

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckStats, setDeckStats] = useState<Record<string, { total: number; due: number; new: number }>>({});
  const [todayReviews, setTodayReviews] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      await initDatabase();
      const allDecks = await getAllDecks();
      setDecks(allDecks);

      const stats: Record<string, { total: number; due: number; new: number }> = {};
      for (const deck of allDecks) {
        const deckStat = await getDeckStats(deck.id);
        stats[deck.id] = {
          total: deckStat.total,
          due: deckStat.due,
          new: deckStat.new,
        };
      }
      setDeckStats(stats);

      const todayCount = await getTodayReviewCount();
      setTodayReviews(todayCount);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalDue = Object.values(deckStats).reduce((sum, s) => sum + s.due, 0);
  const totalNew = Object.values(deckStats).reduce((sum, s) => sum + s.new, 0);
  const totalCards = Object.values(deckStats).reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>DNB FlashCards</Text>
          <Text style={styles.subtitle}>Brevet des Collèges</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalDue}</Text>
            <Text style={styles.statLabel}>à réviser</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{todayReviews}</Text>
            <Text style={styles.statLabel}>aujourd'hui</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalCards}</Text>
            <Text style={styles.statLabel}>total</Text>
          </View>
        </View>
      </View>

      {/* Liste des decks */}
      <ScrollView 
        style={styles.decksList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#94a3b8" />
        }
      >
        {decks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucun deck disponible</Text>
            <Text style={styles.emptySubtext}>
              Importez les decks du brevet dans les paramètres
            </Text>
          </View>
        ) : (
          decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              cardCount={deckStats[deck.id]?.total || 0}
              dueCount={deckStats[deck.id]?.due || 0}
              newCount={deckStats[deck.id]?.new || 0}
              onPress={() => navigation.navigate('Review', { deckId: deck.id })}
            />
          ))
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
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
    paddingTop: 32,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#e0e5ec',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 80,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  statLabel: {
    fontSize: 10,
    color: '#7a8ba3',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  decksList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  bottomPadding: {
    height: 30,
  },
});
