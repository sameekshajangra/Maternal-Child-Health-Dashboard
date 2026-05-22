"use client";
import { useState } from "react";
import { stateHealthData } from "@/lib/data";
import { Search, Sparkles, AlertCircle, BrainCircuit, TrendingUp, BarChart2, Lightbulb } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const EXAMPLE_QUERIES = [
  "States with highest maternal mortality",
  "Show worst stunting rates",
  "Highest anemia across states",
  "Lowest vaccination coverage",
  "States with critical risk",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="tooltip-glass dark:bg-slate-800 dark:border-slate-700 shadow-xl">
        <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs mb-2">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 text-[11px] mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ResearchAssistant() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{
    states: any[];
    insight: string;
    metrics: string[];
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let matchedStates = [...stateHealthData];
      let insightMsg = "Analysis based on your query.";
      const metricsToShow: string[] = [];

      if (q.includes("anemia") || q.includes("anaemia")) {
        metricsToShow.push("anemia");
        if (q.includes("highest") || q.includes("high") || q.includes("worst")) {
          matchedStates.sort((a, b) => b.anemia - a.anemia);
          insightMsg = "States exhibiting severe maternal anemia — a leading driver of maternal mortality. High anemia correlates strongly with MMR and poor birth outcomes.";
        } else {
          matchedStates.sort((a, b) => a.anemia - b.anemia);
          insightMsg = "States with better-managed maternal anemia, typically driven by higher literacy and stronger ASHA outreach.";
        }
      }

      if (q.includes("vaccination") || q.includes("immunization") || q.includes("vaccine")) {
        if (!metricsToShow.includes("vaccination")) metricsToShow.push("vaccination");
        if (q.includes("lowest") || q.includes("low") || q.includes("worst")) {
          matchedStates.sort((a, b) => a.vaccination - b.vaccination);
          insightMsg = "States struggling with full immunization coverage. Cold chain infrastructure gaps and rural accessibility are primary barriers.";
        } else {
          matchedStates.sort((a, b) => b.vaccination - a.vaccination);
          insightMsg = "Leading states in vaccination coverage — these models can be replicated to close national coverage gaps.";
        }
      }

      if (q.includes("mmr") || q.includes("maternal mortality") || q.includes("maternal death")) {
        if (!metricsToShow.includes("mmr")) metricsToShow.push("mmr");
        if (q.includes("highest") || q.includes("high") || q.includes("worst") || q.includes("critical")) {
          matchedStates.sort((a, b) => b.mmr - a.mmr);
          insightMsg = "Critical maternal mortality hotspots. These states require immediate emergency obstetric care deployment and skilled birth attendant scale-up.";
        } else {
          matchedStates.sort((a, b) => a.mmr - b.mmr);
          insightMsg = "Best-performing states in maternal mortality — driven by near-universal institutional delivery and strong community health systems.";
        }
      }

      if (q.includes("stunting") || q.includes("malnutrition") || q.includes("nutrition")) {
        if (!metricsToShow.includes("stunting")) metricsToShow.push("stunting");
        if (q.includes("highest") || q.includes("high") || q.includes("worst")) {
          matchedStates.sort((a, b) => b.stunting - a.stunting);
          insightMsg = "Regions with acute child malnutrition. These states need intensive Poshan Abhiyan targeting and supplementary nutrition programmes.";
        } else {
          matchedStates.sort((a, b) => a.stunting - b.stunting);
          insightMsg = "States with relatively lower stunting rates — often correlated with higher female literacy and better PDS coverage.";
        }
      }

      if (q.includes("critical") || q.includes("risk") || q.includes("worst states")) {
        metricsToShow.push("mmr", "anemia");
        matchedStates = matchedStates.filter(s => s.risk === "critical" || s.risk === "high");
        matchedStates.sort((a, b) => b.mmr - a.mmr);
        insightMsg = "High-risk states across combined maternal and child health indicators. These require coordinated multi-sector interventions.";
      }

      if (metricsToShow.length === 0) {
        metricsToShow.push("mmr", "vaccination");
        matchedStates.sort((a, b) => b.mmr - a.mmr);
        insightMsg = "Showing overall risk profile based on MMR and vaccination coverage across states.";
      }

      setResults({
        states: matchedStates.slice(0, 6),
        insight: insightMsg,
        metrics: metricsToShow.slice(0, 2),
      });
      setIsSearching(false);
    }, 900);
  };

  const getMetricLabel = (key: string) => {
    const map: Record<string, string> = {
      mmr: "MMR (per 100k)",
      imr: "IMR (per 1000)",
      stunting: "Stunting %",
      anemia: "Anemia %",
      vaccination: "Vaccination %",
      institutionalDelivery: "Inst. Delivery %",
    };
    return map[key] || key;
  };

  const getMetricColor = (key: string) => {
    const map: Record<string, string> = {
      mmr: "#f43f5e", imr: "#f97316", stunting: "#eab308",
      anemia: "#8b5cf6", vaccination: "#10b981", institutionalDelivery: "#3b82f6",
    };
    return map[key] || "#6366f1";
  };

  return (
    <div className="page-bg relative min-h-screen p-6 md:p-10 lg:p-12 pt-8 pb-16 overflow-hidden transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto space-y-8 relative z-10">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-955/30 border border-pink-100 dark:border-pink-850/30 text-pink-700 dark:text-pink-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <BrainCircuit size={12} />
            <span>Natural Language Research Assistant</span>
          </div>
          <h1 className="text-3xl md:text-[2.5rem] font-display font-bold text-slate-800 dark:text-white leading-tight tracking-tight mb-2">
            Ask a Public Health <span className="gradient-text">Question</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium tracking-wide">
            Query NFHS-5 data using plain English. Get AI-ranked results, charts, and expert insights instantly.
          </p>
        </div>

        {/* Search Box */}
        <div className="glass-card p-6 shadow-md">
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-slate-450 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g. Show states with highest maternal mortality..."
                className="w-full pl-12 pr-36 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 focus:border-pink-500 dark:focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl text-slate-800 dark:text-slate-100 outline-none text-sm font-semibold transition-all"
              />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className={`absolute right-2 px-6 py-2.5 font-bold text-xs rounded-lg transition-all shadow-md ${
                  isSearching || !query.trim()
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-500/15 cursor-pointer"
                }`}
              >
                {isSearching ? "Analyzing..." : "Analyze →"}
              </button>
            </div>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest self-center mr-1">Try:</span>
            {EXAMPLE_QUERIES.map((p) => (
              <button
                key={p}
                onClick={() => setQuery(p)}
                className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 text-slate-655 dark:text-slate-350 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-900 transition-all duration-200 font-bold cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {!results && !isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Search size={22} className="text-pink-500" />, title: "Natural Language", desc: "Ask in plain English — no filters or dropdowns needed." },
              { icon: <BarChart2 size={22} className="text-indigo-500" />, title: "Instant Charts", desc: "AI generates visual comparisons from your query automatically." },
              { icon: <Lightbulb size={22} className="text-amber-500" />, title: "Expert Insights", desc: "Every result comes with a data-backed public health interpretation." },
            ].map((card, i) => (
              <div key={i} className="glass-card p-6 text-center shadow-sm hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {card.icon}
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1.5">{card.title}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[12.5px] leading-relaxed font-medium">{card.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {isSearching && (
          <div className="glass-card text-center py-16 px-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500/10 to-indigo-500/10 dark:from-pink-500/20 dark:to-indigo-500/20 flex items-center justify-center mx-auto mb-4 border border-pink-500/15 animate-pulse">
              <BrainCircuit size={28} className="text-pink-500" />
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-base">Analyzing NFHS-5 Data...</p>
            <p className="text-slate-400 dark:text-slate-500 text-[13px] mt-1.5 font-medium">Ranking states and generating insights</p>
          </div>
        )}

        {/* Results */}
        {results && !isSearching && (
          <div className="flex flex-col gap-8">

            {/* AI Insight Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-500/5 to-rose-500/5 dark:from-pink-500/10 dark:to-rose-500/10 border border-pink-100 dark:border-pink-900/30 flex gap-4 items-start shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-500/20 shrink-0 flex items-center justify-center border border-pink-200 dark:border-pink-500/20 shadow-sm">
                <Sparkles size={20} className="text-pink-650 dark:text-pink-400" />
              </div>
              <div>
                <div className="font-bold text-pink-700 dark:text-pink-400 text-xs uppercase tracking-wider mb-1.5">
                  AI Research Insight
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-[14px] leading-relaxed font-medium">
                  {results.insight}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rankings */}
              <div className="glass-card p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <AlertCircle size={16} className="text-pink-500" />
                  Ranked Results
                </h3>
                <div className="flex flex-col gap-3">
                  {results.states.map((state, idx) => (
                    <div key={state.state} className={`flex items-center justify-between p-3.5 rounded-xl border ${
                      idx === 0
                        ? "bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30"
                        : "bg-slate-50 dark:bg-slate-900/40 border-slate-100/80 dark:border-slate-800/80"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          idx === 0
                            ? "bg-rose-500 text-white shadow-sm shadow-rose-550/20"
                            : idx === 1
                            ? "bg-amber-500 text-white shadow-sm shadow-amber-550/20"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{state.state}</span>
                      </div>
                      <div className="text-right">
                        {results.metrics.map(m => (
                          <div key={m} className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                            <span className="font-extrabold" style={{ color: getMetricColor(m) }}>{state[m]}</span> {getMetricLabel(m).split(" ")[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="glass-card p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <TrendingUp size={16} className="text-indigo-500" />
                  Visual Comparison
                </h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.states} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-750/50" />
                      <XAxis dataKey="state" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      {results.metrics.map((m, idx) => (
                        <Bar
                          key={m}
                          dataKey={m}
                          name={getMetricLabel(m)}
                          fill={getMetricColor(m)}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
