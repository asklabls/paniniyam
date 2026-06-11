# Paniniyam — Claude Context

A static single-page web app for browsing Panini's Ashtadhyayi and related Sanskrit texts in any Indic script.

## Project Layout

```
paniniyam/
├── index.html              # Single-page app shell (no build step)
├── privacy_policy.html     # Privacy Policy page
├── terms.html              # Terms of Use page
├── copyright.html          # Copyright page
├── contact.html            # Contact Us page
├── css/style.css           # All styles (v93)
├── js/
│   ├── app.js              # All app logic (~6000 lines, v163)
│   └── sanscript.js        # Transliteration library (do not edit)
├── forms/
│   ├── pratyaya.txt        # Pratyaya reference table (pipe-delimited, see format below)
│   ├── concepts_index.json # Term → {path, category} for concept SVG popups (221 entries)
│   └── dhatu/              # 2229 per-dhatu JSON files (e.g. 01.0001.json)
└── data -> /Users/au/Projects/paniniyam-data
                            # Symlink to data repo (local dev only)
```

Local private data (gitignored):
```
private/                    # Local copy of R2 private data (mirrors R2 structure)
  siddhi/                   # Per-sutra siddhi JSON files (served from R2 in prod)
  visuals/                  # Local copy of cleaned SVGs (sutra + concept + prakarana)
    1/ … 8/                 # Sutra SVGs per adhyaya
    concepts/               # Concept diagram SVGs
    prakaranas/             # Prakarana diagram SVGs
  pravachanam.json
  paribhasha.json
  varnochchaaran-shiksha.json
  avyaya_samhita.json
  linganushasana.json
  bhattikavya/              # Per-sarga JSONs (mirrored from R2)
    sarga_01.json … sarga_21.json
  img/
admin/shabda-entry.html     # File System Access API tool for shabda data entry
```

All pipeline scripts are in the **private repo** at `/Users/au/Projects/paniniyam-private/scripts/`.
See `/Users/au/Projects/paniniyam-private/SCRIPTS.md` for full command reference.

Vault OCR scripts (at /Users/au/Downloads/Python_Scripts/OCR/):
```
Combine_markdown_pages.py   # Globs page_*.md → single combined file with <!-- page_NNN --> markers
Split_combinedpage_markdown.py  # Splits combined file back into individual page_*.md files
Clean_ocr_artifacts.py      # Removes OCR noise: standalone numbers, repeated titles, stray punctuation
Update_external_links.py    # Prepends [[paniniyam]] । before ashtadhyayi.com links in vault sutra notes
```

## Data

### Source
- **Local dev**: `data/` symlink → `/Users/au/Projects/paniniyam-data/`
- **Production**: four CDN bases:
  - `DATA_BASE` → `https://cdn.jsdelivr.net/gh/asklabls/paniniyam-data@master` (ashtadhyayi.com fork)
  - `FORMS_BASE` → `https://cdn.jsdelivr.net/gh/asklabls/paniniyam@main/forms` (own repo, for generated files)
  - `PRIVATE_BASE` → `https://pub-19119053fd624d308a49f9189fffb000.r2.dev` (R2 public bucket, owner-authored)
  - `DIAGRAM_BASE` → `PRIVATE_BASE + '/visuals'` (cleaned Excalidraw SVGs)
  - `SIDDHI_BASE` → `PRIVATE_BASE + '/siddhi'`
- Local: `PRIVATE_BASE = 'private'`, so all private paths resolve to `private/…`
- Detection: `isLocal` checks for localhost + private IP ranges (192.168.x, 10.x, 172.16-31.x)

### Files fetched from DATA_BASE
| Path | Contents | Size | Notes |
|------|----------|------|-------|
| `sutraani/data.txt` | All 3976 sutras with metadata | ~1MB | |
| `sutraani/kashika.txt` | Kashika Vritti commentary | ~3.7MB | |
| `sutraani/vartika.txt` | Vartika | small | array format — normalized in loadData |
| `sutraani/kaumudi.txt` | Siddhanta Kaumudi | | |
| `sutraani/laghukaumudi.txt` | Laghu Kaumudi | ~433KB | |
| `dhatu/data.txt` | 2259 dhatu entries | ~2MB | |
| `ganapath/data.txt` | Ganapatha (262 ganas) | small | |
| `unaadi/data.txt` | Unaadi Kosha | small | |
| `linganushasanam/data.txt` | Linganushasanam | small | |
| `shiksha/data.txt` | Shiksha | small | |
| `fit/data.txt` | Fit Sutrani | small | |
| `shivasutra/data.txt` | 14 Shiva Sutras | small | |
| `audio/sutraani/{a}-{p}.txt` | Base64 MP3s per pada | ~6MB each | lazy loaded |

### Files fetched from FORMS_BASE
| Path | Contents | Notes |
|------|----------|-------|
| `forms/dhatu/{baseindex}.json` | Per-dhatu conjugation forms | e.g. `01.0001.json` |
| `forms/pratyaya.txt` | Pratyaya endings reference table | pipe-delimited, see format below |
| `forms/concepts_index.json` | Term → {path, category} for SVG popups | 221 entries |

