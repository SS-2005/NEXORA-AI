"use client";

import { useState } from "react";

interface HRSubmitData {
  country_name: string;
  existing_workforce: number;
  universities: string[];
  training_institutions: string[];
  current_infrastructure_status: string;
}

interface Props {
  onSubmit: (data: HRSubmitData) => void;
  isLoading: boolean;
}

export default function HRIntelligenceForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState({
    country_name: "Kenya",
    existing_workforce: 15,
    universities: "University of Nairobi, Jomo Kenyatta University",
    training_institutions: "Kenya Nuclear Power and Energy Agency (NuPEA)",
    current_infrastructure_status: "Early milestone planning phase. Active partnerships with universities are in development, but specialized local nuclear labs are missing."
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      universities: formData.universities.split(",").map(s => s.trim()),
      training_institutions: formData.training_institutions.split(",").map(s => s.trim())
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6">Initial Assessment Data</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Country Name</label>
            <input 
              type="text" 
              value={formData.country_name}
              onChange={e => setFormData({...formData, country_name: e.target.value})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Existing Nuclear Workforce</label>
            <input 
              type="number" 
              value={formData.existing_workforce}
              onChange={e => setFormData({...formData, existing_workforce: parseInt(e.target.value)})}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Target Universities (comma separated)</label>
          <input 
            type="text" 
            value={formData.universities}
            onChange={e => setFormData({...formData, universities: e.target.value})}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Training Institutions (comma separated)</label>
          <input 
            type="text" 
            value={formData.training_institutions}
            onChange={e => setFormData({...formData, training_institutions: e.target.value})}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Current Infrastructure Status</label>
          <textarea 
            rows={4}
            value={formData.current_infrastructure_status}
            onChange={e => setFormData({...formData, current_infrastructure_status: e.target.value})}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating AI Intelligence...</span>
            </>
          ) : (
            <span>Run HR Intelligence Analysis</span>
          )}
        </button>
      </form>
    </div>
  );
}
