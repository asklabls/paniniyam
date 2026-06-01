'use strict';

// ── Script definitions ────────────────────────────────────────────────────────
const SCRIPTS = [
  { id: 'telugu',     label: 'తెలుగు',   name: 'Telugu'     },
  { id: 'kannada',    label: 'ಕನ್ನಡ',    name: 'Kannada'    },
  { id: 'malayalam',  label: 'മലയാളം',   name: 'Malayalam'  },
  { id: 'tamil',      label: 'தமிழ்',    name: 'Tamil'      },
  { id: 'bengali',    label: 'বাংলা',    name: 'Bengali'    },
  { id: 'gujarati',   label: 'ગુજરાતી',  name: 'Gujarati'   },
  { id: 'gurmukhi',   label: 'ਪੰਜਾਬੀ',  name: 'Gurmukhi'   },
  { id: 'oriya',      label: 'ଓଡ଼ିଆ',    name: 'Odia'       },
  { id: 'devanagari', label: 'देवनागरी', name: 'Devanagari' },
  { id: 'iast',       label: 'IAST',     name: 'IAST'       },
  { id: 'itrans',     label: 'ITRANS',   name: 'ITRANS'     },
];
const SCRIPT_DEFAULT = 'telugu';
const SETTINGS_KEY   = 'paniniyam-script';

// ── Feedback form (Google Apps Script endpoint) ───────────────────────────────
// Paste your deployed Apps Script URL here after setup (see CLAUDE.md for instructions)
const FEEDBACK_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwK9CYsZQ9yAICmDW55sVqWLpXAA40tMAz5H74IurlIFHW-dvAONcMMh6SV4J2dps3zgQ/exec';

// ── Book catalogue ────────────────────────────────────────────────────────────
const BOOKS = [
  { id: 'shivasutra',      devName: 'शिवसूत्राणि',    engName: 'Śiva Sūtras',    type: 'leaf', dataPath: 'shivasutra/data.txt',         icon: 'शिव'  },
  { id: 'ashtadhyayi',     devName: 'अष्टाध्यायी',   engName: 'Ashtadhyayi',    type: 'adhyaya-tree',                                  icon: 'अष्ट०' },
  { id: 'dhatupatha',      devName: 'धातुपाठः',       engName: 'Dhatupatha',     type: 'lazy-gana-tree', dataPath: 'dhatu/data.txt',     icon: 'धातु'  },
  { id: 'ganapatha',       devName: 'गणपाठः',         engName: 'Gaṇapāṭha',      type: 'leaf', dataPath: 'ganapath/data.txt',           icon: 'गण'   },
  { id: 'unaadi',          devName: 'उणादिकोशः',      engName: 'Uṇādi Kośa',     type: 'leaf', dataPath: 'unaadi/data.txt',             icon: 'उणा'  },
  { id: 'linganushasanam', devName: 'लिङ्गानुशासनम्', engName: 'Liṅgānuśāsanam', type: 'leaf', dataPath: 'linganushasanam/data.txt',    icon: 'लिङ्' },
  { id: 'shiksha',         devName: 'शिक्षा',         engName: 'Śikṣā',          type: 'leaf', dataPath: 'shiksha/data.txt',             icon: 'शिक्षा'  },
  { id: 'fit',             devName: 'फिट्सूत्राणि',   engName: 'Fiṭ Sūtrāṇi',   type: 'leaf', dataPath: 'fit/data.txt',                icon: 'फिट्' },
  { id: 'about', devName: 'About', engName: 'About', type: 'about-menu', icon: 'About',
    sections: [
      { id: 'credits', engName: 'Credits'    },
      { id: 'contact', engName: 'Contact Us' },
      { id: 'support', engName: 'Support Us' },
    ]
  },
];

// ── Ashtadhyayi metadata ──────────────────────────────────────────────────────
const ADHYAYA_NAMES_DEV = [
  '', 'प्रथमाध्यायः', 'द्वितीयाध्यायः', 'तृतीयाध्यायः', 'चतुर्थाध्यायः',
  'पञ्चमाध्यायः', 'षष्ठाध्यायः', 'सप्तमाध्यायः', 'अष्टमाध्यायः',
];
const PADA_NAMES_DEV = ['', 'प्रथमपादः', 'द्वितीयपादः', 'तृतीयपादः', 'चतुर्थपादः'];

// Commentary tab groups — three traditions + notes placeholder
const TAB_GROUPS = [
  {
    id: 'primary',
    tabs: [
      { id: 'kashika',  devLabel: 'काशिका',       dataPath: 'sutraani/kashika.txt'         },
      { id: 'vartika',  devLabel: 'वार्तिकम्',     dataPath: 'sutraani/vartika.txt'         },
      { id: 'bhashya',  devLabel: 'महाभाष्यम्',    dataPath: 'sutraani/bhashya.txt'         },
      { id: 'vasu_eng', devLabel: 'CS Vasu Eng',   dataPath: 'sutraani/vasu_english.txt', latin: true },
    ],
  },
  {
    id: 'notes',
    type: 'notes-placeholder',   // Phase 4 — Gmail login + Google Drive notes
  },
  {
    id: 'kaumudi',
    tabs: [
      { id: 'siddhanta', devLabel: 'सिद्धान्तकौमुदी', dataPath: 'sutraani/kaumudi.txt'          },
      { id: 'laghu',     devLabel: 'लघुकौमुदी',       dataPath: 'sutraani/laghukaumudi.txt'     },
      { id: 'balamano',  devLabel: 'बालमनोरमा',       dataPath: 'sutraani/balamanorama.txt'     },
    ],
  },
  {
    id: 'tika',
    tabs: [
      { id: 'tattva',   devLabel: 'तत्त्वबोधिनी',    dataPath: 'sutraani/tattvabodhini.txt'    },
      { id: 'nyaas',    devLabel: 'न्यासः',           dataPath: 'sutraani/nyaas.txt'            },
      { id: 'padamanj', devLabel: 'पदमञ्जरी',         dataPath: 'sutraani/padamanjari.txt'      },
      { id: 'praudha',  devLabel: 'प्रौढमनोरमा',      dataPath: 'sutraani/praudhamanorama.txt'  },
    ],
  },
];

// ── Dhatupatha gana labels ─────────────────────────────────────────────────────
const GANA_LABELS_DEV = [
  '',
  '01 · भ्वादिः',    '02 · अदादिः',     '03 · जुहोत्यादिः',
  '04 · दिवादिः',    '05 · स्वादिः',    '06 · तुदादिः',
  '07 · रुधादिः',    '08 · तनादिः',     '09 · क्र्यादिः',
  '10 · चुरादिः',
];

// ── Grammatical label tables ──────────────────────────────────────────────────
const VIBHAKTI_DEV = [
  'अव्ययम्', 'प्रथमा', 'द्वितीया', 'तृतीया',
  'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी',
];
const VACANA_DEV = ['', 'एकवचनम्', 'द्विवचनम्', 'बहुवचनम्'];

const GANA_NAMES_DEV  = ['','भ्वादिः','अदादिः','जुहोत्यादिः','दिवादिः','स्वादिः','तुदादिः','रुधादिः','तनादिः','क्र्यादिः','चुरादिः'];
const PADA_DETAIL_DEV = { P: 'परस्मैपदी', A: 'आत्मनेपदी', U: 'उभयपदी' };
const KARMA_DEV       = { A: 'अकर्मकः',   S: 'सकर्मकः',   U: 'द्विकर्मकः' };
const SETTVA_DEV      = { S: 'सेट्',       A: 'अनिट्',     V: 'वेट्' };
const TYPE_BADGE_DEV  = { S: 'संज्ञा', P: 'परिभाषा', V: 'विधि', AD: 'अधिकार', AT: 'अतिदेश' };

// ── Dhatu forms — lakara tables ──────────────────────────────────────────────
const LAKARA_SARVA = [
  { key: 'lat',       dev: 'लट्'       },
  { key: 'lot',       dev: 'लोट्'      },
  { key: 'lang',      dev: 'लङ्'       },
  { key: 'vidhiling', dev: 'विधिलिङ्'  },
];
const LAKARA_ARDHA = [
  { key: 'lit',       dev: 'लिट्'      },
  { key: 'lut',       dev: 'लुट्'      },
  { key: 'lrut',      dev: 'लृट्'      },
  { key: 'ashirling', dev: 'आशीर्लिङ्' },
  { key: 'lung',      dev: 'लुङ्'      },
  { key: 'lrung',     dev: 'लृङ्'      },
];
const DHATU_TABS = [
  { id: 'sarva', dev: 'सार्वधातुकम्', lakaras: LAKARA_SARVA },
  { id: 'ardha', dev: 'आर्धधातुकम्',  lakaras: LAKARA_ARDHA },
];
const PURUSH_FORMS_DEV = ['प्रथम', 'मध्यम', 'उत्तम'];
const VACANA_FORMS_DEV = ['एकवचन', 'द्विवचन', 'बहुवचन'];

// ── Data source ───────────────────────────────────────────────────────────────
const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname)
             || /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(location.hostname);
const DATA_BASE  = isLocal
  ? 'data'
  : 'https://cdn.jsdelivr.net/gh/asklabls/paniniyam-data@main';
const FORMS_BASE = isLocal
  ? 'forms'
  : 'https://cdn.jsdelivr.net/gh/asklabls/paniniyam@main/forms';

// ── State ─────────────────────────────────────────────────────────────────────
let currentScript = localStorage.getItem(SETTINGS_KEY) || SCRIPT_DEFAULT;
let sutraList     = [];
let sutraIndex    = {};
let activeCard    = null;
let currentPada   = null;
let activeNavBtn  = null;
const bookData    = {};
const audioCache  = {};
let   currentAudio = null;

// Reader state
let readerList  = [];   // ordered sutras available for prev/next navigation
let readerIdx   = -1;   // current position in readerList
let readerSutra = null; // currently displayed sutra in reader panel

// Dhatu reader state
let dhatuReaderList = [];
let dhatuReaderIdx  = -1;
let dhatuReaderItem = null;
let readerType      = 'sutra'; // 'sutra' | 'dhatu'

