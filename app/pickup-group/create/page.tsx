"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FMSLayout from "@/components/FMSLayout";
import MultiSelect from "@/components/MultiSelect";
import { mockDriverOptions } from "@/lib/mockData";

export default function CreatePickupGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [leadId, setLeadId] = useState("");
  const [memberIds, setMemberIds] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Pickup Group Name is required";
    if (name.length > 64) newErrors.name = "Maximum 64 characters";
    if (!leadId) newErrors.lead = "Group Lead is required";
    if (description.length > 500) newErrors.description = "Maximum 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      sessionStorage.setItem("pickup_created", "1");
      router.push("/pickup-group/list");
    }, 600);
  };

  return (
    <FMSLayout
      breadcrumbs={[
        { label: "Workforce Management" },
        { label: "Pickup Group", href: "/pickup-group/list" },
        { label: "Create Pickup Group" },
      ]}
    >
      <div className="max-w-2xl">
        <div className="bg-white rounded border border-gray-200 p-8 space-y-6">
          {/* Pickup Group Name */}
          <div className="flex items-start gap-4">
            <label className="w-44 text-sm text-gray-700 pt-2 text-right flex-shrink-0">
              <span className="text-red-500 mr-1">*</span>Pickup Group Name
            </label>
            <div className="flex-1">
              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={64}
                  placeholder="Please Input"
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400 pr-16 ${errors.name ? "border-red-400" : "border-gray-300"}`}
                />
                <span className="absolute right-3 top-2 text-xs text-gray-400">{name.length} / 64</span>
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Group Lead */}
          <div className="flex items-start gap-4">
            <label className="w-44 text-sm text-gray-700 pt-2 text-right flex-shrink-0">
              <span className="text-red-500 mr-1">*</span>Group Lead
              <span className="ml-1 text-gray-400 cursor-help" title="The main driver who leads this Pickup Group">ⓘ</span>
            </label>
            <div className="flex-1">
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400 bg-white ${errors.lead ? "border-red-400" : "border-gray-300"}`}
              >
                <option value="">Please Select</option>
                {mockDriverOptions.map((d) => (
                  <option key={d.id} value={d.id}>[{d.id}] {d.name}</option>
                ))}
              </select>
              {errors.lead && <p className="text-red-500 text-xs mt-1">{errors.lead}</p>}
            </div>
          </div>

          {/* Group Member */}
          <div className="flex items-start gap-4">
            <label className="w-44 text-sm text-gray-700 pt-2 text-right flex-shrink-0">
              Group Member
              <span className="ml-1 text-gray-400 cursor-help" title="Select one or more sub drivers">ⓘ</span>
            </label>
            <div className="flex-1">
              <MultiSelect
                options={mockDriverOptions}
                selected={memberIds}
                onChange={setMemberIds}
                placeholder="Please Select Sub Drivers"
                excludeIds={leadId ? [Number(leadId)] : []}
              />
              <p className="text-xs text-gray-400 mt-1">{memberIds.length} driver(s) selected</p>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-4">
            <label className="w-44 text-sm text-gray-700 pt-2 text-right flex-shrink-0">Description</label>
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  placeholder="Please Input"
                  rows={4}
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-y ${errors.description ? "border-red-400" : "border-gray-300"}`}
                />
                <span className="absolute right-3 bottom-3 text-xs text-gray-400">{description.length} / 500</span>
              </div>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <button onClick={() => router.push("/pickup-group/list")} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded text-sm transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </FMSLayout>
  );
}
