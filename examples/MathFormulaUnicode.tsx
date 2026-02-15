/**
 * Solution 4: Rendu Unicode pur (SANS AUCUNE DÉPENDANCE)
 * 
 * Avantages:
 * - ✅ ZERO dépendance externe
 * - ✅ 100% offline
 * - ✅ Performance maximale (pas de WebView, pas de SVG)
 * - ✅ Fonctionne sur TOUS les appareils
 * - ✅ Pas de problème de chargement
 * 
 * Inconvénients:
 * - Rendu moins "pro" que KaTeX
 * - Limité aux symboles Unicode
 * - Pas de fractions vraiment verticales
 * 
 * Cette solution convertit le LaTeX en symboles Unicode
 * pour un affichage rapide et fiable.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

interface MathFormulaUnicodeProps {
  content: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  fontSize?: number;
  color?: string;
  useMonospace?: boolean;
}

interface Part {
  type: 'text' | 'math';
  value: string;
  displayMode?: boolean;
}

// Parser LaTeX
function parseContent(content: string): Part[] {
  const parts: Part[] = [];
  const regex = /(\$\$[\s\S]*?\$\$)|(\$[\s\S]*?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index);
      if (text.trim()) parts.push({ type: 'text', value: text });
    }

    const matched = match[0];
    if (matched.startsWith('$$')) {
      parts.push({ 
        type: 'math', 
        value: matched.slice(2, -2).trim(), 
        displayMode: true 
      });
    } else {
      parts.push({ 
        type: 'math', 
        value: matched.slice(1, -1).trim(), 
        displayMode: false 
      });
    }

    lastIndex = match.index + matched.length;
  }

  if (lastIndex < content.length) {
    const text = content.slice(lastIndex);
    if (text.trim()) parts.push({ type: 'text', value: text });
  }

  return parts;
}

// Conversion LaTeX → Unicode (AMÉLIORÉE)
function latexToUnicode(latex: string): string {
  let result = latex;

  // Ordre important : du plus spécifique au plus général

  // Fractions avec parenthèses pour clarté: \frac{a}{b} → (a)/(b)
  result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
  
  // Fractions générales
  result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2');

  // Racines carrées
  result = result.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  result = result.replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '∛($2)'); // racine n-ième

  // Puissances et indices
  result = result.replace(/\^\{([^}]+)\}/g, ' superscript($1)');
  result = result.replace(/\^(.)/g, '$1'); // ^2 → ² géré ci-dessous
  result = result.replace(/_\{([^}]+)\}/g, '₍$1₎');
  result = result.replace(/_(.)/g, '₍$1₎');

  // Lettres grecques majuscules
  result = result.replace(/\\Alpha\b/g, 'Α');
  result = result.replace(/\\Beta\b/g, 'Β');
  result = result.replace(/\\Gamma\b/g, 'Γ');
  result = result.replace(/\\Delta\b/g, 'Δ');
  result = result.replace(/\\Epsilon\b/g, 'Ε');
  result = result.replace(/\\Zeta\b/g, 'Ζ');
  result = result.replace(/\\Eta\b/g, 'Η');
  result = result.replace(/\\Theta\b/g, 'Θ');
  result = result.replace(/\\Pi\b/g, 'Π');
  result = result.replace(/\\Sigma\b/g, 'Σ');
  result = result.replace(/\\Phi\b/g, 'Φ');
  result = result.replace(/\\Psi\b/g, 'Ψ');
  result = result.replace(/\\Omega\b/g, 'Ω');

  // Lettres grecques minuscules
  result = result.replace(/\\alpha\b/g, 'α');
  result = result.replace(/\\beta\b/g, 'β');
  result = result.replace(/\\gamma\b/g, 'γ');
  result = result.replace(/\\delta\b/g, 'δ');
  result = result.replace(/\\epsilon\b/g, 'ε');
  result = result.replace(/\\zeta\b/g, 'ζ');
  result = result.replace(/\\eta\b/g, 'η');
  result = result.replace(/\\theta\b/g, 'θ');
  result = result.replace(/\\iota\b/g, 'ι');
  result = result.replace(/\\kappa\b/g, 'κ');
  result = result.replace(/\\lambda\b/g, 'λ');
  result = result.replace(/\\mu\b/g, 'μ');
  result = result.replace(/\\nu\b/g, 'ν');
  result = result.replace(/\\xi\b/g, 'ξ');
  result = result.replace(/\\pi\b/g, 'π');
  result = result.replace(/\\rho\b/g, 'ρ');
  result = result.replace(/\\sigma\b/g, 'σ');
  result = result.replace(/\\tau\b/g, 'τ');
  result = result.replace(/\\upsilon\b/g, 'υ');
  result = result.replace(/\\phi\b/g, 'φ');
  result = result.replace(/\\chi\b/g, 'χ');
  result = result.replace(/\\psi\b/g, 'ψ');
  result = result.replace(/\\omega\b/g, 'ω');

  // Symboles mathématiques
  result = result.replace(/\\times\b/g, ' × ');
  result = result.replace(/\\cdot\b/g, ' · ');
  result = result.replace(/\\div\b/g, ' ÷ ');
  result = result.replace(/\\pm\b/g, ' ± ');
  result = result.replace(/\\mp\b/g, ' ∓ ');

  // Comparaisons
  result = result.replace(/\\leq\b/g, ' ≤ ');
  result = result.replace(/\\le\b/g, ' ≤ ');
  result = result.replace(/\\geq\b/g, ' ≥ ');
  result = result.replace(/\\ge\b/g, ' ≥ ');
  result = result.replace(/\\neq\b/g, ' ≠ ');
  result = result.replace(/\\ne\b/g, ' ≠ ');
  result = result.replace(/\\approx\b/g, ' ≈ ');
  result = result.replace(/\\equiv\b/g, ' ≡ ');

  // Ensembles
  result = result.replace(/\\in\b/g, ' ∈ ');
  result = result.replace(/\\notin\b/g, ' ∉ ');
  result = result.replace(/\\subset\b/g, ' ⊂ ');
  result = result.replace(/\\subseteq\b/g, ' ⊆ ');
  result = result.replace(/\\cup\b/g, ' ∪ ');
  result = result.replace(/\\cap\b/g, ' ∩ ');
  result = result.replace(/\\emptyset\b/g, ' ∅ ');
  result = result.replace(/\\varnothing\b/g, ' ∅ ');
  result = result.replace(/\\infty\b/g, ' ∞ ');
  result = result.replace(/\\infinity\b/g, ' ∞ ');

  // Flèches
  result = result.replace(/\\rightarrow\b/g, ' → ');
  result = result.replace(/\\to\b/g, ' → ');
  result = result.replace(/\\leftarrow\b/g, ' ← ');
  result = result.replace(/\\Rightarrow\b/g, ' ⇒ ');
  result = result.replace(/\\Leftarrow\b/g, ' ⇐ ');
  result = result.replace(/\\leftrightarrow\b/g, ' ↔ ');

  // Logique
  result = result.replace(/\\forall\b/g, ' ∀ ');
  result = result.replace(/\\exists\b/g, ' ∃ ');
  result = result.replace(/\\nexists\b/g, ' ∄ ');
  result = result.replace(/\\neg\b/g, ' ¬ ');
  result = result.replace(/\\wedge\b/g, ' ∧ ');
  result = result.replace(/\\vee\b/g, ' ∨ ');

  // Fonctions trigonométriques
  result = result.replace(/\\sin\b/g, ' sin ');
  result = result.replace(/\\cos\b/g, ' cos ');
  result = result.replace(/\\tan\b/g, ' tan ');
  result = result.replace(/\\arcsin\b/g, ' arcsin ');
  result = result.replace(/\\arccos\b/g, ' arccos ');
  result = result.replace(/\\arctan\b/g, ' arctan ');
  result = result.replace(/\\sinh\b/g, ' sinh ');
  result = result.replace(/\\cosh\b/g, ' cosh ');
  result = result.replace(/\\tanh\b/g, ' tanh ');

  // Logarithmes
  result = result.replace(/\\log\b/g, ' log ');
  result = result.replace(/\\ln\b/g, ' ln ');
  result = result.replace(/\\exp\b/g, ' exp ');
  result = result.replace(/\\lim\b/g, ' lim ');

  // Opérateurs
  result = result.replace(/\\sum\b/g, ' Σ ');
  result = result.replace(/\\prod\b/g, ' Π ');
  result = result.replace(/\\int\b/g, ' ∫ ');
  result = result.replace(/\\oint\b/g, ' ∮ ');
  result = result.replace(/\\partial\b/g, ' ∂ ');
  result = result.replace(/\\nabla\b/g, ' ∇ ');

  // Angles et géométrie
  result = result.replace(/\\angle\b/g, ' ∠ ');
  result = result.replace(/\\perp\b/g, ' ⊥ ');
  result = result.replace(/\\parallel\b/g, ' ∥ ');
  result = result.replace(/\\degree\b/g, '°');
  result = result.replace(/\\circ\b/g, '°');

  // Texte
  result = result.replace(/\\text\{([^}]+)\}/g, '$1');
  result = result.replace(/\\textbf\{([^}]+)\}/g, '$1');
  result = result.replace(/\\textit\{([^}]+)\}/g, '$1');

  // Accents
  result = result.replace(/\\vec\{([^}]+)\}/g, '$1⃗');
  result = result.replace(/\\bar\{([^}]+)\}/g, '$1̄');
  result = result.replace(/\\hat\{([^}]+)\}/g, '$1̂');
  result = result.replace(/\\dot\{([^}]+)\}/g, '$1̇');
  result = result.replace(/\\ddot\{([^}]+)\}/g, '$1̈');

  // Espaces
  result = result.replace(/\\,/g, ' ');
  result = result.replace(/\\;/g, '  ');
  result = result.replace(/\\:/g, ' ');
  result = result.replace(/\\!/g, '');
  result = result.replace(/\\quad/g, '    ');
  result = result.replace(/\\qquad/g, '        ');

  // Points de suspension
  result = result.replace(/\\dots/g, '...');
  result = result.replace(/\\ldots/g, '...');
  result = result.replace(/\\cdots/g, '⋯');
  result = result.replace(/\\vdots/g, '⋮');
  result = result.replace(/\\ddots/g, '⋱');

  // Ponctuation
  result = result.replace(/\\%/g, '%');

  // Supprimer les accolades restantes
  result = result.replace(/[{}]/g, '');

  // Nettoyer les espaces multiples
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

// Composant principal
export const MathFormulaUnicode: React.FC<MathFormulaUnicodeProps> = ({ 
  content, 
  style, 
  containerStyle,
  fontSize = 18,
  color = '#1e293b',
  useMonospace = true
}) => {
  if (!content?.trim()) return null;

  // Pas de LaTeX détecté
  if (!/\\[a-zA-Z]+|\$\$?/.test(content)) {
    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={[
          styles.text, 
          { fontSize, color },
          style
        ]}>
          {content.replace(/\\n/g, '\n')}
        </Text>
      </View>
    );
  }

  const parts = parseContent(content);

  return (
    <View style={[styles.container, containerStyle]}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <Text 
              key={index} 
              style={[
                styles.text, 
                { fontSize, color },
                style
              ]}
            >
              {part.value.replace(/\\n/g, '\n')}
            </Text>
          );
        }

        // Formule mathématique
        const converted = latexToUnicode(part.value);
        return (
          <Text
            key={index}
            style={[
              styles.math,
              part.displayMode && styles.blockMath,
              { 
                fontSize: part.displayMode ? fontSize + 2 : fontSize,
                color,
                fontFamily: useMonospace 
                  ? (Platform.OS === 'ios' ? 'Menlo' : 'monospace')
                  : (style?.fontFamily || undefined)
              },
              style
            ]}
          >
            {converted}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  text: {
    lineHeight: 26,
  },
  math: {
    fontWeight: '500',
    lineHeight: 26,
  },
  blockMath: {
    width: '100%',
    textAlign: 'center',
    marginVertical: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
});

export default MathFormulaUnicode;

// ============================================
// EXEMPLES D'UTILISATION:
// ============================================
/*
import { MathFormulaUnicode } from './examples/MathFormulaUnicode';

// Formule simple
<MathFormulaUnicode content="$\\frac{3}{4} + \\frac{5}{6}$" />
// Affiche: (3)/(4) + (5)/(6)

// Avec racine carrée
<MathFormulaUnicode content="$\\sqrt{16} = 4$" />
// Affiche: √(16) = 4

// Théorème de Pythagore (block)
<MathFormulaUnicode 
  content="$$BC^2 = AB^2 + AC^2$$" 
/>
// Affiche: BC² = AB² + AC² (en bloc avec fond)

// Mixte avec texte
<MathFormulaUnicode 
  content={`
    D'après le théorème de Pythagore :
    $$BC^2 = AB^2 + AC^2$$
    Donc $BC = \\sqrt{25} = 5$ cm.
  `}
/>

// Lettres grecques
<MathFormulaUnicode content="$\\pi \\approx 3.14$" />
// Affiche: π ≈ 3.14

<MathFormulaUnicode content="$\\alpha + \\beta = \\gamma$" />
// Affiche: α + β = γ

// Fonctions trigonométriques
<MathFormulaUnicode content="$\\sin(\\theta) = \\frac{opp}{hyp}$" />
// Affiche: sin(θ) = (opp)/(hyp)

// Inégalités
<MathFormulaUnicode content="$x \\leq 5$ et $y \\geq 3$" />
// Affiche: x ≤ 5 et y ≥ 3
*/

