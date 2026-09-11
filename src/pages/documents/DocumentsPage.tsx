import { useState, useRef, useEffect, useCallback } from "react";
import {
  Folder, FolderOpen, File, FileText, Image, ChevronRight, ChevronDown,
  Upload, Plus, Search, Grid, List, MoreHorizontal, Download, Share,
  Trash2, Eye, Star, Clock, Copy, Scissors, Clipboard, FolderPlus,
  Edit3, RefreshCw, ArrowUp,
} from "lucide-react";

interface FSItem {
  id: string; name: string; type: "folder" | "file";
  size?: string; modified: string; icon?: string; children?: FSItem[]; starred?: boolean;
}

const INITIAL_TREE: FSItem[] = [
  { id: "f1", name: "Company Documents", type: "folder", modified: "Sep 11",
    children: [
      { id: "f1-1", name: "Legal", type: "folder", modified: "Sep 10",
        children: [
          { id: "f1-1-1", name: "Certificate of Incorporation.pdf", type: "file", size: "1.2 MB", modified: "Jan 15", icon: "pdf", starred: true },
          { id: "f1-1-2", name: "VAT Registration.pdf",             type: "file", size: "480 KB", modified: "Mar 01", icon: "pdf" },
        ]
      },
      { id: "f1-2", name: "Branding", type: "folder", modified: "Sep 08",
        children: [
          { id: "f1-2-1", name: "MernCrest Logo.svg",     type: "file", size: "24 KB",  modified: "Feb 01", icon: "img" },
          { id: "f1-2-2", name: "Brand Guidelines.pdf",   type: "file", size: "4.8 MB", modified: "Feb 01", icon: "pdf" },
        ]
      },
    ]
  },
  { id: "f2", name: "Finance", type: "folder", modified: "Sep 11",
    children: [
      { id: "f2-1", name: "Quotations",   type: "folder", modified: "Sep 11", children: [] },
      { id: "f2-2", name: "Invoices",     type: "folder", modified: "Sep 11", children: [] },
      { id: "f2-3", name: "Receipts",     type: "folder", modified: "Sep 11", children: [] },
      { id: "f2-4", name: "Q3 2026 Financial Report.pdf", type: "file", size: "2.1 MB", modified: "Sep 10", icon: "pdf", starred: true },
    ]
  },
  { id: "f3", name: "HR & Employees", type: "folder", modified: "Sep 09",
    children: [
      { id: "f3-1", name: "Employee Contracts",    type: "folder", modified: "Sep 09", children: [] },
      { id: "f3-2", name: "Onboarding Templates",  type: "folder", modified: "Aug 15", children: [] },
    ]
  },
  { id: "f4", name: "Projects", type: "folder", modified: "Sep 07", children: [] },
  { id: "f5", name: "Templates", type: "folder", modified: "Aug 30",
    children: [
      { id: "f5-1", name: "Proposal Template.docx", type: "file", size: "186 KB", modified: "Aug 30", icon: "doc" },
      { id: "f5-2", name: "NDA Template.docx",      type: "file", size: "94 KB",  modified: "Aug 20", icon: "doc" },
    ]
  },
];

const iconColors: Record<string, { bg: string; text: string; label: string }> = {
  pdf: { bg: "bg-red-50",    text: "text-red-600",    label: "PDF" },
  doc: { bg: "bg-blue-50",   text: "text-blue-600",   label: "DOC" },
  img: { bg: "bg-violet-50", text: "text-violet-600", label: "IMG" },
  xls: { bg: "bg-emerald-50",text: "text-emerald-600",label: "XLS" },
};

interface CtxMenu { x: number; y: number; item: FSItem | null; }

function findItem(tree: FSItem[], id: string): FSItem | null {
  for (const i of tree) {
    if (i.id === id) return i;
    if (i.children) { const r = findItem(i.children, id); if (r) return r; }
  }
  return null;
}

function getChildren(tree: FSItem[], id: string | null): FSItem[] {
  if (!id) return tree;
  const item = findItem(tree, id);
  return item?.type === "folder" ? (item.children ?? []) : [];
}

