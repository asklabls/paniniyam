/**
 * shabda.js — Paninian subanta (nominal declension) engine
 *
 * Position system: 11–83
 * ─────────────────────────────────────────────────────────────────────────────
 *  tens digit  = vibhakti  (1=प्रथमा … 7=सप्तमी, 8=सम्बुद्धि)
 *  units digit = vacana    (1=एकवचन, 2=द्विवचन, 3=बहुवचन)
 *
 *  11 12 13  ← प्रथमा    (सर्वनामस्थान)
 *  21 22 23  ← द्वितीया  (सर्वनामस्थान)
 *  31 32 33  ← तृतीया
 *  41 42 43  ← चतुर्थी
 *  51 52 53  ← पञ्चमी
 *  61 62 63  ← षष्ठी
 *  71 72 73  ← सप्तमी
 *  81 82 83  ← सम्बुद्धि  (11=81, 12=82, 13=83)
 *
 * Rules are added one at a time from ShabdaGenerator_rules.md.
 */

'use strict';

const Shabda = (() => {

  // ── 21 Sup-pratyayas ────────────────────────────────────────────────────────
  const SUP = [
    { n:  1, orig: 'सुँ',     raw: 'स्',      pos: 11, sarva: true,  ajadi: false, bha: false, pada: false },
    { n:  2, orig: 'औ',      raw: 'औ',       pos: 12, sarva: true,  ajadi: true,  bha: false, pada: false },
    { n:  3, orig: 'जस्',    raw: 'अस्',     pos: 13, sarva: true,  ajadi: true,  bha: false, pada: false },
    { n:  4, orig: 'अम्',    raw: 'अम्',     pos: 21, sarva: true,  ajadi: true,  bha: false, pada: false },
    { n:  5, orig: 'औट्',    raw: 'औट्',     pos: 22, sarva: true,  ajadi: true,  bha: false, pada: false },
    { n:  6, orig: 'शस्',    raw: 'अस्',     pos: 23, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n:  7, orig: 'टा',     raw: 'आ',       pos: 31, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n:  8, orig: 'भ्याम्', raw: 'भ्याम्',  pos: 32, sarva: false, ajadi: false, bha: false, pada: true  },
    { n:  9, orig: 'भिस्',   raw: 'भिस्',    pos: 33, sarva: false, ajadi: false, bha: false, pada: true  },
    { n: 10, orig: 'ङेँ',    raw: 'ए',       pos: 41, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n: 11, orig: 'भ्याम्', raw: 'भ्याम्',  pos: 42, sarva: false, ajadi: false, bha: false, pada: true  },
    { n: 12, orig: 'भ्यस्',  raw: 'भ्यस्',   pos: 43, sarva: false, ajadi: false, bha: false, pada: true  },
    { n: 13, orig: 'ङसिँ',   raw: 'अस्',     pos: 51, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n: 14, orig: 'भ्याम्', raw: 'भ्याम्',  pos: 52, sarva: false, ajadi: false, bha: false, pada: true  },
    { n: 15, orig: 'भ्यस्',  raw: 'भ्यस्',   pos: 53, sarva: false, ajadi: false, bha: false, pada: true  },
    { n: 16, orig: 'ङँस्',   raw: 'अस्',     pos: 61, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n: 17, orig: 'ओस्',    raw: 'ओस्',     pos: 62, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n: 18, orig: 'आम्',    raw: 'आम्',     pos: 63, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n: 19, orig: 'ङि',     raw: 'इ',       pos: 71, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n: 20, orig: 'ओस्',    raw: 'ओस्',     pos: 72, sarva: false, ajadi: true,  bha: true,  pada: false },
    { n: 21, orig: 'सुप्',   raw: 'सुप्',    pos: 73, sarva: false, ajadi: false, bha: false, pada: true  },
  ];

  const SUP_BY_POS = {};
  SUP.forEach(s => { SUP_BY_POS[s.pos] = s; });
  SUP_BY_POS[81] = SUP[0];
  SUP_BY_POS[82] = SUP[1];
  SUP_BY_POS[83] = SUP[2];

  const POS_ORDER = [11,12,13, 21,22,23, 31,32,33, 41,42,43,
                     51,52,53, 61,62,63, 71,72,73, 81,82,83];

  const VIB_LABEL = {
    1:'प्रथमा', 2:'द्वितीया', 3:'तृतीया', 4:'चतुर्थी',
    5:'पञ्चमी', 6:'षष्ठी',   7:'सप्तमी', 8:'सम्बुद्धि'
  };
  const VAC_LABEL = { 1:'एकवचन', 2:'द्विवचन', 3:'बहुवचन' };

  function posLabel(pos) {
    return VIB_LABEL[Math.floor(pos / 10)] + ' ' + VAC_LABEL[pos % 10];
  }


  // ── Step 4: ending validity matrix ──────────────────────────────────────────
  const ENDING_VALID = {
    'क्':[0,0,0],'ख्':[0,0,0],'ग्':[0,0,0],'घ्':[0,0,0],'ङ्':[0,0,0],
    'छ्':[0,0,0],'झ्':[0,0,0],'ञ्':[0,0,0],'ठ्':[0,0,0],
    'ड्':[0,0,0],'ढ्':[0,0,0],'फ्':[0,0,0],'ब्':[0,0,0],'य्':[0,0,0],
    'च्':[1,1,1],'ज्':[1,1,1],'ण्':[1,1,1],'त्':[1,1,1],'द्':[1,1,1],
    'न्':[1,1,1],'प्':[1,1,1],'म्':[1,1,1],'र्':[1,1,1],'व्':[1,1,1],
    'श्':[1,1,1],'ष्':[1,1,1],'स्':[1,1,1],'ह्':[1,1,1],
    'थ्':[1,0,0],
    'ध्':[1,1,0],
    'भ्':[1,1,0],
    'ट्':[1,1,0],
    'ल्':[1,null,null],
    'अ': [1,1,0],
    'आ': [1,1,1],
    'इ': [1,1,1],
    'ई': [1,1,1],
    'उ': [1,1,1],
    'ऊ': [1,1,1],
    'ऋ': [1,1,1],
    'ऐ': [1,1,1],
    'ओ': [1,1,1],
    'औ': [1,1,1],
    'ॠ': [1,0,0],
    'ए': [1,1,0],
  };

  const LINGA_INDEX = { 'pum': 0, 'napum': 1, 'stri': 2 };

  // ── Step 14: वर्णमाला ────────────────────────────────────────────────────────
  const VARGA = [
    ['क्', 'ख्', 'ग्', 'घ्', 'ङ्'],
    ['च्', 'छ्', 'ज्', 'झ्', 'ञ्'],
    ['ट्', 'ठ्', 'ड्', 'ढ्', 'ण्'],
    ['त्', 'थ्', 'द्', 'ध्', 'न्'],
    ['प्', 'फ्', 'ब्', 'भ्', 'म्'],
  ];

  const VARNA_INFO = {};
  VARGA.forEach((row, v) => row.forEach((c, p) => { VARNA_INFO[c] = { v, p }; }));

  // Step 15: jash — optional Group I → Group III at pos 11 when स् drops
  function jash(halant) {
    const info = VARNA_INFO[halant];
    if (!info || info.p !== 0) return null;
    return VARGA[info.v][2];
  }

  // ── Rule 22: यञ् दीर्घ ───────────────────────────────────────────────────────
  // अकारान्त stems only. When the pratyaya (raw) starts with a यञ् consonant,
  // the final अ of the stem becomes आ (दीर्घ).
  // Suppressed at positions where other substitutions take priority (yanch:false).
  const YANCH = new Set(['य्','व्','र्','ल्','ङ्','ञ्','ण्','न्','म्','झ्','भ्']);

  function isYanch(raw) {
    return raw.length >= 2 && YANCH.has(raw.slice(0, 2));
  }

  const AA_MATRA = '\u093E';
  function akarantDirgha(stem) { return stem + AA_MATRA; }

  // ── Stem ending detection ────────────────────────────────────────────────────
  const MATRA_TO_SVAR = {
    '\u093E':'आ', '\u093F':'इ', '\u0940':'ई',
    '\u0941':'उ', '\u0942':'ऊ', '\u0943':'ऋ', '\u0944':'ॠ',
    '\u0948':'ऐ', '\u094B':'ओ', '\u094C':'औ', '\u0947':'ए',
  };

  function stemEnding(stem) {
    if (!stem) return null;
    if (stem.endsWith('्')) return stem.slice(-2);
    const last = stem.slice(-1);
    if (MATRA_TO_SVAR[last]) return MATRA_TO_SVAR[last];
    if ('अआइईउऊऋॠऌएऐओऔ'.includes(last)) return last;
    return 'अ';
  }

  function endingValid(stem, linga) {
    const ending = stemEnding(stem);
    if (!ending) return null;
    const row = ENDING_VALID[ending];
    if (!row) return null;
    return row[LINGA_INDEX[linga]];
  }

  const finalConsonant = stem => stem.endsWith('्') ? stem.slice(-2) : null;
  const halValid = (fc, linga) => endingValid(fc, linga);


  // ════════════════════════════════════════════════════════════════════════════
  // PARADIGM TABLES
  // Each entry: { ending, sandhi, ref, yanch? }
  //   yanch:false  — suppress rule 22 at this position even if isYanch() is true
  // ════════════════════════════════════════════════════════════════════════════

  // ── ण्-अन्त पुंलिङ्ग (e.g. सुगण्) ─────────────────────────────────────────
  const HAL_N_PUM = {
    11: { ending: '', sandhi: 'हल् + स् → हल् (स्-लोप)', ref: 'TBD' },
  };

  // ── अकारान्त पुंलिङ्ग (e.g. राम, देव) ──────────────────────────────────────
  // Rule 22 fires at 32, 42, 52 (भ्याम् starts with भ्).
  // Suppressed at 43, 53 (भ्यस् starts with भ् but different sandhi applies).
  // NOTE: ṇatva (8.4.1) not yet implemented — pos 31/63 use dental न for all stems.
  const A_MASC = {
    11: { ending: 'ः',       sandhi: 'अ+स्→ः',                          ref: 'TBD' },
    12: { ending: 'ौ',       sandhi: 'अ+औ→औ',                           ref: 'TBD' },
    13: { ending: 'ाः',      sandhi: 'अ+अस्→आः',                         ref: 'TBD' },
    21: { ending: 'म्',      sandhi: 'अ+अम्→अम्',                        ref: 'TBD' },
    22: { ending: 'ौ',       sandhi: 'अ+औट्→औ',                          ref: 'TBD' },
    23: { ending: 'ान्',     sandhi: 'अ+अस्→आन् (masc शस्→न्)',          ref: 'TBD' },
    31: { ending: 'ेन',      sandhi: 'अ+आ→ए + ण (ṇatva TBD)',           ref: 'TBD' },
    32: { ending: 'भ्याम्',  sandhi: 'rule22: अ→आ + भ्याम्',             ref: 'TBD' },
    33: { ending: 'ैः',      sandhi: 'भिस्→ऐस् for अकारान्त',           ref: 'TBD' },
    41: { ending: 'ाय',      sandhi: 'अ+ए→आय',                           ref: 'TBD' },
    42: { ending: 'भ्याम्',  sandhi: 'rule22: अ→आ + भ्याम्',             ref: 'TBD' },
    43: { ending: 'ेभ्यः',   sandhi: 'अकारान्त special → ेभ्यः',         ref: 'TBD', yanch: false },
    51: { ending: 'ात्',     sandhi: 'अ+अस्→आत् (ablative)',            ref: 'TBD' },
    52: { ending: 'भ्याम्',  sandhi: 'rule22: अ→आ + भ्याम्',             ref: 'TBD' },
    53: { ending: 'ेभ्यः',   sandhi: 'अकारान्त special → ेभ्यः',         ref: 'TBD', yanch: false },
    61: { ending: 'स्य',     sandhi: 'genitive sg अकारान्त',              ref: 'TBD' },
    62: { ending: 'योः',     sandhi: 'genitive du',                      ref: 'TBD' },
    63: { ending: 'ानाम्',   sandhi: 'genitive pl (ṇatva TBD)',          ref: 'TBD' },
    71: { ending: 'े',       sandhi: 'locative sg',                      ref: 'TBD' },
    72: { ending: 'योः',     sandhi: 'locative du',                      ref: 'TBD' },
    73: { ending: 'ेषु',     sandhi: 'locative pl',                      ref: 'TBD' },
    81: { ending: '',        sandhi: 'sambuddhi लोप for अकारान्त',        ref: 'TBD' },
    82: { ending: 'ौ',       sandhi: 'sambuddhi du = prathamā du',       ref: 'TBD' },
    83: { ending: 'ाः',      sandhi: 'sambuddhi pl = prathamā pl',       ref: 'TBD' },
  };

  // ── अकारान्त नपुंसकलिङ्ग (e.g. फल, वन) ─────────────────────────────────────
  // Same as a-masc except: 11/21/81=म्; 12/22/82=े; 13/23/83=ानि; 63=ानाम् (no ṇatva).
  const A_NEUT = {
    11: { ending: 'म्',      sandhi: 'neut nom sg',                      ref: 'TBD' },
    12: { ending: 'े',       sandhi: 'neut nom du',                      ref: 'TBD' },
    13: { ending: 'ानि',     sandhi: 'neut nom pl (शि→अनि)',             ref: 'TBD' },
    21: { ending: 'म्',      sandhi: 'neut acc sg = nom sg',             ref: 'TBD' },
    22: { ending: 'े',       sandhi: 'neut acc du = nom du',             ref: 'TBD' },
    23: { ending: 'ानि',     sandhi: 'neut acc pl = nom pl',             ref: 'TBD' },
    31: { ending: 'ेन',      sandhi: 'अ+आ→ए + न',                        ref: 'TBD' },
    32: { ending: 'भ्याम्',  sandhi: 'rule22: अ→आ + भ्याम्',             ref: 'TBD' },
    33: { ending: 'ैः',      sandhi: 'भिस्→ऐस् for अकारान्त',           ref: 'TBD' },
    41: { ending: 'ाय',      sandhi: 'dative sg',                        ref: 'TBD' },
    42: { ending: 'भ्याम्',  sandhi: 'rule22: अ→आ + भ्याम्',             ref: 'TBD' },
    43: { ending: 'ेभ्यः',   sandhi: 'dative pl',                        ref: 'TBD', yanch: false },
    51: { ending: 'ात्',     sandhi: 'ablative sg',                      ref: 'TBD' },
    52: { ending: 'भ्याम्',  sandhi: 'rule22: अ→आ + भ्याम्',             ref: 'TBD' },
    53: { ending: 'ेभ्यः',   sandhi: 'ablative pl',                      ref: 'TBD', yanch: false },
    61: { ending: 'स्य',     sandhi: 'genitive sg',                      ref: 'TBD' },
    62: { ending: 'योः',     sandhi: 'genitive du',                      ref: 'TBD' },
    63: { ending: 'ानाम्',   sandhi: 'genitive pl',                      ref: 'TBD' },
    71: { ending: 'े',       sandhi: 'locative sg',                      ref: 'TBD' },
    72: { ending: 'योः',     sandhi: 'locative du',                      ref: 'TBD' },
    73: { ending: 'ेषु',     sandhi: 'locative pl',                      ref: 'TBD' },
    81: { ending: 'म्',      sandhi: 'neut sambuddhi = nom sg',          ref: 'TBD' },
    82: { ending: 'े',       sandhi: 'neut sambuddhi du',                ref: 'TBD' },
    83: { ending: 'ानि',     sandhi: 'neut sambuddhi pl',                ref: 'TBD' },
  };

  // ── आकारान्त स्त्रीलिङ्ग (e.g. लता, सीता) ───────────────────────────────────
  // prepStem strips ā-matra (ा). No rule 22 (not अकारान्त).
  const AA_STRI = {
    11: { ending: 'ा',       sandhi: 'ā-stem nom sg',                    ref: 'TBD' },
    12: { ending: 'े',       sandhi: 'nom du',                           ref: 'TBD' },
    13: { ending: 'ाः',      sandhi: 'nom pl',                           ref: 'TBD' },
    21: { ending: 'ाम्',     sandhi: 'acc sg',                           ref: 'TBD' },
    22: { ending: 'े',       sandhi: 'acc du',                           ref: 'TBD' },
    23: { ending: 'ाः',      sandhi: 'acc pl',                           ref: 'TBD' },
    31: { ending: 'या',      sandhi: 'ā+ā→ayā (instr sg)',               ref: 'TBD' },
    32: { ending: 'ाभ्याम्', sandhi: 'instr du',                         ref: 'TBD' },
    33: { ending: 'ाभिः',    sandhi: 'instr pl',                         ref: 'TBD' },
    41: { ending: 'ायै',     sandhi: 'dat sg',                           ref: 'TBD' },
    42: { ending: 'ाभ्याम्', sandhi: 'dat du',                           ref: 'TBD' },
    43: { ending: 'ाभ्यः',   sandhi: 'dat pl',                           ref: 'TBD' },
    51: { ending: 'ायाः',    sandhi: 'abl sg',                           ref: 'TBD' },
    52: { ending: 'ाभ्याम्', sandhi: 'abl du',                           ref: 'TBD' },
    53: { ending: 'ाभ्यः',   sandhi: 'abl pl',                           ref: 'TBD' },
    61: { ending: 'ायाः',    sandhi: 'gen sg',                           ref: 'TBD' },
    62: { ending: 'योः',     sandhi: 'gen du',                           ref: 'TBD' },
    63: { ending: 'ानाम्',   sandhi: 'gen pl',                           ref: 'TBD' },
    71: { ending: 'ायाम्',   sandhi: 'loc sg',                           ref: 'TBD' },
    72: { ending: 'योः',     sandhi: 'loc du',                           ref: 'TBD' },
    73: { ending: 'ासु',     sandhi: 'loc pl',                           ref: 'TBD' },
    81: { ending: 'े',       sandhi: 'sambuddhi ā-stem → e',             ref: 'TBD' },
    82: { ending: 'े',       sandhi: 'sambuddhi du',                     ref: 'TBD' },
    83: { ending: 'ाः',      sandhi: 'sambuddhi pl',                     ref: 'TBD' },
  };

  // ── इकारान्त पुंलिङ्ग (e.g. कवि, मुनि, अग्नि) ──────────────────────────────
  // prepStem strips ि-matra. Guṇa (इ→ए/य्) at 13, 41, 51, 61, 81.
  const I_MASC = {
    11: { ending: 'िः',      sandhi: 'इ+स्→इः',                          ref: 'TBD' },
    12: { ending: 'ी',       sandhi: 'nom du ī',                         ref: 'TBD' },
    13: { ending: 'यः',      sandhi: 'guṇa इ→ए, याण् → यः',             ref: 'TBD' },
    21: { ending: 'िम्',     sandhi: 'acc sg',                           ref: 'TBD' },
    22: { ending: 'ी',       sandhi: 'acc du',                           ref: 'TBD' },
    23: { ending: 'ीन्',     sandhi: 'acc pl masc (dīrgha)',             ref: 'TBD' },
    31: { ending: 'िना',     sandhi: 'instr sg',                         ref: 'TBD' },
    32: { ending: 'िभ्याम्', sandhi: 'instr du',                         ref: 'TBD' },
    33: { ending: 'िभिः',    sandhi: 'instr pl',                         ref: 'TBD' },
    41: { ending: 'ये',      sandhi: 'guṇa इ→ए → ये',                   ref: 'TBD' },
    42: { ending: 'िभ्याम्', sandhi: 'dat du',                           ref: 'TBD' },
    43: { ending: 'िभ्यः',   sandhi: 'dat pl',                           ref: 'TBD' },
    51: { ending: 'ेः',      sandhi: 'guṇa इ→ए + ः',                    ref: 'TBD' },
    52: { ending: 'िभ्याम्', sandhi: 'abl du',                           ref: 'TBD' },
    53: { ending: 'िभ्यः',   sandhi: 'abl pl',                           ref: 'TBD' },
    61: { ending: 'ेः',      sandhi: 'gen sg (same as abl)',             ref: 'TBD' },
    62: { ending: '्योः',    sandhi: 'इ+ओस् → य्+ओः',                   ref: 'TBD' },
    63: { ending: 'ीनाम्',   sandhi: 'gen pl',                           ref: 'TBD' },
    71: { ending: 'ौ',       sandhi: 'loc sg (इ+इ→औ)',                  ref: 'TBD' },
    72: { ending: '्योः',    sandhi: 'loc du',                           ref: 'TBD' },
    73: { ending: 'िषु',     sandhi: 'loc pl',                           ref: 'TBD' },
    81: { ending: 'े',       sandhi: 'sambuddhi guṇa इ→ए',              ref: 'TBD' },
    82: { ending: 'ी',       sandhi: 'sambuddhi du',                     ref: 'TBD' },
    83: { ending: 'यः',      sandhi: 'sambuddhi pl',                     ref: 'TBD' },
  };

  // ── इकारान्त स्त्रीलिङ्ग (e.g. मति, शक्ति) ─────────────────────────────────
  // Differs from i-masc at 23 (ीः vs ीन्) and 31 (्या vs िना).
  const I_STRI = {
    11: { ending: 'िः',      sandhi: 'nom sg',                           ref: 'TBD' },
    12: { ending: 'ी',       sandhi: 'nom du',                           ref: 'TBD' },
    13: { ending: 'यः',      sandhi: 'guṇa → यः',                       ref: 'TBD' },
    21: { ending: 'िम्',     sandhi: 'acc sg',                           ref: 'TBD' },
    22: { ending: 'ी',       sandhi: 'acc du',                           ref: 'TBD' },
    23: { ending: 'ीः',      sandhi: 'acc pl stri (dīrgha+ḥ)',          ref: 'TBD' },
    31: { ending: '्या',     sandhi: 'इ+आ → य्+आ (instr sg stri)',      ref: 'TBD' },
    32: { ending: 'िभ्याम्', sandhi: 'instr du',                         ref: 'TBD' },
    33: { ending: 'िभिः',    sandhi: 'instr pl',                         ref: 'TBD' },
    41: { ending: 'ये',      sandhi: 'dat sg guṇa',                     ref: 'TBD' },
    42: { ending: 'िभ्याम्', sandhi: 'dat du',                           ref: 'TBD' },
    43: { ending: 'िभ्यः',   sandhi: 'dat pl',                           ref: 'TBD' },
    51: { ending: 'ेः',      sandhi: 'abl sg',                           ref: 'TBD' },
    52: { ending: 'िभ्याम्', sandhi: 'abl du',                           ref: 'TBD' },
    53: { ending: 'िभ्यः',   sandhi: 'abl pl',                           ref: 'TBD' },
    61: { ending: 'ेः',      sandhi: 'gen sg',                           ref: 'TBD' },
    62: { ending: '्योः',    sandhi: 'gen du',                           ref: 'TBD' },
    63: { ending: 'ीनाम्',   sandhi: 'gen pl',                           ref: 'TBD' },
    71: { ending: 'ौ',       sandhi: 'loc sg',                           ref: 'TBD' },
    72: { ending: '्योः',    sandhi: 'loc du',                           ref: 'TBD' },
    73: { ending: 'िषु',     sandhi: 'loc pl',                           ref: 'TBD' },
    81: { ending: 'े',       sandhi: 'sambuddhi guṇa',                  ref: 'TBD' },
    82: { ending: 'ी',       sandhi: 'sambuddhi du',                     ref: 'TBD' },
    83: { ending: 'यः',      sandhi: 'sambuddhi pl',                     ref: 'TBD' },
  };

  // ── ईकारान्त स्त्रीलिङ्ग / नदी (e.g. नदी, देवी) ────────────────────────────
  // prepStem strips ी-matra. Semivowel य् at 12/13/22/31/41/51/61/71/72.
  // sambuddhi 81 = short ि (nityastrī: long ī → short i).
  const II_STRI = {
    11: { ending: 'ी',       sandhi: 'nom sg (stem itself)',             ref: 'TBD' },
    12: { ending: '्यौ',     sandhi: 'ī+औ → य्+औ',                    ref: 'TBD' },
    13: { ending: '्यः',     sandhi: 'ī+अस् → य्+ः',                   ref: 'TBD' },
    21: { ending: 'ीम्',     sandhi: 'acc sg',                           ref: 'TBD' },
    22: { ending: '्यौ',     sandhi: 'acc du',                           ref: 'TBD' },
    23: { ending: 'ीः',      sandhi: 'acc pl (dīrgha+ḥ)',               ref: 'TBD' },
    31: { ending: '्या',     sandhi: 'ī+आ → य्+आ',                     ref: 'TBD' },
    32: { ending: 'ीभ्याम्', sandhi: 'instr du',                         ref: 'TBD' },
    33: { ending: 'ीभिः',    sandhi: 'instr pl',                         ref: 'TBD' },
    41: { ending: '्यै',     sandhi: 'dat sg',                           ref: 'TBD' },
    42: { ending: 'ीभ्याम्', sandhi: 'dat du',                           ref: 'TBD' },
    43: { ending: 'ीभ्यः',   sandhi: 'dat pl',                           ref: 'TBD' },
    51: { ending: '्याः',    sandhi: 'abl sg',                           ref: 'TBD' },
    52: { ending: 'ीभ्याम्', sandhi: 'abl du',                           ref: 'TBD' },
    53: { ending: 'ीभ्यः',   sandhi: 'abl pl',                           ref: 'TBD' },
    61: { ending: '्याः',    sandhi: 'gen sg',                           ref: 'TBD' },
    62: { ending: '्योः',    sandhi: 'gen du',                           ref: 'TBD' },
    63: { ending: 'ीनाम्',   sandhi: 'gen pl',                           ref: 'TBD' },
    71: { ending: '्याम्',   sandhi: 'loc sg',                           ref: 'TBD' },
    72: { ending: '्योः',    sandhi: 'loc du',                           ref: 'TBD' },
    73: { ending: 'ीषु',     sandhi: 'loc pl',                           ref: 'TBD' },
    81: { ending: 'ि',       sandhi: 'sambuddhi: dīrgha ī → hrasva ि',  ref: 'TBD' },
    82: { ending: '्यौ',     sandhi: 'sambuddhi du',                     ref: 'TBD' },
    83: { ending: '्यः',     sandhi: 'sambuddhi pl',                     ref: 'TBD' },
  };

  // ── उकारान्त पुंलिङ्ग (e.g. साधु, भानु) ─────────────────────────────────────
  // prepStem strips ु-matra. Guṇa (उ→ो/व्) at 13, 41, 51, 61, 81.
  const U_MASC = {
    11: { ending: 'ुः',      sandhi: 'उ+स्→उः',                          ref: 'TBD' },
    12: { ending: 'ू',       sandhi: 'nom du ū',                         ref: 'TBD' },
    13: { ending: 'वः',      sandhi: 'guṇa उ→ो, yaṇ उ→व् → वः',        ref: 'TBD' },
    21: { ending: 'ुम्',     sandhi: 'acc sg',                           ref: 'TBD' },
    22: { ending: 'ू',       sandhi: 'acc du',                           ref: 'TBD' },
    23: { ending: 'ून्',     sandhi: 'acc pl masc (dīrgha)',             ref: 'TBD' },
    31: { ending: 'ुना',     sandhi: 'instr sg',                         ref: 'TBD' },
    32: { ending: 'ुभ्याम्', sandhi: 'instr du',                         ref: 'TBD' },
    33: { ending: 'ुभिः',    sandhi: 'instr pl',                         ref: 'TBD' },
    41: { ending: 'वे',      sandhi: 'guṇa उ→ो → वे',                   ref: 'TBD' },
    42: { ending: 'ुभ्याम्', sandhi: 'dat du',                           ref: 'TBD' },
    43: { ending: 'ुभ्यः',   sandhi: 'dat pl',                           ref: 'TBD' },
    51: { ending: 'ोः',      sandhi: 'guṇa उ→ो + ः',                    ref: 'TBD' },
    52: { ending: 'ुभ्याम्', sandhi: 'abl du',                           ref: 'TBD' },
    53: { ending: 'ुभ्यः',   sandhi: 'abl pl',                           ref: 'TBD' },
    61: { ending: 'ोः',      sandhi: 'gen sg',                           ref: 'TBD' },
    62: { ending: '्वोः',    sandhi: 'उ+ओस् → व्+ओः',                   ref: 'TBD' },
    63: { ending: 'ूनाम्',   sandhi: 'gen pl',                           ref: 'TBD' },
    71: { ending: 'ौ',       sandhi: 'loc sg (उ+इ→औ)',                  ref: 'TBD' },
    72: { ending: '्वोः',    sandhi: 'loc du',                           ref: 'TBD' },
    73: { ending: 'ुषु',     sandhi: 'loc pl',                           ref: 'TBD' },
    81: { ending: 'ो',       sandhi: 'sambuddhi guṇa उ→ो',              ref: 'TBD' },
    82: { ending: 'ू',       sandhi: 'sambuddhi du',                     ref: 'TBD' },
    83: { ending: 'वः',      sandhi: 'sambuddhi pl',                     ref: 'TBD' },
  };

  // ── उकारान्त स्त्रीलिङ्ग (e.g. धेनु, रेणु) ──────────────────────────────────
  // Differs from u-masc at 23 (ूः vs ून्) and 31 (्वा vs ुना).
  // sambuddhi 81 = guṇa ो (short u → o by guṇa).
  const U_STRI = {
    11: { ending: 'ुः',      sandhi: 'nom sg',                           ref: 'TBD' },
    12: { ending: 'ू',       sandhi: 'nom du',                           ref: 'TBD' },
    13: { ending: 'वः',      sandhi: 'guṇa → वः',                       ref: 'TBD' },
    21: { ending: 'ुम्',     sandhi: 'acc sg',                           ref: 'TBD' },
    22: { ending: 'ू',       sandhi: 'acc du',                           ref: 'TBD' },
    23: { ending: 'ूः',      sandhi: 'acc pl stri (dīrgha+ḥ)',          ref: 'TBD' },
    31: { ending: '्वा',     sandhi: 'उ+आ → व्+आ (instr sg stri)',      ref: 'TBD' },
    32: { ending: 'ुभ्याम्', sandhi: 'instr du',                         ref: 'TBD' },
    33: { ending: 'ुभिः',    sandhi: 'instr pl',                         ref: 'TBD' },
    41: { ending: 'वे',      sandhi: 'dat sg guṇा',                     ref: 'TBD' },
    42: { ending: 'ुभ्याम्', sandhi: 'dat du',                           ref: 'TBD' },
    43: { ending: 'ुभ्यः',   sandhi: 'dat pl',                           ref: 'TBD' },
    51: { ending: 'ोः',      sandhi: 'abl sg',                           ref: 'TBD' },
    52: { ending: 'ुभ्याम्', sandhi: 'abl du',                           ref: 'TBD' },
    53: { ending: 'ुभ्यः',   sandhi: 'abl pl',                           ref: 'TBD' },
    61: { ending: 'ोः',      sandhi: 'gen sg',                           ref: 'TBD' },
    62: { ending: '्वोः',    sandhi: 'gen du',                           ref: 'TBD' },
    63: { ending: 'ूनाम्',   sandhi: 'gen pl',                           ref: 'TBD' },
    71: { ending: 'ौ',       sandhi: 'loc sg',                           ref: 'TBD' },
    72: { ending: '्वोः',    sandhi: 'loc du',                           ref: 'TBD' },
    73: { ending: 'ुषु',     sandhi: 'loc pl',                           ref: 'TBD' },
    81: { ending: 'ो',       sandhi: 'sambuddhi guṇa',                  ref: 'TBD' },
    82: { ending: 'ू',       sandhi: 'sambuddhi du',                     ref: 'TBD' },
    83: { ending: 'वः',      sandhi: 'sambuddhi pl',                     ref: 'TBD' },
  };

  // ── ऊकारान्त स्त्रीलिङ्ग / वधू (e.g. वधू, भू) ──────────────────────────────
  // prepStem strips ू-matra. Semi-vowel व् at many positions.
  // sambuddhi 81 = short ु (nityastrī: long ū → short u).
  const UU_STRI = {
    11: { ending: 'ूः',      sandhi: 'nom sg',                           ref: 'TBD' },
    12: { ending: '्वौ',     sandhi: 'ū+औ → व्+औ',                     ref: 'TBD' },
    13: { ending: '्वः',     sandhi: 'ū+अस् → व्+ः',                   ref: 'TBD' },
    21: { ending: 'ूम्',     sandhi: 'acc sg',                           ref: 'TBD' },
    22: { ending: '्वौ',     sandhi: 'acc du',                           ref: 'TBD' },
    23: { ending: 'ूः',      sandhi: 'acc pl',                           ref: 'TBD' },
    31: { ending: '्वा',     sandhi: 'ū+आ → व्+आ',                     ref: 'TBD' },
    32: { ending: 'ूभ्याम्', sandhi: 'instr du',                         ref: 'TBD' },
    33: { ending: 'ूभिः',    sandhi: 'instr pl',                         ref: 'TBD' },
    41: { ending: '्वै',     sandhi: 'dat sg',                           ref: 'TBD' },
    42: { ending: 'ूभ्याम्', sandhi: 'dat du',                           ref: 'TBD' },
    43: { ending: 'ूभ्यः',   sandhi: 'dat pl',                           ref: 'TBD' },
    51: { ending: '्वाः',    sandhi: 'abl sg',                           ref: 'TBD' },
    52: { ending: 'ूभ्याम्', sandhi: 'abl du',                           ref: 'TBD' },
    53: { ending: 'ूभ्यः',   sandhi: 'abl pl',                           ref: 'TBD' },
    61: { ending: '्वाः',    sandhi: 'gen sg',                           ref: 'TBD' },
    62: { ending: '्वोः',    sandhi: 'gen du',                           ref: 'TBD' },
    63: { ending: 'ूनाम्',   sandhi: 'gen pl',                           ref: 'TBD' },
    71: { ending: '्वाम्',   sandhi: 'loc sg',                           ref: 'TBD' },
    72: { ending: '्वोः',    sandhi: 'loc du',                           ref: 'TBD' },
    73: { ending: 'ूषु',     sandhi: 'loc pl',                           ref: 'TBD' },
    81: { ending: 'ु',       sandhi: 'sambuddhi: dīrgha ū → hrasva ु',  ref: 'TBD' },
    82: { ending: '्वौ',     sandhi: 'sambuddhi du',                     ref: 'TBD' },
    83: { ending: '्वः',     sandhi: 'sambuddhi pl',                     ref: 'TBD' },
  };

  // ── उकारान्त नपुंसकलिङ्ग (e.g. मधु, वसु) ────────────────────────────────────
  // prepStem strips ु-matra.
  // 11/21 = bare stem + ु (pratyaya disappears, stem vowel restored).
  // 12/22 = ुनी; 13/23 = ूनि.
  const U_NEUT = {
    11: { ending: 'ु',       sandhi: 'neut nom sg (pratyaya drops)',     ref: 'TBD' },
    12: { ending: 'ुनी',     sandhi: 'neut nom du',                      ref: 'TBD' },
    13: { ending: 'ूनि',     sandhi: 'neut nom pl',                      ref: 'TBD' },
    21: { ending: 'ु',       sandhi: 'neut acc sg = nom sg',             ref: 'TBD' },
    22: { ending: 'ुनी',     sandhi: 'neut acc du',                      ref: 'TBD' },
    23: { ending: 'ूनि',     sandhi: 'neut acc pl',                      ref: 'TBD' },
    31: { ending: 'ुना',     sandhi: 'instr sg',                         ref: 'TBD' },
    32: { ending: 'ुभ्याम्', sandhi: 'instr du',                         ref: 'TBD' },
    33: { ending: 'ुभिः',    sandhi: 'instr pl',                         ref: 'TBD' },
    41: { ending: 'वे',      sandhi: 'guṇa → वे',                       ref: 'TBD' },
    42: { ending: 'ुभ्याम्', sandhi: 'dat du',                           ref: 'TBD' },
    43: { ending: 'ुभ्यः',   sandhi: 'dat pl',                           ref: 'TBD' },
    51: { ending: 'ोः',      sandhi: 'guṇa + ः',                        ref: 'TBD' },
    52: { ending: 'ुभ्याम्', sandhi: 'abl du',                           ref: 'TBD' },
    53: { ending: 'ुभ्यः',   sandhi: 'abl pl',                           ref: 'TBD' },
    61: { ending: 'ोः',      sandhi: 'gen sg',                           ref: 'TBD' },
    62: { ending: '्वोः',    sandhi: 'gen du',                           ref: 'TBD' },
    63: { ending: 'ूनाम्',   sandhi: 'gen pl',                           ref: 'TBD' },
    71: { ending: 'ौ',       sandhi: 'loc sg',                           ref: 'TBD' },
    72: { ending: '्वोः',    sandhi: 'loc du',                           ref: 'TBD' },
    73: { ending: 'ुषु',     sandhi: 'loc pl',                           ref: 'TBD' },
    81: { ending: 'ु',       sandhi: 'neut sambuddhi = nom sg',          ref: 'TBD' },
    82: { ending: 'ुनी',     sandhi: 'neut sambuddhi du',                ref: 'TBD' },
    83: { ending: 'ूनि',     sandhi: 'neut sambuddhi pl',                ref: 'TBD' },
  };


  // ════════════════════════════════════════════════════════════════════════════
  // CLASS REGISTRY
  // ════════════════════════════════════════════════════════════════════════════

  const CLASSES = {};

  function registerClass(id, table, meta) {
    CLASSES[id] = { table, ...meta };
  }

  registerClass('hal-N-pum', HAL_N_PUM, {
    label: 'ण्-अन्त पुंलिङ्ग', example: 'सुगण्',
    linga: 'pum', matchEnding: 'ण्',
    akarant: false, nadi: false, ghi: false,
    prepStem: s => s,
  });

  registerClass('a-masc', A_MASC, {
    label: 'अकारान्त पुंलिङ्ग', example: 'राम',
    linga: 'pum', matchEnding: 'अ',
    akarant: true, nadi: false, ghi: false,
    prepStem: s => s,
  });

  registerClass('a-neut', A_NEUT, {
    label: 'अकारान्त नपुंसकलिङ्ग', example: 'फल',
    linga: 'napum', matchEnding: 'अ',
    akarant: true, nadi: false, ghi: false,
    prepStem: s => s,
  });

  registerClass('aa-stri', AA_STRI, {
    label: 'आकारान्त स्त्रीलिङ्ग', example: 'लता',
    linga: 'stri', matchEnding: 'आ',
    akarant: false, nadi: false, ghi: false,
    prepStem: s => s.slice(0, -1),   // strip ā-matra ा
  });

  registerClass('i-masc', I_MASC, {
    label: 'इकारान्त पुंलिङ्ग', example: 'कवि',
    linga: 'pum', matchEnding: 'इ',
    akarant: false, nadi: false, ghi: true,
    prepStem: s => s.slice(0, -1),   // strip ि
  });

  registerClass('i-stri', I_STRI, {
    label: 'इकारान्त स्त्रीलिङ्ग', example: 'मति',
    linga: 'stri', matchEnding: 'इ',
    akarant: false, nadi: 'opt41', ghi: 'opt41',
    prepStem: s => s.slice(0, -1),   // strip ि
  });

  registerClass('ii-stri', II_STRI, {
    label: 'ईकारान्त स्त्रीलिङ्ग (नदी)', example: 'नदी',
    linga: 'stri', matchEnding: 'ई',
    akarant: false, nadi: true, ghi: false,
    prepStem: s => s.slice(0, -1),   // strip ी
  });

  registerClass('u-masc', U_MASC, {
    label: 'उकारान्त पुंलिङ्ग', example: 'साधु',
    linga: 'pum', matchEnding: 'उ',
    akarant: false, nadi: false, ghi: true,
    prepStem: s => s.slice(0, -1),   // strip ु
  });

  registerClass('u-stri', U_STRI, {
    label: 'उकारान्त स्त्रीलिङ्ग', example: 'धेनु',
    linga: 'stri', matchEnding: 'उ',
    akarant: false, nadi: 'opt41', ghi: 'opt41',
    prepStem: s => s.slice(0, -1),   // strip ु
  });

  registerClass('uu-stri', UU_STRI, {
    label: 'ऊकारान्त स्त्रीलिङ्ग (वधू)', example: 'वधू',
    linga: 'stri', matchEnding: 'ऊ',
    akarant: false, nadi: true, ghi: false,
    prepStem: s => s.slice(0, -1),   // strip ू
  });

  registerClass('u-neut', U_NEUT, {
    label: 'उकारान्त नपुंसकलिङ्ग', example: 'मधु',
    linga: 'napum', matchEnding: 'उ',
    akarant: false, nadi: false, ghi: false,
    prepStem: s => s.slice(0, -1),   // strip ु
  });


  // ════════════════════════════════════════════════════════════════════════════
  // derive()
  // ════════════════════════════════════════════════════════════════════════════

  function derive(stem, classId) {
    const cls = CLASSES[classId];
    if (!cls) throw new Error('Unknown class: ' + classId);

    const table = cls.table;

    return POS_ORDER.map(pos => {
      const sup = SUP_BY_POS[pos];

      let base = cls.prepStem ? cls.prepStem(stem) : stem;

      const rule = table[pos];

      if (!rule) {
        return {
          pos, label: posLabel(pos), form: '?',
          sup_orig: sup ? sup.orig : '—', sup_raw: sup ? sup.raw : '—',
          ending: '—', sandhi: '(rule not yet defined)', ref: '—', stub: true,
        };
      }

      // Rule 22: यञ् दीर्घ — अकारान्त stems only
      // Fires when pratyaya raw starts with a यञ् consonant AND not suppressed.
      if (cls.akarant && rule.yanch !== false && sup && isYanch(sup.raw)) {
        base = akarantDirgha(base);
      }

      let form = base + rule.ending;

      // Step 13: final स् → विसर्ग (pos 12–73 only)
      if (pos >= 12 && pos <= 73 && form.endsWith('स्')) {
        form = form.slice(0, -2) + 'ः';
      }

      // Step 15: pos 11 optional jash — Group I final consonant → Group III
      let altForm = null;
      if (pos === 11 && rule.ending === '') {
        const fc = finalConsonant(base);
        if (fc) {
          const j = jash(fc);
          if (j) altForm = base.slice(0, -2) + j;
        }
      }

      return {
        pos,
        label:    posLabel(pos),
        form,
        altForm,
        sup_orig: sup ? sup.orig : '—',
        sup_raw:  sup ? sup.raw  : '—',
        ending:   rule.ending,
        sandhi:   rule.sandhi,
        ref:      rule.ref,
        stub:     false,
      };
    });
  }


  // ── Public API ────────────────────────────────────────────────────────────────

  return {
    SUP, SUP_BY_POS, POS_ORDER,
    VIB_LABEL, VAC_LABEL, posLabel,
    ENDING_VALID, endingValid, stemEnding, LINGA_INDEX,
    halValid, finalConsonant,
    VARGA, VARNA_INFO, jash,
    YANCH, isYanch,
    CLASSES, registerClass,
    derive,
  };

})();
