"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <span
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className={cn(
          "w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center transition-colors flex-shrink-0",
          checked ? "bg-blue border-blue" : "border-border-2 bg-transparent"
        )}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      {label && <span className="text-sm text-text-2">{label}</span>}
    </label>
  );
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-11 h-6 rounded-full relative transition-colors flex-shrink-0",
        checked ? "bg-blue" : "bg-glass-2 border border-border"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
