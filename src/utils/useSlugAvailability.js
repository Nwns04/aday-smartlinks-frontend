import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import debounce from 'lodash.debounce';

export default function useSlugAvailability(initial = '') {
  const [slug, setSlug]     = useState(initial);
  const [status, setStatus] = useState('idle'); 
  // idle | checking | available | taken | error

  const check = useCallback(debounce(async (value) => {
    if (!value) {
      setStatus('idle');
      return;
    }
    setStatus('checking');
    try {
      const { data } = await API.get(`/campaigns/check-slug/${value}`);
      setStatus(data.available ? 'available' : 'taken');
    } catch {
      setStatus('error');
    }
  }, 300), []);

  useEffect(() => {
    // normalize into URL-safe slug
    const clean = slug
      .toLowerCase()
      .replace(/[*+~.()'"!:@]/g,'')
      .replace(/\s+/g,'');
    if (clean !== slug) setSlug(clean);
    check(clean);
  }, [slug, check]);

  return { slug, setSlug, status };
}
