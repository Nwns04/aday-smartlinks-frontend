import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import API from '../services/api';

export default function useSlugAvailability(initial = '') {
  const [slug, setSlug]         = useState(initial);
  const [available, setAvailable] = useState(null);
  const [loading, setLoading]     = useState(false);

  const checkSlugAvailability = useCallback(
    debounce(async (s) => {
      if (!s) {
        setAvailable(null);
        return;
      }
      setLoading(true);
      try {
        const { data } = await API.get(`/campaigns/check-slug/${s}`);
        setAvailable(data.available);
      } catch {
        setAvailable(false);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    checkSlugAvailability(slug);
  }, [slug, checkSlugAvailability]);

  return {
    slug,
    slugAvailable: available,  // use your `available` state
    slugLoading:   loading,    // use your `loading` state
    setSlug,
    checkSlugAvailability,
  };
}
