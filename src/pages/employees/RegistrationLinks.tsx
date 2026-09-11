import { useState } from "react";
import { Plus, Copy, Mail, MessageCircle, RefreshCw, Trash2, CheckCircle, XCircle, Eye, ChevronRight, Shield, User, Crown, Clock, AlertCircle } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";

type ApprovalStage = "submitted" | "pending-hr" | "hr-approved" | "pending-manager" | "manager-approved" | "approved" | "rejected" | "completed" | "cancelled" | "expired" | "in-progress" | "pending";

interface RegistrationLink {
  id: string;
  candidate: string;
  createdBy: string;
  createdDate: string;
  expiry: string;
  status: ApprovalStage;
  completion: number;
  lastActivity: string;
  email: string;
  hrApprovedBy?: string;
  hrApprovedAt?: string;
  managerApprovedBy?: string;
  managerApprovedAt?: string;
  rejectionReason?: string;
}

const initialLinks: RegistrationLink[] = [
  { id: "REG-2025-0012", candidate: "Sandun Ratnayake", createdBy: "Amali De Silva", createdDate: "2025-03-09", expiry: "2025-03-16", status: "pending-manager", completion: 100, lastActivity: "2025-03-10 10:42", email: "sandun@gmail.com", hrApprovedBy: "Amali De Silva", hrApprovedAt: "2025-03-10 09:30" },
  { id: "REG-2025-0011", candidate: "Nimasha Perera", createdBy: "Amali De Silva", createdDate: "2025-03-07", expiry: "2025-03-14", status: "pending-hr", completion: 100, lastActivity: "2025-03-11 14:00", email: "nimasha@gmail.com" },
  { id: "REG-2025-0010", candidate: "Ravindu Bandara", createdBy: "Dilshan Fernando", createdDate: "2025-03-05", expiry: "2025-03-12", status: "approved", completion: 100, lastActivity: "2025-03-09 14:30", email: "ravindu@gmail.com", hrApprovedBy: "Amali De Silva", hrApprovedAt: "2025-03-08 10:00", managerApprovedBy: "Dilshan Fernando", managerApprovedAt: "2025-03-09 14:30" },
  { id: "REG-2025-0009", candidate: "Hasini Jayawardena", createdBy: "Amali De Silva", createdDate: "2025-02-28", expiry: "2025-03-07", status: "completed", completion: 100, lastActivity: "2025-03-06 11:20", email: "hasini@gmail.com", hrApprovedBy: "Amali De Silva", hrApprovedAt: "2025-03-05 09:00", managerApprovedBy: "Priya Jayawardena", managerApprovedAt: "2025-03-06 11:20" },
  { id: "REG-2025-0008", candidate: "Chamika Seneviratne", createdBy: "Priya Jayawardena", createdDate: "2025-02-20", expiry: "2025-02-27", status: "rejected", completion: 40, lastActivity: "2025-02-22 08:55", email: "chamika@gmail.com", rejectionReason: "Incomplete documents — NIC and bank slip missing." },
  { id: "REG-2025-0007", candidate: "Tharushi Weerasinghe", createdBy: "Amali De Silva", createdDate: "2025-03-11", expiry: "2025-03-18", status: "in-progress", completion: 45, lastActivity: "2025-03-11 16:20", email: "tharushi@gmail.com" },
];

const roleLabel: Record<string, { icon: React.ComponentType<{size?: number; className?: string}>, label: string, color: string }> = {
  hr:      { icon: Shield, label: "HR Officer",  color: "text-violet-600" },
  manager: { icon: User,   label: "Manager",     color: "text-blue-600" },
  director:{ icon: Crown,  label: "Director",    color: "text-amber-600" },
};

// Simulated current user role — in real app comes from auth context
const CURRENT_USER_ROLE: "hr" | "manager" | "director" = "manager";
const CURRENT_USER_NAME = "Dilshan Fernando";

const approvalStageLabel: Record<ApprovalStage, string> = {
  "submitted": "Submitted",
  "pending-hr": "Awaiting HR",
  "hr-approved": "HR Approved",
  "pending-manager": "Awaiting Manager",
  "manager-approved": "Manager Approved",
  "approved": "Fully Approved",
  "rejected": "Rejected",
  "completed": "Completed",
  "cancelled": "Cancelled",
  "expired": "Expired",
  "in-progress": "In Progress",
  "pending": "Pending",
};

