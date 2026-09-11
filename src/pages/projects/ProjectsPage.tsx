import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Calendar, Users, DollarSign, ChevronRight, Briefcase, GitBranch, Clock } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { projects } from "../../data/mockData";

const tabs = ["All", "In Progress", "Planning", "On Hold", "Completed"];

export default function ProjectsPage() {
  const [tab, setTab] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    const statuses = [null, "in-progress", "planning", "on-hold", "completed"];
    const matchTab = !statuses[tab] || p.status === statuses[tab];
    return matchSearch && matchTab;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Projects</h2>
          <p className="text-sm text-slate-500 mt-0.5">{projects.length} total · {projects.filter(p => p.status === "in-progress").length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Active", value: projects.filter(p => p.status === "in-progress").length, color: "text-blue-600" },
          { label: "Budget (Active)", value: `LKR ${(projects.filter(p => p.status === "in-progress").reduce((a, p) => a + p.budget, 0) / 1000000).toFixed(1)}M`, color: "text-slate-800" },
          { label: "Team Members", value: projects.reduce((a, p) => a + p.team, 0), color: "text-slate-800" },
          { label: "Overdue Tasks", value: "7", color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === i ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-7 pr-3 py-2 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
          <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setView("grid")} className={`px-2.5 py-2 ${view === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"}`}>⊞</button>
            <button onClick={() => setView("list")} className={`px-2.5 py-2 ${view === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"}`}>☰</button>
          </div>
        </div>
      </div>

      {/* Project cards */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.priority} size="sm" />
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-lg transition-all"><MoreHorizontal size={14} className="text-slate-400" /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.client}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">{p.type}</span>
                  <StatusBadge status={p.status} size="sm" />
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-slate-700">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${p.progress >= 100 ? "bg-emerald-500" : p.progress > 70 ? "bg-blue-500" : "bg-violet-500"}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">Team</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{p.team} members</p>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <p className="text-[10px] text-slate-400">Budget</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">LKR {(p.budget/1000000).toFixed(1)}M</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">Deadline</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{p.endDate.slice(5)}</p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-slate-50 rounded-b-xl border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Avatar name={p.manager} size="xs" />
                  <span className="text-xs text-slate-500">{p.manager}</span>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">View <ChevronRight size={11} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Project</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Client</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Manager</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Priority</th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Progress</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{p.id}</p>
                  </td>
                  <td className="px-3 py-3"><span className="text-sm text-slate-600">{p.client}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={p.manager} size="xs" />
                      <span className="text-xs text-slate-600">{p.manager}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-3"><StatusBadge status={p.priority} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-8 text-right">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="text-xs text-slate-500">{p.endDate}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
