/**
 * Solution 2: @caporeista/reactnative-math-latex
 * 
 * Installation:
 * npm install @caporeista/reactnative-math-latex react-native-webview
 * 
 * Avantages:
 * - API simple et clé en main
 * - Supporte le mélange LaTeX + HTML
 * - Utilise KaTeX (rapide et beau)
 * - Pas besoin de gérer le HTML soi-même
 * 
 * Inconvénients:
 * - Package récent (peu de downloads)
 * - Dépend de WebView
 * - Moins de contrôle sur le rendu
 * 
 * Note: Cette solution nécessite d'installer le package:
 * npm install @caporeista/reactnative-math-latex
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Décommenter après installation:
// import ReactNativeMathLatex from '@caporeista/reactnative-math-latex';

interface MathFormulaCaporeistaProps {
  content: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  fontSize?: number;
  color?: string;
}

// Version temporaire qui affiche un message si le package n'est pas installé
const PlaceholderComponent: React.FC<{ content: string }> = ({ content }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>
      ⚠️ Package non installé\n\nPour utiliser cette solution, exécutez:\n
      npm install @caporeista/reactnative-math-latex\n\n
      Contenu: {content.slice(0, 50)}...
    </Text>
  </View>
);

// Importer Text pour le placeholder
import { Text } from 'react-native';

export const MathFormulaCaporeista: React.FC<MathFormulaCaporeistaProps> = ({ 
  content, 
  containerStyle,
  fontSize = 16,
  color = '#1e293b'
}) => {
  // Version placeholder - remplacer par l'import réel après installation
  return <PlaceholderComponent content={content} />;
  
  /* 
  // VERSION RÉELLE (décommenter après installation du package):
  
  return (
    <View style={[styles.container, containerStyle]}>
      <ReactNativeMathLatex
        style={[
          styles.mathContent,
          { fontSize, color }
        ]}
      >
        {content}
      </ReactNativeMathLatex>
    </View>
  );
  */
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
  },
  mathContent: {
    lineHeight: 24,
  },
  placeholder: {
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  placeholderText: {
    color: '#92400e',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default MathFormulaCaporeista;

// ============================================
// EXEMPLE D'UTILISATION (après installation):
// ============================================
/*
import { MathFormulaCaporeista } from './examples/MathFormulaCaporeista';

// Formule simple
<MathFormulaCaporeista 
  content="Calculer : $\\frac{3}{4} + \\frac{5}{6}$" 
/>

// Formule en bloc
<MathFormulaCaporeista 
  content={`
    D'après le théorème de Pythagore :
    $$BC^2 = AB^2 + AC^2$$
    <p>Donc <b>BC = 5 cm</b></p>
  `}
/>

// Avec HTML mélangé
<MathFormulaCaporeista 
  content={`
    <h3>Théorème de Thalès</h3>
    <p>Si les droites sont parallèles :</p>
    $$\\frac{OA}{OB} = \\frac{OC}{OD} = \\frac{AC}{BD}$$
    <p style="color: red;">Important à retenir !</p>
  `}
/>
*/

// ============================================
// ASTUCES:
// ============================================
/*
1. Cette lib supporte nativement le HTML, donc tu peux:
   - Utiliser <b>, <i>, <u> pour la mise en forme
   - Ajouter des <br> pour les sauts de ligne
   - Utiliser des styles inline basiques

2. Pour les sauts de ligne dans le LaTeX:
   - Utiliser \\ (double backslash) dans les formules
   - Ou fermer/réouvrir les $...$

3. Limitations:
   - Pas d'accès direct au style KaTeX
   - Le rendu peut varier selon la plateforme
*/
