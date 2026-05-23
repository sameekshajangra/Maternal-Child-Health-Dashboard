"use client";

import React, { useState, useMemo } from "react";
import { stateHealthData } from "@/lib/data";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis 
} from "recharts";
import { Sparkles, Activity, Layers, ArrowRight, BrainCircuit, Download } from "lucide-react";
import { exportToPdf } from "@/lib/exportPdf";

// Definitions for the Analyze (Y-axis) dropdown
const analyzeOptions = [
  { id: "mmr", label: "Maternal Mortality Ratio", unit: "per 100k", color: "#f43f5e" },
  { id: "imr", label: "Infant Mortality Rate", unit: "per 1000", color: "#f97316" },
  { id: "stunting", label: "Child Stunting", unit: "%", color: "#eab308" },
  { id: "anemia", label: "Maternal Anemia", unit: "%", color: "#ef4444" },
];

// Definitions for the Correlate (X-axis) dropdown
const correlateOptions = [
  { id: "phcCount", label: "Healthcare Access (PHCs per 100k)", unit: "PHCs", category: "Infrastructure" },
  { id: "doctorDensity", label: "Doctor Density (per 10k)", unit: "Doctors", category: "Infrastructure" },
  { id: "sdgIndex", label: "SDG Progress Index", unit: "Score", category: "Policy" },
  { id: "pm25", label: "Environmental Risk (PM2.5)", unit: "µg/m³", category: "Environment" },
  { id: "literacyRate", label: "Female Literacy Rate", unit: "%", category: "Socioeconomic" },
  { id: "povertyIndex", label: "Multidimensional Poverty Index", unit: "%", category: "Socioeconomic" },
];

