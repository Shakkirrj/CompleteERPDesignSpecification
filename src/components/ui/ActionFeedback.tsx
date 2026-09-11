import { useEffect, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Mail, FileText, Banknote, Upload, UserCheck } from "lucide-react";

export type FeedbackType =
  | "success" | "error" | "processing" | "warning" | "upload"
  | "payment" | "receipt" | "approval" | "email" | "salary";

export interface ActionFeedbackData {
  type: FeedbackType;
  title: string;
  message?: string;
  ref?: string;
  refLabel?: string;
  amount?: string;
  actions?: { label: string; onClick: () => void; primary?: boolean }[];
  autoDismiss?: number;
}

interface Props {
  data: ActionFeedbackData | null;
  onDismiss: () => void;
}

const configs: Record<FeedbackType, {
  bg: string; ring: string; iconBg: string; iconColor: string;
  ripple: string; Icon: React.ElementType;
}> = {
  success:    { bg: "bg-white",              ring: "ring-emerald-100", iconBg: "bg-emerald-50",  iconColor: "text-emerald-600",  ripple: "bg-emerald-400", Icon: CheckCircle2  },
  error:      { bg: "bg-white",              ring: "ring-red-100",     iconBg: "bg-red-50",      iconColor: "text-red-600",      ripple: "bg-red-400",     Icon: XCircle       },
  processing: { bg: "bg-white",              ring: "ring-blue-100",    iconBg: "bg-blue-50",     iconColor: "text-blue-600",     ripple: "bg-blue-400",    Icon: Loader2       },
  warning:    { bg: "bg-white",              ring: "ring-amber-100",   iconBg: "bg-amber-50",    iconColor: "text-amber-600",    ripple: "bg-amber-400",   Icon: AlertTriangle },
  upload:     { bg: "bg-white",              ring: "ring-violet-100",  iconBg: "bg-violet-50",   iconColor: "text-violet-600",   ripple: "bg-violet-400",  Icon: Upload        },
  payment:    { bg: "bg-white",              ring: "ring-emerald-100", iconBg: "bg-emerald-50",  iconColor: "text-emerald-600",  ripple: "bg-emerald-400", Icon: Banknote      },
  receipt:    { bg: "bg-white",              ring: "ring-blue-100",    iconBg: "bg-blue-50",     iconColor: "text-blue-600",     ripple: "bg-blue-400",    Icon: FileText      },
  approval:   { bg: "bg-white",              ring: "ring-violet-100",  iconBg: "bg-violet-50",   iconColor: "text-violet-600",   ripple: "bg-violet-400",  Icon: UserCheck     },
  email:      { bg: "bg-white",              ring: "ring-blue-100",    iconBg: "bg-blue-50",     iconColor: "text-blue-600",     ripple: "bg-blue-400",    Icon: Mail          },
  salary:     { bg: "bg-white",              ring: "ring-emerald-100", iconBg: "bg-emerald-50",  iconColor: "text-emerald-600",  ripple: "bg-emerald-400", Icon: Banknote      },
};

export default function ActionFeedback({ data, onDismiss }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!data) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const delay = data.autoDismiss ?? (data.type === "processing" ? 0 : 3200);
    if (delay > 0) {
      timerRef.current = setTimeout(onDismiss, delay);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [data, onDismiss]);

  if (!data) return null;

  const cfg = configs[data.type];
  const Icon = cfg.Icon;
  const isProcessing = data.type === "processing";
  const isError = data.type === "error";

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center anim-fade-in"
      style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={isProcessing ? undefined : onDismiss}
      role="dialog"
      aria-live="assertive"
      aria-label={data.title}
    >
      {/* Card */}
      <div
        className={`relative ${cfg.bg} rounded-3xl shadow-2xl ring-4 ${cfg.ring} px-10 py-10 flex flex-col items-center gap-5 anim-bounce-in`}
        style={{ minWidth: 340, maxWidth: 440 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Ripple rings (success/payment only) */}
        {!isError && !isProcessing && (
          <>
            <span className={`absolute w-32 h-32 rounded-full ${cfg.ripple} opacity-0 anim-ripple`} />
            <span className={`absolute w-32 h-32 rounded-full ${cfg.ripple} opacity-0 anim-ripple anim-delay-300`} />
          </>
        )}

        {/* Icon */}
        <div className={`relative z-10 w-20 h-20 ${cfg.iconBg} rounded-3xl flex items-center justify-center shadow-lg ${!isProcessing ? "anim-success-pop" : ""}`}>
          <Icon
            size={38}
            className={`${cfg.iconColor} ${isProcessing ? "anim-spinner" : ""}`}
          />
        </div>

        {/* Title */}
        <div className="text-center anim-slide-up anim-delay-100 space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {data.title}
          </h3>
          {data.message && (
            <p className="text-sm text-slate-500 leading-relaxed">{data.message}</p>
          )}
        </div>

        {/* Reference / amount */}
        {(data.ref || data.amount) && (
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 anim-slide-up anim-delay-200 space-y-2">
            {data.ref && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{data.refLabel ?? "Reference"}</span>
                <span className="text-sm font-mono font-bold text-slate-800">{data.ref}</span>
              </div>
            )}
            {data.amount && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</span>
                <span className="text-base font-black text-emerald-600" style={{ fontFamily: "var(--font-display)" }}>{data.amount}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {data.actions && data.actions.length > 0 && (
          <div className="flex items-center gap-2 w-full anim-slide-up anim-delay-300">
            {data.actions.map((a, i) => (
              <button
                key={i}
                onClick={() => { a.onClick(); if (!isProcessing) onDismiss(); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  a.primary
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Auto-dismiss tap hint */}
        {!isProcessing && !data.actions?.length && (
          <p className="text-[10px] text-slate-400 anim-slide-up anim-delay-500">Tap anywhere to dismiss</p>
        )}
      </div>
    </div>
  );
}
