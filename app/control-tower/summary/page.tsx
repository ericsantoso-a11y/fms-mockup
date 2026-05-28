"use client";
import FMSLayout from "@/components/FMSLayout";
import FloatingWhatsNew from "@/components/FloatingWhatsNew";

export default function CTSummaryPage() {
  return (
    <FMSLayout breadcrumbs={[{ label: "Control Tower" }, { label: "Summary and Introduction" }]}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">FM Control Tower</h1>
          <p className="text-sm text-gray-500">BRD — [SEA] · Priority: P1 · Markets: PH, TH, ID</p>
        </div>

        {/* Background */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 rounded bg-orange-400 inline-block flex-shrink-0" />
            <h2 className="text-lg font-bold text-gray-900">Background</h2>
          </div>

          <div className="space-y-4">
            {/* The problem */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">What is missing today</p>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Miss pickup prevention is currently a <strong>fully manual responsibility</strong>. Hub leads and captains are expected to catch and rectify operational issues on their own — the system provides no early warning, and the office or regional team has no way to intervene before it is too late.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs font-bold text-amber-800 mb-2">Example scenario</p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  A pickup planner forgets to assign a task, or accidentally assigns it to an offline driver. For this to be caught, either the driver or the planner must manually flag it. If neither does, <strong>hours can pass unnoticed</strong>. By the time anyone realises, the pickup window has closed and the seller's order is delayed to the next day.
                </p>
              </div>
            </div>

            {/* KPI gap */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-red-900">D+1 KPI Framework</p>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">All KPI measurement happens the day after — by definition, after the miss has already occurred. There is no mechanism to catch risk signals in real time and act before the outcome is locked in.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-700">No Early Warning System</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">The system provides no proactive alerts. Regional and office teams have no visibility into ground operations until issues are manually escalated — often too late to act.</p>
              </div>
            </div>

            {/* The shift */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-900 mb-1">The improvement: Reactive → Preventive</p>
                <p className="text-xs text-green-800 leading-relaxed">
                  Instead of finding out tomorrow that a pickup was missed, the Control Tower can alert a hub lead <strong>today</strong> — for example, that a driver has been idle for too long, or that tasks are at risk of not being completed before end of shift. Action happens before the outcome is locked in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 rounded bg-blue-400 inline-block flex-shrink-0" />
            <h2 className="text-lg font-bold text-gray-900">Feature</h2>
          </div>

          <div className="space-y-5">
            {/* How it works */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">How it works</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                The office or regional team <strong>configures trigger conditions</strong> that represent operational risk signals. When the system detects that a condition is met, it automatically raises an <strong>actionable ticket</strong> to the relevant hub operations team so they can rectify the situation before it becomes a miss.
              </p>
            </div>

            {/* Diagram */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <img
                src="/ct-summary-diagram.png"
                alt="Control Tower flow: Rule Config triggers Case Management which creates ticket for Ops Action"
                className="w-full object-contain bg-white px-6 py-4"
              />
              <p className="text-xs text-gray-500 px-4 py-2 bg-gray-50 border-t border-gray-100">
                Rule Config triggers Case Management → ticket created → Ops takes action
              </p>
            </div>

            {/* Three components */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">The Control Tower is made up of three modules:</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    num: "01",
                    label: "Rule Config",
                    role: "Configure",
                    desc: "Office/regional team sets up trigger conditions, thresholds, and alert rules. Fires a case when a condition is met.",
                    color: "border-blue-400 bg-blue-50",
                    numColor: "text-blue-300",
                    titleColor: "text-blue-900",
                    badgeColor: "bg-blue-100 text-blue-700",
                  },
                  {
                    num: "02",
                    label: "Case Management",
                    role: "Act",
                    desc: "Workspace for hub leads to see, process, and close tickets. Each ticket shows the issue and suggested action.",
                    color: "border-indigo-400 bg-indigo-50",
                    numColor: "text-indigo-300",
                    titleColor: "text-indigo-900",
                    badgeColor: "bg-indigo-100 text-indigo-700",
                  },
                  {
                    num: "03",
                    label: "Dashboard",
                    role: "Monitor",
                    desc: "Office team monitors ticket performance and resolution progress across all hubs in real time.",
                    color: "border-violet-400 bg-violet-50",
                    numColor: "text-violet-300",
                    titleColor: "text-violet-900",
                    badgeColor: "bg-violet-100 text-violet-700",
                  },
                ].map(c => (
                  <div key={c.num} className={`rounded-lg border-l-4 p-4 ${c.color}`}>
                    <p className={`text-2xl font-black mb-1 ${c.numColor}`}>{c.num}</p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <p className={`text-sm font-bold ${c.titleColor}`}>{c.label}</p>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${c.badgeColor}`}>{c.role}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rule Config capabilities */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">Rule Config capabilities</p>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  {
                    title: "Flexible Data Sources",
                    desc: "Rules can be built from FMS live values, internal data tables, or uploaded Excel/Google Sheets — so even data maintained offline by ops teams can power a trigger condition.",
                  },
                  {
                    title: "Station-Level Scoping",
                    desc: "Rules can be applied selectively to specific stations or groups. A rule built for a high-volume hub won't fire for a station where it isn't relevant.",
                  },
                  {
                    title: "Configurable Check Frequency",
                    desc: "How often a rule is checked can be customised (e.g. hourly). Alerts are tied to your workflow's natural rhythm, not firing continuously in the background.",
                  },
                  {
                    title: "Noise Controls",
                    desc: "Trigger delay (condition must persist X minutes before raising a ticket), ticket cap (max Y tickets per hour per rule), and certainty check (alert only if X out of last Y checks failed) — prevents alert fatigue.",
                  },
                  {
                    title: "Auto-Resolution",
                    desc: "If the system detects the issue is no longer present, the ticket closes automatically. Hub leads don't need to manually clean up resolved items.",
                  },
                  {
                    title: "Closure Verification",
                    desc: "When a ticket is manually closed, the system re-checks that the underlying condition is actually gone — preventing premature closure from distorting resolution data.",
                  },
                ].map(cap => (
                  <div key={cap.title} className="flex items-start gap-3 px-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{cap.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 1 rules */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">Phase 1 — Pre-configured Rules</p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    tag: "Miss-Assignment",
                    tagColor: "bg-red-100 text-red-700",
                    desc: "Fires when a PUP has pending orders but no driver has been assigned by the configured cutoff time. Suggested action: Assign PUP to driver.",
                  },
                  {
                    tag: "No Movement",
                    tagColor: "bg-orange-100 text-orange-700",
                    desc: "Fires when an assigned driver has had no qualifying status update for a configured number of minutes — indicating the driver may be offline or MIA. Suggested actions: Check with driver, Re-assign, or Dispatch backup.",
                  },
                  {
                    tag: "At-Risk Completion",
                    tagColor: "bg-yellow-100 text-yellow-700",
                    desc: "Fires when a driver's PUP completion rate falls below a configured threshold by a set time of day. Suggests dispatching a backup driver for remaining PUPs.",
                  },
                ].map(rule => (
                  <div key={rule.tag} className="flex items-start gap-3 px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${rule.tagColor}`}>{rule.tag}</span>
                    <p className="text-xs text-gray-600 leading-relaxed">{rule.desc}</p>
                  </div>
                ))}
              </div>
            </div>
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
                  title: "Reduce Miss Pickup Rate",
                  desc: "Establish a scalable rule governance model to proactively surface operational risks before they result in missed pickups — shifting measurement from D+1 reactive to real-time preventive.",
                  color: "border-green-400 bg-green-50",
                  titleColor: "text-green-900",
                  numColor: "text-green-300",
                  num: "01",
                },
                {
                  title: "Real-Time Operations Visibility",
                  desc: "Give regional and office teams live visibility into ground operations, reducing reliance on manual escalations and next-day KPI reviews.",
                  color: "border-teal-400 bg-teal-50",
                  titleColor: "text-teal-900",
                  numColor: "text-teal-300",
                  num: "02",
                },
                {
                  title: "Consolidate Rule Logic",
                  desc: "Centralise all alert rules and trigger logic into Control Tower. The Pending Pickup Dashboard becomes a pure display layer — no more embedded rule logic in the dashboard.",
                  color: "border-blue-400 bg-blue-50",
                  titleColor: "text-blue-900",
                  numColor: "text-blue-300",
                  num: "03",
                },
                {
                  title: "Hub-Level Accountability",
                  desc: "Provide hub managers with ticket monitoring visibility so they can track issue resolution at scale and drive accountability within their teams.",
                  color: "border-indigo-400 bg-indigo-50",
                  titleColor: "text-indigo-900",
                  numColor: "text-indigo-300",
                  num: "04",
                },
              ].map(obj => (
                <div key={obj.num} className={`rounded-lg border-l-4 p-4 ${obj.color}`}>
                  <p className={`text-2xl font-black mb-1 ${obj.numColor}`}>{obj.num}</p>
                  <p className={`text-sm font-bold mb-2 ${obj.titleColor}`}>{obj.title}</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{obj.desc}</p>
                </div>
              ))}
            </div>

            {/* Success metrics */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">Success Metrics</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Metric</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">What it measures</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Case Action Rate", "Leading", "Whether surfaced cases are operationally actionable — cases acted on ÷ total cases created"],
                    ["Alert False Positive Rate", "Leading", "Cases auto-resolved without planner action ÷ total cases — key health metric for rule calibration"],
                    ["Missed Pickup Rate", "Lagging", "PUPs not picked up on ETA date ÷ total PUPs assigned — primary business outcome metric"],
                    ["Ticket Resolution Rate by Hub", "Lagging", "Cases resolved ÷ total cases assigned to hub — measures accountability loop closure"],
                  ].map(([metric, type, meaning]) => (
                    <tr key={metric} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800 align-top">{metric}</td>
                      <td className="px-4 py-3 align-top">
                        <span className={`font-semibold px-1.5 py-0.5 rounded text-xs ${type === "Leading" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{type}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 align-top leading-relaxed">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rollout */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Phase 1 Roll-out Markets</p>
              <div className="flex gap-2">
                {["PH", "TH", "ID"].map(market => (
                  <span key={market} className="bg-emerald-100 text-emerald-700 font-bold text-sm px-3 py-1.5 rounded">{market}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="h-6" />
      </div>

      <FloatingWhatsNew
        module="Control Tower — Summary & Introduction"
        showFrf
        frfUrl="https://docs.google.com/document/d/1u5YZL3ARhbqQ4XHweymz8uFctdf1Qy0Fq5uMmPwcbys/edit?tab=t.0"
        changes={[
          {
            title: "Background",
            description: "Explains the current gap: miss pickup prevention is fully manual, KPIs are D+1, and no early warning exists. Shows the shift from reactive to preventive operations.",
          },
          {
            title: "Feature",
            description: "Covers how the Control Tower works, its 3 modules (Rule Config, Case Management, Dashboard), Rule Config capabilities (noise controls, auto-resolution etc.), and Phase 1 pre-configured rules.",
          },
          {
            title: "Objective",
            description: "Four objectives with success metrics table and Phase 1 rollout markets (PH, TH, ID).",
          },
        ]}
      />
    </FMSLayout>
  );
}
