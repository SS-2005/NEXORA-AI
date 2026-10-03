"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export interface StakeholderConcern {
  concern: string;
}

export interface StakeholderActivity {
  title: string;
  activity_type: string;
  description: string;
}

export interface StakeholderItem {
  name: string;
  group_type: string;
  influence_level: number;
  interest_level: number;
  sentiment: "positive" | "negative" | "neutral";
  key_concerns: StakeholderConcern[];
  activities: StakeholderActivity[];
}

export interface StakeholderData {
  overall_risk_analysis: string;
  stakeholders: StakeholderItem[];
}

interface Props {
  data: StakeholderData;
}

interface ScatterRawData {
  x: number;
  y: number;
  r: number;
}

export default function StakeholderDashboard({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && data.stakeholders) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Scatter plot: Interest (X) vs Influence (Y)
        chartInstance.current = new Chart(ctx, {
          type: "scatter",
          data: {
            datasets: data.stakeholders.map((sh: StakeholderItem) => ({
              label: sh.name,
              data: [{ x: sh.interest_level, y: sh.influence_level, r: 10 }],
              backgroundColor: sh.sentiment === 'positive' ? 'rgba(16, 185, 129, 0.8)' : 
                               sh.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.8)' : 
                               'rgba(156, 163, 175, 0.8)',
              pointRadius: 8,
              pointHoverRadius: 12
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { title: { display: true, text: 'Interest Level', color: '#9ca3af' }, min: 0, max: 6, grid: { color: "rgba(255, 255, 255, 0.1)" } },
              y: { title: { display: true, text: 'Influence Level', color: '#9ca3af' }, min: 0, max: 6, grid: { color: "rgba(255, 255, 255, 0.1)" } }
            },
            plugins: {
              legend: { position: "right", labels: { color: "#fff" } },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || '';
                    const raw = context.raw as ScatterRawData;
                    return `${label} (${raw?.x}, ${raw?.y})`;
                  }
                }
              }
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
      
      {/* Risk Analysis */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">AI Risk Analysis & Executive Summary</h3>
        <p className="text-gray-350 leading-relaxed text-sm">
          {data.overall_risk_analysis}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power-Interest Grid Chart */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Power-Interest Matrix</h3>
          <p className="text-xs text-gray-400 mb-6">Green = Positive, Red = Negative, Gray = Neutral Sentiment</p>
          <div className="h-80">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Strategies */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[420px]">
          <h3 className="text-xl font-semibold mb-6">Engagement Strategies</h3>
          <div className="space-y-4">
            {data.stakeholders?.map((sh: StakeholderItem, idx: number) => (
              <div key={idx} className="bg-gray-900/50 border border-gray-600 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{sh.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sh.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 
                    sh.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' : 
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {sh.sentiment}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Key Concerns:</p>
                  <div className="flex flex-wrap gap-2">
                    {sh.key_concerns?.map((kc: StakeholderConcern, i: number) => (
                      <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
                        {kc.concern}
                      </span>
                    ))}
                  </div>
                </div>

                {sh.activities && sh.activities.length > 0 && (
                  <div className="bg-purple-900/20 border border-purple-500/20 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-purple-300">{sh.activities[0].title}</p>
                    <p className="text-xs text-gray-400 mt-1">{sh.activities[0].description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
