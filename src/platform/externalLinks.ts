export type ExternalLinkOpener = (url: string, target: string, features: string) => unknown;

const SAFE_EXTERNAL_TARGET = '_blank';
const SAFE_EXTERNAL_FEATURES = 'noopener,noreferrer';

export function isHttpsExternalUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

export function openExternalHttpsUrl(url: string, opener: ExternalLinkOpener = defaultExternalLinkOpener): boolean {
  if (!isHttpsExternalUrl(url)) {
    return false;
  }

  return opener(url, SAFE_EXTERNAL_TARGET, SAFE_EXTERNAL_FEATURES) !== null;
}

function defaultExternalLinkOpener(url: string, target: string, features: string): unknown {
  if (typeof window === 'undefined' || typeof window.open !== 'function') {
    return null;
  }

  return window.open(url, target, features);
}
