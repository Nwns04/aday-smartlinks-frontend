import React, { useState, useRef, useEffect } from "react";
import { Copy, Pencil, PauseCircle, PlayCircle, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import QRCode from "react-qr-code";
import Tooltip from "../Tooltip";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api"; 

const OVERRIDES_KEY = "campaignTitleOverrides";
const STATUS_OVERRIDES_KEY = "campaignStatusOverrides";


const CampaignTable = ({ campaigns: initialCampaigns, refetch }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [sortKey, setSortKey] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const itemsPerPage = 5;
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editValues,     setEditValues]     = useState({ title: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let titleOverrides   = {};
    let statusOverrides  = {};
    try {
      titleOverrides  = JSON.parse(localStorage.getItem(OVERRIDES_KEY)     || "{}");
      statusOverrides = JSON.parse(localStorage.getItem(STATUS_OVERRIDES_KEY) || "{}");
    } catch (e) {
      console.warn("couldn't parse overrides", e);
    }
  
    setCampaigns(
      initialCampaigns.map(c => ({
        ...c,
        title:  titleOverrides[c.slug]  ?? c.title,
        status: statusOverrides[c.slug] ?? c.status,
      }))
    );
  }, [initialCampaigns]);

  useEffect(() => {
    if (editingCampaign) {
      setEditValues({ title: editingCampaign.title });
    }
  }, [editingCampaign]);

  useEffect(() => {
    // once server state matches our override, clear it
    let statusOverrides = JSON.parse(localStorage.getItem(STATUS_OVERRIDES_KEY) || "{}");
    let changed = false;
  
    const cleaned = initialCampaigns.map(c => {
      if (statusOverrides[c.slug] === c.status) {
        delete statusOverrides[c.slug];
        changed = true;
      }
      return c;
    });
  
    if (changed) {
      localStorage.setItem(STATUS_OVERRIDES_KEY, JSON.stringify(statusOverrides));
    }
  }, [initialCampaigns]);
  

  // useEffect(() => {
  //   setCampaigns(initialCampaigns);
  // }, [initialCampaigns]);

  const handleSave = async () => {
    if (!editingCampaign) return;
    setSaving(true);
  
    // 1️⃣ Safely load existing overrides
    let overrides = {};
    try {
      overrides = JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}");
    } catch (e) {
      console.warn("Failed to parse overrides:", e);
      overrides = {};
    }
  
    // 2️⃣ Optimistic UI update + stash override
    setCampaigns(all =>
      all.map(c =>
        c.slug === editingCampaign.slug
          ? { ...c, title: editValues.title }
          : c
      )
    );
    overrides[editingCampaign.slug] = editValues.title;
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  
    // 3️⃣ Fire off real PATCH
    try {
      const { data: updated } = await API.patch(
        `/campaigns/${editingCampaign.slug}`,
        editValues
      );
  
      // 4️⃣ Clear the override now that server agrees
      delete overrides[updated.slug];
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  
      // 5️⃣ Optionally refetch other analytics or fields
      await refetch?.();
    } catch (err) {
      // 6️⃣ Rollback: re-sync from server
      alert("Save failed—please try again.");
      await refetch?.();
    } finally {
      setSaving(false);
      setEditingCampaign(null);
    }
  };
  
  

  const downloadQRCode = () => {
    if (qrRef.current && selectedQrCode) {
      const svg = qrRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `qrcode-${selectedQrCode.slug}.png`;
        downloadLink.href = pngData;
        downloadLink.click();
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  const renderQRCodeCell = (campaign, shortUrl) => (
    <Tooltip text="Click to enlarge and download">
      <div
        className="w-10 h-10 cursor-pointer relative group"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedQrCode({ url: shortUrl, slug: campaign.slug });
        }}
      >
        <QRCode 
          value={shortUrl} 
          size={40}
          bgColor="transparent"
          fgColor="currentColor"
          className="text-gray-800 dark:text-gray-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded" />
      </div>
    </Tooltip>
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sorted = [...campaigns].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
  });

  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const handleCopy = (slug) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    // In a real app, you might want to use a toast notification here
    alert("Link copied to clipboard!");
  };

  const toggleStatus = async (campaign) => {
    const newStatus = campaign.status === "paused" ? "active" : "paused";
    setSaving(true);
  
    // load existing overrides
    let statusOverrides = {};
    try {
      statusOverrides = JSON.parse(localStorage.getItem(STATUS_OVERRIDES_KEY) || "{}");
    } catch { /* ignore */ }
  
    // ① Optimistically flip the UI
    setCampaigns(all =>
      all.map(c =>
        c.slug === campaign.slug ? { ...c, status: newStatus } : c
      )
    );
  
    // ② Persist the override
    statusOverrides[campaign.slug] = newStatus;
    localStorage.setItem(STATUS_OVERRIDES_KEY, JSON.stringify(statusOverrides));
  
    // ③ Send it to the server
    try {
      await API.patch(`/campaigns/${campaign.slug}`, { status: newStatus });
      // → **do not delete** the override here!
      //    Wait for your parent `refetch()` to actually return the new
      //    status in `initialCampaigns`, then it'll “stick” naturally.
  
      await refetch?.();
    } catch (err) {
      // on failure, roll back by re-fetching server state
      alert("Unable to change campaign status. Reverting…");
      await refetch?.();
    } finally {
      setSaving(false);
    }
  };
  
  

  const toggleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortKey !== columnKey) return <ChevronsUpDown className="inline ml-1 h-4 w-4 opacity-70" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="inline ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="inline ml-1 h-4 w-4" />
    );
  };

  // Generate pagination range with ellipsis
  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);
      
      if (leftBound > 1) range.push(1);
      if (leftBound > 2) range.push("...");
      
      for (let i = leftBound; i <= rightBound; i++) {
        range.push(i);
      }
      
      if (rightBound < totalPages - 1) range.push("...");
      if (rightBound < totalPages) range.push(totalPages);
    }
    
    return range;
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Campaigns</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {campaigns.length} total campaigns • Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* <button
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick={() => alert("Export all campaigns (TBD)")}
          >
            Export All
          </button> */}
          {/* <button
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => alert("Create new campaign (TBD)")}
          >
            New Campaign
          </button> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Title
                  <SortIcon columnKey="title" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => handleSort("clicks")}
              >
                <div className="flex items-center">
                  Clicks
                  <SortIcon columnKey="clicks" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => handleSort("emailCount")}
              >
                <div className="flex items-center">
                  Leads
                  <SortIcon columnKey="emailCount" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Status
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Short Link
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                QR Code
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Actions
              </th>
            </tr>
          </thead>
          {selectedQrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setSelectedQrCode(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCode
                  ref={qrRef}
                  value={selectedQrCode.url}
                  size={256}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Download size={18} />
                  Download PNG
                </button>
                
                <button
                  onClick={() => setSelectedQrCode(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Scan or download this QR code to share your campaign
              </p>
            </div>
          </div>
        </div>
      )}

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            
            {paginated.map((campaign, i) => {
              const topCountry = campaign.locationData?.[0]?.name || 'N/A';
              const isPaused   = campaign.status === "paused";
              const topDevice  = campaign.deviceBreakdown?.[0]?.name || 'N/A';
              const topSource  = campaign.platformBreakdown?.[0]?.name || 'N/A';
              const shortUrl = `${window.location.origin}/${campaign.slug}`;
              const isExpanded = expandedRow === i;
              
              return (
                <React.Fragment key={i}>
                  <tr 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isExpanded ? 'bg-gray-50 dark:bg-gray-700' : ''} cursor-pointer transition-colors`}
                    onClick={() => toggleRowExpand(i)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-300 font-medium">
                            {campaign.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {campaign.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{campaign.clicks}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                      {campaign.ctr ? `${campaign.ctr}% CTR` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{campaign.emailCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {campaign.conversionRate ? `${campaign.conversionRate.toFixed(1)}% conversion` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign.status === "paused"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : campaign.status === "completed"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        }`}
                      >
                        {campaign.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Tooltip text="Click to visit">
                          <Link
                    to={`/${campaign.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    /{campaign.slug}
                  </Link>
                        </Tooltip>
                        <Tooltip text="Copy link">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(campaign.slug);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Tooltip text="Scan QR code">
                        <div className="w-10 h-10">
                          <QRCode 
                            value={shortUrl} 
                            size={40}
                            bgColor="transparent"
                            fgColor="currentColor"
                            className="text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                      <Tooltip text="Edit campaign">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCampaign(campaign);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                            <Pencil size={18} />
                          </button>
                        </Tooltip>
                        <Tooltip text={isPaused ? "Activate campaign" : "Pause campaign"}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(campaign);
                    }}
                    className="text-gray-400 hover:text-yellow-600"
                  >
                    {isPaused ? (
                      <PlayCircle size={18} />
                    ) : (
                      <PauseCircle size={18} />
                    )}
                  </button>
                </Tooltip>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded row with additional details */}
                  {isExpanded && (
  <tr className="bg-gray-50 dark:bg-gray-700">
    <td colSpan="7" className="px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Campaign Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Campaign Details
          </h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <span className="font-medium">Type:</span> {campaign.type || 'Standard'}
            </p>
            <p>
              <span className="font-medium">Created:</span>{' '}
              {new Date(campaign.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Last Updated:</span>{' '}
              {new Date(campaign.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Performance */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Performance
          </h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
          <p><span className="font-medium">Top Country:</span> {topCountry}</p>
          <p><span className="font-medium">Top Device:</span>  {topDevice}</p>
          <p><span className="font-medium">Top Source:</span>  {topSource}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(`${window.location.origin}/${campaign.slug}`);
                alert('Link copied!');
              }}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Copy Link
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/analytics/${campaign.slug}`);
              }}
              className="px-3 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              View Analytics
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // simple “export analytics” by opening the API endpoint in a new tab
                window.open(
                  `/api/campaigns/export/analytics/${campaign.slug}`,
                  '_blank'
                );
              }}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              Export Data
            </button>
          </div>
        </div>

      </div>
    </td>
  </tr>
)}

                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, campaigns.length)}</span> of{' '}
              <span className="font-medium">{campaigns.length}</span> campaigns
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Tooltip text="Previous page">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
              </Tooltip>
              
              {getPaginationRange().map((pageNum, i) => (
                <React.Fragment key={i}>
                  {pageNum === "..." ? (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                      ...
                    </span>
                  ) : (
                    <Tooltip text={`Page ${pageNum}`}>
                      <button
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-200'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    </Tooltip>
                  )}
                </React.Fragment>
              ))}

              <Tooltip text="Next page">
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </Tooltip>
            </nav>
          </div>
        </div>
      </div>

      {/* ————————— Edit Modal ————————— */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm relative">
            <button
              onClick={() => setEditingCampaign(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Edit “{editingCampaign.title}”
            </h3>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded mb-4"
              value={editValues.title}
              onChange={(e) =>
                setEditValues((v) => ({ ...v, title: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingCampaign(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignTable;