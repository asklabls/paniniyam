'use strict';
// subanta.js — Rule-based Sanskrit nominal declension engine
// v2: adds State machine with sūtra-by-sūtra derivation trail
// Exposes window.Subanta = { derive, paradigm, stemClass }

(function (global) {

// ── Unicode constants ─────────────────────────────────────────────────────────
const HALANT   = '\u094D'; // ्
const VISARGA  = '\u0903'; // ः
const ANUSVARA = '\u0902'; // ं
const CHANDRAB = '\u0901'; // ँ

const IND_VOWELS = new Set('अआइईउऊऋॠएऐओऔ');
const MATRAS = new Set('ािीुूृॄेैोौ');
const VOWEL_CHAR = {
  '\u093E': 'आ', '\u093F': 'इ', '\u0940': 'ई',
  '\u0941': 'उ', '\u0942': 'ऊ', '\u0943': 'ऋ', '\u0944': 'ॠ',
  '\u0947': 'ए', '\u0948': 'ऐ', '\u094B': 'ओ', '\u094C': 'औ',
};
const VOWEL_TO_MATRA = {
  'आ':'ा','इ':'ि','ई':'ी','उ':'ु','ऊ':'ू','ऋ':'ृ','ॠ':'ॄ',
  'ए':'े','ऐ':'ै','ओ':'ो','औ':'ौ',
};
const IND_VOWEL_NAME = {
  'अ':'अ','आ':'आ','इ':'इ','ई':'ई','उ':'उ','ऊ':'ऊ',
  'ऋ':'ऋ','ॠ':'ॠ','ए':'ए','ऐ':'ऐ','ओ':'ओ','औ':'औ',
};

// ── Tokenizer ─────────────────────────────────────────────────────────────────
// Returns array of { text, cons, vowel, hasHalant }
function tok(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (IND_VOWELS.has(ch)) {
      let txt = ch;
      let j = i + 1;
      while (j < text.length && (text[j] === ANUSVARA || text[j] === CHANDRAB || text[j] === VISARGA)) {
        txt += text[j++];
      }
      tokens.push({ text: txt, cons: '', vowel: IND_VOWEL_NAME[ch] || ch, hasHalant: false });
      i = j;
      continue;
    }
    if (ch === VISARGA || ch === ANUSVARA || ch === CHANDRAB) {
      if (tokens.length) tokens[tokens.length - 1].text += ch;
      i++; continue;
    }
    const consChar = ch;
    let j = i + 1;
    let vowel = 'अ';
    let hasHalant = false;
    let txt = ch;
    if (j < text.length) {
      const next = text[j];
      if (next === HALANT) {
        txt += HALANT;
        vowel = '';
        hasHalant = true;
        j++;
      } else if (MATRAS.has(next) || VOWEL_CHAR[next]) {
        const v = VOWEL_CHAR[next] || '';
        if (v) { txt += next; vowel = v; j++; }
      }
    }
    while (j < text.length && (text[j] === ANUSVARA || text[j] === CHANDRAB || text[j] === VISARGA)) {
      txt += text[j++];
    }
    tokens.push({ text: txt, cons: consChar, vowel, hasHalant });
    i = j;
  }
  return tokens;
}

// ── Slot class ────────────────────────────────────────────────────────────────
class Slot {
  constructor(idx, role, text, cons, vowel, hasHalant) {
    this.idx = idx;
    this.role = role;        // 'PRATIPADIKA' | 'SUP' | 'AGAMA'
    this.text = text;
    this.cons = cons;
    this.vowel = vowel;
    this.hasHalant = hasHalant;
    this.deleted = false;
  }
}

// ── State class ───────────────────────────────────────────────────────────────
class State {
  constructor(slots) {
    this.slots = slots;
    this.steps = [];
    this._nextIdx = slots.length;
  }

  active() {
    return this.slots.filter(s => !s.deleted);
  }

  form() {
    return this.active().map(s => s.text).join('');
  }

  recordStep(rule, note) {
    this.steps.push({ rule, note, form: this.form() });
  }

  substitute(idx, newText, rule, note) {
    const sl = this.slots.find(s => s.idx === idx);
    if (!sl) return;
    sl.text = newText;
    const tks = tok(newText);
    if (tks.length >= 1) {
      sl.cons = tks[0].cons;
      sl.vowel = tks[0].vowel;
      sl.hasHalant = tks[0].hasHalant;
    }
    this.steps.push({ rule, note, form: this.form() });
  }

  lopa(idx, rule, note) {
    const sl = this.slots.find(s => s.idx === idx);
    if (!sl) return;
    sl.deleted = true;
    this.steps.push({ rule, note, form: this.form() });
  }

  // Append new SUP slot(s) from text, return array of new slots
  appendSup(text, rule, note) {
    const tks = tok(text);
    const newSlots = [];
    tks.forEach((t, i) => {
      const sl = new Slot(this._nextIdx++, 'SUP', t.text, t.cons, t.vowel, t.hasHalant);
      this.slots.push(sl);
      newSlots.push(sl);
    });
    this.steps.push({ rule, note, form: this.form() });
    return newSlots;
  }

  // Replace entire SUP portion (all SUP slots) with new text
  // If newText is purely a diacritic (ः ं etc.), attach to last pratipadika slot instead
  replaceSup(newText, rule, note) {
    this.slots.filter(s => s.role === 'SUP' && !s.deleted).forEach(s => { s.deleted = true; });
    // Check if the text is a pure diacritic (visarga, anusvara) that can't stand alone
    const isDiacritic = /^[ःंँ]+$/.test(newText);
    if (isDiacritic) {
      // Attach to the last pratipadika slot
      const pratSlots = this.slots.filter(s => s.role === 'PRATIPADIKA' && !s.deleted);
      if (pratSlots.length) {
        const last = pratSlots[pratSlots.length - 1];
        last.text += newText;
      }
      this.steps.push({ rule, note, form: this.form() });
    } else {
      this.appendSup(newText, rule, note);
    }
  }

  static fromPratipadika(text) {
    const tks = tok(text);
    const slots = tks.map((t, i) => new Slot(i, 'PRATIPADIKA', t.text, t.cons, t.vowel, t.hasHalant));
    return new State(slots);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasNatvaTrigger(stemText) {
  return /[रषऋृॠ]/.test(stemText);
}

function replaceFinalA(stem, newMatra) {
  const tokens = tok(stem);
  if (!tokens.length) return stem;
  const last = tokens[tokens.length - 1];
  let newTok;
  if (newMatra === '') { newTok = last.cons + HALANT; }
  else { newTok = last.cons + newMatra; }
  return tokens.slice(0, -1).map(t => t.text).join('') + newTok;
}

function replaceFinalAA(stem, newMatra) {
  const tokens = tok(stem);
  if (!tokens.length) return stem;
  const last = tokens[tokens.length - 1];
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  if (newMatra === '') { return prefix + last.cons + HALANT; }
  return prefix + last.cons + newMatra;
}

function aBase(stem) { return replaceFinalA(stem, ''); }

function stripMatra(stem, matra) {
  return stem.endsWith(matra) ? stem.slice(0, -1) : stem;
}

// ── Operative suffix after IT-lopa ────────────────────────────────────────────
// Key: `${vib},${vac}`
const OPERATIVE_SUP = {
  '1,1': 'स्', '1,2': 'औ', '1,3': 'अस्',
  '2,1': 'अम्', '2,2': 'औ', '2,3': 'अस्',
  '3,1': 'आ', '3,2': 'भ्याम्', '3,3': 'भिस्',
  '4,1': 'ए', '4,2': 'भ्याम्', '4,3': 'भ्यस्',
  '5,1': 'असि', '5,2': 'भ्याम्', '5,3': 'भ्यस्',
  '6,1': 'अस्', '6,2': 'ओस्', '6,3': 'आम्',
  '7,1': 'इ', '7,2': 'ओस्', '7,3': 'सु',
};

// Raw upadeśa strings (before IT-lopa) — for the note display
const RAW_SUP = {
  '1,1': 'सुँ', '1,2': 'औ', '1,3': 'जस्',
  '2,1': 'अम्', '2,2': 'औट्', '2,3': 'शस्',
  '3,1': 'टा', '3,2': 'भ्याम्', '3,3': 'भिस्',
  '4,1': 'ङे', '4,2': 'भ्याम्', '4,3': 'भ्यस्',
  '5,1': 'ङसि', '5,2': 'भ्याम्', '5,3': 'भ्यस्',
  '6,1': 'ङस्', '6,2': 'ओस्', '6,3': 'आम्',
  '7,1': 'ङि', '7,2': 'ओस्', '7,3': 'सुप्',
};

const VIB_NAMES_EN = {
  1:'nom', 2:'acc', 3:'inst', 4:'dat', 5:'abl', 6:'gen', 7:'loc'
};
const VAC_NAMES_EN = { 1:'sg', 2:'du', 3:'pl' };

// IT detection rule for a vibhakti suffix.
// Returns [ruleNumber, note] identifying which rule makes the marker an IT.
function itRuleForSup(raw) {
  const CHANDRAB_CH = '\u0901'; // ँ  anunāsika
  const CHUTU   = new Set([...'चछजझञटठडढण']);  // 1.3.7
  const LASHAKU  = new Set([...'लशकखगघङ']);      // 1.3.8 (ल + श + ku-varga)

  if (raw.includes(CHANDRAB_CH))
    return ['1.3.2', `उपदेशेऽजनुनासिक इत्: ँ in ${raw} marks vowel as IT`];

  const first = [...raw][0]; // first Unicode char
  if (CHUTU.has(first))
    return ['1.3.7', `चुटू: initial ${first}् is IT (चु/टु-वर्ग)`];
  if (LASHAKU.has(first))
    return ['1.3.8', `लशकु अतद्धिते: initial ${first}् is IT`];

  // 1.3.3: हलन्त्यम् — final consonant is IT
  const stripped = raw.endsWith('्') ? raw.slice(0, -1) : raw;
  const lastCons = [...stripped].slice(-1)[0] || '?';
  return ['1.3.3', `हलन्त्यम्: final ${lastCons}् of ${raw} is IT`];
}

// Expand the ruu-visarga chain into 3 explicit steps.
// Called whenever a word-final suffix ending in स् triggers 8.2.66.
//
//   formWithS   — the form at the point where suffix still shows स्
//                 e.g. "राम+स्", "रामा+स्", "रामै+स्"
//   finalForm   — the completed form ending in ः
//                 e.g. "रामः", "रामाः", "रामैः"
//
// Adds three steps:
//   8.2.66  ससजुषो रुः:              स् → रुँ
//   1.3.9   तस्य लोपः:               ह् (IT of रुँ) → ∅ → र्
//   8.3.15  खरवसानयोर्विसर्जनीयः:    र् → ः
function appendVisargaChain(steps, formWithS, finalForm) {
  const withRu = formWithS.replace(/स्$/, 'रुँ');
  const withR  = formWithS.replace(/स्$/, 'र्');
  steps.push({ rule: '8.2.66', note: 'ससजुषो रुः: word-final स्→रुँ',                        form: withRu   });
  steps.push({ rule: '1.3.9',  note: 'तस्य लोपः: ह् (IT anubandha of रुँ) dropped → र्',    form: withR    });
  steps.push({ rule: '8.3.15', note: 'खरवसानयोर्विसर्जनीयः: word-final र्→ः (visarjanīya)', form: finalForm });
}

// Add the raw suffix and immediately do IT-lopa, recording steps
// Returns the operative suffix slots
function addSup(state, vib, vac) {
  const pos = `${vib},${vac}`;
  const raw = RAW_SUP[pos];
  const operative = OPERATIVE_SUP[pos];
  const vibName = VIB_NAMES_EN[vib];
  const vacName = VAC_NAMES_EN[vac];

  // Step 1: 4.1.2 — add raw suffix (स्वौजसमौट्…)
  state.appendSup(raw, '4.1.2', `स्वौजसमौट्…: ${raw} (${vibName} ${vacName})`);

  if (raw !== operative) {
    // Step 2: IT detection rule (1.3.2 / 1.3.3 / 1.3.7 / 1.3.8)
    // Form does NOT change here — just identifies the IT marker
    const [itRule, itNote] = itRuleForSup(raw);
    state.steps.push({ rule: itRule, note: itNote, form: state.form() });

    // Step 3: 1.3.9 — तस्य लोपः — IT markers stripped → operative
    state.replaceSup(operative, '1.3.9', `तस्य लोपः: IT stripped → ${operative}`);
  }
}

// ── Paradigm tables for irregular / special stems ─────────────────────────────

function makeGrid(flat21) {
  const g = [];
  for (let v = 0; v < 7; v++) {
    g.push([flat21[v*3], flat21[v*3+1], flat21[v*3+2]]);
  }
  return g;
}

const SPECIAL_STEMS = {};

SPECIAL_STEMS['गो|F'] = makeGrid([
  'गौः','गावौ','गावः',
  'गाम्','गावौ','गाः',
  'गवा','गोभ्याम्','गोभिः',
  'गवे','गोभ्याम्','गोभ्यः',
  'गोः','गोभ्याम्','गोभ्यः',
  'गोः','गवोः','गवाम्',
  'गवि','गवोः','गोषु',
]);

SPECIAL_STEMS['नौ|F'] = makeGrid([
  'नौः','नावौ','नावः',
  'नावम्','नावौ','नावः',
  'नावा','नौभ्याम्','नौभिः',
  'नावे','नौभ्याम्','नौभ्यः',
  'नावः','नौभ्याम्','नौभ्यः',
  'नावः','नावोः','नावाम्',
  'नावि','नावोः','नौषु',
]);

SPECIAL_STEMS['द्यु|M'] = makeGrid([
  'द्यौः','द्यावौ','द्यावः',
  'द्यावम्','द्यावौ','द्यून्',
  'द्युवा','द्युभ्याम्','द्युभिः',
  'द्युवे','द्युभ्याम्','द्युभ्यः',
  'द्युवः','द्युभ्याम्','द्युभ्यः',
  'द्युवः','द्युवोः','द्युवाम्',
  'द्युवि','द्युवोः','द्युषु',
]);

SPECIAL_STEMS['मघवन्|M'] = makeGrid([
  'मघवा','मघवानौ','मघवानः',
  'मघवानम्','मघवानौ','मघवनः',
  'मघवता','मघवद्भ्याम्','मघवद्भिः',
  'मघवते','मघवद्भ्याम्','मघवद्भ्यः',
  'मघवतः','मघवद्भ्याम्','मघवद्भ्यः',
  'मघवतः','मघवनोः','मघवनाम्',
  'मघवति','मघवनोः','मघवत्सु',
]);

SPECIAL_STEMS['अर्यमन्|M'] = makeGrid([
  'अर्यमा','अर्यमाणौ','अर्यमाणः',
  'अर्यमाणम्','अर्यमाणौ','अर्यमणः',
  'अर्यम्णा','अर्यमभ्याम्','अर्यमभिः',
  'अर्यम्णे','अर्यमभ्याम्','अर्यमभ्यः',
  'अर्यम्णः','अर्यमभ्याम्','अर्यमभ्यः',
  'अर्यम्णः','अर्यमणोः','अर्यमणाम्',
  'अर्यम्णि','अर्यमणोः','अर्यमसु',
]);

SPECIAL_STEMS['श्वन्|M'] = makeGrid([
  'श्वा','श्वानौ','श्वानः',
  'श्वानम्','श्वानौ','शुनः',
  'शुना','श्वभ्याम्','श्वभिः',
  'शुने','श्वभ्याम्','श्वभ्यः',
  'शुनः','श्वभ्याम्','श्वभ्यः',
  'शुनः','शुनोः','शुनाम्',
  'शुनि','शुनोः','श्वसु',
]);

SPECIAL_STEMS['पथिन्|M'] = makeGrid([
  'पन्थाः','पन्थानौ','पन्थानः',
  'पन्थानम्','पन्थानौ','पथः',
  'पथा','पथिभ्याम्','पथिभिः',
  'पथे','पथिभ्याम्','पथिभ्यः',
  'पथः','पथिभ्याम्','पथिभ्यः',
  'पथः','पथोः','पथाम्',
  'पथि','पथोः','पथिषु',
]);

SPECIAL_STEMS['पूषन्|M'] = makeGrid([
  'पूषा','पूषणौ','पूषणः',
  'पूषणम्','पूषणौ','पूष्णः',
  'पूष्णा','पूषभ्याम्','पूषभिः',
  'पूष्णे','पूषभ्याम्','पूषभ्यः',
  'पूष्णः','पूषभ्याम्','पूषभ्यः',
  'पूष्णः','पूष्णोः','पूष्णाम्',
  'पूष्णि','पूष्णोः','पूषसु',
]);

SPECIAL_STEMS['अहन्|N'] = makeGrid([
  'अहः','अहनी','अहानि',
  'अहः','अहनी','अहानि',
  'अह्ना','अहोभ्याम्','अहोभिः',
  'अह्ने','अहोभ्याम्','अहोभ्यः',
  'अह्नः','अहोभ्याम्','अहोभ्यः',
  'अह्नः','अह्नोः','अह्नाम्',
  'अह्नि','अह्नोः','अहःसु',
]);

SPECIAL_STEMS['पुम्स्|M'] = makeGrid([
  'पुमान्','पुमांसौ','पुमांसः',
  'पुमांसम्','पुमांसौ','पुंसः',
  'पुंसा','पुंभ्याम्','पुंभिः',
  'पुंसे','पुंभ्याम्','पुंभ्यः',
  'पुंसः','पुंभ्याम्','पुंभ्यः',
  'पुंसः','पुंसोः','पुंसाम्',
  'पुंसि','पुंसोः','पुंसु',
]);

SPECIAL_STEMS['अदस्|M'] = makeGrid([
  'असौ','अमू','अमी',
  'अमुम्','अमू','अमून्',
  'अमुना','अमूभ्याम्','अमीभिः',
  'अमुष्मै','अमूभ्याम्','अमीभ्यः',
  'अमुष्मात्','अमूभ्याम्','अमीभ्यः',
  'अमुष्य','अमुयोः','अमीषाम्',
  'अमुष्मिन्','अमुयोः','अमीषु',
]);
SPECIAL_STEMS['अदस्|F'] = makeGrid([
  'असौ','अमू','अमूः',
  'अमुम्','अमू','अमूः',
  'अमुया','अमूभ्याम्','अमूभिः',
  'अमुष्यै','अमूभ्याम्','अमूभ्यः',
  'अमुष्याः','अमूभ्याम्','अमूभ्यः',
  'अमुष्याः','अमुयोः','अमूसाम्',
  'अमुष्याम्','अमुयोः','अमूषु',
]);
SPECIAL_STEMS['अदस्|N'] = makeGrid([
  'अदः','अमू','अमूनि',
  'अदः','अमू','अमूनि',
  'अमुना','अमूभ्याम्','अमीभिः',
  'अमुष्मै','अमूभ्याम्','अमीभ्यः',
  'अमुष्मात्','अमूभ्याम्','अमीभ्यः',
  'अमुष्य','अमुयोः','अमीषाम्',
  'अमुष्मिन्','अमुयोः','अमीषु',
]);

SPECIAL_STEMS['दिव्|M'] = makeGrid([
  'द्यौः','द्यावौ','द्यावः',
  'द्यावम्','द्यावौ','द्यून्',
  'द्युवा','द्युभ्याम्','द्युभिः',
  'द्युवे','द्युभ्याम्','द्युभ्यः',
  'द्युवः','द्युभ्याम्','द्युभ्यः',
  'द्युवः','द्युवोः','द्युवाम्',
  'द्युवि','द्युवोः','द्युषु',
]);

SPECIAL_STEMS['अस्मद्|M'] = SPECIAL_STEMS['अस्मद्|F'] = SPECIAL_STEMS['अस्मद्|N'] = makeGrid([
  'अहम्','आवाम्','वयम्',
  'माम्','आवाम्','अस्मान्',
  'मया','आवाभ्याम्','अस्माभिः',
  'मह्यम्','आवाभ्याम्','अस्मभ्यम्',
  'मत्','आवाभ्याम्','अस्मत्',
  'मम','आवयोः','अस्माकम्',
  'मयि','आवयोः','अस्मासु',
]);

SPECIAL_STEMS['युष्मद्|M'] = SPECIAL_STEMS['युष्मद्|F'] = SPECIAL_STEMS['युष्मद्|N'] = makeGrid([
  'त्वम्','युवाम्','यूयम्',
  'त्वाम्','युवाम्','युष्मान्',
  'त्वया','युवाभ्याम्','युष्माभिः',
  'तुभ्यम्','युवाभ्याम्','युष्मभ्यम्',
  'त्वत्','युवाभ्याम्','युष्मत्',
  'तव','युवयोः','युष्माकम्',
  'त्वयि','युवयोः','युष्मासु',
]);

SPECIAL_STEMS['तद्|M'] = makeGrid([
  'सः','तौ','ते',
  'तम्','तौ','तान्',
  'तेन','ताभ्याम्','तैः',
  'तस्मै','ताभ्याम्','तेभ्यः',
  'तस्मात्','ताभ्याम्','तेभ्यः',
  'तस्य','तयोः','तेषाम्',
  'तस्मिन्','तयोः','तेषु',
]);
SPECIAL_STEMS['तद्|F'] = makeGrid([
  'सा','ते','ताः',
  'ताम्','ते','ताः',
  'तया','ताभ्याम्','ताभिः',
  'तस्यै','ताभ्याम्','ताभ्यः',
  'तस्याः','ताभ्याम्','ताभ्यः',
  'तस्याः','तयोः','तासाम्',
  'तस्याम्','तयोः','तासु',
]);
SPECIAL_STEMS['तद्|N'] = makeGrid([
  'तद्','ते','तानि',
  'तद्','ते','तानि',
  'तेन','ताभ्याम्','तैः',
  'तस्मै','ताभ्याम्','तेभ्यः',
  'तस्मात्','ताभ्याम्','तेभ्यः',
  'तस्य','तयोः','तेषाम्',
  'तस्मिन्','तयोः','तेषु',
]);

SPECIAL_STEMS['किम्|M'] = makeGrid([
  'कः','कौ','के',
  'कम्','कौ','कान्',
  'केन','काभ्याम्','कैः',
  'कस्मै','काभ्याम्','केभ्यः',
  'कस्मात्','काभ्याम्','केभ्यः',
  'कस्य','कयोः','केषाम्',
  'कस्मिन्','कयोः','केषु',
]);
SPECIAL_STEMS['किम्|F'] = makeGrid([
  'का','के','काः',
  'काम्','के','काः',
  'कया','काभ्याम्','काभिः',
  'कस्यै','काभ्याम्','काभ्यः',
  'कस्याः','काभ्याम्','काभ्यः',
  'कस्याः','कयोः','कासाम्',
  'कस्याम्','कयोः','कासु',
]);
SPECIAL_STEMS['किम्|N'] = makeGrid([
  'किम्','के','कानि',
  'किम्','के','कानि',
  'केन','काभ्याम्','कैः',
  'कस्मै','काभ्याम्','केभ्यः',
  'कस्मात्','काभ्याम्','केभ्यः',
  'कस्य','कयोः','केषाम्',
  'कस्मिन्','कयोः','केषु',
]);

SPECIAL_STEMS['एतद्|M'] = makeGrid([
  'एषः','एतौ','एते',
  'एतम्','एतौ','एतान्',
  'एतेन','एताभ्याम्','एतैः',
  'एतस्मै','एताभ्याम्','एतेभ्यः',
  'एतस्मात्','एताभ्याम्','एतेभ्यः',
  'एतस्य','एतयोः','एतेषाम्',
  'एतस्मिन्','एतयोः','एतेषु',
]);
SPECIAL_STEMS['एतद्|F'] = makeGrid([
  'एषा','एते','एताः',
  'एताम्','एते','एताः',
  'एतया','एताभ्याम्','एताभिः',
  'एतस्यै','एताभ्याम्','एताभ्यः',
  'एतस्याः','एताभ्याम्','एताभ्यः',
  'एतस्याः','एतयोः','एतासाम्',
  'एतस्याम्','एतयोः','एतासु',
]);
SPECIAL_STEMS['एतद्|N'] = makeGrid([
  'एतद्','एते','एतानि',
  'एतद्','एते','एतानि',
  'एतेन','एताभ्याम्','एतैः',
  'एतस्मै','एताभ्याम्','एतेभ्यः',
  'एतस्मात्','एताभ्याम्','एतेभ्यः',
  'एतस्य','एतयोः','एतेषाम्',
  'एतस्मिन्','एतयोः','एतेषु',
]);

SPECIAL_STEMS['इदम्|M'] = makeGrid([
  'अयम्','इमौ','इमे',
  'इमम्','इमौ','इमान्',
  'अनेन','आभ्याम्','एभिः',
  'अस्मै','आभ्याम्','एभ्यः',
  'अस्मात्','आभ्याम्','एभ्यः',
  'अस्य','अनयोः','एषाम्',
  'अस्मिन्','अनयोः','एषु',
]);
SPECIAL_STEMS['इदम्|F'] = makeGrid([
  'इयम्','इमे','इमाः',
  'इमाम्','इमे','इमाः',
  'अनया','आभ्याम्','आभिः',
  'अस्यै','आभ्याम्','आभ्यः',
  'अस्याः','आभ्याम्','आभ्यः',
  'अस्याः','अनयोः','आसाम्',
  'अस्याम्','अनयोः','आसु',
]);
SPECIAL_STEMS['इदम्|N'] = makeGrid([
  'इदम्','इमे','इमानि',
  'इदम्','इमे','इमानि',
  'अनेन','आभ्याम्','एभिः',
  'अस्मै','आभ्याम्','एभ्यः',
  'अस्मात्','आभ्याम्','एभ्यः',
  'अस्य','अनयोः','एषाम्',
  'अस्मिन्','अनयोः','एषु',
]);

SPECIAL_STEMS['सर्व|M'] = makeGrid([
  'सर्वः','सर्वौ','सर्वे',
  'सर्वम्','सर्वौ','सर्वान्',
  'सर्वेण','सर्वाभ्याम्','सर्वैः',
  'सर्वस्मै','सर्वाभ्याम्','सर्वेभ्यः',
  'सर्वस्मात्','सर्वाभ्याम्','सर्वेभ्यः',
  'सर्वस्य','सर्वयोः','सर्वेषाम्',
  'सर्वस्मिन्','सर्वयोः','सर्वेषु',
]);
SPECIAL_STEMS['सर्व|N'] = makeGrid([
  'सर्वम्','सर्वे','सर्वाणि',
  'सर्वम्','सर्वे','सर्वाणि',
  'सर्वेण','सर्वाभ्याम्','सर्वैः',
  'सर्वस्मै','सर्वाभ्याम्','सर्वेभ्यः',
  'सर्वस्मात्','सर्वाभ्याम्','सर्वेभ्यः',
  'सर्वस्य','सर्वयोः','सर्वेषाम्',
  'सर्वस्मिन्','सर्वयोः','सर्वेषु',
]);

SPECIAL_STEMS['द्वि|M'] = makeGrid([
  '—','द्वौ','—',
  '—','द्वौ','—',
  '—','द्वाभ्याम्','—',
  '—','द्वाभ्याम्','—',
  '—','द्वाभ्याम्','—',
  '—','द्वयोः','—',
  '—','द्वयोः','—',
]);
SPECIAL_STEMS['द्वि|F'] = SPECIAL_STEMS['द्वि|N'] = makeGrid([
  '—','द्वे','—',
  '—','द्वे','—',
  '—','द्वाभ्याम्','—',
  '—','द्वाभ्याम्','—',
  '—','द्वाभ्याम्','—',
  '—','द्वयोः','—',
  '—','द्वयोः','—',
]);
SPECIAL_STEMS['त्रि|M'] = makeGrid([
  '—','—','त्रयः',
  '—','—','त्रीन्',
  '—','—','तिसृभिः',
  '—','—','तिसृभ्यः',
  '—','—','तिसृभ्यः',
  '—','—','त्रयाणाम्',
  '—','—','त्रिषु',
]);
SPECIAL_STEMS['त्रि|F'] = makeGrid([
  '—','—','तिस्रः',
  '—','—','तिस्रः',
  '—','—','तिसृभिः',
  '—','—','तिसृभ्यः',
  '—','—','तिसृभ्यः',
  '—','—','तिसृणाम्',
  '—','—','तिसृषु',
]);
SPECIAL_STEMS['त्रि|N'] = makeGrid([
  '—','—','त्रीणि',
  '—','—','त्रीणि',
  '—','—','तिसृभिः',
  '—','—','तिसृभ्यः',
  '—','—','तिसृभ्यः',
  '—','—','त्रयाणाम्',
  '—','—','त्रिषु',
]);
SPECIAL_STEMS['चतुर्|M'] = makeGrid([
  '—','—','चत्वारः',
  '—','—','चतुरः',
  '—','—','चतुर्भिः',
  '—','—','चतुर्भ्यः',
  '—','—','चतुर्भ्यः',
  '—','—','चतुर्णाम्',
  '—','—','चतुर्षु',
]);
SPECIAL_STEMS['चतुर्|F'] = makeGrid([
  '—','—','चतस्रः',
  '—','—','चतस्रः',
  '—','—','चतसृभिः',
  '—','—','चतसृभ्यः',
  '—','—','चतसृभ्यः',
  '—','—','चतसृणाम्',
  '—','—','चतसृषु',
]);
SPECIAL_STEMS['चतुर्|N'] = makeGrid([
  '—','—','चत्वारि',
  '—','—','चत्वारि',
  '—','—','चतुर्भिः',
  '—','—','चतुर्भ्यः',
  '—','—','चतुर्भ्यः',
  '—','—','चतुर्णाम्',
  '—','—','चतुर्षु',
]);
SPECIAL_STEMS['पञ्चन्|M'] = SPECIAL_STEMS['पञ्चन्|F'] = SPECIAL_STEMS['पञ्चन्|N'] = makeGrid([
  '—','—','पञ्च',
  '—','—','पञ्च',
  '—','—','पञ्चभिः',
  '—','—','पञ्चभ्यः',
  '—','—','पञ्चभ्यः',
  '—','—','पञ्चानाम्',
  '—','—','पञ्चसु',
]);
SPECIAL_STEMS['षष्|M'] = SPECIAL_STEMS['षष्|F'] = SPECIAL_STEMS['षष्|N'] = makeGrid([
  '—','—','षट्',
  '—','—','षट्',
  '—','—','षड्भिः',
  '—','—','षड्भ्यः',
  '—','—','षड्भ्यः',
  '—','—','षण्णाम्',
  '—','—','षट्सु',
]);

// ── Stem class detection ───────────────────────────────────────────────────────
function stemClass(stem, linga) {
  const key = stem + '|' + linga;
  if (SPECIAL_STEMS[key]) return 'special';

  const tokens = tok(stem);
  if (!tokens.length) throw new Error('Empty stem');
  const last = tokens[tokens.length - 1];

  if (last.hasHalant) {
    const c = last.cons;
    if (c === 'न') {
      if (tokens.length >= 2 && tokens[tokens.length - 2].vowel === 'इ') return 'in_masc';
      return 'n_stem';
    }
    if (c === 'त') {
      if (linga === 'M' && tokens.length >= 2 && tokens[tokens.length - 2].vowel === 'अ') return 'at_masc';
      return 't_stem';
    }
    if (c === 'द') return 'd_stem';
    if (c === 'स') {
      if (tokens.length >= 2 && tokens[tokens.length - 2].cons === 'व') return 'vas_stem';
      if (linga === 'N') return 's_neut';
      return 's_masc';
    }
    if (c === 'ज' && (linga === 'M' || linga === 'F')) return 'jaj_hal';
    if (c === 'ह' && (linga === 'M' || linga === 'F')) return 'haj_hal';
    if (c === 'च' && (linga === 'M' || linga === 'F')) return 'caj_hal';
    if (c === 'श' && (linga === 'M' || linga === 'F')) return 'sha_hal';
    if (c === 'ष' && (linga === 'M' || linga === 'F')) return 'sha_satva_hal';
    if (c === 'प' && (linga === 'M' || linga === 'F')) return 'paj_hal';
    if (c === 'र') return 'r_hal';
    if (c === 'ण') return 'na_retro_hal';
    throw new Error('Unsupported consonant-final stem: ' + c);
  }

  const v = last.vowel;
  if (v === 'अ') {
    if (linga === 'M') return 'a_masc';
    if (linga === 'N') return 'a_neut';
  }
  if (v === 'आ' && linga === 'F') return 'aa_fem';
  if (v === 'इ') {
    if (linga === 'M') return 'i_masc';
    if (linga === 'F') return 'i_fem';
    if (linga === 'N') return 'i_neut';
  }
  if (v === 'ई' && linga === 'F') {
    const syllables = tokens.filter(t => t.vowel).length;
    return syllables === 1 ? 'ii_mono' : 'ii_fem';
  }
  if (v === 'उ') {
    if (linga === 'M') return 'u_masc';
    if (linga === 'F') return 'u_fem';
    if (linga === 'N') return 'u_neut';
  }
  if (v === 'ऊ' && linga === 'F') {
    const syllables = tokens.filter(t => t.vowel).length;
    return syllables === 1 ? 'uu_mono' : 'uu_fem';
  }
  if (v === 'ऋ') {
    if (linga === 'M') return 'r_masc';
    if (linga === 'F') return 'r_fem';
  }
  throw new Error('Unsupported stem class: final vowel=' + v + ' linga=' + linga);
}

// ── State-based derivation: each function builds a State and records steps ────

// Helper: wrap a final hardcoded form as a 1-step derivation
function hardcodedResult(form) {
  return {
    form,
    steps: [{ rule: 'traditional', note: 'fully irregular — paradigm from tradition', form }]
  };
}

// ── a-masculine: rules per position (suffix part that attaches to stem) ───────
// For a-stems, what appears after the stem is always a mātrā or consonant cluster
// because of vowel sandhi at the junction. We record 3 steps:
//   1. Suffix added (raw upadeśa)
//   2. IT-lopa (if applicable)
//   3. Sandhi/substitution at junction → final form
const A_MASC_RULES = {
  '1,1': ['8.2.66',    'ससजुषो रुः: स्→विसर्ग', VISARGA],
  '1,2': ['6.1.88', 'वृद्धिरेचि: अ+औ→औ (ekādeśa — औ is एच् not एङ्)', 'ौ'],
  '1,3': ['6.1.101+8.2.66', 'अ+अस्→ाः', 'ाः'],
  '2,1': ['4.1.2',     'अम् (acc sg)', 'म्'],
  '2,2': ['6.1.88',    'वृद्धिरेचि: अ+औ→औ (ekādeśa — औ is एच् not एङ्)', 'ौ'],
  '2,3': ['7.1.54+6.4.3', 'नुम्+अस्→ान्', 'ान्'],
  '3,1': [null,         null, null],  // computed below (ṇatva-sensitive)
  '3,2': ['7.3.102',   'अ+भ्याम्→ाभ्याम् (a-stem bhādi)', 'ाभ्याम्'],
  '3,3': ['6.1.87+8.2.66', 'अ+भिस्→ैः', 'ैः'],
  '4,1': ['7.1.13+6.1.78', 'ङे→य; अ+य→āय', 'ाय'],
  '4,2': ['7.3.102',   'अ+भ्याम्→ाभ्याम् (a-stem bhādi)', 'ाभ्याम्'],
  '4,3': ['6.1.87+8.2.66', 'अ+भ्यस्→ेभ्यः', 'ेभ्यः'],
  '5,1': ['5.4.44',    'ङसि→ात् (abl sg)', 'ात्'],
  '5,2': ['7.3.102',   'अ+भ्याम्→ाभ्याम् (a-stem bhādi)', 'ाभ्याम्'],
  '5,3': ['6.1.87+8.2.66', 'अ+भ्यस्→ेभ्यः', 'ेभ्यः'],
  '6,1': ['7.1.12',    'टाङसिङसामिनात्स्याः: ङस्→स्य (gen sg a-stem)', 'स्य'],
  '6,2': ['7.1.15',    'ओस्→योः', 'योः'],
  '6,3': [null,         null, null],  // ṇatva-sensitive
  '7,1': ['6.1.87',    'अ+ङि→ए (loc sg)', 'े'],
  '7,2': ['7.1.15',    'ओस्→योः', 'योः'],
  '7,3': ['7.3.103',   'सु→ेषु (loc pl)', 'ेषु'],
};

function deriveAMascState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const natva = hasNatvaTrigger(stem);
  const steps = [];
  const raw = RAW_SUP[pos];
  const operative = OPERATIVE_SUP[pos];
  const vibName = VIB_NAMES_EN[vib];
  const vacName = VAC_NAMES_EN[vac];
  const b = aBase(stem); // stem with final अ stripped

  // Step 1: suffix addition (4.1.2)
  steps.push({ rule: '4.1.2', note: `स्वौजसमौट्…: ${raw} (${vibName} ${vacName})`, form: stem + '+' + raw });

  // Step 2: IT detection (if raw !== operative)
  if (raw !== operative) {
    const [itRule, itNote] = itRuleForSup(raw);
    steps.push({ rule: itRule, note: itNote, form: stem + '+' + raw });
    steps.push({ rule: '1.3.9', note: `तस्य लोपः: IT stripped → ${operative}`, form: stem + '+' + operative });
  }

  // Steps 3+: sandhi/substitution → final form
  if (pos === '1,1') {
    // nom sg: सुँ → स् (IT-lopa done above), then 8.2.66 chain
    appendVisargaChain(steps, stem + '+स्', stem + 'ः');
    return { form: stem + 'ः', steps };
  }

  if (pos === '1,3') {
    // nom pl: जस् → अस् (IT-lopa done), then 6.1.101: अ+अ→आ, then 8.2.66 chain
    // Final form is stem + 'ाः' (अ of stem merges with अ of अस्)
    const f13 = stem + 'ाः';
    steps.push({ rule: '6.1.101', note: 'अकः सवर्णे दीर्घः: अ+अ→आ (a-stem nom pl)', form: stem + 'ा+स्' });
    appendVisargaChain(steps, stem + 'ा+स्', f13);
    return { form: f13, steps };
  }

  if (pos === '3,3') {
    // inst pl: भिस् → ऐस् (7.1.9), then 8.2.66 chain
    const f33 = stem + 'ैः';
    steps.push({ rule: '7.1.9', note: 'अतो भिसः: भिस्→ऐस् (a-stem inst pl)', form: stem + 'ै+स्' });
    appendVisargaChain(steps, stem + 'ै+स्', f33);
    return { form: f33, steps };
  }

  if (pos === '4,3' || pos === '5,3') {
    // dat/abl pl: 6.1.87 आद्गुणः: अ+भ्यस्→ेभ्यस्, then 8.2.66 chain
    const f = stem + 'ेभ्यः';
    steps.push({ rule: '6.1.87', note: 'आद्गुणः: अ+भ्यस्→ेभ्यस् (a-stem dat/abl pl)', form: stem + 'ेभ्य+स्' });
    appendVisargaChain(steps, stem + 'ेभ्य+स्', f);
    return { form: f, steps };
  }

  if (pos === '5,1') {
    // ङसि also has anunāsika-इ as IT (1.3.2) — show it explicitly
    steps.push({ rule: '1.3.2', note: 'उपदेशेऽजनुनासिक इत्: anunāsika-इ in ङसि is also IT', form: stem + '+अस्' });
    steps.push({ rule: '1.3.9', note: 'तस्य लोपः: anunāsika-इ dropped → operative अस्', form: stem + '+अस्' });
    // 7.1.12: entire operative (ङसि-identified suffix) → आत् (per 1.1.55 anekāl-śit)
    steps.push({ rule: '1.1.55', note: 'अनेकाल्शित्सर्वस्य: आत् has multiple phonemes → sarvādeśa', form: stem + '+आत्' });
    steps.push({ rule: '7.1.12', note: 'टाङसिङसामिनात्स्याः: ङसि-suffix → आत् (abl sg)', form: stem + '+आत्' });
    // 6.1.101: stem-final अ + suffix-initial आ → आ (savarṇa dīrgha)
    steps.push({ rule: '6.1.101', note: 'अकः सवर्णे दीर्घः: stem अ + आ → आ (savarṇa dīrgha)', form: stem + 'ात्' });
    // 8.2.39: pada-final jash: त् → द् at word-end
    steps.push({ rule: '8.2.39', note: 'झलां जशोऽन्ते: pada-final त् → द् (jash-tva)', form: stem + 'ाद्' });
    // 8.4.56: वाऽवसाने — optional khara in pause: द् → त· (giving standard pausa form)
    const finalForm = stem + 'ात्';
    steps.push({ rule: '8.4.56', note: 'वाऽवसाने: optional khara in avasāna → द्→त् (pausa form)', form: finalForm });
    return { form: finalForm, steps };
  }

  if (pos === '6,2' || pos === '7,2') {
    // gen/loc du both use ओस् — identical derivation → रामयोः
    // 7.3.104: अ→ए before ओस्; 6.1.78: ए+ओ→यो; then 8.2.66 visarga chain
    const fdu = stem + 'योः';
    steps.push({ rule: '7.3.104', note: 'ओसि च: अ→ए (a-stem before ओस्)', form: stem + 'े+ओस्' });
    steps.push({ rule: '6.1.78',  note: 'एचोऽयवायावः: ए→अय् before vowel → यो+स्', form: stem + 'यो+स्' });
    appendVisargaChain(steps, stem + 'यो+स्', fdu);
    return { form: fdu, steps };
  }

  if (pos === '3,1') {
    // टा operative = आ (IT-lopa of ट् already done by addSup above)
    // 1.1.55: anekāl-śit sarvādeśa — इन replaces the entire टा (multiple phonemes)
    steps.push({ rule: '1.1.55', note: 'अनेकाल्शित्सर्वस्य: इन replaces entire टा → sarvādeśa', form: stem + '+आ' });
    // 7.1.12: टाङसिङसामिनात्स्याः — टा → इन (for a-stems, inst sg)
    steps.push({ rule: '7.1.12', note: 'टाङसिङसामिनात्स्याः: टा → इन (a-stem inst sg)', form: stem + '+इन' });
    // 6.1.87: आद्गुणः — stem-final अ + suffix-initial इ → guṇa ए (ekādeśa)
    steps.push({ rule: '6.1.87', note: 'आद्गुणः: अ+इ→ए (guṇa ekādeśa — stem अ + इन → एन)', form: stem + 'े+न' });
    // 8.4.2: ṇatva (if stem has र/ष/ऋ trigger)
    const finalForm = stem + (natva ? 'ेण' : 'ेन');
    if (natva) steps.push({ rule: '8.4.2', note: 'अट्कुप्वाङ्नुम्व्यवायेऽपि: न→ण (ṇatva — र in stem)', form: finalForm });
    return { form: finalForm, steps };
  }

  if (pos === '6,3') {
    // 1.4.14: सुप्तिङन्तं पदम् — the word (stem+sup) gets pada-samjna here
    steps.push({ rule: '1.4.14', note: 'सुप्तिङन्तं पदम्: पदसंज्ञा — stem+sup is now a pada', form: aBase(stem) + '+आम्' });
    // 7.1.54: ह्रस्वनद्यापो नुट् — nuT inserted before आम् after short-vowel stem
    const afterNut = aBase(stem) + '+नुट्+आम्';
    steps.push({ rule: '7.1.54', note: 'ह्रस्वनद्यापो नुट्: नुट् āgama before आम् (short-vowel stem)', form: afterNut });
    // 1.1.46: आद्यन्तौ टकितौ — ṭit agama attaches to the BEGINNING of the suffix
    steps.push({ rule: '1.1.46', note: 'आद्यन्तौ टकितौ: ṭit-āgama (नुट्) goes to the beginning of आम् → न्+आम्', form: aBase(stem) + '+न्+आम्' });
    // 1.3.3 + 1.3.9: ट् of नुट् is IT → drops
    steps.push({ rule: '1.3.3',  note: 'हलन्त्यम्: final ट् of नुट् is IT', form: aBase(stem) + '+न्+आम्' });
    steps.push({ rule: '1.3.9',  note: 'तस्य लोपः: ट् (IT) + उ (ucc.) dropped — न् remains', form: aBase(stem) + '+न्+आम्' });
    // 6.4.3: नामि — dīrgha of aṅga before नाम्
    const afterDirgha = stem + 'ा+नाम्';
    steps.push({ rule: '6.4.3',  note: 'नामि: aṅga-vowel gets dīrgha (अ→आ) before नाम्', form: afterDirgha });
    // 8.4.2: ṇatva if र/ष/ऋ in stem
    const finalForm = stem + (natva ? 'ाणाम्' : 'ानाम्');
    if (natva) {
      steps.push({ rule: '8.4.2', note: 'अट्कुप्वाङ्नुम्व्यवायेऽपि: न→ण (ṇatva — र triggers)', form: finalForm });
    }
    return { form: finalForm, steps };
  }

  // All other positions: single sandhi/substitution step
  const [r, n, s] = A_MASC_RULES[pos] || ['4.1.2', '', operative];
  const finalForm = stem + s;
  if (pos === '6,1') {
    // gen sg: ङस् → अस् (IT-lopa done), then 7.1.12: ङस्→स्य
    // Show intermediate form राम+स्य before final junction
    steps.push({ rule: '7.1.12', note: 'टाङसिङसामिनात्स्याः: ङस्-operative → स्य (gen sg)', form: stem + '+स्य' });
    const finalForm = stem + 'स्य';
    steps.push({ rule: 'junction', note: 'stem + स्य → रामस्य (consonant-initial suffix, direct join)', form: finalForm });
    return { form: finalForm, steps };
  }

  if (pos === '2,1') {
    // acc sg: अम् (no IT); 6.1.107 अमि पूर्वः: stem-final अ + suffix-initial अ → पूर्वरूप (single अ)
    steps.push({ rule: '6.1.107', note: 'अमि पूर्वः: पूर्वरूपैकादेशः — stem अ + अम् → अम् (purvarupaekadesha)', form: finalForm });
    return { form: finalForm, steps };
  }

  if (pos === '4,1') {
    // dat sg: ङे → ए (IT-lopa done above); then 7.1.13 ङेर्यः: ए→य; then 6.1.78: अ+य→āय
    steps.push({ rule: '7.1.13', note: 'ङेर्यः: ए → य (dat sg ङे replaced by य)', form: stem + '+य' });
    steps.push({ rule: '6.1.78', note: 'एचोऽयवायावः: stem अ + य → āय', form: finalForm });
    return { form: finalForm, steps };
  }

  if (pos === '2,3') {
    // acc pl: 7.1.54 नुम् āgama; 1.1.46/1.3.3/1.3.9 IT-lopa → न्; 6.4.3 dīrgha → आन्
    steps.push({ rule: '7.1.54', note: 'ह्रस्वनद्यापो नुट्: नुट् āgama inserted before अस् (acc pl)', form: b + '+नुट्+अस्' });
    steps.push({ rule: '6.4.3',  note: 'नामि: aṅga-vowel gets dīrgha (अ→आ) before नाम् / acc pl', form: stem + 'ा+न्+अस्' });
    steps.push({ rule: '8.2.66', note: 'ससजुषो रुः: स्→रुँ', form: stem + 'ान्+रुँ' });
    steps.push({ rule: '8.3.15', note: 'खरवसानयोर्विसर्जनीयः: रुँ→् (halanta, pada-final)', form: stem + 'ान्' });
    return { form: finalForm, steps };
  }

  steps.push({ rule: r, note: n, form: finalForm });
  return { form: finalForm, steps };
}

// ── a-neuter: same approach ───────────────────────────────────────────────────
const A_NEUT_RULES = {
  '1,1': ['7.1.24',    'नपुंसके: अम् (nom sg)', 'म्'],
  '1,2': ['7.1.24+6.1.87', 'nom du neuter: ए', 'े'],
  '1,3': ['7.1.20',    'शी: nom pl neuter: ानि', 'ानि'],
  '2,1': ['7.1.24',    'नपुंसके: अम् (acc sg)', 'म्'],
  '2,2': ['7.1.24+6.1.87', 'acc du neuter: ए', 'े'],
  '2,3': ['7.1.20',    'शी: acc pl neuter: ानि', 'ानि'],
  '3,1': ['7.3.120',   'टा→ेन (inst sg a-neut)', 'ेन'],
  '3,2': ['7.3.102',   'अ+भ्याम्→ाभ्याम् (a-stem bhādi)', 'ाभ्याम्'],
  '3,3': ['6.1.87+8.2.66', 'अ+भिस्→ैः', 'ैः'],
  '4,1': ['7.1.13+6.1.78', 'ङे→य; अ+य→āय', 'ाय'],
  '4,2': ['7.3.102',   'अ+भ्याम्→ाभ्याम् (a-stem bhādi)', 'ाभ्याम्'],
  '4,3': ['6.1.87+8.2.66', 'अ+भ्यस्→ेभ्यः', 'ेभ्यः'],
  '5,1': ['5.4.44',    'ङसि→ात् (abl sg)', 'ात्'],
  '5,2': ['7.3.102',   'अ+भ्याम्→ाभ्याम् (a-stem bhādi)', 'ाभ्याम्'],
  '5,3': ['6.1.87+8.2.66', 'अ+भ्यस्→ेभ्यः', 'ेभ्यः'],
  '6,1': ['7.1.12',    'टाङसिङसामिनात्स्याः: ङस्→स्य (gen sg a-stem)', 'स्य'],
  '6,2': ['7.1.15',    'ओस्→योः', 'योः'],
  '6,3': [null,         null, null],  // ṇatva-sensitive
  '7,1': ['6.1.87',    'अ+ङि→ए (loc sg)', 'े'],
  '7,2': ['7.1.15',    'ओस्→योः', 'योः'],
  '7,3': ['7.3.103',   'सु→ेषु (loc pl)', 'ेषु'],
};

function deriveANeutState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const natva = hasNatvaTrigger(stem);
  const steps = [];
  const raw = RAW_SUP[pos];
  const operative = OPERATIVE_SUP[pos];
  const vibName = VIB_NAMES_EN[vib];
  const vacName = VAC_NAMES_EN[vac];
  const b = aBase(stem); // stem with final अ stripped

  // Step 1: suffix addition (4.1.2)
  steps.push({ rule: '4.1.2', note: `स्वौजसमौट्…: ${raw} (${vibName} ${vacName})`, form: stem + '+' + raw });

  // Step 2: IT detection (if raw !== operative)
  if (raw !== operative) {
    const [itRule, itNote] = itRuleForSup(raw);
    steps.push({ rule: itRule, note: itNote, form: stem + '+' + raw });
    steps.push({ rule: '1.3.9', note: `तस्य लोपः: IT stripped → ${operative}`, form: stem + '+' + operative });
  }

  // Steps 3+: sandhi/substitution → final form

  if (pos === '3,3') {
    // inst pl: भिस् stays, 7.1.9: भिस्→ऐस्, then 8.2.66 chain
    const f33n = stem + 'ैः';
    steps.push({ rule: '7.1.9', note: 'अतो भिसः: भिस्→ऐस् (a-neut inst pl)', form: stem + 'ै+स्' });
    appendVisargaChain(steps, stem + 'ै+स्', f33n);
    return { form: f33n, steps };
  }

  if (pos === '4,3' || pos === '5,3') {
    // dat/abl pl: भ्यस् stays, 6.1.87: अ+भ्यस्→ेभ्यस्, then 8.2.66 chain
    const fn = stem + 'ेभ्यः';
    steps.push({ rule: '6.1.87', note: 'आद्गुणः: अ+भ्यस्→ेभ्यस् (a-neut dat/abl pl)', form: stem + 'ेभ्य+स्' });
    appendVisargaChain(steps, stem + 'ेभ्य+स्', fn);
    return { form: fn, steps };
  }

  if (pos === '5,1') {
    steps.push({ rule: '7.1.12', note: 'टाङसिङसामिनात्स्याः: ङसि→आत् (abl sg)', form: stem + 'ात्' });
    return { form: stem + 'ात्', steps };
  }

  if (pos === '6,2' || pos === '7,2') {
    // gen/loc du both use ओस् — identical derivation → फलयोः
    const fdu = stem + 'योः';
    steps.push({ rule: '7.3.104', note: 'ओसि च: अ→ए (a-neut before ओस्)', form: stem + 'े+ओस्' });
    steps.push({ rule: '6.1.78',  note: 'एचोऽयवायावः: ए→अय् before vowel → यो+स्', form: stem + 'यो+स्' });
    appendVisargaChain(steps, stem + 'यो+स्', fdu);
    return { form: fdu, steps };
  }

  if (pos === '6,3') {
    steps.push({ rule: '1.4.14', note: 'सुप्तिङन्तं पदम्: पदसंज्ञा — stem+sup is now a pada', form: aBase(stem) + '+आम्' });
    steps.push({ rule: '7.1.54', note: 'ह्रस्वनद्यापो नुट्: नुट् āgama before आम् (short-vowel stem)', form: aBase(stem) + '+नुट्+आम्' });
    steps.push({ rule: '1.1.46', note: 'आद्यन्तौ टकितौ: ṭit-āgama goes to beginning of आम् → न्+आम्', form: aBase(stem) + '+न्+आम्' });
    steps.push({ rule: '1.3.3',  note: 'हलन्त्यम्: final ट् of नुट् is IT', form: aBase(stem) + '+न्+आम्' });
    steps.push({ rule: '1.3.9',  note: 'तस्य लोपः: ट् (IT) + उ (ucc.) dropped — न् remains', form: aBase(stem) + '+न्+आम्' });
    steps.push({ rule: '6.4.3',  note: 'नामि: aṅga-vowel gets dīrgha (अ→आ) before नाम्', form: stem + 'ा+नाम्' });
    const finalForm = stem + (natva ? 'ाणाम्' : 'ानाम्');
    if (natva) steps.push({ rule: '8.4.2', note: 'अट्कुप्वाङ्नुम्व्यवायेऽपि: न→ण (ṇatva — र triggers)', form: finalForm });
    return { form: finalForm, steps };
  }

  // All other positions: single sandhi/substitution step
  const [r, n, s] = A_NEUT_RULES[pos] || ['4.1.2', '', operative];
  const finalForm = stem + s;

  if (pos === '1,1' || pos === '2,1') {
    // nom/acc sg neuter: 7.1.24 नपुंसकाच्च: सुँ/अम् → अम् (suffix substituted);
    // then 6.1.107 अमि पूर्वः: stem-final अ + अम् → पूर्वरूप → फलम्
    steps.push({ rule: '7.1.24', note: 'नपुंसकाच्च: nom/acc sg suffix → अम् (neuter substitution)', form: stem + '+अम्' });
    steps.push({ rule: '6.1.107', note: 'अमि पूर्वः: पूर्वरूपैकादेशः — stem अ + अम् → अम्', form: finalForm });
    return { form: finalForm, steps };
  }

  if (pos === '1,2' || pos === '2,2') {
    // nom/acc du neuter: 7.1.24 नपुंसकाच्च: औ → शी (substitute ई); 6.1.87: अ+ई→ए
    steps.push({ rule: '7.1.24', note: 'नपुंसकाच्च: nom/acc du औ → शी (suffix ई substituted)', form: stem + '+ई' });
    steps.push({ rule: '6.1.87', note: 'आद्गुणः: अ+ई→ए (guṇa ekādeśa)', form: finalForm });
    return { form: finalForm, steps };
  }

  if (pos === '4,1') {
    // dat sg: same as a-masc — 7.1.13 ङेर्यः: ए→य; 6.1.78: अ+य→āय
    steps.push({ rule: '7.1.13', note: 'ङेर्यः: ए → य (dat sg ङे replaced by य)', form: stem + '+य' });
    steps.push({ rule: '6.1.78', note: 'एचोऽयवायावः: stem अ + य → āय', form: finalForm });
    return { form: finalForm, steps };
  }

  steps.push({ rule: r, note: n, form: finalForm });
  return { form: finalForm, steps };
}

// ── ā-feminine derivation with steps ─────────────────────────────────────────
function deriveAAFemState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  // b = base without the final ā vowel (for forms that replace/drop it)
  const b = stem.endsWith('\u093E') ? stem.slice(0, -1) : stem;
  const steps = [];

  // ── nom sg (1,1) ──────────────────────────────────────────────────────────
  // सीता + सुँ → (1.3.2) ँ IT → (1.3.9) → स् → (6.1.68) apṛkta-hal lopa → सीता
  if (pos === '1,1') {
    const finalForm = stem;
    steps.push({ rule: '4.1.2',  note: 'स्वौजसमौट्…: सुँ (nom sg)',                                              form: stem + '+सुँ' });
    steps.push({ rule: '1.3.2',  note: 'उपदेशेऽजनुनासिक इत्: ँ in सुँ → अनुनासिक-उँकार इत्संज्ञा',              form: stem + '+सुँ' });
    steps.push({ rule: '1.3.9',  note: 'तस्य लोपः: IT (ँ) लोपः → स्',                                            form: stem + '+स्' });
    steps.push({ rule: '6.1.68', note: 'हल्ङ्याब्भ्यो दीर्घात् सुतिस्यपृक्तं हल्: अपृक्त-सकारस्य लोपः',        form: finalForm });
    return { form: finalForm, steps };
  }

  // ── nom/acc du (1,2 and 2,2) ──────────────────────────────────────────────
  // सीता + औ/औट् → (7.1.18) औ→शी (āp-substitution) → (1.3.8+1.3.9) श् IT-lopa →
  //   ई → (6.1.105) niṣedha of 6.1.102 → (6.1.87) ā+ī → ए → सीते
  if (pos === '1,2' || pos === '2,2') {
    const finalForm = b + 'े';
    const rawSuff = pos === '2,2' ? 'औट्' : 'औ';
    const vibLabel = pos === '1,2' ? 'nom' : 'acc';
    steps.push({ rule: '4.1.2',  note: `स्वौजसमौट्…: ${rawSuff} (${vibLabel} du)`,                                form: stem + '+' + rawSuff });
    if (pos === '2,2') {
      steps.push({ rule: '1.3.7', note: 'चुटू: ट् of औट् is IT (टु-वर्ग)',                                        form: stem + '+औट्' });
      steps.push({ rule: '1.3.9', note: 'तस्य लोपः: IT (ट्) लोपः → औ',                                           form: stem + '+औ' });
    }
    steps.push({ rule: '7.1.18', note: 'औङ आपः: आप्-stem nom/acc du औ → शी (1.1.55 सर्वादेशः)',                  form: stem + '+शी' });
    steps.push({ rule: '1.3.8',  note: 'लशकु अतद्धिते: श् of शी is IT',                                          form: stem + '+शी' });
    steps.push({ rule: '1.3.9',  note: 'तस्य लोपः: IT (श्) लोपः → ई',                                            form: stem + '+ई' });
    steps.push({ rule: '6.1.105', note: 'दीर्घाज्जसि च: आप्-stem + ई (शी) — पूर्वसवर्णदीर्घः (6.1.102) निषिद्धः', form: stem + '+ई' });
    steps.push({ rule: '6.1.87', note: 'आद्गुणः: ā + ई → ए',                                                      form: finalForm });
    return { form: finalForm, steps };
  }

  // ── nom/acc pl (1,3 and 2,3) ──────────────────────────────────────────────
  // सीता + जस्/शस् → IT-lopa → अस् → (6.1.105 niṣedha) → (6.1.101) ā+a→ā → visarga chain → सीताः
  if (pos === '1,3' || pos === '2,3') {
    const finalForm = stem + 'ः';
    const rawSuff   = pos === '1,3' ? 'जस्' : 'शस्';
    const vibLabel  = pos === '1,3' ? 'nom' : 'acc';
    const itRule    = pos === '1,3' ? '1.3.7' : '1.3.8';
    const itNote    = pos === '1,3' ? 'चुटू: ज् of जस् is IT (चु-वर्ग)'
                                    : 'लशकु अतद्धिते: श् of शस् is IT';
    steps.push({ rule: '4.1.2',   note: `स्वौजसमौट्…: ${rawSuff} (${vibLabel} pl)`,                               form: stem + '+' + rawSuff });
    steps.push({ rule: itRule,    note: itNote,                                                                     form: stem + '+' + rawSuff });
    steps.push({ rule: '1.3.9',   note: 'तस्य लोपः: IT लोपः → अस्',                                              form: stem + '+अस्' });
    steps.push({ rule: '6.1.105', note: 'दीर्घाज्जसि च: आप्-stem + अस् (जसि) — पूर्वसवर्णदीर्घः (6.1.102) निषिद्धः', form: stem + '+अस्' });
    steps.push({ rule: '6.1.101', note: 'अकः सवर्णे दीर्घः: ā + अ → ā (savarṇa dīrgha)',                         form: stem + '+स्' });
    appendVisargaChain(steps, stem + '+स्', finalForm);
    return { form: finalForm, steps };
  }

  // ── acc sg (2,1) ──────────────────────────────────────────────────────────
  // सीता + अम् → (6.1.107) pūrvarūpaikādeśa ā+a → ā → सीताम्
  if (pos === '2,1') {
    const finalForm = stem + 'म्';
    steps.push({ rule: '4.1.2',   note: 'स्वौजसमौट्…: अम् (acc sg)',                                              form: stem + '+अम्' });
    steps.push({ rule: '6.1.107', note: 'अमि पूर्वः: पूर्वरूपैकादेशः — ā + अ (of अम्) → ā (पूर्वरूपम्)',        form: finalForm });
    return { form: finalForm, steps };
  }

  // ── inst sg (3,1) ─────────────────────────────────────────────────────────
  // सीता + टा → (1.3.7) ट् IT → (1.3.9) → आ → (6.4.148) ā-lopa + य् → सीतया
  if (pos === '3,1') {
    const finalForm = b + 'या';
    steps.push({ rule: '4.1.2',   note: 'स्वौजसमौट्…: टा (inst sg)',                                              form: stem + '+टा' });
    steps.push({ rule: '1.3.7',   note: 'चुटू: ट् of टा is IT (टु-वर्ग)',                                         form: stem + '+टा' });
    steps.push({ rule: '1.3.9',   note: 'तस्य लोपः: IT (ट्) लोपः → आ',                                           form: stem + '+आ' });
    steps.push({ rule: '6.4.148', note: 'यस्येति च: stem-final ā + vowel-suffix — ā लोपः, य् + आ = या',          form: finalForm });
    return { form: finalForm, steps };
  }

  // ── inst/dat/abl du (3,2 / 4,2 / 5,2) ────────────────────────────────────
  // सीता + भ्याम् → direct join (no sandhi before भ्) → सीताभ्याम्
  if (pos === '3,2' || pos === '4,2' || pos === '5,2') {
    const finalForm = stem + 'भ्याम्';
    const vibLabel  = pos === '3,2' ? 'inst' : pos === '4,2' ? 'dat' : 'abl';
    steps.push({ rule: '4.1.2', note: `स्वौजसमौट्…: भ्याम् (${vibLabel} du)`,                                     form: stem + '+भ्याम्' });
    steps.push({ rule: '6.1.72', note: 'संहितायाम्: stem ā + भ्याम् (व्यञ्जन) — no sandhi; direct join',         form: finalForm });
    return { form: finalForm, steps };
  }

  // ── inst pl (3,3) ─────────────────────────────────────────────────────────
  // सीता + भिस् → visarga chain → सीताभिः
  if (pos === '3,3') {
    const finalForm = stem + 'भिः';
    steps.push({ rule: '4.1.2', note: 'स्वौजसमौट्…: भिस् (inst pl)',                                              form: stem + '+भिस्' });
    appendVisargaChain(steps, stem + 'भि+स्', finalForm);
    return { form: finalForm, steps };
  }

  // ── dat sg (4,1) ──────────────────────────────────────────────────────────
  // सीता + ङे → (1.3.8) ङ् IT → (1.3.9) → ए → (7.3.113) ā-stem ए→ायै → सीतायै
  if (pos === '4,1') {
    const finalForm = b + 'ायै';
    steps.push({ rule: '4.1.2',   note: 'स्वौजसमौट्…: ङे (dat sg)',                                               form: stem + '+ङे' });
    steps.push({ rule: '1.3.8',   note: 'लशकु अतद्धिते: ङ् of ङे is IT',                                         form: stem + '+ङे' });
    steps.push({ rule: '1.3.9',   note: 'तस्य लोपः: IT (ङ्) लोपः → ए',                                           form: stem + '+ए' });
    steps.push({ rule: '7.3.113', note: 'ङेराम्नद्यामनीभ्यः: आप्-stem dat sg ए → ायै',                           form: finalForm });
    return { form: finalForm, steps };
  }

  // ── dat/abl pl (4,3 / 5,3) ────────────────────────────────────────────────
  // सीता + भ्यस् → visarga chain → सीताभ्यः
  if (pos === '4,3' || pos === '5,3') {
    const finalForm = stem + 'भ्यः';
    const vibLabel  = pos === '4,3' ? 'dat' : 'abl';
    steps.push({ rule: '4.1.2', note: `स्वौजसमौट्…: भ्यस् (${vibLabel} pl)`,                                      form: stem + '+भ्यस्' });
    appendVisargaChain(steps, stem + 'भ्य+स्', finalForm);
    return { form: finalForm, steps };
  }

  // ── abl sg (5,1) ──────────────────────────────────────────────────────────
  // सीता + ङसि → (1.3.8) ङ् IT → (1.3.9) → असि → (7.3.113) āp-stem → ायाः
  if (pos === '5,1') {
    const finalForm = b + 'ायाः';
    steps.push({ rule: '4.1.2',   note: 'स्वौजसमौट्…: ङसि (abl sg)',                                              form: stem + '+ङसि' });
    steps.push({ rule: '1.3.8',   note: 'लशकु अतद्धिते: ङ् of ङसि is IT',                                        form: stem + '+ङसि' });
    steps.push({ rule: '1.3.9',   note: 'तस्य लोपः: IT (ङ्) लोपः → असि',                                         form: stem + '+असि' });
    steps.push({ rule: '7.3.113', note: 'ङेराम्नद्यामनीभ्यः: आप्-stem abl sg असि → ायाः',                        form: finalForm });
    return { form: finalForm, steps };
  }

  // ── gen sg (6,1) ──────────────────────────────────────────────────────────
  // सीता + ङस् → (1.3.8) ङ् IT → (1.3.9) → अस् → (7.3.113) āp-stem → ायाः
  if (pos === '6,1') {
    const finalForm = b + 'ायाः';
    steps.push({ rule: '4.1.2',   note: 'स्वौजसमौट्…: ङस् (gen sg)',                                              form: stem + '+ङस्' });
    steps.push({ rule: '1.3.8',   note: 'लशकु अतद्धिते: ङ् of ङस् is IT',                                        form: stem + '+ङस्' });
    steps.push({ rule: '1.3.9',   note: 'तस्य लोपः: IT (ङ्) लोपः → अस्',                                         form: stem + '+अस्' });
    steps.push({ rule: '7.3.113', note: 'ङेराम्नद्यामनीभ्यः: आप्-stem gen sg अस् → ायाः',                        form: finalForm });
    return { form: finalForm, steps };
  }

  // ── gen/loc du (6,2 / 7,2) ────────────────────────────────────────────────
  // सीता + ओस् → (6.4.148) stem-ā lopa + य् → यो+स् → visarga chain → सीतयोः
  if (pos === '6,2' || pos === '7,2') {
    const finalForm = b + 'योः';
    const vibLabel  = pos === '6,2' ? 'gen' : 'loc';
    steps.push({ rule: '4.1.2',   note: `स्वौजसमौट्…: ओस् (${vibLabel} du)`,                                      form: stem + '+ओस्' });
    steps.push({ rule: '6.4.148', note: 'यस्येति च: stem-final ā + ओस् → ā-lopa, य् + ओस् = योस्',               form: b + '+योस्' });
    appendVisargaChain(steps, b + 'यो+स्', finalForm);
    return { form: finalForm, steps };
  }

  // ── gen pl (6,3) ──────────────────────────────────────────────────────────
  // सीता + आम् → (7.1.54) nuṭ āgama → न् + आम् = नाम् → सीतानाम्
  if (pos === '6,3') {
    const finalForm = stem + 'नाम्';
    steps.push({ rule: '4.1.2',  note: 'स्वौजसमौट्…: आम् (gen pl)',                                               form: stem + '+आम्' });
    steps.push({ rule: '7.1.54', note: 'ह्रस्वनद्यापो नुट्: आप्-stem gen pl → नुट् (न्) आगमः before आम् → नाम्', form: finalForm });
    return { form: finalForm, steps };
  }

  // ── loc sg (7,1) ──────────────────────────────────────────────────────────
  // सीता + ङि → (1.3.8) ङ् IT → (1.3.9) → इ → (7.3.113) āp-stem ि→ायाम् → सीतायाम्
  if (pos === '7,1') {
    const finalForm = b + 'ायाम्';
    steps.push({ rule: '4.1.2',   note: 'स्वौजसमौट्…: ङि (loc sg)',                                               form: stem + '+ङि' });
    steps.push({ rule: '1.3.8',   note: 'लशकु अतद्धिते: ङ् of ङि is IT',                                         form: stem + '+ङि' });
    steps.push({ rule: '1.3.9',   note: 'तस्य लोपः: IT (ङ्) लोपः → इ',                                           form: stem + '+इ' });
    steps.push({ rule: '7.3.113', note: 'ङेराम्नद्यामनीभ्यः: आप्-stem loc sg इ → ायाम्',                         form: finalForm });
    return { form: finalForm, steps };
  }

  // ── loc pl (7,3) ──────────────────────────────────────────────────────────
  // सीता + सुप् → (1.3.3) प् IT → (1.3.9) → सु → सीतासु
  if (pos === '7,3') {
    const finalForm = stem + 'सु';
    steps.push({ rule: '4.1.2',  note: 'स्वौजसमौट्…: सुप् (loc pl)',                                              form: stem + '+सुप्' });
    steps.push({ rule: '1.3.3',  note: 'हलन्त्यम्: final प् of सुप् is IT',                                       form: stem + '+सुप्' });
    steps.push({ rule: '1.3.9',  note: 'तस्य लोपः: IT (प्) लोपः → सु',                                           form: stem + '+सु' });
    steps.push({ rule: '6.1.72', note: 'संहितायाम्: stem ā + सु — no sandhi; direct join',                        form: finalForm });
    return { form: finalForm, steps };
  }

  // Fallback (should not reach here for ā-fem paradigm)
  const raw = RAW_SUP[pos];
  steps.push({ rule: '4.1.2', note: `स्वौजसमौट्…: ${raw}`, form: stem + '+' + raw });
  return { form: stem, steps };
}

