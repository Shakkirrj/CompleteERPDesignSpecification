import { useState, useCallback, useEffect } from "react";
import {
  LayoutDashboard, User, Clock, CalendarDays, Banknote, FileText,
  TrendingUp, CreditCard, Users, CheckSquare, FolderOpen, Bell,
  Settings, ChevronRight, LogIn, LogOut, AlertTriangle,
  CheckCircle2, XCircle, BarChart3, Briefcase, ListChecks,
  ClipboardList, Timer, Download, Eye, EyeOff, Star,
  MessageSquare, Plus, Loader2, Activity, Target, History, X,
  GitPullRequest, Zap,
} from "lucide-react";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";
import Avatar from "../../components/ui/Avatar";

// ─── Types ──────────────────────────────────────────────────────────────────
type Role = "EMPLOYEE" | "MANAGER" | "DIRECTOR" | "ACCOUNTANT";
type SubPage =
  | "dashboard" | "profile" | "attendance" | "leave" | "payroll"
  | "payslips" | "salary" | "commission" | "loans" | "timesheets"
  | "overtime" | "projects" | "tasks" | "documents" | "requests"
  | "notifications" | "performance" | "approvals" | "activity" | "settings"
  | "mgr-dashboard" | "mgr-attendance" | "mgr-leave" | "mgr-employees"
  | "mgr-projects" | "mgr-tasks" | "mgr-timesheets" | "mgr-overtime"
  | "mgr-payroll" | "mgr-reports";

// ─── Mock current user ───────────────────────────────────────────────────────
const USERS: Record<Role, {
  id: string; name: string; designation: string; department: string;
  branch: string; team: string; manager: string; email: string;
  phone: string; joinDate: string; avatar: string; status: string;
}> = {
  EMPLOYEE: { id: "EMP-042", name: "Kavinda Perera", designation: "Sr. Software Engineer", department: "Engineering", branch: "Colombo HQ", team: "Product Team", manager: "Dilshan Fernando", email: "kavinda@merncrest.lk", phone: "+94 77 123 4567", joinDate: "2023-06-15", avatar: "KP", status: "Active" },
  MANAGER:  { id: "EMP-010", name: "Dilshan Fernando", designation: "Engineering Manager", department: "Engineering", branch: "Colombo HQ", team: "Engineering", manager: "Priya Jayawardena", email: "dilshan@merncrest.lk", phone: "+94 77 234 5678", joinDate: "2021-03-01", avatar: "DF", status: "Active" },
  DIRECTOR: { id: "EMP-001", name: "Priya Jayawardena", designation: "Operations Director", department: "Operations", branch: "Colombo HQ", team: "Leadership", manager: "CEO", email: "priya@merncrest.lk", phone: "+94 77 345 6789", joinDate: "2019-01-10", avatar: "PJ", status: "Active" },
  ACCOUNTANT:{ id: "EMP-022", name: "Rajith Kumara", designation: "Sr. Accountant", department: "Finance", branch: "Colombo HQ", team: "Finance Team", manager: "Priya Jayawardena", email: "rajith@merncrest.lk", phone: "+94 77 456 7890", joinDate: "2022-08-20", avatar: "RK", status: "Active" },
};

const SALARY_DATA: Record<Role, { basic: number; transport: number; housing: number; meal: number; commission: number; overtime: number; gross: number; epf: number; paye: number; net: number }> = {
  EMPLOYEE:   { basic: 185000, transport: 12000, housing: 18000, meal: 8000, commission: 13500, overtime: 12000, gross: 248500, epf: 14800, paye: 0,    net: 233700 },
  MANAGER:    { basic: 265000, transport: 18000, housing: 25000, meal: 10000, commission: 23200, overtime: 7200, gross: 348400, epf: 21200, paye: 5904, net: 321296 },
  DIRECTOR:   { basic: 380000, transport: 20000, housing: 35000, meal: 12000, commission: 67200, overtime: 0,    gross: 514200, epf: 30400, paye: 15852, net: 467948 },
  ACCOUNTANT: { basic: 175000, transport: 12000, housing: 15000, meal: 8000, commission: 0,     overtime: 0,    gross: 210000, epf: 14000, paye: 0,    net: 196000 },
};

const PAYSLIPS = [
  { period: "September 2026", gross: 248500, deductions: 14800, net: 233700, date: "2026-09-30", status: "Pending" },
  { period: "August 2026",    gross: 248500, deductions: 14800, net: 233700, date: "2026-08-31", status: "Paid" },
  { period: "July 2026",      gross: 236000, deductions: 14800, net: 221200, date: "2026-07-31", status: "Paid" },
  { period: "June 2026",      gross: 236000, deductions: 14800, net: 221200, date: "2026-06-30", status: "Paid" },
];

const MY_ATTENDANCE = [
  { date: "2026-09-11", shift: "Standard", checkIn: "08:58", checkOut: "18:10", hours: "9h 12m", late: "—", ot: "1h 10m", status: "Present" },
  { date: "2026-09-10", shift: "Standard", checkIn: "09:15", checkOut: "18:05", hours: "8h 50m", late: "15m",  ot: "—",     status: "Late"    },
  { date: "2026-09-09", shift: "Standard", checkIn: "08:52", checkOut: "17:58", hours: "9h 06m", late: "—",   ot: "—",     status: "Present" },
  { date: "2026-09-08", shift: "Standard", checkIn: "08:45", checkOut: "18:30", hours: "9h 45m", late: "—",   ot: "1h 30m",status: "Present" },
  { date: "2026-09-05", shift: "Standard", checkIn: "—",     checkOut: "—",     hours: "—",       late: "—",   ot: "—",     status: "On Leave"},
  { date: "2026-09-04", shift: "Standard", checkIn: "08:59", checkOut: "18:02", hours: "9h 03m", late: "—",   ot: "—",     status: "Present" },
  { date: "2026-09-03", shift: "Standard", checkIn: "08:55", checkOut: "18:00", hours: "9h 05m", late: "—",   ot: "—",     status: "Present" },
];

const TEAM_MEMBERS = [
  { id: "EMP-042", name: "Kavinda Perera",    designation: "Sr. Software Eng.", dept: "Engineering", status: "Present", tasks: 5, leave: 0 },
  { id: "EMP-043", name: "Amali De Silva",    designation: "Software Engineer",  dept: "Engineering", status: "Present", tasks: 3, leave: 0 },
  { id: "EMP-044", name: "Nuwan Rathnayake",  designation: "Software Engineer",  dept: "Engineering", status: "Late",    tasks: 4, leave: 0 },
  { id: "EMP-045", name: "Sandali Perera",    designation: "QA Engineer",        dept: "Engineering", status: "On Leave",tasks: 0, leave: 1 },
  { id: "EMP-046", name: "Tharanga Kumara",   designation: "DevOps Engineer",    dept: "Engineering", status: "Present", tasks: 6, leave: 0 },
  { id: "EMP-047", name: "Hasini Wickrama",   designation: "Frontend Engineer",  dept: "Engineering", status: "Remote",  tasks: 4, leave: 0 },
];

const PENDING_LEAVE = [
  { id: "LR-2026-000003", emp: "Amali De Silva",   type: "Medical Leave", start: "2026-09-15", end: "2026-09-15", days: 1, submitted: "2026-09-11" },
  { id: "LR-2026-000004", emp: "Nuwan Rathnayake", type: "Annual Leave",  start: "2026-09-20", end: "2026-09-22", days: 3, submitted: "2026-09-10" },
];

const MY_TASKS = [
  { id: "TSK-001", title: "ERP Phase 3 API development",         project: "Lanka Retail ERP", priority: "high",   status: "in-progress", due: "2026-09-18", est: 16, actual: 8  },
  { id: "TSK-002", title: "Fix dashboard performance issue",      project: "MernCrest ERP",   priority: "high",   status: "in-progress", due: "2026-09-12", est: 4,  actual: 2  },
  { id: "TSK-003", title: "Write unit tests for payment module",  project: "Lanka Retail ERP", priority: "medium", status: "todo",        due: "2026-09-20", est: 8,  actual: 0  },
  { id: "TSK-004", title: "Code review — auth service PR",        project: "Core Platform",    priority: "medium", status: "todo",        due: "2026-09-13", est: 2,  actual: 0  },
  { id: "TSK-005", title: "Deploy staging environment",           project: "MernCrest ERP",   priority: "low",    status: "completed",   due: "2026-09-10", est: 3,  actual: 3  },
];

