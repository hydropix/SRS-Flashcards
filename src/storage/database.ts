/**
 * Gestion de la base de données SQLite locale
 * Stocke les cartes, les états SRS et les logs de révision
 */

import * as SQLite from 'expo-sqlite';
import { Card, Deck, SRSCardState, ReviewLog, Subject } from '../types';

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

export async function getCardCountByDeck(deckId: string): Promise<number> {
  const database = await initDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM cards WHERE deck_id = ?',
    deckId
  );
  return result?.count || 0;
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
  
  const newCards = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM cards c
     LEFT JOIN srs_states s ON c.id = s.card_id
     WHERE c.deck_id = ? AND (s.card_id IS NULL OR s.is_new = 1)`,
    deckId
  );
  
  const learning = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     WHERE c.deck_id = ? AND s.is_new = 0 AND s.repetitions < 3`,
    deckId
  );
  
  const review = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     WHERE c.deck_id = ? AND s.repetitions >= 3`,
    deckId
  );
  
  const due = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM srs_states s
     JOIN cards c ON s.card_id = c.id
     WHERE c.deck_id = ? AND s.due_date <= ?`,
    deckId,
    now
  );
  
  return {
    total: total?.count || 0,
    new: newCards?.count || 0,
    learning: learning?.count || 0,
    review: review?.count || 0,
    due: due?.count || 0,
  };
}

/**
 * Réinitialise toutes les données (pour les tests)
 */
export async function resetDatabase(): Promise<void> {
  const database = await initDatabase();
  await database.execAsync(`
    DELETE FROM review_logs;
    DELETE FROM srs_states;
    DELETE FROM cards;
    DELETE FROM decks;
  `);
}