### Files fetched from PRIVATE_BASE (R2)
| Path | Contents | Notes |
|------|----------|-------|
| `pravachanam.json` | Pravachanam commentary (9 fields, ~3954 sutras) | |
| `siddhi/{sutraId}.json` | Per-sutra derivation tables | owner-authored, never committed |
| `paribhasha.json` | 157 paribhasha rules | |
| `varnochchaaran-shiksha.json` | VNS text (11 sections) | |
| `avyaya_samhita.json` | 324 avyaya entries | |
| `linganushasana.json` | Linganushasanam (extended) | |
| `visuals/{adhyaya}/{A.P.NNN}.svg` | Sutra diagrams | cleaned Excalidraw SVGs |
| `visuals/concepts/{category}/{term}.svg` | Concept diagrams | 221 files |
| `visuals/prakaranas/{term}.svg` | Prakarana diagrams | |
| `bhattikavya/sarga_01.json` … `sarga_21.json` | Per-sarga Bhattikavya shlokas + Jayamaṅgalā commentary | 20 sargas, 1323 shlokas (no sarga 15) |

### Removed files (copyright — do not re-add)
- `sutraani/sutrartha_english.txt` — owner's personal commentary, planned as book
- `sutraani/sutrartha.txt` — owner's personal Sanskrit commentary

### loadData quirk: vartika normalization
`vartika.txt` is an array of `{sutra:"1.1.9", vartika:"..."}` objects, not a dict.
`loadData` detects `key === 'vartika'` and converts to a dict keyed by sutra ID (`"11009"`).
Other books (e.g. ganapatha) also have `sutra`/`vartika` fields — the `key ===` guard prevents
those from being incorrectly converted.

### Commentary tab groups (TAB_GROUPS in app.js)
| Group | Tabs | Data files |
|---|---|---|
| Primary | काशिका, वार्तिकम्, महाभाष्यम्, CS Vasu Eng | kashika.txt, vartika.txt, bhashya.txt, vasu_english.txt |
| Notes | Our notes / Your notes | Phase 4 placeholder (Google Drive) |
| Kaumudi | सिद्धान्तकौमुदी, लघुकौमुदी, बालमनोरमा | kaumudi.txt, laghukaumudi.txt, balamanorama.txt |
| Tika | तत्त्वबोधिनी, न्यासः, पदमञ्जरी, प्रौढमनोरमा | tattvabodhini.txt, nyaas.txt, padamanjari.txt, praudhamanorama.txt |

`kaumudi.txt` = Siddhanta Kaumudi (NOT Laghu Kaumudi)
`laghukaumudi.txt` = Laghu Kaumudi

## Key Architecture Decisions

### Per-file splitting strategy (decided)

**Dhatu forms** (`forms/dhatu/*.json`) — one file per dhatu. Works well because:
- You navigate to one dhatu at a time; never need all 2229 simultaneously
- Forms are not searched (search is on dhatu text, not conjugation forms)

**Do NOT split open-source commentaries** (Kashika, Kaumudi, Vartika, etc.) into per-sutra files:
- These come from `paniniyam-data` (ashtadhyayi.com fork) — not owner-authored, no need to edit
- Splitting permanently decouples from upstream; upstream fixes can't be pulled without re-splitting
- Bulk lazy-load (one 3.7MB file, cached for the session) is already fast enough
- Per-sutra split would break future commentary search (would require 3976 HTTP requests or a separate index)

**Do NOT split `sutraani/data.txt`** — needed at startup for nav tree + search; bulk is correct here.

**DO use per-sutra files for owner-authored content** (Phase 2+):
```
forms/meanings/11001.json   ← owner's English meanings (Phase 2)
forms/notes/11001.json      ← owner's commentary (Phase 2)
```
Per-sutra is right here because: owner edits one sutra at a time, CDN invalidates only changed files,
and these are never bulk-searched (no existing search index to break).

**Summary table:**
| Data | Strategy | Reason |
|------|----------|--------|
| `sutraani/data.txt` | Bulk | Needed at startup for nav + search |
| Kashika, Kaumudi, Vartika | Bulk (lazy) | Upstream data, not editable, commentary search future |
| Dhatu conjugation forms | Per-file | Never all needed at once, not searched |
| Owner meanings / notes | Per-file | Authored one sutra at a time, editable |
| SVG diagrams | Per-file | One file per sutra/concept by nature |

### Transliteration
- All Sanskrit stored as Devanagari in data files and JS constants
- `translit(text)` → `Sanscript.t(text, 'devanagari', currentScript)`
- `translitMixed(text)` → transliterates only Unicode Devanagari runs, leaves English intact
- Elements that need retransliteration use one of two patterns:
  - `el._devText = 'देवनागरी'` + `el.classList.add('dev-text')` — pure Sanskrit
  - `el._mixedText = 'text'` + `el.classList.add('mixed-text')` — Sanskrit+English mixed
- `retranslit()` runs on every script change, queries `.dev-text` and `.mixed-text`

