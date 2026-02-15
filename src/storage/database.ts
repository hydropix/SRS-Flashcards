/**
 * Gestion de la base de données SQLite locale
 * Stocke les cartes, les états SRS et les logs de révision
 */

import * as SQLite from 'expo-sqlite';
import { Card, Deck, SRSCardState, ReviewLog, Subject, EnhancedDeckStats, StudyTimeStats, DEFAULT_TIME_PER_CARD_SECONDS } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialise la base de données et crée les tables
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('dnb_flashcards.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT,
      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      is_builtin INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      explanation TEXT,
      image_url TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS srs_states (
      card_id TEXT PRIMARY KEY,
      ease_factor REAL NOT NULL DEFAULT 2.5,
      interval INTEGER NOT NULL DEFAULT 0,
      repetitions INTEGER NOT NULL DEFAULT 0,
      due_date INTEGER NOT NULL,
      is_new INTEGER DEFAULT 1,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS review_logs (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      rating TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      response_time_ms INTEGER,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_cards_deck ON cards(deck_id);
    CREATE INDEX IF NOT EXISTS idx_srs_due ON srs_states(due_date);
    CREATE INDEX IF NOT EXISTS idx_logs_card ON review_logs(card_id);
    CREATE INDEX IF NOT EXISTS idx_logs_date ON review_logs(timestamp);
    
    -- Table pour les statistiques de temps personnalisées
    CREATE TABLE IF NOT EXISTS study_time_stats (
      deck_id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      avg_time_per_card_seconds REAL DEFAULT ${DEFAULT_TIME_PER_CARD_SECONDS},
      total_reviews INTEGER DEFAULT 0,
      last_updated INTEGER NOT NULL,
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_study_time_subject ON study_time_stats(subject);
  `);
  
  console.log('✅ Base de données initialisée');
  return db;
}

/**
 * Ferme la connexion à la base de données
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

// ==================== DECKS ====================

export async function createDeck(deck: Deck): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO decks (id, name, subject, description, color, icon, is_builtin, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    deck.id,
    deck.name,
    deck.subject,
    deck.description || null,
    deck.color,
    deck.icon,
    deck.isBuiltin ? 1 : 0,
    deck.createdAt
  );
}

export async function getAllDecks(): Promise<Deck[]> {
  const database = await initDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM decks ORDER BY created_at DESC'
  );
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    subject: row.subject as Subject,
    description: row.description,
    color: row.color,
    icon: row.icon,
    isBuiltin: row.is_builtin === 1,
    createdAt: row.created_at,
  }));
}

export async function getDeckById(deckId: string): Promise<Deck | null> {
  const database = await initDatabase();
  const row = await database.getFirstAsync<any>(
    'SELECT * FROM decks WHERE id = ?',
    deckId
  );
  
  if (!row) return null;
  
  return {
    id: row.id,
    name: row.name,
    subject: row.subject as Subject,
    description: row.description,
    color: row.color,
    icon: row.icon,
    isBuiltin: row.is_builtin === 1,
    createdAt: row.created_at,
  };
}

export async function deleteDeck(deckId: string): Promise<void> {
  const database = await initDatabase();
  await database.runAsync('DELETE FROM decks WHERE id = ?', deckId);
}

export async function getDecksBySubject(subject: Subject): Promise<Deck[]> {
  const database = await initDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM decks WHERE subject = ? ORDER BY name',
    subject
  );
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    subject: row.subject as Subject,
    description: row.description,
    color: row.color,
    icon: row.icon,
    isBuiltin: row.is_builtin === 1,
    createdAt: row.created_at,
  }));
}

export async function getCardCountByDeck(deckId: string): Promise<number> {
  const database = await initDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM cards WHERE deck_id = ?',
    deckId
  );
  return result?.count || 0;
}

export async function getAllCards(): Promise<Card[]> {
  const database = await initDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM cards');
  
  return rows.map(row => ({
    id: row.id,
    deckId: row.deck_id,
    question: row.question,
    answer: row.answer,
    explanation: row.explanation,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

// ==================== CARDS ====================

export async function createCard(card: Card): Promise<void> {
  const database = await initDatabase();
  
  await database.runAsync(
    `INSERT OR REPLACE INTO cards (id, deck_id, question, answer, explanation, image_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    card.id,
    card.deckId,
    card.question,
    card.answer,
    card.explanation || null,
    card.imageUrl || null,
    card.createdAt,
    card.updatedAt
  );
}

export async function getCardsByDeck(deckId: string): Promise<Card[]> {
  const database = await initDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM cards WHERE deck_id = ? ORDER BY created_at DESC',
    deckId
  );
  
  return rows.map(row => ({
    id: row.id,
    deckId: row.deck_id,
    question: row.question,
    answer: row.answer,
    explanation: row.explanation,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getCardById(cardId: string): Promise<Card | null> {
  const database = await initDatabase();
  const row = await database.getFirstAsync<any>(
    'SELECT * FROM cards WHERE id = ?',
    cardId
  );
  
  if (!row) return null;
  
  return {
    id: row.id,
    deckId: row.deck_id,
    question: row.question,
    answer: row.answer,
    explanation: row.explanation,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function deleteCard(cardId: string): Promise<void> {
  const database = await initDatabase();
  await database.runAsync('DELETE FROM cards WHERE id = ?', cardId);
}

// ==================== SRS STATES ====================

export async function saveSRSState(state: SRSCardState): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO srs_states 
     (card_id, ease_factor, interval, repetitions, due_date, is_new)
     VALUES (?, ?, ?, ?, ?, ?)`,
    state.cardId,
    state.easeFactor,
    state.interval,
    state.repetitions,
    state.dueDate,
    state.isNew ? 1 : 0
  );
}

export async function getSRSState(cardId: string): Promise<SRSCardState | null> {
  const database = await initDatabase();
  const row = await database.getFirstAsync<any>(
    'SELECT * FROM srs_states WHERE card_id = ?',
    cardId
  );
  
  if (!row) return null;
  
  return {
    cardId: row.card_id,
    easeFactor: row.ease_factor,
    interval: row.interval,
    repetitions: row.repetitions,
    dueDate: row.due_date,
    isNew: row.is_new === 1,
  };
}

export async function getAllSRSStates(): Promise<SRSCardState[]> {
  const database = await initDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM srs_states');
  
  return rows.map(row => ({
    cardId: row.card_id,
    easeFactor: row.ease_factor,
    interval: row.interval,
    repetitions: row.repetitions,
    dueDate: row.due_date,
    isNew: row.is_new === 1,
  }));
}

export async function getDueCardsForDeck(deckId: string): Promise<string[]> {
  const database = await initDatabase();
  const now = Date.now();
  
  const rows = await database.getAllAsync<{ card_id: string }>(
    `SELECT s.card_id 
     FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     WHERE c.deck_id = ? AND s.due_date <= ?
     ORDER BY s.due_date ASC`,
    deckId,
    now
  );
  
  return rows.map(r => r.card_id);
}

/**
 * Récupère les cartes à réviser pour une matière entière
 * Centralise la logique pour éviter les incohérences
 */
export async function getDueCardsForSubject(subject: Subject): Promise<string[]> {
  const database = await initDatabase();
  const now = Date.now();
  
  const rows = await database.getAllAsync<{ card_id: string }>(
    `SELECT s.card_id 
     FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     JOIN decks d ON c.deck_id = d.id
     WHERE d.subject = ? AND s.due_date <= ?
     ORDER BY s.due_date ASC
     LIMIT 20`,
    subject,
    now
  );
  
  return rows.map(r => r.card_id);
}

/**
 * Récupère les stats complètes d'une matière
 * Source unique de vérité pour HomeScreen et ReviewScreen
 */
export async function getSubjectStats(subject: Subject): Promise<{
  total: number;
  unseen: number;
  due: number;
  learning: number;
  mature: number;
  deckCount: number;
  nextReviewDate: number | null;
}> {
  const database = await initDatabase();
  const now = Date.now();
  
  // Récupérer tous les decks de la matière
  const decks = await getDecksBySubject(subject);
  const deckIds = decks.map(d => d.id);
  
  if (deckIds.length === 0) {
    return { total: 0, unseen: 0, due: 0, learning: 0, mature: 0, deckCount: 0, nextReviewDate: null };
  }
  
  // Construire la clause IN pour la requête
  const placeholders = deckIds.map(() => '?').join(',');
  
  // Total des cartes
  const totalResult = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM cards WHERE deck_id IN (${placeholders})`,
    ...deckIds
  );
  
  // Cartes jamais vues
  const unseenResult = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM cards 
     WHERE deck_id IN (${placeholders}) 
     AND id NOT IN (SELECT card_id FROM srs_states)`,
    ...deckIds
  );
  
  // Cartes dues (disponibles maintenant)
  const dueResult = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     WHERE c.deck_id IN (${placeholders}) AND s.due_date <= ?`,
    ...deckIds,
    now
  );
  
  // Cartes en learning (vues, répétitions < 3, date future)
  const learningResult = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     WHERE c.deck_id IN (${placeholders}) 
     AND s.is_new = 0 AND s.repetitions < 3 AND s.due_date > ?`,
    ...deckIds,
    now
  );
  
  // Cartes matures (répétitions >= 3)
  const matureResult = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     WHERE c.deck_id IN (${placeholders}) AND s.repetitions >= 3`,
    ...deckIds
  );
  
  // Prochaine date de révision
  const nextReviewResult = await database.getFirstAsync<{ due_date: number }>(
    `SELECT MIN(s.due_date) as due_date FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     WHERE c.deck_id IN (${placeholders}) AND s.due_date > ?`,
    ...deckIds,
    now
  );
  
  return {
    total: totalResult?.count || 0,
    unseen: unseenResult?.count || 0,
    due: dueResult?.count || 0,
    learning: learningResult?.count || 0,
    mature: matureResult?.count || 0,
    deckCount: decks.length,
    nextReviewDate: nextReviewResult?.due_date || null,
  };
}

export async function getNewCardsForDeck(deckId: string, limit: number = 20): Promise<string[]> {
  const database = await initDatabase();
  
  const rows = await database.getAllAsync<{ id: string }>(
    `SELECT c.id 
     FROM cards c
     LEFT JOIN srs_states s ON c.id = s.card_id
     WHERE c.deck_id = ? AND (s.card_id IS NULL OR s.is_new = 1)
     LIMIT ?`,
    deckId,
    limit
  );
  
  return rows.map(r => r.id);
}

// ==================== REVIEW LOGS ====================

export async function logReview(log: ReviewLog): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    `INSERT INTO review_logs (id, card_id, rating, timestamp, response_time_ms)
     VALUES (?, ?, ?, ?, ?)`,
    log.id,
    log.cardId,
    log.rating,
    log.timestamp,
    log.responseTimeMs || null
  );
}

export async function getTodayReviewCount(): Promise<number> {
  const database = await initDatabase();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM review_logs WHERE timestamp >= ?',
    startOfDay.getTime()
  );
  
  return result?.count || 0;
}

export async function getReviewStatsForPeriod(days: number): Promise<{ date: string; count: number }[]> {
  const database = await initDatabase();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  
  const rows = await database.getAllAsync<{ date: string; count: number }>(
    `SELECT 
      date(timestamp / 1000, 'unixepoch', 'localtime') as date,
      COUNT(*) as count
     FROM review_logs 
     WHERE timestamp >= ?
     GROUP BY date
     ORDER BY date DESC`,
    startDate.getTime()
  );
  
  return rows;
}

// ==================== STATS ====================

export async function getDeckStats(deckId: string): Promise<{
  total: number;
  unseen: number;
  new: number;
  learning: number;
  review: number;
  due: number;
}> {
  const database = await initDatabase();
  const now = Date.now();
  
  const total = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM cards WHERE deck_id = ?',
    deckId
  );
  
  // Cartes jamais vues (pas d'état SRS)
  let unseenCount = 0;
  try {
    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM cards
       WHERE deck_id = ? AND id NOT IN (SELECT card_id FROM srs_states)`,
      deckId
    );
    unseenCount = result?.count || 0;
  } catch (e) {
    unseenCount = 0;
  }
  
  // Cartes vues mais encore considérées comme nouvelles (is_new = 1)
  let newCount = 0;
  try {
    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM srs_states
       WHERE card_id IN (SELECT id FROM cards WHERE deck_id = ?) AND is_new = 1`,
      deckId
    );
    newCount = result?.count || 0;
  } catch (e) {
    newCount = 0;
  }
  
  let learningCount = 0;
  try {
    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM srs_states
       WHERE card_id IN (SELECT id FROM cards WHERE deck_id = ?) AND is_new = 0 AND repetitions < 3`,
      deckId
    );
    learningCount = result?.count || 0;
  } catch (e) {
    learningCount = 0;
  }
  
  let reviewCount = 0;
  try {
    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM srs_states
       WHERE card_id IN (SELECT id FROM cards WHERE deck_id = ?) AND repetitions >= 3`,
      deckId
    );
    reviewCount = result?.count || 0;
  } catch (e) {
    reviewCount = 0;
  }
  
  // Cartes disponibles maintenant (due_date <= now, toutes catégories)
  let dueCount = 0;
  try {
    const result = await database.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM srs_states
       WHERE card_id IN (SELECT id FROM cards WHERE deck_id = ?) AND due_date <= ?`,
      deckId,
      now
    );
    dueCount = result?.count || 0;
  } catch (e) {
    dueCount = 0;
  }
  
  return {
    total: total?.count || 0,
    unseen: unseenCount,
    new: newCount,
    learning: learningCount,
    review: reviewCount,
    due: dueCount,
  };
}

/**
 * Récupère les statistiques enrichies d'un deck pour le système de 4 états
 * 
 * ÉTATS :
 * 1. 🔒 JAMAIS COMMENCÉ : unseen === total
 * 2. 📖 EN DÉCOUVERTE : hasBeenStarted && !isMastered && (due > 0 || discoveryCount > 0)
 * 3. ⏳ EN SOMMEIL : hasBeenStarted && due === 0 && !isMastered
 * 4. ✅ MAÎTRISÉ : isMastered (maturePercent >= 80)
 */
export async function getEnhancedDeckStats(deckId: string): Promise<EnhancedDeckStats> {
  const database = await initDatabase();
  const now = Date.now();
  
  // Total des cartes
  const totalResult = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM cards WHERE deck_id = ?',
    deckId
  );
  const total = totalResult?.count || 0;
  
  if (total === 0) {
    return {
      total: 0, unseen: 0, new: 0, learning: 0, review: 0, due: 0, sleeping: 0,
      maturePercent: 0, nextReviewDate: null, hasBeenStarted: false, 
      isMastered: false, discoveryCount: 0
    };
  }
  
  // Cartes jamais vues (pas d'état SRS)
  const unseenResult = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM cards
     WHERE deck_id = ? AND id NOT IN (SELECT card_id FROM srs_states)`,
    deckId
  );
  const unseen = unseenResult?.count || 0;
  
  // Cartes avec état SRS
  const srsStats = await database.getFirstAsync<{
    new_count: number;
    learning_count: number;
    review_count: number;
    due_count: number;
    sleeping_count: number;
    mature_count: number;
  }>(
    `SELECT 
      SUM(CASE WHEN is_new = 1 THEN 1 ELSE 0 END) as new_count,
      SUM(CASE WHEN is_new = 0 AND repetitions < 3 THEN 1 ELSE 0 END) as learning_count,
      SUM(CASE WHEN repetitions >= 3 THEN 1 ELSE 0 END) as review_count,
      SUM(CASE WHEN due_date <= ? THEN 1 ELSE 0 END) as due_count,
      SUM(CASE WHEN due_date > ? THEN 1 ELSE 0 END) as sleeping_count,
      SUM(CASE WHEN repetitions >= 3 AND due_date > ? THEN 1 ELSE 0 END) as mature_count
     FROM srs_states
     WHERE card_id IN (SELECT id FROM cards WHERE deck_id = ?)`,
    now, now, now, deckId
  );
  
  const newCount = srsStats?.new_count || 0;
  const learning = srsStats?.learning_count || 0;
  const review = srsStats?.review_count || 0;
  const due = srsStats?.due_count || 0;
  const sleeping = srsStats?.sleeping_count || 0;
  
  // Prochaine date de révision (parmi les cartes non dues)
  const nextReviewResult = await database.getFirstAsync<{ due_date: number }>(
    `SELECT MIN(due_date) as due_date FROM srs_states
     WHERE card_id IN (SELECT id FROM cards WHERE deck_id = ?) AND due_date > ?`,
    deckId, now
  );
  
  // Calculs dérivés
  const seenCards = total - unseen;
  const maturePercent = seenCards > 0 ? Math.round((review / seenCards) * 100) : 0;
  const hasBeenStarted = seenCards > 0;
  const isMastered = seenCards > 0 && maturePercent >= 80;
  const discoveryCount = unseen + newCount;
  
  return {
    total,
    unseen,
    new: newCount,
    learning,
    review,
    due,
    sleeping,
    maturePercent,
    nextReviewDate: nextReviewResult?.due_date || null,
    hasBeenStarted,
    isMastered,
    discoveryCount,
  };
}

