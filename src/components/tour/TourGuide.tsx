import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Users, ContactRound, FolderKanban, DollarSign,
  BarChart2, MessageSquare, Settings, Moon, Terminal, CheckCircle,
  Sparkles, ChevronRight, ChevronLeft, X, Building2, TrendingUp,
  ArrowRight,
} from "lucide-react";

interface TourStep {
  id: string;
  icon: React.ElementType;
  color: string;        // Tailwind bg class for icon container
  iconColor: string;    // Tailwind text class for icon
  accentBg: string;     // gradient for the visual panel
  title: string;
  description: string;
  features: string[];
  navId?: string;       // page to navigate to when "Go there" is clicked
}

const STEPS: TourStep[] = [
  {
    id: "welcome",
    icon: Sparkles, color: "bg-blue-100 dark:bg-blue-900/40", iconColor: "text-blue-600 dark:text-blue-400",
    accentBg: "from-blue-600 to-violet-600",
    title: "Welcome to MernCrest ERP",
    description: "Your all-in-one business management platform built for Sri Lankan businesses. Let us show you what's possible in just 2 minutes.",
    features: ["Manage every part of your business from one place", "Real-time data, reports, and alerts", "Built-in dark mode and accessibility"],
  },
  {
    id: "dashboard",
    icon: LayoutDashboard, color: "bg-indigo-100 dark:bg-indigo-900/40", iconColor: "text-indigo-600 dark:text-indigo-400",
    accentBg: "from-indigo-600 to-blue-500",
    title: "Dashboard",
    description: "Your business command center. Every key metric, recent activity, and important alert is visible at a glance as soon as you log in.",
    features: ["Revenue, expense, and payroll summaries", "Live project and ticket status", "Quick-action shortcuts"],
    navId: "dashboard",
  },
  {
    id: "hr",
    icon: Users, color: "bg-violet-100 dark:bg-violet-900/40", iconColor: "text-violet-600 dark:text-violet-400",
    accentBg: "from-violet-600 to-purple-500",
    title: "HR & People",
    description: "Everything for managing your team — employees, attendance, leave, payroll, and commission tracking.",
    features: ["Employee profiles with documents & history", "Attendance, leave approvals & balance", "Payroll processing and commission management"],
    navId: "employees",
  },
  {
    id: "crm",
    icon: ContactRound, color: "bg-cyan-100 dark:bg-cyan-900/40", iconColor: "text-cyan-600 dark:text-cyan-400",
    accentBg: "from-cyan-600 to-blue-500",
    title: "Sales & CRM",
    description: "Track every lead, client, and deal from first contact to closed invoice. Full pipeline visibility in one place.",
    features: ["Leads, contacts, and company management", "Drag-and-drop Kanban deal pipeline", "Client portfolio with full billing history"],
    navId: "crm",
  },
  {
    id: "clients",
    icon: Building2, color: "bg-blue-100 dark:bg-blue-900/40", iconColor: "text-blue-600 dark:text-blue-400",
    accentBg: "from-blue-500 to-cyan-500",
    title: "Clients",
    description: "Your complete client directory. Click any client to see their full profile — projects, invoices, payments, and contacts.",
    features: ["Enterprise, Corporate, and SME client tiers", "Per-client financial overview and collection rate", "Contact management per client"],
    navId: "clients",
  },
  {
    id: "projects",
    icon: FolderKanban, color: "bg-emerald-100 dark:bg-emerald-900/40", iconColor: "text-emerald-600 dark:text-emerald-400",
    accentBg: "from-emerald-600 to-teal-500",
    title: "Projects & Operations",
    description: "Plan, execute, and track every project with tasks, team members, timelines, and budgets in one unified view.",
    features: ["Click any project to open its full detail page", "Task boards with assignees and priorities", "Service desk for client support tickets"],
    navId: "projects",
  },
  {
    id: "finance",
    icon: DollarSign, color: "bg-amber-100 dark:bg-amber-900/40", iconColor: "text-amber-600 dark:text-amber-400",
    accentBg: "from-amber-500 to-orange-500",
    title: "Finance & Invoicing",
    description: "Complete financial management: professional PDF invoices, payment receipts, multi-currency banking, and bank reconciliation.",
    features: ["Branded PDF invoices and payment receipts", "Payment verification and audit trail", "Multi-currency support with exchange rates"],
    navId: "invoices",
  },
  {
    id: "reports",
    icon: BarChart2, color: "bg-rose-100 dark:bg-rose-900/40", iconColor: "text-rose-600 dark:text-rose-400",
    accentBg: "from-rose-500 to-pink-500",
    title: "Reports & Analytics",
    description: "Data-driven insights for every part of your business. Reports are editable before printing or sending.",
    features: ["Revenue, expense, payroll, and HR reports", "Edit report content before printing or sending", "Company logo on all exported documents"],
    navId: "reports",
  },
  {
    id: "commission",
    icon: TrendingUp, color: "bg-violet-100 dark:bg-violet-900/40", iconColor: "text-violet-600 dark:text-violet-400",
    accentBg: "from-violet-600 to-indigo-500",
    title: "Commission Tracking",
    description: "Track every sales rep's performance, attainment, and commission earned in a single dedicated view.",
    features: ["Per-rep target vs. achieved with attainment %", "Platinum, Gold, Silver, Bronze tier system", "Quarter-by-quarter period comparison"],
    navId: "commission",
  },
  {
    id: "communication",
    icon: MessageSquare, color: "bg-pink-100 dark:bg-pink-900/40", iconColor: "text-pink-600 dark:text-pink-400",
    accentBg: "from-pink-500 to-rose-500",
    title: "Mail & Chat",
    description: "Stay connected with your team and clients without leaving MernCrest. Full email client and real-time team chat.",
    features: ["Integrated email with delete, archive, and reply", "Real-time chat with emoji picker and typing indicators", "Smart notifications with sound alerts"],
    navId: "chat",
  },
  {
    id: "settings",
    icon: Settings, color: "bg-slate-100 dark:bg-slate-700", iconColor: "text-slate-600 dark:text-slate-300",
    accentBg: "from-slate-700 to-slate-500",
    title: "Settings",
    description: "Customize MernCrest to fit your organization. Changes to General settings — company name, address, phone — flow through to all invoices and documents instantly.",
    features: ["Company info updates everywhere automatically", "User roles, 2FA, and session security", "SMTP, notifications, localization, and billing"],
    navId: "settings",
  },
  {
    id: "darkmode",
    icon: Moon, color: "bg-indigo-100 dark:bg-indigo-900/40", iconColor: "text-indigo-600 dark:text-indigo-400",
    accentBg: "from-indigo-700 to-slate-700",
    title: "Dark Mode",
    description: "Easy on the eyes, day or night. Toggle dark mode using the ☀/🌙 button in the top bar. Your preference is saved across sessions.",
    features: ["System-wide dark theme — every page covered", "All text, buttons, and tables remain fully readable", "Sun/Moon toggle persists across logins"],
  },
  {
    id: "commands",
    icon: Terminal, color: "bg-slate-100 dark:bg-slate-700", iconColor: "text-slate-600 dark:text-slate-300",
    accentBg: "from-slate-800 to-slate-600",
    title: "Command Center",
    description: "Power-user navigation. Press Cmd+K (Mac) or Ctrl+K (Windows) anywhere in the app to jump instantly to any page or feature.",
    features: ["Instant page navigation without clicking the sidebar", "Works from anywhere in the app", "Also accessible via the search bar at the top"],
  },
  {
    id: "ready",
    icon: CheckCircle, color: "bg-emerald-100 dark:bg-emerald-900/40", iconColor: "text-emerald-600 dark:text-emerald-400",
    accentBg: "from-emerald-600 to-teal-500",
    title: "You're all set!",
    description: "You now know your way around MernCrest ERP. Explore at your own pace, or use the ? button in the header to replay this tour anytime.",
    features: ["Replay this tour at any time via the ? button", "Sidebar sections are collapsible — click any heading", "All settings changes take effect system-wide immediately"],
  },
];