### Commentary markup in Kashika/Kaumudi
- `<<sutra text>>` — cited sutra; rendered as `.sutra-quote` span with `data-dev` attribute
- `[[७.२.१]]` — sutra reference; rendered as `.sutra-link` anchor linking to that sutra
- `renderCommentaryHTML(raw)` parses these, plain text is buffered and flushed through `translit()`
- `panel._rawCommentary` stores raw text; `setCommentaryHTML()` re-renders on script change

### Inline markup: `appendInlineMarkup(container, raw)`
Handles mixed wikilink/plain-text content in siddhi intros and commentary:
- `[[A.B.C]]` → `.sutra-link` anchor
- `[[term]]` → `.concept-link` anchor (triggers SVG popup on hover/click)
- `[label](url)` → external link
- Plain text → text node (run through `translit()`)

### Siddhi segment types
Siddhi JSON steps have `segs` (col 3), optionally `num_segs` (col 1) and `form_segs` (col 2).
Each segment: `{t, v, ...}`
| Type | Description | Extra fields |
|------|-------------|-------------|
| `'sl'` | Sutra link | `id` (sutraId), `v` (display text) |
| `'dl'` | Dhatu link | `ref` (baseindex__name), `v` (display text) |
| `'cl'` | Concept link | `v` (Devanagari term — looked up in conceptsIndex) |
| `'tx'` | Plain text | `v` (text, may be Hindi) |

`renderSiddhiSegs(segs, container)` renders segments into a DOM container.
`'cl'` segments render as `<a class="concept-link dev-text" data-concept="…">`.

### Concept popup (`[[concept]]` hover)
- `conceptsIndex` — loaded once from `FORMS_BASE/forms/concepts_index.json`
  - Structure: `{ "अच्": { "path": "concepts/pratyahara/अच्.svg", "category": "pratyahara" }, … }`
  - 221 entries covering pratyahara, it-karyas, krt, sutra-type, general, prakarana categories
- `showConceptPopup(el, term)` — fetches SVG from `DIAGRAM_BASE/{entry.path}`, inlines it into a floating popup
- `conceptSvgCache` — in-memory cache, one fetch per term per session
- `applyConceptSvgRetranslit(wrap)` — retransliterates `[data-dev]` / `[data-mixed]` text elements in the inlined SVG
- Popup triggered on: `mouseenter` + `click` on any `.concept-link[data-concept]`
- Concept links appear in: siddhi table cells, siddhi intro text, commentary
- `.concept-link` CSS: dashed accent-color underline, no forced font-family (inherits for correct Telugu/other script rendering)

### Visual Library panel
- Nav entry: `{ id: 'visuals', type: 'visual-library', devName: 'दृश्यग्रन्थागारम्', engName: 'Visual Library' }`
- Panel: `#panel-visuals`; URL: `?book=visuals`
- `VISUAL_CATEGORIES` — ordered list of `{ id, label, prefix }` for tab display
- `showVisualLibrary()` — renders category tabs + SVG card grid from `conceptsIndex`
- `showVisualDetail(term, entry)` — full-size SVG view with back button
- SVGs loaded from `DIAGRAM_BASE/{entry.path}`; retransliterated on script change

### SVG pipeline (`convert_visuals.py` in paniniyam-private)
- Strips `<style class="style-fonts">` (~900KB base64 font), removes white `<rect>`, replaces font-family
- Marks `<text>` elements with `data-dev` / `data-mixed` for retransliteration
- Adds `© paniniyam.com` watermark (font-size = 3.2% of SVG height)
- `--force` flag reconverts even if local output already exists (use when updating vault SVGs)
- Output: `visuals/{adhyaya}/{A.P.NNN}.svg` for sutras, `visuals/concepts/{cat}/{name}.svg` for concepts
- Also generates `forms/concepts_index.json` after concept conversion
- Local dev: after convert, copy `visuals/concepts/` and `visuals/prakaranas/` into `private/visuals/`

### Sutra card data fields (from `sutraani/data.txt`)
| Field | Meaning | Example |
|-------|---------|---------|
| `i` | Sutra ID key | `"11001"` = 1.1.1 |
| `a`, `p`, `n` | Adhyaya, Pada, number | `1`, `1`, `1` |
| `s` | Sutra text (Devanagari) | `वृद्धिरादैच्` |
| `ss` | Sutra with anuvritta | `आत्-ऐच् वृद्धिः` |
| `pc` | Padaccheda — `word$type$vibhakti$vacana$##...` | |
| `type` | Sutra type — `code$description$` | `S$वृद्धिसंज्ञा$` |
| `an` | Anuvritta — `word$sutraId##...` | |
| `ad` | Adhikara — `text$a$p$n` | |

Sutra ID format: `${adhyaya}${pada}${serial.padStart(3,'0')}` e.g. 7.2.1 → `"72001"`

