import { useState } from "react";
import {
  Building2, Users, Shield, Bell, Mail, Globe, CreditCard, Database,
  Zap, ChevronRight, ChevronLeft, Phone, MapPin, Lock, Key, Smartphone,
  QrCode, CheckCircle2, Copy, RefreshCw, AlertTriangle, Eye, EyeOff,
  Clock, UserCheck, FileText, Wifi, Server, ToggleLeft, ToggleRight,
} from "lucide-react";

type SubPage = null | "general" | "users" | "security" | "notifications" | "email" | "localization" | "billing-sub" | "backup" | "integrations-settings";

const settingsNav: { id: SubPage; icon: React.ElementType; label: string; sub: string }[] = [
  { id: "general",               icon: Building2,    label: "General",           sub: "Company name, phone, address" },
  { id: "users",                 icon: Users,         label: "Users & Roles",     sub: "Manage access and permissions" },
  { id: "security",              icon: Shield,        label: "Security & 2FA",    sub: "2FA, passwords, sessions" },
  { id: "notifications",         icon: Bell,          label: "Notifications",     sub: "Email, SMS, push alerts" },
  { id: "email",                 icon: Mail,          label: "Email / SMTP",      sub: "SMTP, templates, tracking" },
  { id: "localization",          icon: Globe,         label: "Localization",      sub: "Timezone, currency, language" },
  { id: "billing-sub",           icon: CreditCard,    label: "Billing",           sub: "Subscription, invoices" },
  { id: "backup",                icon: Database,      label: "Backup & Storage",  sub: "Cloud storage, backups" },
  { id: "integrations-settings", icon: Zap,           label: "Integrations",      sub: "API, webhooks, third-party" },
];

/* ─── Sub-page components ─── */

