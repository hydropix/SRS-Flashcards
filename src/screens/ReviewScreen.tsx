import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Flashcard } from '../components/Flashcard';
import { RatingButtons } from '../components/RatingButtons';
import { ProgressBar } from '../components/ProgressBar';
import { Card, ReviewRating } from '../types';
import { 
  getCardById, 
  getDueCardsForDeck,
  getNewCardsForDeck,
  getDueCardsForSubject,
  getSubjectStats,
  getSRSState, 
  saveSRSState, 
  logReview,
  getAllSRSStates,
  getCardsByDeck,
  getDecksBySubject,
} from '../storage/database';
import { calculateNextReview, createNewCardState } from '../algorithms/srs';

interface ReviewScreenProps {
  navigation: any;
  route: {
    params: {
      deckId?: string;
      subjectId?: string;
      mode?: 'review' | 'practice'; // review = SRS normal, practice = entraînement libre
    };
  };
}

export function ReviewScreen({ navigation, route }: ReviewScreenProps) {
  const { deckId, subjectId, mode = 'practice' } = route.params;
  const isPracticeMode = mode === 'practice';
  
  const [cardsToReview, setCardsToReview] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  
  // Infos pour l'écran "session terminée"
  const [sessionInfo, setSessionInfo] = useState<{
    newCards: number;
    dueCards: number;
    nextReviewDate: Date | null;
    matureCards: number;
  }>({ newCards: 0, dueCards: 0, nextReviewDate: null, matureCards: 0 });

  const loadCards = async () => {
    try {
      setLoading(true);
      let cardIds: string[] = [];
      let newCardsCount = 0;
      let dueCardsCount = 0;
      let nextReview: Date | null = null;
      let matureCount = 0;
      
      if (subjectId) {
        // Mode matière
        if (isPracticeMode) {
          // Mode entraînement : charger toutes les cartes de tous les decks
          const subjectDecks = await getDecksBySubject(subjectId as any);
          for (const deck of subjectDecks) {
            const cards = await getCardsByDeck(deck.id);
            cardIds = [...cardIds, ...cards.map(c => c.id)];
          }
          cardIds = cardIds.slice(0, 20); // Limiter à 20
        } else {
          // Mode révision SRS : utiliser les fonctions centralisées
          const subjectStats = await getSubjectStats(subjectId as any);
          cardIds = await getDueCardsForSubject(subjectId as any);
          dueCardsCount = subjectStats.due;
          matureCount = subjectStats.mature;
          
          if (subjectStats.nextReviewDate) {
            nextReview = new Date(subjectStats.nextReviewDate);
          }
        }
      } else if (deckId === 'all') {
        const allStates = await getAllSRSStates();
        const now = Date.now();
        cardIds = allStates
          .filter(s => s.dueDate <= now && !s.isNew)
          .map(s => s.cardId);
        
        // Trouver la prochaine révision
        const futureStates = allStates.filter(s => s.dueDate > now);
        if (futureStates.length > 0) {
          const minDue = Math.min(...futureStates.map(s => s.dueDate));
          nextReview = new Date(minDue);
        }
      } else if (deckId) {
        // Mode chapitre individuel
        if (isPracticeMode) {
          // Mode entraînement : charger toutes les cartes du deck
          const cards = await getCardsByDeck(deckId);
          cardIds = cards.map(c => c.id);
        } else {
          // Mode révision SRS
          dueCardsCount = (await getDueCardsForDeck(deckId)).length;
          const newCards = await getNewCardsForDeck(deckId, 10);
          newCardsCount = newCards.length;
          cardIds = [...(await getDueCardsForDeck(deckId)), ...newCards].slice(0, 10);
          
          // Récupérer les infos pour l'écran de fin
          const allStates = await getAllSRSStates();
          const deckCardIds = new Set((await getCardsByDeck(deckId)).map(c => c.id));
          const deckStates = allStates.filter(s => deckCardIds.has(s.cardId));
          
          // Cartes matures
          matureCount = deckStates.filter(s => s.repetitions >= 3).length;
          
          // Prochaine révision
          const now = Date.now();
          const futureDue = deckStates
            .filter(s => s.dueDate > now && !s.isNew)
            .map(s => s.dueDate);
          if (futureDue.length > 0) {
            nextReview = new Date(Math.min(...futureDue));
          }
        }
      }

      setCardsToReview(cardIds);
      setSessionInfo({
        newCards: newCardsCount,
        dueCards: dueCardsCount,
        nextReviewDate: nextReview,
        matureCards: matureCount,
      });
      
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

    // En mode révision SRS normal, on enregistre et met à jour l'état
    if (!isPracticeMode) {
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
    }
    // En mode entraînement (practice), on ne touche pas à l'état SRS
    // L'utilisateur peut s'entraîner sans affecter sa progression

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
    const hasJustCompleted = total > 0;
    
    // Formatage de la date de prochaine révision
    const formatNextReview = () => {
      if (!sessionInfo.nextReviewDate) return null;
      const now = new Date();
      const diff = sessionInfo.nextReviewDate.getTime() - now.getTime();
      const hours = Math.ceil(diff / (1000 * 60 * 60));
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      
      if (hours < 24) return `dans ${hours} heure${hours > 1 ? 's' : ''}`;
      return `dans ${days} jour${days > 1 ? 's' : ''}`;
    };
    
    const nextReviewText = formatNextReview();
    
    return (
      <View style={styles.container}>
        <View style={styles.completeContainer}>
          {hasJustCompleted ? (
            <>
              <Text style={styles.completeEmoji}>🎉</Text>
              <Text style={styles.completeTitle}>
                {isPracticeMode ? 'Entraînement terminé !' : 'Session terminée !'}
              </Text>
              <Text style={styles.completeSubtitle}>
                {isPracticeMode 
                  ? `Tu t'es entraîné sur ${total} carte${total > 1 ? 's' : ''}`
                  : `Tu as révisé ${total} carte${total > 1 ? 's' : ''}`
                }
              </Text>
              {isPracticeMode && (
                <Text style={styles.practiceNote}>
                  ℹ️ L'entraînement ne modifie pas ta progression
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.completeEmoji}>{isPracticeMode ? '👁️' : '⏳'}</Text>
              <Text style={styles.completeTitle}>
                {isPracticeMode 
                  ? 'Mode exploration' 
                  : "Rien à réviser\n(pour l'instant)"}
              </Text>
              <Text style={styles.completeSubtitle}>
                {isPracticeMode 
                  ? 'Tu visualises les cartes sans évaluation'
                  : 'Toutes les cartes sont à jour'}
              </Text>
            </>
          )}
          
          {/* Explications du mécanisme */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>
              {isPracticeMode 
                ? "Mode exploration" 
                : hasJustCompleted 
                  ? "Prochaine session" 
                  : "Patience !"}
            </Text>
            
            {isPracticeMode ? (
              // Mode exploration : visualisation sans impact
              <>
                <Text style={styles.explanationText}>
                  Mode exploration : tu visualises les cartes sans évaluation SRS. 
                  Pour commencer l'apprentissage, retourne à l'accueil et clique sur ce chapitre quand il sera marqué "à réviser".
                </Text>
                <View style={styles.nextReviewBox}>
                  <Text style={styles.nextReviewLabel}>💡 Info</Text>
                  <Text style={styles.nextReviewValue}>Ce mode n'affecte pas ta progression</Text>
                </View>
              </>
            ) : sessionInfo.dueCards === 0 && sessionInfo.newCards === 0 ? (
              <>
                <Text style={styles.explanationText}>
                  Les cartes reviennent quand tu dois les réviser. Pas avant.
                </Text>
                
                {nextReviewText && (
                  <View style={styles.nextReviewBox}>
                    <Text style={styles.nextReviewLabel}>Prochaine révision</Text>
                    <Text style={styles.nextReviewValue}>{nextReviewText}</Text>
                  </View>
                )}
                
                {sessionInfo.matureCards > 0 && (
                  <Text style={styles.matureText}>
                    {sessionInfo.matureCards} carte{sessionInfo.matureCards > 1 ? 's' : ''} maîtrisée{sessionInfo.matureCards > 1 ? 's' : ''} 🧠
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.explanationText}>
                Plus de cartes pour aujourd'hui. Reviens demain !
              </Text>
            )}
          </View>
          
          {hasJustCompleted && (
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
          )}

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Main', { screen: 'Home', params: { selectedDeckId: deckId } })}
          >
            <Text style={styles.backButtonText}>
              {deckId && deckId !== 'all' ? 'Retour au chapitre' : 'Retour à l\'accueil'}
            </Text>
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {isPracticeMode ? 'Découverte' : 'Révision'}
          </Text>
          {isPracticeMode && (
            <Text style={styles.headerSubtitle}>Apprends à ton rythme</Text>
          )}
        </View>
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

      {/* Zone d'action : boutons d'évaluation OU message practice */}
      <View style={styles.actionContainer}>
        {isPracticeMode ? (
          // Mode Practice : interface simplifiée
          <View style={styles.practiceContainer}>
            {!revealed ? (
              <View style={styles.practiceHint}>
                <MaterialCommunityIcons name="gesture-tap" size={28} color="#6366f1" />
                <Text style={styles.practiceHintText}>
                  Appuie sur la carte pour voir la réponse
                </Text>
              </View>
            ) : (
              <View style={styles.practiceRevealed}>
                <Text style={styles.practiceInfo}>
                  Mode découverte : tu apprends sans pression
                </Text>
                <TouchableOpacity 
                  style={styles.nextButton}
                  onPress={() => handleRate('good')}
                >
                  <Text style={styles.nextButtonText}>
                    {currentCardIndex < cardsToReview.length - 1 
                      ? 'Continuer →' 
                      : 'Terminer'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          // Mode Review : boutons d'évaluation SRS
          <RatingButtons onRate={handleRate} />
        )}
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
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
    marginBottom: 8,
  },
  practiceNote: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 24,
    textAlign: 'center',
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
  explanationBox: {
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  nextReviewBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  nextReviewLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nextReviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  matureText: {
    fontSize: 14,
    color: '#22c55e',
    textAlign: 'center',
    fontWeight: '500',
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
  
  // Styles pour le mode Practice
  practiceContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceHint: {
    alignItems: 'center',
    backgroundColor: '#e0e5ec',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  practiceHintText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6366f1',
    fontWeight: '600',
  },
  practiceRevealed: {
    width: '100%',
    alignItems: 'center',
  },
  practiceInfo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  nextButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
