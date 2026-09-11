export type LeaveStatus =
  | "DRAFT" | "SUBMITTED" | "PENDING_MANAGER_APPROVAL" | "PENDING_DIRECTOR_APPROVAL"
  | "CHANGES_REQUESTED" | "APPROVED" | "REJECTED" | "CANCELLED" | "WITHDRAWN" | "COMPLETED";

export type LeaveReconciliationStatus = "UNRECONCILED" | "RECONCILED";

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  paid: boolean;
  annualEntitlement: number;
  carryForward: boolean;
  maxCarryForward: number;
  requiresDocument: boolean;
  requiresReason: boolean;
  halfDayAllowed: boolean;
  approvalRequired: boolean;
  active: boolean;
  color: string;
}

export interface LeaveBalance {
  typeId: string;
  typeName: string;
  entitlement: number;
  carryForward: number;
  used: number;
  pending: number;
  available: number;
  expiry?: string;
}

export interface LeaveApprovalStep {
  step: number;
  role: string;
  approver: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "SKIPPED";
  date?: string;
  time?: string;
  comment?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDesignation: string;
  employeeDepartment: string;
  employeeBranch: string;
  typeId: string;
  typeName: string;
  startDate: string;
  endDate: string;
  calendarDays: number;
  workingDays: number;
  halfDay?: boolean;
  halfDaySession?: "AM" | "PM";
  reason: string;
  attachments: string[];
  status: LeaveStatus;
  approvalSteps: LeaveApprovalStep[];
  submittedAt?: string;
  updatedAt: string;
  createdAt: string;
  balanceBefore: number;
  balanceAfter: number;
}

export const LEAVE_TYPES: LeaveType[] = [
  { id: "LT-01", name: "Annual Leave",       code: "AL",  description: "Standard paid annual leave",          paid: true,  annualEntitlement: 20, carryForward: true,  maxCarryForward: 5,  requiresDocument: false, requiresReason: false, halfDayAllowed: true,  approvalRequired: true,  active: true,  color: "bg-blue-100 text-blue-700"    },
  { id: "LT-02", name: "Casual Leave",        code: "CL",  description: "Short-notice leave for personal use", paid: true,  annualEntitlement: 10, carryForward: false, maxCarryForward: 0,  requiresDocument: false, requiresReason: true,  halfDayAllowed: true,  approvalRequired: true,  active: true,  color: "bg-teal-100 text-teal-700"    },
  { id: "LT-03", name: "Medical Leave",       code: "ML",  description: "Leave for illness with medical cert", paid: true,  annualEntitlement: 14, carryForward: false, maxCarryForward: 0,  requiresDocument: true,  requiresReason: true,  halfDayAllowed: true,  approvalRequired: true,  active: true,  color: "bg-red-100 text-red-700"      },
  { id: "LT-04", name: "Emergency Leave",     code: "EL",  description: "Urgent unforeseen circumstances",     paid: true,  annualEntitlement: 3,  carryForward: false, maxCarryForward: 0,  requiresDocument: false, requiresReason: true,  halfDayAllowed: false, approvalRequired: true,  active: true,  color: "bg-orange-100 text-orange-700"},
  { id: "LT-05", name: "Maternity Leave",     code: "MTL", description: "Paid leave for new mothers",          paid: true,  annualEntitlement: 84, carryForward: false, maxCarryForward: 0,  requiresDocument: true,  requiresReason: false, halfDayAllowed: false, approvalRequired: true,  active: true,  color: "bg-pink-100 text-pink-700"    },
  { id: "LT-06", name: "Paternity Leave",     code: "PTL", description: "Paid leave for new fathers",          paid: true,  annualEntitlement: 3,  carryForward: false, maxCarryForward: 0,  requiresDocument: true,  requiresReason: false, halfDayAllowed: false, approvalRequired: true,  active: true,  color: "bg-indigo-100 text-indigo-700"},
  { id: "LT-07", name: "No-Pay Leave",        code: "NPL", description: "Unpaid leave for special cases",      paid: false, annualEntitlement: 30, carryForward: false, maxCarryForward: 0,  requiresDocument: false, requiresReason: true,  halfDayAllowed: true,  approvalRequired: true,  active: true,  color: "bg-slate-100 text-slate-600"  },
  { id: "LT-08", name: "Study Leave",         code: "SL",  description: "Leave for examinations/studies",      paid: true,  annualEntitlement: 5,  carryForward: false, maxCarryForward: 0,  requiresDocument: true,  requiresReason: true,  halfDayAllowed: false, approvalRequired: true,  active: true,  color: "bg-violet-100 text-violet-700"},
  { id: "LT-09", name: "Compassionate Leave", code: "COL", description: "Bereavement / family emergency",      paid: true,  annualEntitlement: 5,  carryForward: false, maxCarryForward: 0,  requiresDocument: false, requiresReason: true,  halfDayAllowed: false, approvalRequired: true,  active: true,  color: "bg-slate-200 text-slate-700"  },
];

