# Vidyut — Brainstorming Notes
**Date:** 2026-06-01
**Repo:** https://github.com/ambuda-org/vidyut
**Org:** https://ambuda.org — non-commercial, volunteer-run digital Sanskrit library

**See also:** `brainstorm-prakriya-pedagogy.md` — the full pedagogical vision,
the four requirements, implementation phases, and the generational preservation mission.

---

## What Vidyut Is

A Rust-based Sanskrit language processing toolkit with 9 crates:
- **vidyut-prakriya** — the prakriya (derivation) engine (the interesting one)
- vidyut-kosha — word lookup/storage
- vidyut-lipi — transliteration
- vidyut-chandas — metrical analysis (experimental)
- vidyut-cheda — text segmentation
- vidyut-sandhi — sandhi processing
- vidyut-akshara — character/script handling
- vidyut-data — linguistic data
- bindings-python — Python interface via PyO3

MIT licensed. Python bindings available. **WebAssembly bindings available** — this is how ashtadhyayi.com uses it in the browser.

Latest release: py-0.4.0 (Jan 2025). Active development.

---

## Coverage

| Feature | Support level |
|---|---|
| Subanta (nominal declension) | Excellent |
| Tiṅanta (verb conjugation) | Excellent |
| Kṛdanta (participles) | Excellent |
| Taddhitānta (secondary nominals) | Good |
| Samāsa (compounds) | Moderate |
| Svara / Accent | **Weak** |
| Chandas (meter) | Experimental |

Implements 2000+ rules from the Ashtadhyayi. Long-term goal is complete coverage — admission that gaps exist.

---

## Rule Ordering: Ashtadhyayi order, NOT Siddhanta Kaumudi order

Code modules are organized by Panini sutra address:
- `angasya` → 6.4.1
- `krt` → 3.1.91
- `tripadi` → 8.2–8.4

Design philosophy: "a user should be able to know exactly what order we apply rules in just by reading our source code."

So the owner's guess about "Siddhanta Kaumudi parampara" is **structurally incorrect** — the code follows Ashtadhyayi order. But the *priorities* of the implementers (excellent classical Sanskrit, weak Vedic accent) do reflect a classical/post-Vedic bias that is more characteristic of the SK tradition than the full Paninian system.

---

## The Svara Gap — The Core Issue

Panini's Ashtadhyayi handles TWO parallel systems:
1. **Morphological derivation** (pada formation) — what Vidyut does well
2. **Svara (accent) assignment** — what Vidyut does weakly

Svara rules are primarily in:
- 6.1.159–212
- 6.2.27–187
- Scattered through chapters 3–5 (taddhita accent)
- Chapter 8 (pada-level accent)

Vidyut has a `svara.rs` module but it is incomplete. The Vedic recitation tradition (including svarita, udatta, anudatta distinctions) requires a complete svara engine to be truly faithful to Panini.

**Why svara was deprioritized:** Classical Sanskrit dropped tonal accent almost entirely. If your goal is "derive गच्छति correctly," svara doesn't matter. If your goal is "recite the Vedas correctly" or "teach complete Paninian grammar," svara is essential.

---

## The Ambuda Team's Tradition

Ambuda is non-commercial, academic, volunteer-run. Their orientation:
- Digital library / preservation focused
- Computational linguistics approach
- Classical Sanskrit priority (not Vedic/accent)
- Influenced by traditions that use SK order pedagogically (Bhatoji Diksita lineage)

They are NOT the Vedic recitation tradition. They are the "computational grammar for classical Sanskrit NLP" tradition.

---

## Integration Options for Paniniyam

### Option A: Integrate Vidyut WASM as-is (tractable, high value)
- Use the existing WASM bindings (same as ashtadhyayi.com does)
- Add a "Prakriya" tab to the sutra reader: show step-by-step derivation for any example word
- Show which rules fired in what order — link each step to the sutra in the reader
- **Effort:** Medium. WASM loads in browser, JS API exists, need to wire to UI
- **Limitation:** No svara output

### Option B: Contribute svara to Vidyut (very big, research-grade)
- Implement the missing svara rules in Rust
- This requires deep knowledge of Panini's accent rules AND Rust
- Would need scholarly validation
- **Effort:** PhD-level, years of work
- **Reward:** Would be the only complete Paninian prakriya engine in existence

### Option C: Build a parallel svara layer on top of Vidyut (big, novel)
- Use Vidyut for morphological derivation
- Add a separate svara assignment layer that takes Vidyut's output and applies accent rules
- Potentially in Python or JavaScript rather than Rust
- Could be done incrementally — start with the most common patterns
- **Effort:** Large but tractable in stages
- **Reward:** Novel contribution, aligns with owner's Vedic tradition

### Option D: Document the gap, focus on Paniniyam integration (near term)
- Integrate Vidyut WASM for derivation display (Option A)
- Clearly note "svara not yet implemented" in the UI
- Publish the svara gap as a research agenda
- **Effort:** Low-medium
- **Best near-term choice**

---

## Owner's Insight Validated

The owner's instinct — "I don't think it includes svara" — is **correct**.

The owner's instinct — "academic scholars of Siddhanta Kaumudi parampara" — is **partially correct in spirit** (classical bias, SK-influenced priorities) but **incorrect in structure** (code follows Ashtadhyayi order).

The owner's framing — "Panini system deals with both regular word derivations AND svara prakriya" — is **exactly right** and identifies the gap precisely.

---

## Is This Worth Pursuing?

**Short answer: Yes, but in stages.**

**Near term (months):**
Integrate Vidyut WASM into Paniniyam for interactive derivation. This is high-value, tractable, and the infrastructure already exists. Each sutra card could show "Example derivations using this rule" — powered by Vidyut.

**Medium term (1–2 years):**
Option C — a svara layer. Start with the most pedagogically important accent patterns. Document the sutra references. Build incrementally.

**Long term (research project):**
Option B — contribute complete svara to Vidyut itself. This would be a landmark contribution to Sanskrit computational linguistics. The owner's background in the living recitation tradition (vs. academic computational tradition) is exactly the right combination to drive this.

**The unique angle:**
Most Vidyut contributors come from computer science + Sanskrit. The owner comes from the living Vedic recitation tradition with direct guru lineage. That combination — traditional knowledge of how svara actually works in practice + a software platform to implement it — is rare and valuable.

---

## Open Questions

1. Does the owner's tradition use a specific svara text/system (e.g., Rigvedic, Yajurvedic, or Paniniya-Shiksha based)?
2. Is there an existing formalization of the svara rules in a machine-readable form anywhere?
3. Would contributing to Vidyut (their repo) be preferred, or building an independent svara engine?
4. What is the pedagogical priority — show svara for Vedic forms, or for all Sanskrit derivations?
