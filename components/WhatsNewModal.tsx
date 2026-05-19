"use client";

interface Change {
  title: string;
  description: string;
}

interface WhatsNewModalProps {
  module: string;
  changes: Change[];
  onClose: () => void;
}

export default function WhatsNewModal({ module, changes, onClose }: WhatsNewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">What&apos;s New</span>
              <span className="text-xs text-gray-400">{module}</span>
            </div>
            <h2 className="text-base font-bold text-gray-900">Improvements in This Module</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5 ml-4 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Changes */}
        <div className="px-6 py-5 space-y-4">
          {changes.map((change, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-0.5">{change.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{change.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <a
            href="https://docs.google.com/document/d/1fonj6rmlOqbSDfe3w28Eq26lIM96uJDWrWmeSQ4DdnE/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View full requirements (FRF)
          </a>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
