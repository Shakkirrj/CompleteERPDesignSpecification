import { useState } from "react";
import { Search, Plus, Filter, Download, MoreHorizontal, Mail, Phone, ChevronRight, SlidersHorizontal, UserPlus } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { employees } from "../../data/mockData";

const tabs = ["All Employees", "Active", "On Leave", "Inactive"];
const depts = ["All Departments", "Engineering", "Sales", "Finance", "HR", "Design", "Support", "Marketing", "Operations"];

interface Props {
  onViewEmployee?: (id: string) => void;
  onAddEmployee?: () => void;
}

export default function EmployeesPage({ onViewEmployee, onAddEmployee }: Props) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filtered = employees.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "All Departments" || e.department === dept;
    const matchTab = tab === 0 || (tab === 1 && e.status === "active") || (tab === 2 && e.status === "on-leave") || (tab === 3 && e.status === "inactive");
    return matchSearch && matchDept && matchTab;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Employee Directory</h2>
          <p className="text-sm text-slate-500 mt-0.5">{employees.length} employees across 3 branches</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Download size={14} /> Export
          </button>
          <button
            onClick={onAddEmployee}
            className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium"
          >
            <UserPlus size={14} /> Add Employee
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: "61", color: "text-slate-800" },
          { label: "Active", value: "58", color: "text-emerald-600" },
          { label: "On Leave", value: "3", color: "text-amber-600" },
          { label: "New This Month", value: "3", color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-1">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === i ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-52"
              />
            </div>
            <select
              value={dept}
              onChange={e => setDept(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              {depts.map(d => <option key={d}>{d}</option>)}
            </select>
            <button className="flex items-center gap-1.5 text-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="pl-5 pr-3 py-3 text-left">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Employee</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">ID</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Department</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Designation</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Branch</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Manager</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Join Date</th>
                <th className="pr-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(emp => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onViewEmployee?.(emp.id)}
                >
                  <td className="pl-5 pr-3 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={emp.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
                        <p className="text-[10px] text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs text-slate-500">{emp.id}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm text-slate-700">{emp.department}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-slate-600">{emp.designation}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-slate-500">{emp.branch}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-slate-500">{emp.manager}</span>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-slate-500">{emp.joinDate}</span>
                  </td>
                  <td className="pr-5 py-3" onClick={e => e.stopPropagation()}>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {employees.length} employees</p>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Previous</button>
            {[1,2,3,4].map(p => (
              <button key={p} className={`px-2.5 py-1.5 text-xs border rounded-lg ${p === 1 ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{p}</button>
            ))}
            <button className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
