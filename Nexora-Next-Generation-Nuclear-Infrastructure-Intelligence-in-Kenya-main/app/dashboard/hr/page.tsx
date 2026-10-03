"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config";
import HRIntelligenceForm from "@/components/hr/HRIntelligenceForm";
import HRDashboard, { HRData } from "@/components/hr/HRDashboard";

interface HRSubmitData {
  country_name: string;
  existing_workforce: number;
  universities: string[];
  training_institutions: string[];
  current_infrastructure_status: string;
}

export default function HRIntelligencePage() {
  const [hrData, setHrData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  useEffect(() => {
    async function loadData() {
      try {
        setSyncStatus("loading");
        const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/hr`);
        if (res.ok) {
          const data = await res.json();
          setHrData(data);
          setSyncStatus("saved");
        } else {
          setSyncStatus("idle");
        }
      } catch (err) {
        console.warn("Failed to load HR data:", err);
        setSyncStatus("idle");
      }
    }
    loadData();
  }, []);

  const saveHRData = async (dataToSave: HRData) => {
    try {
      setSyncStatus("loading");
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/hr`, {
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
      console.error("Failed to save HR data:", err);
      setSyncStatus("error");
    }
  };

  const handleGenerate = async (formData: HRSubmitData) => {
    setLoading(true);
    
    // 1. Dynamic Calculations (Option 1)
    const existingWorkforce = formData.existing_workforce;
    const targetWorkforce = existingWorkforce + 180;
    const totalDeficit = targetWorkforce - existingWorkforce;

    // Distribute skill gaps dynamically based on total deficit
    const gapEngineers = Math.round(totalDeficit * 0.3);
    const gapOperators = Math.round(totalDeficit * 0.25);
    const gapRegulators = Math.round(totalDeficit * 0.15);
    const gapTechnicians = totalDeficit - (gapEngineers + gapOperators + gapRegulators);

    const primaryUniversity = formData.universities[0] || "University of Nairobi";
    const primaryInstitution = formData.training_institutions[0] || "NuPEA";

    let finalData: HRData;

    try {
      // 2. Live Gemini API Call (Option 2)
      const prompt = `
        You are an expert advisor in nuclear human resource capacity building working with the Republic of Kenya.
        
        Analyze the SMR workforce deficit details:
        - Target Country: ${formData.country_name}
        - Existing Nuclear Workforce: ${existingWorkforce} personnel
        - Target SMR Workforce: ${targetWorkforce} personnel
        - Total Deficit: ${totalDeficit} personnel
        
        We have access to the following local institutions:
        - Universities: ${formData.universities.join(", ")}
        - Training Institutions: ${formData.training_institutions.join(", ")}
        
        Current Infrastructure Status:
        "${formData.current_infrastructure_status}"
        
        Suggest 3 SMR training programs. Provide:
        - Program Name (e.g. SMR Engineering, Nuclear Operator Track)
        - Provider (Choose from: ${formData.universities.join(", ")}, or ${formData.training_institutions.join(", ")})
        - Capacity (Integer, e.g. 30, 40)
        
        Also provide recruitment strategy descriptions for:
        - "Nuclear Engineers"
        - "Reactor Operators"
        - "Regulatory Staff"
        - "Technicians"
      `;

      const systemInstruction = "You are a professional IAEA workforce planning consultant. Respond strictly in structured JSON.";

      const responseSchema = {
        type: "object",
        properties: {
          programs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                provider: { type: "string" },
                capacity: { type: "integer" }
              },
              required: ["name", "provider", "capacity"]
            }
          },
          strategies: {
            type: "object",
            properties: {
              engineers: { type: "string" },
              operators: { type: "string" },
              regulators: { type: "string" },
              technicians: { type: "string" }
            },
            required: ["engineers", "operators", "regulators", "technicians"]
          }
        },
        required: ["programs", "strategies"]
      };

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, responseSchema })
      });

      if (!res.ok) {
        throw new Error("Failed to get live Gemini HR analysis");
      }

      const aiResult = await res.json();
      
      finalData = {
        current_workforce_size: existingWorkforce,
        target_workforce_size: targetWorkforce,
        gaps: [
          { role_category: "Nuclear Engineers", gap_count: gapEngineers, criticality: "high", recruitment_strategy: aiResult.strategies.engineers },
          { role_category: "Reactor Operators", gap_count: gapOperators, criticality: "high", recruitment_strategy: aiResult.strategies.operators },
          { role_category: "Regulatory Staff", gap_count: gapRegulators, criticality: "medium", recruitment_strategy: aiResult.strategies.regulators },
          { role_category: "Technicians", gap_count: gapTechnicians, criticality: "medium", recruitment_strategy: aiResult.strategies.technicians }
        ],
        programs: aiResult.programs
      };
    } catch (error) {
      console.warn("Falling back to local simulation due to Gemini connection error:", error);
      
      finalData = {
        current_workforce_size: existingWorkforce,
        target_workforce_size: targetWorkforce,
        gaps: [
          { role_category: "Nuclear Engineers", gap_count: gapEngineers, criticality: "high", recruitment_strategy: `Partner with ${primaryUniversity} to introduce a nuclear engineering specialization.` },
          { role_category: "Reactor Operators", gap_count: gapOperators, criticality: "high", recruitment_strategy: "Establish a simulator-based operator training framework in collaboration with SMR vendors." },
          { role_category: "Regulatory Staff", gap_count: gapRegulators, criticality: "medium", recruitment_strategy: `Recruit science and law graduates, training them in coordination with ${primaryInstitution}.` },
          { role_category: "Technicians", gap_count: gapTechnicians, criticality: "medium", recruitment_strategy: "Outreach to technical training institutes (TTIs) to build specialized welding, electrical, and mechanical SMR competencies." }
        ],
        programs: [
          { name: "SMR Operations Certification", provider: primaryUniversity, capacity: 40 },
          { name: "Nuclear Safety & Regulatory Basics", provider: primaryInstitution, capacity: 25 },
          { name: "SMR Technician Skill Track", provider: "Technical Training Institutes", capacity: 50 }
        ]
      };
    } finally {
      setLoading(false);
    }

    if (finalData) {
      setHrData(finalData);
      await saveHRData(finalData);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-900 text-white">
      <div className="mb-8 print:block hidden border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">NEXORA — Kenya Nuclear Initiative</h1>
        <p className="text-sm text-gray-500">Executive Report: Human Resource & Workforce Gaps</p>
      </div>

      <div className="mb-8 print:hidden">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Human Resource Intelligence
        </h1>
        <div className="flex items-center space-x-3 mt-2">
          <p className="text-gray-400">
            AI-powered workforce prediction and skill gap analysis for nuclear infrastructure.
          </p>
          {syncStatus === "loading" && <span className="text-gray-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-1.5"></span>Syncing...</span>}
          {syncStatus === "saved" && <span className="text-emerald-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>Cloud Synced</span>}
          {syncStatus === "error" && <span className="text-red-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>Sync Error</span>}
        </div>
      </div>

      {!hrData ? (
        <div className="print:hidden">
          <HRIntelligenceForm onSubmit={handleGenerate} isLoading={loading} />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button 
            onClick={() => setHrData(null)}
            className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-flex items-center print:hidden"
          >
            ← Back to Assessment
          </button>
          <HRDashboard data={hrData} />
        </div>
      )}
    </div>
  );
}
