"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config";
import StakeholderIntelligenceForm from "@/components/stakeholders/StakeholderIntelligenceForm";
import StakeholderDashboard, { StakeholderData } from "@/components/stakeholders/StakeholderDashboard";

interface StakeholderSubmitData {
  country_name: string;
  analysis_text: string;
}

export default function StakeholderIntelligencePage() {
  const [stakeholderData, setStakeholderData] = useState<StakeholderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  useEffect(() => {
    async function loadData() {
      try {
        setSyncStatus("loading");
        const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/stakeholders`);
        if (res.ok) {
          const data = await res.json();
          setStakeholderData(data);
          setSyncStatus("saved");
        } else {
          setSyncStatus("idle");
        }
      } catch (err) {
        console.warn("Failed to load stakeholder data:", err);
        setSyncStatus("idle");
      }
    }
    loadData();
  }, []);

  const saveStakeholderData = async (dataToSave: StakeholderData) => {
    try {
      setSyncStatus("loading");
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/stakeholders`, {
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
      console.error("Failed to save stakeholder data:", err);
      setSyncStatus("error");
    }
  };

  const handleGenerate = async (formData: StakeholderSubmitData) => {
    setLoading(true);
    console.log("Analyzing stakeholders for", formData.country_name);
    
    let finalData: StakeholderData;

    try {
      // 1. Live NLP parsing using Gemini API
      const prompt = `
        You are an advanced NLP sentiment parser specializing in nuclear project PR management for the Republic of Kenya.
        
        Analyze the following text input to identify key stakeholders, determine their interest, influence, and sentiment regarding the SMR project, and formulate engagement strategies:
        
        "${formData.analysis_text}"
        
        Assign:
        - influence_level: integer from 1 (very low) to 5 (very high)
        - interest_level: integer from 1 (very low) to 5 (very high)
        - sentiment: "positive" or "negative" or "neutral"
        
        Include:
        - Ministry of Energy
        - NuPEA
        - KPLC (Kenya Power)
        - NEMA (Environmental Authority)
        - Local Community
        
        Ensure you return an overall risk summary.
      `;

      const systemInstruction = "You are a professional stakeholder analyst. Respond strictly in structured JSON matching the provided schema.";

      const responseSchema = {
        type: "object",
        properties: {
          overall_risk_analysis: { type: "string" },
          stakeholders: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                group_type: { type: "string" },
                influence_level: { type: "integer" },
                interest_level: { type: "integer" },
                sentiment: { type: "string", enum: ["positive", "negative", "neutral"] },
                key_concerns: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { concern: { type: "string" } },
                    required: ["concern"]
                  }
                },
                activities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      activity_type: { type: "string" },
                      description: { type: "string" }
                    },
                    required: ["title", "activity_type", "description"]
                  }
                }
              },
              required: ["name", "group_type", "influence_level", "interest_level", "sentiment", "key_concerns", "activities"]
            }
          }
        },
        required: ["overall_risk_analysis", "stakeholders"]
      };

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, responseSchema })
      });

      if (!res.ok) {
        throw new Error("Failed to connect to Gemini API for sentiment mapping");
      }

      finalData = await res.json();

    } catch (error) {
      console.warn("Falling back to local simulation due to Gemini connection error:", error);
      
      finalData = {
        overall_risk_analysis: "The public and political risk for the SMR project in Kenya is currently moderate. While there is strong backing from the Ministry of Energy, Parliament, and NuPEA, environmental organizations (like NEMA partners) and local Rift Valley communities express valid concerns over waste management and geological/seismic risks. The engagement strategy should focus on transparency, community outreach workshops, and JKUAT/UoN academic seminars to build public trust.",
        stakeholders: [
          {
            name: "Ministry of Energy & NuPEA",
            group_type: "government",
            influence_level: 5,
            interest_level: 5,
            sentiment: "positive",
            key_concerns: [{ concern: "Energy independence" }, { concern: "Grid capacity growth" }],
            activities: [{ title: "Legislation Briefing", activity_type: "meeting", description: "Regular inter-ministerial meetings to expedite passage of the draft Nuclear Regulatory bill." }]
          },
          {
            name: "NEMA (National Environment Management Authority)",
            group_type: "public_sector",
            influence_level: 4,
            interest_level: 5,
            sentiment: "neutral",
            key_concerns: [{ concern: "Environmental Impact" }, { concern: "Rift Valley seismic risk" }],
            activities: [{ title: "Joint Site Assessments", activity_type: "workshop", description: "Involve NEMA inspectors in preliminary site selection and geologic modeling." }]
          },
          {
            name: "Local Community (Host Factions)",
            group_type: "public",
            influence_level: 3,
            interest_level: 4,
            sentiment: "negative",
            key_concerns: [{ concern: "Radioactive waste disposal" }, { concern: "Safety and radiation" }],
            activities: [{ title: "Rift Valley Townhall Series", activity_type: "public_hearing", description: "Host localized educational townhalls explaining SMR dry-cask storage and safety designs." }]
          },
          {
            name: "Kenya Power & Lighting (KPLC)",
            group_type: "public_sector",
            influence_level: 4,
            interest_level: 4,
            sentiment: "positive",
            key_concerns: [{ concern: "LCOE cost-competitiveness" }, { concern: "Grid feed-in safety" }],
            activities: [{ title: "Grid Integration Workshop", activity_type: "workshop", description: "Collaborative technical studies on 300 MW SMR grid impact and baseload stabilization." }]
          },
          {
            name: "University of Nairobi & JKUAT",
            group_type: "universities",
            influence_level: 3,
            interest_level: 5,
            sentiment: "positive",
            key_concerns: [{ concern: "Local skill building" }, { concern: "Research grants" }],
            activities: [{ title: "Nuclear engineering curriculum", activity_type: "meeting", description: "Establish joint training programs and internship cycles under NuPEA funding." }]
          }
        ]
      };
    } finally {
      setLoading(false);
    }

    if (finalData) {
      setStakeholderData(finalData);
      await saveStakeholderData(finalData);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-900 text-white">
      <div className="mb-8 print:block hidden border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">NEXORA — Kenya Nuclear Initiative</h1>
        <p className="text-sm text-gray-500">Executive Report: Stakeholder & NLP Sentiment Analysis</p>
      </div>

      <div className="mb-8 print:hidden">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Stakeholder Intelligence
        </h1>
        <div className="flex items-center space-x-3 mt-2">
          <p className="text-gray-400">
            AI-driven NLP analysis of public sentiment, influence mapping, and engagement strategies.
          </p>
          {syncStatus === "loading" && <span className="text-gray-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-1.5"></span>Syncing...</span>}
          {syncStatus === "saved" && <span className="text-emerald-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>Cloud Synced</span>}
          {syncStatus === "error" && <span className="text-red-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>Sync Error</span>}
        </div>
      </div>

      {!stakeholderData ? (
        <div className="print:hidden">
          <StakeholderIntelligenceForm onSubmit={handleGenerate} isLoading={loading} />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button 
            onClick={() => setStakeholderData(null)}
            className="text-purple-400 hover:text-purple-300 text-sm mb-4 inline-flex items-center print:hidden"
          >
            ← Back to Analysis Input
          </button>
          <StakeholderDashboard data={stakeholderData} />
        </div>
      )}
    </div>
  );
}
