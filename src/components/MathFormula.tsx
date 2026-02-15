/**
 * Composant pour afficher du texte avec des formules mathématiques en LaTeX
 * Version offline : convertit les formules en texte Unicode
 * 
 * Syntaxe supportée :
 * - $...$ pour les formules en ligne
 * - $$...$$ pour les formules en bloc (centrées)
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

interface MathFormulaProps {
  content: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

// Mapping des lettres grecques
const GREEK_LETTERS: Record<string, string> = {
  'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ', 'epsilon': 'ε',
  'zeta': 'ζ', 'eta': 'η', 'theta': 'θ', 'iota': 'ι', 'kappa': 'κ',
  'lambda': 'λ', 'mu': 'μ', 'nu': 'ν', 'xi': 'ξ', 'omicron': 'ο',
  'pi': 'π', 'rho': 'ρ', 'sigma': 'σ', 'tau': 'τ', 'upsilon': 'υ',
  'phi': 'φ', 'chi': 'χ', 'psi': 'ψ', 'omega': 'ω',
  'Alpha': 'Α', 'Beta': 'Β', 'Gamma': 'Γ', 'Delta': 'Δ', 'Epsilon': 'Ε',
  'Zeta': 'Ζ', 'Eta': 'Η', 'Theta': 'Θ', 'Iota': 'Ι', 'Kappa': 'Κ',
  'Lambda': 'Λ', 'Mu': 'Μ', 'Nu': 'Ν', 'Xi': 'Ξ', 'Omicron': 'Ο',
  'Pi': 'Π', 'Rho': 'Ρ', 'Sigma': 'Σ', 'Tau': 'Τ', 'Upsilon': 'Υ',
  'Phi': 'Φ', 'Chi': 'Χ', 'Psi': 'Ψ', 'Omega': 'Ω',
};

// Exposants Unicode
const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
  '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '⁺',
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ',
  'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ',
  'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ',
  't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
  '(': '⁽', ')': '⁾', ' ': ' ',
};

// Indices Unicode
const SUBSCRIPTS: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅',
  '6': '₆', '7': '₇', '8': '₈', '9': '₉', '-': '₋', '+': '₊',
  'a': 'ₐ', 'e': 'ₑ', 'i': 'ᵢ', 'j': 'ⱼ', 'o': 'ₒ', 'r': 'ᵣ',
  'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ', 'y': 'ᵧ', 'k': 'ₖ', 'l': 'ₗ',
  'm': 'ₘ', 'n': 'ₙ', 'p': 'ₚ', 's': 'ₛ', 't': 'ₜ',
  '(': '₍', ')': '₎', ' ': ' ',
};

// Fractions Unicode
const FRACTIONS: Record<string, string> = {
  '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾',
  '1/5': '⅕', '2/5': '⅖', '3/5': '⅗', '4/5': '⅘', '1/6': '⅙',
  '5/6': '⅚', '1/7': '⅐', '1/8': '⅛', '3/8': '⅜', '5/8': '⅝',
  '7/8': '⅞', '1/9': '⅑', '1/10': '⅒',
};

// Symboles mathématiques
const MATH_SYMBOLS: Record<string, string> = {
  'times': '×', 'cdot': '·', 'div': '÷', 'pm': '±', 'mp': '∓',
  'leq': '≤', 'geq': '≥', 'neq': '≠', 'approx': '≈', 'sim': '∼',
  'infty': '∞', 'infinity': '∞', 'sqrt': '√', 'int': '∫', 'sum': '∑',
  'prod': '∏', 'cup': '∪', 'cap': '∩', 'subset': '⊂', 'supset': '⊃',
  'in': '∈', 'notin': '∉', 'forall': '∀', 'exists': '∃', 'nexists': '∄',
  'emptyset': '∅', 'varnothing': '∅', 'setminus': '\\', 'backslash': '\\',
  'angle': '∠', 'perp': '⊥', 'parallel': '∥', 'cong': '≅',
  'to': '→', 'rightarrow': '→', 'leftarrow': '←', 'leftrightarrow': '↔',
  'Rightarrow': '⇒', 'Leftarrow': '⇐', 'Leftrightarrow': '⇔',
  'vec': '→', // Simplifié
  'overline': '̅', // Simplifié
  'bar': '̄',
  'hat': '̂',
  'dot': '̇',
  'ddot': '̈',
};

// Fonctions trigonométriques et autres
const FUNCTIONS: Record<string, string> = {
  'sin': 'sin', 'cos': 'cos', 'tan': 'tan', 'cot': 'cot',
  'sec': 'sec', 'csc': 'csc', 'arcsin': 'arcsin', 'arccos': 'arccos',
  'arctan': 'arctan', 'sinh': 'sinh', 'cosh': 'cosh', 'tanh': 'tanh',
  'log': 'log', 'ln': 'ln', 'exp': 'exp', 'lim': 'lim',
  'max': 'max', 'min': 'min', 'sup': 'sup', 'inf': 'inf',
  'gcd': 'pgcd', 'lcm': 'ppcm',
};

/**
 * Convertit un texte en exposants Unicode
 */
function toSuperscript(text: string): string {
  return text.split('').map(c => SUPERSCRIPTS[c] || c).join('');
}

/**
 * Convertit un texte en indices Unicode
 */
function toSubscript(text: string): string {
  return text.split('').map(c => SUBSCRIPTS[c] || c).join('');
}

/**
 * Parse une formule LaTeX simple et la convertit en texte Unicode
 */
