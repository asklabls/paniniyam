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
const SCRIPT_DEFAULT = 'devanagari';
const SETTINGS_KEY   = 'paniniyam-script';

// ── Feedback form (Google Apps Script endpoint) ───────────────────────────────
// Paste your deployed Apps Script URL here after setup (see CLAUDE.md for instructions)
const FEEDBACK_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwK9CYsZQ9yAICmDW55sVqWLpXAA40tMAz5H74IurlIFHW-dvAONcMMh6SV4J2dps3zgQ/exec';

// ── Book catalogue ────────────────────────────────────────────────────────────
const BOOKS = [
  { id: 'shivasutra',      devName: 'शिवसूत्राणि',    engName: 'Śiva Sūtras',    type: 'leaf', dataPath: 'shivasutra/data.txt',         icon: 'शिव'  },
  { id: 'ashtadhyayi',     devName: 'अष्टाध्यायी',   engName: 'Ashtadhyayi',    type: 'pada-matrix-btn',                               icon: 'अष्ट०' },
  { id: 'dhatupatha',      devName: 'धातुपाठः',       engName: 'Dhatupatha',     type: 'gana-matrix-btn', dataPath: 'dhatu/data.txt',    icon: 'धातु'  },
  { id: 'ganapatha',       devName: 'गणपाठः',         engName: 'Gaṇapāṭha',      type: 'leaf', dataPath: 'ganapath/data.txt',           icon: 'गण'   },
  { id: 'unaadi',          devName: 'उणादिकोशः',      engName: 'Uṇādi Kośa',     type: 'leaf', dataPath: 'unaadi/data.txt',             icon: 'उणा'  },
  { id: 'linganushasanam', devName: 'लिङ्गानुशासनम्', engName: 'Liṅgānuśāsanam', type: 'leaf', dataPath: 'linganushasanam/data.txt',    icon: 'लिङ्' },
  { id: 'shiksha-group', devName: 'शिक्षा', engName: 'Śikṣā', type: 'sub-tree', icon: 'शिक्षा',
    pages: [
      { id: 'shiksha',        devName: 'पाणिनीयशिक्षा',      engName: 'Pāṇinīya Śikṣā',      type: 'leaf',                  dataPath: 'shiksha/data.txt' },
      { id: 'varnochchaaran', devName: 'वर्णोच्चारण-शिक्षा', engName: 'Varṇoccāraṇa Śikṣā',  type: 'varnochchaaran-panel' },
    ]
  },
  { id: 'visuals', devName: 'Visuals', engName: 'Visuals', type: 'visual-library', icon: 'Vis' },
  { id: 'books', devName: 'Books', engName: 'Books', type: 'sub-tree', icon: 'Books',
    pages: [
      { id: 'bhattikavya', devName: 'भट्टिकाव्यम्', engName: 'Bhaṭṭikāvya', type: 'bhattikavya-panel' },
    ]
  },
  { id: 'references', devName: 'References', engName: 'References', type: 'sub-tree', icon: 'Ref',
    pages: [
      { id: 'pratyaya', devName: 'प्रत्ययाः', engName: 'Pratyayas', type: 'sub-tree',
        pages: [
          { id: 'adanta',   devName: 'अदन्त-धातु',  engName: 'Adanta',  type: 'pratyaya-page' },
          { id: 'anadanta', devName: 'अनदन्त-धातु', engName: 'Anadanta', type: 'pratyaya-page' },
        ]
      },
      { id: 'shabda',     devName: 'शब्दरूपावली',   engName: 'Śabdarūpāvalī', type: 'shabda-browser' },
      { id: 'avyaya',     devName: 'अव्ययार्थाः',   engName: 'Avyayas',       type: 'avyaya-panel' },
      { id: 'paribhasha', devName: 'पारिभाषिक',     engName: 'Pāribhāṣika',   type: 'leaf' },
      { id: 'fit',        devName: 'फिट्सूत्राणि',  engName: 'Fiṭ Sūtrāṇi',  type: 'leaf', dataPath: 'fit/data.txt' },
    ]
  },
  { id: 'legal', devName: 'Legal', engName: 'Legal', type: 'sub-tree', icon: 'Legal',
    pages: [
      { id: 'privacy', devName: 'Privacy Policy', engName: 'Privacy Policy', type: 'legal-page' },
      { id: 'terms',   devName: 'Terms of Use',   engName: 'Terms of Use',   type: 'legal-page' },
    ]
  },
  { id: 'about', devName: 'About', engName: 'About', type: 'about-menu', icon: 'About',
    sections: [
      { id: 'gurus',     engName: 'Gurus'      },
      { id: 'resources', engName: 'Resources'  },
      { id: 'credits',   engName: 'Credits'    },
      { id: 'contact',   engName: 'Contact Us' },
      { id: 'support',   engName: 'Support Us' },
      { id: 'copyright', engName: 'Copyright'  },
      { id: 'themes',    engName: 'Themes'     },
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
      { id: 'sudarshandev', devLabel: 'आ० सुदर्शनदेव', type: 'pravachanam' },
      { id: 'kashika',  devLabel: 'काशिका',       dataPath: 'sutraani/kashika.txt'         },
      { id: 'vartika',  devLabel: 'वार्तिकम्',     dataPath: 'sutraani/vartika.txt'         },
      { id: 'bhashya',  devLabel: 'महाभाष्यम्',    dataPath: 'sutraani/bhashya.txt'         },
      { id: 'vasu_eng', devLabel: 'CS Vasu Eng',   dataPath: 'sutraani/vasu_english.txt', latin: true },
    ],
  },
  {
    id: 'media',
    type: 'media-notes',   // Diagram + YouTube + Author's Notes + Your notes
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
  {
    id: 'siddhi',
    type: 'siddhi-panel',   // derivation examples from vault siddhi notes
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
  : 'https://cdn.jsdelivr.net/gh/asklabls/paniniyam-data@master';
const FORMS_BASE = isLocal
  ? 'forms'
  : 'https://cdn.jsdelivr.net/gh/asklabls/paniniyam@main/forms';
// Private data (owner-authored / copyrighted content) — never committed to public repo.
// Set PRIVATE_BASE to a private CDN URL (R2, Cloudflare Worker, etc.) when deploying.
// All private features fall back silently when null.
const PRIVATE_BASE = isLocal ? 'private' : 'https://pub-19119053fd624d308a49f9189fffb000.r2.dev';
const SIDDHI_BASE   = PRIVATE_BASE ? PRIVATE_BASE + '/siddhi'   : null;
const DIAGRAM_BASE  = PRIVATE_BASE ? PRIVATE_BASE + '/visuals' : null;

// ── Google Drive notes (Phase 4) ─────────────────────────────────────────────
const GOOGLE_CLIENT_ID        = '868948839711-9o6jlfsrlhoa7qn5ngebqp91l60h7e35.apps.googleusercontent.com';
const DRIVE_SCOPE             = 'https://www.googleapis.com/auth/drive.file';
const NOTES_FILENAME          = 'paniniyam-notes.json';
const AUTHOR_NOTES_FILENAME   = 'paniniyam-author-notes.json';
const OWNER_EMAIL             = 'akupadhyayula@gmail.com';

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

// Bhattikavya state
const BK_SARGAS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21]; // sarga 15 absent
const BK_SARGA_NAMES_DEV = {
  1:'प्रथमः सर्गः', 2:'द्वितीयः सर्गः', 3:'तृतीयः सर्गः', 4:'चतुर्थः सर्गः',
  5:'पञ्चमः सर्गः', 6:'षष्ठः सर्गः', 7:'सप्तमः सर्गः', 8:'अष्टमः सर्गः',
  9:'नवमः सर्गः', 10:'दशमः सर्गः', 11:'एकादशः सर्गः', 12:'द्वादशः सर्गः',
  13:'त्रयोदशः सर्गः', 14:'चतुर्दशः सर्गः', 16:'षोडशः सर्गः',
  17:'सप्तदशः सर्गः', 18:'अष्टादशः सर्गः', 19:'ऊनविंशः सर्गः',
  20:'विंशः सर्गः', 21:'एकविंशः सर्गः',
};
let bkCurrentSarga = 0;   // 0 = matrix view
const bkCache = {};
const BK_SARGA_COUNTS = {
  1:23, 2:48, 3:49, 4:30, 5:96, 6:123, 7:96, 8:115, 9:116, 10:67,
  11:42, 12:81, 13:47, 14:120, 16:36, 17:101, 18:39, 19:27, 20:33, 21:34,
};

// Dhatu reader state
let dhatuReaderList = [];
let dhatuReaderIdx  = -1;
let dhatuReaderItem = null;
let readerType      = 'sutra'; // 'sutra' | 'dhatu'

// Google Drive notes state
let googleToken      = null;
let googleUser       = null;   // { name, email }
let notesData        = {};     // { sutraId: noteText }
let notesDriveFileId = null;
let notesLoaded      = false;
let _saveNotesTimer  = null;
let _saveInProgress  = false;

// Author notes state
let authorNotesData        = {};
let authorNotesDriveFileId = null;
let authorNotesLoaded      = false;
let youtubeData            = null;   // {sutraId: videoId} loaded from forms/youtube.json
let conceptsIndex          = null;   // {term: {path, category}} loaded from forms/concepts_index.json
const conceptSvgCache      = {};     // term → SVG text, cached after first fetch
let _saveAuthorTimer       = null;
let _saveAuthorInProgress  = false;

// Session tab memory — remembers last-clicked tab per group within one session
const activeTabByGroup = {};

// Drawer state
let activeDrawer    = null;
let hoverOpened     = false;   // true when drawer was opened by edge hover (not button click)
const _storedPin = localStorage.getItem('nav-pinned');
let pinnedNav    = _storedPin !== null ? _storedPin === '1' : window.innerWidth >= 768;
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
$welcomeTitle._devText   = $welcomeTitle.textContent.trim();
const $welcomeStats      = document.getElementById('welcome-stats');
const $scriptPills       = document.getElementById('script-pills');
const $barRef            = document.getElementById('bar-ref');
const $btnPrev           = document.getElementById('btn-prev');
const $btnNext           = document.getElementById('btn-next');
const $drawerBackdrop    = document.getElementById('drawer-backdrop');
const $panelAbout        = document.getElementById('panel-about');
const $aboutPanelNav     = document.getElementById('about-panel-nav');
const $aboutPanelContent = document.getElementById('about-panel-content');
const $panelPratyaya     = document.getElementById('panel-pratyaya');
const $panelShabda       = document.getElementById('panel-shabda');
const $panelAvyaya            = document.getElementById('panel-avyaya');
const $panelVarnochchaaran    = document.getElementById('panel-varnochchaaran');
const $panelVisuals           = document.getElementById('panel-visuals');
const $panelBhattikavya       = document.getElementById('panel-bhattikavya');
const $app               = document.getElementById('app');

// ── Transliteration ───────────────────────────────────────────────────────────
// Vedic accent / extension codepoints that have no equivalents in other scripts
const VEDIC_MARKS_RE = /[\u0951-\u0954\u1CD0-\u1CFF\uA8E0-\uA8F7]/g;

function translit(text) {
  if (!text || typeof text !== 'string') return text || '';
  if (currentScript === 'devanagari') return text;
  text = text.replace(VEDIC_MARKS_RE, '');
  try { return Sanscript.t(text, 'devanagari', currentScript); }
  catch (_) { return text; }
}

function translitMixed(text) {
  if (!text) return '';
  if (currentScript === 'devanagari') return text;
  // Include Vedic Extension blocks so they're stripped rather than left as boxes
  return text.replace(/[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8F7]+/g, m => translit(m));
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
  if (!raw) return '<span class="no-data">n/a</span>';

  // ── Inline renderer: handles <<>>, [[]], **bold**, plain text ─────────────
  function renderInline(text) {
    let html = '', buf = '', i = 0;

    function flush() {
      if (!buf) return;
      // Split on **bold** spans and transliterate each part
      const parts = buf.split(/(\*\*[^*]+\*\*)/);
      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          html += `<strong>${translitMixed(part.slice(2, -2))}</strong>`;
        } else {
          html += translitMixed(part);
        }
      }
      buf = '';
    }

    while (i < text.length) {
      // <<sutra quote>>
      if (text[i] === '<' && text[i+1] === '<') {
        const end = text.indexOf('>>', i+2);
        if (end !== -1) {
          flush();
          const devText = text.slice(i+2, end);
          const esc = devText.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
          html += `<span class="sutra-quote" data-dev="${esc}">${translit(devText)}</span>`;
          i = end + 2; continue;
        }
      }
      // [[ref]] or [[ref| display text]]
      if (text[i] === '[' && text[i+1] === '[') {
        const end = text.indexOf(']]', i+2);
        if (end !== -1) {
          flush();
          const inner   = text.slice(i+2, end);
          const pipeIdx = inner.indexOf('|');
          const ref     = (pipeIdx >= 0 ? inner.slice(0, pipeIdx) : inner).trim();
          const display = pipeIdx >= 0 ? inner.slice(pipeIdx+1).trim() : null;
          const sid = sutraRefToId(ref);
          if (sid) {
            const label = display ? translitMixed(display) : devDigitsToAscii(ref);
            html += `<a class="sutra-link" data-id="${sid}" href="#">${label}</a>`;
          } else {
            const esc = ref.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
            const label = display ? translitMixed(display) : translit(ref);
            html += `<a class="concept-link" data-concept="${esc}" href="#">${label}</a>`;
          }
          i = end + 2; continue;
        }
      }
      buf += text[i]; i++;
    }
    flush();
    return html;
  }

  // ── Paragraph/heading renderer ─────────────────────────────────────────────
  let html = '';
  const paragraphs = raw.split(/\n{2,}/);

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    if (trimmed === '---') { html += '<hr class="bk-fn-sep">'; continue; }

    let paraLines = '';
    for (const line of trimmed.split('\n')) {
      const t = line.trim();
      if (!t) continue;
      if (t.startsWith('### ')) {
        // Flush accumulated paragraph lines before heading
        if (paraLines) { html += `<p>${paraLines}</p>`; paraLines = ''; }
        html += `<div class="commentary-heading">${renderInline(t.slice(4))}</div>`;
      } else {
        paraLines += (paraLines ? '<br>' : '') + renderInline(t);
      }
    }
    if (paraLines) html += `<p>${paraLines}</p>`;
  }

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
    btn.textContent = pinnedNav ? '📌' : '📌';
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

// Nav drawer "Welcome" title → go home
document.querySelector('#drawer-nav .drawer-title').addEventListener('click', () => {
  closeDrawer();
  showPanel('welcome');
  clearURL();
});

