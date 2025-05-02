import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

 // ─── src/context/AuthContext.jsx ───
useEffect(() => {
  let stored = localStorage.getItem("user");
  if (!stored) {
    setUser(null);
  } else {
    try {
      let u = JSON.parse(stored);

      // 🔥 client-side expire Essential trials too
      if (
        u.subscriptionPlan === "essential" &&
        u.trialExpiresAt &&
        new Date(u.trialExpiresAt) < Date.now()
      ) {
        u.subscriptionPlan = null;
        u.trialExpiresAt   = null;
        u.isPremium        = false;
        // keep localStorage in sync
        localStorage.setItem("user", JSON.stringify(u));
      }

      setUser(u);
    } catch (err) {
      console.error("Failed to parse user:", err);
      setUser(null);
    }
  }
  setAuthLoading(false);
}, []);


  if (authLoading) {
    return <div className="text-center py-20">Loading...</div>; // or a spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
