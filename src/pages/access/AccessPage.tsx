import { useState } from "react";
import { Plus, Shield, Lock, Key, Users, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import StatusBadge from "../../components/ui/StatusBadge";

const tabs = ["Users", "Roles", "Permissions", "Sessions", "Audit Logs"];

const users = [
  { name: "Priya Jayawardena", email: "priya@merncrest.lk", role: "Director", scope: "Global", status: "active", mfa: true, lastLogin: "2025-03-10 09:15" },
  { name: "Dilshan Fernando", email: "dilshan@merncrest.lk", role: "Manager", scope: "Company", status: "active", mfa: true, lastLogin: "2025-03-10 08:47" },
  { name: "Rajith Kumara", email: "rajith@merncrest.lk", role: "Accountant", scope: "Company", status: "active", mfa: false, lastLogin: "2025-03-10 09:02" },
  { name: "Kavinda Perera", email: "kavinda@merncrest.lk", role: "Employee", scope: "Own", status: "active", mfa: true, lastLogin: "2025-03-10 08:52" },
  { name: "Tharaka Ranatunga", email: "tharaka@merncrest.lk", role: "Employee", scope: "Team", status: "inactive", mfa: false, lastLogin: "2025-03-07 10:30" },
];

const roles = [
  { name: "Director", users: 2, description: "Full system access, all modules, all branches", color: "bg-red-50 text-red-700 border-red-200" },
  { name: "Manager", users: 8, description: "Branch/department visibility, approvals, reports", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { name: "Accountant", users: 5, description: "Finance, payroll, invoices, payments only", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Employee", users: 46, description: "Own profile, attendance, leave, tasks, tickets", color: "bg-slate-50 text-slate-700 border-slate-200" },
];

export default function AccessPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Access Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">Users, roles, and permissions</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Add User
        </button>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === i ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="bg-white rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">User</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Role</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Scope</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">MFA</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Login</th>
                <th className="pr-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{u.role}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-slate-500">{u.scope}</span>
                  </td>
                  <td className="px-3 py-3">
                    {u.mfa
                      ? <CheckCircle size={14} className="text-emerald-500" />
                      : <XCircle size={14} className="text-slate-300" />
                    }
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-3 py-3"><span className="text-xs font-mono text-slate-500">{u.lastLogin}</span></td>
                  <td className="pr-5 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg"><Eye size={13} className="text-slate-400" /></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg"><Edit size={13} className="text-slate-400" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={13} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 1 && (
        <div className="grid grid-cols-2 gap-4">
          {roles.map(role => (
            <div key={role.name} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${role.color}`}>{role.name}</span>
                <span className="text-xs text-slate-400">{role.users} users</span>
              </div>
              <p className="text-sm text-slate-600">{role.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <button className="text-xs border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 transition-colors">Edit Role</button>
                <button className="text-xs border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 transition-colors flex items-center gap-1"><Key size={10} /> Permissions</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20">
          <Shield size={32} className="text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">{tabs[activeTab]} — Coming soon</p>
        </div>
      )}
    </div>
  );
}
