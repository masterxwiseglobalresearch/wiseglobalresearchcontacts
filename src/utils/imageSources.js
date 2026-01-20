// Utility helpers to construct responsive image srcSet strings for generated assets
// Assumes generate-images.js produced <name>-<width>.webp / .avif in public/assets/images

const WIDTHS = [32,64,96,112,128,256,400,800,1200,1600];

export function buildSrcSet(name, ext) {
  return WIDTHS.map(w => `/assets/images/${name}-${w}.${ext} ${w}w`).join(', ');
}

export function buildPlaceholder(name, ext='webp') {
  return `/assets/images/${name}-32.${ext}`;
}

export function largest(name, ext='webp') {
  return `/assets/images/${name}-1600.${ext}`;
}

export function pictureSources(name) {
  return {
    avif: buildSrcSet(name, 'avif'),
    webp: buildSrcSet(name, 'webp'),
    fallback: `/assets/images/${name}.png`
  };
}