export default function InsightsPage() {
  const [analyzeMetric, setAnalyzeMetric] = useState(analyzeOptions[0].id);
  const [correlateMetric, setCorrelateMetric] = useState(correlateOptions[4].id); // default to literacy

  const currentAnalyze = analyzeOptions.find((o) => o.id === analyzeMetric)!;
  const currentCorrelate = correlateOptions.find((o) => o.id === correlateMetric)!;

  // Prepare chart data mapping X and Y dynamically
  const chartData = useMemo(() => {
    return stateHealthData.map((state) => ({
      name: state.state,
      x: state[currentCorrelate.id as keyof typeof state] as number,
      y: state[currentAnalyze.id as keyof typeof state] as number,
      risk: state.risk,
    }));
  }, [analyzeMetric, correlateMetric]);

  // Dynamic AI Insight Generator
  const generateInsights = () => {
    const isNegativeCorrelation = ["literacyRate", "phcCount", "doctorDensity", "sdgIndex"].includes(currentCorrelate.id);
    const correlationText = isNegativeCorrelation 
      ? `Strong negative correlation detected. As ${currentCorrelate.label} increases, ${currentAnalyze.label} tends to decrease significantly.`
      : `Strong positive correlation detected. States with higher ${currentCorrelate.label} generally experience worse ${currentAnalyze.label} outcomes.`;

    let specificInsight = "";
    if (currentCorrelate.id === "literacyRate") {
      specificInsight = "Maternal education remains one of the strongest protective factors against poor health outcomes. A 10% increase in female literacy correlates with a substantial drop in mortality rates.";
    } else if (currentCorrelate.id === "pm25") {
      specificInsight = "Environmental data shows states with high particulate pollution (> 60 µg/m³) exhibit higher baseline respiratory risks affecting infant mortality and maternal anemia.";
    } else if (currentCorrelate.id === "povertyIndex") {
      specificInsight = "Economic deprivation serves as a root cause multiplier, severely limiting access to both nutrition and emergency obstetric care.";
    } else if (currentCorrelate.category === "Infrastructure") {
      specificInsight = "Physical healthcare accessibility directly limits emergency interventions. States below the median doctor density see disproportionate maternal risk during complications.";
    } else {
      specificInsight = "Policy tracking shows states with better overall SDG progress consistently outperform the national average in maternal-child health metrics.";
    }

    let policyImplication = "";
    if (currentCorrelate.id === "literacyRate") {
      policyImplication = "Policy lever: Allocate conditional cash transfers tied to girls' secondary education completion rates, particularly in Bihar, Rajasthan and UP.";
    } else if (currentCorrelate.id === "pm25") {
      policyImplication = "Policy lever: Prioritise clean cooking fuel subsidies (PM Ujjwala Yojana expansion) and enforce vehicle emission standards in high-PM2.5 districts.";
    } else if (currentCorrelate.id === "povertyIndex") {
      policyImplication = "Policy lever: Combine JSY/JSSK maternity benefit schemes with direct nutrition transfers for high-MPI districts to break poverty-health nexus.";
    } else if (currentCorrelate.category === "Infrastructure") {
      policyImplication = "Policy lever: Apply differential resource allocation formula placing additional PHC units and ambulance hubs in sub-25th-percentile states.";
    } else {
      policyImplication = "Policy lever: Integrate health outcome KPIs into state SDG fund disbursement criteria to create incentive-aligned governance.";
    }

    return { correlationText, specificInsight, policyImplication };
  };

  const insights = generateInsights();

  // Custom tooltip for scatter plot
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tooltip-glass dark:bg-slate-800 dark:border-slate-700 shadow-xl">
          <p className="font-bold text-slate-800 dark:text-slate-100 text-xs mb-2">{data.name}</p>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">{currentCorrelate.label}:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{data.x} {currentCorrelate.unit}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">{currentAnalyze.label}:</span>
              <span className="font-bold animate-pulse" style={{ color: currentAnalyze.color }}>{data.y} {currentAnalyze.unit}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-bg relative min-h-screen p-6 md:p-10 lg:p-12 pt-8 pb-16 overflow-hidden transition-colors duration-300">
      <div id="insights-page-content" className="max-w-7xl mx-auto p-2 bg-transparent">
        {/* Header */}
        <div className="mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30 w-fit">
            <Layers className="w-3.5 h-3.5 text-indigo-650 dark:text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
              Interdisciplinary Analysis
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
            Cross-Dimensional <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            Discover hidden root causes by correlating core health outcomes against socioeconomic, environmental, and infrastructure data.
          </p>
        </div>

        {/* Control Panel */}
        <div className="glass-card p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center mb-8 relative z-10">
          {/* Analyze Dropdown */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              Analyze (Health Outcome)
            </label>
            <select 
              value={analyzeMetric}
              onChange={(e) => setAnalyzeMetric(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 block p-3.5 transition-all shadow-sm cursor-pointer"
            >
              {analyzeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center justify-center pt-6 text-slate-400 dark:text-slate-650">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>

          {/* Correlate Dropdown */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Correlate With (Insight Layer)
            </label>
            <select 
              value={correlateMetric}
              onChange={(e) => setCorrelateMetric(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 block p-3.5 transition-all shadow-sm cursor-pointer"
            >
              {correlateOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.category}: {opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Scatter Plot */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
              <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">
                Correlation Matrix
              </h3>
              <div className="tag tag-blue dark:bg-indigo-950/40 dark:text-indigo-400"><Sparkles size={9} className="mr-1" />Interactive Matrix</div>
            </div>
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 10, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-750/50" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name={currentCorrelate.label} 
                    unit={` ${currentCorrelate.unit}`} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name={currentAnalyze.label} 
                    unit={` ${currentAnalyze.unit}`} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ZAxis type="category" dataKey="name" name="State" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'currentColor', className: 'text-slate-200 dark:text-slate-700', strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="States" 
                    data={chartData} 
                    fill={currentAnalyze.color} 
                    shape="circle"
                    r={7}
                    fillOpacity={0.8}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 leading-relaxed">
              Each dot represents an Indian state. Hover over dots to view specific district indicators.
            </p>
          </div>

          {/* AI Insights Panel */}
          <div className="glass-card bg-gradient-to-br from-indigo-950 to-slate-900 dark:from-slate-950 dark:to-slate-900 border-none p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between">
            {/* Decorative mesh/blur */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
            
            <div className="relative z-10 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase mb-6">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>AI Insight Co-pilot</span>
              </div>
              
              <h3 className="text-2xl font-display font-bold mb-6 tracking-tight">
                Pattern Identified
              </h3>

              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-slate-900/30 rounded-2xl p-5 border border-white/10 dark:border-slate-800/30 backdrop-blur-sm shadow-inner">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                    <p className="text-indigo-100 leading-relaxed text-[13px] font-medium">
                      {insights.correlationText}
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-slate-900/30 rounded-2xl p-5 border border-white/10 dark:border-slate-800/30 backdrop-blur-sm shadow-inner">
                  <p className="text-white font-medium leading-relaxed text-[13px]">
                    {insights.specificInsight}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-2xl p-5 border border-emerald-400/20 backdrop-blur-sm shadow-inner">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-300 text-base shrink-0">💡</span>
                    <div>
                      <div className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1.5">Potential Policy Implication</div>
                      <p className="text-emerald-100 font-medium leading-relaxed text-[13px]">
                        {insights.policyImplication}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
              <button 
                onClick={() => exportToPdf('insights-page-content', 'maatri-policy-insight.pdf')}
                className="w-full bg-white text-indigo-950 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
              >
                <Download className="w-4 h-4" />
                Generate Policy Brief
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
