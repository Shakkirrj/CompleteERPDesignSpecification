import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Plus, Settings, ExternalLink, Zap, X, Key, Globe, Code2, FileText, Eye, EyeOff } from "lucide-react";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";

interface Integration {
  id: string; name: string; category: string;
  description: string; logo: string;
  status: "connected" | "disconnected" | "error" | "connecting";
  lastSync?: string; syncCount?: number; errorMsg?: string;
  webhookUrl?: string; apiKeyHint?: string;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: "google-workspace", name: "Google Workspace", category: "Productivity", logo: "G", description: "Gmail, Drive, Calendar, Meet integration", status: "connected", lastSync: "2 min ago", syncCount: 1243 },
  { id: "github", name: "GitHub", category: "Development", logo: "⑂", description: "Repositories, Issues, PRs, Deployments", status: "connected", lastSync: "5 min ago", syncCount: 892 },
  { id: "slack", name: "Slack", category: "Communication", logo: "#", description: "Team channels and notifications", status: "error", errorMsg: "OAuth token expired — reconnect required", lastSync: "2 hours ago" },
  { id: "cloudflare", name: "Cloudflare", category: "Infrastructure", logo: "☁", description: "DNS, CDN, SSL, Workers, Pages", status: "connected", lastSync: "12 min ago", syncCount: 48 },
  { id: "aws", name: "AWS", category: "Infrastructure", logo: "⚡", description: "EC2, S3, RDS, CloudWatch", status: "connected", lastSync: "5 min ago", syncCount: 307 },
  { id: "stripe", name: "Stripe", category: "Payments", logo: "S", description: "Payment processing and subscriptions", status: "disconnected" },
  { id: "payhere", name: "PayHere", category: "Payments", logo: "P", description: "Local LKR payment gateway", status: "disconnected" },
  { id: "zoom", name: "Zoom", category: "Communication", logo: "Z", description: "Video meetings and webinars", status: "disconnected" },
  { id: "ms365", name: "Microsoft 365", category: "Productivity", logo: "M", description: "Outlook, Teams, SharePoint", status: "disconnected" },
  { id: "openai", name: "OpenAI", category: "AI", logo: "✦", description: "GPT models for AI features", status: "connected", lastSync: "Just now", syncCount: 4521 },
  { id: "vercel", name: "Vercel", category: "Infrastructure", logo: "▲", description: "Frontend deployments and CI/CD", status: "connected", lastSync: "1 hour ago", syncCount: 67 },
  { id: "twilio", name: "Twilio (SMS)", category: "Communication", logo: "T", description: "SMS and WhatsApp messaging", status: "disconnected" },
];

const categoryColors: Record<string, string> = {
  Productivity: "bg-blue-50 text-blue-700",
  Development: "bg-violet-50 text-violet-700",
  Communication: "bg-pink-50 text-pink-700",
  Infrastructure: "bg-amber-50 text-amber-700",
  Payments: "bg-emerald-50 text-emerald-700",
  AI: "bg-cyan-50 text-cyan-700",
  Custom: "bg-slate-100 text-slate-600",
};

