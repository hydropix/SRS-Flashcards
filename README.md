# 🎓 SRS FlashCards

Mobile flashcard app optimized for reviewing for the **Brevet des Collèges** (France).

Based on learning science:
- **Testing effect** (Roediger & Karpicke, 2006)
- **Spaced repetition** (Cepeda et al., 2006)

## ✨ Features

- 📚 **Complete decks**: Math, French, History-Geography, Life and Earth Sciences, Physics-Chemistry, Technology, English
- 🧠 **SM-2 algorithm**: Optimized spaced repetition
- 📴 **Offline first**: Works without an internet connection
- 📊 **Statistics**: Progress tracking and streak days
- 🎯 **Review mode**: Active testing with immediate feedback

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- Android Studio (for the emulator) or an Android phone

### Quick start

```bash
# Clone the repo
git clone https://github.com/hydropix/DNB_FlashCard.git
cd DNB_FlashCard

# Install dependencies
npm install

# Launch on Android
npm run android
```

## 📱 Usage

1. **First launch**: Go to "Settings" → "Import Brevet decks"
2. **Review**: Select a deck or click "Review all"
3. **Rating**: Be honest!
   - ❌ **To review**: You didn't know
   - 😅 **Difficult**: You had trouble
   - 👍 **Correct**: You knew
   - ⭐ **Easy**: Immediate answer
4. **Repeat**: Come back tomorrow for the cards due

## 🏗️ Architecture

```
src/
├── algorithms/
│   └── srs.ts          # SM-2 (SuperMemo 2) algorithm
├── components/
│   ├── Flashcard.tsx   # Flip card component
│   ├── RatingButtons.tsx
│   ├── DeckCard.tsx
│   └── ProgressBar.tsx
├── data/
│   └── builtinDecks.ts # +100 cards from the patent
├── screens/
│   ├── HomeScreen.tsx
│   ├── ReviewScreen.tsx
│   ├── StatsScreen.tsx
│   └── SettingsScreen.tsx
├── storage/
│   └── database.ts     # SQLite with expo-sqlite
└── types/
    └── index.ts        # TypeScript types
```

## 🧪 SM-2 Algorithm

The algorithm calculates the optimal interval between reviews:

1. **New card**: Interval = 1 day
2. **2nd success**: Interval = 6 days
3. **Subsequent successes**: Interval × Ease Factor
4. **Failure**: Return to interval = 1 day

**Ease Factor** adjusted according to your performance:
- Default: 2.5
- Minimum: 1.3
- Adjusted with each review

## 📖 Patent Content

| Subject | Number of cards |
|---------|-----------------|
| Math - Algebra | 15 |
| Math - Geometry | 14 |
| English - Grammar | 10 |
| English - Methodology | 5 |
| History-Geography | 10 |
| Life and Earth Sciences | 9 |
| Physics-Chemistry | 12 |
| Technology | 6 |
| English | 6 |
| **Total** | **+100** |

## 🔮 Roadmap

- [ ] Cloud synchronization (Supabase)
- [ ] Push notifications for revisions
- [ ] Mock exam mode
- [ ] Add your own cards
- [ ] Image/LaTeX support
- [ ] Android widget

## 📝 License

MIT License - Free to use and modify

---

**Good luck with your exams! 💪**

*** Translated with www.DeepL.com/Translator (free version) ***

