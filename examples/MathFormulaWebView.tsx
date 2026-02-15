/**
 * Solution 1: WebView + KaTeX via CDN (RECOMMANDÉE)
 * 
 * Avantages:
 * - Rendu KaTeX de haute qualité
 * - Pas de dépendance npm fragile (react-native-katex)
 * - Contrôle total sur le CSS et le chargement
 * - Fonctionne offline si on emballe les assets localement
 * 
 * Inconvénients:
 * - Utilise WebView (léger délai de rendu)
 * - Nécessite react-native-webview
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

interface MathFormulaWebViewProps {
  content: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  blockBackgroundColor?: string;
}

interface Part {
  type: 'text' | 'math';
  value: string;
  displayMode?: boolean;
}

// Parser LaTeX: détecte $...$ (inline) et $$...$$ (block)
function parseContent(content: string): Part[] {
  const parts: Part[] = [];
  // Regex: capture $$...$$ (groupe 1) et $...$ (groupe 2)
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

// Composant individuel pour chaque formule mathématique
interface MathPartProps {
  latex: string;
  displayMode: boolean;
  fontSize: number;
  color: string;
  backgroundColor?: string;
}

const MathPart: React.FC<MathPartProps> = ({ 
  latex, 
  displayMode, 
  fontSize, 
  color,
  backgroundColor = 'transparent'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [height, setHeight] = useState(displayMode ? 60 : 40);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          display: flex; 
          justify-content: center; 
          align-items: center;
          min-height: 100vh;
          background: ${backgroundColor};
          font-family: 'Times New Roman', serif;
        }
        #math-container {
          width: 100%;
          text-align: center;
          padding: ${displayMode ? '16px' : '4px'};
        }
        .katex { 
          font-size: ${fontSize}px !important;
          color: ${color} !important;
        }
        .katex-display {
          margin: 0 !important;
        }
      </style>
    </head>
    <body>
      <div id="math-container">
        ${displayMode 
          ? `$$${latex}$$` 
          : `\\(${latex}\\)`
        }
      </div>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          renderMathInElement(document.body, {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '\\[', right: '\\]', display: true},
              {left: '\\(', right: '\\)', display: false},
              {left: '$', right: '$', display: false}
            ],
            throwOnError: false,
            colorIsTextColor: true
          });
          
          // Envoyer la hauteur calculée à React Native
          setTimeout(function() {
            const height = document.documentElement.scrollHeight;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'height',
              value: height
            }));
          }, 100);
        });
      </script>
    </body>
    </html>
  `;

  const onMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'height' && data.value) {
        setHeight(data.value);
      }
    } catch (e) {
      // Ignorer les erreurs de parsing
    }
  }, []);

  return (
    <View style={[
      styles.mathContainer,
      displayMode && styles.blockMathContainer,
      { height, backgroundColor }
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
        onLoadEnd={() => setLoaded(true)}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

// Composant principal
export const MathFormulaWebView: React.FC<MathFormulaWebViewProps> = ({ 
  content, 
  style, 
  containerStyle,
  fontSize = 18,
  color = '#1e293b',
  backgroundColor = 'transparent',
  blockBackgroundColor = 'rgba(99, 102, 241, 0.06)'
}) => {
  if (!content?.trim()) return null;

  // Pas de LaTeX détecté → afficher comme texte simple
  if (!/\\[a-zA-Z]+|\$\$?/.test(content)) {
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
            <Text key={index} style={[styles.text, { fontSize, color }, style]}>
              {part.value.replace(/\\n/g, '\n')}
            </Text>
          );
        }

        return (
          <MathPart
            key={index}
            latex={part.value}
            displayMode={part.displayMode || false}
            fontSize={part.displayMode ? fontSize + 2 : fontSize}
            color={color}
            backgroundColor={part.displayMode ? blockBackgroundColor : backgroundColor}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  text: {
    lineHeight: 26,
  },
  mathContainer: {
    width: '100%',
    minHeight: 40,
    justifyContent: 'center',
  },
  blockMathContainer: {
    marginVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    minHeight: 60,
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
});

export default MathFormulaWebView;

// ============================================
// EXEMPLE D'UTILISATION:
// ============================================
/*
import { MathFormulaWebView } from './examples/MathFormulaWebView';

// Formule simple inline
<MathFormulaWebView 
  content="Calculer : $\\frac{3}{4} + \\frac{5}{6}$" 
/>

// Formule en bloc (centrée)
<MathFormulaWebView 
  content="Théorème de Pythagore: $$BC^2 = AB^2 + AC^2$$" 
/>

// Mixte
<MathFormulaWebView 
  content={`
    D'après le théorème de Pythagore :
    $$BC^2 = AB^2 + AC^2$$
    $$BC = \\sqrt{25} = 5$$
    Donc $BC = 5$ cm.
  `}
  fontSize={16}
/>
*/
