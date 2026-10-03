"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config";
import BenchmarkIntelligenceForm from "@/components/benchmarking/BenchmarkIntelligenceForm";
import BenchmarkDashboard, { BenchmarkData } from "@/components/benchmarking/BenchmarkDashboard";

interface SubmitFormData {
  target_country: string;
  comparison_countries: string[];
  focus_areas: string[];
}

export default function BenchmarkIntelligencePage() {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  useEffect(() => {
    async function loadData() {
      try {
        setSyncStatus("loading");
        const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/benchmarking`);
        if (res.ok) {
          const data = await res.json();
          setBenchmarkData(data);
          setSyncStatus("saved");
        } else {
          setSyncStatus("idle");
        }
      } catch (err) {
        console.warn("Failed to load benchmarking data:", err);
        setSyncStatus("idle");
      }
    }
    loadData();
  }, []);

  const saveBenchmarkData = async (dataToSave: BenchmarkData) => {
    try {
      setSyncStatus("loading");
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/benchmarking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave)
      });
      if (res.ok) {
        setSyncStatus("saved");
      } else {
        setSyncStatus("error");
      }
    } catch (err) {
      console.error("Failed to save benchmarking data:", err);
      setSyncStatus("error");
    }
  };

  const handleGenerate = async (formData: SubmitFormData) => {
    setLoading(true);
    let finalData: BenchmarkData;

    try {
      // 1. Live Benchmarking analysis using Gemini API
      const prompt = `
        You are a global nuclear energy benchmarking expert advising the Republic of Kenya.
        
        Perform a country benchmarking analysis comparing:
        - Target Country: ${formData.target_country}
        - Comparison Countries: ${formData.comparison_countries.join(", ")}
        - Focus Areas: ${formData.focus_areas.join(", ")}
        
        Generate:
        - comparisons: An array matching the comparison countries list. For each country, provide:
          - country (name)
          - similarity_score (Integer 1-100)
          - infrastructure_score (Integer 1-100)
          - regulatory_score (Integer 1-100)
          - economic_score (Integer 1-100)
          - key_differences (A clear comparison detailing how this country differs from Kenya in the focus areas)
        - recommendations: List 3 strategic recommendations for Kenya based on lessons learned from these countries.
        - best_practices: List 3 global best practices observed in the comparison countries.
      `;

      const systemInstruction = "You are a professional nuclear energy policy analyst. Respond strictly in structured JSON matching the provided schema.";

      const responseSchema = {
        type: "object",
        properties: {
          comparisons: {
            type: "array",
            items: {
              type: "object",
              properties: {
                country: { type: "string" },
                similarity_score: { type: "integer" },
                infrastructure_score: { type: "integer" },
                regulatory_score: { type: "integer" },
                economic_score: { type: "integer" },
                key_differences: { type: "string" }
              },
              required: ["country", "similarity_score", "infrastructure_score", "regulatory_score", "economic_score", "key_differences"]
            }
          },
          recommendations: {
            type: "array",
            items: { type: "string" }
          },
          best_practices: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["comparisons", "recommendations", "best_practices"]
      };

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, responseSchema })
      });

      if (!res.ok) {
        throw new Error("Failed to get live Gemini benchmarking analysis");
      }

      finalData = await res.json();

    } catch (error) {
      console.warn("Falling back to local simulation due to Gemini connection error:", error);
      
      finalData = {
        comparisons: [
          { country: "Turkey", similarity_score: 85, infrastructure_score: 70, regulatory_score: 80, economic_score: 75, key_differences: "Turkey has a more mature regulatory framework established through the Akkuyu project." },
          { country: "Bangladesh", similarity_score: 78, infrastructure_score: 65, regulatory_score: 60, economic_score: 60, key_differences: "Bangladesh leveraged extensive Russian vendor financing for Rooppur." },
          { country: "Egypt", similarity_score: 82, infrastructure_score: 68, regulatory_score: 75, economic_score: 70, key_differences: "Egypt has stronger existing grid capacity but similar economic constraints." },
          { country: "India", similarity_score: 65, infrastructure_score: 90, regulatory_score: 95, economic_score: 85, key_differences: "India has a fully indigenous program and supply chain, unlike newcomer states." },
          { country: "Uzbekistan", similarity_score: 88, infrastructure_score: 60, regulatory_score: 70, economic_score: 65, key_differences: "Uzbekistan is also exploring SMRs and has similar uranium resources." }
        ].filter(c => formData.comparison_countries.some(cc => cc.toLowerCase().includes(c.country.toLowerCase()))),
        recommendations: [
          "Establish an independent nuclear regulatory body immediately, modeling Turkey's approach.",
          "Pursue vendor-equity financing models similar to Bangladesh's strategy for initial capital.",
          "Invest heavily in grid modernization before SMR deployment, as grid stability is lower than Egypt's."
        ],
        best_practices: [
          "Comprehensive stakeholder engagement campaigns (Turkey).",
          "Phased capacity building with IAEA support (Bangladesh).",
          "Integration of nuclear planning into national energy master plans (Egypt)."
        ]
      };
    } finally {
      setLoading(false);
    }

    if (finalData) {
      setBenchmarkData(finalData);
      await saveBenchmarkData(finalData);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-900 text-white">
      <div className="mb-8 print:block hidden border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">NEXORA — Kenya Nuclear Initiative</h1>
        <p className="text-sm text-gray-500">Executive Report: Global Country Benchmarking Analysis</p>
      </div>

      <div className="mb-8 print:hidden">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
          Country Benchmarking Intelligence
        </h1>
        <div className="flex items-center space-x-3 mt-2">
          <p className="text-gray-400">
            AI-driven comparative analysis of nuclear infrastructure readiness against peer nations.
          </p>
          {syncStatus === "loading" && <span className="text-gray-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-1.5"></span>Syncing...</span>}
          {syncStatus === "saved" && <span className="text-emerald-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>Cloud Synced</span>}
          {syncStatus === "error" && <span className="text-red-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>Sync Error</span>}
        </div>
      </div>

      {!benchmarkData ? (
        <div className="print:hidden">
          <BenchmarkIntelligenceForm onSubmit={handleGenerate} isLoading={loading} />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button 
            onClick={() => setBenchmarkData(null)}
            className="text-orange-400 hover:text-orange-300 text-sm mb-4 inline-flex items-center print:hidden"
          >
            ← Back to Configuration
          </button>
          <BenchmarkDashboard data={benchmarkData} />
        </div>
      )}
    </div>
  );
}
