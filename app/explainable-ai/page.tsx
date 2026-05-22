"use client";
import { useState } from "react";
import { shapFeatures } from "@/lib/data";
import { Brain, Info, Sparkles, BarChart2, ArrowRight, Lightbulb } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="tooltip-glass dark:bg-slate-800 dark:border-slate-700">
        <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs mb-2">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">SHAP Value:</span>
            <span className="font-bold text-indigo-500 dark:text-indigo-400">{p.value.toFixed(4)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const waterfall = [
  { name: "Base Value", value: 0.45, cumulative: 0.45, type: "base" },
  { name: "No SBA", value: 0.287, cumulative: 0.737, type: "positive" },
  { name: "Rural Area", value: 0.241, cumulative: 0.978, type: "positive" },
  { name: "No Education", value: 0.198, cumulative: 1.176, type: "positive" },
  { name: "Poor ANC", value: 0.176, cumulative: 1.352, type: "positive" },
  { name: "Low Wealth", value: 0.163, cumulative: 1.515, type: "positive" },
  { name: "Output", value: 0, cumulative: 1.515, type: "output" },
];

const lime_explanations = [
  { feature: "No skilled birth attendant planned", contribution: "+0.31", direction: "increases", color: "#f87171" },
  { feature: "Lives in rural area > 20km from hospital", contribution: "+0.24", direction: "increases", color: "#fb923c" },
  { feature: "Primary school education only", contribution: "+0.20", direction: "increases", color: "#fcd34d" },
  { feature: "Only 1 ANC visit completed", contribution: "+0.18", direction: "increases", color: "#f97316" },
  { feature: "Below poverty line household", contribution: "+0.16", direction: "increases", color: "#a78bfa" },
  { feature: "Institutional delivery history", contribution: "-0.11", direction: "decreases", color: "#10b981" },
  { feature: "ASHA worker regularly contacted", contribution: "-0.09", direction: "decreases", color: "#3b82f6" },
];

const modelComparison = [
  { model: "XGBoost", auc: 0.891, accuracy: 84.3, precision: 81.7 },
  { model: "Random Forest", auc: 0.874, accuracy: 82.1, precision: 79.4 },
  { model: "Logistic Reg.", auc: 0.823, accuracy: 78.6, precision: 75.2 },
  { model: "Neural Net", auc: 0.867, accuracy: 83.0, precision: 80.1 },
  { model: "SVM", auc: 0.841, accuracy: 80.3, precision: 77.8 },
];

export default function ExplainableAIPage() {
  const [activeTab, setActiveTab] = useState<"shap" | "lime" | "compare">("shap");
  const [selectedFeature, setSelectedFeature] = useState(shapFeatures[0]);

  return (
    <div className="page-bg relative min-h-screen p-6 md:p-10 lg:p-12 pt-8 pb-16 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30 w-fit">
          <Brain size={12} className="text-indigo-650 dark:text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
            XAI Engine · SHAP + LIME Explanations
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
          Explainable <span className="gradient-text">AI Insights</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Transparent AI — understand why the model makes every prediction</p>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        {[
          { key: "shap", label: "SHAP Feature Importance", icon: <BarChart2 size={14} /> },
          { key: "lime", label: "LIME Local Explanation", icon: <Lightbulb size={14} /> },
          { key: "compare", label: "Model Comparison", icon: <Brain size={14} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-205 cursor-pointer ${
              activeTab === tab.key
                ? "btn-primary shadow-sm"
                : "btn-ghost border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "shap" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
          {/* SHAP Bar Chart */}
          <div className="xl:col-span-2 glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
              <div>
                <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg">Global SHAP Feature Importance</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Mean absolute SHAP values · XGBoost model · 2.8M records</p>
              </div>
              <div className="tag tag-blue dark:bg-indigo-950/40 dark:text-indigo-400"><Sparkles size={9} className="mr-1" />SHAP v0.42</div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={shapFeatures}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700/60" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} domain={[0, 0.35]} />
                <YAxis dataKey="feature" type="category" tick={{ fill: "#475569", fontSize: 10, fontWeight: 650 }} axisLine={false} tickLine={false} width={130}
                  tickFormatter={(v: string) => v.length > 20 ? v.substring(0, 20) + "…" : v} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="importance" name="SHAP Value" radius={[0, 4, 4, 0]} onClick={(d: any) => {
                  if (d && d.payload) {
                    setSelectedFeature(d.payload);
                  }
                }}>
                  {shapFeatures.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.direction === "positive" ? "#f87171" : "#10b981"}
                      opacity={selectedFeature.feature === entry.feature ? 1 : 0.7}
                      className="cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="w-3 h-3 rounded-md bg-red-400" /> Increases risk
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="w-3 h-3 rounded-md bg-emerald-500" /> Decreases risk
              </div>
            </div>
          </div>

          {/* Feature Detail */}
          <div className="space-y-4">
            <div className="glass-card p-5 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Info size={14} className="text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm">Feature Detail</h3>
              </div>
              <div className="p-4 rounded-xl mb-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-750">
                <div className="text-sm font-semibold text-slate-800 dark:text-white mb-2">{selectedFeature.feature}</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">SHAP Importance</span>
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{selectedFeature.importance.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Effect Direction</span>
                  <span className={`tag ${selectedFeature.direction === "positive" ? "tag-red" : "tag-green"}`}>
                    {selectedFeature.direction === "positive" ? "↑ Increases Risk" : "↓ Decreases Risk"}
                  </span>
                </div>
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {shapFeatures.map((f, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedFeature(f)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${
                      selectedFeature.feature === f.feature
                        ? "bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/30"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.direction === "positive" ? "bg-red-400" : "bg-emerald-500"}`} />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 flex-1 truncate font-medium">{f.feature}</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{f.importance.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lime" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
          {/* LIME Explanation */}
          <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <div className="mb-6">
              <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg">Local Explanation · High-Risk Case</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">LIME: how each feature pushes this specific prediction</p>
              <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-105 dark:border-red-900/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Patient: Sunita Yadav, 16y, UP</div>
                  <div className="text-sm font-bold text-red-500 dark:text-red-400 mt-1">Predicted Risk: 92% (Critical)</div>
                </div>
                <div className="text-2xl">⚠️</div>
              </div>
            </div>
            <div className="space-y-3">
              {lime_explanations.map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-tight">{item.feature}</span>
                    <span className="font-bold text-sm" style={{ color: item.color === "#34d399" ? "#10b981" : item.color }}>{item.contribution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">
                    <ArrowRight size={11} style={{ color: item.color === "#34d399" ? "#10b981" : item.color }} />
                    <span>This {item.direction} mortality risk</span>
                  </div>
                  <div className="mt-3.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.abs(parseFloat(item.contribution)) * 200)}%`,
                        background: item.color === "#34d399" ? "#10b981" : item.color,
                        opacity: 0.8,
                        marginLeft: parseFloat(item.contribution) < 0 ? "auto" : "0",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waterfall Chart */}
          <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-1">SHAP Waterfall · Risk Build-up</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium">How features accumulate to form the final risk score</p>
            <div className="space-y-2">
              {waterfall.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 w-24 text-right truncate font-bold uppercase tracking-wider">{item.name}</span>
                  <div className="flex-1 relative h-7 flex items-center">
                    <div className="absolute inset-y-0 left-0 right-0 bg-slate-50 dark:bg-slate-900 rounded-lg" />
                    <div
                      className="absolute h-5 rounded-lg flex items-center justify-end pr-1.5"
                      style={{
                        left: item.type === "base" ? "0%" : `${((item.cumulative - item.value) / 1.6) * 100}%`,
                        width: `${(Math.abs(item.value) / 1.6) * 100}%`,
                        background: item.type === "base" ? "rgba(99,102,241,0.4)"
                          : item.type === "output" ? "rgba(16,185,129,0.4)"
                          : item.value > 0 ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)",
                        border: `1px solid ${item.type === "base" ? "#6366f1" : item.type === "output" ? "#10b981" : item.value > 0 ? "#ef4444" : "#10b981"}`,
                      }}
                    >
                      <span className="text-[9px] font-bold text-slate-800 dark:text-white">
                        {item.value > 0 ? "+" : ""}{item.value.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 w-10">{item.cumulative.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-850/30">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={13} className="text-indigo-500 dark:text-indigo-400" />
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">AI Interpretation</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Starting from a base risk of 0.45, the combination of no skilled birth attendant (+0.29) and rural location (+0.24) are the dominant drivers pushing this patient&apos;s risk to the critical threshold.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
          <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-1">Model Performance Comparison</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium">5-fold cross-validation on NFHS-5 holdout dataset</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {["Model", "AUC-ROC", "Accuracy", "Precision"].map(h => (
                      <th key={h} className="text-left py-3 pr-4 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modelComparison.map((m, i) => (
                    <tr key={i} className={`border-b border-slate-100 dark:border-slate-800 ${i === 0 ? "bg-indigo-50 dark:bg-indigo-950/20" : ""}`}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          {i === 0 && <span className="tag tag-blue" style={{ fontSize: "8px", padding: "1px 5px" }}>BEST</span>}
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{m.model}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-emerald-600 dark:text-emerald-400 font-bold">{m.auc}</td>
                      <td className="py-3 pr-4 text-indigo-600 dark:text-indigo-400 font-bold">{m.accuracy}%</td>
                      <td className="py-3 text-purple-650 dark:text-purple-400 font-bold">{m.precision}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-1">AUC-ROC Comparison</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium">Higher is better · Random baseline = 0.5</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={modelComparison} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700/60" vertical={false} />
                <XAxis dataKey="model" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0.75, 0.95]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="auc" name="AUC-ROC" radius={[4, 4, 0, 0]}>
                  {modelComparison.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#6366f1" : "rgba(99,102,241,0.4)"} className="cursor-pointer" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

