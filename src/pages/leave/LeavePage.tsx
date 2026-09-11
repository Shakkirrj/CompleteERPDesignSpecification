import { useState, useCallback } from "react";
import {
  Plus, ArrowLeft, CalendarDays, Clock, CheckCircle2, XCircle,
  FileText, ChevronRight, Upload, AlertTriangle, Users,
  BarChart3, Settings2, List, Eye, Edit2, Trash2,
  User, Building2, MapPin, Briefcase, MessageSquare,
  RefreshCw, Download, Shield, BookOpen, TrendingUp,
} from "lucide-react";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";
import {
  LEAVE_TYPES, MOCK_BALANCES, MOCK_REQUESTS,
  statusCfg, calcWorkingDays,
  type LeaveRequest, type LeaveBalance, type LeaveType,
} from "./leaveData";

type SubPage =
  | "dashboard" | "apply" | "my-leaves" | "calendar"
  | "balance" | "pending-approvals" | "history" | "types"
  | "settings" | "detail";

const CURRENT_EMPLOYEE = {
  id: "EMP-001", name: "Amali De Silva", designation: "Software Engineer",
  department: "Engineering", branch: "Colombo HQ", team: "Product Team",
  manager: "Priya Jayawardena", avatar: "AD",
};

// ─── Status Badge ──────────────────────────────────────────────────────────
function StatusPill({ status }: { status: LeaveRequest["status"] }) {
  const c = statusCfg[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />{c.label}
    </span>
  );
}

