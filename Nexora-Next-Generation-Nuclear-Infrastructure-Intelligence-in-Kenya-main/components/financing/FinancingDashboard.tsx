"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export interface FundingSource {
  name: string;
  source_type: string;
  amount_usd_m: number;
  interest_rate_pct: number | null;
  terms_months: number | null;
  conditions: string;
}

export interface FinancingData {
  total_estimated_cost_usd_m: number;
  secured_funding_usd_m: number;
  funding_gap_usd_m: number;
  feasibility_score: number;
  lcoe_estimate_usd_mwh: number;
  payback_period_years: number;
  irr_pct: number;
  investment_recommendations: string;
  sources: FundingSource[];
}

interface Props {
  data: FinancingData;
}

export default function FinancingDashboard({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && data.sources) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: [...data.sources.map((s: FundingSource) => s.name), "Funding Gap"],
            datasets: [
              {
                data: [...data.sources.map((s: FundingSource) => s.amount_usd_m), data.funding_gap_usd_m],
                backgroundColor: [
                  "rgba(16, 185, 129, 0.8)", // emerald
                  "rgba(6, 182, 212, 0.8)", // cyan
                  "rgba(59, 130, 246, 0.8)", // blue
                  "rgba(251, 191, 36, 0.8)", // amber
                  "rgba(239, 68, 68, 0.8)", // red for gap
                ],
                borderWidth: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "right", labels: { color: "#fff" } }
            }
          }
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="space-y-6">
      
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl text-center">
          <p className="text-gray-400 text-sm font-medium mb-1">Estimated Cost</p>
          <p className="text-3xl font-bold text-white">${data.total_estimated_cost_usd_m}M</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl text-center">
          <p className="text-gray-400 text-sm font-medium mb-1">Secured/Identified</p>
          <p className="text-3xl font-bold text-emerald-400">${data.secured_funding_usd_m}M</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md border border-red-900/50 p-6 rounded-2xl shadow-xl text-center">
          <p className="text-gray-400 text-sm font-medium mb-1">Funding Gap</p>
          <p className="text-3xl font-bold text-red-400">${data.funding_gap_usd_m}M</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600/40 to-cyan-600/40 border border-emerald-500/30 p-6 rounded-2xl shadow-xl text-center flex flex-col justify-center">
          <p className="text-emerald-100 text-sm font-medium mb-1">Feasibility Score</p>
          <p className="text-4xl font-bold text-emerald-400">{data.feasibility_score}/100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-6">Funding Structure</h3>
          <div className="h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">AI Investment Recommendation</h3>
          <p className="text-gray-350 leading-relaxed flex-grow whitespace-pre-line text-sm">
            {data.investment_recommendations}
          </p>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div>
              <p className="text-gray-550 text-xs uppercase tracking-wider">Est. LCOE (7.5% WACC)</p>
              <p className="text-xl font-semibold text-white">${data.lcoe_estimate_usd_mwh}/MWh</p>
            </div>
            <div>
              <p className="text-gray-550 text-xs uppercase tracking-wider">Project IRR</p>
              <p className="text-xl font-semibold text-emerald-400">{data.irr_pct}%</p>
            </div>
            <div>
              <p className="text-gray-550 text-xs uppercase tracking-wider">Payback</p>
              <p className="text-xl font-semibold text-blue-400">{data.payback_period_years} Yrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Sources Breakdown */}
      <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold mb-6">Funding Sources Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="pb-3 font-medium">Source Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Amount ($M)</th>
                <th className="pb-3 font-medium">Interest</th>
                <th className="pb-3 font-medium">Terms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {data.sources?.map((src: FundingSource, idx: number) => (
                <tr key={idx} className="text-gray-200">
                  <td className="py-4 font-medium">{src.name}</td>
                  <td className="py-4 text-sm text-gray-400 capitalize">{src.source_type.replace('_', ' ')}</td>
                  <td className="py-4 font-semibold text-emerald-400">${src.amount_usd_m}M</td>
                  <td className="py-4">{src.interest_rate_pct ? `${src.interest_rate_pct}%` : '-'}</td>
                  <td className="py-4 text-sm">{src.terms_months ? `${src.terms_months} mo` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
