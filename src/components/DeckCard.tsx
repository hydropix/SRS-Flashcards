import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Deck } from '../types';

interface DeckCardProps {
  deck: Deck;
  cardCount: number;
  dueCount: number;
  newCount: number;
  onPress: () => void;
}

export function DeckCard({ deck, cardCount, dueCount, newCount, onPress }: DeckCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: deck.color }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{deck.name}</Text>
        {deck.description && (
          <Text style={styles.description} numberOfLines={2}>
            {deck.description}
          </Text>
        )}
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{cardCount}</Text>
            <Text style={styles.statLabel}>cartes</Text>
          </View>
          
          {dueCount > 0 && (
            <View style={styles.statBadge}>
              <Text style={[styles.statValue, { color: deck.color }]}>{dueCount}</Text>
              <Text style={styles.statLabel}>à réviser</Text>
            </View>
          )}
          
          {newCount > 0 && (
            <View style={styles.statBadgeNew}>
              <Text style={[styles.statValue, { color: '#34d399' }]}>{newCount}</Text>
              <Text style={styles.statLabel}>nouvelles</Text>
            </View>
          )}
        </View>
      </View>
      
      {dueCount > 0 && (
        <View style={[styles.badge, { backgroundColor: deck.color }]}>
          <Text style={styles.badgeText}>{dueCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
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
    borderLeftWidth: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: '#e0e5ec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#ffffff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  statBadge: {
    alignItems: 'center',
    backgroundColor: '#e0e5ec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  statBadgeNew: {
    alignItems: 'center',
    backgroundColor: '#e0e5ec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 11,
    color: '#475569',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