const MY_PROJECTS = [
  { id: "PRJ-2025-001", name: "Lanka Retail ERP Implementation", client: "Lanka Retail PLC",  role: "Backend Dev", status: "In Progress", progress: 68, deadline: "2026-12-31", tasks: 24 },
  { id: "PRJ-2024-003", name: "Core Banking ERP",                client: "Ceylon Bank Ltd",   role: "Full Stack",  status: "Completed",   progress: 100,deadline: "2024-09-30", tasks: 0  },
  { id: "PRJ-2025-007", name: "HR Management System",            client: "Sampath Bank PLC",  role: "Backend Dev", status: "In Progress", progress: 45, deadline: "2027-01-31", tasks: 12 },
];

const MY_REQUESTS = [
  { id: "REQ-2026-001", type: "Leave",               status: "PENDING_MANAGER_APPROVAL", created: "2026-09-11", approver: "Dilshan Fernando" },
  { id: "REQ-2026-002", type: "Attendance Correction",status: "APPROVED",                created: "2026-09-10", approver: "Dilshan Fernando" },
  { id: "REQ-2026-003", type: "Overtime",             status: "APPROVED",                created: "2026-09-08", approver: "Dilshan Fernando" },
  { id: "REQ-2026-004", type: "Profile Change",       status: "SUBMITTED",               created: "2026-09-05", approver: "HR Team"          },
];

const MY_NOTIFICATIONS = [
  { id: "N1", type: "success", title: "Leave Approved",          msg: "Your Annual Leave LR-2026-000002 has been approved",    time: "2 hours ago",  read: false },
  { id: "N2", type: "info",    title: "Task Assigned",           msg: "ERP Phase 3 API dev assigned to you by Dilshan",        time: "4 hours ago",  read: false },
  { id: "N3", type: "warning", title: "Timesheet Due",           msg: "September Week 2 timesheet submission due tomorrow",    time: "Yesterday",    read: true  },
  { id: "N4", type: "success", title: "Payslip Available",       msg: "August 2026 payslip is now available for download",     time: "Sep 1",        read: true  },
  { id: "N5", type: "info",    title: "Commission Calculated",   msg: "Service commission for Aug 2026 has been calculated",   time: "Sep 1",        read: true  },
];

const OVERTIME_DATA = [
  { date: "2026-09-11", project: "Lanka Retail ERP", hours: 1.17, reason: "Urgent API fix for client go-live", status: "PENDING", approvedBy: "—" },
  { date: "2026-09-08", project: "Lanka Retail ERP", hours: 1.5,  reason: "Sprint deadline delivery",          status: "APPROVED",approvedBy: "Dilshan Fernando" },
  { date: "2026-09-03", project: "Core Platform",    hours: 2.0,  reason: "Emergency patch deployment",        status: "APPROVED",approvedBy: "Dilshan Fernando" },
];

const TIMESHEET_DATA = [
  { date: "2026-09-11", project: "Lanka Retail ERP", task: "API Development",   start: "09:00", end: "12:30", hours: 3.5, billable: true,  status: "Draft"    },
  { date: "2026-09-11", project: "MernCrest ERP",    task: "Bug Fix",           start: "13:30", end: "18:00", hours: 4.5, billable: true,  status: "Draft"    },
  { date: "2026-09-10", project: "Lanka Retail ERP", task: "Code Review",       start: "09:00", end: "11:00", hours: 2.0, billable: false, status: "Submitted"},
  { date: "2026-09-10", project: "HR System",        task: "Module Integration",start: "11:30", end: "17:30", hours: 6.0, billable: true,  status: "Submitted"},
];

const MY_GOALS = [
  { id: "G1", title: "Complete ERP Phase 3 API development", kpi: "8 endpoints", target: "Sep 30", progress: 62, status: "On Track" },
  { id: "G2", title: "Achieve 90% task completion rate", kpi: "Rate", target: "Dec 31", progress: 82, status: "On Track" },
  { id: "G3", title: "Submit all timesheets on time", kpi: "100% on-time", target: "Dec 31", progress: 95, status: "Exceeding" },
  { id: "G4", title: "Complete AWS Solutions Architect cert", kpi: "Certification", target: "Nov 30", progress: 40, status: "At Risk" },
];

const MY_APPROVALS = [
  { id: "APR-001", type: "Leave Request",        ref: "LR-2026-000003", from: "Amali De Silva",   status: "PENDING", submitted: "2026-09-11", detail: "Annual Leave · Sep 15–15 · 1 day" },
  { id: "APR-002", type: "Overtime Request",     ref: "OT-2026-000012", from: "Nuwan Rathnayake", status: "PENDING", submitted: "2026-09-10", detail: "2.5 hours · Lanka Retail ERP" },
  { id: "APR-003", type: "Timesheet",            ref: "TS-2026-W36",    from: "Tharanga Kumara",  status: "PENDING", submitted: "2026-09-09", detail: "Week 36 · 38.5 hours" },
  { id: "APR-004", type: "Attendance Correction",ref: "ATT-2026-000045",from: "Hasini Wickrama",  status: "APPROVED",submitted: "2026-09-08", detail: "Sep 8 — Forgot check-out" },
];

const MY_ACTIVITY = [
  { time: "2026-09-11 09:02", action: "Checked In",          detail: "Standard Shift",          type: "attendance" },
  { time: "2026-09-11 08:55", action: "Task Started",         detail: "ERP Phase 3 API dev",     type: "task"       },
  { time: "2026-09-10 18:05", action: "Checked Out",          detail: "9h 50m worked",           type: "attendance" },
  { time: "2026-09-10 17:30", action: "Timesheet Submitted",  detail: "Week 37 · 16h logged",    type: "timesheet"  },
  { time: "2026-09-10 14:20", action: "Leave Approved",       detail: "Annual Leave · Sep 20–22",type: "leave"      },
  { time: "2026-09-09 12:00", action: "Commission Logged",    detail: "Sampath Bank · LKR 18,000",type: "finance"   },
  { time: "2026-09-08 11:00", action: "Overtime Approved",    detail: "1.5h · Lanka Retail ERP", type: "overtime"   },
  { time: "2026-09-05 08:30", action: "On Leave",             detail: "Annual Leave",            type: "leave"      },
];

const TEAM_TASKS = [
  { id: "TSK-T01", title: "Code review — payment module PR",   assignee: "Kavinda Perera",   project: "Lanka Retail ERP", priority: "high",   status: "in-progress", due: "2026-09-12" },
  { id: "TSK-T02", title: "Write integration test suite",      assignee: "Amali De Silva",   project: "Lanka Retail ERP", priority: "medium", status: "todo",        due: "2026-09-15" },
  { id: "TSK-T03", title: "Update API documentation",          assignee: "Nuwan Rathnayake", project: "Core Platform",    priority: "low",    status: "todo",        due: "2026-09-18" },
  { id: "TSK-T04", title: "Deploy staging environment v2.4",   assignee: "Tharanga Kumara",  project: "MernCrest ERP",    priority: "high",   status: "completed",   due: "2026-09-10" },
  { id: "TSK-T05", title: "UI accessibility audit",            assignee: "Hasini Wickrama",  project: "HR System",        priority: "medium", status: "in-progress", due: "2026-09-16" },
];

const TEAM_TIMESHEETS = [
  { emp: "Kavinda Perera",   week: "Week 37", hours: 16.0, billable: 13.5, status: "Draft"    },
  { emp: "Amali De Silva",   week: "Week 37", hours: 38.5, billable: 35.0, status: "Submitted"},
  { emp: "Nuwan Rathnayake", week: "Week 37", hours: 40.0, billable: 37.5, status: "Approved" },
  { emp: "Tharanga Kumara",  week: "Week 37", hours: 42.0, billable: 40.0, status: "Approved" },
  { emp: "Sandali Perera",   week: "Week 37", hours: 0,    billable: 0,    status: "On Leave" },
  { emp: "Hasini Wickrama",  week: "Week 37", hours: 36.0, billable: 32.0, status: "Submitted"},
];

const TEAM_OVERTIME = [
  { emp: "Kavinda Perera",   date: "2026-09-11", project: "Lanka Retail ERP", hours: 1.17, reason: "Urgent API fix",      status: "PENDING"  },
  { emp: "Amali De Silva",   date: "2026-09-10", project: "HR System",        hours: 2.0,  reason: "Sprint deadline",      status: "APPROVED" },
  { emp: "Tharanga Kumara",  date: "2026-09-09", project: "MernCrest ERP",    hours: 3.0,  reason: "Staging deployment",   status: "APPROVED" },
  { emp: "Nuwan Rathnayake", date: "2026-09-08", project: "Core Platform",    hours: 1.5,  reason: "Bug hotfix",           status: "PENDING"  },
];

