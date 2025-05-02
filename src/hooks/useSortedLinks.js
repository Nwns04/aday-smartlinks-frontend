// hooks/useSortedLinks.js
import { useMemo } from 'react';
import { getPlatformCategory } from '../utils/platformHelpers';

export default function useSortedLinks(smartLinks = {}, geo, device, activeTab) {
  return useMemo(() => {
    let priority = null;
    if (geo?.country === "NG") priority = "spotify";
    else priority = "boomplay";
    if (device === "ios") priority = "apple";
    if (device === "android") priority = "spotify";

    const filtered = Object.entries(smartLinks).filter(([, url]) => url);
    const sorted = [...filtered].sort(([a], [b]) => {
      if (a === priority) return -1;
      if (b === priority) return 1;
      return 0;
    });

    return sorted.filter(([platform]) =>
      activeTab === "all" ? true : getPlatformCategory(platform) === activeTab
    );
  }, [smartLinks, geo, device, activeTab]);
}
