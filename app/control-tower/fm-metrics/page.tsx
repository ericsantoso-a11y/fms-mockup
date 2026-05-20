import FMSLayout from "@/components/FMSLayout";

const METRICS = [
  {
    ruleName: "Miss-Assignment",
    associatedRisk: "Planner forget to assign PUPs",
    logic: [
      "PUP with pending order > 0 with ETA = Today or Backlog, and not assigned by XX:YY time",
    ],
    nextSteps: ["Assign PUP to driver"],
  },
  {
    ruleName: "No Movement from driver",
    associatedRisk: "Planner assign PUPs to not working driver, driver MIA",
    logic: [
      "Driver does not have status update for Z minutes",
      "Status update = No PT with status Pickup No Order, Pickup Done, or Partial Pickup",
    ],
    nextSteps: [
      "Check with Driver",
      "Re-assign PUPs to other active driver",
    ],
  },
  {
    ruleName: "Dispatch Backup Driver",
    associatedRisk: "Driver at risk of not completing all the task",
    logic: [
      "Driver PUP completion < Z% by XX:YY",
      "Completion = PUP with status Pickup No Order, Pickup Done, or Partial Pickup",
    ],
    nextSteps: ["Re-assign to backup driver"],
  },
];

export default function FmMetricsPage() {
  return (
    <FMSLayout breadcrumbs={[{ label: "Metrics" }, { label: "FM Control Tower Metrics" }]}>
      <div className="mb-5">
        <h1 className="text-lg font-bold text-gray-900">FM Control Tower Metrics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitoring rules aligned with Reg Ops — defines the risk conditions and planned actions for each scenario.
        </p>
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#cfe2f3" }}>
              <th className="px-5 py-3 text-left font-semibold text-gray-900 border border-gray-300 w-48">Rule Name</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-900 border border-gray-300 w-56">Associated Risk</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-900 border border-gray-300">Logic</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-900 border border-gray-300 w-64">Next Step Action (Planned)</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map((row, i) => (
              <tr key={i} className="align-top">
                <td className="px-5 py-4 border border-gray-300 text-gray-900">{row.ruleName}</td>
                <td className="px-5 py-4 border border-gray-300 text-gray-700">{row.associatedRisk}</td>
                <td className="px-5 py-4 border border-gray-300 text-gray-700">
                  {row.logic.map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-3" : ""}>{line}</p>
                  ))}
                </td>
                <td className="px-5 py-4 border border-gray-300 text-gray-700">
                  <ul className="space-y-1">
                    {row.nextSteps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FMSLayout>
  );
}
