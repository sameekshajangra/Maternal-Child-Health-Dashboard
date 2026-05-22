"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, TrendingUp, Brain,
  Accessibility, FileText, Sparkles, Moon, Sun, ChevronRight,
  Activity, ChevronDown, BarChart2, Target, GitCompare, Search,
  Gauge, AlertTriangle, Layers
} from "lucide-react";

// Dashboard dropdown sub-items
const dashboardSubItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/#kpis", label: "KPI Metrics", icon: Target },
  { href: "/#trends", label: "Trend Charts", icon: BarChart2 },
  { href: "/#priorities", label: "Priority States", icon: AlertTriangle },
];

const navItems = [
  {
    href: "/heatmaps",
    label: "India Heatmaps",
    icon: Map,
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    bgActive: "rgba(16,185,129,0.10)",
    borderActive: "rgba(16,185,129,0.28)",
    textActive: "#059669",
    iconBg: "#ecfdf5",
    hoverBg: "rgba(16,185,129,0.06)",
  },
  {
    href: "/predictive",
    label: "Predictive Analytics",
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    bgActive: "rgba(245,158,11,0.10)",
    borderActive: "rgba(245,158,11,0.32)",
    textActive: "#d97706",
    iconBg: "#fffbeb",
    hoverBg: "rgba(245,158,11,0.06)",
  },
  {
    href: "/explainable-ai",
    label: "Explainable AI",
    icon: Brain,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
    bgActive: "rgba(139,92,246,0.10)",
    borderActive: "rgba(139,92,246,0.28)",
    textActive: "#7c3aed",
    iconBg: "#f5f3ff",
    hoverBg: "rgba(139,92,246,0.06)",
  },
  {
    href: "/compare",
    label: "Compare States",
    icon: GitCompare,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)",
    bgActive: "rgba(6,182,212,0.10)",
    borderActive: "rgba(6,182,212,0.28)",
    textActive: "#0891b2",
    iconBg: "#ecfeff",
    hoverBg: "rgba(6,182,212,0.06)",
  },
  {
    href: "/research",
    label: "Research Assistant",
    icon: Search,
    gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    bgActive: "rgba(236,72,153,0.10)",
    borderActive: "rgba(236,72,153,0.28)",
    textActive: "#db2777",
    iconBg: "#fdf2f8",
    hoverBg: "rgba(236,72,153,0.06)",
  },
  {
    href: "/accessibility",
    label: "Health Access",
    icon: Gauge,
    gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
    bgActive: "rgba(249,115,22,0.10)",
    borderActive: "rgba(249,115,22,0.28)",
    textActive: "#ea580c",
    iconBg: "#fff7ed",
    hoverBg: "rgba(249,115,22,0.06)",
  },
  {
    href: "/policy",
    label: "Policy Insights",
    icon: FileText,
    gradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    bgActive: "rgba(99,102,241,0.10)",
    borderActive: "rgba(99,102,241,0.28)",
    textActive: "#4f46e5",
    iconBg: "#eef2ff",
    hoverBg: "rgba(99,102,241,0.06)",
  },
  {
    href: "/insights",
    label: "Cross-Dim. Insights",
    icon: Layers,
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    bgActive: "rgba(14,165,233,0.10)",
    borderActive: "rgba(14,165,233,0.28)",
    textActive: "#0284c7",
    iconBg: "#f0f9ff",
    hoverBg: "rgba(14,165,233,0.06)",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [hash, setHash] = useState<string>("");
  // Sync hash with URL fragment to style sub‑items (KPI Metrics, Trend Charts, Priority States)
  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const [isDark, setIsDark] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [dashOpen, setDashOpen] = useState(true); // dashboard dropdown open by default
  const [dashHovered, setDashHovered] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    // auto-open dashboard dropdown if on root
    if (pathname === "/") setDashOpen(true);
  }, [pathname]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  };

  const isDashActive = pathname === "/";

  // Color tokens
  const sidebarBg = isDark ? "#0f172a" : "#ffffff";
  const sidebarBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const labelColor = isDark ? "#cbd5e1" : "#475569";
  const inactiveText = isDark ? "#94a3b8" : "#6b7280";
  const sectionLabel = isDark ? "#475569" : "#9ca3af";
  const subItemHover = isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)";
  const subItemActive = isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)";

  return (
    <aside
      className="sidebar"
      style={{
        background: sidebarBg,
        borderRight: `1px solid ${sidebarBorder}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── Logo + Toggle Header ── */}
      <div
        style={{
          padding: "18px 20px 16px",
          borderBottom: `1px solid ${sidebarBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", minWidth: 0 }}
        >
          {/* Logo Icon */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              flexShrink: 0,
              background: isDark ? "#1e293b" : "#f8fafc",
              border: `1px solid ${sidebarBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              src="/logo.png"
              alt="Maatri AI Logo"
              width={34}
              height={34}
              style={{ objectFit: "contain" }}
              priority
            />
            {/* Live dot */}
            <div
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                border: "1.5px solid white",
                boxShadow: "0 0 6px rgba(16,185,129,0.7)",
              }}
            />
          </div>

          {/* Brand */}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                whiteSpace: "nowrap",
              }}
            >
              Maatri AI
            </div>
            <div
              style={{
                fontSize: "8.5px",
                color: "#94a3b8",
                fontWeight: 700,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                marginTop: "2px",
                whiteSpace: "nowrap",
              }}
            >
              Health Intelligence
            </div>
          </div>
        </Link>

        {/* Dark / Light Toggle — right of logo */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Light Mode" : "Dark Mode"}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            flexShrink: 0,
            background: isDark ? "#1e293b" : "#f1f5f9",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
        >
          {isDark ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="#6366f1" />}
        </button>
      </div>

      {/* ── AI Status Badge ── */}
      <div
        style={{
          margin: "14px 16px 0",
          padding: "10px 14px",
          borderRadius: "12px",
          background: isDark
            ? "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08))"
            : "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(16,185,129,0.05))",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Sparkles size={12} color="#6366f1" />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1" }}>AI Engine · Live</span>
          <div
            style={{
              marginLeft: "auto",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 0 3px rgba(16,185,129,0.2)",
            }}
          />
        </div>
        <div style={{ fontSize: "9.5px", color: "#94a3b8", fontWeight: 500, marginTop: "3px" }}>
          NFHS-5 · SDG Index · Air Quality · 7 Layers
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <div
          style={{
            fontSize: "9px",
            fontWeight: 700,
            color: sectionLabel,
            textTransform: "uppercase",
            letterSpacing: "1.4px",
            padding: "0 10px",
            marginBottom: "8px",
          }}
        >
          Platform
        </div>

        {/* ── Dashboard Dropdown ── */}
        <div style={{ marginBottom: "4px" }}>
          <button
            onClick={() => setDashOpen(!dashOpen)}
            onMouseEnter={() => setDashHovered(true)}
            onMouseLeave={() => setDashHovered(false)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "11px",
              padding: "10px 13px",
              borderRadius: "12px",
              border: `1px solid ${isDashActive ? "rgba(99,102,241,0.28)" : "transparent"}`,
              background: isDashActive
                ? "rgba(99,102,241,0.10)"
                : dashHovered
                ? "rgba(99,102,241,0.06)"
                : "transparent",
              cursor: "pointer",
              transition: "all 0.22s ease",
              transform: dashHovered ? "translateY(-1px)" : "translateY(0)",
              boxShadow: isDashActive ? "0 4px 16px rgba(99,102,241,0.15)" : "none",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isDashActive
                  ? "linear-gradient(135deg, #6366f1, #818cf8)"
                  : isDark ? "#1e293b" : "#eef2ff",
                boxShadow: isDashActive ? "0 3px 10px rgba(99,102,241,0.3)" : "none",
                transition: "all 0.22s ease",
              }}
            >
              <LayoutDashboard
                size={16}
                color={isDashActive ? "#ffffff" : dashHovered ? "#4f46e5" : inactiveText}
                strokeWidth={isDashActive ? 2.5 : 2}
              />
            </div>

            <span
              style={{
                flex: 1,
                fontSize: "13px",
                fontWeight: isDashActive ? 700 : 500,
                color: isDashActive ? "#4f46e5" : dashHovered ? "#4f46e5" : labelColor,
                textAlign: "left",
                transition: "color 0.2s ease",
              }}
            >
              Dashboard
            </span>

            <ChevronDown
              size={14}
              color={isDashActive ? "#4f46e5" : inactiveText}
              style={{
                transform: dashOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
                flexShrink: 0,
              }}
            />
          </button>

          {/* Sub-items */}
          {dashOpen && (
            <div
              style={{
                marginTop: "3px",
                marginLeft: "22px",
                paddingLeft: "20px",
                borderLeft: "2px solid rgba(99,102,241,0.15)",
                borderLeft: "1px solid rgba(99,102,241,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {dashboardSubItems.map((sub) => {
                const isSubActive = hash === sub.href;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "7px 12px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: isSubActive ? "#4f46e5" : inactiveText,
                      background: isSubActive ? "rgba(99,102,241,0.08)" : "transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <sub.icon size={12} strokeWidth={isSubActive ? 2.5 : 2} />
                    <span style={{ fontSize: "12px", fontWeight: isSubActive ? 600 : 400 }}>
                      {sub.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Other Nav Items ── */}
        {navItems.map((item, idx) => {
          const isActive = pathname.startsWith(item.href);
          const isHovered = hoveredIdx === idx;

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "10px 13px",
                borderRadius: "12px",
                textDecoration: "none",
                marginBottom: "8px",
                transition: "all 0.22s ease",
                transform: isActive || isHovered ? "translateY(-1px)" : "translateY(0)",
                background: isActive ? item.bgActive : isHovered ? item.hoverBg : "transparent",
                border: `1px solid ${isActive ? item.borderActive : "transparent"}`,
                boxShadow: isActive
                  ? `0 4px 14px ${item.borderActive}90`
                  : isHovered
                  ? `0 4px 10px ${item.borderActive}40`
                  : "none",
              }}
            >
              {/* Icon bubble */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive ? item.gradient : isDark ? "#1e293b" : item.iconBg,
                  boxShadow: isActive ? `0 3px 10px ${item.borderActive}` : "none",
                  transition: "all 0.22s ease",
                }}
              >
                {(Object.keys(metricConfig) as Metric[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                      metric === m
                        ? "bg-gradient-to-r from-indigo-500 to-purple-650 text-white shadow-sm"
                        : "bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {metricConfig[m].icon}
                    {metricConfig[m].shortLabel}
                  </button>
                ))}
                <item.icon
                  size={16}
                  color={isActive ? "#ffffff" : isHovered ? item.textActive : inactiveText}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? item.textActive : isHovered ? item.textActive : labelColor,
                  transition: "color 0.2s ease",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>

              {isActive && (
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    background: item.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={11} color="white" strokeWidth={3} />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Data Sources ── */}
      <div
        style={{
          margin: "0 12px 12px",
          padding: "12px 14px",
          borderRadius: "12px",
          background: isDark ? "rgba(30,41,59,0.7)" : "#f8fafc",
          border: `1px solid ${isDark ? "#1e293b" : "#f1f5f9"}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <Activity size={12} color="#10b981" />
          <span style={{ fontSize: "10.5px", fontWeight: 700, color: isDark ? "#94a3b8" : "#475569" }}>
            Data Sources
          </span>
        </div>
        {["NFHS-5 (2019–21)", "SDG India Index", "CPCB Air Quality", "MoHFW India", "Census 2011", "NITI Aayog MPI"].map((src) => (
          <div key={src} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
            <div
              style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }}
            />
            <span style={{ fontSize: "10px", color: isDark ? "#64748b" : "#94a3b8", fontWeight: 500 }}>
              {src}
            </span>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "11px 20px",
          borderTop: `1px solid ${sidebarBorder}`,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}>
          © 2024 Maatri AI · v2.5.0
        </span>
      </div>
    </aside>
  );
}
