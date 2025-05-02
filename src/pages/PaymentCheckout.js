// src/components/PaymentCheckout.js
import React from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const PaymentCheckout = () => {
  const handleUpgrade = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.email) {
      toast.error("Missing user email. Please log in again.");
      return;
    }
  
    try {
      const { data } = await API.post("/payment/initiate", {
        email: storedUser.email,
        plan: "premium",
      });
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      toast.error("Failed to initiate payment");
    }
  };
  

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Upgrade to Premium</h2>
      <p className="mb-4">Enjoy advanced analytics, custom domains, and more features for just $19/month.</p>
      <button 
        onClick={handleUpgrade}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upgrade Now
      </button>
    </div>
  );
};

export default PaymentCheckout;
