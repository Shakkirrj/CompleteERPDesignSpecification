import { useState } from "react";
import { Play, Download, Clock, X, TrendingUp, Percent, Calculator, RefreshCw } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";

const payrollRuns = [
  { period: "March 2025", status: "draft", employees: 61, gross: 10240000, deductions: 2180000, net: 8060000, processDate: "—", paidOn: "—" },
  { period: "February 2025", status: "paid", employees: 59, gross: 9870000, deductions: 2100000, net: 7770000, processDate: "2025-02-28", paidOn: "2025-03-01" },
  { period: "January 2025", status: "paid", employees: 58, gross: 9640000, deductions: 2050000, net: 7590000, processDate: "2025-01-31", paidOn: "2025-02-01" },
  { period: "December 2024", status: "paid", employees: 57, gross: 10180000, deductions: 2190000, net: 7990000, processDate: "2024-12-31", paidOn: "2025-01-02" },
];

interface EmpSalary {
  emp: string; dept: string; designation: string;
  basic: number; transport: number; housing: number; meal: number;
  salesCommRate: number; salesRevenue: number;
  serviceCommRate: number; serviceRevenue: number;
  overtimeHours: number; overtimeRate: number;
  canSetRates: boolean;
}

const salaries: EmpSalary[] = [
  { emp: "Priya Jayawardena",        dept: "Operations",  designation: "Director",           basic: 380000, transport: 20000, housing: 35000, meal: 12000, salesCommRate: 2.5, salesRevenue: 1800000, serviceCommRate: 1.2, serviceRevenue: 2200000, overtimeHours: 0, overtimeRate: 0, canSetRates: true  },
  { emp: "Dilshan Fernando",         dept: "Engineering", designation: "Eng. Manager",        basic: 265000, transport: 18000, housing: 25000, meal: 10000, salesCommRate: 1.5, salesRevenue: 800000,  serviceCommRate: 0.8, serviceRevenue: 1400000, overtimeHours: 4, overtimeRate: 1800, canSetRates: true  },
  { emp: "Chamara Wickramasinghe",   dept: "Sales",       designation: "Sales Manager",       basic: 195000, transport: 15000, housing: 20000, meal: 8000,  salesCommRate: 3.0, salesRevenue: 1200000, serviceCommRate: 1.0, serviceRevenue: 600000,  overtimeHours: 0, overtimeRate: 0, canSetRates: true  },
  { emp: "Amali De Silva",           dept: "HR",          designation: "HR Manager",          basic: 195000, transport: 15000, housing: 20000, meal: 8000,  salesCommRate: 0,   salesRevenue: 0,        serviceCommRate: 0,   serviceRevenue: 0,        overtimeHours: 2, overtimeRate: 1600, canSetRates: false },
  { emp: "Kavinda Perera",           dept: "Engineering", designation: "Sr. Software Eng.",   basic: 185000, transport: 12000, housing: 18000, meal: 8000,  salesCommRate: 0,   salesRevenue: 0,        serviceCommRate: 1.5, serviceRevenue: 900000,  overtimeHours: 8, overtimeRate: 1500, canSetRates: false },
  { emp: "Rajith Kumara",            dept: "Finance",     designation: "Sr. Accountant",      basic: 175000, transport: 12000, housing: 15000, meal: 8000,  salesCommRate: 0,   salesRevenue: 0,        serviceCommRate: 0,   serviceRevenue: 0,        overtimeHours: 0, overtimeRate: 0, canSetRates: false },
];

function fmt(n: number) { return n.toLocaleString(); }

function calcNet(s: EmpSalary, salesRate?: number, serviceRate?: number) {
  const sr = salesRate ?? s.salesCommRate;
  const svr = serviceRate ?? s.serviceCommRate;
  const grossBasic = s.basic + s.transport + s.housing + s.meal
    + (s.overtimeHours * s.overtimeRate)
    + (s.salesRevenue * sr / 100)
    + (s.serviceRevenue * svr / 100);
  const epfEmp = Math.round(s.basic * 0.08);
  const epfEr  = Math.round(s.basic * 0.12);
  const etf    = Math.round(s.basic * 0.03);
  const taxableBase = grossBasic - epfEmp;
  const paye = taxableBase > 250000 ? Math.round((taxableBase - 250000) * 0.06) : 0;
  const totalDed = epfEmp + paye;
  const net = grossBasic - totalDed;
  return { grossBasic, epfEmp, epfEr, etf, paye, totalDed, net,
    salesComm: Math.round(s.salesRevenue * sr / 100),
    serviceComm: Math.round(s.serviceRevenue * svr / 100),
    overtime: s.overtimeHours * s.overtimeRate };
}

