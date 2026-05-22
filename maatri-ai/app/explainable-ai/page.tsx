"use client";
import { useState } from "react";
import { shapFeatures } from "@/lib/data";
import { Brain, Info, Sparkles, BarChart2, ArrowRight, Lightbulb } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="tooltip-glass max-w-[220px]">
        <div className="font-semibold text-white text-xs mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="text-xs">
            <span className="text-white/60">SHAP Value: </span>
            <span className="font-semibold text-indigo-300">{p.value.toFixed(3)}</span>
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
  { feature: "Institutional delivery history", contribution: "-0.11", direction: "decreases", color: "#34d399" },
  { feature: "ASHA worker regularly contacted", contribution: "-0.09", direction: "decreases", color: "#60a5fa" },
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
    <div className="relative min-h-screen p-6 pt-8">
      <div className="blob blob-1 fixed" />
      <div className="blob blob-2 fixed" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="ai-badge mb-3">
          <Brain size={10} />
          XAI Engine · SHAP + LIME Explanations
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
          Explainable <span className="gradient-text">AI Insights</span>
        </h1>
        <p className="text-white/50 text-sm mt-1.5">Transparent AI — understand why the model makes every prediction</p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-6 relative z-10">
        {[
          { key: "shap", label: "SHAP Feature Importance", icon: <BarChart2 size={13} /> },
          { key: "lime", label: "LIME Local Explanation", icon: <Lightbulb size={13} /> },
          { key: "compare", label: "Model Comparison", icon: <Brain size={13} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.key ? "btn-primary py-2" : "btn-ghost py-2"}`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === "shap" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
          {/* SHAP Bar Chart */}
          <div className="xl:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-white text-lg">Global SHAP Feature Importance</h2>
                <p className="text-xs text-white/40 mt-0.5">Mean absolute SHAP values · XGBoost model · 2.8M records</p>
              </div>
              <div className="ai-badge"><Sparkles size={9} />SHAP v0.42</div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={shapFeatures}
                layout="vertical"
                margin={{ top: 0, right: 40, bottom: 0, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 0.35]} />
                <YAxis dataKey="feature" type="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={180}
                  tickFormatter={(v: string) => v.length > 28 ? v.substring(0, 28) + "…" : v} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="importance" name="SHAP Value" radius={[0, 4, 4, 0]} onClick={(d: any) => {
                  if (d && d.payload) {
                    setSelectedFeature(d.payload);
                  }
                }}>
                  {shapFeatures.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.direction === "positive" ? "#f87171" : "#34d399"}
                      opacity={selectedFeature.feature === entry.feature ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <div className="w-3 h-3 rounded-sm bg-red-400" /> Increases risk
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <div className="w-3 h-3 rounded-sm bg-emerald-400" /> Decreases risk
              </div>
            </div>
          </div>

          {/* Feature Detail */}
          <div className="space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info size={14} className="text-indigo-400" />
                <h3 className="font-display font-bold text-white text-sm">Feature Detail</h3>
              </div>
              <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
                <div className="text-sm font-semibold text-white mb-2">{selectedFeature.feature}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">SHAP Importance</span>
                  <span className="text-lg font-bold text-indigo-300">{selectedFeature.importance.toFixed(3)}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/50">Effect Direction</span>
                  <span className={`tag ${selectedFeature.direction === "positive" ? "tag-red" : "tag-green"}`}>
                    {selectedFeature.direction === "positive" ? "↑ Increases Risk" : "↓ Decreases Risk"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {shapFeatures.map((f, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedFeature(f)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${selectedFeature.feature === f.feature ? "bg-indigo-500/15 border border-indigo-500/30" : "hover:bg-white/5"}`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.direction === "positive" ? "bg-red-400" : "bg-emerald-400"}`} />
                    <span className="text-[10px] text-white/60 flex-1 truncate">{f.feature}</span>
                    <span className="text-[10px] font-bold text-white/80">{f.importance.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lime" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
          {/* LIME Explanation */}
          <div className="glass-card p-6">
            <div className="mb-5">
              <h2 className="font-display font-bold text-white text-lg">Local Explanation · High-Risk Case</h2>
              <p className="text-xs text-white/40 mt-0.5">LIME: how each feature pushes this specific prediction</p>
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/50">Patient: Sunita Yadav, 16y, UP</div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">Predicted Risk: 92% (Critical)</div>
                </div>
                <div className="text-2xl">⚠️</div>
              </div>
            </div>
            <div className="space-y-3">
              {lime_explanations.map((item, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">{item.feature}</span>
                    <span className="font-bold text-sm" style={{ color: item.color }}>{item.contribution}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={10} style={{ color: item.color }} />
                    <span className="text-[10px] text-white/40">This {item.direction} mortality risk</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.abs(parseFloat(item.contribution)) * 200}%`,
                        background: item.color,
                        opacity: 0.7,
                        marginLeft: parseFloat(item.contribution) < 0 ? "auto" : "0",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waterfall Chart */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-white text-lg mb-1">SHAP Waterfall · Risk Build-up</h2>
            <p className="text-xs text-white/40 mb-5">How features accumulate to form the final risk score</p>
            <div className="space-y-2">
              {waterfall.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] text-white/40 w-24 text-right truncate">{item.name}</span>
                  <div className="flex-1 relative h-7 flex items-center">
                    <div className="absolute inset-y-0 left-0 right-0 bg-white/5 rounded-lg" />
                    <div
                      className="absolute h-5 rounded-lg flex items-center justify-end pr-1.5"
                      style={{
                        left: item.type === "base" ? "0%" : `${((item.cumulative - item.value) / 1.6) * 100}%`,
                        width: `${(Math.abs(item.value) / 1.6) * 100}%`,
                        background: item.type === "base" ? "rgba(99,102,241,0.5)"
                          : item.type === "output" ? "rgba(16,185,129,0.5)"
                          : item.value > 0 ? "rgba(248,113,113,0.5)" : "rgba(52,211,153,0.5)",
                        border: `1px solid ${item.type === "base" ? "rgba(99,102,241,0.8)" : item.type === "output" ? "rgba(16,185,129,0.8)" : item.value > 0 ? "rgba(248,113,113,0.8)" : "rgba(52,211,153,0.8)"}`,
                      }}
                    >
                      <span className="text-[9px] font-bold text-white">
                        {item.value > 0 ? "+" : ""}{item.value.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-white/60 w-10">{item.cumulative.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={11} className="text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300">AI Interpretation</span>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Starting from a base risk of 0.45, the combination of no skilled birth attendant (+0.29) and rural location (+0.24) are the dominant drivers pushing this patient&apos;s risk to the critical threshold.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-white text-lg mb-1">Model Performance Comparison</h2>
            <p className="text-xs text-white/40 mb-5">5-fold cross-validation on NFHS-5 holdout dataset</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Model", "AUC-ROC", "Accuracy", "Precision"].map(h => (
                      <th key={h} className="text-left py-3 pr-4 text-white/40 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modelComparison.map((m, i) => (
                    <tr key={i} className={`border-b border-white/5 ${i === 0 ? "bg-indigo-500/10" : ""}`}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          {i === 0 && <span className="tag tag-blue" style={{ fontSize: "8px", padding: "1px 5px" }}>BEST</span>}
                          <span className="text-white font-semibold">{m.model}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-emerald-400 font-bold">{m.auc}</td>
                      <td className="py-3 pr-4 text-indigo-300 font-bold">{m.accuracy}%</td>
                      <td className="py-3 text-purple-300 font-bold">{m.precision}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-white text-lg mb-1">AUC-ROC Comparison</h2>
            <p className="text-xs text-white/40 mb-5">Higher is better · Random baseline = 0.5</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={modelComparison} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="model" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0.75, 0.95]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="auc" name="AUC-ROC" radius={[4, 4, 0, 0]}>
                  {modelComparison.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#6366f1" : "rgba(99,102,241,0.4)"} />
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
