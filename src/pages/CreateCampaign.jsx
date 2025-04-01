import React, { useState } from "react";
import API from "../services/api";

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    spotify: "",
    apple: "",
    boomplay: "",
    audiomack: "",
    youtube: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/campaigns", formData);
    alert("Campaign Created");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Create New Campaign</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Song Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.releaseDate}
          onChange={(e) =>
            setFormData({ ...formData, releaseDate: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Spotify Link"
          value={formData.spotify}
          onChange={(e) =>
            setFormData({ ...formData, spotify: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Apple Music Link"
          value={formData.apple}
          onChange={(e) =>
            setFormData({ ...formData, apple: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Boomplay Link"
          value={formData.boomplay}
          onChange={(e) =>
            setFormData({ ...formData, boomplay: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Audiomack Link"
          value={formData.audiomack}
          onChange={(e) =>
            setFormData({ ...formData, audiomack: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="YouTube Link"
          value={formData.youtube}
          onChange={(e) =>
            setFormData({ ...formData, youtube: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
