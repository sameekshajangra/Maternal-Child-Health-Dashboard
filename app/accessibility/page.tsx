"use client";
import { ruralUrbanData } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Accessibility, MapPin, Users, TrendingUp, AlertCircle, Sparkles, Wallet, Truck, BookOpen } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="tooltip-glass dark:bg-slate-800 dark:border-slate-700">
        <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs mb-2">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color, boxShadow: `0 0 5px ${p.color}80` }} />
            <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const barrierData = [
  { barrier: "Distance to facility", rural: 68, urban: 12, severity: "critical" },
  { barrier: "Cost of services", rural: 61, urban: 28, severity: "critical" },
  { barrier: "No female provider", rural: 54, urban: 19, severity: "high" },
  { barrier: "Permission to go", rural: 45, urban: 8, severity: "high" },
  { barrier: "Transport unavailable", rural: 71, urban: 15, severity: "critical" },
  { barrier: "No awareness", rural: 38, urban: 14, severity: "medium" },
];

const districtData = [
  { district: "Sheohar, Bihar", access: 18, category: "critical" },
  { district: "Bahraich, UP", access: 22, category: "critical" },
  { district: "Sitamarhi, Bihar", access: 25, category: "critical" },
  { district: "Kushinagar, UP", access: 27, category: "critical" },
  { district: "Dhubri, Assam", access: 29, category: "high" },
  { district: "Supaul, Bihar", access: 31, category: "high" },
  { district: "Nalanda, Bihar", access: 78, category: "medium" },
  { district: "Ernakulam, Kerala", access: 96, category: "good" },
];

