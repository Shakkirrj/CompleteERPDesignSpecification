import { useState } from "react";
import { Download, BarChart2, Users, Clock, DollarSign, Briefcase, Receipt, Activity, Edit2, Send, Printer, Save, X, ArrowLeft, CheckCircle, User } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { revenueData } from "../../data/mockData";
import mcLogo from "../../assets/merncrest-logo.png";

const reportCategories = [
  { icon: Users, label: "HR Reports", sub: "Headcount, turnover, performance", color: "bg-blue-50 text-blue-600", id: "hr" },
  { icon: Clock, label: "Attendance Reports", sub: "Daily, monthly, department-wise", color: "bg-emerald-50 text-emerald-600", id: "attendance" },
  { icon: DollarSign, label: "Payroll Reports", sub: "Salary, deductions, EPF/ETF", color: "bg-amber-50 text-amber-600", id: "payroll" },
  { icon: Briefcase, label: "Project Reports", sub: "Budget, timeline, resource", color: "bg-violet-50 text-violet-600", id: "project" },
  { icon: Receipt, label: "Finance Reports", sub: "P&L, balance sheet, cash flow", color: "bg-cyan-50 text-cyan-600", id: "finance" },
  { icon: BarChart2, label: "Sales Reports", sub: "Revenue, pipeline, commissions", color: "bg-pink-50 text-pink-600", id: "sales" },
  { icon: Activity, label: "Service Desk Reports", sub: "Ticket SLA, resolution time", color: "bg-orange-50 text-orange-600", id: "servicedesk" },
  { icon: BarChart2, label: "Custom Reports", sub: "Build your own report", color: "bg-slate-50 text-slate-600", id: "custom" },
];

const initialReportData: Record<string, { title: string; period: string; notes: string; rows: { label: string; value: string; }[] }> = {
  hr: {
    title: "HR Summary Report",
    period: "Q1 2025",
    notes: "Prepared by HR Department. Subject to final review before distribution.",
    rows: [
      { label: "Total Employees", value: "54" },
      { label: "New Hires (Q1)", value: "6" },
      { label: "Resignations (Q1)", value: "2" },
      { label: "Retention Rate", value: "96.7%" },
      { label: "Average Tenure", value: "3.2 years" },
      { label: "Gender Ratio (M/F)", value: "62% / 38%" },
    ],
  },
  attendance: {
    title: "Monthly Attendance Report",
    period: "March 2025",
    notes: "Based on biometric data. Exceptional cases pending review.",
    rows: [
      { label: "Working Days", value: "22" },
      { label: "Avg Attendance Rate", value: "91.4%" },
      { label: "Total Late Arrivals", value: "24" },
      { label: "Absent (Unauthorized)", value: "8" },
      { label: "On Leave (Authorized)", value: "36" },
    ],
  },
  payroll: {
    title: "Payroll Summary Report",
    period: "March 2025",
    notes: "Approved by Finance Director. Final payslips pending distribution.",
    rows: [
      { label: "Gross Payroll", value: "LKR 4,280,000" },
      { label: "EPF Contribution (Employer)", value: "LKR 514,000" },
      { label: "ETF Contribution", value: "LKR 128,000" },
      { label: "Total Deductions", value: "LKR 693,000" },
      { label: "Net Payroll", value: "LKR 3,587,000" },
    ],
  },
  project: {
    title: "Project Status Report",
    period: "March 2025",
    notes: "Includes active, on-hold and planning phase projects.",
    rows: [
      { label: "Total Projects", value: "6" },
      { label: "In Progress", value: "3" },
      { label: "On Hold", value: "1" },
      { label: "Completed", value: "1" },
      { label: "Total Budget", value: "LKR 19.4M" },
      { label: "Total Spent", value: "LKR 8.5M" },
    ],
  },
  finance: {
    title: "Financial Summary Report",
    period: "March 2025",
    notes: "Prepared by Finance team. Pending external audit sign-off.",
    rows: [
      { label: "Total Revenue", value: "LKR 5,400,000" },
      { label: "Operating Expenses", value: "LKR 3,000,000" },
      { label: "Gross Profit", value: "LKR 2,400,000" },
      { label: "EBITDA Margin", value: "44.4%" },
      { label: "Outstanding Receivables", value: "LKR 1,560,000" },
    ],
  },
  sales: {
    title: "Sales Performance Report",
    period: "March 2025",
    notes: "Compiled from CRM and invoicing module data.",
    rows: [
      { label: "Total Leads", value: "21" },
      { label: "Deals Won", value: "3" },
      { label: "Revenue from New Deals", value: "LKR 14,200,000" },
      { label: "Conversion Rate", value: "34%" },
      { label: "Avg Deal Size", value: "LKR 4,730,000" },
    ],
  },
  servicedesk: {
    title: "Service Desk Report",
    period: "March 2025",
    notes: "Based on ticket data from the helpdesk module.",
    rows: [
      { label: "Total Tickets", value: "47" },
      { label: "Resolved", value: "39" },
      { label: "In Progress", value: "6" },
      { label: "SLA Compliance", value: "94.2%" },
      { label: "Avg Resolution Time", value: "3.4 hrs" },
      { label: "CSAT Score", value: "4.7 / 5.0" },
    ],
  },
  custom: {
    title: "Custom Report",
    period: "March 2025",
    notes: "Custom report — define your own fields.",
    rows: [
      { label: "Metric 1", value: "—" },
      { label: "Metric 2", value: "—" },
    ],
  },
};

