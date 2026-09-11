import { useState } from "react";
import { Plus, Search, Phone, Mail, ChevronRight, ArrowUpRight, TrendingUp, Users, Target } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { leads } from "../../data/mockData";

const pipeline = [
  { stage: "Discovery", color: "bg-slate-100 text-slate-700 border-slate-200", count: 4, value: 8200000 },
  { stage: "Qualified", color: "bg-violet-50 text-violet-700 border-violet-200", count: 3, value: 15600000 },
  { stage: "Proposal", color: "bg-blue-50 text-blue-700 border-blue-200", count: 5, value: 22400000 },
  { stage: "Negotiation", color: "bg-amber-50 text-amber-700 border-amber-200", count: 2, value: 12700000 },
  { stage: "Won", color: "bg-emerald-50 text-emerald-700 border-emerald-200", count: 7, value: 31500000 },
];

const tabs = ["Leads", "Contacts", "Companies", "Pipeline", "Activities"];

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>CRM</h2>
          <p className="text-sm text-slate-500 mt-0.5">Sales pipeline · March 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> New Lead
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Total Leads", value: "21", sub: "This quarter", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Target, label: "Pipeline Value", value: "LKR 90.4M", sub: "Weighted", color: "text-violet-600", bg: "bg-violet-50" },
          { icon: TrendingUp, label: "Won This Month", value: "LKR 14.2M", sub: "3 deals", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: ArrowUpRight, label: "Conversion Rate", value: "34%", sub: "↑ 5% vs last month", color: "text-amber-600", bg: "bg-amber-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color} mt-1`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
              </div>
              <div className={`${s.bg} p-2 rounded-lg`}>
                <s.icon size={16} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline visual */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-4" style={{ fontFamily: "var(--font-display)" }}>Sales Pipeline</h3>
        <div className="flex items-stretch gap-2">
          {pipeline.map((s, i) => (
            <div key={s.stage} className="flex-1 relative">
              <div className={`border ${s.color} rounded-xl p-3`}>
                <p className="text-xs font-semibold">{s.stage}</p>
                <p className="text-lg font-bold text-slate-900 mt-1" style={{ fontFamily: "var(--font-display)" }}>{s.count}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">LKR {(s.value/1000000).toFixed(1)}M</p>
                <div className="mt-2 h-1 bg-white/70 rounded-full">
                  <div className="h-full bg-current rounded-full opacity-40" style={{ width: `${Math.min(100, (s.count / 7) * 100)}%` }} />
                </div>
              </div>
              {i < pipeline.length - 1 && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leads table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex gap-1">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === i ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search leads..." className="pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-44" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Company</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Contact</th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Value</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Stage</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Owner</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Source</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leads.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-700">{l.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-600">{l.contact}</span></td>
                  <td className="px-3 py-3 text-right"><span className="text-sm font-semibold text-slate-800">LKR {(l.value/1000000).toFixed(1)}M</span></td>
                  <td className="px-3 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{l.stage}</span></td>
                  <td className="px-3 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={l.owner} size="xs" />
                      <span className="text-xs text-slate-600">{l.owner.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-500">{l.source}</span></td>
                  <td className="px-5 py-3"><span className="text-xs text-slate-500">{l.lastActivity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
