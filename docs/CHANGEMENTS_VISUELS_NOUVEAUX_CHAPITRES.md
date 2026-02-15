# Changements Visuels - Chapitres Non Commencés

## Problème Identifié

Les chapitres jamais étudiés étaient :
- ❌ Gris (apparence "désactivée/inactive")
- ❌ Message "X cartes à découvrir" (peu incitatif)
- ❌ Badge avec cadenet (évoque "verrouillé")
- ❌ Dans ReviewScreen : message "Tout est à jour" (trompeur !)

## Solution Implémentée

### 1. Couleurs Vives et Enthousiastes

#### Avant
```
┌──────────────────────────────┐
│ Arithmétique                 │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Gris terne
│ 🔓 10    10 cartes à découvrir│
└──────────────────────────────┘
     ↑ bordure grise #94a3b8
```

#### Après
```
┌──────────────────────────────┐
│ Arithmétique                 │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Cyan clair vibrant
│ ✨ 10    ✨ 10 nouvelles cartes│
│          à découvrir !       │
└──────────────────────────────┘
     ↑ bordure cyan #06b6d4
     ↑ badge étincelles ✨
```

### 2. Palette de Couleurs

| Élément | Ancienne Couleur | Nouvelle Couleur | Code HEX |
|---------|------------------|------------------|----------|
| **Bordure** | Gris | Cyan vif | `#06b6d4` |
| **Badge** | Gris (`#94a3b8`) | Cyan vif (`#06b6d4`) | `#06b6d4` |
| **Barre de progression** | Gris clair (`#cbd5e1`) | Cyan clair | `#67e8f9` |
| **Icône** | `lock-open-variant` (cadenet) | `sparkles` (étincelles) | - |

### 3. Messages Plus Engageants

#### Dans DeckCard
- **Avant** : `"10 cartes à découvrir"`
- **Après** : `"✨ 10 nouvelles cartes à découvrir !"`

#### Dans DailyRecommendations (3 variantes aléatoires)
1. `"✨ 10 nouvelles cartes à explorer !"`
2. `"🚀 Découvre 10 nouvelles cartes"`
3. `"💎 10 cartes inédites t'attendent"`

#### Dans ReviewScreen (Mode Practice)
- **Titre** : `"Nouveau chapitre !"` (au lieu de "Rien à réviser")
- **Sous-titre** : `"Découvre de nouvelles cartes en t'entraînant"`
- **Section explications** : `"Découverte"` avec conseils d'utilisation

## Impact Psychologique

| Aspect | Avant | Après |
|--------|-------|-------|
| **Perception** | "Encore du travail..." | "Nouveau contenu excitant !" |
| **Motivation** | Faible (gris = ennuyeux) | Haute (cyan = frais, nouveau) |
| **Clarté** | "À découvrir" vague | "Nouvelles cartes" précis |
| **Incitation** | Passive | Active (emoji + point d'exclamation) |

## Rendu Complet

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  💡 Recommandations du jour                             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  🚀 Découvre 15 nouvelles cartes                │    │
│  │     MATHS - Géométrie dans l'espace             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Explorer par matière                                   │
│                                                         │
│  ┌─────────────────────────────────────────┐             │
│  │                                         │   ┌───────┐  │
│  │  Arithmétique                           │   │  ✨   │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   │  10   │  │
│  │                                         │   └───────┘  │
│  │  ✨ 10 nouvelles cartes à découvrir !   │              │
│  └─────────────────────────────────────────┘              │
│       ↑ bordure cyan #06b6d4                            │
│       ↑ barre cyan clair #67e8f9                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Messages dans ReviewScreen

### Écran de Fin (Mode Practice sur chapitre non commencé)

#### Avant
```
⏳
Rien à réviser
(pour l'instant)

Toutes les cartes sont à jour

[Patience !]
Les cartes reviennent quand tu dois les réviser.
```

#### Après
```
✨
Nouveau chapitre !

Découvre de nouvelles cartes en t'entraînant

[Découverte]
Mode entraînement : tu peux découvrir toutes les 
cartes de ce chapitre sans pression. Prends le temps 
de bien lire les réponses !

💡 Conseil
Appuie sur la carte pour retourner
```

## Code Couleur Complet des États

| État | Couleur Bordure | Couleur Badge | Icône | Message |
|------|----------------|---------------|-------|---------|
| **Nouveau** | Cyan `#06b6d4` | Cyan `#06b6d4` | ✨ `sparkles` | "✨ X nouvelles cartes à découvrir !" |
| **En cours (urgent)** | Rouge `#ef4444` | Rouge `#ef4444` | 📖 `book-open-variant` | "X à réviser" |
| **En cours (nouveau)** | Orange `#f59e0b` | Orange `#f59e0b` | 📖 `book-open-variant` | "X nouvelles" |
| **En sommeil** | Bleu `#3b82f6` | Bleu `#3b82f6` | 💤 `sleep` | "En sommeil · Reviens dans Xj" |
| **Maîtrisé** | Vert `#22c55e` | Vert `#22c55e` | ✅ `check-circle` | "Maîtrisé !" |

## Pourquoi le Cyan ?

Le cyan (`#06b6d4`) a été choisi car il évoque :
- 🌊 **Fraîcheur** : Comme l'eau, le renouveau
- 💡 **Clarté** : Clair et lumineux, attire l'œil
- 🚀 **Innovation** : Couleur techno/futuriste
- 😊 **Positivité** : Pas d'association négative (contrairement au gris)
- 🎯 **Différenciation** : Se démarque bien des autres états (rouge/orange/bleu/vert)

## Test Utilisateur Recommandé

Demander à des utilisateurs de classer les chapitres par "envie d'ouvrir" :
1. Chapitre avec bordure **cyan** (nouveau)
2. Chapitre avec bordure **rouge** (urgent)
3. Chapitre avec bordure **orange** (en cours)
4. Chapitre avec bordure **bleu** (sommeil)
5. Chapitre avec bordure **verte** (maîtrisé)

**Hypothèse** : Le cyan sera classé haut (excitation de la nouveauté) tout comme le rouge (urgence).
