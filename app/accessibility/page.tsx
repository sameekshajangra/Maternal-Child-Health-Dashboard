"use client";
import { ruralUrbanData, stateHealthData } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Accessibility, MapPin, Users, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="tooltip-glass">
        <div className="font-semibold text-white text-xs mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-white/60">{p.name}:</span>
            <span className="font-semibold text-white">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const accessibilityMetrics = [
  { region: "Urban", skilled_attendant: 95.1, anc_visits: 68.1, postnatal: 87.3, vaccination: 91.0, iron_supplement: 61.8, ors_diarrhea: 58.9 },
  { region: "Rural", skilled_attendant: 77.4, anc_visits: 51.3, postnatal: 68.7, vaccination: 75.0, iron_supplement: 43.2, ors_diarrhea: 50.2 },
];

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
    <div className="page-bg relative min-h-screen p-6 pt-8 pb-12 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 w-fit">
          <Accessibility size={12} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-widest">
            Healthcare Access Intelligence
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white">
          Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Accessibility Analysis</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">Rural vs Urban disparity mapping · NFHS-5 District-Level Analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
        {[
          { label: "Avg. Rural-Urban Gap", value: `${avgGap.toFixed(1)}%`, color: "#f87171", icon: <TrendingUp size={14} />, desc: "Across all 7 metrics" },
          { label: "Districts < 40% Access", value: "147", color: "#fb923c", icon: <MapPin size={14} />, desc: "Require urgent intervention" },
          { label: "Rural Women with No ANC", value: "48.7%", color: "#fcd34d", icon: <Users size={14} />, desc: "Zero antenatal visits" },
          { label: "Transport Barrier Rate", value: "71%", color: "#a78bfa", icon: <AlertCircle size={14} />, desc: "Rural areas, NFHS-5" },
        ].map((card, i) => (
          <div key={i} className="metric-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs text-white/50 font-medium leading-tight max-w-[75%]">{card.label}</div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${card.color}20` }}>
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color: card.color }}>{card.value}</div>
            <div className="text-[10px] text-white/30 mt-1">{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6 relative z-10">
        {/* Rural vs Urban Bar */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-white text-lg">Rural vs Urban Healthcare Access</h2>
              <p className="text-xs text-white/40 mt-0.5">Service coverage comparison across 7 indicators (%)</p>
            </div>
            <div className="ai-badge"><Sparkles size={9} />NFHS-5</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ruralUrbanData} margin={{ top: 0, right: 0, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} axisLine={false} tickLine={false}
                angle={-30} textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", paddingTop: "8px" }} />
              <Bar dataKey="rural" name="Rural" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="urban" name="Urban" fill="#06b6d4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Barriers Chart */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-white text-lg mb-1">Healthcare Barriers by Residency</h2>
          <p className="text-xs text-white/40 mb-5">% women reporting each barrier as a problem</p>
          <div className="space-y-4">
            {barrierData.map((b, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/70">{b.barrier}</span>
                  <span className={`tag ${b.severity === "critical" ? "tag-red" : b.severity === "high" ? "tag-yellow" : "tag-blue"}`} style={{ fontSize: "8px" }}>
                    {b.severity}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] text-indigo-400 w-8 text-right">{b.rural}%</span>
                  <div className="flex-1 relative h-5 flex items-center">
                    <div className="absolute inset-0 bg-white/5 rounded-full" />
                    {/* Rural bar */}
                    <div
                      className="absolute left-0 h-3 rounded-full"
                      style={{ width: `${b.rural}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", opacity: 0.8 }}
                    />
                    {/* Urban bar */}
                    <div
                      className="absolute left-0 h-1 rounded-full"
                      style={{ width: `${b.urban}%`, background: "#06b6d4", opacity: 0.9, bottom: 3 }}
                    />
                  </div>
                  <span className="text-[10px] text-cyan-400 w-8">{b.urban}%</span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                <div className="w-8 h-2 rounded-full bg-indigo-500/60" />Rural
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                <div className="w-8 h-1 rounded-full bg-cyan-400/60" />Urban
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District-level Access + Radar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
        {/* District access */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-white text-lg mb-1">Most Underserved Districts</h2>
          <p className="text-xs text-white/40 mb-5">Healthcare accessibility index (0–100)</p>
          <div className="space-y-3">
            {districtData.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{
                  background: d.category === "critical" ? "rgba(239,68,68,0.2)" : d.category === "high" ? "rgba(249,115,22,0.2)" : d.category === "medium" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)",
                  color: d.category === "critical" ? "#f87171" : d.category === "high" ? "#fb923c" : d.category === "medium" ? "#fcd34d" : "#34d399"
                }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{d.district}</div>
                  <div className="progress-bar mt-1.5" style={{ height: "4px" }}>
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
                  <div className="text-lg font-bold" style={{ color: d.access < 30 ? "#f87171" : d.access < 50 ? "#fb923c" : d.access < 70 ? "#fcd34d" : "#34d399" }}>
                    {d.access}
                  </div>
                  <div className="text-[9px] text-white/30">/ 100</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-white text-lg mb-1">Comprehensive Access Radar</h2>
          <p className="text-xs text-white/40 mb-5">Rural vs Urban across all health service domains</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={ruralUrbanData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
              <Radar name="Rural" dataKey="rural" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Urban" dataKey="urban" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
