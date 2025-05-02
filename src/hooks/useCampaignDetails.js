// src/hooks/useCampaignDetail.js
import { useEffect, useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import API from "../services/api";
import { PUBLIC_VAPID_KEY } from "../config";
import { AuthContext } from "../context/AuthContext";
import WorkspaceContext from "../context/WorkspaceContext";

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const raw = window.atob(base64Safe);
  const buffer = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) buffer[i] = raw.charCodeAt(i);
  return buffer;
}

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

export default function useCampaignDetail(slug, timeRange) {
  const { user } = useContext(AuthContext);
  const { current: workspace } = useContext(WorkspaceContext);

  const [lastEdit, setLastEdit] = useState(null);

  const buildUrl = (base) => {
    let url = `${base}?range=${timeRange}`;
    if (workspace?._id) url += `&workspace=${workspace._id}`;
    return url;
  };

  // 🎯 Fetch Campaign Details
  const {
    data: campaign,
    isLoading: campaignLoading,
    isError: campaignError,
    refetch: refetchCampaign,
  } = useQuery({
    queryKey: ["campaignDetail", slug, timeRange, workspace?._id],
    queryFn: async () => {
      const workspaceId = workspace?._id;
      const res = await API.get(
        `/campaigns/analytics/detail/${slug}?range=${timeRange}` +
        (workspaceId ? `&workspace=${workspaceId}` : '')
      );
      return res.data;
    },    
    enabled: Boolean(slug && user),
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 2,
  });

  // 🎯 Fetch Click Timeline
  const {
    data: clickTimeline = [],
    isLoading: timelineLoading,
    isError: timelineError,
    refetch: refetchTimeline,
  } = useQuery({
    queryKey: ["campaignTimeline", slug, timeRange, workspace?._id],
    queryFn: async () => {
      const workspaceId = workspace?._id;
      const res = await API.get(
        `/campaigns/timeline/${slug}?range=${timeRange}` +
        (workspaceId ? `&workspace=${workspaceId}` : '')
      );
      return res.data;
    },
    
    enabled: Boolean(slug && user),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // 🎯 Web Push Registration
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !user?.isPremium) return;
    // ask for notification permission if we haven't yet
  if (Notification.permission === "default") {
       Notification.requestPermission().catch(console.error);
     }
     if (Notification.permission !== "granted") return;   // quietly skip

    navigator.serviceWorker.register("/sw.js")
      .then(reg => reg.pushManager.getSubscription()
        .then(sub => sub || reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        }))
      )
      .then(subscription => {
        return API.post("/api/push/subscribe", {
          campaignId: slug,
          subscription,
        });
      })
      .catch(console.error);
  }, [slug, user]);

  // 🎯 Real-time Click Toasts
  useEffect(() => {
    if (!slug) return;

    socket.emit("joinCampaign", slug);
    socket.on("click", ({ at, ip }) => {
      toast(`👆 New click at ${new Date(at).toLocaleTimeString()} from ${ip}`, {
        duration: 4000,
      });
    });

    return () => {
      socket.off("click");
      socket.emit("leaveCampaign", slug);
    };
  }, [slug]);

  return {
    user,
    campaign,
    clickTimeline,
    loading: campaignLoading || timelineLoading,
    setLastEdit,
    lastEdit,
    refetchCampaign,
    refetchTimeline,
    error: campaignError || timelineError,
  };
}
