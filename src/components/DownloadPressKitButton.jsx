import React, { useState } from "react";
import { Download } from "lucide-react";
import API from "../services/api";
import { motion } from "framer-motion";

const DownloadPressKitButton = ({ campaign }) => {
  const [customHtml, setCustomHtml] = useState("");

  const defaultTemplate = `
    <html>
      <head><title>${campaign.title} Press Kit</title></head>
      <body>
        <h1>${campaign.title}</h1>
        <p><strong>Artist:</strong> ${campaign.artist}</p>
        <p><strong>Release Date:</strong> ${new Date(campaign.releaseDate).toLocaleDateString()}</p>
        <p><strong>Description:</strong> ${campaign.description || "No description provided."}</p>
      </body>
    </html>
  `;

  const handleDownload = async () => {
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
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        rows={10}
        className="w-full border p-3 rounded text-sm"
        value={customHtml || defaultTemplate}
        onChange={(e) => setCustomHtml(e.target.value)}
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
      >
        <Download size={16} /> Download Press Kit
      </motion.button>
    </div>
  );
};

export default DownloadPressKitButton;
