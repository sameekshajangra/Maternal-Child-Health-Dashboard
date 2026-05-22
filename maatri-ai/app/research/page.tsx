"use client";
import { useState } from "react";
import { stateHealthData } from "@/lib/data";
import { Search, Sparkles, AlertCircle, ArrowRight, BrainCircuit } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

    // Simple NLP simulation: parsing keywords
    setTimeout(() => {
      const q = query.toLowerCase();
      let matchedStates = [...stateHealthData];
      let insightMsg = "Analysis based on your query.";
      const metricsToShow: string[] = [];

      // Keyword matching logic
      if (q.includes("anemia") || q.includes("anaemia")) {
        metricsToShow.push("anemia");
        if (q.includes("highest") || q.includes("high")) {
          matchedStates.sort((a, b) => b.anemia - a.anemia);
          insightMsg = "States exhibiting severe maternal anemia. High anemia correlates heavily with MMR.";
        } else if (q.includes("lowest") || q.includes("low")) {
          matchedStates.sort((a, b) => a.anemia - b.anemia);
          insightMsg = "States with better management of maternal anemia.";
        }
      }
      
      if (q.includes("vaccination") || q.includes("immunization")) {
        if (!metricsToShow.includes("vaccination")) metricsToShow.push("vaccination");
        if (q.includes("lowest") || q.includes("low")) {
          matchedStates.sort((a, b) => a.vaccination - b.vaccination);
          insightMsg = "States struggling with full immunization coverage. Interventions needed in cold chain infrastructure.";
        } else if (q.includes("highest") || q.includes("high")) {
          matchedStates.sort((a, b) => b.vaccination - a.vaccination);
        }
      }

      if (q.includes("mmr") || q.includes("maternal mortality")) {
        if (!metricsToShow.includes("mmr")) metricsToShow.push("mmr");
        if (q.includes("highest") || q.includes("high")) {
          matchedStates.sort((a, b) => b.mmr - a.mmr);
          insightMsg = "Critical maternal mortality hotspots requiring immediate emergency obstetric care deployment.";
        } else {
          matchedStates.sort((a, b) => a.mmr - b.mmr);
        }
      }

      if (q.includes("stunting") || q.includes("malnutrition")) {
        if (!metricsToShow.includes("stunting")) metricsToShow.push("stunting");
        if (q.includes("highest") || q.includes("high")) {
          matchedStates.sort((a, b) => b.stunting - a.stunting);
          insightMsg = "Regions with acute child malnutrition (stunting). Focus on integrated child development schemes.";
        }
      }

      // Default if no specific metric matched
      if (metricsToShow.length === 0) {
        metricsToShow.push("mmr", "vaccination");
        matchedStates.sort((a, b) => b.mmr - a.mmr);
        insightMsg = "Showing default risk assessment based on MMR and Vaccination.";
      }

      setResults({
        states: matchedStates.slice(0, 5), // Top 5 results
        insight: insightMsg,
        metrics: metricsToShow
      });
      setIsSearching(false);
    }, 1000);
  };

  const getMetricLabel = (key: string) => {
    const map: Record<string, string> = {
      mmr: "MMR",
      imr: "IMR",
      stunting: "Stunting %",
      anemia: "Anemia %",
      vaccination: "Vaccination %",
      institutionalDelivery: "Inst. Delivery %"
    };
    return map[key] || key;
  };

  return (
    <div className="page-bg relative min-h-screen p-6 pt-8 pb-12 overflow-hidden transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center border border-pink-100 dark:border-pink-800/30">
            <BrainCircuit size={24} className="text-pink-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white tracking-wide">
              Natural Language Research Assistant
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
              Ask questions to explore NFHS-5 data
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="premium-card p-4 mb-8 bg-white dark:bg-slate-800 relative">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., Show states with highest anemia and lowest vaccination..."
              className="w-full py-4 pl-12 pr-32 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-pink-500/50 text-sm font-medium"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="absolute right-2 btn-primary bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-glow-pink"
            >
              {isSearching ? "Analyzing..." : "Analyze"}
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mt-4 px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 self-center">Try:</span>
            {[
              "States with highest maternal mortality",
              "Show worst stunting rates",
              "Highest anemia and low rural access",
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => setQuery(p)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {results && (
          <div className="space-y-6 animate-fade-in">
            {/* Insight Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 border border-pink-100 dark:border-pink-800/30 flex gap-4">
              <Sparkles className="text-pink-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">AI Insight</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{results.insight}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rankings List */}
              <div className="premium-card p-6 bg-white dark:bg-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle size={16} className="text-pink-500" />
                  Top Results
                </h3>
                <div className="space-y-3">
                  {results.states.map((state, idx) => (
                    <div key={state.state} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{state.state}</span>
                      </div>
                      <div className="text-right">
                        {results.metrics.map(m => (
                          <div key={m} className="text-[11px] text-slate-500 dark:text-slate-400">
                            {getMetricLabel(m)}: <span className="font-bold text-slate-700 dark:text-slate-300">{state[m]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="premium-card p-6 bg-white dark:bg-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
                  Visual Comparison
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.states} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="state" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                      {results.metrics.map((m, idx) => (
                        <Bar 
                          key={m} 
                          dataKey={m} 
                          name={getMetricLabel(m)} 
                          fill={idx === 0 ? "#ec4899" : "#6366f1"} 
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
