"use client";

export interface MilestoneActionItem {
  title: string;
  description: string;
  responsible_organization: string;
  status: "pending" | "in_progress" | "completed";
}

export interface MilestoneDetails {
  milestone_number: number;
  status: string;
  completion_percentage: number;
  action_items: MilestoneActionItem[];
}

export interface MilestoneData {
  milestone: MilestoneDetails;
  estimated_timeline_months: number;
  missing_infrastructure: string[];
  recommendations: string[];
}

interface Props {
  data: MilestoneData;
}

export default function MilestoneDashboard({ data }: Props) {
  
  const getPhaseName = (num: number) => {
    switch(num) {
      case 1: return "Phase 1: Knowledgeable Commitment";
      case 2: return "Phase 2: Invite Bids / Contract";
      case 3: return "Phase 3: Commissioning & Operation";
      default: return `Phase ${num}`;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 to-teal-900/40 border border-teal-500/25 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">Target Objective</span>
          <h3 className="text-2xl font-bold text-white mt-1">{getPhaseName(data.milestone.milestone_number)}</h3>
          <p className="text-xs text-gray-400 mt-1">Estimated timeline to achieve next phase: {data.estimated_timeline_months} months</p>
        </div>
        <div className="text-center bg-gray-900/80 px-6 py-4 rounded-xl border border-gray-700/80">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Assessment Score</p>
          <p className="text-4xl font-extrabold text-teal-400 mt-1">{data.milestone.completion_percentage}%</p>
          <span className="text-[10px] text-gray-400 font-mono">Phase Progress</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Missing Infrastructure & Gaps */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-red-400">Identified Gaps</h3>
          <p className="text-xs text-gray-400 mb-6">Key infrastructure pillars blocking milestone completion.</p>
          <ul className="space-y-3">
            {data.missing_infrastructure?.map((infra: string, idx: number) => (
              <li key={idx} className="flex items-start text-sm text-gray-300">
                <span className="text-red-500 mr-2">✕</span>
                {infra}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items List */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-6">Required Deliverables</h3>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {data.milestone.action_items?.map((item: MilestoneActionItem, idx: number) => (
              <div key={idx} className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded uppercase font-bold font-mono">
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.description}</p>
                <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-3 text-[10px] text-gray-500">
                  <span>Owner: {item.responsible_organization}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic AI recommendations */}
      <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">AI Implementation Insights</h3>
        <ul className="space-y-3">
          {data.recommendations?.map((rec: string, idx: number) => (
            <li key={idx} className="flex items-start text-sm text-gray-300 leading-relaxed">
              <span className="text-blue-400 mr-3 mt-1 font-bold">✦</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
