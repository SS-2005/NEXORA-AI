"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config";
import RoadmapForm from "@/components/roadmap/RoadmapForm";
import RoadmapDashboard, { RoadmapData } from "@/components/roadmap/RoadmapDashboard";

interface RoadmapSubmitData {
  country_name: string;
  target_milestone: number;
  duration_years: number;
  include_workforce: boolean;
  include_financing: boolean;
  include_stakeholders: boolean;
}

export default function RoadmapGeneratorPage() {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  useEffect(() => {
    async function loadData() {
      try {
        setSyncStatus("loading");
        const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/roadmap`);
        if (res.ok) {
          const data = await res.json();
          setRoadmapData(data);
          setSyncStatus("saved");
        } else {
          setSyncStatus("idle");
        }
      } catch (err) {
        console.warn("Failed to load roadmap data:", err);
        setSyncStatus("idle");
      }
    }
    loadData();
  }, []);

  const saveRoadmapData = async (dataToSave: RoadmapData) => {
    try {
      setSyncStatus("loading");
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/roadmap`, {
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
      console.error("Failed to save roadmap data:", err);
      setSyncStatus("error");
    }
  };

  const handleGenerate = async (_formData: RoadmapSubmitData) => {
    setLoading(true);
    console.log("Generating SMR roadmap for", _formData.country_name);
    let finalData: RoadmapData;
    
    try {
      // 1. Live Roadmap synthesis using Gemini API
      const prompt = `
        You are an expert systems planning engineer advising the Government of Kenya on SMR implementation.
        
        Synthesize a nuclear roadmap based on the following configurations:
        - Target Country: ${_formData.country_name}
        - Target Milestone Phase: Phase ${_formData.target_milestone}
        - Roadmap Duration: ${_formData.duration_years} Years
        - Include Workforce Modules: ${_formData.include_workforce}
        - Include Financing Modules: ${_formData.include_financing}
        - Include Stakeholder Modules: ${_formData.include_stakeholders}
        
        Generate exactly 4 chronological phases mapping out tasks from Year 1 to Year ${_formData.duration_years}.
        Assign tasks to Kenyan organisations (e.g., NuPEA, KETRACO, NEMA, Parliament, Treasury, KPLC).
        
        Format output:
        - name: Name of the phase (e.g. Phase 1: Strategic Foundation)
        - description: Quick phase summary.
        - order: Integer order of the phase (1 to 4).
        - tasks: List tasks for that phase, indicating title, assigned_to, and milestone_marker (boolean).
      `;

      const systemInstruction = "You are a professional nuclear systems program director. Respond strictly in structured JSON matching the provided schema.";

      const responseSchema = {
        type: "object",
        properties: {
          version: { type: "integer" },
          phases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                order: { type: "integer" },
                tasks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      assigned_to: { type: "string" },
                      milestone_marker: { type: "boolean" }
                    },
                    required: ["title", "assigned_to", "milestone_marker"]
                  }
                }
              },
              required: ["name", "description", "order", "tasks"]
            }
          }
        },
        required: ["version", "phases"]
      };

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, responseSchema })
      });

      if (!res.ok) {
        throw new Error("Failed to connect to Gemini API for roadmap generation");
      }

      finalData = await res.json();

    } catch (error) {
      console.warn("Falling back to local simulation due to Gemini connection error:", error);
      
      finalData = {
        version: 1,
        phases: [
          {
            name: "Phase 1: 2026–2028 (Legal & Policy Foundation)",
            description: "Enact regulatory laws, confirm vendor-funding protocols, and launch national upskilling channels.",
            order: 1,
            tasks: [
              { title: "Enact the draft Nuclear Regulatory Act in Parliament", assigned_to: "National Assembly / KNRA Liaison", milestone_marker: true },
              { title: "Formulate bilateral vendor funding agreement framework", assigned_to: "National Treasury / NuPEA", milestone_marker: false },
              { title: "Develop nuclear engineering MSc specialization syllabus", assigned_to: "University of Nairobi / JKUAT", milestone_marker: false }
            ]
          },
          {
            name: "Phase 2: 2028–2030 (Site Characterization & Licensing)",
            description: "Execute extensive geologic modeling, secure environmental permits, and conclude grid load reviews.",
            order: 2,
            tasks: [
              { title: "Conduct Rift Valley seismic monitoring & site characterization", assigned_to: "NEMA / NuPEA", milestone_marker: true },
              { title: "Complete 300 MW SMR grid connection load flow study", assigned_to: "KETRACO / KPLC", milestone_marker: false },
              { title: "Establish public communication offices in host regions", assigned_to: "NuPEA PR / Local Factions", milestone_marker: false }
            ]
          },
          {
            name: "Phase 3: 2030–2033 (EPC Contracts & Finance Close)",
            description: "Finalize engineering agreements, secure sovereign guarantees, and execute local workforce placements.",
            order: 3,
            tasks: [
              { title: "Sign Engineering, Procurement & Construction (EPC) contract", assigned_to: "NuPEA / Selected SMR Vendor", milestone_marker: true },
              { title: "Close concessional DFI loans and secure sovereign guarantees", assigned_to: "National Treasury", milestone_marker: true },
              { title: "Initiate overseas simulator training cycle for reactor operators", assigned_to: "NuPEA / Operator Entity", milestone_marker: false }
            ]
          },
          {
            name: "Phase 4: 2033–2035 (Deployment & Commissioning)",
            description: "Execute SMR deployment, start plant commissioning, and achieve operational readiness.",
            order: 4,
            tasks: [
              { title: "SMR reactor installation & construction", assigned_to: "SMR Vendor / EPC Contractor", milestone_marker: true },
              { title: "Cold & hot functional testing of reactor systems", assigned_to: "Nuclear Operator Entity", milestone_marker: false },
              { title: "Grid integration and commercial operation of SMR", assigned_to: "Kenya Power (KPLC)", milestone_marker: true }
            ]
          }
        ]
      };
    } finally {
      setLoading(false);
    }

    if (finalData) {
      setRoadmapData(finalData);
      await saveRoadmapData(finalData);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-900 text-white">
      <div className="mb-8 print:block hidden border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">NEXORA — Kenya Nuclear Initiative</h1>
        <p className="text-sm text-gray-500">Executive Report: AI Multi-Year Implementation Roadmap</p>
      </div>

      <div className="mb-8 print:hidden">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          AI Roadmap Generator
        </h1>
        <div className="flex items-center space-x-3 mt-2">
          <p className="text-gray-400">
            Generate comprehensive, multi-year execution roadmaps encompassing infrastructure, HR, and financing.
          </p>
          {syncStatus === "loading" && <span className="text-gray-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-1.5"></span>Syncing...</span>}
          {syncStatus === "saved" && <span className="text-emerald-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>Cloud Synced</span>}
          {syncStatus === "error" && <span className="text-red-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>Sync Error</span>}
        </div>
      </div>

      {!roadmapData ? (
        <div className="print:hidden">
          <RoadmapForm onSubmit={handleGenerate} isLoading={loading} />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button 
            onClick={() => setRoadmapData(null)}
            className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-flex items-center print:hidden"
          >
            ← Configure New Roadmap
          </button>
          <RoadmapDashboard data={roadmapData} />
        </div>
      )}
    </div>
  );
}
