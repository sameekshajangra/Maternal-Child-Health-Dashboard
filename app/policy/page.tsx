"use client";
import { useState } from "react";
import { policyRecommendations } from "@/lib/data";
import { FileText, Sparkles, DollarSign, Target, MapPin, TrendingUp, ChevronDown, ChevronUp, Filter, Download } from "lucide-react";

const priorityConfig: Record<string, { tagClass: string; dotColor: string; bgColor: string; borderColor: string }> = {
  "Critical": { tagClass: "tag-red", dotColor: "#ef4444", bgColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" },
  "High": { tagClass: "tag-yellow", dotColor: "#f59e0b", bgColor: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" },
  "Medium": { tagClass: "tag-blue", dotColor: "#6366f1", bgColor: "rgba(99,102,241,0.05)", borderColor: "rgba(99,102,241,0.2)" },
};

const categoryConfig: Record<string, { color: string; emoji: string }> = {
  "Infrastructure": { color: "#f87171", emoji: "🏥" },
  "Nutrition": { color: "#fcd34d", emoji: "🥗" },
  "Digital Health": { color: "#60a5fa", emoji: "📱" },
  "Vaccination": { color: "#34d399", emoji: "💉" },
};

const implementationTimeline = [
  { phase: "Phase 1 (0-6 months)", items: ["Emergency obstetric care site selection", "ASHA app pilot in 5 states", "Malnutrition surveillance setup"] },
  { phase: "Phase 2 (6-18 months)", items: ["EOC deployment in 200 districts", "Nutrition camp rollout", "Cold chain audit completion"] },
  { phase: "Phase 3 (18-36 months)", items: ["Full ASHA digital integration", "Cold chain modernization", "Anemia drive scale-up"] },
  { phase: "Phase 4 (36+ months)", items: ["National coverage achieved", "Impact assessment", "SDG milestone review"] },
];

const budgetBreakdown = [
  { category: "Infrastructure", amount: 4800, percentage: 47, color: "#f87171" },
  { category: "Nutrition", amount: 3190, percentage: 31, color: "#fcd34d" },
  { category: "Digital Health", amount: 650, percentage: 6, color: "#60a5fa" },
  { category: "Vaccination", amount: 1800, percentage: 18, color: "#34d399" },
];

export default function PolicyPage() {
  const [expanded, setExpanded] = useState<number | null>(1);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredRecs = policyRecommendations.filter(r =>
    (filterCategory === "all" || r.category === filterCategory) &&
    (filterPriority === "all" || r.priority === filterPriority)
  );

  const totalBudget = budgetBreakdown.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="page-bg relative min-h-screen p-6 pt-8 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 w-fit">
            <FileText size={12} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
              AI Policy Intelligence · Evidence Base
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white">
            Policy <span className="gradient-text">Recommendations</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">AI-generated evidence-based health policy actions · NFHS-5 Driven</p>
        </div>
        <button onClick={() => window.print()} className="btn-ghost text-xs">
          <Download size={13} />
          Export Policy Brief (PDF)
        </button>
      </div>

      {/* Budget Overview */}
      <div className="glass-card p-6 mb-6 relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-white text-lg">Total Investment Required</h2>
            <p className="text-xs text-white/40 mt-0.5">5-year implementation plan · All recommendations combined</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display font-bold gradient-text">₹{totalBudget.toLocaleString()} Cr</div>
            <div className="text-xs text-white/40">≈ $1.2B USD · 5-year plan</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {budgetBreakdown.map((b, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `${b.color}10`, border: `1px solid ${b.color}25` }}>
              <div className="text-xs text-white/50 mb-1">{b.category}</div>
              <div className="text-xl font-bold" style={{ color: b.color }}>₹{b.amount.toLocaleString()} Cr</div>
              <div className="text-[10px] text-white/30 mt-1">{b.percentage}% of total</div>
              <div className="mt-2 h-1 rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${b.percentage}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-white/40" />
          <span className="text-xs text-white/40">Filter:</span>
        </div>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Digital Health">Digital Health</option>
          <option value="Vaccination">Vaccination</option>
        </select>
        <span className="text-xs text-white/30">{filteredRecs.length} recommendations</span>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        <div className="xl:col-span-2 space-y-4">
          {filteredRecs.map(rec => {
            const pConfig = priorityConfig[rec.priority];
            const cConfig = categoryConfig[rec.category] || { color: "#6366f1", emoji: "📋" };
            const isExpanded = expanded === rec.id;

            return (
              <div
                key={rec.id}
                className="glass-card overflow-hidden transition-all"
                style={{ border: `1px solid ${pConfig.borderColor}`, background: pConfig.bgColor }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : rec.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0">{cConfig.emoji}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`tag ${pConfig.tagClass}`}>{rec.priority}</span>
                          <span className="text-[10px] text-white/40">{rec.category}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-tight">{rec.title}</h3>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <TrendingUp size={11} className="text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">{rec.impact}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <DollarSign size={11} className="text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{rec.cost}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin size={11} className="text-indigo-400" />
                      <span className="text-white/50">{rec.states.length === 1 && rec.states[0] === "All States" ? "All States" : rec.states.slice(0, 3).join(", ")}{rec.states.length > 3 ? ` +${rec.states.length - 3}` : ""}</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/5">
                    <p className="text-xs text-white/60 leading-relaxed mt-4 mb-4">{rec.description}</p>

                    <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={11} className="text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-300">AI Evidence Base</span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed">{rec.evidence}</p>
                    </div>

                    <div>
                      <div className="text-[10px] text-white/30 mb-2 uppercase tracking-wider">Target States</div>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.states.map(s => (
                          <span key={s} className="tag tag-blue" style={{ fontSize: "9px", padding: "2px 7px" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-5">
              <Target size={15} className="text-indigo-400" />
              <h3 className="font-display font-bold text-white text-sm">Implementation Timeline</h3>
            </div>
            <div className="space-y-4">
              {implementationTimeline.map((phase, i) => (
                <div key={i} className="relative pl-6">
                  {/* Timeline line */}
                  {i < implementationTimeline.length - 1 && (
                    <div className="absolute left-2 top-5 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 to-transparent" />
                  )}
                  {/* Dot */}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-indigo-500 bg-[#080b18] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-300 mb-2">{phase.phase}</div>
                    <div className="space-y-1">
                      {phase.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-1.5 text-[10px] text-white/50">
                          <div className="w-1 h-1 rounded-full bg-white/25 mt-1.5 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SDG Alignment */}
          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-white text-sm mb-4">SDG 3 Alignment</h3>
            <div className="space-y-3">
              {[
                { goal: "SDG 3.1", desc: "Reduce MMR to ≤70/100K", progress: 72, color: "#f87171" },
                { goal: "SDG 3.2", desc: "End preventable child deaths", progress: 64, color: "#fb923c" },
                { goal: "SDG 3.4", desc: "Reduce NCD premature mortality", progress: 55, color: "#fcd34d" },
                { goal: "SDG 3.8", desc: "Universal health coverage", progress: 68, color: "#34d399" },
              ].map((sdg, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-xs font-bold text-white">{sdg.goal}</span>
                      <span className="text-[10px] text-white/40 ml-1.5">{sdg.desc}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: sdg.color }}>{sdg.progress}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: "4px" }}>
                    <div className="progress-fill" style={{ width: `${sdg.progress}%`, background: sdg.color, height: "4px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
