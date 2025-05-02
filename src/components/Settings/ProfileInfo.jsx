import React, { useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import useUploadHandler from '../../hooks/useUploadHandler';

export default function ProfileInfo({ user, setUser }) {
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [loading, setLoading] = useState(false);

  const { uploading, handleUpload } = useUploadHandler((updated) => {
    setProfileImage(updated.profileImage); // support hook reuse if needed
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file, 'profileImage');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: updated } = await API.patch('/auth/user', { name, profileImage });
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-6 space-y-4">
      <div>
        <label className="block mb-1 font-medium text-gray-700">Name</label>
        <input
          className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Profile Image</label>
        {profileImage && (
          <div className="relative w-32 h-32 mb-2">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border"
            />
            <button
              type="button"
              onClick={() => setProfileImage('')}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
      </div>

      <button
        onClick={handleSave}
        disabled={loading || uploading}
        className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
          loading || uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Saving…' : 'Save Profile'}
      </button>
    </div>
  );
}
