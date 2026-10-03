"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  Globe, 
  DollarSign, 
  Users, 
  Flag, 
  MessageSquare, 
  Map, 
  FileText,
  AlertTriangle,
  Zap,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"swot" | "canvas" | "timeline">("timeline");
  const [canvasCategory, setCanvasCategory] = useState<string>("value");

  const links = [
    { name: "Readiness Index", desc: "Overall IAEA Milestone readiness and scoring", href: "/dashboard/readiness", icon: Activity, color: "from-blue-500 to-indigo-500" },
    { name: "Country Benchmarking", desc: "Compare against peer nations", href: "/dashboard/benchmarking", icon: Globe, color: "from-orange-500 to-amber-500" },
    { name: "Financing Intelligence", desc: "SMR pre-feasibility & funding models", href: "/dashboard/financing", icon: DollarSign, color: "from-emerald-500 to-cyan-500" },
    { name: "Workforce & HR", desc: "Gap analysis and training programs", href: "/dashboard/hr", icon: Users, color: "from-blue-500 to-emerald-500" },
    { name: "IAEA Milestone Engine", desc: "Track 19 infrastructure milestones", href: "/dashboard/milestones", icon: Flag, color: "from-blue-500 to-teal-500" },
    { name: "Stakeholder Intelligence", desc: "Sentiment analysis and strategies", href: "/dashboard/stakeholders", icon: MessageSquare, color: "from-purple-500 to-pink-500" },
    { name: "AI Roadmap Generator", desc: "Multi-year SMR execution planner", href: "/dashboard/roadmap", icon: Map, color: "from-emerald-500 to-cyan-500" },
    { name: "Executive Reports", desc: "McKinsey-style board syntheses", href: "/dashboard/reports", icon: FileText, color: "from-yellow-500 to-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header / Nav */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-800/60 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
            NEXORA
          </span>
          <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono font-semibold uppercase">
            KE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 font-mono hidden md:inline">Target: Republic of Kenya</span>
          <Link 
            href="/dashboard/readiness" 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orange-500/10"
          >
            Launch Platform
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 relative z-10">
        <div className="max-w-3xl">
          <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            AtomicAura presents
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mt-6 leading-[1.1] tracking-tight">
            Next-Generation Nuclear <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
              Infrastructure Intelligence In Kenya
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mt-6 leading-relaxed">
            An AI-powered decision platform helping Kenya&apos;s government and policymakers assess, plan, and deploy Small Modular Reactors (SMRs) — with precision, confidence, and international standards alignment.
          </p>
        </div>
      </section>

      {/* Main Intelligence Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-2 h-6 bg-orange-500 rounded"></span>
          Interactive Decision Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className="group bg-gray-900/50 backdrop-blur-md border border-gray-800 hover:border-gray-700/80 p-6 rounded-2xl transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between h-48"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                    {link.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    {link.desc}
                  </p>
                </div>
                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1 mt-4 group-hover:text-white transition-colors">
                  Open Module <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Gaps & Challenges Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Problem Statement</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
              Kenya Wants Nuclear Energy. <br />Is It Ready?
            </h2>
            <p className="text-gray-400 mt-4 leading-relaxed">
              Kenya&apos;s electricity demand is growing rapidly. The government has committed to nuclear energy to secure long-term energy independence — yet critical infrastructure gaps remain unaddressed.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">No Operational Plants</h4>
                  <p className="text-xs text-gray-400 mt-1">Zero nuclear power reactors currently deployed across the nation.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Workforce Gap</h4>
                  <p className="text-xs text-gray-400 mt-1">Highly limited specialized nuclear engineers, physicists, and safety regulatory personnel.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Funding Unclear</h4>
                  <p className="text-xs text-gray-400 mt-1">No defined financial model or long-term capital strategy established for SMR procurement.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">No Roadmap</h4>
                  <p className="text-xs text-gray-400 mt-1">Phased implementation timeline fully aligned to IAEA Milestones is currently missing.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-850 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              Why Nuclear Planning is Hard
            </h3>
            <p className="text-sm text-gray-450 leading-relaxed mb-6">
              Kenya faces fragmented planning workflows with no integrated tools, making multi-phase planning and IAEA Milestone tracking highly complex.
            </p>
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
                <span className="font-semibold text-orange-400 block mb-1">IAEA Milestone Complexity</span>
                Requires coordinating 19 distinct infrastructure pillars over three phases, involving hundreds of regulatory criteria.
              </div>
              <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
                <span className="font-semibold text-orange-400 block mb-1">Financial Uncertainty</span>
                High upfront capital costs and long timescales require complex structuring (vendor-equity, PPP, and concessional loans).
              </div>
              <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
                <span className="font-semibold text-orange-400 block mb-1">Diverse Stakeholders</span>
                Managing alignment between NuPEA, regulators, environmental agencies (NEMA), utility providers, and host communities.
              </div>
            </div>
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-center">
              <p className="text-sm italic text-orange-200">
                &quot;Currently, no intelligent platform tells a country: Are we ready? If not, what exactly should we do?&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section (Timeline, SWOT, Canvas) */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex justify-center mb-8 border-b border-gray-800/80">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab("timeline")}
              className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === "timeline" ? "text-orange-400 border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
            >
              Implementation Timeline
            </button>
            <button 
              onClick={() => setActiveTab("swot")}
              className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === "swot" ? "text-orange-400 border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
            >
              SWOT Analysis
            </button>
            <button 
              onClick={() => setActiveTab("canvas")}
              className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === "canvas" ? "text-orange-400 border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
            >
              Business Canvas Model
            </button>
          </div>
        </div>

        {/* Tab 1: Timeline */}
        {activeTab === "timeline" && (
          <div className="space-y-6 animate-in fade-in duration-550">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h3 className="text-2xl font-bold">Kenya Nuclear Roadmapping</h3>
              <p className="text-xs text-gray-450 mt-1">Calibrated to IAEA milestones and tailored to Kenya&apos;s specific readiness profile.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { order: 1, name: "Phase 1 · 2026–2028", title: "Strategic Foundation", desc: "Workforce training programs launch, drafting of the national nuclear policy, and initial stakeholder engagement." },
                { order: 2, name: "Phase 2 · 2028–2030", title: "Regulatory & Funding", desc: "Establish independent regulatory bodies, secure vendor financing structures, and launch SMR feasibility studies." },
                { order: 3, name: "Phase 3 · 2030–2033", title: "Site & Procurement", desc: "Detailed site characterization (Rift Valley / Coast), SMR vendor bidding, and preliminary grid hookup prep." },
                { order: 4, name: "Phase 4 · 2033–2035", title: "Deployment & Commissioning", desc: "SMR construction, cold/hot testing, plant operator certification, and commercial grid integration." },
              ].map((phase) => (
                <div key={phase.order} className="bg-gray-900/40 border border-gray-850 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm mb-4">
                      {phase.order}
                    </span>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{phase.name}</p>
                    <h4 className="font-bold text-white text-lg mt-1">{phase.title}</h4>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: SWOT */}
        {activeTab === "swot" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-550">
            {/* Strengths */}
            <div className="bg-emerald-950/10 border border-emerald-500/20 p-6 rounded-2xl">
              <h4 className="text-emerald-400 font-bold text-lg flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                STRENGTHS
              </h4>
              <ul className="space-y-3 text-sm text-gray-350">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Growing electricity demand drives need for reliable, carbon-free baseload power.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Strong government commitment through the Kenya Nuclear Power and Energy Agency (NuPEA).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  High suitability for Small Modular Reactors (SMRs) due to modular and scalable grids.
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-amber-950/10 border border-amber-500/20 p-6 rounded-2xl">
              <h4 className="text-amber-400 font-bold text-lg flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                WEAKNESSES
              </h4>
              <ul className="space-y-3 text-sm text-gray-350">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  No existing commercial nuclear power plants or experienced operating workforce.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Limited nuclear regulatory frameworks and specialized safety infrastructure.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  National grid requires substantial upgrade/stabilization for nuclear feed-in.
                </li>
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-950/10 border border-blue-500/20 p-6 rounded-2xl">
              <h4 className="text-blue-400 font-bold text-lg flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                OPPORTUNITIES
              </h4>
              <ul className="space-y-3 text-sm text-gray-350">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Achieve long-term national energy security and completely phase out fossil fuel imports.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Access international climate funding and DFI concessional loans (World Bank, AfDB).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Create thousands of high-skilled engineering jobs and build domestic technical capacity.
                </li>
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-red-950/10 border border-red-500/20 p-6 rounded-2xl">
              <h4 className="text-red-400 font-bold text-lg flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                THREATS
              </h4>
              <ul className="space-y-3 text-sm text-gray-350">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  Public concerns over nuclear safety, waste management, and environmental impacts.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  Geological constraints, including high seismic activity inside the Rift Valley zone.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  Political policy fluctuations or delays in legislative passage of nuclear bills.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Canvas */}
        {activeTab === "canvas" && (
          <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl animate-in fade-in duration-550">
            <div className="flex flex-wrap gap-4 mb-6">
              {[
                { id: "partners", label: "Key Partners" },
                { id: "value", label: "Value Propositions" },
                { id: "customer", label: "Customer Segments" },
                { id: "cost", label: "Cost & Revenue" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setCanvasCategory(btn.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${canvasCategory === btn.id ? "bg-orange-500 border-orange-500 text-white" : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {canvasCategory === "partners" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <h4 className="font-bold text-white mb-2">Primary Partners</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Government of Kenya & NuPEA</li>
                    <li>International Atomic Energy Agency (IAEA)</li>
                    <li>SMR Technology Vendors (e.g. NuScale, GE Hitachi)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Development & Education</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Development Banks (AfDB, World Bank)</li>
                    <li>Local Universities (University of Nairobi, JKUAT)</li>
                  </ul>
                </div>
              </div>
            )}

            {canvasCategory === "value" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <h4 className="font-bold text-white mb-2">For the Nation</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Clean, reliable baseload electricity supply</li>
                    <li>Substantial reduction in project execution risk</li>
                    <li>Low-carbon industrial growth & climate targets</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">For the Grid</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Modular grid integration matching existing grid limits</li>
                    <li>Highly skilled engineering workforce development</li>
                  </ul>
                </div>
              </div>
            )}

            {canvasCategory === "customer" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <h4 className="font-bold text-white mb-2">Core Segments</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Government of Kenya (State Energy Planner)</li>
                    <li>Nuclear Plant Operator Entity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Beneficiaries</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Utilities & Grid Operators (KETRACO, KPLC)</li>
                    <li>Industrial electricity consumers & general public</li>
                  </ul>
                </div>
              </div>
            )}

            {canvasCategory === "cost" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <h4 className="font-bold text-white mb-2">Cost Structure</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Staffing, licensing, and training facilities</li>
                    <li>Technology, SMR hardware, and grid equipment</li>
                    <li>International regulatory compliance & oversight</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Revenue Streams</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Government consulting & planning contracts</li>
                    <li>Specialized training and personnel certification</li>
                    <li>International DFI planning & development grants</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Kenya 300 MW Case Summary */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-gray-800">
            <div>
              <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">Reference Case Study</span>
              <h3 className="text-2xl font-bold text-white mt-1">Kenya 300 MW SMR Pre-Feasibility</h3>
            </div>
            <Link 
              href="/dashboard/financing"
              className="text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-4 py-2.5 rounded-xl transition-all"
            >
              Analyze Financial Models
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-6 text-center">
            <div className="p-4 bg-gray-950/45 rounded-2xl border border-gray-900">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Capacity</span>
              <span className="text-2xl font-bold text-white mt-1 block">300 MW</span>
            </div>
            <div className="p-4 bg-gray-950/45 rounded-2xl border border-gray-900">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Estimated Cost</span>
              <span className="text-2xl font-bold text-orange-400 mt-1 block">$4.80B</span>
            </div>
            <div className="p-4 bg-gray-950/45 rounded-2xl border border-gray-900">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Generation</span>
              <span className="text-2xl font-bold text-white mt-1 block">2.36 TWh</span>
            </div>
            <div className="p-4 bg-gray-950/45 rounded-2xl border border-gray-900">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block">LCOE (7.5% WACC)</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">$204/MWh</span>
            </div>
            <div className="p-4 bg-gray-950/45 rounded-2xl border border-gray-900 col-span-2 md:col-span-1">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Peak Demand Share</span>
              <span className="text-2xl font-bold text-blue-400 mt-1 block">12.3%</span>
            </div>
          </div>
        </div>
      </section>

      {/* References Footer */}
      <footer className="bg-gray-950 border-t border-gray-900 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">References & Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-gray-500 leading-relaxed">
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-gray-400 block">[1] International Atomic Energy Agency (IAEA)</span>
                Milestones in the Development of a National Infrastructure for Nuclear Power, IAEA Nuclear Energy Series NG-G-3.1 (Rev.1), Vienna, Austria, 2023.
              </p>
              <p>
                <span className="font-semibold text-gray-400 block">[2] IAEA Small Modular Reactors (SMR) Platform</span>
                Framework guidelines and technical specifications for newcomer states.
              </p>
            </div>
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-gray-400 block">[3] Republic of Kenya General Conference Statement</span>
                Official statement delivered by Kenya at the 69th IAEA General Conference, Vienna, Austria, 2025.
              </p>
              <p>
                <span className="font-semibold text-gray-400 block">[4] Kenya Power and Lighting Company (KPLC)</span>
                Grid stability reports, peak demand limits, and grid expansion documentation.
              </p>
            </div>
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-gray-400 block">[5] Kenya Electricity Transmission Company (KETRACO)</span>
                National transmission grid master plan and high-voltage line upgrades.
              </p>
              <p>
                <span className="font-semibold text-gray-400 block">[6] African Development Bank (AfDB)</span>
                Energy sector planning and financing structures for East African infrastructure.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-900/60 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
            <p>© {new Date().getFullYear()} NEXORA AI. Supported by AtomicAura. All rights reserved.</p>
            <p>Tailored specifically for the Republic of Kenya Nuclear Energy Program.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
