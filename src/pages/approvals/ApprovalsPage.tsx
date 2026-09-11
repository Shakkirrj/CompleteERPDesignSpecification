import { useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, MessageSquare, Paperclip, User, CalendarDays, X } from "lucide-react";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";

interface Approval {
  id: string; type: string; requester: string; department: string;
  branch: string; created: string; priority: "high" | "medium" | "low";
  stage: "pending-review" | "pending-manager" | "pending-director" | "approved" | "rejected" | "escalated";
  description: string; attachments?: number; comments?: number;
}

const approvals: Approval[] = [
  { id: "APR-001", type: "Employee Registration", requester: "Kavya Bandara",   department: "Engineering",  branch: "Colombo HQ", created: "2026-09-10", priority: "high",   stage: "pending-review",   description: "New hire registration for Senior Developer position",  attachments: 3, comments: 2 },
  { id: "APR-002", type: "Leave Request",          requester: "Nimal Perera",    department: "Finance",      branch: "Colombo HQ", created: "2026-09-09", priority: "medium", stage: "pending-manager",  description: "Annual leave — 5 days from 2026-09-20",              attachments: 0, comments: 1 },
  { id: "APR-003", type: "Purchase Request",       requester: "Dilshan Fernando",department: "IT",           branch: "Colombo HQ", created: "2026-09-08", priority: "high",   stage: "pending-director", description: "Server hardware upgrade — LKR 850,000",              attachments: 2, comments: 4 },
  { id: "APR-004", type: "Salary Change",          requester: "Priya Jayawardena",department: "HR",          branch: "Colombo HQ", created: "2026-09-07", priority: "high",   stage: "pending-director", description: "Annual salary revision for Q3 2026 — 15% increment", attachments: 1, comments: 3 },
  { id: "APR-005", type: "Access Request",         requester: "Chamara Wickramasinghe",department: "DevOps", branch: "Colombo HQ", created: "2026-09-06", priority: "medium", stage: "approved",         description: "Production environment SSH access",                  attachments: 0, comments: 1 },
  { id: "APR-006", type: "Quotation Approval",     requester: "Nuwan Rajapaksa", department: "Sales",        branch: "Colombo HQ", created: "2026-09-05", priority: "low",    stage: "approved",         description: "QT-2025-0024 — Sampath Bank ERP proposal",          attachments: 1, comments: 2 },
  { id: "APR-007", type: "Expense Report",         requester: "Tharanga Madawala",department: "Marketing",   branch: "Kandy",      created: "2026-09-04", priority: "low",    stage: "rejected",         description: "Q3 marketing event expenses — LKR 45,000",           attachments: 2, comments: 3 },
  { id: "APR-008", type: "Asset Transfer",         requester: "Sandali Perera",  department: "HR",           branch: "Colombo HQ", created: "2026-09-03", priority: "medium", stage: "pending-review",   description: "Transfer MacBook Pro M3 from Engineering to Marketing",attachments: 0, comments: 0 },
];

const stageCfg = {
  "pending-review":   { label: "Pending Review",    dot: "bg-amber-400",   text: "text-amber-700",  bg: "bg-amber-50"  },
  "pending-manager":  { label: "Pending Manager",   dot: "bg-blue-400",    text: "text-blue-700",   bg: "bg-blue-50"   },
  "pending-director": { label: "Pending Director",  dot: "bg-violet-400",  text: "text-violet-700", bg: "bg-violet-50" },
  approved:           { label: "Approved",           dot: "bg-emerald-500", text: "text-emerald-700",bg: "bg-emerald-50"},
  rejected:           { label: "Rejected",           dot: "bg-red-500",     text: "text-red-700",    bg: "bg-red-50"   },
  escalated:          { label: "Escalated",          dot: "bg-orange-500",  text: "text-orange-700", bg: "bg-orange-50"},
};

const priorityCfg = {
  high:   "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low:    "bg-slate-100 text-slate-500",
};

const workflowStages = ["Form Submitted", "Review", "Manager Approval", "Director Approval", "Completed"];

const TABS = ["Pending My Approval", "All Pending", "Approved", "Rejected", "All"];

