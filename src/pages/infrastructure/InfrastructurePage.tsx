import { useState, useEffect, useRef } from "react";
import { Server, AlertTriangle, CheckCircle2, XCircle, RefreshCw, Activity, Shield, X, Terminal, Copy, Loader2, Plus } from "lucide-react";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";

interface ServerItem {
  id: string; name: string; env: "Production" | "Staging" | "Development";
  ip: string; os: string; region: string;
  cpu: number; ram: number; disk: number; uptime: string;
  status: "healthy" | "warning" | "critical" | "offline";
  services: number; lastCheck: string;
}

const SERVERS: ServerItem[] = [
  { id: "s1", name: "web-prod-01", env: "Production", ip: "10.0.1.10", os: "Ubuntu 22.04", region: "ap-south-1", cpu: 34, ram: 62, disk: 45, uptime: "99.98%", status: "healthy", services: 8, lastCheck: "Just now" },
  { id: "s2", name: "api-prod-01", env: "Production", ip: "10.0.1.11", os: "Ubuntu 22.04", region: "ap-south-1", cpu: 78, ram: 81, disk: 54, uptime: "99.95%", status: "warning", services: 12, lastCheck: "2 min ago" },
  { id: "s3", name: "db-prod-01",  env: "Production", ip: "10.0.1.20", os: "Ubuntu 22.04", region: "ap-south-1", cpu: 42, ram: 74, disk: 67, uptime: "99.99%", status: "healthy", services: 4, lastCheck: "Just now" },
  { id: "s4", name: "web-stg-01",  env: "Staging",    ip: "10.0.2.10", os: "Ubuntu 22.04", region: "ap-south-1", cpu: 18, ram: 31, disk: 22, uptime: "99.50%", status: "healthy", services: 6, lastCheck: "5 min ago" },
  { id: "s5", name: "worker-01",   env: "Production", ip: "10.0.1.30", os: "Debian 12",   region: "ap-south-1", cpu: 91, ram: 88, disk: 71, uptime: "98.12%", status: "critical", services: 5, lastCheck: "1 min ago" },
  { id: "s6", name: "dev-box-01",  env: "Development",ip: "10.0.3.10", os: "Ubuntu 22.04", region: "local",     cpu: 0,  ram: 0,  disk: 12, uptime: "—",       status: "offline",  services: 0, lastCheck: "12 min ago" },
];

const sslCerts = [
  { domain: "merncrest.lk",      issuer: "Let's Encrypt", expiry: "2026-10-15", daysLeft: 34, status: "active" },
  { domain: "app.merncrest.lk",  issuer: "Let's Encrypt", expiry: "2026-10-15", daysLeft: 34, status: "active" },
  { domain: "api.merncrest.lk",  issuer: "Let's Encrypt", expiry: "2026-09-30", daysLeft: 19, status: "expiring" },
  { domain: "merncrest.com",     issuer: "DigiCert",       expiry: "2027-03-01", daysLeft: 171, status: "active" },
];

const statusCfg = {
  healthy:  { label: "Healthy",  dot: "bg-emerald-500", ring: "ring-emerald-200", text: "text-emerald-700", bg: "bg-emerald-50", Icon: CheckCircle2 },
  warning:  { label: "Warning",  dot: "bg-amber-400",   ring: "ring-amber-200",   text: "text-amber-700",  bg: "bg-amber-50",   Icon: AlertTriangle },
  critical: { label: "Critical", dot: "bg-red-500",     ring: "ring-red-200",     text: "text-red-700",    bg: "bg-red-50",     Icon: XCircle },
  offline:  { label: "Offline",  dot: "bg-slate-400",   ring: "ring-slate-200",   text: "text-slate-500",  bg: "bg-slate-100",  Icon: XCircle },
};

