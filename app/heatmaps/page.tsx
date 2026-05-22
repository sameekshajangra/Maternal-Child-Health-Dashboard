"use client";
import { useState, useRef } from "react";
import { stateHealthData } from "@/lib/data";
import { indiaMapPaths } from "@/lib/indiaMapPaths";
import { Map, Info, Activity, TrendingDown, TrendingUp, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";

type Metric = "mmr" | "imr" | "stunting" | "anemia" | "institutionalDelivery" | "vaccination";

const metricConfig: Record<Metric, { label: string; shortLabel: string; unit: string; icon: React.ReactNode; low: string; mid: string; high: string; max: number; inverted: boolean }> = {
  mmr:                  { label: "Maternal Mortality Ratio",    shortLabel: "MMR",              unit: "/100K LB", icon: <AlertTriangle size={12}/>, low: "#bae6fd", mid: "#f59e0b", high: "#ef4444", max: 220, inverted: false },
  imr:                  { label: "Infant Mortality Rate",       shortLabel: "IMR",              unit: "/1000 LB", icon: <Activity size={12}/>,      low: "#bae6fd", mid: "#f59e0b", high: "#ef4444", max: 52,  inverted: false },
  stunting:             { label: "Child Stunting Rate",         shortLabel: "Stunting",         unit: "%",        icon: <TrendingDown size={12}/>,  low: "#bae6fd", mid: "#f59e0b", high: "#ef4444", max: 45,  inverted: false },
  anemia:               { label: "Maternal Anemia",             shortLabel: "Anemia",           unit: "%",        icon: <Activity size={12}/>,      low: "#bae6fd", mid: "#f59e0b", high: "#ef4444", max: 70,  inverted: false },
  institutionalDelivery:{ label: "Institutional Deliveries",    shortLabel: "Inst. Delivery",   unit: "%",        icon: <TrendingUp size={12}/>,    low: "#ef4444", mid: "#f59e0b", high: "#10b981", max: 100, inverted: true  },
  vaccination:          { label: "Full Vaccination Coverage",   shortLabel: "Vaccination",      unit: "%",        icon: <TrendingUp size={12}/>,    low: "#ef4444", mid: "#f59e0b", high: "#10b981", max: 100, inverted: true  },
};

// Map SVG path id → stateHealthData state name
const pathIdToStateName: Record<string, string> = {
  up: "Uttar Pradesh", br: "Bihar", rj: "Rajasthan", mp: "Madhya Pradesh", as: "Assam",
  or: "Odisha", ct: "Chhattisgarh", jh: "Jharkhand", gj: "Gujarat", mh: "Maharashtra",
  pb: "Punjab", hr: "Haryana", tn: "Tamil Nadu", kl: "Kerala", ka: "Karnataka",
  ap: "Andhra Pradesh", tg: "Telangana", wb: "West Bengal", dl: "Delhi", hp: "Himachal Pradesh",
};

function getColor(value: number, metric: Metric): string {
  const cfg = metricConfig[metric];
  const ratio = value / cfg.max;
  if (ratio < 0.45) {
    const t = ratio / 0.45;
    return lerpColor(cfg.low, cfg.mid, t);
  } else {
    const t = (ratio - 0.45) / 0.55;
    return lerpColor(cfg.mid, cfg.high, t);
  }
}

function lerpColor(a: string, b: string, t: number): string {
  const hex = (c: string) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = hex(a);
  const [br, bg, bb] = hex(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bv})`;
}

export default function HeatmapsPage() {
  const [metric, setMetric] = useState<Metric>("mmr");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const cfg = metricConfig[metric];

  const getStateData = (pathId: string) => {
    const name = pathIdToStateName[pathId];
    if (!name) return null;
    return stateHealthData.find(s => s.state === name) ?? null;
  };

  const selectedData = selectedId ? getStateData(selectedId) : null;
  const hoveredData = hoveredId ? getStateData(hoveredId) : null;

  const getRiskTagClass = (risk: string) => {
    const r = risk.toLowerCase();
    if (r === "critical") return "tag-red dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30";
    if (r === "high") return "tag-yellow dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30 text-orange-650 border-orange-200";
    if (r === "medium") return "tag-yellow dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/30";
    return "tag-green dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30";
  };

  return (
    <div className="page-bg relative min-h-screen p-6 md:p-10 lg:p-12 pt-8 pb-16 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30 w-fit">
            <Map size={12} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
              Geospatial Intelligence · NFHS-5
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
            India Health <span className="gradient-text">Heatmap</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            State-level maternal &amp; child health disparity visualization
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {(Object.keys(metricConfig) as Metric[]).map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                metric === m
                  ? "bg-gradient-to-r from-indigo-500 to-purple-650 text-white shadow-sm"
                  : "bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {metricConfig[m].icon}
              {metricConfig[m].shortLabel}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">

          {/* ── India SVG Map ── */}
          <div className="xl:col-span-2 glass-card p-6 relative flex flex-col">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
              <div>
                <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg">{cfg.label}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Hover over states to explore · Click to pin details</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">Low</span>
                <div className="w-28 h-2.5 rounded-full shadow-inner border border-slate-100 dark:border-slate-800" style={{
                  background: `linear-gradient(to right, ${cfg.low}, ${cfg.mid}, ${cfg.high})`
                }} />
                <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">High</span>
              </div>
            </div>

            {/* Map container */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-950/30 shadow-inner flex-1 flex items-center justify-center p-4"
              style={{ minHeight: 520 }}>

              {/* Subtle grid overlay */}
              <div className="absolute inset-0 opacity-[0.3] dark:opacity-[0.12]" style={{
                backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }} />

              <svg
                ref={svgRef}
                viewBox="0 0 612 696"
                className="w-full h-full relative z-10 max-h-[580px]"
                style={{ display: "block" }}
              >
                {indiaMapPaths.map(state => {
                  const data = getStateData(state.id);
                  const isHovered = hoveredId === state.id;
                  const isSelected = selectedId === state.id;
                  const hasData = !!data;

                  let fill = "#cbd5e1"; // neutral for states without data
                  let stroke = "rgba(255,255,255,0.8)";
                  let strokeWidth = "1";

                  if (hasData) {
                    const val = data[metric as keyof typeof data] as number;
                    fill = getColor(val, metric);
                    stroke = isSelected
                      ? "#6366f1"
                      : isHovered
                      ? "#475569"
                      : "rgba(255,255,255,0.55)";
                    strokeWidth = isSelected ? "2.2" : isHovered ? "1.6" : "0.9";
                  }

                  return (
                    <path
                      key={state.id}
                      d={state.path}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      opacity={hasData ? (isHovered || isSelected ? 1 : 0.92) : 0.4}
                      className={hasData ? "state-path" : undefined}
                      style={{
                        transition: "fill 0.35s ease, opacity 0.2s ease, stroke 0.2s ease",
                        filter: isSelected
                          ? `drop-shadow(0 6px 14px rgba(99,102,241,0.3))`
                          : isHovered && hasData
                          ? `drop-shadow(0 3px 8px rgba(0,0,0,0.12))`
                          : "none",
                        cursor: hasData ? "pointer" : "default",
                      }}
                      onMouseEnter={e => {
                        if (!hasData) return;
                        setHoveredId(state.id);
                        const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
                        setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                      onMouseMove={e => {
                        if (!hasData) return;
                        const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
                        setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                      onMouseLeave={() => {
                        setHoveredId(null);
                        setTooltip(null);
                      }}
                      onClick={() => {
                        if (!hasData) return;
                        setSelectedId(prev => prev === state.id ? null : state.id);
                      }}
                    />
                  );
                })}
              </svg>

              {/* Tooltip — positioned relative to mouse */}
              {hoveredId && hoveredData && tooltip && (
                <div
                  className="pointer-events-none absolute z-30"
                  style={{
                    left: tooltip.x + 14,
                    top: tooltip.y - 56,
                    minWidth: 190,
                  }}
                >
                  <div className="tooltip-glass dark:bg-slate-800/95 dark:border-slate-700 shadow-xl">
                    <div className="font-bold text-slate-850 dark:text-slate-100 text-sm mb-1.5">{hoveredData.state}</div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">{cfg.shortLabel}</span>
                      <span className="font-black text-sm" style={{ color: getColor(hoveredData[metric as keyof typeof hoveredData] as number, metric) }}>
                        {hoveredData[metric as keyof typeof hoveredData]}{cfg.unit.includes("%") ? "%" : ""}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
                      <div className={`tag ${getRiskTagClass(hoveredData.risk)}`}>
                        {hoveredData.risk}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">risk level</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="flex flex-col gap-6">

            {/* Selected State Detail */}
            {selectedData ? (
              <div className="glass-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg leading-tight">{selectedData.state}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-bold uppercase tracking-widest">NFHS-5 · 2019-21</p>
                  </div>
                  <div className={`tag ${getRiskTagClass(selectedData.risk)}`}>
                    {selectedData.risk}
                  </div>
                </div>

                {/* Active metric highlight */}
                <div className="mb-5 p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/45 bg-indigo-50/20 dark:bg-indigo-950/15 shadow-inner">
                  <div className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1.5">{cfg.label}</div>
                  <div className="text-3xl font-black tracking-tight" style={{ color: getColor(selectedData[metric as keyof typeof selectedData] as number, metric) }}>
                    {selectedData[metric as keyof typeof selectedData]}<span className="text-sm font-bold text-indigo-455 dark:text-indigo-300 ml-1.5">{cfg.unit}</span>
                  </div>
                </div>

                {/* All metrics grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "MMR", value: selectedData.mmr, unit: "", color: "#ef4444" },
                    { label: "IMR", value: selectedData.imr, unit: "", color: "#f97316" },
                    { label: "Stunting", value: selectedData.stunting, unit: "%", color: "#f59e0b" },
                    { label: "Wasting", value: selectedData.wasting, unit: "%", color: "#f97316" },
                    { label: "Anemia", value: selectedData.anemia, unit: "%", color: "#8b5cf6" },
                    { label: "Inst. Delivery", value: selectedData.institutionalDelivery, unit: "%", color: "#10b981" },
                    { label: "Vaccination", value: selectedData.vaccination, unit: "%", color: "#3b82f6" },
                    { label: "Rural Access", value: selectedData.ruralAccess, unit: "%", color: "#ec4899" },
                  ].map(m => (
                    <div key={m.label} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/40 transition-all duration-200">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">{m.label}</div>
                      <div className="text-base font-black tracking-tight" style={{ color: m.color }}>{m.value}{m.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 text-center flex flex-col items-center justify-center gap-4" style={{ minHeight: 220 }}>
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center shadow-sm">
                  <Map size={20} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-bold">Select a State</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 font-medium leading-relaxed max-w-[200px] mx-auto">
                    Click any state on the map to view detailed health metrics
                  </p>
                </div>
              </div>
            )}

            {/* State Rankings */}
            <div className="glass-card p-6 flex-1 flex flex-col min-h-[380px]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm">State Rankings</h3>
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest">{cfg.shortLabel}</span>
              </div>
              <div className="space-y-1 overflow-y-auto pr-2 max-h-[320px] flex-1">
                {[...stateHealthData]
                  .sort((a, b) =>
                    cfg.inverted
                      ? b[metric as keyof typeof b] as number - (a[metric as keyof typeof a] as number)
                      : a[metric as keyof typeof a] as number - (b[metric as keyof typeof b] as number)
                  )
                  .map((s, i) => {
                    const val = s[metric as keyof typeof s] as number;
                    const maxVal = Math.max(...stateHealthData.map(d => d[metric as keyof typeof d] as number));
                    const barColor = getColor(val, metric);
                    const statePathId = Object.entries(pathIdToStateName).find(([, v]) => v === s.state)?.[0];
                    const isSelected = statePathId === selectedId;

                    return (
                      <div
                        key={s.state}
                        onClick={() => {
                          if (statePathId) setSelectedId(prev => prev === statePathId ? null : statePathId);
                        }}
                        className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-xl transition-all border ${
                          isSelected
                            ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/40"
                            : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        }`}
                      >
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 w-4 font-bold text-right">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-slate-700 dark:text-slate-200 font-bold truncate">{s.state}</span>
                            <span className="text-xs font-black ml-2" style={{ color: barColor }}>
                              {val}{cfg.unit.includes("%") ? "%" : ""}
                            </span>
                          </div>
                          <div className="progress-bar dark:bg-slate-800" style={{ height: 4 }}>
                            <div className="progress-fill" style={{
                              width: `${(val / maxVal) * 100}%`,
                              height: 4,
                              background: barColor,
                              borderRadius: 4
                            }} />
                          </div>
                        </div>
                        {isSelected && <ChevronRight size={14} className="text-indigo-500 dark:text-indigo-400" strokeWidth={3} />}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Critical States",
                  value: stateHealthData.filter(s => s.risk === "critical").length,
                  classes: "border-red-100 dark:border-red-950/30 bg-red-50/40 dark:bg-red-950/10 text-red-600 dark:text-red-400"
                },
                {
                  label: "Data Points",
                  value: stateHealthData.length,
                  classes: "border-indigo-100 dark:border-indigo-950/30 bg-indigo-50/40 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400"
                },
                {
                  label: "NFHS-5 Survey",
                  value: "2021",
                  classes: "border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-600 dark:text-emerald-450"
                },
                {
                  label: "Indicators",
                  value: 8,
                  classes: "border-amber-100 dark:border-amber-950/30 bg-amber-50/40 dark:bg-amber-950/10 text-amber-600 dark:text-amber-400"
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className={`p-4 rounded-xl border transition-all duration-200 ${stat.classes}`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-75 mb-1">{stat.label}</div>
                  <div className="text-2xl font-black leading-none">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
