/**
 * Composant MathFormula - VERSION FONCTIONNELLE
 * 
 * Utilise WebView + KaTeX CDN avec fallback Unicode automatique
 * 
 * IMPORTANT: Nécessite une connexion internet pour le premier rendu
 * (KaTeX est chargé depuis https://cdn.jsdelivr.net)
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface MathFormulaProps {
  content: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  fontSize?: number;
  color?: string;
}

// ============================================
// PARSER LATEX
// ============================================
function parseContent(content: string): Array<{ type: 'text' | 'math'; value: string; displayMode?: boolean }> {
  const parts: Array<{ type: 'text' | 'math'; value: string; displayMode?: boolean }> = [];
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
      parts.push({ type: 'math', value: matched.slice(2, -2).trim(), displayMode: true });
    } else {
      parts.push({ type: 'math', value: matched.slice(1, -1).trim(), displayMode: false });
    }

    lastIndex = match.index + matched.length;
  }

  if (lastIndex < content.length) {
    const text = content.slice(lastIndex);
    if (text.trim()) parts.push({ type: 'text', value: text });
  }

  return parts;
}

// ============================================
// CONVERSION UNICODE (Fallback)
// ============================================
function toUnicode(latex: string): string {
  return latex
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '∛($2)')
    .replace(/\^\{([^}]+)\}/g, (m, p1) => {
      const map: Record<string, string> = { 
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
        '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 'n': 'ⁿ', 'i': 'ⁱ',
        '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
      };
      return p1.split('').map((c: string) => map[c] || c).join('');
    })
    .replace(/\^([0-9a-zA-Z])/g, (m, p1) => {
      const map: Record<string, string> = { 
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
        '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 'n': 'ⁿ', 'i': 'ⁱ'
      };
      return map[p1] || p1;
    })
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\pi/g, 'π')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\Pi/g, 'Π')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\times/g, ' × ')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\div/g, ' ÷ ')
    .replace(/\\pm/g, ' ± ')
    .replace(/\\leq/g, ' ≤ ')
    .replace(/\\geq/g, ' ≥ ')
    .replace(/\\neq/g, ' ≠ ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\equiv/g, ' ≡ ')
    .replace(/\\in/g, ' ∈ ')
    .replace(/\\cup/g, ' ∪ ')
    .replace(/\\cap/g, ' ∩ ')
    .replace(/\\emptyset/g, ' ∅ ')
    .replace(/\\infty/g, ' ∞ ')
    .replace(/\\rightarrow/g, ' → ')
    .replace(/\\Rightarrow/g, ' ⇒ ')
    .replace(/\\sum/g, ' Σ ')
    .replace(/\\int/g, ' ∫ ')
    .replace(/\\partial/g, ' ∂ ')
    .replace(/\\angle/g, ' ∠ ')
    .replace(/\\perp/g, ' ⊥ ')
    .replace(/\\parallel/g, ' ∥ ')
    .replace(/\\degree/g, '°')
    .replace(/\\circ/g, '°')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    .replace(/\\lim/g, 'lim')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\vec\{([^}]+)\}/g, '$1⃗')
    .replace(/\\bar\{([^}]+)\}/g, '$1̄')
    .replace(/\\hat\{([^}]+)\}/g, '$1̂')
    .replace(/\\dot\{([^}]+)\}/g, '$1̇')
    .replace(/\\,/g, ' ')
    .replace(/\\;/g, '  ')
    .replace(/\\!/g, '')
    .replace(/\\dots|\\ldots/g, '...')
    .replace(/\\%/g, '%')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// COMPOSANT MATH PART (WebView individuelle)
// ============================================
interface MathPartProps {
  latex: string;
  displayMode: boolean;
  baseFontSize: number;
  color: string;
}

function MathPart({ latex, displayMode, baseFontSize, color }: MathPartProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [height, setHeight] = useState(displayMode ? 60 : 40);

  // Fallback après 5 secondes si pas chargé
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) {
        console.log('⚠️ MathFormula: Timeout WebView, fallback Unicode');
        setError(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loaded]);

  if (error) {
    return (
      <View style={[styles.fallbackContainer, displayMode && styles.fallbackContainerBlock]}>
        <Text style={[styles.fallbackText, { fontSize: displayMode ? baseFontSize + 2 : baseFontSize, color }]}>
          {toUnicode(latex)}
        </Text>
      </View>
    );
  }

  const fontSize = displayMode ? baseFontSize + 4 : baseFontSize + 2;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { 
  width: 100%; 
  min-height: 100%; 
  display: flex; 
  justify-content: center; 
  align-items: center;
  background: transparent;
}
#math { 
  width: 100%; 
  padding: ${displayMode ? '12px' : '4px'};
  text-align: ${displayMode ? 'center' : 'left'};
}
.katex { 
  font-size: ${fontSize}px !important; 
  color: ${color} !important; 
}
.katex-display { margin: 0 !important; }
</style>
</head>
<body>
<div id="math"></div>
<script>
  (function() {
    try {
      var container = document.getElementById('math');
      katex.render(${JSON.stringify(latex)}, container, {
        displayMode: ${displayMode},
        throwOnError: false,
        strict: false
      });
      var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'loaded', height: h}));
    } catch(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', msg: e.message}));
    }
  })();
</script>
</body>
</html>
  `;

  return (
    <View style={[
      styles.mathContainer, 
      { height },
      displayMode && styles.mathContainerBlock
    ]}>
      {!loaded && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={color} />
        </View>
      )}
      <WebView
        source={{ html }}
        style={[styles.webview, { height }]}
        scrollEnabled={false}
        bounces={false}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'loaded') {
              setLoaded(true);
              if (data.height) setHeight(data.height + 8);
            } else if (data.type === 'error') {
              console.warn('MathFormula WebView error:', data.msg);
              setError(true);
            }
          } catch (e) {}
        }}
        onError={(e) => {
          console.warn('MathFormula WebView load error:', e);
          setError(true);
        }}
      />
    </View>
  );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export function MathFormula({ 
  content, 
  style, 
  containerStyle,
  fontSize = 18,
  color = '#1e293b'
}: MathFormulaProps) {
  if (!content?.trim()) return null;

  // Pas de LaTeX détecté → texte simple
  if (!/\$\$?/.test(content)) {
    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.text, { fontSize, color }, style]}>
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
            <Text key={`text-${index}`} style={[styles.text, { fontSize, color }, style]}>
              {part.value.replace(/\\n/g, '\n')}
            </Text>
          );
        }

        return (
          <MathPart
            key={`math-${index}`}
            latex={part.value}
            displayMode={part.displayMode || false}
            baseFontSize={fontSize}
            color={color}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    lineHeight: 26,
  },
  mathContainer: {
    minWidth: 30,
    justifyContent: 'center',
  },
  mathContainerBlock: {
    width: '100%',
    minHeight: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    marginVertical: 8,
  },
  webview: {
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  fallbackContainer: {
    paddingHorizontal: 4,
  },
  fallbackContainerBlock: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    marginVertical: 8,
  },
  fallbackText: {
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default MathFormula;
