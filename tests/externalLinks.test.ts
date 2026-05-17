import { describe, expect, it } from 'vitest';
import { isHttpsExternalUrl, openExternalHttpsUrl } from '../src/platform/externalLinks';

describe('external links', () => {
  it('allows only https URLs for external policy links', () => {
    expect(isHttpsExternalUrl('https://hhy0111.github.io/hero-sword/privacy-policy.html')).toBe(true);
    expect(isHttpsExternalUrl('http://hhy0111.github.io/hero-sword/privacy-policy.html')).toBe(false);
    expect(isHttpsExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isHttpsExternalUrl('not a url')).toBe(false);
  });

  it('opens https external URLs in a separate browser target', () => {
    const calls: Array<{ url: string; target: string; features: string }> = [];
    const opened = openExternalHttpsUrl(
      'https://hhy0111.github.io/hero-sword/privacy-policy.html',
      (url, target, features) => {
        calls.push({ url, target, features });
        return {};
      },
    );

    expect(opened).toBe(true);
    expect(calls).toEqual([
      {
        url: 'https://hhy0111.github.io/hero-sword/privacy-policy.html',
        target: '_blank',
        features: 'noopener,noreferrer',
      },
    ]);
  });

  it('does not open unsafe external URLs', () => {
    const calls: string[] = [];
    const opened = openExternalHttpsUrl('javascript:alert(1)', (url) => {
      calls.push(url);
      return {};
    });

    expect(opened).toBe(false);
    expect(calls).toEqual([]);
  });
});
