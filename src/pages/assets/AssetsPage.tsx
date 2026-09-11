import { useState } from "react";
import {
  Folder, FolderOpen, Package, Monitor, Wifi, Printer,
  ChevronRight, ChevronDown, Grid, List, Search, Plus, Upload,
  Download, MoreHorizontal, Trash2, Edit3, ArrowUp, Eye,
  FolderPlus, RefreshCw, Filter, Tag,
} from "lucide-react";

interface Asset {
  id: string; name: string; type: "category" | "asset";
  tag?: string; serial?: string; status?: "active" | "inactive" | "maintenance" | "retired";
  assignedTo?: string; location?: string; purchaseDate?: string;
  value?: number; modified: string;
  icon?: "computer" | "network" | "printer" | "other";
  children?: Asset[];
}

const iconMap = { computer: Monitor, network: Wifi, printer: Printer, other: Package };
const statusColors: Record<string, string> = {
  active:      "bg-emerald-50 text-emerald-700",
  inactive:    "bg-slate-100 text-slate-500",
  maintenance: "bg-amber-50 text-amber-700",
  retired:     "bg-red-50 text-red-500",
};

const TREE: Asset[] = [
  { id: "a1", name: "IT Equipment", type: "category", modified: "Sep 11",
    children: [
      { id: "a1-1", name: "Laptops", type: "category", modified: "Sep 11",
        children: [
          { id: "a1-1-1", name: "Dell XPS 15 — KAV001", type: "asset", tag: "MC-IT-0041", serial: "DX15-2024-41", status: "active", assignedTo: "Kavinda Perera", location: "Colombo HQ", purchaseDate: "2024-01-10", value: 420000, modified: "Sep 11", icon: "computer" },
          { id: "a1-1-2", name: "MacBook Pro M3 — DLS001", type: "asset", tag: "MC-IT-0042", serial: "MBP-M3-2024-01", status: "active", assignedTo: "Dilshan Fernando", location: "Colombo HQ", purchaseDate: "2024-03-15", value: 680000, modified: "Sep 08", icon: "computer" },
          { id: "a1-1-3", name: "Lenovo ThinkPad X1", type: "asset", tag: "MC-IT-0033", serial: "TP-X1-2023-07", status: "maintenance", assignedTo: "Unassigned", location: "IT Dept", purchaseDate: "2023-06-01", value: 310000, modified: "Aug 20", icon: "computer" },
        ]
      },
      { id: "a1-2", name: "Network Equipment", type: "category", modified: "Sep 05",
        children: [
          { id: "a1-2-1", name: "Cisco Switch 24-Port", type: "asset", tag: "MC-NET-001", serial: "CS-24-2022-01", status: "active", location: "Server Room", purchaseDate: "2022-07-01", value: 185000, modified: "Sep 05", icon: "network" },
          { id: "a1-2-2", name: "FortiGate 100F Firewall", type: "asset", tag: "MC-NET-002", serial: "FG-100F-2023", status: "active", location: "Server Room", purchaseDate: "2023-01-15", value: 520000, modified: "Sep 05", icon: "network" },
        ]
      },
      { id: "a1-3", name: "Printers & Peripherals", type: "category", modified: "Aug 15",
        children: [
          { id: "a1-3-1", name: "HP LaserJet Pro", type: "asset", tag: "MC-PRT-001", serial: "HPLJ-2021-01", status: "active", location: "Admin Area", purchaseDate: "2021-03-01", value: 95000, modified: "Aug 15", icon: "printer" },
        ]
      },
    ]
  },
  { id: "a2", name: "Furniture & Fixtures", type: "category", modified: "Aug 30",
    children: [
      { id: "a2-1", name: "Workstations", type: "category", modified: "Aug 30", children: [] },
      { id: "a2-2", name: "Conference Rooms", type: "category", modified: "Jul 15", children: [] },
    ]
  },
  { id: "a3", name: "Vehicles", type: "category", modified: "Jul 01", children: [] },
  { id: "a4", name: "Software Licenses", type: "category", modified: "Sep 10", children: [] },
];

