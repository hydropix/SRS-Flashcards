# Guide KaTeX - Formules dans les FlashCards

## Regle n1 : les backslashes

Dans les fichiers TypeScript, chaque `\` LaTeX doit etre ecrit `\\`.

```typescript
// CORRECT - 2 backslashes dans le code source
question: `Calculer $\\frac{3}{4} + \\frac{5}{6}$`

// FAUX - 4 backslashes = formule cassee
question: `Calculer $\\\\frac{3}{4} + \\\\frac{5}{6}$`

// FAUX - 1 backslash = JS interprete \f comme caractere special
question: `Calculer $\frac{3}{4} + \frac{5}{6}$`
```

**Pourquoi ?** JavaScript utilise `\` comme caractere d'echappement.
`\\frac` dans le code source → `\frac` a l'execution → KaTeX comprend.

## Delimiteurs

| Syntaxe | Mode | Usage |
|---------|------|-------|
| `$...$` | Inline | Formule dans le texte |
| `$$...$$` | Block | Formule centree, seule sur sa ligne |

```typescript
// Inline : dans une phrase
question: `Calculer $\\frac{3}{4}$ en decimal.`

// Block : formule mise en valeur
explanation: `D'apres Pythagore :
$$BC^2 = AB^2 + AC^2$$`
```

## Commandes courantes (niveau Brevet)

### Fractions
```typescript
`$\\frac{a}{b}$`              // a/b
`$\\frac{x^2 + 1}{x - 1}$`   // fraction complexe
```

### Puissances et indices
```typescript
`$x^2$`         // x au carre
`$x^{10}$`      // exposant > 1 chiffre : accolades obligatoires
`$x_1$`         // indice simple
`$x_{i+1}$`     // indice complexe : accolades obligatoires
```

### Racines
```typescript
`$\\sqrt{25}$`       // racine carree
`$\\sqrt[3]{27}$`    // racine cubique
```

### Trigonometrie
```typescript
`$\\cos(\\theta)$`   // cos(theta)
`$\\sin(\\alpha)$`   // sin(alpha)
`$\\tan(x)$`         // tan(x)
```

### Lettres grecques
```typescript
`$\\pi$`     // pi
`$\\alpha$`  // alpha
`$\\beta$`   // beta
`$\\theta$`  // theta
`$\\Delta$`  // Delta (majuscule)
```

### Operateurs et symboles
```typescript
`$\\times$`       // x (multiplication)
`$\\div$`         // division
`$\\pm$`          // plus ou moins
`$\\leq$`         // inferieur ou egal
`$\\geq$`         // superieur ou egal
`$\\neq$`         // different de
`$\\approx$`      // environ egal
`$\\infty$`       // infini
`$\\in$`          // appartient a
`$\\cup$`         // union
`$\\rightarrow$`  // fleche droite
```

### Texte dans une formule
```typescript
`$v = \\frac{d}{t} \\text{ ou } d \\text{ est la distance}$`
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
  explanation: `On cherche le denominateur commun (12) :
$\\frac{3}{4} = \\frac{9}{12}$ et $\\frac{5}{6} = \\frac{10}{12}$
$$\\frac{9}{12} + \\frac{10}{12} = \\frac{19}{12}$$`,
}
```

### Exemple Pythagore
```typescript
{
  id: 'math-pyth-ex1',
  deckId: 'math-pythagore',
  question: `ABC rectangle en A, $AB = 3$ cm, $AC = 4$ cm. Calculer $BC$.`,
  answer: `$BC = 5$ cm`,
  explanation: `Theoreme de Pythagore :
$$BC^2 = AB^2 + AC^2$$
$$BC^2 = 3^2 + 4^2 = 9 + 16 = 25$$
$$BC = \\sqrt{25} = 5 \\text{ cm}$$`,
}
```

### Exemple avec multiplication
```typescript
{
  id: 'math-decomp-60',
  deckId: 'math-arithmetique',
  question: `Decomposer 60 en produit de facteurs premiers.`,
  answer: `$60 = 2^2 \\times 3 \\times 5$`,
  explanation: `$60 = 2 \\times 30 = 2 \\times 2 \\times 15 = 2^2 \\times 3 \\times 5$`,
}
```

## Checklist avant de soumettre une carte

1. Chaque commande LaTeX a exactement `\\` (pas `\`, pas `\\\\`)
2. Chaque `$` ouvrant a son `$` fermant
3. Chaque `$$` ouvrant a son `$$` fermant
4. Les accolades sont equilibrees : `{` et `}`
5. Les exposants/indices de plus d'un caractere sont entre accolades : `^{10}` pas `^10`

## Page de test

L'ecran **Test Math** (`src/screens/MathDebugScreen.tsx`) permet de verifier le rendu.
Il affiche 8 exemples avec comparaison WebView KaTeX vs Unicode.

## Composants

| Composant | Fichier | Usage |
|-----------|---------|-------|
| `MathFormulaSimple` | `src/components/MathFormulaSimple.tsx` | Composant principal (WebView + KaTeX CDN) |
| `MathFormula` | `src/components/MathFormula.tsx` | Version complete avec plus d'options |

### Import
```typescript
import { MathFormulaSimple } from '../components/MathFormulaSimple';

<MathFormulaSimple content={card.question} fontSize={17} color="#1e293b" />
```

## Fonctionnement technique

1. Le contenu est parse pour separer texte et formules (`$...$` / `$$...$$`)
2. Chaque formule est rendue dans une WebView avec KaTeX charge depuis CDN
3. La WebView communique sa hauteur et largeur pour s'adapter au contenu
4. Si le chargement echoue (pas de reseau, timeout 4s), un fallback Unicode est affiche

## Reference

- [Fonctions KaTeX supportees](https://katex.org/docs/supported.html)
- [Editeur KaTeX en ligne](https://katex.org/)
