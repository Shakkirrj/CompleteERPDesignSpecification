import { useState } from "react";
import { Plus, Search, CheckSquare, Clock, AlertCircle, LayoutGrid, List, MoreHorizontal } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { tasks } from "../../data/mockData";

const tabs = ["My Tasks", "Team Tasks", "All Tasks"];
const statuses = ["All", "To Do", "In Progress", "Done"];

export default function TasksPage() {
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === "All" || t.status.replace("-", " ") === statusFilter.toLowerCase();
    return matchStatus;
  });

  const grouped = {
    todo: tasks.filter(t => t.status === "todo"),
    "in-progress": tasks.filter(t => t.status === "in-progress"),
    done: tasks.filter(t => t.status === "done"),
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Tasks</h2>
          <p className="text-sm text-slate-500 mt-0.5">{tasks.length} tasks · 3 overdue</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "To Do", value: tasks.filter(t => t.status === "todo").length, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "In Progress", value: tasks.filter(t => t.status === "in-progress").length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Done", value: tasks.filter(t => t.status === "done").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Critical", value: tasks.filter(t => t.priority === "critical").length, color: "text-red-600", bg: "bg-red-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border border-slate-200 px-4 py-3`}>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === i ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {statuses.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 border border-slate-200"}`}>{s}</button>
            ))}
          </div>
          <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("list")} className={`px-2.5 py-2 text-xs ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"}`}><List size={14} /></button>
            <button onClick={() => setViewMode("board")} className={`px-2.5 py-2 text-xs ${viewMode === "board" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"}`}><LayoutGrid size={14} /></button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="pl-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide w-8"></th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Task</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Project</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Assignee</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Priority</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Due Date</th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Est.</th>
                <th className="pr-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="pl-5 py-3">
                    <input type="checkbox" checked={t.status === "done"} readOnly className="rounded border-slate-300" />
                  </td>
                  <td className="px-3 py-3">
                    <p className={`text-sm font-medium ${t.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>{t.title}</p>
                    <p className="text-[10px] font-mono text-slate-400">{t.id}</p>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-500">{t.project}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={t.assignee} size="xs" />
                      <span className="text-xs text-slate-600">{t.assignee.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={t.priority} size="sm" /></td>
                  <td className="px-3 py-3"><StatusBadge status={t.status} size="sm" /></td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${new Date(t.due) < new Date() && t.status !== "done" ? "text-red-600 font-semibold" : "text-slate-500"}`}>{t.due}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-xs font-mono text-slate-500">{t.estimate}h</span>
                  </td>
                  <td className="pr-5 py-3">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={13} className="text-slate-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(grouped) as [string, typeof tasks][]).map(([status, items]) => {
            const labels: Record<string, string> = { todo: "To Do", "in-progress": "In Progress", done: "Done" };
            const colors: Record<string, string> = { todo: "border-slate-300 bg-slate-50", "in-progress": "border-blue-300 bg-blue-50", done: "border-emerald-300 bg-emerald-50" };
            return (
              <div key={status} className={`rounded-xl border-2 ${colors[status]} p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">{labels[status]}</span>
                  <span className="text-xs bg-white/70 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map(t => (
                    <div key={t.id} className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{t.title}</p>
                        <StatusBadge status={t.priority} size="sm" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5">{t.project}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Avatar name={t.assignee} size="xs" />
                          <span className="text-[10px] text-slate-500">{t.assignee.split(" ")[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock size={10} />{t.due}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-2 w-full py-2 text-xs text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Plus size={12} /> Add task
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
