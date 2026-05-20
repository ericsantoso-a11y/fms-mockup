"use client";
import { useState, useEffect, useRef } from "react";

interface Change {
  title: string;
  description: string;
}

interface FloatingWhatsNewProps {
  module: string;
  changes: Change[];
  showFrf?: boolean;
  frfUrl?: string;
}

export default function FloatingWhatsNew({ module, changes, showFrf = true, frfUrl }: FloatingWhatsNewProps) {
  const [pos, setPos] = useState({ x: 0, y: 120 });
  const [collapsed, setCollapsed] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Place it near the right edge on mount
  useEffect(() => {
    setPos({ x: window.innerWidth - 284, y: 120 });
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed z-40 w-64 bg-white rounded-xl shadow-2xl border border-blue-200 select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Drag handle / header */}
      <div
        onMouseDown={onMouseDown}
        className="flex items-center justify-between px-4 py-3 bg-blue-600 rounded-t-xl cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Grip dots */}
          <div className="grid grid-cols-2 gap-0.5 flex-shrink-0">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white/50" />
            ))}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-white block leading-tight">What&apos;s New</span>
            <span className="text-xs text-blue-200 truncate block leading-tight">{module}</span>
          </div>
        </div>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setCollapsed((c) => !c)}
          className="text-white/70 hover:text-white ml-2 flex-shrink-0"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="px-4 py-4 space-y-3">
          {changes.map((change, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 leading-snug">{change.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{change.description}</p>
              </div>
            </div>
          ))}

          {showFrf && (
            <a
              href={frfUrl ?? "https://docs.google.com/document/d/1fonj6rmlOqbSDfe3w28Eq26lIM96uJDWrWmeSQ4DdnE/edit?tab=t.0"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline pt-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {frfUrl ? "View BRD" : "View full requirements (FRF)"}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
