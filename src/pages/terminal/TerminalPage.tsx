import { useState, useRef, useEffect } from "react";
import { Terminal, Plus, Trash2, Maximize2, Copy, Search, Shield } from "lucide-react";

type Env = "production" | "staging" | "development";

interface TermLine { type: "input" | "output" | "error" | "system"; text: string; time: string; }
interface Tab { id: string; name: string; env: Env; lines: TermLine[]; }

const ENV_CFG = {
  production:  { label: "Production",  color: "text-red-500",    bg: "bg-red-950/50",    badge: "bg-red-800 text-red-200" },
  staging:     { label: "Staging",     color: "text-amber-400",  bg: "bg-amber-950/30",  badge: "bg-amber-800 text-amber-200" },
  development: { label: "Development", color: "text-emerald-400",bg: "bg-emerald-950/30",badge: "bg-emerald-800 text-emerald-200" },
};

const MOCK_RESPONSES: Record<string, string> = {
  "ls":            "app/  config/  logs/  node_modules/  package.json  public/  src/",
  "ls -la":        "total 48\ndrwxr-xr-x  8 mc  mc  256 Sep 11 09:00 .\ndrwxr-xr-x 24 mc  mc  768 Sep 11 08:00 ..\ndrwxr-xr-x  6 mc  mc  192 Sep 11 09:00 app\n-rw-r--r--  1 mc  mc 1423 Sep 10 14:00 package.json\ndrwxr-xr-x  3 mc  mc   96 Sep 11 09:00 logs",
  "pwd":           "/var/www/merncrest",
  "whoami":        "merncrest-deploy",
  "ps aux":        "USER       PID %CPU %MEM    VSZ   RSS TTY\nmc        1234  0.5  2.1  512000 43200 ?   node server.js\nmc        1235  0.2  1.8  498000 38400 ?   node worker.js",
  "df -h":         "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   23G   25G  48% /\ntmpfs            2.0G  512M  1.5G  26% /tmp",
  "free -h":       "              total        used        free      shared  buff/cache   available\nMem:           7.7Gi       6.3Gi       412Mi       256Mi       1.0Gi       1.2Gi\nSwap:          2.0Gi       512Mi       1.5Gi",
  "uptime":        " 09:12:34 up 23 days, 14:32,  1 user,  load average: 0.82, 0.75, 0.68",
  "help":          "Available commands: ls, pwd, whoami, ps aux, df -h, free -h, uptime, clear\n\nNote: This is a sandboxed terminal. Commands are audited. Destructive operations require additional authorization.",
  "clear":         "__CLEAR__",
};

function mkLine(type: TermLine["type"], text: string): TermLine {
  return { type, text, time: new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) };
}

function initLines(env: Env): TermLine[] {
  return [
    mkLine("system", `Connected to MernCrest ${ENV_CFG[env].label} environment`),
    mkLine("system", `Server: web-${env === "production" ? "prod" : env}-01 · Ubuntu 22.04`),
    mkLine("system", `Session started by: Chamara Wickramasinghe (Director)`),
    mkLine("system", `⚠ All commands are audited and logged`),
    mkLine("output", "Type 'help' for available commands"),
    mkLine("output", ""),
  ];
}

export default function TerminalPage() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "t1", name: "web-prod-01", env: "production", lines: initLines("production") },
  ]);
  const [activeTab, setActiveTab] = useState("t1");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const tab = tabs.find(t => t.id === activeTab)!;
  const envCfg = ENV_CFG[tab?.env ?? "development"];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [tab?.lines]);

  function addTab() {
    const id = `t${Date.now()}`;
    const env: Env = "staging";
    setTabs(prev => [...prev, { id, name: `web-stg-0${prev.length + 1}`, env, lines: initLines(env) }]);
    setActiveTab(id);
  }

  function closeTab(id: string) {
    if (tabs.length === 1) return;
    setTabs(prev => prev.filter(t => t.id !== id));
    if (activeTab === id) setActiveTab(tabs[0].id === id ? tabs[1].id : tabs[0].id);
  }

  function updateLines(id: string, fn: (lines: TermLine[]) => TermLine[]) {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, lines: fn(t.lines) } : t));
  }

  function submit() {
    const cmd = input.trim();
    if (!cmd) return;
    updateLines(activeTab, lines => [...lines, mkLine("input", `$ ${cmd}`)]);
    setHistory(h => [cmd, ...h.slice(0, 49)]);
    setHistIdx(-1);
    setInput("");

    const response = MOCK_RESPONSES[cmd.toLowerCase()];
    if (response === "__CLEAR__") {
      setTimeout(() => updateLines(activeTab, () => [mkLine("system", "Terminal cleared")]), 50);
    } else if (response) {
      response.split("\n").forEach((line, i) => {
        setTimeout(() => updateLines(activeTab, lines => [...lines, mkLine("output", line)]), i * 20);
      });
    } else if (cmd.includes("rm -rf") || cmd.includes("DROP TABLE") || cmd.includes("shutdown")) {
      updateLines(activeTab, lines => [...lines, mkLine("error", `Permission denied: '${cmd}' requires additional authorization. Request logged.`)]);
    } else {
      updateLines(activeTab, lines => [...lines, mkLine("error", `bash: ${cmd.split(" ")[0]}: command not found (or requires elevated access)`)]);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") submit();
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]" style={{ background: "#0f172a" }}>
      {/* Security header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10" style={{ background: "#1e293b" }}>
        <Shield size={13} className="text-amber-400" />
        <span className="text-xs text-amber-400 font-medium">Admin Terminal — Restricted Access — All commands are audited</span>
        <div className="ml-auto flex items-center gap-2">
          <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${envCfg.badge}`}>{envCfg.label}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-white/10 px-2 pt-2">
        {tabs.map(t => (
          <div
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer text-xs font-mono transition-colors ${
              activeTab === t.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Terminal size={11} className={ENV_CFG[t.env].color} />
            <span>{t.name}</span>
            {tabs.length > 1 && (
              <button onClick={e => { e.stopPropagation(); closeTab(t.id); }} className="ml-1 text-slate-500 hover:text-slate-300">×</button>
            )}
          </div>
        ))}
        <button onClick={addTab} className="ml-2 p-1 hover:bg-white/10 rounded text-slate-500 hover:text-slate-300 transition-colors">
          <Plus size={12} />
        </button>
      </div>

      {/* Terminal body */}
      <div
        className="flex-1 overflow-y-auto p-4 font-mono text-sm cursor-text"
        style={{ background: "#020617" }}
        onClick={() => inputRef.current?.focus()}
      >
        {tab?.lines.map((line, i) => (
          <div key={i} className={`leading-relaxed ${
            line.type === "input"  ? "text-white" :
            line.type === "error"  ? "text-red-400" :
            line.type === "system" ? "text-slate-500 text-xs" :
            "text-emerald-300"
          }`}>
            {line.type === "system" && <span className="text-slate-600 mr-2">[{line.time}]</span>}
            {line.text}
          </div>
        ))}
        {/* Input line */}
        <div className="flex items-center gap-2 mt-1">
          <span className={`flex-shrink-0 ${envCfg.color}`}>
            {tab?.env === "production" ? "root@web-prod-01:~$" : `mc@web-${tab?.env}-01:~$`}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent outline-none text-white caret-emerald-400"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
