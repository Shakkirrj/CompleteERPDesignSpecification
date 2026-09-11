import { useState } from "react";
import { ArrowLeft, Briefcase, Calendar, DollarSign, Users, CheckSquare, Clock, FileText, Activity, Edit2, Save, X, Plus, ChevronRight } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { projects } from "../../data/mockData";

const projectTasks: Record<string, { id: string; title: string; assignee: string; priority: string; status: string; due: string; }[]> = {
  PRJ001: [
    { id: "T01", title: "Redesign product listing page", assignee: "Nishani Silva", priority: "high", status: "in-progress", due: "2025-04-01" },
    { id: "T02", title: "Implement cart & checkout flow", assignee: "Kavinda Perera", priority: "critical", status: "todo", due: "2025-04-15" },
    { id: "T03", title: "Payment gateway integration", assignee: "Kavinda Perera", priority: "critical", status: "todo", due: "2025-04-30" },
    { id: "T04", title: "Mobile responsive QA", assignee: "Nishani Silva", priority: "medium", status: "todo", due: "2025-05-10" },
    { id: "T05", title: "Performance audit & CDN setup", assignee: "Sameera Bandara", priority: "medium", status: "done", due: "2025-03-20" },
  ],
  PRJ002: [
    { id: "T06", title: "Database schema migration", assignee: "Sameera Bandara", priority: "critical", status: "done", due: "2025-03-10" },
    { id: "T07", title: "Fix connection pooling bug", assignee: "Sameera Bandara", priority: "critical", status: "in-progress", due: "2025-03-15" },
    { id: "T08", title: "Write API documentation", assignee: "Kavinda Perera", priority: "low", status: "todo", due: "2025-03-25" },
    { id: "T09", title: "User acceptance testing", assignee: "Nishani Silva", priority: "high", status: "todo", due: "2025-04-05" },
  ],
  PRJ006: [
    { id: "T10", title: "Network vulnerability scan", assignee: "Sameera Bandara", priority: "critical", status: "done", due: "2025-02-20" },
    { id: "T11", title: "Penetration testing", assignee: "Sameera Bandara", priority: "critical", status: "in-progress", due: "2025-03-12" },
    { id: "T12", title: "Compliance report draft", assignee: "Kavinda Perera", priority: "high", status: "todo", due: "2025-03-25" },
  ],
};

const activityLog = [
  { id: 1, user: "Dilshan Fernando", action: "Updated project timeline", time: "2025-03-11 14:32", type: "update" },
  { id: 2, user: "Kavinda Perera", action: "Completed task: Performance audit", time: "2025-03-10 09:15", type: "complete" },
  { id: 3, user: "Nishani Silva", action: "Added comment on design review", time: "2025-03-09 16:45", type: "comment" },
  { id: 4, user: "Dilshan Fernando", action: "Uploaded project spec v2.1", time: "2025-03-08 11:20", type: "upload" },
  { id: 5, user: "Sameera Bandara", action: "Flagged blocker: CDN config issue", time: "2025-03-07 08:55", type: "flag" },
];

const documents = [
  { name: "Project Specification v2.1.pdf", size: "1.4 MB", date: "2025-03-08", type: "pdf" },
  { name: "UI Mockups - Phase 2.fig", size: "8.2 MB", date: "2025-03-05", type: "fig" },
  { name: "Budget Breakdown.xlsx", size: "240 KB", date: "2025-02-28", type: "xlsx" },
  { name: "Client Sign-off Letter.pdf", size: "320 KB", date: "2025-02-20", type: "pdf" },
];

const teamMembers = [
  { name: "Dilshan Fernando", role: "Project Manager", avatar: "DF" },
  { name: "Kavinda Perera", role: "Lead Developer", avatar: "KP" },
  { name: "Nishani Silva", role: "UI/UX Designer", avatar: "NS" },
  { name: "Sameera Bandara", role: "DevOps Engineer", avatar: "SB" },
  { name: "Tharaka Ranatunga", role: "QA Engineer", avatar: "TR" },
  { name: "Ishara Madushani", role: "Business Analyst", avatar: "IM" },
];

interface Props {
  projectId: string;
  onBack: () => void;
}

const tabs = ["Overview", "Tasks", "Team", "Documents", "Activity"];

