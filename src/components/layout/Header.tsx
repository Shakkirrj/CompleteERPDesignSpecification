import { useState, useEffect, useRef } from "react";
import {
  Search, Bell, ChevronDown, PanelLeftClose, PanelLeftOpen, X, Clock, ArrowRight,
  Maximize2, Minimize2, LogOut, Settings, User, Shield, Mail, Phone, Building,
  ChevronRight, Sun, Moon, HelpCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  title: string;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  onLogout?: () => void;
  onShowTour?: () => void;
}

const recentSearches = ["Kavinda Perera", "Invoice INV-2025-0089", "Ceylon Bank", "PRJ001 E-Commerce"];
const quickResults = [
  { type: "Employee", name: "Kavinda Perera",      sub: "Senior Software Engineer",       icon: "👤" },
  { type: "Project",  name: "E-Commerce Platform", sub: "Lanka Retail PLC · In Progress", icon: "📁" },
  { type: "Invoice",  name: "INV-2025-0089",        sub: "Lanka Retail PLC · LKR 680,000", icon: "🧾" },
];

type NotifType = "critical" | "warning" | "info" | "success" | "message";
interface Notif { icon: string; title: string; sub: string; time: string; type: NotifType; }
const notifications: Notif[] = [
  { icon: "🔴", title: "TKT-1024 Critical",     sub: "Production API errors — needs immediate attention", time: "2m ago",  type: "critical" },
  { icon: "🟡", title: "Leave Approval Pending", sub: "Kavinda Perera requested 3 days leave",            time: "15m ago", type: "warning"  },
  { icon: "🟠", title: "Invoice Overdue",        sub: "INV-2025-0089 is 10 days overdue",                 time: "1h ago",  type: "warning"  },
  { icon: "🔵", title: "Project Milestone",      sub: "HR Management System reached 92%",                 time: "2h ago",  type: "info"     },
  { icon: "🟢", title: "Payment Received",       sub: "LKR 1,200,000 from Ceylon Bank Ltd",               time: "3h ago",  type: "success"  },
];

function playNotifTone(type: NotifType) {
  try {
    const ctx = new AudioContext();
    const g = ctx.createGain();
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    const freqs: Record<NotifType, number[]> = {
      critical: [880, 1047], warning: [659, 784], info: [523, 659],
      success: [523, 659, 784], message: [784],
    };
    let t = ctx.currentTime;
    for (const freq of freqs[type]) {
      const o = ctx.createOscillator();
      o.type = type === "critical" ? "sawtooth" : "sine";
      o.frequency.setValueAtTime(freq, t);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.12);
      t += 0.13;
    }
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    setTimeout(() => ctx.close(), (t + 0.1) * 1000);
  } catch { /* */ }
}

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "F11") { e.preventDefault(); toggleFullscreen(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }
  return { isFullscreen, toggleFullscreen };
}

export default function Header({ title, onToggleSidebar, sidebarCollapsed, onLogout, onShowTour }: Props) {
  const [searchOpen, setSearchOpen]   = useState(false);
  const [query, setQuery]             = useState("");
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openNotif() {
    setNotifOpen(o => !o);
    if (!notifOpen) playNotifTone("info");
  }

  return (
    <>
      <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3 px-4 flex-shrink-0 relative z-30 transition-colors">
        <button onClick={onToggleSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 dark:text-slate-400 dark:hover:bg-slate-700 hover:text-slate-700 transition-colors">
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="flex-1">
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
        </div>

        {/* Search trigger */}
        <button onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 transition-colors"
          style={{ minWidth: 200 }}>
          <Search size={14} />
          <span className="text-xs">Search anything...</span>
          <kbd className="ml-auto text-[10px] bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded px-1 py-0.5 font-mono dark:text-slate-300">⌘K</kbd>
        </button>

        {/* Dark mode toggle */}
        <button onClick={toggleTheme} title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`p-2 rounded-lg transition-all ${isDark ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Tour / Help */}
        <button onClick={onShowTour} title="Help & Tour"
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          <HelpCircle size={16} />
        </button>

        {/* Fullscreen */}
        <button onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen (F11)" : "Enter fullscreen (F11)"}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors">
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={openNotif}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">Notifications</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">8 new</span>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-700 max-h-72 overflow-y-auto">
                {notifications.map((n, i) => (
                  <button key={i} onClick={() => { playNotifTone(n.type); setNotifOpen(false); }}
                    className="w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer text-left transition-colors">
                    <div className="flex gap-3">
                      <span className="text-base flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.sub}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg px-2 py-1.5 transition-colors">
            <div className="w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-semibold">PJ</span>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">Priya J.</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/30 dark:to-blue-900/30 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">PJ</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm" style={{ fontFamily: "var(--font-display)" }}>Priya Jayawardena</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Operations Director</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {[
                    { icon: Mail,     text: "priya@merncrest.lk" },
                    { icon: Phone,    text: "+94 77 234 5678" },
                    { icon: Building, text: "Colombo HQ · Operations" },
                  ].map(f => (
                    <div key={f.text} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <f.icon size={11} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />{f.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Active now</span>
                  <ChevronRight size={11} className="text-slate-300 ml-auto" />
                </div>
              </div>

              <div className="py-1.5">
                {[
                  { icon: User,    label: "My Profile",          sub: "View & edit your profile" },
                  { icon: Shield,  label: "Security & Sessions", sub: "Passwords, 2FA, active sessions" },
                  { icon: Settings,label: "Preferences",         sub: "Theme, notifications, language" },
                ].map(item => (
                  <button key={item.label} onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group text-left">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <item.icon size={14} className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="px-3 py-2.5 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => { setProfileOpen(false); onLogout?.(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group text-left">
                  <div className="w-8 h-8 bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <LogOut size={14} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600">Sign Out</p>
                    <p className="text-[10px] text-slate-400">End this session securely</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24" onClick={() => setSearchOpen(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <Search size={18} className="text-slate-400" />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search employees, projects, invoices, tickets..."
                className="flex-1 text-sm outline-none text-slate-800 dark:text-slate-100 dark:bg-transparent placeholder-slate-400" />
              <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X size={16} className="text-slate-400" />
              </button>
            </div>
            {!query ? (
              <div className="p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Recent Searches</p>
                <div className="space-y-1">
                  {recentSearches.map(s => (
                    <button key={s} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{s}</span>
                      <ArrowRight size={12} className="text-slate-300 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Results</p>
                <div className="space-y-1">
                  {quickResults.map((r, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left">
                      <span className="text-lg">{r.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{r.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{r.sub}</p>
                      </div>
                      <span className="ml-auto text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded font-medium">{r.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center gap-4">
              <span className="text-[10px] text-slate-400"><kbd className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-[10px] font-mono dark:text-slate-300">↵</kbd> Select</span>
              <span className="text-[10px] text-slate-400"><kbd className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-[10px] font-mono dark:text-slate-300">Esc</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