function parseLatexToUnicode(latex: string): string {
  let result = latex;

  // D'abord, normaliser les espaces (espaces multiples → 1 espace)
  result = result.replace(/\s+/g, ' ').trim();

  // Protéger les espaces dans \text{...}
  result = result.replace(/\\text\{([^}]+)\}/g, '$1');

  // Fractions \frac{a}{b}
  // Traiter d'abord les fractions les plus imbriquées
  let prevResult;
  do {
    prevResult = result;
    result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (match, num, den) => {
      // Essayer de trouver une fraction Unicode simple
      const simpleFrac = `${num}/${den}`;
      if (FRACTIONS[simpleFrac]) {
        return FRACTIONS[simpleFrac];
      }
      // Sinon forme a/b
      return `${parseLatexToUnicode(num)}/${parseLatexToUnicode(den)}`;
    });
  } while (result !== prevResult);

  // Racines \sqrt{...} et \sqrt[n]{...}
  result = result.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, (match, n, expr) => {
    if (n === '2' || n === '') {
      return `√(${parseLatexToUnicode(expr)})`;
    }
    return `√[${n}](${parseLatexToUnicode(expr)})`;
  });
  result = result.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');

  // Puissances x^{...}
  result = result.replace(/([a-zA-Z0-9])\^\{([^}]+)\}/g, (match, base, exp) => {
    return base + toSuperscript(parseLatexToUnicode(exp));
  });
  result = result.replace(/([a-zA-Z0-9])\^([a-zA-Z0-9])/g, (match, base, exp) => {
    return base + toSuperscript(exp);
  });

  // Indices x_{...}
  result = result.replace(/([a-zA-Z0-9])_\{([^}]+)\}/g, (match, base, sub) => {
    return base + toSubscript(parseLatexToUnicode(sub));
  });
  result = result.replace(/([a-zA-Z0-9])_([a-zA-Z0-9])/g, (match, base, sub) => {
    return base + toSubscript(sub);
  });

  // Lettres grecques
  result = result.replace(/\\([a-zA-Z]+)/g, (match, name) => {
    // Priorité aux lettres grecques
    if (GREEK_LETTERS[name]) {
      return GREEK_LETTERS[name];
    }
    // Ensuite les symboles mathématiques
    if (MATH_SYMBOLS[name]) {
      return MATH_SYMBOLS[name];
    }
    // Ensuite les fonctions (on garde le nom)
    if (FUNCTIONS[name]) {
      return FUNCTIONS[name];
    }
    // Si inconnu, retourner tel quel sans le backslash
    return match;
  });

  // Nettoyer les accolades restantes
  result = result.replace(/\{([^}]+)\}/g, '$1');

  // Remplacer \, \; etc. par un seul espace
  result = result.replace(/\\,?/g, ' ');
  
  // Normaliser à nouveau les espaces
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

/**
 * Détecte si le texte contient des délimiteurs LaTeX ($...$ ou $$...$$)
 */
function containsLatex(text: string): boolean {
  return /\$\$?[\s\S]*?\$\$?/.test(text);
}

/**
 * Extrait les parties texte et les formules LaTeX du contenu
 */
function parseContent(content: string): Array<{ type: 'text' | 'formula'; value: string; isBlock?: boolean }> {
  const parts: Array<{ type: 'text' | 'formula'; value: string; isBlock?: boolean }> = [];
  
  const regex = /(\$\$[\s\S]*?\$\$)|(\$[\s\S]*?\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      // Conserver les espaces normaux, juste normaliser les espaces multiples
      // et s'assurer qu'on garde un espace à la fin si le texte original en avait un
      const cleanedText = textBefore.replace(/[ \t]+/g, ' ').replace(/\n+/g, '\n');
      if (cleanedText) {
        parts.push({ type: 'text', value: cleanedText });
      }
    }

    const matchedText = match[0];
    if (matchedText.startsWith('$$') && matchedText.endsWith('$$')) {
      const formula = matchedText.slice(2, -2).trim();
      parts.push({
        type: 'formula',
        value: parseLatexToUnicode(formula),
        isBlock: true,
      });
    } else {
      const formula = matchedText.slice(1, -1).trim();
      parts.push({
        type: 'formula',
        value: parseLatexToUnicode(formula),
        isBlock: false,
      });
    }

    lastIndex = match.index + matchedText.length;
  }

  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    const cleanedRemaining = remainingText.replace(/[ \t]+/g, ' ').replace(/\n+/g, '\n');
    if (cleanedRemaining) {
      parts.push({ type: 'text', value: cleanedRemaining });
    }
  }

  return parts;
}

export function MathFormula({ content, style, containerStyle }: MathFormulaProps) {
  if (!content || content.trim() === '') {
    return null;
  }

  // Si pas de LaTeX, afficher comme texte simple
  if (!containsLatex(content)) {
    return <Text style={[styles.text, style]}>{content}</Text>;
  }

  const parts = parseContent(content);

  // Construire le texte final en mélangeant tout
  const elements: (string | JSX.Element)[] = [];
  
  parts.forEach((part, index) => {
    if (part.type === 'text') {
      // Garder le texte tel quel (déjà nettoyé dans parseContent)
      elements.push(part.value);
    } else if (part.isBlock) {
      elements.push('\n');
      elements.push(
        <Text key={`block-${index}`} style={styles.blockFormula}>
          {part.value}
        </Text>
      );
      elements.push('\n');
    } else {
      // Formule en ligne - garder telle quelle
      elements.push(
        <Text key={`inline-${index}`} style={styles.inlineFormula}>
          {part.value}
        </Text>
      );
    }
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.text, style]}>{elements}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },
  inlineFormula: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600', // Gras
    letterSpacing: -0.3, // Réduire légèrement l'espacement
  },
  blockFormula: {
    fontSize: 17,
    color: '#1e293b',
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600', // Gras
    letterSpacing: -0.3, // Réduire légèrement l'espacement
  },
});

export default MathFormula;