// ── State-based derivation helpers ────────────────────────────────────────────

// Sets for position classification
const SARVANAMASTHAANA_M = new Set(['1,1','1,2','1,3','2,1','2,2']);
const BHADI = new Set(['3,2','3,3','4,2','4,3','5,2','5,3','7,3']);

// Get last PRATIPADIKA slot
function lastPrat(state) {
  const acts = state.active().filter(s => s.role === 'PRATIPADIKA');
  return acts[acts.length - 1] || null;
}
// Get all SUP slots
function supSlots(state) {
  return state.active().filter(s => s.role === 'SUP');
}

// Apply visarga chain on word-final स् slot
function applyVisarga(state) {
  const acts = state.active();
  if (!acts.length) return;
  const last = acts[acts.length - 1];
  if (last.text === 'स्') {
    state.substitute(last.idx, 'रुँ', '8.2.66', 'ससजुषो रुः: word-final स्→रुँ');
    state.substitute(last.idx, 'र्', '1.3.9', 'तस्य लोपः: ह् (IT of रुँ) dropped → र्');
    state.substitute(last.idx, 'ः', '8.3.15', 'खरवसानयोर्विसर्जनीयः: word-final र्→ः');
  }
}

// Apply ṣatva: first SUP slot with स → ष after iṇ-class vowel
function applySatva(state) {
  const acts = state.active();
  for (let i = 0; i < acts.length; i++) {
    const sl = acts[i];
    if (sl.role === 'SUP' && sl.text.includes('स')) {
      if (i > 0) {
        const prev = acts[i - 1];
        const iN = new Set(['इ','ई','उ','ऊ','ऋ','ॠ','ए','ऐ','ओ','औ']);
        if (iN.has(prev.vowel) || (prev.cons === 'र' && !prev.vowel)) {
          state.substitute(sl.idx, sl.text.replace('स','ष'), '8.3.59', 'ṣatva: स→ष after iṇ');
          return;
        }
      }
    }
  }
}

