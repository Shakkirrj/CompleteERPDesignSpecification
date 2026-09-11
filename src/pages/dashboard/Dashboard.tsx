import { Users, Briefcase, Receipt, TrendingUp, Clock, AlertTriangle, CheckCircle, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal, ExternalLink, ChevronRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import KpiCard from "../../components/ui/KpiCard";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { revenueData, projects, tickets, invoices, attendanceData, departments } from "../../data/mockData";

const deptColors = ["#2563EB","#7C3AED","#059669","#D97706","#DC2626","#0891B2","#DB2777","#64748B"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2.5">
      <p className="text-xs font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: <strong>LKR {(p.value / 1000000).toFixed(1)}M</strong>
        </p>
      ))}
    </div>
  );
};

const AttTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2.5">
      <p className="text-xs font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const totalEmp = 61;
  return (
    <div className="p-6 space-y-6">
      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Good morning, Priya 👋</h2>
          <p className="text-sm text-slate-500 mt-0.5">Friday, 10 March 2025 · Colombo HQ · <span className="text-blue-600 font-medium">5 items need your attention</span></p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
            <AlertTriangle size={12} /> 2 Critical Alerts
          </span>
          <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Quick Actions
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Total Employees" value="61" change="3 joined this month" changeType="up" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" subtitle="58 active · 3 on leave" />
        <KpiCard title="Active Projects" value="5" change="1 completed this month" changeType="up" icon={Briefcase} iconColor="text-violet-600" iconBg="bg-violet-50" subtitle="2 critical priority" />
        <KpiCard title="Monthly Revenue" value="LKR 5.4M" change="10.2%" changeType="up" icon={TrendingUp} iconColor="text-emerald-600" iconBg="bg-emerald-50" subtitle="Target: LKR 6.0M" />
        <KpiCard title="Outstanding Invoices" value="LKR 2.1M" change="3 overdue" changeType="down" icon={Receipt} iconColor="text-orange-600" iconBg="bg-orange-50" subtitle="Across 4 clients" />
      </div>

      {/* Second KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Today's Attendance" value="46/61" change="Present rate 75.4%" changeType="neutral" icon={Clock} iconColor="text-cyan-600" iconBg="bg-cyan-50" subtitle="5 absent · 3 late" />
        <KpiCard title="Open Tickets" value="18" change="5 critical/high" changeType="down" icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" subtitle="Avg. response 2.4h" />
        <KpiCard title="Pending Approvals" value="7" change="4 leave · 2 expense · 1 PO" changeType="neutral" icon={CheckCircle} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <KpiCard title="Net Profit (Mar)" value="LKR 2.4M" change="14.3%" changeType="up" icon={DollarSign} iconColor="text-emerald-600" iconBg="bg-emerald-50" subtitle="44.4% margin" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Revenue area chart */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500">Last 7 months · LKR</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-xs text-slate-500">Revenue</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /><span className="text-xs text-slate-500">Expenses</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-xs text-slate-500">Profit</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#CBD5E1" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={2} fill="url(#rev)" />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#059669" strokeWidth={2} fill="url(#profit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department headcount donut */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5">
          <div className="mb-3">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Headcount by Dept</h3>
            <p className="text-xs text-slate-500">61 total employees</p>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={departments} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} strokeWidth={2} stroke="#fff">
                {departments.map((_, i) => <Cell key={i} fill={deptColors[i % deptColors.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}`, n]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {departments.slice(0, 6).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: deptColors[i] }} />
                <span className="text-[10px] text-slate-600 truncate">{d.name} <span className="font-semibold">{d.count}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance bar + projects/tickets */}
      <div className="grid grid-cols-12 gap-4">
        {/* Attendance */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Weekly Attendance</h3>
              <p className="text-xs text-slate-500">Mon–Fri this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={attendanceData} barSize={12}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<AttTooltip />} />
              <Bar dataKey="present" name="Present" fill="#059669" radius={[2,2,0,0]} />
              <Bar dataKey="late" name="Late" fill="#F59E0B" radius={[2,2,0,0]} />
              <Bar dataKey="absent" name="Absent" fill="#DC2626" radius={[2,2,0,0]} />
              <Bar dataKey="leave" name="Leave" fill="#8B5CF6" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3 mt-2">
            {[["Present","#059669"],["Late","#F59E0B"],["Absent","#DC2626"],["Leave","#8B5CF6"]].map(([l,c]) => (
              <div key={l} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: c }} /><span className="text-[10px] text-slate-500">{l}</span></div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Active Projects</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">All Projects <ChevronRight size={12} /></button>
          </div>
          <div className="space-y-3">
            {projects.filter(p => p.status === "in-progress").slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase size={14} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                    <span className="text-xs font-bold text-slate-700 ml-2">{p.progress}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{p.client}</p>
                  <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${p.progress > 80 ? "bg-emerald-500" : p.progress > 50 ? "bg-blue-500" : "bg-violet-500"}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
                <StatusBadge status={p.priority} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Critical Tickets */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Open Tickets</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">All <ChevronRight size={12} /></button>
          </div>
          <div className="space-y-2.5">
            {tickets.slice(0, 4).map(t => (
              <div key={t.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-mono text-slate-400">{t.id}</span>
                  <StatusBadge status={t.priority} size="sm" />
                </div>
                <p className="text-xs font-medium text-slate-700 mt-1 line-clamp-2">{t.title}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.client}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices + Activity */}
      <div className="grid grid-cols-12 gap-4">
        {/* Recent invoices */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Recent Invoices</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">View All <ExternalLink size={10} /></button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-5 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Invoice</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Client</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Due</th>
                <th className="px-5 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3"><span className="font-mono text-xs text-blue-600 font-medium">{inv.id}</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-700">{inv.client}</span></td>
                  <td className="px-3 py-3 text-right"><span className="text-xs font-semibold text-slate-800">LKR {(inv.amount/1000).toFixed(0)}K</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-500">{inv.dueDate}</span></td>
                  <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {[
              { actor: "Kavinda Perera", action: "pushed 3 commits to", target: "hr-system/main", time: "5m ago", color: "bg-slate-700" },
              { actor: "Amali De Silva", action: "approved leave for", target: "Nishani Silva", time: "22m ago", color: "bg-violet-500" },
              { actor: "Rajith Kumara", action: "recorded payment from", target: "Ceylon Bank Ltd", time: "1h ago", color: "bg-emerald-500" },
              { actor: "Chamara Wickramasinghe", action: "created quotation for", target: "Sampath Bank", time: "2h ago", color: "bg-amber-500" },
              { actor: "Sameera Bandara", action: "deployed to production", target: "hr-system v2.3.1", time: "3h ago", color: "bg-blue-500" },
              { actor: "Priya Jayawardena", action: "approved PO for", target: "Server Hardware — LKR 380K", time: "4h ago", color: "bg-rose-500" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar name={a.actor} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">{a.actor}</span>
                    {" "}{a.action}{" "}
                    <span className="text-blue-600 font-medium">{a.target}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">3 domains expiring in the next 30 days</p>
          <p className="text-xs text-amber-700 mt-0.5">merncrest.lk (12 days), ceylonretail.lk (18 days), digitalcove.lk (28 days) — Review & renew to avoid downtime.</p>
        </div>
        <button className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">Review Now</button>
      </div>
    </div>
  );
}