// ─── Apply Leave Form ───────────────────────────────────────────────────────
function ApplyLeaveForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: (r: LeaveRequest) => void }) {
  const [step, setStep] = useState(0);
  const [typeId, setTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [halfDaySession, setHalfDaySession] = useState<"AM" | "PM">("AM");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const selectedType = LEAVE_TYPES.find(t => t.id === typeId);
  const balance = MOCK_BALANCES.find(b => b.typeId === typeId);
  const { calendar, working } = calcWorkingDays(startDate, endDate);
  const balanceAfter = (balance?.available ?? 0) - working;
  const insufficientBalance = working > 0 && balance && working > balance.available;

  const steps = ["Employee", "Leave Type", "Dates", "Message", "Documents", "Review"];

  function handleSubmit() {
    const newReq: LeaveRequest = {
      id: `LR-2026-${String(Date.now()).slice(-6)}`,
      employeeId: CURRENT_EMPLOYEE.id,
      employeeName: CURRENT_EMPLOYEE.name,
      employeeDesignation: CURRENT_EMPLOYEE.designation,
      employeeDepartment: CURRENT_EMPLOYEE.department,
      employeeBranch: CURRENT_EMPLOYEE.branch,
      typeId,
      typeName: selectedType?.name ?? "",
      startDate, endDate,
      calendarDays: calendar, workingDays: working,
      halfDay, halfDaySession,
      reason, attachments: files,
      status: "PENDING_MANAGER_APPROVAL",
      approvalSteps: [{ step: 1, role: "Manager", approver: CURRENT_EMPLOYEE.manager, status: "PENDING" }],
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      balanceBefore: balance?.available ?? 0,
      balanceAfter: Math.max(0, balanceAfter),
    };
    onSubmit(newReq);
  }

  const canNext = [
    true,
    !!typeId,
    !!startDate && !!endDate && !insufficientBalance,
    selectedType?.requiresReason ? reason.trim().length > 10 : true,
    selectedType?.requiresDocument ? files.length > 0 : true,
    true,
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ArrowLeft size={16} className="text-slate-500" /></button>
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Apply for Leave</h2>
          <p className="text-sm text-slate-500 mt-0.5">Complete all steps to submit your leave request</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <button onClick={() => i < step && setStep(i)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${i === step ? "bg-blue-600 text-white" : i < step ? "bg-emerald-500 text-white cursor-pointer" : "bg-slate-200 text-slate-400"}`}>
              {i < step ? <CheckCircle2 size={14} /> : i + 1}
            </button>
            <span className={`text-xs hidden sm:block ${i === step ? "font-semibold text-slate-700" : "text-slate-400"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px mx-1 ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        {/* Step 0 — Employee info */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Employee Information</h3>
            <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                {CURRENT_EMPLOYEE.avatar}
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
                {[
                  { label: "Employee ID",   value: CURRENT_EMPLOYEE.id,          Icon: User      },
                  { label: "Name",          value: CURRENT_EMPLOYEE.name,        Icon: User      },
                  { label: "Designation",   value: CURRENT_EMPLOYEE.designation, Icon: Briefcase },
                  { label: "Department",    value: CURRENT_EMPLOYEE.department,  Icon: Building2 },
                  { label: "Branch",        value: CURRENT_EMPLOYEE.branch,      Icon: MapPin    },
                  { label: "Manager",       value: CURRENT_EMPLOYEE.manager,     Icon: Users     },
                ].map(r => (
                  <div key={r.label} className="flex items-start gap-2">
                    <r.Icon size={11} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                      <p className="text-sm text-slate-800">{r.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1"><Shield size={10} /> Employee information is loaded automatically and is read-only.</p>
          </div>
        )}

        {/* Step 1 — Leave type */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Select Leave Type</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LEAVE_TYPES.filter(t => t.active).map(t => {
                const bal = MOCK_BALANCES.find(b => b.typeId === t.id);
                return (
                  <button key={t.id} onClick={() => setTypeId(t.id)}
                    className={`border rounded-xl p-3 text-left transition-all ${typeId === t.id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.color}`}>{t.code}</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1.5">{t.name}</p>
                    {bal ? (
                      <p className="text-xs text-slate-500 mt-1">{bal.available} / {bal.entitlement} days</p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-1">{t.annualEntitlement} days / yr</p>
                    )}
                    {!t.paid && <span className="text-[10px] text-orange-500 font-semibold">Unpaid</span>}
                  </button>
                );
              })}
            </div>
            {selectedType && balance && (
              <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-4 gap-3 text-center">
                {[
                  { label: "Entitlement", val: balance.entitlement, col: "text-slate-700" },
                  { label: "Used",        val: balance.used,        col: "text-orange-600" },
                  { label: "Pending",     val: balance.pending,     col: "text-amber-600" },
                  { label: "Available",   val: balance.available,   col: "text-emerald-600" },
                ].map(c => (
                  <div key={c.label}>
                    <p className={`text-xl font-black ${c.col}`} style={{ fontFamily: "var(--font-display)" }}>{c.val}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{c.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Dates */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Date & Duration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Start Date <span className="text-red-500">*</span></label>
                <input type="date" value={startDate}
                  onChange={e => {
                    const v = e.target.value;
                    setStartDate(v);
                    if (!endDate || endDate < v) setEndDate(v);
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">End Date <span className="text-red-500">*</span></label>
                <input type="date" value={endDate} min={startDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            {selectedType?.halfDayAllowed && (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={halfDay} onChange={e => setHalfDay(e.target.checked)} className="rounded" />
                  <span className="text-sm text-slate-700 font-medium">Half Day</span>
                </label>
                {halfDay && (
                  <div className="flex gap-2">
                    {(["AM", "PM"] as const).map(s => (
                      <button key={s} onClick={() => setHalfDaySession(s)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${halfDaySession === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Calculation summary — always visible once start date is picked */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-100/70">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Calculation Summary</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Calendar Days</p>
                  <p className="text-2xl font-black text-slate-800 mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                    {startDate && endDate ? calendar : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Working Days (Leave)</p>
                  <p className={`text-2xl font-black mt-0.5 ${insufficientBalance ? "text-red-600" : startDate && endDate ? "text-emerald-600" : "text-slate-300"}`} style={{ fontFamily: "var(--font-display)" }}>
                    {startDate && endDate ? (halfDay ? 0.5 : working) : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Current Balance</p>
                  <p className="text-lg font-bold text-slate-700 mt-0.5">
                    {balance != null ? `${balance.available} days` : selectedType ? "Unlimited" : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Balance After Request</p>
                  <p className={`text-lg font-bold mt-0.5 ${startDate && endDate && balanceAfter < 0 ? "text-red-600" : "text-slate-700"}`}>
                    {startDate && endDate && balance != null
                      ? `${Math.max(0, balanceAfter)} days`
                      : startDate && endDate && !balance
                      ? "Unlimited"
                      : "—"}
                  </p>
                </div>
                {startDate && endDate && (
                  <>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Weekends / Holidays</p>
                      <p className="text-base font-bold text-slate-500 mt-0.5">{calendar - working} day{calendar - working !== 1 ? "s" : ""} excluded</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Approver</p>
                      <p className="text-base font-bold text-slate-700 mt-0.5">{CURRENT_EMPLOYEE.manager}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {startDate && endDate && working === 0 && calendar > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <p className="text-sm font-medium">The selected date range falls entirely on weekends or public holidays (0 working days).</p>
              </div>
            )}
            {insufficientBalance && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <p className="text-sm font-medium">Insufficient {selectedType?.name} balance. You have {balance?.available} days available but requested {working} days.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Reason */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Request Message</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Reason {selectedType?.requiresReason && <span className="text-red-500">*</span>}
                {!selectedType?.requiresReason && <span className="text-slate-400 normal-case font-normal ml-1">(optional)</span>}
              </label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} maxLength={500} rows={6}
                placeholder="Please explain the reason for your leave request. This message will be visible to your manager."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              <div className="flex items-center justify-between mt-1">
                {selectedType?.requiresReason && reason.trim().length < 10 && reason.length > 0
                  ? <p className="text-xs text-red-500">Please enter at least 10 characters.</p>
                  : <span />
                }
                <p className="text-xs text-slate-400 ml-auto">{reason.length}/500</p>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><Shield size={10} /> Your message is visible to authorized approvers only.</p>
            </div>
          </div>
        )}

        {/* Step 4 — Documents */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Supporting Documents</h3>
            {selectedType?.requiresDocument && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700">
                <AlertTriangle size={13} className="flex-shrink-0" />
                <p className="text-xs font-medium">{selectedType.name} requires a supporting document (e.g. medical certificate).</p>
              </div>
            )}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = Array.from(e.dataTransfer.files).map(x => x.name); setFiles(prev => [...prev, ...f]); }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"}`}>
              <Upload size={28} className="text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">Drag & drop files here</p>
              <p className="text-xs text-slate-400 mt-1">or</p>
              <label className="mt-2 inline-block cursor-pointer text-sm text-blue-600 hover:underline font-medium">
                Browse files
                <input type="file" multiple className="hidden" onChange={e => { const f = Array.from(e.target.files ?? []).map(x => x.name); setFiles(prev => [...prev, ...f]); }} />
              </label>
              <p className="text-[10px] text-slate-400 mt-2">PDF, DOC, JPG, PNG up to 10MB</p>
            </div>
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                    <FileText size={14} className="text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 flex-1 truncate">{f}</span>
                    <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 transition-colors"><XCircle size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            {!selectedType?.requiresDocument && (
              <p className="text-xs text-slate-400">Documents are optional for {selectedType?.name}. Skip if not applicable.</p>
            )}
          </div>
        )}

        {/* Step 5 — Review */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Review & Submit</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200">
              {[
                { label: "Employee",      value: `${CURRENT_EMPLOYEE.name} (${CURRENT_EMPLOYEE.id})` },
                { label: "Leave Type",    value: selectedType?.name ?? "—" },
                { label: "Start Date",    value: startDate },
                { label: "End Date",      value: endDate },
                { label: "Calendar Days", value: `${calendar} days` },
                { label: "Working Days",  value: `${halfDay ? 0.5 : working} days` },
                { label: "Balance Before",value: `${balance?.available ?? 0} days` },
                { label: "Balance After", value: `${Math.max(0, balanceAfter)} days` },
                { label: "Approver",      value: CURRENT_EMPLOYEE.manager },
                { label: "Reason",        value: reason || "(not provided)" },
                { label: "Attachments",   value: files.length ? files.join(", ") : "None" },
              ].map(r => (
                <div key={r.label} className="flex px-4 py-2.5 gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-32 flex-shrink-0">{r.label}</span>
                  <span className="text-sm text-slate-800">{r.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              By submitting this request, you confirm all information is accurate and understand this request is subject to manager approval as per company leave policy.
            </p>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">Back</button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 4 && (
              <button className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">Save Draft</button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}
                className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Continue
              </button>
            ) : (
              <button onClick={handleSubmit} className="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Submit Leave Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Request Detail ─────────────────────────────────────────────────────────
function RequestDetail({ req, onBack, onApprove, onReject, isManager }: {
  req: LeaveRequest; onBack: () => void;
  onApprove?: () => void; onReject?: (comment: string) => void; isManager?: boolean;
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const sc = statusCfg[req.status];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ArrowLeft size={16} className="text-slate-500" /></button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-mono">{req.id}</h2>
            <p className="text-sm text-slate-500">{req.typeName} · {req.startDate} – {req.endDate}</p>
          </div>
        </div>
        {isManager && req.status === "PENDING_MANAGER_APPROVAL" && !rejectOpen && (
          <div className="flex gap-2">
            <button onClick={onApprove} className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
              <CheckCircle2 size={13} /> Approve
            </button>
            <button onClick={() => setRejectOpen(true)} className="flex items-center gap-1.5 text-sm border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition-colors">
              <XCircle size={13} /> Reject
            </button>
          </div>
        )}
      </div>

      {rejectOpen && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 anim-slide-up space-y-3">
          <p className="font-semibold text-red-700">Rejection Reason <span className="text-red-500">*</span></p>
          <textarea value={rejectComment} onChange={e => setRejectComment(e.target.value)} rows={3} placeholder="Please provide a reason for rejecting this leave request…"
            className="w-full border border-red-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setRejectOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { if (rejectComment.trim()) { onReject?.(rejectComment); setRejectOpen(false); } }}
              disabled={!rejectComment.trim()}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold disabled:opacity-50 transition-colors">Confirm Rejection</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-4">
          {/* Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800">Request Summary</h4>
              <StatusPill status={req.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Employee",      val: req.employeeName },
                { label: "Designation",   val: req.employeeDesignation },
                { label: "Department",    val: req.employeeDepartment },
                { label: "Branch",        val: req.employeeBranch },
                { label: "Leave Type",    val: req.typeName },
                { label: "Start Date",    val: req.startDate },
                { label: "End Date",      val: req.endDate },
                { label: "Working Days",  val: `${req.workingDays} day${req.workingDays !== 1 ? "s" : ""}` },
                { label: "Balance Before",val: `${req.balanceBefore} days` },
                { label: "Balance After", val: `${req.balanceAfter} days` },
                { label: "Submitted",     val: req.submittedAt ? req.submittedAt.replace("T"," ").slice(0,16) : "Draft" },
                { label: "Last Updated",  val: req.updatedAt.replace("T"," ").slice(0,16) },
              ].map(r => (
                <div key={r.label}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                  <p className="text-sm text-slate-800 mt-0.5">{r.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><MessageSquare size={13} />Request Message</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200">{req.reason}</p>
          </div>

          {/* Attachments */}
          {req.attachments.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><FileText size={13} />Attachments</h4>
              {req.attachments.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 mb-2">
                  <FileText size={13} className="text-blue-500" />
                  <span className="text-sm text-slate-700 flex-1">{f}</span>
                  <button className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Download size={10} />Download</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side — Approval flow */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-800 text-sm mb-4">Approval Flow</h4>
            <div className="relative pl-4">
              <div className="absolute left-4 top-3 bottom-3 w-px bg-slate-200" />
              {/* Employee submitted */}
              <div className="relative flex items-start gap-3 mb-4">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 z-10 -ml-2.5">
                  <span className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Employee Submitted</p>
                  <p className="text-[10px] text-slate-400">{req.employeeName}</p>
                  <p className="text-[10px] text-slate-400">{req.submittedAt?.slice(0,10)}</p>
                </div>
              </div>
              {req.approvalSteps.map((step) => {
                const dotColor = step.status === "APPROVED" ? "bg-emerald-500" : step.status === "REJECTED" ? "bg-red-500" : step.status === "PENDING" ? "bg-amber-400" : "bg-slate-300";
                return (
                  <div key={step.step} className="relative flex items-start gap-3 mb-4">
                    <div className={`w-5 h-5 rounded-full ${dotColor} flex items-center justify-center flex-shrink-0 z-10 -ml-2.5`}>
                      <span className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{step.role} Review</p>
                      <p className="text-[10px] text-slate-400">{step.approver}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${step.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : step.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{step.status}</span>
                      {step.comment && <p className="text-[10px] text-slate-500 mt-1 italic">"{step.comment}"</p>}
                    </div>
                  </div>
                );
              })}
              {(req.status === "APPROVED" || req.status === "COMPLETED") && (
                <div className="relative flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 z-10 -ml-2.5">
                    <span className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Leave Approved</p>
                    <p className="text-[10px] text-slate-400">Balance updated · Attendance flagged</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main LeavePage ─────────────────────────────────────────────────────────
export default function LeavePage() {
  const [subPage, setSubPage] = useState<SubPage>("dashboard");
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_REQUESTS);
  const [selectedReq, setSelectedReq] = useState<LeaveRequest | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);
  const [isManager] = useState(true);
  const [activeTypeTab, setActiveTypeTab] = useState<"list" | "form">("list");

  const onFeedback = useCallback((d: ActionFeedbackData) => setFeedback(d), []);
  const onDismiss = useCallback(() => setFeedback(null), []);

  function handleApplySubmit(req: LeaveRequest) {
    setRequests(prev => [req, ...prev]);
    onFeedback({
      type: "success", title: "Leave Request Submitted",
      message: "Your request is now pending manager approval.",
      ref: req.id, refLabel: "Request ID",
      actions: [
        { label: "View Request", onClick: () => { setSelectedReq(req); setSubPage("detail"); }, primary: true },
        { label: "Close", onClick: () => setSubPage("dashboard") },
      ],
    });
  }

  function handleApprove(req: LeaveRequest) {
    setRequests(prev => prev.map(r => r.id === req.id ? {
      ...r, status: "APPROVED",
      approvalSteps: r.approvalSteps.map(s => s.step === 1 ? { ...s, status: "APPROVED" as const, date: new Date().toISOString().slice(0,10), time: "now" } : s),
    } : r));
    const updated = { ...req, status: "APPROVED" as const };
    setSelectedReq(updated);
    onFeedback({
      type: "approval", title: "Leave Approved",
      message: `${req.employeeName}'s ${req.typeName} has been approved.`,
      ref: req.id, refLabel: "Request ID",
      amount: `${req.workingDays} working day${req.workingDays !== 1 ? "s" : ""}`,
      actions: [{ label: "Done", onClick: () => {}, primary: true }],
    });
  }

  function handleReject(req: LeaveRequest, comment: string) {
    setRequests(prev => prev.map(r => r.id === req.id ? {
      ...r, status: "REJECTED",
      approvalSteps: r.approvalSteps.map(s => s.step === 1 ? { ...s, status: "REJECTED" as const, comment, date: new Date().toISOString().slice(0,10) } : s),
    } : r));
    const updated = { ...req, status: "REJECTED" as const };
    setSelectedReq(updated);
    onFeedback({
      type: "error", title: "Leave Rejected",
      message: `${req.employeeName}'s request has been rejected.`,
      ref: req.id,
      actions: [{ label: "Done", onClick: () => {}, primary: true }],
    });
  }

  const pending = requests.filter(r => r.status === "PENDING_MANAGER_APPROVAL" || r.status === "PENDING_DIRECTOR_APPROVAL");
  const approved = requests.filter(r => r.status === "APPROVED" || r.status === "COMPLETED");
  const myRequests = requests.filter(r => r.employeeId === CURRENT_EMPLOYEE.id);

  // ── Sub-page: Apply ──────────────────────────────────────────────────────
  if (subPage === "apply") {
    return (
      <>
        <ApplyLeaveForm onBack={() => setSubPage("dashboard")} onSubmit={req => handleApplySubmit(req)} />
        <ActionFeedback data={feedback} onDismiss={onDismiss} />
      </>
    );
  }

  // ── Sub-page: Detail ─────────────────────────────────────────────────────
  if (subPage === "detail" && selectedReq) {
    return (
      <>
        <RequestDetail
          req={requests.find(r => r.id === selectedReq.id) ?? selectedReq}
          onBack={() => { setSubPage(isManager && pending.some(p => p.id === selectedReq.id) ? "pending-approvals" : "my-leaves"); }}
          isManager={isManager}
          onApprove={() => handleApprove(requests.find(r => r.id === selectedReq.id) ?? selectedReq)}
          onReject={comment => handleReject(requests.find(r => r.id === selectedReq.id) ?? selectedReq, comment)}
        />
        <ActionFeedback data={feedback} onDismiss={onDismiss} />
      </>
    );
  }

  // ── Sidebar nav ──────────────────────────────────────────────────────────
  const NAV: { id: SubPage; label: string; Icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard",         label: "Dashboard",       Icon: BarChart3         },
    { id: "apply",             label: "Apply Leave",     Icon: Plus              },
    { id: "my-leaves",         label: "My Leaves",       Icon: List              },
    { id: "calendar",          label: "Calendar",        Icon: CalendarDays      },
    { id: "balance",           label: "Leave Balance",   Icon: TrendingUp        },
    { id: "pending-approvals", label: "Pending Approvals", Icon: Clock, badge: pending.length },
    { id: "history",           label: "History",         Icon: BookOpen          },
    { id: "types",             label: "Leave Types",     Icon: FileText          },
    { id: "settings",          label: "Settings",        Icon: Settings2         },
  ];

  return (
    <>
      <div className="flex h-full overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col py-4 overflow-y-auto">
          <div className="px-4 mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Management</p>
          </div>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setSubPage(n.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors relative ${subPage === n.id ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"} ${n.id === "apply" ? "mx-3 mt-1 mb-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 border-none px-3 py-2.5 justify-center" : ""}`}>
              {n.id !== "apply" && <n.Icon size={14} className="flex-shrink-0" />}
              {n.id === "apply" && <Plus size={14} />}
              {n.label}
              {n.badge !== undefined && n.badge > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{n.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Dashboard ───────────────────────────────────────────────── */}
          {subPage === "dashboard" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Leave Dashboard</h2>
                  <p className="text-sm text-slate-500 mt-0.5">2026 · {CURRENT_EMPLOYEE.name}</p>
                </div>
                <button onClick={() => setSubPage("apply")}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition-colors">
                  <Plus size={13} /> Apply Leave
                </button>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Pending Requests",   val: pending.length,    bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200"   },
                  { label: "Approved (Year)",     val: approved.length,   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
                  { label: "On Leave Today",      val: 0,                 bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200"  },
                  { label: "Days Used (Year)",    val: MOCK_BALANCES.reduce((s,b) => s + b.used, 0), bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
                ].map(k => (
                  <div key={k.label} className={`${k.bg} border ${k.border} rounded-xl px-4 py-3`}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{k.label}</p>
                    <p className={`text-2xl font-black ${k.text} mt-1`} style={{ fontFamily: "var(--font-display)" }}>{k.val}</p>
                  </div>
                ))}
              </div>

              {/* Balance cards */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Leave Balance by Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_BALANCES.map(b => {
                    const pct = Math.round(((b.entitlement - b.used) / b.entitlement) * 100);
                    return (
                      <div key={b.typeId} className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-slate-800">{b.typeName}</p>
                          <span className="text-xs text-slate-400">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full mb-3">
                          <div className={`h-full rounded-full ${pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-center">
                          {[
                            { label: "Total",  val: b.entitlement + b.carryForward, col: "text-slate-700" },
                            { label: "Used",   val: b.used,     col: "text-orange-600" },
                            { label: "Pending",val: b.pending,  col: "text-amber-600"  },
                            { label: "Avail",  val: b.available,col: "text-emerald-600" },
                          ].map(c => (
                            <div key={c.label}>
                              <p className={`text-sm font-black ${c.col}`}>{c.val}</p>
                              <p className="text-[9px] text-slate-400">{c.label}</p>
                            </div>
                          ))}
                        </div>
                        {b.expiry && <p className="text-[10px] text-slate-400 mt-2">Expires {b.expiry}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent requests */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-700">Recent Requests</h3>
                  <button onClick={() => setSubPage("my-leaves")} className="text-xs text-blue-600 hover:underline">View all</button>
                </div>
                <div className="space-y-2">
                  {myRequests.slice(0, 3).map(r => (
                    <div key={r.id} onClick={() => { setSelectedReq(r); setSubPage("detail"); }}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <CalendarDays size={14} className="text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800">{r.typeName}</p>
                          <StatusPill status={r.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{r.startDate} – {r.endDate} · {r.workingDays} day{r.workingDays !== 1 ? "s" : ""}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── My Leaves ───────────────────────────────────────────────── */}
          {subPage === "my-leaves" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Leaves</h2>
                <button onClick={() => setSubPage("apply")} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors"><Plus size={13} /> Apply Leave</button>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Request ID","Leave Type","Start","End","Days","Reason","Status","Submitted","Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {myRequests.length === 0 ? (
                      <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-slate-400">No leave requests found.</td></tr>
                    ) : myRequests.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold">{r.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{r.typeName}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{r.startDate}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{r.endDate}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">{r.workingDays}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-40 truncate">{r.reason}</td>
                        <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                        <td className="px-4 py-3 text-xs text-slate-400">{r.submittedAt?.slice(0,10) ?? "Draft"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setSelectedReq(r); setSubPage("detail"); }} className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors" title="View">
                              <Eye size={12} className="text-blue-600" />
                            </button>
                            {(r.status === "DRAFT" || r.status === "SUBMITTED") && (
                              <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors" title="Edit"><Edit2 size={12} className="text-slate-500" /></button>
                            )}
                            {r.status === "PENDING_MANAGER_APPROVAL" && (
                              <button onClick={() => {
                                setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status: "CANCELLED" } : x));
                                onFeedback({ type: "warning", title: "Request Cancelled", ref: r.id });
                              }} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors" title="Cancel"><XCircle size={12} className="text-red-400" /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Calendar ───────────────────────────────────────────────── */}
          {subPage === "calendar" && (
            <div className="p-6 space-y-5">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Leave Calendar</h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-slate-800 text-base">September 2026</h3>
                  <div className="flex gap-1">
                    {["Month","Week","List"].map(v => (
                      <button key={v} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${v === "Month" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                    <div key={d} className="bg-white px-2 py-2 text-[10px] font-bold text-slate-400 uppercase text-center">{d}</div>
                  ))}
                  {/* Sep 2026 starts on Tuesday = offset 2 */}
                  {Array.from({ length: 2 }, (_, i) => <div key={`e${i}`} className="bg-white" />)}
                  {Array.from({ length: 30 }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `2026-09-${String(day).padStart(2,"0")}`;
                    const req = requests.find(r => r.startDate <= dateStr && r.endDate >= dateStr);
                    const isWeekend = (i + 2) % 7 === 0 || (i + 2) % 7 === 6;
                    return (
                      <div key={day} className={`bg-white px-2 py-2 min-h-14 ${isWeekend ? "bg-slate-50/50" : ""}`}>
                        <span className={`text-xs font-semibold ${day === 11 ? "w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center" : "text-slate-600"}`}>{day}</span>
                        {req && (
                          <div className={`mt-1 text-[9px] font-semibold px-1 py-0.5 rounded truncate ${statusCfg[req.status].bg} ${statusCfg[req.status].text}`}>
                            {req.employeeName.split(" ")[0]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  {Object.entries(statusCfg).filter(([k]) => ["PENDING_MANAGER_APPROVAL","APPROVED","REJECTED"].includes(k)).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded ${v.bg} border`} />
                      <span className="text-xs text-slate-500">{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Balance ─────────────────────────────────────────────────── */}
          {subPage === "balance" && (
            <div className="p-6 space-y-5">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Leave Balance</h2>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Leave Type","Entitlement","Carry Fwd","Used","Pending","Available","Expiry","Policy"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_BALANCES.map(b => (
                      <tr key={b.typeId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">{b.typeName}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{b.entitlement}</td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-semibold">{b.carryForward}</td>
                        <td className="px-4 py-3 text-sm text-orange-600 font-semibold">{b.used}</td>
                        <td className="px-4 py-3 text-sm text-amber-600 font-semibold">{b.pending}</td>
                        <td className="px-4 py-3 text-sm font-black text-emerald-700">{b.available}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{b.expiry ?? "—"}</td>
                        <td className="px-4 py-3"><span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Standard</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Pending Approvals ────────────────────────────────────────── */}
          {subPage === "pending-approvals" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Pending Approvals</h2>
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold">{pending.length} pending</span>
              </div>
              {pending.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                  <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">All caught up!</p>
                  <p className="text-xs text-slate-400 mt-1">No pending leave requests require your approval.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {["Request ID","Employee","Leave Type","Dates","Days","Department","Submitted","Priority","Status","Actions"].map(h => (
                          <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {pending.map(r => (
                        <tr key={r.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-3 py-3 font-mono text-xs text-blue-700 font-semibold">{r.id}</td>
                          <td className="px-3 py-3">
                            <p className="text-sm font-semibold text-slate-800">{r.employeeName}</p>
                            <p className="text-[10px] text-slate-400">{r.employeeDesignation}</p>
                          </td>
                          <td className="px-3 py-3 text-sm text-slate-700">{r.typeName}</td>
                          <td className="px-3 py-3 text-xs text-slate-600">{r.startDate} – {r.endDate}</td>
                          <td className="px-3 py-3 text-xs font-bold text-slate-700">{r.workingDays}</td>
                          <td className="px-3 py-3 text-xs text-slate-600">{r.employeeDepartment}</td>
                          <td className="px-3 py-3 text-xs text-slate-400">{r.submittedAt?.slice(0,10)}</td>
                          <td className="px-3 py-3"><span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">Normal</span></td>
                          <td className="px-3 py-3"><StatusPill status={r.status} /></td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setSelectedReq(r); setSubPage("detail"); }} className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">View</button>
                              <button onClick={() => handleApprove(r)} className="px-2.5 py-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors font-medium flex items-center gap-1"><CheckCircle2 size={10} />Approve</button>
                              <button onClick={() => handleReject(r, "Rejected from approvals list.")} className="px-2.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium flex items-center gap-1"><XCircle size={10} />Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── History ─────────────────────────────────────────────────── */}
          {subPage === "history" && (
            <div className="p-6 space-y-5">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Leave History</h2>
              <div className="space-y-3">
                {requests.filter(r => ["APPROVED","REJECTED","CANCELLED","COMPLETED"].includes(r.status)).map(r => (
                  <div key={r.id} onClick={() => { setSelectedReq(r); setSubPage("detail"); }}
                    className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-slate-400">{r.id}</span>
                        <span className="text-sm font-semibold text-slate-800">{r.typeName}</span>
                        <StatusPill status={r.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{r.startDate} – {r.endDate} · {r.workingDays} day{r.workingDays !== 1 ? "s" : ""} · {r.employeeName}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 ml-auto flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Leave Types ─────────────────────────────────────────────── */}
          {subPage === "types" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Leave Types</h2>
                <button onClick={() => setActiveTypeTab(activeTypeTab === "list" ? "form" : "list")} className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
                  <Plus size={13} /> {activeTypeTab === "form" ? "Back to List" : "New Leave Type"}
                </button>
              </div>
              {activeTypeTab === "form" ? (
                <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-2xl space-y-4">
                  <h3 className="font-bold text-slate-800">New Leave Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Type Name", placeholder: "e.g. Annual Leave" },
                      { label: "Code",      placeholder: "e.g. AL" },
                      { label: "Annual Entitlement (days)", placeholder: "20" },
                      { label: "Max Carry Forward (days)",  placeholder: "5" },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">{f.label}</label>
                        <input placeholder={f.placeholder} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Paid Leave",          key: "paid"             },
                      { label: "Carry Forward",        key: "carryFwd"         },
                      { label: "Half-Day Allowed",     key: "halfDay"          },
                      { label: "Requires Document",    key: "reqDoc"           },
                      { label: "Requires Reason",      key: "reqReason"        },
                      { label: "Approval Required",    key: "reqApproval"      },
                    ].map(t => (
                      <label key={t.key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-slate-700">{t.label}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={() => { setActiveTypeTab("list"); onFeedback({ type: "success", title: "Leave Type Created", message: "New leave type has been saved." }); }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl font-semibold transition-colors">Save Leave Type</button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {["Code","Name","Entitlement","Paid","Half-Day","Doc Req","Reason Req","Carry Fwd","Status","Actions"].map(h => (
                          <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {LEAVE_TYPES.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-3"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.color}`}>{t.code}</span></td>
                          <td className="px-3 py-3 text-sm font-semibold text-slate-800">{t.name}</td>
                          <td className="px-3 py-3 text-sm text-slate-700">{t.annualEntitlement} days</td>
                          <td className="px-3 py-3">{t.paid ? <CheckCircle2 size={13} className="text-emerald-500" /> : <XCircle size={13} className="text-slate-300" />}</td>
                          <td className="px-3 py-3">{t.halfDayAllowed ? <CheckCircle2 size={13} className="text-emerald-500" /> : <XCircle size={13} className="text-slate-300" />}</td>
                          <td className="px-3 py-3">{t.requiresDocument ? <CheckCircle2 size={13} className="text-amber-500" /> : <XCircle size={13} className="text-slate-300" />}</td>
                          <td className="px-3 py-3">{t.requiresReason ? <CheckCircle2 size={13} className="text-amber-500" /> : <XCircle size={13} className="text-slate-300" />}</td>
                          <td className="px-3 py-3">{t.carryForward ? <CheckCircle2 size={13} className="text-blue-500" /> : <XCircle size={13} className="text-slate-300" />}</td>
                          <td className="px-3 py-3">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{t.active ? "Active" : "Inactive"}</span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><Edit2 size={12} className="text-slate-500" /></button>
                              <button className="p-1 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={12} className="text-red-400" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Settings ─────────────────────────────────────────────────── */}
          {subPage === "settings" && (
            <div className="p-6 space-y-5">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Leave Settings</h2>
              <div className="grid grid-cols-2 gap-4 max-w-3xl">
                {[
                  { title: "Leave Year", desc: "Configure start/end of leave year", icon: CalendarDays,  detail: "1 January – 31 December" },
                  { title: "Accrual",    desc: "Monthly accrual settings",           icon: TrendingUp,   detail: "Annual entitlement / 12" },
                  { title: "Carry Forward", desc: "End-of-year carry forward rules", icon: RefreshCw,    detail: "Max 5 days, expires 31 March" },
                  { title: "Approval Rules", desc: "Configure approval workflows",   icon: Shield,       detail: "Manager → Director where configured" },
                  { title: "Working Days", desc: "Set working week configuration",   icon: CalendarDays, detail: "Mon – Fri" },
                  { title: "Half-Day Rules", desc: "AM / PM session settings",       icon: Clock,        detail: "AM: 08:30–13:00 · PM: 13:00–17:30" },
                  { title: "Public Holidays", desc: "Manage holiday calendar",       icon: CalendarDays, detail: "Sri Lanka national holidays" },
                  { title: "Notification Rules", desc: "Email / push notification settings", icon: MessageSquare, detail: "Manager notified on submission" },
                  { title: "Cancellation Rules", desc: "Leave cancellation policy",  icon: XCircle,      detail: "Up to 24h before start date" },
                  { title: "Escalation Rules", desc: "Overdue approval escalation",  icon: AlertTriangle,detail: "Escalate after 48h" },
                ].map(s => (
                  <button key={s.title} className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center gap-3 mb-1.5">
                      <s.icon size={15} className="text-slate-500 flex-shrink-0" />
                      <p className="text-sm font-bold text-slate-800">{s.title}</p>
                    </div>
                    <p className="text-xs text-slate-500 pl-6">{s.desc}</p>
                    <p className="text-xs font-medium text-blue-600 pl-6 mt-1">{s.detail}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 max-w-xl"><Shield size={10} /> Settings changes require Manager or Director permission. All changes are audited.</p>
            </div>
          )}

        </div>
      </div>
      <ActionFeedback data={feedback} onDismiss={onDismiss} />
    </>
  );
}