function ApprovalChain({ link, onApprove, onReject }: { link: RegistrationLink; onApprove: () => void; onReject: (reason: string) => void }) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const canApproveAsHR = CURRENT_USER_ROLE === "hr" && link.status === "pending-hr";
  const canApproveAsManager = (CURRENT_USER_ROLE === "manager" || CURRENT_USER_ROLE === "director") && link.status === "pending-manager";
  const canDirectApprove = (CURRENT_USER_ROLE === "manager" || CURRENT_USER_ROLE === "director") && link.status === "pending-hr";
  const canApprove = canApproveAsHR || canApproveAsManager || canDirectApprove;
  const canReject = link.status === "pending-hr" || link.status === "pending-manager";

  const steps = [
    {
      label: "Form Submitted",
      done: link.completion === 100,
      active: link.completion < 100,
      icon: CheckCircle,
      detail: link.completion === 100 ? `${link.completion}% complete` : `${link.completion}% complete`,
    },
    {
      label: "HR Approval",
      done: !!link.hrApprovedBy || link.status === "approved" || link.status === "completed" || link.status === "manager-approved",
      active: link.status === "pending-hr",
      icon: Shield,
      detail: link.hrApprovedBy ? `${link.hrApprovedBy} · ${link.hrApprovedAt}` : link.status === "pending-hr" ? "Awaiting HR review" : "—",
    },
    {
      label: "Manager / Director Approval",
      done: !!link.managerApprovedBy || link.status === "approved" || link.status === "completed",
      active: link.status === "pending-manager",
      icon: User,
      detail: link.managerApprovedBy ? `${link.managerApprovedBy} · ${link.managerApprovedAt}` : link.status === "pending-manager" ? "Awaiting manager review" : "—",
    },
    {
      label: "Onboarding",
      done: link.status === "completed",
      active: link.status === "approved",
      icon: CheckCircle,
      detail: link.status === "completed" ? "Employee activated" : "Pending approval",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Chain steps */}
      <div className="flex items-start gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-start flex-1 min-w-0">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                link.status === "rejected" && i > 0 ? "border-red-200 bg-red-50"
                : step.done ? "border-emerald-500 bg-emerald-500"
                : step.active ? "border-blue-500 bg-blue-50 animate-pulse"
                : "border-slate-200 bg-white"
              }`}>
                {link.status === "rejected" && i > 0 ? <XCircle size={13} className="text-red-400" />
                  : step.done ? <CheckCircle size={13} className="text-white" />
                  : step.active ? <Clock size={13} className="text-blue-500" />
                  : <step.icon size={13} className="text-slate-300" />}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 h-0 -mb-1`} />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mt-3.5 mx-1 rounded-full ${step.done ? "bg-emerald-400" : "bg-slate-100"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {steps.map(step => (
          <div key={step.label}>
            <p className="text-[10px] font-semibold text-slate-600">{step.label}</p>
            <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{step.detail}</p>
          </div>
        ))}
      </div>

      {/* Rejection note */}
      {link.status === "rejected" && link.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-red-700">Rejected</p>
            <p className="text-xs text-red-600 mt-0.5">{link.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Manager/Director direct-approve note */}
      {canDirectApprove && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <Crown size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">As <strong>{roleLabel[CURRENT_USER_ROLE].label}</strong>, you can approve directly — bypassing the HR stage.</p>
        </div>
      )}

      {/* Action buttons */}
      {canApprove && !showRejectInput && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <CheckCircle size={13} /> Approve
          </button>
          {canReject && (
            <button
              onClick={() => setShowRejectInput(true)}
              className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <XCircle size={13} /> Reject
            </button>
          )}
        </div>
      )}
      {showRejectInput && (
        <div className="space-y-2">
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
            rows={2}
            className="w-full text-sm border border-red-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
          <div className="flex gap-2">
            <button onClick={() => setShowRejectInput(false)} className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg">Cancel</button>
            <button
              onClick={() => { if (rejectReason.trim()) { onReject(rejectReason); setShowRejectInput(false); }}}
              disabled={!rejectReason.trim()}
              className="text-xs font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistrationLinks({ onNewRegistration }: { onNewRegistration?: () => void }) {
  const [links, setLinks] = useState<RegistrationLink[]>(initialLinks);
  const [copied, setCopied] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [genName, setGenName] = useState("");
  const [genEmail, setGenEmail] = useState("");
  const [genExpiry, setGenExpiry] = useState("7 days");

  function copyLink(id: string) {
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleApprove(id: string) {
    setLinks(prev => prev.map(l => {
      if (l.id !== id) return l;
      const now = new Date().toISOString().slice(0, 16).replace("T", " ");
      if (l.status === "pending-hr" && CURRENT_USER_ROLE === "hr") {
        return { ...l, status: "pending-manager", hrApprovedBy: CURRENT_USER_NAME, hrApprovedAt: now };
      }
      if (l.status === "pending-hr" && (CURRENT_USER_ROLE === "manager" || CURRENT_USER_ROLE === "director")) {
        // Direct approval — skip HR stage
        return { ...l, status: "approved", hrApprovedBy: CURRENT_USER_NAME + " (Direct)", hrApprovedAt: now, managerApprovedBy: CURRENT_USER_NAME, managerApprovedAt: now };
      }
      if (l.status === "pending-manager") {
        return { ...l, status: "approved", managerApprovedBy: CURRENT_USER_NAME, managerApprovedAt: now };
      }
      return l;
    }));
  }

  function handleReject(id: string, reason: string) {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, status: "rejected", rejectionReason: reason } : l));
  }

  function handleGenerate() {
    if (!genName || !genEmail) return;
    const now = new Date();
    const days = parseInt(genExpiry) || 7;
    const expiry = new Date(now.getTime() + days * 86400000).toISOString().slice(0, 10);
    const newLink: RegistrationLink = {
      id: `REG-2025-00${String(links.length + 13).padStart(2, "0")}`,
      candidate: genName,
      createdBy: CURRENT_USER_NAME,
      createdDate: now.toISOString().slice(0, 10),
      expiry,
      status: "pending",
      completion: 0,
      lastActivity: now.toISOString().slice(0, 16).replace("T", " "),
      email: genEmail,
    };
    setLinks(prev => [newLink, ...prev]);
    setShowGenerate(false);
    setGenName("");
    setGenEmail("");
    setGenExpiry("7 days");
  }

  const pendingApproval = links.filter(l => l.status === "pending-hr" || l.status === "pending-manager").length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Employee Registration</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage registration links and approval workflow</p>
        </div>
        <div className="flex items-center gap-2">
          {onNewRegistration && (
            <button onClick={onNewRegistration} className="flex items-center gap-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
              <Eye size={14} /> Open Form
            </button>
          )}
          <button onClick={() => setShowGenerate(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> Generate Link
          </button>
        </div>
      </div>

      {/* Approval role indicator */}
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${CURRENT_USER_ROLE === "director" ? "bg-amber-50 border-amber-200" : CURRENT_USER_ROLE === "manager" ? "bg-blue-50 border-blue-200" : "bg-violet-50 border-violet-200"}`}>
        {(() => { const r = roleLabel[CURRENT_USER_ROLE]; return <r.icon size={16} className={r.color} />; })()}
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-800">{CURRENT_USER_NAME}</span>
          <span className="text-xs text-slate-500 ml-2">· {roleLabel[CURRENT_USER_ROLE].label}</span>
        </div>
        {pendingApproval > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300 px-3 py-1 rounded-full">
            <AlertCircle size={12} /> {pendingApproval} pending your approval
          </span>
        )}
        {(CURRENT_USER_ROLE === "manager" || CURRENT_USER_ROLE === "director") && (
          <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-lg">Can approve directly</span>
        )}
      </div>

      {/* Generate modal */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowGenerate(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Generate Registration Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Candidate / Employee Name</label>
                <input type="text" value={genName} onChange={e => setGenName(e.target.value)} placeholder="Full name" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input type="email" value={genEmail} onChange={e => setGenEmail(e.target.value)} placeholder="candidate@email.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Link Expiry</label>
                <select value={genExpiry} onChange={e => setGenExpiry(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>3 days</option>
                  <option>7 days</option>
                  <option>14 days</option>
                  <option>30 days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Notify via</label>
                <div className="flex gap-3">
                  {["Email","WhatsApp","SMS"].map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" defaultChecked={c === "Email"} />
                      <span className="text-sm text-slate-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowGenerate(false)} className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleGenerate} disabled={!genName || !genEmail} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">Generate & Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "Total", value: links.length, color: "text-slate-800" },
          { label: "In Progress", value: links.filter(l => l.status === "in-progress" || l.status === "pending").length, color: "text-blue-600" },
          { label: "Awaiting HR", value: links.filter(l => l.status === "pending-hr").length, color: "text-violet-600" },
          { label: "Awaiting Manager", value: links.filter(l => l.status === "pending-manager").length, color: "text-amber-600" },
          { label: "Approved", value: links.filter(l => l.status === "approved" || l.status === "completed").length, color: "text-emerald-600" },
          { label: "Rejected", value: links.filter(l => l.status === "rejected").length, color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-[10px] text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Ref / Candidate</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Created By</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Expiry</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Approval Stage</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Form</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Activity</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {links.map(link => {
              const needsMyAction = (link.status === "pending-hr" && CURRENT_USER_ROLE === "hr") || (link.status === "pending-manager" && (CURRENT_USER_ROLE === "manager" || CURRENT_USER_ROLE === "director")) || (link.status === "pending-hr" && (CURRENT_USER_ROLE === "manager" || CURRENT_USER_ROLE === "director"));
              const expanded = expandedId === link.id;
              return (
                <>
                  <tr
                    key={link.id}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${needsMyAction ? "bg-amber-50/40" : ""}`}
                    onClick={() => setExpandedId(expanded ? null : link.id)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {needsMyAction && <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 animate-pulse" />}
                        <div>
                          <p className="font-mono text-xs font-semibold text-blue-600">{link.id}</p>
                          <p className="text-sm font-medium text-slate-800 mt-0.5">{link.candidate}</p>
                          <p className="text-[10px] text-slate-400">{link.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={link.createdBy} size="xs" />
                        <span className="text-xs text-slate-600">{link.createdBy.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-medium ${new Date(link.expiry) < new Date() ? "text-red-600" : "text-slate-600"}`}>
                        {link.expiry}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        link.status === "pending-hr" ? "bg-violet-100 text-violet-700" :
                        link.status === "pending-manager" ? "bg-amber-100 text-amber-700" :
                        link.status === "approved" || link.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        link.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {approvalStageLabel[link.status]}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full">
                          <div className={`h-full rounded-full ${link.completion === 100 ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${link.completion}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{link.completion}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className="text-xs text-slate-500">{link.lastActivity}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={e => { e.stopPropagation(); copyLink(link.id); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Copy link">
                          {copied === link.id ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-400" />}
                        </button>
                        <button onClick={e => e.stopPropagation()} className="p-1.5 hover:bg-slate-100 rounded-lg" title="Send email"><Mail size={13} className="text-slate-400" /></button>
                        <button onClick={e => e.stopPropagation()} className="p-1.5 hover:bg-slate-100 rounded-lg" title="Send WhatsApp"><MessageCircle size={13} className="text-slate-400" /></button>
                        <button onClick={e => e.stopPropagation()} className="p-1.5 hover:bg-slate-100 rounded-lg" title="Extend expiry"><RefreshCw size={13} className="text-slate-400" /></button>
                        <button onClick={e => e.stopPropagation()} className="p-1.5 hover:bg-red-50 rounded-lg" title="Revoke"><Trash2 size={13} className="text-red-400" /></button>
                        <ChevronRight size={13} className={`text-slate-300 transition-transform ml-1 ${expanded ? "rotate-90" : ""}`} />
                      </div>
                    </td>
                  </tr>
                  {expanded && (
                    <tr key={`${link.id}-detail`} className="bg-slate-50/80">
                      <td colSpan={7} className="px-5 py-0">
                        <ApprovalChain
                          link={link}
                          onApprove={() => handleApprove(link.id)}
                          onReject={(reason) => handleReject(link.id, reason)}
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