function GeneralSettings() {
  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-400 mb-4">Organization contact information used across documents, invoices, and communications.</p>
      <div className="grid grid-cols-2 gap-4">
        {([
          { label: "Company Name",   value: "MernCrest IT Services (Pvt) Ltd", type: "text" },
          { label: "Phone",          value: "+94 11 234 5678",                  type: "tel"  },
        ] as const).map(f => (
          <div key={f.label}>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{f.label}</label>
            <input defaultValue={f.value} type={f.type}
              className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</label>
        <textarea defaultValue="No. 42, Galle Road, Colombo 03, Sri Lanka" rows={2}
          className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Location / Region</label>
        <select className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Western Province, Sri Lanka</option>
          <option>Central Province, Sri Lanka</option>
          <option>Southern Province, Sri Lanka</option>
        </select>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button className="text-sm border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-slate-600 transition-colors">Discard</button>
        <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Save Changes</button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [twoFAMethod, setTwoFAMethod] = useState<"none" | "totp" | "sms">("none");
  const [totpStep, setTotpStep] = useState<"setup" | "verify" | "done">("setup");
  const [totpCode, setTotpCode] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const secret = "JBSWY3DPEHPK3PXP";
  const qrUrl = `otpauth://totp/MernCrest:admin@merncrest.com?secret=${secret}&issuer=MernCrest`;

  function verifyTOTP() {
    if (totpCode.length === 6) { setTotpStep("done"); setTwoFAMethod("totp"); }
  }

  return (
    <div className="space-y-6">
      {/* Password policy */}
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3">Password & Session Policy</h4>
        <div className="space-y-3">
          {([
            { title: "Enforce strong passwords", desc: "Min 8 chars, uppercase, number, symbol", enabled: true },
            { title: "Session timeout (8 hours)", desc: "Auto-logout after inactivity",          enabled: true },
            { title: "IP Allowlist",              desc: "Restrict access to specific IP ranges", enabled: false },
            { title: "Audit Logging",             desc: "Log all user actions for compliance",   enabled: true },
          ] as const).map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </div>
              <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${s.enabled ? "bg-blue-600" : "bg-slate-300"}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${s.enabled ? "left-5" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2FA Setup */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-800">Two-Factor Authentication (2FA)</h4>
          </div>
          {twoFAMethod === "totp" && totpStep === "done" && (
            <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 font-medium">
              <CheckCircle2 size={11} /> Enabled
            </span>
          )}
        </div>
        <div className="p-5">
          {twoFAMethod === "none" && totpStep !== "done" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Choose your 2FA method. Google Authenticator is recommended for security.</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setTwoFAMethod("totp"); setTotpStep("setup"); }}
                  className="flex flex-col items-start gap-2 p-4 border-2 border-slate-200 hover:border-blue-500 rounded-xl transition-all group"
                >
                  <div className="w-9 h-9 bg-slate-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Google Authenticator</p>
                    <p className="text-xs text-slate-500 mt-0.5">Scan QR code with the app</p>
                  </div>
                </button>
                <button
                  onClick={() => setTwoFAMethod("sms")}
                  className="flex flex-col items-start gap-2 p-4 border-2 border-slate-200 hover:border-blue-500 rounded-xl transition-all group"
                >
                  <div className="w-9 h-9 bg-slate-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors">
                    <Phone size={18} className="text-slate-500 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">SMS One-Time Code</p>
                    <p className="text-xs text-slate-500 mt-0.5">Code sent to your mobile</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {twoFAMethod === "totp" && totpStep === "setup" && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex-shrink-0">
                  <div className="w-28 h-28 bg-slate-900 rounded-lg flex items-center justify-center">
                    <QrCode size={72} className="text-white opacity-90" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 mb-1">Scan with Google Authenticator</p>
                  <p className="text-xs text-slate-500 mb-3">Open Google Authenticator → tap + → Scan a QR code</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2">
                    <Key size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-mono text-slate-700 flex-1 tracking-widest">
                      {showSecret ? secret : "••••  ••••  ••••  ••••"}
                    </span>
                    <button onClick={() => setShowSecret(!showSecret)} className="text-slate-400 hover:text-slate-600">
                      {showSecret ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <button onClick={() => navigator.clipboard.writeText(secret)} className="text-slate-400 hover:text-slate-600">
                      <Copy size={11} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Manual entry key (if QR scan fails)</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Enter 6-digit code to verify</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    value={totpCode}
                    onChange={e => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono tracking-[0.4em] text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={verifyTOTP}
                    disabled={totpCode.length !== 6}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>
              <button onClick={() => { setTwoFAMethod("none"); setTotpCode(""); }} className="text-xs text-slate-400 hover:text-slate-600">
                ← Cancel setup
              </button>
            </div>
          )}

          {twoFAMethod === "totp" && totpStep === "done" && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={22} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Google Authenticator is active</p>
                <p className="text-xs text-slate-500 mt-0.5">Your account is protected with TOTP-based 2FA.</p>
              </div>
              <button
                onClick={() => { setTwoFAMethod("none"); setTotpStep("setup"); setTotpCode(""); }}
                className="text-xs text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          )}

          {twoFAMethod === "sms" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Enter your mobile number to receive one-time codes via SMS.</p>
              <div className="flex items-center gap-2">
                <input defaultValue="+94 77 123 4567" placeholder="+94 77 000 0000"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">Send Code</button>
              </div>
              <button onClick={() => setTwoFAMethod("none")} className="text-xs text-slate-400 hover:text-slate-600">← Back</button>
            </div>
          )}
        </div>
      </div>

      {/* Change password */}
      <div className="border border-slate-200 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Lock size={14} />Change Password</h4>
        {["Current Password", "New Password", "Confirm New Password"].map(label => (
          <div key={label}>
            <label className="text-xs font-medium text-slate-600">{label}</label>
            <div className="relative mt-1">
              <input type={pwVisible ? "text" : "password"} placeholder="••••••••"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
              <button type="button" onClick={() => setPwVisible(!pwVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {pwVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        ))}
        <button className="text-sm bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-colors">Update Password</button>
      </div>
    </div>
  );
}

function NotificationsSettings() {
  const channels = ["Email", "SMS", "In-app", "Push"];
  const events = [
    "New ticket assigned",   "Ticket resolved",  "Leave request",
    "Leave approved/rejected","Invoice overdue",  "Payment received",
    "Payroll processed",     "System alert",     "New message",
    "Approval required",
  ];
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">Configure which events trigger notifications and through which channels.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-2 pr-4">Event</th>
              {channels.map(c => <th key={c} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide py-2 px-3">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {events.map(ev => (
              <tr key={ev} className="hover:bg-slate-50">
                <td className="py-2.5 pr-4 text-sm text-slate-700 whitespace-nowrap">{ev}</td>
                {channels.map((c, i) => (
                  <td key={c} className="py-2.5 px-3 text-center">
                    <input type="checkbox" defaultChecked={i < 2} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Save Preferences</button>
      </div>
    </div>
  );
}

function EmailSettings() {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">SMTP credentials are encrypted and never displayed in plain text. Contact your IT administrator to update them.</p>
      </div>
      {([
        { label: "SMTP Host",      value: "smtp.merncrest.lk",      type: "text" },
        { label: "SMTP Port",      value: "587",                     type: "text" },
        { label: "From Name",      value: "MernCrest ERP",           type: "text" },
        { label: "From Email",     value: "noreply@merncrest.lk",    type: "email" },
        { label: "SMTP Username",  value: "noreply@merncrest.lk",    type: "text" },
        { label: "SMTP Password",  value: "••••••••••••",            type: "password" },
      ] as const).map(f => (
        <div key={f.label}>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{f.label}</label>
          <input defaultValue={f.value} type={f.type}
            readOnly={f.type === "password"}
            className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      ))}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button className="text-sm border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-slate-600 transition-colors flex items-center gap-1.5"><Wifi size={13} />Test Connection</button>
        <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors ml-auto">Save SMTP Config</button>
      </div>
    </div>
  );
}

function LocalizationSettings() {
  return (
    <div className="space-y-4">
      {([
        { label: "Timezone",         options: ["Asia/Colombo (UTC+5:30)", "UTC", "Asia/Kolkata (UTC+5:30)"] },
        { label: "Base Currency",    options: ["LKR — Sri Lankan Rupee", "USD — US Dollar", "EUR — Euro"] },
        { label: "Secondary Currency", options: ["USD — US Dollar", "EUR — Euro", "GBP — British Pound"] },
        { label: "Date Format",      options: ["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"] },
        { label: "Language",         options: ["English (UK)", "English (US)", "Sinhala", "Tamil"] },
        { label: "Number Format",    options: ["1,234,567.89", "1.234.567,89"] },
      ] as const).map(f => (
        <div key={f.label}>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{f.label}</label>
          <select className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {f.options.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Save</button>
      </div>
    </div>
  );
}

function PlaceholderSettings({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Server size={24} className="text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="text-xs text-slate-400 mt-1">Configuration options available in full version</p>
    </div>
  );
}

/* ─── Main ─── */
export default function SettingsPage() {
  const [subPage, setSubPage] = useState<SubPage>(null);
  const current = settingsNav.find(n => n.id === subPage);

  if (subPage) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-5">
        <button onClick={() => setSubPage(null)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronLeft size={14} /> Settings
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{current?.label}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{current?.sub}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {subPage === "general"               && <GeneralSettings />}
          {subPage === "security"              && <SecuritySettings />}
          {subPage === "notifications"         && <NotificationsSettings />}
          {subPage === "email"                 && <EmailSettings />}
          {subPage === "localization"          && <LocalizationSettings />}
          {(subPage === "users" || subPage === "billing-sub" || subPage === "backup" || subPage === "integrations-settings") && (
            <PlaceholderSettings label={current?.label ?? ""} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your organization preferences and security</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {settingsNav.map(item => (
          <button key={item.id} onClick={() => setSubPage(item.id)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <item.icon size={16} className="text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
