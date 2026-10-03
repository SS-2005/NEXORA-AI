"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export interface ReadinessCategories {
  [key: string]: number;
}

export interface ReadinessData {
  overall_score: number;
  overall_grade: string;
  risk_level: "low" | "moderate" | "high";
  formula: string;
  categories: ReadinessCategories;
  recommendations: string[];
}

interface Props {
  data: ReadinessData;
}

export default function ReadinessDashboard({ data }: Props) {
  const radarChartRef = useRef<HTMLCanvasElement>(null);
  const radarChartInstance = useRef<Chart | null>(null);

  const gaugeChartRef = useRef<HTMLCanvasElement>(null);
  const gaugeChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Radar Chart
    if (radarChartRef.current && data.categories) {
      if (radarChartInstance.current) radarChartInstance.current.destroy();
      
      const ctx = radarChartRef.current.getContext("2d");
      const labels = Object.keys(data.categories);
      const values = Object.values(data.categories) as number[];

      if (ctx) {
        radarChartInstance.current = new Chart(ctx, {
          type: "radar",
          data: {
            labels,
            datasets: [{
              label: "Readiness Score",
              data: values,
              backgroundColor: "rgba(59, 130, 246, 0.4)", // blue-500
              borderColor: "#3b82f6",
              pointBackgroundColor: "#3b82f6",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#3b82f6"
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 100,
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: '#fff', font: { size: 13 } },
                ticks: { display: false }
              }
            },
            plugins: { legend: { display: false } }
          }
        });
      }
    }

    // Gauge Chart (Using Doughnut)
    if (gaugeChartRef.current && data.overall_score) {
      if (gaugeChartInstance.current) gaugeChartInstance.current.destroy();
      
      const ctx = gaugeChartRef.current.getContext("2d");
      if (ctx) {
        gaugeChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Score", "Remaining"],
            datasets: [{
              data: [data.overall_score, 100 - data.overall_score],
              backgroundColor: [
                data.overall_score >= 80 ? "#10b981" : data.overall_score >= 60 ? "#f59e0b" : "#ef4444",
                "rgba(255,255,255,0.05)"
              ],
              borderWidth: 0,
              circumference: 180,
              rotation: 270
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }
        });
      }
    }

    return () => {
      if (radarChartInstance.current) radarChartInstance.current.destroy();
      if (gaugeChartInstance.current) gaugeChartInstance.current.destroy();
    };
  }, [data]);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge Chart representing Overall Score */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl flex flex-col items-center relative overflow-hidden">
          <h3 className="text-xl font-semibold mb-2 self-start w-full">Overall Readiness</h3>
          <div className="h-48 w-full relative mt-4">
            <canvas ref={gaugeChartRef}></canvas>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
              <span className="text-5xl font-bold">{data.overall_score}</span>
              <span className="text-sm text-gray-400">/ 100</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between w-full">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Grade</p>
              <p className="text-2xl font-bold text-white">{data.overall_grade}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Risk Level</p>
              <p className={`text-xl font-bold capitalize ${
                data.risk_level === 'low' ? 'text-emerald-400' : 
                data.risk_level === 'moderate' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {data.risk_level}
              </p>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Category Breakdown</h3>
          <div className="h-72">
            <canvas ref={radarChartRef}></canvas>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Bars for Categories */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-6">Domain Scores</h3>
          <div className="space-y-6">
            {Object.entries(data.categories).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">{key}</span>
                  <span className="text-sm font-medium text-white">{value}/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations & Formulas */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Algorithm Formula</h3>
            <div className="bg-black/40 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-nowrap">
              {data.formula}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              * The scoring engine applies proprietary weighting factors specific to SMR (Small Modular Reactor) requirements compared to large conventional reactors.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">AI Strategic Recommendations</h3>
            <ul className="space-y-3">
              {data.recommendations?.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-blue-500 mr-2">✦</span>
                  <span className="text-gray-300 text-sm leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
