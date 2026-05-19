import FMSLayout from "@/components/FMSLayout";

export default function ControlTowerPage() {
  return (
    <FMSLayout breadcrumbs={[{ label: "Control Tower" }]}>
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Control Tower</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          This section is reserved for the Control Tower project mockup.
          Pages and modules will be added here as the project develops.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          Coming soon — check back later
        </div>
      </div>
    </FMSLayout>
  );
}