const statusCfg = {
  connected:    { label: "Connected",    icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  disconnected: { label: "Not Connected",icon: XCircle,      color: "text-slate-400",   bg: "bg-slate-50",   border: "border-slate-200" },
  error:        { label: "Error",        icon: AlertTriangle,color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
  connecting:   { label: "Connecting",   icon: RefreshCw,    color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200" },
};

// ─── Log drawer for connected integrations ───────────────────────────────────
const SAMPLE_LOGS: Record<string, string[]> = {
  "google-workspace": [
    "[2026-09-11 09:32:11] INFO  OAuth token refreshed successfully",
    "[2026-09-11 09:32:11] INFO  Synced 12 calendar events",
    "[2026-09-11 09:30:45] INFO  Drive file list fetched (847 items)",
    "[2026-09-11 09:28:00] INFO  Gmail thread sync complete",
    "[2026-09-11 08:15:30] WARN  Rate limit reached — retrying in 60s",
    "[2026-09-11 08:14:31] INFO  Retry successful",
  ],
  "github": [
    "[2026-09-11 09:35:02] INFO  Webhook received: push to main",
    "[2026-09-11 09:35:02] INFO  3 commits synced from merncrest/erp",
    "[2026-09-11 09:28:14] INFO  PR #142 status updated: merged",
    "[2026-09-11 09:10:00] INFO  Deployment hook triggered: web-prod-01",
    "[2026-09-11 08:44:21] INFO  Issue #301 assigned to Dilshan Fernando",
  ],
  "default": [
    "[2026-09-11 09:30:00] INFO  Connection healthy",
    "[2026-09-11 09:00:00] INFO  Scheduled sync completed",
    "[2026-09-11 08:30:00] INFO  Heartbeat OK",
  ],
};

function LogDrawer({ intg, onClose }: { intg: Integration; onClose: () => void }) {
  const logs = SAMPLE_LOGS[intg.id] ?? SAMPLE_LOGS["default"];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-xl bg-slate-900 h-full flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-white">{intg.logo}</div>
            <div>
              <p className="text-sm font-bold text-white">{intg.name} — Integration Logs</p>
              <p className="text-[10px] text-slate-400">Live log stream · Last updated just now</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"><X size={15} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
          {logs.map((line, i) => {
            const isWarn = line.includes("WARN");
            const isError = line.includes("ERROR");
            return (
              <div key={i} className={`leading-relaxed ${isError ? "text-red-400" : isWarn ? "text-amber-400" : "text-emerald-400"}`}>
                {line}
              </div>
            );
          })}
          <div className="text-slate-500 animate-pulse mt-2">▌</div>
        </div>
        <div className="px-4 py-3 border-t border-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Connected · Streaming live</span>
          <button className="ml-auto text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"><FileText size={11} /> Download Full Log</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Custom Integration modal ────────────────────────────────────────────
const AUTH_TYPES = ["API Key", "OAuth 2.0", "Webhook", "Basic Auth", "Bearer Token", "Custom Header"];

function CustomIntegrationModal({ onClose, onSave }: { onClose: () => void; onSave: (i: Integration) => void }) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [authType, setAuthType] = useState("API Key");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom");
  const [testResult, setTestResult] = useState<"idle" | "testing" | "ok" | "fail">("idle");

  function testConnection() {
    if (!name || !baseUrl) return;
    setTestResult("testing");
    setTimeout(() => setTestResult(baseUrl.startsWith("https://") ? "ok" : "fail"), 1800);
  }

  function save() {
    const intg: Integration = {
      id: `custom-${Date.now()}`,
      name, category, description,
      logo: name.charAt(0).toUpperCase(),
      status: testResult === "ok" ? "connected" : "disconnected",
      lastSync: testResult === "ok" ? "Just now" : undefined,
      webhookUrl: webhookUrl || undefined,
      apiKeyHint: apiKey ? `••••${apiKey.slice(-4)}` : undefined,
    };
    onSave(intg);
  }

  const canSave = name.trim().length > 0 && baseUrl.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg anim-bounce-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <p className="font-bold text-slate-900">Add Custom Integration</p>
            <p className="text-xs text-slate-500 mt-0.5">Connect any REST API or webhook to this ERP</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={15} className="text-slate-400" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Integration Name <span className="text-red-500">*</span></label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. My CRM API"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["Custom","Productivity","Development","Communication","Infrastructure","Payments","AI"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Base URL <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Globe size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={baseUrl} onChange={e => { setBaseUrl(e.target.value); setTestResult("idle"); }} placeholder="https://api.example.com/v1"
                  className="w-full pl-8 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={testConnection} disabled={!name || !baseUrl || testResult === "testing"}
                className="flex items-center gap-1.5 text-sm px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition-colors whitespace-nowrap">
                {testResult === "testing" ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
                {testResult === "testing" ? "Testing…" : "Test"}
              </button>
            </div>
            {testResult === "ok"   && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 size={11} /> Connection successful</p>}
            {testResult === "fail" && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><XCircle size={11} /> Connection failed — check URL and credentials</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Authentication</label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {AUTH_TYPES.map(a => (
                <button key={a} onClick={() => setAuthType(a)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${authType === a ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{a}</button>
              ))}
            </div>
            {(authType === "API Key" || authType === "Bearer Token") && (
              <div className="relative">
                <Key size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)}
                  placeholder={authType === "API Key" ? "Enter API key" : "Enter bearer token"}
                  className="w-full pl-8 pr-10 border border-slate-200 rounded-xl py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
            )}
            {authType === "Webhook" && (
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-erp/webhooks/custom"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            )}
            {authType === "OAuth 2.0" && (
              <p className="text-xs text-blue-600 bg-blue-50 rounded-xl px-3 py-2">OAuth 2.0 flow will redirect to the provider for authorization after saving.</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              placeholder="What does this integration do?"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs text-amber-700 flex items-start gap-2"><AlertTriangle size={11} className="mt-0.5 flex-shrink-0" /> API keys and secrets are encrypted at rest. Never share credentials in plain text or commit them to source control.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={save} disabled={!canSave}
            className="ml-auto flex items-center gap-1.5 px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Code2 size={13} /> Save Integration
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [filter, setFilter] = useState("All");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Integration["status"]>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [logIntg, setLogIntg] = useState<Integration | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);

  const categories = ["All", ...Array.from(new Set(integrations.map(i => i.category)))];
  const filtered = filter === "All" ? integrations : integrations.filter(i => i.category === filter);

  function connect(id: string) {
    setConnecting(id);
    setStatuses(s => ({ ...s, [id]: "connecting" }));
    setTimeout(() => {
      setStatuses(s => ({ ...s, [id]: "connected" }));
      setConnecting(null);
      const intg = integrations.find(i => i.id === id);
      setFeedback({ type: "success", title: `${intg?.name} Connected`, message: "Integration is now active and syncing.", actions: [{ label: "View Logs", onClick: () => intg && setLogIntg(intg), primary: true }] });
    }, 2200);
  }

  function handleAddCustom(intg: Integration) {
    setIntegrations(prev => [...prev, intg]);
    setShowAddModal(false);
    setFeedback({
      type: "success", title: "Integration Added",
      message: `${intg.name} has been ${intg.status === "connected" ? "connected" : "saved"} successfully.`,
      ref: intg.id, refLabel: "Integration ID",
      actions: [{ label: "View", onClick: () => {}, primary: true }],
    });
  }

  const connectedCount = integrations.filter(i => (statuses[i.id] ?? i.status) === "connected").length;
  const errorCount = integrations.filter(i => (statuses[i.id] ?? i.status) === "error").length;

  return (
    <>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Integrations</h2>
            <p className="text-sm text-slate-500 mt-0.5">{connectedCount} connected · {integrations.length} total</p>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold transition-colors">
            <Plus size={13} /> Add Custom Integration
          </button>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Connected",  value: connectedCount,                                color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Errors",     value: errorCount,                                    color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
            { label: "Available",  value: integrations.filter(i => (statuses[i.id] ?? i.status) === "disconnected").length, color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-4`}>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-2xl font-black ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Error alert */}
        {errorCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 flex-1"><strong>Slack</strong> integration has an error — OAuth token expired. Reconnect to restore notifications.</p>
            <button onClick={() => connect("slack")} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium transition-colors">Reconnect</button>
          </div>
        )}

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === cat ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 border border-slate-200"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(intg => {
            const currentStatus = statuses[intg.id] ?? intg.status;
            const sc = statusCfg[currentStatus];
            const isConnecting = connecting === intg.id;
            return (
              <div key={intg.id} className={`bg-white border ${sc.border} rounded-xl p-4 flex flex-col gap-3`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
                      {intg.logo}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{intg.name}</p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${categoryColors[intg.category] ?? "bg-slate-100 text-slate-600"}`}>{intg.category}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                    <sc.icon size={9} className={isConnecting ? "animate-spin" : ""} />
                    {sc.label}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">{intg.description}</p>

                {intg.errorMsg && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-lg px-2.5 py-2">{intg.errorMsg}</p>
                )}

                {currentStatus === "connected" && intg.lastSync && (
                  <p className="text-[10px] text-slate-400">Last sync: {intg.lastSync}{intg.syncCount != null ? ` · ${intg.syncCount.toLocaleString()} events` : ""}</p>
                )}

                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100">
                  {currentStatus === "connected" ? (
                    <>
                      <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800 transition-colors">
                        <Settings size={11} /> Configure
                      </button>
                      <button onClick={() => setLogIntg(intg)}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 ml-auto transition-colors">
                        <ExternalLink size={11} /> View Logs
                      </button>
                    </>
                  ) : currentStatus === "error" ? (
                    <button onClick={() => connect(intg.id)} className="w-full text-xs bg-red-600 text-white hover:bg-red-700 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1">
                      <RefreshCw size={11} /> Reconnect
                    </button>
                  ) : (
                    <button onClick={() => connect(intg.id)} disabled={isConnecting}
                      className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1">
                      {isConnecting ? <><RefreshCw size={11} className="animate-spin" /> Connecting…</> : <><Zap size={11} /> Connect</>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && <CustomIntegrationModal onClose={() => setShowAddModal(false)} onSave={handleAddCustom} />}
      {logIntg && <LogDrawer intg={logIntg} onClose={() => setLogIntg(null)} />}
      <ActionFeedback data={feedback} onDismiss={() => setFeedback(null)} />
    </>
  );
}
