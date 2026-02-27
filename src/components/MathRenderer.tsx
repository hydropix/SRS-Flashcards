/**
 * Composant MathRenderer - Rendu simple et prévisible des formules
 * 
 * RÈGLES:
 * - Une formule par ligne
 * - Toujours centrée
 * - Jamais mélangée avec du texte normal
 * - Saut de ligne entre chaque formule
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

interface MathRendererProps {
  content: string;
  containerStyle?: ViewStyle;
  style?: TextStyle;
  fontSize?: number;
  color?: string;
}

// ============================================
// COMPOSANT FRACTION
// ============================================

function Fraction({ 
  numerator, 
  denominator, 
  fontSize, 
  color 
}: { 
  numerator: string; 
  denominator: string; 
  fontSize: number; 
  color: string;
}) {
  return (
    <View style={styles.fraction}>
      <View style={styles.fractionPart}>
        <Text style={[styles.fractionText, { fontSize: fontSize * 0.9, color }]}>
          {renderSimple(numerator, fontSize * 0.9, color)}
        </Text>
      </View>
      <View style={[styles.bar, { backgroundColor: color }]} />
      <View style={styles.fractionPart}>
        <Text style={[styles.fractionText, { fontSize: fontSize * 0.9, color }]}>
          {renderSimple(denominator, fontSize * 0.9, color)}
        </Text>
      </View>
    </View>
  );
}

// ============================================
// RENDU SIMPLIFIÉ
// ============================================

function renderSimple(content: string, fontSize: number, color: string): React.ReactNode {
  // Découper en texte et fractions
  const parts: Array<{ type: 'text' | 'frac'; text?: string; num?: string; den?: string }> = [];
  
  const fracRegex = /\\frac\{([^}]+)\}\{([^}]+)\}/g;
  let match;
  let lastIndex = 0;
  
  while ((match = fracRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'frac', num: match[1], den: match[2] });
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < content.length) {
    parts.push({ type: 'text', text: content.slice(lastIndex) });
  }
  
  if (parts.length === 0) {
    parts.push({ type: 'text', text: content });
  }
  
  return parts.map((part, i) => {
    if (part.type === 'frac' && part.num && part.den) {
      return (
        <Fraction
          key={i}
          numerator={part.num}
          denominator={part.den}
          fontSize={fontSize}
          color={color}
        />
      );
    }
    return (
      <Text key={i} style={{ fontSize, color }}>
        {toUnicode(part.text || '')}
      </Text>
    );
  });
}

// ============================================
// CONVERSION UNICODE
// ============================================

function toUnicode(latex: string): string {
  return latex
    // Racines
    .replace(/\\sqrt\[3\]\{([^}]+)\}/g, '∛($1)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    // Puissances
    .replace(/\^\{([^}]+)\}/g, (_, p1) => {
      const map: Record<string, string> = { 
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
        '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 
        'n': 'ⁿ', 'i': 'ⁱ', 'x': 'ˣ', 'y': 'ʸ',
        '+': '⁺', '-': '⁻', '=': '⁼'
      };
      return p1.split('').map((c: string) => map[c] || c).join('');
    })
    .replace(/\^([0-9])/g, (_, p1) => ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'][parseInt(p1)] || p1)
    // Indices
    .replace(/_\{([^}]+)\}/g, (_, p1) => {
      const map: Record<string, string> = { 
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅',
        '6': '₆', '7': '₇', '8': '₈', '9': '₉', 
        'n': 'ₙ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ'
      };
      return p1.split('').map((c: string) => map[c] || c).join('');
    })
    // Grec
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\pi/g, 'π')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\Pi/g, 'Π')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\Delta/g, 'Δ')
    // Opérateurs
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\in/g, '∈')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\infty/g, '∞')
    .replace(/\\rightarrow|\\to/g, '→')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\int/g, '∫')
    .replace(/\\partial/g, '∂')
    .replace(/\\angle/g, '∠')
    .replace(/\\perp/g, '⊥')
    // Fonctions
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    .replace(/\\lim/g, 'lim')
    // Accents
    .replace(/\\vec\{([^}]+)\}/g, '$1⃗')
    .replace(/\\bar\{([^}]+)\}/g, '$1̄')
    .replace(/\\hat\{([^}]+)\}/g, '$1̂')
    // Divers
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\,/g, ' ')
    .replace(/\\dots|\\ldots/g, '...')
    .replace(/\\degree|\\circ/g, '°')
    // Nettoyage
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// PARSER - SÉPARE TEXTE ET MATH
// ============================================

function parseLines(content: string): Array<{ type: 'text' | 'math'; value: string }> {
  const lines: Array<{ type: 'text' | 'math'; value: string }> = [];
  
  // Séparer par lignes d'abord
  const rawLines = content.split('\n');
  
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Vérifier si c'est une formule display ($$...$$)
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
      lines.push({
        type: 'math',
        value: trimmed.slice(2, -2).trim()
      });
    }
    // Vérifier si c'est une formule inline ($...$)
    else if (trimmed.startsWith('$') && trimmed.endsWith('$') && !trimmed.startsWith('$$')) {
      lines.push({
        type: 'math',
        value: trimmed.slice(1, -1).trim()
      });
    }
    // Texte normal avec possibles formules inline
    else {
      // Extraire les formules inline du texte
      const parts = trimmed.split(/(\$[^$]+\$)/g);
      for (const part of parts) {
        if (!part) continue;
        if (part.startsWith('$') && part.endsWith('$')) {
          // Formule inline devient une ligne à part
          lines.push({
            type: 'math',
            value: part.slice(1, -1).trim()
          });
        } else if (part.trim()) {
          // Texte normal
          lines.push({
            type: 'text',
            value: part.trim()
          });
        }
      }
    }
  }
  
  return lines;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export function MathRenderer({
  content,
  containerStyle,
  style,
  fontSize = 20,
  color = '#1e293b',
}: MathRendererProps) {
  if (!content?.trim()) return null;

  const lines = parseLines(content);

  return (
    <View style={[styles.container, containerStyle]}>
      {lines.map((line, index) => {
        const isLast = index === lines.length - 1;
        
        if (line.type === 'math') {
          return (
            <View key={index} style={[styles.mathLine, !isLast && styles.marginBottom]}>
              {renderSimple(line.value, fontSize, color)}
            </View>
          );
        }
        
        // Texte normal
        return (
          <View key={index} style={[styles.textLine, !isLast && styles.marginBottom]}>
            <Text style={[{ fontSize, color, lineHeight: fontSize * 1.4 }, style]}>
              {line.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textLine: {
    width: '100%',
    alignItems: 'center',
  },
  mathLine: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderRadius: 8,
  },
  marginBottom: {
    marginBottom: 12,
  },
  // Fraction
  fraction: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fractionPart: {
    paddingHorizontal: 4,
    minWidth: 20,
    alignItems: 'center',
  },
  fractionText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  bar: {
    width: '100%',
    height: 1.5,
    marginVertical: 2,
    minWidth: 20,
  },
});

export default MathRenderer;
