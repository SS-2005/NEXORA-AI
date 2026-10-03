"use client";

import { useState } from "react";

interface BenchmarkSubmitData {
  target_country: string;
  comparison_countries: string[];
  focus_areas: string[];
}

interface Props {
  onSubmit: (data: BenchmarkSubmitData) => void;
  isLoading: boolean;
}

export default function BenchmarkIntelligenceForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState({
    target_country: "Kenya",
    comparison_countries: "Turkey, Bangladesh, Egypt, India, Uzbekistan",
    focus_areas: "infrastructure, regulatory, economic"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      target_country: formData.target_country,
      comparison_countries: formData.comparison_countries.split(",").map(s => s.trim()),
      focus_areas: formData.focus_areas.split(",").map(s => s.trim())
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6">Benchmarking Configuration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Target Country</label>
          <input 
            type="text" 
            value={formData.target_country}
            onChange={e => setFormData({...formData, target_country: e.target.value})}
            className="w-full md:w-1/3 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Comparison Countries (Comma Separated)</label>
          <input 
            type="text" 
            value={formData.comparison_countries}
            onChange={e => setFormData({...formData, comparison_countries: e.target.value})}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Focus Areas (Comma Separated)</label>
          <input 
            type="text" 
            value={formData.focus_areas}
            onChange={e => setFormData({...formData, focus_areas: e.target.value})}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Processing Macro Data...</span>
          ) : (
            <span>Run Benchmarking Analysis</span>
          )}
        </button>
      </form>
    </div>
  );
}