// Apply ṇatva: न→ण after र/ष/ऋ trigger
function applyNatva(state) {
  const full = state.form();
  if (!/[रषऋृ]/.test(full)) return;
  const acts = state.active();
  const chars = [];
  acts.forEach(sl => [...sl.text].forEach(ch => chars.push({ch, sl})));
  const triggers = new Set([...'रषऋृॠॄ']);
  const transparent = new Set([...'कखगघङपफबभमहयवलािीुूृेैोौंँ्']);
  for (let i = 0; i < chars.length; i++) {
    if (triggers.has(chars[i].ch)) {
      for (let j = i + 1; j < chars.length; j++) {
        const fc = chars[j].ch;
        if (fc === 'न') {
          const tsl = chars[j].sl;
          const newText = tsl.text.replace('न', 'ण');
          if (newText !== tsl.text) {
            state.substitute(tsl.idx, newText, '8.4.2', 'ṇatva: न→ण after र/ष/ऋ');
          }
          return;
        }
        if (fc === '्' || transparent.has(fc)) continue;
        break;
      }
    }
  }
}

// Replace all active SUP slots with new text
function replaceSup(state, newText, rule, note) {
  supSlots(state).forEach(s => { s.deleted = true; });
  const isDiacritic = /^[ःंँ]+$/.test(newText);
  if (isDiacritic) {
    const pratSlots = state.active().filter(s => s.role === 'PRATIPADIKA');
    if (pratSlots.length) pratSlots[pratSlots.length - 1].text += newText;
    state.steps.push({rule, note: note || rule, form: state.form()});
  } else {
    state.appendSup(newText, rule, note || rule);
  }
}

