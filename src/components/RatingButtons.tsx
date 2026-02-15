import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReviewRating } from '../types';

interface RatingButtonsProps {
  onRate: (rating: ReviewRating) => void;
  disabled?: boolean;
}

const ratings: { key: ReviewRating; icon: any; color: string }[] = [
  {
    key: 'again',
    icon: 'restart',
    color: '#f87171',
  },
  {
    key: 'hard',
    icon: 'alert-circle',
    color: '#fbbf24',
  },
  {
    key: 'good',
    icon: 'check',
    color: '#60a5fa',
  },
  {
    key: 'easy',
    icon: 'star',
    color: '#34d399',
  },
];

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <View style={styles.container}>
      {ratings.map((rating) => (
        <TouchableOpacity
          key={rating.key}
          style={[
            styles.button,
            disabled && styles.disabled,
          ]}
          onPress={() => onRate(rating.key)}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, { backgroundColor: rating.color + '20' }]}>
            <MaterialCommunityIcons 
              name={rating.icon} 
              size={28} 
              color={rating.color} 
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#e0e5ec',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  disabled: {
    opacity: 0.4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
