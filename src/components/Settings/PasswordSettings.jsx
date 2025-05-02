import React from "react";

const PasswordSettings = () => {
  return (
    <div className="bg-gray-100 p-4 rounded mb-4 space-y-3 mt-6">
      <h3 className="font-semibold">Change Password</h3>
      <input className="w-full p-2 rounded border" type="password" placeholder="New Password" disabled />
      <button className="bg-gray-400 text-white px-4 py-2 rounded w-full cursor-not-allowed" disabled>
        Change Password (Unavailable)
      </button>
      <p className="text-xs text-gray-500">
        Password change is disabled for Google sign-in accounts.
      </p>
    </div>
  );
};

export default PasswordSettings;
