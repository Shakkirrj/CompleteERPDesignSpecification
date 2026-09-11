import { useState } from "react";
import * as Icons from "lucide-react";
import { navSections } from "../../data/navigation";
import mcLogo from "../../assets/merncrest-logo.png";

interface Props {
  activePage: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onLogout?: () => void;
}

function NavIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <Icon size={16} />;
}

export default function Sidebar({ activePage, onNavigate, collapsed, onLogout }: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  function toggleItem(id: string) {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <aside
      className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-200"
      style={{ width: collapsed ? 56 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-3 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: collapsed ? 36 : 40, height: collapsed ? 36 : 40 }}>
          <img src={mcLogo} alt="MernCrest" className="object-contain w-full h-full" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-slate-900 dark:text-slate-100 font-bold text-sm leading-none truncate" style={{ fontFamily: "var(--font-display)" }}>MernCrest</p>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5">Solutions (Pvt) Ltd</p>
          </div>
        )}
      </div>

      {/* Branch selector */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <button className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors border border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2">
              <Icons.MapPin size={12} className="text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-300">Colombo HQ</span>
            </div>
            <Icons.ChevronDown size={12} className="text-slate-400" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-2">
        {navSections.map((section) => {
          const sectionKey = section.title;
          const isSectionCollapsed = expandedSections[sectionKey] === false;
          return (
            <div key={sectionKey} className="mb-1">
              {!collapsed && (
                <button
                  className="w-full flex items-center justify-between px-4 py-1.5 group"
                  onClick={() => setExpandedSections(prev => ({ ...prev, [sectionKey]: !isSectionCollapsed }))}
                >
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{section.title}</span>
                  {isSectionCollapsed
                    ? <Icons.ChevronRight size={10} className="text-slate-300" />
                    : <Icons.ChevronDown size={10} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                  }
                </button>
              )}
              {!isSectionCollapsed && (
                <div className="space-y-0.5 px-2">
                  {section.items.map((item) => {
                    const isActive = activePage === item.id || item.children?.some(c => c.id === activePage);
                    const isExpanded = expandedItems[item.id];
                    const hasChildren = item.children && item.children.length > 0;
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => {
                            if (hasChildren) toggleItem(item.id);
                            else onNavigate(item.id);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all ${
                            isActive
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="flex-shrink-0"><NavIcon name={item.icon} /></span>
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
                              {item.badge !== undefined && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-blue-600 text-white"}`}>
                                  {item.badge}
                                </span>
                              )}
                              {hasChildren && (
                                <Icons.ChevronRight size={12} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                              )}
                            </>
                          )}
                        </button>
                        {!collapsed && hasChildren && isExpanded && (
                          <div className="ml-5 mt-0.5 space-y-0.5 pl-3 border-l border-slate-200 dark:border-slate-700">
                            {item.children!.map(child => (
                              <button
                                key={child.id}
                                onClick={() => onNavigate(child.id)}
                                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
                                  activePage === child.id
                                    ? "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                              >
                                <NavIcon name={child.icon} />
                                <span className="text-xs font-medium">{child.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-100 dark:border-slate-700 p-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">PJ</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 dark:text-slate-100 text-xs font-semibold truncate">Priya Jayawardena</p>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] truncate">Operations Director</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={onLogout} title="Sign out"
              className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
              <Icons.LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