// Drawer state
let activeDrawer    = null;
let hoverOpened     = false;   // true when drawer was opened by edge hover (not button click)
let pinnedNav       = localStorage.getItem('nav-pinned') === '1';
let aboutNavBuilt   = false;
let currentPanel    = 'welcome';

// ── DOM refs ──────────────────────────────────────────────────────────────────
// $scriptSelect removed — replaced by inline script dropdown
const $navTree           = document.getElementById('nav-tree');
const $loading           = document.getElementById('loading');
const $searchInput       = document.getElementById('search-input');
const $searchClear       = document.getElementById('search-clear');
const $panelWelcome      = document.getElementById('panel-welcome');
const $panelList         = document.getElementById('panel-list');
const $panelReader       = document.getElementById('panel-reader');
const $readerContent     = document.getElementById('reader-content');
const $sutraList         = document.getElementById('sutra-list');
const $searchDrawerBody  = document.getElementById('search-drawer-body');
const $listTitle         = document.getElementById('list-title');
const $listCount         = document.getElementById('list-count');
const $welcomeTitle      = document.getElementById('welcome-title');
const $welcomeStats      = document.getElementById('welcome-stats');
const $scriptPills       = document.getElementById('script-pills');
const $barRef            = document.getElementById('bar-ref');
const $btnPrev           = document.getElementById('btn-prev');
const $btnNext           = document.getElementById('btn-next');
const $drawerBackdrop    = document.getElementById('drawer-backdrop');
const $panelAbout        = document.getElementById('panel-about');
const $aboutPanelNav     = document.getElementById('about-panel-nav');
const $aboutPanelContent = document.getElementById('about-panel-content');
const $app               = document.getElementById('app');

// ── Transliteration ───────────────────────────────────────────────────────────
function translit(text) {
  if (!text || typeof text !== 'string') return text || '';
  if (currentScript === 'devanagari') return text;
  try { return Sanscript.t(text, 'devanagari', currentScript); }
  catch (_) { return text; }
}

function translitMixed(text) {
  if (!text) return '';
  if (currentScript === 'devanagari') return text;
  return text.replace(/[\u0900-\u097F]+/g, m => translit(m));
}

// ── Commentary markup helpers ─────────────────────────────────────────────────
function devDigitsToAscii(str) {
  return str.replace(/[०-९]/g, d => d.charCodeAt(0) - 0x0966);
}

function sutraRefToId(ref) {
  const ascii = devDigitsToAscii(ref.trim());
  const parts = ascii.split('.');
  if (parts.length !== 3) return null;
  const [a, p, s] = parts;
  return `${a}${p}${s.padStart(3, '0')}`;
}

function renderCommentaryHTML(raw) {
  let html = '';
  let buf  = '';
  let i = 0;

  function flush() {
    if (!buf) return;
    html += translit(buf);
    buf = '';
  }

  while (i < raw.length) {
    if (raw[i] === '<' && raw[i + 1] === '<') {
      const end = raw.indexOf('>>', i + 2);
      if (end !== -1) {
        flush();
        const devText = raw.slice(i + 2, end);
        const esc = devText.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        html += `<span class="sutra-quote" data-dev="${esc}">${translit(devText)}</span>`;
        i = end + 2;
        continue;
      }
    }
    if (raw[i] === '[' && raw[i + 1] === '[') {
      const end = raw.indexOf(']]', i + 2);
      if (end !== -1) {
        flush();
        const inner = raw.slice(i + 2, end);
        const sid = sutraRefToId(inner);
        const display = devDigitsToAscii(inner.trim());
        html += sid
          ? `<a class="sutra-link" data-id="${sid}" href="#">${display}</a>`
          : `[[${display}]]`;
        i = end + 2;
        continue;
      }
    }
    buf += raw[i];
    i++;
  }
  flush();
  return html || '<span class="no-data">n/a</span>';
}

function setCommentaryHTML(panel, raw) {
  panel.innerHTML = renderCommentaryHTML(raw);
  if (!panel._hasClickListener) {
    panel._hasClickListener = true;
    panel.addEventListener('click', e => {
      const link = e.target.closest('.sutra-link');
      if (link) { e.preventDefault(); gotoSutra(link.dataset.id); }
    });
  }
}

// ── Drawer system ─────────────────────────────────────────────────────────────
function openDrawer(id, fromHover = false) {
  // If nav is pinned, hovering shouldn't re-open or interfere
  if (id === 'nav' && pinnedNav) return;
  if (activeDrawer === id) { if (!fromHover) { closeDrawer(); } return; }
  if (activeDrawer) closeDrawer();
  activeDrawer = id;
  hoverOpened  = fromHover;
  const drawer = document.getElementById(`drawer-${id}`);
  if (drawer) drawer.classList.add('open');
  $drawerBackdrop.classList.add('visible');
  document.querySelectorAll('.bar-btn[data-drawer]').forEach(b => {
    b.classList.toggle('active', b.dataset.drawer === id);
  });
}

function closeDrawer() {
  if (!activeDrawer) return;
  // Don't close the nav drawer if it's pinned
  if (activeDrawer === 'nav' && pinnedNav) return;
  const drawer = document.getElementById(`drawer-${activeDrawer}`);
  if (drawer) drawer.classList.remove('open');
  $drawerBackdrop.classList.remove('visible');
  document.querySelectorAll('.bar-btn[data-drawer]').forEach(b => b.classList.remove('active'));
  activeDrawer = null;
}

// ── Nav pin toggle ────────────────────────────────────────────────────────────
function applyPinState() {
  document.body.classList.toggle('nav-pinned', pinnedNav);
  const btn = document.getElementById('btn-pin-nav');
  if (btn) {
    btn.classList.toggle('pinned', pinnedNav);
    btn.title = pinnedNav ? 'Unpin navigation' : 'Pin navigation open';
    btn.textContent = pinnedNav ? '⊗' : '⊕';
  }
  const drawerNav = document.getElementById('drawer-nav');
  if (pinnedNav) {
    // Open without backdrop or activeDrawer tracking
    drawerNav.classList.add('open');
    $drawerBackdrop.classList.remove('visible');
    if (activeDrawer === 'nav') activeDrawer = null;
  } else {
    // Remove .open so the slide-out animation plays
    drawerNav.classList.remove('open');
  }
}

document.getElementById('btn-pin-nav').addEventListener('click', () => {
  pinnedNav = !pinnedNav;
  localStorage.setItem('nav-pinned', pinnedNav ? '1' : '0');
  applyPinState();
});

// ── Panel switcher ────────────────────────────────────────────────────────────
function showPanel(name) {
  currentPanel = name;
  $panelWelcome.style.display = name === 'welcome' ? '' : 'none';
  $panelList.style.display    = name === 'list'    ? '' : 'none';
  $panelReader.style.display  = name === 'reader'  ? '' : 'none';
  $panelAbout.style.display   = name === 'about'   ? '' : 'none';
  $app.scrollTop = 0;
}

// ── Reader navigation ─────────────────────────────────────────────────────────
function updateReaderNav() {
  if (readerType === 'dhatu' && dhatuReaderItem) {
    $barRef.textContent = translit(dhatuReaderItem.dhatu);
    $barRef.classList.remove('empty');
    $btnPrev.disabled = dhatuReaderIdx <= 0;
    $btnNext.disabled = dhatuReaderIdx < 0 || dhatuReaderIdx >= dhatuReaderList.length - 1;
  } else if (readerSutra) {
    $barRef.textContent = `${readerSutra.a}.${readerSutra.p}.${readerSutra.n}`;
    $barRef.classList.remove('empty');
    $btnPrev.disabled = readerIdx <= 0;
    $btnNext.disabled = readerIdx < 0 || readerIdx >= readerList.length - 1;
  } else {
    $barRef.textContent = '—';
    $barRef.classList.add('empty');
    $btnPrev.disabled = true;
    $btnNext.disabled = true;
  }
}

function showReader(sutra, idx) {
  readerType  = 'sutra';
  readerIdx   = idx;
  readerSutra = sutra;
  renderReaderSutra(sutra);
  updateReaderNav();
  showPanel('reader');
}

function showDhatuReader(dhatu, idx) {
  readerType      = 'dhatu';
  dhatuReaderIdx  = idx;
  dhatuReaderItem = dhatu;
  renderReaderDhatu(dhatu);
  updateReaderNav();
  showPanel('reader');
  prefetchDhatuForms(dhatuReaderList, idx);
}

function renderReaderSutra(sutra) {
  $readerContent.innerHTML = '';

  // Top row: reference number + type badge + audio
  const topRow = document.createElement('div');
  topRow.className = 'reader-top-row';

  const refEl = document.createElement('span');
  refEl.className = 'reader-ref';
  refEl.textContent = `${sutra.a}.${sutra.p}.${sutra.n}`;
  topRow.appendChild(refEl);

  const topRight = document.createElement('div');
  topRight.className = 'reader-top-right';

  const t = (sutra.type || '').split('$')[0];
  topRight.appendChild(devEl('span', `sutra-badge badge-${t}`, TYPE_BADGE_DEV[t] || t || ''));

  const audioBtn = document.createElement('button');
  audioBtn.className = 'audio-btn';
  audioBtn.title = 'Play pronunciation';
  audioBtn.textContent = '▶';
  audioBtn.addEventListener('click', () => playsutra(sutra, audioBtn));
  topRight.appendChild(audioBtn);
  topRow.appendChild(topRight);
  $readerContent.appendChild(topRow);

  // Large sutra text
  const textEl = document.createElement('div');
  textEl.className = 'reader-sutra-text dev-text';
  textEl._devText = sutra.s;
  textEl.textContent = translit(sutra.s);
  $readerContent.appendChild(textEl);

  // Grammatical meta block
  $readerContent.appendChild(buildSutraMeta(sutra));

  // Stacked commentary tab groups
  buildTabGroups(sutra, $readerContent, false);
}

