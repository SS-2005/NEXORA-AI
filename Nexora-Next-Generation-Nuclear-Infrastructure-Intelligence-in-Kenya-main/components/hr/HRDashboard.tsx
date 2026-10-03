"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export interface HRGapItem {
  role_category: string;
  gap_count: number;
  criticality: "high" | "medium" | "low";
  recruitment_strategy: string;
}

export interface HRProgramItem {
  name: string;
  provider: string;
  capacity: number;
}

export interface HRData {
  current_workforce_size: number;
  target_workforce_size: number;
  gaps: HRGapItem[];
  programs: HRProgramItem[];
}

interface Props {
  data: HRData;
}

export default function HRDashboard({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && data.gaps) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.gaps.map((g: HRGapItem) => g.role_category),
            datasets: [
              {
                label: "Shortage (Gap)",
                data: data.gaps.map((g: HRGapItem) => g.gap_count),
                backgroundColor: "rgba(239, 68, 68, 0.8)", // red-500
                borderRadius: 4,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, grid: { color: "rgba(255, 255, 255, 0.1)" } },
              x: { grid: { display: false } }
            },
            plugins: {
              legend: { labels: { color: "#fff" } }
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <p className="text-gray-400 text-sm font-medium mb-1">Current Workforce</p>
          <p className="text-4xl font-bold text-white">{data.current_workforce_size}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <p className="text-gray-400 text-sm font-medium mb-1">Target Requirement (SMR)</p>
          <p className="text-4xl font-bold text-blue-400">{data.target_workforce_size}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md border border-red-900/50 p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
          <p className="text-gray-400 text-sm font-medium mb-1 relative z-10">Total Deficit</p>
          <p className="text-4xl font-bold text-red-400 relative z-10">
            {data.target_workforce_size - data.current_workforce_size}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-6">Skill Gap Breakdown</h3>
          <div className="h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Training Recommendations */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[350px]">
          <h3 className="text-xl font-semibold mb-6 text-emerald-400">AI Recommended Programs</h3>
          <div className="space-y-4">
            {data.programs?.map((prog: HRProgramItem, idx: number) => (
              <div key={idx} className="bg-gray-900/50 border border-gray-600 p-4 rounded-xl">
                <p className="font-semibold text-white">{prog.name}</p>
                <p className="text-sm text-gray-400 mt-1">Provider: {prog.provider}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/30">
                    Capacity: {prog.capacity}
                  </span>
                  <span className="text-xs text-gray-500">Planned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recruitment Strategies */}
      <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold mb-6">Recruitment Strategies by Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.gaps?.map((gap: HRGapItem, idx: number) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-semibold text-white flex justify-between">
                {gap.role_category}
                <span className={`text-xs px-2 py-1 rounded-full ${gap.criticality === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {gap.criticality} priority
                </span>
              </h4>
              <p className="text-gray-400 text-sm mt-2">{gap.recruitment_strategy}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
