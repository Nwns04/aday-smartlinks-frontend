import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import debounce from 'lodash.debounce';
import TwoFactorSettings from "../components/TwoFactorSettings";



const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [subdomainInput, setSubdomainInput] = useState(user?.subdomain || "");
  const [subdomainStatus, setSubdomainStatus] = useState(null);
  const [customDomain, setCustomDomain] = useState(user?.customDomain || "");
  const handleSaveDomain = async () => {
    if (!customDomain) return toast.error("Domain cannot be empty");
  
    const res = await fetch("/auth/domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, domain: customDomain }),
    });
  
    const data = await res.json();
    if (res.ok) {
      setUser({ ...user, customDomain });
      toast.success("Domain saved! Please update your DNS.");
    } else {
      toast.error(data.message || "Failed to save domain.");
    }
  };
  

  // Check subdomain availability
  const checkSubdomain = debounce(async (value) => {
    if (!value) return setSubdomainStatus(null);
    const res = await fetch(`/auth/check-subdomain/${value.toLowerCase().trim()}`);
    const data = await res.json();
    setSubdomainStatus(data.available ? '✅ Available' : '❌ Taken');
  }, 600);

  useEffect(() => {
    checkSubdomain(subdomainInput);
  }, [subdomainInput]);

  // Save basic profile info
  const handleUpdate = async () => {
    const updatedUser = { ...user, name, profileImage };
  
    try {
      // If premium and subdomain is set, patch it
      if (user?.isPremium && user.subdomain) {
        const res = await fetch('/auth/user/subdomain', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, subdomain: user.subdomain }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update subdomain');
        updatedUser.subdomain = data.subdomain;
      }
  
      // Save user
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message);
    }
  };
  

  // Save subdomain to DB
  const handleSubdomainSave = async () => {
    if (!subdomainInput) return;
    const res = await fetch('/auth/update-subdomain', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, subdomain: subdomainInput }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      toast.success("Subdomain saved!");
    } else {
      toast.error(data.message || "Error saving subdomain.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl mb-4">Account Settings</h2>
      <div className="bg-gray-100 p-4 rounded mb-4 space-y-3">
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="w-full p-2 rounded border"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Profile Image URL</label>
          <input
            className="w-full p-2 rounded border"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
          />
        </div>

        {user?.isPremium && (
          <div>
            <label className="block mb-1">Custom Subdomain</label>
            <input
              className="w-full p-2 rounded border"
              placeholder="yourname"
              value={subdomainInput}
              onChange={(e) => setSubdomainInput(e.target.value.toLowerCase())}
            />
            <p className="text-sm mt-1 text-gray-500">
              Your link will be:
              <span className="ml-2 bg-white px-2 py-1 rounded-full shadow text-blue-600">
                {subdomainInput ? `https://${subdomainInput}.aday.io` : `https://aday.io/yourlink`}
              </span>
            </p>
            <p className="text-sm mt-1">{subdomainStatus}</p>
            <button
              onClick={handleSubdomainSave}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Save Subdomain
            </button>
          </div>
        )}
        {user?.isPremium && (
  <div>
    <label className="block mb-1">Custom Domain</label>
    <input
      className="w-full p-2 rounded border"
      placeholder="e.g. presave.blazerqmusic.com"
      value={customDomain}
      onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
    />
    <button
      onClick={handleSaveDomain}
      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
    >
      Save Domain
    </button>
  </div>
)}
{customDomain && (
  user?.customDomainVerified ? (
    <p className="text-sm mt-3 text-green-600 bg-green-100 p-3 rounded-lg flex items-center gap-2">
      ✅ Your custom domain is verified and ready to use!
    </p>
  ) : (
    <p className="text-sm mt-3 text-yellow-600 bg-yellow-100 p-3 rounded-lg">
      To verify your domain, add this DNS TXT record:
      <br />
      <strong>Host:</strong> <code>_aday.{customDomain}</code><br />
      <strong>Value:</strong> <code>verify=aday</code>
    </p>
  )
)}



        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4 space-y-3 mt-6">
        <h3 className="font-semibold">Change Password</h3>
        <input
          className="w-full p-2 rounded border"
          type="password"
          placeholder="New Password"
          disabled
        />
        <button
          disabled
          className="bg-gray-400 text-white px-4 py-2 rounded w-full cursor-not-allowed"
        >
          Change Password (Unavailable)
        </button>
        <p className="text-xs text-gray-500">
          Password change is disabled for Google sign-in accounts.
        </p>
      </div>
      
      {user && (
  <div className="mt-6">
    <TwoFactorSettings />
  </div>
)}

    </div>
  );
};

export default Settings;
