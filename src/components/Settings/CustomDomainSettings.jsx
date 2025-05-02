import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import API from "../../services/api";

const CustomDomainSettings = ({ user, setUser }) => {
  const [domain, setDomain] = useState(user?.customDomain || "");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(user?.customDomainVerified || false);
  const [verifyStatus, setVerifyStatus] = useState(null);

  // 🔁 Recheck verification status
  const verifyDomain = async () => {
    if (!domain) return;
    setVerifying(true);
    setVerifyStatus("Checking...");

    try {
      const res = await API.get(`/auth/domain/verify?domain=${domain}`);
      if (res.data.verified) {
        setVerified(true);
        toast.success("Domain is verified!");
        setVerifyStatus("✅ Verified");
        const updatedUser = { ...user, customDomainVerified: true };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setVerified(false);
        setVerifyStatus("❌ Not Verified");
      }
    } catch (err) {
      console.error("Verification failed", err);
      toast.error("Failed to verify domain.");
      setVerifyStatus("⚠️ Error");
    } finally {
      setVerifying(false);
    }
  };

  // 🧠 Debounced recheck on domain input
  const debouncedVerify = debounce(verifyDomain, 1000);

  useEffect(() => {
    if (domain) {
      setVerified(false);
      setVerifyStatus(null);
      debouncedVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  const handleSave = async () => {
    if (!domain) {
      toast.error("Please enter a domain");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/domain", {
        email: user.email,
        domain,
      });

      const updatedUser = {
        ...user,
        customDomain: domain,
        customDomainVerified: false, // reset until verified again
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setVerified(false);
      toast.success("Domain saved! Please update your DNS.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save domain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-6 space-y-3">
      <label className="block mb-1 font-medium text-gray-700">Custom Domain</label>
      <input
        className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. presave.yoursite.com"
        value={domain}
        onChange={e => setDomain(e.target.value.toLowerCase())}
      />

      {domain && (
        <>
          <p className="text-sm">
            {verifyStatus || (verified ? "✅ Verified" : "⏳ Verifying...")}
          </p>

          {!verified && (
            <button
              onClick={verifyDomain}
              disabled={verifying}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
            >
              {verifying ? "Verifying..." : "Verify Now"}
            </button>
          )}

          <div className="text-sm mt-2 text-yellow-700 bg-yellow-100 p-3 rounded-lg">
            Add this DNS TXT record to verify:<br />
            <strong>Host:</strong> <code>_aday.{domain}</code><br />
            <strong>Value:</strong> <code>verify=aday</code>
          </div>
        </>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className={`mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving..." : "Save Domain"}
      </button>
    </div>
  );
};

export default CustomDomainSettings;
