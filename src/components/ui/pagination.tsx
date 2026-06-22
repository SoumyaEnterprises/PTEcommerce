"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
      <span className="text-xs text-text-3">
        Showing {rangeStart}–{rangeEnd} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg border border-border bg-glass flex items-center justify-center text-text-2 disabled:opacity-40 hover:border-border-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {start > 1 && <span className="text-text-3 text-xs px-1">…</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "w-8 h-8 rounded-lg text-xs font-semibold transition-colors",
              p === page ? "bg-blue text-white" : "border border-border bg-glass text-text-2 hover:border-border-2"
            )}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="text-text-3 text-xs px-1">…</span>}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg border border-border bg-glass flex items-center justify-center text-text-2 disabled:opacity-40 hover:border-border-2 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
