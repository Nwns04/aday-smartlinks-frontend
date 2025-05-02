import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import API from "../../services/api";

const SubdomainSettings = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [subdomain, setSubdomain] = useState(user?.subdomain || "");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = debounce(async (value) => {
    try {
      const res = await API.get(`/auth/check-subdomain/${value}`);
      setStatus(res.data.available ? "✅ Available" : "❌ Taken");
    } catch (err) {
      console.error("Error checking subdomain:", err);
      setStatus("⚠️ Error checking availability");
    }
  }, 600);

  useEffect(() => {
    if (subdomain) checkAvailability(subdomain.toLowerCase());
    else setStatus(null);
  }, [subdomain]);

  const handleSave = async () => {
    if (!subdomain) {
      toast.error("Please enter a subdomain");
      return;
    }

    setLoading(true);
    try {
      const res = await API.put("/auth/update-subdomain", {
        userId: user._id,
        subdomain,
      });

      if (res.data.user) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Subdomain saved!");

        // Trigger re-validation
        checkAvailability(subdomain.toLowerCase());

        // Redirect after 1.5s
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error(res.data.message || "Failed to save.");
      }
    } catch (err) {
      console.error("Failed to update subdomain:", err);
      toast.error("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const domainPreview = subdomain ? `https://${subdomain}.aday.io` : "";

  return (
    <div className="bg-gray-100 p-4 rounded mb-4 space-y-3">
      <label className="block mb-1 font-medium text-gray-700">Custom Subdomain</label>
      <input
        className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
        placeholder="yourname"
        value={subdomain}
        onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
      />

      {domainPreview && (
        <p className="text-sm mt-1 text-gray-600">
          Your link will be:{" "}
          <span className="text-blue-600 font-mono">{domainPreview}</span>
        </p>
      )}

      <p className="text-sm">{status}</p>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`mt-2 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving…" : "Save Subdomain"}
      </button>
    </div>
  );
};

export default SubdomainSettings;
