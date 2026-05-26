"use client";
import FMSLayout from "@/components/FMSLayout";
import FloatingWhatsNew from "@/components/FloatingWhatsNew";

export default function SummaryPage() {
  return (
    <FMSLayout breadcrumbs={[{ label: "Driver Call-up" }, { label: "Summary and Introduction" }]}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Driver Call-up & Preference Collection</h1>
          <p className="text-sm text-gray-500">BRD — [SEA+BR] · JIRA: SPCPM-109013 · Priority: P1</p>
        </div>

        {/* Background */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 rounded bg-orange-400 inline-block flex-shrink-0" />
            <h2 className="text-lg font-bold text-gray-900">Background</h2>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">BR Market</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Route allocation and driver availability in Brazil are managed entirely through WhatsApp groups. Each dispatcher manages up to <strong>200 drivers</strong> per group. When routes are created, the dispatcher broadcasts them in the group and the first driver to respond gets assigned — after a manual restriction check. Attendance is collected via daily polls, followed up individually for non-responders, and recorded manually in spreadsheets. There is <strong>no system-level visibility</strong> of driver availability and no structured way to match drivers to routes.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">SEA Markets</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                In markets with high part-time driver rates (Thailand, Philippines), dedicated call-up teams are assigned to contact drivers every morning to confirm attendance. In the Philippines alone, <strong>42 headcounts</strong> are dedicated solely to driver call-up. The existing driver-to-route matching logic also relies heavily on manual input, limiting efficiency and scalability — particularly for Dynamic Routing.
              </p>
            </div>

            {/* Image placeholder: Current process */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[140px] text-center">
                <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-medium text-gray-500">Image 1</p>
                <p className="text-xs text-gray-400 mt-0.5">Sample BR WhatsApp group chat poll for driver availability</p>
              </div>
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[140px] text-center">
                <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-medium text-gray-500">Image 2</p>
                <p className="text-xs text-gray-400 mt-0.5">Current Driver Call-up and Matching process in BR</p>
              </div>
            </div>

            {/* Solution overview */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <p className="text-sm font-semibold text-orange-800 mb-3">The proposed solution introduces 4 new system-driven components:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { num: "01", title: "Preference Collection", desc: "Capture driver preferred clusters, working days, and shift times via Driver App." },
                  { num: "02", title: "Availability Confirmation", desc: "D-1 check-in to confirm drivers will show up before they're added to the allocation pool." },
                  { num: "03", title: "Route Matching", desc: "Use preference and availability data to improve route-to-driver assignment quality." },
                  { num: "04", title: "Call-up Logic", desc: "Final confirmation step before assignment — driver reviews route details and accepts or declines." },
                ].map(item => (
                  <div key={item.num} className="flex gap-3">
                    <span className="text-lg font-bold text-orange-300 leading-none flex-shrink-0">{item.num}</span>
                    <div>
                      <p className="text-sm font-semibold text-orange-900">{item.title}</p>
                      <p className="text-xs text-orange-700 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image placeholder: Timeline */}
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] text-center">
              <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-medium text-gray-500">Image 3</p>
              <p className="text-xs text-gray-400 mt-0.5">End-to-end timeline and workflow of driver availability confirmation</p>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 rounded bg-red-400 inline-block flex-shrink-0" />
            <h2 className="text-lg font-bold text-gray-900">Impact</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "text-red-600 bg-red-50",
                title: "High Manual Effort",
                stat: "5,181 dispatcher-hrs/month",
                desc: "In BR, 157 dispatchers spend an average of 1.5 hrs/day each on attendance confirmation and route offering — work that should be system-driven. Similar patterns exist across SEA markets.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "text-orange-600 bg-orange-50",
                title: "Inaccurate Driver-Route Matching",
                stat: "No preference data in system",
                desc: "Routes are broadcast to entire groups instead of matched by suitability. Without driver preference and availability data, allocation quality is low, leading to higher rejection rates and slower acceptance.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                ),
                color: "text-yellow-600 bg-yellow-50",
                title: "Delayed Pickup Operations",
                stat: "Up to 1.5 hrs per route assignment",
                desc: "From route posting to confirmed driver assignment, the process takes up to 1.5 hours. This shrinks the effective pickup collection window and increases the risk of missed or delayed pickups.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                color: "text-purple-600 bg-purple-50",
                title: "Data Security Risk",
                stat: "Unofficial channels, no access control",
                desc: "Route details — including driver IDs, areas, vehicle requirements, and parcel volumes — are shared via WhatsApp with no control over who can view them, creating ongoing fraud and data exposure risk.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5 mb-2">{item.stat}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Objective */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 rounded bg-green-400 inline-block flex-shrink-0" />
            <h2 className="text-lg font-bold text-gray-900">Objective</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  num: "01",
                  title: "Automate Driver Availability & Route Allocation",
                  color: "border-green-400 bg-green-50",
                  numColor: "text-green-400",
                  titleColor: "text-green-900",
                  desc: "Replace the manual WhatsApp-based process for collecting driver availability and offering routes with a system-driven flow. Target: reduce route assignment time from 1.5 hours to under 1 hour per dispatcher per day.",
                },
                {
                  num: "02",
                  title: "Enable Data-Driven Driver-Route Matching",
                  color: "border-blue-400 bg-blue-50",
                  numColor: "text-blue-400",
                  titleColor: "text-blue-900",
                  desc: "Capture structured driver preference data — preferred cluster, shift, and availability — and feed it as inputs into Smart and Dynamic Routing. This improves allocation quality and reduces the driver decline rate.",
                },
              ].map(obj => (
                <div key={obj.num} className={`rounded-lg border-l-4 p-5 ${obj.color}`}>
                  <p className={`text-3xl font-black mb-2 ${obj.numColor}`}>{obj.num}</p>
                  <p className={`text-sm font-bold mb-2 ${obj.titleColor}`}>{obj.title}</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{obj.desc}</p>
                </div>
              ))}
            </div>

            {/* Monitoring metrics */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">Monitoring Metrics</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 text-xs w-1/2">Metric</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 text-xs">What it measures</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["% of active FM drivers who completed weekly preference collection", "Whether drivers are engaging — low rate means allocation data is unreliable"],
                    ["% of drivers who completed D-1 check-in on their indicated days", "Whether check-in is being adopted — low rate means dispatchers lack next-day visibility"],
                    ["% of call-up notifications that received a response (accept or decline)", "Whether drivers are acting on notifications — high silence rate signals a UX or delivery problem"],
                    ["% of routes where Suggest Driver was used vs. manual selection", "Whether dispatchers trust the system recommendation"],
                    ["Preference submission rate, D-1 confirmation & call-up rate by station", "Identifies which stations have low adoption and need ops support"],
                  ].map(([metric, meaning]) => (
                    <tr key={metric} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-800 font-medium align-top">{metric}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 align-top">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="h-6" />
      </div>

      <FloatingWhatsNew
        module="Driver Call-up — Summary & Introduction"
        showFrf
        frfUrl="https://docs.google.com/document/d/1w_jAYS4HPlcqXnNY0VfHAqROjbhTJdqs7S9SCRFVhio/edit?usp=sharing"
        changes={[
          {
            title: "Background",
            description: "Overview of current manual processes in BR (WhatsApp-based) and SEA (dedicated call-up teams), including pain points that led to this initiative.",
          },
          {
            title: "Impact",
            description: "Four key pain points quantified: 5,181 dispatcher-hrs/month wasted, inaccurate matching, 1.5-hr assignment delays, and data security risks.",
          },
          {
            title: "Objective",
            description: "Two objectives: (1) automate availability and route allocation, (2) enable data-driven matching. Includes the monitoring metrics table.",
          },
        ]}
      />
    </FMSLayout>
  );
}
