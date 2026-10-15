/* Conservative CSS minifier for the built stylesheet: comments out,
   whitespace collapsed, spaces around punctuation removed. Values that
   rely on spaces (box-shadow, grid tracks) are untouched. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist/assets/css';
for (const f of readdirSync(dir).filter((n) => n.endsWith('.css'))) {
  const p = join(dir, f);
  const before = readFileSync(p, 'utf8');
  const css = before
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
  writeFileSync(p, css);
  console.log(`minified ${f}: ${before.length} -> ${css.length} bytes`);
}
