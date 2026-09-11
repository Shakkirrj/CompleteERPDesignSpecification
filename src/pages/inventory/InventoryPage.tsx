import { useState } from "react";
import {
  Folder, FolderOpen, Boxes, ChevronRight, ChevronDown, Grid, List, Search,
  Plus, ArrowUp, Eye, Edit3, AlertTriangle, TrendingDown, BarChart3,
  Package, ArrowUpRight, ArrowDownLeft, RefreshCw,
} from "lucide-react";

interface StockItem {
  id: string; name: string; type: "category" | "item";
  sku?: string; qty?: number; minQty?: number; unit?: string;
  supplier?: string; location?: string; cost?: number; lastUpdated: string;
  children?: StockItem[];
}

const TREE: StockItem[] = [
  { id: "i1", name: "IT Supplies", type: "category", lastUpdated: "Sep 11",
    children: [
      { id: "i1-1", name: "Cables & Connectors", type: "category", lastUpdated: "Sep 10",
        children: [
          { id: "i1-1-1", name: "HDMI Cable 2m",     type: "item", sku: "CBL-HDMI-2M",   qty: 15, minQty: 5,  unit: "pcs", supplier: "TechMart",  cost: 850,   location: "Storeroom A", lastUpdated: "Sep 10" },
          { id: "i1-1-2", name: "USB-C to USB-A 1m", type: "item", sku: "CBL-USBC-1M",   qty: 3,  minQty: 10, unit: "pcs", supplier: "TechMart",  cost: 450,   location: "Storeroom A", lastUpdated: "Sep 10" },
          { id: "i1-1-3", name: "CAT6 Patch Cable",  type: "item", sku: "CBL-CAT6-1M",   qty: 40, minQty: 20, unit: "pcs", supplier: "NetPro",    cost: 320,   location: "Storeroom B", lastUpdated: "Aug 30" },
        ]
      },
      { id: "i1-2", name: "Consumables", type: "category", lastUpdated: "Sep 08",
        children: [
          { id: "i1-2-1", name: "HP Toner Cartridge 85A", type: "item", sku: "INK-HP-85A",  qty: 2, minQty: 3, unit: "pcs", supplier: "OfficeHub", cost: 8500,  location: "Storeroom A", lastUpdated: "Sep 08" },
          { id: "i1-2-2", name: "A4 Paper Ream 80GSM",    type: "item", sku: "PPR-A4-80G",  qty: 18, minQty: 10, unit: "ream", supplier: "PaperPro", cost: 1200, location: "Office Supply", lastUpdated: "Sep 05" },
        ]
      },
    ]
  },
  { id: "i2", name: "Office Supplies", type: "category", lastUpdated: "Sep 09",
    children: [
      { id: "i2-1", name: "Stationery",   type: "category", lastUpdated: "Sep 09", children: [] },
      { id: "i2-2", name: "Breakroom",    type: "category", lastUpdated: "Aug 25",  children: [] },
    ]
  },
  { id: "i3", name: "Cleaning & Maintenance", type: "category", lastUpdated: "Aug 20", children: [] },
];

function findItem(tree: StockItem[], id: string): StockItem | null {
  for (const i of tree) {
    if (i.id === id) return i;
    if (i.children) { const r = findItem(i.children, id); if (r) return r; }
  }
  return null;
}

function getChildren(tree: StockItem[], id: string | null): StockItem[] {
  if (!id) return tree;
  const item = findItem(tree, id);
  return item?.type === "category" ? (item.children ?? []) : [];
}

function getBreadcrumb(tree: StockItem[], id: string | null): { id: string | null; name: string }[] {
  const crumbs: { id: string | null; name: string }[] = [{ id: null, name: "Inventory" }];
  if (!id) return crumbs;
  function find(items: StockItem[]): boolean {
    for (const i of items) {
      if (i.id === id) { crumbs.push({ id: i.id, name: i.name }); return true; }
      if (i.children && find(i.children)) { crumbs.splice(crumbs.length - 1, 0, { id: i.id, name: i.name }); return true; }
    }
    return false;
  }
  find(tree);
  return crumbs;
}

