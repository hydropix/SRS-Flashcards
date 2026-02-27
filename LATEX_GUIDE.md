# Guide LaTeX - Formules Mathématiques dans les FlashCards

## Règle n°1 : Les backslashes

Dans les fichiers TypeScript, chaque `\` LaTeX doit être écrit `\\`.

```typescript
// CORRECT - 2 backslashes dans le code source
question: `Calculer $\\frac{3}{4} + \\frac{5}{6}$`

// FAUX - 4 backslashes = formule cassée
question: `Calculer $\\\\frac{3}{4} + \\\frac{5}{6}$`

// FAUX - 1 backslash = JS interprète \f comme caractère spécial
question: `Calculer $\frac{3}{4} + \frac{5}{6}$`
```

**Pourquoi ?** JavaScript utilise `\` comme caractère d'échappement.
`\\frac` dans le code source → `\frac` à l'exécution → MathRenderer comprend.

## Délimiteurs

| Syntaxe | Mode | Usage |
|---------|------|-------|
| `$...$` | Inline | Formule dans le texte |
| `$$...$$` | Block | Formule centrée, seule sur sa ligne |

```typescript
// Inline : dans une phrase
question: `Calculer $\\frac{3}{4}$ en décimal.`

// Block : formule mise en valeur
explanation: `D'après Pythagore :
$$BC^2 = AB^2 + AC^2$$`
```

## Commandes supportées (niveau Brevet)

### Fractions
```typescript
`$\\frac{a}{b}$`              // a/b avec barre de fraction
`$\\frac{x^2 + 1}{x - 1}$`   // fraction complexe
```

### Puissances et indices
```typescript
`$x^2$`         // x au carré
`$x^{10}$`      // exposant > 1 chiffre : accolades obligatoires
`$x_1$`         // indice simple
`$x_{i+1}$`     // indice complexe : accolades obligatoires
```

### Racines
```typescript
`$\\sqrt{25}$`       // racine carrée
`$\\sqrt[3]{27}$`    // racine cubique
```

### Trigonométrie
```typescript
`$\\cos(\\theta)$`   // cos(θ)
`$\\sin(\\alpha)$`   // sin(α)
`$\\tan(x)$`         // tan(x)
```

### Lettres grecques
```typescript
`$\\pi$`     // π
`$\\alpha$`  // α
`$\\beta$`   // β
`$\\gamma$`  // γ
`$\\theta$`  // θ
`$\\Delta$`  // Δ (majuscule)
`$\\Sigma$`  // Σ (majuscule)
```

### Opérateurs et symboles
```typescript
`$\\times$`       // × (multiplication)
`$\\cdot$`        // · (multiplication point)
`$\\div$`         // ÷
`$\\pm$`          // ±
`$\\leq$`         // ≤
`$\\geq$`         // ≥
`$\\neq$`         // ≠
`$\\approx$`      // ≈
`$\\infty$`       // ∞
`$\\in$`          // ∈
`$\\cup$`         // ∪
`$\\cap$`         // ∩
`$\\emptyset$`    // ∅
`$\\rightarrow$`  // →
`$\\Rightarrow$`  // ⇒
`$\\sum$`         // Σ
`$\\int$`         // ∫
`$\\partial$`     // ∂
```

### Accents
```typescript
`$\\vec{v}$`      // v⃗ (vecteur)
`$\\bar{x}$`      // x̄ (moyenne)
`$\\hat{x}$`      // x̂
```

### Texte dans une formule
```typescript
`$v = \\frac{d}{t} \\text{ où } d \\text{ est la distance}$`
```

### Espaces dans les formules
```typescript
`$a \\, b$`    // petit espace
`$a \\; b$`    // espace moyen
```

## Exemples complets de cartes

### Exemple simple
```typescript
{
  id: 'math-fraction-add',
  deckId: 'math-fractions',
  question: `Calculer $\\frac{3}{4} + \\frac{5}{6}$`,
  answer: `$\\frac{3}{4} + \\frac{5}{6} = \\frac{19}{12}$`,
  explanation: `On cherche le dénominateur commun (12) :
$\\frac{3}{4} = \\frac{9}{12}$ et $\\frac{5}{6} = \\frac{10}{12}$`
}
```

### Exemple Pythagore
```typescript
{
  id: 'math-pyth-ex1',
  deckId: 'math-pythagore',
  question: `ABC rectangle en A, $AB = 3$ cm, $AC = 4$ cm. Calculer $BC$.`,
  answer: `$BC = 5$ cm`,
  explanation: `Théorème de Pythagore :
$$BC^2 = AB^2 + AC^2$$
$$BC^2 = 3^2 + 4^2 = 9 + 16 = 25$$
$$BC = \\sqrt{25} = 5 \\text{ cm}$$`
}
```

### Exemple avec puissances
```typescript
{
  id: 'math-puissances',
  deckId: 'math-arithmetique',
  question: `Simplifier $2^5 \\times 2^3$`,
  answer: `$2^8 = 256$`,
  explanation: `$a^m \\times a^n = a^{m+n}$ donc $2^5 \\times 2^3 = 2^{5+3} = 2^8 = 256$`
}
```

## Checklist avant de soumettre une carte

1. ✅ Chaque commande LaTeX a exactement `\\` (pas `\`, pas `\\`)
2. ✅ Chaque `$` ouvrant a son `$` fermant
3. ✅ Chaque `$$` ouvrant a son `$$` fermant
4. ✅ Les accolades sont équilibrées : `{` et `}`
5. ✅ Les exposants/indices de plus d'un caractère sont entre accolades : `^{10}` pas `^10`

## Page de test

L'écran **Test Math** (`src/screens/MathDebugScreen.tsx`) permet de vérifier le rendu des formules.

## Composant utilisé

Le projet utilise uniquement **`MathRenderer`** (`src/components/MathRenderer.tsx`) :

```typescript
import { MathRenderer } from '../components/MathRenderer';

<MathRenderer content={card.question} fontSize={20} color="#1e293b" />
```

### Fonctionnement technique

1. Le contenu est parsé pour séparer texte et formules (`$...$` / `$$...$$`)
2. Chaque formule LaTeX est convertie en caractères Unicode
3. Les fractions sont rendues avec un composant natif (barre de fraction visuelle)
4. Le tout s'affiche avec des composants React Native natifs (Text, View)

**Avantages :**
- Ultra rapide (pas de WebView)
- 100% hors-ligne
- Aucune dépendance lourde
- Fiable et prévisible

## Référence

- Documentation complète : voir `MATH_RENDERING_SOLUTION.md`
- [Éditeur KaTeX en ligne](https://katex.org/) (pour tester la syntaxe LaTeX)
