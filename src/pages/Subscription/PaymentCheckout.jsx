// src/pages/CheckoutPage.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// You can pull this from a shared constants file if you like
const FEATURES = [
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

const CheckoutPage = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // On mount, read which plan the user selected
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingPlan");
    if (!pending) {
      navigate("/price", { replace: true });
    } else {
      setPlan(pending);
      sessionStorage.removeItem("pendingPlan");
    }
  }, [navigate]);

  const handleEssential = async () => {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const { data: { user: updated } } = await API.post(
        "/api/subscribe/essential",
        { email: stored.email }
      );
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("✅ Your 14-day trial is active! Check your email for details.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start trial");
    } finally {
      setLoading(false);
    }
  };

  const handlePremium = async () => {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const { data } = await API.post("/payment/initiate", {
        email: stored.email,
        plan: "premium",
      });
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <div className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-12">
      {plan === "essential" ? (
        <>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Essential Plan — 14-Day Free Trial
          </h1>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Try all Essential features free for 14 days. No credit card required.
          </p>
          <ul className="mb-6 list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200">
            {FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button
            onClick={handleEssential}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? "Activating…" : "Activate 14-Day Trial"}
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Premium Plan — $19/month
          </h1>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Everything in Essential, plus these pro features:
          </p>
          <ul className="mb-6 list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200">
            {FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
            {PREMIUM_ONLY.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button
            onClick={handlePremium}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? "Redirecting…" : "Upgrade to Premium"}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
