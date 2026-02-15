import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Flashcard } from '../components/Flashcard';
import { RatingButtons } from '../components/RatingButtons';
import { ProgressBar } from '../components/ProgressBar';
import { Card, ReviewRating } from '../types';
import { 
  getCardById, 
  getDueCardsForDeck, 
  getNewCardsForDeck,
  getSRSState, 
  saveSRSState, 
  logReview,
  getAllSRSStates,
} from '../storage/database';
import { calculateNextReview, createNewCardState } from '../algorithms/srs';

interface ReviewScreenProps {
  navigation: any;
  route: {
    params: {
      deckId: string;
    };
  };
}

export function ReviewScreen({ navigation, route }: ReviewScreenProps) {
  const { deckId } = route.params;
  
  const [cardsToReview, setCardsToReview] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  const loadCards = async () => {
    try {
      setLoading(true);
      let cardIds: string[] = [];
      
      if (deckId === 'all') {
        const allStates = await getAllSRSStates();
        const now = Date.now();
        cardIds = allStates
          .filter(s => s.dueDate <= now)
          .map(s => s.cardId);
      } else {
        cardIds = await getDueCardsForDeck(deckId);
        if (cardIds.length < 10) {
          const newCards = await getNewCardsForDeck(deckId, 10);
          cardIds = [...cardIds, ...newCards];
        }
      }

      setCardsToReview(cardIds);
      
      if (cardIds.length > 0) {
        await loadCard(cardIds[0]);
      } else {
        setSessionComplete(true);
      }
    } catch (error) {
      console.error('Erreur chargement cartes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCard = async (cardId: string) => {
    const card = await getCardById(cardId);
    setCurrentCard(card);
    setRevealed(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [deckId])
  );

  const handleFlip = () => {
    setRevealed(prev => !prev);
  };

  const handleRate = async (rating: ReviewRating) => {
    if (!currentCard) return;

    const reviewLog = {
      id: `${Date.now()}-${currentCard.id}`,
      cardId: currentCard.id,
      rating,
      timestamp: Date.now(),
    };
    await logReview(reviewLog);

    let currentState = await getSRSState(currentCard.id);
    if (!currentState) {
      currentState = createNewCardState(currentCard.id);
    }
    
    const newState = calculateNextReview(currentState, rating);
    await saveSRSState(newState);

    setSessionStats(prev => ({
      ...prev,
      [rating]: prev[rating] + 1,
    }));

    const nextIndex = currentCardIndex + 1;
    if (nextIndex < cardsToReview.length) {
      setCurrentCardIndex(nextIndex);
      await loadCard(cardsToReview[nextIndex]);
    } else {
      setSessionComplete(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Chargement des cartes...</Text>
      </View>
    );
  }

  if (sessionComplete) {
    const total = sessionStats.again + sessionStats.hard + sessionStats.good + sessionStats.easy;
    return (
      <View style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>Session terminée !</Text>
          <Text style={styles.completeSubtitle}>
            Tu as révisé {total} carte{total > 1 ? 's' : ''}
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={[styles.statBadge, { backgroundColor: '#fecaca' }]}>
              <Text style={[styles.statNumber, { color: '#ef4444' }]}>{sessionStats.again}</Text>
              <Text style={styles.statLabel}>À revoir</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: '#fde68a' }]}>
              <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{sessionStats.hard}</Text>
              <Text style={styles.statLabel}>Difficile</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: '#bfdbfe' }]}>
              <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{sessionStats.good}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: '#bbf7d0' }]}>
              <Text style={[styles.statNumber, { color: '#22c55e' }]}>{sessionStats.easy}</Text>
              <Text style={styles.statLabel}>Facile</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.backButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <Text style={styles.noCardText}>Aucune carte à réviser</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Révision</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progression */}
      <ProgressBar 
        current={currentCardIndex + 1} 
        total={cardsToReview.length}
      />

      {/* Carte */}
      <View style={styles.cardContainer}>
        <Flashcard 
          card={currentCard} 
          onFlip={handleFlip}
          revealed={revealed}
        />
      </View>

      {/* Boutons de notation */}
      <View style={styles.actionContainer}>
        <RatingButtons onRate={handleRate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#475569',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e0e5ec',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  backBtnText: {
    color: '#1e293b',
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  placeholder: {
    width: 40,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  actionContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completeEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#334155',
    marginTop: 4,
  },
  backButton: {
    backgroundColor: '#e0e5ec',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  backButtonText: {
    color: '#4338ca',
    fontSize: 16,
    fontWeight: '600',
  },
  noCardText: {
    color: '#475569',
  },
});