export default function ProjectDetailPage({ projectId, onBack }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const project = projects.find(p => p.id === projectId) ?? projects[0];
  const tasks = projectTasks[project.id] ?? projectTasks["PRJ001"];

  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState("Key deliverables defined and client expectations set. Phase 1 design handoff completed. Backend API development in progress. Next milestone: UAT sign-off by client.");
  const [editNotes, setEditNotes] = useState(notes);

  const budgetPct = Math.round((project.spent / project.budget) * 100);
  const doneCount = tasks.filter(t => t.status === "done").length;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={16} />
        </button>
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Briefcase size={18} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 truncate" style={{ fontFamily: "var(--font-display)" }}>{project.name}</h2>
            <StatusBadge status={project.status} />
            <StatusBadge status={project.priority} size="sm" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{project.client} · {project.type} · {project.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{project.progress}% complete</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 py-2 bg-white border-b border-slate-100 flex-shrink-0">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === i ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Overview */}
        {activeTab === 0 && (
          <div className="space-y-5">
            {/* Key metrics */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Budget", value: `LKR ${(project.budget/1000000).toFixed(1)}M`, sub: `${budgetPct}% spent`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Spent", value: `LKR ${(project.spent/1000000).toFixed(1)}M`, sub: `LKR ${((project.budget-project.spent)/1000000).toFixed(1)}M remaining`, icon: DollarSign, color: budgetPct > 90 ? "text-red-600" : "text-emerald-600", bg: budgetPct > 90 ? "bg-red-50" : "bg-emerald-50" },
                { label: "Team Size", value: `${project.team} members`, sub: "Across all roles", icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
                { label: "Tasks", value: `${doneCount}/${tasks.length}`, sub: "Completed", icon: CheckSquare, color: "text-amber-600", bg: "bg-amber-50" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{s.label}</p>
                      <p className={`text-lg font-bold ${s.color} mt-1`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
                    </div>
                    <div className={`${s.bg} p-2 rounded-lg`}>
                      <s.icon size={15} className={s.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Progress & dates */}
              <div className="col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Project Progress</h3>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Overall Progress</span>
                    <span className="text-sm font-bold text-slate-700">{project.progress}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${project.progress >= 100 ? "bg-emerald-500" : project.progress > 70 ? "bg-blue-500" : "bg-violet-500"}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Budget Utilisation</span>
                    <span className={`text-sm font-bold ${budgetPct > 90 ? "text-red-600" : "text-slate-700"}`}>{budgetPct}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${budgetPct > 90 ? "bg-red-500" : budgetPct > 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${budgetPct}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400">Start Date</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">End Date</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{project.endDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Manager</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Avatar name={project.manager} size="xs" />
                      <p className="text-xs font-semibold text-slate-700">{project.manager.split(" ")[0]}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="col-span-5 bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Project Notes</h3>
                  {!editing ? (
                    <button onClick={() => { setEditing(true); setEditNotes(notes); }} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                      <Edit2 size={13} />
                    </button>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => { setNotes(editNotes); setEditing(false); }} className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"><Save size={13} /></button>
                      <button onClick={() => setEditing(false)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors"><X size={13} /></button>
                    </div>
                  )}
                </div>
                {!editing ? (
                  <p className="text-xs text-slate-600 leading-relaxed">{notes}</p>
                ) : (
                  <textarea
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    className="w-full h-32 text-xs text-slate-700 border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tasks */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{tasks.length} tasks · {doneCount} done</p>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus size={13} /> Add Task
              </button>
            </div>
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-sm transition-all">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${t.status === "done" ? "bg-emerald-500" : t.status === "in-progress" ? "bg-blue-500" : "bg-slate-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${t.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>{t.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={t.priority} size="sm" />
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Calendar size={9} />{t.due}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar name={t.assignee} size="xs" />
                    <span className="text-xs text-slate-500">{t.assignee.split(" ")[0]}</span>
                    <StatusBadge status={t.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{project.team} team members</p>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus size={13} /> Add Member
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {teamMembers.slice(0, project.team).map(m => (
                <div key={m.name} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                  <Avatar name={m.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTab === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{documents.length} documents</p>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus size={13} /> Upload
              </button>
            </div>
            {documents.map(d => (
              <div key={d.name} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-sm transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{d.name}</p>
                  <p className="text-xs text-slate-400">{d.size} · {d.date}</p>
                </div>
                <button className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity hover:underline">Download</button>
              </div>
            ))}
          </div>
        )}

        {/* Activity */}
        {activeTab === 4 && (
          <div className="space-y-3">
            {activityLog.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
                <Avatar name={a.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800"><span className="font-semibold">{a.user}</span> {a.action}</p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Clock size={10} />{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
