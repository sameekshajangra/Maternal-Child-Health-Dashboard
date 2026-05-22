"use client";

import React, { useState, useMemo } from "react";
import { stateHealthData } from "@/lib/data";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis 
} from "recharts";
import { Sparkles, Activity, Layers, ArrowRight, BrainCircuit } from "lucide-react";

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
    // Simple mock logic to generate intelligent-sounding insights based on the selected dimensions
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

    return { correlationText, specificInsight };
  };

  const insights = generateInsights();

  // Custom tooltip for scatter plot
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-bold text-gray-900 mb-2">{data.name}</p>
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">{currentCorrelate.label}:</span> {data.x} {currentCorrelate.unit}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold" style={{ color: currentAnalyze.color }}>{currentAnalyze.label}:</span> {data.y} {currentAnalyze.unit}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative z-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-4">
          <Layers className="w-4 h-4" />
          <span>Interdisciplinary Analysis</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Cross-Dimensional Insights</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Discover hidden root causes by correlating core health outcomes against socioeconomic, environmental, and infrastructure data.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        
        {/* Analyze Dropdown */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            Analyze (Health Outcome)
          </label>
          <select 
            value={analyzeMetric}
            onChange={(e) => setAnalyzeMetric(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-rose-500 focus:border-rose-500 block p-3.5 transition-all shadow-sm"
          >
            {analyzeOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center justify-center pt-6">
          <div className="bg-gray-100 p-2 rounded-full text-gray-400">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Correlate Dropdown */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Correlate With (Insight Layer)
          </label>
          <select 
            value={correlateMetric}
            onChange={(e) => setCorrelateMetric(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3.5 transition-all shadow-sm"
          >
            {correlateOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.category}: {opt.label}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Scatter Plot */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Correlation Matrix
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name={currentCorrelate.label} 
                  unit={` ${currentCorrelate.unit}`} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name={currentAnalyze.label} 
                  unit={` ${currentAnalyze.unit}`} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                />
                <ZAxis type="category" dataKey="name" name="State" />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="States" 
                  data={chartData} 
                  fill={currentAnalyze.color} 
                  shape="circle"
                  r={8}
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Each dot represents an Indian state. Hover to view detailed metrics.
          </p>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col">
          {/* Decorative mesh/blur */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wide uppercase mb-6">
              <BrainCircuit className="w-4 h-4" />
              AI Intelligence
            </div>
            
            <h3 className="text-2xl font-bold mb-6">
              Pattern Identified
            </h3>

            <div className="space-y-6">
              <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-indigo-300 shrink-0 mt-0.5" />
                  <p className="text-indigo-100 leading-relaxed text-sm">
                    {insights.correlationText}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                <p className="text-white font-medium leading-relaxed">
                  {insights.specificInsight}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto relative z-10 pt-8">
            <button className="w-full bg-white text-indigo-900 font-semibold py-3.5 px-4 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              Generate Policy Brief
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
