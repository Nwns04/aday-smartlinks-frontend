import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import { toast } from "react-hot-toast";
import useSpotifyProfile from "./useSpotifyProfile";

const welcomeMessages = [
  "Good to see you again,", "You're back on the grind,", "Let's get things rolling,", "Hey Rockstar,",
  "Ready to dominate today,", "Welcome back, legend", "Another day, another win,", "Time to make moves,",
  "Look who's back,", "Back to the dashboard,"
];
export default function useDashboardData(user, setUser, navigate, searchParams) {
  const [activities, setActivities]     = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [greeting, setGreeting]         = useState("");
  const { spotifyStatus, setSpotifyProfile, updateSpotifyUser } = useSpotifyProfile(user, setUser);

  const {
    data: analytics = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboardAnalytics", user?._id],
    queryFn: async () => (await API.get(`/campaigns/analytics/${user._id}`)).data,
    enabled: Boolean(user?._id),
    onError: () => toast.error("Failed to load analytics"),
    onSuccess: data => {
      const acts = ["Fetched your campaign analytics"];
      if (data.length) acts.push(`Your top campaign is '${data[0].title}'`);
      setActivities(prev => [...prev, ...acts]);
    },
    staleTime: 300_000,
    retry: 2,
  });

  // 1️⃣ Spotify callback via URL
  useEffect(() => {
    if (!searchParams || typeof searchParams.get !== "function") return;
    const spotifyParam = searchParams.get("spotify");
    if (spotifyParam === "connected") {
      updateSpotifyUser().then(() => navigate("/dashboard", { replace: true }));
    } else if (spotifyParam === "error") {
      toast.error("Failed to connect Spotify");
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, navigate, updateSpotifyUser]);

  // 2️⃣ log when Spotify is already linked
  useEffect(() => {
    if (user?.spotifyId) {
      setActivities(prev => [...prev, "Spotify account connected"]);
    }
  }, [user?.spotifyId]);

  // 3️⃣ celebrate 100+ clicks
  useEffect(() => {
    const hasCelebrated = localStorage.getItem("hasCelebrated");
    const total = analytics.reduce((sum, c) => sum + c.clicks, 0);
    if (total >= 100 && !hasCelebrated) {
      setShowCelebration(true);
      localStorage.setItem("hasCelebrated", "true");
    }
  }, [analytics]);

  // 4️⃣ random greeting
  useEffect(() => {
    if (!isLoading) {
      setGreeting(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
    }
  }, [isLoading]);

  return {
    analytics,
    loading: isLoading,
    error: isError,
    spotifyStatus,
    activities,
    showCelebration,
    greeting,
    setShowCelebration,
    setSpotifyProfile,
  };
}