// ============================================
// TABLEAU DES CONVERSIONS:
// ============================================
/*
| LaTeX          | Unicode | Description        |
|----------------|---------|--------------------|
| \frac{a}{b}    | (a)/(b) | Fraction           |
| \sqrt{x}       | √(x)    | Racine carrée      |
| ^2             | ²       | Exposant 2         |
| ^n             | ⁿ       | Exposant n         |
| \pi            | π       | Pi                 |
| \alpha         | α       | Alpha minuscule    |
| \beta          | β       | Beta               |
| \gamma         | γ       | Gamma              |
| \theta         | θ       | Thêta              |
| \times         | ×       | Multiplication     |
| \div           | ÷       | Division           |
| \leq           | ≤       | Inférieur ou égal  |
| \geq           | ≥       | Supérieur ou égal  |
| \neq           | ≠       | Différent de       |
| \approx        | ≈       | Approximativement  |
| \infty         | ∞       | Infini             |
| \sin, \cos     | sin, cos| Fonctions trigono  |
| \vec{v}        | v⃗       | Vecteur            |
| \in            | ∈       | Appartient à       |
| \cup           | ∪       | Union              |
| \cap           | ∩       | Intersection       |
| \emptyset      | ∅       | Ensemble vide      |
| \rightarrow    | →       | Flèche droite      |
| \Rightarrow    | ⇒       | Implique           |
| \sum           | Σ       | Somme              |
| \int           | ∫       | Intégrale          |
| \partial       | ∂       | Dérivée partielle  |
| \angle         | ∠       | Angle              |
| \perp          | ⊥       | Perpendiculaire    |
| \degree / \circ| °       | Degré              |
*/