export const MOCK_BALANCES: LeaveBalance[] = [
  { typeId: "LT-01", typeName: "Annual Leave",       entitlement: 20, carryForward: 2, used: 6, pending: 2, available: 14, expiry: "2026-12-31" },
  { typeId: "LT-02", typeName: "Casual Leave",        entitlement: 10, carryForward: 0, used: 3, pending: 0, available: 7  },
  { typeId: "LT-03", typeName: "Medical Leave",       entitlement: 14, carryForward: 0, used: 2, pending: 1, available: 11 },
  { typeId: "LT-04", typeName: "Emergency Leave",     entitlement: 3,  carryForward: 0, used: 0, pending: 0, available: 3  },
  { typeId: "LT-07", typeName: "No-Pay Leave",        entitlement: 30, carryForward: 0, used: 0, pending: 0, available: 30 },
  { typeId: "LT-08", typeName: "Study Leave",         entitlement: 5,  carryForward: 0, used: 0, pending: 0, available: 5  },
];

export const MOCK_REQUESTS: LeaveRequest[] = [
  {
    id: "LR-2026-000001",
    employeeId: "EMP-001", employeeName: "Amali De Silva", employeeDesignation: "Software Engineer",
    employeeDepartment: "Engineering", employeeBranch: "Colombo HQ",
    typeId: "LT-01", typeName: "Annual Leave",
    startDate: "2026-09-18", endDate: "2026-09-19", calendarDays: 2, workingDays: 2,
    reason: "Family vacation — taking the kids for a school holiday trip.",
    attachments: [],
    status: "PENDING_MANAGER_APPROVAL",
    approvalSteps: [
      { step: 1, role: "Manager",  approver: "Priya Jayawardena", status: "PENDING" },
    ],
    submittedAt: "2026-09-11T09:30:00", updatedAt: "2026-09-11T09:30:00", createdAt: "2026-09-11T09:30:00",
    balanceBefore: 14, balanceAfter: 12,
  },
  {
    id: "LR-2026-000002",
    employeeId: "EMP-001", employeeName: "Amali De Silva", employeeDesignation: "Software Engineer",
    employeeDepartment: "Engineering", employeeBranch: "Colombo HQ",
    typeId: "LT-03", typeName: "Medical Leave",
    startDate: "2026-08-20", endDate: "2026-08-20", calendarDays: 1, workingDays: 1,
    reason: "Doctor appointment and follow-up.",
    attachments: ["medical-certificate.pdf"],
    status: "APPROVED",
    approvalSteps: [
      { step: 1, role: "Manager", approver: "Priya Jayawardena", status: "APPROVED", date: "2026-08-19", time: "16:00", comment: "Approved. Get well soon." },
    ],
    submittedAt: "2026-08-19T10:00:00", updatedAt: "2026-08-19T16:00:00", createdAt: "2026-08-19T10:00:00",
    balanceBefore: 12, balanceAfter: 11,
  },
  {
    id: "LR-2026-000003",
    employeeId: "EMP-001", employeeName: "Amali De Silva", employeeDesignation: "Software Engineer",
    employeeDepartment: "Engineering", employeeBranch: "Colombo HQ",
    typeId: "LT-02", typeName: "Casual Leave",
    startDate: "2026-07-14", endDate: "2026-07-14", calendarDays: 1, workingDays: 1,
    reason: "Personal errands that couldn't be scheduled outside work hours.",
    attachments: [],
    status: "REJECTED",
    approvalSteps: [
      { step: 1, role: "Manager", approver: "Priya Jayawardena", status: "REJECTED", date: "2026-07-12", time: "14:30", comment: "Project delivery sprint — team presence required on this date." },
    ],
    submittedAt: "2026-07-11T09:00:00", updatedAt: "2026-07-12T14:30:00", createdAt: "2026-07-11T09:00:00",
    balanceBefore: 7, balanceAfter: 7,
  },
];

export const statusCfg: Record<LeaveStatus, { label: string; bg: string; text: string; dot: string; icon: string }> = {
  DRAFT:                     { label: "Draft",                  bg: "bg-slate-100",   text: "text-slate-500",   dot: "bg-slate-400",   icon: "○" },
  SUBMITTED:                 { label: "Submitted",              bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-500",    icon: "→" },
  PENDING_MANAGER_APPROVAL:  { label: "Pending Manager",        bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500",   icon: "⏳" },
  PENDING_DIRECTOR_APPROVAL: { label: "Pending Director",       bg: "bg-orange-50",   text: "text-orange-700",  dot: "bg-orange-500",  icon: "⏳" },
  CHANGES_REQUESTED:         { label: "Changes Requested",      bg: "bg-violet-50",   text: "text-violet-700",  dot: "bg-violet-500",  icon: "✏" },
  APPROVED:                  { label: "Approved",               bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500", icon: "✓" },
  REJECTED:                  { label: "Rejected",               bg: "bg-red-50",      text: "text-red-700",     dot: "bg-red-500",     icon: "✗" },
  CANCELLED:                 { label: "Cancelled",              bg: "bg-slate-100",   text: "text-slate-500",   dot: "bg-slate-400",   icon: "×" },
  WITHDRAWN:                 { label: "Withdrawn",              bg: "bg-slate-100",   text: "text-slate-400",   dot: "bg-slate-300",   icon: "↩" },
  COMPLETED:                 { label: "Completed",              bg: "bg-teal-50",     text: "text-teal-700",    dot: "bg-teal-500",    icon: "✓✓"},
};

export function calcWorkingDays(start: string, end: string): { calendar: number; working: number } {
  if (!start || !end) return { calendar: 0, working: 0 };
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return { calendar: 0, working: 0 };
  let cal = 0, work = 0;
  const d = new Date(s);
  while (d <= e) {
    cal++;
    const day = d.getDay();
    if (day !== 0 && day !== 6) work++;
    d.setDate(d.getDate() + 1);
  }
  return { calendar: cal, working: work };
}
