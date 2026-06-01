# Paniniyam — Claude Context

A static single-page web app for browsing Panini's Ashtadhyayi and related Sanskrit texts in any Indic script.

## Project Layout

```
paniniyam/
├── index.html          # Single-page app shell (no build step)
├── css/style.css       # All styles
├── js/
│   ├── app.js          # All app logic (~1500 lines)
│   └── sanscript.js    # Transliteration library (do not edit)
└── data -> /Users/au/Projects/paniniyam-data
                        # Symlink to data repo (local dev only)
```

## Data

### Source
- **Local dev**: `data/` symlink → `/Users/au/Projects/paniniyam-data/`
- **Production** (any non-private IP): auto-switches to CDN:
  `https://cdn.jsdelivr.net/gh/ashtadhyayi-com/data@main`
- Detection logic in `app.js`: `isLocal` checks for localhost + private IP ranges (192.168.x, 10.x, 172.16-31.x)

### Files the site currently fetches
| Path | Contents | Size | Notes |
|------|----------|------|-------|
| `sutraani/data.txt` | All 3976 sutras with metadata | ~1MB | |
| `sutraani/kashika.txt` | Kashika Vritti commentary | ~3.7MB | |
| `sutraani/kaumudi.txt` | Siddhanata Kaumudi | | |
| `sutraani/laghukaumudi.txt` | Laghu Kaumudi | ~433KB | |
| `dhatu/data.txt` | 2259 dhatu entries | ~2MB | |
| `ganapath/data.txt` | Ganapatha | small | |
| `unaadi/data.txt` | Unaadi Kosha | small | |
| `linganushasanam/data.txt` | Linganushasanam | small | |
| `shiksha/data.txt` | Shiksha | small | |
| `fit/data.txt` | Fit Sutrani | small | |
| `shivasutra/data.txt` | 14 Shiva Sutras | small | |
| `audio/sutraani/{a}-{p}.txt` | Base64 MP3s per pada | ~6MB each | lazy loaded |

### Removed files (copyright — do not re-add)
- `sutraani/sutrartha_english.txt` — owner's personal commentary, planned as book
- `sutraani/sutrartha.txt` — owner's personal Sanskrit commentary

### Commentary tab groups (TAB_GROUPS in app.js)
Three stacked tab rows in the sutra reader, matching the scholarly tradition hierarchy:

| Group | Tabs | Data files |
|---|---|---|
| Primary | काशिका, वार्तिकम्, महाभाष्यम्, CS Vasu Eng | kashika.txt, vartika.txt, bhashya.txt, vasu_english.txt |
| Notes | Our notes / Your notes | Phase 4 placeholder (Google Drive) |
| Kaumudi | सिद्धान्तकौमुदी, लघुकौमुदी, बालमनोरमा | kaumudi.txt, laghukaumudi.txt, balamanorama.txt |
| Tika | तत्त्वबोधिनी, न्यासः, पदमञ्जरी, प्रौढमनोरमा | tattvabodhini.txt, nyaas.txt, padamanjari.txt, praudhamanorama.txt |

`kaumudi.txt` = Siddhanata Kaumudi (NOT Laghu Kaumudi)
`laghukaumudi.txt` = Laghu Kaumudi

The full `paniniyam-data` repo is 3GB but the site uses ~10MB of it.

## Key Architecture Decisions

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

### Nav book types
- `'adhyaya-tree'` — Ashtadhyayi (8 adhyayas × 4 padas)
- `'lazy-gana-tree'` — Dhatupatha (10 ganas, sections loaded lazily)
- `'leaf'` — single click loads the whole book
- `'about-menu'` — opens about drawer (no sub-nav in tree)

### Lazy loading
- `loadData(key, path)` fetches once, caches in `bookData[key]`
- Tab panels: `panel._loaded = true` set before `await` to prevent double-fetch
- Audio: cached per pada key in `audioCache`; base64 data URIs played via `new Audio(uri)`

### Cache busting
- `index.html` loads `app.js?v=N` and `style.css?v=N`
- Bump `N` in both `<script>` and `<link>` tags whenever pushing changes users must see

## Fonts
- **Vesper Libre** — Sanskrit / Devanagari text (sutra text, commentary, meta block, nav labels)
- **Noto Sans Devanagari** — fallback for Indic scripts
- **Noto Sans** — UI chrome (tabs, badges, English labels)
- All loaded from Google Fonts

## Deployment

**Only 4 files needed** — data comes from CDN automatically in production:
```
index.html
css/style.css
js/app.js
js/sanscript.js
```

Upload to any static host (Netlify, GitHub Pages, any web server). The `isLocal` flag
will be `false` for a real domain so data fetches from `cdn.jsdelivr.net/gh/ashtadhyayi-com/data@main`.

**If you want self-hosted data**: copy only the files listed above (~10MB), place in `data/`
folder alongside the site files, change the production `DATA_BASE` URL in `app.js` to `'data'`.

**Do not upload**: `audio/` (336MB), `mahabhashyam/`, `courses/`, `bhushanasara/` and
other folders not fetched by the app.

## Local Dev

```bash
cd /Users/au/Projects/paniniyam
python3 -m http.server 7771
```

Accessible on local network at `http://<your-mac-ip>:7771`

---

## Roadmap & Vision

This is not just a reference site — a **living Sanskrit study platform** with the
owner's scholarly voice layered on top of the open data.

