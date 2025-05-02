// src/pages/PremiumCheckout.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ESSENTIAL = [
  "Unlimited Smart Links",
  "Email Capture & Export",
  "Basic Analytics Dashboard",
  "Unlimited Campaigns",
];
const PREMIUM_ONLY = [
  "Custom Domain & Branding",
  "Spotify UPC Lookup & Auto-fill",
  "Audience Retargeting",
  "Advanced Geo & Device Insights",
  "Fan Funnel Analytics",
  "Priority Customer Support",
  "Team Members (up to 5 users)",
  "API Access",
];

export default function PremiumCheckout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('pendingPlan') !== 'premium') {
      navigate('/price', { replace: true });
    }
  }, [navigate]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/payment/initiate", {
        email: user.email,
        plan: "premium",
      });
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow mt-16">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Premium Plan — $19/month
      </h1>
      <ul className="list-disc list-inside mb-6 text-gray-800 dark:text-gray-200">
        {ESSENTIAL.map(f => <li key={f}>{f}</li>)}
        {PREMIUM_ONLY.map(f => <li key={f}>{f}</li>)}
      </ul>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? "Redirecting…" : "Pay $19 / month"}
      </button>
    </div>
  );
}