// ── Dhatu reader ──────────────────────────────────────────────────────────────
function renderReaderDhatu(d) {
  $readerContent.innerHTML = '';

  // Top row: index badge + pada badge
  const topRow = document.createElement('div');
  topRow.className = 'reader-top-row';
  const refEl = document.createElement('span');
  refEl.className = 'reader-ref';
  refEl.textContent = d.baseindex;
  topRow.appendChild(refEl);
  const topRight = document.createElement('div');
  topRight.className = 'reader-top-right';
  topRight.appendChild(devEl('span', `sutra-badge badge-V`, PADA_DETAIL_DEV[d.pada] || d.pada));
  topRow.appendChild(topRight);
  $readerContent.appendChild(topRow);

  // Large dhatu text
  const textEl = document.createElement('div');
  textEl.className = 'reader-sutra-text dev-text';
  textEl._devText = d.aupadeshik || d.dhatu;
  textEl.textContent = translit(d.aupadeshik || d.dhatu);
  $readerContent.appendChild(textEl);

  // Meta strip: gana · karma · settva
  const stripParts = [
    GANA_NAMES_DEV[+d.gana],
    KARMA_DEV[d.karma],
    SETTVA_DEV[d.settva],
  ].filter(Boolean);
  if (stripParts.length) {
    const strip = document.createElement('div');
    strip.className = 'dhatu-strip dev-text';
    strip._devText = stripParts.join(' · ');
    strip.textContent = translit(stripParts.join(' · '));
    $readerContent.appendChild(strip);
  }

  // Meaning block
  if (d.artha || d.artha_english) {
    const meta = document.createElement('div');
    meta.className = 'sutra-meta-block';
    if (d.artha) {
      const row = document.createElement('div');
      row.className = 'meta-row';
      row.appendChild(devEl('span', 'meta-label dev-text', 'अर्थः'));
      row.appendChild(devEl('span', 'meta-value dev-text', d.artha));
      meta.appendChild(row);
    }
    if (d.artha_english) {
      const row = document.createElement('div');
      row.className = 'meta-row';
      const lbl = document.createElement('span');
      lbl.className = 'meta-label';
      lbl.textContent = 'English';
      row.appendChild(lbl);
      const val = document.createElement('span');
      val.className = 'meta-value detail-english';
      val.textContent = d.artha_english;
      row.appendChild(val);
      meta.appendChild(row);
    }
    $readerContent.appendChild(meta);
  }

  // Forms tab group
  const groupEl = document.createElement('div');
  groupEl.className = 'tab-group';

  const tabBar = document.createElement('div');
  tabBar.className = 'detail-tabs';

  const panelWrap = document.createElement('div');
  panelWrap.className = 'detail-tab-panels';

  const panels = {};
  DHATU_TABS.forEach((tabDef, i) => {
    const panel = document.createElement('div');
    panel.className = 'detail-tab-panel';
    panel.dataset.panel = tabDef.id;
    panel._loaded = false;
    panels[tabDef.id] = panel;

    const tab = document.createElement('button');
    tab.className = 'detail-tab dev-text';
    tab._devText = tabDef.dev;
    tab.textContent = translit(tabDef.dev);

    tab.addEventListener('click', () => {
      tabBar.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      Object.values(panels).forEach(p => p.classList.remove('active'));
      panel.classList.add('active');
      if (!panel._loaded) {
        panel._loaded = true;
        loadAndRenderDhatuForms(d, tabDef.lakaras, panel);
      }
    });

    tabBar.appendChild(tab);
    panelWrap.appendChild(panel);
  });

  // Activate and auto-load first tab
  tabBar.querySelectorAll('.detail-tab')[0].classList.add('active');
  const firstPanel = panelWrap.querySelectorAll('.detail-tab-panel')[0];
  firstPanel.classList.add('active');
  firstPanel._loaded = true;
  loadAndRenderDhatuForms(d, DHATU_TABS[0].lakaras, firstPanel);

  groupEl.appendChild(tabBar);
  groupEl.appendChild(panelWrap);
  $readerContent.appendChild(groupEl);
}

