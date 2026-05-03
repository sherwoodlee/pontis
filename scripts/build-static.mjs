import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

await mkdir(dist, { recursive: true });

for (const file of ['index.html', 'main.js', 'style.css']) {
  await copyFile(resolve(root, file), resolve(dist, file));
}

console.log('Built Pontis static app in dist/');
