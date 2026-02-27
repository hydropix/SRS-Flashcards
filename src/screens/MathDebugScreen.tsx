/**
 * Écran de debug pour tester les formules mathématiques
 * Utilise le nouveau composant MathRenderer (conversion LaTeX → Unicode)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MathRenderer, latexToUnicode } from '../components/MathRenderer';

interface MathDebugScreenProps {
  navigation: any;
}

const TEST_EXAMPLES = [
  { id: 1, name: 'Fraction', content: '$\\frac{3}{4} + \\frac{5}{6}$' },
  { id: 2, name: 'Racine', content: '$\\sqrt{16} = 4$' },
  { id: 3, name: 'Pythagore', content: '$$BC^2 = AB^2 + AC^2$$' },
  { id: 4, name: 'Trigono', content: '$\\cos(\\theta) = \\frac{adj}{hyp}$' },
  { id: 5, name: 'Quadratique', content: '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$' },
  { id: 6, name: 'Pi', content: '$\\pi \\approx 3.14$' },
  { id: 7, name: 'Puissance', content: '$x^2 + y^2 = z^2$' },
  { id: 8, name: 'Ensemble', content: '$x \\in A \\cup B$' },
  { id: 9, name: 'Somme', content: '$\\sum_{i=1}^{n} x_i$' },
  { id: 10, name: 'Intégrale', content: '$\\int_{a}^{b} f(x) dx$' },
  { id: 11, name: 'Limite', content: '$\\lim_{x \\to \\infty} f(x)$' },
  { id: 12, name: 'Grec', content: '$\\alpha + \\beta = \\gamma$' },
];

export function MathDebugScreen({ navigation }: MathDebugScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showRenderer, setShowRenderer] = useState(true);
  const [showRawUnicode, setShowRawUnicode] = useState(false);

  const current = TEST_EXAMPLES[selectedIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Math</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Sélecteur */}
        <Text style={styles.sectionTitle}>📚 Exemples</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {TEST_EXAMPLES.map((ex, idx) => (
            <TouchableOpacity
              key={ex.id}
              style={[styles.chip, selectedIndex === idx && styles.chipActive]}
              onPress={() => setSelectedIndex(idx)}
            >
              <Text style={[styles.chipText, selectedIndex === idx && styles.chipTextActive]}>
                {ex.id}. {ex.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Code source */}
        <Text style={styles.sectionTitle}>📝 Code LaTeX</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{current.content}</Text>
        </View>

        {/* Toggles */}
        <Text style={styles.sectionTitle}>🔧 Options d'affichage</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity 
            style={[styles.toggle, showRenderer && styles.toggleActive]} 
            onPress={() => setShowRenderer(!showRenderer)}
          >
            <Text style={[styles.toggleText, showRenderer && styles.toggleTextActive]}>
              MathRenderer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggle, showRawUnicode && styles.toggleActiveGreen]} 
            onPress={() => setShowRawUnicode(!showRawUnicode)}
          >
            <Text style={[styles.toggleText, showRawUnicode && styles.toggleTextActive]}>
              Unicode brut
            </Text>
          </TouchableOpacity>
        </View>

        {/* Résultats */}
        <Text style={styles.sectionTitle}>🎨 Rendu</Text>

        {showRenderer && (
          <View style={styles.resultCard}>
            <View style={[styles.resultHeader, { backgroundColor: '#ede9fe' }]}>
              <MaterialCommunityIcons name="calculator-variant" size={18} color="#7c3aed" />
              <Text style={styles.resultTitle}>MathRenderer (Unicode)</Text>
            </View>
            <View style={styles.resultContent}>
              <MathRenderer content={current.content} fontSize={18} />
            </View>
          </View>
        )}

        {showRawUnicode && (
          <View style={styles.resultCard}>
            <View style={[styles.resultHeader, { backgroundColor: '#d1fae5' }]}>
              <MaterialCommunityIcons name="code-tags" size={18} color="#059669" />
              <Text style={styles.resultTitle}>Unicode converti (texte brut)</Text>
            </View>
            <View style={styles.resultContent}>
              <View style={styles.unicodeBox}>
                <Text style={styles.unicodeText}>
                  {latexToUnicode(current.content.replace(/\$\$?/g, ''))}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={20} color="#6366f1" />
          <Text style={styles.infoText}>
            Le composant MathRenderer convertit automatiquement le LaTeX en caractères Unicode. 
            Pas besoin de WebView ni de connexion internet !
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
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
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  selectorScroll: {
    maxHeight: 50,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  chipActive: {
    backgroundColor: '#6366f1',
    shadowColor: '#4f46e5',
  },
  chipText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  codeBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    color: '#e2e8f0',
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggle: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#e0e5ec',
    borderRadius: 10,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleActive: { backgroundColor: '#8b5cf6' },
  toggleActiveGreen: { backgroundColor: '#10b981' },
  toggleText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  toggleTextActive: { color: '#fff' },
  resultCard: {
    backgroundColor: '#e0e5ec',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  resultContent: {
    padding: 16,
    backgroundColor: '#f8fafc',
    minHeight: 60,
  },
  unicodeBox: {
    padding: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  unicodeText: {
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#1e293b',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4338ca',
    lineHeight: 20,
  },
});

export default MathDebugScreen;
