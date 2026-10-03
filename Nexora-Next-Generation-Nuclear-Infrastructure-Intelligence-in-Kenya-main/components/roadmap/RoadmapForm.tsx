"use client";

import { useState } from "react";

interface RoadmapSubmitData {
  country_name: string;
  target_milestone: number;
  duration_years: number;
  include_workforce: boolean;
  include_financing: boolean;
  include_stakeholders: boolean;
}

interface Props {
  onSubmit: (data: RoadmapSubmitData) => void;
  isLoading: boolean;
}

export default function RoadmapForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState<RoadmapSubmitData>({
    country_name: "Kenya",
    target_milestone: 2,
    duration_years: 10,
    include_workforce: true,
    include_financing: true,
    include_stakeholders: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Roadmap Parameters</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Target Country</label>
            <input 
              type="text" 
              value={formData.country_name}
              onChange={e => setFormData({...formData, country_name: e.target.value})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Target Milestone Phase</label>
            <select
              value={formData.target_milestone}
              onChange={e => setFormData({...formData, target_milestone: parseInt(e.target.value)})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value={1}>Phase 1 (Knowledgeable Commitment)</option>
              <option value={2}>Phase 2 (Invite Bids/Contract)</option>
              <option value={3}>Phase 3 (Commissioning)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Roadmap Duration (Years)</label>
          <input 
            type="number" 
            min={1}
            max={15}
            value={formData.duration_years}
            onChange={e => setFormData({...formData, duration_years: parseInt(e.target.value)})}
            className="w-full md:w-1/3 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        <div className="pt-4 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-400 mb-4">Integration Modules</label>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.include_workforce}
                onChange={e => setFormData({...formData, include_workforce: e.target.checked})}
                className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-900"
              />
              <span className="text-gray-300">Workforce & HR</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.include_financing}
                onChange={e => setFormData({...formData, include_financing: e.target.checked})}
                className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-900"
              />
              <span className="text-gray-300">Financing & Funding</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.include_stakeholders}
                onChange={e => setFormData({...formData, include_stakeholders: e.target.checked})}
                className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-900"
              />
              <span className="text-gray-300">Stakeholder Engagement</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
        >
          {isLoading ? (
            <span>Generating Multi-Year Roadmap...</span>
          ) : (
            <span>Synthesize AI Roadmap</span>
          )}
        </button>
      </form>
    </div>
  );
}