function getBreadcrumb(tree: FSItem[], id: string | null): { id: string | null; name: string }[] {
  const crumbs: { id: string | null; name: string }[] = [{ id: null, name: "Documents" }];
  if (!id) return crumbs;
  function find(items: FSItem[]): boolean {
    for (const i of items) {
      if (i.id === id) { crumbs.push({ id: i.id, name: i.name }); return true; }
      if (i.children && find(i.children)) { crumbs.splice(crumbs.length - 1, 0, { id: i.id, name: i.name }); return true; }
    }
    return false;
  }
  find(tree);
  return crumbs;
}

function TreeNode({ item, depth, onSelect, selected, onContext }: {
  item: FSItem; depth: number; onSelect: (id: string) => void;
  selected: string | null; onContext: (e: React.MouseEvent, item: FSItem) => void;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const isSelected = selected === item.id;
  if (item.type === "folder") {
    return (
      <div>
        <div
          onContextMenu={e => onContext(e, item)}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors select-none ${isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 text-slate-700"}`}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          onClick={() => { setExpanded(!expanded); onSelect(item.id); }}
        >
          {item.children && item.children.length > 0
            ? (expanded ? <ChevronDown size={11} className="flex-shrink-0 text-slate-400" /> : <ChevronRight size={11} className="flex-shrink-0 text-slate-400" />)
            : <span className="w-3 inline-block" />}
          {expanded ? <FolderOpen size={13} className="flex-shrink-0 text-amber-500" /> : <Folder size={13} className="flex-shrink-0 text-amber-400" />}
          <span className="truncate text-[12px]">{item.name}</span>
        </div>
        {expanded && item.children?.map(child => (
          <TreeNode key={child.id} item={child} depth={depth + 1} onSelect={onSelect} selected={selected} onContext={onContext} />
        ))}
      </div>
    );
  }
  return (
    <div
      onContextMenu={e => onContext(e, item)}
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors select-none ${isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 text-slate-600"}`}
      style={{ paddingLeft: `${8 + depth * 14}px` }}
      onClick={() => onSelect(item.id)}
    >
      <span className="w-3 inline-block" />
      <FileText size={13} className="flex-shrink-0 text-slate-400" />
      <span className="truncate text-[12px]">{item.name}</span>
    </div>
  );
}

export default function DocumentsPage() {
  const [tree, setTree] = useState<FSItem[]>(INITIAL_TREE);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [ctx, setCtx] = useState<CtxMenu | null>(null);
  const [clipboard, setClipboard] = useState<{ item: FSItem; op: "copy" | "cut" } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [multiSel, setMultiSel] = useState<Set<string>>(new Set());
  const mainRef = useRef<HTMLDivElement>(null);

  const children = getChildren(tree, selected).filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );
  const breadcrumb = getBreadcrumb(tree, selected);

  /* Close context menu on outside click */
  useEffect(() => {
    const handler = () => setCtx(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  /* Keyboard shortcuts */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setCtx(null); setRenaming(null); }
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && ctx?.item) {
        setClipboard({ item: ctx.item, op: "copy" }); setCtx(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "x" && ctx?.item) {
        setClipboard({ item: ctx.item, op: "cut" }); setCtx(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        setMultiSel(new Set(children.map(c => c.id)));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ctx, children]);

  function openCtx(e: React.MouseEvent, item: FSItem | null) {
    e.preventDefault();
    e.stopPropagation();
    setCtx({ x: e.clientX, y: e.clientY, item });
  }

  function newFolder() {
    const id = `folder-${Date.now()}`;
    const newItem: FSItem = { id, name: "New Folder", type: "folder", modified: "Just now", children: [] };
    if (!selected) {
      setTree(t => [...t, newItem]);
    } else {
      setTree(t => {
        function insert(items: FSItem[]): FSItem[] {
          return items.map(i => i.id === selected
            ? { ...i, children: [...(i.children ?? []), newItem] }
            : { ...i, children: i.children ? insert(i.children) : undefined }
          );
        }
        return insert(t);
      });
    }
    setRenaming(id); setRenameVal("New Folder");
  }

  function deleteItem(id: string) {
    setTree(t => {
      function del(items: FSItem[]): FSItem[] {
        return items.filter(i => i.id !== id).map(i => ({ ...i, children: i.children ? del(i.children) : undefined }));
      }
      return del(t);
    });
  }

  function commitRename(id: string) {
    if (!renameVal.trim()) { setRenaming(null); return; }
    setTree(t => {
      function ren(items: FSItem[]): FSItem[] {
        return items.map(i => i.id === id ? { ...i, name: renameVal.trim() } : { ...i, children: i.children ? ren(i.children) : undefined });
      }
      return ren(t);
    });
    setRenaming(null);
  }

  function toggleStar(id: string) {
    setTree(t => {
      function star(items: FSItem[]): FSItem[] {
        return items.map(i => i.id === id ? { ...i, starred: !i.starred } : { ...i, children: i.children ? star(i.children) : undefined });
      }
      return star(t);
    });
  }

  const ctxMenuItems = ctx?.item ? [
    { label: "Open",         icon: Eye,       action: () => { if (ctx.item?.type === "folder") setSelected(ctx.item.id); } },
    { label: "separator" },
    { label: "Copy",         icon: Copy,      action: () => { clipboard !== null || setClipboard({ item: ctx.item!, op: "copy" }); setClipboard({ item: ctx.item!, op: "copy" }); } },
    { label: "Cut",          icon: Scissors,  action: () => setClipboard({ item: ctx.item!, op: "cut" }) },
    { label: clipboard ? "Paste" : "Paste (empty)", icon: Clipboard, action: () => {}, disabled: !clipboard },
    { label: "separator" },
    { label: "Rename",       icon: Edit3,     action: () => { setRenaming(ctx.item!.id); setRenameVal(ctx.item!.name); } },
    { label: ctx.item.starred ? "Remove Star" : "Star", icon: Star, action: () => toggleStar(ctx.item!.id) },
    { label: "separator" },
    { label: "Download",     icon: Download,  action: () => {} },
    { label: "Share",        icon: Share,     action: () => {} },
    { label: "separator" },
    { label: "Delete",       icon: Trash2,    action: () => deleteItem(ctx.item!.id), danger: true },
  ] : [
    { label: "New Folder",   icon: FolderPlus,action: newFolder },
    { label: "Upload Files", icon: Upload,    action: () => {} },
    { label: "separator" },
    { label: "Paste",        icon: Clipboard, action: () => {}, disabled: !clipboard },
    { label: "separator" },
    { label: "Refresh",      icon: RefreshCw, action: () => {} },
  ];

  return (
    <div
      className="flex h-[calc(100vh-56px)]"
      onContextMenu={e => { if (e.target === mainRef.current || (e.target as HTMLElement).closest("[data-area='main']") === mainRef.current) openCtx(e, null); }}
    >
      {/* Sidebar tree */}
      <div className="w-52 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
        <div className="px-3 py-2.5 border-b border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">File Explorer</p>
        </div>
        <div className="px-2 py-1.5 border-b border-slate-100">
          {([
            { id: "recent",  label: "Recent",  icon: Clock,  color: "text-blue-500"  },
            { id: "starred", label: "Starred", icon: Star,   color: "text-amber-500" },
            { id: "shared",  label: "Shared",  icon: Share,  color: "text-violet-500"},
          ] as const).map(q => (
            <button key={q.id} onClick={() => setSelected(q.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-colors ${selected === q.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}>
              <q.icon size={12} className={q.color} />{q.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
          {tree.map(item => (
            <TreeNode key={item.id} item={item} depth={0}
              onSelect={id => setSelected(id)} selected={selected}
              onContext={openCtx}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-white flex-wrap">
          <button
            onClick={() => { const bc = getBreadcrumb(tree, selected); setSelected(bc.length > 1 ? (bc[bc.length - 2].id) : null); }}
            disabled={!selected}
            className="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
          >
            <ArrowUp size={14} className="text-slate-500" />
          </button>
          {/* Breadcrumb */}
          <div className="flex items-center gap-0.5 text-sm flex-1 min-w-0">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-0.5">
                {i > 0 && <ChevronRight size={11} className="text-slate-300 flex-shrink-0" />}
                <button
                  onClick={() => setSelected(crumb.id)}
                  className={`px-1 py-0.5 rounded hover:bg-slate-100 transition-colors truncate text-[13px] ${i === breadcrumb.length - 1 ? "font-semibold text-slate-800" : "text-slate-500"}`}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
          <div className="relative flex-shrink-0">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="pl-6 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-32" />
          </div>
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-white shadow-sm" : ""}`}><List size={12} className={view === "list" ? "text-slate-700" : "text-slate-400"} /></button>
            <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-white shadow-sm" : ""}`}><Grid size={12} className={view === "grid" ? "text-slate-700" : "text-slate-400"} /></button>
          </div>
          <button onClick={newFolder} className="flex items-center gap-1 text-xs border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-lg transition-colors">
            <FolderPlus size={12} /> New Folder
          </button>
          <button className="flex items-center gap-1 text-xs bg-blue-600 text-white hover:bg-blue-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors">
            <Upload size={12} /> Upload
          </button>
        </div>

        {/* Clipboard indicator */}
        {clipboard && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 border-b border-blue-100 text-xs text-blue-700">
            {clipboard.op === "copy" ? <Copy size={11} /> : <Scissors size={11} />}
            <span className="font-medium">{clipboard.op === "copy" ? "Copied" : "Cut"}:</span>
            <span>{clipboard.item.name}</span>
            <button onClick={() => setClipboard(null)} className="ml-auto text-blue-400 hover:text-blue-600">×</button>
          </div>
        )}

        {/* Content area */}
        <div
          ref={mainRef}
          data-area="main"
          className="flex-1 overflow-auto p-4"
          onContextMenu={e => {
            if (e.target === mainRef.current || (e.target as Element).closest("[data-item]") === null) {
              openCtx(e, null);
            }
          }}
        >
          {children.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 select-none"
              onContextMenu={e => openCtx(e, null)}>
              <Folder size={36} className="text-slate-200" />
              <p className="text-sm">Empty folder</p>
              <p className="text-xs text-slate-300">Right-click for options</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-6 gap-2.5">
              {children.map(item => {
                const ic = item.icon ? iconColors[item.icon] : null;
                const isSel = multiSel.has(item.id);
                return (
                  <div
                    key={item.id}
                    data-item="1"
                    draggable
                    onDragStart={() => setDragging(item.id)}
                    onDragEnd={() => { setDragging(null); setDragOver(null); }}
                    onDragOver={e => { e.preventDefault(); setDragOver(item.id); }}
                    onDrop={e => { e.preventDefault(); setDragging(null); setDragOver(null); }}
                    onContextMenu={e => openCtx(e, item)}
                    onClick={e => {
                      if (e.ctrlKey || e.metaKey) {
                        setMultiSel(s => { const n = new Set(s); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; });
                      } else {
                        setMultiSel(new Set());
                        if (item.type === "folder") setSelected(item.id);
                      }
                    }}
                    onDoubleClick={() => { if (item.type === "folder") setSelected(item.id); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                      isSel ? "border-blue-400 bg-blue-50" :
                      dragOver === item.id ? "border-blue-400 bg-blue-50/40 scale-105" :
                      dragging === item.id ? "opacity-50" :
                      "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.type === "folder" ? "bg-amber-50" : ic ? ic.bg : "bg-slate-100"}`}>
                      {item.type === "folder"
                        ? <Folder size={22} className="text-amber-500" />
                        : ic ? <span className={`text-[8px] font-bold ${ic.text}`}>{ic.label}</span>
                              : <FileText size={22} className="text-slate-400" />
                      }
                    </div>
                    {renaming === item.id ? (
                      <input
                        autoFocus value={renameVal}
                        onChange={e => setRenameVal(e.target.value)}
                        onBlur={() => commitRename(item.id)}
                        onKeyDown={e => { if (e.key === "Enter") commitRename(item.id); if (e.key === "Escape") setRenaming(null); }}
                        className="text-[11px] text-center w-full border border-blue-400 rounded px-1 outline-none bg-white"
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <p className="text-[11px] font-medium text-slate-700 text-center leading-tight w-full truncate">{item.name}</p>
                    )}
                    {item.starred && <Star size={9} className="text-amber-400 fill-amber-400" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Name</th>
                  <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Modified</th>
                  <th className="pb-2 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Size</th>
                  <th className="pb-2 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {children.map(item => {
                  const ic = item.icon ? iconColors[item.icon] : null;
                  const isSel = multiSel.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      data-item="1"
                      draggable
                      onDragStart={() => setDragging(item.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                      onDragOver={e => { e.preventDefault(); if (item.type === "folder") setDragOver(item.id); }}
                      onDrop={e => { e.preventDefault(); setDragging(null); setDragOver(null); }}
                      onContextMenu={e => openCtx(e, item)}
                      onClick={e => {
                        if (e.ctrlKey || e.metaKey) {
                          setMultiSel(s => { const n = new Set(s); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; });
                        } else {
                          setMultiSel(new Set());
                        }
                      }}
                      onDoubleClick={() => { if (item.type === "folder") setSelected(item.id); }}
                      className={`group cursor-pointer transition-colors select-none ${
                        isSel ? "bg-blue-50" :
                        dragOver === item.id ? "bg-blue-50" :
                        dragging === item.id ? "opacity-40" :
                        "hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === "folder" ? "bg-amber-50" : ic ? ic.bg : "bg-slate-100"}`}>
                            {item.type === "folder"
                              ? <Folder size={13} className="text-amber-500" />
                              : ic ? <span className={`text-[7px] font-bold ${ic.text}`}>{ic.label}</span>
                                    : <FileText size={13} className="text-slate-400" />
                            }
                          </div>
                          {renaming === item.id ? (
                            <input
                              autoFocus value={renameVal}
                              onChange={e => setRenameVal(e.target.value)}
                              onBlur={() => commitRename(item.id)}
                              onKeyDown={e => { if (e.key === "Enter") commitRename(item.id); if (e.key === "Escape") setRenaming(null); }}
                              className="text-sm border border-blue-400 rounded px-1 outline-none bg-white w-full"
                              onClick={e => e.stopPropagation()}
                            />
                          ) : (
                            <span className="text-sm text-slate-700 font-medium">{item.name}</span>
                          )}
                          {item.starred && <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-xs text-slate-400">{item.modified}</td>
                      <td className="py-2 text-right text-xs text-slate-400">{item.size ?? "—"}</td>
                      <td className="py-2 pl-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 justify-end">
                          {item.type === "file" && <button className="p-1 hover:bg-slate-100 rounded" title="Preview"><Eye size={11} className="text-slate-400" /></button>}
                          {item.type === "file" && <button className="p-1 hover:bg-slate-100 rounded" title="Download"><Download size={11} className="text-slate-400" /></button>}
                          <button onClick={e => { e.stopPropagation(); openCtx(e, item); }} className="p-1 hover:bg-slate-100 rounded"><MoreHorizontal size={11} className="text-slate-400" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 px-4 py-1.5 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400">
          <span>{children.length} item{children.length !== 1 ? "s" : ""}</span>
          {multiSel.size > 0 && <span className="text-blue-600 font-medium">{multiSel.size} selected</span>}
          {clipboard && <span className="text-blue-500">{clipboard.op === "copy" ? "Copying" : "Cutting"}: {clipboard.item.name}</span>}
          <span className="ml-auto">Right-click for options · Drag to move · Ctrl+A to select all</span>
        </div>
      </div>

      {/* Context menu */}
      {ctx && (
        <div
          className="fixed z-[300] bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 min-w-44"
          style={{ top: ctx.y, left: ctx.x }}
          onClick={e => e.stopPropagation()}
        >
          {ctxMenuItems.map((item, i) => {
            if (item.label === "separator") return <div key={i} className="my-1 border-t border-slate-100" />;
            const Icon = item.icon;
            return (
              <button
                key={i}
                disabled={"disabled" in item && item.disabled === true}
                onClick={() => { if ("action" in item && item.action) item.action(); setCtx(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors disabled:opacity-40 disabled:cursor-default ${
                  "danger" in item && item.danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {Icon && <Icon size={12} className="flex-shrink-0" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
