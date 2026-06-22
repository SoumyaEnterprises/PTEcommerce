"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TagsInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim().toLowerCase();
    if (value && !tags.includes(value)) onChange([...tags, value]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-wrap items-center gap-2 bg-glass-2 border border-border rounded-[10px] px-3 py-2.5 min-h-[44px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 bg-blue/15 text-blue-2 text-xs font-medium px-2.5 py-1 rounded-full border border-blue/30"
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Backspace" && !draft && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
          }
        }}
        onBlur={commit}
        placeholder={tags.length === 0 ? "Type a tag and press Enter..." : ""}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-text placeholder:text-text-3"
      />
    </div>
  );
}
