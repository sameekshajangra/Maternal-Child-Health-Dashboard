"use client";
import { useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { stateHealthData } from "@/lib/data";
import { GitCompare, Activity, ShieldAlert } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-glass dark:bg-slate-800 dark:border-slate-700">
        <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs mb-2">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 text-[11px] mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color || p.fill, boxShadow: `0 0 5px ${(p.color || p.fill)}80` }} />
              <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CompareStates() {
  const [selectedStates, setSelectedStates] = useState<string[]>(["Kerala", "Bihar"]);
  const [availableStates] = useState(stateHealthData.map(s => s.state));

  const handleStateChange = (index: number, newState: string) => {
    const newSelected = [...selectedStates];
    newSelected[index] = newState;
    setSelectedStates(newSelected);
  };

  const addState = () => {
    if (selectedStates.length < 4) {
      const remaining = availableStates.filter(s => !selectedStates.includes(s));
      if (remaining.length > 0) {
        setSelectedStates([...selectedStates, remaining[0]]);
      }
    }
  };

  const removeState = (index: number) => {
    if (selectedStates.length > 2) {
      const newSelected = [...selectedStates];
      newSelected.splice(index, 1);
      setSelectedStates(newSelected);
    }
  };

  const getComparisonData = () => {
    const metrics = [
      { key: 'institutionalDelivery', label: 'Inst. Delivery', max: 100 },
      { key: 'vaccination', label: 'Vaccination', max: 100 },
      { key: 'ruralAccess', label: 'Rural Access', max: 100 },
      { key: 'urbanAccess', label: 'Urban Access', max: 100 },
    ];

    return metrics.map(m => {
      const dataPoint: any = { subject: m.label, fullMark: m.max };
      selectedStates.forEach((stateName) => {
        const stateInfo = stateHealthData.find(s => s.state === stateName);
        if (stateInfo) {
          dataPoint[stateName] = stateInfo[m.key as keyof typeof stateInfo] || 0;
        }
      });
      return dataPoint;
    });
  };

  const getBarData = () => {
    return selectedStates.map(stateName => {
      const sData = stateHealthData.find(s => s.state === stateName);
      if (sData) {
        return {
          name: stateName,
          mmr: sData.mmr,
          imr: sData.imr,
          stunting: sData.stunting,
          anemia: sData.anemia,
        };
      }
      return { name: stateName, mmr: 0, imr: 0, stunting: 0, anemia: 0 };
    });
  };

  const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b"];

  return (
    <div className="page-bg relative min-h-screen p-6 md:p-10 lg:p-12 pt-8 pb-16 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 flex items-center justify-center border border-cyan-100 dark:border-cyan-800/30 shadow-sm">
            <GitCompare size={22} className="text-cyan-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-slate-800 dark:text-white tracking-tight">
              Compare States
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1.5">
              Cross-sectional Analysis (NFHS-5)
            </p>
          </div>
        </div>

        {/* State Selectors */}
        <div className="premium-card p-6 mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-wrap gap-6 items-end">
            {selectedStates.map((state, idx) => (
              <div key={idx} className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wider">
                  State {idx + 1}
                </label>
                <div className="flex gap-2.5">
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(idx, e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-250 cursor-pointer"
                  >
                    {availableStates.map(s => (
                      <option key={s} value={s} disabled={selectedStates.includes(s) && s !== state}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {selectedStates.length > 2 && (
                    <button
                      onClick={() => removeState(idx)}
                      className="p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-bold transition-all duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            {selectedStates.length < 4 && (
              <button
                onClick={addState}
                className="btn-ghost flex-shrink-0 mb-[2px] rounded-xl text-xs py-3 px-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
              >
                + Add State
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart for Coverage & Access */}
          <div className="premium-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <ShieldAlert size={18} className="text-cyan-500" />
              Coverage & Accessibility (Higher is Better)
            </h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getComparisonData()}>
                  <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-slate-700/60" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  {selectedStates.map((state, idx) => (
                    <Radar
                      key={state}
                      name={state}
                      dataKey={state}
                      stroke={colors[idx]}
                      fill={colors[idx]}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: '10px' }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart for Adverse Outcomes */}
          <div className="premium-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <Activity size={18} className="text-pink-500" />
              Adverse Outcomes (Lower is Better)
            </h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getBarData()} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700/60" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: '10px' }} />
                  <Bar dataKey="mmr" name="MMR" fill="#f87171" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="imr" name="IMR" fill="#fb923c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stunting" name="Stunting %" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="anemia" name="Anemia %" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

