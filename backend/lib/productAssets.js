import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PRODUCTS_ROOT = path.resolve(__dirname, '../../products');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export function getProductImages(relativePath) {
  const dir = path.join(PRODUCTS_ROOT, ...relativePath.split('/'));
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => {
      const urlPath = relativePath.split('/').map(encodeURIComponent).join('/');
      return `/media/products/${urlPath}/${encodeURIComponent(file)}`;
    });
}