async function loadDhatuForms(baseindex) {
  const key = `dforms:${baseindex}`;
  if (!bookData[key]) {
    const res = await fetch(`${FORMS_BASE}/dhatu/${baseindex}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    bookData[key] = await res.json();
  }
  return bookData[key];
}

function prefetchDhatuForms(list, idx) {
  const range = [idx - 2, idx - 1, idx + 1, idx + 2]
    .filter(i => i >= 0 && i < list.length);
  for (const i of range) {
    const key = `dforms:${list[i].baseindex}`;
    if (!bookData[key]) {
      fetch(`${FORMS_BASE}/dhatu/${list[i].baseindex}.json`)
        .then(r => r.json())
        .then(d => { bookData[key] = d; })
        .catch(() => {});
    }
  }
}

async function loadAndRenderDhatuForms(d, lakaras, panel) {
  panel.textContent = '…';
  try {
    const forms = await loadDhatuForms(d.baseindex);
    panel.innerHTML = '';
    let hasAny = false;
    for (const lakara of lakaras) {
      const pKey = `p${lakara.key}`;
      const aKey = `a${lakara.key}`;
      const pForms = forms[pKey];
      const aForms = forms[aKey];
      if (!pForms && !aForms) continue;
      hasAny = true;

      const sec = document.createElement('div');
      sec.className = 'dhatu-lakara-section';
      sec.appendChild(devEl('div', 'dhatu-lakara-label dev-text', lakara.dev));

      if (pForms && aForms) {
        const split = document.createElement('div');
        split.className = 'forms-split';
        split.appendChild(renderFormsTable(pForms, 'परस्मैपद'));
        const divider = document.createElement('div');
        divider.className = 'forms-divider';
        split.appendChild(divider);
        split.appendChild(renderFormsTable(aForms, 'आत्मनेपद'));
        sec.appendChild(split);
      } else {
        sec.appendChild(renderFormsTable(pForms || aForms, null));
      }
      panel.appendChild(sec);
    }
    if (!hasAny) panel.textContent = '—';
  } catch (_) {
    panel.textContent = 'Could not load forms.';
  }
}

function renderFormsTable(formsStr, padaLabel) {
  const cells = String(formsStr || '').split(';').map(s => s.trim());
  while (cells.length < 9) cells.push('—');

  const wrap = document.createElement('div');
  wrap.className = 'forms-table-wrap';

  const table = document.createElement('table');
  table.className = 'forms-table';

  const thead = document.createElement('thead');

  // Pada label row (परस्मैपद / आत्मनेपद) spanning all columns
  if (padaLabel) {
    const titleRow = document.createElement('tr');
    const titleTh  = document.createElement('th');
    titleTh.colSpan = 4;
    titleTh.className = 'forms-pada-header dev-text';
    titleTh._devText = padaLabel;
    titleTh.textContent = translit(padaLabel);
    titleRow.appendChild(titleTh);
    thead.appendChild(titleRow);
  }

  // Vacana header row
  const hrow = document.createElement('tr');
  hrow.appendChild(document.createElement('th')); // empty corner
  VACANA_FORMS_DEV.forEach(v => {
    const th = document.createElement('th');
    th.className = 'forms-vacana-hdr dev-text';
    th._devText = v;
    th.textContent = translit(v);
    hrow.appendChild(th);
  });
  thead.appendChild(hrow);
  table.appendChild(thead);

  // Data rows: prathama, madhyama, uttama
  const tbody = document.createElement('tbody');
  PURUSH_FORMS_DEV.forEach((purush, row) => {
    const tr = document.createElement('tr');
    const labelTd = document.createElement('td');
    labelTd.className = 'forms-row-label dev-text';
    labelTd._devText = purush;
    labelTd.textContent = translit(purush);
    tr.appendChild(labelTd);
    for (let col = 0; col < 3; col++) {
      const td = document.createElement('td');
      const val = cells[row * 3 + col] || '—';
      td.className = 'forms-cell dev-text';
      td._devText = val;
      td.textContent = translit(val);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

// ── Script inline dropdown ────────────────────────────────────────────────────
const $scriptDropdown = document.getElementById('script-dropdown');
const $scriptBtn      = document.getElementById('btn-script');
const $scriptMenu     = document.getElementById('script-menu');

function buildScriptDropdown() {
  // Build the welcome-panel script pills
  $scriptPills.innerHTML = '';
  for (const s of SCRIPTS) {
    const pill = document.createElement('span');
    pill.className = 'script-pill';
    pill.textContent = s.label;
    pill.title = s.name;
    pill.addEventListener('click', () => { setScript(s.id); gotoSutra('11001'); });
    $scriptPills.appendChild(pill);
  }

  // Build the top-bar dropdown menu
  $scriptMenu.innerHTML = '';
  for (const s of SCRIPTS) {
    const btn = document.createElement('button');
    btn.className = 'script-menu-item' + (s.id === currentScript ? ' active' : '');
    btn.dataset.scriptId = s.id;
    btn.textContent = s.label;
    btn.addEventListener('click', () => { setScript(s.id); closeScriptDropdown(); });
    $scriptMenu.appendChild(btn);
  }

  updateScriptBtn();
}

function updateScriptBtn() {
  const s = SCRIPTS.find(x => x.id === currentScript);
  $scriptBtn.textContent = s ? s.label : 'Aa';
  // Update active state in menu
  for (const item of $scriptMenu.querySelectorAll('.script-menu-item')) {
    item.classList.toggle('active', item.dataset.scriptId === currentScript);
  }
}

function openScriptDropdown()  { $scriptDropdown.classList.add('open'); }
function closeScriptDropdown() { $scriptDropdown.classList.remove('open'); }
function toggleScriptDropdown() {
  $scriptDropdown.classList.toggle('open');
}

// Hover (desktop)
let scriptHoverTimer = null;
$scriptDropdown.addEventListener('mouseenter', () => {
  clearTimeout(scriptHoverTimer);
  openScriptDropdown();
});
$scriptDropdown.addEventListener('mouseleave', () => {
  scriptHoverTimer = setTimeout(closeScriptDropdown, 300);
});

// Click / tap toggle
$scriptBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleScriptDropdown();
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!$scriptDropdown.contains(e.target)) closeScriptDropdown();
});

function setScript(schemeId) {
  currentScript = schemeId;
  localStorage.setItem(SETTINGS_KEY, schemeId);
  updateScriptBtn();
  retranslit();
}

// ── Re-render everything in the chosen script ─────────────────────────────────
function retranslit() {
  $welcomeTitle.textContent = translit('पाणिनीय अष्टाध्यायी');

  document.querySelectorAll('.nav-label').forEach(el => {
    if (el._devText) el.textContent = translit(el._devText);
  });
  document.querySelectorAll('.dev-text').forEach(el => {
    if (el._devText !== undefined) el.textContent = translit(el._devText);
  });
  document.querySelectorAll('.mixed-text').forEach(el => {
    if (el._mixedText !== undefined) el.textContent = translitMixed(el._mixedText);
  });

  // Sutra cards in list view
  document.querySelectorAll('.sutra-card[data-id]').forEach(card => {
    const sutra = sutraIndex[card.dataset.id];
    if (!sutra) return;
    const t = card.querySelector('.sutra-text');
    if (t) t.textContent = translit(sutra.s);
    const f = card.querySelector('.detail-sutra-full');
    if (f) f.textContent = translit(sutra.s);
    card.querySelectorAll('.commentary-panel').forEach(p => {
      if (p._rawCommentary !== undefined) setCommentaryHTML(p, p._rawCommentary);
    });
  });

  // Reader panel commentary
  if (readerSutra) {
    $readerContent.querySelectorAll('.commentary-panel').forEach(p => {
      if (p._rawCommentary !== undefined) setCommentaryHTML(p, p._rawCommentary);
    });
  }

  // Search results in drawer
  $searchDrawerBody.querySelectorAll('.sri-text').forEach(el => {
    if (el._devText !== undefined) el.textContent = translit(el._devText);
  });
}

// ── Data loading ──────────────────────────────────────────────────────────────
async function fetchJSON(path) {
  const res = await fetch(`${DATA_BASE}/${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  return res.json();
}

async function loadData(key, path) {
  if (!bookData[key]) {
    const raw = await fetchJSON(path);
    let d = raw.data || raw;
    // vartika.txt is an array of {sutra:"1.1.9", vartika:"..."} — normalize to dict keyed by sutra.i
    if (Array.isArray(d) && d.length && d[0].sutra && d[0].vartika !== undefined) {
      const dict = {};
      for (const entry of d) {
        const [a, p, n] = entry.sutra.split('.');
        const id = a + p + String(n).padStart(3, '0');
        dict[id] = entry.vartika;
      }
      d = dict;
    }
    bookData[key] = d;
  }
  return bookData[key];
}

// ── Audio playback ────────────────────────────────────────────────────────────
async function playsutra(sutra, btn) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  document.querySelectorAll('.audio-btn.playing').forEach(b => {
    b.classList.remove('playing');
    b.textContent = '▶';
  });
  if (btn.classList.contains('was-playing')) {
    btn.classList.remove('was-playing');
    return;
  }
  btn.classList.add('loading');
  btn.textContent = '…';
  try {
    const key = `${sutra.a}-${sutra.p}`;
    if (!audioCache[key]) {
      audioCache[key] = await fetchJSON(`audio/sutraani/${sutra.a}-${sutra.p}.txt`);
    }
    const uri = audioCache[key][sutra.i];
    if (!uri) { btn.classList.remove('loading'); btn.textContent = '▶'; return; }
    btn.classList.remove('loading');
    btn.classList.add('playing');
    btn.textContent = '■';
    currentAudio = new Audio(uri);
    currentAudio.play();
    currentAudio.addEventListener('ended', () => {
      btn.classList.remove('playing');
      btn.textContent = '▶';
      currentAudio = null;
    });
  } catch (_) {
    btn.classList.remove('loading');
    btn.textContent = '▶';
  }
}

// ── DOM helpers ───────────────────────────────────────────────────────────────
function makeNavLabel(devText) {
  const span = document.createElement('span');
  span.className = 'nav-label';
  span._devText = devText;
  span.textContent = translit(devText);
  return span;
}

function devEl(tag, cls, devText) {
  const el = document.createElement(tag);
  el.className = (cls + ' dev-text').trim();
  el._devText = devText;
  el.textContent = translit(devText);
  return el;
}

function buildSutraMeta(sutra) {
  const meta = document.createElement('div');
  meta.className = 'sutra-meta';

  function addRow(labelDev, buildValue) {
    const row = document.createElement('div');
    row.className = 'meta-row';
    row.appendChild(devEl('span', 'meta-label', labelDev));
    const val = document.createElement('span');
    val.className = 'meta-value';
    buildValue(val);
    row.appendChild(val);
    meta.appendChild(row);
  }

  // पदच्छेदः
  if (sutra.pc) {
    const parts = sutra.pc.split('##').filter(Boolean);
    addRow('पदच्छेदः', val => {
      parts.forEach((part, idx) => {
        const bits = part.split('$');
        const word = bits[0];
        const vib  = parseInt(bits[2]) || 0;
        const vac  = parseInt(bits[3]) || 0;
        if (idx > 0) val.appendChild(document.createTextNode(' , '));
        val.appendChild(devEl('span', 'pc-word', word));
        if (vib > 0) {
          const gram = vac ? `${VIBHAKTI_DEV[vib]}-${VACANA_DEV[vac]}` : VIBHAKTI_DEV[vib];
          val.appendChild(document.createTextNode(' '));
          val.appendChild(devEl('span', 'pc-gram', `( ${gram} )`));
        }
      });
    });
  }

  // अनुवृत्तिः (synchronous — data already in sutra object)
  if (sutra.an) {
    addRow('अनुवृत्तिः', val => {
      sutra.an.split('##').filter(Boolean).forEach((part, idx) => {
        if (idx > 0) val.appendChild(document.createTextNode(' · '));
        const [word, id2] = part.split('$');
        if (!word) return;
        const wordSpan = devEl('span', '', word);
        if (id2) {
          const a = document.createElement('a');
          a.className = 'detail-anuvritta';
          a.href = '#';
          a.addEventListener('click', e => { e.preventDefault(); gotoSutra(id2); });
          a.appendChild(wordSpan);
          a.appendChild(document.createTextNode(` (${idToRef(id2)})`));
          val.appendChild(a);
        } else {
          val.appendChild(wordSpan);
        }
      });
    });
  }

  // अधिकारः
  if (sutra.ad) {
    const [adText, a, p, n] = sutra.ad.split('$');
    const sid = a && p && n ? `${a}${p}${String(+n).padStart(3, '0')}` : null;
    addRow('अधिकारः', val => {
      val.appendChild(devEl('span', '', adText));
      if (sid) {
        val.appendChild(document.createTextNode(' '));
        const link = document.createElement('a');
        link.className = 'sutra-link';
        link.href = '#';
        link.dataset.id = sid;
        link.textContent = `${a}.${p}.${n}`;
        link.addEventListener('click', e => { e.preventDefault(); gotoSutra(sid); });
        val.appendChild(link);
      }
    });
  }

  // अनुवृत्तिसहितं सूत्रम्
  if (sutra.ss) {
    addRow('अनुवृत्तिसहितं सूत्रम्', val => {
      val.appendChild(devEl('span', '', sutra.ss));
    });
  }

  return meta;
}

function setListHeader(devTitle, countText) {
  $listTitle._devText = devTitle;
  $listTitle.classList.add('dev-text');
  $listTitle.textContent = translit(devTitle);
  $listCount.textContent = countText;
}

function setActiveNavBtn(btn) {
  if (activeNavBtn) activeNavBtn.classList.remove('active');
  activeNavBtn = btn;
  if (btn) btn.classList.add('active');
}

function toggleSimpleCard(card) {
  const wasOpen = card.classList.contains('open');
  if (activeCard && activeCard !== card) activeCard.classList.remove('open');
  card.classList.toggle('open', !wasOpen);
  activeCard = card.classList.contains('open') ? card : null;
}

// ── Navigation tree ───────────────────────────────────────────────────────────
function buildNavTree() {
  $navTree.innerHTML = '';
  for (const book of BOOKS) $navTree.appendChild(buildBookEntry(book));
}

function buildBookEntry(book) {
  const wrap = document.createElement('div');
  wrap.className = 'nav-book';

  const btn = document.createElement('button');
  btn.className = 'nav-book-btn';
  btn.appendChild(makeNavLabel(book.devName));

  if (book.type === 'leaf') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => handleLeafClick(book, btn));
    wrap.appendChild(btn);
    return wrap;
  }

  if (book.type === 'about-menu') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => { closeDrawer(); showAbout(); });
    wrap.appendChild(btn);
    return wrap;
  }

  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.textContent = '▶';
  btn.appendChild(arrow);
  btn.setAttribute('aria-expanded', 'false');

  const container = document.createElement('div');
  container.className = 'nav-sections';

  if (book.type === 'adhyaya-tree') {
    buildAshtadhyayiSections(container);
    btn.addEventListener('click', () => {
      const open = container.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  } else if (book.type === 'lazy-gana-tree') {
    let built = false;
    btn.addEventListener('click', async () => {
      const open = container.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      if (open && !built) { built = true; await buildGanaSections(book, container); }
    });
  }

  wrap.appendChild(btn);
  wrap.appendChild(container);
  return wrap;
}

// ── Ashtadhyayi: adhyaya → pada tree ─────────────────────────────────────────
function buildAshtadhyayiSections(container) {
  const counts = {};
  for (const s of sutraList) {
    const k = `${s.a}_${s.p}`;
    counts[k] = (counts[k] || 0) + 1;
  }
  for (let a = 1; a <= 8; a++) {
    const adDiv = document.createElement('div');
    adDiv.className = 'nav-adhyaya';

    const adBtn = document.createElement('button');
    adBtn.className = 'nav-adhyaya-btn';
    adBtn.appendChild(makeNavLabel(ADHYAYA_NAMES_DEV[a]));
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '▶';
    adBtn.appendChild(arrow);
    adBtn.setAttribute('aria-expanded', 'false');

    const padasDiv = document.createElement('div');
    padasDiv.className = 'nav-padas';

    for (let p = 1; p <= 4; p++) {
      const pb = document.createElement('button');
      pb.className = 'nav-pada-btn';
      pb.dataset.a = a;
      pb.dataset.p = p;
      pb.appendChild(makeNavLabel(PADA_NAMES_DEV[p]));
      const cnt = document.createElement('span');
      cnt.className = 'nav-pada-count';
      cnt.textContent = counts[`${a}_${p}`] || 0;
      pb.appendChild(cnt);
      pb.addEventListener('click', () => showPada(a, p, pb));
      padasDiv.appendChild(pb);
    }

    adBtn.addEventListener('click', () => {
      const open = padasDiv.classList.toggle('open');
      adBtn.classList.toggle('open', open);
      adBtn.setAttribute('aria-expanded', open);
    });

    adDiv.appendChild(adBtn);
    adDiv.appendChild(padasDiv);
    container.appendChild(adDiv);
  }
}

// ── Dhatupatha: load data then build gana sub-items ───────────────────────────
async function buildGanaSections(book, container) {
  const loadEl = document.createElement('div');
  loadEl.className = 'nav-loading';
  loadEl.textContent = '…';
  container.appendChild(loadEl);
  try {
    const data = await loadData(book.id, book.dataPath);
    const counts = {};
    for (const d of data) counts[d.gana] = (counts[d.gana] || 0) + 1;
    container.removeChild(loadEl);
    for (let g = 1; g <= 10; g++) {
      const btn = document.createElement('button');
      btn.className = 'nav-section-btn';
      btn.appendChild(makeNavLabel(GANA_LABELS_DEV[g]));
      const cnt = document.createElement('span');
      cnt.className = 'nav-pada-count';
      cnt.textContent = counts[String(g)] || 0;
      btn.appendChild(cnt);
      const gKey = String(g);
      btn.addEventListener('click', () => {
        setActiveNavBtn(btn);
        closeDrawer();
        currentPada = null;
        readerList = [];
        readerIdx  = -1;
        readerSutra = null;
        updateReaderNav();
        renderDhatuList(data.filter(d => d.gana === gKey), GANA_LABELS_DEV[g]);
      });
      container.appendChild(btn);
    }
  } catch (_) {
    loadEl.textContent = 'Error loading';
  }
}

// ── Leaf book click: load data and render ─────────────────────────────────────
async function handleLeafClick(book, btn) {
  closeDrawer();
  setActiveNavBtn(btn);
  currentPada = null;
  readerList  = [];
  readerIdx   = -1;
  readerSutra = null;
  updateReaderNav();
  activeCard  = null;

  try {
    const data = await loadData(book.id, book.dataPath);
    switch (book.id) {
      case 'shivasutra':      renderShivaSutra(data);    break;
      case 'ganapatha':       renderGanaList(data);      break;
      case 'unaadi':          renderUnaadiAll(data);     break;
      case 'linganushasanam': renderLingaAll(data);      break;
      case 'shiksha':         renderShikshaAll(data);    break;
      case 'fit':             renderFitAll(data);        break;
    }
  } catch (_) {
    setListHeader(book.devName, '');
    $sutraList.innerHTML = `<p style="padding:16px;color:var(--muted)">Error loading data.</p>`;
    showPanel('list');
  }
}

// ── Ashtadhyayi sutra cards (list view) ──────────────────────────────────────
function createSutraCard(sutra) {
  const card = document.createElement('div');
  card.className = 'sutra-card';
  card.dataset.id = sutra.i;

  // Collapsed row
  const row = document.createElement('div');
  row.className = 'sutra-row';
  row.innerHTML = `<span class="sutra-id">${sutra.a}.${sutra.p}.${sutra.n}</span>`;
  const tSpan = document.createElement('span');
  tSpan.className = 'sutra-text';
  tSpan.textContent = translit(sutra.s);
  row.appendChild(tSpan);

  const audioBtn = document.createElement('button');
  audioBtn.className = 'audio-btn';
  audioBtn.title = 'Play pronunciation';
  audioBtn.textContent = '▶';
  audioBtn.addEventListener('click', e => {
    e.stopPropagation();
    playsutra(sutra, audioBtn);
  });
  row.appendChild(audioBtn);

  const t = (sutra.type || '').split('$')[0];
  row.appendChild(devEl('span', `sutra-badge badge-${t}`, TYPE_BADGE_DEV[t] || t || '?'));

  // Detail (expanded)
  const detail = document.createElement('div');
  detail.className = 'sutra-detail';

  const fullEl = document.createElement('div');
  fullEl.className = 'detail-sutra-full';
  fullEl.textContent = translit(sutra.s);
  detail.appendChild(fullEl);

  detail.appendChild(buildSutraMeta(sutra));
  buildTabGroups(sutra, detail, true);

  card.appendChild(row);
  card.appendChild(detail);
  card.addEventListener('click', () => toggleCard(card, sutra));
  return card;
}

async function loadTabData(tabDef, panel, sutra) {
  panel._loaded = true;
  panel.textContent = '…';
  try {
    const data = await loadData(tabDef.id, tabDef.dataPath);
    const raw  = (data[sutra.i] || '').trim();
    panel._rawCommentary = raw;
    panel.classList.add('commentary-text', 'commentary-panel');
    setCommentaryHTML(panel, raw);
  } catch (_) {
    panel._loaded = false;
    panel.textContent = 'Could not load.';
  }
}

// Build stacked commentary tab groups into a container element.
// Used by both renderReaderSutra() and createSutraCard().
// inCard = true applies card-edge bleed margins to tab bars.
function buildTabGroups(sutra, container, inCard) {
  let firstGroupRendered = false;

  for (const group of TAB_GROUPS) {

    // ── Notes placeholder (Phase 4) ──
    if (group.type === 'notes-placeholder') {
      const notesEl = document.createElement('div');
      notesEl.className = 'tab-group notes-group';
      const inner = document.createElement('div');
      inner.className = 'notes-placeholder';
      ['Our notes', 'Your notes'].forEach(label => {
        const btn = document.createElement('span');
        btn.className = 'notes-btn';
        btn.textContent = label;
        inner.appendChild(btn);
      });
      notesEl.appendChild(inner);
      container.appendChild(notesEl);
      continue;
    }

    const groupEl = document.createElement('div');
    groupEl.className = 'tab-group';

    const tabBar = document.createElement('div');
    tabBar.className = inCard ? 'detail-tabs detail-tabs-card' : 'detail-tabs';

    const panelWrap = document.createElement('div');
    panelWrap.className = 'detail-tab-panels';

    const panels = {};

    for (const def of group.tabs) {
      const panel = document.createElement('div');
      panel.className = 'detail-tab-panel';
      panel.dataset.panel = def.id;
      panels[def.id] = panel;

      const tab = document.createElement('button');
      if (def.latin) {
        tab.className = 'detail-tab';
        tab.textContent = def.devLabel;
      } else {
        tab.className = 'detail-tab dev-text';
        tab._devText = def.devLabel;
        tab.textContent = translit(def.devLabel);
      }

      tab.addEventListener('click', async () => {
        tabBar.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        Object.values(panels).forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
        if (!panel._loaded) await loadTabData(def, panel, sutra);
      });
      tabBar.appendChild(tab);
      panelWrap.appendChild(panel);
    }

    // Activate first tab; auto-load only first tab of first group
    const firstTab   = tabBar.querySelector('.detail-tab');
    const firstPanel = panelWrap.querySelector('.detail-tab-panel');
    if (firstTab)   firstTab.classList.add('active');
    if (firstPanel) {
      firstPanel.classList.add('active');
      if (!firstGroupRendered) {
        firstGroupRendered = true;
        loadTabData(group.tabs[0], firstPanel, sutra);
      }
    }

    groupEl.appendChild(tabBar);
    groupEl.appendChild(panelWrap);
    container.appendChild(groupEl);
  }
}

async function toggleCard(card, sutra) {
  const isOpen = card.classList.contains('open');
  if (activeCard && activeCard !== card) activeCard.classList.remove('open');
  if (isOpen) { card.classList.remove('open'); activeCard = null; return; }
  card.classList.add('open');
  activeCard = card;
  // Auto-load first tab of first commentary group on open
  const firstGroup = TAB_GROUPS.find(g => g.tabs);
  if (firstGroup) {
    const firstPanel = card.querySelector(`.detail-tab-panel[data-panel="${firstGroup.tabs[0].id}"]`);
    if (firstPanel && !firstPanel._loaded) await loadTabData(firstGroup.tabs[0], firstPanel, sutra);
  }
}

// ── Ashtadhyayi: show pada ────────────────────────────────────────────────────
function showPada(a, p, btnEl) {
  currentPada = { a, p };
  activeCard  = null;
  if (btnEl) setActiveNavBtn(btnEl);

  const filtered = sutraList.filter(s => +s.a === +a && +s.p === +p);

  // Prepare list view (in background)
  setListHeader(`${ADHYAYA_NAMES_DEV[a]} — ${PADA_NAMES_DEV[p]}`, `${filtered.length} sūtras`);
  $sutraList.innerHTML = '';
  for (const s of filtered) $sutraList.appendChild(createSutraCard(s));

  // Set reader list and enter reader mode
  readerList = filtered;
  if (filtered.length) {
    closeDrawer();
    showReader(filtered[0], 0);
  } else {
    closeDrawer();
    showPanel('list');
  }
}

// ── Sutra navigation ──────────────────────────────────────────────────────────
function idToRef(idStr) {
  const id = +idStr;
  if (!id) return '';
  return `${Math.floor(id / 10000)}.${Math.floor((id % 10000) / 1000)}.${id % 1000}`;
}

function gotoSutra(idStr) {
  const sutra = sutraIndex[idStr];
  if (!sutra) return;
  closeDrawer();

  const pada = sutraList.filter(s => +s.a === +sutra.a && +s.p === +sutra.p);
  const idx  = pada.findIndex(s => s.i === idStr);

  // Rebuild list view for this pada
  currentPada = { a: +sutra.a, p: +sutra.p };
  setListHeader(`${ADHYAYA_NAMES_DEV[+sutra.a]} — ${PADA_NAMES_DEV[+sutra.p]}`, `${pada.length} sūtras`);
  $sutraList.innerHTML = '';
  for (const s of pada) $sutraList.appendChild(createSutraCard(s));

  readerList = pada;
  showReader(sutra, idx >= 0 ? idx : 0);
}

function gotoDhatu(baseindex) {
  const idx = dhatuReaderList.findIndex(d => d.baseindex === baseindex);
  if (idx < 0) return;
  closeDrawer();
  showDhatuReader(dhatuReaderList[idx], idx);
}

// ── bar-ref click: toggle between reader and list view ────────────────────────
$barRef.addEventListener('click', () => {
  if (currentPanel === 'reader') {
    showPanel('list');
  } else if (currentPanel === 'list' && (readerType === 'dhatu' ? dhatuReaderList.length : readerList.length)) {
    showPanel('reader');
  }
});

// ── Search ────────────────────────────────────────────────────────────────────
let searchScope = 'ashtadhyayi';

const SEARCH_SCOPES = [
  { id: 'ashtadhyayi', devLabel: 'अष्टाध्यायी' },
  { id: 'dhatupatha',  devLabel: 'धातुपाठः'     },
  { id: 'sarva',       devLabel: 'सर्वम्'        },
];
const SEARCH_CAP = 20;   // max results per book/group

function buildSearchScopes() {
  const row = document.getElementById('search-scope-row');
  row.innerHTML = '';
  for (const sc of SEARCH_SCOPES) {
    const btn = document.createElement('button');
    btn.className = 'scope-pill dev-text' + (sc.id === searchScope ? ' active' : '');
    btn.dataset.scope = sc.id;
    btn._devText = sc.devLabel;
    btn.textContent = translit(sc.devLabel);
    btn.addEventListener('click', () => {
      searchScope = sc.id;
      row.querySelectorAll('.scope-pill').forEach(p =>
        p.classList.toggle('active', p.dataset.scope === sc.id));
      runSearch($searchInput.value);
    });
    row.appendChild(btn);
  }
}

// Highlight matching substring (returns a <span> with a <mark> inside)
function highlightMatch(devText, q) {
  const displayed = translit(devText);
  const span = document.createElement('span');
  span.className = 'sri-text';
  span._devText = devText;   // for retransliteration
  // Try to find match in transliterated text
  const idx = displayed.indexOf(q);
  if (idx >= 0) {
    span.appendChild(document.createTextNode(displayed.slice(0, idx)));
    const mark = document.createElement('mark');
    mark.textContent = displayed.slice(idx, idx + q.length);
    span.appendChild(mark);
    span.appendChild(document.createTextNode(displayed.slice(idx + q.length)));
  } else {
    // Fallback: show without highlight (match may be in Devanagari while q is Latin)
    span.textContent = displayed;
  }
  return span;
}

function makeSutraResultItem(sutra, q) {
  const item = document.createElement('div');
  item.className = 'search-result-item';
  const ref = document.createElement('span');
  ref.className = 'sri-ref';
  ref.textContent = `${sutra.a}.${sutra.p}.${sutra.n}`;
  item.appendChild(ref);
  item.appendChild(highlightMatch(sutra.s, q));
  item.addEventListener('click', () => gotoSutra(sutra.i));
  return item;
}

function makeDhatuResultItem(d, q) {
  const item = document.createElement('div');
  item.className = 'search-result-item';
  const ref = document.createElement('span');
  ref.className = 'sri-ref';
  ref.textContent = d.baseindex || '';
  item.appendChild(ref);
  // dhatu + artha
  const textWrap = document.createElement('span');
  textWrap.className = 'sri-text';
  const dSpan = document.createElement('span');
  dSpan.className = 'dev-text';
  dSpan._devText = d.dhatu || '';
  dSpan.textContent = translit(d.dhatu || '');
  textWrap.appendChild(dSpan);
  if (d.artha) {
    const aSpan = document.createElement('span');
    aSpan.className = 'dev-text';
    aSpan._devText = d.artha;
    aSpan.textContent = ' — ' + translit(d.artha);
    textWrap.appendChild(aSpan);
  }
  item.appendChild(textWrap);
  item.addEventListener('click', async () => {
    // Show all dhatus in the same gana, so the user has context
    const data = await loadData('dhatupatha', 'dhatu/data.txt');
    const ganaItems = data.filter(x => x.gana === d.gana);
    renderDhatuList(ganaItems, GANA_NAMES_DEV[+d.gana] || d.gana);
    closeDrawer();
  });
  return item;
}

// Filter Ashtadhyayi sutras
function searchSutras(q) {
  const idMatch = /^(\d)\.(\d)\.(\d+)$/.exec(q);
  if (idMatch) {
    const id = String((+idMatch[1]) * 10000 + (+idMatch[2]) * 1000 + (+idMatch[3])).padStart(5, '0');
    return sutraList.filter(s => s.i === id);
  }
  const lower = q.toLowerCase();
  return sutraList.filter(s =>
    s.s.includes(q) || (s.ss && s.ss.includes(q)) || (s.e && s.e.toLowerCase().includes(lower)));
}

// Filter Dhatupatha entries
function searchDhatus(data, q) {
  const lower = q.toLowerCase();
  return data.filter(d =>
    (d.dhatu && d.dhatu.includes(q)) ||
    (d.aupadeshik && d.aupadeshik.includes(q)) ||
    (d.artha && d.artha.includes(q)) ||
    (d.meaning_en && d.meaning_en.toLowerCase().includes(lower)));
}

function renderGroup(container, devTitle, items, makeItemFn, q, total) {
  const header = document.createElement('div');
  header.className = 'search-group-header';
  const titleSpan = document.createElement('span');
  titleSpan.className = 'dev-text';
  titleSpan._devText = devTitle;
  titleSpan.textContent = translit(devTitle);
  header.appendChild(titleSpan);
  if (total > items.length) {
    const more = document.createElement('span');
    more.className = 'search-group-more';
    more.textContent = `+${total - items.length} more`;
    header.appendChild(more);
  }
  container.appendChild(header);
  for (const item of items) container.appendChild(makeItemFn(item, q));
}

async function runSearch(raw) {
  const q = raw.trim();
  $searchDrawerBody.innerHTML = '';
  if (!q) { $searchClear.style.display = 'none'; return; }
  $searchClear.style.display = 'block';

  if (searchScope === 'ashtadhyayi') {
    const results = searchSutras(q);
    const countEl = document.createElement('div');
    countEl.className = 'search-drawer-count';
    countEl.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
    $searchDrawerBody.appendChild(countEl);
    const shown = results.slice(0, SEARCH_CAP);
    for (const s of shown) $searchDrawerBody.appendChild(makeSutraResultItem(s, q));
    if (results.length > SEARCH_CAP) {
      const more = document.createElement('div');
      more.className = 'search-drawer-count';
      more.textContent = `… and ${results.length - SEARCH_CAP} more — refine your query`;
      $searchDrawerBody.appendChild(more);
    }

  } else if (searchScope === 'dhatupatha') {
    const loadEl = document.createElement('div');
    loadEl.className = 'search-loading';
    loadEl.textContent = 'Loading…';
    $searchDrawerBody.appendChild(loadEl);
    const data = await loadData('dhatupatha', 'dhatu/data.txt');
    $searchDrawerBody.innerHTML = '';
    const results = searchDhatus(data, q);
    const countEl = document.createElement('div');
    countEl.className = 'search-drawer-count';
    countEl.textContent = `${results.length} dhātu${results.length !== 1 ? 's' : ''}`;
    $searchDrawerBody.appendChild(countEl);
    for (const d of results.slice(0, SEARCH_CAP))
      $searchDrawerBody.appendChild(makeDhatuResultItem(d, q));
    if (results.length > SEARCH_CAP) {
      const more = document.createElement('div');
      more.className = 'search-drawer-count';
      more.textContent = `… and ${results.length - SEARCH_CAP} more`;
      $searchDrawerBody.appendChild(more);
    }

  } else if (searchScope === 'sarva') {
    // Load small books in parallel, show groups
    const [dhatu, shiva] = await Promise.all([
      loadData('dhatupatha', 'dhatu/data.txt').catch(() => null),
      loadData('shivasutra',  'shivasutra/data.txt').catch(() => null),
    ]);

    const sutraResults = searchSutras(q);
    const dhatuResults = dhatu ? searchDhatus(dhatu, q) : [];
    const shivaResults = shiva
      ? shiva.filter(s => s.sutra && s.sutra.includes(q))
      : [];

    const total = sutraResults.length + dhatuResults.length + shivaResults.length;
    const countEl = document.createElement('div');
    countEl.className = 'search-drawer-count';
    countEl.textContent = total
      ? `${total} result${total !== 1 ? 's' : ''} across all books`
      : 'No results';
    $searchDrawerBody.appendChild(countEl);

    if (sutraResults.length)
      renderGroup($searchDrawerBody, 'अष्टाध्यायी', sutraResults.slice(0, SEARCH_CAP),
        makeSutraResultItem, q, sutraResults.length);
    if (dhatuResults.length)
      renderGroup($searchDrawerBody, 'धातुपाठः', dhatuResults.slice(0, SEARCH_CAP),
        makeDhatuResultItem, q, dhatuResults.length);
    if (shivaResults.length) {
      const makeShiva = (s, q) => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        const ref = document.createElement('span');
        ref.className = 'sri-ref';
        ref.textContent = s.id || '';
        item.appendChild(ref);
        item.appendChild(highlightMatch(s.sutra, q));
        return item;
      };
      renderGroup($searchDrawerBody, 'शिवसूत्राणि', shivaResults.slice(0, SEARCH_CAP),
        makeShiva, q, shivaResults.length);
    }
  }
}

