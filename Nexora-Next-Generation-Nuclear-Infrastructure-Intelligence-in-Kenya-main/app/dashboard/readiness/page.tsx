"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config";
import ReadinessDashboard, { ReadinessData } from "@/components/readiness/ReadinessDashboard";

export default function NuclearReadinessPage() {
  const [data, setData] = useState<ReadinessData | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  useEffect(() => {
    async function loadData() {
      try {
        setSyncStatus("loading");
        const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/readiness`);
        if (res.ok) {
          const fetchedData = await res.json();
          setData(fetchedData);
          setSyncStatus("saved");
        } else {
          setSyncStatus("idle");
        }
      } catch (err) {
        console.warn("Failed to load readiness data:", err);
        setSyncStatus("idle");
      }
    }
    loadData();
  }, []);

  const handleCalculate = () => {
    setLoading(true);
    // Simulating API calculation
    setTimeout(async () => {
      const calculatedData: ReadinessData = {
        overall_score: 72.5,
        overall_grade: "B",
        risk_level: "moderate",
        formula: "Overall = Σ(Score_i × Weight_i × SMR_Factor_i) / Σ(Weight_i × SMR_Factor_i) × 100",
        categories: {
          "Human Resources": 65,
          "Financing": 80,
          "Stakeholders": 55,
          "Infrastructure": 70,
          "Policies & Regulation": 85
        },
        recommendations: [
          "Stakeholder engagement is critically low (55%). Launch national outreach program immediately in Rift Valley.",
          "Human Resources (65%) requires scaling; establish specialized SMR training tracks in technical universities (UoN/JKUAT).",
          "Financing is strong (80%), leverage this to secure early vendor commitments."
        ]
      };
      
      setData(calculatedData);
      setLoading(false);

      // Save to database
      try {
        setSyncStatus("loading");
        const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/readiness`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(calculatedData)
        });
        if (res.ok) {
          setSyncStatus("saved");
        } else {
          setSyncStatus("error");
        }
      } catch (err) {
        console.error("Failed to save readiness data:", err);
        setSyncStatus("error");
      }
    }, 1500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-900 text-white">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Nuclear Readiness Index
          </h1>
          <div className="flex items-center space-x-3 mt-2">
            <p className="text-gray-400">
              Comprehensive IAEA Milestone scoring, aggregated across key infrastructure domains.
            </p>
            {syncStatus === "loading" && <span className="text-gray-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-1.5"></span>Syncing...</span>}
            {syncStatus === "saved" && <span className="text-emerald-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>Cloud Synced</span>}
            {syncStatus === "error" && <span className="text-red-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>Sync Error</span>}
          </div>
        </div>
        {!data && (
          <button 
            onClick={handleCalculate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Run Readiness Assessment"}
          </button>
        )}
      </div>

      {data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button 
            onClick={() => setData(null)}
            className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-flex items-center"
          >
            ← Recalculate
          </button>
          <ReadinessDashboard data={data} />
        </div>
      )}

      {!data && !loading && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-800/20">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <p className="text-gray-400">Click the button above to aggregate all modular scores into the final Readiness Index.</p>
        </div>
      )}
    </div>
  );
}