interface EditHistory {
  user: string;
  time: string;
  action: string;
}

interface ReportState {
  title: string;
  period: string;
  notes: string;
  rows: { label: string; value: string; }[];
  editHistory: EditHistory[];
}

function EditableReport({ reportId, onClose }: { reportId: string; onClose: () => void }) {
  const base = initialReportData[reportId] ?? initialReportData.custom;
  const [report, setReport] = useState<ReportState>({
    ...base,
    editHistory: [
      { user: "Priya Jayawardena", time: "2025-03-11 09:30", action: "Created report" },
    ],
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(base);
  const [sent, setSent] = useState(false);

  function saveEdit() {
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    setReport(prev => ({
      ...draft,
      editHistory: [...prev.editHistory, { user: "Priya Jayawardena", time: now, action: "Edited report content" }],
    }));
    setEditing(false);
  }

  function handlePrint() {
    window.print();
  }

  function handleSend() {
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    setReport(prev => ({
      ...prev,
      editHistory: [...prev.editHistory, { user: "Priya Jayawardena", time: now, action: "Sent report to stakeholders" }],
    }));
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  const lastEdit = report.editHistory[report.editHistory.length - 1];

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{report.title}</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <User size={10} />Last edited by <span className="font-medium text-slate-700">{lastEdit.user}</span> · {lastEdit.time} · {lastEdit.action}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <button onClick={() => { setEditing(true); setDraft({ title: report.title, period: report.period, notes: report.notes, rows: report.rows.map(r => ({ ...r })) }); }}
              className="flex items-center gap-1.5 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
              <Edit2 size={13} /> Edit
            </button>
          ) : (
            <>
              <button onClick={saveEdit} className="flex items-center gap-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors">
                <Save size={13} /> Save
              </button>
              <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-sm border border-slate-200 bg-white text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                <X size={13} /> Cancel
              </button>
            </>
          )}
          <button onClick={handlePrint} className="flex items-center gap-1.5 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Printer size={13} /> Print
          </button>
          <button onClick={handleSend} className="flex items-center gap-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors">
            {sent ? <CheckCircle size={13} /> : <Send size={13} />}
            {sent ? "Sent!" : "Send"}
          </button>
        </div>
      </div>

      {/* Report document */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-3xl mx-auto print:shadow-none">
        {/* Header with logo */}
        <div className="flex items-start justify-between mb-6 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img src={mcLogo} alt="MernCrest" className="w-14 h-14 object-contain" />
            <div>
              <p className="text-base font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>MernCrest Solutions (Pvt) Ltd</p>
              <p className="text-xs text-slate-400">Your Technology Partner</p>
            </div>
          </div>
          <div className="text-right">
            {editing ? (
              <>
                <input value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
                  className="text-base font-bold text-slate-900 text-right border-b border-blue-300 focus:outline-none w-full mb-0.5" />
                <input value={draft.period} onChange={e => setDraft(p => ({ ...p, period: e.target.value }))}
                  className="text-xs text-slate-500 text-right border-b border-blue-200 focus:outline-none w-full" />
              </>
            ) : (
              <>
                <p className="text-base font-bold text-slate-900">{report.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{report.period}</p>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-5">
          {editing ? (
            <textarea value={draft.notes} onChange={e => setDraft(p => ({ ...p, notes: e.target.value }))}
              className="w-full text-sm text-slate-600 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-blue-50/30" rows={2} />
          ) : (
            <p className="text-sm text-slate-600 italic">{report.notes}</p>
          )}
        </div>

        {/* Data table */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-slate-300">
              <th className="py-2 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">Metric</th>
              <th className="py-2 text-right text-xs font-bold text-slate-700 uppercase tracking-wide">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(editing ? draft.rows : report.rows).map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-2.5">
                  {editing ? (
                    <input value={row.label} onChange={e => setDraft(p => { const rows = [...p.rows]; rows[i] = { ...rows[i], label: e.target.value }; return { ...p, rows }; })}
                      className="text-sm text-slate-700 border-b border-blue-200 focus:outline-none w-full bg-transparent" />
                  ) : (
                    <span className="text-sm text-slate-700">{row.label}</span>
                  )}
                </td>
                <td className="py-2.5 text-right">
                  {editing ? (
                    <input value={row.value} onChange={e => setDraft(p => { const rows = [...p.rows]; rows[i] = { ...rows[i], value: e.target.value }; return { ...p, rows }; })}
                      className="text-sm font-semibold text-slate-900 text-right border-b border-blue-200 focus:outline-none bg-transparent" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10px] text-slate-400">Generated by MernCrest ERP · Confidential</p>
          <p className="text-[10px] text-slate-400">{new Date().toLocaleDateString("en-GB")}</p>
        </div>
      </div>

      {/* Edit history */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 max-w-3xl mx-auto">
        <h3 className="text-sm font-semibold text-slate-800 mb-3" style={{ fontFamily: "var(--font-display)" }}>Edit History</h3>
        <div className="space-y-2">
          {[...report.editHistory].reverse().map((h, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-700">{h.user}</span>
              <span className="text-xs text-slate-500">{h.action}</span>
              <span className="ml-auto text-[10px] text-slate-400">{h.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [openReport, setOpenReport] = useState<string | null>(null);

  if (openReport) {
    return (
      <div className="p-6">
        <EditableReport reportId={openReport} onClose={() => setOpenReport(null)} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Reports & Analytics</h2>
          <p className="text-sm text-slate-500 mt-0.5">Company-wide insights · March 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Download size={14} /> Export All
          </button>
        </div>
      </div>

      {/* Report category grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {reportCategories.map(r => (
          <button key={r.label} onClick={() => setOpenReport(r.id)}
            className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-md hover:border-blue-200 transition-all group">
            <div className={`${r.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <r.icon size={18} />
            </div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{r.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{r.sub}</p>
            <p className="text-[10px] text-blue-500 mt-2 font-medium group-hover:underline">Open &amp; Edit →</p>
          </button>
        ))}
      </div>

      {/* Featured charts */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Revenue Trend</h3>
              <p className="text-xs text-slate-500">Sep 2024 – Mar 2025</p>
            </div>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 focus:outline-none">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
              <option>YTD</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} width={36} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} formatter={(v: unknown) => `LKR ${((v as number)/1000000).toFixed(2)}M`} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 text-sm mb-4" style={{ fontFamily: "var(--font-display)" }}>Key Metrics</h3>
          <div className="space-y-3">
            {[
              { label: "Revenue Growth (MoM)", value: "+10.2%", color: "text-emerald-600" },
              { label: "Project Completion Rate", value: "87%", color: "text-blue-600" },
              { label: "Ticket Resolution SLA", value: "94.2%", color: "text-emerald-600" },
              { label: "Employee Retention", value: "96.7%", color: "text-emerald-600" },
              { label: "Invoice Collection Rate", value: "78.4%", color: "text-amber-600" },
              { label: "Payroll Accuracy", value: "99.8%", color: "text-emerald-600" },
              { label: "Avg Deal Cycle", value: "28 days", color: "text-blue-600" },
              { label: "Support CSAT", value: "4.7/5.0", color: "text-emerald-600" },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-600">{m.label}</span>
                <span className={`text-sm font-bold ${m.color}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