// ── Panel switcher ────────────────────────────────────────────────────────────
function showPanel(name) {
  currentPanel = name;
  $panelWelcome.style.display  = name === 'welcome'  ? '' : 'none';
  $panelList.style.display     = name === 'list'     ? '' : 'none';
  $panelReader.style.display   = name === 'reader'   ? '' : 'none';
  $panelAbout.style.display    = name === 'about'    ? '' : 'none';
  $panelPratyaya.style.display = name === 'pratyaya' ? '' : 'none';
  $panelShabda.style.display   = name === 'shabda'   ? '' : 'none';
  $panelAvyaya.style.display            = name === 'avyaya'            ? '' : 'none';
  $panelVarnochchaaran.style.display    = name === 'varnochchaaran'    ? '' : 'none';
  $panelVisuals.style.display           = name === 'visuals'           ? '' : 'none';
  $panelBhattikavya.style.display       = name === 'bhattikavya'       ? '' : 'none';
  // Visuals panel fills viewport and manages its own scroll internally
  document.body.classList.toggle('vlib-active', name === 'visuals');
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

function updateURL(sutra) {
  const ref = `${sutra.a}.${sutra.p}.${sutra.n}`;
  history.replaceState({ sutra: sutra.i }, '', `?sutra=${ref}`);
}

function updateDhatuURL(dhatu) {
  history.replaceState({ dhatu: dhatu.baseindex }, '', `?dhatu=${dhatu.baseindex}`);
}

function updateBookURL(bookId) {
  history.replaceState({ book: bookId }, '', `?book=${bookId}`);
}

function clearURL() {
  history.replaceState({}, '', location.pathname);
}

function showReader(sutra, idx) {
  readerType  = 'sutra';
  readerIdx   = idx;
  readerSutra = sutra;
  renderReaderSutra(sutra);
  updateReaderNav();
  showPanel('reader');
  updateURL(sutra);
}

function showDhatuReader(dhatu, idx) {
  readerType      = 'dhatu';
  dhatuReaderIdx  = idx;
  dhatuReaderItem = dhatu;
  renderReaderDhatu(dhatu);
  updateReaderNav();
  showPanel('reader');
  prefetchDhatuForms(dhatuReaderList, idx);
  updateDhatuURL(dhatu);
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

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-link-btn';
  copyBtn.title = 'Copy link';
  copyBtn.textContent = '📋';
  copyBtn.addEventListener('click', () => {
    const url = `${location.origin}${location.pathname}?sutra=${sutra.a}.${sutra.p}.${sutra.n}`;
    navigator.clipboard.writeText(url).then(() => {
      copyBtn.textContent = '✓';
      copyBtn.title = 'Copied!';
      setTimeout(() => { copyBtn.textContent = '📋'; copyBtn.title = 'Copy link'; }, 1500);
    });
  });
  topRight.appendChild(copyBtn);

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
  if (activeDrawer && activeDrawer !== 'nav') closeDrawer();
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
  if ($welcomeTitle._devText) $welcomeTitle.textContent = translit($welcomeTitle._devText);

  document.querySelectorAll('.nav-label').forEach(el => {
    if (el._devText) el.textContent = translit(el._devText);
  });
  document.querySelectorAll('.dev-text').forEach(el => {
    if (el._devText === undefined) return;
    if (el.closest && el.closest('svg')) { _applySvgEl(el, el._devText, true); return; }
    el.textContent = translit(el._devText);
  });
  document.querySelectorAll('.mixed-text').forEach(el => {
    if (el._mixedText === undefined) return;
    if (el.closest && el.closest('svg')) { _applySvgEl(el, el._mixedText, false); return; }
    el.textContent = translitMixed(el._mixedText);
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

  // Leaf books (Unaadi, Linganushasanam, etc.) — commentary panels outside sutra cards
  document.querySelectorAll('.commentary-panel').forEach(p => {
    if (p._rawCommentary !== undefined) setCommentaryHTML(p, p._rawCommentary);
  });

  // Varnochchaaran Shiksha content re-render on script change
  const vnsWrap = document.querySelector('.vns-content');
  if (vnsWrap && vnsWrap._vnsMarkdown !== undefined) {
    vnsWrap.innerHTML = '';
    vnsWrap.appendChild(renderVnsContent(vnsWrap._vnsMarkdown));
    if (vnsWrap._vnsImage) {
      const img = document.createElement('img');
      img.src = vnsWrap._vnsImage;
      img.className = 'vns-section-img';
      vnsWrap.appendChild(img);
    }
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
    if (key === 'vartika' && Array.isArray(d) && d.length && d[0].sutra) {
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

  function addEmpty(val) {
    const dash = document.createElement('span');
    dash.className = 'meta-empty';
    dash.textContent = '—';
    val.appendChild(dash);
  }

  // पदच्छेदः
  addRow('पदच्छेदः', val => {
    if (sutra.pc) {
      sutra.pc.split('##').filter(Boolean).forEach((part, idx) => {
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
    } else { addEmpty(val); }
  });

  // समासः — from pravachanam.json when available
  addRow('समासः', val => {
    const s = bookData['pravachanam']?.[sutra.i]?.sm;
    if (s) val.appendChild(devEl('span', 'dev-text', s));
    else addEmpty(val);
  });

  // अनुवृत्तिः
  addRow('अनुवृत्तिः', val => {
    const parts = sutra.an ? sutra.an.split('##').filter(Boolean) : [];
    if (parts.length) {
      parts.forEach((part, idx) => {
        if (idx > 0) val.appendChild(document.createTextNode(' · '));
        const [word, id2] = part.split('$');
        if (!word) return;
        const wordSpan = devEl('span', '', word);
        if (id2) {
          const a = document.createElement('a');
          a.className = 'detail-anuvritta sutra-link';
          a.href = '#';
          a.dataset.id = id2;
          a.addEventListener('click', e => { e.preventDefault(); gotoSutra(id2); });
          a.appendChild(wordSpan);
          a.appendChild(document.createTextNode(` (${idToRef(id2)})`));
          val.appendChild(a);
        } else {
          val.appendChild(wordSpan);
        }
      });
    } else { addEmpty(val); }
  });

  // अधिकारः (conditional — only meaningful when present)
  // ad field may contain multiple adhikaras: "text$a$p$n##text$a$p$n"
  if (sutra.ad) {
    addRow('अधिकारः', val => {
      sutra.ad.split('##').forEach((chunk, idx) => {
        const [adText, a, p, n] = chunk.split('$');
        const sid = a && p && n ? `${a}${p}${String(+n).padStart(3, '0')}` : null;
        if (idx > 0) val.appendChild(document.createTextNode(' · '));
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
    });
  }

  // अन्वयः — same as अनुवृत्तिसहितं सूत्रम् (ss field)
  addRow('अन्वयः', val => {
    if (sutra.ss) val.appendChild(devEl('span', '', sutra.ss));
    else addEmpty(val);
  });

  // उदाहरणम् — from pravachanam.json when available
  addRow('उदाहरणम्', val => {
    const u = bookData['pravachanam']?.[sutra.i]?.ua;
    if (u) val.appendChild(devEl('span', 'dev-text', u));
    else addEmpty(val);
  });

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

function collapseNavItem(btn, container) {
  container.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}

function collapseAllBooks(exceptContainer) {
  $navTree.querySelectorAll('.nav-sections.open').forEach(c => {
    if (c === exceptContainer) return;
    const btn = c.previousElementSibling;
    if (btn) collapseNavItem(btn, c);
  });
}

function collapseAllAdhyayas(container, exceptPadas) {
  container.querySelectorAll('.nav-padas.open').forEach(p => {
    if (p === exceptPadas) return;
    const btn = p.previousElementSibling;
    if (btn) collapseNavItem(btn, p);
  });
}

function buildBookEntry(book, nested = false) {
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

  if (book.type === 'shabda-browser') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => { closeDrawer(); showShabdaEngine(); });
    wrap.appendChild(btn);
    return wrap;
  }

  if (book.type === 'avyaya-panel') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => { closeDrawer(); showAvyayaPanel(); });
    wrap.appendChild(btn);
    return wrap;
  }

  if (book.type === 'varnochchaaran-panel') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => { closeDrawer(); showVarnochchaaranPanel(); });
    wrap.appendChild(btn);
    return wrap;
  }

  if (book.type === 'visual-library') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => { closeDrawer(); showVisualLibrary(); });
    wrap.appendChild(btn);
    return wrap;
  }

  if (book.type === 'bhattikavya-panel') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => { closeDrawer(); openBkMatrix(); });
    wrap.appendChild(btn);
    return wrap;
  }

  if (book.type === 'pada-matrix-btn') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => { closeDrawer(); openPadaMatrix(); });
    wrap.appendChild(btn);
    return wrap;
  }

  if (book.type === 'gana-matrix-btn') {
    btn.classList.add('nav-book-leaf');
    btn.addEventListener('click', () => { closeDrawer(); openGanaMatrix(); });
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
      if (open) collapseAllBooks(container);
    });
  } else if (book.type === 'lazy-gana-tree') {
    let built = false;
    btn.addEventListener('click', async () => {
      const open = container.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      if (open) { collapseAllBooks(container); if (!built) { built = true; await buildGanaSections(book, container); } }
    });
  } else if (book.type === 'sub-tree') {
    for (const page of (book.pages || [])) {
      if (page.type === 'sub-tree') {
        // Nested sub-tree — render recursively
        const nestedEntry = buildBookEntry(page, true);
        nestedEntry.classList.add('nav-nested');
        container.appendChild(nestedEntry);
        continue;
      }
      const pb = document.createElement('button');
      pb.className = 'nav-pada-btn';
      pb.appendChild(makeNavLabel(page.devName));
      let clickFn;
      if (page.type === 'leaf') {
        clickFn = () => { closeDrawer(); handleLeafClick(page, pb); };
      } else if (page.type === 'varnochchaaran-panel') {
        clickFn = () => { closeDrawer(); showVarnochchaaranPanel(); };
      } else if (page.type === 'legal-page') {
        clickFn = () => { closeDrawer(); showLegalPage(page.id); };
      } else if (page.type === 'avyaya-panel') {
        clickFn = () => { closeDrawer(); showAvyayaPanel(); };
      } else if (page.type === 'pratyaya-page') {
        clickFn = () => { closeDrawer(); showPratyayaPage(page.id); };
      } else if (page.type === 'bhattikavya-panel') {
        clickFn = () => { closeDrawer(); openBkMatrix(); };
      } else if (page.type === 'shabda-browser') {
        clickFn = () => { closeDrawer(); showShabdaBrowser(); };
      } else {
        clickFn = () => { closeDrawer(); showPratyayaPage(page.id); };
      }
      pb.addEventListener('click', clickFn);
      container.appendChild(pb);
    }
    btn.addEventListener('click', () => {
      const open = container.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      if (open && !nested) collapseAllBooks(container);
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

  // Keep direct references for accordion collapse
  const adhyayaItems = [];

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

    adhyayaItems.push({ btn: adBtn, padas: padasDiv });

    adBtn.addEventListener('click', () => {
      const open = padasDiv.classList.toggle('open');
      adBtn.classList.toggle('open', open);
      adBtn.setAttribute('aria-expanded', open);
      if (open) {
        // Collapse all other adhyayas
        adhyayaItems.forEach(item => {
          if (item.padas !== padasDiv) {
            item.padas.classList.remove('open');
            item.btn.classList.remove('open');
            item.btn.setAttribute('aria-expanded', 'false');
          }
        });
      }
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
  updateBookURL(book.id);

  // Paribhasha is private-only — no public data file
  if (book.id === 'paribhasha') {
    try {
      if (!PRIVATE_BASE) throw new Error('no private base');
      const r = await fetch(`${PRIVATE_BASE}/paribhasha.json`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      renderParibhashaAll(j.sutras || []);
    } catch (_) {
      setListHeader('पारिभाषिक', '');
      $sutraList.innerHTML = `<p style="padding:16px;color:var(--muted)">Paribhasha data not available.</p>`;
      showPanel('list');
    }
    return;
  }

  try {
    const data = await loadData(book.id, book.dataPath);
    switch (book.id) {
      case 'shivasutra':      renderShivaSutra(data);    break;
      case 'ganapatha':       renderGanaList(data);      break;
      case 'unaadi':          renderUnaadiAll(data);     break;
      case 'linganushasanam': {
        let lingaPrivate = null;
        if (PRIVATE_BASE) {
          try {
            const r = await fetch(`${PRIVATE_BASE}/linganushasana.json`);
            if (r.ok) { const j = await r.json(); lingaPrivate = j.sutras || null; }
          } catch (_) {}
        }
        renderLingaAll(data, lingaPrivate);
        break;
      }
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
  if (tabDef.type === 'pravachanam') {
    await renderPravachanamTab(panel, sutra.i);
    return;
  }
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

async function renderPravachanamTab(panel, sutraId) {
  panel.classList.add('pravachanam-panel');
  if (!PRIVATE_BASE) { panel.textContent = '—'; return; }
  const data = await loadArthaData();
  const entry = data?.[sutraId];
  if (!entry?.a && !entry?.h) { panel.textContent = '—'; return; }
  if (entry.a) {
    const row = document.createElement('div');
    row.className = 'prav-row';
    const lbl = document.createElement('span');
    lbl.className = 'prav-lbl dev-text';
    lbl._devText = 'अर्थः';
    lbl.textContent = translit('अर्थः');
    const val = document.createElement('span');
    val.className = 'prav-val dev-text';
    val._devText = entry.a;
    val.textContent = translit(entry.a);
    row.appendChild(lbl);
    row.appendChild(val);
    panel.appendChild(row);
  }
  if (entry.h) {
    const row = document.createElement('div');
    row.className = 'prav-row prav-hindi';
    const lbl = document.createElement('span');
    lbl.className = 'prav-lbl dev-text';
    lbl._devText = 'हिन्दी';
    lbl.textContent = translit('हिन्दी');
    const val = document.createElement('span');
    val.className = 'prav-val dev-text';
    val._devText = entry.h;
    val.textContent = translit(entry.h);
    row.appendChild(lbl);
    row.appendChild(val);
    panel.appendChild(row);
  }
}

// ── Siddhi (derivation) panel ─────────────────────────────────────────────────
async function buildSiddhiPanel(sutraId, wrap, inCard) {
  // Lazy fetch {SIDDHI_BASE}/{sutraId}.json
  // SIDDHI_BASE is null in production until a private CDN is configured.
  if (!SIDDHI_BASE) return;
  let entries;
  try {
    if (!bookData['siddhi_' + sutraId]) {
      const res = await fetch(`${SIDDHI_BASE}/${sutraId}.json`);
      if (!res.ok) return;   // No siddhi data for this sutra — hide silently
      bookData['siddhi_' + sutraId] = await res.json();
    }
    entries = bookData['siddhi_' + sutraId];
  } catch (_) { return; }

  if (!entries || !entries.length) return;

  // Header bar
  const header = document.createElement('div');
  header.className = inCard ? 'detail-tabs detail-tabs-card siddhi-header' : 'detail-tabs siddhi-header';
  const headerLabel = document.createElement('span');
  headerLabel.className = 'siddhi-header-label dev-text';
  headerLabel.textContent = translit('सिद्धिः');
  headerLabel._devText = 'सिद्धिः';
  header.appendChild(headerLabel);
  wrap.appendChild(header);

  const body = document.createElement('div');
  body.className = 'siddhi-body';
  wrap.appendChild(body);

  if (entries.length === 1) {
    body.appendChild(renderSiddhiEntry(entries[0]));
    return;
  }

  // Multiple examples — tab pills
  const tabBar = document.createElement('div');
  tabBar.className = 'siddhi-tabs';
  const contentArea = document.createElement('div');
  contentArea.className = 'siddhi-content';
  body.appendChild(tabBar);
  body.appendChild(contentArea);

  entries.forEach((entry, i) => {
    const pill = document.createElement('button');
    pill.className = 'siddhi-pill dev-text' + (i === 0 ? ' active' : '');
    pill.textContent = translit(entry.word || `${i + 1}`);
    pill._devText = entry.word || `${i + 1}`;
    pill.addEventListener('click', () => {
      tabBar.querySelectorAll('.siddhi-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      contentArea.innerHTML = '';
      contentArea.appendChild(renderSiddhiEntry(entry));
    });
    tabBar.appendChild(pill);
  });
  contentArea.appendChild(renderSiddhiEntry(entries[0]));
}

// ── Siddhi tooltip (shared, appended to body once) ───────────────────────────
// ── Sutra artha popup ─────────────────────────────────────────────────────────
// Lazy-loads private/pravachanam.json once, then shows a card popup on hover.

let $arthaPopup = null;
let arthaHideTimer = null;

function getArthaPopup() {
  if (!$arthaPopup) {
    $arthaPopup = document.createElement('div');
    $arthaPopup.className = 'artha-popup';
    $arthaPopup.addEventListener('mouseenter', () => {
      clearTimeout(arthaHideTimer);
    });
    $arthaPopup.addEventListener('mouseleave', hideSiddhiTip);
    document.body.appendChild($arthaPopup);
  }
  return $arthaPopup;
}

async function loadArthaData() {
  if (bookData['pravachanam']) return bookData['pravachanam'];
  if (!PRIVATE_BASE) return null;
  try {
    const res = await fetch(`${PRIVATE_BASE}/pravachanam.json`);
    if (!res.ok) return null;
    bookData['pravachanam'] = await res.json();
    return bookData['pravachanam'];
  } catch (_) { return null; }
}

async function loadConceptsIndex() {
  if (conceptsIndex) return conceptsIndex;
  try {
    const res = await fetch(`${FORMS_BASE}/concepts_index.json`);
    if (res.ok) conceptsIndex = await res.json();
  } catch (_) {}
  return conceptsIndex;
}

async function showSiddhiTip(el, sutraId) {
  clearTimeout(arthaHideTimer);
  const sutra = sutraIndex[sutraId];
  if (!sutra) return;

  const popup = getArthaPopup();
  popup.innerHTML = '';

  // Header: ref + sutra text
  const head = document.createElement('div');
  head.className = 'artha-popup-head';
  const refSpan = document.createElement('span');
  refSpan.className = 'artha-popup-ref';
  refSpan.textContent = idToRef(sutraId);
  const sutText = document.createElement('span');
  sutText.className = 'artha-popup-sutra dev-text';
  sutText._devText = sutra.s;
  sutText.textContent = translit(sutra.s);
  head.appendChild(refSpan);
  head.appendChild(sutText);
  popup.appendChild(head);

  // Body: artha rows (may load async)
  const body = document.createElement('div');
  body.className = 'artha-popup-body';
  popup.appendChild(body);

  // Position immediately so popup appears without delay
  positionArthaPopup(el);
  popup.classList.add('visible');

  // Fill content (may be instant from cache or async)
  const arthaData = await loadArthaData();
  const entry = arthaData?.[sutraId];

  if (entry?.a) {
    const row = document.createElement('div');
    row.className = 'artha-row';
    const lbl = document.createElement('span');
    lbl.className = 'artha-lbl dev-text';
    lbl.textContent = translit('अर्थः');
    lbl._devText = 'अर्थः';
    const val = document.createElement('span');
    val.className = 'artha-val dev-text';
    val._devText = entry.a;
    val.textContent = translit(entry.a);
    row.appendChild(lbl);
    row.appendChild(val);
    body.appendChild(row);
  }
  if (entry?.h) {
    const row = document.createElement('div');
    row.className = 'artha-row artha-hindi';
    const val = document.createElement('span');
    val.className = 'dev-text';
    val._devText = entry.h;
    val.textContent = translit(entry.h);
    row.appendChild(val);
    body.appendChild(row);
  }
  if (!entry?.a && !entry?.h) {
    body.textContent = '—';
  }
}

function positionArthaPopup(el) {
  const popup = getArthaPopup();
  const r = el.getBoundingClientRect();
  const popW = 380;
  const margin = 8;
  let left = r.left;
  if (left + popW > window.innerWidth - margin) left = window.innerWidth - popW - margin;
  if (left < margin) left = margin;
  // Show below; if not enough room show above
  const spaceBelow = window.innerHeight - r.bottom;
  if (spaceBelow < 180 && r.top > 180) {
    popup.style.top = '';
    popup.style.bottom = (window.innerHeight - r.top + 4) + 'px';
  } else {
    popup.style.bottom = '';
    popup.style.top = (r.bottom + 4) + 'px';
  }
  popup.style.left = left + 'px';
}

function hideSiddhiTip() {
  arthaHideTimer = setTimeout(() => {
    if ($arthaPopup) $arthaPopup.classList.remove('visible');
  }, 120);
}

// ── Concept popup (hover SVG for [[term]] links) ───────────────────────────────
let $conceptPopup = null;
let conceptHideTimer = null;

function getConceptPopup() {
  if (!$conceptPopup) {
    $conceptPopup = document.createElement('div');
    $conceptPopup.className = 'concept-popup';
    $conceptPopup.addEventListener('mouseenter', () => clearTimeout(conceptHideTimer));
    $conceptPopup.addEventListener('mouseleave', hideConceptPopup);
    document.body.appendChild($conceptPopup);
  }
  return $conceptPopup;
}

function positionConceptPopup(el) {
  const popup = getConceptPopup();
  const r = el.getBoundingClientRect();
  const popW = Math.min(480, window.innerWidth - 16);
  const margin = 8;
  let left = r.left;
  if (left + popW > window.innerWidth - margin) left = window.innerWidth - popW - margin;
  if (left < margin) left = margin;
  const spaceBelow = window.innerHeight - r.bottom;
  if (spaceBelow < 260 && r.top > 260) {
    popup.style.top = '';
    popup.style.bottom = (window.innerHeight - r.top + 4) + 'px';
  } else {
    popup.style.bottom = '';
    popup.style.top = (r.bottom + 4) + 'px';
  }
  popup.style.left = left + 'px';
  popup.style.width = popW + 'px';
}

async function showConceptPopup(el, term) {
  clearTimeout(conceptHideTimer);
  if (!DIAGRAM_BASE) return;

  const index = await loadConceptsIndex();
  const entry = index?.[term];
  if (!entry) return;

  const popup = getConceptPopup();
  popup.innerHTML = '';

  // Label
  const lbl = document.createElement('div');
  lbl.className = 'concept-popup-label dev-text';
  lbl._devText = term;
  lbl.textContent = translit(term);
  popup.appendChild(lbl);

  // SVG area
  const svgWrap = document.createElement('div');
  svgWrap.className = 'concept-popup-svg';
  popup.appendChild(svgWrap);

  positionConceptPopup(el);
  popup.classList.add('visible');

  // Load SVG (cached)
  if (conceptSvgCache[term]) {
    svgWrap.innerHTML = conceptSvgCache[term];
    applyConceptSvgRetranslit(svgWrap);
    return;
  }
  svgWrap.innerHTML = '<span class="concept-popup-loading">…</span>';
  try {
    const r = await fetch(`${DIAGRAM_BASE}/${entry.path}`);
    if (!r.ok) { svgWrap.textContent = '—'; return; }
    const svgText = await r.text();
    conceptSvgCache[term] = svgText;
    // Only inject if popup is still visible for this term
    if (popup.classList.contains('visible') && popup.querySelector('.concept-popup-label')?._devText === term) {
      svgWrap.innerHTML = svgText;
      applyConceptSvgRetranslit(svgWrap);
    }
  } catch (_) { svgWrap.textContent = '—'; }
}

// Per-script font-size scale for concept SVGs.
// Indic scripts with larger/wider glyphs need a slight reduction to fit fixed SVG boxes.
// IAST uses diacritics (same character count as Devanagari) — slight reduction is enough.
// Roman multi-char schemes (ITRANS RRi, HK, SLP1…) keep Devanagari regardless.
const SVG_FONT_SCALE = {
  telugu: 0.82, kannada: 0.82, malayalam: 0.80, tamil: 0.82,
  iast: 0.92,
};
// Schemes where even scaling won't help — multi-char sequences expand text too much
const SVG_ROMAN_SKIP = new Set([
  'itrans','itrans_lowercase','itrans_dravidian','hk','hk_dravidian',
  'slp1','slp1_accented','velthuis','wx','optitrans','optitrans_dravidian',
  'kolkata_v2','baraha','titus',
]);

function _svgUseDevanagari() {
  if (currentScript === 'devanagari') return true;
  const scheme = Sanscript.schemes[currentScript];
  return !!(scheme?.isRomanScheme) && SVG_ROMAN_SKIP.has(currentScript);
}

function _applySvgEl(el, devText, isDevType) {
  const useDevanagari = _svgUseDevanagari();
  // Store original font-size once so retranslit() can restore + rescale
  if (!el._origFontSize) {
    el._origFontSize = el.getAttribute('font-size') || '';
  }
  if (useDevanagari) {
    el.textContent = devText;
    if (el._origFontSize) el.setAttribute('font-size', el._origFontSize);
  } else {
    el.textContent = isDevType ? translit(devText) : translitMixed(devText);
    const scale = SVG_FONT_SCALE[currentScript] || 1.0;
    if (scale !== 1.0 && el._origFontSize) {
      const n = parseFloat(el._origFontSize);
      if (!isNaN(n)) {
        const unit = el._origFontSize.replace(/[\d.]/g, '');
        el.setAttribute('font-size', (n * scale).toFixed(1) + unit);
      }
    } else if (el._origFontSize) {
      el.setAttribute('font-size', el._origFontSize);
    }
  }
}

function applyConceptSvgRetranslit(wrap) {
  const svgEl = wrap.querySelector('svg');
  if (!svgEl) return;
  svgEl.removeAttribute('width');
  svgEl.removeAttribute('height');
  svgEl.style.width = '100%';
  svgEl.style.height = 'auto';
  for (const el of svgEl.querySelectorAll('text[data-dev]')) {
    el._devText = el.textContent;
    el.classList.add('dev-text');
    _applySvgEl(el, el._devText, true);
  }
  for (const el of svgEl.querySelectorAll('text[data-mixed]')) {
    el._mixedText = el.textContent;
    el.classList.add('mixed-text');
    _applySvgEl(el, el._mixedText, false);
  }
}

function hideConceptPopup() {
  conceptHideTimer = setTimeout(() => {
    if ($conceptPopup) $conceptPopup.classList.remove('visible');
  }, 120);
}

// Render an array of segments [{t,v,id,...}] as inline DOM nodes into container.
// 'sl' segments become clickable sutra links with hover tooltip.
function renderSiddhiSegs(segs, container) {
  segs.forEach(seg => {
    if (seg.t === 'sl') {
      const a = document.createElement('a');
      a.className = 'siddhi-sutra-link dev-text';
      a.href = '#';
      a._devText = seg.v;
      a.textContent = translit(seg.v);
      a.addEventListener('click',      e => { e.preventDefault(); gotoSutra(seg.id); });
      a.addEventListener('mouseenter', () => showSiddhiTip(a, seg.id));
      a.addEventListener('mouseleave', hideSiddhiTip);
      a.addEventListener('touchstart', () => showSiddhiTip(a, seg.id), { passive: true });
      container.appendChild(a);
    } else if (seg.t === 'dl') {
      const span = document.createElement('span');
      span.className = 'siddhi-dhatu-ref dev-text';
      span._devText = seg.v;
      span.textContent = translit(seg.v);
      container.appendChild(span);
    } else if (seg.t === 'cl') {
      const a = document.createElement('a');
      a.className = 'concept-link dev-text';
      a.href = '#';
      a._devText = seg.v;
      a.dataset.concept = seg.v;
      a.textContent = translit(seg.v);
      container.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.className = 'dev-text';
      span._devText = seg.v;
      span.textContent = translit(seg.v) + ' ';
      container.appendChild(span);
    }
  });
}

/**
 * Append inline-marked-up text to a container element.
 * Handles:  [[A.B.C]] → sutra-link   [[term]] → concept-link
 *           [label](url) → external link   plain text → transliterated text node
 * The container gets `_devText` set to the raw text for retranslit support.
 */
function appendInlineMarkup(container, raw) {
  container._devText = raw;
  const TOKEN = /\[\[([^\]]+)\]\]|\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let last = 0, m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(raw)) !== null) {
    if (m.index > last) {
      container.appendChild(document.createTextNode(translit(raw.slice(last, m.index))));
    }
    if (m[1] !== undefined) {
      // [[...]] wiki-link
      const inner = m[1].trim();
      const sid = sutraRefToId(inner);
      const a = document.createElement('a');
      a.href = '#';
      if (sid) {
        a.className = 'sutra-link';
        a.dataset.id = sid;
        a.textContent = devDigitsToAscii(inner);
      } else {
        a.className = 'concept-link dev-text';
        a._devText = inner;
        a.dataset.concept = inner;
        a.textContent = translit(inner);
      }
      container.appendChild(a);
    } else {
      // [label](url) markdown link
      const a = document.createElement('a');
      a.href = m[3];
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'siddhi-ext-link';
      a.textContent = m[2];
      container.appendChild(a);
    }
    last = m.index + m[0].length;
  }
  if (last < raw.length) {
    container.appendChild(document.createTextNode(translit(raw.slice(last))));
  }
}

function renderSiddhiEntry(entry) {
  const wrap = document.createElement('div');
  wrap.className = 'siddhi-entry';

  if (entry.intro) {
    const intro = document.createElement('div');
    intro.className = 'siddhi-intro';
    appendInlineMarkup(intro, entry.intro);
    wrap.appendChild(intro);
  }

  const table = document.createElement('table');
  table.className = 'siddhi-table';

  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  ['#', 'प्रक्रिया', 'सूत्र प्रयोग'].forEach(h => {
    const th = document.createElement('th');
    th.className = 'dev-text';
    th._devText = h;
    th.textContent = h === '#' ? '#' : translit(h);
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  (entry.steps || []).forEach(step => {
    const tr = document.createElement('tr');

    // Step number (may contain concept/sutra links)
    const tdNum = document.createElement('td');
    tdNum.className = 'siddhi-num';
    if (step.num_segs) {
      renderSiddhiSegs(step.num_segs, tdNum);
    } else {
      tdNum.textContent = step.num || '';
    }
    tr.appendChild(tdNum);

    // Form (prakriya — may contain concept/sutra links)
    const tdForm = document.createElement('td');
    tdForm.className = 'siddhi-form dev-text';
    if (step.form_segs) {
      renderSiddhiSegs(step.form_segs, tdForm);
    } else {
      tdForm._devText = step.form || '';
      tdForm.textContent = translit(step.form || '');
    }
    tr.appendChild(tdForm);

    // Note — rendered as inline segments: sutra links + Hindi prose interleaved
    const tdNote = document.createElement('td');
    tdNote.className = 'siddhi-note';
    renderSiddhiSegs(step.segs || [], tdNote);
    tr.appendChild(tdNote);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

// Build stacked commentary tab groups into a container element.
// Used by both renderReaderSutra() and createSutraCard().
// inCard = true applies card-edge bleed margins to tab bars.
function buildTabGroups(sutra, container, inCard) {
  let firstGroupRendered = false;

  for (const group of TAB_GROUPS) {

    // ── Siddhi panel ──
    if (group.type === 'siddhi-panel') {
      const wrap = document.createElement('div');
      wrap.className = 'tab-group siddhi-group';
      container.appendChild(wrap);
      // Async: load data and render (do not block card build)
      buildSiddhiPanel(sutra.i, wrap, inCard);
      continue;
    }

    // ── Media & Notes tabs (Diagram + YouTube + Author's Notes + Your notes) ──
    if (group.type === 'media-notes') {
      const groupEl = document.createElement('div');
      groupEl.className = 'tab-group notes-group media-notes-group';

      const tabBar = document.createElement('div');
      tabBar.className = inCard ? 'detail-tabs detail-tabs-card' : 'detail-tabs';

      const panelWrap = document.createElement('div');
      panelWrap.className = 'detail-tab-panels';

      const tabs = {};

      // Helper: make a tab button + panel pair
      function makeTab(id, label) {
        const btn = document.createElement('button');
        btn.className = 'detail-tab';
        btn.textContent = label;
        const panel = document.createElement('div');
        panel.className = 'detail-tab-panel notes-tab-panel';
        tabs[id] = { btn, panel };
        return { btn, panel };
      }

      // ── Diagram tab ──
      const { btn: diagBtn, panel: diagPanel } = makeTab('diagram', 'Visual notes');
      diagBtn.style.display = 'none';   // hidden until we confirm image exists
      if (DIAGRAM_BASE) {
        const parts = sutra.i.match(/^(\d)(\d)(\d+)$/);
        if (parts) {
          const a = parts[1], p = parts[2], n = parseInt(parts[3], 10);
          const padded = `${a}.${p}.${n.toString().padStart(3,'0')}`;
          const svgUrl = `${DIAGRAM_BASE}/${a}/${padded}.svg`;
          const wrap = document.createElement('div');
          wrap.className = 'sutra-diagram-wrap';
          diagPanel.appendChild(wrap);
          // Fetch SVG and inline it so retranslit() can reach the <text> elements
          fetch(svgUrl).then(r => {
            if (!r.ok) return;
            return r.text();
          }).then(svgText => {
            if (!svgText) return;
            wrap.innerHTML = svgText;
            const svgEl = wrap.querySelector('svg');
            if (!svgEl) return;
            svgEl.removeAttribute('width');
            svgEl.removeAttribute('height');
            svgEl.style.width  = '100%';
            svgEl.style.height = '100%';
            // Mark text elements for retransliteration
            for (const el of svgEl.querySelectorAll('text[data-dev]')) {
              el._devText = el.textContent;
              el.classList.add('dev-text');
            }
            for (const el of svgEl.querySelectorAll('text[data-mixed]')) {
              el._mixedText = el.textContent;
              el.classList.add('mixed-text');
            }
            // Apply current script immediately
            if (currentScript !== 'devanagari') {
              for (const el of svgEl.querySelectorAll('.dev-text'))   el.textContent = translit(el._devText);
              for (const el of svgEl.querySelectorAll('.mixed-text')) el.textContent = translitMixed(el._mixedText);
            }
            diagBtn.style.display = '';
          }).catch(() => { /* no SVG for this sutra — tab stays hidden */ });
        }
      }

      // ── YouTube tab ──
      const { btn: ytBtn, panel: ytPanel } = makeTab('youtube', 'YouTube');
      ytBtn.style.display = 'none';   // hidden until youtube.json confirms entry
      (async () => {
        if (!youtubeData) {
          try {
            const r = await fetch(`${FORMS_BASE}/youtube.json`);
            youtubeData = r.ok ? await r.json() : {};
          } catch { youtubeData = {}; }
        }
        const videoId = youtubeData[sutra.i];
        if (videoId) {
          ytBtn.style.display = '';
          ytPanel._videoId = videoId;
          // Only embed iframe when tab is activated (lazy)
        }
      })();

      // ── Author's Notes tab ──
      const { btn: authorTabBtn, panel: authorPanel } = makeTab('author', "Author's Notes");
      authorPanel.classList.add('notes-tab-panel');
      renderAuthorNotesTab(authorPanel, sutra.i);

      // ── Your notes tab ──
      const { btn: yourTabBtn, panel: yourPanel } = makeTab('your', 'Your notes');
      yourPanel.classList.add('notes-tab-panel');
      renderNotesTab(yourPanel, sutra.i);

      function activateMediaTab(which) {
        activeTabByGroup['media'] = which;
        for (const [id, { btn, panel }] of Object.entries(tabs)) {
          btn.classList.toggle('active',   id === which);
          panel.classList.toggle('active', id === which);
        }
        // Lazy-build YouTube iframe when first activated
        if (which === 'youtube' && ytPanel._videoId && !ytPanel._built) {
          ytPanel._built = true;
          const iframe = document.createElement('iframe');
          iframe.className = 'sutra-youtube-iframe';
          iframe.src = `https://www.youtube-nocookie.com/embed/${ytPanel._videoId}`;
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.loading = 'lazy';
          ytPanel.appendChild(iframe);
        }
        if (which === 'author') renderAuthorNotesTab(authorPanel, sutra.i);
        if (which === 'your')   renderNotesTab(yourPanel, sutra.i);
      }

      diagBtn.addEventListener('click',      () => activateMediaTab('diagram'));
      ytBtn.addEventListener('click',        () => activateMediaTab('youtube'));
      authorTabBtn.addEventListener('click', () => activateMediaTab('author'));
      yourTabBtn.addEventListener('click',   () => activateMediaTab('your'));

      // Restore last-used tab; default to Author's Notes
      activateMediaTab(activeTabByGroup['media'] || 'author');

      tabBar.appendChild(authorTabBtn);
      tabBar.appendChild(yourTabBtn);
      tabBar.appendChild(diagBtn);
      tabBar.appendChild(ytBtn);

      // Subtle owner sign-in icon
      const ownerSignInBtn = document.createElement('button');
      ownerSignInBtn.className = 'notes-owner-signin';
      ownerSignInBtn.title = 'Author sign-in';
      ownerSignInBtn.textContent = '✎';
      ownerSignInBtn.style.display = (googleToken && googleUser?.email === OWNER_EMAIL) ? 'none' : '';
      ownerSignInBtn.addEventListener('click', () => {
        if (typeof google === 'undefined') { alert('Google sign-in not loaded yet — please try again.'); return; }
        googleSignIn();
      });
      tabBar.appendChild(ownerSignInBtn);

      panelWrap.appendChild(authorPanel);
      panelWrap.appendChild(yourPanel);
      panelWrap.appendChild(diagPanel);
      panelWrap.appendChild(ytPanel);
      groupEl.appendChild(tabBar);
      groupEl.appendChild(panelWrap);
      container.appendChild(groupEl);
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
        activeTabByGroup[group.id] = def.id;
        if (!panel._loaded) await loadTabData(def, panel, sutra);
      });
      tabBar.appendChild(tab);
      panelWrap.appendChild(panel);
    }

    // Restore last-used tab for this group, or fall back to first tab
    const savedId    = activeTabByGroup[group.id];
    const savedDef   = savedId && group.tabs.find(t => t.id === savedId);
    const activeDef  = savedDef || group.tabs[0];
    const activeTab  = tabBar.querySelector(`[data-panel="${activeDef.id}"]`) ||
                       tabBar.querySelector('.detail-tab');
    // querySelector on tabBar won't work for buttons — find by index instead
    const tabBtns    = tabBar.querySelectorAll('.detail-tab');
    const activeIdx  = group.tabs.indexOf(activeDef);
    const activeTabEl  = tabBtns[activeIdx] || tabBtns[0];
    const activePanel  = panels[activeDef.id] || Object.values(panels)[0];
    if (activeTabEl)  activeTabEl.classList.add('active');
    if (activePanel) {
      activePanel.classList.add('active');
      if (!firstGroupRendered) {
        firstGroupRendered = true;
        loadTabData(activeDef, activePanel, sutra);
      } else if (savedDef && !activePanel._loaded) {
        loadTabData(activeDef, activePanel, sutra);
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
  readerList = sutraList;
  if (filtered.length) {
    closeDrawer();
    showReader(filtered[0], sutraList.indexOf(filtered[0]));
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
  const idx  = sutraList.findIndex(s => s.i === idStr);

  // Rebuild list view for this pada
  currentPada = { a: +sutra.a, p: +sutra.p };
  setListHeader(`${ADHYAYA_NAMES_DEV[+sutra.a]} — ${PADA_NAMES_DEV[+sutra.p]}`, `${pada.length} sūtras`);
  $sutraList.innerHTML = '';
  for (const s of pada) $sutraList.appendChild(createSutraCard(s));

  readerList = sutraList;
  showReader(sutra, idx >= 0 ? idx : 0);
}

async function gotoDhatu(baseindex) {
  if (!dhatuReaderList.length) {
    const data = await loadData('dhatupatha', 'dhatu/data.txt');
    dhatuReaderList = data?.data || [];
  }
  const idx = dhatuReaderList.findIndex(d => d.baseindex === baseindex);
  if (idx < 0) return;
  closeDrawer();
  showDhatuReader(dhatuReaderList[idx], idx);
}

// ── Pratyaya reference pages ──────────────────────────────────────────────────
// File format (pratyaya.txt):
//   # comment
//   stemtype|category|lakara|pada=f1;f2;f3;f4;f5;f6;f7;f8;f9
//   stemtype: adanta | anadanta
//   category: sarva | ardha
//   lakara:   lat | lot | lang | vidhiling | lit | lut | lrut | ashirling | lung | lrung
//   pada:     p (parasmaipada) | a (atmanepada)
//   9 forms:  prathama-ek, prathama-dvi, prathama-bahu,
//             madhyama-ek, madhyama-dvi, madhyama-bahu,
//             uttama-ek,   uttama-dvi,   uttama-bahu
function parsePratyayaTxt(text) {
  const META = {
    adanta:   { devLabel: 'अदन्त-धातु',  ganas: 'भ्वादि · दिवादि · तुदादि · चुरादि' },
    anadanta: { devLabel: 'अनदन्त-धातु', ganas: 'अदादि · जुहोत्यादि · स्वादि · रुधादि · तनादि · क्र्यादि' },
  };
  const LAKARA_DEV = {
    lat: 'लट्', lot: 'लोट्', lang: 'लङ्', vidhiling: 'विधिलिङ्',
    lit: 'लिट्', lut: 'लुट्', lrut: 'लृट्', ashirling: 'आशीर्लिङ्',
    lung: 'लुङ्', lrung: 'लृङ्',
  };

  // Build output skeleton
  const out = {};
  for (const [stem, meta] of Object.entries(META)) {
    out[stem] = { devLabel: meta.devLabel, ganas: meta.ganas, sarva: [], ardha: [] };
  }
  // Track lakara objects by key so we can add para/atma to the same object
  const lakMap = {}; // "adanta|sarva|lat" → { dev, para, atma }

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key   = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();

    const parts = key.split('|');
    if (parts.length !== 4) continue;
    const [stem, cat, lakara, pada] = parts;
    if (!out[stem] || !out[stem][cat]) continue;

    const mapKey = `${stem}|${cat}|${lakara}`;
    if (!lakMap[mapKey]) {
      const entry = { dev: LAKARA_DEV[lakara] || lakara, para: null, atma: null };
      lakMap[mapKey] = entry;
      out[stem][cat].push(entry);
    }

    // Parse 9 semicolon-separated cells into 3×3
    const cells = value.split(';').map(s => s.trim());
    while (cells.length < 9) cells.push('—');
    const rows = [cells.slice(0, 3), cells.slice(3, 6), cells.slice(6, 9)];

    if (pada === 'p') lakMap[mapKey].para = rows;
    else if (pada === 'a') lakMap[mapKey].atma = rows;
  }
  return out;
}

async function showPratyayaPage(pageId) {
  showPanel('pratyaya');
  const panel = $panelPratyaya;
  panel.innerHTML = '<div class="pratyaya-loading">…</div>';

  let allData;
  try {
    if (!bookData['pratyaya']) {
      const res = await fetch(`${FORMS_BASE}/pratyaya.txt`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      bookData['pratyaya'] = parsePratyayaTxt(await res.text());
    }
    allData = bookData['pratyaya'];
  } catch (_) {
    panel.innerHTML = '<div class="pratyaya-empty">Could not load pratyaya data.</div>';
    return;
  }

  const data = allData[pageId];
  if (!data) { panel.innerHTML = '<div class="pratyaya-empty">—</div>'; return; }

  panel.innerHTML = '';

  // Page title
  const titleEl = document.createElement('div');
  titleEl.className = 'pratyaya-page-title dev-text';
  titleEl._devText = data.devLabel;
  titleEl.textContent = translit(data.devLabel);
  panel.appendChild(titleEl);

  // Gana subtitle
  const ganaEl = document.createElement('div');
  ganaEl.className = 'pratyaya-ganas dev-text';
  ganaEl._devText = data.ganas;
  ganaEl.textContent = translit(data.ganas);
  panel.appendChild(ganaEl);

  // Tab bar: सार्वधातुकम् / आर्धधातुकम्
  const tabBar = document.createElement('div');
  tabBar.className = 'detail-tabs pratyaya-tab-bar';

  const tabContent = document.createElement('div');
  tabContent.className = 'detail-tab-panels';

  const tabs = [
    { id: 'sarva', dev: 'सार्वधातुकम्', rows: data.sarva },
    { id: 'ardha', dev: 'आर्धधातुकम्',  rows: data.ardha },
  ];

  tabs.forEach((t, i) => {
    const tabBtn = document.createElement('button');
    tabBtn.className = 'detail-tab dev-text' + (i === 0 ? ' active' : '');
    tabBtn._devText = t.dev;
    tabBtn.textContent = translit(t.dev);

    const tabPanel = document.createElement('div');
    tabPanel.className = 'detail-tab-panel pratyaya-tab-panel' + (i === 0 ? ' active' : '');

    renderPratyayaSections(t.rows, tabPanel);

    tabBtn.addEventListener('click', () => {
      tabBar.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
      tabContent.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.remove('active'));
      tabBtn.classList.add('active');
      tabPanel.classList.add('active');
    });

    tabBar.appendChild(tabBtn);
    tabContent.appendChild(tabPanel);
  });

  panel.appendChild(tabBar);
  panel.appendChild(tabContent);
}

function renderPratyayaSections(lakaras, container) {
  if (!lakaras || !lakaras.length) {
    const empty = document.createElement('div');
    empty.className = 'pratyaya-empty';
    empty.textContent = '—';
    container.appendChild(empty);
    return;
  }
  for (const lak of lakaras) {
    const sec = document.createElement('div');
    sec.className = 'dhatu-lakara-section';
    sec.appendChild(devEl('div', 'dhatu-lakara-label dev-text', lak.dev));

    const split = document.createElement('div');
    split.className = 'forms-split';
    split.appendChild(renderPratyayaTable(lak.para, 'परस्मैपद'));
    const divider = document.createElement('div');
    divider.className = 'forms-divider';
    split.appendChild(divider);
    split.appendChild(renderPratyayaTable(lak.atma, 'आत्मनेपद'));
    sec.appendChild(split);
    container.appendChild(sec);
  }
}

function renderPratyayaTable(rows, padaLabel) {
  const wrap = document.createElement('div');
  wrap.className = 'forms-table-wrap';

  const table = document.createElement('table');
  table.className = 'forms-table';

  const thead = document.createElement('thead');
  if (padaLabel) {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.colSpan = 4;
    th.className = 'forms-pada-header dev-text';
    th._devText = padaLabel;
    th.textContent = translit(padaLabel);
    tr.appendChild(th);
    thead.appendChild(tr);
  }
  const hrow = document.createElement('tr');
  hrow.appendChild(document.createElement('th'));
  VACANA_FORMS_DEV.forEach(v => {
    const th = document.createElement('th');
    th.className = 'forms-vacana-hdr dev-text';
    th._devText = v;
    th.textContent = translit(v);
    hrow.appendChild(th);
  });
  thead.appendChild(hrow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  PURUSH_FORMS_DEV.forEach((purush, ri) => {
    const tr = document.createElement('tr');
    const labelTd = document.createElement('td');
    labelTd.className = 'forms-row-label dev-text';
    labelTd._devText = purush;
    labelTd.textContent = translit(purush);
    tr.appendChild(labelTd);
    const rowData = rows ? rows[ri] : [];
    (rowData || []).forEach(cell => {
      const td = document.createElement('td');
      td.className = 'forms-cell dev-text';
      td._devText = cell;
      td.textContent = translit(cell);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

// ── bar-ref click: show 32-pada matrix popup ──────────────────────────────────
let $padaMatrix = null;

const ADHYAYA_TABLE_DEV = ['','प्रथमोऽध्यायः','द्वितीयोऽध्यायः','तृतीयोऽध्यायः','चतुर्थोऽध्यायः','पञ्चमोऽध्यायः','षष्ठोऽध्यायः','सप्तमोऽध्यायः','अष्टमोऽध्यायः'];
const PADA_COL_DEV     = ['','प्रथमः','द्वितीयः','तृतीयः','चतुर्थः'];

function buildPadaMatrix() {
  const wrap = document.createElement('div');
  wrap.id = 'pada-matrix';
  wrap.className = 'pada-matrix';

  const counts = {};
  for (const s of sutraList) {
    const key = `${s.a}.${s.p}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  // Header row
  const headerRow = document.createElement('div');
  headerRow.className = 'pm-row pm-header';
  const corner = document.createElement('div');
  corner.className = 'pm-th pm-th-corner dev-text';
  corner._devText = 'अध्यायः';
  corner.textContent = translit('अध्यायः');
  headerRow.appendChild(corner);
  for (let p = 1; p <= 4; p++) {
    const th = document.createElement('div');
    th.className = 'pm-th dev-text';
    th._devText = PADA_COL_DEV[p];
    th.textContent = translit(PADA_COL_DEV[p]);
    headerRow.appendChild(th);
  }
  wrap.appendChild(headerRow);

  // Data rows
  for (let a = 1; a <= 8; a++) {
    const row = document.createElement('div');
    row.className = 'pm-row';

    const label = document.createElement('div');
    label.className = 'pm-td-label dev-text';
    label._devText = ADHYAYA_TABLE_DEV[a];
    label.textContent = translit(ADHYAYA_TABLE_DEV[a]);
    row.appendChild(label);

    for (let p = 1; p <= 4; p++) {
      const cell = document.createElement('button');
      cell.className = 'pm-cell';
      cell.textContent = counts[`${a}.${p}`] || 0;
      cell.addEventListener('click', () => {
        closePadaMatrix();
        showPada(a, p, null);
      });
      row.appendChild(cell);
    }
    wrap.appendChild(row);
  }

  return wrap;
}

let _padaMatrixJustOpened = false;

function openPadaMatrix() {
  if (!$padaMatrix) {
    $padaMatrix = buildPadaMatrix();
    document.body.appendChild($padaMatrix);
  }
  $padaMatrix.classList.add('open');
  _padaMatrixJustOpened = true;
  setTimeout(() => { _padaMatrixJustOpened = false; }, 0);
}

function closePadaMatrix() {
  $padaMatrix?.classList.remove('open');
}

// ── bar-ref click: toggle between reader and list view ────────────────────────
$barRef.addEventListener('click', () => {
  closePadaMatrix();
  if (currentPanel === 'reader') {
    showPanel('list');
  } else if (currentPanel === 'list' && (readerType === 'dhatu' ? dhatuReaderList.length : readerList.length)) {
    showPanel('reader');
  }
});

// ── pada-grid button ──────────────────────────────────────────────────────────
const $btnPadaGrid = document.getElementById('btn-pada-grid');
$btnPadaGrid.addEventListener('click', () => {
  if ($padaMatrix?.classList.contains('open')) {
    closePadaMatrix();
  } else {
    openPadaMatrix();
  }
});

// ── Gana matrix popup ─────────────────────────────────────────────────────────
let $ganaMatrix = null;
let _ganaMatrixJustOpened = false;

const GANA_SHORT_DEV = ['','भ्वादिः','अदादिः','जुहोत्यादिः','दिवादिः','स्वादिः','तुदादिः','रुधादिः','तनादिः','क्र्यादिः','चुरादिः'];

async function buildGanaMatrix() {
  const wrap = document.createElement('div');
  wrap.id = 'gana-matrix';
  wrap.className = 'gana-matrix';

  // Caption
  const caption = document.createElement('div');
  caption.className = 'gm-caption dev-text';
  caption._devText = 'गणाः';
  caption.textContent = translit('गणाः');
  wrap.appendChild(caption);

  // Load dhatu data for counts
  let data = null;
  try { data = await loadData('dhatupatha', 'dhatu/data.txt'); } catch (_) {}
  const counts = {};
  if (data) for (const d of data) counts[d.gana] = (counts[d.gana] || 0) + 1;

  const grid = document.createElement('div');
  grid.className = 'gm-grid';

  for (let g = 1; g <= 10; g++) {
    const cell = document.createElement('button');
    cell.className = 'gm-cell';

    const num = document.createElement('span');
    num.className = 'gm-num';
    num.textContent = String(g).padStart(2, '0');

    const name = document.createElement('span');
    name.className = 'gm-name dev-text';
    name._devText = GANA_SHORT_DEV[g];
    name.textContent = translit(GANA_SHORT_DEV[g]);

    const cnt = document.createElement('span');
    cnt.className = 'gm-count';
    cnt.textContent = counts[String(g)] || '';

    cell.appendChild(num);
    cell.appendChild(name);
    cell.appendChild(cnt);

    cell.addEventListener('click', () => {
      closeGanaMatrix();
      currentPada = null; readerList = []; readerIdx = -1; readerSutra = null;
      updateReaderNav();
      if (data) renderDhatuList(data.filter(d => d.gana === String(g)), GANA_LABELS_DEV[g]);
    });
    grid.appendChild(cell);
  }

  wrap.appendChild(grid);
  return wrap;
}

async function openGanaMatrix() {
  if (!$ganaMatrix) {
    $ganaMatrix = await buildGanaMatrix();
    document.body.appendChild($ganaMatrix);
  }
  $ganaMatrix.classList.add('open');
  _ganaMatrixJustOpened = true;
  setTimeout(() => { _ganaMatrixJustOpened = false; }, 0);
}

function closeGanaMatrix() {
  $ganaMatrix?.classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePadaMatrix(); closeGanaMatrix(); }
});

document.addEventListener('click', e => {
  if (_padaMatrixJustOpened || _ganaMatrixJustOpened || _bkMatrixJustOpened) return;
  if ($padaMatrix?.classList.contains('open') &&
      !$padaMatrix.contains(e.target) &&
      e.target !== $btnPadaGrid && !$btnPadaGrid.contains(e.target)) {
    closePadaMatrix();
  }
  if ($ganaMatrix?.classList.contains('open') &&
      !$ganaMatrix.contains(e.target)) {
    closeGanaMatrix();
  }
  if ($bkMatrix?.classList.contains('open') &&
      !$bkMatrix.contains(e.target)) {
    closeBkMatrix();
  }
});

// ── Theme picker ──────────────────────────────────────────────────────────────
const THEMES = [
  { id: 'sandstone', label: 'Sandstone', bg: '#fdf8f0', accent: '#62b2ba', bar: '#1e2d3d' },
  { id: 'slate',     label: 'Slate',     bg: '#f7f8fc', accent: '#3b82f6', bar: '#1e3a5f' },
  { id: 'forest',    label: 'Forest',    bg: '#f2f8f0', accent: '#2d9c58', bar: '#1a3d2a' },
  { id: 'saffron',   label: 'Saffron',   bg: '#fffbf0', accent: '#d97706', bar: '#7c2d12' },
  { id: 'night',     label: 'Night',     bg: '#1e1e2e', accent: '#89b4fa', bar: '#11111b' },
];
const THEME_KEY = 'paniniyam-theme';
let currentTheme = localStorage.getItem(THEME_KEY) || 'sandstone';

function applyTheme(id) {
  currentTheme = id;
  document.documentElement.dataset.theme = id === 'sandstone' ? '' : id;
  localStorage.setItem(THEME_KEY, id);
  // Update swatch active state
  document.querySelectorAll('.theme-swatch').forEach(s =>
    s.classList.toggle('active', s.dataset.themeId === id));
}

const $themePicker = document.getElementById('theme-picker');
const $themeMenu   = document.getElementById('theme-menu');

function buildThemePicker() {
  $themeMenu.innerHTML = '';
  for (const t of THEMES) {
    const sw = document.createElement('button');
    sw.className = 'theme-swatch' + (t.id === currentTheme ? ' active' : '');
    sw.dataset.themeId = t.id;
    sw.title = t.label;
    // Split circle: left half = bg, right half = accent
    sw.style.background =
      `linear-gradient(to right, ${t.bg} 50%, ${t.accent} 50%)`;
    sw.style.outline = `3px solid ${t.bar}`;
    sw.style.outlineOffset = '-3px';
    sw.addEventListener('click', () => { applyTheme(t.id); $themePicker.classList.remove('open'); });
    $themeMenu.appendChild(sw);
  }
}

document.getElementById('btn-theme').addEventListener('click', e => {
  e.stopPropagation();
  if (activeDrawer && activeDrawer !== 'nav') closeDrawer();
  $themePicker.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!$themePicker.contains(e.target)) $themePicker.classList.remove('open');
});

// ── Avyaya panel ─────────────────────────────────────────────────────────────

// Section order and their display labels
const AVYAYA_SECTIONS = [
  { key: 'अच्', dev: 'अच्' },
  { key: 'हल्', dev: 'हल्' },
  { key: 'कृत्', dev: 'कृत्' },
];

let avyayaState = { section: 'अच्', letter: 'अ' };

async function showAvyayaPanel() {
  showPanel('avyaya');
  updateBookURL('avyaya');
  const panel = $panelAvyaya;

  // Load data once
  if (!bookData['avyaya']) {
    panel.innerHTML = '<div class="avyaya-loading">…</div>';
    try {
      if (!PRIVATE_BASE) throw new Error('no private base');
      const res = await fetch(`${PRIVATE_BASE}/avyaya_samhita.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      bookData['avyaya'] = await res.json();
    } catch (_) {
      panel.innerHTML = '<div class="avyaya-empty">अव्ययार्थ-डेटा उपलब्ध नहीं।</div>';
      return;
    }
  }

  renderAvyayaPanel(panel, bookData['avyaya']);
}

function renderAvyayaPanel(panel, data) {
  panel.innerHTML = '';

  // Pre-compute unique letters per section (preserve document order)
  const lettersBySection = {};
  for (const row of data) {
    if (!lettersBySection[row.s]) lettersBySection[row.s] = [];
    if (row.l && !lettersBySection[row.s].includes(row.l))
      lettersBySection[row.s].push(row.l);
  }

  // ── Section pills ──
  const secRow = document.createElement('div');
  secRow.className = 'avyaya-section-pills';

  // ── Letter pills ──
  const letRow = document.createElement('div');
  letRow.className = 'avyaya-letter-pills';

  // ── Table area ──
  const tableWrap = document.createElement('div');
  tableWrap.className = 'avyaya-table-wrap';

  function buildLetterPills(section) {
    letRow.innerHTML = '';
    const letters = lettersBySection[section] || [];
    if (!letters.length) return;
    for (const l of letters) {
      const btn = document.createElement('button');
      btn.className = 'avyaya-pill dev-text' + (l === avyayaState.letter ? ' active' : '');
      btn._devText = l;
      btn.textContent = translit(l);
      btn.addEventListener('click', () => {
        avyayaState.letter = l;
        letRow.querySelectorAll('.avyaya-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAvyayaTable(tableWrap, data, avyayaState.section, avyayaState.letter);
      });
      letRow.appendChild(btn);
    }
  }

  function selectSection(section) {
    avyayaState.section = section;
    // reset letter to first available
    const letters = lettersBySection[section] || [];
    avyayaState.letter = letters[0] || '';
    buildLetterPills(section);
    secRow.querySelectorAll('.avyaya-sec-pill').forEach(b =>
      b.classList.toggle('active', b.dataset.key === section));
    renderAvyayaTable(tableWrap, data, section, avyayaState.letter);
  }

  for (const sec of AVYAYA_SECTIONS) {
    const btn = document.createElement('button');
    btn.className = 'avyaya-sec-pill dev-text' + (sec.key === avyayaState.section ? ' active' : '');
    btn._devText = sec.dev;
    btn.textContent = translit(sec.dev);
    btn.dataset.key = sec.key;
    btn.addEventListener('click', () => selectSection(sec.key));
    secRow.appendChild(btn);
  }

  panel.appendChild(secRow);
  panel.appendChild(letRow);
  panel.appendChild(tableWrap);

  // Initial render
  buildLetterPills(avyayaState.section);
  renderAvyayaTable(tableWrap, data, avyayaState.section, avyayaState.letter);
}

function renderAvyayaTable(wrap, data, section, letter) {
  wrap.innerHTML = '';

  const rows = data.filter(r => r.s === section && (section === 'कृत्' || r.l === letter));
  if (!rows.length) {
    const empty = document.createElement('div');
    empty.className = 'avyaya-empty';
    empty.textContent = '—';
    wrap.appendChild(empty);
    return;
  }

  const table = document.createElement('table');
  table.className = 'avyaya-table';

  // Header
  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  for (const [dev, cls] of [['अव्ययम्', 'avyaya-th-a'], ['अर्थः', 'avyaya-th-m'], ['उदाहरणानि', 'avyaya-th-u']]) {
    const th = document.createElement('th');
    th.className = cls + ' dev-text';
    th._devText = dev;
    th.textContent = translit(dev);
    hr.appendChild(th);
  }
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of rows) {
    const tr = document.createElement('tr');

    const tdA = document.createElement('td');
    tdA.className = 'avyaya-cell-a dev-text';
    tdA._devText = row.a;
    tdA.textContent = translit(row.a);

    const tdM = document.createElement('td');
    tdM.className = 'avyaya-cell-m dev-text';
    tdM._devText = row.m;
    tdM.textContent = translit(row.m);

    const tdU = document.createElement('td');
    tdU.className = 'avyaya-cell-u dev-text';
    tdU._devText = row.u;
    tdU.textContent = translit(row.u);

    tr.appendChild(tdA);
    tr.appendChild(tdM);
    tr.appendChild(tdU);
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrap.appendChild(table);
}

// ── Varnochchaaran Shiksha panel ──────────────────────────────────────────────

let vnsState = { sectionId: 'bhumika' };

async function showVarnochchaaranPanel() {
  showPanel('varnochchaaran');
  updateBookURL('varnochchaaran');
  const panel = $panelVarnochchaaran;

  if (panel._loaded) {
    if (bookData['varnochchaaran']) renderVnsPanel(panel, bookData['varnochchaaran']);
    return;
  }
  panel._loaded = true;
  panel.innerHTML = '<div style="padding:24px;color:var(--muted)">…</div>';

  try {
    const base = PRIVATE_BASE || FORMS_BASE;
    const res = await fetch(`${base}/varnochchaaran-shiksha.json`);
    if (!res.ok) throw new Error(res.status);
    bookData['varnochchaaran'] = await res.json();
  } catch (_) {
    panel.innerHTML = '<div style="padding:24px;color:var(--muted)">Data unavailable.</div>';
    return;
  }
  renderVnsPanel(panel, bookData['varnochchaaran']);
}

function renderVnsPanel(panel, data) {
  panel.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'vns-header';

  const titleEl = document.createElement('div');
  titleEl.className = 'vns-title dev-text';
  titleEl._devText = data.title;
  titleEl.textContent = translit(data.title);

  const authorEl = document.createElement('div');
  authorEl.className = 'vns-author';
  authorEl.textContent = data.author;

  header.appendChild(titleEl);
  header.appendChild(authorEl);
  panel.appendChild(header);

  // Pills wrap (sticky, two rows)
  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'vns-pills-wrap';
  panel.appendChild(pillsWrap);

  // Row 1: भूमिका + अथ वर्णोच्चारण-शिक्षा
  const row1 = document.createElement('div');
  row1.className = 'vns-pills-row';
  pillsWrap.appendChild(row1);

  // Row 2: प्रकरणम् label + १–८ pills
  const row2 = document.createElement('div');
  row2.className = 'vns-pills-row';
  pillsWrap.appendChild(row2);

  const labelEl = document.createElement('span');
  labelEl.className = 'vns-prakarana-label dev-text';
  labelEl._devText = 'प्रकरणम्';
  labelEl.textContent = translit('प्रकरणम्');
  row2.appendChild(labelEl);

  // Content area
  const contentWrap = document.createElement('div');
  contentWrap.className = 'vns-content';
  panel.appendChild(contentWrap);

  function showSection(sectionId) {
    vnsState.sectionId = sectionId;
    pillsWrap.querySelectorAll('.vns-pill').forEach(b =>
      b.classList.toggle('active', b.dataset.id === sectionId)
    );
    const sec = data.sections.find(s => s.id === sectionId);
    contentWrap.innerHTML = '';
    if (sec) {
      contentWrap._vnsMarkdown = sec.content;
      const imgUrl = sec.image ? `${PRIVATE_BASE || FORMS_BASE}/${sec.image}` : null;
      contentWrap._vnsImage = imgUrl;
      contentWrap.appendChild(renderVnsContent(sec.content));
      if (imgUrl) {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.className = 'vns-section-img';
        img.alt = sec.title || '';
        contentWrap.appendChild(img);
      }
    }
    $panelVarnochchaaran.scrollTop = 0;
  }

  // Devanagari digits for prakarana 1–8
  const devaDigits = ['१','२','३','४','५','६','७','८'];

  const skipIds = new Set(['prakashakiya']);
  data.sections.forEach((sec, idx) => {
    if (skipIds.has(sec.id)) return;

    const isPrakarana = sec.id.startsWith('prakarana-');
    const pill = document.createElement('button');
    pill.dataset.id = sec.id;
    pill.addEventListener('click', () => showSection(sec.id));

    if (isPrakarana) {
      const num = parseInt(sec.id.split('-')[1], 10);
      pill.className = 'vns-pill vns-pill-num' + (sec.id === vnsState.sectionId ? ' active' : '');
      pill.textContent = devaDigits[num - 1] || String(num);
      row2.appendChild(pill);
    } else {
      pill.className = 'vns-pill dev-text' + (sec.id === vnsState.sectionId ? ' active' : '');
      pill._devText = sec.title;
      pill.textContent = translit(sec.title);
      row1.appendChild(pill);
    }
  });

  showSection(vnsState.sectionId);
}

function renderVnsContent(markdown) {
  const wrap = document.createElement('div');
  wrap.className = 'vns-body';

  // Parse line by line so ## sutra headings separate cleanly from commentary
  const lines = markdown.split('\n');
  let i = 0;

  function appendPara(textLines) {
    const text = textLines.join(' ').trim();
    if (!text) return;
    const p = document.createElement('div');
    p.className = 'vns-para';
    p.innerHTML = vnsRenderInline(text);
    wrap.appendChild(p);
  }

  while (i < lines.length) {
    const line = lines[i];

    if (/^\!\[.+\]$/.test(line.trim())) {
      // Inline image marker: ![filename]
      const src = line.trim().slice(2, -1);
      const img = document.createElement('img');
      img.src = `${PRIVATE_BASE || FORMS_BASE}/${src}`;
      img.className = 'vns-section-img';
      wrap.appendChild(img);
      i++;

    } else if (line.startsWith('## ')) {
      // Sutra heading — pure Sanskrit
      const h = document.createElement('div');
      h.className = 'vns-sutra dev-text';
      h._devText = line.replace(/^##\s*/, '');
      h.textContent = translit(line.replace(/^##\s*/, ''));
      wrap.appendChild(h);
      i++;

      // Collect commentary lines until next sutra or blank line
      const commentLines = [];
      while (i < lines.length && !lines[i].startsWith('## ') && lines[i].trim() !== '' && !/^\!\[.+\]$/.test(lines[i].trim())) {
        commentLines.push(lines[i]);
        i++;
      }
      appendPara(commentLines);

    } else if (line.trim() === '') {
      i++; // skip blank lines

    } else {
      // Prose block — collect until next ## or ** (new Q/A) or blank line or image marker
      const paraLines = [line];
      i++;
      while (i < lines.length && !lines[i].startsWith('## ') && !lines[i].startsWith('**') && lines[i].trim() !== '' && !/^\!\[.+\]$/.test(lines[i].trim())) {
        paraLines.push(lines[i]);
        i++;
      }
      appendPara(paraLines);
    }
  }

  return wrap;
}

function vnsRenderInline(text) {
  // Split on **bold** markers, transliterate each segment
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return `<strong>${translitMixed(inner)}</strong>`;
    }
    return translitMixed(part);
  }).join('');
}

// ── Visual Library ────────────────────────────────────────────────────────────

const VISUAL_CATEGORIES = [
  { id: 'pratyahara', devName: 'प्रत्याहाराः',    engName: 'Pratyāhāras',  path: 'concepts/pratyahara' },
  { id: 'it-karyas',  devName: 'इत्-कार्याणि',    engName: 'It-kāryas',    path: 'concepts/it-karyas'  },
  { id: 'krt',        devName: 'कृत्प्रत्ययाः',   engName: 'Kṛt pratyayas', path: 'concepts/krt'       },
  { id: 'sutra-type', devName: 'मुख्य अधिकार',      engName: 'Sūtra types',  path: 'concepts/sutra-type' },
  { id: 'general',    devName: 'सामान्यम्',        engName: 'General',      path: 'concepts/general'    },
  { id: 'prakarana',  devName: 'प्रकरणम्',         engName: 'Prakaraṇas',   path: 'prakaranas'          },
];

async function showVisualLibrary() {
  showPanel('visuals');
  updateBookURL('visuals');
  const panel = $panelVisuals;
  if (panel._loaded) return;
  panel._loaded = true;
  panel.innerHTML = '';

  // Header (title + tabs)
  const header = document.createElement('div');
  header.className = 'vlib-header';
  const title = document.createElement('div');
  title.className = 'vlib-title';
  title.textContent = 'Visuals';
  header.appendChild(title);
  const tabRow = document.createElement('div');
  tabRow.className = 'vlib-tabs';
  header.appendChild(tabRow);
  panel.appendChild(header);

  // Load index
  const index = await loadConceptsIndex();
  if (!index) {
    const err = document.createElement('p');
    err.className = 'vlib-empty';
    err.style.padding = '16px';
    err.textContent = 'Visual index not available.';
    panel.appendChild(err);
    return;
  }

  // Group entries by category
  const grouped = {};
  for (const cat of VISUAL_CATEGORIES) grouped[cat.id] = [];
  for (const [term, entry] of Object.entries(index)) {
    if (grouped[entry.category]) grouped[entry.category].push({ term, ...entry });
  }

  // Split pane
  const split = document.createElement('div');
  split.className = 'vlib-split';
  const listPane = document.createElement('div');
  listPane.className = 'vlib-list';
  const detailPane = document.createElement('div');
  detailPane.className = 'vlib-detail-pane';
  split.appendChild(listPane);
  split.appendChild(detailPane);
  panel.appendChild(split);

  async function loadSvgInto(item, pane) {
    if (!DIAGRAM_BASE) return;
    pane.innerHTML = '<span class="vlib-loading">Loading…</span>';
    if (conceptSvgCache[item.term]) {
      pane.innerHTML = conceptSvgCache[item.term];
      applyConceptSvgRetranslit(pane);
      return;
    }
    try {
      const r = await fetch(`${DIAGRAM_BASE}/${item.path}`);
      if (!r.ok) { pane.innerHTML = '<span class="vlib-empty">—</span>'; return; }
      const svgText = await r.text();
      conceptSvgCache[item.term] = svgText;
      pane.innerHTML = svgText;
      applyConceptSvgRetranslit(pane);
    } catch (_) { pane.innerHTML = '<span class="vlib-empty">—</span>'; }
  }

  let activeCatId = null;

  function showLibCategory(catId) {
    activeCatId = catId;
    tabRow.querySelectorAll('.vlib-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.cat === catId));

    listPane.innerHTML = '';
    detailPane.innerHTML = '';

    const items = (grouped[catId] || []).sort((a, b) => a.term.localeCompare(b.term, 'sa'));
    if (!items.length) {
      listPane.innerHTML = '<span class="vlib-empty">No visuals yet.</span>';
      return;
    }

    let activeListItem = null;

    function selectItem(item, el) {
      if (activeListItem) activeListItem.classList.remove('active');
      activeListItem = el;
      el.classList.add('active');
      if (window.innerWidth < 600) detailPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      loadSvgInto(item, detailPane);
    }

    for (const item of items) {
      const li = document.createElement('div');
      li.className = 'vlib-list-item dev-text';
      li._devText = item.term;
      li.textContent = translit(item.term);
      li.addEventListener('click', () => selectItem(item, li));
      listPane.appendChild(li);
    }

    // Auto-select first item
    selectItem(items[0], listPane.firstElementChild);
  }

  let firstCat = true;
  for (const cat of VISUAL_CATEGORIES) {
    const items = grouped[cat.id] || [];
    if (!items.length) continue;
    const tab = document.createElement('button');
    tab.className = 'vlib-tab';
    tab.dataset.cat = cat.id;
    const span = document.createElement('span');
    span.className = 'dev-text';
    span._devText = cat.devName;
    span.textContent = translit(cat.devName);
    tab.appendChild(span);
    const count = document.createElement('span');
    count.className = 'vlib-tab-count';
    count.textContent = items.length;
    tab.appendChild(count);
    tab.addEventListener('click', () => showLibCategory(cat.id));
    tabRow.appendChild(tab);
    if (firstCat) { firstCat = false; showLibCategory(cat.id); }
  }
}

// ── Shabda engine (fires shabda.js) ──────────────────────────────────────────
// showShabdaEngine() is wired to the शब्दरूपावली nav click.
// shabda.js is loaded separately — this function calls Shabda.* APIs only.
// showShabdaBrowser() below is the old paradigm-based browser, kept intact.

function showShabdaEngine() {
  showPanel('shabda');
  updateBookURL('shabda');
  const panel = $panelShabda;
  panel.innerHTML = '';

  // ── Disclaimer ──────────────────────────────────────────────────────────
  const disclaimer = document.createElement('div');
  disclaimer.className = 'shabda-disclaimer';
  disclaimer.textContent = 'Note: The declension algorithm is still under development. Some forms may be incorrect.';
  panel.appendChild(disclaimer);

  // ── Pratipada input ──────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'shabda-search-wrap';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'shabda-search';
  input.placeholder = 'प्रातिपदिकम्… सुगण्, देव, लता';
  input.autocomplete = 'off';
  input.spellcheck = false;
  wrap.appendChild(input);
  panel.appendChild(wrap);

  // ── Linga selector ───────────────────────────────────────────────────────
  const lingas = [
    { id: 'pum',   dev: 'पुंलिङ्ग'      },
    { id: 'napum', dev: 'नपुंसकलिङ्ग'   },
    { id: 'stri',  dev: 'स्त्रीलिङ्ग'   },
  ];
  let activeLinga = 'pum';

  const lingaRow = document.createElement('div');
  lingaRow.className = 'shabda-pills';
  lingas.forEach(l => {
    const btn = document.createElement('button');
    btn.className = 'shabda-pill dev-text' + (l.id === activeLinga ? ' active' : '');
    btn._devText = l.dev;
    btn.textContent = translit(l.dev);
    btn.addEventListener('click', () => {
      activeLinga = l.id;
      lingaRow.querySelectorAll('.shabda-pill')
        .forEach(b => b.classList.toggle('active', b === btn));
      render();
    });
    lingaRow.appendChild(btn);
  });
  panel.appendChild(lingaRow);

  // ── Result area ──────────────────────────────────────────────────────────
  const result = document.createElement('div');
  result.className = 'shabda-table-area';
  panel.appendChild(result);

  function render() {
    const stem = input.value.trim();
    result.innerHTML = '';
    if (!stem) return;

    // ── Validity check (works for both halant and vowel endings) ────────
    const ending = Shabda.stemEnding(stem);
    const valid  = Shabda.endingValid(stem, activeLinga);
    const lingaDev = lingas.find(l => l.id === activeLinga).dev;

    if (valid === 0) {
      const msg = document.createElement('div');
      msg.className = 'shabda-pattern-note';
      msg.textContent = '"' + ending + '" + ' + lingaDev + ' — संस्कृत में यह संयोग नहीं होता।';
      result.appendChild(msg);
      return;
    }
    if (valid === null) {
      const msg = document.createElement('div');
      msg.className = 'shabda-pattern-note';
      msg.textContent = '"' + ending + '" के लिए नियम अभी परिभाषित नहीं।';
      result.appendChild(msg);
      return;
    }

    // ── Find matching class ──────────────────────────────────────────────
    // Look for a registered class that matches the stem + activeLinga.
    // Convention: class ids end in '-pum', '-napum', '-stri'.
    const stemEnd = Shabda.stemEnding(stem);
    const matchId = Object.keys(Shabda.CLASSES).find(id => {
      const cls = Shabda.CLASSES[id];
      if (cls.linga !== activeLinga) return false;
      if (!cls.matchEnding) return true;          // no restriction → fallback
      return cls.matchEnding === stemEnd;
    });

    if (!matchId) {
      const msg = document.createElement('div');
      msg.className = 'shabda-pattern-note';
      msg.textContent = 'इस वर्ग के नियम अभी shabda.js में नहीं जोड़े गए।';
      result.appendChild(msg);
      return;
    }

    // ── Derive and show table ────────────────────────────────────────────
    const forms = Shabda.derive(stem, matchId);

    const header = document.createElement('div');
    header.className = 'shabda-header';
    const stemEl = document.createElement('span');
    stemEl.className = 'shabda-stem dev-text';
    stemEl._devText = stem;
    stemEl.textContent = translit(stem);
    header.appendChild(stemEl);
    const clsLabel = document.createElement('span');
    clsLabel.className = 'shabda-label';
    clsLabel.textContent = Shabda.CLASSES[matchId].label || matchId;
    header.appendChild(clsLabel);
    result.appendChild(header);

    const table = document.createElement('table');
    table.className = 'shabda-table';
    const thead = document.createElement('thead');
    const hrow = document.createElement('tr');
    hrow.appendChild(document.createElement('th'));
    VACANA_NAMES.forEach(v => {
      const th = document.createElement('th');
      th.className = 'dev-text'; th._devText = v; th.textContent = translit(v);
      hrow.appendChild(th);
    });
    thead.appendChild(hrow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let vib = 1; vib <= 8; vib++) {
      const row = document.createElement('tr');
      const label = document.createElement('td');
      label.className = 'shabda-vib dev-text';
      const ldev = Shabda.VIB_LABEL[vib];
      label._devText = ldev; label.textContent = translit(ldev);
      row.appendChild(label);
      [1, 2, 3].forEach(vac => {
        const pos = vib * 10 + vac;
        const f   = forms.find(r => r.pos === pos);
        const td  = document.createElement('td');
        td.className = 'shabda-form dev-text' + (f && f.stub ? ' muted' : '');
        const fdev = f ? f.form : '—';
        td._devText = fdev; td.textContent = translit(fdev);
        if (f && !f.stub) td.title = f.sandhi + (f.ref ? '  (' + f.ref + ')' : '');
        row.appendChild(td);
      });
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    result.appendChild(table);
  }

  input.addEventListener('input', render);
}

// ── Shabda browser ────────────────────────────────────────────────────────────

const VIBHAKTI_NAMES = ['प्रथमा','द्वितीया','तृतीया','चतुर्थी','पञ्चमी','षष्ठी','सप्तमी','सम्बोधन'];
const VACANA_NAMES   = ['एकवचन','द्विवचन','बहुवचन'];

// Auto-detect paradigm(s) from pratipada ending.
// Returns array of paradigm IDs ordered by likelihood.
function detectParadigm(word) {
  if (!word) return [];
  if (word.endsWith('ा'))  return ['aa-fem'];
  if (word.endsWith('ी'))  return ['ii-fem'];
  if (word.endsWith('न्')) return ['an-masc'];
  if (word.endsWith('ण्')) return ['hal-N-masc'];
  if (word.endsWith('्'))  return ['hal-N-masc'];   // other halant
  if (word.endsWith('ि'))  return ['i-masc'];
  if (word.endsWith('ु'))  return ['u-masc'];
  // no virama, no vowel sign → ends in inherent-a
  return ['a-masc', 'a-neut'];
}

async function loadShabdaData() {
  if (bookData['shabda']) return bookData['shabda'];
  const res = await fetch(`${FORMS_BASE}/shabda_sample.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  bookData['shabda'] = await res.json();
  return bookData['shabda'];
}

function generateShabdaForms(stem, paradigm) {
  if (paradigm.type === 'generated') {
    let base = stem;
    if (paradigm.pre === 'strip_hal') base = stem.replace(/्$/, '');
    else if (paradigm.pre === 'strip_aa') base = stem.replace(/ा$/, '');
    return paradigm.endings.split(';').map(e => base + e);
  }
  return paradigm.forms.split(';');
}

async function showShabdaBrowser(paradigmId, searchWord) {
  showPanel('shabda');
  const panel = $panelShabda;
  panel.innerHTML = '<div class="shabda-loading">…</div>';

  let data;
  try { data = await loadShabdaData(); }
  catch (_) { panel.innerHTML = '<div class="shabda-empty">Could not load data.</div>'; return; }

  panel.innerHTML = '';
  const paradigms = data.paradigms;
  const wordIndex = data.index;

  let activeId    = paradigmId || paradigms[0].id;
  let activeStem  = searchWord || null;
  let suggestedIds = [];   // paradigm IDs highlighted by auto-detection

  // ── Pratipada input ─────────────────────────────────────────────────────────
  const searchWrap = document.createElement('div');
  searchWrap.className = 'shabda-search-wrap';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'shabda-search';
  searchInput.placeholder = 'प्रातिपदिकम्… देव, लता, नदी, हरि';
  searchInput.autocomplete = 'off';
  searchInput.spellcheck = false;
  if (searchWord) searchInput.value = searchWord;
  const searchClear = document.createElement('button');
  searchClear.className = 'shabda-search-clear';
  searchClear.textContent = '✕';
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    suggestedIds = [];
    updatePillHints();
    renderTable(paradigms[0].id, null);
    searchInput.focus();
  });
  searchWrap.appendChild(searchInput);
  searchWrap.appendChild(searchClear);
  panel.appendChild(searchWrap);

  // ── Paradigm pills ──────────────────────────────────────────────────────────
  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'shabda-pills';
  panel.appendChild(pillsWrap);

  // ── Table area ──────────────────────────────────────────────────────────────
  const tableArea = document.createElement('div');
  tableArea.className = 'shabda-table-area';
  panel.appendChild(tableArea);

  // ── Update pill active + suggested classes ──────────────────────────────────
  function updatePillHints() {
    pillsWrap.querySelectorAll('.shabda-pill').forEach(b => {
      b.classList.toggle('active',    b.dataset.id === activeId);
      b.classList.toggle('suggested', !b.classList.contains('active') &&
                                       suggestedIds.includes(b.dataset.id));
    });
  }

  // ── Render table ─────────────────────────────────────────────────────────────
  function renderTable(pid, wordStem) {
    activeId   = pid;
    activeStem = wordStem || null;
    const p = paradigms.find(x => x.id === pid);
    if (!p) return;

    const displayStem = wordStem || p.example;
    const forms = generateShabdaForms(displayStem, p);

    tableArea.innerHTML = '';

    // Word + label header
    const header = document.createElement('div');
    header.className = 'shabda-header';

    const stemEl = document.createElement('span');
    stemEl.className = 'shabda-stem dev-text';
    stemEl._devText = displayStem;
    stemEl.textContent = translit(displayStem);
    header.appendChild(stemEl);

    const labelEl = document.createElement('span');
    labelEl.className = 'shabda-label dev-text';
    labelEl._devText = p.label;
    labelEl.textContent = translit(p.label);
    header.appendChild(labelEl);

    tableArea.appendChild(header);

    // Stored paradigm + non-example word → show pattern note
    if (p.type === 'stored' && wordStem && wordStem !== p.example) {
      const note = document.createElement('div');
      note.className = 'shabda-pattern-note';
      const noteText = document.createElement('span');
      noteText.className = 'dev-text';
      noteText._devText = `${wordStem} follows ${p.example} pattern`;
      noteText.textContent = translit(`${wordStem} follows ${p.example} pattern`);
      note.appendChild(noteText);
      tableArea.appendChild(note);
    }

    // Declension table
    const table = document.createElement('table');
    table.className = 'shabda-table';

    const thead = document.createElement('thead');
    const hrow = document.createElement('tr');
    hrow.appendChild(document.createElement('th'));
    VACANA_NAMES.forEach(v => {
      const th = document.createElement('th');
      th.className = 'dev-text';
      th._devText = v;
      th.textContent = translit(v);
      hrow.appendChild(th);
    });
    thead.appendChild(hrow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let i = 0; i < 8; i++) {
      const row = document.createElement('tr');
      const vib = document.createElement('td');
      vib.className = 'shabda-vib dev-text';
      vib._devText = VIBHAKTI_NAMES[i];
      vib.textContent = translit(VIBHAKTI_NAMES[i]);
      row.appendChild(vib);
      for (let j = 0; j < 3; j++) {
        const td = document.createElement('td');
        td.className = 'shabda-form dev-text';
        const form = forms[i * 3 + j];
        td._devText = form;
        td.textContent = translit(form || '—');
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableArea.appendChild(table);

    // Similar words
    if (p.similar && p.similar.length) {
      const simWrap = document.createElement('div');
      simWrap.className = 'shabda-similar';
      const simLabel = document.createElement('span');
      simLabel.className = 'shabda-similar-label dev-text';
      simLabel._devText = 'समान शब्द';
      simLabel.textContent = translit('समान शब्द') + ' →';
      simWrap.appendChild(simLabel);
      p.similar.forEach(w => {
        const pill = document.createElement('button');
        pill.className = 'shabda-sim-pill dev-text';
        pill._devText = w;
        pill.textContent = translit(w);
        pill.addEventListener('click', () => {
          searchInput.value = w;
          suggestedIds = [pid];
          updatePillHints();
          renderTable(pid, w);
        });
        simWrap.appendChild(pill);
      });
      tableArea.appendChild(simWrap);
    }

    updatePillHints();
  }

  // ── Build paradigm pills ────────────────────────────────────────────────────
  paradigms.forEach(p => {
    const pill = document.createElement('button');
    pill.className = 'shabda-pill dev-text' + (p.id === activeId ? ' active' : '');
    pill.dataset.id = p.id;
    pill._devText = p.pill;
    pill.textContent = translit(p.pill);
    // Override: use current input as stem for the chosen paradigm
    pill.addEventListener('click', () => {
      const q = searchInput.value.trim();
      suggestedIds = q ? detectParadigm(q) : [];
      renderTable(p.id, q || null);
    });
    pillsWrap.appendChild(pill);
  });

  // ── Pratipada input handler ─────────────────────────────────────────────────
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    if (!q) {
      suggestedIds = [];
      updatePillHints();
      renderTable(paradigms[0].id, null);
      return;
    }
    // Exact match in index → use that paradigm
    const indexedPid = wordIndex[q];
    if (indexedPid) {
      suggestedIds = [indexedPid];
      renderTable(indexedPid, q);
      return;
    }
    // Auto-detect from word ending
    suggestedIds = detectParadigm(q);
    renderTable(suggestedIds[0] || activeId, q);
  });

  renderTable(activeId, activeStem);
}

// ── Search ────────────────────────────────────────────────────────────────────
let searchScope = 'ashtadhyayi';

const SEARCH_SCOPES = [
  { id: 'ashtadhyayi', devLabel: 'अष्टाध्यायी' },
  { id: 'dhatupatha',  devLabel: 'धातुपाठः'     },
  { id: 'ganapath',    devLabel: 'गणपाठः'       },
  { id: 'unaadi',      devLabel: 'उणादिः'        },
  { id: 'sarva',       devLabel: 'सर्वम्'        },
];
const SEARCH_CAP = 75;   // max results per book/group

let $copyMdBtn   = null;   // persistent Copy MD button in row 2
let $typeFilter  = null;   // sutra type dropdown (ashtadhyayi only)
let sutraTypeFilter = 'all';

const SUTRA_TYPES = [
  { code: 'all', label: 'सर्वे' },
  { code: 'S',   label: 'संज्ञा'    },
  { code: 'P',   label: 'परिभाषा'   },
  { code: 'V',   label: 'विधि'      },
  { code: 'AD',  label: 'अधिकार'    },
  { code: 'AT',  label: 'अतिदेश'    },
];

function buildSearchScopes() {
  const container = document.getElementById('search-scope-row');
  container.innerHTML = '';

  // Row 1: first 4 scopes
  const row1 = document.createElement('div');
  row1.className = 'scope-row scope-pills';

  // Row 2: सर्वम् + type filter + Copy MD
  const row2 = document.createElement('div');
  row2.className = 'scope-row scope-row-2';
  const row2left = document.createElement('div');
  row2left.className = 'scope-pills';
  row2.appendChild(row2left);

  // Type filter dropdown — only visible for ashtadhyayi scope
  $typeFilter = document.createElement('select');
  $typeFilter.className = 'scope-type-filter';
  $typeFilter.style.display = 'none';
  for (const t of SUTRA_TYPES) {
    const opt = document.createElement('option');
    opt.value = t.code;
    opt.textContent = translit(t.label);
    opt._devLabel = t.label;
    $typeFilter.appendChild(opt);
  }
  $typeFilter.value = sutraTypeFilter;
  $typeFilter.addEventListener('change', () => {
    sutraTypeFilter = $typeFilter.value;
    runSearch($searchInput.value);
  });
  row2.appendChild($typeFilter);

  // Persistent Copy MD button
  $copyMdBtn = document.createElement('button');
  $copyMdBtn.className = 'search-copy-md';
  $copyMdBtn.textContent = 'Copy MD';
  $copyMdBtn.style.display = 'none';
  row2.appendChild($copyMdBtn);

  container.appendChild(row1);
  container.appendChild(row2);

  const allPills = [];
  SEARCH_SCOPES.forEach((sc) => {
    const btn = document.createElement('button');
    btn.className = 'scope-pill dev-text' + (sc.id === searchScope ? ' active' : '');
    btn.dataset.scope = sc.id;
    btn._devText = sc.devLabel;
    btn.textContent = translit(sc.devLabel);
    btn.addEventListener('click', () => {
      searchScope = sc.id;
      allPills.forEach(p => p.classList.toggle('active', p.dataset.scope === sc.id));
      // Show/hide type filter and Copy MD for ashtadhyayi only
      if ($typeFilter) $typeFilter.style.display = sc.id === 'ashtadhyayi' ? '' : 'none';
      if ($copyMdBtn) { $copyMdBtn.style.display = sc.id === 'ashtadhyayi' ? '' : 'none'; $copyMdBtn.disabled = true; }
      runSearch($searchInput.value);
    });
    allPills.push(btn);
    if (sc.id === 'sarva') row2left.appendChild(btn);
    else row1.appendChild(btn);
  });

  // Show type filter if starting on ashtadhyayi
  if ($typeFilter) $typeFilter.style.display = searchScope === 'ashtadhyayi' ? '' : 'none';
}

// Normalize casual Roman romanization for e-field comparison.
// Both 'ri' and 'ru' are common ways to write the vocalic-r (ṛ/ृ) informally
// (e.g. "vriddhi" and "vruddhi" both mean वृद्धि). Fold them to 'r' before
// a consonant or end-of-string so both spellings match the data's 'vruddhi' form.
function normalizeRoman(s) {
  return s.toLowerCase()
    .replace(/ru(?=[^aeiou]|$)/g, 'r')
    .replace(/ri(?=[^aeiou]|$)/g, 'r');
}

// Convert any script input to Devanagari for search comparison
// Unicode ranges → Sanscript scheme name for auto-detection
const INDIC_RANGES = [
  [/[\u0C00-\u0C7F]/, 'telugu'],
  [/[\u0B80-\u0BFF]/, 'tamil'],
  [/[\u0C80-\u0CFF]/, 'kannada'],
  [/[\u0D00-\u0D7F]/, 'malayalam'],
  [/[\u0980-\u09FF]/, 'bengali'],
  [/[\u0A80-\u0AFF]/, 'gujarati'],
  [/[\u0A00-\u0A7F]/, 'gurmukhi'],
  [/[\u0B00-\u0B7F]/, 'oriya'],
];

function normalizeToDevanagari(q) {
  if (!q || /^\d+$/.test(q)) return q;
  // Already Devanagari
  if (/[\u0900-\u097F]/.test(q)) return q;
  // Try current script → Devanagari (covers Telugu, Tamil, IAST, ITRANS etc.)
  try {
    const r = Sanscript.t(q, currentScript, 'devanagari');
    if (r && r !== q) return r;
  } catch(e) {}
  // Auto-detect Indic script (handles typing in a different script than the display)
  for (const [re, sc] of INDIC_RANGES) {
    if (sc !== currentScript && re.test(q)) {
      try {
        const r = Sanscript.t(q, sc, 'devanagari');
        if (r && r !== q) return r;
      } catch(e) {}
      break;
    }
  }
  // Fallback: try IAST (for Roman input when not in IAST mode)
  if (/[a-zA-Z]/.test(q) && currentScript !== 'iast') {
    try {
      const r = Sanscript.t(q, 'iast', 'devanagari');
      if (r && r !== q) return r;
    } catch(e) {}
  }
  return q;
}

// Highlight matching substring (returns a <span> with a <mark> inside)
function highlightMatch(devText, q) {
  const displayed = translit(devText);
  const span = document.createElement('span');
  span.className = 'sri-text';
  span._devText = devText;   // for retransliteration

  // Convert query to current display script for highlight position matching
  const devQ = normalizeToDevanagari(q);
  const displayQ = (devQ !== q) ? translit(devQ) : q;

  const tryHighlight = (needle) => {
    const idx = displayed.indexOf(needle);
    if (idx < 0) return false;
    span.appendChild(document.createTextNode(displayed.slice(0, idx)));
    const mark = document.createElement('mark');
    mark.textContent = displayed.slice(idx, idx + needle.length);
    span.appendChild(mark);
    span.appendChild(document.createTextNode(displayed.slice(idx + needle.length)));
    return true;
  };

  if (!tryHighlight(displayQ) && !tryHighlight(q)) {
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
  // Dotted reference: 1.1.1
  const idMatch = /^(\d)\.(\d)\.(\d+)$/.exec(q);
  if (idMatch) {
    const id = String((+idMatch[1]) * 10000 + (+idMatch[2]) * 1000 + (+idMatch[3])).padStart(5, '0');
    return sutraList.filter(s => s.i === id);
  }
  // Digit-only reference: 111 = 1.1.1, 1145 = 1.1.45, 84116 = 8.4.116
  // First digit = adhyaya (1–8), second = pada (1–4), rest = sutra number
  // If query is all digits, only try reference matching — never fall through to text search
  if (/^\d+$/.test(q)) {
    const digitRef = /^([1-8])([1-4])(\d{1,3})$/.exec(q);
    if (digitRef) {
      const id = String((+digitRef[1]) * 10000 + (+digitRef[2]) * 1000 + (+digitRef[3])).padStart(5, '0');
      return sutraList.filter(s => s.i === id);
    }
    return [];
  }
  const dq       = normalizeToDevanagari(q);
  const lower    = q.toLowerCase();
  const pravaData = bookData['pravachanam'];
  return sutraList.filter(s => {
    if (s.s.includes(dq) || (s.ss && s.ss.includes(dq)) ||
        (s.e && normalizeRoman(s.e).includes(normalizeRoman(lower))) ||
        (s.ad && s.ad.includes(dq)) || (s.an && s.an.includes(dq))) return true;
    if (pravaData) {
      const p = pravaData[s.i];
      if (p && ((p.a && p.a.includes(dq)) || (p.h && p.h.includes(dq)))) return true;
    }
    return false;
  });
}

// Filter Dhatupatha entries
function searchDhatus(data, q) {
  const dq    = normalizeToDevanagari(q);
  const lower = q.toLowerCase();
  return data.filter(d =>
    (d.dhatu && d.dhatu.includes(dq)) ||
    (d.aupadeshik && d.aupadeshik.includes(dq)) ||
    (d.artha && d.artha.includes(dq)) ||
    (d.meaning_en && d.meaning_en.toLowerCase().includes(lower)));
}

function searchGana(data, q) {
  const dq = normalizeToDevanagari(q);
  return data.filter(g =>
    (g.name && g.name.includes(dq)) || (g.words && g.words.includes(dq)));
}

function searchUnaadi(data, q) {
  const dq = normalizeToDevanagari(q);
  return data.filter(u =>
    (u.sutra && u.sutra.includes(dq)) || (u.pratyay && u.pratyay.includes(dq)));
}

function makeGanaResultItem(g, q) {
  const item = document.createElement('div');
  item.className = 'search-result-item';
  const ref = document.createElement('span');
  ref.className = 'sri-ref';
  ref.textContent = g.sutra || '';
  item.appendChild(ref);
  item.appendChild(highlightMatch(g.name || '', q));
  item.addEventListener('click', async () => {
    const data = await loadData('ganapatha', 'ganapath/data.txt');
    renderGanaList(data);
    closeDrawer();
    const card = $sutraList.querySelector(`[data-id="${g.ind}"]`);
    if (card) { card.scrollIntoView({ block: 'center' }); toggleSimpleCard(card); }
  });
  return item;
}

function makeUnaadiResultItem(u, q) {
  const item = document.createElement('div');
  item.className = 'search-result-item';
  const ref = document.createElement('span');
  ref.className = 'sri-ref';
  ref.textContent = u.pratyay || u.i || '';
  item.appendChild(ref);
  item.appendChild(highlightMatch(u.sutra || '', q));
  item.addEventListener('click', async () => {
    const data = await loadData('unaadi', 'unaadi/data.txt');
    renderUnaadiAll(data);
    closeDrawer();
    const card = $sutraList.querySelector(`[data-id="${u.i}"]`);
    if (card) { card.scrollIntoView({ block: 'center' }); toggleSimpleCard(card); }
  });
  return item;
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

function sutraResultsToMarkdown(results, query) {
  const heading = `## ${query} — ${results.length} sutra${results.length !== 1 ? 's' : ''}`;
  const header  = '| Ref | Sutra |';
  const divider = '|-----|-------|';
  const rows = results.map(s => `| [[${s.a}.${s.p}.${s.n}]] | ${s.s} |`);
  return [heading, '', header, divider, ...rows].join('\n');
}

async function runSearch(raw) {
  const q = raw.trim();
  $searchDrawerBody.innerHTML = '';
  // Allow empty query through if a type filter is active (show all sutras of that type)
  const typeActive = searchScope === 'ashtadhyayi' && sutraTypeFilter !== 'all';
  if (!q && !typeActive) { $searchClear.style.display = 'none'; return; }
  if (q) $searchClear.style.display = 'block';

  if (searchScope === 'ashtadhyayi') {
    let results = searchSutras(q);
    if (sutraTypeFilter !== 'all')
      results = results.filter(s => s.type && s.type.startsWith(sutraTypeFilter + '$'));
    const countEl = document.createElement('div');
    countEl.className = 'search-drawer-count';
    countEl.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
    // Copy MD: always visible in ashtadhyayi scope, disabled when no results
    if ($copyMdBtn) {
      $copyMdBtn.style.display = '';
      $copyMdBtn.disabled = results.length === 0;
      $copyMdBtn.textContent = 'Copy MD';
      $copyMdBtn.onclick = results.length ? () => {
        navigator.clipboard.writeText(sutraResultsToMarkdown(results, q));
        $copyMdBtn.textContent = 'Copied!';
        setTimeout(() => { $copyMdBtn.textContent = 'Copy MD'; }, 1500);
      } : null;
    }
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

  } else if (searchScope === 'ganapath') {
    const loadEl = document.createElement('div');
    loadEl.className = 'search-loading';
    loadEl.textContent = 'Loading…';
    $searchDrawerBody.appendChild(loadEl);
    const data = await loadData('ganapatha', 'ganapath/data.txt');
    $searchDrawerBody.innerHTML = '';
    const results = searchGana(data, q);
    const countEl = document.createElement('div');
    countEl.className = 'search-drawer-count';
    countEl.textContent = `${results.length} gana${results.length !== 1 ? 's' : ''}`;
    $searchDrawerBody.appendChild(countEl);
    for (const g of results.slice(0, SEARCH_CAP))
      $searchDrawerBody.appendChild(makeGanaResultItem(g, q));
    if (results.length > SEARCH_CAP) {
      const more = document.createElement('div');
      more.className = 'search-drawer-count';
      more.textContent = `… and ${results.length - SEARCH_CAP} more`;
      $searchDrawerBody.appendChild(more);
    }

  } else if (searchScope === 'unaadi') {
    const loadEl = document.createElement('div');
    loadEl.className = 'search-loading';
    loadEl.textContent = 'Loading…';
    $searchDrawerBody.appendChild(loadEl);
    const data = await loadData('unaadi', 'unaadi/data.txt');
    $searchDrawerBody.innerHTML = '';
    const results = searchUnaadi(data, q);
    const countEl = document.createElement('div');
    countEl.className = 'search-drawer-count';
    countEl.textContent = `${results.length} sutra${results.length !== 1 ? 's' : ''}`;
    $searchDrawerBody.appendChild(countEl);
    for (const u of results.slice(0, SEARCH_CAP))
      $searchDrawerBody.appendChild(makeUnaadiResultItem(u, q));
    if (results.length > SEARCH_CAP) {
      const more = document.createElement('div');
      more.className = 'search-drawer-count';
      more.textContent = `… and ${results.length - SEARCH_CAP} more`;
      $searchDrawerBody.appendChild(more);
    }

  } else if (searchScope === 'sarva') {
    // Load all books in parallel
    const [dhatu, gana, unaadi, shiva] = await Promise.all([
      loadData('dhatupatha', 'dhatu/data.txt').catch(() => null),
      loadData('ganapatha',  'ganapath/data.txt').catch(() => null),
      loadData('unaadi',     'unaadi/data.txt').catch(() => null),
      loadData('shivasutra', 'shivasutra/data.txt').catch(() => null),
    ]);

    const sutraResults = searchSutras(q);
    const dhatuResults = dhatu  ? searchDhatus(dhatu, q) : [];
    const ganaResults  = gana   ? searchGana(gana, q)    : [];
    const unaadiResults= unaadi ? searchUnaadi(unaadi, q): [];
    const shivaResults = shiva  ? shiva.filter(s => s.sutra && s.sutra.includes(q)) : [];

    const total = sutraResults.length + dhatuResults.length + ganaResults.length +
                  unaadiResults.length + shivaResults.length;
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
    if (ganaResults.length)
      renderGroup($searchDrawerBody, 'गणपाठः', ganaResults.slice(0, SEARCH_CAP),
        makeGanaResultItem, q, ganaResults.length);
    if (unaadiResults.length)
      renderGroup($searchDrawerBody, 'उणादिः', unaadiResults.slice(0, SEARCH_CAP),
        makeUnaadiResultItem, q, unaadiResults.length);
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

// ── Legal pages ───────────────────────────────────────────────────────────────
function showLegalPage(id) {
  currentPada  = null;
  readerList   = [];
  readerIdx    = -1;
  readerSutra  = null;
  updateReaderNav();
  activeCard   = null;

  const LEGAL = {
    privacy: {
      title: 'Privacy Policy',
      cards: [
        { title: 'What we collect',
          body: 'We collect nothing. Paniniyam is a fully static site with no server, no database, and no analytics. No personal data is transmitted to or stored by us at any point.' },
        { title: 'Your notes & Google Drive',
          body: 'The optional "Your notes" feature uses Google OAuth 2.0 with the <code>drive.file</code> scope. This scope gives the app access <em>only</em> to files it creates — one file (<code>paniniyam-notes.json</code>) stored in your own Google Drive. We never read, access, or store any other files in your Drive. Your notes are your data, living entirely in your account.' },
        { title: 'Sign-out & revocation',
          body: 'Signing out immediately revokes the access token. You can also revoke access at any time from your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">Google Account permissions page</a>.' },
        { title: 'Cookies & tracking',
          body: 'No cookies. No tracking pixels. No third-party analytics. The only external services loaded are Google Fonts (typography) and Google Identity Services (optional sign-in).' },
        { title: 'Third-party services',
          body: 'Content is served via jsDelivr CDN (open data) and Cloudflare R2 (owner-authored content). These services may log standard request metadata per their own privacy policies.' },
        { title: 'Contact',
          body: 'Questions? <a href="#" class="legal-contact-link">Contact Us</a> — we read every message.' },
      ],
    },
    terms: {
      title: 'Terms of Use',
      cards: [
        { title: 'Free educational use',
          body: 'Paniniyam is a free, ad-free educational tool for studying Pāṇini\'s Ashtadhyayi and related Sanskrit grammatical texts. You are welcome to use it for personal study, teaching, and research.' },
        { title: 'Content ownership',
          body: 'Classical texts (Ashtadhyayi sūtras, Kāśikā, Laghu Kaumudī, Dhatupatha, etc.) are in the public domain. Data sourced from the <a href="https://github.com/ashtadhyayi-com/data" target="_blank">ashtadhyayi-com/data</a> open repository is used under their open terms. Original commentary and analysis authored by us remains our intellectual property.' },
        { title: 'Your notes',
          body: 'Notes you write using the "Your notes" feature are entirely your own. We make no claim over them. They are stored in your Google Drive and we never access them.' },
        { title: 'Acceptable use',
          body: 'You agree to use Paniniyam for lawful purposes only. You may not attempt to disrupt the service or use the site in any manner that could damage or overburden it.' },
        { title: 'No warranty',
          body: 'This site is provided as-is for educational purposes. While we strive for accuracy, we make no guarantees regarding correctness of grammatical content. Always verify critical information against primary sources.' },
        { title: 'Changes',
          body: 'We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.' },
      ],
    },
  };

  const page = LEGAL[id];
  if (!page) return;

  setListHeader(page.title, 'Effective June 2026');
  $sutraList.innerHTML = '';

  for (const card of page.cards) {
    const el = document.createElement('div');
    el.className = 'about-card';
    el.style.margin = '0 0 10px';
    const titleEl = document.createElement('div');
    titleEl.className = 'about-card-title';
    titleEl.textContent = card.title;
    const bodyEl = document.createElement('p');
    bodyEl.innerHTML = card.body;
    bodyEl.style.fontSize = '.9em';
    bodyEl.style.lineHeight = '1.7';
    el.appendChild(titleEl);
    el.appendChild(bodyEl);
    $sutraList.appendChild(el);
  }

  // Wire contact links to open the feedback form directly
  $sutraList.querySelectorAll('.legal-contact-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      showAbout();
      setTimeout(() => showAboutSection('contact'), 0);
    });
  });

  showPanel('list');
}

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
  history.replaceState({}, '', '?about');
}

function buildThemePreviewSection(section) {
  // Title + intro
  const h2 = document.createElement('h2');
  h2.className = 'about-title';
  h2.textContent = 'Themes & Scripts';
  section.appendChild(h2);
  const intro = document.createElement('p');
  intro.className = 'about-intro';
  intro.textContent = 'Choose a colour theme and script below — the preview updates live.';
  section.appendChild(intro);

  // Controls card
  const ctrl = document.createElement('div');
  ctrl.className = 'about-card theme-preview-controls';

  // Theme swatches row
  const themeRow = document.createElement('div');
  themeRow.className = 'tp-row';
  const themeLbl = document.createElement('span');
  themeLbl.className = 'tp-lbl';
  themeLbl.textContent = 'Theme';
  themeRow.appendChild(themeLbl);
  const swatches = document.createElement('div');
  swatches.className = 'tp-swatches';
  for (const t of THEMES) {
    const btn = document.createElement('button');
    btn.className = 'tp-swatch' + (t.id === currentTheme ? ' active' : '');
    btn.title = t.label;
    btn.dataset.tid = t.id;
    btn.style.background = t.bg;
    btn.style.border = `3px solid ${t.bar}`;
    const dot = document.createElement('span');
    dot.className = 'tp-swatch-dot';
    dot.style.background = t.accent;
    btn.appendChild(dot);
    const lbl = document.createElement('span');
    lbl.className = 'tp-swatch-lbl';
    lbl.textContent = t.label;
    btn.appendChild(lbl);
    btn.addEventListener('click', () => {
      applyTheme(t.id);
      swatches.querySelectorAll('.tp-swatch').forEach(s => s.classList.toggle('active', s.dataset.tid === t.id));
      document.querySelectorAll('.theme-swatch').forEach(s => s.classList.toggle('active', s.dataset.themeId === t.id));
    });
    swatches.appendChild(btn);
  }
  themeRow.appendChild(swatches);
  ctrl.appendChild(themeRow);

  // Script selector row
  const scriptRow = document.createElement('div');
  scriptRow.className = 'tp-row';
  const scriptLbl = document.createElement('span');
  scriptLbl.className = 'tp-lbl';
  scriptLbl.textContent = 'Script';
  scriptRow.appendChild(scriptLbl);
  const scriptPills = document.createElement('div');
  scriptPills.className = 'tp-script-pills';
  for (const sc of SCRIPTS) {
    const btn = document.createElement('button');
    btn.className = 'tp-script-pill' + (sc.id === currentScript ? ' active' : '');
    btn.dataset.sid = sc.id;
    btn.textContent = sc.label;
    btn.title = sc.name;
    btn.addEventListener('click', () => {
      setScript(sc.id);
      scriptPills.querySelectorAll('.tp-script-pill').forEach(b => b.classList.toggle('active', b.dataset.sid === sc.id));
      document.querySelectorAll('.script-menu-item').forEach(b => b.classList.toggle('active', b.dataset.scriptId === sc.id));
    });
    scriptPills.appendChild(btn);
  }
  scriptRow.appendChild(scriptPills);
  ctrl.appendChild(scriptRow);

  section.appendChild(ctrl);

  // Live preview card
  const sutra = sutraIndex['11001'];
  if (!sutra) return;

  const previewLabel = document.createElement('div');
  previewLabel.className = 'tp-preview-label';
  previewLabel.textContent = 'Live preview — 1.1.1 वृद्धिरादैच्';
  section.appendChild(previewLabel);

  const previewCard = document.createElement('div');
  previewCard.className = 'sutra-card open tp-preview-card';

  const row = document.createElement('div');
  row.className = 'sutra-row';
  row.innerHTML = `<span class="sutra-id">1.1.1</span>`;
  const tSpan = document.createElement('span');
  tSpan.className = 'sutra-text dev-text';
  tSpan._devText = sutra.s;
  tSpan.textContent = translit(sutra.s);
  row.appendChild(tSpan);
  const t = (sutra.type || '').split('$')[0];
  row.appendChild(devEl('span', `sutra-badge badge-${t}`, TYPE_BADGE_DEV[t] || t || '?'));
  previewCard.appendChild(row);

  const detail = document.createElement('div');
  detail.className = 'sutra-detail';
  const fullEl = devEl('div', 'detail-sutra-full', sutra.s);
  detail.appendChild(fullEl);
  detail.appendChild(buildSutraMeta(sutra));
  buildTabGroups(sutra, detail, true);
  previewCard.appendChild(detail);
  section.appendChild(previewCard);
}

function renderAboutSection(id) {
  if (id === 'themes') {
    $aboutPanelContent.innerHTML = '<div class="about-section" id="tp-section"></div>';
    buildThemePreviewSection(document.getElementById('tp-section'));
    $aboutPanelNav.querySelectorAll('.about-panel-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.section === id));
    return;
  }

  const CONTENT = {
    gurus: {
      html: `
        <div class="about-section">
          <h2 class="about-title">Our Gurus</h2>
          <p class="about-intro">This work stands on the shoulders of teachers who have dedicated their lives to preserving and transmitting the Pāṇinian tradition.</p>
          <div class="about-card about-guru-card">
            <div class="about-guru-name">Ācārya Chandradutt Sharma</div>
            <div class="about-guru-tradition">Custodian of the Pāṇinian Tradition</div>
            <p>In an age that hastens to call Sanskrit a dead language, Acharya Chandradutt Sharma stands as living proof of its immortality.</p>
            <p>A scholar of extraordinary depth and discipline, Acharyaji has committed to memory over <strong>15,000 Vedic mantras</strong> — a feat that places him in the rare company of those who have kept the oral tradition of ancient India alive not merely as an academic exercise, but as a sacred way of life. His mastery extends to the complete works of <strong>Maharshi Pāṇini</strong>, the greatest linguist of antiquity, whose monumental <em>Aṣṭādhyāyī</em> codified the Sanskrit language with a precision unmatched in the history of human thought. Acharyaji is equally steeped in the foundational commentaries of <strong>Maharshi Patañjali</strong>, whose <em>Mahābhāṣya</em> stands as the definitive elaboration of the Pāṇinian system.</p>
            <p>What truly sets Acharya Chandradutt Sharma apart, however, is not only what he knows — but how he teaches. His methodology transforms the formidable architecture of Pāṇinian grammar into something accessible, logical, and even joyful. Concepts that have intimidated scholars for centuries become, in his classroom, a child's play. This is the hallmark of a true <em>Acharya</em>: the ability to make the profound feel simple, without ever diminishing its depth.</p>
            <p>With decades of teaching experience and an unbroken connection to the living tradition of Sanskrit <em>Shastra</em>, Acharyaji offers students across the world a rare opportunity — to learn not just a language, but an ancient path of self-knowledge, exactly as it was intended to be transmitted.</p>
            <p>His lectures are conducted in <strong>Hindi</strong>, making this treasury of wisdom accessible to millions. Through the preservation of recorded teachings and online archives, this knowledge is now being safeguarded for generations yet to come — so that the flame Pāṇini lit over two millennia ago may never be extinguished.</p>
          </div>
          <div class="about-card about-guru-card">
            <div class="about-guru-name">Ācārya Vedshrami</div>
            <div class="about-guru-tradition">[ tradition / lineage — to be filled ]</div>
            <p>[ A few sentences about Ācārya Vedshrami and his contribution to your understanding of Pāṇinian grammar. ]</p>
          </div>
          <div class="about-card about-guru-card">
            <div class="about-guru-name">Dr. Pushpa Dixit</div>
            <div class="about-guru-tradition">Online teaching — Samskrita resources</div>
            <p>[ A few sentences about Dr. Pushpa Dixit's online resources and how they have supported your study. Links below. ]</p>
            <div class="about-guru-links">
              <a href="#" target="_blank">[ Link to her lectures / channel ]</a>
            </div>
          </div>
        </div>`,
    },
    resources: {
      html: `
        <div class="about-section">
          <h2 class="about-title">Further Reading</h2>
          <p class="about-intro">A curated list of texts and online resources for serious students of Pāṇinian grammar.</p>

          <div class="about-card">
            <div class="about-card-title">Primary Texts — Archive.org</div>
            <ul class="about-resource-list">
              <li><a href="https://archive.org/search?query=kashika+vritti" target="_blank">Kāśikā Vṛtti</a> — Jayāditya &amp; Vāmana's commentary on the Ashtadhyayi</li>
              <li><a href="https://archive.org/search?query=siddhanta+kaumudi" target="_blank">Siddhānta Kaumudī</a> — Bhaṭṭoji Dīkṣita's reorganisation by topic</li>
              <li><a href="https://archive.org/search?query=laghu+kaumudi+sanskrit" target="_blank">Laghu Kaumudī</a> — Varadarāja's concise introduction</li>
              <li><a href="https://archive.org/search?query=mahabhashya+patanjali" target="_blank">Mahābhāṣya</a> — Patañjali's debates on the Ashtadhyayi</li>
              <li><a href="https://archive.org/search?query=paribhashendusekhara" target="_blank">Paribhāṣenduśekhara</a> — Nāgeśabhaṭṭa's meta-rules explained</li>
              <li>[ Add more as you discover them ]</li>
            </ul>
          </div>

          <div class="about-card">
            <div class="about-card-title">Online Resources</div>
            <ul class="about-resource-list">
              <li><a href="https://ashtadhyayi.com" target="_blank">ashtadhyayi.com</a> — comprehensive sutra browser with commentaries</li>
              <li><a href="https://www.sanskritfromhome.org" target="_blank">sanskritfromhome.org</a> — structured Sanskrit courses including sūtrapāṭha</li>
              <li>[ Dr. Pushpa Dixit — add link ]</li>
              <li>[ Add more as you discover them ]</li>
            </ul>
          </div>

          <div class="about-card">
            <div class="about-card-title">For Beginners</div>
            <ul class="about-resource-list">
              <li>[ Book or resource you recommend for someone starting out ]</li>
              <li>[ Another beginner resource ]</li>
            </ul>
          </div>
        </div>`,
    },
    credits: {
      html: `
        <div class="about-section">
          <h2 class="about-title">Credits</h2>
          <p class="about-intro">This site stands on the work of a great ācārya and several outstanding open resources.</p>

          <div class="about-card">
            <div class="about-card-title">Primary Content — Ācārya Sudarśanadeva's Ashtadhyayi Pravachanam</div>
            <p>The sutra-level content on this site — word analysis (padavibhāga), anuvṛtti, anvaya, Sanskrit artha, Hindi artha, and udāharaṇas for all ~4000 sūtras — is drawn from <em>Ashtadhyayi Pravachanam</em> by <strong>Ācārya Sudarśanadeva</strong>, digitized by the author of this site. This commentary, delivered in the Ārya Samāj tradition, is one of the most systematic and accessible modern expositions of Pāṇini's grammar.</p>
          </div>

          <div class="about-card">
            <div class="about-card-title">Classical Commentaries — ashtadhyayi-com/data</div>
            <p>The classical commentaries displayed on this site — Kāśikā Vṛtti, Vārtikam, Laghu Kaumudī — along with Dhatupatha, Ganapatha, Uṇādi Kośa, and audio recordings, are sourced from the open data repository <a href="https://github.com/ashtadhyayi-com/data" target="_blank">ashtadhyayi-com/data</a> on GitHub, which also powers <a href="https://ashtadhyayi.com" target="_blank">ashtadhyayi.com</a>. We are grateful for their contribution to the Sanskrit community.</p>
          </div>

          <div class="about-card">
            <div class="about-card-title">Transliteration — Sanscript.js</div>
            <p>Multi-script transliteration across 11 Indic scripts is powered by <a href="https://github.com/sanskrit-coders/sanscript.js" target="_blank">Sanscript.js</a>, an open-source library by the Sanskrit Coders community.</p>
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
            <p>For errors in padavibhāga, artha, or Hindi content, use the feedback form below — this content is maintained by us. For errors in classical commentaries (Kāśikā, Laghu Kaumudī, etc.), please report at the <a href="https://github.com/ashtadhyayi-com/data" target="_blank">ashtadhyayi-com/data</a> repository.</p>
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
            <p>The data powering this site comes from the open repository <a href="https://github.com/ashtadhyayi-com/data" target="_blank">ashtadhyayi-com/data</a>, which also powers <a href="https://ashtadhyayi.com" target="_blank">ashtadhyayi.com</a>. Supporting them directly sustains the data, audio recordings, and research this site depends on.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Spread the word</div>
            <p>Share with Sanskrit students, Vedanta study groups, linguistics researchers, and anyone learning Panini's grammar.</p>
          </div>
        </div>`,
    },
    copyright: {
      html: `
        <div class="about-section">
          <h2 class="about-title">Copyright &amp; Usage</h2>
          <p class="about-intro">Paniniyam.com is a labour of love built for individual learners of Pāṇinian Sanskrit grammar, under the GNU Affero General Public License (AGPL). Please respect the following terms.</p>
          <div class="about-card">
            <div class="about-card-title">Author-created content</div>
            <p>The Visual Notes (diagrams), Author's Notes, Siddhi derivation tables, and all original written commentary on this site are © Paniniyam.com. All rights reserved.</p>
            <p style="margin-top:8px">This content may not be reproduced, republished, redistributed, or incorporated into any course material, institutional curriculum, application, or publication — in whole or in part — without the express written consent of the author.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Institutional &amp; commercial use</div>
            <p>Universities, schools, coaching centres, YouTube channels, apps, and any other institutional or commercial entity may <strong>not</strong> use the author-created content from this site without prior written permission.</p>
            <p style="margin-top:8px">To request permission, please use the Contact Us page.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Open-source data</div>
            <p>Sutra text, Kashika, Vartika, Laghu Kaumudi, Dhatupatha, and audio recordings are sourced from the open repository <a href="https://github.com/ashtadhyayi-com/data" target="_blank">ashtadhyayi-com/data</a>, which also powers <a href="https://ashtadhyayi.com" target="_blank">ashtadhyayi.com</a>. Please refer to that repository for terms governing that data.</p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Personal use</div>
            <p>You are welcome to use this site freely for personal study, share the URL with fellow learners, and link to individual sutras using the copy-link feature.</p>
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
    card.dataset.id = g.ind;
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
      const skDiv = document.createElement('div');
      skDiv.className = 'detail-sanskrit commentary-panel';
      skDiv._rawCommentary = u.sk.replace(/<[^>]*>/g, '');
      setCommentaryHTML(skDiv, skDiv._rawCommentary);
      sec.appendChild(skDiv);
      detail.appendChild(sec);
    }
    card.dataset.id = u.i;
    card.appendChild(row);
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Linganushasanam ───────────────────────────────────────────────────────────
function renderLingaAll(acData, privateEntries) {
  $sutraList.innerHTML = '';

  if (privateEntries && privateEntries.length) {
    setListHeader('लिङ्गानुशासनम्', `${privateEntries.length} sūtras`);
    for (const e of privateEntries) {
      const card = document.createElement('div');
      card.className = 'sutra-card';

      const row = document.createElement('div');
      row.className = 'sutra-row';
      const idEl = document.createElement('span');
      idEl.className = 'sutra-id';
      idEl.textContent = e.chapter_id !== null ? `${e.id}/${e.chapter_id}` : `${e.id}`;
      row.appendChild(idEl);
      row.appendChild(devEl('span', 'sutra-text', e.sutra));

      const detail = document.createElement('div');
      detail.className = 'sutra-detail';
      detail.appendChild(devEl('div', 'detail-sutra-full', e.sutra));

      if (e.artha) {
        const sec = document.createElement('div');
        sec.className = 'detail-section';
        sec.appendChild(devEl('div', 'detail-label', 'अर्थः'));
        sec.appendChild(devEl('div', 'detail-sanskrit', e.artha));
        detail.appendChild(sec);
      }
      if (e.vyakhya) {
        const sec = document.createElement('div');
        sec.className = 'detail-section';
        sec.appendChild(devEl('div', 'detail-label', 'व्याख्या'));
        const vyakhyaDiv = document.createElement('div');
        vyakhyaDiv.className = 'commentary-panel detail-sanskrit';
        vyakhyaDiv._rawCommentary = e.vyakhya;
        setCommentaryHTML(vyakhyaDiv, e.vyakhya);
        sec.appendChild(vyakhyaDiv);
        detail.appendChild(sec);
      }
      if (e.hindi) {
        const sec = document.createElement('div');
        sec.className = 'detail-section';
        const lbl = document.createElement('div');
        lbl.className = 'detail-label';
        lbl.textContent = 'हिन्दी';
        sec.appendChild(lbl);
        const hindiEl = document.createElement('div');
        hindiEl.className = 'detail-english mixed-text';
        hindiEl._mixedText = e.hindi;
        hindiEl.textContent = translitMixed(e.hindi);
        sec.appendChild(hindiEl);
        detail.appendChild(sec);
      }

      card.appendChild(row);
      card.appendChild(detail);
      card.addEventListener('click', () => toggleSimpleCard(card));
      $sutraList.appendChild(card);
    }
  } else {
    // Fallback: plain AC data
    setListHeader('लिङ्गानुशासनम्', `${acData.length} sūtras`);
    let lastSection = null;
    for (const l of acData) {
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
  }
  showPanel('list');
}

// ── Paribhasha ────────────────────────────────────────────────────────────────
function renderParibhashaAll(sutras) {
  const displaySutras = sutras.filter(e => e.id !== 0);
  $sutraList.innerHTML = '';
  setListHeader('पारिभाषिक', `${displaySutras.length} paribhāṣās`);

  // Render all entries (id=0 = भूमिका first, then numbered)
  const allEntries = [...sutras.filter(e => e.id === 0), ...displaySutras];

  for (const e of allEntries) {
    const card = document.createElement('div');
    card.className = 'sutra-card';

    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    // id=0 shows "भूमिका" label instead of 0
    if (e.id === 0) {
      idEl.className += ' dev-text';
      idEl._devText = 'भूमिका';
      idEl.textContent = translit('भूमिका');
    } else {
      idEl.textContent = e.id;
    }
    row.appendChild(idEl);
    row.appendChild(devEl('span', 'sutra-text', e.sutra));

    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    detail.appendChild(devEl('div', 'detail-sutra-full', e.sutra));

    if (e.source) {
      const sec = document.createElement('div');
      sec.className = 'detail-section';
      sec.appendChild(devEl('div', 'detail-label', 'स्रोतः'));
      sec.appendChild(devEl('div', 'detail-sanskrit', e.source));
      detail.appendChild(sec);
    }

    if (e.vyakhya) {
      const sec = document.createElement('div');
      sec.className = 'detail-section';
      sec.appendChild(devEl('div', 'detail-label', 'व्याख्या'));
      const commentaryDiv = document.createElement('div');
      commentaryDiv.className = 'commentary-panel detail-sanskrit';
      commentaryDiv._rawCommentary = e.vyakhya;
      setCommentaryHTML(commentaryDiv, e.vyakhya);
      sec.appendChild(commentaryDiv);
      detail.appendChild(sec);
    }

    card.appendChild(row);
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Bhattikavya ───────────────────────────────────────────────────────────────
let $bkMatrix = null;
let _bkMatrixJustOpened = false;

function buildBkMatrix() {
  const wrap = document.createElement('div');
  wrap.id = 'bk-matrix';
  wrap.className = 'bk-matrix';

  // Header row
  const headerRow = document.createElement('div');
  headerRow.className = 'pm-row pm-header';
  const th = document.createElement('div');
  th.className = 'pm-th dev-text';
  th.style.cssText = 'min-width:0; flex:1; text-align:left;';
  th._devText = 'भट्टिकाव्यम् — सर्गाः';
  th.textContent = translit('भट्टिकाव्यम् — सर्गाः');
  headerRow.appendChild(th);
  wrap.appendChild(headerRow);

  // 3 rows × 7 columns = sargas 1–21
  for (let row = 0; row < 3; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'pm-row';
    for (let col = 0; col < 7; col++) {
      const n = row * 7 + col + 1;
      const absent = n === 15;
      const cell = document.createElement('button');
      cell.className = 'pm-cell' + (absent ? ' bk-cell-absent' : '');
      cell.disabled = absent;
      cell.textContent = n;
      if (!absent) cell.addEventListener('click', () => { closeBkMatrix(); showBhattikavya(n); });
      rowEl.appendChild(cell);
    }
    wrap.appendChild(rowEl);
  }
  return wrap;
}

function openBkMatrix() {
  if (!$bkMatrix) { $bkMatrix = buildBkMatrix(); document.body.appendChild($bkMatrix); }
  $bkMatrix.classList.add('open');
  _bkMatrixJustOpened = true;
  setTimeout(() => { _bkMatrixJustOpened = false; }, 0);
}

function closeBkMatrix() { $bkMatrix?.classList.remove('open'); }

async function showBhattikavya(sargaNum) {
  if (!sargaNum || !BK_SARGAS.includes(sargaNum)) sargaNum = BK_SARGAS[0];
  bkCurrentSarga = sargaNum;
  history.replaceState({ book: 'bhattikavya' }, '', `?book=bhattikavya&sarga=${sargaNum}`);

  const panel = $panelBhattikavya;
  if (!bkCache[sargaNum]) {
    panel.innerHTML = '<div class="loading-inline">Loading…</div>';
    showPanel('bhattikavya');
    if (!PRIVATE_BASE) { panel.innerHTML = '<div class="no-data">Bhattikavya data not available.</div>'; return; }
    try {
      const num = String(sargaNum).padStart(2, '0');
      const res = await fetch(`${PRIVATE_BASE}/bhattikavya/sarga_${num}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      bkCache[sargaNum] = await res.json();
    } catch (e) {
      panel.innerHTML = `<div class="no-data">Could not load sarga ${sargaNum}: ${e.message}</div>`;
      return;
    }
  }

  renderBkSarga(bkCache[sargaNum]);
  showPanel('bhattikavya');

  // Background prefetch of adjacent sargas
  const idx = BK_SARGAS.indexOf(sargaNum);
  [BK_SARGAS[idx - 1], BK_SARGAS[idx + 1]].filter(Boolean).forEach(n => {
    if (n && !bkCache[n]) {
      const num = String(n).padStart(2, '0');
      fetch(`${PRIVATE_BASE}/bhattikavya/sarga_${num}.json`)
        .then(r => r.json()).then(d => { bkCache[n] = d; }).catch(() => {});
    }
  });
}

function renderBkSarga(data) {
  const panel = $panelBhattikavya;
  panel.innerHTML = '';

  const idx      = BK_SARGAS.indexOf(data.sarga);
  const prevN    = idx > 0 ? BK_SARGAS[idx - 1] : null;
  const nextN    = idx < BK_SARGAS.length - 1 ? BK_SARGAS[idx + 1] : null;

  // ── Sticky sarga nav ──
  const nav = document.createElement('div');
  nav.className = 'bk-nav';

  const btnP = document.createElement('button');
  btnP.className = 'bar-btn bk-nav-btn';
  btnP.textContent = '◀';
  btnP.disabled = !prevN;
  if (prevN) btnP.addEventListener('click', () => showBhattikavya(prevN));
  nav.appendChild(btnP);

  const titleWrap = document.createElement('div');
  titleWrap.className = 'bk-nav-title';
  titleWrap.title = 'Back to sarga list';
  titleWrap.addEventListener('click', () => showBhattikavya(0));
  const nameEl = document.createElement('span');
  nameEl.className = 'bk-sarga-name dev-text';
  nameEl._devText = data.name;
  nameEl.textContent = translit(data.name);
  titleWrap.appendChild(nameEl);
  const countEl = document.createElement('span');
  countEl.className = 'bk-sarga-count';
  countEl.textContent = `${data.total} ślokas`;
  titleWrap.appendChild(countEl);
  nav.appendChild(titleWrap);

  const btnN = document.createElement('button');
  btnN.className = 'bar-btn bk-nav-btn';
  btnN.textContent = '▶';
  btnN.disabled = !nextN;
  if (nextN) btnN.addEventListener('click', () => showBhattikavya(nextN));
  nav.appendChild(btnN);

  panel.appendChild(nav);

  // ── Shloka cards ──
  const list = document.createElement('div');
  list.className = 'bk-list';
  for (const shloka of data.shlokas) {
    list.appendChild(renderBkCard(shloka, data.sarga));
  }
  panel.appendChild(list);
}

function bkVerseIsClean(verse) {
  if (!verse) return false;
  const first = verse.split('\n')[0].trim();
  // Commentary transition lines: 'Xāha —', 'cedāha --', etc.
  if (/[आन]ाह\s*-{1,2}\s*$/.test(first)) return false;
  if (/चेदाह\s*-{1,2}\s*$/.test(first)) return false;
  // Long prose line ending with space-dash (not OCR compound-word hyphen)
  if (/ -$/.test(first) && first.length > 30) return false;
  return true;
}

function renderBkCard(shloka, sarga) {
  const card = document.createElement('div');
  card.className = 'sutra-card bk-card';

  // Row: sarga.shloka number + verse text
  const row = document.createElement('div');
  row.className = 'sutra-row';

  const idEl = document.createElement('span');
  idEl.className = 'sutra-id';
  idEl.textContent = `${sarga}.${shloka.n}`;
  row.appendChild(idEl);

  const verseEl = document.createElement('div');
  verseEl.className = 'sutra-text bk-verse dev-text';
  verseEl._devText = shloka.verse || '';
  verseEl.textContent = translit(shloka.verse || '');

  if (bkVerseIsClean(shloka.verse)) {
    const callout = document.createElement('div');
    callout.className = 'bk-callout';
    callout.appendChild(verseEl);
    row.appendChild(callout);
  } else {
    row.appendChild(verseEl);
  }

  card.appendChild(row);

  // Detail: commentary with sutra links
  const detail = document.createElement('div');
  detail.className = 'sutra-detail';

  if (shloka.commentary) {
    const commDiv = document.createElement('div');
    commDiv.className = 'commentary-panel detail-sanskrit';
    commDiv._rawCommentary = shloka.commentary;
    setCommentaryHTML(commDiv, shloka.commentary);
    detail.appendChild(commDiv);
  }

  card.appendChild(detail);
  card.addEventListener('click', () => toggleSimpleCard(card));
  return card;
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
      const skDiv = document.createElement('div');
      skDiv.className = 'detail-sanskrit commentary-panel';
      skDiv._rawCommentary = f.sk;
      setCommentaryHTML(skDiv, f.sk);
      sec.appendChild(skDiv);
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
document.getElementById('btn-about').addEventListener('click', () => { closeDrawer(); showAbout(); });

// Welcome footer legal links — open inline instead of navigating away
document.querySelectorAll('.welcome-legal-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.dataset.legal;
    if (id === 'privacy' || id === 'terms') {
      showLegalPage(id);
    } else {
      showAbout();
      setTimeout(() => renderAboutSection(id), 0);
    }
  });
});

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
  const tag = document.activeElement?.tagName;
  if (activeDrawer || tag === 'INPUT' || tag === 'TEXTAREA') return;
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

// ── Google Drive notes ────────────────────────────────────────────────────────

function renderAuthorNotesTab(panel, sutraId) {
  panel.innerHTML = '';
  panel._authorNotesSutraId = sutraId;
  const isOwner = !!(googleToken && googleUser?.email === OWNER_EMAIL);
  const text = authorNotesData[sutraId] || '';

  if (!googleToken) {
    // Show sign-in only — owner will use it; others never need to
    const wrap = document.createElement('div');
    wrap.className = 'notes-signin-wrap';
    const msg = document.createElement('p');
    msg.className = 'notes-signin-msg';
    msg.textContent = text || 'No author notes for this sūtra yet.';
    wrap.appendChild(msg);
    if (text) { panel.appendChild(wrap); return; }
    const btn = document.createElement('button');
    btn.className = 'notes-signin-btn';
    btn.textContent = 'Sign in to edit';
    btn.addEventListener('click', () => {
      if (typeof google === 'undefined') { alert('Google sign-in not loaded yet — please try again.'); return; }
      googleSignIn();
    });
    wrap.appendChild(btn);
    panel.appendChild(wrap);
    return;
  }

  if (!isOwner) {
    // Signed in but not owner — read-only
    if (text) {
      const content = document.createElement('div');
      content.className = 'notes-readonly commentary-panel';
      setCommentaryHTML(content, text);
      panel.appendChild(content);
    } else {
      const empty = document.createElement('p');
      empty.className = 'notes-empty';
      empty.textContent = 'No author notes for this sūtra yet.';
      panel.appendChild(empty);
    }
    return;
  }

  // Owner view — editable
  const textarea = document.createElement('textarea');
  textarea.className = 'notes-textarea';
  textarea.placeholder = 'Author notes for this sūtra…';
  textarea.value = text;

  const footer = document.createElement('div');
  footer.className = 'notes-author-footer';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'notes-save-btn author-save-btn';
  saveBtn.textContent = 'Saved';
  saveBtn.disabled = true;

  const hint = document.createElement('span');
  hint.className = 'notes-publish-hint';
  hint.textContent = 'Save → download from Drive → upload to R2 to publish';

  textarea.addEventListener('input', () => {
    authorNotesData[sutraId] = textarea.value;
    saveBtn.textContent = 'Save';
    saveBtn.disabled = false;
    scheduleAuthorSave();
  });

  saveBtn.addEventListener('click', () => {
    saveBtn.textContent = 'Saving…';
    saveBtn.disabled = true;
    clearTimeout(_saveAuthorTimer);
    saveAuthorNotes();
  });

  footer.appendChild(saveBtn);
  footer.appendChild(hint);
  panel.appendChild(textarea);
  panel.appendChild(footer);
}

function renderNotesTab(panel, sutraId) {
  panel.innerHTML = '';
  panel._notesSutraId = sutraId;

  if (!googleToken) {
    const wrap = document.createElement('div');
    wrap.className = 'notes-signin-wrap';

    const msg = document.createElement('p');
    msg.className = 'notes-signin-msg';
    msg.textContent = 'Save personal notes for each sūtra.';

    const btn = document.createElement('button');
    btn.className = 'notes-signin-btn';
    btn.textContent = 'Sign in with Google';
    btn.addEventListener('click', () => {
      if (typeof google === 'undefined') {
        alert('Google sign-in not loaded yet — please try again in a moment.');
        return;
      }
      googleSignIn();
    });

    const privacy = document.createElement('p');
    privacy.className = 'notes-privacy';
    privacy.textContent = 'Notes are saved to your own Google Drive. We never see or store your data.';

    wrap.appendChild(msg);
    wrap.appendChild(btn);
    wrap.appendChild(privacy);
    panel.appendChild(wrap);
    return;
  }

  // Signed-in state
  const header = document.createElement('div');
  header.className = 'notes-header';

  const userEl = document.createElement('span');
  userEl.className = 'notes-user';
  userEl.textContent = googleUser ? googleUser.email : '';

  const signOutBtn = document.createElement('button');
  signOutBtn.className = 'notes-signout-btn';
  signOutBtn.textContent = 'Sign out';
  signOutBtn.addEventListener('click', googleSignOut);

  header.appendChild(userEl);
  header.appendChild(signOutBtn);

  const textarea = document.createElement('textarea');
  textarea.className = 'notes-textarea';
  textarea.placeholder = 'Your notes for this sūtra…';
  textarea.value = notesData[sutraId] || '';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'notes-save-btn';
  saveBtn.textContent = 'Saved';
  saveBtn.disabled = true;

  textarea.addEventListener('input', () => {
    notesData[sutraId] = textarea.value;
    saveBtn.textContent = 'Save';
    saveBtn.disabled = false;
    scheduleSaveNotes();
  });

  saveBtn.addEventListener('click', () => {
    saveBtn.textContent = 'Saving…';
    saveBtn.disabled = true;
    clearTimeout(_saveNotesTimer);
    saveDriveNotes();
  });

  panel.appendChild(header);
  panel.appendChild(textarea);
  panel.appendChild(saveBtn);
}

function refreshAllNotesPanels() {
  const isOwner = !!(googleToken && googleUser?.email === OWNER_EMAIL);
  document.querySelectorAll('.notes-owner-signin').forEach(btn => {
    btn.style.display = isOwner ? 'none' : '';
  });
  document.querySelectorAll('.notes-tab-panel').forEach(panel => {
    if (panel._notesSutraId)       renderNotesTab(panel, panel._notesSutraId);
    if (panel._authorNotesSutraId) renderAuthorNotesTab(panel, panel._authorNotesSutraId);
  });
}

function googleSignIn() {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: DRIVE_SCOPE,
    callback: async resp => {
      if (resp.error) { console.warn('Google sign-in error:', resp.error); return; }
      googleToken = resp.access_token;
      // Get user info from Drive about endpoint (no extra scope needed)
      try {
        const info = await fetch(
          'https://www.googleapis.com/drive/v3/about?fields=user',
          { headers: { Authorization: `Bearer ${googleToken}` } }
        ).then(r => r.json());
        googleUser = { name: info.user?.displayName || '', email: info.user?.emailAddress || '' };
      } catch (_) { googleUser = { name: '', email: '' }; }
      await loadDriveNotes();
      if (googleUser?.email === OWNER_EMAIL) await loadAuthorDriveNotes();
      refreshAllNotesPanels();
    },
  });
  client.requestAccessToken();
}

function googleSignOut() {
  if (googleToken) google.accounts.oauth2.revoke(googleToken, () => {});
  googleToken            = null;
  googleUser             = null;
  notesData              = {};
  notesDriveFileId       = null;
  notesLoaded            = false;
  authorNotesDriveFileId = null;
  authorNotesLoaded      = false;
  // reload author notes from R2 (public version) after sign-out
  fetch(`${PRIVATE_BASE}/paniniyam-author-notes.json`)
    .then(r => r.ok ? r.json() : {}).then(d => { authorNotesData = d; refreshAllNotesPanels(); })
    .catch(() => { authorNotesData = {}; refreshAllNotesPanels(); });
}

async function loadDriveNotes() {
  if (!googleToken) return;
  try {
    const q   = encodeURIComponent(`name='${NOTES_FILENAME}' and trashed=false`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,modifiedTime)&orderBy=modifiedTime%20desc`,
      { headers: { Authorization: `Bearer ${googleToken}` } }
    );
    if (!res.ok) throw new Error(`Drive search ${res.status}`);
    const d = await res.json();
    const files = d.files || [];
    notesDriveFileId = files[0]?.id || null;
    // Silently delete any duplicates (keep most recently modified)
    for (const f of files.slice(1)) {
      fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${googleToken}` } }
      ).catch(() => {});
    }
    if (notesDriveFileId) {
      const r2 = await fetch(
        `https://www.googleapis.com/drive/v3/files/${notesDriveFileId}?alt=media`,
        { headers: { Authorization: `Bearer ${googleToken}` } }
      );
      if (!r2.ok) throw new Error(`Drive read ${r2.status}`);
      notesData = await r2.json();
    } else {
      notesData = {};
    }
  } catch (e) {
    console.warn('Notes load error:', e);
    notesData = {};          // start fresh — saves will still work
  }
  notesLoaded = true;        // always allow saves, even if load failed
}

async function saveDriveNotes() {
  if (!googleToken || !notesLoaded || _saveInProgress) return;
  _saveInProgress = true;
  const sorted = Object.fromEntries(Object.keys(notesData).sort().map(k => [k, notesData[k]]));
  const body = JSON.stringify(sorted, null, 2);
  try {
    if (notesDriveFileId) {
      const res = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${notesDriveFileId}?uploadType=media`,
        { method: 'PATCH', headers: { Authorization: `Bearer ${googleToken}`, 'Content-Type': 'application/json' }, body }
      );
      if (!res.ok) throw new Error(`Drive update ${res.status}: ${await res.text()}`);
    } else {
      const meta = JSON.stringify({ name: NOTES_FILENAME, mimeType: 'application/json' });
      const form = new FormData();
      form.append('metadata', new Blob([meta], { type: 'application/json' }));
      form.append('file',     new Blob([body], { type: 'application/json' }));
      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
        { method: 'POST', headers: { Authorization: `Bearer ${googleToken}` }, body: form }
      );
      if (!res.ok) throw new Error(`Drive create ${res.status}: ${await res.text()}`);
      const d = await res.json();
      notesDriveFileId = d.id;
    }
    document.querySelectorAll('.notes-save-btn').forEach(btn => {
      btn.textContent = 'Saved';
      btn.disabled = true;
    });
  } catch (e) {
    console.warn('Notes save error:', e);
    document.querySelectorAll('.notes-save-btn').forEach(btn => {
      btn.textContent = `Save failed (${e.message}) — retry`;
      btn.disabled = false;
    });
  } finally {
    _saveInProgress = false;
  }
}

function scheduleSaveNotes() {
  clearTimeout(_saveNotesTimer);
  _saveNotesTimer = setTimeout(saveDriveNotes, 1500);
}

async function loadAuthorDriveNotes() {
  if (!googleToken) return;
  try {
    const q   = encodeURIComponent(`name='${AUTHOR_NOTES_FILENAME}' and trashed=false`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,modifiedTime)&orderBy=modifiedTime%20desc`,
      { headers: { Authorization: `Bearer ${googleToken}` } }
    );
    if (!res.ok) throw new Error(`Drive search ${res.status}`);
    const d = await res.json();
    const files = d.files || [];
    authorNotesDriveFileId = files[0]?.id || null;
    // Silently delete any duplicates (keep most recently modified)
    for (const f of files.slice(1)) {
      fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${googleToken}` } }
      ).catch(() => {});
    }
    if (authorNotesDriveFileId) {
      const r2 = await fetch(
        `https://www.googleapis.com/drive/v3/files/${authorNotesDriveFileId}?alt=media`,
        { headers: { Authorization: `Bearer ${googleToken}` } }
      );
      if (!r2.ok) throw new Error(`Drive read ${r2.status}`);
      authorNotesData = await r2.json();
    }
  } catch (e) {
    console.warn('Author notes load error:', e);
  }
  authorNotesLoaded = true;
}

async function saveAuthorNotes() {
  if (!googleToken || !authorNotesLoaded || _saveAuthorInProgress) return;
  _saveAuthorInProgress = true;
  const sorted = Object.fromEntries(Object.keys(authorNotesData).sort().map(k => [k, authorNotesData[k]]));
  const body = JSON.stringify(sorted, null, 2);
  try {
    if (authorNotesDriveFileId) {
      const res = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${authorNotesDriveFileId}?uploadType=media`,
        { method: 'PATCH', headers: { Authorization: `Bearer ${googleToken}`, 'Content-Type': 'application/json' }, body }
      );
      if (!res.ok) throw new Error(`Drive update ${res.status}: ${await res.text()}`);
    } else {
      const meta = JSON.stringify({ name: AUTHOR_NOTES_FILENAME, mimeType: 'application/json' });
      const form = new FormData();
      form.append('metadata', new Blob([meta], { type: 'application/json' }));
      form.append('file',     new Blob([body], { type: 'application/json' }));
      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
        { method: 'POST', headers: { Authorization: `Bearer ${googleToken}` }, body: form }
      );
      if (!res.ok) throw new Error(`Drive create ${res.status}: ${await res.text()}`);
      const d = await res.json();
      authorNotesDriveFileId = d.id;
    }
    document.querySelectorAll('.author-save-btn').forEach(btn => {
      btn.textContent = 'Saved'; btn.disabled = true;
    });
  } catch (e) {
    console.warn('Author notes save error:', e);
    document.querySelectorAll('.author-save-btn').forEach(btn => {
      btn.textContent = `Save failed (${e.message}) — retry`; btn.disabled = false;
    });
  } finally {
    _saveAuthorInProgress = false;
  }
}

function scheduleAuthorSave() {
  clearTimeout(_saveAuthorTimer);
  _saveAuthorTimer = setTimeout(saveAuthorNotes, 1500);
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  buildScriptDropdown();
  buildThemePicker();
  applyTheme(currentTheme);
  buildIconBar();
  buildSearchScopes();
  applyPinState();
  setupHoverZones();
  try {
    const [raw] = await Promise.all([
      fetchJSON('sutraani/data.txt'),
      PRIVATE_BASE
        ? fetch(`${PRIVATE_BASE}/pravachanam.json`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) bookData['pravachanam'] = d; })
            .catch(() => null)
        : Promise.resolve(null),
      PRIVATE_BASE
        ? fetch(`${PRIVATE_BASE}/paniniyam-author-notes.json`)
            .then(r => r.ok ? r.json() : {})
            .then(d => { authorNotesData = d; })
            .catch(() => null)
        : Promise.resolve(null),
    ]);
    sutraList = raw.data || [];
    for (const s of sutraList) sutraIndex[s.i] = s;
    buildNavTree();
    retranslit();
    $welcomeStats.textContent = `${sutraList.length} sūtras · 8 adhyāyas · 32 pādas · in every Indic script`;

    // ── Welcome hero image + YouTube link (served from R2) ──────────────────
    const $hero = document.getElementById('welcome-hero');
    if ($hero && PRIVATE_BASE) {
      $hero.innerHTML = `
        <a class="welcome-yt-link" href="https://www.youtube.com/watch?v=l7mQFT5zrdo&list=PLsfkVTlrxnqKVdZRZgq1pFSuuQm-w8fB3"
           target="_blank" rel="noopener" title="Watch on YouTube">
          <img class="welcome-hero-img" src="${PRIVATE_BASE}/img/upadesh.png"
               alt="Paniniyam — a girl lovingly hugging a stack of grammar books">
          <div class="welcome-yt-badge">▶ Watch on YouTube</div>
        </a>`;
    }

    // ── Intro video card (always shown, public YouTube thumbnail) ───────────
    const $introVideo = document.getElementById('welcome-intro-video');
    if ($introVideo) {
      $introVideo.innerHTML = `
        <a class="welcome-intro-link" href="https://youtu.be/G8q2MUjX1bU"
           target="_blank" rel="noopener" title="How to use this site">
          <div class="welcome-intro-thumb">
            <img src="https://img.youtube.com/vi/G8q2MUjX1bU/mqdefault.jpg"
                 alt="How to use site — intro video">
            <div class="welcome-intro-play">▶</div>
          </div>
          <div class="welcome-intro-label">How to use this site</div>
        </a>`;
    }

    $loading.classList.add('hidden');

    // Deep link — open sutra/dhatu/book from URL param if present
    const params    = new URLSearchParams(location.search);
    const urlSutra  = params.get('sutra');
    const urlDhatu  = params.get('dhatu');
    const urlBook   = params.get('book');
    const urlAbout  = params.has('about');

    if (urlSutra) {
      const linkedId    = sutraRefToId(urlSutra);
      const linkedSutra = linkedId ? sutraIndex[linkedId] : null;
      if (linkedSutra) {
        const idx = sutraList.findIndex(s => s.i === linkedId);
        readerList = sutraList;
        showReader(linkedSutra, idx);
      } else {
        showPanel('welcome');
      }
    } else if (urlDhatu) {
      const dhatuData = await loadData('dhatupatha', 'dhatu/data.txt');
      const list = dhatuData?.data || [];
      const idx  = list.findIndex(d => d.baseindex === urlDhatu);
      if (idx >= 0) {
        dhatuReaderList = list;
        showDhatuReader(list[idx], idx);
      } else {
        showPanel('welcome');
      }
    } else if (urlBook) {
      if (urlBook === 'avyaya') {
        await showAvyayaPanel();
      } else if (urlBook === 'varnochchaaran') {
        await showVarnochchaaranPanel();
      } else if (urlBook === 'shabda') {
        showShabdaEngine();
      } else if (urlBook === 'visuals') {
        await showVisualLibrary();
      } else if (urlBook === 'bhattikavya') {
        const sargaParam = parseInt(params.get('sarga')) || 1;
        await showBhattikavya(sargaParam);
      } else {
        // Search top-level leaf books, then sub-tree children
        let book = BOOKS.find(b => b.id === urlBook && b.type === 'leaf');
        if (!book) {
          for (const b of BOOKS) {
            const p = (b.pages || []).find(p => p.id === urlBook && p.type === 'leaf');
            if (p) { book = p; break; }
          }
        }
        if (book) {
          await handleLeafClick(book, null);
        } else {
          showPanel('welcome');
        }
      }
    } else if (urlAbout) {
      showAbout();
    } else {
      showPanel('welcome');
    }
  } catch (err) {
    document.querySelector('.loading-text').textContent = `Error: ${err.message}`;
  }
}

// ── Global sutra-link hover (works in commentary, meta, everywhere) ───────────
document.addEventListener('mouseover', e => {
  const link = e.target.closest('.sutra-link');
  if (link && link.dataset.id) showSiddhiTip(link, link.dataset.id);
});
document.addEventListener('mouseout', e => {
  const link = e.target.closest('.sutra-link');
  if (link) hideSiddhiTip();
});

// ── Global concept-link hover ─────────────────────────────────────────────────
document.addEventListener('mouseover', e => {
  const link = e.target.closest('.concept-link');
  if (link && link.dataset.concept) showConceptPopup(link, link.dataset.concept);
});
document.addEventListener('mouseout', e => {
  const link = e.target.closest('.concept-link');
  if (link) hideConceptPopup();
});
document.addEventListener('click', e => {
  const link = e.target.closest('.concept-link');
  if (link) { e.preventDefault(); showConceptPopup(link, link.dataset.concept); }
});

window.gotoSutra = gotoSutra;
init();
