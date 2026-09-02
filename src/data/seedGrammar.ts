import { GrammarTopic } from '../types';

export const SEED_GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'gram_a1_articles',
    level: 'A1',
    category: 'Articles & Nouns',
    title: 'Definite & Indefinite Articles (der, die, das & ein, eine)',
    slug: 'definite-indefinite-articles',
    summary: 'Master the three grammatical genders (masculine, feminine, neuter) and their negative article counterparts.',
    explanationMarkdown: `In German, every noun possesses a grammatical gender:
- **Masculine (m)**: \`der\` (definite), \`ein\` (indefinite), \`kein\` (negative)
- **Feminine (f)**: \`die\` (definite), \`eine\` (indefinite), \`keine\` (negative)
- **Neuter (n)**: \`das\` (definite), \`ein\` (indefinite), \`kein\` (negative)
- **Plural (pl)**: \`die\` (definite), *no indefinite plural article*, \`keine\` (negative)

### Helpful Word Endings for Gender:
- **Masculine:** Words ending in *-er, -or, -ist, -ling, -ismus* (e.g., der Lehrer, der Motor, der Optimismus).
- **Feminine:** Words ending in *-ung, -heit, -keit, -schaft, -tion, -tät, -ei, -ie* (e.g., die Zeitung, die Freiheit, die Möglichkeit, die Universität).
- **Neuter:** Words ending in *-chen, -lein, -um, -ment, -tum* (e.g., das Mädchen, das Zentrum, das Dokument).`,
    rules: [
      {
        ruleTitle: 'Noun Capitalization',
        ruleDescription: 'All nouns in the German language are ALWAYS capitalized, without exception.',
        example: 'Der Tisch ist neu. (The table is new.)',
      },
      {
        ruleTitle: 'Negation with kein vs nicht',
        ruleDescription: 'Use kein/keine to negate nouns with indefinite articles or no articles. Use nicht to negate verbs, adjectives, or specific nouns.',
        example: 'Ich habe keinen Hund. vs Ich schlafe nicht.',
      },
    ],
    tables: [
      {
        title: 'Nominative Case Articles',
        headers: ['Gender', 'Definite', 'Indefinite', 'Negative'],
        rows: [
          ['Masculine', 'der Tisch', 'ein Tisch', 'kein Tisch'],
          ['Feminine', 'die Lampe', 'eine Lampe', 'keine Lampe'],
          ['Neuter', 'das Buch', 'ein Buch', 'kein Buch'],
          ['Plural', 'die Bücher', '— Bücher', 'keine Bücher'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Ich habe ein Auto nicht.',
        correct: 'Ich habe kein Auto.',
        reason: 'Use "kein" to negate nouns with indefinite or zero article.',
      },
      {
        incorrect: 'Das Mädchen ist schön, er lernt viel.',
        correct: 'Das Mädchen ist schön, es lernt viel.',
        reason: 'Grammatical gender dictates pronouns: das Mädchen is neuter ("es"), despite referring to a female person biologically.',
      },
    ],
    isPremium: false,
    practiceTopicKey: 'Articles',
  },
  {
    id: 'gram_a1_akkusativ',
    level: 'A1',
    category: 'Cases (Kasus)',
    title: 'Der Akkusativ (The Accusative Case)',
    slug: 'der-akkusativ',
    summary: 'Understand the direct object case in German and why ONLY the masculine article changes.',
    explanationMarkdown: `The **Akkusativ** marks the direct object in a sentence—the person or item directly receiving the action of the verb.

### The Golden Rule of Akkusativ:
Only **masculine singular** articles change!
- \`der\` becomes \`den\`
- \`ein\` becomes \`einen\`
- \`kein\` becomes \`keinen\`
- \`mein\` becomes \`meinen\`

Feminine (\`die/eine\`), Neuter (\`das/ein\`), and Plural (\`die/keine\`) remain identical to Nominativ!

### Common Verbs that always take Akkusativ:
- *haben* (to have), *brauchen* (to need), *kaufen* (to buy), *sehen* (to see), *essen* (to eat), *trinken* (to drink), *suchen* (to search/look for), *fragen* (to ask), *besuchen* (to visit).

### Akkusativ Prepositions (DOGFU mnemonic):
**D**urch (through), **O**hne (without), **G**egen (against/around), **F**ür (for), **U**m (around/at).`,
    rules: [
      {
        ruleTitle: 'Masculine Shift (der -> den)',
        ruleDescription: 'When a masculine noun is the receiver/object of a transitive verb, der transforms into den.',
        example: 'Der Mann kauft den Apfel. (The man buys the apple.)',
      },
      {
        ruleTitle: 'Akkusativ Pronouns',
        ruleDescription: 'Personal pronouns also decline in Akkusativ: ich -> mich, du -> dich, er -> ihn, sie -> sie, es -> es, wir -> uns, ihr -> euch, sie/Sie -> sie/Sie.',
        example: 'Siehst du mich? Ich sehe ihn.',
      },
    ],
    tables: [
      {
        title: 'Akkusativ vs Nominativ Comparison',
        headers: ['Gender', 'Nominativ (Subject)', 'Akkusativ (Direct Object)'],
        rows: [
          ['Masculine', 'der / ein / kein', 'den / einen / keinen'],
          ['Feminine', 'die / eine / keine', 'die / eine / keine'],
          ['Neuter', 'das / ein / kein', 'das / ein / kein'],
          ['Plural', 'die / — / keine', 'die / — / keine'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Ich habe ein neuer Computer.',
        correct: 'Ich habe einen neuen Computer.',
        reason: 'Computer is masculine (der Computer) and direct object of "haben", so it requires "einen neuen".',
      },
    ],
    isPremium: false,
    practiceTopicKey: 'Akkusativ',
  },
  {
    id: 'gram_a2_dativ',
    level: 'A2',
    category: 'Cases (Kasus)',
    title: 'Der Dativ (The Dative Case & Prepositions)',
    slug: 'der-dativ',
    summary: 'Master the indirect object case, Dativ verbs (helfen, danken, gefallen), and static locations.',
    explanationMarkdown: `The **Dativ** represents the indirect object (usually the beneficiary or recipient of an action: *to whom? for whom?*).

### Dativ Article Transformations:
- Masculine: \`der\` → \`dem\` (ein → einem)
- Neuter: \`das\` → \`dem\` (ein → einem)
- Feminine: \`die\` → \`der\` (eine → einer)
- Plural: \`die\` → \`den + n\` (keine → keinen + Nomen-n)

### Dativ Prepositions (Always Dativ):
*aus, bei, mit, nach, seit, von, zu, gegenüber*

### Pure Dativ Verbs:
*helfen* (to help), *danken* (to thank), *gefallen* (to please), *gehören* (to belong to), *antworten* (to answer), *passen* (to fit), *schmecken* (to taste good to).`,
    rules: [
      {
        ruleTitle: 'Dativ Plural +n Suffix',
        ruleDescription: 'In the Dative plural, all nouns take an extra "-n" or "-en" unless they already end in -s or -n.',
        example: 'Ich spiele mit den Kindern (from das Kind, pl. Kinder).',
      },
      {
        ruleTitle: 'Two-way Prepositions (Wechselpräpositionen)',
        ruleDescription: 'Prepositions (an, auf, hinter, in, neben, über, unter, vor, zwischen) take DATIV for position/location (Wo? - static) and AKKUSATIV for direction/motion (Wohin? - movement).',
        example: 'Das Buch liegt auf dem Tisch (Wo? Dativ) vs Ich lege das Buch auf den Tisch (Wohin? Akkusativ).',
      },
    ],
    tables: [
      {
        title: 'Dative Case Full Table',
        headers: ['Gender', 'Definite', 'Indefinite', 'Personal Pronoun'],
        rows: [
          ['Masculine', 'dem Mann', 'einem Mann', 'ihm'],
          ['Feminine', 'der Frau', 'einer Frau', 'ihr'],
          ['Neuter', 'dem Kind', 'einem Kind', 'ihm'],
          ['Plural', 'den Freunden (+n)', 'keinen Freunden', 'ihnen / Ihnen'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Ich helfe dich.',
        correct: 'Ich helfe dir.',
        reason: '"helfen" is a strict Dativ verb, demanding "dir" instead of "dich".',
      },
      {
        incorrect: 'Ich fahre mit das Auto.',
        correct: 'Ich fahre mit dem Auto.',
        reason: '"mit" is always followed by Dativ (das Auto -> dem Auto).',
      },
    ],
    isPremium: false,
    practiceTopicKey: 'Dativ',
  },
  {
    id: 'gram_a2_perfekt',
    level: 'A2',
    category: 'Verbs & Tenses',
    title: 'Das Perfekt (Spoken Past Tense with haben & sein)',
    slug: 'das-perfekt',
    summary: 'Form conversational past tense using auxiliary verbs (haben vs sein) and Partizip II.',
    explanationMarkdown: `In everyday conversational German, the **Perfekt** is the primary past tense.

### Formula:
**Subject + Auxiliary Verb (haben / sein conjugated in present) + ... + Partizip II (at the very end of the sentence)**

### When to use SEIN as auxiliary:
1. **Movement from point A to B:** *gehen, fahren, fliegen, kommen, laufen, reisen*.
2. **Change of state:** *aufwachen (wake up), einschlafen (fall asleep), sterben (die), wachsen (grow)*.
3. **Special verbs:** *sein (gewesen), werden (geworden), bleiben (geblieben), passieren (passiert)*.

### When to use HABEN:
- All transitive verbs with direct Akkusativ objects (Ich habe ein Buch gelesen).
- All reflexive verbs (Ich habe mich gefreut).
- Static modal and non-movement verbs.`,
    rules: [
      {
        ruleTitle: 'Regular Partizip II (ge-...-t)',
        ruleDescription: 'Regular verbs form Partizip II by adding ge- prefix and -t suffix to the verb stem.',
        example: 'kaufen -> gekauft; machen -> gemacht; lernen -> gelernt.',
      },
      {
        ruleTitle: 'Separable vs Inseparable Verbs in Perfekt',
        ruleDescription: 'Separable verbs insert -ge- between prefix and stem (eingekauft). Inseparable verbs (be-, ver-, er-, ge-, ent-, emp-, zer-, miss-) do NOT add -ge- (verstanden, besucht).',
        example: 'Ich habe gestern meine Tante besucht (inseparable: no ge-).',
      },
    ],
    tables: [
      {
        title: 'Auxiliary Verb Selection',
        headers: ['Category', 'Auxiliary', 'Examples'],
        rows: [
          ['Movement (A to B)', 'sein', 'Ich bin nach Berlin geflogen.'],
          ['Change of State', 'sein', 'Das Kind ist schnell eingeschlafen.'],
          ['Direct Object Action', 'haben', 'Wir haben Pizza gegessen.'],
          ['Reflexive Action', 'haben', 'Er hat sich geduscht.'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Ich habe nach Deutschland gereist.',
        correct: 'Ich bin nach Deutschland gereist.',
        reason: 'Reisen implies a change of location from point A to B, requiring "sein".',
      },
    ],
    isPremium: false,
    practiceTopicKey: 'Perfekt',
  },
  {
    id: 'gram_a2_neben',
    level: 'A2',
    category: 'Sentence Structure',
    title: 'Subordinate Clauses (Nebensätze: weil, dass, wenn, obwohl)',
    slug: 'neben-saetze-weil-dass-wenn',
    summary: 'Master the verb-kicker rule where conjugated verbs move to the final position.',
    explanationMarkdown: `In German subordinate clauses (**Nebensätze**), the subordinating conjunction kicks the conjugated verb all the way to the **very end** of the clause.

### Core Conjunctions:
- **weil** (because) — gives a reason.
- **dass** (that) — links indirect speech or factual clauses.
- **wenn** (if / when / whenever) — conditional or recurring events.
- **obwohl** (although / even though) — concessive contrast.
- **ob** (whether / if) — indirect yes/no questions.

### Sentence Formula:
\`[Hauptsatz: Verb in Position 2] + [Komma] + [Konnektor + Subjekt + ... + Verb am Ende]\`
OR
\`[Konnektor + Subjekt + ... + Verb am Ende] + [Komma] + [Verb des Hauptsatzes + Subjekt + ...]\``,
    rules: [
      {
        ruleTitle: 'The Verb-Kicker Rule',
        ruleDescription: 'The conjugated finite verb must always occupy the absolute final position in a Nebensatz.',
        example: 'Ich lerne Deutsch, weil ich in Österreich studieren **will**.',
      },
      {
        ruleTitle: 'Inverted Order when Nebensatz is first',
        ruleDescription: 'If the sentence begins with the Nebensatz, the main clause immediately starts with its conjugated verb (Verb-first rule).',
        example: 'Weil es regnet, **bleibe** ich zu Hause.',
      },
    ],
    tables: [
      {
        title: 'Conjunction Comparison',
        headers: ['Conjunction', 'Meaning', 'Word Order Pattern'],
        rows: [
          ['weil', 'because', '..., weil er krank ist.'],
          ['denn', 'for / because (ADUSO coordinate)', '..., denn er ist krank. (Pos 0)'],
          ['dass', 'that', 'Ich weiß, dass du Recht hast.'],
          ['obwohl', 'although', 'Er kommt, obwohl er müde ist.'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Ich komme nicht, weil ich bin krank.',
        correct: 'Ich komme nicht, weil ich krank bin.',
        reason: 'Conjunction "weil" requires the verb "bin" at the very end.',
      },
    ],
    isPremium: false,
    practiceTopicKey: 'Nebensätze',
  },
  {
    id: 'gram_b1_konjunktiv2',
    level: 'B1',
    category: 'Moods & Modals',
    title: 'Konjunktiv II (Wishes, Politeness & Hypotheticals)',
    slug: 'konjunktiv-ii',
    summary: 'Express polite requests, dreams, hypothetical situations (hätte, wäre, würde + Infinitiv).',
    explanationMarkdown: `**Konjunktiv II** is used for:
1. **Polite requests & questions:** *Könnten Sie mir helfen?* (Could you help me?)
2. **Unreal wishes & conditions:** *Wenn ich reich wäre, würde ich eine Weltreise machen.* (If I were rich, I would travel the world.)
3. **Hypothetical advice:** *An deiner Stelle würde ich mehr lernen.* (In your place, I would study more.)

### Formation:
- **würde + Infinitiv** (standard for almost all verbs): \`Ich würde gerne kommen.\`
- **wäre** (sein): ich wäre, du wärst, er wäre, wir wären, ihr wärt, sie wären.
- **hätte** (haben): ich hätte, du hättest, er hätte, wir hätten, ihr hättet, sie hätten.
- **Modal verbs:** könnte (können), müsste (müssen), dürfte (dürfen), sollte (sollen), wollte (wollen).`,
    rules: [
      {
        ruleTitle: 'Never mix würde with sein/haben',
        ruleDescription: 'For sein and haben, use wäre and hätte directly, rather than "würde sein" or "würde haben".',
        example: 'Wenn ich Zeit hätte (NOT: Zeit haben würde), käme ich gerne.',
      },
    ],
    tables: [
      {
        title: 'Essential Konjunktiv II Forms',
        headers: ['Base Verb', 'Konjunktiv II (ich/er)', 'Example'],
        rows: [
          ['sein', 'wäre', 'Ich wäre glücklich.'],
          ['haben', 'hätte', 'Er hätte gern einen Hund.'],
          ['können', 'könnte', 'Könnten Sie das wiederholen?'],
          ['müssen', 'müsste', 'Ich müsste jetzt gehen.'],
          ['wollen', 'wollte / möchte', 'Ich möchte einen Kaffee.'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Wenn ich viel Geld haben würde...',
        correct: 'Wenn ich viel Geld hätte...',
        reason: 'Stylistically and grammatically, "hätte" is preferred over "haben würde".',
      },
    ],
    isPremium: false,
    practiceTopicKey: 'Konjunktiv II',
  },
  {
    id: 'gram_b1_passiv',
    level: 'B1',
    category: 'Voice & Syntax',
    title: 'Das Passiv (Passive Voice with werden + Partizip II)',
    slug: 'das-passiv-praesens-praeteritum',
    summary: 'Learn process passive (Vorgangspassiv) vs state passive (Zustandspassiv) across present and past.',
    explanationMarkdown: `The passive voice emphasizes the **action** or the **result** rather than who executed it.

### Vorgangspassiv (Action in progress):
**werden (conjugated) + Partizip II (at end)**
- **Präsens:** *Das Auto wird repariert.* (The car is being repaired.)
- **Präteritum:** *Das Auto wurde repariert.* (The car was repaired.)
- **Perfekt:** *Das Auto ist repariert worden.* (The car has been repaired — notice *worden*, not *geworden*!)

### Indicating the Agent:
- **von + Dativ**: for persons or active agents (*Der Brief wird vom Chef geschrieben*).
- **durch + Akkusativ**: for means, instruments, causes (*Das Gebäude wurde durch das Feuer zerstört*).`,
    rules: [
      {
        ruleTitle: 'Worden vs Geworden',
        ruleDescription: 'In Passiv Perfekt, the auxiliary "werden" becomes "worden" (never "geworden").',
        example: 'Das Haus ist gebaut worden.',
      },
    ],
    tables: [
      {
        title: 'Passiv Tenses Overview',
        headers: ['Tense', 'Formula', 'Example'],
        rows: [
          ['Präsens', 'wird + Partizip II', 'Der Patient wird operiert.'],
          ['Präteritum', 'wurde + Partizip II', 'Der Patient wurde operiert.'],
          ['Perfekt', 'ist + Partizip II + worden', 'Der Patient ist operiert worden.'],
          ['Mit Modalverb', 'kann + Partizip II + werden', 'Das Problem kann gelöst werden.'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Das Buch ist von mir gelesen geworden.',
        correct: 'Das Buch ist von mir gelesen worden.',
        reason: 'In passive voice, always use "worden", not "geworden".',
      },
    ],
    isPremium: true,
    practiceTopicKey: 'Passiv',
  },
  {
    id: 'gram_b1_relativ',
    level: 'B1',
    category: 'Complex Sentences',
    title: 'Relativsätze (Relative Clauses in All Cases)',
    slug: 'relativsaetze-alle-faelle',
    summary: 'Connect detailed descriptions using relative pronouns across Nominativ, Akkusativ, Dativ, and Genitiv.',
    explanationMarkdown: `Relative clauses give additional information about a preceding noun without starting a new sentence.

### The Relative Pronoun depends on:
1. **Gender & Number:** Taken from the antecedent noun in the main clause.
2. **Case (Kasus):** Determined by the function within the relative clause itself!

### Genitive Relative Pronouns (whose):
- Masculine/Neuter: \`dessen\` (*Der Mann, dessen Auto gestohlen wurde...*)
- Feminine/Plural: \`deren\` (*Die Frau, deren Tasche verloren ging...*)`,
    rules: [
      {
        ruleTitle: 'Prepositions with Relative Clauses',
        ruleDescription: 'If the relative clause contains a preposition, the preposition comes FIRST, dictating the case of the relative pronoun.',
        example: 'Das ist der Kollege, **mit dem** ich arbeite.',
      },
    ],
    tables: [
      {
        title: 'Relative Pronouns Chart',
        headers: ['Case', 'Masculine', 'Feminine', 'Neuter', 'Plural'],
        rows: [
          ['Nominativ', 'der', 'die', 'das', 'die'],
          ['Akkusativ', 'den', 'die', 'das', 'die'],
          ['Dativ', 'dem', 'der', 'dem', 'denen'],
          ['Genitiv', 'dessen', 'deren', 'dessen', 'deren'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Die Freunde, mit die ich reise...',
        correct: 'Die Freunde, mit denen ich reise...',
        reason: 'Dativ plural relative pronoun is "denen" (governed by preposition "mit").',
      },
    ],
    isPremium: true,
    practiceTopicKey: 'Relativsätze',
  },
  {
    id: 'gram_b2_nomenverb',
    level: 'B2',
    category: 'Advanced German (C-Level Bridge)',
    title: 'Nomen-Verb-Verbindungen (Function Verb Collocations)',
    slug: 'nomen-verb-verbindungen',
    summary: 'Master formal, business, and academic idioms essential for B2/C1 exams (eine Rolle spielen, in Betracht ziehen).',
    explanationMarkdown: `Nomen-Verb-Verbindungen (NVV) replace simple verbs with a noun + functional verb combo to express nuance in professional and academic writing.

### Top Essential NVV for B2 Exams:
- **eine Rolle spielen** = wichtig sein (to play a role / be important)
- **in Betracht ziehen** = nachdenken über / berücksichtigen (to consider)
- **zur Verfügung stehen / stellen** = verfügbar sein / anbieten (to be available / make available)
- **eine Entscheidung treffen** = sich entscheiden (to make a decision)
- **Kritik üben an (+ Dat)** = kritisieren (to criticize)
- **in Frage kommen** = möglich sein / erlaubt sein (to be in question / considered)
- **Bezug nehmen auf (+ Akk)** = sich beziehen auf (to refer to)
- **zur Sprache bringen** = ansprechen / thematisieren (to bring up for discussion)
- **Einfluss ausüben auf (+ Akk)** = beeinflussen (to exert influence upon)`,
    rules: [
      {
        ruleTitle: 'Fixed Preposition Pairing',
        ruleDescription: 'Many NVVs contain fixed prepositions that never change their required case.',
        example: 'Wir müssen diese Option in Betracht ziehen.',
      },
    ],
    tables: [
      {
        title: 'Common NVV vs Simple Verbs',
        headers: ['Nomen-Verb-Verbindung', 'Simple Verb Equivalent', 'Example Sentence'],
        rows: [
          ['eine Entscheidung treffen', 'sich entscheiden', 'Der Minister traf gestern eine schwere Entscheidung.'],
          ['zur Verfügung stehen', 'vorhanden / nutzbar sein', 'Die Unterlagen stehen Ihnen ab sofort zur Verfügung.'],
          ['Abschied nehmen von', 'sich verabschieden', 'Wir nahmen schweren Herzens Abschied von unseren Freunden.'],
          ['in Anspruch nehmen', 'nutzen / beanspruchen', 'Viele Bürger nehmen die staatliche Beratung in Anspruch.'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Er machte eine Entscheidung.',
        correct: 'Er traf eine Entscheidung.',
        reason: 'Collocation error: In German you "hit/meet" a decision (treffen), never "make" (machen).',
      },
    ],
    isPremium: true,
    practiceTopicKey: 'Nomen-Verb-Verbindungen',
  },
  {
    id: 'gram_b2_partizip',
    level: 'B2',
    category: 'Academic & Formal Syntax',
    title: 'Partizipialattribute (Extended Participial Attributes)',
    slug: 'partizipialattribute-b2',
    summary: 'Compress complex relative clauses into elegant academic adjectives (Partizip I and Partizip II).',
    explanationMarkdown: `In university-level German, newspapers, and formal essays, long relative clauses are often transformed into **Partizipialattribute** directly in front of the noun.

### Partizip I (Active / Present in progress):
**Verb stem + d + Adjective Ending**
- *Das Kind, das lacht* → *Das **lachende** Kind.*
- *Die Zahl, die kontinuierlich steigt* → *Die **kontinuierlich steigende** Zahl.*

### Partizip II (Passive / Completed state):
**Partizip II + Adjective Ending**
- *Das Dokument, das gestern unterschrieben wurde* → *Das gestern **unterschriebene** Dokument.*
- *Die Kosten, die bereits bezahlt wurden* → *Die bereits **bezahlten** Kosten.*

### Gerundiv (zu + Partizip I with passive modal meaning "must/can be done"):
- *Die Aufgabe, die gelöst werden muss* → *Die **zu lösende** Aufgabe.*`,
    rules: [
      {
        ruleTitle: 'Adjective Endings Apply',
        ruleDescription: 'Extended participles behave exactly like standard adjectives and must take the standard adjective declension endings.',
        example: 'Die von der Regierung beschlossenen Maßnahmen treten morgen in Kraft.',
      },
    ],
    tables: [
      {
        title: 'Transformation Overview',
        headers: ['Relative Clause', 'Partizipialattribut Form', 'Meaning'],
        rows: [
          ['Der Zug, der um 8 Uhr ankommt', 'Der um 8 Uhr ankommende Zug', 'Partizip I (Active)'],
          ['Der Brief, der gestern versendet wurde', 'Der gestern versendete Brief', 'Partizip II (Passive)'],
          ['Der Text, der noch korrigiert werden muss', 'Der noch zu korrigierende Text', 'Gerundiv (zu + P.I)'],
        ],
      },
    ],
    commonMistakes: [
      {
        incorrect: 'Der ankommend Zug ist verspätet.',
        correct: 'Der ankommende Zug ist verspätet.',
        reason: 'Participle attributes MUST be inflected with normal adjective endings (masculine nominative -e).',
      },
    ],
    isPremium: true,
    practiceTopicKey: 'Partizipialattribute',
  },
];