// Lopa all SUP slots silently (helper for nuT/lopa)
function lopaSup(state, rule, note) {
  supSlots(state).forEach(s => state.lopa(s.idx, rule, note || rule));
}

// Insert नुट् (→ न्) before आम् for gen pl (7.1.54)
// Note: tok('आम्') splits into two slots ('आ' + 'म्'), so we compare combined text.
function insertNut(state) {
  const sups = supSlots(state);
  const supText = sups.map(s => s.text).join('');
  if (supText === 'आम्') {
    // Delete all existing SUP slots, then append नाम् as a single new slot
    sups.forEach(s => { s.deleted = true; });
    state.appendSup('नाम्', '7.1.54', 'ह्रस्वनद्यापो नुट्: नुट् (न्) before आम् → नाम्');
  }
}

// 7.1.54 for gen pl with nuT and 6.4.3 dīrgha for a-stems
function insertNutWithDirgha(state) {
  const lp = lastPrat(state);
  if (lp && lp.vowel === 'अ') {
    const newText = lp.cons ? lp.cons + 'ा' : 'आ';
    state.substitute(lp.idx, newText, '6.4.3', 'नामि: अ→आ before नाम्');
  }
  insertNut(state);
}

// Apply guṇa to stem-final vowel slot
function applyGunaVowel(state, fromV, toMatra, toInd, rule, note) {
  for (const sl of [...state.active()].reverse()) {
    if (sl.role === 'PRATIPADIKA' && sl.vowel === fromV) {
      const newText = sl.cons ? sl.cons + toMatra : toInd;
      state.substitute(sl.idx, newText, rule, note);
      return;
    }
  }
}

