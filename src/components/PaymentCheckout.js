// src/components/PaymentCheckout.js
import React, { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // On mount, pull pendingPlan out of sessionStorage
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingPlan");
    if (!pending) {
      // No plan means they navigated here directly → send them back to pricing
      navigate("/price", { replace: true });
    } else {
      setPlan(pending);
      sessionStorage.removeItem("pendingPlan");
    }
  }, [navigate]);

  // Confirm 14-day trial for Essential
  const handleEssential = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const {
        data: { user: updatedUser },
      } = await API.post("/api/subscribe/essential", {
        email: storedUser.email,
      });
      // Sync context + storage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("🎉 14-day trial activated! Check your email for details.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start trial");
    } finally {
      setLoading(false);
    }
  };

  // Kick off Paystack for Premium
  const handlePremium = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const { data } = await API.post("/payment/initiate", {
        email: storedUser.email,
        plan: "premium",
      });
      // redirect to Paystack checkout
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Paystack init error:", err);
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  // Until we know the plan, render nothing (or a spinner)
  if (!plan) return null;

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg mt-12">
      {plan === "essential" ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Start Your 14-Day Trial</h2>
          <p className="mb-6">
            Enjoy all Essential features free for 14 days—no credit card required.
          </p>
          <button
            onClick={handleEssential}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Activating…" : "Activate 14-Day Trial"}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
          <p className="mb-6">
            Unlock custom domains, advanced analytics, and more for $19/month.
          </p>
          <button
            onClick={handlePremium}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Redirecting…" : "Pay $19 / month"}
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentCheckout;
