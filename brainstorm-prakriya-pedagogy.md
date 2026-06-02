# Prakriya + Pedagogy — Brainstorming Notes
**Date:** 2026-06-01
**Context:** Vision for integrating Vidyut prakriya engine with traditional learning sequence

---

## The Core Vision

Mimic the traditional Paninian learning method in digital form and pass it to the next generation.

Traditional sequence:
1. Memorize Ashtadhyayi (3976 sutras) + Dhatupatha
2. Learn every sutra sequentially — each with its siddhi (example derivation)
   - e.g. सुत्र 1.1.1 → example: नायकः (derived from णिञ् प्रापणे dhatu)
3. Learn samasa derivation
4. Revise the full cycle
5. Approach Mahabhashya (only makes sense after full first pass)
6. After ~3 years: can explain ANY Sanskrit word in Sanskrit

This is genuine algorithmic learning. The student becomes a human compiler for Sanskrit morphology.

---

## Why This Matters for Architecture

The traditional learning sequence IS a dependency graph.
The prakriya display should reflect this — not overwhelm a beginner with rules they haven't studied yet.

```
Shivasutras (phonological alphabet)
    ↓
Ashtadhyayi sequential (Panini's order, not Siddhanta Kaumudi order)
    ↓
Dhatupatha alongside (roots + meanings memorized in parallel)
    ↓
Each sutra: meaning + siddhi example + dhatu chain
    ↓
Samasa (compounds — rules referencing prior rules)
    ↓
Revision pass — rules now interact, not just fire individually
    ↓
Mahabhashya — Patanjali's objections now comprehensible
    ↓
Any Sanskrit word → full derivation from memory
```

---

## Key Example: नायकः from णिञ् प्रापणे

- Sutra 1.1.1 (वृद्धिरादैच्) defines vṛddhi sounds: ā, ai, au
- The canonical example word is नायकः
- Derived from root √नी (णिञ् प्रापणे — "to carry, to obtain")
- Derivation chain: root णी + suffix ण्वुल् → vṛddhi applies (1.1.1 fires) → नाय + अक = नायक + अः = नायकः
- This is not arbitrary — the example was chosen by the tradition BECAUSE it shows vṛddhi in a word students will recognize

**Key insight:** Every traditional siddhi example was pedagogically chosen. The database of sutra → example is not arbitrary — it encodes the tradition's own teaching sequence.

---

## The Siddhi Example Database

For sutra 1.1.1, canonical examples include:
- भागः, यागः (ā = vṛddhi)
- नायकः, पावकः, हारकः, पाठकः, पाचकः, गायकः (ai/au = vṛddhi)

These are NOT just "words that happen to use this rule." They are the tradition's curated entry points.

**Owner is already building this manually in Obsidian vault.**
The Obsidian vault is the seed database.

**Long-term goal:** Every sutra has 2-5 curated example words, each with:
- The word form
- The dhatu/root it comes from
- The suffix chain
- The key sutras that fire
- A link to the full prakriya

---

## The Pedagogical Loop (the novel UX)

```
Sutra card (1.1.1)
    ↓ tap "Siddhi examples"
नायकः  भागः  यागः  ...
    ↓ tap नायकः
Full prakriya: णी → ण्वुल् → vṛddhi → नायकः
    ↓ hover/tap any sutra in the derivation
Popup: sutra text + artha (meaning)
    ↓ tap to go to that sutra
Sutra card (e.g. 3.1.133 for ण्वुल्)
    ↓ its own siddhi examples
...
```

This is a knowledge web, not a linear reference. No existing tool has this.

---

## The Four Requirements (from owner)

