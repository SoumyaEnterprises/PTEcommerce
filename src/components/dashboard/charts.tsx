"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueTrend = [
  { month: "Jan", revenue: 182 },
  { month: "Feb", revenue: 201 },
  { month: "Mar", revenue: 194 },
  { month: "Apr", revenue: 238 },
  { month: "May", revenue: 256 },
  { month: "Jun", revenue: 291 },
];

interface TooltipPayloadItem {
  value: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-2 border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-text-3 mb-0.5">{label}</div>
      <div className="text-text font-semibold">Rp {payload[0].value}M</div>
    </div>
  );
}

export function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={revenueTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={2.5} fill="url(#revGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const STOCK_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export function StockDistributionChart({
  inStock,
  lowStock,
  outOfStock,
}: {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}) {
  const data = [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: lowStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={3} strokeWidth={0}>
            {data.map((_, i) => (
              <Cell key={i} fill={STOCK_COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2.5">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: STOCK_COLORS[i] }} />
            <span className="text-text-2">{d.name}</span>
            <span className="text-text font-semibold ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
