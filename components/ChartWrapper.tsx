import React from "react";

interface ChartWrapperProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function ChartWrapper({ children, title, subtitle, actions, className = "" }: ChartWrapperProps) {
  return (
    <div className={`glass-card p-6 flex flex-col h-full bg-white dark:bg-slate-800 dark:border-slate-700 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            {title && <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg tracking-wide flex items-center gap-2">{title}</h2>}
            {subtitle && <p className="text-[11px] text-slate-400 mt-1 tracking-wider uppercase font-bold">{subtitle}</p>}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="flex-1 w-full relative z-10 min-h-[300px]">
        {children}
      </div>
    </div>
  );
}