### Nav structure
```
Ashtadhyayi  (adhyaya-tree)
Dhatupatha   (lazy-gana-tree)
Visuals      (visual-library)
Books        (sub-tree)
  └─ भट्टिकाव्यम्  (bhattikavya-panel)
References   (sub-tree)
  ├─ प्रत्ययाः     (sub-tree → pratyaya-page children)
  ├─ शब्दरूपावली   (shabda-browser)
  ├─ अव्ययार्थाः   (avyaya-panel)
  ├─ पारिभाषिक     (leaf)
  └─ फिट्सूत्राणि  (leaf)
```

"Books" and "References" use English titles in all scripts (`devName: 'Books'` / `'References'`).
When adding a new book (e.g. Ramayanam), add it as a child of `books` sub-tree.

### Nav book types
- `'adhyaya-tree'` — Ashtadhyayi (8 adhyayas × 4 padas), accordion: one adhyaya open at a time
- `'lazy-gana-tree'` — Dhatupatha (10 ganas, sections built lazily on first expand)
- `'leaf'` — single click loads whole book into list panel
- `'sub-tree'` — expandable folder with child buttons; dispatches by `page.type` on click
- `'varnochchaaran-panel'` — opens Varnochchaaran Shiksha panel (sub-tree child type)
- `'bhattikavya-panel'` — opens BK sarga matrix popup (sub-tree child type)
- `'shabda-browser'` — opens Shabda browser panel (sub-tree child type)
- `'avyaya-panel'` — opens Avyaya panel (sub-tree child type)
- `'pratyaya-page'` — opens a pratyaya reference page (sub-tree child type)
- `'visual-library'` — opens Visual Library panel
- `'about-menu'` — single click opens about panel

**Sub-tree child dispatch** (`buildBookEntry` inner loop): each `page.type` must have an explicit case in the `if/else` chain. Missing types fall through to `showPratyayaPage()` — always add a case when creating a new panel type.

### 32-Pada matrix popup (`buildPadaMatrix`)
- Triggered by ⊞ button (`#btn-pada-grid`) in left bar, next to search
- 8×4 grid of all 32 pādas; each cell shows `A.P` ref + sutra count
- Header row: I II III IV (pada columns); row labels: Devanagari digits १–८ (adhyayas)
- Caption row above: `अध्या.` corner + `पादः` spanning columns
- Clicking a cell calls `showPada(a, p, null)` and closes the popup
- Closes on: outside click (document listener), Escape key, ⊞ toggle, or cell selection
- `bar-ref` click (middle of top bar) still toggles reader ↔ list view for current pada

### Varnochchaaran Shiksha panel
- Nav: शिक्षा `sub-tree` → पाणिनीयशिक्षा (leaf) + वर्णोच्चारण-शिक्षा (varnochchaaran-panel)
- Data: `varnochchaaran-shiksha.json` — 11 sections: prakashakiya (hidden), bhumika, intro, prakarana-1..8
- Served from `PRIVATE_BASE` (R2); local dev reads from `private/varnochchaaran-shiksha.json`
- Two-row pill nav: row1 = भूमिका + अथ वर्णोच्चारण-शिक्षा; row2 = प्रकरणम् label + १–८ number pills
- Content renderer (`renderVnsContent`): line-by-line parser — `## ` → sutra heading, `**` lines → own paragraph, `![filename]` → inline image
- Inline images: place `![img/filename.jpg]` on its own line in section content; image served from `PRIVATE_BASE/img/`
- Section-level images: add `"image": "img/filename.jpg"` field to section in JSON → appears at bottom of section
- Retranslit: `.vns-content._vnsMarkdown` re-renders whole section on script change

### Accordion nav behaviour
- At book level: `collapseAllBooks(exceptContainer)` — opening one book closes all others
- At adhyaya level: `collapseAllAdhyayas(container, exceptPadas)` — one adhyaya open at a time
- Both use direct DOM references (not querySelector traversal) for reliability

### Dhatu reader
- `readerType = 'sutra' | 'dhatu'` — shared reader panel and prev/next nav buttons
- Per-dhatu forms loaded from `FORMS_BASE/dhatu/{baseindex}.json`
- Windowed prefetch: ±2 neighbours fetched in background after navigation
- Forms encoded as 9 semicolon-separated cells per lakara+pada key: `plat`, `alat`, etc.
- `LAKARA_SARVA` (लट्, लोट्, लङ्, विधिलिङ्) → सार्वधातुकम् tab
- `LAKARA_ARDHA` (लिट्, लुट्, लृट्, आशीर्लिङ्, लुङ्, लृङ्) → आर्धधातुकम् tab
- Split layout: ubhayapada dhatus show parasmai and atmanepada side by side

### Pratyaya reference pages
- Nav entry: `type: 'sub-tree'` under book id `pratyaya`
- Two sub-pages: अदन्त (bhvadi ganas) and अनदन्त (adadi ganas)
- Each page has सार्वधातुकम् / आर्धधातुकम् tabs
- Data: `forms/pratyaya.txt` — fetched once, parsed by `parsePratyayaTxt()`, cached in `bookData['pratyaya']`
- File format: `stemtype|category|lakara|pada=f1;f2;f3;f4;f5;f6;f7;f8;f9`
  - 9 forms (;-separated): prathama-ek/dvi/bahu, madhyama-ek/dvi/bahu, uttama-ek/dvi/bahu
  - stemtype: `adanta` | `anadanta`
  - category: `sarva` | `ardha`
  - lakara: `lat` `lot` `lang` `vidhiling` `lit` `lut` `lrut` `ashirling` `lung` `lrung`
  - pada: `p` (parasmaipada) | `a` (atmanepada)
