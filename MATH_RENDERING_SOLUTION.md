# Rendu Mathématiques pour DNB FlashCard

## 🎯 Solution Implémentée

Le projet utilise **`MathRenderer`** - un système de conversion LaTeX → Unicode natif React Native.

**Avantages :**
- ✅ **Ultra rapide** - rendu natif sans WebView
- ✅ **100% hors-ligne** - pas de dépendances réseau
- ✅ **Léger** - ~15KB, aucune librairie lourde
- ✅ **Fiabilité totale** - pas de JavaScript embarqué ni de WebView
- ✅ **Fonctionne immédiatement** - aucune configuration requise

## 📁 Fichiers

- `src/components/MathRenderer.tsx` - Composant principal unique

## 🔧 Utilisation

```tsx
import { MathRenderer } from './src/components/MathRenderer';

// Formule inline
<MathRenderer content="$x^2 + y^2 = r^2$" />

// Formule block (centrée, fond coloré)
<MathRenderer 
  content="$$\\frac{a}{b} = \\frac{c}{d}$$"
  fontSize={20}
  color="#1e293b"
/>
```

## 📖 Syntaxe Supportée

### Opérations de base
| LaTeX | Rendu |
|-------|-------|
| `$x + y$` | x + y |
| `$x \\times y$` | x × y |
| `$x \\cdot y$` | x · y |
| `$x \\div y$` | x ÷ y |
| `$\\pm x$` | ± x |

### Fractions
| LaTeX | Rendu |
|-------|-------|
| `$\\frac{a}{b}$` | a/b avec barre de fraction |
| `$\\frac{x^2}{2}$` | x²/2 avec barre |

### Puissances et indices
| LaTeX | Rendu |
|-------|-------|
| `$x^2$` | x² |
| `$x^{10}$` | x¹⁰ |
| `$x_n$` | xₙ |

### Racines
| LaTeX | Rendu |
|-------|-------|
| `$\\sqrt{x}$` | √(x) |
| `$\\sqrt[3]{x}$` | ∛(x) |

### Lettres grecques
| LaTeX | Rendu |
|-------|-------|
| `$\\alpha$` | α |
| `$\\beta$` | β |
| `$\\gamma$` | γ |
| `$\\pi$` | π |
| `$\\theta$` | θ |
| `$\\Sigma$` | Σ |
| `$\\Delta$` | Δ |
| `$\\Omega$` | Ω |

### Fonctions
| LaTeX | Rendu |
|-------|-------|
| `$\\sin x$` | sin x |
| `$\\cos x$` | cos x |
| `$\\tan x$` | tan x |
| `$\\log x$` | log x |
| `$\\ln x$` | ln x |

### Comparaisons
| LaTeX | Rendu |
|-------|-------|
| `$\\leq$` | ≤ |
| `$\\geq$` | ≥ |
| `$\\neq$` | ≠ |
| `$\\approx$` | ≈ |

### Ensembles et divers
| LaTeX | Rendu |
|-------|-------|
| `$\\in$` | ∈ |
| `$\\cup$` | ∪ |
| `$\\cap$` | ∩ |
| `$\\emptyset$` | ∅ |
| `$\\infty$` | ∞ |
| `$\\rightarrow$` | → |
| `$\\Rightarrow$` | ⇒ |
| `$\\sum$` | Σ |
| `$\\int$` | ∫ |

### Accents
| LaTeX | Rendu |
|-------|-------|
| `$\\vec{v}$` | v⃗ |
| `$\\bar{x}$` | x̄ |
| `$\\hat{x}$` | x̂ |

## 📝 Exemple dans une carte

```typescript
{
  question: "Calculer $$v = \\frac{d}{t}$$",
  answer: "$$v = \\frac{100}{20} = 5$$ m/s",
  explanation: "La formule $v = \\frac{d}{t}$ donne la vitesse"
}
```

## 🧪 Page de Test

Une page de test est disponible dans l'app (MathDebugScreen) pour tester les formules.

## 📝 Notes

- Utilisez `$...$` pour les formules inline
- Utilisez `$$...$$` pour les formules en bloc (centrées, avec fond)
- Les accolades `{}` sont automatiquement gérées
- Les commandes LaTeX non reconnues sont ignorées
