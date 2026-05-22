"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import CountUp from "react-countup";

interface KPICardProps {
  label: string;
  value: number;
  unit: string;
  change: number;
  target: number;
  color?: string;
  icon?: React.ReactNode;
  delay?: number;
  active?: boolean;
}

export default function KPICardPremium({
  label, value, unit, change, target,
  color = "#6366f1", icon, delay = 0, active = false,
}: KPICardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const progress = Math.min((value / target) * 100, 100);
  const isPositive = change > 0;
  const isGoodChange =
    (change < 0 && (label.includes("Mortality") || label.includes("Stunting") || label.includes("Anemia"))) ||
    (change > 0 && (label.includes("Vaccination") || label.includes("Deliveries")));

  const changeColor = isGoodChange ? "#10b981" : "#ef4444"; // Emerald or Red

  return (
    <div
      className={`glass-card hover:shadow-xl transition-all duration-700 relative overflow-hidden group cursor-pointer ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
        background: `linear-gradient(135deg, var(--card-bg) 0%, ${color}08 100%)`,
        boxShadow: active ? `0 0 12px ${color}33` : "0 8px 30px rgba(0,0,0,0.04)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 12px ${color}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = active ? `0 0 12px ${color}33` : "0 8px 30px rgba(0,0,0,0.04)";
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 4,
        background: active ? color : `${color}22`,
        transition: "all 0.3s ease",
      }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 mt-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight max-w-[75%]">
          {label}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110" style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
          }}>
            {icon}
          </div>
        )}
      </div>

      {/* Animated Value using Framer/CountUp implicitly based on user req or react-countup */}
      <div className="flex items-baseline gap-1.5 mb-2">
        <span
          className="text-4xl font-black leading-none"
          style={{
            color: active ? color : "var(--foreground)",
            transition: "color 0.3s ease",
          }}
        >
          {visible ? (
            <CountUp end={value} decimals={value % 1 === 0 ? 0 : 1} duration={2} separator="," />
          ) : "0"}
        </span>
        <span className="text-sm text-slate-400 font-bold">{unit}</span>
      </div>

      {/* Change indicator */}
      <div className="flex items-center gap-1.5 mb-6">
        <div className="px-2 py-1 rounded-md flex items-center gap-1" style={{ background: `${changeColor}15` }}>
          {change === 0 ? (
            <Minus size={12} className="text-slate-400" />
          ) : isPositive ? (
            <TrendingUp size={12} style={{ color: changeColor }} />
          ) : (
            <TrendingDown size={12} style={{ color: changeColor }} />
          )}
          <span className="text-xs font-bold" style={{ color: changeColor }}>
            {change > 0 ? "+" : ""}{change}%
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium">vs NFHS-4</span>
      </div>

      {/* SDG Target progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 tracking-wide font-bold">SDG Target</span>
          <span className="text-xs font-bold" style={{ color }}>{target}{unit}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${visible ? progress : 0}%`,
              background: `linear-gradient(90deg, ${color}99, ${color})`,
              transitionDelay: `${delay + 200}ms`,
            }}
          />
        </div>
        <div className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">{progress.toFixed(0)}% Achieved</div>
      </div>
    </div>
  );
}
