import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "red" | "gold";
  trend?: { value: string; positive: boolean };
}) {
  const toneClasses: Record<string, string> = {
    blue: "bg-blue/15 text-blue-2",
    green: "bg-green/15 text-green",
    red: "bg-red/15 text-red",
    gold: "bg-gold/15 text-gold",
  };

  return (
    <div className="bg-bg-2 border border-border rounded-[20px] p-5 hover:border-border-2 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", toneClasses[tone])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn("flex items-center gap-1 text-xs font-semibold", trend.positive ? "text-green" : "text-red")}>
            {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="font-display text-2xl font-bold text-text mb-1">{value}</div>
      <div className="text-xs text-text-3">{label}</div>
    </div>
  );
}
