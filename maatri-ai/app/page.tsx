"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { kpiData, trendData, nutritionData, vaccinationData, stateHealthData } from "@/lib/data";
import KPICard from "@/components/KPICard";
import { Sparkles, Activity, Globe, Users, AlertTriangle, TrendingDown, RefreshCw, Download, ChevronRight, CheckCircle2 } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-glass dark:bg-slate-800 dark:border-slate-700">
        <div className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 text-[11px] mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 5px ${p.color}80` }} />
              <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const aiInsights = [
  {
    icon: <AlertTriangle size={16} className="text-red-500" />,
    title: "Critical MMR Hotspot Alert",
    description: "Assam (215), UP (197), Rajasthan (164), and MP (163) account for 67% of national maternal deaths. Immediate SBA deployment required.",
    tag: "Critical",
    tagClass: "tag-red",
  },
  {
    icon: <Activity size={16} className="text-amber-500" />,
    title: "Nutrition Crisis in Central India",
    description: "Bihar (42.9%) and Jharkhand (26.2% wasting) show acute malnutrition exceeding WHO emergency thresholds. Poshan Abhiyan scale-up needed.",
    tag: "High Priority",
    tagClass: "tag-yellow",
  },
  {
    icon: <CheckCircle2 size={16} className="text-emerald-500" />,
    title: "Kerala-Tamil Nadu Model Replicable",
    description: "States with 99%+ institutional delivery achieve MMR <54. Community health worker density and female literacy are key enabling factors.",
    tag: "Insight",
    tagClass: "tag-green",
  },
  {
    icon: <Globe size={16} className="text-indigo-500" />,
    title: "Rural-Urban Delivery Gap Persists",
    description: "15.3% institutional delivery gap between rural (79.5%) and urban (94.8%) areas. Last-mile connectivity remains a structural bottleneck.",
    tag: "Analysis",
    tagClass: "tag-blue",
  },
];

export default function DashboardPage() {
  const [activeMetric, setActiveMetric] = useState("mmr");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setIsRefreshing(false);
    }, 1200);
  };

  const kpiColors: Record<string, string> = {
    mmr: "#f87171", imr: "#f97316", stunting: "#f59e0b",
    anemia: "#8b5cf6", vaccination: "#10b981", delivery: "#3b82f6",
  };

  const kpiIcons: Record<string, React.ReactNode> = {
    mmr: <AlertTriangle size={14} color="#f87171" />,
    imr: <Activity size={14} color="#f97316" />,
    stunting: <TrendingDown size={14} color="#f59e0b" />,
    anemia: <Sparkles size={14} color="#8b5cf6" />,
    vaccination: <Globe size={14} color="#10b981" />,
    delivery: <Users size={14} color="#3b82f6" />,
  };

  const metricKeyMap: Record<string, string> = {
    mmr: "mmr",
    imr: "imr",
    stunting: "stunting",
    anemia: "anemia",
    vaccination: "vaccination",
    delivery: "institutionalDelivery"
  };

  const currentMetricKey = metricKeyMap[activeMetric] || "mmr";
  const isLowerWorse = activeMetric === "vaccination" || activeMetric === "delivery";

  const topRiskStates = [...stateHealthData]
    .sort((a, b) => {
      const valA = a[currentMetricKey as keyof typeof a] as number;
      const valB = b[currentMetricKey as keyof typeof b] as number;
      return isLowerWorse ? valA - valB : valB - valA;
    })
    .slice(0, 5);

  return (
    <div className="page-bg relative min-h-screen p-6 pt-8 pb-12 overflow-hidden transition-colors duration-300">
      
      {/* Banner Graphic Header */}
      <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative mb-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <Image 
          src="/banner.png" 
          alt="Maternal and Child Healthcare Banner" 
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent flex flex-col justify-center px-8 md:px-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 mb-3 text-[11px] font-bold text-indigo-100 uppercase tracking-wide w-fit">
            <div className="relative flex items-center justify-center w-2 h-2">
               <div className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75" />
               <div className="relative w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            </div>
            AI Telemetry · Live NFHS-5 Stream
          </div>
          <h1 className="text-3xl md:text-[2.5rem] font-display font-bold text-white leading-tight tracking-tight">
            National Health Command Center
          </h1>
          <p className="text-slate-200 text-sm mt-2 font-medium tracking-wide max-w-xl">
            Integrated Maternal &amp; Child Health Analytics. Comprehensive Support and Tracking for India 2019–21.
          </p>
        </div>
      </div>

      {/* Sync and Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-wide shadow-sm">
          <div className="relative flex items-center justify-center w-2 h-2">
             <div className="absolute w-full h-full bg-emerald-500 rounded-full animate-ping opacity-75" />
             <div className="relative w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </div>
          <span>SYNC {lastUpdated || "00:00:00"}</span>
        </div>
        <button className="btn-ghost text-xs py-2.5 px-4 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          <Download size={14} />
          Export Data
        </button>
        <button onClick={handleRefresh} className="btn-primary text-xs py-2.5 px-5">
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Syncing..." : "Force Sync"}
        </button>
      </div>

      {/* Stacking Layout: Flex Column */}
      <div className="flex flex-col gap-10">

        {/* Section 1: KPI Cards */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display mb-4 flex items-center gap-2">
            <Activity size={18} className="text-indigo-500" /> Key Performance Indicators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {Object.entries(kpiData).map(([key, kpi], i) => (
              <div
                key={key}
                onClick={() => setActiveMetric(key)}
                className="cursor-pointer dark:bg-slate-800 dark:border-slate-700 rounded-xl"
              >
                <KPICard
                  label={kpi.label}
                  value={kpi.value}
                  unit={kpi.unit}
                  change={kpi.change}
                  target={kpi.target}
                  color={kpiColors[key]}
                  icon={kpiIcons[key]}
                  delay={i * 80}
                  active={activeMetric === key}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: AI Insights & Longitudinal Trend */}
        <section className="flex flex-col xl:flex-row gap-6">
          {/* AI Insights Panel - Moved to the left for better reading flow */}
          <div className="xl:w-1/3 premium-card p-6 flex flex-col bg-white dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                <Sparkles size={18} className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-slate-800 dark:text-white text-base tracking-wide">Automated Insights</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">GPT-4 Turbo Analysis</p>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              {aiInsights.map((insight, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 shrink-0 border border-slate-100 dark:border-slate-700">
                      {insight.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[14px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">{insight.title}</span>
                      </div>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="xl:w-2/3 premium-card p-6 overflow-hidden relative bg-white dark:bg-slate-800 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <div>
                <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg tracking-wide flex items-center gap-2">
                  <Activity size={18} className="text-indigo-500" />
                  Longitudinal Health Trajectory
                </h2>
                <p className="text-[11px] text-slate-400 mt-1 tracking-wider uppercase font-bold">NFHS-3 → NFHS-5 → 2030 SDG Projections</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 pulse-ring" />
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Predictive Model Active</span>
              </div>
            </div>
            
            <div className="h-[400px] w-full mt-2 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="mmrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="imrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="stuntGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="anemGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b", paddingTop: "20px", fontWeight: 600 }} iconType="circle" iconSize={8} />
                  <Area type="monotone" dataKey="mmr" name="MMR" stroke="#f87171" fill="url(#mmrGrad)" strokeWidth={activeMetric === "mmr" || !["mmr", "imr", "stunting", "anemia"].includes(activeMetric) ? 4 : 2} opacity={activeMetric === "mmr" || !["mmr", "imr", "stunting", "anemia"].includes(activeMetric) ? 1 : 0.15} dot={{ fill: "#fff", stroke: "#f87171", strokeWidth: 2, r: activeMetric === "mmr" ? 6 : 4 }} activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="imr" name="IMR" stroke="#f97316" fill="url(#imrGrad)" strokeWidth={activeMetric === "imr" || !["mmr", "imr", "stunting", "anemia"].includes(activeMetric) ? 4 : 2} opacity={activeMetric === "imr" || !["mmr", "imr", "stunting", "anemia"].includes(activeMetric) ? 1 : 0.15} dot={{ fill: "#fff", stroke: "#f97316", strokeWidth: 2, r: activeMetric === "imr" ? 6 : 4 }} activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="stunting" name="Stunting %" stroke="#f59e0b" fill="url(#stuntGrad)" strokeWidth={activeMetric === "stunting" || !["mmr", "imr", "stunting", "anemia"].includes(activeMetric) ? 4 : 2} opacity={activeMetric === "stunting" || !["mmr", "imr", "stunting", "anemia"].includes(activeMetric) ? 1 : 0.15} dot={{ fill: "#fff", stroke: "#f59e0b", strokeWidth: 2, r: activeMetric === "stunting" ? 6 : 4 }} activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="anemia" name="Anemia %" stroke="#8b5cf6" fill="url(#anemGrad)" strokeWidth={activeMetric === "anemia" || !["mmr", "imr", "stunting", "anemia"].includes(activeMetric) ? 4 : 2} opacity={activeMetric === "anemia" || !["mmr", "imr", "stunting", "anemia"].includes(activeMetric) ? 1 : 0.15} dot={{ fill: "#fff", stroke: "#8b5cf6", strokeWidth: 2, r: activeMetric === "anemia" ? 6 : 4 }} activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Section 3: State-level Breakdown */}
        <section className="flex flex-col lg:flex-row gap-6">
          {/* Nutrition Chart */}
          <div className="lg:w-1/2 glass-card p-8 relative overflow-hidden bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-1 relative z-10 tracking-wide">Child Malnutrition by State</h2>
            <p className="text-[12px] text-slate-400 mb-8 relative z-10 uppercase tracking-wider font-bold">NFHS-5 Under-5 children (%)</p>
            
            <div className="h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData.slice(0, 5)} layout="vertical" margin={{ left: 5, right: 15, top: 0, bottom: 0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="state" type="category" tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b", paddingTop: "15px", fontWeight: 600 }} iconType="circle" iconSize={8} />
                  <Bar dataKey="stunting" name="Stunting" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="wasting" name="Wasting" fill="#ec4899" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vaccination Chart */}
          <div className="lg:w-1/2 glass-card p-8 relative overflow-hidden bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-1 relative z-10 tracking-wide">Vaccination Coverage</h2>
            <p className="text-[12px] text-slate-400 mb-8 relative z-10 uppercase tracking-wider font-bold">National coverage vs target (%)</p>
            
            <div className="space-y-6 relative z-10">
              {vaccinationData.map((v, i) => (
                <div key={i} className="group/item">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">{v.vaccine}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-bold text-slate-800 dark:text-white">{v.coverage}%</span>
                      {v.coverage < v.target ? (
                        <span className="tag tag-red" style={{ padding: "4px 8px" }}>-{(v.target - v.coverage).toFixed(1)}%</span>
                      ) : (
                        <span className="tag tag-green" style={{ padding: "4px 8px" }}>✓ TARGET</span>
                      )}
                    </div>
                  </div>
                  <div className="progress-bar dark:bg-slate-700" style={{ height: "8px" }}>
                    <div
                      className="progress-fill relative"
                      style={{
                        width: `${v.coverage}%`,
                        background: v.coverage >= v.target ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                      }}
                    >
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
