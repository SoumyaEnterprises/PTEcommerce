"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SpecRow {
  key: string;
  value: string;
}

export function SpecificationsEditor({
  specs,
  onChange,
}: {
  specs: SpecRow[];
  onChange: (specs: SpecRow[]) => void;
}) {
  function update(index: number, field: "key" | "value", value: string) {
    const next = [...specs];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  }

  function addRow() {
    onChange([...specs, { key: "", value: "" }]);
  }

  function removeRow(index: number) {
    onChange(specs.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2.5">
      {specs.map((spec, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={spec.key}
            onChange={(e) => update(i, "key", e.target.value)}
            placeholder="e.g. Interface"
            className="flex-1"
          />
          <Input
            value={spec.value}
            onChange={(e) => update(i, "value", e.target.value)}
            placeholder="e.g. PCIe 5.0 NVMe"
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="w-9 h-9 flex-shrink-0 rounded-lg bg-glass-2 border border-border flex items-center justify-center text-text-3 hover:text-red hover:border-red/30 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-xs font-semibold text-blue-2 hover:text-blue-3 transition-colors self-start mt-1"
      >
        <Plus className="w-3.5 h-3.5" /> Add specification
      </button>
    </div>
  );
}
