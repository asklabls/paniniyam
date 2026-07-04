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
├── css/style.css           # All styles (v122)
├── js/
│   ├── app.js              # All app logic (~6500 lines, v223)
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

Vault OCR scripts (at /Users/au/Downloads/Python_Scripts/OCR/): `Combine_markdown_pages.py`, `Split_combinedpage_markdown.py`, `Clean_ocr_artifacts.py`, `Update_external_links.py`.

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
| Notes | Our notes / Your notes | Google Drive (Gmail login — live) |
| Kaumudi | सिद्धान्तकौमुदी, लघुकौमुदी, बालमनोरमा | kaumudi.txt, laghukaumudi.txt, balamanorama.txt |
| Tika | तत्त्वबोधिनी, न्यासः, पदमञ्जरी, प्रौढमनोरमा | tattvabodhini.txt, nyaas.txt, padamanjari.txt, praudhamanorama.txt |

`kaumudi.txt` = Siddhanta Kaumudi (NOT Laghu Kaumudi)
`laghukaumudi.txt` = Laghu Kaumudi

## Key Architecture Decisions

### Per-file splitting strategy (decided)

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
- `[label](url)` — external link; rendered as `<a target="_blank">` (added to `renderInline` within `renderCommentaryHTML`); used by PrathamaVritti timestamp links
- `renderCommentaryHTML(raw)` parses these, plain text is buffered and flushed through `translit()`
- `panel._rawCommentary` stores raw text; `setCommentaryHTML()` re-renders on script change

### PrathamaVritti notes (आ० चन्द्रदत्त-शर्मा)
- `pvNotesData` global — `{sutraId: "note text"}` loaded once from `PRIVATE_BASE/paniniyam-author-notes.json`
- `loadPvNotes()` — lazy loader; returns `{}` if PRIVATE_BASE is null or fetch fails
- Tab button (`pvBtn`) hidden by default; shown only when `pvNotesData[sutra.i]` has content
- Notes rendered via `setCommentaryHTML()` — each line `[MM:SS](url) note text` renders timestamp as clickable YouTube deep link
- Miner: `paniniyam-private/scripts/mine_prathamavrutti.py` → `private/paniniyam-author-notes.json` (upload to R2)

### Mādhavīya Dhātuvṛtti tab (माधवीया)
- `MDV_BASE = PRIVATE_BASE + '/dhv'` — per-dhatu JSON, same pattern as siddhi
- Tab added to dhatu reader: `माधवीया`, hidden until `MDV_BASE/{baseindex}.json` returns data
- `loadAndRenderMdv(baseindex, panel)` — fetches JSON, renders `data.vritti` via `setCommentaryHTML()`
- Retranslit: panel uses `.commentary-panel` + `_rawCommentary` → handled by global `retranslit()` sweep
- Source: `_anant_vault/Books/madhaviya-dhatu-vritti/_madhaviya-dhatu-vritti_marked.md`
  - Preprocessed with `paniniyam-private/scripts/preprocess_madhaviya_v2.py` (apply markup conventions)
  - Mined with `paniniyam-private/scripts/mine_madhaviya_dhv.py` → `private/dhv/{baseindex}.json`
- **Markup conventions** in marked file:
  - `# GanaName` — gana section (bhvadigan, adadigan, etc.)
  - `## N. dhatu artha` — dhatu entry header (first `## N.` per number wins; later ones are footnotes)
  - `> footnote` — excluded from vritti
  - `[[A.B.C]]` — sutra ref; `<<text>>` — sutra quote; `**bold**` — strong
  - `<!-- page_NNN -->` — stripped by miner; `<!-- CONTENT_START -->` — marks actual gana content start
- **Proofreading status**: best-guess markup applied; user reviewing — false positives (sub-items, footnotes marked as `##`) need manual cleanup
- After proofreading: re-run miner → upload `private/dhv/` to R2 `dhv/`

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
- SVGs loaded from `DIAGRAM_BASE/{entry.path}`; retransliterated to Indic scripts on script change; Roman schemes keep Devanagari (see Concept SVG retransliteration rule)

### SVG pipeline (`convert_visuals.py` in paniniyam-private)
- Strips `<style class="style-fonts">` (~900KB base64 font), removes white `<rect>`, replaces font-family
- Marks `<text>` elements with `data-dev` / `data-mixed` for retransliteration
- Adds `© paniniyam.com` watermark (font-size = 3.2% of SVG height)
- `--force` flag reconverts even if local output already exists (use when updating vault SVGs)
- `TEMPLATE_RE = re.compile(r'_template', re.IGNORECASE)` — skips any file with `_template` in name
- Output: `visuals/{adhyaya}/{A.P.NNN}.svg` for sutras, `visuals/concepts/{cat}/{name}.svg` for concepts
- Also generates `forms/concepts_index.json` after concept conversion
- Local dev: after convert, copy `visuals/concepts/` and `visuals/prakaranas/` into `private/visuals/`