$searchInput.addEventListener('input', e => runSearch(e.target.value));
$searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $searchInput.value = '';
    $searchClear.style.display = 'none';
    $searchDrawerBody.innerHTML = '';
    closeDrawer();
  }
});
$searchClear.addEventListener('click', () => {
  $searchInput.value = '';
  $searchClear.style.display = 'none';
  $searchDrawerBody.innerHTML = '';
});

// ── About drawer ──────────────────────────────────────────────────────────────
function buildAboutPanelNav() {
  if (aboutNavBuilt) return;
  aboutNavBuilt = true;
  const book = BOOKS.find(b => b.id === 'about');
  if (!book) return;
  for (const sec of book.sections) {
    const btn = document.createElement('button');
    btn.className = 'about-panel-tab';
    btn.dataset.section = sec.id;
    btn.textContent = sec.engName;
    btn.addEventListener('click', () => renderAboutSection(sec.id));
    $aboutPanelNav.appendChild(btn);
  }
  renderAboutSection(book.sections[0].id);
}

function showAbout() {
  buildAboutPanelNav();
  showPanel('about');
  closeDrawer();
}

function renderAboutSection(id) {
  const CONTENT = {
    credits: {
      html: `
        <div class="about-section">
          <h2 class="about-title">Credits</h2>
          <p class="about-intro">This site is built on the shoulders of several outstanding open resources.</p>
          <div class="about-card">
            <div class="about-card-title">Data — ashtadhyayi.com</div>
            <p>All sutra data, Kashika Vritti, Laghu Kaumudi, Dhatupatha, Ganapatha, Unaadi Kosha, and audio recordings are sourced from the open data repository maintained by <a href="https://ashtadhyayi.com" target="_blank">ashtadhyayi.com</a>.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Transliteration — Sanscript.js</div>
            <p>Multi-script transliteration across 10+ Indic scripts is powered by <a href="https://github.com/sanskrit-coders/sanscript.js" target="_blank">Sanscript.js</a>, an open-source library by the Sanskrit Coders community.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Typography</div>
            <p><strong>Vesper Libre</strong> — a serif typeface designed for Sanskrit.<br>
            <strong>Noto Sans Devanagari</strong> — Google's universal Indic script font.<br>
            Both served via Google Fonts.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Built with</div>
            <p>Vanilla HTML, CSS, and JavaScript — no frameworks, no build step. Fully static, runs anywhere.</p>
          </div>
        </div>`,
    },
    contact: {
      html: `
        <div class="about-section">
          <h2 class="about-title">Contact Us</h2>
          <p class="about-intro">Have a question, found an error, or want to contribute?</p>
          <div class="about-card">
            <div class="about-card-title">Data corrections</div>
            <p>For errors in sutra text or commentary, use the edit facility at <a href="https://ashtadhyayi.com" target="_blank">ashtadhyayi.com</a> — corrections flow into this site automatically.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Send feedback</div>
            <form id="feedback-form" class="feedback-form" onsubmit="return false;">
              <select id="fb-category" class="fb-input" required>
                <option value="" disabled selected>Category…</option>
                <option value="bug">Bug / broken feature</option>
                <option value="feature">Feature request</option>
                <option value="content">Content / translation error</option>
                <option value="other">General feedback</option>
              </select>
              <input id="fb-name" class="fb-input" type="text" placeholder="Your name (optional)" autocomplete="off">
              <input id="fb-email" class="fb-input" type="email" placeholder="Email (optional — if you'd like a reply)" autocomplete="off">
              <textarea id="fb-message" class="fb-input fb-textarea" rows="4" placeholder="Describe the issue or suggestion…" required></textarea>
              <button type="submit" id="fb-submit" class="fb-submit">Send</button>
              <div id="fb-status" class="fb-status"></div>
            </form>
          </div>
        </div>`,
    },
    support: {
      html: `
        <div class="about-section">
          <h2 class="about-title">Support Us</h2>
          <p class="about-intro">This site is free, ad-free, and open. If it has been useful to your studies, consider supporting the ecosystem that makes it possible.</p>
          <div class="about-card">
            <div class="about-card-title">Support ashtadhyayi.com</div>
            <p>The data powering this site comes from <a href="https://ashtadhyayi.com" target="_blank">ashtadhyayi.com</a>. Supporting them directly sustains the data, audio recordings, and research this site depends on.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Spread the word</div>
            <p>Share with Sanskrit students, Vedanta study groups, linguistics researchers, and anyone learning Panini's grammar.</p>
          </div>
        </div>`,
    },
  };

  const page = CONTENT[id];
  if (!page) return;
  $aboutPanelContent.innerHTML = page.html;
  $aboutPanelNav.querySelectorAll('.about-panel-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.section === id);
  });

  // Wire feedback form if present
  const form = document.getElementById('feedback-form');
  if (form) wireFeedbackForm(form);
}

