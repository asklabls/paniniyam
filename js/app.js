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
      { id: 'bhattikavya',    devName: 'भट्टिकाव्यम्',    engName: 'Bhaṭṭikāvya',       type: 'bhattikavya-panel'       },
      { id: 'rupavatarah',   devName: 'रूपावतारः',        engName: 'Rūpāvatāraḥ',       type: 'rupavatarah-panel'       },
      { id: 'nirukta',        devName: 'निरुक्तम्',        engName: 'Nirukta',            type: 'nirukta-panel'           },
      { id: 'yogadarshana',   devName: 'योगदर्शनम्',       engName: 'Yoga Darśana',       type: 'yogadarshana-panel'      },
      { id: 'shabdarupavali', devName: 'शब्दरूपावली', engName: 'Śabdarūpāvalī', type: 'shabdarupavali-panel' },
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
      { id: 'namarupa',   devName: 'नामरूप',         engName: 'Nāmarūpa',       type: 'namarupa-page'  },
      { id: 'avyaya',     devName: 'अव्ययार्थाः',   engName: 'Avyayas',       type: 'avyaya-panel' },
      { id: 'paribhasha', devName: 'पारिभाषिक',     engName: 'Pāribhāṣika',   type: 'leaf' },
      { id: 'fit',        devName: 'फिट्सूत्राणि',  engName: 'Fiṭ Sūtrāṇi',  type: 'leaf', dataPath: 'fit/data.txt' },
      { id: 'vartika',      devName: 'वार्तिकम्',   engName: 'Vārtika',       type: 'leaf', dataPath: 'sutraani/vartika.txt' },
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
      { id: 'themes',       engName: 'Themes'        },
      { id: 'testimonials', engName: 'Testimonials'  },
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
  { id: 'sarva', dev: 'सार्वधातुक', lakaras: LAKARA_SARVA },
  { id: 'ardha', dev: 'आर्धधातुक',  lakaras: LAKARA_ARDHA },
];
const KRDANTA_LIST = [
  { krt: 'lyuw',    dev: 'ल्युट्',  prayoga: 'Kartari', artha: 'कर्तृवाचक (-अन)' },
  { krt: 'Rvul',    dev: 'ण्वुल्',  prayoga: 'Kartari', artha: 'कर्तृवाचक (-अक)' },
  { krt: 'tfc',     dev: 'तृच्',    prayoga: 'Kartari', artha: 'कर्तृवाचक (-तृ)' },
  { krt: 'Ryat',    dev: 'ण्यत्',   prayoga: 'Karmani', artha: 'विधि (-य)' },
  { krt: 'tavya',   dev: 'तव्य',    prayoga: 'Karmani', artha: 'विधि (-तव्य)' },
  { krt: 'anIyar',  dev: 'अनीयर्', prayoga: 'Karmani', artha: 'विधि (-अनीय)' },
  { krt: 'kta',     dev: 'क्त',     prayoga: 'Karmani', artha: 'भूतकृदन्त' },
  { krt: 'ktavatu', dev: 'क्तवतु',  prayoga: 'Kartari', artha: 'कर्तरि भूत' },
  { krt: 'Satf',    dev: 'शतृ',     prayoga: 'Kartari', artha: 'वर्तमान कर्तृ' },
  { krt: 'SAnac',   dev: 'शानच्',   prayoga: 'Kartari', artha: 'आत्म. वर्तमान' },
  { krt: 'ktvA',    dev: 'क्त्वा',  prayoga: 'Kartari', artha: 'अव्यय' },
  { krt: 'lyap',    dev: 'ल्यप्',   prayoga: 'Kartari', artha: 'अव्यय (स-उपसर्ग)' },
  { krt: 'tumun',   dev: 'तुमुन्',  prayoga: 'Kartari', artha: 'तुमर्थ' },
  { krt: 'Namul',   dev: 'णमुल्',   prayoga: 'Kartari', artha: 'अव्यय' },
  { krt: 'GaY',     dev: 'घञ्',     prayoga: 'Kartari', artha: 'भाव/कर्म (-अ)' },
  { krt: 'ktin',    dev: 'क्तिन्',  prayoga: 'Kartari', artha: 'भाव (-ति)' },
  { krt: 'cAnaS',   dev: 'चानश्',   prayoga: 'Kartari', artha: 'परोक्ष कर्तृ' },
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
const VIDYUT_BASE   = PRIVATE_BASE ? PRIVATE_BASE + '/vidyut'  : null;
const MDV_BASE      = PRIVATE_BASE ? PRIVATE_BASE + '/dhv'     : null;
const VIDYUT_GANA   = { '1':'Bhvadi','2':'Adadi','3':'Juhotyadi','4':'Divadi','5':'Svadi','6':'Tudadi','7':'Rudhadi','8':'Tanadi','9':'Kryadi','10':'Curadi' };
const VIDYUT_LAKARA = { lat:'Lat',lot:'Lot',lang:'Lan',vidhiling:'VidhiLin',lit:'Lit',lut:'Lut',lrut:'Lrt',ashirling:'AshirLin',lung:'Lun',lrung:'Lrn' };
const VIDYUT_PURUSH = ['Prathama','Madhyama','Uttama'];
const VIDYUT_VACANA = ['Eka','Dvi','Bahu'];
const VIDYUT_PADA   = { 'परस्मैपद':'Parasmaipada', 'आत्मनेपद':'Atmanepada' };

// ── Google Drive notes (Phase 4) ─────────────────────────────────────────────
const GOOGLE_CLIENT_ID        = '868948839711-9o6jlfsrlhoa7qn5ngebqp91l60h7e35.apps.googleusercontent.com';
const DRIVE_SCOPE             = 'https://www.googleapis.com/auth/drive.file';
const NOTES_FILENAME          = 'paniniyam-notes.json';
const AUTHOR_NOTES_FILENAME   = 'paniniyam-author-notes.json';
const OWNER_EMAIL             = 'akupadhyayula@gmail.com';

let _vidyutMod = null;
let _vidyutLoadPromise = null;

async function loadVidyut() {
  if (_vidyutMod) return _vidyutMod;
  if (!VIDYUT_BASE) return null;
  if (!_vidyutLoadPromise) {
    _vidyutLoadPromise = (async () => {
      const base = VIDYUT_BASE.startsWith('http') ? VIDYUT_BASE
                   : new URL(VIDYUT_BASE, location.href).href.replace(/\/$/, '');
      // Import inner WASM JS directly to avoid wrapper module-cache issues
      const wasmMod = await import(base + '/wasm/vidyut_prakriya.js');
      await wasmMod.default({ module_or_path: base + '/wasm/vidyut_prakriya_bg.wasm' });
      const tsvRes = await fetch(base + '/vidyut_dhatupatha_5.tsv').catch(() => null);
      const tsv = (tsvRes && tsvRes.ok) ? await tsvRes.text() : '';
      // Parse TSV into baseindex → aupadeshika map for exact Vidyut SLP1 forms
      // (Vidyut uses accent marks like \ ^ ~ that our transliterator drops)
      const tsvMap = {};
      if (tsv) {
        tsv.split('\n').slice(1).forEach(line => {
          const parts = line.split('\t');
          if (parts[0] && parts[1]) tsvMap[parts[0]] = parts[1];
        });
      }
      // Store as { wasm, tsvMap } to match existing v.wasm.deriveTinantas() calls
      _vidyutMod = { wasm: wasmMod.Vidyut.init(tsv), tsvMap };
      return _vidyutMod;
    })();
  }
  return _vidyutLoadPromise;
}

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
// ── Nirukta constants ─────────────────────────────────────────────────────────
const NR_ADHYAYAS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
const NR_ADHYAYA_NAMES_DEV = {
  1:'प्रथमोऽध्यायः', 2:'द्वितीयोऽध्यायः', 3:'तृतीयोऽध्यायः', 4:'चतुर्थोऽध्यायः',
  5:'पञ्चमोऽध्यायः', 6:'षष्ठोऽध्यायः', 7:'सप्तमोऽध्यायः', 8:'अष्टमोऽध्यायः',
  9:'नवमोऽध्यायः', 10:'दशमोऽध्यायः', 11:'एकादशोऽध्यायः', 12:'द्वादशोऽध्यायः',
  13:'त्रयोदशोऽध्यायः', 14:'चतुर्दशोऽध्यायः',
};
const NR_ADHYAYA_COUNTS = {
  1:18, 2:26, 3:18, 4:18, 5:22, 6:32, 7:23, 8:12, 9:25, 10:36, 11:30, 12:22, 13:8, 14:22,
};
let nrCurrentAdhyaya = 0;
const nrCache = {};
let $nrMatrix = null;
let _nrMatrixJustOpened = false;

const BK_SARGAS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21]; // sarga 15 absent

const RV_SECTIONS = [1,2,3,4,5,6,7,8];
const RV_SECTION_NAMES_DEV = [
  'संज्ञा', 'संहिता', 'विभक्ति', 'अव्यय',
  'स्त्रीप्रत्यय', 'कारक', 'समास', 'तद्धित',
];
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

let rvCurrentSection = 0;
const rvCache = {};
const BK_SARGA_COUNTS = {
  1:23, 2:48, 3:49, 4:30, 5:96, 6:123, 7:96, 8:115, 9:116, 10:67,
  11:42, 12:81, 13:47, 14:120, 16:36, 17:101, 18:39, 19:27, 20:33, 21:34,
};

// Dhatu reader state
let dhatuReaderList = [];
let dhatuReaderIdx  = -1;
let dhatuReaderItem = null;
let readerType      = 'sutra'; // 'sutra' | 'dhatu'
let _pendingFormClick = null;  // { lakaraKey, padaKey, cellIndex } — set when navigating to related dhatu

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
let pvNotesData            = null;   // {sutraId: "note text"} from paniniyam-author-notes.json
let authorNotesDriveFileId = null;
let authorNotesLoaded      = false;
let youtubeData            = null;   // {sutraId: videoId} loaded from forms/youtube.json
let conceptsIndex          = null;   // {term: {path, category}} loaded from forms/concepts_index.json
const conceptSvgCache      = {};     // term → SVG text, cached after first fetch
const sutraSvgCache        = {};     // sutraId → SVG text, cached after first fetch
const sutraVisualExists    = {};     // sutraId → true|false, result of HEAD check
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
const $panelRupavatarah       = document.getElementById('panel-rupavatarah');
const $panelNirukta           = document.getElementById('panel-nirukta');
const $panelYogadarshana      = document.getElementById('panel-yogadarshana');
const $panelNamarupa          = document.getElementById('panel-namarupa');
const $panelShabdarupavali    = document.getElementById('panel-shabdarupavali');
const $panelTranslit          = document.getElementById('panel-translit');
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
      // [label](url) markdown link — handles [1:20](youtubeUrl?t=N) timestamps etc.
      if (text[i] === '[' && text[i+1] !== '[') {
        const closeBracket = text.indexOf(']', i+1);
        if (closeBracket !== -1 && text[closeBracket+1] === '(') {
          const closeParens = text.indexOf(')', closeBracket+2);
          if (closeParens !== -1) {
            const url = text.slice(closeBracket+2, closeParens);
            if (url.startsWith('http')) {
              flush();
              const label = text.slice(i+1, closeBracket);
              html += `<a href="${url}" target="_blank" rel="noopener" class="siddhi-ext-link">${label}</a>`;
              i = closeParens + 1; continue;
            }
          }
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
  $panelRupavatarah.style.display       = name === 'rupavatarah'       ? '' : 'none';
  $panelNirukta.style.display           = name === 'nirukta'           ? '' : 'none';
  $panelYogadarshana.style.display      = name === 'yogadarshana'      ? '' : 'none';
  $panelNamarupa.style.display          = name === 'namarupa'          ? '' : 'none';
  $panelShabdarupavali.style.display    = name === 'shabdarupavali'    ? '' : 'none';
  $panelTranslit.style.display          = name === 'translit'          ? '' : 'none';
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

  // माधवीया धातुवृत्तिः tab (lazy, hidden until data available)
  if (MDV_BASE) {
    const mdvPanel = document.createElement('div');
    mdvPanel.className = 'detail-tab-panel';
    mdvPanel.dataset.panel = 'mdv';
    mdvPanel._loaded = false;
    panels['mdv'] = mdvPanel;

    const mdvTab = document.createElement('button');
    mdvTab.className = 'detail-tab dev-text';
    mdvTab._devText = 'माधवीया';
    mdvTab.textContent = translit('माधवीया');
    mdvTab.style.display = 'none'; // hidden until data confirmed

    mdvTab.addEventListener('click', () => {
      tabBar.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
      mdvTab.classList.add('active');
      Object.values(panels).forEach(p => p.classList.remove('active'));
      mdvPanel.classList.add('active');
      if (!mdvPanel._loaded) {
        mdvPanel._loaded = true;
        loadAndRenderMdv(d.baseindex, mdvPanel);
      }
    });

    tabBar.appendChild(mdvTab);
    panelWrap.appendChild(mdvPanel);

    // Prefetch to decide visibility — don't block render
    fetch(`${MDV_BASE}/${d.baseindex}.json`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.vritti) {
          mdvTab.style.display = '';
          mdvPanel._mdvData = data;
        }
      })
      .catch(() => {});
  }

  // कृदन्त tab (Vidyut krdanta derivations)
  if (VIDYUT_BASE) {
    const krdPanel = document.createElement('div');
    krdPanel.className = 'detail-tab-panel';
    krdPanel.dataset.panel = 'krdanta';
    krdPanel._loaded = false;
    panels['krdanta'] = krdPanel;

    const krdTab = document.createElement('button');
    krdTab.className = 'detail-tab dev-text';
    krdTab._devText = 'कृदन्त';
    krdTab.textContent = translit('कृदन्त');

    krdTab.addEventListener('click', () => {
      tabBar.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
      krdTab.classList.add('active');
      Object.values(panels).forEach(p => p.classList.remove('active'));
      krdPanel.classList.add('active');
      if (!krdPanel._loaded) {
        krdPanel._loaded = true;
        loadAndRenderKrdanta(d, krdPanel);
      }
    });

    tabBar.appendChild(krdTab);
    panelWrap.appendChild(krdPanel);
  }

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