function TreeNode({ item, depth, selected, onSelect }: { item: StockItem; depth: number; selected: string | null; onSelect: (id: string) => void }) {
  const [expanded, setExpanded] = useState(depth < 1);
  if (item.type === "item") return null;
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

function stockStatus(item: StockItem) {
  if (item.qty === undefined || item.minQty === undefined) return "normal";
  if (item.qty === 0) return "out";
  if (item.qty < item.minQty) return "low";
  return "normal";
}

const stockBadge: Record<string, string> = {
  normal: "bg-emerald-50 text-emerald-700",
  low:    "bg-amber-50 text-amber-700",
  out:    "bg-red-50 text-red-600",
};
const stockLabel: Record<string, string> = { normal: "In Stock", low: "Low Stock", out: "Out of Stock" };

export default function InventoryPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");

  const children = getChildren(TREE, selected).filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );
  const breadcrumb = getBreadcrumb(TREE, selected);
  const items = children.filter(c => c.type === "item");
  const cats = children.filter(c => c.type === "category");

  /* Count low/out items across all */
  function countLow(t: StockItem[]): number {
    let n = 0;
    for (const i of t) {
      if (i.type === "item" && stockStatus(i) !== "normal") n++;
      if (i.children) n += countLow(i.children);
    }
    return n;
  }
  const alertCount = countLow(TREE);

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-52 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
        <div className="px-3 py-2.5 border-b border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Stock Registry</p>
        </div>
        <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
          <button onClick={() => setSelected(null)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-colors mb-1 ${!selected ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-100"}`}>
            <Boxes size={12} /> All Inventory
          </button>
          {alertCount > 0 && (
            <div className="mx-1 mb-2 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
              <AlertTriangle size={10} className="text-amber-600" />
              <span className="text-[11px] text-amber-700 font-medium">{alertCount} items need reorder</span>
            </div>
          )}
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
            disabled={!selected} className="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors">
            <ArrowUp size={14} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-0.5 flex-1 min-w-0">
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
            <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-white shadow-sm" : ""}`}><List size={12} /></button>
            <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-white shadow-sm" : ""}`}><Grid size={12} /></button>
          </div>
          <button className="flex items-center gap-1 text-xs bg-blue-600 text-white hover:bg-blue-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors">
            <Plus size={12} /> Add Item
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {cats.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Categories</p>
              <div className="grid grid-cols-6 gap-2">
                {cats.map(cat => (
                  <button key={cat.id} onClick={() => setSelected(cat.id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Folder size={18} className="text-amber-500" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 text-center leading-tight">{cat.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Stock Items ({items.length})</p>
              {view === "list" ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Item</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">SKU</th>
                      <th className="pb-2 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Qty</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Supplier</th>
                      <th className="pb-2 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Unit Cost</th>
                      <th className="pb-2 w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items.map(item => {
                      const st = stockStatus(item);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 group">
                          <td className="py-2.5 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${st === "out" ? "bg-red-50" : st === "low" ? "bg-amber-50" : "bg-slate-100"}`}>
                                <Package size={12} className={st === "out" ? "text-red-500" : st === "low" ? "text-amber-500" : "text-slate-500"} />
                              </div>
                              <span className="text-sm font-medium text-slate-800">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-3 text-xs font-mono text-slate-500">{item.sku}</td>
                          <td className="py-2.5 pr-3 text-center">
                            <span className={`text-sm font-bold font-mono ${st === "out" ? "text-red-600" : st === "low" ? "text-amber-600" : "text-slate-800"}`}>{item.qty}</span>
                            <span className="text-[10px] text-slate-400 ml-1">{item.unit}</span>
                          </td>
                          <td className="py-2.5 pr-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stockBadge[st]}`}>{stockLabel[st]}</span>
                          </td>
                          <td className="py-2.5 pr-3 text-xs text-slate-500">{item.supplier}</td>
                          <td className="py-2.5 text-right text-xs font-mono text-slate-600">LKR {item.cost?.toLocaleString()}</td>
                          <td className="py-2.5 pl-2">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 justify-end">
                              <button className="p-1 hover:bg-slate-200 rounded text-[10px] text-slate-500">+/-</button>
                              <button className="p-1 hover:bg-slate-200 rounded"><Edit3 size={10} className="text-slate-400" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {items.map(item => {
                    const st = stockStatus(item);
                    return (
                      <div key={item.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer space-y-2">
                        <div className="flex items-start justify-between">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${st === "out" ? "bg-red-50" : st === "low" ? "bg-amber-50" : "bg-slate-100"}`}>
                            <Package size={16} className={st === "out" ? "text-red-500" : st === "low" ? "text-amber-500" : "text-slate-500"} />
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${stockBadge[st]}`}>{stockLabel[st]}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{item.sku}</p>
                        <p className={`text-lg font-black ${st === "out" ? "text-red-600" : st === "low" ? "text-amber-600" : "text-slate-800"}`}>{item.qty} <span className="text-xs font-normal text-slate-400">{item.unit}</span></p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {children.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
              <Boxes size={32} className="text-slate-200" />
              <p className="text-sm">No items in this category</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-1.5 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400">
          <span>{children.length} item{children.length !== 1 ? "s" : ""}</span>
          {alertCount > 0 && <span className="text-amber-600 font-medium">{alertCount} items need reorder</span>}
        </div>
      </div>
    </div>
  );
}
