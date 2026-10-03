"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export interface ComparisonItem {
  country: string;
  similarity_score: number;
  infrastructure_score: number;
  regulatory_score: number;
  economic_score: number;
  key_differences: string;
}

export interface BenchmarkData {
  comparisons: ComparisonItem[];
  recommendations: string[];
  best_practices: string[];
}

interface Props {
  data: BenchmarkData;
}

export default function BenchmarkDashboard({ data }: Props) {
  const radarChartRef = useRef<HTMLCanvasElement>(null);
  const radarChartInstance = useRef<Chart | null>(null);

  const barChartRef = useRef<HTMLCanvasElement>(null);
  const barChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (data.comparisons) {
      // Radar Chart for Infrastructure / Regulatory / Economic
      if (radarChartRef.current) {
        if (radarChartInstance.current) radarChartInstance.current.destroy();
        
        const ctx = radarChartRef.current.getContext("2d");
        if (ctx) {
          const datasets = data.comparisons.slice(0, 3).map((comp: ComparisonItem, idx: number) => {
            const colors = [
              'rgba(249, 115, 22, 0.5)', // orange
              'rgba(14, 165, 233, 0.5)', // sky
              'rgba(16, 185, 129, 0.5)'  // emerald
            ];
            const borderColors = ['#f97316', '#0ea5e9', '#10b981'];
            
            return {
              label: comp.country,
              data: [comp.infrastructure_score, comp.regulatory_score, comp.economic_score],
              backgroundColor: colors[idx % 3],
              borderColor: borderColors[idx % 3],
              pointBackgroundColor: borderColors[idx % 3],
            };
          });

          radarChartInstance.current = new Chart(ctx, {
            type: "radar",
            data: {
              labels: ["Infrastructure", "Regulatory", "Economic"],
              datasets
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
                  pointLabels: { color: '#fff', font: { size: 14 } },
                  ticks: { display: false }
                }
              },
              plugins: { legend: { labels: { color: '#fff' } } }
            }
          });
        }
      }

      // Bar Chart for Similarity Score
      if (barChartRef.current) {
        if (barChartInstance.current) barChartInstance.current.destroy();
        
        const ctx = barChartRef.current.getContext("2d");
        if (ctx) {
          barChartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: data.comparisons.map((c: ComparisonItem) => c.country),
              datasets: [{
                label: "Similarity Score (%)",
                data: data.comparisons.map((c: ComparisonItem) => c.similarity_score),
                backgroundColor: "rgba(245, 158, 11, 0.8)", // amber
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              scales: {
                x: { max: 100, grid: { color: "rgba(255,255,255,0.1)" } },
                y: { grid: { display: false } }
              },
              plugins: { legend: { display: false } }
            }
          });
        }
      }
    }

    return () => {
      if (radarChartInstance.current) radarChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [data]);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Capability Comparison</h3>
          <p className="text-xs text-gray-400 mb-6">Top 3 matching countries compared across domains.</p>
          <div className="h-72">
            <canvas ref={radarChartRef}></canvas>
          </div>
        </div>

        {/* Similarity Score Bar Chart */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-6">Peer Similarity Matrix</h3>
          <div className="h-72">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Comparisons Table */}
      <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold mb-6">Key Differences Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="pb-3 font-medium">Country</th>
                <th className="pb-3 font-medium text-center">Similarity</th>
                <th className="pb-3 font-medium">Key Distinctions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {data.comparisons?.map((comp: ComparisonItem, idx: number) => (
                <tr key={idx} className="text-gray-200">
                  <td className="py-4 font-semibold whitespace-nowrap">{comp.country}</td>
                  <td className="py-4 text-center text-amber-400 font-bold">{comp.similarity_score}%</td>
                  <td className="py-4 text-sm text-gray-400">{comp.key_differences}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-orange-400">Strategic Recommendations</h3>
          <ul className="space-y-3">
            {data.recommendations?.map((rec: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className="text-orange-500 mr-2">✦</span>
                <span className="text-gray-300 text-sm leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Practices */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-amber-400">Global Best Practices</h3>
          <ul className="space-y-3">
            {data.best_practices?.map((bp: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className="text-amber-500 mr-2">✦</span>
                <span className="text-gray-300 text-sm leading-relaxed">{bp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