async function loadAndRenderKrdanta(dhatu, panel) {
  panel.innerHTML = '<div class="vidyut-loading">Computing kṛdantas…</div>';
  const v = await loadVidyut();
  if (!v) { panel.innerHTML = '<div class="vidyut-loading">Vidyut unavailable.</div>'; return; }

  const aupadeshika = (v.tsvMap && v.tsvMap[dhatu.baseindex])
                      || Sanscript.t(dhatu.aupadeshik || dhatu.dhatu, 'devanagari', 'slp1');
  const gana = VIDYUT_GANA[String(dhatu.gana)] || 'Bhvadi';
  const dhatuArgs = { aupadeshika, gana, antargana: null, sanadi: [], prefixes: [] };

  panel.innerHTML = '';

  const pillWrap = document.createElement('div');
  pillWrap.className = 'krdanta-pills';

  const derivArea = document.createElement('div');
  derivArea.className = 'dhatu-deriv-area';

  let activePillBtn = null;

  for (const krt of KRDANTA_LIST) {
    let results = null;
    try {
      results = v.wasm.deriveKrdantas({ dhatu: dhatuArgs, krt: krt.krt, prayoga: krt.prayoga });
    } catch (_) {
      try { results = v.wasm.deriveKrdantas({ dhatu: dhatuArgs, krt: krt.krt }); } catch (_2) {}
    }
    const devForm = results?.[0]?.text
      ? Sanscript.t(vslp1(results[0].text), 'slp1', 'devanagari')
      : '—';

    const btn = document.createElement('button');
    btn.className = 'krdanta-pill dev-text' + (devForm === '—' ? ' krdanta-pill-empty' : '');
    btn.title = krt.artha;

    const labelEl = document.createElement('span');
    labelEl.className = 'krdanta-pill-label dev-text';
    labelEl._devText = krt.dev;
    labelEl.textContent = translit(krt.dev);

    btn.appendChild(labelEl);

    if (devForm !== '—' && results?.[0]) {
      const rowResults = results;
      btn.addEventListener('click', () => {
        if (activePillBtn === btn) {
          activePillBtn = null;
          btn.classList.remove('active');
          derivArea.innerHTML = '';
          return;
        }
        if (activePillBtn) activePillBtn.classList.remove('active');
        activePillBtn = btn;
        btn.classList.add('active');

        derivArea.innerHTML = '';
        const pillBar = document.createElement('div');
        pillBar.className = 'dhatu-deriv-pillbar';

        const activePill = document.createElement('button');
        activePill.className = 'dhatu-deriv-pill dev-text active';
        activePill._devText = devForm;
        activePill.textContent = translit(devForm);
        pillBar.appendChild(activePill);

        const actions = document.createElement('div');
        actions.className = 'dhatu-deriv-actions';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'dhatu-deriv-action';
        closeBtn.title = 'Close';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => {
          activePillBtn = null;
          btn.classList.remove('active');
          derivArea.innerHTML = '';
        });
        actions.appendChild(closeBtn);
        pillBar.appendChild(actions);
        derivArea.appendChild(pillBar);
        renderVidyutSteps(derivArea, rowResults);
      });
    }

    pillWrap.appendChild(btn);
  }

  panel.appendChild(pillWrap);
  panel.appendChild(derivArea);
}

async function loadAndRenderDhatuForms(d, lakaras, panel) {
  panel.textContent = '…';
  try {
    const forms = await loadDhatuForms(d.baseindex);
    panel.innerHTML = '';

    // Collect lakaras that have data
    const available = lakaras.filter(lak => forms[`p${lak.key}`] || forms[`a${lak.key}`]);
    if (!available.length) { panel.textContent = '—'; return; }

    const pillBar = document.createElement('div');
    pillBar.className = 'pratyaya-lak-pills';
    const contentArea = document.createElement('div');
    contentArea.className = 'pratyaya-lak-content';
    const derivArea = document.createElement('div');
    derivArea.className = 'dhatu-deriv-area';
    const entries = [];

    available.forEach((lakara, i) => {
      const pForms = forms[`p${lakara.key}`];
      const aForms = forms[`a${lakara.key}`];

      const pill = document.createElement('button');
      pill.className = 'pratyaya-lak-pill dev-text' + (i === 0 ? ' active' : '');
      pill._devText = lakara.dev;
      pill.textContent = translit(lakara.dev);
      pillBar.appendChild(pill);

      const lPanel = document.createElement('div');
      lPanel.className = 'pratyaya-lak-panel' + (i === 0 ? ' active' : '');

      if (pForms && aForms) {
        const split = document.createElement('div');
        split.className = 'forms-split';
        split.appendChild(renderFormsTable(pForms, 'परस्मैपद', d, lakara.key, derivArea));
        const divider = document.createElement('div');
        divider.className = 'forms-divider';
        split.appendChild(divider);
        split.appendChild(renderFormsTable(aForms, 'आत्मनेपद', d, lakara.key, derivArea));
        lPanel.appendChild(split);
      } else {
        lPanel.appendChild(renderFormsTable(pForms || aForms, null, d, lakara.key, derivArea));
      }
      contentArea.appendChild(lPanel);
      entries.push({ pill, panel: lPanel, lakaraKey: lakara.key });

      pill.addEventListener('click', () => {
        entries.forEach(e => { e.pill.classList.remove('active'); e.panel.classList.remove('active'); });
        pill.classList.add('active');
        lPanel.classList.add('active');
      });
    });

    panel.appendChild(pillBar);
    panel.appendChild(contentArea);
    panel.appendChild(derivArea);

    // If we navigated here from a related-dhatu pill, auto-select the same position
    if (_pendingFormClick) {
      const { lakaraKey: plk, padaKey: ppk, cellIndex: pci } = _pendingFormClick;
      _pendingFormClick = null;
      const match = entries.find(e => e.lakaraKey === plk);
      if (match) {
        entries.forEach(e => { e.pill.classList.remove('active'); e.panel.classList.remove('active'); });
        match.pill.classList.add('active');
        match.panel.classList.add('active');
        const allCells = match.panel.querySelectorAll('.forms-cell');
        const hasSplit = !!match.panel.querySelector('.forms-split');
        const targetIdx = (hasSplit && ppk === 'Atmanepada') ? 9 + pci : pci;
        allCells[targetIdx]?.click();
      }
    }
  } catch (_) {
    panel.textContent = 'Could not load forms.';
  }
}

async function loadAndRenderMdv(baseindex, panel) {
  // Data may already be prefetched and cached on the panel
  let data = panel._mdvData;
  if (!data) {
    panel.textContent = '…';
    try {
      const res = await fetch(`${MDV_BASE}/${baseindex}.json`);
      if (!res.ok) { panel.innerHTML = '<span class="no-data">n/a</span>'; return; }
      data = await res.json();
    } catch {
      panel.innerHTML = '<span class="no-data">n/a</span>'; return;
    }
  }
  panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'commentary-panel';
  wrap._rawCommentary = data.vritti;
  setCommentaryHTML(wrap, data.vritti);
  panel.appendChild(wrap);
}

let _vidyutSidePanel = null;
let _vidyutHideTimer = null;

function getVidyutSidePanel() {
  if (!_vidyutSidePanel) {
    _vidyutSidePanel = document.getElementById('vidyut-panel');
    _vidyutSidePanel.addEventListener('mouseenter', () => clearTimeout(_vidyutHideTimer));
    _vidyutSidePanel.addEventListener('mouseleave', () => {
      _vidyutHideTimer = setTimeout(hideVidyutPanel, 300);
    });
  }
  return _vidyutSidePanel;
}

function hideVidyutPanel() {
  const p = document.getElementById('vidyut-panel');
  if (p) p.classList.remove('open');
  document.querySelectorAll('.forms-cell-active').forEach(c => c.classList.remove('forms-cell-active'));
}

async function showVidyutPrakriya(dhatu, lakaraKey, padaKey, cellIndex, td) {
  clearTimeout(_vidyutHideTimer);

  // Toggle off if same cell clicked again
  if (td.classList.contains('forms-cell-active')) {
    hideVidyutPanel();
    return;
  }

  document.querySelectorAll('.forms-cell-active').forEach(c => c.classList.remove('forms-cell-active'));
  td.classList.add('forms-cell-active');

  const panel = getVidyutSidePanel();
  panel.innerHTML = '<div class="vidyut-loading">Computing prakriyā…</div>';
  panel.classList.add('open');

  try {
    const v = await loadVidyut();
    if (!v) { panel.innerHTML = '<div class="vidyut-loading">Vidyut unavailable.</div>'; return; }

    // Use exact Vidyut SLP1 form from TSV (includes accent marks like \ ^ ~)
    // Falling back to transliteration only if baseindex not in TSV
    const aupadeshika = (v.tsvMap && v.tsvMap[dhatu.baseindex])
                        || Sanscript.t(dhatu.aupadeshik || dhatu.dhatu, 'devanagari', 'slp1');
    const gana        = VIDYUT_GANA[String(dhatu.gana)] || 'Bhvadi';
    const lakara      = VIDYUT_LAKARA[lakaraKey];
    const purusha     = VIDYUT_PURUSH[Math.floor(cellIndex / 3)];
    const vacana      = VIDYUT_VACANA[cellIndex % 3];

    // Call the low-level WASM directly with string enum names.
    // The high-level JS wrapper converts strings→ints before sending to WASM,
    // but WASM's serde deserializer expects the string variant names, not ints.
    const results = v.wasm.deriveTinantas({
      dhatu:         { aupadeshika, gana, antargana: null, sanadi: [], prefixes: [] },
      lakara,
      prayoga:       'Kartari',
      purusha,
      vacana,
      skip_at_agama: false,
      pada:          padaKey || null,
    });

    panel.innerHTML = '';
    if (!results || results.length === 0) {
      panel.innerHTML = '<div class="vidyut-loading">No derivation found.</div>';
      return;
    }
    renderVidyutPanel(panel, results);
  } catch (err) {
    console.error('Vidyut error:', err);
    panel.innerHTML = `<div class="vidyut-loading">Error: ${err.message}</div>`;
  }
}

// Strip Vidyut accent markers (\ = anudātta, ^ = udātta) before SLP1→Devanagari conversion
function vslp1(s) { return (s || '').replace(/[\\^]/g, ''); }

function renderVidyutSteps(container, results) {
  const wrap = document.createElement('div');
  wrap.className = 'vidyut-steps-wrap';
  const table = document.createElement('table');
  table.className = 'vidyut-steps-table';

  results[0].history.forEach(step => {
    const tr = document.createElement('tr');
    tr.className = 'vidyut-step';

    const formTd = document.createElement('td');
    formTd.className = 'vidyut-step-form';
    (step.result || []).forEach((term, ti) => {
      if (ti > 0) {
        const sep = document.createElement('span');
        sep.className = 'vidyut-sep';
        sep.textContent = '+';
        formTd.appendChild(sep);
      }
      const devText = Sanscript.t(vslp1(term.text), 'slp1', 'devanagari');
      const sp = document.createElement('span');
      sp.className = 'vidyut-term dev-text' + (term.wasChanged ? ' vidyut-changed' : '');
      sp._devText = devText;
      sp.textContent = translit(devText);
      formTd.appendChild(sp);
    });
    tr.appendChild(formTd);

    const sutraTd = document.createElement('td');
    sutraTd.className = 'vidyut-step-sutra';
    const rule = step.rule || {};
    if (rule.code) {
      const parts = rule.code.split('.');
      if (parts.length === 3 && rule.source === 'ashtadhyayi') {
        const sid = parts[0] + parts[1] + parts[2].padStart(3, '0');
        const sutra = sutraIndex[sid];
        if (sutra) {
          const txt = document.createElement('span');
          txt.className = 'vidyut-sutra-text dev-text';
          txt._devText = sutra.s;
          txt.textContent = translit(sutra.s);
          sutraTd.appendChild(txt);
        }
        const ref = document.createElement('a');
        ref.className = 'vidyut-sutra-ref sutra-link';
        ref.href = `?sutra=${rule.code}`;
        ref.dataset.id = sid;
        ref.textContent = rule.code;
        ref.addEventListener('click', e => { e.preventDefault(); gotoSutra(sid); });
        sutraTd.appendChild(ref);
      } else {
        const vt = document.createElement('span');
        vt.className = 'vidyut-vartika';
        vt.textContent = `${rule.source || ''} ${rule.code}`.trim();
        sutraTd.appendChild(vt);
      }
    }
    tr.appendChild(sutraTd);
    table.appendChild(tr);
  });

  wrap.appendChild(table);
  container.appendChild(wrap);

  const credit = document.createElement('div');
  credit.className = 'vidyut-credit';
  credit.innerHTML = 'Prakriyā: <a href="https://github.com/ambuda-org/vidyut" target="_blank" rel="noopener">Vidyut</a> (MIT)';
  container.appendChild(credit);
}

