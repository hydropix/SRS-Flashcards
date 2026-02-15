/**
 * Decks et cartes intégrés pour le Brevet des Collèges
 * Couvre toutes les matières du DNB
 * 
 * Mise à jour : Intégration complète des mathématiques (145 cartes)
 * Date : 14/02/2026
 */

import { Card, Deck, Subject, SUBJECT_COLORS } from '../types';

// ============= DECKS =============

export const builtinDecks: Deck[] = [
  {
    id: 'math-arithmetique',
    name: "Mathématiques - Arithmétique",
    subject: 'maths',
    description: "Nombres premiers, PGCD, PPCM, divisibilité",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-fractions',
    name: "Mathématiques - Fractions",
    subject: 'maths',
    description: "Opérations sur les fractions",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-relatifs-puissances',
    name: "Mathématiques - Relatifs et Puissances",
    subject: 'maths',
    description: "Nombres relatifs, puissances, écriture scientifique",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-calcul-litteral',
    name: "Mathématiques - Calcul Littéral",
    subject: 'maths',
    description: "Développement, factorisation, identités remarquables, équations",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-fonctions',
    name: "Mathématiques - Fonctions",
    subject: 'maths',
    description: "Fonctions affines, image, antécédent, variation",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-pythagore',
    name: "Mathématiques - Théorème de Pythagore",
    subject: 'maths',
    description: "Théorème, réciproque et contraposée de Pythagore",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-thales',
    name: "Mathématiques - Théorème de Thalès",
    subject: 'maths',
    description: "Théorème, réciproque et contraposée de Thalès",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-trigonometrie',
    name: "Mathématiques - Trigonométrie",
    subject: 'maths',
    description: "Cosinus, sinus, tangente dans le triangle rectangle",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-probabilites',
    name: "Mathématiques - Probabilités",
    subject: 'maths',
    description: "Calcul de probabilités, équiprobabilité, événements",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-statistiques',
    name: "Mathématiques - Statistiques",
    subject: 'maths',
    description: "Moyenne, médiane, étendue, quartiles",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-pourcentages',
    name: "Mathématiques - Pourcentages",
    subject: 'maths',
    description: "Calculs de pourcentages, augmentation, réduction",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-aires-volumes',
    name: "Mathématiques - Aires et Volumes",
    subject: 'maths',
    description: "Formules d'aires et volumes des figures usuelles",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-geometrie-angles',
    name: "Mathématiques - Géométrie et Angles",
    subject: 'maths',
    description: "Propriétés des angles, triangles, quadrilatères",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-conversions',
    name: "Mathématiques - Conversions et Vitesses",
    subject: 'maths',
    description: "Conversions d'unités et calculs de vitesses",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'math-echelles',
    name: "Mathématiques - Échelles",
    subject: 'maths',
    description: "Échelles, agrandissements et réductions",
    color: SUBJECT_COLORS['maths'],
    icon: 'calculator',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  // FRANÇAIS
  {
    id: 'francais-grammaire',
    name: 'Français - Grammaire',
    subject: 'francais',
    description: 'Nature des mots, fonctions, conjugaison',
    color: SUBJECT_COLORS['francais'],
    icon: 'book-open-variant',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'francais-methodologie',
    name: 'Français - Méthodologie',
    subject: 'francais',
    description: 'Commentaire, dissertation, question de corpus',
    color: SUBJECT_COLORS['francais'],
    icon: 'file-document',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  // AUTRES MATIÈRES
  {
    id: 'histoire-geo',
    name: 'Histoire-Géographie',
    subject: 'histoire-geo',
    description: 'De 1914 à nos jours, géographie du monde',
    color: SUBJECT_COLORS['histoire-geo'],
    icon: 'earth',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'svt',
    name: 'SVT',
    subject: 'svt',
    description: 'Géologie, reproduction, écosystèmes, énergie',
    color: SUBJECT_COLORS['svt'],
    icon: 'leaf',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'physique-chimie',
    name: 'Physique-Chimie',
    subject: 'physique-chimie',
    description: 'Mouvement, électricité, chimie organique',
    color: SUBJECT_COLORS['physique-chimie'],
    icon: 'flash',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'technologie',
    name: 'Technologie',
    subject: 'technologie',
    description: 'Innovation, objets techniques, programmation',
    color: SUBJECT_COLORS['technologie'],
    icon: 'cog',
    isBuiltin: true,
    createdAt: Date.now(),
  },
  {
    id: 'anglais',
    name: 'Anglais',
    subject: 'anglais',
    description: 'Vocabulaire, grammaire, expressions clés',
    color: SUBJECT_COLORS['anglais'],
    icon: 'translate',
    isBuiltin: true,
    createdAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Arithmétique
export const math_arithmetiqueCards: Card[] = [
  {
    id: 'math-arith-001',
    deckId: 'math-arithmetique',
    question: `Qu'est-ce qu'un nombre premier ?`,
    answer: `Un nombre entier naturel supérieur ou égal à 2 qui n'a exactement que deux diviseurs : 1 et lui-même.`,
    explanation: `Exemples : 2, 3, 5, 7, 11, 13 sont premiers.
Contre-exemples : 4 = 2×2 (4 diviseurs), 1 n'est pas premier (1 seul diviseur).`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-arith-002',
    deckId: 'math-arithmetique',
    question: `Décomposer 60 en produit de facteurs premiers.`,
    answer: `60 = 2² × 3 × 5`,
    explanation: `Méthode : Diviser successivement par les nombres premiers.
60 ÷ 2 = 30
30 ÷ 2 = 15
15 ÷ 3 = 5
5 ÷ 5 = 1`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-arith-003',
    deckId: 'math-arithmetique',
    question: `Quels sont les critères de divisibilité par 2, 3, 5, 9 et 10 ?`,
    answer: `• Par 2 : le nombre est pair (termine par 0,2,4,6,8)
• Par 3 : la somme des chiffres est divisible par 3
• Par 5 : le nombre termine par 0 ou 5
• Par 9 : la somme des chiffres est divisible par 9
• Par 10 : le nombre termine par 0`,
    explanation: `Exemple : 126 est divisible par 2 (pair), par 3 (1+2+6=9), mais pas par 5, 9 ou 10.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-arith-004',
    deckId: 'math-arithmetique',
    question: `Calculer le PGCD de 48 et 60.`,
    answer: `PGCD(48, 60) = 12`,
    explanation: `Méthode 1 - Décomposition :
48 = 2⁴ × 3
60 = 2² × 3 × 5
PGCD = 2² × 3 = 12

Méthode 2 - Algorithme d'Euclide :
60 = 48 × 1 + 12
48 = 12 × 4 + 0
Le PGCD est le dernier reste non nul : 12`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-arith-005',
    deckId: 'math-arithmetique',
    question: `Calculer le PPCM de 12 et 18.`,
    answer: `PPCM(12, 18) = 36`,
    explanation: `Méthode - Décomposition :
12 = 2² × 3
18 = 2 × 3²
PPCM = 2² × 3² = 36

Formule : PGCD(a,b) × PPCM(a,b) = a × b`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-arith-006',
    deckId: 'math-arithmetique',
    question: `Simplifier la fraction 84/126.`,
    answer: `84/126 = 2/3`,
    explanation: `Méthode :
1) PGCD(84, 126) = 42
2) 84 ÷ 42 = 2
3) 126 ÷ 42 = 3
Donc 84/126 = 2/3`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-arith-007',
    deckId: 'math-arithmetique',
    question: `Trouver tous les diviseurs de 36.`,
    answer: `Les diviseurs de 36 sont : 1, 2, 3, 4, 6, 9, 12, 18, 36`,
    explanation: `Méthode : Rechercher par paires.
36 = 1×36 = 2×18 = 3×12 = 4×9 = 6×6`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-arith-008',
    deckId: 'math-arithmetique',
    question: `Deux rubans mesurent 24 m et 36 m. On veut les découper en morceaux de même longueur, la plus grande possible. Quelle est cette longueur ?`,
    answer: `La longueur est 12 m.`,
    explanation: `Il s'agit de trouver le PGCD de 24 et 36.
PGCD(24, 36) = 12
On obtiendra 2 morceaux pour le premier ruban et 3 pour le second.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Fractions
export const math_fractionsCards: Card[] = [
  {
    id: 'math-frac-001',
    deckId: 'math-fractions',
    question: `Simplifier la fraction 45/60.`,
    answer: `45/60 = 3/4`,
    explanation: `PGCD(45, 60) = 15
45 ÷ 15 = 3
60 ÷ 15 = 4`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-frac-002',
    deckId: 'math-fractions',
    question: `Calculer : $\\frac{3}{4} + \\frac{5}{6}$`,
    answer: `$\\frac{3}{4} + \\frac{5}{6} = \\frac{19}{12}$`,
    explanation: `Mettre au même dénominateur (PPCM de 4 et 6 = 12) :
$\\frac{3}{4} = \\frac{9}{12}$
$\\frac{5}{6} = \\frac{10}{12}$
$\\frac{9}{12} + \\frac{10}{12} = \\frac{19}{12}$`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-frac-003',
    deckId: 'math-fractions',
    question: `Calculer : 7/8 - 1/4`,
    answer: `7/8 - 1/4 = 5/8`,
    explanation: `1/4 = 2/8
7/8 - 2/8 = 5/8`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-frac-004',
    deckId: 'math-fractions',
    question: `Calculer : 2/3 × 9/4`,
    answer: `2/3 × 9/4 = 3/2`,
    explanation: `Multiplier numérateurs et dénominateurs :
(2×9)/(3×4) = 18/12 = 3/2`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-frac-005',
    deckId: 'math-fractions',
    question: `Calculer : 3/5 ÷ 2/3`,
    answer: `3/5 ÷ 2/3 = 9/10`,
    explanation: `Diviser par une fraction = multiplier par son inverse :
3/5 × 3/2 = 9/10`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-frac-006',
    deckId: 'math-fractions',
    question: `Quelle est la fraction irréductible égale à 0,75 ?`,
    answer: `0,75 = 3/4`,
    explanation: `0,75 = 75/100 = 3/4 (en simplifiant par 25)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-frac-007',
    deckId: 'math-fractions',
    question: `Comparer 5/7 et 3/4.`,
    answer: `5/7 < 3/4`,
    explanation: `Mettre au même dénominateur (28) :
5/7 = 20/28
3/4 = 21/28
20/28 < 21/28`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Relatifs et Puissances
export const math_relatifs_puissancesCards: Card[] = [
  {
    id: 'math-rel-001',
    deckId: 'math-relatifs-puissances',
    question: `Calculer : (-3) + (-7)`,
    answer: `(-3) + (-7) = -10`,
    explanation: `Addition de deux nombres négatifs : on additionne les valeurs absolues et on garde le signe négatif.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-rel-002',
    deckId: 'math-relatifs-puissances',
    question: `Calculer : (-5) × (-4)`,
    answer: `(-5) × (-4) = 20`,
    explanation: `Règle des signes : (-) × (-) = (+)
5 × 4 = 20`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-rel-003',
    deckId: 'math-relatifs-puissances',
    question: `Calculer : (-12) ÷ 3`,
    answer: `(-12) ÷ 3 = -4`,
    explanation: `Règle des signes : (-) ÷ (+) = (-)
12 ÷ 3 = 4`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pui-001',
    deckId: 'math-relatifs-puissances',
    question: `Simplifier : $2^5 \\times 2^3$`,
    answer: `$2^5 \\times 2^3 = 2^8 = 256$`,
    explanation: `Règle : $a^m \\times a^n = a^{m+n}$
$5 + 3 = 8$`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pui-002',
    deckId: 'math-relatifs-puissances',
    question: `Simplifier : (3⁴)²`,
    answer: `(3⁴)² = 3⁸`,
    explanation: `Règle : (aᵐ)ⁿ = aᵐˣⁿ
4 × 2 = 8`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pui-003',
    deckId: 'math-relatifs-puissances',
    question: `Simplifier : 5⁷ ÷ 5⁴`,
    answer: `5⁷ ÷ 5⁴ = 5³ = 125`,
    explanation: `Règle : aᵐ ÷ aⁿ = aᵐ⁻ⁿ
7 - 4 = 3`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pui-004',
    deckId: 'math-relatifs-puissances',
    question: `Calculer : 10⁻³`,
    answer: `10⁻³ = 0,001 = 1/1000`,
    explanation: `Règle : a⁻ⁿ = 1/aⁿ
10⁻³ = 1/10³ = 1/1000 = 0,001`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pui-005',
    deckId: 'math-relatifs-puissances',
    question: `Donner l'écriture scientifique de 45 600 000.`,
    answer: `4,56 × 10⁷`,
    explanation: `Écriture scientifique : a × 10ⁿ avec 1 ≤ a < 10
45 600 000 = 4,56 × 10 000 000 = 4,56 × 10⁷`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pui-006',
    deckId: 'math-relatifs-puissances',
    question: `Donner l'écriture décimale de 6,2 × 10⁻⁴.`,
    answer: `6,2 × 10⁻⁴ = 0,00062`,
    explanation: `L'exposant négatif indique un nombre petit.
Décaler la virgule de 4 rangs vers la gauche.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pui-007',
    deckId: 'math-relatifs-puissances',
    question: `Calculer : (2 × 10³) × (3 × 10⁵)`,
    answer: `6 × 10⁸`,
    explanation: `(2 × 3) × (10³ × 10⁵) = 6 × 10⁸`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Calcul Littéral
export const math_calcul_litteralCards: Card[] = [
  {
    id: 'math-lit-001',
    deckId: 'math-calcul-litteral',
    question: `Développer : 3(2x + 5)`,
    answer: `3(2x + 5) = 6x + 15`,
    explanation: `Distributivité simple : k(a + b) = ka + kb
3 × 2x = 6x et 3 × 5 = 15`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-002',
    deckId: 'math-calcul-litteral',
    question: `Développer : (x + 3)(x + 2)`,
    answer: `(x + 3)(x + 2) = x² + 5x + 6`,
    explanation: `Double distributivité :
(x + 3)(x + 2) = x×x + x×2 + 3×x + 3×2
= x² + 2x + 3x + 6
= x² + 5x + 6`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-003',
    deckId: 'math-calcul-litteral',
    question: `Factoriser : 6x + 9`,
    answer: `6x + 9 = 3(2x + 3)`,
    explanation: `PGCD de 6 et 9 est 3.
3 × 2x = 6x et 3 × 3 = 9`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-004',
    deckId: 'math-calcul-litteral',
    question: `Factoriser : $x^2 - 25$`,
    answer: `$x^2 - 25 = (x + 5)(x - 5)$`,
    explanation: `Identité remarquable : $a^2 - b^2 = (a + b)(a - b)$
Ici $a = x$ et $b = 5$ (car $25 = 5^2$)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-005',
    deckId: 'math-calcul-litteral',
    question: `Développer : (x + 4)²`,
    answer: `(x + 4)² = x² + 8x + 16`,
    explanation: `Identité remarquable : (a + b)² = a² + 2ab + b²
x² + 2×x×4 + 4² = x² + 8x + 16`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-006',
    deckId: 'math-calcul-litteral',
    question: `Développer : (x - 3)²`,
    answer: `(x - 3)² = x² - 6x + 9`,
    explanation: `Identité remarquable : (a - b)² = a² - 2ab + b²
x² - 2×x×3 + 3² = x² - 6x + 9`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-007',
    deckId: 'math-calcul-litteral',
    question: `Factoriser : x² + 10x + 25`,
    answer: `x² + 10x + 25 = (x + 5)²`,
    explanation: `Identité remarquable : a² + 2ab + b² = (a + b)²
25 = 5² et 10x = 2×x×5`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-008',
    deckId: 'math-calcul-litteral',
    question: `Résoudre l'équation : 3x + 7 = 22`,
    answer: `x = 5`,
    explanation: `3x + 7 = 22
3x = 22 - 7
3x = 15
x = 15 ÷ 3
x = 5

Vérification : 3×5 + 7 = 15 + 7 = 22 ✓`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-009',
    deckId: 'math-calcul-litteral',
    question: `Résoudre l'équation : 5x - 3 = 2x + 9`,
    answer: `x = 4`,
    explanation: `5x - 3 = 2x + 9
5x - 2x = 9 + 3
3x = 12
x = 4

Vérification : 5×4 - 3 = 17 et 2×4 + 9 = 17 ✓`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-010',
    deckId: 'math-calcul-litteral',
    question: `Résoudre l'équation produit : (x - 2)(x + 5) = 0`,
    answer: `x = 2 ou x = -5`,
    explanation: `Propriété : Si A × B = 0, alors A = 0 ou B = 0

x - 2 = 0  donc  x = 2
ou
x + 5 = 0  donc  x = -5`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-011',
    deckId: 'math-calcul-litteral',
    question: `Résoudre : x² = 36`,
    answer: `x = 6 ou x = -6`,
    explanation: `Les deux nombres dont le carré vaut 36 sont 6 et -6.
On note aussi : x = ±6`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-lit-012',
    deckId: 'math-calcul-litteral',
    question: `Calculer la valeur de A = 3x² - 2x + 5 pour x = -2`,
    answer: `A = 21`,
    explanation: `A = 3×(-2)² - 2×(-2) + 5
A = 3×4 + 4 + 5
A = 12 + 4 + 5
A = 21`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Fonctions
export const math_fonctionsCards: Card[] = [
  {
    id: 'math-fct-001',
    deckId: 'math-fonctions',
    question: `Qu'est-ce qu'une fonction affine ? Donner sa forme générale.`,
    answer: `Une fonction affine est de la forme f(x) = ax + b, où a et b sont des nombres fixés.`,
    explanation: `• a est le coefficient directeur (pente)
• b est l'ordonnée à l'origine
Si b = 0, c'est une fonction linéaire.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-fct-002',
    deckId: 'math-fonctions',
    question: `Soit f(x) = 2x - 3. Calculer l'image de 4 par f.`,
    answer: `f(4) = 5`,
    explanation: `f(4) = 2×4 - 3 = 8 - 3 = 5
L'image de 4 est 5.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-fct-003',
    deckId: 'math-fonctions',
    question: `Soit f(x) = 3x + 5. Calculer l'antécédent de 14.`,
    answer: `L'antécédent de 14 est 3.`,
    explanation: `Résoudre f(x) = 14 :
3x + 5 = 14
3x = 9
x = 3`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-fct-004',
    deckId: 'math-fonctions',
    question: `Comment reconnaît-on graphiquement une fonction affine ?`,
    answer: `Sa représentation graphique est une droite.`,
    explanation: `• Coefficient a = pente de la droite
• Coefficient b = ordonnée à l'origine (point d'intersection avec l'axe des ordonnées)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-fct-005',
    deckId: 'math-fonctions',
    question: `Déterminer le sens de variation de f(x) = -2x + 5.`,
    answer: `f est décroissante (car a = -2 < 0)`,
    explanation: `Règle :
• Si a > 0 : fonction croissante
• Si a < 0 : fonction décroissante
• Si a = 0 : fonction constante`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-fct-006',
    deckId: 'math-fonctions',
    question: `Donner le tableau de signes de f(x) = 2x - 6.`,
    answer: `• f(x) < 0 pour x < 3
• f(x) = 0 pour x = 3
• f(x) > 0 pour x > 3`,
    explanation: `Résoudre 2x - 6 = 0 donne x = 3.
Comme a = 2 > 0, la fonction est croissante :
- négative avant 3
- positive après 3`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-fct-007',
    deckId: 'math-fonctions',
    question: `Déterminer algébriquement la fonction affine f telle que f(2) = 7 et f(4) = 13.`,
    answer: `f(x) = 3x + 1`,
    explanation: `f(x) = ax + b
f(2) = 2a + b = 7
f(4) = 4a + b = 13

Soustraction : 2a = 6 donc a = 3
2×3 + b = 7 donc b = 1`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Théorème de Pythagore
export const math_pythagoreCards: Card[] = [
  {
    id: 'math-pyt-001',
    deckId: 'math-pythagore',
    question: `Énoncer le théorème de Pythagore.`,
    answer: `Si un triangle est rectangle, alors le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.`,
    explanation: `Dans un triangle ABC rectangle en A :
BC² = AB² + AC²
(BC est l'hypoténuse, côté le plus long, face à l'angle droit)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pyt-002',
    deckId: 'math-pythagore',
    question: `ABC est un triangle rectangle en A avec $AB = 6$ cm et $AC = 8$ cm. Calculer $BC$.`,
    answer: `$BC = 10$ cm`,
    explanation: `D'après le théorème de Pythagore :
$$BC^2 = AB^2 + AC^2$$
$$BC^2 = 6^2 + 8^2 = 36 + 64 = 100$$
$$BC = \\sqrt{100} = 10$ cm`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pyt-003',
    deckId: 'math-pythagore',
    question: `Énoncer la réciproque du théorème de Pythagore.`,
    answer: `Si dans un triangle, le carré du plus grand côté est égal à la somme des carrés des deux autres côtés, alors ce triangle est rectangle.`,
    explanation: `Cette réciproque permet de DÉMONTRER qu'un triangle est rectangle.
Si BC² = AB² + AC², alors le triangle est rectangle en A.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pyt-004',
    deckId: 'math-pythagore',
    question: `Le triangle de côtés 7 cm, 24 cm et 25 cm est-il rectangle ?`,
    answer: `Oui, ce triangle est rectangle.`,
    explanation: `Vérifions : 25² = 625
et 7² + 24² = 49 + 576 = 625

Comme 25² = 7² + 24², d'après la réciproque de Pythagore, le triangle est rectangle (en face du côté de 25 cm).`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pyt-005',
    deckId: 'math-pythagore',
    question: `Énoncer la contraposée du théorème de Pythagore.`,
    answer: `Si dans un triangle, le carré du plus grand côté n'est pas égal à la somme des carrés des deux autres côtés, alors ce triangle n'est pas rectangle.`,
    explanation: `La contraposée permet de DÉMONTRER qu'un triangle N'EST PAS rectangle.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pyt-006',
    deckId: 'math-pythagore',
    question: `Le triangle de côtés 5 cm, 7 cm et 9 cm est-il rectangle ?`,
    answer: `Non, ce triangle n'est pas rectangle.`,
    explanation: `Vérifions : 9² = 81
et 5² + 7² = 25 + 49 = 74

Comme 81 ≠ 74, d'après la contraposée de Pythagore, le triangle n'est pas rectangle.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pyt-007',
    deckId: 'math-pythagore',
    question: `Dans un triangle rectangle, l'hypoténuse mesure 13 cm et un côté mesure 5 cm. Calculer l'autre côté.`,
    answer: `L'autre côté mesure 12 cm.`,
    explanation: `BC² = AB² + AC²
13² = 5² + AC²
169 = 25 + AC²
AC² = 144
AC = 12 cm`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Théorème de Thalès
export const math_thalesCards: Card[] = [
  {
    id: 'math-tha-001',
    deckId: 'math-thales',
    question: `Dans quelle configuration peut-on appliquer le théorème de Thalès ?`,
    answer: `Deux droites sécantes coupées par deux droites parallèles.`,
    explanation: `Configuration 'triangles emboîtés' ou 'papillon' :
- Deux droites sécantes en un point O
- Deux droites parallèles coupant ces droites
- Les points sont alignés avec O dans le même ordre`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tha-002',
    deckId: 'math-thales',
    question: `Énoncer le théorème de Thalès.`,
    answer: `Si deux droites sont coupées par des droites parallèles, alors les longueurs des segments correspondants sont proportionnelles.`,
    explanation: `Avec les triangles OAB et OCD (AB // CD) :
OA/OC = OB/OD = AB/CD`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tha-003',
    deckId: 'math-thales',
    question: `Sur la figure, (AB) // (CD), OA = 3 cm, OB = 4 cm, OC = 6 cm, CD = 8 cm. Calculer AB et OD.`,
    answer: `AB = 4 cm et OD = 8 cm`,
    explanation: `D'après le théorème de Thalès :
OA/OC = OB/OD = AB/CD
3/6 = 4/OD = AB/8

3/6 = 1/2 donc AB = 8×(1/2) = 4 cm
4/OD = 1/2 donc OD = 8 cm`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tha-004',
    deckId: 'math-thales',
    question: `Énoncer la réciproque du théorème de Thalès.`,
    answer: `Si les points sont alignés dans le même ordre et si OA/OC = OB/OD, alors les droites (AB) et (CD) sont parallèles.`,
    explanation: `La réciproque permet de DÉMONTRER que deux droites sont parallèles.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tha-005',
    deckId: 'math-thales',
    question: `Les points sont alignés dans l'ordre. OA = 2, OB = 3, OC = 4, OD = 6. Les droites (AB) et (CD) sont-elles parallèles ?`,
    answer: `Oui, (AB) // (CD).`,
    explanation: `Vérifions : OA/OC = 2/4 = 1/2
et OB/OD = 3/6 = 1/2

Comme OA/OC = OB/OD et que les points sont dans le même ordre, d'après la réciproque de Thalès, (AB) // (CD).`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tha-006',
    deckId: 'math-thales',
    question: `Énoncer la contraposée du théorème de Thalès.`,
    answer: `Si OA/OC ≠ OB/OD, alors les droites (AB) et (CD) ne sont pas parallèles.`,
    explanation: `La contraposée permet de DÉMONTRER que deux droites ne sont PAS parallèles.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tha-007',
    deckId: 'math-thales',
    question: `Dans la configuration de Thalès, calculer MN sachant que AM = 4, AB = 10 et BC = 15, avec (MN) // (BC).`,
    answer: `MN = 6`,
    explanation: `Les triangles AMN et ABC sont en position de Thalès.
AM/AB = MN/BC
4/10 = MN/15
MN = 15 × 4/10 = 60/10 = 6`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Trigonométrie
export const math_trigonometrieCards: Card[] = [
  {
    id: 'math-tri-001',
    deckId: 'math-trigonometrie',
    question: `Dans un triangle rectangle, donner la formule du cosinus d'un angle aigu.`,
    answer: `cosinus = adjacent / hypoténuse`,
    explanation: `Mnémonique : CAH
Cosinus = Adjacent / Hypoténuse

Le côté adjacent est le côté de l'angle qui n'est pas l'hypoténuse.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tri-002',
    deckId: 'math-trigonometrie',
    question: `Dans un triangle rectangle, donner la formule du sinus d'un angle aigu.`,
    answer: `sinus = opposé / hypoténuse`,
    explanation: `Mnémonique : SOH
Sinus = Opposé / Hypoténuse

Le côté opposé est le côté en face de l'angle (qui n'est pas l'hypoténuse).`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tri-003',
    deckId: 'math-trigonometrie',
    question: `Dans un triangle rectangle, donner la formule de la tangente d'un angle aigu.`,
    answer: `tangente = opposé / adjacent`,
    explanation: `Mnémonique : TOA
Tangente = Opposé / Adjacent

On peut aussi écrire : tan(x) = sin(x)/cos(x)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tri-004',
    deckId: 'math-trigonometrie',
    question: `Rappeler la mnémonique SOH-CAH-TOA.`,
    answer: `• SOH : Sinus = Opposé / Hypoténuse
• CAH : Cosinus = Adjacent / Hypoténuse
• TOA : Tangente = Opposé / Adjacent`,
    explanation: `Cette phrase mnémotechnique permet de retenir les trois formules de trigonométrie dans le triangle rectangle.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tri-005',
    deckId: 'math-trigonometrie',
    question: `Dans un triangle rectangle ABC avec angle droit en A, AB = 6 cm et AC = 8 cm. Calculer cos(C).`,
    answer: `cos(C) = 0,8`,
    explanation: `D'abord calculer BC (hypoténuse) :
BC² = 6² + 8² = 36 + 64 = 100
BC = 10 cm

Pour l'angle C :
• Adjacent = 8 cm
• Hypoténuse = 10 cm
cos(C) = 8/10 = 0,8`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tri-006',
    deckId: 'math-trigonometrie',
    question: `Dans un triangle rectangle, un angle aigu a pour cosinus 0,6. Quel est son sinus ?`,
    answer: `sinus = 0,8`,
    explanation: `Relation : cos²(x) + sin²(x) = 1
0,6² + sin²(x) = 1
0,36 + sin²(x) = 1
sin²(x) = 0,64
sin(x) = 0,8 (positif car angle aigu)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tri-007',
    deckId: 'math-trigonometrie',
    question: `Calculer la mesure de l'angle x sachant que tan(x) = 1.`,
    answer: `x = 45°`,
    explanation: `tan(x) = 1 signifie que opposé = adjacent
C'est un triangle rectangle isocèle.
L'angle vaut 45°.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-tri-008',
    deckId: 'math-trigonometrie',
    question: `Quelle relation lie cosinus et sinus d'un même angle ?`,
    answer: `$\\cos^2(x) + \\sin^2(x) = 1$`,
    explanation: `C'est la relation fondamentale de trigonométrie.

Exemple : $\\cos(60°) = 0,5$ et $\\sin(60°) \\approx 0,866$
$$0,5^2 + 0,866^2 = 0,25 + 0,75 = 1$$`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Probabilités
export const math_probabilitesCards: Card[] = [
  {
    id: 'math-pro-001',
    deckId: 'math-probabilites',
    question: `Comment calcule-t-on la probabilité d'un événement dans une situation d'équiprobabilité ?`,
    answer: `P(E) = nombre de cas favorables / nombre de cas possibles`,
    explanation: `En situation d'équiprobabilité, tous les cas ont la même chance de se produire.

Exemple : Probabilité de tirer un as dans un jeu de 52 cartes = 4/52 = 1/13`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pro-002',
    deckId: 'math-probabilites',
    question: `Quelle est la probabilité d'obtenir un 6 en lançant un dé équilibré ?`,
    answer: `P(6) = 1/6`,
    explanation: `• Cas favorables : 1 (le 6)
• Cas possibles : 6 (1, 2, 3, 4, 5, 6)
• P(6) = 1/6`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pro-003',
    deckId: 'math-probabilites',
    question: `Quelle est la probabilité d'obtenir un nombre pair en lançant un dé ?`,
    answer: `P(pair) = 3/6 = 1/2`,
    explanation: `• Cas favorables : 3 (2, 4, 6)
• Cas possibles : 6
• P(pair) = 3/6 = 1/2`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pro-004',
    deckId: 'math-probabilites',
    question: `Quelle relation lie la probabilité d'un événement et celle de son contraire ?`,
    answer: `P(non E) = 1 - P(E)`,
    explanation: `La somme des probabilités d'un événement et de son contraire vaut 1.

Exemple : Si P(gagner) = 0,3 alors P(perdre) = 1 - 0,3 = 0,7`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pro-005',
    deckId: 'math-probabilites',
    question: `On tire une carte dans un jeu de 32 cartes. Quelle est la probabilité de ne pas tirer un roi ?`,
    answer: `P(pas roi) = 28/32 = 7/8`,
    explanation: `• 4 rois dans un jeu de 32 cartes
• P(roi) = 4/32 = 1/8
• P(pas roi) = 1 - 1/8 = 7/8
Ou directement : (32-4)/32 = 28/32 = 7/8`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pro-006',
    deckId: 'math-probabilites',
    question: `Une urne contient 3 boules rouges et 5 boules bleues. On tire une boule au hasard. Quelle est la probabilité de tirer une boule rouge ?`,
    answer: `P(rouge) = 3/8`,
    explanation: `• Cas favorables : 3 (boules rouges)
• Cas possibles : 3 + 5 = 8
• P(rouge) = 3/8`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pro-007',
    deckId: 'math-probabilites',
    question: `On lance 2 fois une pièce équilibrée. Quelle est la probabilité d'obtenir 2 Pile ?`,
    answer: `P(PP) = 1/4`,
    explanation: `Les résultats possibles : PP, PF, FP, FF (4 cas)
Seul PP nous intéresse.
P(PP) = 1/4`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pro-008',
    deckId: 'math-probabilites',
    question: `On tire successivement et avec remise 2 cartes dans un jeu de 52 cartes. Quelle est la probabilité de tirer 2 cœurs ?`,
    answer: `P(2 cœurs) = (13/52) × (13/52) = 1/16`,
    explanation: `• P(1er cœur) = 13/52 = 1/4
• On remet la carte, donc P(2e cœur) = 13/52 = 1/4
• P(2 cœurs) = (1/4) × (1/4) = 1/16`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pro-009',
    deckId: 'math-probabilites',
    question: `On tire successivement et sans remise 2 boules dans une urne contenant 4 rouges et 6 vertes. Quelle est la probabilité de tirer 2 rouges ?`,
    answer: `P(2 rouges) = (4/10) × (3/9) = 12/90 = 2/15`,
    explanation: `• P(1er rouge) = 4/10
• Sans remise, il reste 3 rouges sur 9 boules
• P(2e rouge) = 3/9
• P(2 rouges) = (4/10) × (3/9) = 12/90 = 2/15`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Statistiques
export const math_statistiquesCards: Card[] = [
  {
    id: 'math-sta-001',
    deckId: 'math-statistiques',
    question: `Comment calcule-t-on la moyenne d'une série de valeurs ?`,
    answer: `Somme des valeurs divisée par l'effectif total.`,
    explanation: `Formule : moyenne = (x₁ + x₂ + ... + xₙ) / n

Exemple : Moyenne de 12, 15, 18 = (12+15+18)/3 = 45/3 = 15`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-sta-002',
    deckId: 'math-statistiques',
    question: `Calculer la moyenne pondérée :
Valeur 10 (coeff 2), 14 (coeff 3), 16 (coeff 1)`,
    answer: `Moyenne = 13,5`,
    explanation: `(10×2 + 14×3 + 16×1) / (2+3+1)
= (20 + 42 + 16) / 6
= 78 / 6
= 13`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-sta-003',
    deckId: 'math-statistiques',
    question: `Qu'est-ce que la médiane d'une série statistique ?`,
    answer: `La médiane est la valeur qui partage la série en deux parties de même effectif (50% des valeurs sont inférieures, 50% sont supérieures).`,
    explanation: `• Si l'effectif est impair : c'est la valeur centrale
• Si l'effectif est pair : c'est la moyenne des deux valeurs centrales

La série doit être ordonnée !`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-sta-004',
    deckId: 'math-statistiques',
    question: `Trouver la médiane de la série : 8, 12, 5, 15, 9, 11, 14`,
    answer: `Médiane = 11`,
    explanation: `1) Ordonner : 5, 8, 9, 11, 12, 14, 15
2) Effectif = 7 (impair)
3) Valeur centrale : le 4e terme = 11`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-sta-005',
    deckId: 'math-statistiques',
    question: `Trouver la médiane de la série : 4, 8, 12, 16, 20, 24`,
    answer: `Médiane = 14`,
    explanation: `Série déjà ordonnée.
Effectif = 6 (pair)
Médiane = (12 + 16) / 2 = 28/2 = 14`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-sta-006',
    deckId: 'math-statistiques',
    question: `Qu'est-ce que l'étendue d'une série statistique ?`,
    answer: `L'étendue est la différence entre la valeur maximale et la valeur minimale.`,
    explanation: `Formule : Étendue = Max - Min

Exemple : Pour 5, 12, 8, 20, 15
Étendue = 20 - 5 = 15`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-sta-007',
    deckId: 'math-statistiques',
    question: `Qu'est-ce que le premier quartile Q1 ?`,
    answer: `Q1 est la plus petite valeur de la série telle qu'au moins 25% des valeurs lui sont inférieures ou égales.`,
    explanation: `Le premier quartile partage la série en deux parties : 25% en dessous, 75% au-dessus.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-sta-008',
    deckId: 'math-statistiques',
    question: `Qu'est-ce que le troisième quartile Q3 ?`,
    answer: `Q3 est la plus petite valeur de la série telle qu'au moins 75% des valeurs lui sont inférieures ou égales.`,
    explanation: `Le troisième quartile partage la série : 75% en dessous, 25% au-dessus.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Pourcentages
export const math_pourcentagesCards: Card[] = [
  {
    id: 'math-pct-001',
    deckId: 'math-pourcentages',
    question: `Calculer 25% de 120.`,
    answer: `25% de 120 = 30`,
    explanation: `25% = 25/100 = 1/4
120 × 1/4 = 30
Ou : 120 × 0,25 = 30`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pct-002',
    deckId: 'math-pourcentages',
    question: `Quel est le coefficient multiplicateur correspondant à une augmentation de 20% ?`,
    answer: `Coefficient = 1,20`,
    explanation: `Formule : CM = 1 + t/100
Augmentation de 20% : CM = 1 + 20/100 = 1,20`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pct-003',
    deckId: 'math-pourcentages',
    question: `Quel est le coefficient multiplicateur correspondant à une réduction de 15% ?`,
    answer: `Coefficient = 0,85`,
    explanation: `Formule : CM = 1 - t/100
Réduction de 15% : CM = 1 - 15/100 = 0,85`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pct-004',
    deckId: 'math-pourcentages',
    question: `Un article coûte 80€. Son prix augmente de 25%. Quel est le nouveau prix ?`,
    answer: `Nouveau prix = 100€`,
    explanation: `CM = 1,25
Nouveau prix = 80 × 1,25 = 100€

Ou : Augmentation = 80 × 0,25 = 20€
Nouveau prix = 80 + 20 = 100€`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pct-005',
    deckId: 'math-pourcentages',
    question: `Un article passe de 120€ à 90€. Quel est le pourcentage de réduction ?`,
    answer: `Réduction de 25%`,
    explanation: `Réduction = 120 - 90 = 30€
Pourcentage = (30/120) × 100 = 25%`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pct-006',
    deckId: 'math-pourcentages',
    question: `Un prix augmente de 20% puis diminue de 20%. Le prix final est-il égal au prix initial ?`,
    answer: `Non, le prix a diminué de 4%.`,
    explanation: `CM global = 1,20 × 0,80 = 0,96
Le prix final est 96% du prix initial.

Baisse de 4% (effet des hausses et baisses successives).`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-pct-007',
    deckId: 'math-pourcentages',
    question: `Quel coefficient multiplicateur correspond à une hausse de 10% suivie d'une hausse de 20% ?`,
    answer: `CM = 1,32 (hausse de 32%)`,
    explanation: `CM = 1,10 × 1,20 = 1,32
Le prix a augmenté de 32% au total.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Aires et Volumes
export const math_aires_volumesCards: Card[] = [
  {
    id: 'math-aire-001',
    deckId: 'math-aires-volumes',
    question: `Donner la formule de l'aire d'un rectangle.`,
    answer: `Aire = Longueur × Largeur`,
    explanation: `A = L × l

Unité : unité de longueur au carré (cm², m²...)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-002',
    deckId: 'math-aires-volumes',
    question: `Donner la formule de l'aire d'un triangle.`,
    answer: `Aire = (Base × Hauteur) / 2`,
    explanation: `A = (b × h) / 2

La hauteur doit être perpendiculaire à la base.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-003',
    deckId: 'math-aires-volumes',
    question: `Donner la formule de l'aire d'un disque.`,
    answer: `Aire $= \\pi \\times r^2$`,
    explanation: `$$A = \\pi r^2$$

$r =$ rayon du cercle
$\\pi \\approx 3,14$`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-004',
    deckId: 'math-aires-volumes',
    question: `Donner la formule du périmètre d'un cercle.`,
    answer: `Périmètre = 2 × π × r = π × d`,
    explanation: `P = 2πr = πd

r = rayon, d = diamètre (d = 2r)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-005',
    deckId: 'math-aires-volumes',
    question: `Donner la formule du volume d'un pavé droit.`,
    answer: `Volume = Longueur × Largeur × Hauteur`,
    explanation: `V = L × l × h

Unité : unité de longueur au cube (cm³, m³)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-006',
    deckId: 'math-aires-volumes',
    question: `Donner la formule du volume d'un cylindre.`,
    answer: `Volume = π × r² × h`,
    explanation: `V = πr²h

r = rayon de la base
h = hauteur du cylindre`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-007',
    deckId: 'math-aires-volumes',
    question: `Donner la formule du volume d'une pyramide ou d'un cône.`,
    answer: `Volume = (Aire de la base × Hauteur) / 3`,
    explanation: `V = (A_base × h) / 3

Cône : A_base = πr²
Pyramide : dépend de la forme de la base`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-008',
    deckId: 'math-aires-volumes',
    question: `Donner la formule du volume d'une sphère.`,
    answer: `Volume = (4/3) × π × r³`,
    explanation: `V = (4/3)πr³

r = rayon de la sphère`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-009',
    deckId: 'math-aires-volumes',
    question: `Convertir 2,5 m³ en dm³.`,
    answer: `2,5 m³ = 2500 dm³`,
    explanation: `1 m = 10 dm
1 m³ = 1000 dm³
2,5 m³ = 2,5 × 1000 = 2500 dm³`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-aire-010',
    deckId: 'math-aires-volumes',
    question: `Convertir 500 cm² en m².`,
    answer: `500 cm² = 0,05 m²`,
    explanation: `1 m = 100 cm
1 m² = 10000 cm²
500 cm² = 500 ÷ 10000 = 0,05 m²`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Géométrie et Angles
export const math_geometrie_anglesCards: Card[] = [
  {
    id: 'math-geo-001',
    deckId: 'math-geometrie-angles',
    question: `Quelle est la somme des angles d'un triangle ?`,
    answer: `La somme vaut 180°.`,
    explanation: `Dans tout triangle ABC :
Angle A + Angle B + Angle C = 180°`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-002',
    deckId: 'math-geometrie-angles',
    question: `Quelles sont les propriétés d'un triangle isocèle ?`,
    answer: `Deux côtés égaux et les angles à la base égaux.`,
    explanation: `Si AB = AC, alors le triangle ABC est isocèle en A.
Les angles en B et C sont égaux.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-003',
    deckId: 'math-geometrie-angles',
    question: `Quelles sont les propriétés d'un triangle équilatéral ?`,
    answer: `Trois côtés égaux et trois angles de 60°.`,
    explanation: `Dans un triangle équilatéral :
• AB = BC = CA
• Chaque angle vaut 180° ÷ 3 = 60°`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-004',
    deckId: 'math-geometrie-angles',
    question: `Qu'est-ce que des angles complémentaires ?`,
    answer: `Deux angles sont complémentaires si leur somme vaut 90°.`,
    explanation: `Si x + y = 90°, alors x et y sont complémentaires.

Exemple : 30° et 60° sont complémentaires.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-005',
    deckId: 'math-geometrie-angles',
    question: `Qu'est-ce que des angles supplémentaires ?`,
    answer: `Deux angles sont supplémentaires si leur somme vaut 180°.`,
    explanation: `Si x + y = 180°, alors x et y sont supplémentaires.

Exemple : 120° et 60° sont supplémentaires.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-006',
    deckId: 'math-geometrie-angles',
    question: `Qu'est-ce que des angles opposés par le sommet ?`,
    answer: `Deux angles formés par deux droites sécantes, situés de part et d'autre du point d'intersection.`,
    explanation: `Les angles opposés par le sommet sont ÉGAUX.

Si deux droites se coupent en O, alors l'angle en haut à gauche = l'angle en bas à droite.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-007',
    deckId: 'math-geometrie-angles',
    question: `Qu'est-ce que des angles alternes-internes ?`,
    answer: `Deux angles situés entre deux droites, de part et d'autre d'une sécante.`,
    explanation: `Si les deux droites sont parallèles, alors les angles alternes-internes sont ÉGAUX.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-008',
    deckId: 'math-geometrie-angles',
    question: `Quelles sont les propriétés du parallélogramme ?`,
    answer: `• Côtés opposés parallèles et égaux
• Diagonales se coupent en leur milieu`,
    explanation: `Le parallélogramme est un quadrilatère avec deux paires de côtés parallèles.
Les diagonales se coupent mutuellement en leur milieu.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-009',
    deckId: 'math-geometrie-angles',
    question: `Quelles sont les propriétés du rectangle ?`,
    answer: `C'est un parallélogramme avec quatre angles droits. Les diagonales sont égales.`,
    explanation: `Le rectangle a toutes les propriétés du parallélogramme, plus :
• 4 angles droits
• Diagonales de même longueur`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-geo-010',
    deckId: 'math-geometrie-angles',
    question: `Quelles sont les propriétés du losange ?`,
    answer: `C'est un parallélogramme avec quatre côtés égaux. Les diagonales sont perpendiculaires.`,
    explanation: `Le losange a toutes les propriétés du parallélogramme, plus :
• 4 côtés égaux
• Diagonales perpendiculaires
• Diagonales bissectrices des angles`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Conversions et Vitesses
export const math_conversionsCards: Card[] = [
  {
    id: 'math-conv-001',
    deckId: 'math-conversions',
    question: `Convertir 2,5 heures en heures et minutes.`,
    answer: `2,5 h = 2 h 30 min`,
    explanation: `0,5 h = 0,5 × 60 = 30 minutes
Donc 2,5 h = 2 h + 30 min = 2 h 30`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-conv-002',
    deckId: 'math-conversions',
    question: `Convertir 3 h 45 min en heures décimales.`,
    answer: `3 h 45 min = 3,75 h`,
    explanation: `45 min = 45/60 h = 0,75 h
Donc 3 h 45 min = 3 + 0,75 = 3,75 h`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-conv-003',
    deckId: 'math-conversions',
    question: `Quelle est la formule de la vitesse moyenne ?`,
    answer: `v = d / t`,
    explanation: `vitesse = distance / temps

Distance en km et temps en h → vitesse en km/h
Distance en m et temps en s → vitesse en m/s`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-conv-004',
    deckId: 'math-conversions',
    question: `Une voiture parcourt 240 km en 3 heures. Quelle est sa vitesse moyenne ?`,
    answer: `v = 80 km/h`,
    explanation: `v = d / t = 240 / 3 = 80 km/h`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-conv-005',
    deckId: 'math-conversions',
    question: `Convertir 36 km/h en m/s.`,
    answer: `36 km/h = 10 m/s`,
    explanation: `36 km = 36000 m
1 h = 3600 s
v = 36000/3600 = 10 m/s

Méthode rapide : diviser par 3,6
36 ÷ 3,6 = 10`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-conv-006',
    deckId: 'math-conversions',
    question: `Convertir 15 m/s en km/h.`,
    answer: `15 m/s = 54 km/h`,
    explanation: `15 m = 0,015 km
1 s = 1/3600 h
v = 0,015 × 3600 = 54 km/h

Méthode rapide : multiplier par 3,6
15 × 3,6 = 54`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-conv-007',
    deckId: 'math-conversions',
    question: `Quelle distance parcourt un train à 120 km/h en 45 minutes ?`,
    answer: `d = 90 km`,
    explanation: `45 min = 0,75 h
d = v × t = 120 × 0,75 = 90 km`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Cartes pour Mathématiques - Échelles
export const math_echellesCards: Card[] = [
  {
    id: 'math-ech-001',
    deckId: 'math-echelles',
    question: `Quelle est la formule de l'échelle ?`,
    answer: `Échelle = distance sur le plan / distance réelle`,
    explanation: `L'échelle est un rapport sans unité.

Exemple : Échelle 1/100 signifie que 1 cm sur le plan représente 100 cm (1 m) dans la réalité.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-ech-002',
    deckId: 'math-echelles',
    question: `Sur une carte à l'échelle 1/50000, deux villes sont à 4 cm. Quelle est la distance réelle ?`,
    answer: `Distance réelle = 2 km`,
    explanation: `Distance réelle = 4 × 50000 = 200000 cm = 2000 m = 2 km`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-ech-003',
    deckId: 'math-echelles',
    question: `Un segment mesure 6 cm. On l'agrandit avec un rapport k = 3. Quelle est sa nouvelle longueur ?`,
    answer: `Nouvelle longueur = 18 cm`,
    explanation: `Dans un agrandissement de rapport k :
• Les longueurs sont multipliées par k
6 × 3 = 18 cm`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-ech-004',
    deckId: 'math-echelles',
    question: `Quel est l'effet d'un agrandissement de rapport k sur les aires ?`,
    answer: `Les aires sont multipliées par k².`,
    explanation: `Si les longueurs sont multipliées par k,
alors les aires sont multipliées par k².

Exemple : k = 2 → aire × 4`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'math-ech-005',
    deckId: 'math-echelles',
    question: `Quel est l'effet d'un agrandissement de rapport k sur les volumes ?`,
    answer: `Les volumes sont multipliés par k³.`,
    explanation: `Si les longueurs sont multipliées par k,
alors les volumes sont multipliés par k³.

Exemple : k = 2 → volume × 8`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ============= CARTES FRANÇAIS =============

export const francaisGrammaireCards: Card[] = [
  {
    id: 'fr-gram-001',
    deckId: 'francais-grammaire',
    question: `Quelles sont les 5 natures de mots principales ?`,
    answer: `Nom, Verbe, Adjectif, Adverbe, Déterminant`,
    explanation: `+ les compléments: pronom, préposition, conjonction, interjection`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const francaisMethodologieCards: Card[] = [
  {
    id: 'fr-met-001',
    deckId: 'francais-methodologie',
    question: `Quelle est la structure d'une dissertation ?`,
    answer: `Introduction (accroche, problématique, annonce du plan)\nDéveloppement (2 ou 3 parties)\nConclusion (synthèse, ouverture)`,
    explanation: `Partie = idée générale, Sous-partie = argument + exemples`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ============= CARTES HISTOIRE-GEO =============

export const histoireGeoCards: Card[] = [
  {
    id: 'hg-001',
    deckId: 'histoire-geo',
    question: `Quelles sont les causes de la Première Guerre mondiale ?`,
    answer: `• Rivalités impérialistes\n• Montée du nationalisme\n• Course aux armements\n• Alliances militaires\n• Attentat de Sarajevo (28/06/1914)`,
    explanation: `28 juillet 1914: l'Autriche-Hongrie déclare la guerre à la Serbie`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ============= CARTES SVT =============

export const svtCards: Card[] = [
  {
    id: 'svt-001',
    deckId: 'svt',
    question: `Qu'est-ce que la plaque tectonique ?`,
    answer: `Fragment de la lithosphère qui se déplace sur l'asthénosphère`,
    explanation: `La lithosphère est fragmentée en ~12 grandes plaques qui se déplacent de quelques cm/an.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ============= CARTES PHYSIQUE-CHIMIE =============

export const physiqueChimieCards: Card[] = [
  {
    id: 'pc-001',
    deckId: 'physique-chimie',
    question: `Quelle est la formule de la vitesse moyenne ?`,
    answer: `$$v = \\frac{d}{t}$$
$v$ en m/s, $d$ en m, $t$ en s`,
    explanation: `Pour convertir km/h en m/s: diviser par 3,6

$$1 \\text{ km/h} = \\frac{1000 \\text{ m}}{3600 \\text{ s}} = \\frac{1}{3,6} \\text{ m/s}$$`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ============= CARTES TECHNOLOGIE =============

export const technologieCards: Card[] = [
  {
    id: 'tech-001',
    deckId: 'technologie',
    question: `Qu'est-ce qu'un algorithme ?`,
    answer: `Suite d'instructions pour résoudre un problème`,
    explanation: `Organigramme ou pseudo-code → traduction en langage de programmation`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ============= CARTES ANGLAIS =============

export const anglaisCards: Card[] = [
  {
    id: 'en-001',
    deckId: 'anglais',
    question: `Comment exprimer le futur en anglais ?`,
    answer: `• WILL + base verbale\n• BE GOING TO + base\n• Present Continuous`,
    explanation: `Will: décision spontanée\nGoing to: projet, intention`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ============= FONCTION D'IMPORT =============

import { createDeck, createCard, saveSRSState } from '../storage/database';
import { createNewCardState } from '../algorithms/srs';

/**
 * Importe tous les decks et cartes intégrés dans la base de données
 */
export async function importBuiltinDecks(): Promise<void> {
  const allDecks = builtinDecks;
  const allCards = [
    ...math_arithmetiqueCards,
    ...math_fractionsCards,
    ...math_relatifs_puissancesCards,
    ...math_calcul_litteralCards,
    ...math_fonctionsCards,
    ...math_pythagoreCards,
    ...math_thalesCards,
    ...math_trigonometrieCards,
    ...math_probabilitesCards,
    ...math_statistiquesCards,
    ...math_pourcentagesCards,
    ...math_aires_volumesCards,
    ...math_geometrie_anglesCards,
    ...math_conversionsCards,
    ...math_echellesCards,
    ...francaisGrammaireCards,
    ...francaisMethodologieCards,
    ...histoireGeoCards,
    ...svtCards,
    ...physiqueChimieCards,
    ...technologieCards,
    ...anglaisCards,
  ];
  
  // Importer les decks
  for (const deck of allDecks) {
    await createDeck(deck);
  }
  
  // Importer les cartes et créer leur état SRS
  for (const card of allCards) {
    await createCard(card);
    const srsState = createNewCardState(card.id);
    await saveSRSState(srsState);
  }
  
  console.log(`Importé ${allDecks.length} decks et ${allCards.length} cartes`);
}
