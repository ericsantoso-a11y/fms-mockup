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

            {/* Real images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <img src="/dc-bg-whatsapp.jpg" alt="TH example: dispatcher manually confirming driver attendance via WhatsApp" className="w-full object-cover" />
                <p className="text-xs text-gray-500 px-3 py-2 bg-gray-50 border-t border-gray-100">TH Market — Dispatcher manually confirming driver attendance via WhatsApp group</p>
              </div>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <img src="/dc-bg-current-process.png" alt="PH current Driver Call-up and Matching process" className="w-full object-contain bg-white" />
                <p className="text-xs text-gray-500 px-3 py-2 bg-gray-50 border-t border-gray-100">PH Market — Current manual call-up and matching process</p>
              </div>
            </div>

            {/* Solution overview */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <p className="text-sm font-semibold text-orange-800 mb-3">The proposed solution introduces 4 new system-driven components:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { num: "01", title: "[BR] Preference Collection", desc: "Capture driver preferred clusters, working days, and shift times via Driver App." },
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

            {/* New process diagram */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <img src="/dc-bg-new-process.png" alt="New end-to-end driver availability and call-up workflow" className="w-full object-contain bg-white" />
              <p className="text-xs text-gray-500 px-3 py-2 bg-gray-50 border-t border-gray-100">Proposed new workflow — D-14 Preference Collection → D-1 Availability Confirmation → D-0 Route Matching, Call-up & Assignment</p>
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

        {/* Partial Feature Adoption */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-6 rounded bg-indigo-400 inline-block flex-shrink-0" />
            <h2 className="text-lg font-bold text-gray-900">Market Feature Adoption Scenarios</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4 ml-3">How the system helps even when markets adopt only part of the features.</p>

          <div className="space-y-4">

            {/* Scenario 1: Availability Confirmation only */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-teal-50 border-b border-teal-100">
                <span className="text-xs font-bold bg-teal-600 text-white px-2 py-0.5 rounded">Scenario A</span>
                <p className="text-sm font-bold text-teal-900">Availability Confirmation Only</p>
                <span className="ml-auto text-xs text-teal-600 font-medium">Morning / D-1 check-in</span>
              </div>
              <div className="p-5">
                {/* Flow */}
                <div className="flex items-start gap-2 mb-5 overflow-x-auto pb-1">
                  {[
                    { day: "D-1 / Morning", label: "Driver confirms availability", sub: "via Driver App notification", color: "bg-teal-600", light: "bg-teal-50 border-teal-200" },
                    { day: null, label: "→", sub: null, color: "", light: "" },
                    { day: "D-0 Route Matching", label: "System pools confirmed drivers", sub: "Unconfirmed drivers flagged", color: "bg-teal-500", light: "bg-teal-50 border-teal-200" },
                    { day: null, label: "→", sub: null, color: "", light: "" },
                    { day: "D-0 Assignment", label: "Dispatcher sees confirmation tag", sub: "✓ Confirmed · ✗ Not confirmed · — No response", color: "bg-indigo-600", light: "bg-indigo-50 border-indigo-200" },
                  ].map((step, i) =>
                    step.day === null ? (
                      <div key={i} className="flex-shrink-0 text-gray-300 text-xl font-light self-center px-1">→</div>
                    ) : (
                      <div key={i} className={`flex-shrink-0 rounded-lg border p-3 min-w-[160px] ${step.light}`}>
                        <span className={`text-xs font-bold text-white px-1.5 py-0.5 rounded inline-block mb-1.5 ${step.color}`}>{step.day}</span>
                        <p className="text-xs font-semibold text-gray-800 leading-tight">{step.label}</p>
                        {step.sub && <p className="text-xs text-gray-500 mt-0.5 leading-tight">{step.sub}</p>}
                      </div>
                    )
                  )}
                </div>

                {/* Key benefit */}
                <div className="flex items-start gap-3 bg-teal-50 rounded-lg p-4 border border-teal-100">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-teal-900 mb-1">Key benefit for dispatcher</p>
                    <p className="text-xs text-teal-800 leading-relaxed">
                      When assigning routes, the dispatcher can instantly see which drivers have confirmed they are coming today. This prevents the common situation of assigning a route to a driver who never showed up — catching the problem <strong>before</strong> assignment rather than hours later during operations.
                    </p>
                  </div>
                </div>

                {/* Tag mockup */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">How it appears in the assignment screen:</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 bg-white text-xs">
                      <span className="font-medium text-gray-700">Driver A</span>
                      <span className="bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded text-xs">✓ Confirmed</span>
                    </div>
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 bg-white text-xs">
                      <span className="font-medium text-gray-700">Driver B</span>
                      <span className="bg-red-100 text-red-700 font-semibold px-1.5 py-0.5 rounded text-xs">✗ Not Confirmed</span>
                    </div>
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 bg-white text-xs">
                      <span className="font-medium text-gray-700">Driver C</span>
                      <span className="bg-gray-100 text-gray-500 font-semibold px-1.5 py-0.5 rounded text-xs">— No Response</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario 2: Call-up only */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-violet-50 border-b border-violet-100">
                <span className="text-xs font-bold bg-violet-600 text-white px-2 py-0.5 rounded">Scenario B</span>
                <p className="text-sm font-bold text-violet-900">Call-up Only</p>
                <span className="ml-auto text-xs text-violet-600 font-medium">Post-assignment confirmation</span>
              </div>
              <div className="p-5">
                {/* Flow */}
                <div className="flex items-start gap-2 mb-5 overflow-x-auto pb-1">
                  {[
                    { day: "D-0 Assignment", label: "Route assigned to driver", sub: "System-matched or manual", color: "bg-violet-600", light: "bg-violet-50 border-violet-200" },
                    { day: null, label: "→", sub: null, color: "", light: "" },
                    { day: "Call-up Sent", label: "Driver receives notification", sub: "Route details: cluster, orders, distance, shift", color: "bg-violet-500", light: "bg-violet-50 border-violet-200" },
                    { day: null, label: "→", sub: null, color: "", light: "" },
                    { day: "Driver responds", label: "Accept → route confirmed", sub: "Decline → system re-matches next best driver", color: "bg-indigo-600", light: "bg-indigo-50 border-indigo-200" },
                  ].map((step, i) =>
                    step.day === null ? (
                      <div key={i} className="flex-shrink-0 text-gray-300 text-xl font-light self-center px-1">→</div>
                    ) : (
                      <div key={i} className={`flex-shrink-0 rounded-lg border p-3 min-w-[160px] ${step.light}`}>
                        <span className={`text-xs font-bold text-white px-1.5 py-0.5 rounded inline-block mb-1.5 ${step.color}`}>{step.day}</span>
                        <p className="text-xs font-semibold text-gray-800 leading-tight">{step.label}</p>
                        {step.sub && <p className="text-xs text-gray-500 mt-0.5 leading-tight">{step.sub}</p>}
                      </div>
                    )
                  )}
                </div>

                {/* Key benefit */}
                <div className="flex items-start gap-3 bg-violet-50 rounded-lg p-4 border border-violet-100">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-violet-900 mb-1">Key benefit for dispatcher</p>
                    <p className="text-xs text-violet-800 leading-relaxed">
                      After a route is assigned, the dispatcher can see the real-time call-up status of each driver. If a driver declines, the dispatcher knows immediately and can act — either letting the system re-match automatically or manually reassigning. This directly combats the problem of wrong or missed assignments that only surface during operations.
                    </p>
                  </div>
                </div>

                {/* Tag mockup */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">How it appears in the assignment screen:</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 bg-white text-xs">
                      <span className="font-medium text-gray-700">Route #001 → Driver A</span>
                      <span className="bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded text-xs">Accepted</span>
                    </div>
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 bg-white text-xs">
                      <span className="font-medium text-gray-700">Route #002 → Driver B</span>
                      <span className="bg-red-100 text-red-700 font-semibold px-1.5 py-0.5 rounded text-xs">Declined</span>
                    </div>
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded px-3 py-1.5 bg-white text-xs">
                      <span className="font-medium text-gray-700">Route #003 → Driver C</span>
                      <span className="bg-yellow-100 text-yellow-700 font-semibold px-1.5 py-0.5 rounded text-xs">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
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
