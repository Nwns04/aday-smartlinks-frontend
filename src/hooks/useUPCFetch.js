import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import API from "../services/api";
import { retry } from "../utils/retry";

export default function useUPCFetch(setFormData, checkSlugAvailability) {
  const [upc, setUpc] = useState("");
  const [fetchingLinks, setFetchingLinks] = useState(false);
  const [error, setError] = useState(null);


  const handleFetchLinks = async () => {
    if (!upc.trim()) return;

    setFetchingLinks(true);
    setError(null); // ✅ Now this is defined
    try {
      const res = await retry(() =>
        API.get(`/campaigns/spotify/links`, {
          params: { upc: upc.trim() },
        })
      );

      const data = res.data;
      const isEmpty =
        !data.title &&
        !data.spotify &&
        !data.apple &&
        !data.youtube &&
        !data.artwork &&
        !data.releaseDate;

      if (isEmpty) {
        setError("No info found for this UPC."); // ✅ Use state error
        toast.error("No info found for this UPC.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        artistName: data.artist || prev.artistName,
        artwork: data.artwork || prev.artwork,
        releaseDate: data.releaseDate || prev.releaseDate,
        spotify: data.spotify || prev.spotify,
        apple: data.apple || prev.apple,
        youtube: data.youtube || prev.youtube,
        boomplay: data.boomplay || prev.boomplay,
        audiomack: data.audiomack || prev.audiomack,
      }));

      if (data.title) checkSlugAvailability(data.title);
    } catch (err) {
      console.error("UPC fetch error after retries:", err);
      setError("Failed to fetch UPC data after multiple attempts."); // ✅ Add error state
      toast.error("Failed to fetch UPC data after multiple attempts.");
    } finally {
      setFetchingLinks(false);
    }
  };

  return {
    upc,
    setUpc,
    fetchingLinks,
    handleFetchLinks,
    error,            // ✅ return error for display
    setError          // ✅ optionally expose setter
  };
}
