# Système de 4 États - Documentation

## Vue d'ensemble

Le système de 4 états permet de clarifier visuellement la progression de l'utilisateur dans chaque chapitre, sans réduire sa liberté de choisir où étudier.

## Les 4 États

### 1. 🔒 JAMAIS COMMENCÉ (Locked)

**Condition** : `unseen === total` (aucune carte n'a été vue)

**Apparence** :
- Bordure gauche grise (`#94a3b8`)
- Badge gris avec icône `lock-open-variant`
- Nombre total de cartes affiché
- Texte : "15 cartes à découvrir"
- Barre de progression : 100% gris clair

**Action** : "Découvrir"

**Objectif UX** : Inciter à commencer de nouveaux chapitres en rendant visible le contenu non exploré.

---

### 2. 📖 EN DÉCOUVERTE (Discovery)

**Condition** : `hasBeenStarted && !isMastered && (due > 0 || discoveryCount > 0)`

Le chapitre a été commencé, n'est pas encore maîtrisé, et il y a :
- Soit des cartes à réviser maintenant (`due > 0`)
- Soit des nouvelles cartes à découvrir (`discoveryCount > 0`)

**Apparence** :
- Bordure gauche rouge si `due > 0`, orange sinon
- Badge rouge (`#ef4444`) ou orange (`#f59e0b`) avec icône `book-open-variant`
- Texte dynamique :
  - "8 à réviser · 3 nouvelles"
  - "5 à réviser"
  - "2 nouvelles à découvrir"
- Barre de progression : vert (matures) + orange (learning/nouvelles) + gris (unseen)

**Action** : "Réviser" si des cartes sont dues, "Continuer" sinon

**Objectif UX** : Montrer clairement qu'il y a du travail à faire, avec priorisation par l'urgence (rouge = révision due).

---

### 3. ⏳ EN SOMMEIL (Sleeping)

**Condition** : `hasBeenStarted && due === 0 && !isMastered`

Le chapitre a été commencé, mais rien n'est dû maintenant, et ce n'est pas encore maîtrisé.

**Apparence** :
- Bordure gauche bleue (`#3b82f6`)
- Badge bleu avec icône `sleep` et texte "zZ"
- Texte : "En sommeil · Reviens dans 2j" ou "Tout est à jour"
- Barre de progression : vert + orange + gris (même que découverte)

**Action** : "S'entraîner" (mode practice sans impact SRS)

**Objectif UX** : Rassurer l'utilisateur qu'il n'a rien à faire maintenant, mais qu'il peut s'entraîner si il veut. Éviter la confusion "pourquoi ce chapitre n'apparaît pas ?"

---

### 4. ✅ MAÎTRISÉ (Mastered)

**Condition** : `isMastered` (par défaut : `maturePercent >= 80`)

Plus de 80% des cartes vues ont atteint le statut "mature" (répétitions >= 3).

**Apparence** :
- Bordure gauche verte (`#22c55e`)
- Badge vert avec icône `check-circle`
- Texte : "Maîtrisé · Prochaine révision dans 2 semaines" ou "Chapitre maîtrisé 🎉"
- Barre de progression : 100% verte

**Action** : "Réviser"

**Objectif UX** : Créer une satisfaction de complétion, renforcer la confiance, montrer la progression globale.

---

## Algorithmes de Détermination

### Calcul de `maturePercent`

```typescript
const seenCards = total - unseen;
const maturePercent = seenCards > 0 ? Math.round((review / seenCards) * 100) : 0;
```

> Note : On calcule le pourcentage sur les cartes **vues**, pas sur le total. Un chapitre avec 100 cartes dont on en a vu 20 et maîtrisé 16 est considéré maîtrisé (80% des vues).

### Calcul de `discoveryCount`

```typescript
const discoveryCount = unseen + new;
```

Les cartes "à découvrir" incluent :
- `unseen` : jamais vues (pas d'état SRS)
- `new` : vues mais `is_new = 1` (première répétition)

### Calcul de `sleeping`

```typescript
const sleeping = learningAndReviewNonDue;
```

Cartes vues mais dont la date de révision future (`due_date > now`).

---

## Exemples de Scénarios

### Scénario 1 : Nouvel utilisateur

| Chapitre | Total | Unseen | New | Learning | Review | Due | État |
|----------|-------|--------|-----|----------|--------|-----|------|
| Arithmétique | 10 | 10 | 0 | 0 | 0 | 0 | 🔒 Locked |
| Fractions | 8 | 8 | 0 | 0 | 0 | 0 | 🔒 Locked |

**UX** : L'utilisateur voit deux chapitres "à découvrir" avec 18 cartes au total.

---

### Scénario 2 : Après première session

L'utilisateur a vu 5 cartes d'Arithmétique (3 en "new", 2 réussies en "learning").

| Chapitre | Total | Unseen | New | Learning | Review | Due | État |
|----------|-------|--------|-----|----------|--------|-----|------|
| Arithmétique | 10 | 5 | 3 | 2 | 0 | 5 | 📖 Discovery (5 à réviser) |
| Fractions | 8 | 8 | 0 | 0 | 0 | 0 | 🔒 Locked |

**UX** : Arithmétique montre "5 à réviser" (les cartes vues sont dues immédiatement en mode nouveau). L'utilisateur comprend qu'il doit continuer sur ce chapitre.

---

### Scénario 3 : En consolidation

Arithmétique : 8 cartes vues, 2 unseen, 2 new, 3 learning, 3 review (matures). Toutes les dues ont été faites.

| Chapitre | Total | Unseen | New | Learning | Review | Due | État |
|----------|-------|--------|-----|----------|--------|-----|------|
| Arithmétique | 10 | 2 | 2 | 3 | 3 | 0 | ⏳ Sleeping |
| Fractions | 8 | 8 | 0 | 0 | 0 | 0 | 🔒 Locked |

**UX** : Arithmétique est "en sommeil" avec message "Reviens dans 1j". L'utilisateur sait qu'il n'a rien à faire maintenant mais que les cartes reviendront.

---

### Scénario 4 : Chapitre maîtrisé

Arithmétique : toutes les cartes vues, 8/10 matures (80%).

| Chapitre | Total | Unseen | New | Learning | Review | Due | État |
|----------|-------|--------|-----|----------|--------|-----|------|
| Arithmétique | 10 | 0 | 0 | 2 | 8 | 0 | ✅ Mastered |
| Fractions | 8 | 8 | 0 | 0 | 0 | 0 | 🔒 Locked |

**UX** : Satisfaction visuelle, prochaine révision dans plusieurs semaines.

---

## Avantages du Système

1. **Clarté immédiate** : En un coup d'œil, l'utilisateur sait où il en est
2. **Guidage sans contrainte** : Les états suggèrent l'ordre sans l'imposer
3. **Feedback positif** : L'état "Maîtrisé" crée de la satisfaction
4. **Réduction de l'anxiété** : L'état "En sommeil" clarifie qu'on n'a rien à faire
5. **Incitation à la découverte** : L'état "Jamais commencé" met en valeur le contenu nouveau

## Implémentation Technique

### Type TypeScript

```typescript
interface EnhancedDeckStats {
  total: number;
  unseen: number;
  new: number;
  learning: number;
  review: number;
  due: number;
  sleeping: number;
  maturePercent: number;
  nextReviewDate: number | null;
  hasBeenStarted: boolean;
  isMastered: boolean;
  discoveryCount: number;
}
```

### Fonction de Détermination

```typescript
function getDeckState(stats: EnhancedDeckStats): DeckState {
  if (stats.isMastered) return 'mastered';
  if (!stats.hasBeenStarted) return 'locked';
  if (stats.due > 0 || stats.discoveryCount > 0) return 'discovery';
  return 'sleeping';
}
```

---

## Évolutions Futures Possibles

1. **Personnalisation du seuil de maîtrise** : Permettre à l'utilisateur de régler le % (actuellement 80%)
2. **Badge de streak par chapitre** : Combien de jours consécutifs on a révisé ce chapitre
3. **Prédiction de maîtrise** : "Encore 3 jours pour maîtriser ce chapitre"
4. **Comparaison avec la moyenne** : "Tu progresses plus vite que la moyenne sur ce chapitre"
