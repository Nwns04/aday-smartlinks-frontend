import React, { useState } from "react";
import { Download, Eye, RefreshCcw } from "lucide-react";
import API from "../services/api";
import { motion } from "framer-motion";
import { Editor } from "@tinymce/tinymce-react";

const defaultTemplates = {
  artist: `<h1>Artist Press Kit</h1><p>Insert your bio, achievements, and social links here.</p>`,
  label: `<h1>Label Press Kit</h1><p>Include your roster, highlights, and contact details here.</p>`,
};

const PressKitEditor = ({ campaign }) => {
  const [templateType, setTemplateType] = useState("artist");
  const [content, setContent] = useState(defaultTemplates.artist);
  const [preview, setPreview] = useState(true);

  const handleDownload = async () => {
    try {
      const res = await API.post(
        `/api/presskit/${campaign._id}`,
        { html: content },
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${campaign.slug}-presskit.pdf`;
      a.click();
    } catch (err) {
      console.error("Failed to download press kit:", err);
    }
  };

  const handleTemplateChange = (type) => {
    setTemplateType(type);
    setContent(defaultTemplates[type]);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={templateType}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="artist">🎤 Artist Kit</option>
          <option value="label">🏷️ Label Kit</option>
        </select>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setContent(defaultTemplates[templateType])}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            <RefreshCcw size={14} /> Reset
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            <Eye size={14} /> {preview ? "Hide Preview" : "Show Preview"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            <Download size={14} /> Download PDF
          </motion.button>
        </div>
      </div>

      <Editor
        apiKey="no-api-key" // Or use your TinyMCE key
        value={content}
        init={{
          height: 300,
          menubar: false,
          plugins: "link lists",
          toolbar:
            "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link",
        }}
        onEditorChange={(newValue) => setContent(newValue)}
      />

      {preview && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Live Preview:</h3>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
};

export default PressKitEditor;
