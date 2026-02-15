# 🎓 DNB FlashCards

Application mobile de flashcards optimisée pour la révision du **Brevet des Collèges** (France).

Basée sur la science de l'apprentissage :
- **Effet de test** (Roediger & Karpicke, 2006)
- **Répétition espacée** (Cepeda et al., 2006)

## ✨ Fonctionnalités

- 📚 **Decks complets** : Maths, Français, Histoire-Géo, SVT, Physique-Chimie, Technologie, Anglais
- 🧠 **Algorithme SM-2** : Répétition espacée optimisée
- 📴 **Offline first** : Fonctionne sans connexion
- 📊 **Statistiques** : Suivi de progression et série de jours
- 🎯 **Mode révision** : Test actif avec feedback immédiat

## 🚀 Installation

### Prérequis
- Node.js (v18+)
- Android Studio (pour l'émulateur) ou un téléphone Android

### Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/hydropix/DNB_FlashCard.git
cd DNB_FlashCard

# Installer les dépendances
npm install

# Lancer sur Android
npm run android
```

## 📱 Utilisation

1. **Premier lancement** : Va dans "Paramètres" → "Importer les decks du Brevet"
2. **Réviser** : Sélectionne un deck ou clique sur "Réviser tout"
3. **Notation** : Sois honnête !
   - ❌ **À revoir** : Tu ne savais pas
   - 😅 **Difficile** : Tu as eu du mal
   - 👍 **Correct** : Tu connaissais
   - ⭐ **Facile** : Réponse immédiate
4. **Répéter** : Revient demain pour les cartes dues

## 🏗️ Architecture

```
src/
├── algorithms/
│   └── srs.ts          # Algorithme SM-2 (SuperMemo 2)
├── components/
│   ├── Flashcard.tsx   # Composant carte avec flip
│   ├── RatingButtons.tsx
│   ├── DeckCard.tsx
│   └── ProgressBar.tsx
├── data/
│   └── builtinDecks.ts # +100 cartes du brevet
├── screens/
│   ├── HomeScreen.tsx
│   ├── ReviewScreen.tsx
│   ├── StatsScreen.tsx
│   └── SettingsScreen.tsx
├── storage/
│   └── database.ts     # SQLite avec expo-sqlite
└── types/
    └── index.ts        # Types TypeScript
```

## 🧪 Algorithme SM-2

L'algorithme calcule l'intervalle optimal entre les révisions :

1. **Nouvelle carte** : Intervalle = 1 jour
2. **2ème réussite** : Intervalle = 6 jours
3. **Réussites suivantes** : Intervalle × Ease Factor
4. **Échec** : Retour à intervalle = 1 jour

**Ease Factor** ajusté selon tes performances :
- Défaut : 2.5
- Minimum : 1.3
- Ajusté à chaque révision

## 📖 Contenu du Brevet

| Matière | Nombre de cartes |
|---------|-----------------|
| Maths - Algèbre | 15 |
| Maths - Géométrie | 14 |
| Français - Grammaire | 10 |
| Français - Méthodologie | 5 |
| Histoire-Géographie | 10 |
| SVT | 9 |
| Physique-Chimie | 12 |
| Technologie | 6 |
| Anglais | 6 |
| **Total** | **+100** |

## 🔮 Roadmap

- [ ] Synchronisation cloud (Supabase)
- [ ] Notifications push pour les révisions
- [ ] Mode examen blanc
- [ ] Ajout de ses propres cartes
- [ ] Support images/LaTeX
- [ ] Widget Android

## 📝 Licence

MIT License - Libre d'utilisation et de modification

---

**Bon courage pour le Brevet ! 💪**
