interface Props {
  status: string;
  size?: "sm" | "md";
}

const statusMap: Record<string, { label: string; className: string }> = {
  // Employee
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  inactive: { label: "Inactive", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  "on-leave": { label: "On Leave", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  suspended: { label: "Suspended", className: "bg-red-50 text-red-700 border border-red-200" },
  // Attendance
  present: { label: "Present", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  absent: { label: "Absent", className: "bg-red-50 text-red-700 border border-red-200" },
  late: { label: "Late", className: "bg-orange-50 text-orange-700 border border-orange-200" },
  // Leave/Approval
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  // Invoice/Payment
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  overdue: { label: "Overdue", className: "bg-red-50 text-red-700 border border-red-200" },
  partial: { label: "Partial", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  // Project
  "in-progress": { label: "In Progress", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  planning: { label: "Planning", className: "bg-violet-50 text-violet-700 border border-violet-200" },
  "on-hold": { label: "On Hold", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  // Ticket
  open: { label: "Open", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  resolved: { label: "Resolved", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  closed: { label: "Closed", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  waiting: { label: "Waiting", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  // Lead
  new: { label: "New", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  qualified: { label: "Qualified", className: "bg-violet-50 text-violet-700 border border-violet-200" },
  negotiation: { label: "Negotiation", className: "bg-orange-50 text-orange-700 border border-orange-200" },
  proposal: { label: "Proposal", className: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
  won: { label: "Won", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  lost: { label: "Lost", className: "bg-red-50 text-red-700 border border-red-200" },
  // Task
  todo: { label: "To Do", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  done: { label: "Done", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  // Priority
  critical: { label: "Critical", className: "bg-red-50 text-red-700 border border-red-200" },
  high: { label: "High", className: "bg-orange-50 text-orange-700 border border-orange-200" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  low: { label: "Low", className: "bg-slate-100 text-slate-600 border border-slate-200" },
};

export default function StatusBadge({ status, size = "md" }: Props) {
  const cfg = statusMap[status?.toLowerCase()] ?? { label: status, className: "bg-slate-100 text-slate-600 border border-slate-200" };
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
