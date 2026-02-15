import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{current}/{total}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginRight: 12,
    minWidth: 45,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e5ec',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  bar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
