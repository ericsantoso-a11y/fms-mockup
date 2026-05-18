"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import FMSLayout from "@/components/FMSLayout";
import { mockPickupGroups } from "@/lib/mockData";

export default function ViewPickupGroupPage() {
  const { id } = useParams();
  const group = mockPickupGroups.find((g) => g.id === Number(id));

  if (!group) {
    return (
      <FMSLayout breadcrumbs={[{ label: "Workforce Management" }, { label: "Pickup Group", href: "/pickup-group/list" }, { label: "Not Found" }]}>
        <div className="text-gray-500">Pickup Group not found.</div>
      </FMSLayout>
    );
  }

  return (
    <FMSLayout
      breadcrumbs={[
        { label: "Workforce Management" },
        { label: "Pickup Group", href: "/pickup-group/list" },
        { label: group.name },
      ]}
    >
      <div className="max-w-2xl">
        <div className="bg-white rounded border border-gray-200 p-8 space-y-5">
          <Field label="Pickup Group ID" value={String(group.id)} />
          <Field label="Pickup Group Name" value={group.name} />
          <Field label="Group Lead" value={`[${group.groupLeadId}] ${group.groupLead}`} />
          <Field
            label="Group Members"
            value={group.groupMembers.length === 0 ? "-" : group.groupMembers.map((m) => `[${m.id}] ${m.name}`).join(", ")}
          />
          <Field label="Description" value={group.description} />
          <Field label="Number of Drivers" value={String(group.groupMembers.length + 1)} />
        </div>
        <div className="flex justify-end mt-4 gap-3">
          <Link href="/pickup-group/list" className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded text-sm transition-colors">Back</Link>
          <Link href={`/pickup-group/${group.id}/edit`} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors">Edit</Link>
        </div>
      </div>
    </FMSLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-44 text-sm text-gray-500 text-right flex-shrink-0 pt-0.5">{label}</span>
      <span className="flex-1 text-sm text-gray-800">{value}</span>
    </div>
  );
}