async function showFormDerivInline(dhatu, lakaraKey, padaKey, cellIndex, td, derivArea, cellTds) {
  // Toggle off if same cell clicked again
  if (td.classList.contains('forms-cell-active')) {
    document.querySelectorAll('.forms-cell-active').forEach(c => c.classList.remove('forms-cell-active'));
    derivArea.innerHTML = '';
    return;
  }

  document.querySelectorAll('.forms-cell-active').forEach(c => c.classList.remove('forms-cell-active'));
  td.classList.add('forms-cell-active');

  derivArea.innerHTML = '';

  // ── Find same-gana neighboring dhatus and their form at the same position ──
  const pKey = `p${lakaraKey}`;
  const aKey = `a${lakaraKey}`;
  const formsKey = padaKey === 'Atmanepada' ? aKey : padaKey === 'Parasmaipada' ? pKey : null;

  let relatedEntries = [];
  const currentListIdx = dhatuReaderList.findIndex(d => d.baseindex === dhatu.baseindex);
  if (currentListIdx >= 0) {
    // Collect up to 4 same-gana neighbors (alternating ±1, ±2, ±3…)
    const candidates = [];
    for (const offset of [-1, 1, -2, 2, -3, 3, -4, 4]) {
      const i = currentListIdx + offset;
      if (i >= 0 && i < dhatuReaderList.length &&
          String(dhatuReaderList[i].gana) === String(dhatu.gana)) {
        candidates.push({ dhatu: dhatuReaderList[i], listIdx: i });
        if (candidates.length >= 4) break;
      }
    }
    // Fetch their forms in parallel (±2 are likely already prefetched/cached)
    const fetched = await Promise.all(
      candidates.map(c => loadDhatuForms(c.dhatu.baseindex).catch(() => null))
    );
    candidates.forEach((c, i) => {
      if (!fetched[i]) return;
      const fStr = formsKey
        ? (fetched[i][formsKey] || fetched[i][formsKey === pKey ? aKey : pKey])
        : (fetched[i][pKey] || fetched[i][aKey]);
      if (!fStr) return;
      const form = String(fStr).split(';')[cellIndex]?.trim() || '—';
      if (form && form !== '—') relatedEntries.push({ form, dhatu: c.dhatu, listIdx: c.listIdx });
    });
    relatedEntries = relatedEntries.slice(0, 3);
  }

  // ── Build pill bar ──────────────────────────────────────────────────────────
  const pillBar = document.createElement('div');
  pillBar.className = 'dhatu-deriv-pillbar';

  // 1. Active pill — current dhatu, selected position
  const activePill = document.createElement('button');
  activePill.className = 'dhatu-deriv-pill dev-text active';
  activePill._devText = td._devText;
  activePill.textContent = translit(td._devText);
  pillBar.appendChild(activePill);

  // 2. Related dhatu pills — same position, different dhatu → navigate to it
  relatedEntries.forEach(({ form, dhatu: relDhatu, listIdx }) => {
    const p = document.createElement('button');
    p.className = 'dhatu-deriv-pill dhatu-deriv-pill--related dev-text';
    p._devText = form;
    p.textContent = translit(form);
    p.title = translit(relDhatu.dhatu || '');
    p.addEventListener('click', () => {
      _pendingFormClick = { lakaraKey, padaKey, cellIndex };
      showDhatuReader(relDhatu, listIdx);
    });
    pillBar.appendChild(p);
  });

  // 3. Copy + close at far right
  const actions = document.createElement('div');
  actions.className = 'dhatu-deriv-actions';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'dhatu-deriv-action';
  copyBtn.title = 'Copy prakriyā as text';
  copyBtn.textContent = '📋';
  copyBtn.disabled = true;
  actions.appendChild(copyBtn);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'dhatu-deriv-action';
  closeBtn.title = 'Close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => {
    document.querySelectorAll('.forms-cell-active').forEach(c => c.classList.remove('forms-cell-active'));
    derivArea.innerHTML = '';
  });
  actions.appendChild(closeBtn);
  pillBar.appendChild(actions);

  derivArea.appendChild(pillBar);

  // ── Derivation content ──────────────────────────────────────────────────────
  const content = document.createElement('div');
  content.innerHTML = '<div class="vidyut-loading">Computing prakriyā…</div>';
  derivArea.appendChild(content);

  try {
    const v = await loadVidyut();
    if (!v) { content.innerHTML = '<div class="vidyut-loading">Vidyut unavailable.</div>'; return; }

    const aupadeshika = (v.tsvMap && v.tsvMap[dhatu.baseindex])
                        || Sanscript.t(dhatu.aupadeshik || dhatu.dhatu, 'devanagari', 'slp1');
    const gana    = VIDYUT_GANA[String(dhatu.gana)] || 'Bhvadi';
    const lakara  = VIDYUT_LAKARA[lakaraKey];
    const purusha = VIDYUT_PURUSH[Math.floor(cellIndex / 3)];
    const vacana  = VIDYUT_VACANA[cellIndex % 3];

    const results = v.wasm.deriveTinantas({
      dhatu:         { aupadeshika, gana, antargana: null, sanadi: [], prefixes: [] },
      lakara,
      prayoga:       'Kartari',
      purusha,
      vacana,
      skip_at_agama: false,
      pada:          padaKey || null,
    });

    content.innerHTML = '';
    if (!results || results.length === 0) {
      content.innerHTML = '<div class="vidyut-loading">No derivation found.</div>';
      return;
    }

    copyBtn.disabled = false;
    copyBtn.addEventListener('click', () => {
      const devFormsFinal = results.map(r => Sanscript.t(vslp1(r.text), 'slp1', 'devanagari')).join(' / ');
      const lines = [`${devFormsFinal} — tiṅanta prakriyā | paniniyam.com`, ''];
      results[0].history.forEach(step => {
        const formParts = (step.result || []).map(t => Sanscript.t(vslp1(t.text), 'slp1', 'devanagari'));
        const rule = step.rule || {};
        let sutraStr = '';
        if (rule.code && rule.source === 'ashtadhyayi') {
          const parts = rule.code.split('.');
          if (parts.length === 3) {
            const sid = parts[0] + parts[1] + parts[2].padStart(3, '0');
            const sutra = sutraIndex[sid];
            sutraStr = sutra ? `${rule.code}  ${sutra.s}` : rule.code;
          }
        } else if (rule.code) {
          sutraStr = `${rule.source || ''} ${rule.code}`.trim();
        }
        lines.push(sutraStr ? `${formParts.join(' + ')}\t→  ${sutraStr}` : formParts.join(' + '));
      });
      navigator.clipboard.writeText(lines.join('\n')).then(() => {
        copyBtn.textContent = '✓';
        setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
      }).catch(() => {
        copyBtn.textContent = '✗';
        setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
      });
    });

    renderVidyutSteps(content, results);
  } catch (err) {
    console.error('Vidyut error:', err);
    content.innerHTML = `<div class="vidyut-loading">Error: ${err.message}</div>`;
  }
}

function renderVidyutPanel(panel, results) {
  // Header: final form(s)
  const header = document.createElement('div');
  header.className = 'vidyut-header';
  const devForms = results.map(r => Sanscript.t(vslp1(r.text), 'slp1', 'devanagari'));
  const formSpan = document.createElement('span');
  formSpan.className = 'vidyut-final-form dev-text';
  formSpan._devText = devForms.join(' / ');
  formSpan.textContent = translit(devForms.join(' / '));
  header.appendChild(formSpan);
  if (results.length > 1) {
    const note = document.createElement('span');
    note.className = 'vidyut-alt-note';
    note.textContent = `${results.length} alternatives`;
    header.appendChild(note);
  }
  const copyBtn = document.createElement('button');
  copyBtn.className = 'vidyut-copy';
  copyBtn.title = 'Copy prakriyā as text';
  copyBtn.textContent = '📋';
  copyBtn.addEventListener('click', () => {
    const devFormsFinal = results.map(r => Sanscript.t(vslp1(r.text), 'slp1', 'devanagari')).join(' / ');
    const lines = [`${devFormsFinal} — tiṅanta prakriyā | paniniyam.com`, ''];
    results[0].history.forEach(step => {
      const formParts = (step.result || []).map(t => Sanscript.t(vslp1(t.text), 'slp1', 'devanagari'));
      const formStr = formParts.join(' + ');
      const rule = step.rule || {};
      let sutraStr = '';
      if (rule.code && rule.source === 'ashtadhyayi') {
        const parts = rule.code.split('.');
        if (parts.length === 3) {
          const sid = parts[0] + parts[1] + parts[2].padStart(3, '0');
          const sutra = sutraIndex[sid];
          sutraStr = sutra ? `${rule.code}  ${sutra.s}` : rule.code;
        }
      } else if (rule.code) {
        sutraStr = `${rule.source || ''} ${rule.code}`.trim();
      }
      lines.push(sutraStr ? `${formStr}\t→  ${sutraStr}` : formStr);
    });
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      copyBtn.textContent = '✓';
      setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
    }).catch(() => {
      copyBtn.textContent = '✗';
      setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
    });
  });
  header.appendChild(copyBtn);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'vidyut-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', hideVidyutPanel);
  header.appendChild(closeBtn);
  panel.appendChild(header);
  renderVidyutSteps(panel, results);
}

