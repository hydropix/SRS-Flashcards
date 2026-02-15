/**
 * Cartes de Physique-Chimie pour le Brevet des Collèges
 * Programme Cycle 4 - 4 thèmes
 */

import { Card } from '../types';

// Thème 1: Organisation et transformations de la matière
export const pcMatiereCards: Card[] = [
  {
    id: 'pc-mat-001',
    deckId: 'physique-chimie-matiere',
    question: `Quelles sont les trois états de la matière ?`,
    answer: `• **Solide** : forme et volume propres
• **Liquide** : volume propre, forme adaptée au récipient
• **Gaz** : pas de forme ni de volume propres`,
    explanation: `Les états dépendent de l'agitation des particules. Plus la température augmente, plus les particules s'agitent.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-002',
    deckId: 'physique-chimie-matiere',
    question: `Citer les changements d'état de la matière.`,
    answer: `• Fusion (solide→liquide)
• Solidification (liquide→solide)
• Vaporisation (liquide→gaz)
• Condensation (gaz→liquide)
• Sublimation (solide→gaz direct)`,
    explanation: `Ces changements se produisent à des températures caractéristiques. Exemple : l'eau fond à 0°C et bout à 100°C.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-003',
    deckId: 'physique-chimie-matiere',
    question: `Quelle est la différence entre un corps pur et un mélange ?`,
    answer: `• **Corps pur** : une seule espèce chimique (eau distillée, fer)
• **Mélange** : plusieurs espèces chimiques`,
    explanation: `Un corps pur a une température de fusion fixe. Un mélange fond sur une plage de température.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-004',
    deckId: 'physique-chimie-matiere',
    question: `Différence entre mélange homogène et hétérogène ?`,
    answer: `• **Homogène** : une seule phase visible (eau+sel)
• **Hétérogène** : plusieurs phases visibles (eau+huile)`,
    explanation: `Dans un mélange homogène, les constituants sont mélangés à l'échelle microscopique.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-005',
    deckId: 'physique-chimie-matiere',
    question: `Comment reconnaître le dioxygène (O₂) ?`,
    answer: `Le dioxygène **rallume** une bûchette incandescente.`,
    explanation: `Le dioxygène est nécessaire à la combustion. C'est le test caractéristique du dioxygène.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-006',
    deckId: 'physique-chimie-matiere',
    question: `Comment reconnaître le dihydrogène (H₂) ?`,
    answer: `Le dihydrogène produit une **petite détonation** en présence d'une flamme.`,
    explanation: `Le dihydrogène est très inflammable et réagit violemment avec le dioxygène.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-007',
    deckId: 'physique-chimie-matiere',
    question: `Comment reconnaître le dioxyde de carbone (CO₂) ?`,
    answer: `Le CO₂ **trouble** l'eau de chaux.`,
    explanation: `Le CO₂ réagit avec l'hydroxyde de calcium pour former du carbonate de calcium (solide blanc).`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-008',
    deckId: 'physique-chimie-matiere',
    question: `Comment détecter la présence d'eau ?`,
    answer: `L'eau fait virer le **sulfate de cuivre anhydre au bleu**.`,
    explanation: `Le sulfate de cuivre anhydre est blanc et devient bleu en présence d'eau.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-009',
    deckId: 'physique-chimie-matiere',
    question: `Qu'est-ce qu'une transformation chimique ?`,
    answer: `Des espèces chimiques disparaissent (réactifs) et d'autres apparaissent (produits).`,
    explanation: `Signes : changement de couleur, dégagement de gaz, formation d'un précipité, émission de chaleur.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-010',
    deckId: 'physique-chimie-matiere',
    question: `Qu'est-ce qu'un atome ?`,
    answer: `Constitué d'un **noyau** (protons + neutrons) et d'**électrons**.`,
    explanation: `• Protons : charge positive
• Neutrons : sans charge
• Électrons : charge négative
Un atome est neutre : nb protons = nb électrons.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-011',
    deckId: 'physique-chimie-matiere',
    question: `Qu'est-ce qu'un ion ?`,
    answer: `Un atome ayant gagné ou perdu des électrons.
• **Cation** : ion positif (a perdu e⁻)
• **Anion** : ion négatif (a gagné e⁻)`,
    explanation: `Exemples : Na → Na⁺ + e⁻ (cation) ; Cl + e⁻ → Cl⁻ (anion)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-012',
    deckId: 'physique-chimie-matiere',
    question: `Qu'est-ce qu'une molécule ?`,
    answer: `Un assemblage d'atomes liés entre eux.`,
    explanation: `Exemples : H₂O (eau), CO₂ (dioxyde de carbone), CH₄ (méthane)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-013',
    deckId: 'physique-chimie-matiere',
    question: `Quelle est la loi de conservation de la matière ?`,
    answer: `Les atomes se réorganisent : ni créés ni détruits.`,
    explanation: `Conservation de la masse : masse des réactifs = masse des produits.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-014',
    deckId: 'physique-chimie-matiere',
    question: `Qu'est-ce que le pH ?`,
    answer: `Échelle de 0 à 14 caractérisant l'acidité/basicité.`,
    explanation: `• pH < 7 : acide
• pH = 7 : neutre
• pH > 7 : basique`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-015',
    deckId: 'physique-chimie-matiere',
    question: `Quels sont les ions caractéristiques des solutions acides et basiques ?`,
    answer: `• Acide : ions H⁺ (ou H₃O⁺)
• Basique : ions OH⁻`,
    explanation: `Plus il y a d'ions H⁺, plus le pH est faible (acide).`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-016',
    deckId: 'physique-chimie-matiere',
    question: `Qu'est-ce qu'une réaction acide-base ?`,
    answer: `Réaction entre un acide et une base produisant un sel et de l'eau.`,
    explanation: `C'est une neutralisation. Le pH tend vers 7.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-017',
    deckId: 'physique-chimie-matiere',
    question: `Citer les indicateurs colorés usuels.`,
    answer: `• **BBT** : jaune(acide)→vert(neutre)→bleu(basique)
• **Phénolphtaléine** : incolore→rose
• **Hélianthine** : rouge→jaune`,
    explanation: `Les indicateurs changent de couleur selon le pH.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-018',
    deckId: 'physique-chimie-matiere',
    question: `Qu'est-ce qu'une molécule organique ?`,
    answer: `Molécule contenant principalement du carbone (C) et hydrogène (H).`,
    explanation: `Exemples : sucres, lipides, protéines, hydrocarbures.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mat-019',
    deckId: 'physique-chimie-matiere',
    question: `Quelle est la température de changement d'état d'un corps pur ?`,
    answer: `Température constante à laquelle un corps pur change d'état.`,
    explanation: `Exemple : eau à pression normale : fusion à 0°C, ébullition à 100°C.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Thème 2: Mouvements et interactions
export const pcMouvementCards: Card[] = [
  {
    id: 'pc-mvt-001',
    deckId: 'physique-chimie-mouvement',
    question: `Qu'est-ce qu'un référentiel ?`,
    answer: `Objet par rapport auquel on étudie le mouvement.`,
    explanation: `Le mouvement est relatif au référentiel. Exemple : un passager dans un train est immobile dans le référentiel train, mais en mouvement dans le référentiel terrestre.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-002',
    deckId: 'physique-chimie-mouvement',
    question: `Comment caractérise-t-on une trajectoire ?`,
    answer: `• Rectiligne (ligne droite)
• Circulaire (cercle)
• Curviligne (courbe)`,
    explanation: `La trajectoire est le chemin suivi par l'objet.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-003',
    deckId: 'physique-chimie-mouvement',
    question: `Quelles sont les natures de mouvement ?`,
    answer: `• **Uniforme** : vitesse constante
• **Accéléré** : vitesse augmente
• **Ralenti** : vitesse diminue`,
    explanation: `La nature décrit comment varie la vitesse au cours du temps.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-004',
    deckId: 'physique-chimie-mouvement',
    question: `Formule de la vitesse moyenne ?`,
    answer: `$$v = \\frac{d}{t}$$`,
    explanation: `v en m/s ou km/h, d en m ou km, t en s ou h. Conversion : 1 m/s = 3,6 km/h`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-005',
    deckId: 'physique-chimie-mouvement',
    question: `Un cycliste parcourt 18 km en 30 min. Sa vitesse ?`,
    answer: `$$v = 36 \\text{ km/h}$$`,
    explanation: `30 min = 0,5 h. v = 18/0,5 = 36 km/h`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-006',
    deckId: 'physique-chimie-mouvement',
    question: `Convertir 72 km/h en m/s.`,
    answer: `20 m/s`,
    explanation: `72 ÷ 3,6 = 20 m/s`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-007',
    deckId: 'physique-chimie-mouvement',
    question: `Convertir 15 m/s en km/h.`,
    answer: `54 km/h`,
    explanation: `15 × 3,6 = 54 km/h`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-008',
    deckId: 'physique-chimie-mouvement',
    question: `Qu'est-ce qu'une force ?`,
    answer: `Action mécanique caractérisée par : direction, sens, valeur (N).`,
    explanation: `Une force peut modifier le mouvement ou la forme d'un objet.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-009',
    deckId: 'physique-chimie-mouvement',
    question: `Relation entre masse et poids ?`,
    answer: `$$P = m \\times g$$`,
    explanation: `P en Newtons, m en kg, g ≈ 10 N/kg sur Terre. La masse est inchangée, le poids dépend du lieu.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-010',
    deckId: 'physique-chimie-mouvement',
    question: `Poids d'un objet de 50 kg sur Terre ?`,
    answer: `P = 500 N`,
    explanation: `P = 50 × 10 = 500 N`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-mvt-011',
    deckId: 'physique-chimie-mouvement',
    question: `Énoncer le principe d'inertie.`,
    answer: `Si un objet est immobile ou en mouvement rectiligne uniforme, la somme des forces est nulle.`,
    explanation: `Réciproque : si les forces sont équilibrées, l'objet est immobile ou à vitesse constante.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Thème 3: L'énergie et ses conversions
export const pcEnergieCards: Card[] = [
  {
    id: 'pc-ene-001',
    deckId: 'physique-chimie-energie',
    question: `Citer les formes d'énergie.`,
    answer: `Cinétique, potentielle, thermique, électrique, lumineuse, chimique, nucléaire.`,
    explanation: `Chaque forme peut se convertir en une autre.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-ene-002',
    deckId: 'physique-chimie-energie',
    question: `Formule de l'énergie cinétique ?`,
    answer: `$$E_c = \\frac{1}{2}mv^2$$`,
    explanation: `Énergie de mouvement. Si v double, Ec quadruple !`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-ene-003',
    deckId: 'physique-chimie-energie',
    question: `Formule de l'énergie potentielle de pesanteur ?`,
    answer: `$$E_{pp} = mgh$$`,
    explanation: `Énergie liée à la hauteur. Plus l'objet est haut, plus l'énergie est grande.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-ene-004',
    deckId: 'physique-chimie-energie',
    question: `Qu'est-ce que le rendement ?`,
    answer: `$$\\eta = \\frac{E_{utile}}{E_{fournie}}$$`,
    explanation: `Toujours inférieur à 1 (100%). Les pertes sont souvent en chaleur.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-ene-005',
    deckId: 'physique-chimie-energie',
    question: `Loi des tensions en série ?`,
    answer: `$$U_{total} = U_1 + U_2 + ...$$`,
    explanation: `La tension se répartit entre les récepteurs en série.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-ene-006',
    deckId: 'physique-chimie-energie',
    question: `Loi des intensités en dérivation ?`,
    answer: `$$I_{total} = I_1 + I_2 + ...$$`,
    explanation: `Le courant se divise entre les branches en dérivation.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-ene-007',
    deckId: 'physique-chimie-energie',
    question: `Formule de la puissance électrique ?`,
    answer: `$$P = U \\times I$$ (Watts)`,
    explanation: `P en W, U en V, I en A. Caractérise la vitesse de conversion d'énergie.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-ene-008',
    deckId: 'physique-chimie-energie',
    question: `Formule de l'énergie électrique ?`,
    answer: `$$E = P \\times t$$ (Joules ou Wh)`,
    explanation: `1 Wh = 3600 J. Le kWh est l'unité des factures EDF.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-ene-009',
    deckId: 'physique-chimie-energie',
    question: `Dangers du courant électrique ?`,
    answer: `Électrocution, incendie, brûlures.`,
    explanation: `Protection : prise de terre, fusibles, disjoncteurs différentiels.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Thème 4: Des signaux pour observer et communiquer
export const pcSignauxCards: Card[] = [
  {
    id: 'pc-sig-001',
    deckId: 'physique-chimie-signaux',
    question: `Différence entre source primaire et objet diffusant ?`,
    answer: `• Source primaire : produit sa propre lumière (Soleil, lampe)
• Objet diffusant : reflète la lumière (Lune, miroir)`,
    explanation: `La Lune reflète la lumière du Soleil.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-sig-002',
    deckId: 'physique-chimie-signaux',
    question: `Comment se propage la lumière ?`,
    answer: `En ligne droite dans un milieu homogène et transparent.`,
    explanation: `Vitesse de la lumière : c = 300 000 km/s = 3×10⁸ m/s`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-sig-003',
    deckId: 'physique-chimie-signaux',
    question: `Vitesse du son dans l'air ?`,
    answer: `Environ 340 m/s (à 20°C).`,
    explanation: `Dépend du milieu : air (~340 m/s), eau (~1500 m/s), acier (~5000 m/s).`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-sig-004',
    deckId: 'physique-chimie-signaux',
    question: `Tonnerre entendu 3s après l'éclair. Distance ?`,
    answer: `Environ 1 km (1020 m).`,
    explanation: `d = v × t = 340 × 3 = 1020 m. La lumière arrive quasi-instantanément.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-sig-005',
    deckId: 'physique-chimie-signaux',
    question: `Qu'est-ce que la hauteur d'un son ?`,
    answer: `Liée à la fréquence de vibration.`,
    explanation: `Aigu = haute fréquence, Grave = basse fréquence.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-sig-006',
    deckId: 'physique-chimie-signaux',
    question: `Plage de fréquences audibles ?`,
    answer: `Entre 20 Hz et 20 000 Hz.`,
    explanation: `< 20 Hz : infrasons. > 20 000 Hz : ultrasons.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'pc-sig-007',
    deckId: 'physique-chimie-signaux',
    question: `Vitesse des ondes électromagnétiques dans le vide ?`,
    answer: `c = 300 000 km/s = 3×10⁸ m/s.`,
    explanation: `C'est la vitesse de la lumière. Vitesse maximale dans l'Univers.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
