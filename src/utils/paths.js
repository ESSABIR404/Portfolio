const BASE_URL = import.meta.env.BASE_URL || "/";

const normalizeBase = (base) => (base.endsWith("/") ? base : `${base}/`);
const base = normalizeBase(BASE_URL);

const isExternalUrl = (value) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value);
const stripLeadingSlash = (value) => value.replace(/^\/+/, "");

export const withBase = (value = "") => {
  if (!value) return base;
  if (isExternalUrl(value)) return value;
  return `${base}${stripLeadingSlash(value)}`;
};

export const assetUrl = (value = "") => {
  if (isExternalUrl(value)) return value;
  return withBase(`assets/${stripLeadingSlash(value)}`);
};

export const routeUrl = (value = "") => {
  if (isExternalUrl(value)) return value;
  return withBase(stripLeadingSlash(value));
};

export const normalizePathname = (pathname = "/") => {
  if (base === "/") return pathname || "/";
  const basePath = base.endsWith("/") ? base.slice(0, -1) : base;
  if (pathname.startsWith(basePath)) {
    const next = pathname.slice(basePath.length);
    return next || "/";
  }
  return pathname || "/";
};