/**
 * Compte le nombre de nouvelles cartes initialisées aujourd'hui
 * (états SRS créés aujourd'hui avec is_new = 1)
 */
export async function getNewCardsLearnedToday(): Promise<number> {
  const database = await initDatabase();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  // Compter les états SRS créés aujourd'hui avec is_new = 1
  // On considère qu'une carte est "nouvelle" si son état a été créé aujourd'hui
  // et qu'elle n'a pas encore été révisée (pas de log)
  const result = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM srs_states 
     WHERE is_new = 1 
     AND card_id IN (
       SELECT card_id FROM review_logs 
       WHERE timestamp >= ?
     )`,
    startOfDay.getTime()
  );
  
  return result?.count || 0;
}

/**
 * Initialise un deck pour l'apprentissage en créant les états SRS
 * pour les cartes qui n'en ont pas encore.
 * 
 * @param deckId ID du deck à initialiser
 * @param limit Nombre maximum de cartes à initialiser
 * @returns Nombre de cartes initialisées
 */
export async function initializeDeckForLearning(deckId: string, limit: number): Promise<number> {
  const database = await initDatabase();
  const now = Date.now();
  
  // Récupérer les cartes du deck qui n'ont pas encore d'état SRS
  const cardsWithoutState = await database.getAllAsync<{ id: string }>(
    `SELECT c.id FROM cards c
     WHERE c.deck_id = ? 
     AND c.id NOT IN (SELECT card_id FROM srs_states)
     LIMIT ?`,
    deckId,
    limit
  );
  
  if (cardsWithoutState.length === 0) {
    return 0;
  }
  
  // Créer les états SRS pour ces cartes
  for (const card of cardsWithoutState) {
    await database.runAsync(
      `INSERT INTO srs_states (card_id, ease_factor, interval, repetitions, due_date, is_new)
       VALUES (?, 2.5, 0, 0, ?, 1)`,
      card.id,
      now // Due immédiatement
    );
  }
  
  console.log(`✅ Initialisé ${cardsWithoutState.length} cartes pour le deck ${deckId}`);
  return cardsWithoutState.length;
}

/**
 * Met à jour les statistiques de temps pour un deck
 * Calcule le temps moyen par carte basé sur l'historique des révisions
 */
export async function updateStudyTimeStats(deckId: string, subject: Subject): Promise<void> {
  const database = await initDatabase();
  
  // Calculer le temps moyen pour ce deck
  const result = await database.getFirstAsync<{
    avg_time: number;
    count: number;
  }>(
    `SELECT 
      AVG(response_time_ms) as avg_time,
      COUNT(*) as count
     FROM review_logs
     WHERE card_id IN (SELECT id FROM cards WHERE deck_id = ?)
     AND response_time_ms IS NOT NULL
     AND response_time_ms > 0
     AND response_time_ms < 300000`,
    deckId
  );
  
  if (result && result.avg_time !== null && result.count >= 3) {
    // Convertir ms en secondes
    const avgTimeSeconds = Math.round(result.avg_time / 1000);
    
    // Limiter entre 10s et 120s
    const clampedTime = Math.max(10, Math.min(120, avgTimeSeconds));
    
    await database.runAsync(
      `INSERT OR REPLACE INTO study_time_stats 
       (deck_id, subject, avg_time_per_card_seconds, total_reviews, last_updated)
       VALUES (?, ?, ?, ?, ?)`,
      deckId,
      subject,
      clampedTime,
      result.count,
      Date.now()
    );
    
    console.log(`⏱️ Stats temps mises à jour pour ${deckId}: ${clampedTime}s/carte (${result.count} révisions)`);
  }
}

/**
 * Récupère les statistiques de temps pour un deck
 * Retourne la valeur par défaut si pas encore de données
 */
export async function getStudyTimeStats(deckId: string, subject: Subject): Promise<StudyTimeStats> {
  const database = await initDatabase();
  
  const row = await database.getFirstAsync<{
    deck_id: string;
    subject: string;
    avg_time_per_card_seconds: number;
    total_reviews: number;
    last_updated: number;
  }>(
    'SELECT * FROM study_time_stats WHERE deck_id = ?',
    deckId
  );
  
  if (row) {
    return {
      deckId: row.deck_id,
      subject: row.subject as Subject,
      avgTimePerCardSeconds: row.avg_time_per_card_seconds,
      totalReviews: row.total_reviews,
      lastUpdated: row.last_updated,
    };
  }
  
  // Retourner les valeurs par défaut
  return {
    deckId,
    subject,
    avgTimePerCardSeconds: DEFAULT_TIME_PER_CARD_SECONDS,
    totalReviews: 0,
    lastUpdated: Date.now(),
  };
}

/**
 * Récupère le temps moyen par carte pour une matière entière
 * Moyenne pondérée des decks de cette matière
 */
export async function getSubjectAverageTime(subject: Subject): Promise<number> {
  const database = await initDatabase();
  
  const result = await database.getFirstAsync<{
    weighted_avg: number;
    total_reviews: number;
  }>(
    `SELECT 
      SUM(avg_time_per_card_seconds * total_reviews) / SUM(total_reviews) as weighted_avg,
      SUM(total_reviews) as total_reviews
     FROM study_time_stats
     WHERE subject = ? AND total_reviews > 0`,
    subject
  );
  
  if (result && result.weighted_avg !== null && result.total_reviews >= 3) {
    return Math.round(result.weighted_avg);
  }
  
  return DEFAULT_TIME_PER_CARD_SECONDS;
}

/**
 * Calcule le temps estimé de révision pour une liste de decks
 * Utilise les statistiques personnalisées si disponibles
 */
export async function estimateStudyTimeForDecks(
  deckStats: Record<string, EnhancedDeckStats>,
  getDeckSubject: (deckId: string) => Subject
): Promise<{
  totalMinutes: number;
  breakdown: Record<string, { cards: number; minutes: number; avgTimeSeconds: number }>;
}> {
  const breakdown: Record<string, { cards: number; minutes: number; avgTimeSeconds: number }> = {};
  let totalSeconds = 0;
  
  for (const [deckId, stats] of Object.entries(deckStats)) {
    if (stats.due === 0) continue;
    
    const subject = getDeckSubject(deckId);
    const timeStats = await getStudyTimeStats(deckId, subject);
    
    // Utiliser le temps personnalisé ou la moyenne de la matière
    let avgTimeSeconds = timeStats.avgTimePerCardSeconds;
    if (timeStats.totalReviews < 3) {
      // Pas assez d'historique pour ce deck, utiliser la moyenne de la matière
      avgTimeSeconds = await getSubjectAverageTime(subject);
    }
    
    const deckSeconds = stats.due * avgTimeSeconds;
    totalSeconds += deckSeconds;
    
    breakdown[deckId] = {
      cards: stats.due,
      minutes: Math.ceil(deckSeconds / 60),
      avgTimeSeconds,
    };
  }
  
  return {
    totalMinutes: Math.ceil(totalSeconds / 60),
    breakdown,
  };
}

/**
 * Récupère toutes les statistiques de temps (pour debug/export)
 */
export async function getAllStudyTimeStats(): Promise<StudyTimeStats[]> {
  const database = await initDatabase();
  
  const rows = await database.getAllAsync<{
    deck_id: string;
    subject: string;
    avg_time_per_card_seconds: number;
    total_reviews: number;
    last_updated: number;
  }>('SELECT * FROM study_time_stats ORDER BY subject, deck_id');
  
  return rows.map(row => ({
    deckId: row.deck_id,
    subject: row.subject as Subject,
    avgTimePerCardSeconds: row.avg_time_per_card_seconds,
    totalReviews: row.total_reviews,
    lastUpdated: row.last_updated,
  }));
}

/**
 * Réinitialise toutes les données (pour les tests)
 */
export async function resetDatabase(): Promise<void> {
  const database = await initDatabase();
  await database.execAsync(`
    DELETE FROM review_logs;
    DELETE FROM srs_states;
    DELETE FROM study_time_stats;
    DELETE FROM cards;
    DELETE FROM decks;
  `);
}
