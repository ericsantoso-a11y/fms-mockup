"use client";
import FMSLayout from "@/components/FMSLayout";

export default function DriverCallupPage() {
  return (
    <FMSLayout breadcrumbs={[{ label: "Driver Call-up" }]}>
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Driver Call-up</h1>
        <p className="text-gray-400 text-sm">Pages coming soon</p>
      </div>
    </FMSLayout>
  );
}
