"use client";
import { useState, useRef } from "react";
import { stateHealthData } from "@/lib/data";
import { indiaMapPaths } from "@/lib/indiaMapPaths";
import { Map, Info, Activity, TrendingDown, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";

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

  const riskColor = (risk: string) => {
    if (risk === "critical") return "#ef4444";
    if (risk === "high") return "#f97316";
    if (risk === "medium") return "#f59e0b";
    return "#10b981";
  };

  const riskBg = (risk: string) => {
    if (risk === "critical") return "#fef2f2";
    if (risk === "high") return "#fff7ed";
    if (risk === "medium") return "#fffbeb";
    return "#f0fdf4";
  };

  return (
    <div className="page-bg relative min-h-screen p-6 pt-8 pb-12 overflow-hidden transition-colors duration-300">

      {/* Header */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 w-fit">
          <Map size={12} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
            Geospatial Intelligence · NFHS-5
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white">
          India Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Heatmap</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">
          State-level maternal &amp; child health disparity visualization
        </p>
      </div>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {(Object.keys(metricConfig) as Metric[]).map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`pill-tab ${metric === m ? "active" : "bg-white border border-slate-200"}`}
            style={{ padding: "8px 16px", gap: "6px" }}
          >
            {metricConfig[m].icon}
            {metricConfig[m].shortLabel}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">

        {/* ── India SVG Map ── */}
        <div className="xl:col-span-2 premium-card p-5 relative bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-slate-800 text-base">{cfg.label}</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Hover over states to explore · Click to pin details</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Legend gradient strip */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Low</span>
                <div className="w-28 h-2.5 rounded-full shadow-inner" style={{
                  background: `linear-gradient(to right, ${cfg.low}, ${cfg.mid}, ${cfg.high})`
                }} />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">High</span>
              </div>
            </div>
          </div>

          {/* Map container */}
          <div className="relative rounded-xl overflow-hidden border border-slate-100 shadow-inner"
            style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", minHeight: 520 }}>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.3]" style={{
              backgroundImage: "linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }} />

            <svg
              ref={svgRef}
              viewBox="0 0 612 696"
              className="w-full h-full relative z-10"
              style={{ minHeight: 490, display: "block" }}
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
                    ? "#1e293b"
                    : isHovered
                    ? "#334155"
                    : "rgba(255,255,255,0.6)";
                  strokeWidth = isSelected ? "2" : isHovered ? "1.5" : "1";
                }

                return (
                  <path
                    key={state.id}
                    d={state.path}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    opacity={hasData ? (isHovered || isSelected ? 1 : 0.9) : 0.5}
                    className={hasData ? "state-path" : undefined}
                    style={{
                      transition: "fill 0.35s ease, opacity 0.2s ease, stroke 0.2s ease",
                      filter: isSelected
                        ? `drop-shadow(0 4px 12px rgba(0,0,0,0.15))`
                        : isHovered && hasData
                        ? `drop-shadow(0 2px 6px rgba(0,0,0,0.1))`
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
                  minWidth: 180,
                }}
              >
                <div style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                }}>
                  <div className="font-bold text-slate-800 text-sm mb-1">{hoveredData.state}</div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{cfg.shortLabel}</span>
                    <span className="font-black text-sm" style={{ color: getColor(hoveredData[metric as keyof typeof hoveredData] as number, metric) }}>
                      {hoveredData[metric as keyof typeof hoveredData]}{cfg.unit.includes("%") ? "%" : ""}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2">
                    <div style={{
                      background: riskBg(hoveredData.risk),
                      color: riskColor(hoveredData.risk),
                      border: `1px solid ${riskColor(hoveredData.risk)}44`,
                      borderRadius: 20,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase"
                    }}>
                      {hoveredData.risk}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">risk level</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex flex-col gap-5">

          {/* Selected State Detail */}
          {selectedData ? (
            <div className="glass-card p-5 bg-white border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">{selectedData.state}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">NFHS-5 · 2019-21</p>
                </div>
                <div style={{
                  background: riskBg(selectedData.risk),
                  color: riskColor(selectedData.risk),
                  border: `1px solid ${riskColor(selectedData.risk)}44`,
                  borderRadius: 20,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase"
                }}>
                  {selectedData.risk}
                </div>
              </div>

              {/* Active metric highlight */}
              <div className="mb-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 shadow-inner">
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wide mb-1">{cfg.label}</div>
                <div className="text-3xl font-black" style={{ color: getColor(selectedData[metric as keyof typeof selectedData] as number, metric) }}>
                  {selectedData[metric as keyof typeof selectedData]}<span className="text-sm font-bold text-indigo-300 ml-1">{cfg.unit}</span>
                </div>
              </div>

              {/* All metrics grid */}
              <div className="grid grid-cols-2 gap-2">
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
                  <div key={m.label} className="p-3 rounded-xl border border-slate-100 bg-slate-50 transition-colors hover:bg-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{m.label}</div>
                    <div className="text-base font-black" style={{ color: m.color }}>{m.value}{m.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 bg-white border border-slate-200 text-center flex flex-col items-center justify-center gap-3" style={{ minHeight: 180 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#e0e7ff",
                border: "1px solid #c7d2fe",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Map size={20} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-slate-700 text-sm font-bold">Select a State</p>
                <p className="text-slate-400 text-xs mt-1 font-medium">Click any state on the map to view detailed health metrics</p>
              </div>
            </div>
          )}

          {/* State Rankings */}
          <div className="glass-card p-5 flex-1 bg-white border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-800 text-sm">State Rankings</h3>
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wide">{cfg.shortLabel}</span>
            </div>
            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-2">
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
                      className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl transition-all"
                      style={{
                        background: isSelected ? "#eef2ff" : "transparent",
                        border: isSelected ? "1px solid #c7d2fe" : "1px solid transparent"
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = isSelected ? "#eef2ff" : "#f8fafc")}
                      onMouseLeave={e => (e.currentTarget.style.background = isSelected ? "#eef2ff" : "transparent")}
                    >
                      <span className="text-[11px] text-slate-400 w-4 font-bold text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-700 font-bold truncate">{s.state}</span>
                          <span className="text-xs font-black ml-2" style={{ color: barColor }}>
                            {val}{cfg.unit.includes("%") ? "%" : ""}
                          </span>
                        </div>
                        <div className="progress-bar" style={{ height: 4, background: "#f1f5f9" }}>
                          <div className="progress-fill" style={{
                            width: `${(val / maxVal) * 100}%`,
                            height: 4,
                            background: barColor,
                            borderRadius: 4
                          }} />
                        </div>
                      </div>
                      {isSelected && <ChevronRight size={14} className="text-indigo-500" strokeWidth={3} />}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Critical States", value: stateHealthData.filter(s => s.risk === "critical").length, color: "#ef4444", bg: "#fef2f2" },
              { label: "Data Points", value: stateHealthData.length, color: "#6366f1", bg: "#eef2ff" },
              { label: "NFHS-5 Survey", value: "2021", color: "#10b981", bg: "#f0fdf4" },
              { label: "Indicators", value: 8, color: "#f59e0b", bg: "#fffbeb" },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl shadow-sm" style={{
                background: stat.bg,
                border: `1px solid ${stat.color}33`
              }}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{stat.label}</div>
                <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
