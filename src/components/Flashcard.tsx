import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card } from '../types';
import { MathFormula } from './MathFormula';

interface FlashcardProps {
  card: Card;
  onFlip?: () => void;
  revealed: boolean;
}

export function Flashcard({ card, onFlip, revealed }: FlashcardProps) {
  const [flipAnim] = useState(new Animated.Value(0));

  // Réinitialiser l'animation quand la carte change
  useEffect(() => {
    flipAnim.setValue(0);
  }, [card.id]);

  const flipCard = () => {
    // Met à jour l'état immédiatement pour réactivité maximale
    onFlip?.();
    
    Animated.spring(flipAnim, {
      toValue: revealed ? 0 : 180,
      friction: 6,
      tension: 12,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={flipCard} style={styles.container}>
      {/* Face avant - Question */}
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <View style={styles.cardContent}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>QUESTION</Text>
          </View>
          <MathFormula 
            content={card.question} 
            style={styles.question}
            containerStyle={styles.formulaContainer}
          />
        </View>
      </Animated.View>

      {/* Face arrière - Réponse */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={styles.cardContent}>
          <View style={[styles.labelContainer, styles.labelAnswerContainer]}>
            <Text style={[styles.label, styles.labelAnswer]}>RÉPONSE</Text>
          </View>
          <MathFormula 
            content={card.answer} 
            style={styles.answer}
            containerStyle={styles.formulaContainer}
          />
          {card.explanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationLabel}>Explication</Text>
              <MathFormula 
                content={card.explanation} 
                style={styles.explanation}
                containerStyle={styles.explanationFormulaContainer}
              />
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e5ec',
    borderRadius: 30,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 12, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  cardFront: {
    backgroundColor: '#e0e5ec',
  },
  cardBack: {
    backgroundColor: '#e0e5ec',
  },
  cardContent: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    backgroundColor: '#e0e5ec',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 24,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  labelAnswerContainer: {
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4338ca',
    letterSpacing: 2,
  },
  labelAnswer: {
    color: '#059669',
  },
  formulaContainer: {
    paddingHorizontal: 8,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 36,
    textAlign: 'center',
  },
  answer: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 34,
    textAlign: 'center',
  },
  explanationContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    shadowColor: '#ffffff',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  explanation: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  explanationFormulaContainer: {
    justifyContent: 'flex-start',
  },
});
