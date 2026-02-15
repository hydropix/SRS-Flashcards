/**
 * Écran de debug pour tester les formules mathématiques
 * VERSION SIMPLIFIÉE - Teste WebView réel + Unicode + Packages installés
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
import { MathFormulaSimple } from '../components/MathFormulaSimple';

// Essayer d'importer Caporeista (optionnel)
let CaporeistaModule: any = null;
try {
  CaporeistaModule = require('@caporeista/reactnative-math-latex').default;
} catch (e) {
  // Package non installé
}

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
];

// Composant Unicode simple
const UnicodeFormula: React.FC<{ content: string }> = ({ content }) => {
  const unicode = content
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ')
    .replace(/\\theta/g, 'θ').replace(/\\pi/g, 'π')
    .replace(/\\times/g, '×').replace(/\\cdot/g, '·')
    .replace(/\\leq/g, '≤').replace(/\\geq/g, '≥')
    .replace(/\\in/g, '∈').replace(/\\cup/g, '∪')
    .replace(/\\infty/g, '∞')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/[${}]/g, '');

  return (
    <View style={styles.unicodeBox}>
      <Text style={styles.unicodeText}>{unicode}</Text>
    </View>
  );
};

// Placeholder si package pas installé
const NotInstalled: React.FC<{ name: string; cmd: string }> = ({ name, cmd }) => (
  <View style={styles.notInstalledBox}>
    <MaterialCommunityIcons name="package-variant" size={32} color="#f59e0b" />
    <Text style={styles.notInstalledTitle}>{name}</Text>
    <Text style={styles.notInstalledText}>Non installé</Text>
    <View style={styles.cmdBox}>
      <Text style={styles.cmdText}>{cmd}</Text>
    </View>
  </View>
);

export function MathDebugScreen({ navigation }: MathDebugScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showWebView, setShowWebView] = useState(true);
  const [showUnicode, setShowUnicode] = useState(true);
  const [showCaporeista, setShowCaporeista] = useState(false);

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
        <Text style={styles.sectionTitle}>🔧 Solutions</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity style={[styles.toggle, showWebView && styles.toggleActive]} onPress={() => setShowWebView(!showWebView)}>
            <Text style={[styles.toggleText, showWebView && styles.toggleTextActive]}>WebView</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggle, showUnicode && styles.toggleActiveGreen]} onPress={() => setShowUnicode(!showUnicode)}>
            <Text style={[styles.toggleText, showUnicode && styles.toggleTextActive]}>Unicode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggle, showCaporeista && styles.toggleActiveOrange]} onPress={() => setShowCaporeista(!showCaporeista)}>
            <Text style={[styles.toggleText, showCaporeista && styles.toggleTextActive]}>Caporeista</Text>
          </TouchableOpacity>
        </View>

        {/* Résultats */}
        <Text style={styles.sectionTitle}>🎨 Rendu</Text>

        {showWebView && (
          <View style={styles.resultCard}>
            <View style={[styles.resultHeader, { backgroundColor: '#ede9fe' }]}>
              <MaterialCommunityIcons name="web" size={18} color="#7c3aed" />
              <Text style={styles.resultTitle}>1. WebView + KaTeX (recommandé)</Text>
            </View>
            <View style={styles.resultContent}>
              <MathFormulaSimple content={current.content} fontSize={17} />
            </View>
          </View>
        )}

        {showUnicode && (
          <View style={styles.resultCard}>
            <View style={[styles.resultHeader, { backgroundColor: '#d1fae5' }]}>
              <MaterialCommunityIcons name="format-text" size={18} color="#059669" />
              <Text style={styles.resultTitle}>2. Unicode (fallback)</Text>
            </View>
            <View style={styles.resultContent}>
              <UnicodeFormula content={current.content} />
            </View>
          </View>
        )}

        {showCaporeista && (
          <View style={styles.resultCard}>
            <View style={[styles.resultHeader, { backgroundColor: '#fef3c7' }]}>
              <MaterialCommunityIcons name="package-variant" size={18} color="#d97706" />
              <Text style={styles.resultTitle}>3. @caporeista/reactnative-math-latex</Text>
            </View>
            <View style={styles.resultContent}>
              {CaporeistaModule ? (
                <CaporeistaModule>{current.content}</CaporeistaModule>
              ) : (
                <NotInstalled 
                  name="Caporeista" 
                  cmd="npm install @caporeista/reactnative-math-latex" 
                />
              )}
            </View>
          </View>
        )}

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
  toggleActiveOrange: { backgroundColor: '#f59e0b' },
  toggleActiveBlue: { backgroundColor: '#3b82f6' },
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
  notInstalledBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderStyle: 'dashed',
  },
  notInstalledTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginTop: 8,
  },
  notInstalledText: {
    fontSize: 13,
    color: '#a16207',
    marginTop: 2,
  },
  cmdBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  cmdText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#92400e',
  },
});

export default MathDebugScreen;
