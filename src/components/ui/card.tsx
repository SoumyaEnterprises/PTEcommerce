import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-bg-2 border border-border rounded-[20px]", className)}>{children}</div>
  );
}

export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-white/[0.03] backdrop-blur-xl border border-border rounded-[20px]", className)}>
      {children}
    </div>
  );
}

type BadgeTone = "blue" | "gold" | "red" | "green" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  blue: "bg-blue/15 text-blue-2 border-blue/30",
  gold: "bg-gold/15 text-gold border-gold/30",
  red: "bg-red/15 text-red border-red/30",
  green: "bg-green/15 text-green border-green/30",
  neutral: "bg-glass-2 text-text-2 border-border",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = "green" }: { tone?: "green" | "gold" | "red" }) {
  const colorMap = { green: "bg-green", gold: "bg-gold", red: "bg-red" };
  return <span className={cn("w-1.5 h-1.5 rounded-full", colorMap[tone])} />;
}