### 1. Better prakriya display with hover popups
- Show derivation steps (powered by Vidyut WASM)
- Hover over sutra reference → popup showing:
  - Sutra text (available now)
  - Sutra type badge (संज्ञा/परिभाषा/विधि — available now)
  - Short artha/gloss (Phase 2 — owner's English meanings)
- Gap: one-line sutra meanings not yet in data

### 2. Siddhi examples as derivation entry points
- Each sutra card shows its curated example words
- Each example word links to its full prakriya
- The prakriya links back to sutras
- Gap: example database needs to be built (owner's Obsidian vault is the seed)

### 3. Svara
- Long-term, research-grade
- Owner's living recitation tradition is the unique qualification here

### 4. Obsidian plugin
- Highlight Sanskrit text → hotkey → derivation panel
- Uses same Vidyut WASM as web app
- Obsidian is Electron-based → WASM works natively
- Owner already lives in Obsidian — this meets them where they are
- The plugin and the web app share the same example database

---

## Key Gaps

### The reverse lookup problem
Vidyut runs forward: root + suffix → word form
Requirement 2 needs: surface form → root → prakriya
vidyut-cheda (segmentation) bridges this but has its own gaps
**Solution for now:** curated examples (owner controls the input), not arbitrary lookup

### The artha gap
Hover popup needs short sutra meanings
Kashika is too long for a tooltip
Owner's Phase 2 English meanings will fill this
**Short-term:** show sutra text + padaccheda only

### The example database scope
Curating 3976 sutras × 3 examples = ~12,000 derivations
This is the hardest part — what humans have done for centuries
**Strategy:** Start with adhyaya 1.1 (75 sutras, most-studied)
Build infrastructure first, expand with community over time

### The two audiences
Beginner: every step, every sutra explained, slow
Advanced: key rules only, fast
**Design:** progressive disclosure (like ashtadhyayi.com's "Main steps" toggle)
But smarter — show/hide based on which sutras the student has already studied

---

## Implementation Phases

```
Phase A (months):
  - Integrate Vidyut WASM into Paniniyam
  - Prakriya panel for curated example words
  - Hover popup (sutra text + type badge, artha later)

Phase B (6–12 months):
  - Siddhi example database (export from Obsidian vault, adhyaya 1 first)
  - Circle-back links: sutra → examples → prakriya → sutra
  - Owner teaches the derivation process → informs data model

Phase C (1–2 years):
  - Obsidian plugin (same Vidyut WASM)
  - Highlight → hotkey → derivation panel in Obsidian
  - Notes in Obsidian feed back into web app example database

Phase D (research):
  - Svara layer
  - Complete Paninian prakriya including accent
```

---

## The Prakarana Layer — A Third Navigation Axis

### What Was Discovered (2026-06-01)

The vault has a complete **prakarana index** — a topic-based reorganization of all 3976 sutras,
built as a layer on top of the Ashtadhyayi order.

**Structure:**
```
prakaranas/
├── index.md                  ← pada → prakarana mapping (all 32 padas)
├── इत् संज्ञा प्रकरणम्.md   ← numbered list of sutras 1.3.2–1.3.9 with wiki links
├── समास प्रकरणम्.md          ← all samasa sutras 2.1.1–2.x.x with sub-headings
├── णत्व प्रकरणम्.md          ← 8.4.1–8.4.x numbered list
└── ... 314 files total
```

**Three navigation axes now exist in the vault:**
1. Ashtadhyayi order — 1.1.1 → 1.1.2 → 1.1.3 (what Paniniyam does now)
2. Pada → Prakarana — index.md maps each of the 32 padas to its topic groups
3. Prakarana → Sutras — each prakarana note lists its member sutras with wiki links

**This is the Siddhanta Kaumudi reorganization encoded as data, layered on top of,
not replacing, the original Ashtadhyayi order.** No other digital tool has this.

### Prakarana Note Structure

Each prakarana note contains:
- Numbered list of sutras: `1. [[1.3.2|उपदेशेऽजनुनासिक इत् 1.3.2]]`
- Sometimes prose explanation of the prakarana's purpose
- Sometimes explanatory tables (e.g., इत् संज्ञा has the full anubandha table with effects)
- `==highlighted==` sutras mark the **key sutras** within the prakarana — pedagogically primary
- Cross-references to related prakarana notes

### The `==highlighted==` Signal

In समास प्रकरणम्, certain sutras are marked with `==`:
```
3. ==[[2.1.24|द्वितीया श्रितातीत... 2.1.24]]
```
These are the sutras the teacher identified as the essential rules of that topic —
the ones a student must internalize first. This is a priority ranking embedded in
the data that no other source provides.

### Implications for Paniniyam

**Sutra card enhancement:**
- Each sutra card shows "Prakarana: गुणवृद्धि" as a badge
- Clicking the badge shows all sutras in that prakarana (topic browsing)
- `==highlighted==` sutras get a "key sutra" indicator

**32 Padas overview page** (already in near-term roadmap):
- Now has real content: each pada cell lists its prakaranas
- Clicking prakarana → sutra list for that topic
- This is the missing "what is this pada about" context

**Prakarana browsing mode:**
- Alternative nav to sequential browsing
- Groups sutras by function (all iṭ-āgama rules together, all kāraka rules together)
- This is how a student revising after first pass would navigate — not 1.1.1 → 1.1.2,
  but "show me all the guṇa rules across the entire grammar"

### Data Extraction Path

The prakarana → sutra mapping is already machine-readable:
- Each prakarana `.md` file has sutra wiki links in the format `[[a.p.n|text a.p.n]]`
- Extract sutra ID from the wiki link target
- Build a reverse map: sutra_id → list of prakaranas it belongs to
- This can be done with a simple script; no manual data entry needed

### What This Enables (Future)

**Student progress tracking** (Phase 4+):
- Mark prakaranas as "studied" rather than individual sutras
- "You have studied 8/14 prakaranas in pada 1.1"
- More meaningful than "you have studied 47/75 sutras"

**Adaptive display:**
- Show only the prakaranas a student has reached when displaying a sutra's context
- "This sutra is part of वृद्धि-संज्ञा prakarana — you studied this in sutra 1.1.1"

---

## The Generational Preservation Mission

The knowledge of "can explain any Sanskrit word from Paninian first principles"
currently lives in living teachers only. When those teachers are gone,
the chain depends on students like the owner.

Paniniyam with this pedagogical layer could carry the tradition forward
to people who will never sit in a gurukul.

This is the real mission — not just a reference tool.

---

## Open: Owner to Teach the Process

Owner offered to start a thread explaining the traditional derivation process.
This is critical input — the dhatu → suffix → sutra chain for even one word
(नायकः) will inform:
- How to model the prakriya data structure
- The correct sequencing for the display
- Which sutras are "expected" at which stage of learning

**Action:** Start the teaching thread. Document the णिञ् → नायकः chain in full.
