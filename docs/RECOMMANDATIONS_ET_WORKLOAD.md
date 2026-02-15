# Recommandations du Jour et Indicateur de Charge de Travail

## Vue d'ensemble

Ces deux composants améliorent l'expérience utilisateur en fournissant :
1. **Guidage intelligent** - Quoi faire aujourd'hui ?
2. **Feedback clair** - Où en suis-je globalement ?
3. **Motivation** - Objectifs quotidiens et progression

---

## 🎯 DailyRecommendations - "Recommandations du jour"

### Positionnement
Affiché en haut de l'écran d'accueil, juste après l'indicateur de charge de travail.

### Algorithme de recommandation

Les recommandations sont générées avec une **priorité décroissante** :

```
Priorité 10 : Cartes urgentes (>5 dues)
Priorité 8  : Cartes dues (≤5 dues)  
Priorité 6  : Nouveaux chapitres (max 2 recommandés)
Priorité 5  : Proche de la maîtrise (≥60% matures)
```

### Types de recommandations

#### 1. 🔥 Urgent
```
┌─────────────────────────────────────────────────────┐
│ 🔥  Mathématiques - Arithmétique                    │
│     12 cartes en attente - Prioritaire !            │
│     🃏 20 cartes    45% maîtrisé                    │
└─────────────────────────────────────────────────────┘
```
**Déclencheur** : `stats.due > 0`

#### 2. ✨ Nouveau
```
┌─────────────────────────────────────────────────────┐
│ ✨  Français - Grammaire                            │
│     15 cartes à découvrir                           │
│     🃏 15 cartes                                    │
└─────────────────────────────────────────────────────┘
```
**Déclencheur** : `!hasBeenStarted` (max 2 recommandés)

#### 3. 🎯 Mastery (Proche de la maîtrise)
```
┌─────────────────────────────────────────────────────┐
│ 🎯  Mathématiques - Fractions                       │
│     Plus que ~3 cartes pour maîtriser ce chapitre   │
│     🃏 12 cartes    75% maîtrisé                    │
└─────────────────────────────────────────────────────┘
```
**Déclencheur** : `maturePercent >= 60% && !isMastered`

### États de la section

#### Avec recommandations (3 max)
Affiche jusqu'à 3 cartes de recommandation + un "Tip du jour"

#### Sans recommandations (tout à jour)
```
┌──────────────────────────────────────────┐
│        ✅ Tout est à jour ! 🎉           │
│                                          │
│   Tu as terminé tes révisions pour       │
│   aujourd'hui. Reviens demain pour       │
│   continuer ta progression.              │
└──────────────────────────────────────────┘
```

### Tips dynamiques

Le composant affiche des conseils contextuels :

| Situation | Message |
|-----------|---------|
| Beaucoup de cartes dues (>10) | "Conseil : Commence par les chapitres en retard pour ne pas les oublier" |
| Peu de cartes dues | "Conseil : 10-15 minutes par jour suffisent pour progresser sereinement" |
| Nouvelles cartes disponibles | "Conseil : Découvre un nouveau chapitre aujourd'hui !" |
| Objectif atteint | "Conseil : Repose-toi, tu as bien travaillé ! 🎉" |

---

## 📊 WorkloadIndicator - "Indicateur de charge de travail"

### Positionnement
Header principal de l'application, affiché en permanence sur l'écran d'accueil.

### Sections

#### 1. Les 3 métriques clés

```
┌─────────────────────────────────────────────────────┐
│  😊      │      ⏱️      │      🎯                 │
│  12      │     6min     │      5                  │
│ à réviser│   estimé     │    /20                  │
└─────────────────────────────────────────────────────┘
```

| Métrique | Icône | Description |
|----------|-------|-------------|
| **À réviser** | 😊/⚡/😎/😰 | Nombre de cartes dues avec indicateur d'humeur |
| **Temps estimé** | ⏱️ | Basé sur 30s par carte |
| **Progression** | 🎯 | Cartes révisées aujourd'hui / objectif (20) |

#### 2. Niveaux de charge

| Niveau | Condition | Couleur | Icône | Message |
|--------|-----------|---------|-------|---------|
| **Light** | `due === 0` | 🟢 Vert | ✅ | "Tout est à jour" |
| **Light** | `due ≤ 10` et `≤ 10min` | 🟢 Vert | 😊 | "Charge légère" |
| **Moderate** | `due ≤ 25` et `≤ 20min` | 🟡 Orange | 😐 | "Charge modérée" |
| **Heavy** | `due ≤ 50` et `≤ 40min` | 🟠 Orange foncé | 😎 | "Charge importante" |
| **Overwhelming** | `due > 50` ou `> 40min` | 🔴 Rouge | 😰 | "Charge très lourde" |

