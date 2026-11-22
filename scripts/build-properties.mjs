/**
 * Legacy Cobalt Fieldnotes page builder retired in v3.
 *
 * All OVR v3 pages are generated from data/properties.json and data/prices.json
 * by scripts/build-v3.py into /v3-preview/ (until sign-off).
 * This script intentionally does NOT overwrite live root HTML pages with the old theme.
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
execFileSync('python', [path.join(root, 'scripts', 'build-v3.py')], { cwd: root, stdio: 'inherit' });
