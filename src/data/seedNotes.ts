import { StudyNote } from '../types';

export const SEED_NOTES: StudyNote[] = [
  {
    id: 'note_a1_cheat_sheet',
    level: 'A1',
    title: 'A1 German Essential Cheatsheet & Core Formulas',
    slug: 'a1-essential-cheatsheet',
    category: 'Grammar & Core Rules',
    summary: 'A complete quick-reference document summarizing all A1 German case endings, word order rules, and basic prepositions.',
    contentMarkdown: `# A1 German Core Grammar Cheatsheet

## 1. Grammatical Cases & Articles
In German, nouns have 3 genders: Masculine (*der*), Feminine (*die*), and Neuter (*das*).

| Case | Masculine | Feminine | Neuter | Plural |
|---|---|---|---|---|
| **Nominativ (Subject)** | der / ein / kein | die / eine / keine | das / ein / kein | die / — / keine |
| **Akkusativ (Direct Object)** | **den / einen / keinen** | die / eine / keine | das / ein / kein | die / — / keine |

*Golden Rule:* Only masculine singular changes in Akkusativ! (der -> den, ein -> einen).

---

## 2. Word Order in Main Clauses (Hauptsatz)
- The conjugated verb **MUST ALWAYS** sit in **Position 2**.
- *Example:* "Heute **lerne** ich Deutsch." (Position 1: Heute, Position 2: lerne, Position 3: ich).

---

## 3. Accusative Prepositions (DOGFU)
- **D**urch (through)
- **O**hne (without)
- **G**egen (against/around)
- **F**ür (for)
- **U**m (around/at)

*Example:* "Dieses Geschenk ist **für meinen** (Akk) Vater."
`,
    isPremium: false,
    keyFormulas: [
      'Nominativ: der / die / das / die',
      'Akkusativ: den / die / das / die',
      'Position 2 Rule: Finite verb occupies Position 2 in declarative sentences',
      'Negation: Use kein for indefinite/no-article nouns; nicht for verbs/adjectives',
    ],
    downloadableTitle: 'DeutschMeister-A1-Summary-Cheatsheet.pdf',
  },
  {
    id: 'note_a2_two_way_prep',
    level: 'A2',
    title: 'Wechselpräpositionen & Dativ vs Akkusativ Spatial Guide',
    slug: 'two-way-prepositions-guide',
    category: 'Cases & Prepositions',
    summary: 'Comprehensive visual and structural notes on the 9 two-way prepositions (an, auf, hinter, in, neben, über, unter, vor, zwischen).',
    contentMarkdown: `# Wechselpräpositionen Guide (A2 Mastery)

## The 9 Two-Way Prepositions:
*an, auf, hinter, in, neben, über, unter, vor, zwischen*

### 1. The Core Rule:
- **Wo? (Location / Static State / No movement across boundary)** -> **DATIV**
- **Wohin? (Direction / Motion across boundary / Destination)** -> **AKKUSATIV**

---

### 2. Paired Position & Action Verbs:
| Static Position (Wo? -> Dativ) | Action / Placement (Wohin? -> Akkusativ) |
|---|---|
| **liegen** (Das Buch liegt auf dem Tisch.) | **legen** (Ich lege das Buch auf den Tisch.) |
| **stehen** (Die Flasche steht im Kühlschrank.) | **stellen** (Ich stelle die Flasche in den Kühlschrank.) |
| **sitzen** (Die Katze sitzt auf dem Stuhl.) | **setzen** (Ich setze das Kind auf den Stuhl.) |
| **hängen** (Das Bild hängt an der Wand.) | **hängen** (Ich hänge das Bild an die Wand.) |
`,
    isPremium: false,
    keyFormulas: [
      'Wo? (Static) = DATIV (dem / der / dem / den + n)',
      'Wohin? (Motion) = AKKUSATIV (den / die / das / die)',
      'Dativ Plural always adds -n: den Freunden, den Kindern',
    ],
    downloadableTitle: 'DeutschMeister-A2-Wechselpraepositionen.pdf',
  },
  {
    id: 'note_b1_connectors',
    level: 'B1',
    title: 'Advanced German Connectors & Discourse Markers',
    slug: 'b1-advanced-connectors',
    category: 'Sentence Structure & Writing',
    summary: 'Master double connectors (sowohl...als auch, weder...noch, nicht nur...sondern auch) for B1 exam writing and speaking.',
    contentMarkdown: `# B1 German Connectors & Linking Words

## 1. Two-Part Connectors (Zweiteilige Konnektoren)
- **sowohl ... als auch** (+ / +): "Er spricht sowohl Deutsch als auch Spanisch."
- **weder ... noch** (- / -): "Sie hat weder Zeit noch Geld."
- **nicht nur ... sondern auch** (emphatic addition): "Deutschland ist nicht nur wirtschaftlich stark, sondern auch kulturell vielfältig."
- **entweder ... oder** (alternative): "Wir fahren entweder im Juni oder im August in den Urlaub."
- **zwar ... aber** (concession): "Das Hotel war zwar teuer, aber sehr sauber."
- **je ... desto / umso** (proportional comparison): "Je mehr du übst, desto schneller machst du Fortschritte."

---

## 2. Connectors with Inversion (Position 1 -> Verb -> Subject):
*deshalb, darum, deswegen, trotzdem, außerdem, folglich, sonst*
- *Example:* "Es regnete in Strömen. **Trotzdem gingen** wir im Wald spazieren."
`,
    isPremium: true,
    keyFormulas: [
      'ADUSO (aber, denn, und, sondern, oder) = Position 0 (Normal word order)',
      'Nebensatz connectors (weil, dass, obwohl, wenn, als) = Verb at the end',
      'Adverbial connectors (deshalb, trotzdem, außerdem) = Verb immediately after (Position 2)',
    ],
    downloadableTitle: 'DeutschMeister-B1-Connectors-Guide.pdf',
  },
  {
    id: 'note_b2_redemittel',
    level: 'B2',
    title: 'Redemittel für Diskussion, Argumentation & B2 Prüfung',
    slug: 'b2-redemittel-argumentation',
    category: 'Exam Prep & Academic Writing',
    summary: 'High-scoring phrasing templates for Goethe B2, telc B2, TestDaF oral presentations, essays, and debate rounds.',
    contentMarkdown: `# B2 Redemittel für Vortrag, Diskussion & Argumentation

## 1. Standpunkt darlegen & begründen:
- *Meines Erachtens / Meiner Ansicht nach sollte man...*
- *Ich bin der festen Überzeugung, dass...*
- *Ein wesentlicher Aspekt, der hierbei berücksichtigt werden muss, ist...*

---

## 2. Argumente abwägen (Vor- und Nachteile):
- *Auf der einen Seite lässt sich argumentieren, dass..., auf der anderen Seite jedoch...*
- *Befürworter betonen oft, dass... Demgegenüber wenden Kritiker ein, dass...*
- *Ein ausschlaggebendes Argument für / gegen diese Maßnahme ist...*

---

## 3. Grafiken & Daten beschreiben:
- *Die vorliegende Grafik gibt Aufschluss über...*
- *Aus der Statistik geht hervor, dass die Zahl der Absolventen kontinuierlich gestiegen ist.*
- *Im Vergleich zu den Vorjahren ist ein deutlicher Rückgang zu verzeichnen.*

---

## 4. Ein Fazit ziehen:
- *Zusammenfassend lässt sich festhalten, dass...*
- *Aus den genannten Gründen komme ich zu dem Schluss, dass...*
`,
    isPremium: true,
    keyFormulas: [
      'Redemittel boost telc/Goethe B2 oral & written exam scores significantly',
      'Combine NVV (eine Entscheidung treffen) with conditional Konjunktiv II',
      'Always structure essays: Einleitung -> Argumente pro/contra -> Eigene Meinung -> Fazit',
    ],
    downloadableTitle: 'DeutschMeister-B2-Redemittel-Kompendium.pdf',
  },
];
