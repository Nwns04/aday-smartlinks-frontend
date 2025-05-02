import React, { createContext, useEffect } from 'react';
import API from '../services/api';

export const PushContext = createContext();

export function PushProvider({ children }) {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    if (Notification.permission === "denied") {
      if (process.env.NODE_ENV === "development") {
        console.warn("🚫 Notifications are blocked by the user.");
      }
      return;
    }

    navigator.serviceWorker.register('/sw.js').then(async reg => {
      const sub = await reg.pushManager.getSubscription();
      if (sub) return;

      try {
        const res = await API.get('/api/push/vapidPublic', {
          responseType: 'text',
          transformResponse: res => res, // prevent Axios from parsing it as JSON
        });

        const newSub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(res.data)
        });

        await API.post('/api/push/subscribe', {
          campaignSlug: window.location.pathname.split('/').pop(),
          subscription: newSub
        });

        console.log("✅ Push subscription registered.");
      } catch (err) {
        console.error("❌ Push subscription failed:", err.message);
      }
    });
  }, []);

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return <PushContext.Provider value={{}}>{children}</PushContext.Provider>;
}
