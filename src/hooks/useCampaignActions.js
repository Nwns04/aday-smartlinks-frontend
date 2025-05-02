// src/hooks/useCampaignActions.js
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API from "../services/api";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function useCampaignActions(slug, campaign) {
  // 🚀 1. Handle Export
  const handleExport = (type) => {
    const endpoint =
      type === "emails"
        ? `${API_BASE}/campaigns/export/emails/${campaign.slug}`
        : `${API_BASE}/campaigns/export/analytics/${campaign.slug}`;
    window.open(endpoint, "_blank");
  };

  // 🚀 2. Handle Send Blast using useMutation
  const sendBlastMutation = useMutation({
    mutationFn: async ({ subject, html }) => {
      const { data } = await API.post(`/campaigns/${slug}/send-blast`, { subject, html });
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Sent to ${data.count} subscribers`);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to send email blast");
    }
  });

  // 🚀 3. The blast trigger (wrapper)
  const handleSendBlast = async () => {
    const subject = prompt("Email subject", `News from ${campaign.title}`);
    if (!subject) return;

    const html = prompt("Email body (HTML)", `<p>Hey there—check out our latest update!</p>`);
    if (html == null) return;

    sendBlastMutation.mutate({ subject, html });
  };

  return { handleExport, handleSendBlast, sendingBlast: sendBlastMutation.isLoading };
}
