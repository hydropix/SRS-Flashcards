import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Card } from '../types';
import { MathFormulaSimple } from './MathFormulaSimple';

// VERSION DEBUG - Affiche le contenu brut pour diagnostic
function MathFormulaDebug({ content, label }: { content: string; label?: string }) {
  // Compter les caractères spéciaux
  const dollarCount = (content.match(/\$/g) || []).length;
  const backslashCount = (content.match(/\\/g) || []).length;
  const braceOpen = (content.match(/\{/g) || []).length;
  const braceClose = (content.match(/\}/g) || []).length;
  
  return (
    <View style={debugStyles.container}>
      {label && <Text style={debugStyles.label}>{label}</Text>}
      <View style={debugStyles.codeBox}>
        <Text style={debugStyles.code}>{content}</Text>
      </View>
      <View style={debugStyles.stats}>
        <Text style={debugStyles.stat}>Longueur: {content.length}</Text>
        <Text style={debugStyles.stat}>$: {dollarCount}</Text>
        <Text style={debugStyles.stat}>
          \: {backslashCount}</Text>
        <Text style={debugStyles.stat}>{`{}: ${braceOpen}/${braceClose}`}</Text>
      </View>
      {/* Affichage interprété */}
      <View style={debugStyles.interpretedBox}>
        <Text style={debugStyles.interpretedLabel}>Interprété:</Text>
        <Text style={debugStyles.interpreted}>
          {content
            .replace(/\\frac/g, ' FRAC ')
            .replace(/\\times/g, ' × ')
            .replace(/\\div/g, ' ÷ ')
            .replace(/\\sqrt/g, ' √ ')
            .replace(/\\text/g, ' TEXT ')
            .replace(/\$\$/g, ' [BLOCK] ')
            .replace(/\$/g, ' [INLINE] ')
          }
        </Text>
      </View>
    </View>
  );
}

const debugStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#f59e0b',
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  codeBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#1e293b',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  stat: {
    fontSize: 11,
    color: '#78350f',
    fontWeight: '600',
  },
  interpretedBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fbbf24',
  },
  interpretedLabel: {
    fontSize: 10,
    color: '#92400e',
    marginBottom: 2,
  },
  interpreted: {
    fontSize: 12,
    color: '#451a03',
    fontFamily: 'monospace',
  },
});

// Pour activer le debug, changez cette constante à true
const DEBUG_MODE = false;

interface FlashcardProps {
  card: Card;
  onFlip?: () => void;
  revealed: boolean;
}

export function Flashcard({ card, onFlip, revealed }: FlashcardProps) {
  const [flipAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    flipAnim.setValue(0);
  }, [card.id]);

  const flipCard = () => {
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
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {DEBUG_MODE ? (
              <MathFormulaDebug content={card.question} label="Question (debug)" />
            ) : (
              <MathFormulaSimple
                content={card.question}
                style={styles.formulaContainer}
                fontSize={20}
                color="#1e293b"
              />
            )}
          </ScrollView>
        </View>
      </Animated.View>

      {/* Face arrière - Réponse */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={styles.cardContent}>
          <View style={[styles.labelContainer, styles.labelAnswerContainer]}>
            <Text style={[styles.label, styles.labelAnswer]}>RÉPONSE</Text>
          </View>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {DEBUG_MODE ? (
              <>
                <MathFormulaDebug content={card.answer} label="Réponse (debug)" />
                {card.explanation && (
                  <MathFormulaDebug content={card.explanation} label="Explication (debug)" />
                )}
              </>
            ) : (
              <>
                <MathFormulaSimple
                  content={card.answer}
                  style={styles.formulaContainer}
                  fontSize={18}
                  color="#1e293b"
                />
                {card.explanation && (
                  <View style={styles.explanationContainer}>
                    <Text style={styles.explanationLabel}>Explication</Text>
                    <MathFormulaSimple
                      content={card.explanation}
                      style={styles.explanationFormulaContainer}
                      fontSize={15}
                      color="#475569"
                    />
                  </View>
                )}
              </>
            )}
          </ScrollView>
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
    backfaceVisibility: 'hidden' as const,
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  labelContainer: {
    backgroundColor: '#e0e5ec',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 16,
    alignSelf: 'center',
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
    width: '100%',
    paddingHorizontal: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 32,
    textAlign: 'center',
  },
  answer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 30,
    textAlign: 'center',
  },
  explanationContainer: {
    marginTop: 24,
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
    marginBottom: 12,
  },
  explanation: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  explanationFormulaContainer: {
    width: '100%',
  },
});
