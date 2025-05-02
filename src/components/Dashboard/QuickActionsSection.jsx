import React from "react";
import { Zap } from "lucide-react";
import SectionCard from "../common/SectionCard";
import TopLinks from "../TopLinks";
import EmailProgress from "../EmailProgress";
import GoalTracker from "../GoalTracker";

const QuickActionsSection = ({ analytics, totalEmails, totalClicks, isExpanded, onToggle }) => {
  return (
    <SectionCard
      title="Quick Actions"
      icon={<Zap size={18} />}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <TopLinks campaigns={analytics} />
        <EmailProgress totalEmails={totalEmails} />
        <GoalTracker totalClicks={totalClicks} />
      </div>
    </SectionCard>
  );
};

export default QuickActionsSection;