function SalaryDetailModal({ emp, onClose, canEdit }: { emp: EmpSalary; onClose: () => void; canEdit: boolean }) {
  const [salesRate, setSalesRate] = useState(emp.salesCommRate);
  const [serviceRate, setServiceRate] = useState(emp.serviceCommRate);
  const calc = calcNet(emp, salesRate, serviceRate);

  const rows: { label: string; value: number; type: "add" | "sub" | "neutral"; note?: string }[] = [
    { label: "Basic Salary",              value: emp.basic,           type: "neutral" },
    { label: "Transport Allowance",       value: emp.transport,       type: "add" },
    { label: "Housing Allowance",         value: emp.housing,         type: "add" },
    { label: "Meal Allowance",            value: emp.meal,            type: "add" },
    ...(emp.overtimeHours > 0 ? [{ label: `Overtime (${emp.overtimeHours}h × ${fmt(emp.overtimeRate)})`, value: calc.overtime, type: "add" as const }] : []),
    ...(salesRate > 0 && emp.salesRevenue > 0 ? [{ label: `Sales Commission (${salesRate}% of LKR ${fmt(emp.salesRevenue)})`, value: calc.salesComm, type: "add" as const, note: "Rate set by Manager/Director" }] : []),
    ...(serviceRate > 0 && emp.serviceRevenue > 0 ? [{ label: `Service Commission (${serviceRate}% of LKR ${fmt(emp.serviceRevenue)})`, value: calc.serviceComm, type: "add" as const, note: "Rate set by Manager/Director" }] : []),
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <Avatar name={emp.emp} size="sm" />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">{emp.emp}</p>
            <p className="text-xs text-slate-500">{emp.dept} · {emp.designation}</p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">March 2025</span>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={16} className="text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Commission rate editor (Manager/Director only) */}
          {canEdit && (emp.salesRevenue > 0 || emp.serviceRevenue > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-800 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp size={12} /> Commission Rate Override (Manager/Director)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {emp.salesRevenue > 0 && (
                  <div>
                    <label className="text-xs font-medium text-amber-700">Sales Commission %</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input type="number" min="0" max="20" step="0.5" value={salesRate}
                        onChange={e => setSalesRate(Number(e.target.value))}
                        className="flex-1 border border-amber-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" />
                      <Percent size={12} className="text-amber-600" />
                    </div>
                  </div>
                )}
                {emp.serviceRevenue > 0 && (
                  <div>
                    <label className="text-xs font-medium text-amber-700">Service Commission %</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input type="number" min="0" max="20" step="0.5" value={serviceRate}
                        onChange={e => setServiceRate(Number(e.target.value))}
                        className="flex-1 border border-amber-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" />
                      <Percent size={12} className="text-amber-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Earnings breakdown */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Earnings</p>
            <div className="space-y-2">
              {rows.map((r, i) => (
                <div key={i} className="flex items-start justify-between py-2 border-b border-slate-50">
                  <div>
                    <p className="text-sm text-slate-700">{r.label}</p>
                    {r.note && <p className="text-[10px] text-slate-400 mt-0.5">{r.note}</p>}
                  </div>
                  <span className={`text-sm font-mono font-medium ${r.type === "add" ? "text-emerald-600" : "text-slate-800"}`}>
                    {r.type === "add" ? "+" : ""}{fmt(r.value)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between py-2 bg-slate-50 rounded-lg px-3 mt-1">
                <span className="text-sm font-semibold text-slate-800">Gross Salary</span>
                <span className="text-sm font-bold text-slate-900 font-mono">LKR {fmt(calc.grossBasic)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Statutory Deductions</p>
            <div className="space-y-2">
              {[
                { label: `EPF — Employee (8% of ${fmt(emp.basic)})`,    value: calc.epfEmp, note: "Deducted from salary"       },
                { label: `PAYE Tax (on taxable income > 250,000)`,       value: calc.paye,   note: calc.paye === 0 ? "Below threshold — no PAYE" : ""  },
              ].map((d, i) => (
                <div key={i} className="flex items-start justify-between py-2 border-b border-slate-50">
                  <div>
                    <p className="text-sm text-slate-700">{d.label}</p>
                    {d.note && <p className="text-[10px] text-slate-400 mt-0.5">{d.note}</p>}
                  </div>
                  <span className="text-sm font-mono font-medium text-red-500">-{fmt(d.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div>
                  <p className="text-sm text-slate-700">EPF — Employer (12% of {fmt(emp.basic)})</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Not deducted from salary — company contribution</p>
                </div>
                <span className="text-sm font-mono text-blue-600">{fmt(calc.epfEr)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-slate-700">ETF — Employer (3% of {fmt(emp.basic)})</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Company contribution only</p>
                </div>
                <span className="text-sm font-mono text-blue-600">{fmt(calc.etf)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net pay footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total Deductions</p>
            <p className="text-base font-bold text-red-600 font-mono mt-0.5">LKR {fmt(calc.totalDed)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Net Pay</p>
            <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5" style={{ fontFamily: "var(--font-display)" }}>LKR {fmt(calc.net)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayrollPage() {
  const [selectedEmp, setSelectedEmp] = useState<EmpSalary | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);
  const [calculating, setCalculating] = useState(false);
  const currentUser = salaries[0]; // Priya = Director, canSetRates = true

  function handleCalculateNow() {
    setCalculating(true);
    setFeedback({ type: "processing", title: "Calculating Payroll…", message: "Processing all 61 employees. This may take a moment." });
    setTimeout(() => {
      setCalculating(false);
      setFeedback({
        type: "success", title: "Payroll Calculated",
        message: "March 2025 payroll has been calculated for all 61 employees.",
        ref: "PR-2025-03", refLabel: "Payroll Run",
        amount: "LKR 8,060,000 Net",
        actions: [
          { label: "Review & Approve", onClick: () => {}, primary: true },
          { label: "Download Report", onClick: () => {} },
        ],
      });
    }, 2600);
  }

  function handleRunPayroll() {
    setFeedback({ type: "processing", title: "Processing Payroll…", message: "Initiating bank disbursement for 61 employees." });
    setTimeout(() => {
      setFeedback({
        type: "payment", title: "Payroll Disbursed",
        message: "March 2025 salary payments have been initiated.",
        ref: "PR-2025-03", refLabel: "Payroll Run",
        amount: "LKR 8,060,000",
        actions: [{ label: "View Details", onClick: () => {}, primary: true }],
      });
    }, 3000);
  }

  return (
    <>
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Payroll</h2>
          <p className="text-sm text-slate-500 mt-0.5">March 2025 payroll is in draft</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Download size={14} /> Export
          </button>
          <button onClick={handleRunPayroll} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Play size={14} /> Run Payroll
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock size={18} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">March 2025 Payroll — Draft</p>
          <p className="text-xs text-amber-700 mt-0.5">61 employees · LKR 10,240,000 gross · Due to process by March 31</p>
          <div className="flex items-center gap-2 mt-2">
            {["Draft","Calculate","Review","Approve","Process","Pay","Lock"].map((step, i) => (
              <div key={step} className="flex items-center gap-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${i === 0 ? "bg-amber-200 text-amber-800" : "bg-amber-100/50 text-amber-600/60"}`}>{step}</span>
                {i < 6 && <span className="text-amber-300 text-[10px]">→</span>}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleCalculateNow} disabled={calculating}
          className="text-sm bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0 flex items-center gap-2">
          {calculating ? <RefreshCw size={13} className="animate-spin" /> : <Calculator size={13} />}
          {calculating ? "Calculating…" : "Calculate Now"}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Payroll (Mar)", value: "LKR 10.24M", sub: "Gross amount", color: "text-slate-800" },
          { label: "Net Payout (Mar)",    value: "LKR 8.06M",  sub: "After deductions", color: "text-emerald-600" },
          { label: "Total Deductions",    value: "LKR 2.18M",  sub: "Tax + EPF + ETF", color: "text-amber-600" },
          { label: "Avg. Salary",         value: "LKR 167,869",sub: "Per employee",    color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-lg font-bold ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 text-sm mb-3" style={{ fontFamily: "var(--font-display)" }}>Payroll History</h3>
          <div className="space-y-2">
            {payrollRuns.map(run => (
              <div key={run.period} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{run.period}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{run.employees} employees</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">LKR {(run.net/1000000).toFixed(2)}M</p>
                  <StatusBadge status={run.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Employee Salary Overview</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Click row for full breakdown</span>
              <StatusBadge status="draft" />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Employee</th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Basic</th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Commission</th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Deductions</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Net Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {salaries.map(s => {
                const c = calcNet(s);
                return (
                  <tr key={s.emp}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEmp(s)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={s.emp} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{s.emp}</p>
                          <p className="text-[10px] text-slate-400">{s.dept} · {s.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right"><span className="text-sm text-slate-700 font-mono">{fmt(s.basic)}</span></td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-sm text-emerald-600 font-mono">
                        {c.salesComm + c.serviceComm > 0 ? `+${fmt(c.salesComm + c.serviceComm)}` : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right"><span className="text-sm text-red-500 font-mono">-{fmt(c.totalDed)}</span></td>
                    <td className="px-5 py-3 text-right"><span className="text-sm font-bold text-slate-900 font-mono">{fmt(c.net)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmp && (
        <SalaryDetailModal
          emp={selectedEmp}
          onClose={() => setSelectedEmp(null)}
          canEdit={currentUser.canSetRates}
        />
      )}
    </div>
    <ActionFeedback data={feedback} onDismiss={() => setFeedback(null)} />
    </>
  );
}
