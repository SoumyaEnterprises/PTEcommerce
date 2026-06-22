import type { ActivityLogEntry } from "@/types";
import { timeAgo } from "@/lib/format";
import { PackagePlus, PackageCheck, Trash2, AlertTriangle, LogIn } from "lucide-react";

const iconMap = {
  product_created: { icon: PackagePlus, tone: "text-green bg-green/15" },
  product_updated: { icon: PackageCheck, tone: "text-blue-2 bg-blue/15" },
  product_deleted: { icon: Trash2, tone: "text-red bg-red/15" },
  stock_alert: { icon: AlertTriangle, tone: "text-gold bg-gold/15" },
  login: { icon: LogIn, tone: "text-text-2 bg-glass-2" },
};

export function ActivityFeed({ entries }: { entries: ActivityLogEntry[] }) {
  if (entries.length === 0) {
    return <div className="text-sm text-text-3 text-center py-10">No recent activity yet.</div>;
  }

  return (
    <div className="flex flex-col">
      {entries.map((entry, i) => {
        const cfg = iconMap[entry.type];
        const Icon = cfg.icon;
        return (
          <div key={entry.id} className={`flex gap-3 py-3 ${i !== entries.length - 1 ? "border-b border-border" : ""}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.tone}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-text">{entry.message}</div>
              <div className="text-xs text-text-3 mt-0.5">{timeAgo(entry.timestamp)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
