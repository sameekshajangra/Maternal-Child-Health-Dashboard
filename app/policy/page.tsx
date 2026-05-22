"use client";
import { useState } from "react";
import { policyRecommendations } from "@/lib/data";
import { FileText, Sparkles, DollarSign, Target, MapPin, TrendingUp, ChevronDown, ChevronUp, Filter, Download } from "lucide-react";

const priorityConfig: Record<string, { tagClass: string; dotColor: string; borderColor: string }> = {
  "Critical": { tagClass: "tag-red", dotColor: "#ef4444", borderColor: "rgba(239,68,68,0.2)" },
  "High": { tagClass: "tag-yellow", dotColor: "#f59e0b", borderColor: "rgba(245,158,11,0.2)" },
  "Medium": { tagClass: "tag-blue", dotColor: "#6366f1", borderColor: "rgba(99,102,241,0.2)" },
};

const categoryConfig: Record<string, { color: string; emoji: string }> = {
  "Infrastructure": { color: "#ef4444", emoji: "🏥" },
  "Nutrition": { color: "#fbbf24", emoji: "🥗" },
  "Digital Health": { color: "#3b82f6", emoji: "📱" },
  "Vaccination": { color: "#10b981", emoji: "💉" },
};

const implementationTimeline = [
  { phase: "Phase 1 (0-6 months)", items: ["Emergency obstetric care site selection", "ASHA app pilot in 5 states", "Malnutrition surveillance setup"] },
  { phase: "Phase 2 (6-18 months)", items: ["EOC deployment in 200 districts", "Nutrition camp rollout", "Cold chain audit completion"] },
  { phase: "Phase 3 (18-36 months)", items: ["Full ASHA digital integration", "Cold chain modernization", "Anemia drive scale-up"] },
  { phase: "Phase 4 (36+ months)", items: ["National coverage achieved", "Impact assessment", "SDG milestone review"] },
];

