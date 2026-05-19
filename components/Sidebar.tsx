"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Project = "fms" | "ct";
type Context = "admin" | "station" | "driverapp";

const PROJECTS = [
  { value: "fms" as Project,  label: "FMS — Pickup Group", dot: "bg-blue-400" },
  { value: "ct"  as Project,  label: "Control Tower",      dot: "bg-emerald-400" },
];

const CONTEXTS = [
  { value: "admin" as Context, label: "Admin" },
  { value: "station" as Context, label: "Pandan Sorting Centre" },
  { value: "driverapp" as Context, label: "Driver App" },
];

const adminItems = [
  {
    label: "Workforce Management",
    defaultOpen: true,
    children: [
      { label: "Staff Profile", href: "#" },
      { label: "Workstation", href: "#" },
      { label: "Driver Education", href: "#" },
      { label: "Driver Performance Mana...", href: "#" },
      { label: "Delivery Group", href: "#" },
      { label: "Pickup Group", href: "/pickup-group/list" },
      { label: "Leave Management", href: "#" },
      { label: "Penalty Management", href: "#" },
      { label: "Driver Availability", href: "#" },
      { label: "Roster Planning", href: "#" },
      { label: "Attendance Record", href: "#" },
    ],
  },
];

const stationItems = [
  { label: "Dashboard", href: "#", icon: "dashboard" },
  {
    label: "Pickup",
    defaultOpen: true,
    children: [
      { label: "PUP Configuration", href: "#" },
      { label: "Pickup Handover Station Man...", href: "#" },
      { label: "Driver Transfer", href: "#" },
      { label: "Pickup Assignment", href: "/station/pickup-assignment" },
      { label: "Pending Failed Order List", href: "#" },
      { label: "Pickup Task Management", href: "#" },
      { label: "On-hold Pickup Task List", href: "#" },
      { label: "Run Wave Scheduler", href: "#" },
      { label: "Run Wave Result", href: "#" },
      { label: "Pickup Point Management", href: "#" },
      { label: "FM Registration", href: "#" },
    ],
  },
  { label: "Inbound", href: "#", children: [] },
  { label: "Outbound", href: "#", children: [] },
  { label: "Return", href: "#", children: [] },
  { label: "Ticket Management", href: "#", children: [] },
];

const ctItems = [
  {
    label: "Overview",
    defaultOpen: true,
    children: [
      { label: "Dashboard", href: "/control-tower" },
    ],
  },
  {
    label: "Live Operations",
    defaultOpen: false,
    children: [
      { label: "Fleet Tracking", href: "#" },
      { label: "Route Monitoring", href: "#" },
      { label: "Incident Management", href: "#" },
    ],
  },
  {
    label: "Analytics",
    defaultOpen: false,
    children: [
      { label: "Performance Reports", href: "#" },
      { label: "SLA Dashboard", href: "#" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const defaultProject: Project = pathname.startsWith("/control-tower") ? "ct" : "fms";
  const [project, setProject] = useState<Project>(defaultProject);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const defaultContext: Context =
    pathname.startsWith("/station") ? "station"
    : pathname.startsWith("/driver-app") ? "driverapp"
    : "admin";
  const [context, setContext] = useState<Context>(defaultContext);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Workforce Management": true,
    "Pickup": true,
  });

  const toggle = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const switchContext = (ctx: Context) => {
    setContext(ctx);
    setShowContextMenu(false);
    if (ctx === "station") router.push("/station/pickup-assignment");
    else if (ctx === "driverapp") router.push("/driver-app");
    else router.push("/pickup-group/list");
  };

  const switchProject = (p: Project) => {
    setProject(p);
    setShowProjectMenu(false);
    if (p === "ct") router.push("/control-tower");
    else router.push("/pickup-group/list");
  };

  const currentProject = PROJECTS.find((p) => p.value === project)!;
  const currentLabel = CONTEXTS.find((c) => c.value === context)?.label ?? "Admin";
  const items = project === "ct" ? ctItems : context === "admin" ? adminItems : context === "station" ? stationItems : [];

  return (
    <div className="w-52 min-h-screen flex flex-col flex-shrink-0" style={{ backgroundColor: "#113366" }}>
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-white tracking-wide">FMS</span>
          <span className="text-xs bg-blue-400 text-white px-1 py-0.5 rounded font-semibold">Mockup</span>
        </div>

        {/* Project switcher */}
        <div className="relative">
          <button
            onClick={() => setShowProjectMenu(!showProjectMenu)}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-medium text-white/80 hover:bg-white/10 transition-colors border border-white/20"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${currentProject.dot}`} />
              <span className="truncate">{currentProject.label}</span>
            </div>
            <svg
              className={`w-3 h-3 text-white/50 flex-shrink-0 ml-1 transition-transform ${showProjectMenu ? "rotate-180" : ""}`}
              fill="currentColor" viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showProjectMenu && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded shadow-lg z-50 overflow-hidden">
              {PROJECTS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => switchProject(p.value)}
                  className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                    project === p.value
                      ? "bg-red-50 text-red-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.dot}`} />
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Context switcher — FMS only */}
      {project === "fms" && <div className="px-3 py-2 border-b border-white/10 relative">
        <button
          onClick={() => setShowContextMenu(!showContextMenu)}
          className="w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <span className="truncate">{currentLabel}</span>
          <svg
            className={`w-3 h-3 text-white/60 flex-shrink-0 ml-1 transition-transform ${showContextMenu ? "rotate-180" : ""}`}
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {showContextMenu && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white rounded shadow-lg z-50 overflow-hidden">
            {CONTEXTS.map((ctx) => (
              <button
                key={ctx.value}
                onClick={() => switchContext(ctx.value)}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                  context === ctx.value
                    ? "bg-red-50 text-red-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {ctx.label}
              </button>
            ))}
          </div>
        )}
      </div>}

      {/* Search */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="flex items-center rounded px-2 py-1" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          <svg className="w-3 h-3 text-white/50 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search Menu"
            className="bg-transparent text-xs outline-none w-full text-white placeholder-white/40"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-1">
        {items.map((item) => {
          // Flat item (no children) like Dashboard
          if (!("children" in item) || item.children === undefined) {
            const isActive = (item as any).href !== "#" && pathname.startsWith((item as any).href);
            return (
              <Link
                key={item.label}
                href={(item as any).href}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                  isActive ? "text-white font-medium bg-white/15 border-l-2 border-white" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                {item.label}
              </Link>
            );
          }

          // Section with children
          const children = item.children as { label: string; href: string }[];
          if (children.length === 0) {
            return (
              <button key={item.label} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors">
                <span>{item.label}</span>
                <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            );
          }

          return (
            <div key={item.label}>
              <button
                onClick={() => toggle(item.label)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    <svg className="w-2.5 h-2.5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{item.label}</span>
                </div>
                <svg
                  className={`w-3 h-3 text-white/50 transition-transform ${openSections[item.label] ? "rotate-180" : ""}`}
                  fill="currentColor" viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {openSections[item.label] && (
                <div style={{ backgroundColor: "rgba(0,0,0,0.15)" }}>
                  {children.map((child) => {
                    const isActive = child.href !== "#" && pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={`block pl-10 pr-4 py-2 text-sm transition-colors ${
                          isActive
                            ? "text-white font-medium border-l-2 border-white"
                            : "text-white/65 hover:text-white hover:bg-white/10"
                        }`}
                        style={isActive ? { backgroundColor: "rgba(255,255,255,0.15)" } : undefined}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-3 border-t border-white/10">
        <button className="text-white/40 hover:text-white/80">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
