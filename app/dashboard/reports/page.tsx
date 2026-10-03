"use client";

import ReportGenerator from "@/components/reports/ReportGenerator";

export default function ReportsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-900 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
          Executive Reports
        </h1>
        <p className="text-gray-400 mt-2">
          Generate McKinsey-style strategic PDF reports synthesizing all intelligence modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReportGenerator />
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center">
          <svg className="w-24 h-24 text-amber-500/20 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM9 11V5h6v6H9zm6 2v6H9v-6h6zM5 5h2v2H5V5zm0 4h2v2H5V9zm0 4h2v2H5v-2zm0 4h2v2H5v-2zm14 2h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z"></path></svg>
          <h3 className="text-xl font-semibold mb-2">Comprehensive Synthesis</h3>
          <p className="text-gray-400 text-sm">
            Our AI engine dynamically compiles Kenya&apos;s Readiness Score, Financial Modeling, HR Gap Analysis, and Stakeholder Matrices into a single, board-ready strategic PDF.
          </p>
        </div>
      </div>
    </div>
  );
}
