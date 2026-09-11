import { useState } from "react";
import { Key, Eye, EyeOff, Plus, Copy, Trash2, RefreshCw, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

interface APIKey {
  id: string; name: string; prefix: string; created: string;
  lastUsed?: string; permissions: string[]; status: "active" | "revoked"; requests: number;
}

interface Secret {
  id: string; name: string; category: string;
  lastUpdated: string; updatedBy: string; rotationDue?: string;
  accessCount: number;
}

const apiKeys: APIKey[] = [
  { id: "k1", name: "Production Web App",  prefix: "mc_live_xK9pQr", created: "2026-01-15", lastUsed: "2 min ago",   permissions: ["read:all", "write:invoices", "write:crm"],     status: "active", requests: 48291 },
  { id: "k2", name: "Mobile App",           prefix: "mc_live_aB3nFt", created: "2026-02-01", lastUsed: "1 hour ago",  permissions: ["read:employees", "write:attendance"],           status: "active", requests: 12047 },
  { id: "k3", name: "Reporting Service",    prefix: "mc_live_mZ7wXc", created: "2026-03-10", lastUsed: "5 min ago",   permissions: ["read:all"],                                     status: "active", requests: 8932 },
  { id: "k4", name: "Old Integration Test", prefix: "mc_test_hQ2rPs", created: "2025-11-01", lastUsed: "90 days ago", permissions: ["read:crm"],                                     status: "revoked", requests: 234 },
];

const secrets: Secret[] = [
  { id: "s1", name: "DATABASE_URL",          category: "Database",       lastUpdated: "2026-08-01", updatedBy: "Chamara Wickramasinghe", rotationDue: "2026-11-01", accessCount: 4 },
  { id: "s2", name: "OPENAI_API_KEY",         category: "AI",            lastUpdated: "2026-07-15", updatedBy: "Admin",                  rotationDue: "2026-10-15", accessCount: 2 },
  { id: "s3", name: "SMTP_PASSWORD",          category: "Email",         lastUpdated: "2026-06-20", updatedBy: "Admin",                  rotationDue: "2026-09-20", accessCount: 3 },
  { id: "s4", name: "STRIPE_SECRET_KEY",      category: "Payments",      lastUpdated: "2026-08-10", updatedBy: "Admin",                  rotationDue: "2026-11-10", accessCount: 2 },
  { id: "s5", name: "JWT_SECRET",             category: "Security",      lastUpdated: "2026-05-01", updatedBy: "Admin",                  rotationDue: "2026-08-01", accessCount: 1 },
  { id: "s6", name: "CLOUDFLARE_API_TOKEN",   category: "Infrastructure",lastUpdated: "2026-07-01", updatedBy: "Chamara Wickramasinghe",                            accessCount: 3 },
];

const catColors: Record<string, string> = {
  Database: "bg-blue-50 text-blue-700", AI: "bg-violet-50 text-violet-700",
  Email: "bg-amber-50 text-amber-700", Payments: "bg-emerald-50 text-emerald-700",
  Security: "bg-red-50 text-red-700", Infrastructure: "bg-slate-100 text-slate-600",
};

export default function APISecretsPage() {
  const [activeTab, setActiveTab] = useState<"keys" | "secrets">("keys");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  function toggleReveal(id: string) { setRevealed(s => ({ ...s, [id]: !s[id] })); }
  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const overdueSecrets = secrets.filter(s => s.rotationDue && new Date(s.rotationDue) < new Date());

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>API & Secrets</h2>
          <p className="text-sm text-slate-500 mt-0.5">{apiKeys.filter(k => k.status === "active").length} active API keys · {secrets.length} secrets</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-colors">
          <Plus size={14} /> {activeTab === "keys" ? "New API Key" : "Add Secret"}
        </button>
      </div>

      {/* Security alert */}
      {overdueSecrets.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <strong>{overdueSecrets.length} secret(s)</strong> are past their rotation due date. Rotate them to maintain security compliance.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(["keys", "secrets"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === t ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            {t === "keys" ? "API Keys" : "Secrets Vault"}
          </button>
        ))}
      </div>

      {activeTab === "keys" ? (
        <div className="space-y-3">
          {apiKeys.map(key => (
            <div key={key.id} className={`bg-white border rounded-xl p-4 ${key.status === "revoked" ? "opacity-60 border-slate-200" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${key.status === "active" ? "bg-blue-50" : "bg-slate-100"}`}>
                    <Key size={14} className={key.status === "active" ? "text-blue-600" : "text-slate-400"} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{key.name}</p>
                      {key.status === "active" ? (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">Active</span>
                      ) : (
                        <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">Revoked</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded">{key.prefix}••••••••••••</code>
                      <button onClick={() => copy(key.prefix, key.id)} className="text-slate-400 hover:text-slate-600">
                        {copied === key.id ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-slate-400">Created {key.created}</span>
                      {key.lastUsed && <span className="text-[10px] text-slate-400">Last used {key.lastUsed}</span>}
                      <span className="text-[10px] text-slate-400">{key.requests.toLocaleString()} requests</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {key.permissions.map(p => (
                        <span key={p} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {key.status === "active" && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Revoke"><Trash2 size={13} className="text-red-400" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2">
            <Shield size={13} className="text-amber-600" />
            <p className="text-xs text-amber-700 font-medium">Secrets are encrypted at rest. Values are only shown when explicitly revealed by an authorized user.</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Name</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Category</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Value</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Updated</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Rotation Due</th>
                <th className="pr-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {secrets.map(s => {
                const overdue = s.rotationDue && new Date(s.rotationDue) < new Date();
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-mono font-semibold text-slate-800">{s.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Updated by {s.updatedBy}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${catColors[s.category]}`}>{s.category}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded">
                          {revealed[s.id] ? "sk_••••_[REVEALED_IN_SECURE_CONTEXT]" : "••••••••••••••••"}
                        </code>
                        <button onClick={() => toggleReveal(s.id)} className="text-slate-400 hover:text-slate-600">
                          {revealed[s.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-500">{s.lastUpdated}</span>
                    </td>
                    <td className="px-3 py-3">
                      {s.rotationDue ? (
                        <span className={`text-xs font-medium ${overdue ? "text-red-600" : "text-slate-500"}`}>
                          {s.rotationDue} {overdue && "⚠️"}
                        </span>
                      ) : <span className="text-xs text-slate-300">—</span>}
                    </td>
                    <td className="pr-5 py-3">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Rotate"><RefreshCw size={12} className="text-slate-400" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