export default function ApprovalsPage() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<Approval | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Approval["stage"]>>({});
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  function getStage(a: Approval): Approval["stage"] { return statuses[a.id] ?? a.stage; }

  const filtered = approvals.filter(a => {
    const stage = getStage(a);
    if (tab === 0) return ["pending-review", "pending-manager", "pending-director"].includes(stage);
    if (tab === 1) return ["pending-review", "pending-manager", "pending-director"].includes(stage);
    if (tab === 2) return stage === "approved";
    if (tab === 3) return stage === "rejected";
    return true;
  });

  function approve(appr: Approval) {
    setStatuses(s => ({ ...s, [appr.id]: "approved" }));
    setSelected(null);
    setFeedback({
      type: "approval", title: "Request Approved",
      message: `${appr.type} has been approved successfully.`,
      ref: appr.id, refLabel: "Approval ID",
      actions: [
        { label: "View Record", onClick: () => {}, primary: true },
        { label: "Notify Requester", onClick: () => {} },
      ],
    });
  }

  function reject(appr: Approval, comment?: string) {
    setStatuses(s => ({ ...s, [appr.id]: "rejected" }));
    setSelected(null);
    setRejectId(null);
    setRejectComment("");
    setFeedback({
      type: "error", title: "Request Rejected",
      message: comment ? `Reason: ${comment}` : `${appr.type} has been rejected.`,
      ref: appr.id, refLabel: "Approval ID",
      actions: [
        { label: "View Record", onClick: () => {}, primary: true },
        { label: "Notify Requester", onClick: () => {} },
      ],
    });
  }

  const pending = approvals.filter(a => ["pending-review","pending-manager","pending-director"].includes(getStage(a))).length;

  function stageIdx(stage: Approval["stage"]) {
    const map: Record<string, number> = {
      "pending-review": 1, "pending-manager": 2, "pending-director": 3, approved: 4, rejected: 4, escalated: 3,
    };
    return map[stage] ?? 0;
  }

  return (
    <>
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Approval Center</h2>
          <p className="text-sm text-slate-500 mt-0.5">{pending} pending · {approvals.length} total</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Pending",  value: pending, color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
          { label: "Approved", value: approvals.filter(a => getStage(a) === "approved").length, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Rejected", value: approvals.filter(a => getStage(a) === "rejected").length, color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
          { label: "High Priority", value: approvals.filter(a => a.priority === "high").length, color: "text-violet-700", bg: "bg-violet-50",  border: "border-violet-200" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-4`}>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-3xl font-black ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-1 px-5 py-3 border-b border-slate-100 flex-wrap">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === i ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {t}
              {i === 0 && pending > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{pending}</span>
              )}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No approvals in this category</div>
          )}
          {filtered.map(appr => {
            const stage = getStage(appr);
            const sc = stageCfg[stage];
            const isPending = ["pending-review","pending-manager","pending-director"].includes(stage);
            return (
              <div
                key={appr.id}
                className="px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setSelected(appr)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-blue-600">{appr.id}</span>
                      <span className="text-xs font-semibold text-slate-800">{appr.type}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${priorityCfg[appr.priority]}`}>{appr.priority.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{appr.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-slate-400"><User size={9} />{appr.requester}</span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">{appr.department}</span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays size={9} />{appr.created}</span>
                      {(appr.attachments ?? 0) > 0 && <span className="flex items-center gap-1 text-[10px] text-slate-400"><Paperclip size={9} />{appr.attachments}</span>}
                      {(appr.comments ?? 0) > 0 && <span className="flex items-center gap-1 text-[10px] text-slate-400"><MessageSquare size={9} />{appr.comments}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                    {isPending && (
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => approve(appr)} className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors" title="Approve">
                          <CheckCircle2 size={14} />
                        </button>
                        <button onClick={() => { setRejectId(appr.id); setRejectComment(""); }} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Reject">
                          <XCircle size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reject reason modal */}
      {rejectId && (() => {
        const appr = approvals.find(a => a.id === rejectId)!;
        return (
          <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md anim-bounce-in">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">Reject Request</p>
                  <p className="text-xs text-slate-500 mt-0.5">{appr?.type} · {appr?.id}</p>
                </div>
                <button onClick={() => setRejectId(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={14} className="text-slate-400" /></button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-slate-700">Please provide a reason for rejection. This will be sent to <strong>{appr?.requester}</strong>.</p>
                <textarea value={rejectComment} onChange={e => setRejectComment(e.target.value)} rows={4}
                  placeholder="Enter rejection reason…"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div className="flex gap-2 px-5 py-4 border-t border-slate-200">
                <button onClick={() => setRejectId(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={() => reject(appr!, rejectComment)} disabled={!rejectComment.trim()}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold disabled:opacity-50 transition-colors">
                  <XCircle size={13} /> Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <p className="font-mono text-sm font-bold text-blue-600">{selected.id}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selected.type}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 text-xl">×</button>
            </div>
            <div className="p-5 space-y-5">
              <p className="text-sm text-slate-700 leading-relaxed">{selected.description}</p>

              {/* Workflow visualization */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Approval Workflow</p>
                <div className="flex items-center gap-0">
                  {workflowStages.map((stage, i) => {
                    const current = stageIdx(getStage(selected));
                    const done = i < current;
                    const active = i === current;
                    const rejected = getStage(selected) === "rejected" && i === current;
                    return (
                      <div key={stage} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                            rejected ? "bg-red-500 text-white" :
                            done ? "bg-emerald-500 text-white" :
                            active ? "bg-blue-600 text-white ring-2 ring-blue-200" :
                            "bg-slate-100 text-slate-400"
                          }`}>
                            {done ? "✓" : rejected ? "✕" : i + 1}
                          </div>
                          <span className="text-[8px] text-slate-500 text-center leading-tight">{stage}</span>
                        </div>
                        {i < workflowStages.length - 1 && (
                          <div className={`h-0.5 w-4 mx-0 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Requester",   value: selected.requester },
                  { label: "Department",  value: selected.department },
                  { label: "Branch",      value: selected.branch },
                  { label: "Created",     value: selected.created },
                  { label: "Priority",    value: selected.priority.charAt(0).toUpperCase() + selected.priority.slice(1) },
                ].map(f => (
                  <div key={f.label} className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</p>
                    <p className="text-sm text-slate-800 font-medium mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              {["pending-review","pending-manager","pending-director"].includes(getStage(selected)) && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button onClick={() => approve(selected)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 py-2.5 rounded-xl font-semibold transition-colors">
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button onClick={() => { setRejectId(selected.id); setRejectComment(""); }}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-red-600 text-white hover:bg-red-700 py-2.5 rounded-xl font-semibold transition-colors">
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    <ActionFeedback data={feedback} onDismiss={() => setFeedback(null)} />
    </>
  );
}
