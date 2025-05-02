import React, { useEffect } from "react";
import { useTour } from "../context/TourContext";
import { toast } from "react-hot-toast";

const OnboardingTour = () => {
  const { startTour } = useTour();

  useEffect(() => {
    const hasTakenTour = localStorage.getItem("hasTakenTour");
    if (!hasTakenTour) {
      toast.success(
        (t) => (
          <div>
            <p className="font-bold">Welcome to Aday Smartlinks!</p>
            <p>Let's take a quick tour to get you started. Earn badges for milestones (e.g., creating your first campaign) along the way.</p>
            <div className="mt-2 flex gap-2">
              <button 
                onClick={() => {
                  startTour();
                  toast.dismiss(t.id);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Start Tour
              </button>
              <button 
                onClick={() => toast.dismiss(t.id)}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
          id: "welcome-message",
        }
      );
    }
  }, [startTour]);

  return null;
};

export default OnboardingTour;
