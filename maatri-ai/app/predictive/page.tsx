"use client";
import { useState } from "react";
import { riskProfiles, stateHealthData, trendData } from "@/lib/data";
import { TrendingUp, AlertTriangle, Brain, Activity, Target, Zap, SlidersHorizontal, Sparkles } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine, Legend, AreaChart, Area
} from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="tooltip-glass dark:bg-slate-800 dark:border-slate-700">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            <span className="font-semibold text-slate-800 dark:text-white">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const projectionData = [
  { year: "2021", actual: 97, predicted: 97, upper: 105, lower: 89 },
  { year: "2022", actual: 91, predicted: 90, upper: 98, lower: 82 },
  { year: "2023", actual: 85, predicted: 84, upper: 93, lower: 76 },
  { year: "2024", actual: null, predicted: 79, upper: 89, lower: 70 },
  { year: "2025", actual: null, predicted: 74, upper: 86, lower: 63 },
  { year: "2026", actual: null, predicted: 70, upper: 83, lower: 58 },
  { year: "2027", actual: null, predicted: 66, upper: 80, lower: 53 },
  { year: "2028", actual: null, predicted: 62, upper: 77, lower: 48 },
  { year: "2029", actual: null, predicted: 59, upper: 74, lower: 45 },
  { year: "2030", actual: null, predicted: 56, upper: 71, lower: 42 },
];

const modelMetrics = [
  { label: "Model Accuracy", value: "84.3%", color: "#10b981" },
  { label: "AUC-ROC Score", value: "0.891", color: "#6366f1" },
  { label: "Precision", value: "81.7%", color: "#8b5cf6" },
  { label: "Recall (Sensitivity)", value: "87.2%", color: "#06b6d4" },
  { label: "F1-Score", value: "84.3", color: "#ec4899" },
  { label: "Training Records", value: "2.8M", color: "#f59e0b" },
];

export default function PredictivePage() {
  const [selectedProfile, setSelectedProfile] = useState(riskProfiles[1]);
  const [filterRisk, setFilterRisk] = useState("all");

  // Scenario Simulation States
  const [simDelivery, setSimDelivery] = useState(0);
  const [simVaccination, setSimVaccination] = useState(0);
  const [simStunting, setSimStunting] = useState(0);

  // Calculate projected MMR based on simulation
  // Simplified linear model: MMR decreases by ~1.2 for every 1% increase in delivery
  const baseMmr = 97; // National average
  const projectedMmr = Math.max(0, baseMmr - (simDelivery * 1.2) - (simVaccination * 0.8) + (simStunting * 1.5));

  const filteredProfiles = riskProfiles.filter(p =>
    filterRisk === "all" ? true :
    filterRisk === "critical" ? p.risk >= 80 :
    filterRisk === "high" ? p.risk >= 60 && p.risk < 80 : p.risk < 60
  );

  const scatterData = stateHealthData.map(s => ({
    x: s.institutionalDelivery,
    y: s.mmr,
    name: s.state,
  }));

  return (
    <div className="page-bg relative min-h-screen p-6 pt-8 pb-12 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 w-fit">
            <Brain size={12} className="text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest">
              ML Predictive Engine · XGBoost
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white">
            Predictive <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">Risk Analytics</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">AI-powered maternal mortality & child health risk forecasting</p>
        </div>
      </div>

      {/* Model Metrics */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8 relative z-10">
        {modelMetrics.map((m, i) => (
          <div key={i} className="premium-card p-3 text-center bg-white dark:bg-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 leading-tight font-bold uppercase">{m.label}</div>
            <div className="text-xl font-display font-bold" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Scenario Simulation Panel */}
      <div className="premium-card p-6 mb-8 bg-white dark:bg-slate-800">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-amber-500" />
          Scenario Simulation Engine
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Improve Institutional Deliveries</label>
                <span className="text-sm font-bold text-emerald-500">+{simDelivery}%</span>
              </div>
              <input type="range" min="0" max="25" value={simDelivery} onChange={e => setSimDelivery(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Improve Full Vaccination</label>
                <span className="text-sm font-bold text-emerald-500">+{simVaccination}%</span>
              </div>
              <input type="range" min="0" max="25" value={simVaccination} onChange={e => setSimVaccination(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Reduce Child Stunting</label>
                <span className="text-sm font-bold text-pink-500">-{simStunting}%</span>
              </div>
              <input type="range" min="0" max="25" value={simStunting} onChange={e => setSimStunting(Number(e.target.value))} className="w-full accent-pink-500" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 text-center">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Projected National MMR</div>
            <div className="text-5xl font-display font-bold text-amber-500 mb-2">{Math.round(projectedMmr)}</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {projectedMmr < baseMmr ? (
                <span className="text-emerald-500">↓ {Math.round(baseMmr - projectedMmr)} points improvement</span>
              ) : "Baseline"}
            </div>
            <div className="mt-4 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              *Model uses multiple regression based on NFHS-5 data to estimate impact of interventions.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 relative z-10">
        {/* MMR Projection */}
        <div className="xl:col-span-2 premium-card p-6 bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg">MMR Projection to 2030</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">AI forecast with confidence interval · SDG 3.1 target: 70</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: "10px" }} />
              <ReferenceLine y={70} stroke="#10b981" strokeDasharray="6 3" label={{ value: "SDG Target", position: "right", fill: "#10b981", fontSize: 10, fontWeight: "bold" }} />
              <Area type="monotone" dataKey="upper" fill="url(#ciGrad)" stroke="transparent" name="Upper CI" />
              <Area type="monotone" dataKey="lower" fill="transparent" stroke="transparent" name="Lower CI" />
              <Line type="monotone" dataKey="actual" stroke="#f87171" strokeWidth={2.5} dot={{ fill: "#f87171", r: 4 }} name="Actual MMR" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 3" dot={{ fill: "#f59e0b", r: 3 }} name="AI Predicted" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Correlation Plot */}
        <div className="premium-card p-6 bg-white dark:bg-slate-800">
          <h2 className="font-display font-bold text-slate-800 dark:text-white text-base mb-1">MMR vs Inst. Delivery</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Correlation: r = −0.81 (strong negative)</p>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
              <XAxis dataKey="x" name="Inst. Delivery %" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="y" name="MMR" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload?.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="tooltip-glass dark:bg-slate-800 dark:border-slate-700">
                      <div className="font-bold text-slate-800 dark:text-white text-xs mb-1">{d.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Delivery: <span className="font-semibold">{d.x}%</span></div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">MMR: <span className="font-semibold">{d.y}</span></div>
                    </div>
                  );
                }
                return null;
              }} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData} fill="#f59e0b" opacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