const budgetBreakdown = [
  { category: "Infrastructure", amount: 4800, percentage: 47, color: "#ef4444" },
  { category: "Nutrition", amount: 3190, percentage: 31, color: "#fbbf24" },
  { category: "Digital Health", amount: 650, percentage: 6, color: "#3b82f6" },
  { category: "Vaccination", amount: 1800, percentage: 18, color: "#10b981" },
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
    <div className="page-bg relative min-h-screen p-6 md:p-10 lg:p-12 pt-8 pb-16 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30 w-fit">
            <FileText size={12} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
              AI Policy Intelligence · Evidence Base
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
            Policy <span className="gradient-text">Recommendations</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">AI-generated evidence-based health policy actions · NFHS-5 Driven</p>
        </div>
        <button onClick={() => window.print()} className="btn-ghost text-xs py-3 px-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl shadow-sm self-start md:self-center">
          <Download size={14} className="mr-1" />
          Export Policy Brief (PDF)
        </button>
      </div>

      {/* Budget Overview */}
      <div className="glass-card p-6 mb-8 relative z-10 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div>
            <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg">Total Investment Required</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">5-year implementation plan · All recommendations combined</p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-3xl font-display font-bold gradient-text">₹{totalBudget.toLocaleString()} Cr</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">≈ $1.2B USD · 5-year plan</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {budgetBreakdown.map((b, i) => (
            <div key={i} className="p-4 rounded-xl transition-all hover:translate-y-[-1px]" style={{ background: `${b.color}10`, border: `1px solid ${b.color}25` }}>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">{b.category}</div>
              <div className="text-xl font-bold" style={{ color: b.color }}>₹{b.amount.toLocaleString()} Cr</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">{b.percentage}% of total</div>
              <div className="mt-2.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${b.percentage}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 dark:text-slate-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Filters:</span>
        </div>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
        >
          <option value="all">All Categories</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Digital Health">Digital Health</option>
          <option value="Vaccination">Vaccination</option>
        </select>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{filteredRecs.length} recommendations found</span>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        <div className="xl:col-span-2 space-y-4">
          {filteredRecs.map(rec => {
            const pConfig = priorityConfig[rec.priority];
            const cConfig = categoryConfig[rec.category] || { color: "#6366f1", emoji: "📋" };
            const isExpanded = expanded === rec.id;

            return (
              <div
                key={rec.id}
                className="glass-card overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md bg-white dark:bg-slate-800"
                style={{ border: `1px solid ${pConfig.borderColor}`, background: `${pConfig.dotColor}03` }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : rec.id)}
                  className="w-full p-5 text-left transition-colors duration-200 hover:bg-slate-50/40 dark:hover:bg-slate-700/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0 mt-0.5">{cConfig.emoji}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={`tag ${pConfig.tagClass}`}>{rec.priority}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{rec.category}</span>
                        </div>
                        <h3 className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">{rec.title}</h3>
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400 dark:text-slate-500" /> : <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-105 dark:border-slate-700/50">
                    <div className="flex items-center gap-1.5 text-xs">
                      <TrendingUp size={12} className="text-emerald-500" />
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Impact: <span className="text-emerald-500 dark:text-emerald-400 font-bold">{rec.impact}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <DollarSign size={12} className="text-amber-500" />
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Cost: <span className="text-amber-655 dark:text-amber-400 font-bold">{rec.cost}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs min-w-0 max-w-[250px] sm:max-w-none">
                      <MapPin size={12} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                      <span className="text-slate-500 dark:text-slate-400 truncate font-medium">
                        {rec.states.length === 1 && rec.states[0] === "All States" ? "All States" : rec.states.slice(0, 3).join(", ")}{rec.states.length > 3 ? ` +${rec.states.length - 3}` : ""}
                      </span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-750 bg-white/50 dark:bg-slate-900/30">
                    <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mt-4 mb-4">{rec.description}</p>

                    <div className="p-4 rounded-xl mb-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-800/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles size={13} className="text-indigo-500 dark:text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">AI Evidence Base</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{rec.evidence}</p>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Target States</div>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.states.map(s => (
                          <span key={s} className="tag tag-blue dark:bg-indigo-950/40 dark:text-indigo-400" style={{ fontSize: "9px", padding: "2px 8px" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline & SDG Alignment */}
        <div className="space-y-6">
          <div className="glass-card p-5 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Target size={16} className="text-indigo-500 dark:text-indigo-400" />
              <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm">Implementation Timeline</h3>
            </div>
            <div className="space-y-5">
              {implementationTimeline.map((phase, i) => (
                <div key={i} className="relative pl-6">
                  {/* Timeline line */}
                  {i < implementationTimeline.length - 1 && (
                    <div className="absolute left-2 top-5 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 dark:from-indigo-500/30 to-transparent" />
                  )}
                  {/* Dot */}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-indigo-500 bg-white dark:bg-slate-900 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">{phase.phase}</div>
                    <div className="space-y-1.5">
                      {phase.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                          <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 flex-shrink-0" />
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
          <div className="glass-card p-5 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm mb-4">SDG 3 Alignment</h3>
            <div className="space-y-4">
              {[
                { goal: "SDG 3.1", desc: "Reduce MMR to ≤70/100K", progress: 72, color: "#ef4444" },
                { goal: "SDG 3.2", desc: "End preventable child deaths", progress: 64, color: "#f97316" },
                { goal: "SDG 3.4", desc: "Reduce NCD premature mortality", progress: 55, color: "#eab308" },
                { goal: "SDG 3.8", desc: "Universal health coverage", progress: 68, color: "#10b981" },
              ].map((sdg, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{sdg.goal}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5 font-medium">{sdg.desc}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: sdg.color }}>{sdg.progress}%</span>
                  </div>
                  <div className="progress-bar bg-slate-100 dark:bg-slate-750" style={{ height: "4px" }}>
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

