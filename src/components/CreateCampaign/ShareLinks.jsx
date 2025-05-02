// components/CreateCampaign/ShareLinks.jsx
import React from "react";
import QRCode from "react-qr-code";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";

const ShareLinks = ({ user, formData, shortUrl, renderLink }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Shareable Link</h4>

      {user?.isPremium && formData.subdomain && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono break-all">{renderLink("subdomain")}</span>
          <button
            onClick={() => handleCopy(renderLink("subdomain"))}
            className="ml-3 text-blue-600 hover:text-blue-800"
          >
            <FiCopy />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-mono break-all">{renderLink("short")}</span>
        <button
          onClick={() => handleCopy(renderLink("short"))}
          className="ml-3 text-blue-600 hover:text-blue-800"
        >
          <FiCopy />
        </button>
      </div>

      <div className="mt-6 text-center">
        <h4 className="text-md font-semibold mb-2">Main Link QR</h4>
        <QRCode value={renderLink("subdomain") || renderLink("short")} size={128} />
        {shortUrl && (
          <>
            <h4 className="text-md font-semibold mt-4 mb-2">Short Link QR</h4>
            <QRCode value={shortUrl} size={128} />
            <p className="text-sm mt-1 text-gray-500">Scan to open short version</p>
          </>
        )}
        <p className="text-sm mt-2 text-gray-500">Scan to open your main link</p>
      </div>
    </div>
  );
};

export default ShareLinks;
