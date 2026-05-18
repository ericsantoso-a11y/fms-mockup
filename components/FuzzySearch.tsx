"use client";
import { useState, useRef, useEffect } from "react";

interface Option {
  id: number;
  name: string;
  label?: string;
}

interface FuzzySearchProps {
  options: Option[];
  value: string;
  onSelect: (value: string, id: number | null) => void;
  placeholder?: string;
  minChars?: number;
}

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function FuzzySearch({
  options,
  value,
  onSelect,
  placeholder = "Please Input",
  minChars = 3,
}: FuzzySearchProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions =
    value.length >= minChars
      ? options.filter(
          (o) =>
            fuzzyMatch(value, o.name) ||
            fuzzyMatch(value, String(o.id)) ||
            (o.label && fuzzyMatch(value, o.label))
        )
      : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value, null);
    setOpen(true);
  };

  const handleSelect = (opt: Option) => {
    onSelect(`[${opt.id}] ${opt.name}`, opt.id);
    setOpen(false);
  };

  const handleClear = () => {
    onSelect("", null);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-52">
      <div className="relative">
        <input
          value={value}
          onChange={handleChange}
          onFocus={() => value.length >= minChars && setOpen(true)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-400 pr-7"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base leading-none"
          >
            ×
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((opt) => (
            <button
              key={opt.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(opt)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
            >
              <span className="text-gray-400 text-xs">[{opt.id}]</span>
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      )}

      {open && value.length >= minChars && suggestions.length === 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-sm text-gray-400">
          No results found
        </div>
      )}

      {value.length > 0 && value.length < minChars && (
        <p className="text-xs text-gray-400 mt-1">Type {minChars - value.length} more character(s) to search</p>
      )}
    </div>
  );
}
