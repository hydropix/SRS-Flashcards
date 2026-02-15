/**
 * Composant pour afficher du texte avec des formules mathématiques en LaTeX
 * Utilise KaTeX via CDN dans une WebView (compatible Expo Go)
 * 
 * Syntaxe supportée :
 * - $...$ pour les formules en ligne
 * - $$...$$ pour les formules en bloc (centrées)
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';

interface MathFormulaProps {
  content: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
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
function parseContent(content: string): Array<{ type: 'text' | 'inline' | 'block'; value: string }> {
  const parts: Array<{ type: 'text' | 'inline' | 'block'; value: string }> = [];
  
  // Regex pour détecter les formules en bloc $$...$$ ou en ligne $...$
  // Le ? rend la capture non-greedy pour éviter de capturer trop de texte
  const regex = /(\$\$[\s\S]*?\$\$)|(\$[\s\S]*?\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Ajouter le texte avant la formule
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({
          type: 'text',
          value: textBefore,
        });
      }
    }

    const matchedText = match[0];
    if (matchedText.startsWith('$$') && matchedText.endsWith('$$')) {
      parts.push({
        type: 'block',
        value: matchedText.slice(2, -2).trim(),
      });
    } else {
      parts.push({
        type: 'inline',
        value: matchedText.slice(1, -1).trim(),
      });
    }

    lastIndex = match.index + matchedText.length;
  }

  // Ajouter le reste du texte après la dernière formule
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    if (remainingText.trim()) {
      parts.push({
        type: 'text',
        value: remainingText,
      });
    }
  }

  return parts;
}

/**
 * Génère le HTML complet avec KaTeX pour une formule
 */
function generateKatexHtml(formula: string, displayMode: boolean, textColor: string = '#1e293b'): string {
  const katexUrl = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
  const katexCss = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
  
  // Calculer la hauteur en fonction du type de formule
  const minHeight = displayMode ? '50px' : '28px';
  const fontSize = displayMode ? '1.15em' : '1em';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="${katexCss}">
  <script src="${katexUrl}"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background-color: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: ${minHeight};
      height: auto;
      width: 100%;
      overflow: hidden;
    }
    #formula {
      color: ${textColor};
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .katex {
      font-size: ${fontSize};
      line-height: 1.4;
    }
    .katex-display {
      margin: 0.5em 0;
    }
  </style>
</head>
<body>
  <div id="formula"></div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      try {
        katex.render(${JSON.stringify(formula)}, document.getElementById('formula'), {
          displayMode: ${displayMode},
          throwOnError: false,
          errorColor: '#ef4444'
        });
      } catch (e) {
        document.getElementById('formula').innerText = ${JSON.stringify(formula)};
      }
    });
  </script>
</body>
</html>
  `.trim();
}

interface KatexViewProps {
  formula: string;
  displayMode: boolean;
}

function KatexView({ formula, displayMode }: KatexViewProps) {
  const html = generateKatexHtml(formula, displayMode);

  if (displayMode) {
    // Formule en bloc : prend toute la largeur, centrée
    return (
      <View style={styles.blockContainer}>
        <WebView
          source={{ html }}
          style={styles.webviewBlock}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        />
      </View>
    );
  }

  // Formule en ligne : s'intègre dans le flux de texte
  return (
    <View style={styles.inlineContainer}>
      <WebView
        source={{ html }}
        style={styles.webviewInline}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      />
    </View>
  );
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

  // Si c'est une seule formule en bloc, l'afficher directement
  if (parts.length === 1 && parts[0].type === 'block') {
    return (
      <View style={[styles.singleBlockContainer, containerStyle]}>
        <KatexView formula={parts[0].value} displayMode={true} />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <Text key={`text-${index}`} style={[styles.inlineText, style]}>
              {part.value}
            </Text>
          );
        } else if (part.type === 'inline') {
          return (
            <KatexView
              key={`inline-${index}`}
              formula={part.value}
              displayMode={false}
            />
          );
        } else {
          return (
            <KatexView
              key={`block-${index}`}
              formula={part.value}
              displayMode={true}
            />
          );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end', // Aligner le texte et les formules en bas
    justifyContent: 'flex-start',
    width: '100%',
  },
  singleBlockContainer: {
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },
  inlineText: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 28, // Même hauteur de ligne que les formules inline
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  // Formule en ligne
  inlineContainer: {
    height: 28,
    minWidth: 20,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewInline: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  // Formule en bloc
  blockContainer: {
    width: '100%',
    height: 50,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewBlock: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default MathFormula;
