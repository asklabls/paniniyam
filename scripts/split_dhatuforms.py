#!/usr/bin/env python3
"""
split_dhatuforms.py
Splits dhatuforms_vidyut_shuddha_kartari.txt into per-dhatu JSON files
at data/dhatu/forms/{baseindex}.json

Run from the paniniyam project root:
  python3 scripts/split_dhatuforms.py

Re-runs only if source file is newer than the output folder.
Force full regeneration:
  python3 scripts/split_dhatuforms.py --force
"""

import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR     = PROJECT_ROOT / 'data'
SRC_FILE     = DATA_DIR / 'dhatu' / 'dhatuforms_vidyut_shuddha_kartari.txt'
OUT_DIR      = PROJECT_ROOT / 'forms' / 'dhatu'
FORCE        = '--force' in sys.argv


def main():
    if not DATA_DIR.exists():
        print(f'ERROR: data/ directory not found at {DATA_DIR}')
        print('Make sure the symlink exists: data -> /Users/au/Projects/paniniyam-data')
        sys.exit(1)

    if not SRC_FILE.exists():
        print(f'ERROR: source file not found: {SRC_FILE}')
        sys.exit(1)

    # Skip if already up to date
    if not FORCE and OUT_DIR.exists():
        existing = list(OUT_DIR.glob('*.json'))
        if existing:
            out_mtime = max(f.stat().st_mtime for f in existing)
            src_mtime = SRC_FILE.stat().st_mtime
            if src_mtime <= out_mtime:
                print(f'Up to date ({len(existing)} files) — skipping.')
                print('Use --force to regenerate.')
                return

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f'Loading {SRC_FILE.name}…', end=' ', flush=True)
    with open(SRC_FILE, encoding='utf-8') as f:
        data = json.load(f)
    total = len(data)
    print(f'{total} dhatus')

    print(f'Writing to {OUT_DIR}…')
    count = 0
    for baseindex, forms in data.items():
        out_file = OUT_DIR / f'{baseindex}.json'
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(forms, f, ensure_ascii=False, separators=(',', ':'))
        count += 1
        if count % 500 == 0:
            print(f'  {count}/{total}…')

    print(f'Done — {count} files written.')
    print()
    print('NOTE: For production these files need a CDN.')
    print('      Currently works locally via the data/ symlink.')
    print('      Suggested: push to Cloudflare R2 or a separate GitHub repo.')


if __name__ == '__main__':
    main()
