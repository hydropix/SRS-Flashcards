import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, BackHandler, Alert, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  getAllDecks, 
  getEnhancedDeckStats, 
  getTodayReviewCount, 
  initDatabase, 
  initializeDeckForLearning, 
  getNewCardsLearnedToday,
  getAllStudyTimeStats,
} from '../storage/database';
import { Deck, Subject, SUBJECT_COLORS, SUBJECT_LABELS, EnhancedDeckStats, StudyTimeStats } from '../types';
import { DeckCard } from '../components/DeckCard';
import { WorkloadIndicator } from '../components/WorkloadIndicator';
import { DailyRecommendations } from '../components/DailyRecommendations';
import { NavigationState } from '../services/navigationState';

interface HomeScreenProps {
  navigation: any;
}

// Icônes par matière
const SUBJECT_ICONS: Record<Subject, string> = {
  'maths': 'calculator',
  'francais': 'book-open-variant',
  'histoire-geo': 'earth',
  'svt': 'leaf',
  'physique-chimie': 'flash',
  'technologie': 'cog',
  'anglais': 'translate',
};

// Limite de nouvelles cartes par jour (mode apprentissage)
const DAILY_NEW_CARDS_LIMIT = 10;

/**
 * Composant de badge animé avec effet pulse pour les folders de matières
 */