// Apply dīrgha to stem-final vowel slot
function applyDirghaVowel(state, fromV, toMatra, toInd, rule, note) {
  for (const sl of [...state.active()].reverse()) {
    if (sl.role === 'PRATIPADIKA' && sl.vowel === fromV) {
      const newText = sl.cons ? sl.cons + toMatra : toInd;
      state.substitute(sl.idx, newText, rule, note);
      return;
    }
  }
}

// Apply yaṇ sandhi: stem vowel → halant, prepend semi-vowel to first SUP
function applyYan(state, fromV, semiVowel, rule, note) {
  const MATRA = {'ओ':'ो','अ':'','आ':'ा','इ':'ि','ई':'ी','उ':'ु','ऊ':'ू','ए':'े','ऐ':'ै','औ':'ौ'};
  for (const sl of [...state.active()].reverse()) {
    if (sl.role === 'PRATIPADIKA' && sl.vowel === fromV) {
      const newText = sl.cons ? sl.cons + '्' : '';
      state.substitute(sl.idx, newText, rule, note);
      // Prepend semi-vowel to first vowel-initial SUP
      const sup0 = supSlots(state)[0];
      if (sup0 && !sup0.cons) {
        const m = MATRA[sup0.vowel] !== undefined ? MATRA[sup0.vowel] : '';
        const newSup = sup0.vowel === 'ओ' ? semiVowel+'ो' : semiVowel + m;
        state.substitute(sup0.idx, newSup, rule, `yaṇ: ${semiVowel}्+${sup0.vowel}→${newSup}`);
      }
      return;
    }
  }
}

// 6.1.107 अमि पूर्वः: stem vowel absorbs first SUP initial अ
function applyAmiPurva(state, stemVowel) {
  const acts = state.active();
  for (let i = 0; i < acts.length - 1; i++) {
    const sl = acts[i];
    const nxt = acts[i+1];
    if (sl.role === 'PRATIPADIKA' && sl.vowel === stemVowel &&
        nxt.role === 'SUP' && !nxt.cons && nxt.vowel === 'अ') {
      state.lopa(nxt.idx, '6.1.107', 'अमि पूर्वः: stem vowel absorbs suffix अ');
      return;
    }
  }
}

// eco'yav for ए before vowel: ए→अय्, prepend य to suffix
function applyEcoYavE(state) {
  const MATRA = {'ओ':'ो','अ':'','आ':'ा','इ':'ि','ई':'ी','उ':'ु','ऊ':'ू','ए':'े','ऐ':'ै','औ':'ौ'};
  const acts = state.active();
  for (let i = 0; i < acts.length - 1; i++) {
    const sl = acts[i];
    const nxt = acts[i+1];
    if (sl.role === 'PRATIPADIKA' && sl.vowel === 'ए' && nxt.role === 'SUP' && !nxt.cons && nxt.vowel) {
      const newStem = sl.cons || 'अ';
      state.substitute(sl.idx, newStem, '6.1.78', 'एचोऽयवायावः: ए→अय् (stem part)');
      const m = MATRA[nxt.vowel] !== undefined ? MATRA[nxt.vowel] : '';
      const newSup = nxt.vowel === 'ओ' ? 'यो' : 'य' + m;
      state.substitute(nxt.idx, newSup, '6.1.78', `एचोऽयवायावः: य्+${nxt.vowel}→${newSup}`);
      return;
    }
  }
}

// eco'yav for ओ before vowel: ओ→अव्, prepend व to suffix (inserts व slot)
function applyEcoYavO(state) {
  const acts = state.active();
  for (let i = 0; i < acts.length - 1; i++) {
    const sl = acts[i];
    const nxt = acts[i+1];
    if (sl.role === 'PRATIPADIKA' && sl.vowel === 'ओ' && nxt.role === 'SUP' && !nxt.cons && nxt.vowel) {
      const newStem = sl.cons || 'अ';
      state.substitute(sl.idx, newStem, '6.1.78', 'एचोऽयवायावः: ओ→अव् (stem part)');
      // Prepend व to suffix
      const MATRA = {'ओ':'ो','अ':'','आ':'ा','इ':'ि','ई':'ी','उ':'ु','ऊ':'ू','ए':'े','ऐ':'ै','औ':'ौ'};
      const m = MATRA[nxt.vowel] !== undefined ? MATRA[nxt.vowel] : '';
      const newSup = nxt.vowel === 'ओ' ? 'वो' : 'व' + m;
      state.substitute(nxt.idx, newSup, '6.1.78', `एचोऽयवायावः: व्+${nxt.vowel}→${newSup}`);
      // Lopa any following standalone अ
      const acts2 = state.active();
      for (const s2 of acts2) {
        if (s2.role === 'SUP' && !s2.cons && s2.vowel === 'अ') {
          state.lopa(s2.idx, '6.1.78', 'eco_yav_u: lopa of suffix-initial अ');
          break;
        }
      }
      return;
    }
  }
}

// Lopa standalone अ at the front of SUP (for post-guṇa suffix simplification)
function lopaSupInitialA(state) {
  for (const sl of supSlots(state)) {
    if (!sl.cons && (sl.vowel === 'अ' || sl.vowel === 'इ')) {
      state.lopa(sl.idx, '6.1.87', 'guṇa absorbs suffix initial vowel');
      return;
    }
    if (sl.cons && sl.vowel === 'इ') {
      state.substitute(sl.idx, sl.cons + '्', '6.1.87', 'guṇa absorbs suffix vowel');
      return;
    }
    break;
  }
}

// Lopa standalone अ at front of SUP (for dīrgha-absorbs-suffix)
function lopaSupA(state) {
  for (const sl of supSlots(state)) {
    if (!sl.cons && sl.vowel === 'अ') {
      state.lopa(sl.idx, '6.1.101', 'savarṇa dīrgha: suffix अ absorbed');
      return;
    }
  }
}

// 6.1.103 तस्माच्छसो नः पुंसि: final स् of शस् → न् (masculine acc pl)
function applyMascAccPl(state) {
  for (const sl of supSlots(state)) {
    if (sl.text === 'स्') {
      state.substitute(sl.idx, 'न्', '6.1.103', 'तस्माच्छसो नः पुंसि: स्→न् (acc pl M)');
      return;
    }
  }
}

// Lopa all SUP (for nom du/pl dīrgha forms where suffix vanishes)
function lopaAllSup(state, rule, note) {
  supSlots(state).forEach(s => state.lopa(s.idx, rule, note));
}

