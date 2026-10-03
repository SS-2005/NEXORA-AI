"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  Globe, 
  DollarSign, 
  Users, 
  Flag, 
  MessageSquare, 
  Map, 
  FileText,
  Home
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: SidebarItem[] = [
  { name: "Readiness Index", href: "/dashboard/readiness", icon: Activity },
  { name: "Country Benchmarking", href: "/dashboard/benchmarking", icon: Globe },
  { name: "Financing Intelligence", href: "/dashboard/financing", icon: DollarSign },
  { name: "Workforce & HR", href: "/dashboard/hr", icon: Users },
  { name: "IAEA Milestone Engine", href: "/dashboard/milestones", icon: Flag },
  { name: "Stakeholder Intelligence", href: "/dashboard/stakeholders", icon: MessageSquare },
  { name: "AI Roadmap Generator", href: "/dashboard/roadmap", icon: Map },
  { name: "Executive Reports", href: "/dashboard/reports", icon: FileText },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-950 text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col justify-between shrink-0 print:hidden">
        <div>
          {/* Brand/Logo */}
          <div className="p-6 border-b border-gray-800 flex flex-col">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
                NEXORA
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider">
                KE
              </span>
            </Link>
            <p className="text-[11px] text-gray-500 mt-1 font-medium tracking-wide uppercase">
              Kenya Nuclear Initiative
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-400 hover:bg-gray-900/50 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Landing Page</span>
            </Link>
            <div className="h-px bg-gray-800 my-2" />
            
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-400 border-l-4 border-orange-500 pl-3"
                      : "text-gray-400 hover:bg-gray-900/50 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-orange-400" : "text-gray-400 group-hover:text-white"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-800 text-[11px] text-gray-500">
          <p>Target Profile: Kenya</p>
          <p className="mt-0.5">SMR Feasibility Model v1.0</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-900">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50 print:hidden">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Active Intelligence Module</span>
            <h2 className="text-sm font-bold text-white">
              {navItems.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-850 px-3 py-1.5 rounded-lg border border-gray-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-gray-300 font-medium">Model: Kenya 300MW SMR</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