### Content Layers (planned)
| Layer | Source | Status |
|---|---|---|
| Sutra text + metadata | ashtadhyayi.com (open) | ✅ Live |
| Kashika, Kaumudi | ashtadhyayi.com (open) | ✅ Live |
| Audio pronunciation | ashtadhyayi.com (open) | ✅ Live |
| English meanings | Owner's own writing | 🔜 Phase 2 |
| Acharya Sudarshandev commentary | Owner's own content | 🔜 Phase 2 |
| YouTube video embeds | Owner's YouTube channel | 🔜 Phase 3 |
| Excalidraw visual diagrams | Owner's Obsidian vault (SVG exports) | 🔜 Phase 3 |
| User notes | Per-user via Gmail login | 🔜 Phase 4 |

### Excalidraw / Obsidian Integration (decided)
- **Static SVG exports only** — no live Excalidraw embeds
- Obsidian vault already auto-exports SVGs (`excalidraw-autoexport: svg`)
- Workflow: update diagram in Obsidian → export SVG → replace file in site folder
- SVGs embedded inline or as `<img>` tags per sutra page

### Gmail Login / Notes (planned)
- Google OAuth — no password management needed
- Notes saved to **user's own Google Drive** via Drive API — owner never stores user data
- Privacy selling point: *"Your notes live in your Google Drive, not our servers"*
- Purely client-side, no backend server required

### Sutra Reader — backbone built (v13)
The layout has been rebuilt from a two-panel browser to a reader-first design:

**Layout:**
- No fixed header or sidebar
- `#app` fills viewport, padding-top accounts for 50px top bar; scrolls content
- Fixed **top** navigation bar (50px, dark) at top (`#bottom-bar` ID kept for compat)
- Fixed 34px icon bar on left side (below top bar) — always visible collapsed nav

**Top bar buttons (left → right):**
- `≡` (btn-nav) — opens nav drawer (left slide-in)
- `🔍` (btn-search) — opens search drawer (right slide-in), results inside drawer
- `◀` (btn-prev) — previous sutra in current pada
- `[ref]` (bar-ref) — shows current sutra (e.g. `1.1.3`); click to toggle reader ↔ list
- `▶` (btn-next) — next sutra
- `Aa` (btn-script) — opens script drawer
- `ℹ` (btn-about) — opens about panel (full main panel, not drawer)

**Icon bar (34px fixed strip left, below top bar):**
- Shows Devanagari first-letter of each book (शिव, अष्ट०, धातु, गण, उणा, लिङ्, शि०, फिट्, ℹ)
- Same Vesper Libre .92em 700 style as nav-book-btn — visual continuity with expanded nav
- Hover (desktop) → opens nav drawer with 320ms delay; nav drawer mouseleave closes after 380ms
- Click → always opens nav drawer

**Drawers (slide-in panels, start below top bar):**
- `drawer-nav` (left, 340px) — full nav tree (same structure as old sidebar)
- `drawer-search` (right) — search input + result list; clicking result → reader
- `drawer-script` (right) — `<select>` dropdown for script selection

**Reader panel (`#panel-reader`):**
- Built by `renderReaderSutra(sutra)` — rebuilt on every navigation
- Top row: sutra reference + type badge + audio button
- Large sutra text (2.1em, Vesper Libre)
- Grammatical meta block (padaccheda, anuvritta, adhikara, ss)
- Tab bar (Kashika | Kaumudi) with lazy-loaded commentary

**Reader state:**
```javascript
readerList  = [];   // sutras in current pada (for prev/next)
readerIdx   = -1;   // position in readerList
readerSutra = null; // currently displayed sutra
```

**Navigation:**
- Pada selected from nav drawer → reader opens at sutra 1, drawer closes
- `gotoSutra(id)` — navigates to any sutra in reader; rebuilds pada list
- Keyboard `←` / `→` — prev/next sutra when no drawer is open
- `bar-ref` click — toggles between reader mode and list view for same pada
- `Escape` — closes active drawer

**Panels:**
- `welcome` — landing (shown on init)
- `reader` — sutra reader (primary for Ashtadhyayi)
- `list` — card list (Ashtadhyayi secondary view + all leaf books)

### OCR-Digitized Books (planned — Phase 6)
Owner has an OCR workflow for digitizing Sanskrit books. Several commentaries are being
prepared this way and will be added as additional tabs on sutra cards:

| Commentary | Notes |
|---|---|
| Kashika Vritti | Owner's own OCR — may supplement/replace current open-data version |
| Pravachanam | OCR digitized |
| Jingyasu Prathamavrutti | OCR digitized |

**Integration approach**: Same `renderCommentaryHTML()` pipeline as Kashika/Kaumudi.
The `<<sutra text>>` and `[[७.२.१]]` markup can be inserted during OCR post-processing.
Each book becomes a new entry in `SUTRA_TABS` and a new data file under `sutraani/`.

### Roadmap Phases
```
Phase 1   → Reader mode + bottom nav bar redesign
Phase 2   → Owner's English meanings + Acharya Sudarshandev commentary
Phase 3   → YouTube video embeds + Excalidraw SVG diagrams per sutra
Phase 4   → Gmail login + personal notes saved to Google Drive
Phase 5   → Additional commentaries (Vartika, Nyasa, Padamanjari, Vasu English etc.)
Phase 6   → Owner's OCR-digitized books: Kashika Vritti, Pravachanam, Jingyasu Prathamavrutti
```
