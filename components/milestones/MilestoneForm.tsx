"use client";

import { useState } from "react";

interface MilestoneSubmitData {
  country_name: string;
  target_milestone: number;
  current_status_summary: string;
}

interface Props {
  onSubmit: (data: MilestoneSubmitData) => void;
  isLoading: boolean;
}

export default function MilestoneForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState<MilestoneSubmitData>({
    country_name: "Kenya",
    target_milestone: 1,
    current_status_summary: "The government has issued a formal declaration to pursue nuclear energy (SMRs). A NEPIO (Nuclear Energy Program Implementing Organization) is active under NuPEA (Kenya Nuclear Power and Energy Agency). A draft nuclear bill has been submitted to parliament to establish an independent regulatory authority, but it is not yet fully enacted. Preliminary feasibility and site characterization studies in the Rift Valley are in progress."
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6">Milestone Configuration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Country Name</label>
            <input 
              type="text" 
              value={formData.country_name}
              onChange={e => setFormData({...formData, country_name: e.target.value})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Target IAEA Milestone</label>
            <select
              value={formData.target_milestone}
              onChange={e => setFormData({...formData, target_milestone: parseInt(e.target.value)})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value={1}>Phase 1: Ready to make a knowledgeable commitment</option>
              <option value={2}>Phase 2: Ready to invite bids/negotiate a contract</option>
              <option value={3}>Phase 3: Ready to commission and operate</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Current Status Summary</label>
          <textarea 
            rows={5}
            value={formData.current_status_summary}
            onChange={e => setFormData({...formData, current_status_summary: e.target.value})}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed"
            required
            placeholder="Describe the current state of policy, regulatory framework, NEPIO establishment, etc."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Generating Roadmap...</span>
          ) : (
            <span>Run Milestone Analysis</span>
          )}
        </button>
      </form>
    </div>
  );
}