- To correct a value: edit the relevant line in `forms/pratyaya.txt` and push

### Search
- `SEARCH_CAP = 75` — max results per book/group
- Searches across Ashtadhyayi (silently includes Pravachanam artha/hindi when loaded), Dhatupatha, or all books

### Lazy loading
- `loadData(key, path)` fetches once, caches in `bookData[key]`
- Tab panels: `panel._loaded = true` set before `await` to prevent double-fetch
- Audio: cached per pada key in `audioCache`; base64 data URIs played via `new Audio(uri)`

### Panels
- `welcome` — landing screen
- `reader` — sutra or dhatu reader (shared, controlled by `readerType`)
- `list` — card list (Ashtadhyayi secondary + all leaf books)
- `pratyaya` — pratyaya reference tables
- `visuals` — Visual Library (concept + prakarana SVG browser)
- `varnochchaaran` — Varnochchaaran Shiksha panel
- `bhattikavya` — Bhattikavya shloka reader
- `about` — credits / contact / support

### Bhattikavya panel
- Nav: child of **Books** sub-tree; type `'bhattikavya-panel'`
- Panel: `#panel-bhattikavya`; URL: `?book=bhattikavya&sarga=N`
- Data: `PRIVATE_BASE/bhattikavya/sarga_NN.json` — 20 files, 1323 shlokas (no sarga 15)
- Each JSON: `{ sarga: N, name: "प्रथमः सर्गः", total: K, shlokas: [{n, verse, commentary}] }`
- `BK_SARGAS` = `[1..14, 16..21]` (ordered list; sarga 15 absent from OCR)
- `BK_SARGA_NAMES_DEV` — ordinal names for each sarga (used in sticky nav)
- `BK_SARGA_COUNTS` — hardcoded shloka counts per sarga (used in matrix popup)
- `bkCurrentSarga`, `bkCache{}` — session state + in-memory sarga cache

**Sarga picker popup** (`.bk-matrix`):
- Triggered by clicking "भट्टिकाव्यम्" in nav; same fixed-position popup style as `.pada-matrix`
- `buildBkMatrix()` → 3 rows × 7 columns of `.pm-cell` buttons (sargas 1–21); sarga 15 disabled
- `openBkMatrix()` / `closeBkMatrix()` — closes on outside click (hooked into document listener alongside pada/gana matrix closers)
- Header: single `.pm-th` spanning full width with `'भट्टिकाव्यम् — सर्गाः'`

