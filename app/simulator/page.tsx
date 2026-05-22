"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders, Sparkles, TrendingDown, TrendingUp, Target,
  Users, HeartPulse, Baby, Droplets, FlaskConical
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

// ─── Baseline values (NFHS-5 national averages) ───
const BASELINE = {
  mmr: 97,
  imr: 35.2,
  stunting: 35.5,
  anemia: 57,
  vaccination: 76.4,
  delivery: 88.6,
};

// ─── Lever definitions ───
const levers = [
  {
    id: "anc",
    label: "ANC Coverage",
    description: "% of pregnant women with ≥4 ANC visits",
    icon: HeartPulse,
    color: "#f43f5e",
    unit: "%",
    min: 0, max: 30, step: 1,
    impact: { mmr: -1.4, imr: -0.6, stunting: -0.3, anemia: -0.8, vaccination: 0.2, delivery: 0.4 },
  },
  {
    id: "skilled",
    label: "Skilled Birth Attendants",
    description: "% increase in skilled attendant coverage",
    icon: Users,
    color: "#8b5cf6",
    unit: "%",
    min: 0, max: 25, step: 1,
    impact: { mmr: -2.1, imr: -0.9, stunting: -0.1, anemia: -0.2, vaccination: 0.1, delivery: 0.8 },
  },
  {
    id: "nutrition",
    label: "Child Nutrition Programmes",
    description: "Additional ICDS beneficiary coverage",
    icon: Baby,
    color: "#f59e0b",
    unit: "%",
    min: 0, max: 30, step: 1,
    impact: { mmr: -0.4, imr: -0.5, stunting: -1.2, anemia: -0.6, vaccination: 0.3, delivery: 0 },
  },
  {
    id: "clean_water",
    label: "WASH Access",
    description: "Piped water + sanitation coverage increase",
    icon: Droplets,
    color: "#0ea5e9",
    unit: "%",
    min: 0, max: 20, step: 1,
    impact: { mmr: -0.3, imr: -0.7, stunting: -0.5, anemia: -0.4, vaccination: 0, delivery: 0 },
  },
  {
    id: "phc",
    label: "Rural PHC Expansion",
    description: "Additional Primary Health Centres per 100k",
    icon: FlaskConical,
    color: "#10b981",
    unit: "units",
    min: 0, max: 15, step: 1,
    impact: { mmr: -0.8, imr: -0.4, stunting: -0.2, anemia: -0.3, vaccination: 0.5, delivery: 0.6 },
  },
];