function renderFormsTable(formsStr, padaLabel, dhatu, lakaraKey, derivArea) {
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
  const cellTds = [];
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
      cellTds.push(td);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  // Wire click handlers after all cells are collected so cellTds is complete
  if (dhatu && lakaraKey && VIDYUT_BASE && derivArea) {
    const padaKey = VIDYUT_PADA[padaLabel] || null;
    cellTds.forEach((ctd, cellIndex) => {
      ctd.title = 'Click for prakriyā';
      ctd.addEventListener('click', e => {
        e.stopPropagation();
        showFormDerivInline(dhatu, lakaraKey, padaKey, cellIndex, ctd, derivArea, cellTds);
      });
    });
  }
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
        (dict[id] = dict[id] || []).push(entry.vartika);
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

  // पदच्छेदः — prefer pv from pravachanam.json (१/१ superscript), fall back to pc
  addRow('पदच्छेदः', val => {
    const pvStr = bookData['pravachanam']?.[sutra.i]?.pv;
    if (pvStr) {
      pvStr.split('##').forEach((tok, idx) => {
        if (idx > 0) val.appendChild(document.createTextNode(' '));
        const parts = tok.split('$');
        const word = parts[0];
        const wordEl = document.createElement('span');
        wordEl.className = 'pc-word dev-text';
        wordEl._devText = word;
        wordEl.textContent = translit(word);
        val.appendChild(wordEl);
        if (parts.length >= 3) {
          const vib = parseInt(parts[1]);
          const vac = parseInt(parts[2]);
          const label = parts[3] || '';
          const DEV = '०१२३४५६७८९';
          const gram = vib === 0 ? (label || 'अव्य०')
                     : vac       ? `${DEV[vib]}/${DEV[vac]}`
                     :             DEV[vib];
          const sup = document.createElement('sup');
          sup.className = 'pv-sup';
          sup.textContent = gram;
          val.appendChild(sup);
        }
      });
    } else if (sutra.pc) {
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

  // अनुवृत्तिः — prefer prose form from pravachanam.json, fall back to linked list
  addRow('अनुवृत्तिः', val => {
    const anProse = bookData['pravachanam']?.[sutra.i]?.an;
    if (anProse) {
      val.appendChild(devEl('span', 'dev-text', anProse));
      return;
    }
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
      } else if (page.type === 'rupavatarah-panel') {
        clickFn = () => { closeDrawer(); openRvMatrix(); };
      } else if (page.type === 'nirukta-panel') {
        clickFn = () => { closeDrawer(); showNiruktaPanel(); };
      } else if (page.type === 'yogadarshana-panel') {
        clickFn = () => { closeDrawer(); showYogaDarshanaPanel(); };
      } else if (page.type === 'shabdarupavali-panel') {
        clickFn = () => { closeDrawer(); showShabdarupavali(); };
      } else if (page.type === 'shabda-browser') {
        clickFn = () => { closeDrawer(); showShabdaBrowser(); };
      } else if (page.type === 'namarupa-page') {
        clickFn = () => { closeDrawer(); showNamarupa(); };
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
      case 'vartika':         renderVartikaList(await loadData('vartika-page', 'sutraani/vartika.txt')); break;
      case 'unaadi': {
        let unaadiSanHin = null, unaadiSatyavrata = null;
        if (PRIVATE_BASE) {
          const [r1, r2] = await Promise.allSettled([
            fetch(`${PRIVATE_BASE}/unaadi_san_hin.json`),
            fetch(`${PRIVATE_BASE}/unaadi_satyavrata.json`),
          ]);
          if (r1.status === 'fulfilled' && r1.value.ok) unaadiSanHin      = await r1.value.json();
          if (r2.status === 'fulfilled' && r2.value.ok) unaadiSatyavrata  = await r2.value.json();
        }
        renderUnaadiAll(data, unaadiSanHin, unaadiSatyavrata);
        break;
      }
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
  panel.textContent = '…';
  if (tabDef.type === 'pravachanam') {
    await renderPravachanamTab(panel, sutra.i);
    return;
  }
  try {
    const data = await loadData(tabDef.id, tabDef.dataPath);
    const val  = data[sutra.i];
    const devanagariNums = ['', '१', '२', '३', '४', '५', '६', '७', '८', '९', '१०'];
    const raw  = Array.isArray(val)
      ? (val.length === 1 ? val[0] : val.map((v, i) => (devanagariNums[i + 1] || (i + 1) + '.') + ' ' + v).join('\n\n'))
      : (val || '').trim();
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
  panel.textContent = '';
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

let _arthaDataPromise = null;
async function loadArthaData() {
  if (bookData['pravachanam']) return bookData['pravachanam'];
  if (!PRIVATE_BASE) return null;
  if (!_arthaDataPromise) {
    _arthaDataPromise = fetch(`${PRIVATE_BASE}/pravachanam.json`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { bookData['pravachanam'] = d; return d; })
      .catch(() => null);
  }
  return _arthaDataPromise;
}

async function loadPvNotes() {
  if (pvNotesData !== null) return pvNotesData;
  if (!PRIVATE_BASE) { pvNotesData = {}; return pvNotesData; }
  try {
    const r = await fetch(`${PRIVATE_BASE}/paniniyam-author-notes.json`);
    pvNotesData = r.ok ? await r.json() : {};
  } catch (_) { pvNotesData = {}; }
  return pvNotesData;
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

  // Header: ref + sutra text + visual icon placeholder
  const head = document.createElement('div');
  head.className = 'artha-popup-head';
  const refSpan = document.createElement('span');
  refSpan.className = 'artha-popup-ref';
  refSpan.textContent = idToRef(sutraId);
  const sutText = document.createElement('span');
  sutText.className = 'artha-popup-sutra dev-text';
  sutText._devText = sutra.s;
  sutText.textContent = translit(sutra.s);
  const vizBtn = document.createElement('button');
  vizBtn.className = 'artha-viz-btn';
  vizBtn.title = 'Visual diagram';
  vizBtn.hidden = true;
  vizBtn.textContent = '●';
  head.appendChild(refSpan);
  head.appendChild(sutText);
  head.appendChild(vizBtn);
  popup.appendChild(head);

  // Body: artha rows (may load async)
  const body = document.createElement('div');
  body.className = 'artha-popup-body';
  popup.appendChild(body);

  // Position immediately so popup appears without delay
  positionArthaPopup(el);
  popup.classList.add('visible');

  // Fill content + check for sutra visual in parallel
  const [arthaData, hasVisual] = await Promise.all([loadArthaData(), checkSutraVisual(sutraId)]);
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

  // Reveal visual icon if SVG exists for this sutra
  if (hasVisual) {
    vizBtn.hidden = false;
    vizBtn.addEventListener('mouseenter', () => showSutraVisualPopup(vizBtn, sutraId));
    vizBtn.addEventListener('mouseleave', hideConceptPopup);
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
  telugu: 0.75, kannada: 0.75, malayalam: 0.75, tamil: 0.75,
  itrans: 0.42, itrans_lowercase: 0.42, itrans_dravidian: 0.42,
  hk: 0.48, hk_dravidian: 0.48,
  slp1: 0.50, slp1_accented: 0.50,
  velthuis: 0.48, wx: 0.52, optitrans: 0.44, optitrans_dravidian: 0.44,
  kolkata_v2: 0.48, baraha: 0.48, titus: 0.48,
};
// Roman schemes that stay Devanagari in SVGs — fonts don't include their diacritics/encodings
const SVG_ROMAN_SKIP = new Set(['iast', 'iast_dravidian']);

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

// ── Sutra visual popup (SVG diagram in concept-popup, triggered from artha-viz-btn) ──
function _sutraVisualUrl(sutra) {
  if (!DIAGRAM_BASE) return null;
  const nnn = String(sutra.n).padStart(3, '0');
  return `${DIAGRAM_BASE}/${sutra.a}/${sutra.a}.${sutra.p}.${nnn}.svg`;
}

async function checkSutraVisual(sutraId) {
  if (!DIAGRAM_BASE) return false;
  if (sutraId in sutraVisualExists) return sutraVisualExists[sutraId];
  const sutra = sutraIndex[sutraId];
  if (!sutra) return false;
  try {
    const r = await fetch(_sutraVisualUrl(sutra), { method: 'HEAD' });
    sutraVisualExists[sutraId] = r.ok;
    return r.ok;
  } catch (_) { sutraVisualExists[sutraId] = false; return false; }
}

async function showSutraVisualPopup(el, sutraId) {
  clearTimeout(conceptHideTimer);
  const sutra = sutraIndex[sutraId];
  if (!sutra) return;

  const popup = getConceptPopup();
  popup.innerHTML = '';

  const lbl = document.createElement('div');
  lbl.className = 'concept-popup-label';
  lbl.textContent = idToRef(sutraId);
  popup.appendChild(lbl);

  const svgWrap = document.createElement('div');
  svgWrap.className = 'concept-popup-svg';
  popup.appendChild(svgWrap);

  positionConceptPopup(el);
  popup.classList.add('visible');

  if (sutraSvgCache[sutraId]) {
    svgWrap.innerHTML = sutraSvgCache[sutraId];
    applyConceptSvgRetranslit(svgWrap);
    return;
  }
  svgWrap.innerHTML = '<span class="concept-popup-loading">…</span>';
  try {
    const r = await fetch(_sutraVisualUrl(sutra));
    if (!r.ok) { svgWrap.textContent = '—'; return; }
    const svgText = await r.text();
    sutraSvgCache[sutraId] = svgText;
    if (popup.classList.contains('visible')) {
      svgWrap.innerHTML = svgText;
      applyConceptSvgRetranslit(svgWrap);
    }
  } catch (_) { svgWrap.textContent = '—'; }
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

      // ── प्रथमावृत्ति tab (Acharya Chandradutt Sharma's lecture notes) ──
      const { btn: pvBtn, panel: pvPanel } = makeTab('pv', 'आ० चन्द्रदत्त-शर्मा');
      pvBtn.classList.add('dev-text');
      pvBtn._devText = 'आ० चन्द्रदत्त-शर्मा';
      pvBtn.style.display = 'none';   // hidden until pvNotesData confirms entry
      let mediaTabUserChosen = false;
      (async () => {
        await loadPvNotes();
        if (pvNotesData[sutra.i]) {
          pvBtn.style.display = '';
          const notesDiv = document.createElement('div');
          notesDiv.className = 'pv-notes commentary-panel';
          pvPanel.appendChild(notesDiv);
          setCommentaryHTML(notesDiv, pvNotesData[sutra.i]);
          // Switch to PV tab if user hasn't manually chosen a tab this session
          if (!mediaTabUserChosen) activateMediaTab('pv');
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

      diagBtn.addEventListener('click',      () => { mediaTabUserChosen = true; activateMediaTab('diagram'); });
      ytBtn.addEventListener('click',        () => { mediaTabUserChosen = true; activateMediaTab('youtube'); });
      pvBtn.addEventListener('click',        () => { mediaTabUserChosen = true; activateMediaTab('pv'); });
      authorTabBtn.addEventListener('click', () => { mediaTabUserChosen = true; activateMediaTab('author'); });
      yourTabBtn.addEventListener('click',   () => { mediaTabUserChosen = true; activateMediaTab('your'); });

      // Restore last-used tab; default to Author's Notes
      activateMediaTab(activeTabByGroup['media'] || 'author');

      tabBar.appendChild(pvBtn);
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

      panelWrap.appendChild(pvPanel);
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
      if (!activePanel._loaded) loadTabData(activeDef, activePanel, sutra);
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
  loadArthaData();   // prefetch pravachanam.json in background
  loadPvNotes();     // prefetch paniniyam-author-notes.json in background

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
    { id: 'sarva', dev: 'सार्वधातुक', rows: data.sarva },
    { id: 'ardha', dev: 'आर्धधातुक',  rows: data.ardha },
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

  // Pill bar for lakara selection
  const pillBar = document.createElement('div');
  pillBar.className = 'pratyaya-lak-pills';

  const contentArea = document.createElement('div');
  contentArea.className = 'pratyaya-lak-content';

  const panels = [];

  lakaras.forEach((lak, i) => {
    // Pill button
    const pill = document.createElement('button');
    pill.className = 'pratyaya-lak-pill dev-text' + (i === 0 ? ' active' : '');
    pill._devText = lak.dev;
    pill.textContent = translit(lak.dev);
    pillBar.appendChild(pill);

    // Content panel for this lakara
    const panel = document.createElement('div');
    panel.className = 'pratyaya-lak-panel' + (i === 0 ? ' active' : '');

    const split = document.createElement('div');
    split.className = 'forms-split';
    split.appendChild(renderPratyayaTable(lak.para, 'परस्मैपद'));
    const divider = document.createElement('div');
    divider.className = 'forms-divider';
    split.appendChild(divider);
    split.appendChild(renderPratyayaTable(lak.atma, 'आत्मनेपद'));
    panel.appendChild(split);
    contentArea.appendChild(panel);
    panels.push({ pill, panel });

    pill.addEventListener('click', () => {
      panels.forEach(p => { p.pill.classList.remove('active'); p.panel.classList.remove('active'); });
      pill.classList.add('active');
      panel.classList.add('active');
    });
  });

  container.appendChild(pillBar);
  container.appendChild(contentArea);
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
  if (e.key === 'Escape') { closePadaMatrix(); closeGanaMatrix(); closeNrMatrix(); }
});

document.addEventListener('click', e => {
  if (_padaMatrixJustOpened || _ganaMatrixJustOpened || _bkMatrixJustOpened || _nrMatrixJustOpened || _rvMatrixJustOpened) return;
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
  if ($nrMatrix?.classList.contains('open') &&
      !$nrMatrix.contains(e.target)) {
    closeNrMatrix();
  }
  if ($rvMatrix?.classList.contains('open') &&
      !$rvMatrix.contains(e.target)) {
    closeRvMatrix();
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

  const lines = markdown.split('\n');
  let i = 0;
  let proseLines = [];
  let pendingQuestion = null;

  function flushProse() {
    const text = proseLines.join(' ').replace(/\s+/g, ' ').trim();
    proseLines = [];
    if (!text) return;
    const p = document.createElement('div');
    p.className = 'vns-prose mixed-text';
    p._mixedText = text;
    p.innerHTML = vnsRenderInline(text);
    wrap.appendChild(p);
  }

  while (i < lines.length) {
    const line = lines[i];

    if (/^\!\[.+\]$/.test(line.trim())) {
      flushProse();
      const src = line.trim().slice(2, -1);
      const img = document.createElement('img');
      img.src = `${PRIVATE_BASE || FORMS_BASE}/${src}`;
      img.className = 'vns-section-img';
      wrap.appendChild(img);
      i++;

    } else if (line.startsWith('## ')) {
      flushProse();
      let heading = line.replace(/^##\s*/, '').trim();
      // Strip embedded image markers (![img/...]) from heading line
      let embeddedImgSrc = null;
      heading = heading.replace(/!\[img\/([^\]]+)\]/g, (_, src) => { embeddedImgSrc = `img/${src}`; return ''; }).trim();
      // Extract leading number (Devanagari or Arabic) followed by - or space
      const numMatch = heading.match(/^([०-९\d]+)[-\s]/);
      const idText  = numMatch ? numMatch[1] : '';
      const sutraText = numMatch ? heading.slice(numMatch[0].length).trim() : heading;

      // Collect commentary until next ## or image marker or ** line
      const commentLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('## ') && !lines[i].startsWith('**') && !/^\!\[.+\]$/.test(lines[i].trim())) {
        commentLines.push(lines[i]);
        i++;
      }
      const commentary = commentLines.join(' ').replace(/\s+/g, ' ').trim();

      // If this is an answer line (उत्तर) and we have a pending question, build Q&A card
      if (sutraText.includes('(उत्तर)') && pendingQuestion !== null) {
        const uttarM = sutraText.match(/\(उत्तर\)[^\s]*[-\s]*(.*)/);
        let ansText = uttarM ? uttarM[1].trim() : sutraText;
        if (commentary) ansText += ' ' + commentary;

        const card = document.createElement('div');
        card.className = 'sutra-card vns-qa-card';
        const row = document.createElement('div');
        row.className = 'sutra-row';
        const idEl2 = document.createElement('span');
        idEl2.className = 'sutra-id';
        idEl2.textContent = idText;
        const qText2 = '( प्रश्न )- ' + pendingQuestion;
        const qEl2 = document.createElement('span');
        qEl2.className = 'sutra-text mixed-text';
        qEl2._mixedText = qText2;
        qEl2.innerHTML = vnsRenderInline(qText2);
        row.appendChild(idEl2);
        row.appendChild(qEl2);
        card.appendChild(row);
        if (ansText) {
          const detail2 = document.createElement('div');
          detail2.className = 'sutra-detail';
          const ansEl2 = document.createElement('div');
          ansEl2.className = 'detail-english mixed-text';
          ansEl2._mixedText = ansText;
          ansEl2.innerHTML = vnsRenderInline(ansText);
          detail2.appendChild(ansEl2);
          card.appendChild(detail2);
        }
        card.addEventListener('click', () => toggleSimpleCard(card));
        wrap.appendChild(card);
        pendingQuestion = null;
        if (embeddedImgSrc) {
          const img2 = document.createElement('img');
          img2.src = `${PRIVATE_BASE || FORMS_BASE}/${embeddedImgSrc}`;
          img2.className = 'vns-section-img';
          wrap.appendChild(img2);
        }
        continue;
      }

      // sutra-card (same pattern as Linganushasanam / Unaadi)
      const card = document.createElement('div');
      card.className = 'sutra-card';

      const row = document.createElement('div');
      row.className = 'sutra-row';
      const idEl = document.createElement('span');
      idEl.className = 'sutra-id';
      idEl.textContent = idText;
      const textEl = document.createElement('span');
      textEl.className = 'sutra-text dev-text';
      textEl._devText = sutraText;
      textEl.textContent = translit(sutraText);
      row.appendChild(idEl);
      row.appendChild(textEl);

      const detail = document.createElement('div');
      detail.className = 'sutra-detail';
      const fullEl = document.createElement('div');
      fullEl.className = 'detail-sutra-full dev-text';
      fullEl._devText = sutraText;
      fullEl.textContent = translit(sutraText);
      detail.appendChild(fullEl);

      if (commentary) {
        const sec = document.createElement('div');
        sec.className = 'detail-section';
        const commentDiv = document.createElement('div');
        commentDiv.className = 'detail-english mixed-text';
        commentDiv._mixedText = commentary;
        commentDiv.innerHTML = vnsRenderInline(commentary);
        sec.appendChild(commentDiv);
        detail.appendChild(sec);
      }

      card.appendChild(row);
      card.appendChild(detail);
      card.addEventListener('click', () => toggleSimpleCard(card));
      wrap.appendChild(card);
      if (embeddedImgSrc) {
        const imgE = document.createElement('img');
        imgE.src = `${PRIVATE_BASE || FORMS_BASE}/${embeddedImgSrc}`;
        imgE.className = 'vns-section-img';
        wrap.appendChild(imgE);
      }

    } else if (line.trim() === '') {
      i++;

    } else if (line.startsWith('**')) {
      flushProse();
      const isQ = /^\*\*[^*]*प्रश/.test(line);
      const isA = /^\*\*\s*[०-९\d]/.test(line);  // numbered उत्तर line

      if (isQ) {
        // Store question text; card is built when we see the matching उत्तर line
        const m = line.match(/^\*\*[^*]*\*\*[-\s]*(.*)/);
        pendingQuestion = m ? m[1].trim() : '';
        i++;

      } else if (isA) {
        // Build collapsed sutra-card: number + question as header, answer as detail
        const labelM = line.match(/^\*\*\s*([०-९\d]+)[^*]*\*\*[-\s]*(.*)/);
        const num = labelM ? labelM[1] : '';
        let answerText = labelM ? labelM[2].trim() : '';
        i++;
        while (i < lines.length && !lines[i].startsWith('**') &&
               !lines[i].startsWith('## ') && !/^\!\[.+\]$/.test(lines[i].trim())) {
          if (lines[i].trim()) answerText += ' ' + lines[i].trim();
          i++;
        }

        const card = document.createElement('div');
        card.className = 'sutra-card vns-qa-card';

        const row = document.createElement('div');
        row.className = 'sutra-row';

        const idEl = document.createElement('span');
        idEl.className = 'sutra-id';
        idEl.textContent = num;

        const qText = '( प्रश्न )- ' + (pendingQuestion || '');
        const qEl = document.createElement('span');
        qEl.className = 'sutra-text mixed-text';
        qEl._mixedText = qText;
        qEl.innerHTML = vnsRenderInline(qText);

        row.appendChild(idEl);
        row.appendChild(qEl);
        card.appendChild(row);

        if (answerText) {
          const detail = document.createElement('div');
          detail.className = 'sutra-detail';
          const ansEl = document.createElement('div');
          ansEl.className = 'detail-english mixed-text';
          ansEl._mixedText = answerText;
          ansEl.innerHTML = vnsRenderInline(answerText);
          detail.appendChild(ansEl);
          card.appendChild(detail);
        }

        card.addEventListener('click', () => toggleSimpleCard(card));
        wrap.appendChild(card);
        pendingQuestion = null;

      } else {
        // Other ** line → prose
        const m = line.match(/^\*\*[^*]*\*\*[-\s]*(.*)/);
        proseLines.push(m ? m[1] : line);
        i++;
      }

    } else {
      // Detect plain (non-bold) question line: (प्रश्न)- or (प्रश्‍न)-
      if (/\(प्रश[\u094D\u200D]?न\)/.test(line)) {
        flushProse();
        const m = line.match(/\(प्रश[\u094D\u200D]?न\)[^\s]*[-\s]*(.*)/);
        pendingQuestion = m ? m[1].trim() : line.trim();
      } else {
        proseLines.push(line);
      }
      i++;
    }
  }
  flushProse();

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

// ── Namarupa (Vidyut-powered noun declension) ─────────────────────────────────

// Known word → valid linga(s), sourced from Shabda-Rūpāvalī (Yudhiṣṭhira Mīmāṃsaka).
// First entry is the default. Words not in this list fall back to stem-ending heuristics.
const NAMARUPA_WORDLIST = {
  // a-kārānta पुंलिङ्ग (देव paradigm)
  'देव':['Pum'], 'राम':['Pum'], 'शिव':['Pum'], 'ईश्वर':['Pum'],
  'वत्स':['Pum'], 'बालक':['Pum'], 'पाठक':['Pum'], 'लेखक':['Pum'],
  'न्याय':['Pum'], 'पुरुष':['Pum'], 'ग्रन्थ':['Pum'],
  'कृष्ण':['Pum'], 'अर्जुन':['Pum'], 'पुत्र':['Pum'], 'मानव':['Pum'],
  // a-kārānta नपुंसकलिङ्ग (धन paradigm)
  'धन':['Napumsaka'], 'वन':['Napumsaka'], 'जल':['Napumsaka'],
  'गृह':['Napumsaka'], 'वस्त्र':['Napumsaka'], 'शस्त्र':['Napumsaka'],
  'अस्त्र':['Napumsaka'], 'पुष्प':['Napumsaka'], 'फल':['Napumsaka'],
  'मित्र':['Napumsaka'], 'क्षेत्र':['Napumsaka'], 'सत्र':['Napumsaka'],
  // ā-kārānta स्त्रीलिङ्ग (विद्या paradigm)
  'विद्या':['Stri'], 'सीता':['Stri'], 'लता':['Stri'], 'रमा':['Stri'],
  'गङ्गा':['Stri'], 'बालिका':['Stri'], 'प्रजा':['Stri'],
  'छाया':['Stri'], 'कृपा':['Stri'], 'माला':['Stri'], 'सुधा':['Stri'],
  'राधा':['Stri'], 'दुर्गा':['Stri'], 'सरस्वती':['Stri'],
  // ī-kārānta स्त्रीलिङ्ग (नदी / लक्ष्मी paradigm)
  'नदी':['Stri'], 'देवी':['Stri'], 'लक्ष्मी':['Stri'], 'पृथ्वी':['Stri'],
  // i-kārānta पुंलिङ्ग (अग्नि paradigm)
  'अग्नि':['Pum'], 'कवि':['Pum'], 'हरि':['Pum'], 'पति':['Pum'],
  'सखि':['Pum'], 'मुनि':['Pum'], 'ऋषि':['Pum'], 'विधि':['Pum'],
  // i-kārānta स्त्रीलिङ्ग (मति paradigm)
  'मति':['Stri'], 'शक्ति':['Stri'], 'रुचि':['Stri'], 'गति':['Stri'],
  'बुद्धि':['Stri'], 'सिद्धि':['Stri'], 'भक्ति':['Stri'], 'स्थिति':['Stri'],
  // i-kārānta नपुंसकलिङ्ग (वारि paradigm)
  'वारि':['Napumsaka'],
  // u-kārānta पुंलिङ्ग (वायु paradigm)
  'वायु':['Pum'], 'भानु':['Pum'], 'विष्णु':['Pum'], 'गुरु':['Pum'],
  'बन्धु':['Pum'], 'शत्रु':['Pum'], 'तनु':['Pum'],
  // u-kārānta स्त्रीलिङ्ग (धेनु paradigm)
  'धेनु':['Stri'], 'रेणु':['Stri'],
  // u-kārānta नपुंसकलिङ्ग (मधु paradigm)
  'मधु':['Napumsaka'],
  // ū-kārānta स्त्रीलिङ्ग (वधू / चमू paradigm)
  'वधू':['Stri'], 'चमू':['Stri'], 'भू':['Stri'],
  // ṛ-kārānta
  'पितृ':['Pum'], 'भ्रातृ':['Pum'], 'कर्तृ':['Pum'],
  'मातृ':['Stri'], 'स्वसृ':['Stri'],
};

const NAMARUPA_VIBHAKTI = [
  { key: 'Prathama',   dev: 'प्रथमा'   },
  { key: 'Sambodhana', dev: 'सम्बोधन',  prefix: 'हे ' },
  { key: 'Dvitiya',    dev: 'द्वितीया'  },
  { key: 'Trtiya',     dev: 'तृतीया'   },
  { key: 'Caturthi',   dev: 'चतुर्थी'   },
  { key: 'Panchami',   dev: 'पञ्चमी'   },
  { key: 'Sasthi',     dev: 'षष्ठी'    },
  { key: 'Saptami',    dev: 'सप्तमी'   },
];

const NAMARUPA_VACANA = [
  { key: 'Eka',  dev: 'एकवचन'  },
  { key: 'Dvi',  dev: 'द्विवचन' },
  { key: 'Bahu', dev: 'बहुवचन' },
];

const NAMARUPA_LINGA = [
  { key: 'Pum',       dev: 'पुंलिङ्ग'       },
  { key: 'Stri',      dev: 'स्त्रीलिङ्ग'    },
  { key: 'Napumsaka', dev: 'नपुंसकलिङ्ग'    },
];

function showNamarupa() {
  showPanel('namarupa');
  updateBookURL('namarupa');
  const panel = $panelNamarupa;
  panel.innerHTML = '';

  // ── Disclaimer ──────────────────────────────────────────────────────────
  const disclaimer = document.createElement('div');
  disclaimer.className = 'shabda-disclaimer';
  disclaimer.textContent = 'Vidyut Prakriyā engine. Enter the base form (प्रातिपदिक) in Devanagari.';
  panel.appendChild(disclaimer);

  // ── Input ───────────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'shabda-search-wrap';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'shabda-search';
  input.placeholder = 'प्रातिपदिकम्… देव, राम, हरि, गुरु, नदी';
  input.autocomplete = 'off';
  input.spellcheck = false;
  wrap.appendChild(input);
  panel.appendChild(wrap);

  // ── Linga selector ───────────────────────────────────────────────────────
  let activeLinga = 'Pum';

  // Auto-detect default linga and which lingas to dim, from SLP1 stem ending.
  // Dimmed pills are still clickable (override), just visually de-emphasised.
  function detectLinga(slp1Stem) {
    if (!slp1Stem) return null;
    const last = slp1Stem.slice(-1);
    if (last === 'A' || last === 'I' || last === 'U') return 'Stri';
    return 'Pum';
  }

  function getDimmedLingas(slp1Stem) {
    if (!slp1Stem) return [];
    const last = slp1Stem.slice(-1);
    if (last === 'A' || last === 'I' || last === 'U') return ['Pum', 'Napumsaka'];
    if (last === 'a') return ['Stri'];
    if (last === 'i') return ['Napumsaka'];
    return [];
  }

  function setActiveLinga(key) {
    activeLinga = key;
    lingaRow.querySelectorAll('.shabda-pill').forEach(b => b.classList.toggle('active', b._lingaKey === key));
  }

  function applyDimming(slp1Stem) {
    const dimmed = getDimmedLingas(slp1Stem);
    lingaRow.querySelectorAll('.shabda-pill').forEach(b => b.classList.toggle('dimmed', dimmed.includes(b._lingaKey)));
  }

  const lingaRow = document.createElement('div');
  lingaRow.className = 'shabda-pills';
  NAMARUPA_LINGA.forEach(l => {
    const btn = document.createElement('button');
    btn.className = 'shabda-pill dev-text' + (l.key === activeLinga ? ' active' : '');
    btn._devText = l.dev;
    btn._lingaKey = l.key;
    btn.textContent = translit(l.dev);
    btn.addEventListener('click', () => {
      setActiveLinga(l.key);
      render();
    });
    lingaRow.appendChild(btn);
  });
  panel.appendChild(lingaRow);

  // ── Result area ──────────────────────────────────────────────────────────
  const result = document.createElement('div');
  result.className = 'shabda-table-area';
  panel.appendChild(result);

  async function render() {
    const raw = input.value.trim();
    result.innerHTML = '';
    if (!raw) return;

    // Convert Devanagari input → SLP1 for Vidyut
    const slp1Stem = Sanscript.t(raw, 'devanagari', 'slp1');

    result.innerHTML = '<div class="shabda-loading">…</div>';

    const vidyut = await loadVidyut();
    if (!vidyut) {
      result.innerHTML = '<div class="shabda-empty">Vidyut engine is not available in this environment.</div>';
      return;
    }

    // Derive all 21 forms (7 vibhakti × 3 vacana)
    const grid = {};
    for (const vib of NAMARUPA_VIBHAKTI) {
      for (const vac of NAMARUPA_VACANA) {
        try {
          const r = vidyut.wasm.deriveSubantas({
            pratipadika: { basic: slp1Stem },
            linga: activeLinga,
            vibhakti: vib.key,
            vacana: vac.key,
          });
          grid[`${vib.key}-${vac.key}`] = (r && r.length > 0) ? r[0].text : '—';
        } catch (_) {
          grid[`${vib.key}-${vac.key}`] = '—';
        }
      }
    }

    result.innerHTML = '';

    // ── Header ───────────────────────────────────────────────────────────
    const header = document.createElement('div');
    header.className = 'shabda-header';
    const stemEl = document.createElement('span');
    stemEl.className = 'shabda-stem dev-text';
    stemEl._devText = raw;
    stemEl.textContent = translit(raw);
    header.appendChild(stemEl);
    const lingaLabel = document.createElement('span');
    lingaLabel.className = 'shabda-label dev-text';
    const lingaDev = NAMARUPA_LINGA.find(l => l.key === activeLinga).dev;
    lingaLabel._devText = lingaDev;
    lingaLabel.textContent = translit(lingaDev);
    header.appendChild(lingaLabel);
    result.appendChild(header);

    // ── Table ─────────────────────────────────────────────────────────────
    const table = document.createElement('table');
    table.className = 'shabda-table';

    const thead = document.createElement('thead');
    const hrow = document.createElement('tr');
    hrow.appendChild(document.createElement('th'));
    NAMARUPA_VACANA.forEach(vac => {
      const th = document.createElement('th');
      th.className = 'dev-text';
      th._devText = vac.dev;
      th.textContent = translit(vac.dev);
      hrow.appendChild(th);
    });
    thead.appendChild(hrow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const vib of NAMARUPA_VIBHAKTI) {
      const row = document.createElement('tr');
      const label = document.createElement('td');
      label.className = 'shabda-vib dev-text';
      label._devText = vib.dev;
      label.textContent = translit(vib.dev);
      row.appendChild(label);
      for (const vac of NAMARUPA_VACANA) {
        const slp1Form = grid[`${vib.key}-${vac.key}`];
        const bare = (slp1Form === '—') ? '—'
                     : Sanscript.t(vslp1(slp1Form), 'slp1', 'devanagari');
        const devForm = (bare === '—' || !vib.prefix) ? bare : vib.prefix + bare;
        const td = document.createElement('td');
        td.className = 'shabda-form dev-text';
        td._devText = devForm;
        td.textContent = translit(devForm);
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    result.appendChild(table);
  }

  input.addEventListener('input', () => {
    const raw = input.value.trim();
    if (raw) {
      const known = NAMARUPA_WORDLIST[raw];
      if (known) {
        // Exact match in wordlist → set primary linga, dim everything else
        if (known[0] !== activeLinga) setActiveLinga(known[0]);
        lingaRow.querySelectorAll('.shabda-pill').forEach(b =>
          b.classList.toggle('dimmed', !known.includes(b._lingaKey)));
      } else {
        // Fall back to stem-ending heuristic
        const slp1 = Sanscript.t(raw, 'devanagari', 'slp1');
        const detected = detectLinga(slp1);
        if (detected && detected !== activeLinga) setActiveLinga(detected);
        applyDimming(slp1);
      }
    } else {
      lingaRow.querySelectorAll('.shabda-pill').forEach(b => b.classList.remove('dimmed'));
    }
    render();
  });

  // Pre-fill from shabdarupavali "रूप ▸" button
  if (_namarupaInitWord) {
    input.value = _namarupaInitWord;
    setActiveLinga(_namarupaInitLinga || 'Pum');
    _namarupaInitWord  = null;
    _namarupaInitLinga = null;
    render();
  }
}

// ── Śabdarūpāvalī book panel (Yudhiṣṭhira Mīmāṃsaka) ────────────────────────

const SRV_LINGA_LABEL = { Pum: 'पुं०', Stri: 'स्त्री०', Napumsaka: 'नपुं०' };

async function showShabdarupavali() {
  showPanel('shabdarupavali');
  updateBookURL('shabdarupavali');
  const panel = $panelShabdarupavali;

  if (!bookData['shabdarupavali']) {
    panel.innerHTML = '<div class="srv-loading">…</div>';
    try {
      if (!PRIVATE_BASE) throw new Error('no private base');
      const res = await fetch(`${PRIVATE_BASE}/shabdarupavali.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      bookData['shabdarupavali'] = await res.json();
    } catch (_) {
      panel.innerHTML = '<div class="srv-empty">शब्दरूपावली-डेटा उपलब्ध नहीं।</div>';
      return;
    }
  }

  renderShabdarupavali(panel, bookData['shabdarupavali']);
}

const SRV_GROUPS = [
  { id: 'intro',   label: 'Intro',    paaths: ['ref'] },
  { id: 'halanta', label: 'हलन्त',   paaths: ['paath4','paath5','paath6','paath7'] },
  { id: 'ajanta',  label: 'अजन्त',   paaths: ['paath8','paath9','paath10'] },
  { id: 'shesha',  label: 'शेष',     paaths: ['paath11','paath12'] },
];

function renderShabdarupavali(panel, data) {
  panel.innerHTML = '';

  const sections = data.sections || [];
  if (!sections.length) { panel.innerHTML = '<div class="srv-empty">—</div>'; return; }

  // Build a lookup: sectionId → section
  const secById = Object.fromEntries(sections.map(s => [s.id, s]));

  let activeGroupId = 'halanta';

  // ── Group pill bar (sticky) ─────────────────────────────────────────
  const pillBar = document.createElement('div');
  pillBar.className = 'srv-section-pills';

  // ── Niyama card list ─────────────────────────────────────────────────
  const listWrap = document.createElement('div');
  listWrap.className = 'srv-list';

  panel.appendChild(pillBar);
  panel.appendChild(listWrap);

  function renderGroup(groupId) {
    activeGroupId = groupId;
    pillBar.querySelectorAll('.srv-sec-pill').forEach(b =>
      b.classList.toggle('active', b.dataset.id === groupId));
    listWrap.innerHTML = '';

    const group = SRV_GROUPS.find(g => g.id === groupId);
    if (!group) return;

    // Intro group — show bhoomika text from ref section
    if (groupId === 'intro') {
      const refSec = secById['ref'];
      const introText = refSec && refSec.intro ? refSec.intro : '';
      const wrap = document.createElement('div');
      wrap.className = 'srv-ref-note';
      if (introText) {
        const p = document.createElement('p');
        p.className = 'srv-ref-intro mixed-text';
        p._mixedText = introText;
        p.textContent = translitMixed(introText);
        wrap.appendChild(p);
      }
      listWrap.appendChild(wrap);
      return;
    }

    // Render each niyama as a sutra-card (click to expand inline)
    const TRUNC = 160;
    for (const paathId of group.paaths) {
      const sec = secById[paathId];
      if (!sec) continue;
      for (const paradigm of (sec.paradigms || [])) {
        // Paradigm intro prose
        if (paradigm.intro) {
          const introEl = document.createElement('p');
          introEl.className = 'srv-paradigm-intro mixed-text';
          introEl._mixedText = paradigm.intro;
          introEl.textContent = translitMixed(paradigm.intro);
          listWrap.appendChild(introEl);
        }
        for (const n of (paradigm.niyamas || [])) {
          const fullText = n.body ? n.header + ' ' + n.body : n.header;
          const displayText = fullText.length > TRUNC
            ? fullText.slice(0, TRUNC).trimEnd() + '…'
            : fullText;

          const card = document.createElement('div');
          card.className = 'sutra-card';

          const row = document.createElement('div');
          row.className = 'sutra-row';
          const hdr = document.createElement('span');
          hdr.className = 'mixed-text';
          hdr._mixedText = displayText;
          hdr.textContent = translitMixed(displayText);
          row.appendChild(hdr);

          const detail = document.createElement('div');
          detail.className = 'sutra-detail';
          if (n.body) {
            const bodyEl = document.createElement('div');
            bodyEl.className = 'mixed-text';
            bodyEl._mixedText = n.body;
            bodyEl.textContent = translitMixed(n.body);
            detail.appendChild(bodyEl);
          }

          card.appendChild(row);
          card.appendChild(detail);
          card.addEventListener('click', () => toggleSimpleCard(card));
          listWrap.appendChild(card);
        }
      }
    }
  }

  // Build group pills
  for (const grp of SRV_GROUPS) {
    const btn = document.createElement('button');
    btn.className = 'srv-sec-pill' + (grp.id === activeGroupId ? ' active' : '');
    // Devanagari labels get dev-text; Latin stays as-is
    if (/[\u0900-\u097F]/.test(grp.label)) {
      btn.classList.add('dev-text');
      btn._devText = grp.label;
      btn.textContent = translit(grp.label);
    } else {
      btn.textContent = grp.label;
    }
    btn.dataset.id = grp.id;
    btn.addEventListener('click', () => renderGroup(grp.id));
    pillBar.appendChild(btn);
  }

  renderGroup(activeGroupId);
}

// Pending pre-fill for namarupa (set externally if needed in future)
let _namarupaInitWord  = null;
let _namarupaInitLinga = null;

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
    // Load gana so dhatuReaderList is set, then open the specific dhatu
    const data = await loadData('dhatupatha', 'dhatu/data.txt');
    const ganaItems = data.filter(x => x.gana === d.gana);
    renderDhatuList(ganaItems, GANA_NAMES_DEV[+d.gana] || d.gana);
    gotoDhatu(d.baseindex);
  });
  return item;
}

// Filter Ashtadhyayi sutras
function searchSutras(q) {
  // Normalize Devanagari digits → ASCII, and treat dashes same as dots
  const qn = devDigitsToAscii(q).replace(/-/g, '.');
  // Dotted/dashed reference: 1.1.1 or 1-1-1
  const idMatch = /^(\d)\.(\d)\.(\d+)$/.exec(qn);
  if (idMatch) {
    const id = String((+idMatch[1]) * 10000 + (+idMatch[2]) * 1000 + (+idMatch[3])).padStart(5, '0');
    return sutraList.filter(s => s.i === id);
  }
  // Digit-only reference: 111 = 1.1.1, 1145 = 1.1.45, 84116 = 8.4.116
  // First digit = adhyaya (1–8), second = pada (1–4), rest = sutra number
  // If query is all digits, only try reference matching — never fall through to text search
  if (/^\d+$/.test(qn)) {
    const digitRef = /^([1-8])([1-4])(\d{1,3})$/.exec(qn);
    if (digitRef) {
      const id = String((+digitRef[1]) * 10000 + (+digitRef[2]) * 1000 + (+digitRef[3])).padStart(5, '0');
      return sutraList.filter(s => s.i === id);
    }
    return [];
  }
  // If original was all Devanagari digits (with separators), don't fall through to text search
  if (/^[०-९][.०-९-]+$/.test(q)) return [];
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
  // Gana-dhatu reference: 1.1 / 1-1 / 01.0001 → match baseindex
  const qn = devDigitsToAscii(q).replace(/-/g, '.');
  const ganaRef = /^(\d{1,2})\.(\d{1,4})$/.exec(qn);
  if (ganaRef) {
    const gana = String(+ganaRef[1]).padStart(2, '0');
    const num  = String(+ganaRef[2]).padStart(4, '0');
    const bi   = `${gana}.${num}`;
    return data.filter(d => d.baseindex === bi);
  }
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
    const paribhashaLoader = PRIVATE_BASE
      ? (bookData['paribhasha-search']
          ? Promise.resolve(bookData['paribhasha-search'])
          : fetch(`${PRIVATE_BASE}/paribhasha.json`).then(r => r.json()).then(j => { bookData['paribhasha-search'] = j.sutras || []; return bookData['paribhasha-search']; }).catch(() => null))
      : Promise.resolve(null);

    const [dhatu, gana, unaadi, shiva, vartika, paribhasha] = await Promise.all([
      loadData('dhatupatha',   'dhatu/data.txt').catch(() => null),
      loadData('ganapatha',    'ganapath/data.txt').catch(() => null),
      loadData('unaadi',       'unaadi/data.txt').catch(() => null),
      loadData('shivasutra',   'shivasutra/data.txt').catch(() => null),
      loadData('vartika-page', 'sutraani/vartika.txt').catch(() => null),
      paribhashaLoader,
    ]);

    const sutraResults   = searchSutras(q);
    const dhatuResults   = dhatu   ? searchDhatus(dhatu, q)   : [];
    const ganaResults    = gana    ? searchGana(gana, q)       : [];
    const unaadiResults  = unaadi  ? searchUnaadi(unaadi, q)   : [];
    const shivaResults   = shiva   ? shiva.filter(s => s.sutra && s.sutra.includes(q)) : [];
    const vartikaResults    = vartika    ? searchVartika(vartika, q)       : [];
    const paribhashaResults = paribhasha ? searchParibhasha(paribhasha, q) : [];

    const total = sutraResults.length + dhatuResults.length + ganaResults.length +
                  unaadiResults.length + shivaResults.length + vartikaResults.length +
                  paribhashaResults.length;
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
    if (vartikaResults.length)
      renderGroup($searchDrawerBody, 'वार्तिकम्', vartikaResults.slice(0, SEARCH_CAP),
        makeVartikaResultItem, q, vartikaResults.length);
    if (paribhashaResults.length)
      renderGroup($searchDrawerBody, 'पारिभाषिक', paribhashaResults.slice(0, SEARCH_CAP),
        makeParibhashaResultItem, q, paribhashaResults.length);
  }
}

function searchVartika(rawData, q) {
  const dq = normalizeToDevanagari(q);
  return rawData.filter(e =>
    (e.vartika && e.vartika.includes(dq)) || (e.sutra && e.sutra.includes(q)));
}

function searchParibhasha(sutras, q) {
  const dq = normalizeToDevanagari(q);
  return sutras.filter(e => e.id !== 0 && (
    (e.sutra   && e.sutra.includes(dq)) ||
    (e.vyakhya && e.vyakhya.includes(dq))
  ));
}

function makeParibhashaResultItem(entry, q) {
  const item = document.createElement('div');
  item.className = 'search-result-item';
  const ref = document.createElement('span');
  ref.className = 'sri-ref';
  ref.textContent = entry.id;
  item.appendChild(ref);
  item.appendChild(highlightMatch(entry.sutra || '', q));
  item.addEventListener('click', async () => {
    closeDrawer();
    const paribhashaBook = (() => {
      for (const b of BOOKS) {
        const p = (b.pages || []).find(p => p.id === 'paribhasha');
        if (p) return p;
      }
    })();
    if (paribhashaBook) await handleLeafClick(paribhashaBook, null);
    requestAnimationFrame(() => {
      const card = document.getElementById(`paribhasha-${entry.id}`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  return item;
}

function makeVartikaResultItem(entry, q) {
  const item = document.createElement('div');
  item.className = 'search-result-item';
  const ref = document.createElement('span');
  ref.className = 'sri-ref';
  ref.textContent = entry.sutra || '';
  item.appendChild(ref);
  item.appendChild(highlightMatch(entry.vartika || '', q));
  item.addEventListener('click', async () => {
    const data = await loadData('vartika-page', 'sutraani/vartika.txt');
    renderVartikaList(data);
    closeDrawer();
    const [a, p, n] = entry.sutra.split('.');
    const id = a + p + String(n).padStart(3, '0');
    const card = $sutraList.querySelector(`[data-id="${id}"]`);
    if (card) { card.scrollIntoView({ block: 'center' }); toggleSimpleCard(card); }
  });
  return item;
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

// ── Transliterator panel ──────────────────────────────────────────────────────
const TL_SCHEMES = [
  { id: 'devanagari', name: 'Devanagari' },
  { id: 'bengali',    name: 'Bengali'    },
  { id: 'gujarati',  name: 'Gujarati'   },
  { id: 'gurmukhi',  name: 'Gurmukhi'   },
  { id: 'kannada',   name: 'Kannada'    },
  { id: 'malayalam', name: 'Malayalam'  },
  { id: 'oriya',     name: 'Odia'       },
  { id: 'tamil',     name: 'Tamil'      },
  { id: 'telugu',    name: 'Telugu'     },
  { id: 'iast',      name: 'IAST'       },
  { id: 'itrans',    name: 'ITRANS'     },
  { id: 'hk',        name: 'Harvard-Kyoto (HK)' },
  { id: 'slp1',      name: 'SLP1'       },
  { id: 'velthuis',  name: 'Velthuis'   },
];
const TL_ROMAN_IDS = new Set(['iast','itrans','hk','slp1','velthuis']);
const TL_MAP_GROUPS = [
  { label: 'Vowels',               chars: ['अ','आ','इ','ई','उ','ऊ','ऋ','ॠ','ऌ','ए','ऐ','ओ','औ'] },
  { label: 'Anusvāra · Visarga',  chars: ['अं','अः'] },
  { label: 'Velar — ka-varga',    chars: ['क्','ख्','ग्','घ्','ङ्'] },
  { label: 'Palatal — ca-varga',  chars: ['च्','छ्','ज्','झ्','ञ्'] },
  { label: 'Retroflex — ṭa-varga',chars: ['ट्','ठ्','ड्','ढ्','ण्'] },
  { label: 'Dental — ta-varga',   chars: ['त्','थ्','द्','ध्','न्'] },
  { label: 'Labial — pa-varga',   chars: ['प्','फ्','ब्','भ्','म्'] },
  { label: 'Semivowels',          chars: ['य्','र्','ल्','व्'] },
  { label: 'Sibilants',           chars: ['श्','ष्','स्'] },
  { label: 'Aspirate',            chars: ['ह्'] },
];

let tlInited = false;
function initTranslit() {
  if (tlInited) return;
  tlInited = true;

  const fromSel  = document.getElementById('tl-from');
  const toSel    = document.getElementById('tl-to');
  const inputTA  = document.getElementById('tl-input');
  const outputTA = document.getElementById('tl-output');

  TL_SCHEMES.forEach(s => {
    fromSel.appendChild(new Option(s.name, s.id));
    toSel.appendChild(new Option(s.name, s.id));
  });
  fromSel.value = localStorage.getItem('pn-tl-from') || 'itrans';
  toSel.value   = localStorage.getItem('pn-tl-to')   || 'devanagari';

  function tlConvert() {
    const text = inputTA.value;
    if (!text) { outputTA.value = ''; return; }
    try { outputTA.value = Sanscript.t(text, fromSel.value, toSel.value); }
    catch(_) { outputTA.value = ''; }
  }

  inputTA.addEventListener('input', tlConvert);
  fromSel.addEventListener('change', () => { localStorage.setItem('pn-tl-from', fromSel.value); tlConvert(); });
  toSel.addEventListener('change',   () => { localStorage.setItem('pn-tl-to',   toSel.value);   tlConvert(); });

  document.getElementById('tl-swap-btn').addEventListener('click', () => {
    const tmp = fromSel.value; fromSel.value = toSel.value; toSel.value = tmp;
    localStorage.setItem('pn-tl-from', fromSel.value);
    localStorage.setItem('pn-tl-to', toSel.value);
    tlConvert();
  });

  document.getElementById('tl-reverse').addEventListener('click', () => {
    const out = outputTA.value; if (!out) return;
    const tmp = fromSel.value; fromSel.value = toSel.value; toSel.value = tmp;
    localStorage.setItem('pn-tl-from', fromSel.value);
    localStorage.setItem('pn-tl-to', toSel.value);
    inputTA.value = out; tlConvert();
  });

  document.getElementById('tl-clear').addEventListener('click', () => {
    inputTA.value = ''; outputTA.value = ''; inputTA.focus();
  });

  document.getElementById('tl-copy').addEventListener('click', () => {
    if (!outputTA.value) return;
    navigator.clipboard.writeText(outputTA.value).then(() => {
      const el = document.getElementById('tl-copy-ok');
      el.textContent = 'Copied!';
      setTimeout(() => { el.textContent = ''; }, 1500);
    });
  });

  // Transliteration map
  function tlXt(dev, scheme) {
    try { return Sanscript.t(dev, 'devanagari', scheme); } catch(_) { return '—'; }
  }
  function buildTlMap(colScheme) {
    const colName = TL_SCHEMES.find(s => s.id === colScheme)?.name || colScheme;
    const colIsRoman = TL_ROMAN_IDS.has(colScheme);
    let html = `<table class="tl-map-table"><thead><tr>
      <th>Devanagari</th><th>IAST</th><th>${colName}</th>
    </tr></thead><tbody>`;
    for (const grp of TL_MAP_GROUPS) {
      html += `<tr class="tl-map-sec"><td colspan="3">${grp.label}</td></tr>`;
      for (const dev of grp.chars) {
        const display = dev.endsWith('्') ? dev.slice(0, -1) : dev;
        const iast    = tlXt(dev, 'iast');
        const other   = colScheme === 'iast' ? iast : tlXt(dev, colScheme);
        const colCls  = colIsRoman ? 'tl-td-mono' : 'tl-td-dev';
        html += `<tr>
          <td class="tl-td-dev">${display}</td>
          <td class="tl-td-mono">${iast || '—'}</td>
          <td class="${colCls}">${other || '—'}</td>
        </tr>`;
      }
    }
    html += '</tbody></table>';
    document.getElementById('tl-map-container').innerHTML = html;
  }
  const mapColSel = document.getElementById('tl-map-col');
  mapColSel.addEventListener('change', () => buildTlMap(mapColSel.value));
  buildTlMap(mapColSel.value);
}

function showTranslit() {
  initTranslit();
  showPanel('translit');
  closeDrawer();
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
    testimonials: {
      html: `
        <div class="about-section">
          <h2 class="about-title">What learners say</h2>
          <p class="about-intro">Kind words from those who use Paniniyam in their study of Sanskrit grammar.</p>
          <div class="about-card about-testimonial-card">
            <blockquote class="about-testimonial-quote">"Hello! I am a new learner of Sanskrit and have just begun my journey of learning Sanskrit grammar. I am very grateful for this site that you have created as it has helped with my note taking throughout my learning experience. One thing that I feel would be helpful would be the general meaning of sutras to assist foreign learners who can't translate easily. Other than that this site is great and has been a great tool that I have been able to confidently share with others who are interested in learning this great, ancient language. I appreciate everything this site has given me. Thank you very much."</blockquote>
            <div class="about-testimonial-attr">— Joe, 2026</div>
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

// ── Vartika list page ─────────────────────────────────────────────────────────
function renderVartikaList(rawData) {
  // rawData = [{sutra:"1.1.9", vartika:"..."}, ...] raw array (key !== 'vartika' so no normalization)
  const groups = [];
  const seen   = {};
  for (const entry of rawData) {
    const [a, p, n] = entry.sutra.split('.');
    const id = a + p + String(n).padStart(3, '0');
    if (!seen[id]) { seen[id] = { ref: entry.sutra, id, vartikas: [] }; groups.push(seen[id]); }
    seen[id].vartikas.push(entry.vartika);
  }
  setListHeader('वार्तिकम्', `${rawData.length} vārtikas · ${groups.length} sūtras`);
  $sutraList.innerHTML = '';
  const devNums = ['', '१', '२', '३', '४', '५', '६', '७', '८', '९', '१०'];
  for (const g of groups) {
    const sutra = sutraIndex[g.id];
    const card  = document.createElement('div');
    card.className  = 'sutra-card';
    card.dataset.id = g.id;
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const refBadge = document.createElement('span');
    refBadge.className = 'sutra-id';
    refBadge.textContent = g.ref;
    row.appendChild(refBadge);
    if (sutra) row.appendChild(devEl('span', 'sutra-text', sutra.s));
    if (g.vartikas.length > 1) {
      const cnt = document.createElement('span');
      cnt.className = 'sutra-badge badge-V';
      cnt.textContent = g.vartikas.length;
      row.appendChild(cnt);
    }
    card.appendChild(row);
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    if (sutra) detail.appendChild(devEl('div', 'detail-sutra-full', sutra.s));
    const vtSec = document.createElement('div');
    vtSec.className = 'detail-section';
    for (let i = 0; i < g.vartikas.length; i++) {
      const vtRow = document.createElement('div');
      vtRow.className = 'vartika-list-row';
      if (g.vartikas.length > 1) {
        const num = document.createElement('span');
        num.className = 'vartika-num dev-text';
        num._devText = devNums[i + 1] || String(i + 1);
        num.textContent = translit(num._devText);
        vtRow.appendChild(num);
      }
      vtRow.appendChild(devEl('span', 'detail-sanskrit', g.vartikas[i]));
      vtSec.appendChild(vtRow);
    }
    detail.appendChild(vtSec);
    if (sutra) {
      const goLink = document.createElement('a');
      goLink.className = 'vartika-goto dev-text';
      goLink.href = '#';
      goLink._devText = '→ सूत्रम्';
      goLink.textContent = translit('→ सूत्रम्');
      goLink.addEventListener('click', e => { e.stopPropagation(); gotoSutra(g.id); });
      detail.appendChild(goLink);
    }
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }
  showPanel('list');
}

// ── Unaadi ────────────────────────────────────────────────────────────────────
// Commentary tabs shown inside each expanded unaadi sutra card
const UNAADI_TABS = [
  { id: 'sk',  label: 'स्वामिदयानन्दः'         },  // open-source (ashtadhyayi.com data)
  { id: 'sh',  label: 'सोमलेखा / प० ईश्वरचन्द' },  // UnadiKosha-San-Hin-Commentary (R2)
  { id: 'uk',  label: 'आ० सत्यव्रत'             },  // unadi-kosha OCR (future)
];

// Structured field labels within the San-Hin tab
const UNAADI_SAN_HIN_FIELDS = [
  { key: 'pc', label: 'पदच्छेदः'   },
  { key: 'an', label: 'अनुवृत्तिः' },
  { key: 'sn', label: 'संक्षेपः'   },
  { key: 'vy', label: 'व्याख्या'   },
  { key: 'sd', label: 'स्वा०द०वृ०' },
  { key: 'ud', label: 'उदाहरणम्'  },
  { key: 'vs', label: 'विशेषः'     },
];

const UNAADI_SATYAVRATA_FIELDS = [
  { key: 'ar', label: 'अर्थः'          },
  { key: 'ud', label: 'उदाहरणम्'      },
  { key: 'sd', label: 'स्वा०द०वृत्तिः' },
  { key: 'hi', label: 'हिन्दी'          },
];

function buildUnaadiFieldRows(fields, fieldDefs, panel) {
  let hasContent = false;
  for (const { key, label } of fieldDefs) {
    const val = fields[key];
    if (!val) continue;
    hasContent = true;
    const fieldRow = document.createElement('div');
    fieldRow.className = 'unaadi-field-row';
    fieldRow.appendChild(devEl('span', 'unaadi-field-label', label));
    const valDiv = document.createElement('div');
    valDiv.className = 'unaadi-field-val commentary-panel detail-sanskrit';
    valDiv._rawCommentary = val;
    setCommentaryHTML(valDiv, val);
    fieldRow.appendChild(valDiv);
    panel.appendChild(fieldRow);
  }
  return hasContent;
}

function buildUnaadiTabPanel(tabId, u, shEntry, svEntry) {
  const panel = document.createElement('div');
  panel.className = 'detail-tab-panel commentary-text';
  panel.dataset.panel = tabId;

  if (tabId === 'sk') {
    if (u.sk) {
      panel.classList.add('commentary-panel');
      panel._rawCommentary = u.sk.replace(/<[^>]*>/g, '');
      setCommentaryHTML(panel, panel._rawCommentary);
    } else {
      panel.innerHTML = `<span class="no-data">No data.</span>`;
    }
  } else if (tabId === 'sh') {
    if (!shEntry || !buildUnaadiFieldRows(shEntry, UNAADI_SAN_HIN_FIELDS, panel))
      panel.innerHTML = `<span class="no-data">No data.</span>`;
  } else if (tabId === 'uk') {
    if (!svEntry || !buildUnaadiFieldRows(svEntry, UNAADI_SATYAVRATA_FIELDS, panel))
      panel.innerHTML = `<span class="no-data">No data.</span>`;
  }

  return panel;
}

function renderUnaadiAll(data, sanHin, satyavrata) {
  setListHeader('उणादिकोशः', `${data.length} sūtras`);
  $sutraList.innerHTML = '';
  for (const u of data) {
    const shEntry = sanHin    && sanHin[u.i];
    const svEntry = satyavrata && satyavrata[u.i];

    const card = document.createElement('div');
    card.className = 'sutra-card';

    // Row: id + sutra text + pratyaya badge
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    idEl.textContent = `${u.i.slice(0, -3)}.${parseInt(u.i.slice(-3), 10)}`;
    row.appendChild(idEl);
    row.appendChild(devEl('span', 'sutra-text', u.sutra));
    row.appendChild(devEl('span', 'sutra-badge badge-S', u.pratyay || ''));

    // Detail: sutra full + commentary tabs
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    detail.appendChild(devEl('div', 'detail-sutra-full', u.sutra));

    // Tab bar
    const tabBar = document.createElement('div');
    tabBar.className = 'detail-tabs';
    const panelWrap = document.createElement('div');
    panelWrap.className = 'detail-tab-panels';

    let firstTabBtn = null;
    let firstPanel = null;
    for (const tabDef of UNAADI_TABS) {
      const panel = buildUnaadiTabPanel(tabDef.id, u, shEntry, svEntry);
      panelWrap.appendChild(panel);

      const btn = devEl('button', 'detail-tab', tabDef.label);
      btn.addEventListener('click', e => {
        e.stopPropagation();
        tabBar.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panelWrap.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      });
      tabBar.appendChild(btn);

      if (!firstTabBtn) { firstTabBtn = btn; firstPanel = panel; }
    }
    if (firstTabBtn) {
      firstTabBtn.classList.add('active');
      firstPanel.classList.add('active');
    }

    detail.appendChild(tabBar);
    detail.appendChild(panelWrap);

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
    card.id = `paribhasha-${e.id}`;

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

  // Detail: two-tab commentary (जयमङ्गला / टिप्पणी)
  const detail = document.createElement('div');
  detail.className = 'sutra-detail';

  const BK_TABS = [
    { id: 'jm', label: 'जयमङ्गला' },
    { id: 'tp', label: 'टिप्पणी'   },
  ];

  const tabBar    = document.createElement('div');
  tabBar.className = 'detail-tabs';
  const panelWrap = document.createElement('div');
  panelWrap.className = 'detail-tab-panels';

  let firstBtn = null, firstPanel = null;
  for (const tabDef of BK_TABS) {
    const tp = document.createElement('div');
    tp.className = 'detail-tab-panel commentary-text';
    tp.dataset.panel = tabDef.id;

    if (tabDef.id === 'jm') {
      if (shloka.commentary) {
        tp.classList.add('commentary-panel', 'detail-sanskrit');
        tp._rawCommentary = shloka.commentary;
        setCommentaryHTML(tp, shloka.commentary);
      } else {
        tp.innerHTML = `<span class="no-data">No data.</span>`;
      }
    } else {
      // टिप्पणी — use notes field if present, else placeholder
      if (shloka.notes) {
        tp.classList.add('commentary-panel', 'detail-sanskrit');
        tp._rawCommentary = shloka.notes;
        setCommentaryHTML(tp, shloka.notes);
      } else {
        tp.innerHTML = `<span class="no-data">No data.</span>`;
      }
    }

    panelWrap.appendChild(tp);

    const btn = devEl('button', 'detail-tab', tabDef.label);
    btn.addEventListener('click', e => {
      e.stopPropagation();
      tabBar.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panelWrap.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.remove('active'));
      tp.classList.add('active');
    });
    tabBar.appendChild(btn);

    if (!firstBtn) { firstBtn = btn; firstPanel = tp; }
  }
  if (firstBtn) { firstBtn.classList.add('active'); firstPanel.classList.add('active'); }

  detail.appendChild(tabBar);
  detail.appendChild(panelWrap);

  card.appendChild(detail);
  card.addEventListener('click', () => toggleSimpleCard(card));
  return card;
}

// ── Rūpāvatāraḥ ──────────────────────────────────────────────────────────────

let $rvMatrix = null;
let _rvMatrixJustOpened = false;

function buildRvMatrix() {
  const wrap = document.createElement('div');
  wrap.id = 'rv-matrix';
  wrap.className = 'bk-matrix';

  const headerRow = document.createElement('div');
  headerRow.className = 'pm-row pm-header';
  const th = document.createElement('div');
  th.className = 'pm-th dev-text';
  th.style.cssText = 'min-width:0; flex:1; text-align:left;';
  th._devText = 'रूपावतारः — अवताराः';
  th.textContent = translit('रूपावतारः — अवताराः');
  headerRow.appendChild(th);
  wrap.appendChild(headerRow);

  // 2 rows × 4 columns = sections 1–8
  for (let row = 0; row < 2; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'pm-row';
    for (let col = 0; col < 4; col++) {
      const n = row * 4 + col + 1;
      const cell = document.createElement('button');
      cell.className = 'pm-cell rv-cell dev-text';
      cell._devText = RV_SECTION_NAMES_DEV[n - 1];
      cell.textContent = translit(RV_SECTION_NAMES_DEV[n - 1]);
      cell.title = n;
      cell.addEventListener('click', () => { closeRvMatrix(); showRupavatarah(n); });
      rowEl.appendChild(cell);
    }
    wrap.appendChild(rowEl);
  }
  return wrap;
}

function openRvMatrix() {
  if (!$rvMatrix) { $rvMatrix = buildRvMatrix(); document.body.appendChild($rvMatrix); }
  $rvMatrix.classList.add('open');
  _rvMatrixJustOpened = true;
  setTimeout(() => { _rvMatrixJustOpened = false; }, 0);
}

function closeRvMatrix() { $rvMatrix?.classList.remove('open'); }

async function showRupavatarah(secNum) {
  if (!RV_SECTIONS.includes(secNum)) secNum = RV_SECTIONS[0];
  rvCurrentSection = secNum;
  history.replaceState({ book: 'rupavatarah' }, '', `?book=rupavatarah&section=${secNum}`);

  const panel = $panelRupavatarah;
  if (!rvCache[secNum]) {
    panel.innerHTML = '<div class="loading-inline">Loading…</div>';
    showPanel('rupavatarah');
    if (!PRIVATE_BASE) { panel.innerHTML = '<div class="no-data">Rūpāvatāraḥ data not available.</div>'; return; }
    try {
      const num = String(secNum).padStart(2, '0');
      const res = await fetch(`${PRIVATE_BASE}/rupavatarah/section_${num}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      rvCache[secNum] = await res.json();
    } catch (e) {
      panel.innerHTML = `<div class="no-data">Could not load section ${secNum}: ${e.message}</div>`;
      return;
    }
  }

  renderRvSection(rvCache[secNum]);
  showPanel('rupavatarah');

  // Background prefetch of adjacent sections
  const idx = RV_SECTIONS.indexOf(secNum);
  [RV_SECTIONS[idx - 1], RV_SECTIONS[idx + 1]].filter(Boolean).forEach(n => {
    if (n && !rvCache[n]) {
      const num = String(n).padStart(2, '0');
      fetch(`${PRIVATE_BASE}/rupavatarah/section_${num}.json`)
        .then(r => r.json()).then(d => { rvCache[n] = d; }).catch(() => {});
    }
  });
}

function renderRvSection(data) {
  const panel = $panelRupavatarah;
  panel.innerHTML = '';

  const idx  = RV_SECTIONS.indexOf(data.section);
  const prevN = idx > 0 ? RV_SECTIONS[idx - 1] : null;
  const nextN = idx < RV_SECTIONS.length - 1 ? RV_SECTIONS[idx + 1] : null;

  // ── Sticky nav ──
  const nav = document.createElement('div');
  nav.className = 'bk-nav';

  const btnP = document.createElement('button');
  btnP.className = 'bar-btn bk-nav-btn';
  btnP.textContent = '◀';
  btnP.disabled = !prevN;
  if (prevN) btnP.addEventListener('click', () => showRupavatarah(prevN));
  nav.appendChild(btnP);

  const titleWrap = document.createElement('div');
  titleWrap.className = 'bk-nav-title';
  titleWrap.title = 'Back to section list';
  titleWrap.addEventListener('click', () => openRvMatrix());
  const nameEl = document.createElement('span');
  nameEl.className = 'bk-sarga-name dev-text';
  nameEl._devText = data.name;
  nameEl.textContent = translit(data.name);
  titleWrap.appendChild(nameEl);
  const countEl = document.createElement('span');
  countEl.className = 'bk-sarga-count';
  countEl.textContent = `${data.total} items`;
  titleWrap.appendChild(countEl);
  nav.appendChild(titleWrap);

  const btnN = document.createElement('button');
  btnN.className = 'bar-btn bk-nav-btn';
  btnN.textContent = '▶';
  btnN.disabled = !nextN;
  if (nextN) btnN.addEventListener('click', () => showRupavatarah(nextN));
  nav.appendChild(btnN);

  panel.appendChild(nav);

  // ── Item cards ──
  const list = document.createElement('div');
  list.className = 'bk-list';
  let lastSub = null;

  for (const item of data.items) {
    // Sub-section separator
    if (item.subsection && item.subsection !== lastSub) {
      const sep = document.createElement('div');
      sep.className = 'rv-subsection dev-text';
      sep._devText = item.subsection;
      sep.textContent = translit(item.subsection);
      list.appendChild(sep);
      lastSub = item.subsection;
    }
    list.appendChild(renderRvCard(item, data.section));
  }
  panel.appendChild(list);
}

function renderRvCard(item, sectionN) {
  const card = document.createElement('div');
  card.className = 'sutra-card bk-card';

  // Header row: section.item + verse (examples up to इति स्थिते;)
  const row = document.createElement('div');
  row.className = 'sutra-row';

  const idEl = document.createElement('span');
  idEl.className = 'sutra-id';
  idEl.textContent = `${sectionN}.${item.n}`;
  row.appendChild(idEl);

  const verseEl = document.createElement('div');
  verseEl.className = 'sutra-text bk-verse dev-text';
  verseEl._devText = item.verse || '';
  verseEl.textContent = translit(item.verse || '');
  row.appendChild(verseEl);

  card.appendChild(row);

  // Commentary (derivation)
  if (item.commentary) {
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    const cp = document.createElement('div');
    cp.className = 'detail-tab-panel commentary-text commentary-panel detail-sanskrit active';
    cp._rawCommentary = item.commentary;
    setCommentaryHTML(cp, item.commentary);
    detail.appendChild(cp);
    card.appendChild(detail);
  }

  card.addEventListener('click', () => toggleSimpleCard(card));
  return card;
}

// ── Skeleton placeholder helper ───────────────────────────────────────────────
function buildPlaceholderPanel($panel, titleDev, subtitle, body, urlBookId) {
  $panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'panel-placeholder';
  wrap.appendChild(devEl('div', 'placeholder-title', titleDev));
  const sub = document.createElement('div');
  sub.className = 'placeholder-subtitle';
  sub.textContent = subtitle;
  wrap.appendChild(sub);
  const bd = document.createElement('div');
  bd.className = 'placeholder-body';
  bd.innerHTML = body;
  wrap.appendChild(bd);
  $panel.appendChild(wrap);
  history.replaceState({ book: urlBookId }, '', `?book=${urlBookId}`);
  showPanel(urlBookId);
}

// ── Nirukta ───────────────────────────────────────────────────────────────────
function buildNrMatrix() {
  const wrap = document.createElement('div');
  wrap.id = 'nr-matrix';
  wrap.className = 'bk-matrix';   // reuse BK matrix styles

  // Header
  const headerRow = document.createElement('div');
  headerRow.className = 'pm-row pm-header';
  const th = document.createElement('div');
  th.className = 'pm-th dev-text';
  th.style.cssText = 'min-width:0; flex:1; text-align:left;';
  th._devText = 'निरुक्तम् — अध्यायाः';
  th.textContent = translit('निरुक्तम् — अध्यायाः');
  headerRow.appendChild(th);
  wrap.appendChild(headerRow);

  // 2 rows × 7 columns = adhyayas 1–14
  for (let row = 0; row < 2; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'pm-row';
    for (let col = 0; col < 7; col++) {
      const n = row * 7 + col + 1;
      const cell = document.createElement('button');
      cell.className = 'pm-cell';
      cell.textContent = n;
      const count = NR_ADHYAYA_COUNTS[n] || 0;
      cell.title = NR_ADHYAYA_NAMES_DEV[n] + (count ? ` (${count})` : '');
      cell.addEventListener('click', () => { closeNrMatrix(); showNirukta(n); });
      rowEl.appendChild(cell);
    }
    wrap.appendChild(rowEl);
  }
  return wrap;
}

function openNrMatrix() {
  if (!$nrMatrix) { $nrMatrix = buildNrMatrix(); document.body.appendChild($nrMatrix); }
  $nrMatrix.classList.add('open');
  _nrMatrixJustOpened = true;
  setTimeout(() => { _nrMatrixJustOpened = false; }, 0);
}

function closeNrMatrix() { $nrMatrix?.classList.remove('open'); }

async function showNirukta(adhyayaNum) {
  if (!adhyayaNum || !NR_ADHYAYAS.includes(adhyayaNum)) adhyayaNum = 1;
  nrCurrentAdhyaya = adhyayaNum;
  history.replaceState({ book: 'nirukta' }, '', `?book=nirukta&adhyaya=${adhyayaNum}`);

  if (!nrCache[adhyayaNum]) {
    setListHeader('निरुक्तम्', ''); $sutraList.innerHTML = '<div class="loading-inline">Loading…</div>';
    showPanel('list');
    if (!PRIVATE_BASE) {
      $sutraList.innerHTML = '<div class="no-data">Nirukta data not available locally.</div>';
      return;
    }
    try {
      const num = String(adhyayaNum).padStart(2, '0');
      const res = await fetch(`${PRIVATE_BASE}/nirukta/adhyaya_${num}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      nrCache[adhyayaNum] = await res.json();
    } catch (e) {
      $sutraList.innerHTML = `<div class="no-data">Could not load adhyaya ${adhyayaNum}: ${e.message}</div>`;
      return;
    }
  }

  renderNiruktaAdhyaya(nrCache[adhyayaNum]);

  // Background prefetch of adjacent adhyayas
  const idx = NR_ADHYAYAS.indexOf(adhyayaNum);
  [NR_ADHYAYAS[idx - 1], NR_ADHYAYAS[idx + 1]].filter(Boolean).forEach(n => {
    if (n && !nrCache[n]) {
      const num = String(n).padStart(2, '0');
      fetch(`${PRIVATE_BASE}/nirukta/adhyaya_${num}.json`)
        .then(r => r.json()).then(d => { nrCache[n] = d; }).catch(() => {});
    }
  });
}

const NR_TABS = [
  { id: 'ar', label: 'अर्थः'   },
  { id: 'bh', label: 'भाष्यम्' },
];

function renderNiruktaAdhyaya(data) {
  setListHeader(data.name, `${data.total} sūtras`);
  $sutraList.innerHTML = '';

  for (const sutra of data.sutras) {
    const card = document.createElement('div');
    card.className = 'sutra-card';

    // Top row: id + sutra text
    const row = document.createElement('div');
    row.className = 'sutra-row';
    const idEl = document.createElement('span');
    idEl.className = 'sutra-id';
    idEl.textContent = `${data.adhyaya}.${sutra.n}`;
    row.appendChild(idEl);
    if (sutra.sutra) row.appendChild(devEl('span', 'sutra-text', sutra.sutra));
    card.appendChild(row);

    // Detail: full sutra + tabs
    const detail = document.createElement('div');
    detail.className = 'sutra-detail';
    if (sutra.sutra) detail.appendChild(devEl('div', 'detail-sutra-full', sutra.sutra));

    const tabBar = document.createElement('div');
    tabBar.className = 'detail-tabs';
    const panelWrap = document.createElement('div');
    panelWrap.className = 'detail-tab-panels';

    let firstBtn = null, firstPanel = null;
    const tabData = { ar: sutra.artha, bh: sutra.bhashya };
    for (const tab of NR_TABS) {
      const val = tabData[tab.id];
      const tp = document.createElement('div');
      tp.className = 'detail-tab-panel';
      if (val) {
        const el = document.createElement('div');
        el.className = 'commentary-panel detail-sanskrit';
        el._rawCommentary = val;
        setCommentaryHTML(el, val);
        tp.appendChild(el);
      } else {
        tp.innerHTML = '<span class="no-data">No data.</span>';
      }
      panelWrap.appendChild(tp);

      const btn = devEl('button', 'detail-tab', tab.label);
      btn.addEventListener('click', e => {
        e.stopPropagation();
        tabBar.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panelWrap.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.remove('active'));
        tp.classList.add('active');
      });
      tabBar.appendChild(btn);
      if (!firstBtn) { firstBtn = btn; firstPanel = tp; }
    }
    if (firstBtn) { firstBtn.classList.add('active'); firstPanel.classList.add('active'); }

    detail.appendChild(tabBar);
    detail.appendChild(panelWrap);
    card.dataset.id = `${data.adhyaya}.${sutra.n}`;
    card.appendChild(detail);
    card.addEventListener('click', () => toggleSimpleCard(card));
    $sutraList.appendChild(card);
  }

  showPanel('list');
}

function showNiruktaPanel() {
  buildPlaceholderPanel(
    $panelNirukta, 'निरुक्तम्', 'Nirukta — Yāska',
    'This book is being digitised — coming soon.',
    'nirukta'
  );
}

// ── Yoga Darshana (skeleton) ──────────────────────────────────────────────────
function showYogaDarshanaPanel() {
  buildPlaceholderPanel(
    $panelYogadarshana, 'योगदर्शनम्', 'Yoga Darśana — Patañjali + Vyāsa Bhāṣya',
    'Commentary by Swami Satyapati Parivrajaka.<br>Content being digitised — coming soon.',
    'yogadarshana'
  );
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
document.getElementById('btn-translit').addEventListener('click', () => { closeDrawer(); showTranslit(); });

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
  const p = document.createElement('p');
  p.className = 'notes-empty';
  p.textContent = 'Coming soon.';
  panel.appendChild(p);
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
        <a class="welcome-intro-link" href="https://youtu.be/E1eAZQJ-3IA"
           target="_blank" rel="noopener" title="How to use this site">
          <div class="welcome-intro-thumb">
            <img src="https://img.youtube.com/vi/E1eAZQJ-3IA/mqdefault.jpg"
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
      } else if (urlBook === 'rupavatarah') {
        const secParam = parseInt(params.get('section')) || 1;
        await showRupavatarah(secParam);
      } else if (urlBook === 'nirukta') {
        showNiruktaPanel();
      } else if (urlBook === 'yogadarshana') {
        showYogaDarshanaPanel();
      } else if (urlBook === 'shabdarupavali') {
        await showShabdarupavali();
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
