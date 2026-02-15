/**
 * Composant MathFormula - Version SIMPLE et FONCTIONNELLE
 * 
 * Utilise WebView avec KaTeX CDN + Fallback Unicode automatique
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface MathFormulaProps {
  content: string;
  fontSize?: number;
  color?: string;
  style?: any;
}

// Conversion Unicode pour fallback
function toUnicode(latex: string): string {
  return latex
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '∛($2)')
    .replace(/\^\{([^}]+)\}/g, (m, p1) => {
      const map: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 'n': 'ⁿ', 'i': 'ⁱ' };
      return p1.split('').map((c: string) => map[c] || c).join('');
    })
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\pi/g, 'π')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\infty/g, '∞')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\div/g, '÷')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\in/g, '∈')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/[{}]/g, '');
}

// Parser simple
function parseLatex(content: string) {
  const parts: Array<{ type: 'text' | 'math'; value: string; display?: boolean }> = [];
  const regex = /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    const isDisplay = match[0].startsWith('$$');
    parts.push({ type: 'math', value: (isDisplay ? match[1] : match[2]).trim(), display: isDisplay });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return parts;
}

// Composant WebView individuel avec gestion d'erreur
const MathPart: React.FC<{
  latex: string;
  display: boolean;
  fontSize: number;
  color: string;
}> = ({ latex, display, fontSize, color }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [height, setHeight] = useState(display ? 60 : 40);
  const [width, setWidth] = useState<number | undefined>(undefined);

  const html = useCallback(() => {
    return `
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
  display: inline-block;
  padding: ${display ? '10px' : '5px'};
  text-align: ${display ? 'center' : 'left'};
  white-space: nowrap;
}
.katex { font-size: ${fontSize}px !important; color: ${color} !important; }
</style>
</head>
<body>
<div id="math"></div>
<script>
  try {
    katex.render(${JSON.stringify(latex)}, document.getElementById('math'), {
      displayMode: ${display},
      throwOnError: false,
      strict: false
    });
    var mathEl = document.getElementById('math');
    var h = document.body.scrollHeight;
    var w = mathEl.scrollWidth + 10;
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'loaded', height: h, width: w}));
  } catch(e) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', msg: e.message}));
  }
</script>
</body>
</html>
    `;
  }, [latex, display, fontSize, color]);

  // Si erreur ou pas chargé après 4s, fallback Unicode
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setError(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [loaded]);

  if (error) {
    return (
      <View style={[styles.fallbackBox, display && styles.fallbackBoxBlock]}>
        <Text style={[styles.fallbackText, { fontSize: display ? fontSize + 2 : fontSize }]}>
          {toUnicode(latex)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.webviewWrapper, { height, width: display ? '100%' : width }, display && styles.webviewWrapperBlock]}>
      {!loaded && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={color} />
        </View>
      )}
      <WebView
        source={{ html: html() }}
        style={[styles.webview, { height, width: display ? '100%' : width }]}
        scrollEnabled={false}
        bounces={false}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        onMessage={(e) => {
          try {
            const data = JSON.parse(e.nativeEvent.data);
            if (data.type === 'loaded') {
              setLoaded(true);
              if (data.height) setHeight(data.height + 10);
              if (data.width) setWidth(data.width);
            } else if (data.type === 'error') {
              setError(true);
            }
          } catch {}
        }}
        onError={() => setError(true)}
      />
    </View>
  );
};

// Composant principal
export const MathFormulaSimple: React.FC<MathFormulaProps> = ({ 
  content, 
  fontSize = 17,
  color = '#1e293b',
  style 
}) => {
  if (!content) return null;

  // Pas de LaTeX
  if (!content.includes('$')) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.text, { fontSize, color }]}>{content}</Text>
      </View>
    );
  }

  const parts = parseLatex(content);

  return (
    <View style={[styles.container, style]}>
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          return <Text key={idx} style={[styles.text, { fontSize, color }]}>{part.value}</Text>;
        }
        return (
          <MathPart
            key={idx}
            latex={part.value}
            display={part.display || false}
            fontSize={part.display ? fontSize + 2 : fontSize}
            color={color}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  text: {
    lineHeight: 24,
  },
  webviewWrapper: {
    minWidth: 40,
    justifyContent: 'center',
  },
  webviewWrapperBlock: {
    width: '100%',
    minHeight: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    marginVertical: 4,
  },
  webview: {
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  fallbackBox: {
    paddingHorizontal: 4,
  },
  fallbackBoxBlock: {
    width: '100%',
    padding: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    marginVertical: 4,
  },
  fallbackText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '500',
    color: '#1e293b',
  },
});

export default MathFormulaSimple;
