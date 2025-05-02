import React, { useState } from "react";
import { Download, Code, RefreshCw } from "lucide-react";
import API from "../../services/api";
import { motion } from "framer-motion";

const DownloadPressKitButton = ({ campaign }) => {
  const [customHtml, setCustomHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const defaultTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${campaign.title} Press Kit</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 {
      color: #1a365d;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .presskit-header {
      margin-bottom: 2rem;
    }
    .presskit-section {
      margin-bottom: 2rem;
    }
    .presskit-section h2 {
      color: #2d3748;
      margin-bottom: 0.75rem;
    }
    .presskit-image {
      max-width: 100%;
      height: auto;
      margin: 1rem 0;
      border-radius: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="presskit-header">
    <h1>${campaign.title}</h1>
    ${campaign.coverImage ? `<img src="${campaign.coverImage}" alt="${campaign.title}" class="presskit-image">` : ''}
  </div>

  <div class="presskit-section">
    <h2>Artist Information</h2>
    <p><strong>Artist:</strong> ${campaign.artist}</p>
    <p><strong>Release Date:</strong> ${new Date(campaign.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <p><strong>Genre:</strong> ${campaign.genre || 'Not specified'}</p>
  </div>

  <div class="presskit-section">
    <h2>Description</h2>
    <p>${campaign.description || 'No description available.'}</p>
  </div>

  ${campaign.tracks && campaign.tracks.length > 0 ? `
  <div class="presskit-section">
    <h2>Track Listing</h2>
    <ul>
      ${campaign.tracks.map(track => `<li>${track.title} (${track.duration})</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <div class="presskit-section">
    <h2>Contact Information</h2>
    <p><strong>Label:</strong> ${campaign.label || 'Independent'}</p>
    <p><strong>Contact Email:</strong> ${campaign.contactEmail || 'N/A'}</p>
  </div>
</body>
</html>
`;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await API.post(
        `/api/presskit/${campaign._id}`,
        { html: customHtml || defaultTemplate },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${campaign.slug}-presskit.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download press kit:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetToDefault = () => {
    setCustomHtml("");
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Code size={18} className="text-indigo-500" />
          Press Kit HTML Editor
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div> */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <textarea
            rows={16}
            className="w-full border border-gray-200 p-4 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={customHtml || defaultTemplate}
            onChange={(e) => setCustomHtml(e.target.value)}
            spellCheck="false"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isGenerating}
            className="mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors w-full disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={18} />
                Download Press Kit
              </>
            )}
          </motion.button>
        </div>

        {showPreview && (
          <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
              <span className="text-sm font-medium text-gray-700">HTML Preview</span>
            </div>
            <iframe
              srcDoc={customHtml || defaultTemplate}
              className="w-full h-[500px] border-0"
              title="Press Kit Preview"
            />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default DownloadPressKitButton;