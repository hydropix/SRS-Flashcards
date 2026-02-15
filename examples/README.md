# 📐 Exemples de rendu de formules mathématiques

Ce dossier contient 4 solutions différentes pour afficher des formules LaTeX dans React Native, avec leurs avantages et inconvénients.

## 🚀 Solutions disponibles

### 1. **MathFormulaWebView.tsx** ⭐ RECOMMANDÉ
WebView + KaTeX via CDN

```bash
# Déjà inclus si vous avez react-native-webview
# Pas d'installation supplémentaire nécessaire
```

**Avantages:**
- ✅ Rendu KaTeX de haute qualité
- ✅ Pas de dépendance npm fragile
- ✅ Contrôle total sur le CSS
- ✅ Fonctionne offline (si on met KaTeX en local)

**Inconvénients:**
- ⚠️ Léger délai de chargement (WebView)

---

### 2. **MathFormulaCaporeista.tsx**
Librairie `@caporeista/reactnative-math-latex`

```bash
npm install @caporeista/reactnative-math-latex react-native-webview
```

**Avantages:**
- ✅ API très simple
- ✅ Supporte HTML + LaTeX mélangés
- ✅ KaTeX intégré

**Inconvénients:**
- ⚠️ Package récent (moins de communauté)
- ⚠️ Moins de contrôle sur le rendu

---

### 3. **MathFormulaSVG.tsx**
Rendu SVG natif avec `react-native-mathjax-text-svg`

```bash
npm install react-native-mathjax-text-svg
```

**Avantages:**
- ✅ PAS DE WEBVIEW (natif pur)
- ✅ Performance maximale
- ✅ Offline garanti
- ✅ Meilleure intégration animations

**Inconvénients:**
- ⚠️ Rendu légèrement différent de KaTeX
- ⚠️ Moins de features avancées

---

### 4. **MathFormulaUnicode.tsx**
Conversion LaTeX → Unicode (SANS DÉPENDANCE)

```bash
# AUCUNE installation requise !
```

**Avantages:**
- ✅ ZERO dépendance
- ✅ 100% offline
- ✅ Performance maximale
- ✅ Jamais de problème de chargement

**Inconvénients:**
- ⚠️ Rendu "moins pro" que KaTeX
- ⚠️ Limité aux symboles Unicode

---

## 📊 Tableau comparatif

| Critère | WebView | Unicode | Caporeista | SVG |
|---------|---------|---------|------------|-----|
| Qualité rendu | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Performance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Temps chargement | Lent | Instantané | Lent | Rapide |
| Dépendances | 0 | 0 | 1 | 1 |
| Setup | Moyen | Facile | Facile | Facile |
| Offline | ✅ | ✅✅ | ✅ | ✅✅ |

---

## 🎯 Utilisation rapide

### Solution recommandée (WebView)

```tsx
import { MathFormulaWebView } from './examples/MathFormulaWebView';

function MaCarte() {
  return (
    <MathFormulaWebView 
      content="$$BC^2 = AB^2 + AC^2$$"
      fontSize={18}
      color="#1e293b"
    />
  );
}
```

### Solution Unicode (fallback)

```tsx
import { MathFormulaUnicode } from './examples/MathFormulaUnicode';

function MaCarte() {
  return (
    <MathFormulaUnicode 
      content="$\\frac{3}{4} + \\frac{5}{6}$"
      fontSize={16}
    />
  );
}
```

---

## 🧪 Tester les solutions

Utilisez l'écran de comparaison pour tester toutes les solutions côte à côte :

```tsx
import { MathFormulaComparison } from './examples/MathFormulaComparison';

// Dans votre App.tsx ou navigation
<Stack.Screen 
  name="TestMath" 
  component={MathFormulaComparison}
  options={{ title: 'Test Formules' }}
/>
```

Cet écran vous permet de :
- Comparer les rendus côte à côte
- Tester différents types de formules
- Voir le code LaTeX utilisé
- Évaluer les performances

---

## 🔧 Intégration dans votre projet

### Étape 1 : Choisir votre solution

Pour DNB FlashCards, je recommande :
1. **WebView + KaTeX** comme solution principale
2. **Unicode** comme fallback si WebView échoue

### Étape 2 : Remplacer le composant existant

Modifiez `src/components/MathFormula.tsx` :

```tsx
// Ancien import
// import Katex from 'react-native-katex';

// Nouveau import
import { MathFormulaWebView } from '../examples/MathFormulaWebView';

// Ou si vous préférez Unicode :
// import { MathFormulaUnicode } from '../examples/MathFormulaUnicode';
```

### Étape 3 : Adapter les props

```tsx
// Avant (react-native-katex)
<Katex
  expression={latex}
  style={{ height: 40 }}
  inlineStyle="..."
/>

// Après (WebView)
<MathFormulaWebView
  content={`$${latex}$`}
  fontSize={18}
  containerStyle={{ marginVertical: 8 }}
/>
```

---

## 📦 Rendre KaTeX offline (optionnel)

Par défaut, la solution WebView charge KaTeX depuis un CDN. Pour être 100% offline :

1. Téléchargez KaTeX :
```bash
cd assets
mkdir katex
cd katex
wget https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
wget https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
wget https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js
```

2. Modifiez `MathFormulaWebView.tsx` pour utiliser les fichiers locaux :
```tsx
// Au lieu de:
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">

// Utilisez:
<link rel="stylesheet" href="file:///android_asset/katex/katex.min.css">
```

---

## 🐛 Dépannage

### WebView ne s'affiche pas
```
Assurez-vous d'avoir react-native-webview installé :
npm install react-native-webview
```

### Les formules sont coupées
```tsx
// Augmentez la hauteur minimale
<MathFormulaWebView
  content={content}
  containerStyle={{ minHeight: 100 }}
/>
```

### Caractères Unicode pas jolis
```tsx
// Désactivez la police monospace
<MathFormulaUnicode
  content={content}
  useMonospace={false}  // Utilise la police système
/>
```

---

## 📝 Syntaxe LaTeX supportée

### Toutes les solutions supportent :
- `$...$` : Formule inline
- `$$...$$` : Formule en bloc

### Exemples de formules :

```latex
% Fractions
$\frac{a}{b}$              % (a)/(b) en Unicode

% Racines
$\sqrt{x}$                 % √(x)
$\sqrt[3]{x}$              % ∛(x)

% Puissances et indices
$x^2$                      % x²
$x_{n}$                    % xₙ

% Lettres grecques
$\pi \alpha \beta \theta$  % π α β θ

% Symboles
$\times \div \leq \geq$    % × ÷ ≤ ≥
$\neq \approx \infty$      % ≠ ≈ ∞

% Fonctions
$\sin \cos \tan$           % sin cos tan
$\log \ln$                 % log ln

% Ensembles
$\in \cup \cap \emptyset$  % ∈ ∪ ∩ ∅
```

---

## 💡 Conseils

1. **Pour la production** : Utilisez WebView + cache local KaTeX
2. **Pour le développement** : Le CDN est plus rapide à itérer
3. **Pour les vieux appareils** : Unicode est plus compatible
4. **Pour les animations** : SVG ou Unicode (pas de WebView)

---

Besoin d'aide ? Consultez le code source de chaque solution pour plus de détails !