function wireFeedbackForm(form) {
  const statusEl  = document.getElementById('fb-status');
  const submitBtn = document.getElementById('fb-submit');

  form.addEventListener('submit', async () => {
    const category = document.getElementById('fb-category').value;
    const name     = document.getElementById('fb-name').value.trim();
    const email    = document.getElementById('fb-email').value.trim();
    const message  = document.getElementById('fb-message').value.trim();

    if (!category || !message) {
      statusEl.textContent = 'Please choose a category and write a message.';
      statusEl.className   = 'fb-status fb-error';
      return;
    }

    if (!FEEDBACK_SCRIPT_URL) {
      // Dev mode: log to console so you can test the form UI without a script
      console.log('Feedback (no script URL set):', { category, name, email, message });
      statusEl.textContent = 'Thank you! (Feedback logged to console — script URL not configured yet.)';
      statusEl.className   = 'fb-status fb-ok';
      form.reset();
      return;
    }

    submitBtn.disabled   = true;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent  = '';
    statusEl.className    = 'fb-status';

    try {
      await fetch(FEEDBACK_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',   // Apps Script requires no-cors; we won't see response body
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, name, email, message,
          page: window.location.href, ts: new Date().toISOString() }),
      });
      statusEl.textContent = 'Thank you — your feedback has been received!';
      statusEl.className   = 'fb-status fb-ok';
      form.reset();
    } catch (_) {
      statusEl.textContent = 'Something went wrong. Please try again.';
      statusEl.className   = 'fb-status fb-error';
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send';
    }
  });
}

