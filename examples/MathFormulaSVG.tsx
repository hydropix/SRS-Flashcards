/**
 * Solution 3: Rendu SVG natif avec react-native-mathjax-text-svg
 * 
 * Installation:
 * npm install react-native-mathjax-text-svg
 * 
 * Avantages:
 * - PAS DE WEBVIEW ! Rendu natif pur
 * - Plus performant (pas de chargement de page web)
 * - Meilleure intégration avec les animations React Native
 * - Offline garanti
 * 
 * Inconvénients:
 * - Rendu légèrement différent de KaTeX
 * - Moins de features avancées
 * - Package moins populaire
 * 
 * Alternative similaire: react-native-mathjax-svg (même principe)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, Text } from 'react-native';

// Décommenter après installation:
// import MathJax from 'react-native-mathjax-text-svg';

interface MathFormulaSVGProps {
  content: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  fontSize?: number;
  color?: string;
}

// Placeholder temporaire
const PlaceholderComponent: React.FC<{ content: string }> = ({ content }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>
      ⚠️ Package non installé\n\nPour utiliser cette solution, exécutez:\n
      npm install react-native-mathjax-text-svg\n\n
      Contenu: {content.slice(0, 50)}...
    </Text>
  </View>
);

export const MathFormulaSVG: React.FC<MathFormulaSVGProps> = ({ 
  content, 
  style,
  containerStyle,
  fontSize = 16,
  color = '#1e293b'
}) => {
  // Version placeholder
  return <PlaceholderComponent content={content} />;
  
  /*
  // VERSION RÉELLE (décommenter après installation):
  
  return (
    <View style={[styles.container, containerStyle]}>
      <MathJax
        html={content}
        fontSize={fontSize}
        color={color}
        style={[styles.mathContent, style]}
      />
    </View>
  );
  */
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mathContent: {
    // Styles additionnels si nécessaire
  },
  placeholder: {
    padding: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  placeholderText: {
    color: '#1e40af',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default MathFormulaSVG;

// ============================================
// EXEMPLE D'UTILISATION (après installation):
// ============================================
/*
import { MathFormulaSVG } from './examples/MathFormulaSVG';

// Formule simple
<MathFormulaSVG 
  content="$\\frac{3}{4} + \\frac{5}{6}$" 
/>

// Formule en bloc
<MathFormulaSVG 
  content="$$BC^2 = AB^2 + AC^2$$"
  fontSize={20}
/>

// Texte + formule
<MathFormulaSVG 
  content="Calculer : $\\sqrt{16} + \\sqrt{9}$"
  color="#4CAF50"
/>
*/

// ============================================
// COMPARAISON AVEC WEBVIEW:
// ============================================
/*
| Critère           | WebView (KaTeX) | SVG natif      |
|-------------------|-----------------|----------------|
| Performance       | ⭐⭐⭐          | ⭐⭐⭐⭐⭐      |
| Qualité rendu     | ⭐⭐⭐⭐⭐       | ⭐⭐⭐⭐        |
| Temps chargement  | Plus lent       | Instantané     |
| Offline           | CDN nécessaire  | 100% offline   |
| Complexité        | Moyenne         | Simple         |
| Animations        | Limitées        | Parfaites      |
*/
