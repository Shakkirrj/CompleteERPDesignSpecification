import { useState } from "react";
import { Globe, Shield, RefreshCw, AlertTriangle, CheckCircle2, ExternalLink, Plus } from "lucide-react";

interface Domain {
  id: string; name: string; registrar: string; expiry: string; daysLeft: number;
  status: "active" | "expiring" | "expired" | "error"; autoRenew: boolean;
  hosting?: string; ssl?: { issuer: string; expiry: string; daysLeft: number; };
  dns: { type: string; name: string; value: string; }[];
}

const domains: Domain[] = [
  {
    id: "d1", name: "merncrest.lk", registrar: "Domains.lk", expiry: "2027-05-01", daysLeft: 232, status: "active", autoRenew: true,
    hosting: "Cloudflare Pages",
    ssl: { issuer: "Let's Encrypt", expiry: "2026-10-15", daysLeft: 34 },
    dns: [
      { type: "A",     name: "@",     value: "104.21.45.100" },
      { type: "CNAME", name: "www",   value: "merncrest.lk" },
      { type: "MX",    name: "@",     value: "aspmx.l.google.com" },
      { type: "TXT",   name: "@",     value: "v=spf1 include:_spf.google.com ~all" },
    ],
  },
  {
    id: "d2", name: "merncrest.com", registrar: "GoDaddy", expiry: "2027-03-01", daysLeft: 171, status: "active", autoRenew: true,
    hosting: "Cloudflare",
    ssl: { issuer: "DigiCert", expiry: "2027-03-01", daysLeft: 171 },
    dns: [
      { type: "A",     name: "@",     value: "104.21.45.100" },
      { type: "CNAME", name: "app",   value: "app.merncrest.lk" },
    ],
  },
  {
    id: "d3", name: "api.merncrest.lk", registrar: "Domains.lk", expiry: "2027-05-01", daysLeft: 232, status: "active", autoRenew: true,
    hosting: "AWS EC2",
    ssl: { issuer: "Let's Encrypt", expiry: "2026-09-30", daysLeft: 19 },
    dns: [
      { type: "A",     name: "api",   value: "10.0.1.11" },
    ],
  },
];

const statusCfg = {
  active:   { label: "Active",        color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  expiring: { label: "Expiring Soon", color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-400" },
  expired:  { label: "Expired",       color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     dot: "bg-red-500" },
  error:    { label: "Error",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     dot: "bg-red-500" },
};

export default function DomainsPage() {
  const [selected, setSelected] = useState<Domain | null>(null);

  const sslExpiring = domains.filter(d => d.ssl && d.ssl.daysLeft < 30).length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Domains & SSL</h2>
          <p className="text-sm text-slate-500 mt-0.5">{domains.length} domains · {domains.filter(d => d.ssl).length} SSL certificates</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-colors">
          <Plus size={14} /> Add Domain
        </button>
      </div>

      {sslExpiring > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700"><strong>{sslExpiring} SSL certificate(s)</strong> expiring within 30 days. Renew to prevent service interruptions.</p>
        </div>
      )}

      {/* Domain cards */}
      <div className="space-y-3">
        {domains.map(d => {
          const sc = statusCfg[d.status];
          const sslWarn = d.ssl && d.ssl.daysLeft < 30;
          return (
            <div key={d.id} className={`bg-white border ${sc.border} rounded-xl p-4`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Globe size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm font-bold text-slate-800">{d.name}</p>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[10px] text-slate-400">Registrar: {d.registrar}</span>
                      <span className="text-[10px] text-slate-400">Expires: {d.expiry} ({d.daysLeft} days)</span>
                      {d.hosting && <span className="text-[10px] text-slate-400">Hosting: {d.hosting}</span>}
                      <span className={`text-[10px] font-medium ${d.autoRenew ? "text-emerald-600" : "text-slate-400"}`}>
                        {d.autoRenew ? "✓ Auto-renew" : "Manual renew"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {d.ssl && (
                    <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${sslWarn ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                      <Shield size={11} />
                      SSL {d.ssl.daysLeft}d
                    </div>
                  )}
                  <button onClick={() => setSelected(selected?.id === d.id ? null : d)} className="text-xs text-blue-600 hover:underline">Details</button>
                </div>
              </div>

              {/* DNS records preview */}
              {selected?.id === d.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">DNS Records</p>
                      <div className="space-y-1">
                        {d.dns.map((rec, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono bg-slate-50 rounded px-2 py-1.5">
                            <span className="text-[9px] bg-blue-50 text-blue-700 px-1 rounded font-sans font-semibold">{rec.type}</span>
                            <span className="text-slate-500">{rec.name}</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-slate-700 truncate">{rec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {d.ssl && (
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">SSL Certificate</p>
                        <div className={`rounded-xl p-3 border ${sslWarn ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield size={14} className={sslWarn ? "text-amber-600" : "text-emerald-600"} />
                            <span className="text-xs font-semibold text-slate-700">{sslWarn ? "Expiring Soon" : "Valid"}</span>
                          </div>
                          <p className="text-xs text-slate-600">Issuer: {d.ssl.issuer}</p>
                          <p className="text-xs text-slate-600">Expires: {d.ssl.expiry}</p>
                          <p className={`text-xs font-semibold mt-1 ${sslWarn ? "text-amber-600" : "text-emerald-600"}`}>{d.ssl.daysLeft} days remaining</p>
                          {sslWarn && (
                            <button className="mt-2 w-full text-xs bg-amber-600 text-white hover:bg-amber-700 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1">
                              <RefreshCw size={10} /> Renew Certificate
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
