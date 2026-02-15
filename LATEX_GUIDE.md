# Guide d'utilisation des formules LaTeX

Ce guide explique comment écrire des formules mathématiques et physiques dans vos flashcards.

## Installation

La bibliothèque `react-native-katex` est déjà installée. Aucune configuration supplémentaire n'est nécessaire.

## Syntaxe de base

### Formule en ligne (dans le texte)

Utilisez un seul `$` avant et après la formule :

```typescript
question: `Calculer : $\\frac{3}{4} + \\frac{5}{6}$`,
answer: `$x^2 + 5x + 6 = (x + 2)(x + 3)$`,
```

### Formule en bloc (centrée, sur sa propre ligne)

Utilisez deux `$$` avant et après la formule :

```typescript
explanation: `D'après le théorème de Pythagore :
$$BC^2 = AB^2 + AC^2$$
$$BC^2 = 6^2 + 8^2 = 36 + 64 = 100$$`,
```

## Exemples courants

### Fractions
```latex
$\\frac{a}{b}$           →  a/b
$\\frac{3}{4}$           →  3/4
$\\frac{x^2 + 1}{x - 1}$ →  (x²+1)/(x-1)
```

### Puissances
```latex
$x^2$    →  x²
$x^{10}$ →  x¹⁰
$2^5$    →  2⁵
```

### Racines
```latex
$\\sqrt{x}$     →  √x
$\\sqrt{16}$    →  √16
$\\sqrt[3]{x}$  →  ³√x (racine cubique)
```

### Indices
```latex
$x_1$       →  x₁
$x_{i+1}$   →  xᵢ₊₁
$a_{ij}$    →  aᵢⱼ
```

### Fonctions trigonométriques
```latex
$\\cos(x)$  →  cos(x)
$\\sin(x)$  →  sin(x)
$\\tan(x)$  →  tan(x)
```

### Lettres grecques
```latex
$\\pi$      →  π
$\\alpha$   →  α
$\\beta$    →  β
$\\theta$   →  θ
$\\Delta$   →  Δ
```

### Symboles mathématiques
```latex
$\\times$    →  ×
$\\div$      →  ÷
$\\pm$       →  ±
$\\leq$      →  ≤
$\\geq$      →  ≥
$\\neq$      →  ≠
$\\approx$   →  ≈
$\\infty$    →  ∞
$\\rightarrow$ →  →
```

### Équations sur plusieurs lignes
```typescript
explanation: `Résolution :
$$3x + 7 = 22$$
$$3x = 22 - 7$$
$$3x = 15$$
$$x = \\frac{15}{3} = 5$$`,
```

### Texte dans les formules
```latex
$v = \\frac{d}{t} \\text{ où } d \\text{ est la distance}$`
→ v = d/t où d est la distance
```

## Exemples complets de cartes

### Théorème de Pythagore
```typescript
{
  id: 'math-pyt-exemple',
  deckId: 'math-pythagore',
  question: `ABC est rectangle en A avec $AB = 3$ cm et $AC = 4$ cm. Calculer $BC$.`,
  answer: `$BC = 5$ cm`,
  explanation: `D'après le théorème de Pythagore :
$$BC^2 = AB^2 + AC^2$$
$$BC^2 = 3^2 + 4^2 = 9 + 16 = 25$$
$$BC = \\sqrt{25} = 5$ cm`,
}
```

### Identité remarquable
```typescript
{
  id: 'math-id-exemple',
  deckId: 'math-calcul-litteral',
  question: `Développer $(x + 3)^2$`,
  answer: `$(x + 3)^2 = x^2 + 6x + 9$`,
  explanation: `Identité remarquable :
$$(a + b)^2 = a^2 + 2ab + b^2$$
Avec $a = x$ et $b = 3$ :
$$(x + 3)^2 = x^2 + 2 \\times x \\times 3 + 3^2 = x^2 + 6x + 9$$`,
}
```

### Trigonométrie
```typescript
{
  id: 'math-trig-exemple',
  deckId: 'math-trigonometrie',
  question: `Dans un triangle rectangle, $\cos(\\theta) = 0,6$. Calculer $\sin(\\theta)$.`,
  answer: `$\\sin(\\theta) = 0,8$`,
  explanation: `Relation fondamentale :
$$\\cos^2(\\theta) + \\sin^2(\\theta) = 1$$
$$0,6^2 + \\sin^2(\\theta) = 1$$
$$\\sin^2(\\theta) = 1 - 0,36 = 0,64$$
$$\\sin(\\theta) = \\sqrt{0,64} = 0,8$$`,
}
```

## Points importants

1. **Toujours doubler les backslashes** : En TypeScript/JavaScript, le backslash `\` est un caractère d'échappement. Donc pour écrire `\frac`, vous devez taper `\\frac`.

2. **Espaces** : Les espaces dans les formules LaTeX sont ignorés. Utilisez `\\,` pour un petit espace ou `\\;` pour un espace moyen.

3. **Texte normal dans les formules** : Utilisez `\\text{...}` pour insérer du texte normal dans une formule.

4. **Si une formule ne s'affiche pas** : Vérifiez que vous avez bien fermé tous les `$` ou `$$`.

## Ressources

- [Documentation KaTeX](https://katex.org/docs/supported.html) : Liste complète des symboles et fonctions supportés
- [Éditeur en ligne KaTeX](https://katex.org/) : Tester vos formules avant de les intégrer