// ── i-stem State derivation ───────────────────────────────────────────────────
function deriveIStemState(stem, vib, vac, linga) {
  const pos = `${vib},${vac}`;
  const state = State.fromPratipadika(stem);
  addSup(state, vib, vac);

  // Special: loc sg → औ (7.3.118)
  if (pos === '7,1') {
    // ङि→इ already done; replace with औ, merge stem इ+औ→ौ
    const sup0 = supSlots(state)[0];
    if (sup0) state.substitute(sup0.idx, 'औ', '7.3.118', 'इदुद्भ्याम्: ङि→औ (loc sg i-stem)');
    const acts = state.active();
    for (let i = 0; i < acts.length - 1; i++) {
      if (acts[i].role === 'PRATIPADIKA' && acts[i].vowel === 'इ' &&
          acts[i+1].role === 'SUP' && acts[i+1].vowel === 'औ') {
        const newText = acts[i].cons ? acts[i].cons + 'ौ' : 'औ';
        state.substitute(acts[i].idx, newText, '7.3.118', 'इ+औ→ौ (loc sg i-stem)');
        state.lopa(acts[i+1].idx, '7.3.118', 'loc sg merge');
        break;
      }
    }
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // inst sg: 7.1.12 टा→ना (for i-stem); ṇatva if stem has र/ष/ऋ trigger
  if (pos === '3,1') {
    replaceSup(state, 'ना', '7.1.12', 'टाङसिङसामिनात्स्याः: टा→ना (i-stem inst sg)');
    applyNatva(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // gen pl: dīrgha + 7.1.54 nuṭ; ṇatva if stem has trigger
  if (pos === '6,3') {
    applyDirghaVowel(state, 'इ', 'ी', 'ई', '6.1.101', 'अकः सवर्णे दीर्घः: इ→ई');
    insertNut(state);
    applyNatva(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // nom/acc du: dīrgha → suffix absorbed
  if (pos === '1,2' || pos === '2,2') {
    applyDirghaVowel(state, 'इ', 'ी', 'ई', '6.1.101', 'अकः सवर्णे दीर्घः: इ→ई (nom/acc du)');
    lopaAllSup(state, '6.1.101', 'savarṇa dīrgha: suffix absorbed');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // nom pl: guṇa + eco'yav
  if (pos === '1,3') {
    applyGunaVowel(state, 'इ', 'े', 'ए', '7.3.86', 'पुगन्तलघूपधस्य च: इ→ए (guṇa)');
    applyEcoYavE(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // acc sg: 6.1.107 अमि पूर्वः
  if (pos === '2,1') {
    applyAmiPurva(state, 'इ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // acc pl: dīrgha + (masc: 6.1.103 स्→न्, fem: lopa स्→visarga)
  if (pos === '2,3') {
    applyDirghaVowel(state, 'इ', 'ी', 'ई', '6.1.101', 'अकः सवर्णे दीर्घः: इ→ई');
    if (linga === 'M') {
      applyMascAccPl(state);
      lopaSupA(state);
    } else {
      lopaSupA(state);
    }
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // dat sg: guṇa + eco'yav (ये)
  if (pos === '4,1') {
    applyGunaVowel(state, 'इ', 'े', 'ए', '7.3.86', 'पुगन्तलघूपधस्य च: इ→ए (guṇa)');
    applyEcoYavE(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // abl sg / gen sg: guṇa + lopa suffix vowels → ः
  if (pos === '5,1' || pos === '6,1') {
    applyGunaVowel(state, 'इ', 'े', 'ए', '7.3.86', 'पुगन्तलघूपधस्य च: इ→ए (guṇa)');
    lopaSupInitialA(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // gen/loc du: yaṇ (इ→य्) + eco'yav would give योः
  if (pos === '6,2' || pos === '7,2') {
    applyYan(state, 'इ', 'य', '6.1.77', 'इको यणचि: इ→य् (halant)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }

  // loc pl (7,3): ṣatva — स→ष after इ/ई (8.3.59)
  if (pos === '7,3') {
    applySatva(state);
  }

  // bhādi (consonant-initial): direct join
  applyVisarga(state);
  return {form: state.form(), steps: state.steps};
}

// i-masculine (अग्नि-type): inst sg uses 7.1.12 ना (not yaṇ)
function deriveIMascState(stem, vib, vac) {
  // i-fem uses yaṇ for inst sg; i-masc uses 7.1.12 ना — both handled in deriveIStemState
  return deriveIStemState(stem, vib, vac, 'M');
}

// i-feminine (मति-type): inst/dat/abl/gen sg use yaṇ via 7.3.111
function deriveIFemState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const state = State.fromPratipadika(stem);
  addSup(state, vib, vac);

  // inst sg: yaṇ इ→य् + आ → या
  if (pos === '3,1') {
    applyYan(state, 'इ', 'य', '6.1.77', 'इको यणचि: इ→य् (inst sg i-fem)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // dat sg: 7.3.111 ए→ऐ + yaṇ
  if (pos === '4,1') {
    replaceSup(state, 'ऐ', '7.3.111', 'ङे→ऐ after nadī/i-fem (dat sg)');
    applyYan(state, 'इ', 'य', '6.1.77', 'इको यणचि: इ→य् before ऐ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // abl sg: 7.3.111 → आस् + yaṇ
  if (pos === '5,1') {
    replaceSup(state, 'आस्', '7.3.111', 'ङसि→आस् after i-fem (abl sg)');
    applyYan(state, 'इ', 'य', '6.1.77', 'इको यणचि: इ→य् before आस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // gen sg: 7.3.111 → आस् + yaṇ
  if (pos === '6,1') {
    replaceSup(state, 'आस्', '7.3.111', 'ङस्→आस् after i-fem (gen sg)');
    applyYan(state, 'इ', 'य', '6.1.77', 'इको यणचि: इ→य् before आस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // loc sg: same as i-masc (7.3.118 अग्नौ-type)
  if (pos === '7,1') {
    const sup0 = supSlots(state)[0];
    if (sup0) state.substitute(sup0.idx, 'औ', '7.3.118', 'इदुद्भ्याम्: ङि→औ (loc sg i-fem)');
    const acts = state.active();
    for (let i = 0; i < acts.length - 1; i++) {
      if (acts[i].role === 'PRATIPADIKA' && acts[i].vowel === 'इ' &&
          acts[i+1].role === 'SUP' && acts[i+1].vowel === 'औ') {
        const newText = acts[i].cons ? acts[i].cons + 'ौ' : 'औ';
        state.substitute(acts[i].idx, newText, '7.3.118', 'इ+औ→ौ (loc sg i-fem)');
        state.lopa(acts[i+1].idx, '7.3.118', 'loc sg merge');
        break;
      }
    }
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // nom/acc du: dīrgha + suffix absorbed
  if (pos === '1,2' || pos === '2,2') {
    applyDirghaVowel(state, 'इ', 'ी', 'ई', '6.1.101', 'अकः सवर्णे दीर्घः: इ→ई (nom/acc du)');
    lopaAllSup(state, '6.1.101', 'savarṇa dīrgha: suffix absorbed');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // nom pl: guṇa + eco'yav
  if (pos === '1,3') {
    applyGunaVowel(state, 'इ', 'े', 'ए', '7.3.86', 'पुगन्तलघूपधस्य च: इ→ए (guṇa)');
    applyEcoYavE(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // acc sg: 6.1.107
  if (pos === '2,1') {
    applyAmiPurva(state, 'इ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // acc pl (fem): dīrgha + lopa अ → ीस् → visarga
  if (pos === '2,3') {
    applyDirghaVowel(state, 'इ', 'ी', 'ई', '6.1.101', 'अकः सवर्णे दीर्घः: इ→ई');
    lopaSupA(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // gen pl: dīrgha + nami
  if (pos === '6,3') {
    applyDirghaVowel(state, 'इ', 'ी', 'ई', '6.1.101', 'अकः सवर्णे दीर्घः: इ→ई');
    insertNut(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // gen/loc du: yaṇ
  if (pos === '6,2' || pos === '7,2') {
    applyYan(state, 'इ', 'य', '6.1.77', 'इको यणचि: इ→य् before ओस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // loc pl: ṣatva
  if (pos === '7,3') { applySatva(state); }
  applyVisarga(state);
  return {form: state.form(), steps: state.steps};
}

// i-neuter (वारि-type)
function deriveINeutState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const natva = hasNatvaTrigger(stem);
  const N = natva ? 'ण' : 'न';
  const state = State.fromPratipadika(stem);
  addSup(state, vib, vac);

  if (pos === '1,1' || pos === '2,1') {
    // 7.1.24 neut nom/acc sg = bare stem (सु lopa) → just stem
    lopaSup(state, '7.1.24', 'नपुंसकाच्च: nom/acc sg neuter — suffix lopa');
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '1,2' || pos === '2,2') {
    replaceSup(state, N+'ी', '7.1.20', `नपुंसकस्य झल्चेः: औ→${N}ी (neut i-stem du)`);
    // stem इ + नी → concat; stem is short, stays
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '1,3' || pos === '2,3') {
    applyDirghaVowel(state, 'इ', 'ी', 'ई', '6.1.101', 'अकः सवर्णे दीर्घः: इ→ई');
    replaceSup(state, N+'ि', '7.1.20', `नपुंसकाच्च: pl suffix → ${N}ि (neut i-stem)`);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // inst sg: stem इ + ना (7.1.12)
  if (pos === '3,1') {
    replaceSup(state, N+'ा', '7.1.12', `टाङसिङसामिनात्स्याः: टा→${N}ा (neut i-stem inst sg)`);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '4,1') {
    replaceSup(state, N+'े', '6.1.87', `guṇa: ङे→${N}े (neut i-stem dat sg)`);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '5,1' || pos === '6,1') {
    replaceSup(state, N+'ः', '6.1.87', `guṇa: abl/gen sg → ${N}ः (neut i-stem)`);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,2' || pos === '7,2') {
    replaceSup(state, N+'ोः', '6.1.78', `gen/loc du → ${N}ोः (neut i-stem)`);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,3') {
    applyDirghaVowel(state, 'इ', 'ी', 'ई', '6.1.101', 'अकः सवर्णे दीर्घः: इ→ई');
    insertNut(state);
    // ṇatva on the ना of नाम् if trigger
    if (natva) applyNatva(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,1') {
    replaceSup(state, N+'ि', '7.3.118', `loc sg → ${N}ि (neut i-stem)`);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,3') { applySatva(state); }
  applyVisarga(state);
  return {form: state.form(), steps: state.steps};
}

// ── u-stem State derivation ───────────────────────────────────────────────────
function deriveUMascState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const state = State.fromPratipadika(stem);
  addSup(state, vib, vac);

  // loc sg: 7.3.118 उ→औ
  if (pos === '7,1') {
    const sup0 = supSlots(state)[0];
    if (sup0) state.substitute(sup0.idx, 'औ', '7.3.118', 'इदुद्भ्याम्: ङि→औ (loc sg u-stem)');
    const acts = state.active();
    for (let i = 0; i < acts.length - 1; i++) {
      if (acts[i].role === 'PRATIPADIKA' && acts[i].vowel === 'उ' &&
          acts[i+1].role === 'SUP' && acts[i+1].vowel === 'औ') {
        const newText = acts[i].cons ? acts[i].cons + 'ौ' : 'औ';
        state.substitute(acts[i].idx, newText, '7.3.118', 'उ+औ→ौ (loc sg u-stem)');
        state.lopa(acts[i+1].idx, '7.3.118', 'loc sg merge');
        break;
      }
    }
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // inst sg: टा→ना
  if (pos === '3,1') {
    replaceSup(state, 'ना', '7.1.12', 'टाङसिङसामिनात्स्याः: टा→ना (u-stem inst sg)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // gen pl: dīrgha + nami
  if (pos === '6,3') {
    applyDirghaVowel(state, 'उ', 'ू', 'ऊ', '6.1.101', 'अकः सवर्णे दीर्घः: उ→ऊ');
    insertNut(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // nom/acc du: dīrgha + suffix absorbed
  if (pos === '1,2' || pos === '2,2') {
    applyDirghaVowel(state, 'उ', 'ू', 'ऊ', '6.1.101', 'अकः सवर्णे दीर्घः: उ→ऊ (nom/acc du)');
    lopaAllSup(state, '6.1.101', 'savarṇa dīrgha: suffix absorbed');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // nom pl: guṇa + eco'yav
  if (pos === '1,3') {
    applyGunaVowel(state, 'उ', 'ो', 'ओ', '7.3.86', 'पुगन्तलघूपधस्य च: उ→ओ (guṇa)');
    applyEcoYavO(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // acc sg: 6.1.107
  if (pos === '2,1') {
    applyAmiPurva(state, 'उ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // acc pl: dīrgha + 6.1.103 + lopa अ
  if (pos === '2,3') {
    applyDirghaVowel(state, 'उ', 'ू', 'ऊ', '6.1.101', 'अकः सवर्णे दीर्घः: उ→ऊ');
    applyMascAccPl(state);
    lopaSupA(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // dat sg: guṇa + eco'yav (वे)
  if (pos === '4,1') {
    applyGunaVowel(state, 'उ', 'ो', 'ओ', '7.3.86', 'पुगन्तलघूपधस्य च: उ→ओ (guṇa)');
    applyEcoYavO(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // abl sg / gen sg: guṇa + lopa vowels → ः
  if (pos === '5,1' || pos === '6,1') {
    applyGunaVowel(state, 'उ', 'ो', 'ओ', '7.3.86', 'पुगन्तलघूपधस्य च: उ→ओ (guṇa)');
    lopaSupInitialA(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // gen/loc du: yaṇ
  if (pos === '6,2' || pos === '7,2') {
    applyYan(state, 'उ', 'व', '6.1.77', 'इको यणचि: उ→व् (halant) before ओस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,3') { applySatva(state); }
  applyVisarga(state);
  return {form: state.form(), steps: state.steps};
}

function deriveUFemState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const state = State.fromPratipadika(stem);
  addSup(state, vib, vac);

  // u-fem: inst/dat/abl/gen/loc sg use yaṇ (via 7.3.111 for dat/abl/gen/loc)
  if (pos === '3,1') {
    // inst sg: yaṇ उ→व् + आ → वा
    applyYan(state, 'उ', 'व', '6.1.77', 'इको यणचि: उ→व् (inst sg u-fem)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '4,1') {
    replaceSup(state, 'ऐ', '7.3.111', 'ङे→ऐ after u-fem (dat sg)');
    applyYan(state, 'उ', 'व', '6.1.77', 'इको यणचि: उ→व् before ऐ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '5,1') {
    replaceSup(state, 'आस्', '7.3.111', 'ङसि→आस् after u-fem (abl sg)');
    applyYan(state, 'उ', 'व', '6.1.77', 'इको यणचि: उ→व् before आस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,1') {
    replaceSup(state, 'आस्', '7.3.111', 'ङस्→आस् after u-fem (gen sg)');
    applyYan(state, 'उ', 'व', '6.1.77', 'इको यणचि: उ→व् before आस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,1') {
    replaceSup(state, 'आम्', '7.3.111', 'ङि→आम् after u-fem (loc sg)');
    applyYan(state, 'उ', 'व', '6.1.77', 'इको यणचि: उ→व् before आम्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '1,2' || pos === '2,2') {
    applyDirghaVowel(state, 'उ', 'ू', 'ऊ', '6.1.101', 'अकः सवर्णे दीर्घः: उ→ऊ (nom/acc du)');
    lopaAllSup(state, '6.1.101', 'savarṇa dīrgha: suffix absorbed');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '1,3') {
    applyGunaVowel(state, 'उ', 'ो', 'ओ', '7.3.86', 'पुगन्तलघूपधस्य च: उ→ओ (guṇa)');
    applyEcoYavO(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '2,1') {
    applyAmiPurva(state, 'उ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '2,3') {
    applyDirghaVowel(state, 'उ', 'ू', 'ऊ', '6.1.101', 'अकः सवर्णे दीर्घः: उ→ऊ');
    lopaSupA(state); // fem: no 6.1.103
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,2' || pos === '7,2') {
    applyYan(state, 'उ', 'व', '6.1.77', 'इको यणचि: उ→व् before ओस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,3') {
    applyDirghaVowel(state, 'उ', 'ू', 'ऊ', '6.1.101', 'अकः सवर्णे दीर्घः: उ→ऊ');
    insertNut(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,3') { applySatva(state); }
  applyVisarga(state);
  return {form: state.form(), steps: state.steps};
}

function deriveUNeutState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const state = State.fromPratipadika(stem);
  addSup(state, vib, vac);

  if (pos === '1,1' || pos === '2,1') {
    lopaSup(state, '7.1.24', 'नपुंसकाच्च: nom/acc sg neuter u-stem — suffix lopa');
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '1,2' || pos === '2,2') {
    replaceSup(state, 'नी', '7.1.20', 'नपुंसकस्य झल्चेः: औ→नी (neut u-stem du)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '1,3' || pos === '2,3') {
    applyDirghaVowel(state, 'उ', 'ू', 'ऊ', '6.1.101', 'अकः सवर्णे दीर्घः: उ→ऊ');
    replaceSup(state, 'नि', '7.1.20', 'नपुंसकाच्च: pl → ूनि (neut u-stem)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '3,1') {
    replaceSup(state, 'ना', '7.1.12', 'टा→ना (neut u-stem inst sg)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '4,1') {
    replaceSup(state, 'ने', '6.1.87', 'dat sg → ने (neut u-stem)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '5,1' || pos === '6,1') {
    replaceSup(state, 'नः', '6.1.87', 'abl/gen sg → नः (neut u-stem)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,2' || pos === '7,2') {
    replaceSup(state, 'नोः', '6.1.78', 'gen/loc du → नोः (neut u-stem)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,3') {
    applyDirghaVowel(state, 'उ', 'ू', 'ऊ', '6.1.101', 'अकः सवर्णे दीर्घः: उ→ऊ');
    insertNut(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,1') {
    replaceSup(state, 'नि', '7.3.118', 'loc sg → नि (neut u-stem)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,3') { applySatva(state); }
  applyVisarga(state);
  return {form: state.form(), steps: state.steps};
}

// ── ī-stem State derivation (nadī-type) ──────────────────────────────────────
function deriveIIFemState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const state = State.fromPratipadika(stem);
  addSup(state, vib, vac);

  // nom sg: 7.3.78 सु-lopa → bare stem
  if (pos === '1,1') {
    lopaSup(state, '7.3.78', 'नदीसंज्ञायाः: nom sg सु-lopa');
    return {form: state.form(), steps: state.steps};
  }
  // acc sg: 6.1.107 → नदीम्
  if (pos === '2,1') {
    applyAmiPurva(state, 'ई');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // nom/acc du: yaṇ ई→य् + औ → यौ
  if (pos === '1,2' || pos === '2,2') {
    applyYan(state, 'ई', 'य', '6.1.77', 'इको यणचि: ई→य् before औ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // nom pl: yaṇ ई→य् + अस् → यः
  if (pos === '1,3') {
    applyYan(state, 'ई', 'य', '6.1.77', 'इको यणचि: ई→य् before अस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // acc pl (fem): dīrgha → ईस् → visarga
  if (pos === '2,3') {
    lopaSupA(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // inst sg: yaṇ → या
  if (pos === '3,1') {
    applyYan(state, 'ई', 'य', '6.1.77', 'इको यणचि: ई→य् before आ (inst sg)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // dat sg: 7.3.111 ऐ + yaṇ
  if (pos === '4,1') {
    replaceSup(state, 'ऐ', '7.3.111', 'ङे→ऐ after nadī (dat sg)');
    applyYan(state, 'ई', 'य', '6.1.77', 'इको यणचि: ई→य् before ऐ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // abl sg: 7.3.111 आस् + yaṇ
  if (pos === '5,1') {
    replaceSup(state, 'आस्', '7.3.111', 'ङसि→आस् after nadī (abl sg)');
    applyYan(state, 'ई', 'य', '6.1.77', 'इको यणचि: ई→य् before आस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // gen sg: 7.3.111 आस् + yaṇ
  if (pos === '6,1') {
    replaceSup(state, 'आस्', '7.3.111', 'ङस्→आस् after nadī (gen sg)');
    applyYan(state, 'ई', 'य', '6.1.77', 'इको यणचि: ई→य् before आस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // gen/loc du: yaṇ ई→य् + ओस् → योः
  if (pos === '6,2' || pos === '7,2') {
    applyYan(state, 'ई', 'य', '6.1.77', 'इको यणचि: ई→य् before ओस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // gen pl: nami (नाम् → नाम् with ई stay)
  if (pos === '6,3') {
    insertNut(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  // loc sg: 7.3.111 आम् + yaṇ
  if (pos === '7,1') {
    replaceSup(state, 'आम्', '7.3.111', 'ङि→आम् after nadī (loc sg)');
    applyYan(state, 'ई', 'य', '6.1.77', 'इको यणचि: ई→य् before आम्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,3') { applySatva(state); }
  applyVisarga(state);
  return {form: state.form(), steps: state.steps};
}

// ī-monosyllabic (श्री-type)
function deriveIIMonoState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  // Monosyllabic ī stems decline like i-masc for most forms
  // nom sg: ः (guṇa+visarga); forms use yaṇ for some
  // Use the flat form for correctness, add steps via stepsFromFlatSimple
  const flatForm = (function() {
    const bII = stem;
    const bI  = stripMatra(stem, 'ी') + 'ि';
    const grid = [
      bII+'ः', bI+'यौ', bI+'यः',
      bI+'यम्', bI+'यौ', bI+'यः',
      bI+'या', bII+'भ्याम्', bII+'भिः',
      bI+'ये', bII+'भ्याम्', bII+'भ्यः',
      bI+'यः', bII+'भ्याम्', bII+'भ्यः',
      bI+'यः', bI+'योः', bI+'याम्',
      bI+'यि', bI+'योः', bII+'षु',
    ];
    return grid[(vib-1)*3 + (vac-1)];
  })();
  return stepsFromFlatSimple(stem, 'F', vib, vac, flatForm);
}

// ── ū-stem State derivation (vadu-type) ──────────────────────────────────────
function deriveUUFemState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const state = State.fromPratipadika(stem);
  addSup(state, vib, vac);

  if (pos === '1,1') {
    // nom sg: ऊः (guṇa+visarga) — ऊ stays, सु → visarga
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '2,1') {
    applyAmiPurva(state, 'ऊ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '1,2' || pos === '2,2') {
    applyYan(state, 'ऊ', 'व', '6.1.77', 'इको यणचि: ऊ→व् before औ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '1,3') {
    applyYan(state, 'ऊ', 'व', '6.1.77', 'इको यणचि: ऊ→व् before अस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '2,3') {
    lopaSupA(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '3,1') {
    applyYan(state, 'ऊ', 'व', '6.1.77', 'इको यणचि: ऊ→व् (inst sg uu-fem)');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '4,1') {
    replaceSup(state, 'ऐ', '7.3.111', 'ङे→ऐ after ū-fem (dat sg)');
    applyYan(state, 'ऊ', 'व', '6.1.77', 'इको यणचि: ऊ→व् before ऐ');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '5,1') {
    replaceSup(state, 'आस्', '7.3.111', 'ङसि→आस् after ū-fem (abl sg)');
    applyYan(state, 'ऊ', 'व', '6.1.77', 'इको यणचि: ऊ→व् before आस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,1') {
    replaceSup(state, 'आस्', '7.3.111', 'ङस्→आस् after ū-fem (gen sg)');
    applyYan(state, 'ऊ', 'व', '6.1.77', 'इको यणचि: ऊ→व् before आस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,2' || pos === '7,2') {
    applyYan(state, 'ऊ', 'व', '6.1.77', 'इको यणचि: ऊ→व् before ओस्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '6,3') {
    insertNut(state);
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,1') {
    replaceSup(state, 'आम्', '7.3.111', 'ङि→आम् after ū-fem (loc sg)');
    applyYan(state, 'ऊ', 'व', '6.1.77', 'इको यणचि: ऊ→व् before आम्');
    applyVisarga(state);
    return {form: state.form(), steps: state.steps};
  }
  if (pos === '7,3') { applySatva(state); }
  applyVisarga(state);
  return {form: state.form(), steps: state.steps};
}

// ū-monosyllabic (भू-type)
function deriveUUMonoState(stem, vib, vac) {
  const bUU = stem;
  const bU  = stripMatra(stem, 'ू') + 'ु';
  const grid = [
    bUU+'ः', bU+'वौ', bU+'वः',
    bU+'वम्', bU+'वौ', bU+'वः',
    bU+'वा', bUU+'भ्याम्', bUU+'भिः',
    bU+'वे', bUU+'भ्याम्', bUU+'भ्यः',
    bU+'वः', bUU+'भ्याम्', bUU+'भ्यः',
    bU+'वः', bU+'वोः', bU+'वाम्',
    bU+'वि', bU+'वोः', bUU+'षु',
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'F', vib, vac, finalForm);
}

// ── ṛ-stem State derivation ───────────────────────────────────────────────────
function deriveRMascState(stem, vib, vac) {
  const flatForm = deriveRStemFlat(stem, 'M', vib, vac);
  return stepsFromFlatSimple(stem, 'M', vib, vac, flatForm);
}

function deriveRFemState(stem, vib, vac) {
  const flatForm = deriveRStemFlat(stem, 'F', vib, vac);
  return stepsFromFlatSimple(stem, 'F', vib, vac, flatForm);
}

function deriveRStemFlat(stem, linga, vib, vac) {
  const bR  = stem;
  const bN  = stripMatra(stem, 'ृ');
  const bRR = bN + 'ॄ';
  const tokens = tok(stem);
  const penult = tokens.length >= 2 ? tokens[tokens.length - 2] : null;
  const isAgent = penult && penult.vowel === 'आ';
  const nomDu  = isAgent ? bN+'ारौ' : bN+'रौ';
  const nomPl  = isAgent ? bN+'ारः' : bN+'रः';
  const accSg  = isAgent ? bN+'ारम्' : bN+'रम्';
  const ablGen = bN + 'ुः';
  const locSg = bN + 'रि';
  const accPl = linga === 'F' ? bRR + 'ः' : bRR + 'न्';
  const grid = [
    bN+'ा', nomDu, nomPl,
    accSg, nomDu, accPl,
    bN+'्रा', bR+'भ्याम्', bR+'भिः',
    bN+'्रे', bR+'भ्याम्', bR+'भ्यः',
    ablGen, bR+'भ्याम्', bR+'भ्यः',
    ablGen, bN+'्रोः', bRR+'णाम्',
    locSg, bN+'्रोः', bR+'षु',
  ];
  return grid[(vib-1)*3 + (vac-1)];
}

// ── n-stem State derivation ───────────────────────────────────────────────────
function deriveNStemState(stem, vib, vac) {
  const pos = `${vib},${vac}`;
  const finalForm = deriveNStemFlat(stem, vib, vac);

  // nom sg (राजन् → राजा): 6.4.8 lengthening → 8.2.7 न्-lopa → 6.1.68 apṛkta-hal lopa
  if (pos === '1,1') {
    const tokens = tok(stem);
    const base = tokens.slice(0, -1).map(t => t.text).join(''); // strip final न
    const lengthenedStem = base + 'ान्'; // e.g. राजान्
    const steps = [];
    steps.push({ rule: '4.1.2', note: 'स्वौजसमौट्…: सुँ (nom sg)',                                         form: stem + '+सुँ' });
    steps.push({ rule: '1.3.2', note: 'उपदेशेऽजनुनासिक इत्: ँ in सुँ marks vowel as IT',                   form: stem + '+सुँ' });
    steps.push({ rule: '1.3.9', note: 'तस्य लोपः: IT stripped → स्',                                        form: stem + '+स्' });
    steps.push({ rule: '6.4.8', note: 'सर्वनामस्थाने चासम्बुद्धौ: उपधा-दीर्घः — अ→आ before सर्वनामस्थान',  form: lengthenedStem + '+स्' });
    steps.push({ rule: '8.2.7', note: 'नलोपः सुप्स्वरसंज्ञातुग्विधिषु कृति: final न् drops before सुप्',    form: finalForm + '+स्' });
    steps.push({ rule: '6.1.68', note: 'हल्ङ्याब्भ्यो दीर्घात् सुतिस्यपृक्तं हल्: अपृक्त-सकारस्य लोपः',  form: finalForm });
    return { form: finalForm, steps };
  }

  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

function deriveNStemFlat(stem, vib, vac) {
  const tokens = tok(stem);
  const withoutN = tokens.slice(0, -1);
  const base = withoutN.map(t => t.text).join('');
  let hasLopa = false;
  if (withoutN.length >= 2) {
    const penultTok = withoutN[withoutN.length - 2];
    if (penultTok.vowel) hasLopa = true;
  }
  if (!hasLopa) {
    const grid = [
      base+'ा', base+'ानौ', base+'ानः',
      base+'ानम्', base+'ानौ', base+'नः',
      base+'ना', base+'भ्याम्', base+'भिः',
      base+'ने', base+'भ्याम्', base+'भ्यः',
      base+'नः', base+'भ्याम्', base+'भ्यः',
      base+'नः', base+'नोः', base+'नाम्',
      base+'नि', base+'नोः', base+'सु',
    ];
    return grid[(vib-1)*3 + (vac-1)];
  } else {
    const tokens2 = tok(base);
    const lastT = tokens2[tokens2.length - 1];
    const prefix2 = tokens2.slice(0,-1).map(t=>t.text).join('');
    const baseHal = prefix2 + lastT.cons + HALANT;
    const PALATALS = new Set(['ज','च','छ','झ','ञ']);
    const finalCons = lastT.cons;
    const Nchar = PALATALS.has(finalCons) ? 'ञ' : (hasNatvaTrigger(base) ? 'ण' : 'न');
    const grid = [
      base+'ा', base+'ानौ', base+'ानः',
      base+'ानम्', base+'ानौ', baseHal+Nchar+'ः',
      baseHal+Nchar+'ा', base+'भ्याम्', base+'भिः',
      baseHal+Nchar+'े', base+'भ्याम्', base+'भ्यः',
      baseHal+Nchar+'ः', base+'भ्याम्', base+'भ्यः',
      baseHal+Nchar+'ः', baseHal+Nchar+'ोः', baseHal+Nchar+'ाम्',
      baseHal+Nchar+'ि', baseHal+Nchar+'ोः', base+'सु',
    ];
    return grid[(vib-1)*3 + (vac-1)];
  }
}

// in-stem (yogin-type)
function deriveInMascState(stem, vib, vac) {
  const tokens = tok(stem);
  const withoutN = tokens.slice(0, -1);
  const base = withoutN.map(t => t.text).join('');
  const tokens2 = tok(base);
  const last2 = tokens2[tokens2.length - 1];
  const prefix2 = tokens2.slice(0, -1).map(t => t.text).join('');
  const C2 = last2.cons;
  const nomSg = prefix2 + (C2 ? C2 + 'ी' : 'ई');
  const natva = hasNatvaTrigger(base);
  const N = natva ? 'ण' : 'न';
  const grid = [
    nomSg, base+N+'ौ', base+N+'ः',
    base+N+'म्', base+N+'ौ', base+N+'ः',
    base+N+'ा', base+'भ्याम्', base+'भिः',
    base+N+'े', base+'भ्याम्', base+'भ्यः',
    base+N+'ः', base+'भ्याम्', base+'भ्यः',
    base+N+'ः', base+N+'ोः', base+N+'ाम्',
    base+N+'ि', base+N+'ोः', base+'षु',
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

// ── at-stem (masc participle-type) ───────────────────────────────────────────
function deriveAtMascState(stem, vib, vac) {
  const tokens = tok(stem);
  const withoutT = tokens.slice(0, -1);
  const base = withoutT.map(t => t.text).join('');
  const bT = base + 'त';
  const bD_bhyam = base + 'द्भ्याम्';
  const bD_bhih  = base + 'द्भिः';
  const bD_bhyas = base + 'द्भ्यः';
  const bT_su    = base + 'त्सु';
  const FULL_DIRGHA_AT = new Set(['महत्', 'विश्वत्', 'भगवत्', 'शश्वत्']);
  const isFullDirgha = FULL_DIRGHA_AT.has(stem);
  const lastOfBase = withoutT[withoutT.length - 1];
  const prefixOfBase = withoutT.slice(0, -1).map(t => t.text).join('');
  const consOfBase = lastOfBase.cons;
  const longBase = prefixOfBase + (consOfBase ? consOfBase + 'ा' : 'आ');
  const nomSg = longBase + 'न्';
  const nomDu = (isFullDirgha ? longBase : base) + 'न्तौ';
  const nomPl = (isFullDirgha ? longBase : base) + 'न्तः';
  const accSg = (isFullDirgha ? longBase : base) + 'न्तम्';
  const accDu = (isFullDirgha ? longBase : base) + 'न्तौ';
  const grid = [
    nomSg, nomDu, nomPl,
    accSg, accDu, bT+'ः',
    bT+'ा', bD_bhyam, bD_bhih,
    bT+'े', bD_bhyam, bD_bhyas,
    bT+'ः', bD_bhyam, bD_bhyas,
    bT+'ः', bT+'ोः', bT+'ाम्',
    bT+'ि', bT+'ोः', bT_su,
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

// ── t-stem State derivation ───────────────────────────────────────────────────
function deriveTStemState(stem, vib, vac) {
  const tokens = tok(stem);
  const last = tokens[tokens.length - 1];
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const C = last.cons;
  const bT = prefix + C;
  const bD_bhyam = prefix + 'द्भ्याम्';
  const bD_bhih  = prefix + 'द्भिः';
  const bD_bhyas = prefix + 'द्भ्यः';
  const grid = [
    stem, bT+'ौ', bT+'ः',
    bT+'म्', bT+'ौ', bT+'ः',
    bT+'ा', bD_bhyam, bD_bhih,
    bT+'े', bD_bhyam, bD_bhyas,
    bT+'ः', bD_bhyam, bD_bhyas,
    bT+'ः', bT+'ोः', bT+'ाम्',
    bT+'ि', bT+'ोः', stem+'सु',
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

// ── d-stem State derivation ───────────────────────────────────────────────────
function deriveDStemState(stem, vib, vac) {
  const tokens = tok(stem);
  const last = tokens[tokens.length - 1];
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const C = last.cons;
  const bD = prefix + C;
  const nomSg = prefix + 'त्';
  const grid = [
    nomSg, bD+'ौ', bD+'ः',
    bD+'म्', bD+'ौ', bD+'ः',
    bD+'ा', prefix+'द्भ्याम्', prefix+'द्भिः',
    bD+'े', prefix+'द्भ्याम्', prefix+'द्भ्यः',
    bD+'ः', prefix+'द्भ्याम्', prefix+'द्भ्यः',
    bD+'ः', bD+'ोः', bD+'ाम्',
    bD+'ि', bD+'ोः', nomSg+'सु',
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

// ── r-hal State derivation ────────────────────────────────────────────────────
function deriveRHalState(stem, vib, vac) {
  const finalForm = deriveRHalFlat(stem, vib, vac);
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

function deriveRHalFlat(stem, vib, vac) {
  const tokens = tok(stem);
  const last = tokens[tokens.length - 1];
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const C = last.cons;
  const bR = prefix + C;
  const penult = tokens[tokens.length - 2];
  const penultVowel = penult ? penult.vowel : '';
  const shortToLong = {'इ':'ी','उ':'ू','अ':'ा','ए':'े','ऐ':'ै','ऋ':'ॄ','ि':'ी','ु':'ू'};
  const matra = shortToLong[penultVowel] || VOWEL_TO_MATRA[penultVowel] || '';
  const prePenult = tokens.slice(0, -2).map(t => t.text).join('');
  const penultCons = penult ? penult.cons : '';
  const longStem = prePenult + (penultCons ? penultCons + matra : (matra || penultVowel));
  const longStemR = longStem + C + HALANT;
  const nomSg = longStem + VISARGA;
  const locPl = longStem + VISARGA + 'षु';
  const grid = [
    nomSg, bR+'ौ', bR+'ः',
    bR+'म्', bR+'ौ', bR+'ः',
    bR+'ा', longStemR+'भ्याम्', longStemR+'भिः',
    bR+'े', longStemR+'भ्याम्', longStemR+'भ्यः',
    bR+'ः', longStemR+'भ्याम्', longStemR+'भ्यः',
    bR+'ः', bR+'ोः', bR+'ाम्',
    bR+'ि', bR+'ोः', locPl,
  ];
  return grid[(vib-1)*3 + (vac-1)];
}

// ── jaj-hal State derivation ──────────────────────────────────────────────────
function deriveJajHalState(stem, vib, vac) {
  const finalForm = deriveJajHalFlat(stem, vib, vac);
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

function deriveJajHalFlat(stem, vib, vac) {
  const tokens = tok(stem);
  const last = tokens[tokens.length - 1];
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const C = last.cons;
  const bJ = prefix + C;
  const penult = tokens.length >= 2 ? tokens[tokens.length - 2] : null;
  const penultVowel = penult ? penult.vowel : '';
  const syllables = tokens.filter(t => t.vowel).length;
  let grid;
  if (syllables === 1 && penultVowel === 'आ') {
    // prefix already ends in ā (e.g. 'रा'), so just append the final consonant
    grid = [
      prefix+'ट्', bJ+'ौ', bJ+'ः',
      bJ+'म्', bJ+'ौ', bJ+'ः',
      bJ+'ा', prefix+'ड्भ्याम्', prefix+'ड्भिः',
      bJ+'े', prefix+'ड्भ्याम्', prefix+'ड्भ्यः',
      bJ+'ः', prefix+'ड्भ्याम्', prefix+'ड्भ्यः',
      bJ+'ः', bJ+'ोः', bJ+'ाम्',
      bJ+'ि', bJ+'ोः', prefix+'ट्सु',
    ];
  } else if (penultVowel === 'उ' && syllables === 1) {
    const prefNoU = prefix;
    grid = [
      prefNoU+'ुङ्', prefNoU+'ुञ्जौ', prefNoU+'ुञ्जः',
      prefNoU+'ुञ्जम्', prefNoU+'ुञ्जौ', prefNoU+'ुजः',
      prefNoU+'ुजा', prefNoU+'ुग्भ्याम्', prefNoU+'ुग्भिः',
      prefNoU+'ुजे', prefNoU+'ुग्भ्याम्', prefNoU+'ुग्भ्यः',
      prefNoU+'ुजः', prefNoU+'ुग्भ्याम्', prefNoU+'ुग्भ्यः',
      prefNoU+'ुजः', prefNoU+'ुजोः', prefNoU+'ुजाम्',
      prefNoU+'ुजि', prefNoU+'ुजोः', prefNoU+'ुक्षु',
    ];
  } else {
    const baseG = bJ.slice(0, -1) + 'ग';
    grid = [
      baseG+'्', bJ+'ौ', bJ+'ः',
      bJ+'म्', bJ+'ौ', bJ+'ः',
      bJ+'ा', baseG+'्भ्याम्', baseG+'्भिः',
      bJ+'े', baseG+'्भ्याम्', baseG+'्भ्यः',
      bJ+'ः', baseG+'्भ्याम्', baseG+'्भ्यः',
      bJ+'ः', bJ+'ोः', bJ+'ाम्',
      bJ+'ि', bJ+'ोः', bJ.replace(/ज$/, 'क्')+'षु',
    ];
  }
  return grid[(vib-1)*3 + (vac-1)];
}

// ── haj-hal State derivation ──────────────────────────────────────────────────
function deriveHajHalState(stem, vib, vac) {
  const finalForm = deriveHajHalFlat(stem, vib, vac);
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

function deriveHajHalFlat(stem, vib, vac) {
  const tokens = tok(stem);
  const last = tokens[tokens.length - 1];
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const bH = prefix + 'ह';
  const penult = tokens.length >= 2 ? tokens[tokens.length - 2] : null;
  const penultVowel = penult ? penult.vowel : '';
  const isDuh = (prefix === 'द' || prefix === 'दु') && penultVowel === 'उ';
  let grid;
  if (isDuh) {
    const longPrefix = 'ध' + (penult ? VOWEL_TO_MATRA[penultVowel] || penultVowel : '');
    grid = [
      longPrefix+'ग्', bH+'ौ', bH+'ः',
      bH+'म्', bH+'ौ', bH+'ः',
      bH+'ा', longPrefix+'ग्भ्याम्', longPrefix+'ग्भिः',
      bH+'े', longPrefix+'ग्भ्याम्', longPrefix+'ग्भ्यः',
      bH+'ः', longPrefix+'ग्भ्याम्', longPrefix+'ग्भ्यः',
      bH+'ः', bH+'ोः', bH+'ाम्',
      bH+'ि', bH+'ोः', longPrefix+'क्षु',
    ];
  } else {
    const bHalD = prefix + 'ड्';
    grid = [
      bHalD, bH+'ौ', bH+'ः',
      bH+'म्', bH+'ौ', bH+'ः',
      bH+'ा', bHalD+'भ्याम्', bHalD+'भिः',
      bH+'े', bHalD+'भ्याम्', bHalD+'भ्यः',
      bH+'ः', bHalD+'भ्याम्', bHalD+'भ्यः',
      bH+'ः', bH+'ोः', bH+'ाम्',
      bH+'ि', bH+'ोः', prefix+'ट्सु',
    ];
  }
  return grid[(vib-1)*3 + (vac-1)];
}

// ── caj-hal State derivation ──────────────────────────────────────────────────
function deriveCajHalState(stem, vib, vac) {
  const tokens = tok(stem);
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const bC = prefix + 'च';
  const nomSg = prefix + 'क्';
  const bhyam = prefix + 'ग्भ्याम्';
  const bhih  = prefix + 'ग्भिः';
  const bhyas = prefix + 'ग्भ्यः';
  const locPl = prefix + 'क्षु';
  const grid = [
    nomSg, bC+'ौ', bC+'ः',
    bC+'म्', bC+'ौ', bC+'ः',
    bC+'ा', bhyam, bhih,
    bC+'े', bhyam, bhyas,
    bC+'ः', bhyam, bhyas,
    bC+'ः', bC+'ोः', bC+'ाम्',
    bC+'ि', bC+'ोः', locPl,
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

// ── sha-hal State derivation ──────────────────────────────────────────────────
function deriveShaHalState(stem, vib, vac) {
  const tokens = tok(stem);
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const bSh = prefix + 'श';
  const nomSg = prefix + 'क्';
  const bhyam = prefix + 'ग्भ्याम्';
  const locPl = prefix + 'क्षु';
  const grid = [
    nomSg, bSh+'ौ', bSh+'ः',
    bSh+'म्', bSh+'ौ', bSh+'ः',
    bSh+'ा', bhyam, prefix+'ग्भिः',
    bSh+'े', bhyam, prefix+'ग्भ्यः',
    bSh+'ः', bhyam, prefix+'ग्भ्यः',
    bSh+'ः', bSh+'ोः', bSh+'ाम्',
    bSh+'ि', bSh+'ोः', locPl,
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

// ── sha-satva-hal State derivation ───────────────────────────────────────────
function deriveShaSatvaHalState(stem, vib, vac) {
  const tokens = tok(stem);
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const bSh = prefix + 'ष';
  const nomSg = prefix + 'ट्';
  const bhyam = prefix + 'ड्भ्याम्';
  const locPl = prefix + 'ट्सु';
  const grid = [
    nomSg, bSh+'ौ', bSh+'ः',
    bSh+'म्', bSh+'ौ', bSh+'ः',
    bSh+'ा', bhyam, prefix+'ड्भिः',
    bSh+'े', bhyam, prefix+'ड्भ्यः',
    bSh+'ः', bhyam, prefix+'ड्भ्यः',
    bSh+'ः', bSh+'ोः', bSh+'ाम्',
    bSh+'ि', bSh+'ोः', locPl,
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

// ── paj-hal State derivation ──────────────────────────────────────────────────
function derivePajHalState(stem, vib, vac) {
  const tokens = tok(stem);
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const bP = prefix + 'प';
  const nomSg = prefix + 'प्';
  const bhyam = prefix + 'ब्भ्याम्';
  const locPl = prefix + 'प्सु';
  const grid = [
    nomSg, bP+'ौ', bP+'ः',
    bP+'म्', bP+'ौ', bP+'ः',
    bP+'ा', bhyam, prefix+'ब्भिः',
    bP+'े', bhyam, prefix+'ब्भ्यः',
    bP+'ः', bhyam, prefix+'ब्भ्यः',
    bP+'ः', bP+'ोः', bP+'ाम्',
    bP+'ि', bP+'ोः', locPl,
  ];
  const finalForm = grid[(vib-1)*3 + (vac-1)];
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

// ── s-masc State derivation ───────────────────────────────────────────────────
function deriveSMascState(stem, vib, vac) {
  const finalForm = deriveSMascFlat(stem, vib, vac);
  return stepsFromFlatSimple(stem, 'M', vib, vac, finalForm);
}

function deriveSMascFlat(stem, vib, vac) {
  const tokens = tok(stem);
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const bS = prefix + 'स';
  const penultTok = tokens.length >= 2 ? tokens[tokens.length - 2] : null;
  const prePenult = tokens.slice(0, -2).map(t => t.text).join('');
  const penultCons = penultTok ? penultTok.cons : '';
  const bO = prePenult + (penultCons ? penultCons + 'ो' : 'ओ');
  const bAA = prePenult + (penultCons ? penultCons + 'ा' : 'आ');
  const nomSg = bAA + VISARGA;
  const locPlFinal = bS.replace(/स$/, '') + VISARGA + 'सु';
  const grid = [
    nomSg, bS+'ौ', bS+'ः',
    bS+'म्', bS+'ौ', bS+'ः',
    bS+'ा', bO+'भ्याम्', bO+'भिः',
    bS+'े', bO+'भ्याम्', bO+'भ्यः',
    bS+'ः', bO+'भ्याम्', bO+'भ्यः',
    bS+'ः', bS+'ोः', bS+'ाम्',
    bS+'ि', bS+'ोः', locPlFinal,
  ];
  return grid[(vib-1)*3 + (vac-1)];
}

// ── s-neut State derivation ───────────────────────────────────────────────────
function deriveSNeutState(stem, vib, vac) {
  const finalForm = deriveSNeutFlat(stem, vib, vac);
  return stepsFromFlatSimple(stem, 'N', vib, vac, finalForm);
}

function deriveSNeutFlat(stem, vib, vac) {
  const tokens = tok(stem);
  const prefix = tokens.slice(0, -1).map(t => t.text).join('');
  const bS = prefix + 'स';
  const penultTok = tokens.length >= 2 ? tokens[tokens.length - 2] : null;
  const prePenult = tokens.slice(0, -2).map(t => t.text).join('');
  const penultCons = penultTok ? penultTok.cons : '';
  const bO = prePenult + (penultCons ? penultCons + 'ो' : 'ओ');
  const bShort = prePenult + (penultCons ? penultCons : '');
  const nomSg = bShort + VISARGA;
  const nomDu = bS + 'ी';
  const nomPlFinal = bShort + 'ांसि';
  const locPl = bShort + VISARGA + 'सु';
  const grid = [
    nomSg, nomDu, nomPlFinal,
    nomSg, nomDu, nomPlFinal,
    bS+'ा', bO+'भ्याम्', bO+'भिः',
    bS+'े', bO+'भ्याम्', bO+'भ्यः',
    bS+'ः', bO+'भ्याम्', bO+'भ्यः',
    bS+'ः', bS+'ोः', bS+'ाम्',
    bS+'ि', bS+'ोः', locPl,
  ];
  return grid[(vib-1)*3 + (vac-1)];
}

// ── vas-stem State derivation ─────────────────────────────────────────────────
function deriveVasStemState(stem, linga, vib, vac) {
  if (stem === 'विद्वस्') {
    let form;
    if (linga === 'M') {
      const grid = [
        'विद्वान्','विद्वांसौ','विद्वांसः',
        'विद्वांसम्','विद्वांसौ','विदुषः',
        'विदुषा','विद्वद्भ्याम्','विद्वद्भिः',
        'विदुषे','विद्वद्भ्याम्','विद्वद्भ्यः',
        'विदुषः','विद्वद्भ्याम्','विद्वद्भ्यः',
        'विदुषः','विदुषोः','विदुषाम्',
        'विदुषि','विदुषोः','विद्वत्सु',
      ];
      form = grid[(vib-1)*3 + (vac-1)];
    } else {
      const grid = [
        'विद्वत्','विदुषी','विद्वांसि',
        'विद्वत्','विदुषी','विद्वांसि',
        'विदुषा','विद्वद्भ्याम्','विद्वद्भिः',
        'विदुषे','विद्वद्भ्याम्','विद्वद्भ्यः',
        'विदुषः','विद्वद्भ्याम्','विद्वद्भ्यः',
        'विदुषः','विदुषोः','विदुषाम्',
        'विदुषि','विदुषोः','विद्वत्सु',
      ];
      form = grid[(vib-1)*3 + (vac-1)];
    }
    return hardcodedResult(form);
  }
  // Other vas-stems: fall back to t-stem
  return deriveTStemState(stem, vib, vac);
}

// ── Simple step builder for forms computed via flat logic ─────────────────────
// ── ṇa-final (णकारान्त) halant State derivation ──────────────────────────────
// Paradigm: the stem retains ण् halant before consonant-initial suffixes;
// the halant ् is dropped when vowel-initial suffixes follow (ण + औ = णौ etc.).
// Nom sg (and voc sg): 6.1.68 — apṛkta हल् (सु) drops after halant → stem्
// Loc pl: ण् + सु → ण्सु (no ṣatva: ṣatva needs a preceding vowel, not ण्)
// Gen pl: ण + आम् → णाम् (no nuṭ: nuṭ applies only to nadī/short vowel stems)
function deriveNaRetroHalState(stem, vib, vac) {
  // stem expected with final halant, e.g. 'सुगण्'
  const halantStem = stem.endsWith('्') ? stem : stem + '्';
  const bN = halantStem.slice(0, -1);  // without halant — used before vowel-initial sup
  const pos = `${vib},${vac}`;
  const steps = [];

  // The 21-position grid for ण-final (same pattern as generic halant consonant):
  // Rows: vib 1..7, Cols: vac 1..3
  // Nom/Voc sg = halantStem (apṛkta हल् drops by 6.1.68)
  const nomSg = halantStem;
  const grid = [
    // 1 (nom)
    nomSg,         bN+'औ',        bN+'ः',
    // 2 (acc)
    bN+'म्',       bN+'औ',        bN+'ः',
    // 3 (inst)
    bN+'ा',        halantStem+'भ्याम्', halantStem+'भिः',
    // 4 (dat)
    bN+'े',        halantStem+'भ्याम्', halantStem+'भ्यः',
    // 5 (abl)
    bN+'ः',        halantStem+'भ्याम्', halantStem+'भ्यः',
    // 6 (gen)
    bN+'ः',        bN+'ोः',       bN+'ाम्',
    // 7 (loc)
    bN+'ि',        bN+'ोः',       halantStem+'सु',
  ];
  const finalForm = grid[(vib - 1) * 3 + (vac - 1)];

  // Build steps
  const raw = RAW_SUP[pos];
  const operative = OPERATIVE_SUP[pos];
  const vibName = VIB_NAMES_EN[vib];
  const vacName = VAC_NAMES_EN[vac];

  steps.push({ rule: '4.1.2', note: `स्वौजसमौट्…: ${raw} (${vibName} ${vacName})`, form: halantStem + '+' + raw });

  if (raw !== operative) {
    const [itRule, itNote] = itRuleForSup(raw);
    steps.push({ rule: itRule, note: itNote, form: halantStem + '+' + raw });
    steps.push({ rule: '1.3.9', note: `तस्य लोपः: IT stripped → ${operative}`, form: halantStem + '+' + operative });
  }

  // Nom/Acc sg: apṛkta हल् (सु/अम् after halant) drops by 6.1.68
  if (pos === '1,1' || pos === '8,1') {
    steps.push({ rule: '6.1.68', note: 'हल्ङ्याब्भ्यो दीर्घात् सुतिस्यपृक्तं हल्: अपृक्त हल् (सु) लोपः', form: finalForm });
  } else if (pos === '2,1') {
    steps.push({ rule: '6.1.68', note: 'हल्ङ्याब्भ्यो दीर्घात् सुतिस्यपृक्तं हल्: अपृक्त हल् (म्) drops after halant… wait — अम् is not apṛkta', form: '' });
    // Actually अम् is NOT apṛkta (it has two sounds), so acc sg = bN+'म्' directly by sandhi
    steps.pop();
    steps.push({ rule: 'sandhi', note: `ण् + अम् → णम् (vowel-initial: halant joins)`, form: finalForm });
  } else if (finalForm.endsWith('ः') && operative.endsWith('स्')) {
    const withRu = halantStem + '+' + operative.replace(/स्$/, 'रुँ');
    const withR  = halantStem + '+' + operative.replace(/स्$/, 'र्');
    steps.push({ rule: '8.2.66', note: 'ससजुषो रुः: word-final स्→रुँ', form: withRu });
    steps.push({ rule: '1.3.9',  note: 'तस्य लोपः: IT (उँ) dropped → र्', form: withR });
    steps.push({ rule: '8.3.15', note: 'खरवसानयोर्विसर्जनीयः: word-final र्→ः', form: finalForm });
  } else if (finalForm !== halantStem + operative) {
    steps.push({ rule: 'sandhi', note: `phonological operations → ${finalForm}`, form: finalForm });
  }

  return { form: finalForm, steps };
}

function stepsFromFlatSimple(stem, linga, vib, vac, finalForm) {
  const pos = `${vib},${vac}`;
  const raw = RAW_SUP[pos];
  const operative = OPERATIVE_SUP[pos];
  const vibName = VIB_NAMES_EN[vib];
  const vacName = VAC_NAMES_EN[vac];
  const steps = [];

  steps.push({ rule: '4.1.2', note: `स्वौजसमौट्…: ${raw} (${vibName} ${vacName})`, form: stem + '+' + raw });

  if (raw !== operative) {
    const [itRule, itNote] = itRuleForSup(raw);
    steps.push({ rule: itRule, note: itNote, form: stem + '+' + raw });
    steps.push({ rule: '1.3.9', note: `तस्य लोपः: IT stripped → ${operative}`, form: stem + '+' + operative });
  }

  if (finalForm.endsWith('ः') && operative.endsWith('स्')) {
    const formAtS = stem + '+' + operative;
    const withRu = formAtS.replace(/स्$/, 'रुँ');
    const withR  = formAtS.replace(/स्$/, 'र्');
    steps.push({ rule: '8.2.66', note: 'ससजुषो रुः: word-final स्→रुँ', form: withRu });
    steps.push({ rule: '1.3.9',  note: 'तस्य लोपः: ह् (IT of रुँ) dropped → र्', form: withR });
    steps.push({ rule: '8.3.15', note: 'खरवसानयोर्विसर्जनीयः: word-final र्→ः', form: finalForm });
  } else if (finalForm !== stem + operative.replace(/^\+/, '')) {
    steps.push({ rule: 'sandhi', note: `phonological operations → ${finalForm}`, form: finalForm });
  }

  return { form: finalForm, steps };
}

// ── Main derive function ──────────────────────────────────────────────────────
function deriveOne(stem, linga, vib, vac) {
  const key = stem + '|' + linga;

  // Special stems: hardcoded forms, minimal steps
  if (SPECIAL_STEMS[key]) {
    const grid = SPECIAL_STEMS[key];
    const form = grid[vib - 1][vac - 1];
    return hardcodedResult(form);
  }

  const sc = stemClass(stem, linga);

  // State-based derivation for all stem classes
  if (sc === 'a_masc') return deriveAMascState(stem, vib, vac);
  if (sc === 'a_neut') return deriveANeutState(stem, vib, vac);
  if (sc === 'aa_fem') return deriveAAFemState(stem, vib, vac);
  if (sc === 'i_masc') return deriveIMascState(stem, vib, vac);
  if (sc === 'i_fem')  return deriveIFemState(stem, vib, vac);
  if (sc === 'i_neut') return deriveINeutState(stem, vib, vac);
  if (sc === 'u_masc') return deriveUMascState(stem, vib, vac);
  if (sc === 'u_fem')  return deriveUFemState(stem, vib, vac);
  if (sc === 'u_neut') return deriveUNeutState(stem, vib, vac);
  if (sc === 'ii_fem') return deriveIIFemState(stem, vib, vac);
  if (sc === 'ii_mono') return deriveIIMonoState(stem, vib, vac);
  if (sc === 'uu_fem') return deriveUUFemState(stem, vib, vac);
  if (sc === 'uu_mono') return deriveUUMonoState(stem, vib, vac);
  if (sc === 'r_masc') return deriveRMascState(stem, vib, vac);
  if (sc === 'r_fem')  return deriveRFemState(stem, vib, vac);
  if (sc === 'n_stem') return deriveNStemState(stem, vib, vac);
  if (sc === 'in_masc') return deriveInMascState(stem, vib, vac);
  if (sc === 'at_masc') return deriveAtMascState(stem, vib, vac);
  if (sc === 't_stem') return deriveTStemState(stem, vib, vac);
  if (sc === 'd_stem') return deriveDStemState(stem, vib, vac);
  if (sc === 'r_hal')  return deriveRHalState(stem, vib, vac);
  if (sc === 'jaj_hal') return deriveJajHalState(stem, vib, vac);
  if (sc === 'haj_hal') return deriveHajHalState(stem, vib, vac);
  if (sc === 'caj_hal') return deriveCajHalState(stem, vib, vac);
  if (sc === 'sha_hal') return deriveShaHalState(stem, vib, vac);
  if (sc === 'sha_satva_hal') return deriveShaSatvaHalState(stem, vib, vac);
  if (sc === 'paj_hal') return derivePajHalState(stem, vib, vac);
  if (sc === 's_masc') return deriveSMascState(stem, vib, vac);
  if (sc === 's_neut') return deriveSNeutState(stem, vib, vac);
  if (sc === 'vas_stem') return deriveVasStemState(stem, linga, vib, vac);
  if (sc === 'na_retro_hal') return deriveNaRetroHalState(stem, vib, vac);

  throw new Error('Unknown stem class: ' + sc);
}


// ── Public API ────────────────────────────────────────────────────────────────
const Subanta = {
  derive(stem, linga, vib, vac) {
    return deriveOne(stem, linga, vib, vac);
  },

  paradigm(stem, linga) {
    const grid = [];
    for (let vib = 1; vib <= 7; vib++) {
      const row = [];
      for (let vac = 1; vac <= 3; vac++) {
        row.push(deriveOne(stem, linga, vib, vac));
      }
      grid.push(row);
    }
    return grid;
  },

  stemClass(stem, linga) {
    return stemClass(stem, linga);
  },
};

global.Subanta = Subanta;

// ── Self-test (Node.js only) ──────────────────────────────────────────────────
if (typeof module !== 'undefined') {
  const tests = [
    { stem: 'राम',    linga: 'M', pos: [1,1], exp: 'रामः' },
    { stem: 'राम',    linga: 'M', pos: [1,3], exp: 'रामाः' },
    { stem: 'राम',    linga: 'M', pos: [3,1], exp: 'रामेण' },
    { stem: 'राम',    linga: 'M', pos: [6,3], exp: 'रामाणाम्' },
    { stem: 'राम',    linga: 'M', pos: [7,3], exp: 'रामेषु' },
    { stem: 'फल',     linga: 'N', pos: [1,1], exp: 'फलम्' },
    { stem: 'फल',     linga: 'N', pos: [1,3], exp: 'फलानि' },
    { stem: 'सीता',   linga: 'F', pos: [1,1], exp: 'सीता' },
    { stem: 'सीता',   linga: 'F', pos: [3,1], exp: 'सीतया' },
    { stem: 'अग्नि',  linga: 'M', pos: [1,1], exp: 'अग्निः' },
    { stem: 'अग्नि',  linga: 'M', pos: [4,1], exp: 'अग्नये' },
    { stem: 'भानु',   linga: 'M', pos: [1,1], exp: 'भानुः' },
    { stem: 'भानु',   linga: 'M', pos: [4,1], exp: 'भानवे' },
    { stem: 'विपद्',  linga: 'F', pos: [1,1], exp: 'विपत्' },
    { stem: 'गिर्',   linga: 'F', pos: [1,1], exp: 'गीः' },
    { stem: 'गो',     linga: 'F', pos: [2,1], exp: 'गाम्' },
    { stem: 'नदी',    linga: 'F', pos: [1,1], exp: 'नदी' },
    { stem: 'नदी',    linga: 'F', pos: [3,1], exp: 'नद्या' },
    { stem: 'आत्मन्', linga: 'M', pos: [1,1], exp: 'आत्मा' },
    { stem: 'राजन्',  linga: 'M', pos: [3,1], exp: 'राज्ञा' },
    { stem: 'तद्',    linga: 'M', pos: [1,1], exp: 'सः' },
    { stem: 'अस्मद्', linga: 'M', pos: [1,1], exp: 'अहम्' },
  ];
  let pass = 0, fail = 0;
  for (const t of tests) {
    const r = Subanta.derive(t.stem, t.linga, t.pos[0], t.pos[1]);
    const got = r.form || r; // handle both old string and new {form,steps}
    if (got === t.exp) {
      pass++;
    } else {
      console.error(`FAIL: ${t.stem}(${t.linga}) [${t.pos}]: got "${got}", expected "${t.exp}"`);
      fail++;
    }
  }
  console.log(`Subanta self-test: ${pass} passed, ${fail} failed`);

  // Step count tests
  const r = Subanta.derive('राम', 'M', 1, 1);
  console.assert(r.form === 'रामः', 'form check');
  console.assert(r.steps.length >= 2, 'steps check: got ' + r.steps.length);
  console.assert(r.steps[r.steps.length-1].form === 'रामः', 'last step = final form');
  console.log('Step test: रामः steps=' + r.steps.length + ', last=' + r.steps[r.steps.length-1].form);
}

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