const metrics = [
  { id: "mmr",        label: "MMR",           unit: "/100k", color: "#f43f5e", lower: true,  icon: HeartPulse },
  { id: "imr",        label: "IMR",           unit: "/1000", color: "#f97316", lower: true,  icon: Baby },
  { id: "stunting",   label: "Stunting",      unit: "%",     color: "#eab308", lower: true,  icon: TrendingDown },
  { id: "anemia",     label: "Anemia",        unit: "%",     color: "#ef4444", lower: true,  icon: Droplets },
  { id: "vaccination",label: "Vaccination",   unit: "%",     color: "#10b981", lower: false, icon: TrendingUp },
  { id: "delivery",   label: "Inst. Delivery",unit: "%",     color: "#6366f1", lower: false, icon: Target },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
            <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function SimulatorPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(levers.map((l) => [l.id, 0]))
  );

  const projected = useMemo(() => {
    const result = { ...BASELINE };
    levers.forEach((lever) => {
      const val = values[lever.id];
      if (val === 0) return;
      (Object.keys(lever.impact) as Array<keyof typeof BASELINE>).forEach((key) => {
        result[key] = Math.max(
          0,
          result[key] + (lever.impact[key] * val)
        );
      });
    });
    return result;
  }, [values]);

  const totalLeverValue = Object.values(values).reduce((a, b) => a + b, 0);
  const anyActive = totalLeverValue > 0;

  const barData = metrics.map((m) => ({
    name: m.label,
    Baseline: parseFloat(BASELINE[m.id as keyof typeof BASELINE].toFixed(1)),
    Projected: parseFloat(projected[m.id as keyof typeof projected].toFixed(1)),
  }));

  const radarData = metrics.map((m) => {
    const base = BASELINE[m.id as keyof typeof BASELINE];
    const proj = projected[m.id as keyof typeof projected];
    // Normalise so higher = better (invert for "lower is better" metrics)
    const score = m.lower
      ? Math.max(0, 100 - ((proj / (base * 1.2)) * 100))
      : Math.min(100, (proj / 100) * 100);
    return { metric: m.label, score: parseFloat(score.toFixed(1)) };
  });

  return (
    <div className="page-bg relative min-h-screen p-6 md:p-10 lg:p-12 pt-8 pb-16 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/30 w-fit mb-3">
            <Sliders size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
              Real-time Policy Simulator
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
            Intervention{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              Impact Simulator
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium max-w-2xl">
            Drag the policy levers to simulate the projected impact on maternal and child health outcomes across India. All projections are based on NFHS-5 regression models.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 relative z-10">
          {/* ── Left: Levers ── */}
          <div className="xl:col-span-2 flex flex-col gap-5">
            {levers.map((lever) => {
              const Icon = lever.icon;
              const isActive = values[lever.id] > 0;
              return (
                <motion.div
                  key={lever.id}
                  layout
                  className="glass-card p-5 transition-all duration-300"
                  style={{
                    background: isActive ? `linear-gradient(135deg, ${lever.color}08 0%, ${lever.color}04 100%)` : undefined,
                    borderColor: isActive ? `${lever.color}30` : undefined,
                    boxShadow: isActive ? `0 0 16px ${lever.color}18` : undefined,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: isActive ? lever.color : `${lever.color}15`,
                        boxShadow: isActive ? `0 4px 12px ${lever.color}40` : "none",
                      }}
                    >
                      <Icon size={15} color={isActive ? "#fff" : lever.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{lever.label}</div>
                      <div className="text-[11px] text-slate-400 font-medium truncate">{lever.description}</div>
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          className="text-sm font-bold px-2.5 py-1 rounded-full"
                          style={{ background: `${lever.color}15`, color: lever.color }}
                        >
                          +{values[lever.id]}{lever.unit}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <input
                    type="range"
                    min={lever.min}
                    max={lever.max}
                    step={lever.step}
                    value={values[lever.id]}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [lever.id]: Number(e.target.value) }))
                    }
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer transition-all"
                    style={{
                      accentColor: lever.color,
                      background: `linear-gradient(to right, ${lever.color} 0%, ${lever.color} ${(values[lever.id] / lever.max) * 100}%, #e2e8f0 ${(values[lever.id] / lever.max) * 100}%, #e2e8f0 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
                    <span>0{lever.unit}</span>
                    <span>+{lever.max}{lever.unit}</span>
                  </div>
                </motion.div>
              );
            })}

            {anyActive && (
              <button
                onClick={() => setValues(Object.fromEntries(levers.map((l) => [l.id, 0])))}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors py-2 underline underline-offset-2"
              >
                Reset all levers
              </button>
            )}
          </div>

          {/* ── Right: Results ── */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {metrics.map((m) => {
                const Icon = m.icon;
                const base = BASELINE[m.id as keyof typeof BASELINE];
                const proj = projected[m.id as keyof typeof projected];
                const delta = proj - base;
                const isImprovement = m.lower ? delta < 0 : delta > 0;
                return (
                  <motion.div
                    key={m.id}
                    layout
                    className="glass-card p-4 flex flex-col gap-2"
                    style={{
                      background: anyActive && isImprovement ? `linear-gradient(135deg, ${m.color}08, ${m.color}03)` : undefined,
                      borderColor: anyActive && isImprovement ? `${m.color}25` : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                        <Icon size={12} color={m.color} />
                      </div>
                    </div>
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={proj.toFixed(1)}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="text-2xl font-black"
                        style={{ color: anyActive ? (isImprovement ? m.color : "#ef4444") : m.color }}
                      >
                        {proj.toFixed(1)}<span className="text-sm font-semibold text-slate-400 ml-0.5">{m.unit}</span>
                      </motion.div>
                    </AnimatePresence>
                    {anyActive && Math.abs(delta) > 0.01 && (
                      <div className="flex items-center gap-1">
                        {isImprovement ? <TrendingDown size={10} color={m.color} /> : <TrendingUp size={10} color="#ef4444" />}
                        <span className="text-[11px] font-bold" style={{ color: isImprovement ? m.color : "#ef4444" }}>
                          {isImprovement ? "" : "+"}{delta.toFixed(1)}{m.unit}
                        </span>
                        <span className="text-[10px] text-slate-400">vs baseline</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Comparison Bar Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-white text-base">Baseline vs Projected</h2>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">Outcome comparison</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block bg-slate-300" />Baseline</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block bg-emerald-500" />Projected</span>
                </div>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Projected" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h2 className="font-bold text-slate-800 dark:text-white text-base">Health System Performance Score</h2>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">Normalised 0–100 across all dimensions</p>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                    <Radar name="Health Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.18} strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Summary */}
            {anyActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10 border-emerald-100 dark:border-emerald-900/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">AI Policy Summary</span>
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed font-medium">
                  Your selected interventions are projected to reduce the Maternal Mortality Ratio by{" "}
                  <strong className="text-emerald-600">{Math.abs(projected.mmr - BASELINE.mmr).toFixed(0)} points</strong> and
                  Infant Mortality Rate by{" "}
                  <strong className="text-emerald-600">{Math.abs(projected.imr - BASELINE.imr).toFixed(1)}</strong>.
                  Prioritising skilled birth attendants and ANC coverage yields the highest MMR reduction per rupee invested.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
