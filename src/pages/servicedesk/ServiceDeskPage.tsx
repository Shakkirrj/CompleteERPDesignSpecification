import { useState } from "react";
import { Plus, Search, AlertTriangle, Clock, CheckCircle, RefreshCw, X, MessageSquare, User, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { tickets } from "../../data/mockData";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";

// ─── Data ────────────────────────────────────────────────────────────────────
const moreTickets = [
  { id: "TKT-1019", title: "Email server certificates expired",    client: "MernCrest Internal", priority: "critical", status: "in-progress", assignee: "Sameera Bandara", created: "2026-09-08", sla: "1h",  project: "Infrastructure",            description: "SSL certificates for mail.merncrest.lk have expired causing email delivery failures across all users.", resolution: "" },
  { id: "TKT-1018", title: "Users cannot access project portal",   client: "People's Finance",   priority: "high",     status: "open",        assignee: "",               created: "2026-09-07", sla: "4h",  project: "Mobile Banking App",         description: "Client reports that all 45 project portal users are getting 403 Forbidden since this morning.", resolution: "" },
  { id: "TKT-1017", title: "Payslip download button not working",  client: "Lanka Retail PLC",   priority: "medium",   status: "resolved",    assignee: "Nishani Silva",  created: "2026-09-07", sla: "8h",  project: "E-Commerce Platform",       description: "Employee payslip PDF download endpoint returning 500 error in production.", resolution: "Fixed — updated the PDF generation service dependency to v2.3.1." },
];

const baseTickets = tickets.map((t: Record<string, string>) => ({ ...t, description: "Client-reported issue requiring investigation and resolution.", resolution: "" }));

type Ticket = { id: string; title: string; client: string; priority: string; status: string; assignee: string; created: string; sla: string; project: string; description: string; resolution: string };

const allBase: Ticket[] = [...baseTickets, ...moreTickets] as Ticket[];

const STATUSES = ["All", "Open", "In Progress", "Waiting", "Resolved", "Closed"];
const PRIORITIES = ["All Priorities", "Critical", "High", "Medium", "Low"];
const TICKET_STATUSES = ["open", "in-progress", "waiting", "resolved", "closed"];
const PRIORITIES_OPT = ["critical", "high", "medium", "low"];
const ENGINEERS = ["Sameera Bandara", "Kavinda Perera", "Nishani Silva", "Tharaka Ranatunga", "Dilshan Fernando", "Amali De Silva"];
const CLIENTS = ["MernCrest Internal", "Lanka Retail PLC", "Sampath Bank", "People's Finance", "Ceylon Bank", "Hayleys Group", "Dialog Axiata"];

const priorityColors: Record<string, string> = {
  critical: "text-red-700 bg-red-50 border-red-200",
  high:     "text-orange-700 bg-orange-50 border-orange-200",
  medium:   "text-amber-700 bg-amber-50 border-amber-200",
  low:      "text-slate-600 bg-slate-50 border-slate-200",
};

// ─── New Ticket Modal ────────────────────────────────────────────────────────
function NewTicketModal({ onClose, onSave }: { onClose: () => void; onSave: (t: Ticket) => void }) {
  const [form, setForm] = useState({ title: "", client: CLIENTS[0], project: "", priority: "medium", description: "", sla: "8h" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const slaMap: Record<string, string> = { critical: "1h", high: "4h", medium: "8h", low: "24h" };
    const id = `TKT-${Math.floor(1020 + Math.random() * 980)}`;
    onSave({ id, title: form.title.trim(), client: form.client, project: form.project.trim() || "General", priority: form.priority, status: "open", assignee: "", created: new Date().toISOString().split("T")[0], sla: slaMap[form.priority], description: form.description.trim(), resolution: "" });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>New Ticket</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Title / Issue *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Brief description of the issue"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? "border-red-400" : "border-slate-200"}`} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Client</label>
              <select value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {CLIENTS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {PRIORITIES_OPT.map(p => <option key={p} className="capitalize">{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Project / System</label>
            <input value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
              placeholder="e.g. Lanka Retail ERP, Core Platform"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Description *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4} placeholder="Detailed description of the issue, steps to reproduce, impact..."
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? "border-red-400" : "border-slate-200"}`} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">Create Ticket</button>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket Detail Drawer ─────────────────────────────────────────────────────
function TicketDetail({ ticket, onClose, onUpdate }: { ticket: Ticket; onClose: () => void; onUpdate: (t: Ticket) => void }) {
  const [status, setStatus] = useState(ticket.status);
  const [assignee, setAssignee] = useState(ticket.assignee);
  const [resolution, setResolution] = useState(ticket.resolution);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ author: string; text: string; time: string }[]>([]);
  const [saving, setSaving] = useState(false);

  function handleClaim() {
    setAssignee("Kavinda Perera");
    if (status === "open") setStatus("in-progress");
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onUpdate({ ...ticket, status, assignee, resolution });
    }, 700);
  }

  function handleComment() {
    if (!comment.trim()) return;
    setComments(prev => [...prev, { author: "You", text: comment.trim(), time: "Just now" }]);
    setComment("");
  }

  const statusFlow = TICKET_STATUSES;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div>
            <p className="font-mono text-sm font-bold text-blue-600">{ticket.id}</p>
            <p className="text-base font-bold text-slate-900 mt-0.5 leading-snug max-w-xs">{ticket.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg flex-shrink-0 mt-0.5"><X size={16} className="text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Priority</p>
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full border capitalize ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">SLA Target</p>
              <p className={`text-sm font-bold mt-1 ${ticket.priority === "critical" ? "text-red-600" : ticket.priority === "high" ? "text-orange-600" : "text-slate-700"}`}>{ticket.sla}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Client</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{ticket.client}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Project</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{ticket.project}</p>
            </div>
          </div>

          {/* Status flow */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Status</p>
            <div className="flex items-center gap-1 flex-wrap">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <button onClick={() => setStatus(s)}
                    className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg capitalize transition-colors border ${status === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}>
                    {s.replace("-", " ")}
                  </button>
                  {i < statusFlow.length - 1 && <ArrowRight size={9} className="text-slate-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Assigned To</p>
            <div className="flex items-center gap-2">
              <select value={assignee} onChange={e => setAssignee(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">— Unassigned —</option>
                {ENGINEERS.map(e => <option key={e}>{e}</option>)}
              </select>
              {!assignee && (
                <button onClick={handleClaim}
                  className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors whitespace-nowrap">
                  <User size={13} /> Claim
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Description</p>
            <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 leading-relaxed">{ticket.description}</p>
          </div>

          {/* Resolution notes */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Resolution Notes</p>
            <textarea value={resolution} onChange={e => setResolution(e.target.value)}
              rows={3} placeholder="Document how the issue was resolved..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {/* Comments */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Activity</p>
            {comments.length === 0 && <p className="text-xs text-slate-400 italic mb-2">No comments yet</p>}
            <div className="space-y-2 mb-3">
              {comments.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 mt-0.5">Y</div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-slate-800">{c.author}</span>
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-700">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={comment} onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleComment()}
                placeholder="Add a comment..."
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={handleComment} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"><MessageSquare size={14} /></button>
            </div>
          </div>
        </div>

        {/* Footer save */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white flex items-center gap-2">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 flex-1 justify-center text-sm bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-60">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Save Changes"}
          </button>
          {(status === "resolved" || status === "closed") && (
            <button onClick={handleSave}
              className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors">
              <CheckCircle size={13} /> Close Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ServiceDeskPage() {
  const [allTickets, setAllTickets] = useState<Ticket[]>(allBase);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);

  const filtered = allTickets.filter(t => {
    const matchStatus = statusFilter === "All" || t.status.toLowerCase().replace(/-/g, " ") === statusFilter.toLowerCase().replace(/-/g, " ");
    const matchPriority = priorityFilter === "All Priorities" || t.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()) || t.client.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  function handleNewTicket(t: Ticket) {
    setAllTickets(prev => [t, ...prev]);
    setShowNew(false);
    setFeedback({ type: "success", title: "Ticket Created", message: `${t.title} has been logged and is now Open.`, ref: t.id, refLabel: "Ticket ID" });
  }

  function handleUpdate(updated: Ticket) {
    setAllTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelected(null);
    const wasResolved = updated.status === "resolved" || updated.status === "closed";
    setFeedback({ type: wasResolved ? "success" : "processing", title: wasResolved ? "Ticket Resolved" : "Ticket Updated", message: wasResolved ? `${updated.id} marked as ${updated.status}.` : `${updated.id} updated successfully.`, ref: updated.id });
  }

  return (
    <>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>IT Service Desk</h2>
            <p className="text-sm text-slate-500 mt-0.5">{allTickets.length} tickets · Avg response 2.4h</p>
          </div>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> New Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { icon: AlertTriangle, label: "Critical/High", value: allTickets.filter(t => ["critical","high"].includes(t.priority)).length, color: "text-red-600", bg: "bg-red-50" },
            { icon: RefreshCw,    label: "In Progress",   value: allTickets.filter(t => t.status === "in-progress").length,              color: "text-blue-600",  bg: "bg-blue-50"  },
            { icon: Clock,        label: "Waiting",       value: allTickets.filter(t => t.status === "waiting").length,                  color: "text-amber-600", bg: "bg-amber-50" },
            { icon: CheckCircle,  label: "Resolved Today",value: 3,                                                                      color: "text-emerald-600",bg: "bg-emerald-50"},
            { icon: Clock,        label: "SLA Breaching", value: allTickets.filter(t => t.priority === "critical" && t.status !== "resolved" && t.status !== "closed").length, color: "text-orange-600", bg: "bg-orange-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl border border-slate-200 px-4 py-3 cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => setStatusFilter(s.label === "In Progress" ? "In Progress" : s.label === "Waiting" ? "Waiting" : "All")}>
              <div className="flex items-center gap-2 mb-1">
                <s.icon size={13} className={s.color} />
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
              <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 flex-wrap">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48" />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 border border-slate-200"}`}>
                  {s}
                </button>
              ))}
            </div>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-700 ml-auto">
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide w-24">Ticket</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Title</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Client</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Priority</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Assignee</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">SLA</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Created</th>
                  <th className="px-3 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-sm text-slate-400">No tickets match the current filters</td>
                  </tr>
                )}
                {filtered.map(t => (
                  <tr key={t.id} onClick={() => setSelected(t)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-medium text-blue-600">{t.id}</span>
                    </td>
                    <td className="px-3 py-3 max-w-xs">
                      <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700 transition-colors">{t.title}</p>
                      <p className="text-xs text-slate-400">{t.project}</p>
                    </td>
                    <td className="px-3 py-3"><span className="text-xs text-slate-600">{t.client}</span></td>
                    <td className="px-3 py-3"><StatusBadge status={t.priority} /></td>
                    <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-3 py-3">
                      {t.assignee ? (
                        <div className="flex items-center gap-1.5">
                          <Avatar name={t.assignee} size="xs" />
                          <span className="text-xs text-slate-600">{t.assignee.split(" ")[0]}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-mono font-medium ${t.priority === "critical" ? "text-red-600" : t.priority === "high" ? "text-orange-600" : "text-slate-500"}`}>{t.sla}</span>
                    </td>
                    <td className="px-5 py-3"><span className="text-xs text-slate-500">{t.created}</span></td>
                    <td className="px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={14} className="text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && <TicketDetail ticket={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
      {showNew && <NewTicketModal onClose={() => setShowNew(false)} onSave={handleNewTicket} />}
      <ActionFeedback data={feedback} onDismiss={() => setFeedback(null)} />
    </>
  );
}
