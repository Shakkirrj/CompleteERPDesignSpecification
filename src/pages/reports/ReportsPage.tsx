import { Download, BarChart2, Users, Clock, DollarSign, Briefcase, Receipt, Activity } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { revenueData } from "../../data/mockData";

const reportCategories = [
  { icon: Users, label: "HR Reports", sub: "Headcount, turnover, performance", color: "bg-blue-50 text-blue-600" },
  { icon: Clock, label: "Attendance Reports", sub: "Daily, monthly, department-wise", color: "bg-emerald-50 text-emerald-600" },
  { icon: DollarSign, label: "Payroll Reports", sub: "Salary, deductions, EPF/ETF", color: "bg-amber-50 text-amber-600" },
  { icon: Briefcase, label: "Project Reports", sub: "Budget, timeline, resource", color: "bg-violet-50 text-violet-600" },
  { icon: Receipt, label: "Finance Reports", sub: "P&L, balance sheet, cash flow", color: "bg-cyan-50 text-cyan-600" },
  { icon: BarChart2, label: "Sales Reports", sub: "Revenue, pipeline, commissions", color: "bg-pink-50 text-pink-600" },
  { icon: Activity, label: "Service Desk Reports", sub: "Ticket SLA, resolution time", color: "bg-orange-50 text-orange-600" },
  { icon: BarChart2, label: "Custom Reports", sub: "Build your own report", color: "bg-slate-50 text-slate-600" },
];

export default function ReportsPage() {
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
          <button key={r.label} className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-md hover:border-blue-200 transition-all group">
            <div className={`${r.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <r.icon size={18} />
            </div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{r.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{r.sub}</p>
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