interface Props {
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export default function TourGuide({ onClose, onNavigate }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animKey, setAnimKey] = useState(0);

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast  = step === STEPS.length - 1;

  function goNext() {
    setDirection("forward");
    setAnimKey(k => k + 1);
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  }

  function goPrev() {
    setDirection("back");
    setAnimKey(k => k + 1);
    setStep(s => Math.max(s - 1, 0));
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "Enter") goNext();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "Escape") onClose();
  }, [step, onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleGoThere() {
    if (current.navId) onNavigate(current.navId);
    onClose();
  }

  const slideClass = direction === "forward" ? "tourSlideIn" : "tourSlideInBack";

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center pb-6 px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>

      {/* Card */}
      <div key={animKey} className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ animation: `${slideClass} 0.3s cubic-bezier(0.34,1.3,0.64,1) both` }}>

        {/* Top accent strip */}
        <div className={`h-1 bg-gradient-to-r ${current.accentBg}`} />

        <div className="bg-white dark:bg-slate-800">
          <div className="flex items-start gap-5 p-6">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${current.color}`}>
              <current.icon size={26} className={current.iconColor} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                    Step {step + 1} of {STEPS.length}
                  </p>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {current.title}
                  </h2>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
                  <X size={15} />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{current.description}</p>
              <ul className="mt-3 space-y-1.5">
                {current.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${current.accentBg} flex items-center justify-center`}>
                      <CheckCircle size={10} className="text-white" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 pb-5">
            {/* Dot progress */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > step ? "forward" : "back"); setAnimKey(k => k + 1); setStep(i); }}
                  className={`rounded-full transition-all ${i === step ? `w-6 h-2 bg-gradient-to-r ${current.accentBg}` : "w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"}`} />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button onClick={goPrev}
                  className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <ChevronLeft size={14} /> Back
                </button>
              )}
              {current.navId && !isLast && (
                <button onClick={handleGoThere}
                  className="flex items-center gap-1.5 text-sm border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <ArrowRight size={13} /> Go there
                </button>
              )}
              {isLast ? (
                <button onClick={onClose}
                  className={`flex items-center gap-1.5 text-sm text-white px-5 py-2 rounded-lg font-semibold bg-gradient-to-r ${current.accentBg} hover:opacity-90 transition-opacity shadow-sm`}>
                  <CheckCircle size={14} /> Get Started
                </button>
              ) : (
                <button onClick={goNext}
                  className={`flex items-center gap-1.5 text-sm text-white px-5 py-2 rounded-lg font-semibold bg-gradient-to-r ${current.accentBg} hover:opacity-90 transition-opacity shadow-sm`}>
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="px-6 pb-4 flex items-center gap-3">
            {[["→", "Next"], ["←", "Back"], ["Esc", "Skip tour"]].map(([key, label]) => (
              <span key={key} className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                <kbd className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:text-slate-400">{key}</kbd>
                {label}
              </span>
            ))}
            <button onClick={onClose} className="ml-auto text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Skip tour
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tourSlideIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes tourSlideInBack {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1); }
        }
      `}</style>
    </div>
  );
}
