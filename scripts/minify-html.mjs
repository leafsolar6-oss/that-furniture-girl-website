/* minify-html.mjs — collapse inter-tag whitespace in built HTML (postbuild).
   Leaves <script>, <style>, <pre>, <textarea> contents untouched. */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = 'dist';
const guard = /(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<pre[\s\S]*?<\/pre>|<textarea[\s\S]*?<\/textarea>|<!--[\s\S]*?-->)/gi;
let count = 0, saved = 0;
for (const f of await readdir(dist)) {
  if (!f.endsWith('.html')) continue;
  const file = join(dist, f);
  const src = await readFile(file, 'utf8');
  const out = src.split(guard).map((chunk, i) => {
    if (i % 2 === 1) return chunk; // protected block
    return chunk
      // a newline INSIDE a text node is a word separator — keep one space
      // (the blanket strip below glued "send.\n    Nothing" into "send.Nothing")
      .replace(/([^>\s])\s*\n\s*([^<\s])/g, '$1 $2')
      // pure inter-tag newlines collapse as before
      .replace(/\s*\n\s*/g, '')
      .replace(/>\s{2,}</g, '> <');
  }).join('');
  if (out.length < src.length) {
    await writeFile(file, out);
    saved += src.length - out.length; count++;
  }
}
console.log(`minified ${count} html files, saved ${(saved / 1024).toFixed(0)} KB`);
