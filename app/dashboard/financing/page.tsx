"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config";
import FinancingIntelligenceForm from "@/components/financing/FinancingIntelligenceForm";
import FinancingDashboard, { FinancingData } from "@/components/financing/FinancingDashboard";

interface FinancingSubmitData {
  country_name: string;
  country_budget_usd_m: number;
  country_gdp_usd_m: number;
  investment_capability_score: number;
  government_support_level: string;
}

export default function FinancingIntelligencePage() {
  const [financingData, setFinancingData] = useState<FinancingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  useEffect(() => {
    async function loadData() {
      try {
        setSyncStatus("loading");
        const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/financing`);
        if (res.ok) {
          const data = await res.json();
          // Map DB keys to matching React Props structure if needed (they are already identical)
          setFinancingData(data);
          setSyncStatus("saved");
        } else {
          setSyncStatus("idle");
        }
      } catch (err) {
        console.warn("Failed to load financing data:", err);
        setSyncStatus("idle");
      }
    }
    loadData();
  }, []);

  const saveFinancingData = async (dataToSave: FinancingData) => {
    try {
      setSyncStatus("loading");
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/00000000-0000-0000-0000-000000000000/financing`, {
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
      console.error("Failed to save financing data:", err);
      setSyncStatus("error");
    }
  };

  const handleGenerate = async (formData: FinancingSubmitData) => {
    setLoading(true);
    
    // 1. Dynamic Calculations (Option 1)
    const baseUnitCostPerMW = 16.0; // $16M per MW
    const targetCapacityMW = 300;  // Reference Capacity
    
    // Scale total cost dynamically based on investment capability (lower capability increases risk premium)
    const riskFactor = 1 + (100 - formData.investment_capability_score) / 200; // e.g. 1.27 for score 45
    const totalCost = Math.round(targetCapacityMW * baseUnitCostPerMW * riskFactor); // $4.8bn to $6bn
    
    // Secured funding based on government support level
    const supportRatio = formData.government_support_level === "high" ? 0.8 : formData.government_support_level === "medium" ? 0.6 : 0.4;
    const securedFunding = Math.round(totalCost * supportRatio);
    const fundingGap = totalCost - securedFunding;
    
    // Calculate feasibility score
    const feasibility = Math.round(
      formData.investment_capability_score * 0.6 + 
      (formData.government_support_level === "high" ? 40 : formData.government_support_level === "medium" ? 20 : 5)
    );

    // Calculate Operating Economics
    const baseLCOE = 204; // $204/MWh at 7.5% WACC
    const dynamicLCOE = Math.round(baseLCOE * (totalCost / 4800));
    const dynamicIRR = parseFloat((7.5 * (50 / (formData.investment_capability_score || 50))).toFixed(1));
    const dynamicPayback = parseFloat((15.0 * (riskFactor)).toFixed(1));

    // Construct the funding breakdown (Slide 11 proportions)
    const ecaAmount = Math.round(totalCost * 0.5);
    const dfiAmount = Math.round(totalCost * 0.2);
    const govAmount = Math.round(totalCost * 0.2);
    const utilityAmount = Math.round(totalCost * 0.1);

    let finalData: FinancingData;

    try {
      // 2. Live Gemini API Call (Option 2)
      const prompt = `
        You are an expert nuclear financial consultant advising the Government of Kenya (Ministry of Energy and National Treasury) on SMR adopts.
        
        Analyze the following pre-feasibility results for a 300 MW SMR program:
        - Target Country: ${formData.country_name}
        - National GDP: $${formData.country_gdp_usd_m}M
        - National Budget: $${formData.country_budget_usd_m}M
        - Total Estimated SMR Cost: $${totalCost}M
        - Secured / Identified Funding: $${securedFunding}M
        - Funding Gap: $${fundingGap}M
        - Feasibility Score: ${feasibility}/100
        - Estimated LCOE (at 7.5% WACC): $${dynamicLCOE}/MWh
        - Project IRR: ${dynamicIRR}%
        - Payback Period: ${dynamicPayback} Years
        - Government Support Level: ${formData.government_support_level}
        
        Provide a concise, professional investment recommendation. Explain how the relationship between Kenya's GDP ($${formData.country_gdp_usd_m}M) and the SMR project cost ($${totalCost}M) necessitates structured financing (ECA, DFI concessional loans, sovereign equity, utility strategic stakes). Keep it under 150 words.
      `;

      const systemInstruction = "You are a McKinsey-style advisor specializing in emerging market infrastructure financing.";

      const responseSchema = {
        type: "object",
        properties: {
          recommendation: { type: "string" }
        },
        required: ["recommendation"]
      };

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, responseSchema })
      });

      if (!res.ok) {
        throw new Error("Failed to get live Gemini analysis");
      }

      const aiResult = await res.json();
      
      finalData = {
        total_estimated_cost_usd_m: totalCost,
        secured_funding_usd_m: securedFunding,
        funding_gap_usd_m: fundingGap,
        feasibility_score: feasibility,
        lcoe_estimate_usd_mwh: dynamicLCOE,
        payback_period_years: dynamicPayback,
        irr_pct: dynamicIRR,
        investment_recommendations: aiResult.recommendation,
        sources: [
          { name: "ECA / Vendor Debt (50%)", source_type: "vendor_financing", amount_usd_m: ecaAmount, interest_rate_pct: 4.5, terms_months: 240, conditions: "Requires sovereign guarantee" },
          { name: "Concessional / DFI Debt (20%)", source_type: "multilateral", amount_usd_m: dfiAmount, interest_rate_pct: 2.5, terms_months: 360, conditions: "ESG compliance & safety audit" },
          { name: "Sovereign Equity (20%)", source_type: "government", amount_usd_m: govAmount, interest_rate_pct: null, terms_months: null, conditions: "Treasury allocation" },
          { name: "Utility & Strategic Equity (10%)", source_type: "private", amount_usd_m: utilityAmount, interest_rate_pct: null, terms_months: null, conditions: "KPLC board representation" }
        ]
      };
    } catch (error) {
      console.warn("Falling back to local simulation due to Gemini connection error:", error);
      
      finalData = {
        total_estimated_cost_usd_m: totalCost,
        secured_funding_usd_m: securedFunding,
        funding_gap_usd_m: fundingGap,
        feasibility_score: feasibility,
        lcoe_estimate_usd_mwh: dynamicLCOE,
        payback_period_years: dynamicPayback,
        irr_pct: dynamicIRR,
        investment_recommendations: `CONDITIONAL PROCEED — secure PPA, financing, grid and site studies before final investment decision.

Given Kenya's GDP ($${formData.country_gdp_usd_m}M), the SMR project represents a significant capital expenditure, requiring a structured 70/30 debt-equity model to protect public debt limits:
- 50% ECA / Vendor Debt ($${ecaAmount}M)
- 20% Concessional / DFI Debt ($${dfiAmount}M)
- 20% Sovereign Equity ($${govAmount}M)
- 10% Utility & Strategic Equity ($${utilityAmount}M)

Priority Action: Formalize the power system integration review with KETRACO and establish a PPA off-take structure with KPLC.`,
        sources: [
          { name: "ECA / Vendor Debt", source_type: "vendor_financing", amount_usd_m: ecaAmount, interest_rate_pct: 4.5, terms_months: 240, conditions: "Tied to EPC contractor selection" },
          { name: "Concessional / DFI Debt", source_type: "multilateral", amount_usd_m: dfiAmount, interest_rate_pct: 2.5, terms_months: 360, conditions: "ESG alignment required" },
          { name: "Sovereign Equity (NuPEA)", source_type: "government", amount_usd_m: govAmount, interest_rate_pct: null, terms_months: null, conditions: "Treasury allocation" },
          { name: "Utility & Strategic Equity", source_type: "private", amount_usd_m: utilityAmount, interest_rate_pct: null, terms_months: null, conditions: "Strategic board stake" }
        ]
      };
    } finally {
      setLoading(false);
    }

    if (finalData) {
      setFinancingData(finalData);
      await saveFinancingData(finalData);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-900 text-white">
      <div className="mb-8 print:block hidden border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">NEXORA — Kenya Nuclear Initiative</h1>
        <p className="text-sm text-gray-500">Executive Report: SMR Pre-Feasibility & Funding Models</p>
      </div>

      <div className="mb-8 print:hidden">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Financing Intelligence
        </h1>
        <div className="flex items-center space-x-3 mt-2">
          <p className="text-gray-400">
            AI-powered financial modeling, funding feasibility, and investment recommendations.
          </p>
          {syncStatus === "loading" && <span className="text-gray-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-1.5"></span>Syncing...</span>}
          {syncStatus === "saved" && <span className="text-emerald-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>Cloud Synced</span>}
          {syncStatus === "error" && <span className="text-red-400 text-xs flex items-center bg-gray-800 px-2 py-0.5 rounded-full"><span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>Sync Error</span>}
        </div>
      </div>

      {!financingData ? (
        <div className="print:hidden">
          <FinancingIntelligenceForm onSubmit={handleGenerate} isLoading={loading} />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button 
            onClick={() => setFinancingData(null)}
            className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-flex items-center print:hidden"
          >
            ← Back to Assessment
          </button>
          <FinancingDashboard data={financingData} />
        </div>
      )}
    </div>
  );
}
