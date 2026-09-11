import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
}

export default function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "text-blue-600", iconBg = "bg-blue-50", subtitle }: Props) {
  const changeColor = changeType === "up" ? "text-emerald-600" : changeType === "down" ? "text-red-500" : "text-slate-500";
  const changePrefix = changeType === "up" ? "▲" : changeType === "down" ? "▼" : "";
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`${iconBg} ${iconColor} p-2.5 rounded-lg`}>
          <Icon size={20} />
        </div>
      </div>
      {change && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className={`text-xs font-medium ${changeColor}`}>{changePrefix} {change}</span>
          <span className="text-xs text-slate-400 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}