function GaugeBar({ value, warn = 70, crit = 90 }: { value: number; warn?: number; crit?: number }) {
  const color = value >= crit ? "bg-red-500" : value >= warn ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[10px] font-semibold tabular-nums w-7 text-right ${value >= crit ? "text-red-600" : value >= warn ? "text-amber-600" : "text-slate-500"}`}>{value}%</span>
    </div>
  );
}

// ─── Log Viewer ───────────────────────────────────────────────────────────────
const SERVER_LOGS: Record<string, string[]> = {
  s1: [
    "[2026-09-11 09:35:01] INFO  nginx: worker process 1847 started",
    "[2026-09-11 09:34:59] INFO  GET /health 200 OK (2ms)",
    "[2026-09-11 09:34:58] INFO  GET /api/v1/status 200 OK (18ms)",
    "[2026-09-11 09:30:12] INFO  SSL certificate renewed successfully",
    "[2026-09-11 09:00:00] INFO  Scheduled health check passed",
    "[2026-09-11 08:55:30] INFO  Memory usage: 62% — within normal range",
    "[2026-09-11 08:50:00] INFO  Backup job completed: /var/backups/web-prod-01-20260911.tar.gz",
    "[2026-09-11 08:15:22] WARN  Slow response detected: /api/v1/reports (1823ms)",
    "[2026-09-11 08:15:30] INFO  Response time normalized after cache flush",
  ],
  s2: [
    "[2026-09-11 09:35:01] WARN  CPU usage at 78% — elevated",
    "[2026-09-11 09:35:00] WARN  RAM usage at 81% — consider scaling",
    "[2026-09-11 09:34:55] INFO  API request queue: 142 active",
    "[2026-09-11 09:30:00] ERROR Connection pool exhausted — waiting for release",
    "[2026-09-11 09:30:02] INFO  Connection pool recovered (new max: 200)",
    "[2026-09-11 09:00:00] INFO  Rate limiting: 0 requests blocked",
    "[2026-09-11 08:45:00] WARN  Slow DB query detected: SELECT * FROM audit_logs (4200ms)",
    "[2026-09-11 08:30:00] INFO  Middleware: auth tokens verified (batch 512)",
  ],
  s5: [
    "[2026-09-11 09:35:01] CRIT  CPU usage at 91% — CRITICAL",
    "[2026-09-11 09:35:00] CRIT  RAM usage at 88% — CRITICAL",
    "[2026-09-11 09:34:58] ERROR Worker process 2041 killed (OOM)",
    "[2026-09-11 09:34:50] ERROR Job queue stalled: 847 pending tasks",
    "[2026-09-11 09:34:45] WARN  Disk I/O wait exceeding 800ms",
    "[2026-09-11 09:33:00] INFO  Auto-restart attempted for payroll-worker",
    "[2026-09-11 09:33:02] ERROR payroll-worker failed to restart (exit code 1)",
    "[2026-09-11 09:32:00] CRIT  ALERT SENT: ops-team@merncrest.lk",
  ],
  default: [
    "[2026-09-11 09:30:00] INFO  System boot complete",
    "[2026-09-11 09:00:00] INFO  Scheduled sync: OK",
    "[2026-09-11 08:30:00] INFO  Heartbeat OK",
  ],
};

function LogViewer({ server, onClose }: { server: ServerItem; onClose: () => void }) {
  const logs = SERVER_LOGS[server.id] ?? SERVER_LOGS["default"];
  const [streamIdx, setStreamIdx] = useState(3);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setStreamIdx(i => Math.min(i + 1, logs.length)), 900);
    return () => clearInterval(t);
  }, [logs.length]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [streamIdx]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-2xl bg-slate-950 h-full flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${statusCfg[server.status].dot} animate-pulse`} />
            <div>
              <p className="font-mono font-bold text-white text-sm">{server.name}</p>
              <p className="text-[10px] text-slate-500">{server.ip} · {server.region} · {server.os}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => {}} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-800">
              <Copy size={10} /> Copy
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><X size={14} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-0.5">
          {logs.slice(0, streamIdx).map((line, i) => {
            const isCrit  = line.includes("CRIT");
            const isError = line.includes("ERROR");
            const isWarn  = line.includes("WARN");
            return (
              <div key={i} className={`leading-relaxed py-0.5 ${isCrit || isError ? "text-red-400" : isWarn ? "text-amber-400" : "text-emerald-300"}`}>
                {line}
              </div>
            );
          })}
          {streamIdx < logs.length && (
            <div className="flex items-center gap-1.5 text-slate-500 mt-1">
              <Loader2 size={10} className="animate-spin" />
              <span>Streaming…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="px-4 py-3 border-t border-slate-800 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-mono">Live stream · {server.name}</span>
          <div className="ml-auto flex items-center gap-2">
            <button className="text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 px-2 py-1 rounded hover:bg-slate-800">Clear</button>
            <button className="text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 px-2 py-1 rounded hover:bg-slate-800">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SSH Connect modal ────────────────────────────────────────────────────────
function SSHModal({ server, onClose, onConnected }: { server: ServerItem; onClose: () => void; onConnected: () => void }) {
  const [user, setUser] = useState("ubuntu");
  const [authMode, setAuthMode] = useState<"key" | "password">("key");
  const [connecting, setConnecting] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ cmd: string; out: string }[]>([]);

  const RESPONSES: Record<string, string> = {
    ls: "bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  srv  sys  tmp  usr  var",
    pwd: `/home/${user}`,
    whoami: user,
    uptime: ` 09:35:01 up ${server.uptime}, 1 user, load average: ${(server.cpu/100).toFixed(2)}, ${(server.cpu/120).toFixed(2)}, ${(server.cpu/130).toFixed(2)}`,
    df: `Filesystem     1K-blocks    Used  Available Use%\n/dev/sda1      41943040  ${Math.round(server.disk * 419430)}   ${Math.round((100 - server.disk) * 419430)}  ${server.disk}%\ntmpfs           1048576       0   1048576   0%`,
    free: `              total     used      free\nMem:        8192000  ${Math.round(server.ram * 81920)} ${Math.round((100-server.ram)*81920)}\nSwap:       2097152       0  2097152`,
    top: `top - 09:35:01 up 99 days\nTasks: 142 total, 1 running\n%Cpu(s): ${server.cpu}.0 us, 2.0 sy`,
    ps: `  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 1847 ?        00:12:44 nginx: worker\n 2102 ?        00:05:22 node`,
    exit: "Connection closed.",
    clear: "",
    help: "Available commands: ls, pwd, whoami, uptime, df, free, top, ps, clear, exit",
  };

  function handleConnect() {
    if (server.status === "offline") return;
    setConnecting(true);
    setTimeout(() => { setConnecting(false); setTerminal(true); onConnected(); }, 1800);
  }

  function handleCmd(e: React.KeyboardEvent) {
    if (e.key !== "Enter" || !input.trim()) return;
    const cmd = input.trim().toLowerCase();
    const out = RESPONSES[cmd] ?? `bash: ${cmd}: command not found`;
    setHistory(h => [...h, { cmd: input.trim(), out }]);
    setInput("");
    if (cmd === "exit") { setTimeout(onClose, 800); }
  }

  if (terminal) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="w-full max-w-2xl bg-slate-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: "480px" }} onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs text-slate-400 font-mono ml-2">{user}@{server.name} ({server.ip})</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-emerald-300 space-y-1">
            <p className="text-slate-500">Last login: Fri Sep 11 09:00:00 2026 from 192.168.1.5</p>
            <p className="text-slate-500 mb-2">Welcome to Ubuntu 22.04.4 LTS — {server.name}</p>
            {history.map((h, i) => (
              <div key={i}>
                <p><span className="text-blue-400">{user}@{server.name}</span><span className="text-slate-500">:</span><span className="text-amber-400">~</span><span className="text-white">$ </span>{h.cmd}</p>
                {h.out && h.out.split("\n").map((line, j) => <p key={j} className="text-slate-300 pl-0">{line}</p>)}
              </div>
            ))}
            <div className="flex items-center gap-1">
              <span><span className="text-blue-400">{user}@{server.name}</span><span className="text-slate-500">:</span><span className="text-amber-400">~</span><span className="text-white">$ </span></span>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCmd} autoFocus
                className="flex-1 bg-transparent text-emerald-300 outline-none caret-emerald-300" spellCheck={false} />
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-900 border-t border-slate-800">
            <p className="text-[10px] text-slate-500 font-mono">SSH · {server.ip} · {user} · Type <span className="text-slate-400">help</span> for commands · <span className="text-slate-400">exit</span> to close</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md anim-bounce-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-slate-600" />
            <div>
              <p className="font-bold text-slate-900">SSH Connect</p>
              <p className="text-xs text-slate-500 font-mono">{server.ip} · {server.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={14} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          {server.status === "offline" && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700">
              <AlertTriangle size={13} /><p className="text-sm font-medium">Server is offline — SSH connection unavailable.</p>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">SSH User</label>
            <input value={user} onChange={e => setUser(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">Authentication</label>
            <div className="flex gap-2">
              {(["key","password"] as const).map(m => (
                <button key={m} onClick={() => setAuthMode(m)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${authMode === m ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  {m === "key" ? "SSH Key" : "Password"}
                </button>
              ))}
            </div>
          </div>
          {authMode === "key" ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <p className="text-xs text-emerald-700">SSH key <strong>~/.ssh/merncrest_rsa</strong> is ready</p>
            </div>
          ) : (
            <input type="password" placeholder="Password" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-[10px] text-amber-700">All SSH sessions are audited and logged. Unauthorized access is strictly prohibited.</p>
          </div>
        </div>
        <div className="flex gap-2 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleConnect} disabled={server.status === "offline" || connecting}
            className="flex-1 flex items-center justify-center gap-2 text-sm bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50 transition-colors">
            {connecting ? <><Loader2 size={13} className="animate-spin" /> Connecting…</> : <><Terminal size={13} /> Open SSH Session</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InfrastructurePage() {
  const [envFilter, setEnvFilter] = useState<string>("All");
  const [selected, setSelected] = useState<ServerItem | null>(null);
  const [logServer, setLogServer] = useState<ServerItem | null>(null);
  const [sshServer, setSSHServer] = useState<ServerItem | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);

  const filtered = SERVERS.filter(s => envFilter === "All" || s.env === envFilter);
  const healthy  = SERVERS.filter(s => s.status === "healthy").length;
  const warning  = SERVERS.filter(s => s.status === "warning").length;
  const critical = SERVERS.filter(s => s.status === "critical").length;
  const offline  = SERVERS.filter(s => s.status === "offline").length;

  return (
    <>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Infrastructure</h2>
            <p className="text-sm text-slate-500 mt-0.5">{SERVERS.length} servers · {SERVERS.filter(s=>s.env==="Production").length} production</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFeedback({ type: "processing", title: "Refreshing…", message: "Polling all server health endpoints." })}
              className="flex items-center gap-2 text-sm border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors">
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-colors">
              <Plus size={13} /> Add Server
            </button>
          </div>
        </div>

        {/* Health summary */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Healthy",  value: healthy,  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Warning",  value: warning,  color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
            { label: "Critical", value: critical, color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
            { label: "Offline",  value: offline,  color: "text-slate-500",   bg: "bg-slate-100",  border: "border-slate-200" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-4`}>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-3xl font-black ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">servers</p>
            </div>
          ))}
        </div>

        {/* Critical alert */}
        {critical > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 flex-1"><strong>worker-01</strong> is critical — CPU 91%, RAM 88%. Immediate attention required.</p>
            <button onClick={() => { const s = SERVERS.find(x => x.id === "s5"); if (s) setLogServer(s); }}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium transition-colors">View Logs</button>
          </div>
        )}

        {/* Server table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 flex-wrap">
            {["All", "Production", "Staging", "Development"].map(env => (
              <button key={env} onClick={() => setEnvFilter(env)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${envFilter === env ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 border border-slate-200"}`}>
                {env}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {["Server","Environment","Status","CPU","RAM","Disk","Uptime","Last Check","Actions"].map(h => (
                    <th key={h} className={`px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${h === "Server" ? "pl-5" : ""} ${h === "Actions" ? "pr-5" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => {
                  const sc = statusCfg[s.status];
                  return (
                    <tr key={s.id} onClick={() => setSelected(s)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                      <td className="pl-5 px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 font-mono">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.ip} · {s.os}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${s.env === "Production" ? "bg-red-50 text-red-700" : s.env === "Staging" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>{s.env}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          <sc.Icon size={9} />{sc.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 min-w-28"><GaugeBar value={s.cpu} /></td>
                      <td className="px-3 py-3 min-w-28"><GaugeBar value={s.ram} /></td>
                      <td className="px-3 py-3 min-w-28"><GaugeBar value={s.disk} warn={80} crit={95} /></td>
                      <td className="px-3 py-3"><span className="text-xs font-mono text-slate-600">{s.uptime}</span></td>
                      <td className="px-3 py-3"><span className="text-xs text-slate-400">{s.lastCheck}</span></td>
                      <td className="pr-5 px-3 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={e => { e.stopPropagation(); setLogServer(s); }} title="View Logs"
                            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-900 text-white px-2 py-1 rounded-lg transition-colors">
                            <Activity size={10} /> Logs
                          </button>
                          <button onClick={e => { e.stopPropagation(); setSSHServer(s); }} title="SSH Connect"
                            disabled={s.status === "offline"}
                            className="flex items-center gap-1 text-xs border border-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1 rounded-lg transition-colors disabled:opacity-40">
                            <Terminal size={10} /> SSH
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SSL Certificates */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
            <Shield size={14} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">SSL Certificates</span>
          </div>
          <div className="divide-y divide-slate-50">
            {sslCerts.map(cert => (
              <div key={cert.domain} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${cert.status === "active" ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <div>
                    <p className="text-sm font-mono font-semibold text-slate-800">{cert.domain}</p>
                    <p className="text-[10px] text-slate-400">{cert.issuer} · Expires {cert.expiry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${cert.daysLeft < 30 ? "text-amber-600" : "text-emerald-600"}`}>{cert.daysLeft} days left</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cert.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {cert.status === "active" ? "Active" : "Expiring Soon"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Server detail side drawer */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
            <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusCfg[selected.status].dot}`} />
                  <div>
                    <p className="font-mono font-bold text-slate-800">{selected.name}</p>
                    <p className="text-xs text-slate-400">{selected.ip} · {selected.region}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 text-xl transition-colors">×</button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "OS",          value: selected.os },
                    { label: "Environment", value: selected.env },
                    { label: "Uptime",      value: selected.uptime },
                    { label: "Services",    value: `${selected.services} running` },
                    { label: "Region",      value: selected.region },
                    { label: "Last Check",  value: selected.lastCheck },
                  ].map(f => (
                    <div key={f.label} className="bg-slate-50 rounded-lg px-3 py-2.5">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</p>
                      <p className="text-sm text-slate-800 font-medium mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-slate-600">Resource Usage</p>
                  {[
                    { label: "CPU",  value: selected.cpu  },
                    { label: "RAM",  value: selected.ram  },
                    { label: "Disk", value: selected.disk, warn: 80, crit: 95 },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-500">{r.label}</span>
                        <span className="text-xs font-semibold text-slate-700">{r.value}%</span>
                      </div>
                      <GaugeBar value={r.value} warn={r.warn} crit={r.crit} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setSelected(null); setLogServer(selected); }}
                    className="flex items-center gap-1.5 text-xs bg-slate-900 text-white hover:bg-slate-800 px-3 py-2 rounded-lg font-medium transition-colors">
                    <Activity size={12} /> View Logs
                  </button>
                  <button onClick={() => { setSelected(null); setSSHServer(selected); }}
                    disabled={selected.status === "offline"}
                    className="flex items-center gap-1.5 text-xs border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors disabled:opacity-40">
                    <Terminal size={12} /> SSH Connect
                  </button>
                  <button onClick={() => setFeedback({ type: "warning", title: "Restart Initiated", message: `${selected.name} is restarting. Expect ~45 second downtime.`, ref: selected.name })}
                    className="flex items-center gap-1.5 text-xs border border-amber-200 hover:bg-amber-50 text-amber-700 px-3 py-2 rounded-lg transition-colors">
                    <RefreshCw size={12} /> Restart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {logServer && <LogViewer server={logServer} onClose={() => setLogServer(null)} />}
      {sshServer && (
        <SSHModal server={sshServer} onClose={() => setSSHServer(null)}
          onConnected={() => setFeedback({ type: "success", title: "SSH Connected", message: `Session opened on ${sshServer.name}.`, ref: sshServer.ip })} />
      )}
      <ActionFeedback data={feedback} onDismiss={() => setFeedback(null)} />
    </>
  );
}