// ── Shivasutra ────────────────────────────────────────────────────────────────
function renderShivaSutra(data) {
  setListHeader('शिवसूत्राणि', `${data.length} sūtras`);
  $sutraList.innerHTML = '';
  for (const s of data) {
    const card = document.createElement('div');
    card.className = 'sutra-card';
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    idEl.textContent = s.id;
    row.appendChild(idEl);
    row.appendChild(devEl('span', 'sutra-text', s.sutra));
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    detail.appendChild(devEl('div', 'detail-sutra-full', s.sutra));
    if (s.kashika) {
      const sec = document.createElement('div');
      sec.className = 'detail-section';
      const lbl = document.createElement('div');
      lbl.className = 'detail-label dev-text';
      lbl._devText = 'काशिका'; lbl.textContent = translit('काशिका');
      sec.appendChild(lbl);
      const body = document.createElement('div');
      body.className = 'commentary-text commentary-panel';
      body._rawCommentary = s.kashika;
      setCommentaryHTML(body, s.kashika);
      sec.appendChild(body);
      detail.appendChild(sec);
    }
    card.appendChild(row);
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Dhatupatha ────────────────────────────────────────────────────────────────
function renderDhatuList(items, devTitle) {
  setListHeader(devTitle, `${items.length} dhātus`);
  $sutraList.innerHTML = '';
  dhatuReaderList = items;
  readerType = 'dhatu';
  for (const d of items) $sutraList.appendChild(createDhatuCard(d));
  showPanel('list');
}

function createDhatuCard(d) {
  const card = document.createElement('div');
  card.className = 'sutra-card';

  const row = document.createElement('div');
  row.className = 'sutra-row';

  const idEl = document.createElement('span');
  idEl.className = 'sutra-id';
  idEl.textContent = d.baseindex;
  row.appendChild(idEl);

  const textWrap = document.createElement('span');
  textWrap.className = 'dhatu-text-wrap';
  textWrap.appendChild(devEl('span', 'sutra-text', d.dhatu));
  if (d.artha) textWrap.appendChild(devEl('span', 'dhatu-artha', d.artha));
  row.appendChild(textWrap);

  row.appendChild(devEl('span', 'sutra-badge badge-V', PADA_DETAIL_DEV[d.pada] || d.pada));

  card.appendChild(row);
  card.addEventListener('click', () => gotoDhatu(d.baseindex));
  return card;
}

// ── Ganapatha ─────────────────────────────────────────────────────────────────
function renderGanaList(data) {
  setListHeader('गणपाठः', `${data.length} gaṇas`);
  $sutraList.innerHTML = '';
  for (const g of data) {
    const card = document.createElement('div');
    card.className = 'sutra-card';
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    idEl.textContent = g.ind;
    row.appendChild(idEl);
    row.appendChild(devEl('span', 'sutra-text', g.name));
    const badge = document.createElement('span');
    badge.className = 'sutra-badge badge-AD';
    badge.textContent = g.sutra;
    row.appendChild(badge);
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    detail.appendChild(devEl('div', 'detail-sutra-full', g.name));
    if (g.vartika) {
      const sec = document.createElement('div');
      sec.className = 'detail-section';
      const lbl = document.createElement('div');
      lbl.className = 'detail-label';
      lbl.textContent = 'Vārtika';
      sec.appendChild(lbl);
      sec.appendChild(devEl('div', 'detail-sanskrit', g.vartika));
      detail.appendChild(sec);
    }
    const wordsSec = document.createElement('div');
    wordsSec.className = 'detail-section';
    const wordsLbl = document.createElement('div');
    wordsLbl.className = 'detail-label';
    wordsLbl.textContent = 'Words';
    wordsSec.appendChild(wordsLbl);
    const words = (g.words || '').replace(/<[^>]*>/g, '').split(/[।\n]+/).map(w => w.trim()).filter(Boolean);
    wordsSec.appendChild(devEl('div', 'gana-words', words.join(' · ')));
    detail.appendChild(wordsSec);
    card.appendChild(row);
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Unaadi ────────────────────────────────────────────────────────────────────
function renderUnaadiAll(data) {
  setListHeader('उणादिकोशः', `${data.length} sūtras`);
  $sutraList.innerHTML = '';
  for (const u of data) {
    const card = document.createElement('div');
    card.className = 'sutra-card';
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    idEl.textContent = `${u.i.slice(0, -3)}.${u.i.slice(-3)}`;
    row.appendChild(idEl);
    row.appendChild(devEl('span', 'sutra-text', u.sutra));
    row.appendChild(devEl('span', 'sutra-badge badge-S', u.pratyay || ''));
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    detail.appendChild(devEl('div', 'detail-sutra-full', u.sutra));
    if (u.sk) {
      const sec = document.createElement('div');
      sec.className = 'detail-section';
      const lbl = document.createElement('div');
      lbl.className = 'detail-label';
      lbl.textContent = 'Commentary';
      sec.appendChild(lbl);
      sec.appendChild(devEl('div', 'detail-sanskrit', u.sk.replace(/<[^>]*>/g, '')));
      detail.appendChild(sec);
    }
    card.appendChild(row);
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Linganushasanam ───────────────────────────────────────────────────────────
function renderLingaAll(data) {
  setListHeader('लिङ्गानुशासनम्', `${data.length} sūtras`);
  $sutraList.innerHTML = '';
  let lastSection = null;
  for (const l of data) {
    const section = l.adhikaar || '';
    if (section && section !== lastSection) {
      $sutraList.appendChild(devEl('div', 'section-header', section));
      lastSection = section;
    }
    const card = document.createElement('div');
    card.className = 'sutra-card';
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    idEl.textContent = l.id;
    row.appendChild(idEl);
    row.appendChild(devEl('span', 'sutra-text', l.sutra));
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    detail.appendChild(devEl('div', 'detail-sutra-full', l.sutra));
    if (l.sk) {
      const sec = document.createElement('div');
      sec.className = 'detail-section';
      const lbl = document.createElement('div');
      lbl.className = 'detail-label';
      lbl.textContent = 'Commentary';
      sec.appendChild(lbl);
      sec.appendChild(devEl('div', 'detail-sanskrit', l.sk));
      detail.appendChild(sec);
    }
    card.appendChild(row);
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Shiksha ───────────────────────────────────────────────────────────────────
function renderShikshaAll(data) {
  setListHeader('शिक्षा', `${data.length} ślokas`);
  $sutraList.innerHTML = '';
  for (const sh of data) {
    const card = document.createElement('div');
    card.className = 'sutra-card';
    const firstLine = (sh.text || '').split('\n')[0];
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    idEl.textContent = sh.id;
    row.appendChild(idEl);
    row.appendChild(devEl('span', 'sutra-text', firstLine));
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    detail.appendChild(devEl('div', 'detail-sutra-full', sh.text || ''));
    if (sh.pc) {
      const sec = document.createElement('div');
      sec.className = 'detail-section';
      const lbl = document.createElement('div');
      lbl.className = 'detail-label';
      lbl.textContent = 'Padaccheda';
      sec.appendChild(lbl);
      sec.appendChild(devEl('div', 'detail-split', sh.pc));
      detail.appendChild(sec);
    }
    card.appendChild(row);
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Fit Sutrani ───────────────────────────────────────────────────────────────
function renderFitAll(data) {
  setListHeader('फिट्सूत्राणि', `${data.length} sūtras`);
  $sutraList.innerHTML = '';
  let lastP = null;
  const pNames = ['', 'प्रथमः', 'द्वितीयः', 'तृतीयः', 'चतुर्थः'];
  for (const f of data) {
    if (f.p !== lastP) {
      $sutraList.appendChild(devEl('div', 'section-header', `${pNames[+f.p] || f.p} अध्यायः`));
      lastP = f.p;
    }
    const card = document.createElement('div');
    card.className = 'sutra-card';
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    idEl.textContent = `${f.p}.${f.n}`;
    row.appendChild(idEl);
    row.appendChild(devEl('span', 'sutra-text', f.s));
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    detail.appendChild(devEl('div', 'detail-sutra-full', f.s));
    if (f.sk) {
      const sec = document.createElement('div');
      sec.className = 'detail-section';
      const lbl = document.createElement('div');
      lbl.className = 'detail-label';
      lbl.textContent = 'Commentary';
      sec.appendChild(lbl);
      sec.appendChild(devEl('div', 'detail-sanskrit', f.sk));
      detail.appendChild(sec);
    }
    card.appendChild(row);
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Bottom bar button wiring ──────────────────────────────────────────────────
document.getElementById('btn-nav').addEventListener('click', () => {
  if (pinnedNav) {
    // ≡ acts as unpin when sidebar is pinned
    pinnedNav = false;
    localStorage.setItem('nav-pinned', '0');
    applyPinState();
    document.getElementById('drawer-nav').classList.remove('open');
  } else {
    openDrawer('nav');
  }
});
document.getElementById('btn-search').addEventListener('click', () => {
  openDrawer('search');
  setTimeout(() => $searchInput.focus(), 280);
});
// btn-script click handled inside buildScriptDropdown (hover + click toggle)
document.getElementById('btn-about').addEventListener('click', () => showAbout());

$btnPrev.addEventListener('click', () => {
  if (readerType === 'dhatu') {
    if (dhatuReaderIdx > 0) showDhatuReader(dhatuReaderList[dhatuReaderIdx - 1], dhatuReaderIdx - 1);
  } else {
    if (readerIdx > 0) showReader(readerList[readerIdx - 1], readerIdx - 1);
  }
});
$btnNext.addEventListener('click', () => {
  if (readerType === 'dhatu') {
    if (dhatuReaderIdx >= 0 && dhatuReaderIdx < dhatuReaderList.length - 1)
      showDhatuReader(dhatuReaderList[dhatuReaderIdx + 1], dhatuReaderIdx + 1);
  } else {
    if (readerIdx >= 0 && readerIdx < readerList.length - 1)
      showReader(readerList[readerIdx + 1], readerIdx + 1);
  }
});

$drawerBackdrop.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-close').forEach(btn => {
  btn.addEventListener('click', () => {
    // If the nav drawer is pinned, X should unpin (not just close)
    const drawer = btn.closest('.drawer');
    if (drawer && drawer.id === 'drawer-nav' && pinnedNav) {
      pinnedNav = false;
      localStorage.setItem('nav-pinned', '0');
      applyPinState();
    } else {
      closeDrawer();
    }
  });
});

// Keyboard: arrow keys for reader navigation, Escape for drawers
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeDrawer(); return; }
  if (activeDrawer || document.activeElement === $searchInput) return;
  if (e.key === 'ArrowRight') {
    if (readerType === 'dhatu' && dhatuReaderItem && dhatuReaderIdx < dhatuReaderList.length - 1)
      showDhatuReader(dhatuReaderList[dhatuReaderIdx + 1], dhatuReaderIdx + 1);
    else if (readerSutra && readerIdx < readerList.length - 1)
      showReader(readerList[readerIdx + 1], readerIdx + 1);
  }
  if (e.key === 'ArrowLeft') {
    if (readerType === 'dhatu' && dhatuReaderItem && dhatuReaderIdx > 0)
      showDhatuReader(dhatuReaderList[dhatuReaderIdx - 1], dhatuReaderIdx - 1);
    else if (readerSutra && readerIdx > 0)
      showReader(readerList[readerIdx - 1], readerIdx - 1);
  }
});

// ── Icon bar (always-visible collapsed nav) ───────────────────────────────────
function buildIconBar() {
  const bar = document.getElementById('icon-bar');
  bar.innerHTML = '';
  for (const book of BOOKS) {
    const btn = document.createElement('button');
    btn.className = 'icon-bar-btn';
    btn.title = book.engName;

    const isLatin = /^[^\u0900-\u097F]+$/.test(book.icon);
    const span = document.createElement('span');
    if (isLatin) {
      span.className = 'icon-bar-char';
      span.textContent = book.icon;
    } else {
      span.className = 'icon-bar-char dev-text';
      span._devText = book.icon;
      span.textContent = translit(book.icon);
    }
    btn.appendChild(span);

    // Clicking the icon bar always opens the nav drawer
    btn.addEventListener('click', () => openDrawer('nav'));
    bar.appendChild(btn);
  }
}

// ── Hover: icon bar → nav drawer (desktop only) ───────────────────────────────
function setupHoverZones() {
  if (window.matchMedia('(hover: none)').matches) return;

  const iconBar   = document.getElementById('icon-bar');
  const drawerNav = document.getElementById('drawer-nav');

  let openTimer  = null;
  let closeTimer = null;

  function cancelTimers() { clearTimeout(openTimer); clearTimeout(closeTimer); }

  function scheduleOpen() {
    cancelTimers();
    openTimer = setTimeout(() => openDrawer('nav', true), 320);
  }
  function scheduleClose() {
    cancelTimers();
    closeTimer = setTimeout(() => { if (hoverOpened) closeDrawer(); }, 380);
  }

  iconBar.addEventListener('mouseenter',   scheduleOpen);
  iconBar.addEventListener('mouseleave',   cancelTimers);
  drawerNav.addEventListener('mouseenter', cancelTimers);
  drawerNav.addEventListener('mouseleave', scheduleClose);
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  buildScriptDropdown();
  buildIconBar();
  buildSearchScopes();
  applyPinState();
  setupHoverZones();
  try {
    const raw = await fetchJSON('sutraani/data.txt');
    sutraList = raw.data || [];
    for (const s of sutraList) sutraIndex[s.i] = s;
    buildNavTree();
    retranslit();
    $welcomeStats.textContent = `${sutraList.length} sūtras · 8 adhyāyas · 32 pādas`;
    $loading.classList.add('hidden');
    showPanel('welcome');
  } catch (err) {
    document.querySelector('.loading-text').textContent = `Error: ${err.message}`;
  }
}

window.gotoSutra = gotoSutra;
init();
