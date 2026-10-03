"use client";

import { useState } from "react";

interface FinancingSubmitData {
  country_name: string;
  country_budget_usd_m: number;
  country_gdp_usd_m: number;
  investment_capability_score: number;
  government_support_level: string;
}

interface Props {
  onSubmit: (data: FinancingSubmitData) => void;
  isLoading: boolean;
}

export default function FinancingIntelligenceForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState<FinancingSubmitData>({
    country_name: "Kenya",
    country_budget_usd_m: 28000,
    country_gdp_usd_m: 113000,
    investment_capability_score: 45,
    government_support_level: "high"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6">Financial Assessment Data</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Country Name</label>
            <input 
              type="text" 
              value={formData.country_name}
              onChange={e => setFormData({...formData, country_name: e.target.value})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Government Support Level</label>
            <select
              value={formData.government_support_level}
              onChange={e => setFormData({...formData, government_support_level: e.target.value})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">National Budget ($M)</label>
            <input 
              type="number" 
              value={formData.country_budget_usd_m}
              onChange={e => setFormData({...formData, country_budget_usd_m: parseFloat(e.target.value)})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">GDP ($M)</label>
            <input 
              type="number" 
              value={formData.country_gdp_usd_m}
              onChange={e => setFormData({...formData, country_gdp_usd_m: parseFloat(e.target.value)})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Investment Capability (0-100)</label>
            <input 
              type="number" 
              value={formData.investment_capability_score}
              onChange={e => setFormData({...formData, investment_capability_score: parseFloat(e.target.value)})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              max="100" min="0"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Generating Financial Models...</span>
          ) : (
            <span>Run Financing Intelligence Analysis</span>
          )}
        </button>
      </form>
    </div>
  );
}