#### 3. Objectif du jour

```
Objectif du jour                        25%
[▓▓▓▓▓░░░░░░░░░░░░░░░]
Encore 15 cartes pour atteindre ton objectif
```

- Objectif par défaut : **20 cartes/jour**
- Barre de progression colorée (violet → vert à 100%)
- Messages de motivation adaptatifs

#### 4. Stats détaillées

```
⭐ 45 nouvelles    📖 23 en apprentissage    💤 Prochaine: Demain
```

#### 5. Progression globale (aperçu)

```
Progression globale              8/15 chapitres
[▓▓▓▓▓▓▓▓░░░░░░░]
 ● 5 maîtrisés   ● 3 en cours   ● 7 à découvrir
```

Barre segmentée avec :
- 🟢 Vert : Chapitres maîtrisés
- 🟠 Orange : Chapitres commencés non maîtrisés  
- ⚪ Gris : Chapitres jamais commencés

---

## 🎨 Rendu visuel complet

```
┌─────────────────────────────────────────────────────────┐
│              DNB FlashCards                             │
│              Brevet des Collèges                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │  😊     ⏱️      🎯                              │    │
│  │  12    6min    5/20                             │    │
│  │  à réviser  estimé                              │    │
│  │                                                 │    │
│  │  Objectif du jour              25%              │    │
│  │  [▓▓▓▓▓░░░░░░░░░░░░░░░]                         │    │
│  │  Encore 15 cartes pour atteindre ton objectif   │    │
│  │                                                 │    │
│  │  ⭐ 45 nouv.  📖 23 learning  💤 Proch: Demain  │    │
│  │                                                 │    │
│  │  Progression globale           8/15 chapitres   │    │
│  │  [▓▓▓▓▓▓▓▓░░░░░░░]                              │    │
│  │  ● 5 maîtrisés  ● 3 en cours  ● 7 à découvrir   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  💡 Recommandations du jour                             │
│  ┌─────────────────────────────────────────────────┐    │
│  │  🔥 MATHS - Arithmétique                        │    │
│  │     12 cartes en attente - Prioritaire !        │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ✨ FRANÇAIS - Grammaire                        │    │
│  │     15 cartes à découvrir                       │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  🎯 MATHS - Fractions                           │    │
│  │     Plus que ~3 cartes pour maîtriser           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  💡 Conseil : Commence par les chapitres en retard...   │
│                                                         │
│  Explorer par matière                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│  │ MATHS   │ │FRANÇAIS │ │HISTOIRE │                    │
│  │ [▓▓▓░░] │ │ [▓░░░░] │ │ [░░░░░] │                    │
│  │   ● 12  │ │    ○    │ │    ○    │                    │
│  └─────────┘ └─────────┘ └─────────┘                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Props des composants

### DailyRecommendations

```typescript
interface DailyRecommendationsProps {
  decks: Deck[];
  deckStats: Record<string, EnhancedDeckStats>;
  onDeckPress: (deck: Deck) => void;
  onReviewAllPress?: (subject: Subject) => void;
}
```

### WorkloadIndicator

```typescript
interface WorkloadIndicatorProps {
  deckStats: Record<string, EnhancedDeckStats>;
  todayReviewCount: number;
  dailyGoal?: number; // défaut: 20
}
```

---

## 🎯 Objectifs UX atteints

| Problème initial | Solution apportée |
|------------------|-------------------|
| "Où en suis-je ?" | Indicateur global avec 3 métriques clés |
| "Quoi faire aujourd'hui ?" | Recommandations priorisées |
| "Combien de temps ça prend ?" | Estimation temps réelle |
| "Est-ce que je progresse ?" | Barre d'objectif + progression globale |
| "Trop de liberté = perdu" | Guidage doux via recommandations |

---

## 🚀 Évolutions futures

1. **Personnalisation de l'objectif** : Permettre à l'utilisateur de régler son objectif quotidien
2. **Notification intelligente** : "Tu as 5 minutes ? Révise 3 cartes"
3. **Streak visuel** : Afficher la série de jours consécutifs
4. **Prédiction** : "À ce rythme, tu maîtriseras les Maths dans 2 semaines"
5. **Comparaison** : "Tu révises 20% plus que la semaine dernière 🎉"
