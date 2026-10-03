"use client";

import { useState } from "react";

interface StakeholderSubmitData {
  country_name: string;
  analysis_text: string;
}

interface Props {
  onSubmit: (data: StakeholderSubmitData) => void;
  isLoading: boolean;
}

export default function StakeholderIntelligenceForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState<StakeholderSubmitData>({
    country_name: "Kenya",
    analysis_text: "Recent news indicates strong government push in Kenya for SMRs to stabilize the grid. The Ministry of Energy and NuPEA (Kenya Nuclear Power and Energy Agency) have signed preliminary agreements. However, environmental coalitions have raised questions regarding nuclear waste disposal and potential impacts on local water bodies. Public opinion polls indicate support driven by job creation and clean energy, but there is substantial concern over waste management and geological constraints in the Rift Valley region. International investors are watching the progress of the Nuclear Regulatory Bill in parliament."
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6">Input Data Sources</h2>
      <p className="text-gray-400 mb-6 text-sm">
        Paste news articles, NGO statements, public opinion surveys, or social media transcripts. Our AI will analyze the text to map stakeholders, determine sentiment, and generate engagement strategies.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Country Name</label>
          <input 
            type="text" 
            value={formData.country_name}
            onChange={e => setFormData({...formData, country_name: e.target.value})}
            className="w-full md:w-1/3 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Raw Text / Analysis Input</label>
          <textarea 
            rows={8}
            value={formData.analysis_text}
            onChange={e => setFormData({...formData, analysis_text: e.target.value})}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none leading-relaxed"
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Running NLP Analysis...</span>
          ) : (
            <span>Generate Stakeholder Intelligence</span>
          )}
        </button>
      </form>
    </div>
  );
}
