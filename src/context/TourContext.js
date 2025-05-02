
import React, { createContext, useContext, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const driverRef = useRef(null);

  const startTour = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const driverObj = driver({
      animate: true,
      overlayColor: "rgba(0, 0, 0, 0.5)",
      doneBtnText: "Finish",
      nextBtnText: "Next",
      prevBtnText: "Previous",
      onCloseClick: () => {
        localStorage.setItem("hasTakenTour", "true");
        driverObj.destroy();
      },
      steps: [  // Steps are now defined directly in the config
        {
          element: "#create-link-btn",
          popover: {
            title: "Create Your First Link",
            description: "Start by creating your first campaign link to share with your audience.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#metrics-section",
          popover: {
            title: "Track Your Performance",
            description: "Here you'll see key metrics about your campaigns.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#spotify-section",
          popover: {
            title: "Connect Spotify",
            description: "Connect your Spotify account to enable music analytics and enhanced features.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#performance-chart",
          popover: {
            title: "Campaign Analytics",
            description: "Visualize how your campaigns are performing over time.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#getting-started",
          popover: {
            title: "Quick Start Guide",
            description: "Follow these steps to make the most of your dashboard.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#activity-feed",
          popover: {
            title: "Recent Activity",
            description: "See all your recent actions and system notifications here.",
            side: "top",
            align: "center",
          },
        },
      ]
    });

    driverRef.current = driverObj;
    driverObj.drive();  // Changed from start() to drive()
    localStorage.setItem("hasTakenTour", "true");
  };

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);