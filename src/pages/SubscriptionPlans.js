import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useContext(AuthContext);

  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);


 
  const pricing = {
    monthly: { essential: 9, premium: 19 },
    yearly: { essential: 90, premium: 180 },
  };

  // ✅ Handle reference from query string
  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      (async () => {
        try {
          const { data } = await API.get(`/payment/verify?reference=${reference}`);
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("Payment verified! Account upgraded.");
        } catch (err) {
          toast.error("Payment verification failed: " + (err.response?.data?.message || err.message));
        } finally {
          navigate("/dashboard");
        }
      })();
    }
  }, [searchParams, navigate, setUser]);

  const handleSelectPlan = (plan) => {
     console.log("⚡️ Plan clicked:", plan, "user:", user)
       // ① always remember which plan they chose
       sessionStorage.setItem("pendingPlan", plan)
    
       if (!user) {
         // force the login modal
         navigate("/price?login=true", { replace: true })
         return
       }
    
       // ② now that they're signed in, send them to the correct checkout
       if (plan === "essential") {
         navigate("/essential-checkout")
       } else {
         navigate("/payment-checkout")
       }
     }
    
  
  useEffect(() => {
    // once `user` becomes truthy, check if we have a pendingPlan
    if (user) {
      const plan = sessionStorage.getItem("pendingPlan");
      if (plan === "essential") {
        sessionStorage.removeItem("pendingPlan");
        navigate("/essential-checkout", { replace: true });
      } else if (plan === "premium") {
        sessionStorage.removeItem("pendingPlan");
        navigate("/payment-checkout", { replace: true });
      }
    }
  }, [user, navigate]);

  const features = [
    { title: "Unlimited Smart Links", essential: true, premium: true },
    { title: "Email Capture & Export", essential: true, premium: true },
    { title: "Basic Analytics Dashboard", essential: true, premium: true },
    { title: "Unlimited Campaigns", essential: true, premium: true },
    { title: "Custom Domain & Branding", essential: false, premium: true },
    { title: "Spotify UPC Lookup & Auto-fill", essential: false, premium: true },
    { title: "Audience Retargeting", essential: false, premium: true },
    { title: "Advanced Geo & Device Insights", essential: false, premium: true },
    { title: "Fan Funnel Analytics", essential: false, premium: true },
    { title: "Priority Customer Support", essential: false, premium: true },
    { title: "Team Members", essential: "1 user", premium: "Up to 5 users" },
    { title: "API Access", essential: false, premium: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing Plans</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start with a 14-day free trial. No credit card required. Cancel anytime.
        </p>
         {user?.subscriptionPlan && (
   <p className="…">
     You are currently on the <strong>{user.subscriptionPlan}</strong> plan.
     {user.subscriptionPlan === "essential" &&
      new Date(user.trialExpiresAt) > Date.now() && (
        <span> (trial ends {new Date(user.trialExpiresAt).toLocaleDateString()})</span>
     )}
   </p>
)}
      </div>

      {/* Billing cycle toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
          <button
            className={`px-6 py-2 text-sm font-medium rounded-full ${
              billingCycle === "monthly" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly Billing
          </button>
          <button
            className={`px-6 py-2 text-sm font-medium rounded-full ${
              billingCycle === "yearly" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly Billing <span className="text-green-500 ml-1">(Save 20%)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
        {/* Essential Plan */}
        <div className={`border rounded-xl p-8 transition-all ${selectedPlan === "essential" ? "ring-2 ring-blue-500" : ""}`}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Essential</h2>
            <p className="text-gray-600 mb-4">Perfect for individual creators</p>
            <div className="flex items-end mb-2">
              <span className="text-4xl font-bold text-gray-900">${pricing[billingCycle].essential}</span>
              <span className="text-gray-500 ml-1">/{billingCycle === "monthly" ? "month" : "year"}</span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-sm text-gray-500">Billed annually (${pricing.monthly.essential} per month)</p>
            )}
            {user?.plan === "essential" && (
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded mt-2">
                Your Plan
              </span>
            )}
          </div>

          <button
            onClick={() => handleSelectPlan("essential")}
            disabled={
      loadingPlan === "essential" ||
      user?.subscriptionPlan === "essential" && new Date(user.trialExpiresAt) > Date.now() ||
      user?.subscriptionPlan === "premium"
    }
            className={`w-full py-3 rounded-lg font-medium mb-6 ${
              user?.plan === "essential"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {loadingPlan === "essential"
    ? "Activating…"
    : user?.subscriptionPlan === "essential"
      ? "Current Plan"
      : "Select Plan"}
          </button>

          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-4">All features:</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className={`flex items-center ${!feature.essential ? "text-gray-400" : "text-gray-700"}`}>
                  {feature.essential ? (
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {feature.title}
                  {!feature.essential && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Premium</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Premium Plan */}
        <div className={`border-2 border-blue-500 rounded-xl p-8 bg-blue-50 transition-all ${selectedPlan === "premium" ? "ring-2 ring-blue-500" : ""}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium</h2>
              <p className="text-gray-600 mb-4">For professional artists & teams</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Most Popular</span>
          </div>

          <div className="flex items-end mb-2">
            <span className="text-4xl font-bold text-gray-900">${pricing[billingCycle].premium}</span>
            <span className="text-gray-500 ml-1">/{billingCycle === "monthly" ? "month" : "year"}</span>
          </div>
          {billingCycle === "yearly" && (
            <p className="text-sm text-gray-500 mb-6">Billed annually (${pricing.monthly.premium} per month)</p>
          )}
          {user?.plan === "premium" && (
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded mb-2">
              Your Plan
            </span>
          )}

          <button
            onClick={() => handleSelectPlan("premium")}
            disabled={
      loadingPlan === "premium" ||
      user?.subscriptionPlan === 'premium'
    }
            className={`w-full py-3 rounded-lg font-medium mb-6 ${
              user?.plan === "premium"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
           {loadingPlan === "premium"
    ? "Activating…"
    : user?.subscriptionPlan === "premium"
      ? "Current Plan"
      : "Get Premium"}
          </button>

          <div className="border-t border-blue-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">All features:</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature.title}
                  {typeof feature.premium === "string" && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{feature.premium}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-medium text-gray-900">Features</th>
                <th className="p-4 text-center font-medium text-gray-900">Essential</th>
                <th className="p-4 text-center font-medium text-gray-900">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {features.map((feature, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-700">{feature.title}</td>
                  <td className="p-4 text-center">
                    {typeof feature.essential === "string" ? (
                      <span className="text-gray-700">{feature.essential}</span>
                    ) : feature.essential ? (
                      <svg className="h-5 w-5 text-green-500 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {typeof feature.premium === "string" ? (
                      <span className="text-gray-700">{feature.premium}</span>
                    ) : feature.premium ? (
                      <svg className="h-5 w-5 text-green-500 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">Can I change plans later?</h3>
            <p className="text-gray-600 mt-1">Yes, you can upgrade or downgrade your plan at any time.</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">Is there a free trial?</h3>
            <p className="text-gray-600 mt-1">Yes, we offer a 14-day free trial for all plans. No credit card needed.</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">What payment methods do you accept?</h3>
            <p className="text-gray-600 mt-1">We accept major cards (Visa, Mastercard, Amex) and PayPal.</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">Can I cancel anytime?</h3>
            <p className="text-gray-600 mt-1">Yes, you'll retain access until your billing period ends.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
