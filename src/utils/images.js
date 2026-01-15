const hasExtension = (value) => /\.[a-z0-9]+$/i.test(value || "");

export const buildSrcSet = (src, widths = [640, 1024]) => {
  if (!src || !hasExtension(src)) return "";
  const match = src.match(/^(.*)(\.[a-z0-9]+)$/i);
  if (!match) return "";
  const [, base, ext] = match;
  const entries = widths.map((width) => `${base}-${width}${ext} ${width}w`);
  return entries.join(", ");
};

export const appendFallbackSrcSet = (srcSet, src, width = 1600) => {
  if (!src) return srcSet || "";
  if (!srcSet) return `${src} ${width}w`;
  return `${srcSet}, ${src} ${width}w`;
};
