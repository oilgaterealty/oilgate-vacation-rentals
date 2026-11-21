// Builds the five static design samples into /samples/. Run: node scripts/samples/build.mjs
import { writeFileSync } from 'node:fs';
import { page } from './shared.mjs';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['s1', 's2', 's3', 's4', 's5'];
const out = new URL('../../samples/', import.meta.url);
for (const id of ids) {
  const s = (await import(`./${id}.mjs`)).default;
  writeFileSync(new URL(s.file, out), page(s));
  console.log('built', s.file);
}
