import { useState } from "react";
import { Zap, Plus, Play, Pause, AlertTriangle, CheckCircle2, Clock, Settings, ChevronRight } from "lucide-react";

interface Workflow {
  id: string; name: string; trigger: string; description: string;
  lastRun?: string; nextRun?: string; runs: number; failures: number;
  active: boolean; category: string;
}

const workflows: Workflow[] = [
  { id: "wf-1", name: "Invoice Overdue Escalation",     trigger: "Invoice overdue by 7 days",   description: "Sends email → creates notification → escalates to manager",          lastRun: "2 hours ago",  nextRun: "In 22 hours", runs: 142, failures: 2,  active: true,  category: "Finance" },
  { id: "wf-2", name: "Employee Offboarding",            trigger: "Employee status → Terminated", description: "Disables account → revokes integrations → creates asset return task",  lastRun: "3 days ago",   nextRun: "On event",    runs: 8,   failures: 0,  active: true,  category: "HR" },
  { id: "wf-3", name: "SSL Expiry Alert",                trigger: "SSL cert expiry ≤ 30 days",   description: "Creates alert → notifies DevOps team → escalates if not resolved",   lastRun: "1 hour ago",   nextRun: "In 23 hours", runs: 34,  failures: 1,  active: true,  category: "Infrastructure" },
  { id: "wf-4", name: "Leave Auto-Approval",             trigger: "Leave request submitted",      description: "Auto-approves leave <3 days if no conflict, otherwise escalates",     lastRun: "5 min ago",    nextRun: "On event",    runs: 287, failures: 3,  active: true,  category: "HR" },
  { id: "wf-5", name: "New Customer Welcome",            trigger: "Customer record created",      description: "Sends welcome email → creates onboarding task → notifies sales rep",  lastRun: "1 day ago",    nextRun: "On event",    runs: 56,  failures: 0,  active: true,  category: "CRM" },
  { id: "wf-6", name: "Domain Expiry Warning",           trigger: "Domain expiry ≤ 60 days",     description: "Sends notification → if <14 days creates critical alert",             lastRun: "6 hours ago",  nextRun: "In 18 hours", runs: 12,  failures: 0,  active: false, category: "Infrastructure" },
  { id: "wf-7", name: "Payroll Processing Reminder",     trigger: "Schedule: 25th of each month",description: "Notifies HR → creates payroll review task → escalates if not done",   lastRun: "16 days ago",  nextRun: "In 14 days",  runs: 24,  failures: 0,  active: true,  category: "Finance" },
];

const categoryColors: Record<string, string> = {
  Finance: "bg-emerald-50 text-emerald-700",
  HR: "bg-blue-50 text-blue-700",
  Infrastructure: "bg-amber-50 text-amber-700",
  CRM: "bg-violet-50 text-violet-700",
};

const nodeTypes = [
  { type: "Trigger",      color: "bg-violet-100 text-violet-700 border-violet-300", icon: "⚡" },
  { type: "Condition",    color: "bg-amber-100 text-amber-700 border-amber-300",    icon: "?" },
  { type: "Action",       color: "bg-blue-100 text-blue-700 border-blue-300",       icon: "▶" },
  { type: "Notification", color: "bg-emerald-100 text-emerald-700 border-emerald-300", icon: "🔔" },
  { type: "Delay",        color: "bg-slate-100 text-slate-600 border-slate-300",    icon: "⏱" },
];

export default function AutomationPage() {
  const [actives, setActives] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState("All");

  function toggleActive(id: string, current: boolean) {
    setActives(s => ({ ...s, [id]: !current }));
  }

  const categories = ["All", ...Array.from(new Set(workflows.map(w => w.category)))];
  const filtered = filter === "All" ? workflows : workflows.filter(w => w.category === filter);
  const activeCount = workflows.filter(w => actives[w.id] ?? w.active).length;
  const totalRuns = workflows.reduce((a, w) => a + w.runs, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Automation</h2>
          <p className="text-sm text-slate-500 mt-0.5">{activeCount} active workflows · {totalRuns.toLocaleString()} total runs</p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-colors">
          <Plus size={14} /> New Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Active",       value: activeCount,   color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Paused",       value: workflows.length - activeCount, color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200" },
          { label: "Runs (30d)",   value: totalRuns,     color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
          { label: "Failures",     value: workflows.reduce((a,w) => a + w.failures, 0), color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-4`}>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-2xl font-black ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === c ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 border border-slate-200"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Workflow list */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-50">
        {filtered.map(wf => {
          const isActive = actives[wf.id] ?? wf.active;
          return (
            <div key={wf.id} className="flex items-start justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0 ${isActive ? "bg-blue-100" : "bg-slate-100"}`}>
                  <Zap size={14} className={isActive ? "text-blue-600" : "text-slate-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">{wf.name}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${categoryColors[wf.category] ?? "bg-slate-100 text-slate-500"}`}>{wf.category}</span>
                    {!isActive && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">Paused</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{wf.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-slate-400">Trigger: <span className="text-slate-600 font-medium">{wf.trigger}</span></span>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400">{wf.runs} runs</span>
                    {wf.failures > 0 && <span className="text-[10px] text-red-500 font-medium">{wf.failures} failures</span>}
                    {wf.lastRun && <span className="text-[10px] text-slate-400">Last: {wf.lastRun}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Settings"><Settings size={13} className="text-slate-400" /></button>
                <button
                  onClick={() => toggleActive(wf.id, isActive)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    isActive ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {isActive ? <><Pause size={11} /> Pause</> : <><Play size={11} /> Resume</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow builder modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setCreating(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <p className="font-semibold text-slate-800">New Workflow</p>
              <button onClick={() => setCreating(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Workflow Name</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g., Invoice Overdue Alert" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                    {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Workflow Builder</p>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                  <div className="flex justify-center gap-3 mb-4 flex-wrap">
                    {nodeTypes.map(n => (
                      <div key={n.type} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer hover:opacity-80 ${n.color}`}>
                        <span>{n.icon}</span>{n.type}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">Drag nodes onto the canvas to build your workflow</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setCreating(false)} className="px-4 py-2 text-sm border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors">Cancel</button>
                <button onClick={() => setCreating(false)} className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors">Create Workflow</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
