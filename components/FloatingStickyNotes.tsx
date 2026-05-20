"use client";
import { useState, useRef, useEffect } from "react";

interface Note {
  id: number;
  text: string;
  x: number;
  y: number;
}

function StickyNote({ note, onDelete }: { note: Note; onDelete: (id: number) => void }) {
  const [pos, setPos] = useState({ x: note.x, y: note.y });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  return (
    <div
      className="fixed z-50 w-56 rounded-lg shadow-xl border border-yellow-300 select-none"
      style={{ left: pos.x, top: pos.y, backgroundColor: "#fefce8" }}
    >
      <div
        onMouseDown={e => {
          dragging.current = true;
          offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          e.preventDefault();
        }}
        className="flex items-center justify-between px-3 py-2 rounded-t-lg cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: "#fde047" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-yellow-700/40" />)}
          </div>
          <span className="text-xs font-bold text-yellow-900">Note</span>
        </div>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={() => onDelete(note.id)}
          className="text-yellow-700 hover:text-yellow-900 text-base leading-none font-bold"
        >
          ×
        </button>
      </div>
      <div className="px-3 py-3">
        <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{note.text}</p>
      </div>
    </div>
  );
}

export default function FloatingStickyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState("");
  const nextId = useRef(1);
  const inputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showInput) textareaRef.current?.focus();
  }, [showInput]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowInput(false);
      }
    };
    if (showInput) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showInput]);

  const addNote = () => {
    if (!draft.trim()) return;
    const id = nextId.current++;
    const col = notes.length % 4;
    const row = Math.floor(notes.length / 4);
    setNotes(prev => [...prev, {
      id,
      text: draft.trim(),
      x: window.innerWidth - 300 - col * 20,
      y: 140 + row * 40 + col * 30,
    }]);
    setDraft("");
    setShowInput(false);
  };

  const deleteNote = (id: number) => setNotes(prev => prev.filter(n => n.id !== id));

  return (
    <>
      {notes.map(note => <StickyNote key={note.id} note={note} onDelete={deleteNote} />)}

      <div ref={inputRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {showInput && (
          <div className="w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between" style={{ backgroundColor: "#fde047" }}>
              <span className="text-xs font-bold text-yellow-900">New Note</span>
              <button onClick={() => setShowInput(false)} className="text-yellow-700 hover:text-yellow-900 font-bold text-base leading-none">×</button>
            </div>
            <div className="p-3">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote(); }}
                rows={4}
                placeholder="Type your comment here…"
                className="w-full border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">⌘↵ to add</span>
                <button
                  onClick={addNote}
                  disabled={!draft.trim()}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-yellow-400 text-yellow-900 hover:bg-yellow-500 disabled:opacity-40 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowInput(v => !v)}
          title="Add a note"
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${showInput ? "bg-yellow-400 text-yellow-900 rotate-45" : "bg-yellow-400 hover:bg-yellow-500 text-yellow-900"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </>
  );
}
