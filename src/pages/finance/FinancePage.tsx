import { TrendingUp, TrendingDown, DollarSign, CreditCard, Banknote, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { revenueData } from "../../data/mockData";

const cashFlowData = [
  { month: "Oct", inflow: 4100000, outflow: 3200000 },
  { month: "Nov", inflow: 3800000, outflow: 2900000 },
  { month: "Dec", inflow: 5200000, outflow: 3800000 },
  { month: "Jan", inflow: 4600000, outflow: 3300000 },
  { month: "Feb", inflow: 4900000, outflow: 3400000 },
  { month: "Mar", inflow: 5400000, outflow: 3600000 },
];

const expenseBreakdown = [
  { name: "Salaries", value: 8060000, color: "#2563EB" },
  { name: "Infrastructure", value: 420000, color: "#7C3AED" },
  { name: "Marketing", value: 310000, color: "#059669" },
  { name: "Office", value: 180000, color: "#D97706" },
  { name: "Software", value: 290000, color: "#0891B2" },
  { name: "Other", value: 140000, color: "#94A3B8" },
];

export default function FinancePage() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Finance</h2>
        <p className="text-sm text-slate-500 mt-0.5">Financial overview · March 2025</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: "Revenue (MTD)", value: "LKR 5.4M", change: "+10.2%", up: true, color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: TrendingDown, label: "Expenses (MTD)", value: "LKR 3.0M", change: "+5.4%", up: false, color: "text-red-600", bg: "bg-red-50" },
          { icon: DollarSign, label: "Net Profit (MTD)", value: "LKR 2.4M", change: "+14.3%", up: true, color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Banknote, label: "Cash Balance", value: "LKR 18.4M", change: "+2.1%", up: true, color: "text-violet-600", bg: "bg-violet-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color} mt-1`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {s.up ? <ArrowUpRight size={12} className="text-emerald-500" /> : <ArrowDownRight size={12} className="text-red-500" />}
                  <span className={`text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-500"}`}>{s.change}</span>
                  <span className="text-[10px] text-slate-400">vs last month</span>
                </div>
              </div>
              <div className={`${s.bg} p-2 rounded-lg`}>
                <s.icon size={16} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Cash Flow</h3>
            <p className="text-xs text-slate-500">Inflow vs Outflow — Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cashFlowData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} width={36} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} formatter={(v: unknown) => `LKR ${((v as number)/1000000).toFixed(2)}M`} />
              <Bar dataKey="inflow" name="Inflow" fill="#2563EB" radius={[3,3,0,0]} barSize={20} />
              <Bar dataKey="outflow" name="Outflow" fill="#E2E8F0" radius={[3,3,0,0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5">
          <div className="mb-3">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Expense Breakdown</h3>
            <p className="text-xs text-slate-500">March 2025</p>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={45} strokeWidth={2} stroke="#fff">
                  {expenseBreakdown.map((_, i) => <Cell key={i} fill={expenseBreakdown[i].color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {expenseBreakdown.map(e => (
                <div key={e.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                    <span className="text-xs text-slate-600">{e.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">LKR {(e.value/1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* P&L summary */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Profit & Loss Summary</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {["", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"].map(h => (
                <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Revenue", values: revenueData.map(d => d.revenue), positive: true },
              { label: "Expenses", values: revenueData.map(d => d.expenses), positive: false },
              { label: "Gross Profit", values: revenueData.map(d => d.profit), positive: true },
            ].map((row, ri) => (
              <tr key={row.label} className={`border-b border-slate-50 ${ri === 2 ? "bg-emerald-50/30 font-semibold" : "hover:bg-slate-50"}`}>
                <td className="px-5 py-2.5">
                  <span className={`text-sm ${ri === 2 ? "font-bold text-emerald-700" : "text-slate-700"}`}>{row.label}</span>
                </td>
                {row.values.map((v, i) => (
                  <td key={i} className="px-5 py-2.5">
                    <span className={`text-sm font-mono ${ri === 2 ? "font-bold text-emerald-700" : row.positive ? "text-slate-800" : "text-slate-600"}`}>
                      {(v/1000000).toFixed(2)}M
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