**Shloka reader** (`renderBkSarga`):
- Sticky sarga nav (◀ sarga-name count ▶) — clicking the title returns to matrix popup
- Adjacent sargas prefetched in background on load
- Each shloka = `.sutra-card.bk-card`: verse in `.bk-verse.dev-text`, commentary via `setCommentaryHTML()` / `.commentary-panel._rawCommentary`
- `bkVerseIsClean(verse)` — returns false if first line is a commentary transition (`...आह -`, `...चेदाह --`, long prose ending ` -`); clean verses wrapped in `.bk-callout` (accent left border + sidebar bg)
- `---` in commentary → `<hr class="bk-fn-sep">` (footnote separator from Jayamaṅgalā's page layout)
- Sutra links `[[A.B.C| text]]` in commentary render via existing `renderCommentaryHTML()`

**Miner**: `paniniyam-private/scripts/mine_bhattikavya.py`
- Input: `/Users/au/Projects/_anant_vault/Books/Bhattikavya/Bhattikavya_combined.md`
- Output: `private/bhattikavya/sarga_NN.json`
- Sarga start detection: `{ordinal} सर्गः ।` — disambiguated from end-colophons by checking `prev_content.endswith(' नाम')`
- Skip zones: `> [!shloka]` callouts with non-BK refs (`ref:: 1`, `ref:: गी०_...`) excluded; BK refs contain `'भ'`
- `॥ N ॥` appears twice per shloka: first = verse end, second = commentary end
- Upload: `private/bhattikavya/` → R2 `bhattikavya/` (use boto3 S3 client, see session history)

### Cache busting
- `index.html` loads `app.js?v=N` and `style.css?v=N`
- Bump `N` in both tags on every push with user-visible changes
- Current: `app.js?v=163`, `style.css?v=93`

## Fonts
- **Vesper Libre** — Sanskrit / Devanagari text (sutra text, commentary, meta block, nav labels)
- **Noto Sans Devanagari** — fallback for Indic scripts
- **Noto Sans** — UI chrome (tabs, badges, English labels)
- All loaded from Google Fonts

## Deployment

**Live site**: `https://asklabls.github.io/paniniyam/` (GitHub Pages, main branch root)
**Custom domain**: `paniniyam.com` — registered via Cloudflare Registrar (2026-06-08); not yet pointed at GitHub Pages

**Files committed to repo** (data comes from CDN):
```
index.html
privacy_policy.html
terms.html
copyright.html
contact.html
css/style.css
js/app.js
js/sanscript.js
forms/pratyaya.txt
forms/concepts_index.json
forms/dhatu/*.json   (2229 files, generated by split_dhatuforms.py)
```

**Gitignored** (local only):
```
data/           (symlink to paniniyam-data)
admin/
private/        (local mirror of R2 private data)
visuals/        (converted SVG build artifacts — 224MB)
forms/siddhi/
```

## Local Dev

```bash
cd /Users/au/Projects/paniniyam
python3 -m http.server 7771
```

Accessible on local network at `http://<your-mac-ip>:7771`

**After converting new SVGs** (so concept popups work locally):
```bash
cp -r visuals/concepts private/visuals/
cp -r visuals/prakaranas private/visuals/
```

---

## What's Built (snapshot: 2026-06-11)

### Core reference app
- Ashtadhyayi reader: all 3976 sutras, prev/next navigation, padaccheda/anuvritta/adhikara meta
- Commentary tabs: Kashika, Vartika (normalized from array format), Laghu Kaumudi; tab groups for Primary/Kaumudi/Tika traditions (most files still 404 pending data)
- Audio pronunciation per sutra (lazy loaded, base64 MP3)
- Leaf books: Shiva Sutras, Ganapatha, Unaadi Kosha, Linganushasanam, Shiksha, Fit Sutrani, **Paribhasha** (परिभाषाः)
- **Varnochchaaran Shiksha panel**: Panini's phonetics text with Dayananda Saraswati's Hindi commentary; two-row pill nav, inline image support, full retransliteration
- Dhatupatha: 2259 entries across 10 ganas, dhatu reader with conjugation forms
- **Pratyaya reference**: अदन्त / अनदन्त pages, सार्वधातुक / आर्धधातुक tabs, full tiṅ-pratyaya tables
- **Pravachanam tab** (आ० सुदर्शनदेव): mined from Acharya Sudarshan Dev's Pravachanam — artha + hindi artha for ~3954 sutras; served from Cloudflare R2
- **Siddhi panel**: per-sutra derivation tables from owner's Obsidian vault; sutra/dhatu/concept links in table cells; hover tooltip on sutra refs; served from R2
- **Visual Library** (दृश्यग्रन्थागारम्): browse 221 concept + prakarana SVG diagrams by category (pratyahara, it-karyas, krt, sutra-type, general, prakarana); click-to-expand full view
- **Concept popup**: `[[concept]]` wikilinks in siddhi and commentary render as hoverable links — hover shows floating SVG popup with the diagram; works in table cells, intro text, and commentary
- **Sutra meta block**: samasa, udaharana from pravachanam.json; all fields transliterable
- **Deep linking**: `?sutra=1.1.1` URL parameter — shareable links open directly to that sutra
- **Bhattikavya panel**: 1323 shlokas across 20 sargas with Jayamaṅgalā commentary; sarga picker popup (3×7 grid, same style as pada/gana matrix); verse callouts for clean verses; `---` → footnote separator `<hr>`; sutra links in commentary; full retransliteration

### UI / UX
- 11 scripts (**ITRANS default**): full retransliteration on every script change — Sanskrit, Hindi artha, siddhi prose, and inlined SVG text all retranslit
- Top nav bar + left icon bar + slide-in drawers (nav left, search right)
- **Nav structure**: Books sub-tree (Bhattikavya; Ramayanam to come) + References sub-tree (Pratyayas, Śabdarūpāvalī, Avyayas, Pāribhāṣika, Fiṭ Sūtras)
- **Pada matrix popup**: ⊞ button in left bar + अष्टाध्यायी nav entry → proper table (adhyaya rows × pada columns) with sutra counts; click cell to jump to that pada; closes on outside click / Escape
- **Gana matrix popup**: धातुपाठः nav entry → 2×5 grid of 10 ganas with dhatu counts
- **Sarga matrix popup**: भट्टिकाव्यम् nav entry → 3×7 grid of 21 sargas (sarga 15 disabled); same `.pm-row`/`.pm-cell` style as pada/gana matrix
- **Copy link button**: 📋 icon in sutra reader (top-right group) copies `?sutra=A.P.N` URL; tooltip → "Copied!" for 1.5s
- **Search**: 75 results per group; retains last search value; searches Ashtadhyayi (with Pravachanam artha/hindi), Dhatupatha, or all books
- Script dropdown in top bar
- Theme picker: 8 themes with live preview card in About panel
- Feedback form (Google Apps Script endpoint) with optional email field
- Mobile: icon bar hidden on portrait ≤480px
- **Legal pages**: Privacy Policy · Terms of Use · Copyright · Contact Us (linked from welcome footer and cross-linked between pages)

### Obsidian vault integration
- `paniniyam.md` webviewer: dataviewjs iframe that reads active file frontmatter (`adhyaya`, `pada`, `sutra_number`) → opens correct sutra in Paniniyam
- All 3981 sutra notes updated: External line now reads `[[paniniyam]] । [ashtadhyayi.com](...)` — wikilink gives hover popup, external link opens browser
- `Update_external_links.py`: idempotent script to prepend `[[paniniyam]] । ` before ashtadhyayi.com links; supports `--sutra A.P.N` (single file test) and `--dry-run`

### Infrastructure
- Fully static, no build step, no backend
- Four CDN sources: paniniyam-data (open data), paniniyam repo (generated forms), Cloudflare R2 (owner-authored private data + SVGs)
- Private repo: `paniniyam-private` (GitHub, private) — all pipeline scripts + SCRIPTS.md reference
- `mine_pravachanam.py`: state-machine miner extracting 9 fields from Pravachanam_01–06.md → pravachanam.json
- `mine_bhattikavya.py`: extracts per-sarga JSON from `Bhattikavya_combined.md` → `private/bhattikavya/sarga_NN.json`; handles skip zones (non-BK callouts), sarga/colophon disambiguation, verse/commentary boundary detection
- `mine_varnochchaaran.py`: splits combined VNS markdown into 11 sections → varnochchaaran-shiksha.json
- `mine_paribhasha.py`: extracts 157 paribhasha entries → private/paribhasha.json
- `convert_visuals.py`: cleans Excalidraw SVGs (strips font, adds watermark, marks text), generates `concepts_index.json`; `--force` reconverts existing files; `--no-sutras` for concepts only
- `extract_siddhi.py`: extracts vault siddhi notes → per-sutra JSON; `--sutra A.P.N`, `--upload`, `--force`; handles empty stub tables in vault notes
- `split_dhatuforms.py`: splits 9MB source into 2229 per-dhatu JSONs
- `admin/shabda-entry.html`: File System Access API tool for adding shabda entries locally
- Vault OCR pipeline: Combine/Split/Clean markdown scripts + Update_external_links.py

---

## Roadmap & Future Work

### Near term
- **Pratyaya data review**: verify आर्धधातुक forms in `forms/pratyaya.txt` against reference
- **sync_private.sh**: script to push owner-authored files to both paniniyam-private repo and R2 in one command
- **More mined fields**: padavibhaga, anvaya from pravachanam.json not yet displayed — consider adding to tab
- **VNS charts fix**: broken table/chart sections in varnochchaaran-shiksha_combined.md (lines 165–209, 219–228, 489–492) need fixing before final publication
- **paniniyam.com**: point custom domain at GitHub Pages (Cloudflare DNS)
- **concepts_index.json**: as more concept SVGs are standardised to 4×6 / 3×4 card format, re-run `--no-sutras --force --upload`

### Content layers
| Layer | Source | Status |
|---|---|---|
| Sutra text + metadata | ashtadhyayi.com (open) | ✅ Live |
| Kashika, Laghu Kaumudi, Vartika | ashtadhyayi.com (open) | ✅ Live |
| Audio pronunciation | ashtadhyayi.com (open) | ✅ Live |
| Dhatu conjugation forms | Generated from ashtadhyayi.com data | ✅ Live |
| Pratyaya reference tables | Owner's reference (pratyaya.txt) | ✅ Live |
| Acharya Sudarshandev commentary (artha + hindi) | Mined from Pravachanam (pravachanam.json) | ✅ Live |
| Siddhi derivation tables | Owner's Obsidian vault notes | ✅ Live |
| Varnochchaaran Shiksha | Panini's phonetics + Dayananda Saraswati's Hindi commentary | ✅ Live |
| Paribhasha (157 rules) | आचार्यप्रद्युम्नः commentary (private/R2) | ✅ Live |
| Concept + Prakarana SVG diagrams | Owner's Excalidraw vault (221 diagrams) | ✅ Live |
| Visual Library panel | Browse diagrams by category | ✅ Live |
| Concept popup hover | `[[concept]]` links → floating SVG popup | ✅ Live |
| Bhattikavya + Jayamaṅgalā commentary | Mined from OCR vault (mine_bhattikavya.py) | ✅ Live |
| English meanings per sutra | Owner's own writing | 🔜 Phase 2 |
| Full Pravachanam fields (padavibhaga, anvaya, udaharana) | Already mined — needs UI | 🔜 Phase 2 |
| Sutra SVG diagrams (per sutra) | Owner's Excalidraw vault (114 sutras so far) | 🔜 Phase 3 (UI pending) |
| YouTube video embeds per sutra | Owner's YouTube channel | 🔜 Phase 3 |
| User notes | Per-user via Gmail login → Google Drive | 🔜 Phase 4 |
| Additional commentaries | Siddhanta Kaumudi, Nyasa, Padamanjari, Vasu English | 🔜 Phase 5 |
| OCR-digitized books | Kashika (owner's OCR), Pravachanam, Jingyasu Prathamavrutti | 🔜 Phase 6 |

### Excalidraw / Obsidian Integration (decided)
- **Static SVG exports only** — no live Excalidraw embeds
- Obsidian vault already auto-exports SVGs (`excalidraw-autoexport: svg`)
- Workflow: update diagram in Obsidian → run `convert_visuals.py --force --upload` → live on R2
- SVG cards being standardised to **4×6 or 3×4 at 200px grid** for visual consistency
- Sutra diagrams: `visuals/{adhyaya}/{A.P.NNN}.svg` (shown in sutra reader when available)
- Concept/prakarana diagrams: browsable via Visual Library + popup on `[[concept]]` links

### Gmail Login / Notes (planned — Phase 4)
- Google OAuth — no password management needed
- Notes saved to **user's own Google Drive** via Drive API — owner never stores user data
- Privacy selling point: *"Your notes live in your Google Drive, not our servers"*
- Purely client-side, no backend server required

### OCR-Digitized Books (Phase 6)
Owner has an OCR workflow for digitizing Sanskrit books:

| Commentary | Notes |
|---|---|
| Kashika Vritti | Owner's own OCR — may supplement/replace open-data version |
| Pravachanam | OCR digitized |
| Jingyasu Prathamavrutti | OCR digitized |

Integration: same `renderCommentaryHTML()` pipeline. `<<sutra>>` and `[[ref]]` markup
inserted during OCR post-processing. Each book = new entry in `SUTRA_TABS` + new data file.

### Ramayanam Audio (on R2, 2026-06-08)

All 6 kandas compressed and uploaded to `paniniyam-private` R2 bucket:

| Kanda | R2 folder | Sargas | Files |
|---|---|---|---|
| Balakanda | `ramayanam_audio/01_balakanda/` | 77 | 2,398 |
| AyodhyaKanda | `ramayanam_audio/02_ayodhyakanda/` | 119 | 4,540 |
| AranyaKanda | `ramayanam_audio/03_aranyakanda/` | 76 | 2,558 |
| KishkindhaKanda | `ramayanam_audio/04_kishkindhakanda/` | 67 | 2,595 |
| SundaraKanda | `ramayanam_audio/05_sundarakanda/` | 68 | 2,998 |
| YuddhaKanda | `ramayanam_audio/06_yuddhakanda/` | 128 | 5,987 |

**File naming**: `sarga_001/000-start.mp3`, `001.mp3`, `024-iti.mp3` etc.
- `000-start.mp3` — sarga intro (sorts to top)
- `NNN.mp3` — shloka NNN (3-digit zero-padded)
- `NNN-iti.mp3` — closing shloka

**Compression**: ffmpeg `-map 0:a -ac 1 -ar 11025 -codec:a libmp3lame -qscale:a 9`
- Mono, 11 kHz, VBR ~29 kbps — ~29KB per shloka (~8× compression from source)
- `-map 0:a` strips embedded album art (YuddhaKanda sources had ~1MB PNG each)

**Source files**: `/Users/au/Projects/_anant_vault/attachments/Audio/Ramayanam/`
- Prefix map: `BK` → balakanda, `AyK` → ayodhyakanda, `ArK` → aranyakanda, `KK`/`KiK` → kishkindhakanda, `SK` → sundarakanda, `YK` → yuddhakanda
- AranyaKanda has `Prakshipta` sarga (interpolated verses) in `ArK_Sarga_056_Prakshipta/` — treated as sarga 56

**To add a new kanda**: add entry to `KANDAS` dict in `compress_ramayanam.py`, add prefix to `FILENAME_RE`, then run:
```bash
python3 /Users/au/Projects/paniniyam-private/scripts/compress_ramayanam.py --kanda <key> --jobs 8
python3 /Users/au/Projects/paniniyam-private/scripts/upload_ramayanam.py --jobs 20
```
Set env vars first: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

### Roadmap Phases
```
Phase 1   ✅ Reader mode + top nav bar redesign + drawers + icon bar
Phase 1.5 ✅ Pravachanam mining + siddhi panel + R2 private CDN + deep linking + theme picker
Phase 1.6 ✅ Varnochchaaran Shiksha panel + OCR vault pipeline + Obsidian deep link integration
Phase 1.7 ✅ Paribhasha panel (परिभाषाः) — आचार्यप्रद्युम्नः commentary, 157 rules, R2 private
Phase 1.8 ✅ Ramayanam audio — all 6 kandas compressed + uploaded to R2 (21,076 files)
Phase 1.9 ✅ Visual Library + concept popup (221 SVG diagrams, [[concept]] hover, siddhi concept links)
Phase 2.0 ✅ Bhattikavya panel — 1323 shlokas, Jayamaṅgalā commentary, sarga matrix popup, Books nav group
Phase 2   → Owner's English meanings; display remaining Pravachanam fields (padavibhaga, anvaya)
Phase 3   → YouTube video embeds + sutra SVG diagrams in reader (114 exist, UI pending)
Phase 4   → Gmail login + personal notes saved to Google Drive
Phase 5   → Additional commentaries (Siddhanta Kaumudi, Nyasa, Padamanjari, Vasu English)
Phase 6   → Owner's OCR books: Kashika Vritti, Pravachanam full text, Jingyasu Prathamavrutti
```
