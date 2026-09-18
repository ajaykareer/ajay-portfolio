import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Originals stay available; pages request only these optimized variants.
const images = [
  ['ajay-linkedin.jpg', 800, 84],
  ['akk-9a32c0fd.jpg', 1280, 82],
  ['weather-69c3ec64.jpg', 1280, 82],
  ['davosbet-2ba74307.jpg', 1280, 84],
];
let original = 0;
let optimized = 0;
for (const [file, width, quality] of images) {
  const source = new URL(`../public/projects/${file}`, import.meta.url);
  const name = file.replace(/\.[^.]+$/, '');
  for (const target of [width, file.startsWith('ajay') ? 400 : 640]) {
    const output = new URL(
      `../public/projects/${name}-${target}.webp`,
      import.meta.url,
    );
    await sharp(fileURLToPath(source))
      .rotate()
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(fileURLToPath(output));
    const info = await stat(output);
    if (target === width) optimized += info.size;
    console.log(`${name}-${target}.webp: ${info.size} bytes`);
  }
  original += (await stat(source)).size;
}
console.log(
  JSON.stringify({
    originalBytes: original,
    optimizedBytes: optimized,
    reduction: `${Math.round((1 - optimized / original) * 100)}%`,
  }),
);
