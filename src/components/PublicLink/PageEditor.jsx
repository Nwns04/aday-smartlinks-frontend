import React, { useState } from 'react';
import axios from 'axios';

function CloudinaryUpload({ file, setFile, preview, setPreview, label, preset, cloudName }) {
  const [uploading, setUploading] = useState(false);
  const CLOUD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return null;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset);
    try {
      const { data } = await axios.post(CLOUD_URL, form);
      return data.secure_url;
    } catch (err) {
      console.error(`${label} upload failed:`, err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {uploading && <span className="text-gray-500">(Uploading...)</span>}
      </label>
      
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt={`${label} preview`} 
              className="w-24 h-24 object-contain rounded-lg border border-gray-200" 
            />
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview('');
              }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <label className="block">
            <span className="sr-only">Choose {label}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </label>
          
          {file && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : `Confirm ${label} Upload`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PageEditor({ campaign, onSave }) {
  const [title, setTitle] = useState(campaign.title || '');
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkPreview, setArtworkPreview] = useState(campaign.artwork || '');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(campaign.logo || '');
  const [bgType, setBgType] = useState(campaign.bgType || 'artwork');
  const [bgColor, setBgColor] = useState(campaign.bgColor || '#ffffff');
  const [blurPx, setBlurPx] = useState(campaign.blurPx ?? 20);

  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      form
    );
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let artworkUrl = campaign.artwork;
    if (artworkFile) {
      const url = await uploadToCloudinary(artworkFile);
      if (url) artworkUrl = url;
    }

    let logoUrl = campaign.logo;
    if (logoFile) {
      const url = await uploadToCloudinary(logoFile);
      if (url) logoUrl = url;
    }

    onSave({
      title,
      artwork: artworkUrl,
      logo: logoUrl,
      bgType,
      bgColor,
      blurPx,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Campaign Editor</h2>
        
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="Enter campaign title"
          />
        </div>

        {/* Logo Upload */}
        <CloudinaryUpload
          label="Brand Logo"
          file={logoFile}
          setFile={setLogoFile}
          preview={logoPreview}
          setPreview={setLogoPreview}
          preset={UPLOAD_PRESET}
          cloudName={CLOUD_NAME}
        />

        {/* Artwork Upload */}
        <CloudinaryUpload
          label="Artwork Cover"
          file={artworkFile}
          setFile={setArtworkFile}
          preview={artworkPreview}
          setPreview={setArtworkPreview}
          preset={UPLOAD_PRESET}
          cloudName={CLOUD_NAME}
        />

        {/* Background Settings */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700">Background Settings</h3>
          
          <div className="space-y-4">
            <fieldset className="space-y-2">
              <legend className="sr-only">Background type</legend>
              <div className="flex flex-wrap gap-4">
                {['artwork', 'solid', 'none'].map((o) => (
                  <label
                    key={o}
                    className={`inline-flex items-center px-4 py-2 rounded-md border ${
                      bgType === o
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={o}
                      checked={bgType === o}
                      onChange={() => setBgType(o)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 mr-2"
                    />
                    {o.charAt(0).toUpperCase() + o.slice(1)}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Solid color picker */}
            {bgType === 'solid' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{bgColor}</span>
                </div>
              </div>
            )}

            {/* Blur opacity */}
            {bgType === 'artwork' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Blur Intensity: <span className="font-normal">{blurPx}px</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={blurPx}
                  onChange={(e) => setBlurPx(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>None</span>
                  <span>Max</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}