function findItem(tree: Asset[], id: string): Asset | null {
  for (const i of tree) {
    if (i.id === id) return i;
    if (i.children) { const r = findItem(i.children, id); if (r) return r; }
  }
  return null;
}

function getChildren(tree: Asset[], id: string | null): Asset[] {
  if (!id) return tree;
  const item = findItem(tree, id);
  return item?.type === "category" ? (item.children ?? []) : [];
}

function getBreadcrumb(tree: Asset[], id: string | null): { id: string | null; name: string }[] {
  const crumbs: { id: string | null; name: string }[] = [{ id: null, name: "Assets" }];
  if (!id) return crumbs;
  function find(items: Asset[]): boolean {
    for (const i of items) {
      if (i.id === id) { crumbs.push({ id: i.id, name: i.name }); return true; }
      if (i.children && find(i.children)) { crumbs.splice(crumbs.length - 1, 0, { id: i.id, name: i.name }); return true; }
    }
    return false;
  }
  find(tree);
  return crumbs;
}

function TreeNode({ item, depth, selected, onSelect }: { item: Asset; depth: number; selected: string | null; onSelect: (id: string) => void }) {
  const [expanded, setExpanded] = useState(depth < 1);
  if (item.type === "asset") return null;
  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors select-none ${selected === item.id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 text-slate-700"}`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => { setExpanded(!expanded); onSelect(item.id); }}
      >
        {item.children && item.children.length > 0
          ? (expanded ? <ChevronDown size={11} className="flex-shrink-0 text-slate-400" /> : <ChevronRight size={11} className="flex-shrink-0 text-slate-400" />)
          : <span className="w-3 inline-block" />}
        {expanded ? <FolderOpen size={13} className="flex-shrink-0 text-amber-500" /> : <Folder size={13} className="flex-shrink-0 text-amber-400" />}
        <span className="truncate text-[12px]">{item.name}</span>
      </div>
      {expanded && item.children?.filter(c => c.type === "category").map(child => (
        <TreeNode key={child.id} item={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function AssetsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);

  const children = getChildren(TREE, selected).filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );
  const breadcrumb = getBreadcrumb(TREE, selected);
  const allAssets = children.filter(c => c.type === "asset");
  const subCats = children.filter(c => c.type === "category");

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-52 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
        <div className="px-3 py-2.5 border-b border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Asset Registry</p>
        </div>
        <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
          <button onClick={() => setSelected(null)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-colors mb-1 ${!selected ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-100"}`}>
            <Package size={12} /> All Assets
          </button>
          {TREE.map(item => (
            <TreeNode key={item.id} item={item} depth={0} selected={selected} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-white flex-wrap">
          <button onClick={() => { const bc = getBreadcrumb(TREE, selected); setSelected(bc.length > 1 ? bc[bc.length - 2].id : null); }}
            disabled={!selected}
            className="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors">
            <ArrowUp size={14} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-0.5 text-sm flex-1 min-w-0">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-0.5">
                {i > 0 && <ChevronRight size={11} className="text-slate-300" />}
                <button onClick={() => setSelected(crumb.id)}
                  className={`px-1 py-0.5 rounded hover:bg-slate-100 text-[13px] ${i === breadcrumb.length - 1 ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="pl-6 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-32" />
          </div>
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-white shadow-sm" : ""}`}><List size={12} className={view === "list" ? "text-slate-700" : "text-slate-400"} /></button>
            <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-white shadow-sm" : ""}`}><Grid size={12} className={view === "grid" ? "text-slate-700" : "text-slate-400"} /></button>
          </div>
          <button className="flex items-center gap-1 text-xs bg-blue-600 text-white hover:bg-blue-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors">
            <Plus size={12} /> Add Asset
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Sub-categories */}
          {subCats.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Categories</p>
              <div className="grid grid-cols-6 gap-2">
                {subCats.map(cat => (
                  <button key={cat.id} onClick={() => setSelected(cat.id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Folder size={18} className="text-amber-500" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 text-center leading-tight">{cat.name}</p>
                    <p className="text-[10px] text-slate-400">{(cat.children ?? []).length} items</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assets */}
          {allAssets.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Assets ({allAssets.length})</p>
              {view === "list" ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Asset</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Tag / Serial</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Assigned To</th>
                      <th className="pb-2 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Value (LKR)</th>
                      <th className="pb-2 w-20" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allAssets.map(asset => {
                      const IconComp = iconMap[asset.icon ?? "other"];
                      return (
                        <tr key={asset.id} className="hover:bg-slate-50 group cursor-pointer" onClick={() => setDetailAsset(asset)}>
                          <td className="py-2.5 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                                <IconComp size={14} className="text-slate-500" />
                              </div>
                              <span className="text-sm font-medium text-slate-800">{asset.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-3">
                            <p className="text-xs font-mono text-slate-600">{asset.tag}</p>
                            <p className="text-[10px] text-slate-400">{asset.serial}</p>
                          </td>
                          <td className="py-2.5 pr-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[asset.status ?? "inactive"]}`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-xs text-slate-600">{asset.assignedTo ?? "—"}</td>
                          <td className="py-2.5 text-right text-sm font-mono text-slate-700">{asset.value?.toLocaleString() ?? "—"}</td>
                          <td className="py-2.5 pl-2">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 justify-end">
                              <button className="p-1 hover:bg-slate-200 rounded"><Eye size={11} className="text-slate-400" /></button>
                              <button className="p-1 hover:bg-slate-200 rounded"><Edit3 size={11} className="text-slate-400" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {allAssets.map(asset => {
                    const IconComp = iconMap[asset.icon ?? "other"];
                    return (
                      <div key={asset.id} onClick={() => setDetailAsset(asset)}
                        className="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                            <IconComp size={16} className="text-slate-500" />
                          </div>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${statusColors[asset.status ?? "inactive"]}`}>
                            {asset.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">{asset.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{asset.tag}</p>
                        <p className="text-xs text-slate-500">{asset.assignedTo ?? "Unassigned"}</p>
                        {asset.value && <p className="text-sm font-bold text-slate-700">LKR {asset.value.toLocaleString()}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {children.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
              <Package size={32} className="text-slate-200" />
              <p className="text-sm">No assets in this category</p>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 px-4 py-1.5 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400">
          <span>{children.length} item{children.length !== 1 ? "s" : ""}</span>
          <span className="ml-auto">Click an asset to view details</span>
        </div>
      </div>

      {/* Detail drawer */}
      {detailAsset && (
        <div className="w-72 border-l border-slate-200 bg-white flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">Asset Details</p>
            <button onClick={() => setDetailAsset(null)} className="p-1 hover:bg-slate-100 rounded">
              <ChevronRight size={14} className="text-slate-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center gap-3">
              {(() => { const IC = iconMap[detailAsset.icon ?? "other"]; return <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center"><IC size={22} className="text-slate-500" /></div>; })()}
              <div>
                <p className="text-sm font-bold text-slate-900">{detailAsset.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[detailAsset.status ?? "inactive"]}`}>{detailAsset.status}</span>
              </div>
            </div>
            {[
              { label: "Asset Tag",     value: detailAsset.tag },
              { label: "Serial No.",    value: detailAsset.serial },
              { label: "Assigned To",   value: detailAsset.assignedTo ?? "Unassigned" },
              { label: "Location",      value: detailAsset.location },
              { label: "Purchase Date", value: detailAsset.purchaseDate },
              { label: "Value",         value: detailAsset.value ? `LKR ${detailAsset.value.toLocaleString()}` : undefined },
            ].filter(r => r.value).map(r => (
              <div key={r.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                <p className="text-sm text-slate-700 mt-0.5 font-mono">{r.value}</p>
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <button className="w-full text-sm border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-slate-700 flex items-center gap-2"><Edit3 size={13} />Edit Asset</button>
              <button className="w-full text-sm border border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg text-red-600 flex items-center gap-2"><Trash2 size={13} />Retire Asset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