export default function AccessibilityPage() {
  const avgGap = ruralUrbanData.reduce((acc, d) => acc + (d.urban - d.rural), 0) / ruralUrbanData.length;

  return (
    <div className="page-bg relative min-h-screen p-6 md:p-10 lg:p-12 pt-8 pb-16 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-800/30 w-fit">
          <Accessibility size={12} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-widest">
            Healthcare Access Intelligence
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
          Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Accessibility Analysis</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Rural vs Urban disparity mapping · NFHS-5 District-Level Analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        {[
          { label: "Avg. Rural-Urban Gap", value: `${avgGap.toFixed(1)}%`, color: "#f87171", icon: <TrendingUp size={14} />, desc: "Across all 7 metrics" },
          { label: "Districts < 40% Access", value: "147", color: "#fb923c", icon: <MapPin size={14} />, desc: "Require urgent intervention" },
          { label: "Rural Women with No ANC", value: "48.7%", color: "#fcd34d", icon: <Users size={14} />, desc: "Zero antenatal visits" },
          { label: "Transport Barrier Rate", value: "71%", color: "#a78bfa", icon: <AlertCircle size={14} />, desc: "Rural areas, NFHS-5" },
        ].map((card, i) => (
          <div key={i} className="metric-card p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight max-w-[75%]">{card.label}</div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${card.color}20` }}>
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
            </div>
            <div className="text-3xl font-display font-bold" style={{ color: card.color }}>{card.value}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 relative z-10">
        {/* Rural vs Urban Bar */}
        <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg">Rural vs Urban Healthcare Access</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Service coverage comparison across 7 indicators (%)</p>
            </div>
            <div className="tag tag-blue dark:bg-indigo-950/40 dark:text-indigo-400"><Sparkles size={9} className="mr-1" />NFHS-5</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ruralUrbanData} margin={{ top: 0, right: 0, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700/60" vertical={false} />
              <XAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false}
                angle={-30} textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b", paddingTop: "8px", fontWeight: 600 }} />
              <Bar dataKey="rural" name="Rural" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="urban" name="Urban" fill="#06b6d4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Barriers Chart */}
        <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-1">Healthcare Barriers by Residency</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium">% women reporting each barrier as a problem</p>
          <div className="space-y-5 mt-6">
            {barrierData.map((b, i) => {
              const Icon = b.barrier === "Distance to facility" ? MapPin :
                           b.barrier === "Cost of services" ? Wallet :
                           b.barrier === "No female provider" ? Users :
                           b.barrier === "Permission to go" ? AlertCircle :
                           b.barrier === "Transport unavailable" ? Truck : BookOpen;
              
              const iconColorClass = b.barrier === "Distance to facility" ? "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" :
                                     b.barrier === "Cost of services" ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" :
                                     b.barrier === "No female provider" ? "text-pink-500 bg-pink-50 dark:bg-pink-500/10" :
                                     b.barrier === "Permission to go" ? "text-amber-500 bg-amber-50 dark:bg-amber-500/10" :
                                     b.barrier === "Transport unavailable" ? "text-orange-500 bg-orange-50 dark:bg-orange-500/10" :
                                     "text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10";

              return (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColorClass}`}>
                        <Icon size={14} />
                      </div>
                      <span className="text-[13px] text-slate-700 dark:text-slate-200 font-bold">{b.barrier}</span>
                    </div>
                    <span className={`tag ${b.severity === "critical" ? "tag-red shadow-sm border border-red-200 dark:border-red-900/40" : b.severity === "high" ? "tag-yellow" : "tag-blue"}`} style={{ fontSize: "9px" }}>
                      {b.severity}
                    </span>
                  </div>
                  
                  {/* Staggered Dual Bar Chart */}
                  <div className="pl-[38px] space-y-1.5">
                    {/* Rural */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-indigo-500 dark:text-indigo-400 w-8 font-bold uppercase tracking-wider">Rural</span>
                      <div className="flex-1 relative h-2.5 flex items-center">
                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/80 rounded-full" />
                        <div
                          className="absolute left-0 h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${b.rural}%`, background: "linear-gradient(90deg, #4f46e5, #8b5cf6)", boxShadow: "0 0 8px rgba(99,102,241,0.4)" }}
                        />
                      </div>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-300 w-8 font-black">{b.rural}%</span>
                    </div>
                    {/* Urban */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-500 w-8 font-bold uppercase tracking-wider">Urban</span>
                      <div className="flex-1 relative h-2.5 flex items-center">
                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/80 rounded-full" />
                        <div
                          className="absolute left-0 h-full rounded-full transition-all duration-1000 ease-out delay-100"
                          style={{ width: `${b.urban}%`, background: "linear-gradient(90deg, #06b6d4, #38bdf8)" }}
                        />
                      </div>
                      <span className="text-[11px] text-cyan-600 dark:text-cyan-400 w-8 font-black">{b.urban}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* District-level Access + Radar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
        {/* District access */}
        <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-1">Most Underserved Districts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium">Healthcare accessibility index (0–100)</p>
          <div className="space-y-3">
            {districtData.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{
                  background: d.category === "critical" ? "rgba(239,68,68,0.15)" : d.category === "high" ? "rgba(249,115,22,0.15)" : d.category === "medium" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)",
                  color: d.category === "critical" ? "#ef4444" : d.category === "high" ? "#f97316" : d.category === "medium" ? "#eab308" : "#10b981"
                }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">{d.district}</div>
                  <div className="progress-bar mt-1.5 bg-slate-200 dark:bg-slate-800" style={{ height: "4px" }}>
                    <div
                      style={{
                        height: "4px", borderRadius: "3px",
                        width: `${d.access}%`,
                        background: d.access < 30 ? "#ef4444" : d.access < 50 ? "#f97316" : d.access < 70 ? "#eab308" : "#10b981",
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: d.access < 30 ? "#ef4444" : d.access < 50 ? "#f97316" : d.access < 70 ? "#eab308" : "#10b981" }}>
                    {d.access}
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">/ 100</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-1">Comprehensive Access Radar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium">Rural vs Urban across all health service domains</p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={ruralUrbanData}>
                <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-slate-700/60" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                <Radar name="Rural" dataKey="rural" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Urban" dataKey="urban" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b", fontWeight: 600, paddingTop: '10px' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

