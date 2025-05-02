import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminEmails = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const userId = "67ebc3f9bee1022815a6faff"; // Replace with your real userId
        const res = await API.get(`/campaigns/analytics/${userId}`);
        setCampaigns(res.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  const fetchEmails = async (slug) => {
    try {
      setLoading(true);
      setSelected("");
      setEmails([]);
      const res = await API.get(`/campaigns/emails/${slug}`);
      console.log("Fetched emails:", res.data.emails);
      setSelected(res.data.title);
      setEmails(res.data.emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Email Collection - Admin View</h2>

      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul className="mb-4">
          {campaigns.map((c, index) => (
            <li key={index} className="mb-2">
              <button
                className="text-blue-500 underline"
                onClick={() => fetchEmails(c.slug)}
              >
                {c.title} - View Emails
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && <p>Loading emails...</p>}

      {emails.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl mb-2">Emails for "{selected}"</h3>
          <ul className="list-disc ml-4">
            {emails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      )}

      {selected && emails.length === 0 && !loading && (
        <p>No emails collected yet for "{selected}".</p>
      )}
    </div>
  );
};

export default AdminEmails;