**Full pipeline order** (vault → live):
```
1. Edit diagram in Excalidraw (vault auto-exports SVG)
2. normalize_svg.py path/to/diagram.svg   ← only if old diagram with large fonts
3. convert_visuals.py --no-sutras --upload --force
4. commit + push forms/concepts_index.json if changed
5. cp -r visuals/concepts private/visuals/   ← local dev only
```

### normalize_svg.py (paniniyam-private/scripts)
Scales old Excalidraw SVGs so dominant font = 28px. Only for old diagrams (60–100px fonts); new ones are a no-op. Always `--dry-run` first on folders; never run on full vault.

### Excalidraw diagram design standard (for paniniyam.com)
- **Setup**: run **Paniniyam Setup** script (`Excalidraw/Scripts/Paniniyam Setup.md`) — sets 200px grid + 28px default font
- **Fonts**: Primary = Large (28px), Secondary = Medium (20px). Never Extra Large for dense content.
- **Cells**: rectangle (`R`) + text (`T`) grouped (`Ctrl+G`) — gives browser a `<rect>` to resize for wide scripts
- **Cell sizes**: single letter 40×40px; short term 80–100×40px; header 120+×40px (on 20px minor grid)
- **Canvas**: 800×1200 standard card; 800×2400 double-tall; 1200×800 wide grid
- Old diagrams (60–100px fonts, no grouped rect+text) fall back to font-scaling (0.75 Indic, 0.42 ITRANS)

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
- `'pratyaya-suchi'` — opens प्रत्यय-सूची panel (#panel-pratyaya-suchi, sub-tree child type)
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
- Content renderer (`renderVnsContent`): line-by-line parser — `## N-` → sutra-card, `## N- (उत्तर)` with pending question → Q&A card, `**(प्रश्न)-**` or plain `(प्रश्न)-` → sets `pendingQuestion`, `![filename]` → inline image
- **Q&A cards**: collapsed sutra-cards where header shows `N- ( प्रश्न )- question text`; click to expand answer. Handles both `**N- (उत्तर)-**` (bold) and `## N- (उत्तर)-` (heading) answer formats. Embedded `![img/...]` in heading line is stripped and rendered after the card.
- `pendingQuestion` state variable tracks the last seen question across lines; reset after each Q&A card is built
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

### प्रत्यय-सूची panel
- Nav: child of References → प्रत्ययाः sub-tree; type `'pratyaya-suchi'`
- Panel: `#panel-pratyaya-suchi`
- 802 entries across 391 pratyaya groups; covers all Aṣṭādhyāyī pratyayas
- Each entry: pratyaya form, final form after IT-lopa, adhikāra type badge (कृत्/तद्धित/सुप्/तिङ्/स्त्री/विकरण/समासान्त), governing sūtra (clickable → navigate; hover → artha popup)
- Filters: first letter pill, adhikāra type, free-text search — all instant, client-side

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
- `normalizeRoman(s)` — folds `ri` and `ru` (before consonant/end) to `r` for vocalic-r comparison; applied to both the query and `s.e` field so "vriddhi", "vruddhi", "vrddhi" all match the same sutras
- `INDIC_RANGES` — Unicode block → Sanscript scheme map; `normalizeToDevanagari` auto-detects input script so typing Telugu while Devanagari is displayed still works correctly
- Script/theme/about buttons now call `closeDrawer()` before toggling — previously `e.stopPropagation()` in those handlers blocked the search drawer from closing

### Lazy loading
- `loadData(key, path)` fetches once, caches in `bookData[key]`
- Tab panels: `panel._loaded = true` set before `await` to prevent double-fetch
- Audio: cached per pada key in `audioCache`; base64 data URIs played via `new Audio(uri)`

### Panels
- `welcome` — landing screen
- `reader` — sutra or dhatu reader (shared, controlled by `readerType`)
- `list` — card list (Ashtadhyayi secondary + all leaf books)
- `pratyaya` — pratyaya reference tables (सार्वधातुकम्/आर्धधातुकम् tabs)
- `pratyaya-suchi` — प्रत्यय-सूची (802-entry filterable pratyaya index)
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

### Matrix popup behaviour (mobile)
- All three popups (`.pada-matrix`, `.gana-matrix`, `.bk-matrix`) have `max-height: calc(100dvh - var(--bar-h) - 16px)` + `overflow-y: auto` — scroll when taller than viewport
- `@media (max-width: 480px)`: `.pm-td-label` 88px, `.pm-th-corner` 88px, `.pm-th`/`.pm-cell` 52px — total pada-matrix ≈296px (fits 360px phone); `.bk-matrix .pm-cell` 42px — 7 cols ≈294px

### Cache busting
- `index.html` loads `app.js?v=N` and `style.css?v=N`
- Bump `N` in both tags on every push with user-visible changes
- Current: `app.js?v=258`, `style.css?v=136`

## Fonts
- **Vesper Libre** — Sanskrit / Devanagari text (sutra text, commentary, meta block, nav labels)
- **Noto Sans Devanagari** — fallback for Indic scripts
- **Noto Sans** — UI chrome (tabs, badges, English labels)
- All loaded from Google Fonts

## Deployment

**Live site**: `https://asklabls.github.io/paniniyam/` (GitHub Pages, main branch root)
**Custom domain**: `paniniyam.com` — registered via Cloudflare Registrar (2026-06-08); pointed at GitHub Pages (live)

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

## Roadmap & Future Work

### Near term
- **Pratyaya data review**: verify आर्धधातुक forms in `forms/pratyaya.txt` against reference
- **sync_private.sh**: script to push owner-authored files to both paniniyam-private repo and R2 in one command
- **More mined fields**: anvaya from pravachanam.json not yet displayed — consider adding to meta block
- **VNS charts fix**: broken table/chart sections in varnochchaaran-shiksha_combined.md (lines 165–209, 219–228, 489–492) need fixing before final publication
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
| PrathamaVritti notes (आ० चन्द्रदत्त-शर्मा) | Mined from vault timestamps (mine_prathamavrutti.py) | ✅ Live |
| Mādhavīya Dhātuvṛtti (Sayana) | Mined from OCR vault (mine_madhaviya_dhv.py) — proofreading in progress | ✅ Live (1420 dhatus) |
| CS Vasu English translation | paniniyam-data fork (ashtadhyayi-data) | ✅ Live |
| Additional commentaries (SK, Nyasa, Padamanjari, Praudhamanorama) | paniniyam-data fork | ✅ Live |
| User notes via Gmail login → Google Drive | Client-side OAuth, user's own Drive | ✅ Live |
| Transliterator (14 scripts) | Sanscript.js — in-app panel + tools.html | ✅ Live |
| English meanings per sutra | Owner's own writing | 🔜 Pending |
| Pravachanam padavibhaga (पदच्छेदः) | Already displayed in meta block — prefers pv field, falls back to sutra.pc | ✅ Live |
| Pravachanam anvaya | Already mined — needs UI | 🔜 Pending |
| Sutra SVG diagrams (per sutra) | Owner's Excalidraw vault (114 sutras so far) | 🔄 Content in progress (UI pending) |
| YouTube video embeds per sutra | Owner's YouTube channel | 🔄 Content in progress |
| Ramayanam audio player | 21,076 files on R2 across 6 kandas — no UI yet | 🔜 Pending |
| OCR-digitized books | Kashika (owner's OCR), Pravachanam, Jingyasu Prathamavrutti | 🔜 Phase 6 |

### Excalidraw / Obsidian Integration (decided)
- **Static SVG exports only** — no live Excalidraw embeds
- Obsidian vault already auto-exports SVGs (`excalidraw-autoexport: svg`)
- Workflow: see **Full pipeline order** in SVG pipeline section above
- Sutra diagrams: `visuals/{adhyaya}/{A.P.NNN}.svg` (shown in sutra reader when available)
- Concept/prakarana diagrams: browsable via Visual Library + popup on `[[concept]]` links
- **Paniniyam Setup script**: `_anant_vault/Excalidraw/Scripts/Paniniyam Setup.md`
  Sets 200px grid + default font 28px. Run on every new diagram file. Also resizes
  selected text elements to 28px in bulk (for fixing old diagrams in Excalidraw).

### Concept SVG retransliteration rule
- Indic scripts (Telugu, Kannada, Malayalam, Tamil) → transliterate, scale font 0.75
- ITRANS / HK / SLP1 / Velthuis / WX etc. → transliterate, scale font 0.42–0.52
- IAST → keep Devanagari (SVG fonts lack IAST diacritics — ā ī ṛ render as boxes)
- Devanagari → native, no scaling
- `SVG_FONT_SCALE` — per-scheme scale factors in app.js
- `SVG_ROMAN_SKIP` — schemes that keep Devanagari in SVGs (currently: iast, iast_dravidian)
- `_svgUseDevanagari()` — returns true if current script should show Devanagari in SVGs
- `_applySvgEl(el, devText, isDevType)` — applies text + font-size to one SVG text element
- `applyConceptSvgRetranslit(wrap)` — retransliterates all data-dev/data-mixed elements in an inlined SVG

### Gmail Login / Notes (live)
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

All 6 kandas (21,076 files) compressed (mono 11kHz VBR ~29kbps) and uploaded to `ramayanam_audio/` in `paniniyam-private` R2 bucket. File naming: `sarga_NNN/000-start.mp3`, `NNN.mp3`, `NNN-iti.mp3`. Scripts: `compress_ramayanam.py --kanda <key> --jobs 8`, then `upload_ramayanam.py --jobs 20`. Source: `_anant_vault/attachments/Audio/Ramayanam/`.

### Animated Teaching Engine (Manim project)
`/Users/au/Projects/Manim/` — animated gurukula teaching methodology consuming `pravachanam.json` + `siddhi/*.json`. Full spec: `/Users/au/Projects/Manim/docs/TEACHING_ENGINE.md`.

### Vidyut Prakriya Engine
Rust-based Pāṇinian derivation engine. Repo: `/Users/au/Projects/paniniyam-vidyut` (forked). Full spec + Python API coverage: `/Users/au/Projects/Manim/docs/VIDYUT_PRAKRIYA.md`. Tiṅanta ✅ excellent | Subanta ✅ substantial | Taddhitānta ✅ partial | Samāsa/Sandhi(inter-word) ⚠️ Rust-only | Svara 🔴 experimental.

---

### Roadmap Phases
```
Phase 1   ✅ Reader mode + top nav bar redesign + drawers + icon bar
Phase 1.5 ✅ Pravachanam mining + siddhi panel + R2 private CDN + deep linking + theme picker
Phase 1.6 ✅ Varnochchaaran Shiksha panel + OCR vault pipeline + Obsidian deep link integration
Phase 1.7 ✅ Paribhasha panel (परिभाषाः) — आचार्यप्रद्युम्नः commentary, 157 rules, R2 private
Phase 1.8 ✅ Ramayanam audio — all 6 kandas compressed + uploaded to R2 (21,076 files)
Phase 1.9 ✅ Visual Library + concept popup (221 SVG diagrams, [[concept]] hover, siddhi concept links)
Phase 2.0 ✅ Bhattikavya panel — 1323 shlokas, Jayamaṅgalā commentary, sarga matrix popup, Books nav group
Phase 2.1 ✅ PrathamaVritti notes tab (आ० चन्द्रदत्त-शर्मा); VNS Q&A cards; renderCommentaryHTML [label](url) links
Phase 2.2 ✅ Mādhavīya Dhātuvṛtti tab — Sayana's dhatu commentary; माधवीया tab in dhatu reader; 1420 dhatus mined (proofreading ongoing)
Phase 2.3 ✅ CS Vasu English + all additional commentaries live (SK, Nyasa, Padamanjari, Praudhamanorama) from paniniyam-data fork
Phase 2.4 ✅ Gmail login + Google Drive personal notes — live at paniniyam.com
Phase 2.5 ✅ Transliterator panel (⌨️) — 14 scripts, in-app + standalone tools.html; Ko-fi support link (☕)
Phase 2.6 ✅ प्रत्यय-सूची — filterable index of 802 Aṣṭādhyāyī pratyayas with IT-lopa forms, adhikāra badges, linked sūtras
Phase 2.7 ✅ PWA offline support — service worker caches static shell + core data; manifest.json; installable
Phase 3   🔄 Sutra SVG diagrams in reader (114 exist, UI pending) + YouTube video embeds (content in progress)
Phase 3.x ✅ First commentary tab blank bug fixed; PV tab default fixed; dhatu search navigation fixed
Phase 4   🔜 Owner's English meanings per sutra; Pravachanam anvaya UI
Phase 4.5 🔜 अन्वेषण (Research) panel — full-text commentary search + sutra cross-reference index
Phase 5   🔜 Ramayanam audio player UI (21,076 files already on R2)
Phase 6   🔜 Owner's OCR books: Kashika Vritti, Pravachanam full text, Jingyasu Prathamavrutti
```
