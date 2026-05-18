"use client";
import { useState, useRef, useEffect } from "react";

interface Option {
  id: number;
  name: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: number[];
  onChange: (selected: number[]) => void;
  placeholder?: string;
  excludeIds?: number[];
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Please Select",
  excludeIds = [],
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const available = options.filter(
    (o) => !excludeIds.includes(o.id)
  );
  const filtered = available.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    String(o.id).includes(search)
  );
  const selectedOptions = options.filter((o) => selected.includes(o.id));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const remove = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== id));
  };

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="min-h-[38px] border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer flex flex-wrap gap-1 items-center focus-within:border-red-400"
      >
        {selectedOptions.length === 0 && (
          <span className="text-gray-400 text-sm px-1">{placeholder}</span>
        )}
        {selectedOptions.map((o) => (
          <span
            key={o.id}
            className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs px-2 py-0.5 rounded"
          >
            [{o.id}] {o.name}
            <button
              type="button"
              onClick={(e) => remove(o.id, e)}
              className="text-red-400 hover:text-red-600 leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <svg
          className={`ml-auto w-3 h-3 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-52 flex flex-col">
          <div className="p-2 border-b">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search driver..."
              className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-red-400"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-4">No drivers found</div>
            ) : (
              filtered.map((o) => (
                <label
                  key={o.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(o.id)}
                    onChange={() => toggle(o.id)}
                    className="accent-red-600"
                  />
                  <span className="text-gray-500 text-xs">[{o.id}]</span>
                  <span>{o.name}</span>
                </label>
              ))
            )}
          </div>
          {selected.length > 0 && (
            <div className="border-t p-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear all ({selected.length} selected)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