function PulsingFolderBadge({ 
  count,
  isPulsing 
}: { 
  count: number;
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
    outputRange: [1, 1.25],
  });

  if (isPulsing) {
    return (
      <View style={styles.pulsingBadgeContainer}>
        {/* Cercle de lueur animé */}
        <Animated.View
          style={[
            styles.badgeGlow,
            { 
              backgroundColor: '#ef4444',
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            }
          ]}
        />
        {/* Badge avec animation d'échelle - uniquement le nombre */}
        <Animated.View style={[
          styles.folderBadge, 
          styles.urgentBadge,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <Text style={styles.folderBadgeText}>{count}</Text>
        </Animated.View>
      </View>
    );
  }

  // Badge non-urgent (gris, sans animation) - uniquement le nombre si > 0
  if (count > 0) {
    return (
      <View style={[styles.folderBadge, styles.waitingBadge]}>
        <Text style={[styles.folderBadgeText, { color: '#64748b' }]}>{count}</Text>
      </View>
    );
  }
  
  // Aucune carte en attente - pas de badge
  return null;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckStats, setDeckStats] = useState<Record<string, EnhancedDeckStats>>(({}));
  const [studyTimeStats, setStudyTimeStats] = useState<Record<string, StudyTimeStats>>({});
  const [todayReviews, setTodayReviews] = useState(0);
  const [newCardsToday, setNewCardsToday] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const loadData = async () => {
    try {
      await initDatabase();
      const allDecks = await getAllDecks();
      setDecks(allDecks);

      const stats: Record<string, EnhancedDeckStats> = {};
      for (const deck of allDecks) {
        const deckStat = await getEnhancedDeckStats(deck.id);
        stats[deck.id] = deckStat;
      }
      setDeckStats(stats);
      
      // Charger les statistiques de temps personnalisées
      const timeStatsList = await getAllStudyTimeStats();
      const timeStatsMap: Record<string, StudyTimeStats> = {};
      timeStatsList.forEach(stat => {
        timeStatsMap[stat.deckId] = stat;
      });
      setStudyTimeStats(timeStatsMap);

      const todayCount = await getTodayReviewCount();
      setTodayReviews(todayCount);
      
      const newCardsCount = await getNewCardsLearnedToday();
      setNewCardsToday(newCardsCount);
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

  // Gestion du bouton retour Android : ferme le folder si ouvert
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (selectedSubject) {
          setSelectedSubject(null);
          NavigationState.clear(); // Nettoyer pour ne pas revenir à ce sujet automatiquement
          return true; // Événement géré, ne pas quitter l'app
        }
        return false; // Comportement par défaut (quitter l'app)
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [selectedSubject])
  );

  // Restaurer le dernier sujet sélectionné quand on revient sur l'écran (swipe back inclus)
  useFocusEffect(
    useCallback(() => {
      // Petit délai pour s'assurer que la transition de navigation est terminée
      const timer = setTimeout(() => {
        const lastSubject = NavigationState.getLastSubject();
        if (lastSubject) {
          setSelectedSubject(lastSubject);
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }, [navigation])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Gestion du clic sur un deck
  const handleDeckPress = async (deck: Deck) => {
    const stats = deckStats[deck.id];
    if (!stats) return;

    // Si le deck a des cartes dues → mode révision SRS
    if (stats.due > 0) {
      navigation.navigate('Review', { deckId: deck.id, mode: 'review' });
      return;
    }

    // Si le deck n'a jamais été commencé
    if (!stats.hasBeenStarted) {
      // Vérifier si on a dépassé la limite de nouvelles cartes aujourd'hui
      const remainingNewCards = DAILY_NEW_CARDS_LIMIT - newCardsToday;
      
      if (remainingNewCards <= 0) {
        // Limite atteinte → mode exploration seulement
        Alert.alert(
          'Limite quotidienne atteinte',
          `Tu as déjà ajouté ${DAILY_NEW_CARDS_LIMIT} nouvelles cartes aujourd'hui. Reviens demain ou explore ce chapitre sans mode apprentissage.`,
          [
            { text: 'Explorer', onPress: () => navigation.navigate('Review', { deckId: deck.id, mode: 'practice' }) }
          ]
        );
        return;
      }

      // Initialiser le deck pour l'apprentissage (créer les états SRS)
      const initializedCount = await initializeDeckForLearning(deck.id, remainingNewCards);
      
      if (initializedCount > 0) {
        // Recharger les stats pour mettre à jour l'affichage
        await loadData();
        // Ouvrir en mode réview (les cartes sont maintenant dues)
        navigation.navigate('Review', { deckId: deck.id, mode: 'review' });
      } else {
        // Fallback
        navigation.navigate('Review', { deckId: deck.id, mode: 'practice' });
      }
      return;
    }

    // Deck commencé mais pas de cartes dues → mode exploration
    navigation.navigate('Review', { deckId: deck.id, mode: 'practice' });
  };

  // Regroupe les decks par matière
  const decksBySubject = useMemo(() => {
    const grouped: Record<Subject, Deck[]> = {
      'maths': [],
      'francais': [],
      'histoire-geo': [],
      'svt': [],
      'physique-chimie': [],
      'technologie': [],
      'anglais': [],
    };
    
    decks.forEach(deck => {
      if (grouped[deck.subject]) {
        grouped[deck.subject].push(deck);
      }
    });
    
    return grouped;
  }, [decks]);

  // Calcule les stats agrégées par matière (3 couleurs + urgent)
  const subjectStats = useMemo(() => {
    const stats: Record<Subject, { total: number; unseen: number; learning: number; mature: number; due: number; deckCount: number }> = {} as any;
    
    (Object.keys(decksBySubject) as Subject[]).forEach(subject => {
      const subjectDecks = decksBySubject[subject];
      let total = 0, unseen = 0, learning = 0, mature = 0, due = 0;
      
      subjectDecks.forEach(deck => {
        const deckStat = deckStats[deck.id];
        if (deckStat) {
          total += deckStat.total;
          unseen += deckStat.unseen;
          due += deckStat.due;
          // Learning = cartes vues mais répétitions < 3 (new + learning)
          learning += deckStat.new + deckStat.learning;
          // Mature = cartes validées 3 fois ou plus
          mature += deckStat.review;
        }
      });
      
      stats[subject] = {
        total,
        unseen,
        learning,
        mature,
        due,
        deckCount: subjectDecks.length,
      };
    });
    
    return stats;
  }, [decksBySubject, deckStats]);

  // Matières qui ont au moins un deck
  const availableSubjects = useMemo(() => {
    return (Object.keys(decksBySubject) as Subject[]).filter(
      subject => decksBySubject[subject].length > 0
    );
  }, [decksBySubject]);

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
      {/* Header avec titre de l'app */}
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>DNB FlashCards</Text>
        <Text style={styles.appSubtitle}>Brevet des Collèges</Text>
      </View>

      {/* Indicateur de matière si on est dans un folder */}
      {selectedSubject && (
        <View style={styles.breadcrumb}>
          <View style={[styles.subjectIndicator, { backgroundColor: SUBJECT_COLORS[selectedSubject] }]}>
            <MaterialCommunityIcons 
              name={SUBJECT_ICONS[selectedSubject] as any} 
              size={16} 
              color="#fff" 
            />
            <Text style={styles.subjectIndicatorText}>
              {SUBJECT_LABELS[selectedSubject]}
            </Text>
          </View>
        </View>
      )}

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
        ) : selectedSubject ? (
          // NIVEAU 2 : Affiche les decks de la matière sélectionnée
          <View>
            {/* Bouton spécial : Réviser toute la matière */}
            {(() => {
              const subjectDeckList = decksBySubject[selectedSubject];
              let totalDue = 0;
              
              subjectDeckList.forEach(deck => {
                const stats = deckStats[deck.id];
                if (stats) {
                  totalDue += stats.due;
                }
              });
              const hasCardsToReview = totalDue > 0;
              
              // Compter les chapitres non commencés dans cette matière
              const unstartedDecks = subjectDeckList.filter(deck => {
                const stats = deckStats[deck.id];
                return stats && !stats.hasBeenStarted && stats.total > 0;
              }).length;
              
              // Calcule le temps jusqu'à la prochaine révision dans cette matière
              const getNextReviewTime = (): string => {
                let nextTime: number | null = null;
                subjectDeckList.forEach(deck => {
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

              // Formatage du message selon la situation
              const getStatusMessage = () => {
                if (totalDue > 0) {
                  return `${totalDue} carte${totalDue > 1 ? 's' : ''} en attente`;
                }
                if (unstartedDecks > 0) {
                  return `${unstartedDecks} chapitre${unstartedDecks > 1 ? 's' : ''} à découvrir`;
                }
                return `Reviens ${getNextReviewTime()} pour réviser`;
              };
              
              // Titre du bouton selon la situation
              const getStatusTitle = () => {
                if (totalDue > 0) {
                  return 'Réviser tout';
                }
                if (unstartedDecks > 0) {
                  return 'Nouveaux chapitres !';
                }
                return `Reviens ${getNextReviewTime()}`;
              };
              
              return (
                <TouchableOpacity
                  style={[
                    styles.reviewAllButton,
                    !hasCardsToReview && unstartedDecks === 0 && styles.reviewAllButtonDisabled,
                    !hasCardsToReview && unstartedDecks > 0 && { backgroundColor: '#e0f2fe' }
                  ]}
                  onPress={() => {
                    if (hasCardsToReview && selectedSubject) {
                      navigation.navigate('Review', { subjectId: selectedSubject, mode: 'review' });
                    }
                  }}
                  activeOpacity={hasCardsToReview ? 0.8 : 1}
                  disabled={!hasCardsToReview}
                >
                  <View style={styles.reviewAllContent}>
                    <MaterialCommunityIcons 
                      name={hasCardsToReview ? "play-circle" : unstartedDecks > 0 ? "rocket-launch" : "clock-outline"} 
                      size={32} 
                      color={hasCardsToReview ? "#fff" : unstartedDecks > 0 ? "#06b6d4" : "#94a3b8"} 
                    />
                    <View style={styles.reviewAllTextContainer}>
                      <Text style={[
                        styles.reviewAllTitle,
                        !hasCardsToReview && unstartedDecks === 0 && styles.reviewAllTitleDisabled,
                        !hasCardsToReview && unstartedDecks > 0 && { color: '#0891b2' } // Cyan foncé pour fond clair
                      ]}>
                        {getStatusTitle()}
                      </Text>
                      <Text style={[
                        styles.reviewAllSubtitle,
                        !hasCardsToReview && unstartedDecks === 0 && styles.reviewAllSubtitleDisabled,
                        !hasCardsToReview && unstartedDecks > 0 && { color: '#0e7490' } // Cyan moyen pour fond clair
                      ]}>
                        {getStatusMessage()}
                      </Text>
                    </View>
                  </View>
                  {hasCardsToReview && totalDue > 0 && (
                    <View style={styles.reviewAllUrgentBadge}>
                      <Text style={styles.reviewAllUrgentText}>{totalDue}</Text>
                    </View>
                  )}
                  <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={24} 
                    color={hasCardsToReview ? "#fff" : unstartedDecks > 0 ? "#06b6d4" : "#94a3b8"} 
                  />
                </TouchableOpacity>
              );
            })()}
            
            <Text style={styles.sectionTitle}>
              Chapitres ({decksBySubject[selectedSubject].length})
            </Text>
            {decksBySubject[selectedSubject].map((deck) => {
              const stats = deckStats[deck.id];
              
              return (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  stats={stats || { total: 0, due: 0, new: 0, unseen: 0, learning: 0, review: 0, sleeping: 0, maturePercent: 0, nextReviewDate: null, hasBeenStarted: false, isMastered: false, discoveryCount: 0 }}
                  onPress={() => handleDeckPress(deck)}
                />
              );
            })}
          </View>
        ) : (
          // NIVEAU 1 : Affiche les matières (folders)
          <View>
            {/* Indicateur de charge de travail global */}
            <WorkloadIndicator 
              deckStats={deckStats}
              todayReviewCount={todayReviews}
              dailyGoal={20}
              studyTimeStats={studyTimeStats}
            />
            
            {/* Recommandations du jour */}
            <DailyRecommendations
              decks={decks}
              deckStats={deckStats}
              studyTimeStats={studyTimeStats}
              onDeckPress={handleDeckPress}
            />
            
            <Text style={styles.sectionTitle}>Explorer par matière</Text>
            <View style={styles.subjectsGrid}>
              {availableSubjects.map((subject) => {
                const stats = subjectStats[subject];
                const hasDueCards = stats.due > 0;
                const total = stats.total || 1; // éviter division par zéro
                
                // Calcul des pourcentages pour la jauge (3 couleurs)
                const learningPercent = (stats.learning / total) * 100;
                const maturePercent = (stats.mature / total) * 100;
                const unseenPercent = (stats.unseen / total) * 100;
                
                return (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.subjectFolder,
                      !hasDueCards && styles.subjectFolderInactive
                    ]}
                    onPress={() => setSelectedSubject(subject)}
                    activeOpacity={0.8}
                  >
                    {/* Ligne principale : Icône + Nom + Badge si révision due */}
                    <View style={styles.folderHeader}>
                      <View style={[styles.folderIcon, { backgroundColor: SUBJECT_COLORS[subject] }]}>
                        <MaterialCommunityIcons 
                          name={SUBJECT_ICONS[subject] as any} 
                          size={22} 
                          color="#fff" 
                        />
                      </View>
                      
                      <Text style={[
                        styles.folderName, 
                        !hasDueCards && styles.folderNameInactive
                      ]} numberOfLines={1}>
                        {SUBJECT_LABELS[subject]}
                      </Text>
                      
                      <View style={styles.badgesContainer}>
                        {/* Badge animé si cartes dues, sinon badge gris */}
                        <PulsingFolderBadge 
                          count={stats.due}
                          isPulsing={hasDueCards}
                        />
                      </View>
                    </View>
                    
                    {/* Jauge de progression 3 couleurs */}
                    {stats.total > 0 && (
                      <View style={styles.progressBarContainer}>
                        <View style={[
                          styles.progressBar,
                          !hasDueCards && styles.progressBarInactive
                        ]}>
                          {/* Cartes jamais faites - gris */}
                          {unseenPercent > 0 && (
                            <View style={[
                              styles.progressSegment, 
                              { 
                                backgroundColor: !hasDueCards ? '#cbd5e1' : '#94a3b8', 
                                width: `${unseenPercent}%` 
                              }
                            ]} />
                          )}
                          {/* Cartes en cours d'apprentissage - orange */}
                          {learningPercent > 0 && (
                            <View style={[
                              styles.progressSegment, 
                              { 
                                backgroundColor: !hasDueCards ? '#fcd34d' : '#f59e0b', 
                                width: `${learningPercent}%` 
                              }
                            ]} />
                          )}
                          {/* Cartes maîtrisées - vert */}
                          {maturePercent > 0 && (
                            <View style={[
                              styles.progressSegment, 
                              { 
                                backgroundColor: !hasDueCards ? '#86efac' : '#22c55e', 
                                width: `${maturePercent}%` 
                              }
                            ]} />
                          )}
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
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

  // Breadcrumb et navigation
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#e0e5ec',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d9e6',
  },

  subjectIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  subjectIndicatorText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  decksList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  
  // Bouton "Réviser tout"
  reviewAllButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  reviewAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewAllTextContainer: {
    marginLeft: 12,
  },
  reviewAllTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  reviewAllSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  reviewAllUrgentBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  reviewAllUrgentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewAllButtonDisabled: {
    backgroundColor: '#d1d9e6',
    shadowColor: '#a3b1c6',
    shadowOpacity: 0.2,
  },
  reviewAllTitleDisabled: {
    color: '#64748b',
  },
  reviewAllSubtitleDisabled: {
    color: '#94a3b8',
  },
  // Grille des matières (folders) - VERSION COMPACTE
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  subjectFolder: {
    width: '48%',
    backgroundColor: '#e0e5ec',
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  subjectFolderInactive: {
    backgroundColor: '#e6ebf2',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  folderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  folderName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  folderNameInactive: {
    color: '#64748b',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Badge avec animation pulse
  pulsingBadgeContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeGlow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  folderBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  urgentBadge: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  waitingBadge: {
    backgroundColor: '#e0e5ec',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  folderBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Jauge de progression
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#d1d9e6',
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressBarInactive: {
    backgroundColor: '#d8dde6',
  },
  progressSegment: {
    height: '100%',
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
  
  // Nouveau header compact
  appHeader: {
    backgroundColor: '#e0e5ec',
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
});
