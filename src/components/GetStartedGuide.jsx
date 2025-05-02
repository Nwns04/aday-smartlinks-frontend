// src/components/GetStartedGuide.js
import React from "react";

const GetStartedGuide = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3">How to Get Started</h3>
      <ol className="list-decimal pl-5 text-sm space-y-2">
        <li>Click on "Create Link" to launch a new campaign.</li>
        <li>Customize your link with a title and destination URL.</li>
        <li>Share your link on social media or other platforms.</li>
        <li>Track clicks and email captures in real-time.</li>
        <li>Connect Spotify for music analytics (optional).</li>
        <li>Use the analytics to optimize your campaigns.</li>
      </ol>
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <p className="font-medium">Pro Tip:</p>
        <p>Create multiple links for different audiences to see what performs best!</p>
      </div>
    </div>
  );
};

export default GetStartedGuide;