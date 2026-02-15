/**
 * Écran de comparaison des différentes solutions pour afficher des formules mathématiques
 * 
 * Utilisez cet écran pour tester et comparer les 4 solutions :
 * 1. WebView + KaTeX (RECOMMANDÉ)
 * 2. @caporeista/reactnative-math-latex
 * 3. SVG natif
 * 4. Unicode pur
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

// Import des différentes solutions
import { MathFormulaWebView } from './MathFormulaWebView';
import { MathFormulaUnicode } from './MathFormulaUnicode';

// Placeholders pour les solutions non installées
const MathFormulaCaporeistaPlaceholder = ({ content }: { content: string }) => (
  <View style={styles.placeholderBox}>
    <Text style={styles.placeholderTitle}>@caporeista/reactnative-math-latex</Text>
    <Text style={styles.placeholderText}>
      npm install @caporeista/reactnative-math-latex
    </Text>
    <Text style={styles.contentPreview}>{content.slice(0, 80)}...</Text>
  </View>
);

const MathFormulaSVGPlaceholder = ({ content }: { content: string }) => (
  <View style={styles.placeholderBox}>
    <Text style={styles.placeholderTitle}>react-native-mathjax-text-svg</Text>
    <Text style={styles.placeholderText}>
      npm install react-native-mathjax-text-svg
    </Text>
    <Text style={styles.contentPreview}>{content.slice(0, 80)}...</Text>
  </View>
);

// Exemples de formules à tester
const TEST_EXAMPLES = [
  {
    name: 'Fraction simple',
    content: 'Calculer : $\\frac{3}{4} + \\frac{5}{6}$',
  },
  {
    name: 'Racine carrée',
    content: '$\\sqrt{16} + \\sqrt{9} = 4 + 3 = 7$',
  },
  {
    name: 'Théorème de Pythagore',
    content: '$$BC^2 = AB^2 + AC^2$$\nDonc $BC = \\sqrt{25} = 5$ cm.',
  },
  {
    name: 'Trigonométrie',
    content: '$\\cos(\\theta) = \\frac{adj}{hyp}$ et $\\sin(\\theta) = \\frac{opp}{hyp}$',
  },
  {
    name: 'Puissances',
    content: '$x^2 + y^2 = z^2$ et $a_{n} = a_{n-1} + r$',
  },
  {
    name: 'Lettres grecques',
    content: '$\\pi \\approx 3.14$, $\\alpha + \\beta = \\gamma$, $\\theta = 45°$',
  },
  {
    name: 'Équation quadratique',
    content: '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$',
  },
  {
    name: 'Inégalités',
    content: 'Si $x \\leq 5$ et $y \\geq 3$, alors $x + y \\geq 8$',
  },
  {
    name: 'Théorème de Thalès',
    content: '$$\\frac{OA}{OB} = \\frac{OC}{OD} = \\frac{AC}{BD}$$',
  },
  {
    name: 'Aire du cercle',
    content: "L'aire d'un cercle est $A = \\pi r^2$",
  },
];

type SolutionType = 'webview' | 'unicode' | 'caporeista' | 'svg';

export const MathFormulaComparison: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [activeSolutions, setActiveSolutions] = useState<SolutionType[]>(['webview', 'unicode']);

  const currentExample = TEST_EXAMPLES[selectedExample];

  const toggleSolution = (solution: SolutionType) => {
    setActiveSolutions(prev =>
      prev.includes(solution)
        ? prev.filter(s => s !== solution)
        : [...prev, solution]
    );
  };

  const renderSolution = (type: SolutionType, content: string) => {
    switch (type) {
      case 'webview':
        return (
          <View style={styles.solutionBox}>
            <Text style={styles.solutionTitle}>1. WebView + KaTeX ⭐ RECOMMANDÉ</Text>
            <View style={styles.formulaContainer}>
              <MathFormulaWebView content={content} fontSize={16} />
            </View>
          </View>
        );
      case 'unicode':
        return (
          <View style={styles.solutionBox}>
            <Text style={styles.solutionTitle}>2. Unicode Pur (0 dépendance)</Text>
            <View style={styles.formulaContainer}>
              <MathFormulaUnicode content={content} fontSize={16} />
            </View>
          </View>
        );
      case 'caporeista':
        return (
          <View style={styles.solutionBox}>
            <Text style={styles.solutionTitle}>3. @caporeista/reactnative-math-latex</Text>
            <MathFormulaCaporeistaPlaceholder content={content} />
          </View>
        );
      case 'svg':
        return (
          <View style={styles.solutionBox}>
            <Text style={styles.solutionTitle}>4. SVG Natif</Text>
            <MathFormulaSVGPlaceholder content={content} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Comparaison des solutions LaTeX</Text>
          <Text style={styles.subtitle}>Sélectionnez un exemple pour tester</Text>
        </View>

        {/* Sélecteur d'exemples */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.exampleSelector}
          contentContainerStyle={styles.exampleSelectorContent}
        >
          {TEST_EXAMPLES.map((example, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.exampleButton,
                selectedExample === index && styles.exampleButtonActive
              ]}
              onPress={() => setSelectedExample(index)}
            >
              <Text style={[
                styles.exampleButtonText,
                selectedExample === index && styles.exampleButtonTextActive
              ]}>
                {example.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Toggle des solutions */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Solutions actives :</Text>
          <View style={styles.toggleRow}>
            {(['webview', 'unicode', 'caporeista', 'svg'] as SolutionType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.toggleButton,
                  activeSolutions.includes(type) && styles.toggleButtonActive
                ]}
                onPress={() => toggleSolution(type)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  activeSolutions.includes(type) && styles.toggleButtonTextActive
                ]}>
                  {type === 'webview' && 'WebView'}
                  {type === 'unicode' && 'Unicode'}
                  {type === 'caporeista' && 'Caporeista'}
                  {type === 'svg' && 'SVG'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Exemple actuel */}
        <View style={styles.currentExampleBox}>
          <Text style={styles.currentExampleLabel}>Exemple sélectionné :</Text>
          <Text style={styles.currentExampleName}>{currentExample.name}</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{currentExample.content}</Text>
          </View>
        </View>

        {/* Résultats */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Résultats :</Text>
          {activeSolutions.map(type => (
            <View key={type}>
              {renderSolution(type, currentExample.content)}
            </View>
          ))}
        </View>

        {/* Comparaison */}
        <View style={styles.comparisonBox}>
          <Text style={styles.comparisonTitle}>📊 Comparaison des solutions</Text>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Solution</Text>
              <Text style={styles.tableHeader}>Perf.</Text>
              <Text style={styles.tableHeader}>Qualité</Text>
              <Text style={styles.tableHeader}>Offline</Text>
              <Text style={styles.tableHeader}>Setup</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>WebView</Text>
              <Text style={styles.tableCell}>⭐⭐⭐</Text>
              <Text style={styles.tableCell}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.tableCell}>✅</Text>
              <Text style={styles.tableCell}>Moyen</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Unicode</Text>
              <Text style={styles.tableCell}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.tableCell}>⭐⭐⭐</Text>
              <Text style={styles.tableCell}>✅✅</Text>
              <Text style={styles.tableCell}>Facile</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Caporeista</Text>
              <Text style={styles.tableCell}>⭐⭐⭐</Text>
              <Text style={styles.tableCell}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.tableCell}>✅</Text>
              <Text style={styles.tableCell}>Facile</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>SVG</Text>
              <Text style={styles.tableCell}>⭐⭐⭐⭐</Text>
              <Text style={styles.tableCell}>⭐⭐⭐⭐</Text>
              <Text style={styles.tableCell}>✅✅</Text>
              <Text style={styles.tableCell}>Facile</Text>
            </View>
          </View>
        </View>

        {/* Recommandation */}
        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationTitle}>💡 Ma recommandation</Text>
          <Text style={styles.recommendationText}>
            Pour une application de flashcards comme DNB FlashCards :
          </Text>
          <Text style={styles.recommendationBullet}>
            • Utilisez <Text style={styles.bold}>WebView + KaTeX</Text> pour la qualité de rendu maximale
          </Text>
          <Text style={styles.recommendationBullet}>
            • Gardez <Text style={styles.bold}>Unicode</Text> comme fallback si WebView échoue
          </Text>
          <Text style={styles.recommendationBullet}>
            • Testez avec un cache local KaTeX pour l'offline complet
          </Text>
        </View>

        {/* Spacer pour scroll */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#6366f1',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  exampleSelector: {
    backgroundColor: '#fff',
    maxHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  exampleSelectorContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  exampleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 8,
  },
  exampleButtonActive: {
    backgroundColor: '#6366f1',
  },
  exampleButtonText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
  exampleButtonTextActive: {
    color: '#fff',
  },
  toggleContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#64748b',
  },
  toggleButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  currentExampleBox: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  currentExampleLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  currentExampleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4,
  },
  codeBox: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    color: '#e2e8f0',
  },
  resultsContainer: {
    paddingHorizontal: 12,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
    marginLeft: 4,
  },
  solutionBox: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  solutionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 12,
  },
  formulaContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  placeholderBox: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  placeholderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 12,
    color: '#92400e',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  contentPreview: {
    fontSize: 11,
    color: '#a16207',
    marginTop: 8,
    fontStyle: 'italic',
  },
  comparisonBox: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
  },
  tableHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
  },
  recommendationBox: {
    margin: 12,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#065f46',
    marginBottom: 8,
  },
  recommendationBullet: {
    fontSize: 13,
    color: '#047857',
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
  },
});

export default MathFormulaComparison;

// ============================================
// POUR TESTER DANS VOTRE APP:
// ============================================
/*
import { MathFormulaComparison } from './examples/MathFormulaComparison';

// Dans votre navigation:
<Stack.Screen 
  name="MathComparison" 
  component={MathFormulaComparison}
  options={{ title: 'Test Formules' }}
/>

// Ou comme écran temporaire:
export default function App() {
  return <MathFormulaComparison />;
}
*/
