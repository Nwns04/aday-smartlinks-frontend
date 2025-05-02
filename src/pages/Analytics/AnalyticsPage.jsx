import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import useAnalytics from '../../hooks/useAnalytics';
import Filters from '../../components/Analytics/Filters';
import StatusTabs from '../../components/Analytics/StatusTabs';
import MetricCard from '../../components/Analytics/MetricCard';
import PerformanceChart from '../../components/Analytics/PerformanceChart';
import CampaignsTable from '../../components/Analytics/CampaignsTable';
import Pagination from '../../components/Analytics/Pagination';
import InsightCard from '../../components/Analytics/InsightCard';
import SummaryInsights from '../../components/Analytics/SummaryInsights';


const AnalyticsPage = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("clicks");
  const [timeRange, setTimeRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { loading, sorted, raw } = useAnalytics(user?._id, timeRange, searchTerm, statusFilter, sortBy);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sorted.slice(indexOfFirst, indexOfLast);

  const totalClicks = sorted.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalEmails = sorted.reduce((sum, c) => sum + (c.emailCount || 0), 0);
  const avgCTR = sorted.length
    ? (sorted.reduce((sum, c) => sum + parseFloat(c.ctr || 0), 0) / sorted.length).toFixed(2)
    : 0;

  const topCampaign = sorted.reduce((prev, curr) => (prev.clicks > curr.clicks ? prev : curr), { clicks: 0, title: '' });
  const bestConverter = [...sorted].sort((a, b) =>
    (b.emailCount / b.clicks) - (a.emailCount / a.clicks)
  )[0] || { title: '' };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Campaign Analytics</h2>

      <Filters {...{ searchTerm, setSearchTerm, timeRange, setTimeRange, sortBy, setSortBy }} />
      <StatusTabs current={statusFilter} setStatus={setStatusFilter} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <MetricCard
          title="Total Campaigns"
          value={sorted.length}
          change={sorted.length === raw.length ? "" : `Filtered from ${raw.length}`}
        />
        <MetricCard
          title="Total Clicks"
          value={totalClicks}
          change={`${Math.round(totalClicks / 30)} per day`}
        />
        <MetricCard
          title="Total Emails"
          value={totalEmails}
          change={`${Math.round(totalEmails / 30)} per day`}
        />
        <MetricCard
          title="Avg. CTR"
          value={`${avgCTR}%`}
          change={sorted.length < raw.length ? "Filtered" : ""}
        />
      </div>

      {/* Chart */}
      <PerformanceChart data={sorted.slice(0, 5)} />

      {/* Campaigns Table */}
      <CampaignsTable campaigns={currentItems} sortBy={sortBy} setSortBy={setSortBy} />

      {/* Pagination */}
      <Pagination {...{ currentPage, setCurrentPage, totalItems: sorted.length, itemsPerPage }} />

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <InsightCard
          title="🏆 Top Campaign"
          data={topCampaign}
          metric1={`${topCampaign.clicks} clicks`}
          metric2={`${topCampaign.ctr}% CTR`}
          emptyMessage="No campaigns yet"
        />
        <InsightCard
          title="📈 Best Converter"
          data={bestConverter}
          metric1={`${bestConverter?.emailCount || 0} emails`}
          metric2={`${bestConverter?.conversionRate || 0}% CR`}
          emptyMessage="No conversion data"
        />
        <SummaryInsights campaigns={sorted} raw={raw} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
