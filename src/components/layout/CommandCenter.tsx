import { useState, useEffect, useRef, useCallback } from "react";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: string;
  shortcut?: string;
  page?: string;
  action?: string;
}

const commands: CommandItem[] = [
  // Navigation
  { id: "nav-dashboard",     label: "Dashboard",        category: "Navigate", icon: "🏠", page: "dashboard" },
  { id: "nav-employees",     label: "Employees",        category: "Navigate", icon: "👥", page: "employees" },
  { id: "nav-attendance",    label: "Attendance",       category: "Navigate", icon: "⏰", page: "attendance" },
  { id: "nav-leave",         label: "Leave",            category: "Navigate", icon: "📅", page: "leave" },
  { id: "nav-payroll",       label: "Payroll",          category: "Navigate", icon: "💰", page: "payroll" },
  { id: "nav-crm",           label: "CRM",              category: "Navigate", icon: "🤝", page: "crm" },
  { id: "nav-quotations",    label: "Quotations",       category: "Navigate", icon: "📋", page: "quotations" },
  { id: "nav-invoices",      label: "Invoices",         category: "Navigate", icon: "🧾", page: "invoices" },
  { id: "nav-billing",       label: "Billing",          category: "Navigate", icon: "📊", page: "billing" },
  { id: "nav-projects",      label: "Projects",         category: "Navigate", icon: "📁", page: "projects" },
  { id: "nav-tasks",         label: "Tasks",            category: "Navigate", icon: "✅", page: "tasks" },
  { id: "nav-servicedesk",   label: "Service Desk",     category: "Navigate", icon: "🎧", page: "servicedesk" },
  { id: "nav-assets",        label: "Assets",           category: "Navigate", icon: "📦", page: "assets" },
  { id: "nav-inventory",     label: "Inventory",        category: "Navigate", icon: "🗄️", page: "inventory" },
  { id: "nav-documents",     label: "Documents",        category: "Navigate", icon: "📂", page: "documents" },
  { id: "nav-mail",          label: "Mail",             category: "Navigate", icon: "✉️", page: "mail" },
  { id: "nav-chat",          label: "Chat",             category: "Navigate", icon: "💬", page: "chat" },
  { id: "nav-approvals",     label: "Approvals",        category: "Navigate", icon: "✔️", page: "approvals" },
  { id: "nav-integrations",  label: "Integrations",     category: "Navigate", icon: "🔌", page: "integrations" },
  { id: "nav-infrastructure",label: "Infrastructure",   category: "Navigate", icon: "🖥️", page: "infrastructure" },
  { id: "nav-domains",       label: "Domains & SSL",    category: "Navigate", icon: "🌐", page: "domains" },
  { id: "nav-github",        label: "GitHub",           category: "Navigate", icon: "🐙", page: "github" },
  { id: "nav-automation",    label: "Automation",       category: "Navigate", icon: "⚡", page: "automation" },
  { id: "nav-ai",            label: "AI Assistant",     category: "Navigate", icon: "✨", page: "ai" },
  { id: "nav-reports",       label: "Reports",          category: "Navigate", icon: "📈", page: "reports" },
  { id: "nav-settings",      label: "Settings",         category: "Navigate", icon: "⚙️", page: "settings" },
  { id: "nav-api",           label: "API & Secrets",    category: "Navigate", icon: "🔑", page: "api" },
  { id: "nav-terminal",      label: "Terminal",         category: "Navigate", icon: "⬛", page: "terminal" },
  // Actions
  { id: "act-new-employee",  label: "Create Employee",  category: "Actions",  icon: "➕", action: "new-employee" },
  { id: "act-new-invoice",   label: "Create Invoice",   category: "Actions",  icon: "➕", action: "new-invoice" },
  { id: "act-new-quotation", label: "Create Quotation", category: "Actions",  icon: "➕", action: "new-quotation" },
  { id: "act-new-project",   label: "Create Project",   category: "Actions",  icon: "➕", action: "new-project" },
  { id: "act-new-ticket",    label: "Create Ticket",    category: "Actions",  icon: "➕", action: "new-ticket" },
  { id: "act-record-payment",label: "Record Payment",   category: "Actions",  icon: "💳", action: "record-payment" },
];

interface Props {
  onNavigate: (page: string) => void;
}

export default function CommandCenter({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands.slice(0, 16);

  const close = useCallback(() => { setOpen(false); setQuery(""); setSelected(0); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && filtered[selected]) {
      const item = filtered[selected];
      if (item.page) { onNavigate(item.page); close(); }
    }
  }

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-24"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={close}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ border: "1px solid #e2e8f0" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, employees, invoices, actions…"
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
          <kbd className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{cat}</div>
                {items.map(item => {
                  const globalIdx = filtered.indexOf(item);
                  const isSelected = globalIdx === selected;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { if (item.page) { onNavigate(item.page); close(); } }}
                      onMouseEnter={() => setSelected(globalIdx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base w-6 text-center">{item.icon}</span>
                      <span className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-slate-700"}`}>{item.label}</span>
                      {isSelected && (
                        <span className="ml-auto text-[10px] text-blue-400 font-medium">↵ Enter</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-4 py-2 flex items-center gap-4 text-[10px] text-slate-400">
          <span><kbd className="bg-slate-100 rounded px-1">↑↓</kbd> Navigate</span>
          <span><kbd className="bg-slate-100 rounded px-1">↵</kbd> Open</span>
          <span><kbd className="bg-slate-100 rounded px-1">Esc</kbd> Close</span>
          <span className="ml-auto">⌘K</span>
        </div>
      </div>
    </div>
  );
}
