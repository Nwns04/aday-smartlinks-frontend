import { useMemo } from 'react';

/**
 * Given a base service links object and a campaign slug,
 * returns an object mapping each platform -> tracked URL.
 */
export default function useSmartLinks(serviceLinks = {}, slug) {
  return useMemo(() => {
    if (!slug) return {};

    const buildLink = (platform, baseUrl) => {
      if (!baseUrl) return null;
      try {
        const url = new URL(baseUrl);
        const utm = new URLSearchParams({
          utm_source: 'smartlink',
          utm_medium: platform,
          utm_campaign: slug,
          ref: slug,
          source: 'landing_page',
        });
        // preserve any existing params
        url.searchParams.forEach((v, k) => {
          if (!utm.has(k)) utm.set(k, v);
        });
        return `${url.origin}${url.pathname}?${utm.toString()}`;
      } catch {
        return baseUrl;
      }
    };

    const result = {};
    Object.entries(serviceLinks).forEach(([platform, url]) => {
      result[platform] = buildLink(platform, url);
    });
    return result;
  }, [serviceLinks, slug]);
}
