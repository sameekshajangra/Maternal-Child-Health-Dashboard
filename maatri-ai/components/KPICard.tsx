"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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

export default function KPICard({
  label, value, unit, change, target,
  color = "#6366f1", icon, delay = 0, active = false,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      const duration = 1400;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current * 10) / 10);
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const progress = Math.min((value / target) * 100, 100);
  const isPositive = change > 0;
  const isGoodChange =
    (change < 0 && (label.includes("Mortality") || label.includes("Stunting") || label.includes("Anemia"))) ||
    (change > 0 && (label.includes("Vaccination") || label.includes("Deliveries")));

  const changeColor = isGoodChange ? "#10b981" : "#ef4444"; // Emerald or Red

  return (
    <div
      className={`metric-card ${active ? "active" : ""} p-5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      style={{ transitionDelay: `${delay}ms` }}
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
      <div className="flex items-start justify-between mb-3 mt-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight max-w-[75%]">
          {label}
        </div>
        {icon && (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
          }}>
            {icon}
          </div>
        )}
      </div>

      {/* Animated Value */}
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span
          className="text-[2rem] font-black leading-none"
          style={{
            color: active ? color : "#1e293b",
            transition: "color 0.3s ease",
          }}
        >
          {displayValue % 1 === 0 ? Math.round(displayValue) : displayValue.toFixed(1)}
        </span>
        <span className="text-xs text-slate-400 font-medium">{unit}</span>
      </div>

      {/* Change indicator */}
      <div className="flex items-center gap-1.5 mb-4">
        {change === 0 ? (
          <Minus size={11} className="text-slate-400" />
        ) : isPositive ? (
          <TrendingUp size={11} style={{ color: changeColor }} />
        ) : (
          <TrendingDown size={11} style={{ color: changeColor }} />
        )}
        <span className="text-[11px] font-bold" style={{ color: changeColor }}>
          {change > 0 ? "+" : ""}{change}%
        </span>
        <span className="text-[10px] text-slate-400 font-medium">vs NFHS-4</span>
      </div>

      {/* SDG Target progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-400 tracking-wide font-medium">SDG Target</span>
          <span className="text-[10px] font-bold" style={{ color }}>{target}{unit}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${visible ? progress : 0}%`,
              background: `linear-gradient(90deg, ${color}cc, ${color})`,
              transitionDelay: `${delay + 400}ms`,
            }}
          />
        </div>
        <div className="text-[9px] text-slate-400 mt-1.5 font-medium">{progress.toFixed(0)}% achieved</div>
      </div>
    </div>
  );
}
