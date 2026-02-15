/**
 * Test simple pour vérifier que KaTeX fonctionne
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { MathFormula } from './MathFormula';

// Tests avec données réelles du brevet
const TESTS = [
  {
    titre: 'Multiplication (le problème times5)',
    donnee: `$45 \\div 15 = 3$`,  // Exactement comme dans builtinDecks.ts
  },
  {
    titre: 'Times simple',
    donnee: `$2 \\times 5 = 10$`,
  },
  {
    titre: 'Fraction avec times',
    donnee: `$\\frac{2}{3} \\times \\frac{9}{4} = \\frac{3}{2}$`,
  },
  {
    titre: 'Pythagore',
    donnee: `$BC = \\sqrt{100} = 10$`,
  },
  {
    titre: 'Puissance',
    donnee: `$2^5 = 32$`,
  },
  {
    titre: 'Texte',
    donnee: `$45 \\text{ div } 15 = 3$`,
  },
];

export function MathFormulaTest() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Test KaTeX - v2</Text>
      <Text style={styles.sub}>Vérification du bug \\times</Text>
      
      <ScrollView style={styles.scroll}>
        {TESTS.map((test, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.titre}>{test.titre}</Text>
            <Text style={styles.raw}>Raw: {test.donnee}</Text>
            <View style={styles.formuleBox}>
              <MathFormula content={test.donnee} fontSize={16} />
            </View>
          </View>
        ))}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 16,
    color: '#1e293b',
  },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 16,
    color: '#64748b',
  },
  scroll: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  raw: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#94a3b8',
    marginBottom: 10,
    backgroundColor: '#f1f5f9',
    padding: 4,
    borderRadius: 4,
  },
  formuleBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  spacer: { height: 40 },
});

export default MathFormulaTest;
