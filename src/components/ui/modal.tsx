"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className={`relative bg-bg-2 border border-border rounded-[20px] w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-fadeUp`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-bg-2">
          <h3 className="text-base font-bold text-text">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-glass-2 border border-border flex items-center justify-center text-text-2 hover:text-text transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
