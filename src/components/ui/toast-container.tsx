"use client";

import { useToastStore } from "@/store/toast-store";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

const variantConfig = {
  success: { icon: CheckCircle2, color: "text-green", border: "border-green/30" },
  error: { icon: XCircle, color: "text-red", border: "border-red/30" },
  info: { icon: Info, color: "text-blue-2", border: "border-blue/30" },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-[340px] max-w-[90vw]">
      {toasts.map((t) => {
        const cfg = variantConfig[t.variant];
        const Icon = cfg.icon;
        return (
          <div
            key={t.id}
            className={cn(
              "animate-fadeUp bg-bg-2 border rounded-xl p-4 flex gap-3 items-start shadow-2xl backdrop-blur-xl",
              cfg.border
            )}
          >
            <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", cfg.color)} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text">{t.title}</div>
              {t.description && <div className="text-xs text-text-2 mt-0.5">{t.description}</div>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-text-3 hover:text-text transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