const TEAM_PROJECTS_DATA = [
  { id: "PRJ-001", name: "Lanka Retail ERP",   client: "Lanka Retail PLC", status: "In Progress", progress: 68, deadline: "2026-12-31", team: 4, tasks: 24 },
  { id: "PRJ-003", name: "HR Management System",client: "Sampath Bank PLC",status: "In Progress", progress: 45, deadline: "2027-01-31", team: 3, tasks: 12 },
  { id: "PRJ-007", name: "Core Platform v3",   client: "MernCrest Internal",status: "In Progress",progress: 80, deadline: "2026-10-31", team: 5, tasks: 8  },
];

const COMMISSION_DATA = [
  { id: "COM-001", client: "Lanka Retail PLC", project: "Retail ERP", invoice: "INV-MC-2026-000012", basis: "Service", amount: 26400, status: "Paid",    date: "2026-09-01" },
  { id: "COM-002", client: "Sampath Bank PLC", project: "HR System",  invoice: "INV-MC-2026-000010", basis: "Service", amount: 18000, status: "Pending", date: "2026-09-03" },
];

const SALARY_HISTORY = [
  { from: "2026-01-01", to: "Present",   basic: 185000, reason: "Annual increment", approvedBy: "Priya Jayawardena" },
  { from: "2024-06-01", to: "2025-12-31",basic: 165000, reason: "Promotion to Senior", approvedBy: "Priya Jayawardena" },
  { from: "2023-06-15", to: "2024-05-31",basic: 145000, reason: "Initial package",   approvedBy: "HR Team" },
];

// ─── Helper: status color ────────────────────────────────────────────────────
function StatusPill({ status, size = "sm" }: { status: string; size?: "xs" | "sm" }) {
  const cfg: Record<string, string> = {
    Present: "bg-emerald-50 text-emerald-700", Late: "bg-amber-50 text-amber-700",
    Absent: "bg-red-50 text-red-700", "On Leave": "bg-blue-50 text-blue-700",
    Remote: "bg-violet-50 text-violet-700", "Half Day": "bg-teal-50 text-teal-700",
    APPROVED: "bg-emerald-50 text-emerald-700", REJECTED: "bg-red-50 text-red-700",
    PENDING_MANAGER_APPROVAL: "bg-amber-50 text-amber-700", SUBMITTED: "bg-blue-50 text-blue-700",
    PENDING: "bg-amber-50 text-amber-700", Paid: "bg-emerald-50 text-emerald-700",
    "in-progress": "bg-blue-50 text-blue-700", completed: "bg-teal-50 text-teal-700",
    todo: "bg-slate-100 text-slate-500", Draft: "bg-slate-100 text-slate-500",
    high: "bg-red-50 text-red-700", medium: "bg-amber-50 text-amber-700", low: "bg-slate-100 text-slate-500",
    "In Progress": "bg-blue-50 text-blue-700", Completed: "bg-teal-50 text-teal-700",
  };
  const cls = cfg[status] ?? "bg-slate-100 text-slate-500";
  return <span className={`font-semibold rounded-full px-2 py-0.5 ${size === "xs" ? "text-[9px]" : "text-[10px]"} ${cls}`}>{status}</span>;
}

function fmt(n: number) { return n.toLocaleString(); }

