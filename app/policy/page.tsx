"use client";
import { useState } from "react";
import { policyRecommendations } from "@/lib/data";
import { FileText, Sparkles, DollarSign, Target, MapPin, TrendingUp, ChevronDown, ChevronUp, Filter, Download } from "lucide-react";
import { exportToPdf } from "@/lib/exportPdf";

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
  const [activePhase, setActivePhase] = useState<number>(0);

  const filteredRecs = policyRecommendations.map((r, index) => ({ ...r, id: index + 1 })).filter(r =>
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
        <button 
          onClick={() => exportToPdf('policy-content', 'maatri-policy-recommendations.pdf')} 
          className="btn-ghost text-xs py-3 px-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl shadow-sm self-start md:self-center"
        >
          <Download size={14} className="mr-1" />
          Export Policy Brief (PDF)
        </button>
      </div>

      <div id="policy-content">
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
                className={`glass-card overflow-hidden transition-all duration-300 transform ${isExpanded ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg scale-[1.01]" : "hover:shadow-md hover:-translate-y-0.5"}`}
                style={{ 
                  border: `1px solid ${pConfig.borderColor}`, 
                  background: isExpanded ? `linear-gradient(to bottom right, ${pConfig.dotColor}10, transparent)` : `${pConfig.dotColor}03`,
                }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : rec.id)}
                  className="w-full p-5 sm:p-6 text-left focus:outline-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-sm flex-shrink-0" style={{ background: `${pConfig.dotColor}20` }}>
                        {cConfig.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`tag ${pConfig.tagClass} shadow-sm border border-black/5 dark:border-white/5`}>{rec.priority}</span>
                          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">{rec.category}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-tight pr-4">{rec.title}</h3>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-3 sm:gap-2 self-stretch sm:self-auto border-t sm:border-t-0 border-slate-100 dark:border-slate-700/50 pt-3 sm:pt-0">
                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <div className="flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                          <TrendingUp size={12} /> <span className="font-bold">{rec.impact}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                          <DollarSign size={12} /> <span className="font-bold">{rec.cost}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-5" />
                    
                    <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
                      {rec.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100/60 dark:border-indigo-800/30 shadow-inner">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <Sparkles size={12} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-widest">AI Evidence Base</span>
                        </div>
                        <p className="text-[12px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed ml-8">{rec.evidence}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <MapPin size={12} className="text-slate-600 dark:text-slate-400" />
                          </div>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Target States</span>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-8">
                          {rec.states.map(s => (
                            <span key={s} className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-[10.5px] font-bold text-slate-600 dark:text-slate-300 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 cursor-default transition-colors">
                              {s}
                            </span>
                          ))}
                        </div>
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
          <div className="glass-card p-6 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-750 pb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <Target size={16} className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm">Interactive Implementation Timeline</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Click to view phase details</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {implementationTimeline.map((phase, i) => {
                const isActive = activePhase === i;
                return (
                  <div key={i} className="relative group cursor-pointer" onClick={() => setActivePhase(i)}>
                    {/* Timeline connecting line */}
                    {i < implementationTimeline.length - 1 && (
                      <div className={`absolute left-[11px] top-7 bottom-[-15px] w-[2px] transition-colors duration-300 ${
                        isActive || activePhase > i ? "bg-indigo-500 dark:bg-indigo-400" : "bg-slate-200 dark:bg-slate-700"
                      }`} />
                    )}
                    
                    <div className="flex gap-4 relative z-10">
                      {/* Interactive Dot */}
                      <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 shadow-sm ${
                        isActive 
                          ? "border-indigo-500 bg-white dark:bg-slate-900 scale-110 shadow-indigo-500/30" 
                          : activePhase > i
                          ? "border-indigo-500 bg-indigo-500 dark:bg-indigo-400"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-indigo-300 dark:group-hover:border-indigo-700"
                      }`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />}
                      </div>
                      
                      {/* Content Card */}
                      <div className={`flex-1 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/40 p-4 shadow-sm" 
                          : "bg-transparent border border-transparent p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}>
                        <div className={`text-xs font-bold transition-colors ${
                          isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                        }`}>
                          {phase.phase}
                        </div>
                        
                        {/* Expanded details */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? "max-h-40 mt-3 opacity-100" : "max-h-0 mt-0 opacity-0"}`}>
                          <div className="space-y-2">
                            {phase.items.map((item, j) => (
                              <div key={j} className="flex items-start gap-2.5 p-2 rounded-lg bg-white/60 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/50">
                                <div className="w-5 h-5 rounded-md bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center text-[9px] font-black shrink-0">
                                  {j + 1}
                                </div>
                                <span className="text-[11.5px] text-slate-700 dark:text-slate-300 font-medium leading-tight">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
