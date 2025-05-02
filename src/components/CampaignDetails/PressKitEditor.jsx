import React, { useState } from "react";
import { Download, Eye, RefreshCcw, Palette, Image, LayoutTemplate } from "lucide-react";
import API from "../../services/api";
import { motion } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const defaultTemplates = {
  artist: {
    name: "Artist Press Kit",
    content: `<div class="presskit-container">
      <header class="presskit-header">
        <h1>Artist Name</h1>
        <p class="subtitle">Professional Press Kit</p>
      </header>
      <section class="presskit-section">
        <h2>Biography</h2>
        <p>Write a compelling artist biography here. Highlight your musical journey, influences, and achievements.</p>
      </section>
      <section class="presskit-section">
        <h2>Latest Release</h2>
        <p>Details about your most recent work.</p>
      </section>
      <section class="presskit-section">
        <h2>Contact</h2>
        <p>Email: your@email.com<br>Phone: (123) 456-7890</p>
      </section>
    </div>`
  },
  label: {
    name: "Label Press Kit",
    content: `<div class="presskit-container">
      <header class="presskit-header">
        <h1>Label Name</h1>
        <p class="subtitle">Music Label Press Kit</p>
      </header>
      <section class="presskit-section">
        <h2>About Us</h2>
        <p>Describe your label's mission, history, and unique value proposition.</p>
      </section>
      <section class="presskit-section">
        <h2>Artist Roster</h2>
        <p>Highlight your current artists and their achievements.</p>
      </section>
      <section class="presskit-section">
        <h2>Contact</h2>
        <p>Email: label@email.com<br>Phone: (123) 456-7890</p>
      </section>
    </div>`
  }
};

const PressKitEditor = ({ campaign }) => {
  const [templateType, setTemplateType] = useState("artist");
  const [content, setContent] = useState(defaultTemplates.artist.content);
  const [preview, setPreview] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
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
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTemplateChange = (type) => {
    setTemplateType(type);
    setContent(defaultTemplates[type].content);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <LayoutTemplate size={18} className="text-indigo-500" />
          Press Kit Editor
        </h2>
        
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={templateType}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
            >
              <option value="artist">🎤 Artist Template</option>
              <option value="label">🏷️ Label Template</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-6">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setContent(defaultTemplates[templateType].content)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
          >
            <RefreshCcw size={16} />
            Reset Template
          </motion.button>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
            >
              <Eye size={16} />
              {preview ? "Hide Preview" : "Show Preview"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download PDF
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Editor */}
        <div className="mb-6">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write your press kit content here..."
            className="border border-gray-200 rounded-lg overflow-hidden"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
              <Eye size={16} className="text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Live Preview</span>
            </div>
            <div
              className="p-6 bg-white prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>

      {/* Styles for preview content */}
      <style>{`
  .presskit-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Inter', sans-serif;
    color: #1f2937;
  }
  .presskit-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .presskit-header h1 {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #111827;
  }
  .presskit-header .subtitle {
    font-size: 1.125rem;
    color: #6b7280;
  }
  .presskit-section {
    margin-bottom: 2rem;
  }
  .presskit-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }
  .presskit-section p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`}</style>

    </div>
  );
};

export default PressKitEditor;