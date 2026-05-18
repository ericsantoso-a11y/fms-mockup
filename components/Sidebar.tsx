"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  { label: "My Approval", children: [] },
  { label: "Operation Support", children: [] },
  { label: "Finance", children: [] },
  { label: "Order Management", children: [] },
  { label: "LineHaul", children: [] },
  {
    label: "Workforce Management",
    defaultOpen: true,
    children: [
      { label: "Staff Profile", href: "#" },
      { label: "Workstation", href: "#" },
      { label: "Driver Education", href: "#" },
      { label: "Driver Performance Mana...", href: "#" },
      { label: "Delivery Group", href: "#" },
      { label: "FM Group", href: "/fm-group/list" },
      { label: "Leave Management", href: "#" },
      { label: "Penalty Management", href: "#" },
      { label: "Driver Availability", href: "#" },
      { label: "Roster Planning", href: "#" },
      { label: "Attendance Record", href: "#" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(
      sidebarItems.map((item) => [item.label, item.defaultOpen ?? false])
    )
  );

  const toggle = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="w-52 min-h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-red-600 tracking-wide">FMS</span>
          <span className="text-xs bg-orange-400 text-white px-1 py-0.5 rounded font-semibold">UAT</span>
        </div>
      </div>

      {/* Admin selector */}
      <div className="px-4 py-2 border-b border-gray-100">
        <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900">
          Admin
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-gray-50">
          <svg className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search Menu"
            className="bg-transparent text-xs outline-none w-full text-gray-600 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-1">
        {sidebarItems.map((item) => (
          <div key={item.label}>
            {item.children.length === 0 ? (
              <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <span>{item.label}</span>
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <>
                <button
                  onClick={() => toggle(item.label)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <svg
                    className={`w-3 h-3 text-gray-400 transition-transform ${openSections[item.label] ? "rotate-180" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {openSections[item.label] && (
                  <div className="bg-gray-50">
                    {item.children.map((child) => {
                      const isActive = child.href !== "#" && pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`block pl-10 pr-4 py-2 text-sm transition-colors ${
                            isActive
                              ? "text-red-600 bg-red-50 border-l-2 border-red-600 font-medium"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom icon */}
      <div className="px-4 py-3 border-t border-gray-200">
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
