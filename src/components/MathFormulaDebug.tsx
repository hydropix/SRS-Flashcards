/**
 * Debug complet - Montre exactement ce qui se passe
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import Katex from 'react-native-katex';

// Données réelles du brevet
const TEST_FORMULA = "\\frac{45}{60} = \\frac{3}{4}";

export function MathFormulaDebug() {
  const [showHtml, setShowHtml] = useState(false);
  const [webViewHeight, setWebViewHeight] = useState(100);

  // HTML avec KaTeX CDN
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body {
      font-size: 24px;
      padding: 20px;
      background: #f0f9ff;
    }
    .formula {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 2px solid #3b82f6;
    }
  </style>
</head>
<body>
  <div id="formula" class="formula">${TEST_FORMULA}</div>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script>
    window.onload = function() {
      try {
        katex.render("${TEST_FORMULA}", document.getElementById('formula'), {
          throwOnError: false,
          displayMode: true
        });
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'success',
            height: document.body.scrollHeight
          }));
        }
      } catch(e) {
        document.getElementById('formula').innerHTML = 'ERREUR: ' + e.message;
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: e.message
          }));
        }
      }
    };
  </script>
</body>
</html>`;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 DEBUG KaTeX</Text>

      {/* 1. Test avec react-native-katex */}
      <View style={styles.section}>
        <Text style={styles.label}>1. react-native-katex (lib installée):</Text>
        <View style={styles.bigBox}>
          <Katex
            expression={TEST_FORMULA}
            style={{ height: 80 }}
            inlineStyle="html,body{display:flex;justify-content:center;align-items:center;height:100%;margin:0;background:transparent;}.katex{font-size:28px;}"
            displayMode={true}
            throwOnError={false}
            onLoad={() => console.log('Katex loaded')}
            onError={(e) => console.log('Katex error:', e)}
          />
        </View>
      </View>

      {/* 2. Test avec WebView direct */}
      <View style={styles.section}>
        <Text style={styles.label}>2. WebView direct (CDN KaTeX):</Text>
        <View style={[styles.bigBox, { height: webViewHeight }]}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={{ flex: 1 }}
            onMessage={(e) => {
              const data = JSON.parse(e.nativeEvent.data);
              console.log('WebView:', data);
              if (data.height) setWebViewHeight(data.height + 20);
            }}
          />
        </View>
      </View>

      {/* 3. Test texte simple */}
      <View style={styles.section}>
        <Text style={styles.label}>3. Fallback texte (sans KaTeX):</Text>
        <View style={styles.bigBox}>
          <Text style={styles.bigText}>45/60 = 3/4</Text>
        </View>
      </View>

      {/* 4. Info */}
      <View style={styles.section}>
        <Text style={styles.label}>4. Données brutes:</Text>
        <Text style={styles.code}>{TEST_FORMULA}</Text>
        <Text style={styles.info}>
          Longueur: {TEST_FORMULA.length}{'\n'}
          Backslashes: {(TEST_FORMULA.match(/\\/g) || []).length}
        </Text>
      </View>

      <Button title={showHtml ? "Cacher HTML" : "Voir HTML"} onPress={() => setShowHtml(!showHtml)} />
      
      {showHtml && (
        <View style={styles.section}>
          <Text style={styles.code}>{html}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e293b',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4338ca',
    marginBottom: 12,
  },
  bigBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
    minHeight: 80,
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 28,
    textAlign: 'center',
    color: '#1e293b',
    fontWeight: '600',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 6,
    color: '#1e293b',
  },
  info: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
});

export default MathFormulaDebug;
