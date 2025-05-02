import React from "react";
import toast from "react-hot-toast";

const CopyShare = ({ latestLink }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(latestLink);
    toast.success("Link copied!");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4 flex flex-col gap-3">
      <h3 className="text-lg mb-2">Quick Actions</h3>
      {latestLink ? (
        <>
          <button
            onClick={copyLink}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            📄 Copy Latest Link
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=Check this out: ${latestLink}`}
            target="_blank"
            rel="noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded text-center"
          >
            📤 Share on Twitter
          </a>
        </>
      ) : (
        <p>No campaign created yet.</p>
      )}
    </div>
  );
};

export default CopyShare;
