"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/app/config";

export default function ReportGenerator() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // In a real application, you would pass the actual project UUID.
      // We use a dummy UUID for the hackathon UI flow.
      const projectId = "00000000-0000-0000-0000-000000000000";
      
      const response = await fetch(`${API_BASE_URL}/api/v1/reports/${projectId}/generate_pdf`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "NEXORA_Readiness_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the backend PDF generator. Make sure the FastAPI server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Generate PDF</h2>
      
      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
        This will trigger the backend WeasyPrint engine to compile all generated intelligence (HR, Financing, Stakeholders, Benchmarking) into an A4 PDF document styled for executive leadership.
      </p>

      <button 
        onClick={handleDownload}
        disabled={loading}
        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Rendering PDF Engine...
          </span>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Download Executive Report</span>
          </>
        )}
      </button>
    </div>
  );
}