// ─── Payslip viewer ──────────────────────────────────────────────────────────
function PayslipViewer({ payslip, user, salary, onClose }: {
  payslip: typeof PAYSLIPS[0]; user: typeof USERS["EMPLOYEE"]; salary: typeof SALARY_DATA["EMPLOYEE"]; onClose: () => void;
}) {
  const [showAccount, setShowAccount] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <p className="font-bold text-slate-900">{payslip.period} Payslip</p>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-xs border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 transition-colors"><Download size={11} /> Download PDF</button>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">×</button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Company + Employee header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>MernCrest IT Services</p>
              <p className="text-xs text-slate-500 mt-0.5">No. 45, Union Place, Colombo 02 · merncrest.lk</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Payslip</p>
              <p className="text-sm font-bold text-blue-700 font-mono">PS-{payslip.period.replace(" ", "-")}</p>
              <p className="text-xs text-slate-500 mt-0.5">{payslip.period}</p>
            </div>
          </div>
          {/* Employee row */}
          <div className="bg-slate-50 rounded-xl px-5 py-4 grid grid-cols-3 gap-4 border border-slate-200">
            {[
              { label: "Employee", value: user.name },
              { label: "Employee ID", value: user.id },
              { label: "Designation", value: user.designation },
              { label: "Department", value: user.department },
              { label: "Branch",     value: user.branch },
              { label: "Pay Date",   value: payslip.date },
            ].map(r => (
              <div key={r.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                <p className="text-sm text-slate-800 font-medium mt-0.5">{r.value}</p>
              </div>
            ))}
          </div>
          {/* Earnings + Deductions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Earnings</p>
              <div className="space-y-1.5">
                {[
                  { label: "Basic Salary",         value: salary.basic     },
                  { label: "Transport Allowance",   value: salary.transport },
                  { label: "Housing Allowance",     value: salary.housing   },
                  { label: "Meal Allowance",        value: salary.meal      },
                  { label: "Service Commission",    value: salary.commission},
                  { label: "Overtime",              value: salary.overtime  },
                ].filter(r => r.value > 0).map(r => (
                  <div key={r.label} className="flex justify-between text-sm py-1 border-b border-slate-50">
                    <span className="text-slate-600">{r.label}</span>
                    <span className="font-mono font-medium text-slate-800">LKR {fmt(r.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm py-1.5 bg-emerald-50 rounded-lg px-2 font-semibold">
                  <span className="text-slate-800">Gross</span>
                  <span className="font-mono text-emerald-700">LKR {fmt(salary.gross)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Deductions</p>
              <div className="space-y-1.5">
                {[
                  { label: "EPF (8%)",  value: salary.epf  },
                  { label: "PAYE Tax",  value: salary.paye },
                ].filter(r => r.value > 0).map(r => (
                  <div key={r.label} className="flex justify-between text-sm py-1 border-b border-slate-50">
                    <span className="text-slate-600">{r.label}</span>
                    <span className="font-mono font-medium text-red-600">-LKR {fmt(r.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm py-1.5 bg-red-50 rounded-lg px-2 font-semibold">
                  <span className="text-slate-800">Total Deductions</span>
                  <span className="font-mono text-red-600">-LKR {fmt(salary.epf + salary.paye)}</span>
                </div>
              </div>
              <div className="mt-4 bg-slate-900 text-white rounded-xl px-4 py-3">
                <p className="text-xs text-slate-400">Net Salary</p>
                <p className="text-2xl font-black font-mono mt-0.5" style={{ fontFamily: "var(--font-display)" }}>LKR {fmt(salary.net)}</p>
              </div>
            </div>
          </div>
          {/* Bank info */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Bank</p>
                <p className="text-sm text-slate-700 font-medium">Sampath Bank</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Account</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-mono text-slate-700">{showAccount ? "1234-5678-9012" : "••••-••••-9012"}</p>
                  <button onClick={() => setShowAccount(!showAccount)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    {showAccount ? <EyeOff size={11} /> : <Eye size={11} />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">Employer contribution: EPF 12% + ETF 3% paid by company</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main WorkspacePage ──────────────────────────────────────────────────────
export default function WorkspacePage() {
  const [role, setRole] = useState<Role>("EMPLOYEE");
  const [subPage, setSubPage] = useState<SubPage>("dashboard");
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(MY_NOTIFICATIONS);
  const [showPayslip, setShowPayslip] = useState<typeof PAYSLIPS[0] | null>(null);
  const [revealSalary, setRevealSalary] = useState<Record<string, boolean>>({});
  // approvals state — must live at top level (Rules of Hooks)
  const [localApprovals, setLocalApprovals] = useState(MY_APPROVALS);
  // attendance correction
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [corrForm, setCorrForm] = useState({ date: "2026-09-10", reqIn: "09:00", reqOut: "18:00", reason: "" });

  const user = USERS[role];
  const salary = SALARY_DATA[role];

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const onFeedback = useCallback((d: ActionFeedbackData) => setFeedback(d), []);
  const onDismiss = useCallback(() => setFeedback(null), []);

  function handleCheckIn() {
    const t = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setCheckedIn(true);
    setCheckInTime(t);
    onFeedback({ type: "success", title: "Checked In", message: `Welcome, ${user.name.split(" ")[0]}! Have a productive day.`, ref: `ATT-${Date.now()}`, refLabel: "Attendance ID", amount: t });
  }

  function handleCheckOut() {
    const t = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setCheckOutTime(t);
    onFeedback({ type: "success", title: "Checked Out", message: "Your working hours have been recorded.", amount: "9h 02m worked" });
  }

  const unread = notifications.filter(n => !n.read).length;

  // ─── Navigation ─────────────────────────────────────────────────────────────
  type NavItem = { id: SubPage; label: string; Icon: React.ElementType; badge?: number; section?: string };
  const pendingApprovals = MY_APPROVALS.filter(a => a.status === "PENDING").length;

  const MY_NAV: NavItem[] = [
    { id: "dashboard",    label: "My Dashboard",    Icon: LayoutDashboard, section: "MY WORKSPACE"  },
    { id: "profile",      label: "My Profile",      Icon: User                                       },
    { id: "attendance",   label: "My Attendance",   Icon: Clock                                      },
    { id: "leave",        label: "My Leave",        Icon: CalendarDays                               },
    { id: "payroll",      label: "My Payroll",      Icon: Banknote                                   },
    { id: "payslips",     label: "My Payslips",     Icon: FileText                                   },
    { id: "salary",       label: "My Salary",       Icon: TrendingUp                                 },
    { id: "commission",   label: "My Commission",   Icon: Star                                       },
    { id: "loans",        label: "Loans & Advances",Icon: CreditCard                                 },
    { id: "timesheets",   label: "My Timesheets",   Icon: Timer                                      },
    { id: "overtime",     label: "My Overtime",     Icon: Activity                                   },
    { id: "projects",     label: "My Projects",     Icon: Briefcase                                  },
    { id: "tasks",        label: "My Tasks",        Icon: CheckSquare                                },
    { id: "performance",  label: "My Performance",  Icon: Target                                     },
    { id: "documents",    label: "My Documents",    Icon: FolderOpen                                 },
    { id: "requests",     label: "My Requests",     Icon: ClipboardList                              },
    { id: "approvals",    label: "My Approvals",    Icon: GitPullRequest, badge: pendingApprovals    },
    { id: "activity",     label: "My Activity",     Icon: History                                    },
    { id: "notifications",label: "Notifications",   Icon: Bell, badge: unread                        },
    { id: "settings",     label: "My Settings",     Icon: Settings                                   },
  ];

  const MGR_NAV: NavItem[] = [
    { id: "mgr-dashboard",  label: "Team Dashboard",   Icon: BarChart3,  section: "MANAGEMENT"    },
    { id: "mgr-attendance", label: "Team Attendance",  Icon: Clock                                 },
    { id: "mgr-leave",      label: "Team Leave",       Icon: CalendarDays, badge: PENDING_LEAVE.length },
    { id: "mgr-employees",  label: "Team Members",     Icon: Users                                 },
    { id: "mgr-projects",   label: "Team Projects",    Icon: Briefcase                             },
    { id: "mgr-tasks",      label: "Team Tasks",       Icon: ListChecks                            },
    { id: "mgr-timesheets", label: "Team Timesheets",  Icon: Timer                                 },
    { id: "mgr-overtime",   label: "Team Overtime",    Icon: Activity                              },
    { id: "mgr-payroll",    label: "Payroll Approvals",Icon: Banknote                              },
    { id: "mgr-reports",    label: "Team Reports",     Icon: BarChart3                             },
  ];

  const FIN_NAV: NavItem[] = [
    { id: "payroll",   label: "Payroll Processing", Icon: Banknote,   section: "FINANCE" },
    { id: "payslips",  label: "Payslips",           Icon: FileText                        },
    { id: "commission",label: "Commission",         Icon: Star                            },
  ];

  const showMgrNav = role === "MANAGER" || role === "DIRECTOR";
  const showFinNav = role === "ACCOUNTANT";

  const allNav = [...MY_NAV, ...(showMgrNav ? MGR_NAV : []), ...(showFinNav ? FIN_NAV : [])];

  // ─── Greeting ─────────────────────────────────────────────────────────────
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // ─── Render sub-page ──────────────────────────────────────────────────────
  function renderContent() {
    // ── Dashboard ─────────────────────────────────────────────────────────
    if (subPage === "dashboard") return (
      <div className="p-6 space-y-5">
        {/* Welcome hero */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                {user.avatar}
              </div>
              <div>
                <p className="text-blue-200 text-sm">{greeting}</p>
                <h2 className="text-2xl font-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>{user.name}</h2>
                <p className="text-blue-200 text-sm mt-0.5">{user.designation} · {user.department} · {user.branch}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black font-mono" style={{ fontFamily: "var(--font-display)" }}>
                {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
              <p className="text-blue-200 text-sm mt-1">
                {currentTime.toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left — Today's attendance */}
          <div className="col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Today's Attendance</h3>
            <div className="space-y-3">
              {[
                { label: "Work Schedule", value: "Standard Shift (08:30 – 17:30)" },
                { label: "Check In",      value: checkInTime ?? "Not yet" },
                { label: "Check Out",     value: checkOutTime ?? "Not yet" },
                { label: "Status",        value: checkedIn ? (checkOutTime ? "Completed" : "In Office") : "Not Checked In" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-xs text-slate-500">{r.label}</span>
                  <span className="text-xs font-semibold text-slate-800">{r.value}</span>
                </div>
              ))}
            </div>
            {!checkedIn ? (
              <button onClick={handleCheckIn}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                <LogIn size={16} /> CHECK IN
              </button>
            ) : !checkOutTime ? (
              <div className="space-y-2">
                <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 py-2.5 rounded-xl font-semibold text-sm">
                  <CheckCircle2 size={14} /> CHECKED IN — {checkInTime}
                </div>
                <button onClick={handleCheckOut}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">
                  <LogOut size={14} /> CHECK OUT
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 py-2.5 rounded-xl font-semibold text-sm">
                <CheckCircle2 size={14} /> CHECKED OUT — {checkOutTime}
              </div>
            )}
          </div>

          {/* Centre — Leave balance */}
          <div className="col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Leave Balance</h3>
            {[
              { type: "Annual Leave",  avail: 14, used: 6,  color: "bg-blue-500"    },
              { type: "Casual Leave",  avail: 7,  used: 3,  color: "bg-teal-500"    },
              { type: "Medical Leave", avail: 11, used: 2,  color: "bg-red-400"     },
            ].map(l => (
              <div key={l.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{l.type}</span>
                  <span className="text-xs font-bold text-slate-800">{l.avail} days left</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${l.color}`} style={{ width: `${((l.avail) / (l.avail + l.used)) * 100}%` }} />
                </div>
              </div>
            ))}
            <button onClick={() => setSubPage("leave")}
              className="w-full mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-1">
              Apply Leave <ChevronRight size={11} />
            </button>
          </div>

          {/* Right — Payroll summary */}
          <div className="col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Current Payroll</h3>
            <div className="bg-slate-900 rounded-xl px-4 py-3 text-white">
              <p className="text-[10px] text-slate-400">Net Salary — Sep 2026</p>
              <p className="text-xl font-black font-mono mt-0.5" style={{ fontFamily: "var(--font-display)" }}>LKR {fmt(salary.net)}</p>
            </div>
            {[
              { label: "Basic",    value: salary.basic,      color: "text-slate-700" },
              { label: "Gross",    value: salary.gross,      color: "text-emerald-700" },
              { label: "Deductions",value: salary.epf + salary.paye, color: "text-red-500" },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500">{r.label}</span>
                <span className={`text-xs font-mono font-semibold ${r.color}`}>LKR {fmt(r.value)}</span>
              </div>
            ))}
            <button onClick={() => setShowPayslip(PAYSLIPS[1])}
              className="w-full text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-1">
              View Payslip <ChevronRight size={11} />
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-8 gap-2">
            {[
              { label: "Apply Leave",       Icon: CalendarDays, action: () => setSubPage("leave"),     color: "bg-blue-50 hover:bg-blue-100 text-blue-700"     },
              { label: "My Attendance",     Icon: Clock,        action: () => setSubPage("attendance"), color: "bg-teal-50 hover:bg-teal-100 text-teal-700"     },
              { label: "View Payslip",      Icon: FileText,     action: () => setSubPage("payslips"),   color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700" },
              { label: "My Salary",         Icon: TrendingUp,   action: () => setSubPage("salary"),     color: "bg-violet-50 hover:bg-violet-100 text-violet-700"},
              { label: "My Documents",      Icon: FolderOpen,   action: () => setSubPage("documents"),  color: "bg-amber-50 hover:bg-amber-100 text-amber-700"   },
              { label: "Submit Timesheet",  Icon: Timer,        action: () => setSubPage("timesheets"), color: "bg-pink-50 hover:bg-pink-100 text-pink-700"      },
              { label: "My Tasks",          Icon: CheckSquare,  action: () => setSubPage("tasks"),      color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"},
              { label: "My Requests",       Icon: ClipboardList,action: () => setSubPage("requests"),   color: "bg-slate-50 hover:bg-slate-100 text-slate-700"   },
            ].map(a => (
              <button key={a.label} onClick={a.action}
                className={`${a.color} rounded-xl p-3 flex flex-col items-center gap-2 transition-colors text-center`}>
                <a.Icon size={20} />
                <span className="text-[10px] font-semibold leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* My tasks */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">My Tasks</h3>
              <button onClick={() => setSubPage("tasks")} className="text-xs text-blue-600 hover:underline">View all</button>
            </div>
            <div className="space-y-2">
              {MY_TASKS.filter(t => t.status !== "completed").slice(0, 4).map(t => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.priority === "high" ? "bg-red-500" : t.priority === "medium" ? "bg-amber-400" : "bg-slate-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{t.title}</p>
                    <p className="text-[10px] text-slate-400">{t.project}</p>
                  </div>
                  <StatusPill status={t.status} size="xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Notifications {unread > 0 && <span className="ml-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{unread}</span>}</h3>
              <button onClick={() => setSubPage("notifications")} className="text-xs text-blue-600 hover:underline">View all</button>
            </div>
            <div className="space-y-2">
              {notifications.slice(0, 4).map(n => (
                <div key={n.id} onClick={() => { setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); }}
                  className={`flex items-start gap-3 py-2 cursor-pointer ${!n.read ? "opacity-100" : "opacity-60"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.type === "success" ? "bg-emerald-100" : n.type === "warning" ? "bg-amber-100" : "bg-blue-100"}`}>
                    {n.type === "success" ? <CheckCircle2 size={11} className="text-emerald-600" /> : n.type === "warning" ? <AlertTriangle size={11} className="text-amber-600" /> : <Bell size={11} className="text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{n.msg}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 flex-shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    // ── My Attendance ──────────────────────────────────────────────────────
    if (subPage === "attendance") {
      function submitCorrection() {
        if (!corrForm.reason.trim()) return;
        setShowCorrectionForm(false);
        onFeedback({ type: "success", title: "Correction Request Submitted", message: "Your attendance correction request has been sent to your manager for review.", ref: `ATT-COR-${Date.now()}`, refLabel: "Request ID" });
      }

      return (
        <>
          <div className="p-6 space-y-5">
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Attendance</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Present",  val: 8,   color: "text-emerald-700", bg: "bg-emerald-50" },
                { label: "Late",     val: 1,   color: "text-amber-700",   bg: "bg-amber-50"   },
                { label: "Absent",   val: 0,   color: "text-red-700",     bg: "bg-red-50"     },
                { label: "On Leave", val: 1,   color: "text-blue-700",    bg: "bg-blue-50"    },
              ].map(s => (
                <div key={s.label} className={`${s.bg} border border-slate-200 rounded-xl px-4 py-3`}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color} mt-0.5`}>{s.val}</p>
                  <p className="text-[10px] text-slate-400">This month</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-700">September 2026</p>
                <button onClick={() => setShowCorrectionForm(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
                  + Request Correction
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Date","Shift","Check In","Check Out","Hours","Late","Overtime","Status"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MY_ATTENDANCE.map(a => (
                    <tr key={a.date} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-slate-700">{a.date}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{a.shift}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-700">{a.checkIn}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-700">{a.checkOut}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{a.hours}</td>
                      <td className="px-4 py-3 text-xs text-amber-600">{a.late}</td>
                      <td className="px-4 py-3 text-xs text-violet-600">{a.ot}</td>
                      <td className="px-4 py-3"><StatusPill status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showCorrectionForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCorrectionForm(false)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900">Attendance Correction Request</h3>
                  <button onClick={() => setShowCorrectionForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X size={14} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Date</label>
                    <input type="date" value={corrForm.date} onChange={e => setCorrForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-amber-800 mb-1">Current Record</p>
                    <p className="text-xs text-amber-700">Check In: 09:15 · Check Out: 18:05 · Status: Late</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Requested Check In</label>
                      <input type="time" value={corrForm.reqIn} onChange={e => setCorrForm(f => ({ ...f, reqIn: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Requested Check Out</label>
                      <input type="time" value={corrForm.reqOut} onChange={e => setCorrForm(f => ({ ...f, reqOut: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Reason *</label>
                    <textarea value={corrForm.reason} onChange={e => setCorrForm(f => ({ ...f, reason: e.target.value }))}
                      rows={3} placeholder="Explain why a correction is needed (e.g. forgot check-out, system error)..."
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                  <button onClick={() => setShowCorrectionForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                  <button onClick={submitCorrection} className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">Submit Request</button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    // ── My Payroll ─────────────────────────────────────────────────────────
    if (subPage === "payroll") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Payroll</h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <p className="text-slate-400 text-sm">Net Salary — September 2026</p>
              <p className="text-3xl font-black font-mono mt-1" style={{ fontFamily: "var(--font-display)" }}>LKR {fmt(salary.net)}</p>
              <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-400 text-xs">Gross</p><p className="font-mono font-semibold mt-0.5">LKR {fmt(salary.gross)}</p></div>
                <div><p className="text-slate-400 text-xs">Deductions</p><p className="font-mono font-semibold text-red-400 mt-0.5">-LKR {fmt(salary.epf + salary.paye)}</p></div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Earnings Breakdown</p>
              {[
                { label: "Basic Salary",     value: salary.basic,      col: "text-slate-800" },
                { label: "Transport",        value: salary.transport,  col: "text-slate-700" },
                { label: "Housing",          value: salary.housing,    col: "text-slate-700" },
                { label: "Meal",             value: salary.meal,       col: "text-slate-700" },
                { label: "Commission",       value: salary.commission, col: "text-emerald-700" },
                { label: "Overtime",         value: salary.overtime,   col: "text-emerald-700" },
              ].filter(r => r.value > 0).map(r => (
                <div key={r.label} className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-xs text-slate-600">{r.label}</span>
                  <span className={`text-xs font-mono font-semibold ${r.col}`}>LKR {fmt(r.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Statutory Deductions</p>
              {[
                { label: `EPF Employee (8% of ${fmt(salary.basic)})`, value: salary.epf,  note: "Deducted from salary"           },
                { label: "PAYE Tax",                                    value: salary.paye, note: salary.paye === 0 ? "Below threshold" : "Calculated on taxable income" },
                { label: `EPF Employer (12% of ${fmt(salary.basic)})`, value: Math.round(salary.basic * 0.12), note: "Company contribution — not deducted" },
                { label: `ETF (3% of ${fmt(salary.basic)})`,           value: Math.round(salary.basic * 0.03), note: "Company contribution — not deducted" },
              ].map(r => (
                <div key={r.label} className="flex items-start justify-between py-1.5 border-b border-slate-50">
                  <div>
                    <p className="text-xs text-slate-700">{r.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{r.note}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-red-500">LKR {fmt(r.value)}</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Recent Payslips</p>
              {PAYSLIPS.slice(0, 3).map(p => (
                <div key={p.period} onClick={() => setShowPayslip(p)}
                  className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.period}</p>
                    <p className="text-[10px] text-slate-400">Net: LKR {fmt(p.net)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={p.status} />
                    <button className="p-1 hover:bg-blue-100 rounded-lg transition-colors"><Eye size={11} className="text-blue-600" /></button>
                    <button className="p-1 hover:bg-blue-100 rounded-lg transition-colors"><Download size={11} className="text-blue-600" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    // ── My Payslips ────────────────────────────────────────────────────────
    if (subPage === "payslips") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Payslips</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Payroll Period","Gross Salary","Deductions","Net Salary","Payment Date","Status","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PAYSLIPS.map(p => (
                <tr key={p.period} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">{p.period}</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">LKR {fmt(p.gross)}</td>
                  <td className="px-4 py-3 text-sm font-mono text-red-500">-LKR {fmt(p.deductions)}</td>
                  <td className="px-4 py-3 text-sm font-mono font-bold text-emerald-700">LKR {fmt(p.net)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.date}</td>
                  <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowPayslip(p)} className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"><Eye size={10} /> View</button>
                      <button onClick={() => onFeedback({ type: "receipt", title: "Payslip Downloaded", ref: `PS-${p.period}`, amount: `LKR ${fmt(p.net)}` })}
                        className="flex items-center gap-1 text-xs text-slate-600 hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors"><Download size={10} /> PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── My Salary ──────────────────────────────────────────────────────────
    if (subPage === "salary") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Salary</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Current Basic", val: `LKR ${fmt(salary.basic)}`, col: "text-slate-800", sub: "Effective Jan 2026" },
            { label: "Current Gross", val: `LKR ${fmt(salary.gross)}`, col: "text-emerald-700", sub: "incl. allowances + commission" },
            { label: "Net Salary",    val: `LKR ${fmt(salary.net)}`,   col: "text-blue-700",   sub: "after deductions" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-black font-mono mt-1 ${s.col}`} style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
              <p className="text-[10px] text-slate-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-700">Salary History</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Effective From","Effective To","Basic Salary","Reason","Approved By"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {SALARY_HISTORY.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-700">{s.from}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-700">{s.to}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-slate-800">
                        {revealSalary[i] ? `LKR ${fmt(s.basic)}` : "LKR ••••••"}
                      </span>
                      <button onClick={() => setRevealSalary(p => ({ ...p, [i]: !p[i] }))} className="text-slate-400 hover:text-slate-600 transition-colors">
                        {revealSalary[i] ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{s.reason}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{s.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── My Commission ──────────────────────────────────────────────────────
    if (subPage === "commission") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Commission</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Commission", val: "LKR 44,400",  bg: "bg-emerald-50", text: "text-emerald-700" },
            { label: "Paid",             val: "LKR 26,400",  bg: "bg-blue-50",    text: "text-blue-700"    },
            { label: "Pending Approval", val: "LKR 18,000",  bg: "bg-amber-50",   text: "text-amber-700"   },
            { label: "This Month",       val: "LKR 13,500",  bg: "bg-slate-50",   text: "text-slate-800"   },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border border-slate-200 rounded-xl px-4 py-3`}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-xl font-black font-mono mt-1 ${s.text}`}>{s.val}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Commission ID","Client","Project","Invoice","Basis","Amount","Status","Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {COMMISSION_DATA.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-blue-700 font-semibold">{c.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{c.client}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{c.project}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{c.invoice}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{c.basis}</td>
                  <td className="px-4 py-3 text-sm font-mono font-bold text-emerald-700">LKR {fmt(c.amount)}</td>
                  <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-400">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── My Timesheets ──────────────────────────────────────────────────────
    if (subPage === "timesheets") return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Timesheets</h2>
          <button onClick={() => onFeedback({ type: "success", title: "Timesheet Submitted", message: "Week 2 September timesheet has been submitted for approval.", ref: "TS-2026-W37" })}
            className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
            <Plus size={13} /> Add Entry / Submit
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">September 2026 — Week 2</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Total: <strong className="text-slate-800">16h</strong></span>
              <span>Billable: <strong className="text-emerald-700">13.5h</strong></span>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Date","Project","Task","Start","End","Hours","Billable","Status","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TIMESHEET_DATA.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-700">{t.date}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{t.project}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.task}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{t.start}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{t.end}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">{t.hours}h</td>
                  <td className="px-4 py-3">{t.billable ? <CheckCircle2 size={13} className="text-emerald-500" /> : <XCircle size={13} className="text-slate-300" />}</td>
                  <td className="px-4 py-3"><StatusPill status={t.status} /></td>
                  <td className="px-4 py-3">
                    {t.status === "Draft" && <button onClick={() => onFeedback({ type: "success", title: "Entry Saved", message: "Timesheet entry updated." })} className="text-xs text-blue-600 hover:underline">Edit</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── My Overtime ────────────────────────────────────────────────────────
    if (subPage === "overtime") return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Overtime</h2>
          <button onClick={() => onFeedback({ type: "success", title: "Overtime Request Submitted", message: "Your overtime request has been sent to your manager.", ref: `OT-${Date.now()}` })}
            className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
            <Plus size={13} /> Request Overtime
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Date","Project","Hours","Reason","Status","Approved By"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {OVERTIME_DATA.map((o, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-700">{o.date}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{o.project}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">{o.hours}h</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-48 truncate">{o.reason}</td>
                  <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{o.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── My Projects ────────────────────────────────────────────────────────
    if (subPage === "projects") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Projects</h2>
        <div className="grid grid-cols-3 gap-4">
          {MY_PROJECTS.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-mono text-slate-400">{p.id}</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5 leading-tight">{p.name}</p>
                </div>
                <StatusPill status={p.status} />
              </div>
              <p className="text-xs text-slate-500 mb-3">{p.client} · {p.role}</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Progress</span><span>{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.progress === 100 ? "bg-teal-500" : "bg-blue-500"}`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                <span>Due: {p.deadline}</span>
                <span>{p.tasks} tasks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // ── My Tasks ───────────────────────────────────────────────────────────
    if (subPage === "tasks") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Tasks</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Task","Project","Priority","Status","Due Date","Est.","Actual","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MY_TASKS.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-800">{t.title}</p>
                    <p className="text-[10px] font-mono text-slate-400">{t.id}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.project}</td>
                  <td className="px-4 py-3"><StatusPill status={t.priority} size="xs" /></td>
                  <td className="px-4 py-3"><StatusPill status={t.status} size="xs" /></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.due}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.est}h</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.actual}h</td>
                  <td className="px-4 py-3">
                    {t.status !== "completed" && (
                      <button onClick={() => onFeedback({ type: "success", title: "Task Updated", message: `"${t.title}" marked as completed.` })}
                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg transition-colors">Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── My Requests ────────────────────────────────────────────────────────
    if (subPage === "requests") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Requests</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Request ID","Type","Status","Created","Approver","Last Updated"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MY_REQUESTS.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-xs font-mono text-blue-700 font-semibold">{r.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.type}</td>
                  <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.created}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{r.approver}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{r.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── Notifications ──────────────────────────────────────────────────────
    if (subPage === "notifications") return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Notifications</h2>
          <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            className="text-xs text-blue-600 hover:underline">Mark all as read</button>
        </div>
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id}
              onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              className={`bg-white border rounded-xl px-5 py-4 flex items-start gap-4 cursor-pointer hover:border-blue-200 transition-colors ${!n.read ? "border-blue-200 bg-blue-50/30" : "border-slate-200"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === "success" ? "bg-emerald-100" : n.type === "warning" ? "bg-amber-100" : "bg-blue-100"}`}>
                {n.type === "success" ? <CheckCircle2 size={18} className="text-emerald-600" /> : n.type === "warning" ? <AlertTriangle size={18} className="text-amber-600" /> : <Bell size={18} className="text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.msg}</p>
              </div>
              <span className="text-[10px] text-slate-400 flex-shrink-0 mt-1">{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    );

    // ── My Profile ─────────────────────────────────────────────────────────
    if (subPage === "profile") return (
      <div className="p-6 space-y-5 max-w-2xl">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Profile</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">{user.avatar}</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
              <p className="text-slate-500">{user.designation} · {user.id}</p>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">{user.status}</span>
            </div>
            <button onClick={() => onFeedback({ type: "processing", title: "Opening Change Request…" })}
              className="ml-auto text-xs border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl text-slate-600 transition-colors">Request Change</button>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {[
              { label: "Employee ID",    value: user.id,          sensitive: false },
              { label: "Department",     value: user.department,  sensitive: false },
              { label: "Branch",         value: user.branch,      sensitive: false },
              { label: "Team",           value: user.team,        sensitive: false },
              { label: "Reporting Manager", value: user.manager,  sensitive: false },
              { label: "Work Email",     value: user.email,       sensitive: false },
              { label: "Phone",          value: user.phone,       sensitive: true  },
              { label: "Join Date",      value: user.joinDate,    sensitive: false },
            ].map(f => (
              <div key={f.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</p>
                <p className="text-sm text-slate-800 mt-0.5 font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // ── Leave ──────────────────────────────────────────────────────────────
    if (subPage === "leave") return (
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center gap-4">
          <CalendarDays size={24} className="text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-blue-900">My Leave</p>
            <p className="text-sm text-blue-700 mt-0.5">Navigate to the Leave Management module from the main sidebar to apply for leave, view balances, and track requests.</p>
          </div>
          <button onClick={() => onFeedback({ type: "success", title: "Opening Leave Module…", message: "Use the main sidebar to access Leave Management." })}
            className="ml-auto flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap">
            <Plus size={13} /> Apply Leave
          </button>
        </div>
      </div>
    );

    // ── Documents ──────────────────────────────────────────────────────────
    if (subPage === "documents") return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center gap-4">
          <FolderOpen size={24} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-amber-900">My Documents</p>
            <p className="text-sm text-amber-700 mt-0.5">Access your personal documents, payslips, contracts, and certificates through the Documents module.</p>
          </div>
          <button className="ml-auto text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">Open Documents</button>
        </div>
      </div>
    );

    // ── Settings ──────────────────────────────────────────────────────────
    if (subPage === "settings") return (
      <div className="p-6 space-y-4 max-w-2xl">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Settings</h2>
        <div className="grid grid-cols-2 gap-3">
          {["Notification Preferences","Privacy Settings","Language & Region","Password & Security","Two-Factor Authentication","Session Management","Display Preferences","Email Notifications"].map(s => (
            <button key={s} className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-left hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
              <p className="text-sm font-semibold text-slate-800">{s}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Configure</p>
            </button>
          ))}
        </div>
      </div>
    );

    // ── Loans ─────────────────────────────────────────────────────────────
    if (subPage === "loans") return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Loans & Advances</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">No active loans or salary advances at this time.</p>
          <button onClick={() => onFeedback({ type: "processing", title: "Opening Loan Request…" })}
            className="mt-3 flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl text-slate-600 transition-colors">
            <Plus size={12} /> Request Advance
          </button>
        </div>
      </div>
    );

    // ── Performance ───────────────────────────────────────────────────────
    if (subPage === "performance") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Performance</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Task Completion Rate", val: "82%",  color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Attendance Score",     val: "96%",  color: "text-blue-700",    bg: "bg-blue-50"    },
            { label: "Billable Hours",       val: "87%",  color: "text-violet-700",  bg: "bg-violet-50"  },
            { label: "Goals On Track",       val: "3/4",  color: "text-amber-700",   bg: "bg-amber-50"   },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border border-slate-200 rounded-xl px-4 py-4`}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-700">Goals & KPIs — Q3 2026</p>
          </div>
          <div className="divide-y divide-slate-50">
            {MY_GOALS.map(g => (
              <div key={g.id} className="px-5 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-semibold text-slate-800">{g.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">KPI: {g.kpi} · Target: {g.target}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${g.status === "Exceeding" ? "bg-emerald-50 text-emerald-700" : g.status === "On Track" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>{g.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${g.status === "Exceeding" ? "bg-emerald-500" : g.status === "On Track" ? "bg-blue-500" : "bg-red-400"}`} style={{ width: `${g.progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 w-8 text-right">{g.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-sm font-bold text-slate-700 mb-3">Project Contributions</p>
            {MY_PROJECTS.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-sm font-bold text-slate-700 mb-3">This Month Summary</p>
            {[
              { label: "Tasks Completed",  val: "12 / 15" },
              { label: "Billable Hours",   val: "127.5h"   },
              { label: "Days Present",     val: "8 / 10"   },
              { label: "Leave Taken",      val: "1 day"    },
              { label: "Overtime Hours",   val: "4.5h"     },
              { label: "Commission Earned",val: "LKR 13,500"},
            ].map(r => (
              <div key={r.label} className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-500">{r.label}</span>
                <span className="text-xs font-semibold text-slate-800">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // ── Approvals ─────────────────────────────────────────────────────────
    if (subPage === "approvals") {
      function approveItem(id: string, from: string, type: string) {
        setLocalApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "APPROVED" } : a));
        onFeedback({ type: "approval", title: `${type} Approved`, message: `${from}'s request has been approved.`, ref: id });
      }
      function rejectItem(id: string) {
        setLocalApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED" } : a));
        onFeedback({ type: "error", title: "Request Rejected", ref: id });
      }
      return (
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Approvals</h2>
            <span className="text-sm text-slate-500">{localApprovals.filter(a => a.status === "PENDING").length} pending</span>
          </div>
          <div className="space-y-3">
            {localApprovals.map(a => (
              <div key={a.id} className={`bg-white border rounded-xl p-5 ${a.status === "PENDING" ? "border-amber-200" : a.status === "APPROVED" ? "border-emerald-200" : "border-red-200"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-blue-700 font-semibold">{a.ref}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status === "PENDING" ? "bg-amber-50 text-amber-700" : a.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{a.status}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{a.type}</p>
                    <p className="text-xs text-slate-500 mt-0.5">From: <strong>{a.from}</strong> · {a.detail}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Submitted: {a.submitted}</p>
                  </div>
                  {a.status === "PENDING" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => approveItem(a.id, a.from, a.type)}
                        className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl font-semibold transition-colors">
                        <CheckCircle2 size={12} /> Approve
                      </button>
                      <button onClick={() => rejectItem(a.id)}
                        className="flex items-center gap-1.5 text-sm border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl font-semibold transition-colors">
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── Activity ──────────────────────────────────────────────────────────
    if (subPage === "activity") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>My Activity</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-50">
            {MY_ACTIVITY.map((a, i) => {
              const iconCfg: Record<string, { Icon: typeof Clock; bg: string; color: string }> = {
                attendance: { Icon: Clock,        bg: "bg-blue-50",    color: "text-blue-600"    },
                task:       { Icon: CheckSquare,  bg: "bg-indigo-50",  color: "text-indigo-600"  },
                timesheet:  { Icon: Timer,        bg: "bg-teal-50",    color: "text-teal-600"    },
                leave:      { Icon: CalendarDays, bg: "bg-violet-50",  color: "text-violet-600"  },
                finance:    { Icon: Star,         bg: "bg-emerald-50", color: "text-emerald-600" },
                overtime:   { Icon: Activity,     bg: "bg-amber-50",   color: "text-amber-600"   },
              };
              const cfg = iconCfg[a.type] ?? { Icon: Zap, bg: "bg-slate-50", color: "text-slate-500" };
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <cfg.Icon size={14} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{a.action}</p>
                    <p className="text-xs text-slate-400">{a.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0 font-mono">{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    // ── Manager Dashboard ─────────────────────────────────────────────────
    if (subPage === "mgr-dashboard") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Dashboard</h2>
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: "Team Size",     val: TEAM_MEMBERS.length,                              color: "text-slate-700",   bg: "bg-slate-50"    },
            { label: "Present Today", val: TEAM_MEMBERS.filter(m => m.status === "Present").length, color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Late Today",    val: TEAM_MEMBERS.filter(m => m.status === "Late").length,    color: "text-amber-700",   bg: "bg-amber-50"   },
            { label: "On Leave",      val: TEAM_MEMBERS.filter(m => m.status === "On Leave").length,color: "text-blue-700",    bg: "bg-blue-50"    },
            { label: "Pending Leave", val: PENDING_LEAVE.length,                            color: "text-violet-700",  bg: "bg-violet-50"  },
            { label: "Active Tasks",  val: MY_TASKS.filter(t => t.status !== "completed").length, color: "text-indigo-700",  bg: "bg-indigo-50"  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border border-slate-200 rounded-xl px-3 py-3`}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-tight">{s.label}</p>
              <p className={`text-2xl font-black ${s.color} mt-1`}>{s.val}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Team Today</h3>
              <button onClick={() => setSubPage("mgr-attendance")} className="text-xs text-blue-600 hover:underline">Full view</button>
            </div>
            {TEAM_MEMBERS.map(m => (
              <div key={m.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 font-medium truncate">{m.name}</p>
                  <p className="text-[10px] text-slate-400">{m.designation}</p>
                </div>
                <StatusPill status={m.status} size="xs" />
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Pending Leave Approvals</h3>
              <button onClick={() => setSubPage("mgr-leave")} className="text-xs text-blue-600 hover:underline">View all</button>
            </div>
            {PENDING_LEAVE.map(l => (
              <div key={l.id} className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{l.emp}</p>
                    <p className="text-xs text-slate-500">{l.type} · {l.start} – {l.end} · {l.days} day{l.days !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => onFeedback({ type: "approval", title: "Leave Approved", message: `${l.emp}'s ${l.type} has been approved.`, ref: l.id })}
                      className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"><CheckCircle2 size={13} /></button>
                    <button onClick={() => onFeedback({ type: "error", title: "Leave Rejected", ref: l.id })}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><XCircle size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // ── Manager Attendance ────────────────────────────────────────────────
    if (subPage === "mgr-attendance") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Attendance</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Employee","ID","Department","Check In","Check Out","Hours","Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TEAM_MEMBERS.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                        {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 font-medium">{m.name}</p>
                        <p className="text-[10px] text-slate-400">{m.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{m.id}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{m.dept}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-700">{m.status === "On Leave" ? "—" : "08:5x"}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-700">{m.status === "On Leave" ? "—" : m.status === "Present" ? "18:0x" : "—"}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-700">{m.status === "On Leave" ? "—" : m.status === "Present" ? "9h 0xm" : "—"}</td>
                  <td className="px-4 py-3"><StatusPill status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── Manager Leave ─────────────────────────────────────────────────────
    if (subPage === "mgr-leave") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Leave</h2>
        {PENDING_LEAVE.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-amber-700">{PENDING_LEAVE.length} pending approval{PENDING_LEAVE.length !== 1 ? "s" : ""}</p>
            {PENDING_LEAVE.map(l => (
              <div key={l.id} className="bg-white border border-amber-200 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-blue-700 font-semibold">{l.id}</span>
                      <StatusPill status="PENDING_MANAGER_APPROVAL" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 mt-1">{l.emp}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{l.type} · {l.start} – {l.end} · {l.days} day{l.days !== 1 ? "s" : ""}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Submitted: {l.submitted}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onFeedback({ type: "approval", title: "Leave Approved", message: `${l.emp}'s ${l.type} has been approved.`, ref: l.id, amount: `${l.days} day${l.days !== 1 ? "s" : ""}`, actions: [{ label: "Done", onClick: () => {}, primary: true }] })}
                      className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
                      <CheckCircle2 size={13} /> Approve
                    </button>
                    <button onClick={() => onFeedback({ type: "error", title: "Leave Rejected", ref: l.id, actions: [{ label: "Done", onClick: () => {}, primary: true }] })}
                      className="flex items-center gap-1.5 text-sm border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition-colors">
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    // ── Manager Employees ─────────────────────────────────────────────────
    if (subPage === "mgr-employees") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Members</h2>
        <div className="grid grid-cols-3 gap-4">
          {TEAM_MEMBERS.map(m => (
            <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                  {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{m.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{m.designation}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <StatusPill status={m.status} size="xs" />
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span>{m.tasks} tasks</span>
                  {m.leave > 0 && <span className="text-blue-600">{m.leave} on leave</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // ── Manager Reports ───────────────────────────────────────────────────
    if (subPage === "mgr-reports") return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Reports</h2>
        <div className="grid grid-cols-2 gap-3">
          {["Team Attendance Report","Team Leave Report","Overtime Report","Timesheet Report","Task Completion Report","Project Progress Report","Workload Report","Performance Overview"].map(r => (
            <button key={r} onClick={() => onFeedback({ type: "processing", title: "Generating Report…", message: `${r} is being compiled.` })}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-left hover:border-blue-300 hover:bg-blue-50/20 transition-colors flex items-center justify-between group">
              <div>
                <p className="text-sm font-semibold text-slate-800">{r}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF · Excel · CSV</p>
              </div>
              <Download size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );

    // ── Team Tasks ────────────────────────────────────────────────────────
    if (subPage === "mgr-tasks") return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Tasks</h2>
          <button onClick={() => onFeedback({ type: "success", title: "Task Created", message: "New task assigned to team member.", ref: `TSK-${Date.now()}` })}
            className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
            <Plus size={13} /> Assign Task
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Task","Assignee","Project","Priority","Status","Due Date","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TEAM_TASKS.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-800">{t.title}</p>
                    <p className="text-[10px] font-mono text-slate-400">{t.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-[8px] font-bold text-white">
                        {t.assignee.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-xs text-slate-700">{t.assignee.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.project}</td>
                  <td className="px-4 py-3"><StatusPill status={t.priority} size="xs" /></td>
                  <td className="px-4 py-3"><StatusPill status={t.status} size="xs" /></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.due}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onFeedback({ type: "success", title: "Task Reassigned", message: `Task ${t.id} reassigned.` })}
                      className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">Reassign</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── Team Timesheets ───────────────────────────────────────────────────
    if (subPage === "mgr-timesheets") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Timesheets</h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">Week 37 — Sep 8–14, 2026</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Total team hours: <strong className="text-slate-800">172.5h</strong></span>
              <span>Billable: <strong className="text-emerald-700">158h</strong></span>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Employee","Week","Total Hours","Billable","Status","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TEAM_TIMESHEETS.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
                        {t.emp.split(" ").map(n => n[0]).join("").slice(0,2)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{t.emp}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.week}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{t.hours}h</td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-700">{t.billable}h</td>
                  <td className="px-4 py-3"><StatusPill status={t.status} /></td>
                  <td className="px-4 py-3">
                    {t.status === "Submitted" && (
                      <div className="flex gap-1">
                        <button onClick={() => onFeedback({ type: "approval", title: "Timesheet Approved", message: `${t.emp}'s Week 37 timesheet approved.` })}
                          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg transition-colors">Approve</button>
                        <button onClick={() => onFeedback({ type: "error", title: "Timesheet Rejected" })}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded-lg transition-colors">Reject</button>
                      </div>
                    )}
                    {t.status === "Approved" && <span className="text-[10px] text-emerald-600 font-semibold">✓ Approved</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── Team Overtime ─────────────────────────────────────────────────────
    if (subPage === "mgr-overtime") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Overtime</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Pending Approval",  val: TEAM_OVERTIME.filter(o => o.status === "PENDING").length,  bg: "bg-amber-50", text: "text-amber-700" },
            { label: "Approved This Month",val: TEAM_OVERTIME.filter(o => o.status === "APPROVED").length,bg: "bg-emerald-50",text: "text-emerald-700"},
            { label: "Total Hours",       val: `${TEAM_OVERTIME.reduce((s, o) => s + o.hours, 0).toFixed(1)}h`, bg: "bg-blue-50", text: "text-blue-700" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border border-slate-200 rounded-xl px-4 py-3`}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.text}`}>{s.val}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Employee","Date","Project","Hours","Reason","Status","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TEAM_OVERTIME.map((o, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{o.emp}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{o.date}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{o.project}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{o.hours}h</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-36 truncate">{o.reason}</td>
                  <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                  <td className="px-4 py-3">
                    {o.status === "PENDING" && (
                      <div className="flex gap-1">
                        <button onClick={() => onFeedback({ type: "approval", title: "Overtime Approved", message: `${o.emp}'s overtime approved. Will be included in payroll.`, ref: `OT-${Date.now()}` })}
                          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg transition-colors">Approve</button>
                        <button onClick={() => onFeedback({ type: "error", title: "Overtime Rejected" })}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded-lg transition-colors">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // ── Team Projects ─────────────────────────────────────────────────────
    if (subPage === "mgr-projects") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Team Projects</h2>
        <div className="grid grid-cols-3 gap-4">
          {TEAM_PROJECTS_DATA.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-mono text-slate-400">{p.id}</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5 leading-tight">{p.name}</p>
                </div>
                <StatusPill status={p.status} />
              </div>
              <p className="text-xs text-slate-500 mb-3">{p.client}</p>
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Progress</span><span>{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Due: {p.deadline}</span>
                <span>{p.team} members · {p.tasks} tasks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // ── Payroll Approvals ─────────────────────────────────────────────────
    if (subPage === "mgr-payroll") return (
      <div className="p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Payroll Approvals</h2>
        <div className="space-y-3">
          {[
            { ref: "SAL-CHG-001", emp: "Kavinda Perera",   type: "Salary Increment",   detail: "LKR 185,000 → 205,000",   reason: "Annual increment",   status: "PENDING"  },
            { ref: "COM-APR-002", emp: "Amali De Silva",    type: "Commission",          detail: "LKR 18,000 service comm.", reason: "Lanka Retail ERP",   status: "PENDING"  },
            { ref: "OT-PAY-003",  emp: "Tharanga Kumara",   type: "Overtime Payment",    detail: "3.0h × LKR 490 = 1,470", reason: "Sep overtime",       status: "APPROVED" },
            { ref: "ADV-004",     emp: "Sandali Perera",    type: "Salary Advance",      detail: "LKR 25,000",              reason: "Medical expense",    status: "PENDING"  },
          ].map(a => (
            <div key={a.ref} className={`bg-white border rounded-xl p-5 ${a.status === "PENDING" ? "border-amber-200" : "border-emerald-200"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-blue-700 font-semibold">{a.ref}</span>
                    <StatusPill status={a.status} size="xs" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">{a.type} — {a.emp}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.detail} · {a.reason}</p>
                </div>
                {a.status === "PENDING" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => onFeedback({ type: "salary", title: `${a.type} Approved`, message: `${a.emp}'s ${a.type.toLowerCase()} approved.`, ref: a.ref, amount: a.detail })}
                      className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl font-semibold transition-colors">
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button onClick={() => onFeedback({ type: "error", title: "Request Rejected", ref: a.ref })}
                      className="flex items-center gap-1.5 text-sm border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl font-semibold transition-colors">
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return null;
  }

  return (
    <>
      <div className="flex h-full overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          {/* Role switcher */}
          <div className="px-3 py-3 border-b border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Demo Role</p>
            <div className="flex flex-wrap gap-1">
              {(["EMPLOYEE","MANAGER","DIRECTOR","ACCOUNTANT"] as Role[]).map(r => (
                <button key={r} onClick={() => { setRole(r); setSubPage("dashboard"); }}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors ${role === r ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                  {r.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* User card */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">{user.avatar}</div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[9px] text-slate-400 truncate">{user.designation}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="flex-1 py-2">
            {allNav.map((item) => (
              <div key={item.id}>
                {item.section && (
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">{item.section}</p>
                )}
                <button onClick={() => setSubPage(item.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors relative ${
                    subPage === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}>
                  <item.Icon size={13} className="flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{item.badge}</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {showPayslip && (
        <PayslipViewer payslip={showPayslip} user={user} salary={salary} onClose={() => setShowPayslip(null)} />
      )}
      <ActionFeedback data={feedback} onDismiss={onDismiss} />
    </>
  );
}
