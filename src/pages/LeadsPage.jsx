// src/pages/LeadsPage.jsx
import React, { useContext, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import LoadingScreen from "../components/common/LoadingScreen";
import PerformanceChart from "../components/PerformanceChart";
import toast from "react-hot-toast";
import { FiCopy, FiDownload, FiMail, FiChevronLeft, FiChevronRight, FiX, FiCheck, FiSearch } from "react-icons/fi";

export default function LeadsPage() {
  const { user } = useContext(AuthContext);
  const qc = useQueryClient();

  // 1️⃣ Local state
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [showBlastModal, setShowBlastModal] = useState(false);
  const [blastSubject, setBlastSubject] = useState("");
  const [blastBody, setBlastBody] = useState("");

  // 2️⃣ Fetch & normalize
  const { data: emails = [], isLoading, isError } = useQuery({
    queryKey: ["leads", user?._id],
    queryFn: async () => {
      const res = await API.get(`/campaigns/emails/all/${user._id}`);
      const raw = res.data.emails || [];
      // normalize into the shape we expect
      return raw.map((item) => ({
        email: item.email,
        collectedAt: item.collectedAt ?? item.createdAt ?? item.date ?? null,
        campaignTitle: item.campaignTitle ?? item.campaign?.title ?? item.campaignSlug ?? "",
      }));
    },
    enabled: Boolean(user?._id),
    onError: () => toast.error("Failed to load emails."),
  });

  // 3️⃣ Email blast mutation
 const blastMutation = useMutation({
  mutationFn: async ({ subject, body, targets }) => {
    try {
      const response = await API.post(`/campaigns/emails/blast/${user._id}`, {
        subject,
        body,
        emails: targets,
      });
      return response.data;
    } catch (error) {
      // Extract more detailed error message
      const serverMessage = error.response?.data?.message || 'Server error';
      const details = error.response?.data?.details || {};
      throw new Error(`${serverMessage} ${JSON.stringify(details)}`);
    }
  },
  onSuccess: (data) => {
    toast.success(`Email blast sent! (${data.count} successful, ${data.failed || 0} failed)`);
    qc.invalidateQueries({ queryKey: ["leads", user._id] });
    setBlastSubject("");
    setBlastBody("");
  },
  onError: (error) => {
    console.error('Blast error:', error);
    toast.error(`Failed to send blast: ${error.message}`);
  }
});

  // 4️⃣ Growth-over-time data
  const timeline = useMemo(() => {
    const counts = {};
    emails.forEach(({ collectedAt }) => {
      const d = new Date(collectedAt);
      if (isNaN(d)) return;
      const day = d.toISOString().split("T")[0];
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [emails]);

  // 5️⃣ Search / filter
  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return emails;
    return emails.filter(
      ({ email, campaignTitle }) =>
        email.toLowerCase().includes(term) ||
        campaignTitle.toLowerCase().includes(term)
    );
  }, [emails, filter]);

  // 6️⃣ Pagination
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 7️⃣ Bulk‐action handlers
  const toggleAllOnPage = () => {
    const newSel = new Set(selected);
    pageData.forEach((_, i) => {
      const idx = i + (currentPage - 1) * pageSize;
      newSel.has(idx) ? newSel.delete(idx) : newSel.add(idx);
    });
    setSelected(newSel);
  };

  const copySelected = () => {
    const list = Array.from(selected)
      .map((i) => filtered[i]?.email)
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(list);
    toast.success("Copied to clipboard!");
  };

  const exportCSV = (onlySelected) => {
    const list = onlySelected
      ? Array.from(selected).map((i) => filtered[i])
      : filtered;
    if (!list.length) return;
    const header = ["Email", "Date Collected", "Campaign"].join(",");
    const rows = list
      .map(({ email, collectedAt, campaignTitle }) => {
        const d = new Date(collectedAt);
        const ds = isNaN(d) ? "" : d.toLocaleString();
        return [`"${email}"`, `"${ds}"`, `"${campaignTitle}"`].join(",");
      })
      .join("\r\n");
    const blob = new Blob([header + "\r\n" + rows], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = onlySelected ? "leads-selected.csv" : "leads-all.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendBlast = () => {
    const targets = Array.from(selected)
      .map((i) => filtered[i]?.email)
      .filter(Boolean);
    if (!blastSubject || !blastBody) {
      toast.error("Subject and message body are required");
      return;
    }
    blastMutation.mutate({
      subject: blastSubject,
      body: blastBody,
      targets,
    });
    setShowBlastModal(false);
  };

  // 8️⃣ Early returns
  if (isLoading) return <LoadingScreen message="Loading emails..." />;
  if (isError) return <p className="text-red-500">Unable to load emails.</p>;

  // 9️⃣ Render
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Lead Management</h1>
        <div className="text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "lead" : "leads"} found
        </div>
      </div>

      {/* growth chart */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Lead Growth</h2>
        <PerformanceChart data={timeline} />
      </div> */}

      {/* controls */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email or campaign…"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleAllOnPage}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1 transition-colors"
            >
              {pageData.every((_, i) => selected.has(i + (currentPage - 1) * pageSize)) ? (
                <>
                  <FiX size={16} /> Deselect
                </>
              ) : (
                <>
                  <FiCheck size={16} /> Select All
                </>
              )}
            </button>
            <button
              onClick={copySelected}
              disabled={!selected.size}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 flex items-center gap-1 transition-colors"
            >
              <FiCopy size={16} /> Copy
            </button>
            <button
              onClick={() => exportCSV(true)}
              disabled={!selected.size}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 flex items-center gap-1 transition-colors"
            >
              <FiDownload size={16} /> Export Selected
            </button>
            <button
              onClick={() => exportCSV(false)}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-1 transition-colors"
            >
              <FiDownload size={16} /> Export All
            </button>
            <button
              onClick={() => setShowBlastModal(true)}
              disabled={!selected.size}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
            >
              <FiMail size={16} /> Email Blast
            </button>
          </div>
        </div>
      </div>

      {/* list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {pageData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No emails match your search criteria
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pageData.map((e, i) => {
              const idx = i + (currentPage - 1) * pageSize;
              const sel = selected.has(idx);
              const d = new Date(e.collectedAt);
              const dateStr = isNaN(d) ? "Date unknown" : d.toLocaleString();
              return (
                <li
                  key={idx}
                  className={`hover:bg-gray-50 transition-colors ${sel ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-center p-4">
                    <input
                      type="checkbox"
                      checked={sel}
                      onChange={() => {
                        const s = new Set(selected);
                        sel ? s.delete(idx) : s.add(idx);
                        setSelected(s);
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {e.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dateStr}
                        {e.campaignTitle && (
                          <>
                            {" "}
                            — <span className="italic">{e.campaignTitle}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} leads
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* email-blast modal */}
      {showBlastModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Send Email Blast</h2>
              <button
                onClick={() => setShowBlastModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Email subject"
                  value={blastSubject}
                  onChange={(e) => setBlastSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="body"
                  rows={8}
                  placeholder="Write your message here..."
                  value={blastBody}
                  onChange={(e) => setBlastBody(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="text-sm text-gray-500">
                This will be sent to {selected.size} {selected.size === 1 ? "recipient" : "recipients"}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowBlastModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendBlast}
                disabled={blastMutation.isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {blastMutation.isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiMail size={16} /> Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}