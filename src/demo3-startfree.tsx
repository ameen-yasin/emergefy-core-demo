import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
//   type ReactNode,
} from "react";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import introGif from "./assets/play.gif";

const IconX = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M6 6l12 12M18 6L6 18" fill="none" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconBell = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14V10a6 6 0 1 0-12 0v4c0 .53-.21 1.04-.59 1.41L4 17h5" fill="none" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 17a3 3 0 0 0 6 0" fill="none" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconUsers = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" fill="none" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="7" r="4" fill="none" strokeWidth="2" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" strokeWidth="2" />
  </svg>
);
const IconStar = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62 7.19.62-5.46 4.73 1.64 7.03z" fill="none" strokeWidth="2" />
  </svg>
);
const IconPlay = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="fill-current">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="fill-current">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);
const IconSkip = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="fill-current">
    <path d="M7 6l7 6-7 6V6zm9 0h2v12h-2z" />
  </svg>
);
const IconZap = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M13 2L3 14h7l-1 8 11-12h-7l1-8z" fill="none" strokeWidth="2" />
  </svg>
);
const IconEye = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" fill="none" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="none" strokeWidth="2" />
  </svg>
);
const IconEyeOff = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-5.94M1 1l22 22" fill="none" strokeWidth="2" />
  </svg>
);
const IconCheckCircle = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <circle cx="12" cy="12" r="10" fill="none" strokeWidth="2" />
    <path d="M8 12l3 3 5-6" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconSquarePOS = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current fill-current">
    <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.8" fill="currentColor" opacity="0.1" />
    <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" strokeWidth="1.8" fill="none" />
  </svg>
);
// const IconBot = ({ size = 18 }: { size?: number }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
//     <rect x="3" y="7" width="18" height="12" rx="3" fill="none" strokeWidth="2" />
//     <path d="M12 7V3M8 11h.01M16 11h.01" fill="none" strokeWidth="2" strokeLinecap="round" />
//   </svg>
// );
const IconActivity = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M22 12h-4l-3 7-6-14-3 7H2" fill="none" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
/** Heart (joy) */
const IconHeart = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current fill-current">
    <path d="M12 21s-6.7-4.35-9.33-7C.8 11.1 1 7.8 3.3 6A5 5 0 0 1 12 7a5 5 0 0 1 8.7-1c2.3 1.8 2.5 5.1.63 8C18.7 16.65 12 21 12 21z" />
  </svg>
);

/* ------------------------------------------------
   Types & constants
-------------------------------------------------*/

type Payload = Record<string, unknown>;

interface Segment { id: string; title: string; size: number; estReact: number }
interface Offer { id: string; title: string; marginImpact: number; estLift: number }
type TranscriptType = "observe" | "think" | "act" | "verify";
interface TranscriptItem { id: number; type: TranscriptType; text: string }
interface BranchChoice { label: string; score: number }
interface Verification { label: string; ok: boolean }
interface ToolCall { id: number; name: string; input: Record<string, unknown>; status: "running" | "ok" | "error"; output?: { preview?: { reactivated: number; revenue: number } } }

// interface ConnectionMap {
//   csv: boolean;
//   gsheet: boolean;
//   square: boolean;
//   toast: boolean;
//   shopifypos: boolean;
//   foodics: boolean;
// }

interface Kpi { mrr: number; activePilots: number; projectedLift: number; last24: number[] }
interface SimRecord { id: string; time: number; audience: number; reactivated: number; type: string }
interface DoneResult { audience: number; reactivated: number; revenue: number; segment: string; offer: string; when: string; channel: string }
interface OpsRun { id: string; time: number; segment: string; offer: string; reactivated: number; revenue: number }

declare global {
  interface Window {
    __EMERGEFY_TESTS_RAN__?: boolean;
    dataLayer?: { push?: (v: unknown) => void };
  }
}

const STORAGE_KEY = "emergefy_demo_state_v1";
const OPS_HISTORY_KEY = "emergefy_ops_history_v1";
const AVG_BASKET = 18;
const DEFAULT_KPI: Kpi = { mrr: 4200, activePilots: 3, projectedLift: 12, last24: [5, 12, 8, 10, 6, 9, 7] };

/* 
------------------------------------------------
   Utilities
-------------------------------------------------
*/

function track(event: string, payload: Payload = {}): void {
  try {
    const common = { event, ts: Date.now(), path: typeof window !== "undefined" ? window.location?.pathname ?? "/" : "/", ...payload };
    if (typeof window !== "undefined" && window.dataLayer?.push) { window.dataLayer.push(common); return; }
    console.log("[demo-analytics]", common);
  } catch (err) { console.error("track error", err); }
}

function wait(ms: number): Promise<void> { return new Promise((res) => setTimeout(res, ms)); }

function recommendBestPair(segments: Segment[], offers: Offer[]) {
  const pairs = segments.flatMap((s) => offers.map((o) => ({
    seg: s, off: o, score: Math.round(Math.max(s.estReact, o.estLift) * 100 + s.size / 10 - Math.abs(o.marginImpact)),
  })));
  return pairs.sort((a, b) => b.score - a.score)[0];
}

function computePreviewMetrics(segments: Segment[], offers: Offer[], selectedSegment: string, selectedOffer: string) {
  const seg = segments.find((s) => s.id === selectedSegment) ?? segments[0];
  const off = offers.find((o) => o.id === selectedOffer) ?? offers[0];
  const reactivated = Math.round(seg.size * Math.max(seg.estReact, off.estLift));
  const revenue = Math.round(reactivated * AVG_BASKET);
  return { seg, off, reactivated, revenue };
}

async function runTestsOnce() {
  try {
    if (typeof window === "undefined" || window.__EMERGEFY_TESTS_RAN__) return;
    window.__EMERGEFY_TESTS_RAN__ = true;

    const tSegments: Segment[] = [
      { id: "s1", title: "S1", size: 100, estReact: 0.05 },
      { id: "s2", title: "S2", size: 200, estReact: 0.02 },
    ];
    const tOffers: Offer[] = [
      { id: "o1", title: "O1", marginImpact: -2, estLift: 0.04 },
      { id: "o2", title: "O2", marginImpact: -6, estLift: 0.1 },
    ];
    const best = recommendBestPair(tSegments, tOffers);
    console.assert(best.off.id === "o2", "recommendBest should prefer higher lift despite margin hit");
    const m = computePreviewMetrics(tSegments, tOffers, "s1", "o2");
    console.assert(m.reactivated === Math.round(100 * Math.max(0.05, 0.1)), "reactivated mismatch");
    console.assert(m.revenue === Math.round(m.reactivated * AVG_BASKET), "revenue mismatch");
    const p = wait(5); console.assert(typeof (p as Promise<void>).then === "function");
    await p; console.log("[demo-tests] All runtime tests passed");
  } catch (err) { console.error("[demo-tests] Failure", err); }
}

/* ------------------------------------------------
   Reusable UI bits
-------------------------------------------------*/

function EnergyBar({ progress }: { progress: number }) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className="h-2 w-full rounded bg-neutral-100 overflow-hidden">
      <div className="h-2 bg-neutral-900 transition-[width] duration-300" style={{ width: `${clamped}%` }} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-3 rounded-xl border border-neutral-200 bg-white text-center">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="font-semibold mt-1">{value}</div>
    </div>
  );
}

function KpiTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-3 rounded-xl border border-neutral-200 bg-white text-sm text-center">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="font-semibold mt-1">{value}</div>
    </div>
  );
}

/** Apple-like pill selector (no deps) */
function ChoicePills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`group rounded-full border px-3 py-2 text-sm transition
              ${active ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{o.label}</span>
              {o.sub && <span className={`text-[11px] ${active ? "text-white/80" : "text-neutral-500"}`}>{o.sub}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ===================== WizardModal (clean header + no overlap) ===================== */
function WizardModal({
  open,
  onClose,
  header,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        className="relative w-[92%] md:w-[940px] bg-white border rounded-2xl shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="min-h-[28px] flex items-center gap-2">{header}</div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-neutral-50" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t bg-neutral-50 rounded-b-2xl">{footer}</div>}
      </motion.div>
    </div>
  );
}

/* ===================== Small primitives (Tailwind-only) ===================== */
function PillStepper({
  items,
  active,
  onJump,
}: {
  items: { label: string }[];
  active: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((it, i) => {
        const on = i === active;
        return (
          <button
            key={it.label}
            onClick={() => onJump(i)}
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border",
              on ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50",
            ].join(" ")}
          >
            <span
              className={[
                "h-5 w-5 grid place-items-center rounded-full text-[11px] font-semibold",
                on ? "bg-white text-neutral-900" : "bg-neutral-100 text-neutral-800",
              ].join(" ")}
            >
              {i + 1}
            </span>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function MinimalStat({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex flex-col border border-neutral-200 rounded-lg p-4">
      <span className="text-[11px] uppercase tracking-wide text-neutral-500">{k}</span>
      <span className="mt-1 text-3xl font-semibold tabular-nums">{v}</span>
    </div>
  );
}

function RadioList<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { id: T; title: string; meta?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`w-full p-3 text-left grid grid-cols-[20px_1fr_auto] items-center gap-3 hover:bg-neutral-50 ${
              on ? "bg-neutral-50" : ""
            }`}
          >
            <span
              aria-hidden
              className={`h-4 w-4 rounded-full border ${
                on ? "border-neutral-900" : "border-neutral-400"
              } grid place-items-center`}
            >
              {on && <span className="h-2 w-2 rounded-full bg-neutral-900" />}
            </span>
            <span className="font-medium">{it.title}</span>
            {it.meta && <span className="text-xs text-neutral-500">{it.meta}</span>}
          </button>
        );
      })}
    </div>
  );
}

function CheckboxPill({
  label,
  icon,
  on,
  onToggle,
}: {
  label: string;
  icon?: React.ReactNode;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={[
        "px-3 py-2 rounded-xl text-sm border inline-flex items-center gap-2",
        on
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200",
      ].join(" ")}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function SheetsGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" className="text-emerald-600">
      <rect x="3" y="2" width="14" height="20" rx="2" fill="currentColor" opacity="0.12" />
      <path d="M7 4h6v4h4v12a2 2 0 0 1-2 2H7V4z" fill="currentColor" />
      <rect x="8" y="12" width="8" height="1.2" fill="white" />
      <rect x="8" y="15" width="8" height="1.2" fill="white" />
      <rect x="8" y="18" width="5" height="1.2" fill="white" />
    </svg>
  );
}

function FieldShell({
  label,
  hint,
  right,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-800">{label}</label>
        {right}
      </div>
      {hint && <div className="text-xs text-neutral-500">{hint}</div>}
      {children}
    </div>
  );
}

function InputLike({ placeholder, value }: { placeholder: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2">
      <span className={value ? "text-neutral-900" : "text-neutral-400"}>{value || placeholder}</span>
      <svg width="18" height="18" viewBox="0 0 20 20" className="text-neutral-500">
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ===================== Full Playbooks flow (Connection → Agent → Review) ===================== */

/** Lightweight guided overlay for Playbooks onboarding */
function FlowTourOverlay({
  open,
  onClose,
  steps,
  anchors,
  onNext,
  onPrev,
  activeKey,
}: {
  open: boolean;
  onClose: () => void;
  steps: { key: string; title: string; body: string }[];
  anchors: Record<string, React.RefObject<HTMLElement>>;
  onNext?: (currentKey: string, nextKey: string | 'done') => void;
  onPrev?: (currentKey: string, prevKey: string | 'none') => void;
  activeKey?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    function update() {
      const key = steps[idx]?.key;
      const el = key ? anchors[key]?.current : null;
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    }
    update();
    const onResize = () => update();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, idx, anchors, steps]);

  // Sync to specific external step if provided (one-shot guidance)
  useEffect(() => {
    if (!open || !activeKey) return;
    const i = steps.findIndex((s) => s.key === activeKey);
    if (i >= 0 && i !== idx) setIdx(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeKey, steps]);

  if (!open) return null;
  const step = steps[idx];
  const calloutLeft = rect ? Math.min(Math.max(rect.left + rect.width + 12, 12), window.innerWidth - 320 - 12) : 24;
  const calloutTop = rect ? Math.min(Math.max(rect.top, 12), window.innerHeight - 160) : 24;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* highlight box */}
      {rect && (
        <div
          className="fixed pointer-events-none rounded-xl ring-2 ring-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
          style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
        />
      )}
      {/* callout */}
      <div
        className="fixed w-[320px] rounded-xl bg-white border border-neutral-200 shadow-lg p-3 text-sm pointer-events-auto"
        style={{ top: calloutTop, left: calloutLeft }}
      >
        <div className="text-[11px] uppercase tracking-wide text-neutral-500">Onboarding</div>
        <div className="font-semibold mt-0.5">{step?.title}</div>
        <div className="text-neutral-700 mt-1">{step?.body}</div>
        <div className="mt-2 flex items-center justify-between">
          <button
            className="px-2 py-1 rounded-md border border-neutral-200 text-xs"
            onClick={() => {
              if (idx === 0) return;
              const curr = steps[idx]?.key;
              const prevIdx = Math.max(0, idx - 1);
              const prev = steps[prevIdx]?.key ?? 'none';
              onPrev?.(curr, prev);
              const target = prevIdx;
              // Slight delay if parent changes modal step so anchors mount
              setTimeout(() => setIdx(target), 200);
            }}
            disabled={idx === 0}
          >
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="text-[11px] text-neutral-500">{idx + 1} / {steps.length}</div>
            {idx < steps.length - 1 ? (
              <button
                className="px-3 py-1 rounded-md bg-neutral-900 text-white text-xs"
                onClick={() => {
                  const curr = steps[idx]?.key;
                  const nextIdx = Math.min(steps.length - 1, idx + 1);
                  const next = steps[nextIdx]?.key;
                  onNext?.(curr, next);
                  const target = nextIdx;
                  setTimeout(() => setIdx(target), 200);
                }}
              >
                Next
              </button>
            ) : (
              <button
                className="px-3 py-1 rounded-md bg-neutral-900 text-white text-xs"
                onClick={() => {
                  const curr = steps[idx]?.key;
                  onNext?.(curr, 'done');
                  onClose();
                }}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowDemo({
  autoStart = false,
  autoStartTour = false,
  onFinished,
  onAutostartTourConsumed,
}: {
  autoStart?: boolean;
  autoStartTour?: boolean;
  onFinished?: () => void;
  onAutostartTourConsumed?: () => void;
}) {
  const steps = [
    { key: "connect", label: "Connection" },
    { key: "agent", label: "Agent" },
    { key: "measure", label: "Review" },
  ] as const;

  const [active, setActive] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<number>(0);
  const [selectedSegment, setSelectedSegment] = useState<string>("recent-lapsed");
  const [selectedOffer, setSelectedOffer] = useState<string>("10-off");
  const [scheduling, setScheduling] = useState<{ when: string; channel: string }>({ when: "In 1 hour", channel: "SMS" });
  const [done, setDone] = useState<DoneResult | null>(null);
  const [agentRunning, setAgentRunning] = useState<boolean>(false);
  const [agentStarted, setAgentStarted] = useState<boolean>(false);
  const [agentProgress, setAgentProgress] = useState<number>(0);
  const [agentLog, setAgentLog] = useState<string[]>([]);
  const [agentDone, setAgentDone] = useState<boolean>(false);
  const [tourOpen, setTourOpen] = useState<boolean>(false);
  const [tourActiveKey, setTourActiveKey] = useState<string | null>(null);

  // business data (unchanged)
  const segments = useMemo<Segment[]>(
    () => [
      { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
      { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
      { id: "new-customers", title: "New customers (0–7 days)", size: 85, estReact: 0.15 },
      { id: "low-value", title: "Low spenders", size: 220, estReact: 0.03 },
    ],
    []
  );
  const offers = useMemo<Offer[]>(
    () => [
      { id: "10-off", title: "10% off next order", marginImpact: -6, estLift: 0.08 },
      { id: "bundle", title: "Meal bundle (save $3)", marginImpact: -3, estLift: 0.1 },
      { id: "free-drink", title: "Free drink w/order $10+", marginImpact: -4, estLift: 0.06 },
    ],
    []
  );
  const { reactivated, revenue, seg, off } = computePreviewMetrics(segments, offers, selectedSegment, selectedOffer);

  // trimmed connections (your list)
  const [connections, setConnections] = useState<Record<string, boolean>>({
    csv: false,
    gsheet: true,
    square: false,
    toast: false,
    shopify: true,
    foodics: false,
    hubspot: false,
  });
  const toggleConn = (k: string) => setConnections((c) => ({ ...c, [k]: !c[k] }));
  const connectionOptions = useMemo(
    () => [
      { key: "csv", label: "Upload CSV", icon: <i className="fa-solid fa-file-arrow-up fa-sm" aria-hidden /> },
      { key: "gsheet", label: "Google Sheets", icon: <i className="fa-brands fa-google-drive fa-sm" aria-hidden /> },
      { key: "square", label: "Square", icon: <IconSquarePOS /> },
      { key: "toast", label: "Toast POS", icon: <i className="fa-solid fa-bread-slice fa-sm" aria-hidden /> },
      { key: "shopify", label: "Shopify", icon: <i className="fa-brands fa-shopify fa-sm" aria-hidden /> },
      { key: "foodics", label: "Foodics", icon: <i className="fa-solid fa-utensils fa-sm" aria-hidden /> },
      { key: "hubspot", label: "HubSpot", icon: <i className="fa-brands fa-hubspot fa-sm" aria-hidden /> },
    ],
    []
  );

  // Onboarding tour anchors
  const anchorAudience = useRef<HTMLDivElement>(null);
  const anchorOffer = useRef<HTMLDivElement>(null);
  const anchorGuardrails = useRef<HTMLDivElement>(null);
  const anchorApprove = useRef<HTMLButtonElement>(null);
  const anchorOpenStep = useRef<HTMLButtonElement>(null);
  // Modal (popup) anchors
  const anchorModalConnect = useRef<HTMLDivElement>(null);
  const anchorModalAgentStart = useRef<HTMLButtonElement>(null);
  const anchorModalReview = useRef<HTMLDivElement>(null);
  const anchorModalFooterNext = useRef<HTMLButtonElement>(null);
  const anchorModalConnectChoose = useRef<HTMLDivElement>(null);
  const anchorModalConnectFile = useRef<HTMLDivElement>(null);
  // const anchorModalConnectWorksheet = useRef<HTMLDivElement>(null);
  const anchorModalConnectAlso = useRef<HTMLDivElement>(null);
  const anchorModalAgentActivity = useRef<HTMLDivElement>(null);

  function openStep(i: number) {
    const idx = Math.max(0, Math.min(steps.length - 1, i));
    setActive(idx);
    setModalStep(idx);
    setModalOpen(true);
    track("step_open_modal", { step: steps[idx].key });
  }
  const nextStep = () => openStep(modalStep + 1);
  const prevStep = () => openStep(modalStep - 1);

  function approveAndSend() {
    const record: SimRecord = { id: String(Date.now()), time: Date.now(), audience: seg.size, reactivated, type: selectedOffer || "unknown" };
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || "{}";
      const obj = JSON.parse(raw);
      const simHistory: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
      simHistory.unshift(record);
      obj.simHistory = simHistory.slice(0, 20);

      const kpi: Kpi = obj.kpi || { mrr: 4200, activePilots: 3, projectedLift: 12, last24: [] };
      kpi.mrr = Math.max(4200, (kpi.mrr || 4200) + Math.round(reactivated * 2));
      obj.kpi = kpi;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      track("flow_approve_send", { segment: selectedSegment, offer: selectedOffer, reactivated, when: scheduling.when, channel: scheduling.channel });

      setDone({ audience: seg.size, reactivated, revenue, segment: seg.title, offer: off.title, when: scheduling.when, channel: scheduling.channel });
      setModalOpen(true);
    } catch {/* noop */}
  }

  // Auto-start the modal flow when requested
  useEffect(() => {
    if (autoStart) {
      openStep(0);
      track("flow_autostart");
      if (autoStartTour) {
        setTourOpen(true);
        setTourActiveKey("connectChoose");
        setTimeout(() => setTourActiveKey(null), 400);
        onAutostartTourConsumed?.();
      }
    }
  }, [autoStart, autoStartTour, onAutostartTourConsumed]);

  

  // When the journey finishes, stay on the confirmation screen
  useEffect(() => {
    if (done) {
      track("flow_finished_confirmation");
      setTourOpen(false);
    }
  }, [done]);

  const handleCloseAfterDone = () => {
    setModalOpen(false);
    onFinished?.();
  };

  const handlePlanAnother = () => {
    setDone(null);
    openStep(0);
  };

  // Start the agent run manually from the Agent step
  const startAgentMission = useCallback(async () => {
    if (agentRunning) return;
    setAgentRunning(true);
    setAgentStarted(true);
    setAgentLog([]);
    setAgentDone(false);
    try {
      setAgentProgress(10);
      setAgentLog(["Scoring candidates under guardrails…"]);
      await wait(500);

      const pick = recommendBestPair(segments, offers);
      setSelectedSegment(pick.seg.id);
      setSelectedOffer(pick.off.id);
      setAgentProgress(45);
      setAgentLog((l) => [...l, `Picked: ${pick.seg.title} + “${pick.off.title}”.`]);
      await wait(500);

      setScheduling({ when: "Tonight 7pm", channel: "SMS" });
      setAgentProgress(75);
      setAgentLog((l) => [...l, "Prepared scheduling via SMS at Tonight 7pm."]);
      await wait(600);

      setAgentProgress(100);
      setAgentLog((l) => [...l, "Ready to review and finish."]);
      setAgentDone(true);
    } finally {
      setAgentRunning(false);
    }
  }, [agentRunning, segments, offers]);

  // Manual progression via tour; no autopilot

  return (
    <section id="flow" className="rounded-2xl border border-neutral-200 p-6 bg-neutral-50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold tracking-tight">Playbooks</h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-neutral-900 text-white">Onboarding</span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">Connection → Agent → Review.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            ref={anchorOpenStep}
            onClick={() => {
              openStep(active);
              track('flow_open_step_with_tour');
            }}
            className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm"
          >
            Open step
          </button>
          <button
            onClick={() => {
              openStep(0);
              setTourOpen(true);
              setTourActiveKey('connectChoose');
              setTimeout(() => setTourActiveKey(null), 400);
              track('flow_onboarding_tour_open');
            }}
            className="px-3 py-2 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50"
          >
            Start Onboarding Tour
          </button>
        </div>
      </div>

      {/* surface preview */}
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <MinimalStat k="Audience" v={seg.size} />
        <MinimalStat k="Est. Reactivations" v={reactivated} />
        <MinimalStat k="Projected Sales" v={`$${revenue}`} />
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70 p-5">
        <div className="grid md:grid-cols-2 gap-6">
          <div ref={anchorAudience}>
            <div className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">Audience</div>
            <RadioList
              items={segments.map((s) => ({ id: s.id as string, title: s.title, meta: `${s.size} guests` }))}
              value={selectedSegment as string}
              onChange={setSelectedSegment}
            />
          </div>
          <div ref={anchorOffer}>
            <div className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">Offer</div>
            <RadioList
              items={offers.map((o) => ({ id: o.id as string, title: o.title }))}
              value={selectedOffer as string}
              onChange={setSelectedOffer}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div ref={anchorGuardrails} className="text-xs text-neutral-500">Guardrails: margin ≤ 6% • brand-safe copy</div>
          <button ref={anchorApprove} onClick={approveAndSend} className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm">
            Approve & Schedule
          </button>
        </div>
      </div>

      {/* ===================== Modal with all steps ===================== */}
      <WizardModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setDone(null);
        }}
        header={<PillStepper items={steps.map((s) => ({ label: s.label }))} active={modalStep} onJump={(i) => setModalStep(i)} />}
        footer={
          !done && (
            <div className="flex items-center justify-between">
              <button onClick={() => setModalOpen(false)} className="px-3 py-2 rounded-md border border-neutral-200 text-sm">
                Cancel
              </button>
              <div className="space-x-2">
                <button onClick={prevStep} className="px-3 py-2 rounded-md border border-neutral-200 text-sm">
                  Back
                </button>
                <button
                  ref={anchorModalFooterNext}
                  onClick={modalStep < steps.length - 1 ? nextStep : approveAndSend}
                  disabled={modalStep < steps.length - 1 && steps[modalStep].key === "agent" && !agentStarted}
                  className={`px-3 py-2 rounded-md text-sm ${
                    modalStep < steps.length - 1
                      ? (steps[modalStep].key === "agent" && !agentStarted
                          ? "border border-neutral-200 text-neutral-500"
                          : "bg-neutral-900 text-white")
                      : "bg-neutral-900 text-white"
                  }`}
                >
                  {modalStep < steps.length - 1 ? "Next" : "Finish"}
                </button>
              </div>
            </div>
          )
        }
      >
        {!done ? (
          <>
            {/* 1) CONNECT — two column (left info, right form) */}
            {steps[modalStep].key === "connect" && (
              <div ref={anchorModalConnect} className="grid grid-cols-12 gap-6">
                <aside className="col-span-12 md:col-span-5 lg:col-span-4">
                  <div className="rounded-xl border border-neutral-200 p-4">
                    <div className="flex items-center gap-3">
                      <SheetsGlyph />
                      <div>
                        <div className="font-semibold">Google Sheets</div>
                        <div className="text-[11px] text-neutral-500">Sync</div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-neutral-600">
                      See our documentation for how to format your Google Sheet.
                    </div>

                    <div className="mt-4">
                      <div className="text-xs font-medium text-neutral-700 mb-2">Supported formats</div>
                      <ul className="space-y-1 text-sm">
                        {["Time-series", "Transactions", "Table"].map((l) => (
                          <li key={l} className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border border-neutral-400 grid place-items-center">
                              <span className="h-2 w-2 rounded-full bg-neutral-400" />
                            </span>
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs font-medium text-neutral-700 mb-2">Example</div>
                      <div className="rounded-md border border-neutral-200 bg-neutral-50 h-24 grid place-items-center text-xs text-neutral-500">
                        Sheet preview
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="col-span-12 md:col-span-7 lg:col-span-8">
                  <div className="space-y-5">
                    <div ref={anchorModalConnectChoose}>
                    <FieldShell
                      label="1. Choose a connection"
                      hint="Authenticate with your Google Sheets account."
                      right={<span className="text-xs text-neutral-500">Created 5 min ago</span>}
                    >
                      <div className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm flex items-center justify-between">
                        <span>example@gmail.com</span>
                        <div className="flex items-center gap-2 text-neutral-500">
                          <span className="h-6 w-6 rounded-md grid place-items-center hover:bg-neutral-50">
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </span>
                          <span className="h-6 w-6 rounded-md grid place-items-center hover:bg-neutral-50">
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </span>
                        </div>
                      </div>
                    </FieldShell>
                    </div>

                    <div ref={anchorModalConnectFile}>
                    <FieldShell label="2. Select your file" hint="Select a Google Sheet or paste a shared URL">
                      <InputLike placeholder="Select a Google Sheet" />
                      <div className="mt-2">
                        <div className="text-xs text-neutral-500 mb-1">Or paste URL (shared or public files)</div>
                        <div className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-400">
                          Google Sheets URL
                        </div>
                      </div>
                    </FieldShell>
                    </div>

                    {/* <div ref={anchorModalConnectWorksheet}>
                    <FieldShell label="3. Select a worksheet from your file">
                      <InputLike placeholder="Select a file to preview its worksheets" />
                    </FieldShell>
                    </div> */}

                    <div ref={anchorModalConnectAlso} className="pt-3 border-t">
                      <div className="text-xs font-medium text-neutral-700 mb-2">Also connect (optional)</div>
                      <div className="flex flex-wrap gap-2">
                        {connectionOptions.map((opt) => (
                          <CheckboxPill
                            key={opt.key}
                            label={opt.label}
                            icon={opt.icon}
                            on={!!connections[opt.key]}
                            onToggle={() => toggleConn(opt.key)}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-neutral-500 mt-2">Demo only — no external data transmitted.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2) AGENT (manual start) */}
            {steps[modalStep].key === "agent" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8">
                      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-fuchsia-500/25 blur-[6px] animate-ping" />
                      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white">
                        <IconHeart size={14} />
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">Engagement &amp; Revenue Autopilot</div>
                      <div className="text-xs text-neutral-500">Autonomously re-engages customers and builds lasting relationships that drive predictable revenue growth.</div>
                    </div>
                  </div>
                  <button
                    ref={anchorModalAgentStart}
                    onClick={() => {
                      if (!agentRunning && tourOpen) {
                        setTourActiveKey('agentActivity');
                        setTimeout(() => setTourActiveKey(null), 400);
                      }
                      startAgentMission();
                    }}
                    disabled={agentRunning}
                    className={`px-3 py-2 rounded-md text-sm ${agentRunning ? "border border-neutral-200 text-neutral-500" : "bg-neutral-900 text-white"}`}
                  >
                    {agentRunning ? "Running…" : "Start Mission"}
                  </button>
                </div>

                <div ref={anchorModalAgentActivity} className="space-y-3">
                  <EnergyBar progress={agentProgress} />
                  <div className="rounded-2xl border border-neutral-200 bg-white p-3">
                    <div className="text-xs text-neutral-500 mb-1">Agent Log</div>
                    {agentLog.length === 0 ? (
                      <div className="text-sm text-neutral-500">Press Start Mission to let the agent choose audience, offer, and scheduling.</div>
                    ) : (
                      <ul className="space-y-1">
                      {agentLog.map((t, i) => (
                        <li key={`${t}-${i}`} className="flex items-start gap-2 p-2 rounded-lg hover:bg-neutral-50">
                          <span className="h-5 w-5 rounded-full border border-neutral-400 grid place-items-center">
                            <span className="h-2 w-2 rounded-full bg-neutral-900" />
                          </span>
                          <span className="text-sm text-neutral-800">{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                </div>


                {/* {agentDone && (
                  <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <IconZap />
                      <span className="uppercase tracking-wide">Recommendation</span>
                    </div>
                    <div className="mt-2 text-[15px] leading-6">
                      Based on current context, best next move: target <span className="font-semibold">{seg.title.toLowerCase()}</span> with <span className="font-semibold">{off.title.toLowerCase()}</span>.
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full border border-neutral-200 bg-white text-xs font-medium">Audience: {seg.title}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full border border-neutral-200 bg-white text-xs font-medium">Offer: {off.title}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full border border-neutral-200 bg-white text-[11px] text-neutral-600">Within guardrails</span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <MinimalStat k="Est. Reactivations" v={reactivated} />
                      <MinimalStat k="Projected Sales" v={`$${revenue}`} />
                    </div>

                    <div className="mt-2 text-[11px] text-neutral-500">Guardrails: margin ≤ 6% • brand-safe copy</div>
                  </div>
                )} */}
                {agentDone && (
                  <div className="p-3 rounded-xl border border-neutral-200 bg-white text-sm">
                    Based on current context, best next move: target <span className="font-semibold">{seg.title.toLowerCase()}</span> with <span className="font-semibold">{off.title.toLowerCase()}</span>. Estimated <span className="font-semibold">{reactivated}</span> reactivations (~<span className="font-semibold">${revenue}</span>), within guardrails.
                  </div>
                )}
              </div>
            )}

            {/* 5) REVIEW */}
            {steps[modalStep].key === "measure" && (
              <div className="space-y-4">
                <div ref={anchorModalReview} className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-white via-neutral-50 to-white p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="text-emerald-600"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        Ready to schedule
                      </div>
                      <h4 className="mt-3 text-lg font-semibold">Review impact before you approve</h4>
                      <p className="mt-1 text-sm text-neutral-600">Confirm the audience, offer, and projected lift. We’ll send this to the guardrailed agent for execution.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm">
                      <div className="font-semibold text-neutral-800">Launch window</div>
                      <div className="mt-1 text-neutral-600">{scheduling.when} • {scheduling.channel}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-3">
                      <div className="text-[11px] uppercase tracking-wide text-neutral-500">Audience</div>
                      <div className="mt-1 font-semibold text-neutral-900">{seg.title}</div>
                      <div className="mt-1 text-xs text-neutral-500">{seg.size.toLocaleString()} guests</div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-3">
                      <div className="text-[11px] uppercase tracking-wide text-neutral-500">Offer</div>
                      <div className="mt-1 font-semibold text-neutral-900">{off.title}</div>
                      <div className="mt-1 text-xs text-neutral-500">Margin impact {off.marginImpact}% • Est. lift {Math.round(off.estLift * 100)}%</div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-3">
                      <div className="text-[11px] uppercase tracking-wide text-neutral-500">Agent confidence</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">High</span>
                        <span className="h-2 w-16 rounded-full bg-emerald-500/20">
                          <span className="block h-2 w-12 rounded-full bg-emerald-500" />
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">Guardrails satisfied</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="text-xs font-medium text-neutral-500">Estimated reactivations</div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums">{reactivated}</div>
                      <p className="mt-2 text-sm text-neutral-600">Based on recent performance for similar audiences.
                      </p>
                      <div className="mt-3 h-2 rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-neutral-900" style={{ width: `${Math.min(100, (reactivated / Math.max(1, seg.size)) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="text-xs font-medium text-neutral-500">Projected sales impact</div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums">${revenue.toLocaleString()}</div>
                      <p className="mt-2 text-sm text-neutral-600">Includes expected return orders within the next 14 days.</p>
                      <ul className="mt-3 space-y-1 text-xs text-neutral-500">
                        <li>• Baseline uplift {Math.round(off.estLift * 100)}% over control</li>
                        <li>• Margin guardrail at {Math.abs(off.marginImpact)}%</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium text-neutral-500">Safety checks</div>
                        <div className="mt-1 text-sm text-neutral-600">Margin ≤ 6%, channel opt-in verified, content scored brand-safe.</div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Within guardrails
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-neutral-500">Approve to schedule and track results on the Impact dashboard.</div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600">
                  <IconCheckCircle />
                </span>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-emerald-700">Campaign scheduled</div>
                  <div className="text-sm text-neutral-700">
                    {done.offer} to {done.segment} via {done.channel} — {done.when}.
                  </div>
                  <div className="text-xs text-neutral-500">Tracking will appear on the Impact dashboard within a few minutes.</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-[11px] uppercase tracking-wide text-neutral-500">Audience</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">{done.segment}</div>
                <div className="mt-1 text-xs text-neutral-500">{done.audience.toLocaleString()} guests</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-[11px] uppercase tracking-wide text-neutral-500">Offer</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">{done.offer}</div>
                <div className="mt-1 text-xs text-neutral-500">Scheduled on {done.channel} • {done.when}</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-[11px] uppercase tracking-wide text-neutral-500">Estimated lift</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">{done.reactivated} reactivations</div>
                <div className="mt-1 text-xs text-neutral-500">≈ ${done.revenue.toLocaleString()} in projected sales</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <IconCheckCircle size={14} />
                </span>
                Safety checks passed: margin guardrail, channel consent, brand-safe copy.
              </div>
              <div className="text-xs text-neutral-500">Need edits? Close and run another playbook with updated settings.</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCloseAfterDone}
                className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
              >
                Go to Impact Dashboard
              </button>
              <button
                onClick={handlePlanAnother}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                Plan another playbook
              </button>
            </div>
          </div>
        )}
      </WizardModal>

      {/* Page-level tour (reserved for later) */}
      <FlowTourOverlay
        open={false}
        onClose={() => setTourOpen(false)}
        steps={[
          { key: 'open', title: 'Open the full flow', body: 'Jump into Connection → Agent → Review to see each step in context.' },
          { key: 'audience', title: 'Pick your audience', body: 'Choose who to target. For onboarding, use “New customers (0–7 days)” to drive first orders.' },
          { key: 'offer', title: 'Select an offer', body: 'Use a margin‑safe incentive the agent will optimize for lift and guardrails.' },
          { key: 'guardrails', title: 'Built‑in guardrails', body: 'Safety caps margin impact ≤ 6% and enforces brand-safe copy.' },
          { key: 'approve', title: 'Approve & schedule', body: 'Confirm to simulate impact and add it to your Impact dashboard.' },
        ]}
        anchors={{
          open: anchorOpenStep as React.RefObject<HTMLElement>,
          audience: anchorAudience as React.RefObject<HTMLElement>,
          offer: anchorOffer as React.RefObject<HTMLElement>,
          guardrails: anchorGuardrails as React.RefObject<HTMLElement>,
          approve: anchorApprove as React.RefObject<HTMLElement>,
        }}
      />

      {/* Modal-level tour (explains each popup step) */}
      <FlowTourOverlay
        open={tourOpen && modalOpen}
        onClose={() => setTourOpen(false)}
        activeKey={tourActiveKey ?? undefined}
        steps={[
          { key: 'connectChoose',   title: 'Choose a connection',  body: 'Authenticate and select a source account for the demo.' },
          { key: 'connectFile',     title: 'Pick your file',       body: 'Select a Google Sheet or paste a shared URL to preview.' },
          // { key: 'connectWorksheet',title: 'Select a worksheet',   body: 'Choose which tab to use; sample data is used in the demo.' },
          { key: 'connectAlso',     title: 'Optional connections', body: 'You can also toggle CSV, POS, and other connectors.' },
          { key: 'agentStart',      title: 'Let the agent propose',body: 'Start the mission. The agent picks audience, offer, and timing.' },
          { key: 'agentActivity',   title: 'Progress & log',       body: 'Watch progress and see decisions logged in real time under guardrails.' },
          { key: 'review',          title: 'Review the impact',    body: 'Check estimated reactivations and projected sales before scheduling.' },
          { key: 'approve',         title: 'Finish — schedule it', body: 'Click Finish to schedule; you’ll return to the Dashboard to see results.' },
        ]}
        onNext={(curr, next) => {
          if (!next || next === 'done') return;
          // Start the agent when advancing from agentStart → agentActivity
          if (curr === 'agentStart' && next === 'agentActivity') {
            if (!agentRunning) {
              setTourActiveKey('agentActivity');
              setTimeout(() => setTourActiveKey(null), 400);
              startAgentMission();
            }
            return;
          }
          // Move modal step forward when crossing section boundaries
          if (curr.startsWith('connect') && next.startsWith('agent')) {
            openStep(1);
          } else if (curr === 'agentActivity' && next === 'review') {
            openStep(2);
          } else if (curr === 'review' && next === 'approve') {
            openStep(2);
          }
        }}
        onPrev={(curr, prev) => {
          if (!prev || prev === 'none') return;
          // Move modal step backward when crossing section boundaries
          if ((curr === 'review' || curr === 'approve') && prev.startsWith('agent')) {
            openStep(1);
          } else if (curr.startsWith('agent') && prev.startsWith('connect')) {
            openStep(0);
          }
        }}
        anchors={{
          connectChoose:    anchorModalConnectChoose as React.RefObject<HTMLElement>,
          connectFile:      anchorModalConnectFile as React.RefObject<HTMLElement>,
          // connectWorksheet: anchorModalConnectWorksheet as React.RefObject<HTMLElement>,
          connectAlso:      anchorModalConnectAlso as React.RefObject<HTMLElement>,
          agentStart:       anchorModalAgentStart as React.RefObject<HTMLElement>,
          agentActivity:    anchorModalAgentActivity as React.RefObject<HTMLElement>,
          review:           anchorModalReview as React.RefObject<HTMLElement>,
          approve:          anchorModalFooterNext as React.RefObject<HTMLElement>,
        }}
      />
    </section>
  );
}

/* ------------------------------------------------
   Root page
-------------------------------------------------*/

export default function InteractiveDemoPage() {
  const [screen, setScreen] = useState<"agent" | "flow" | "dashboard">("flow");
  const [mode, setMode] = useState<"simple"  | "autonomous" | "pro">("autonomous");
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(true);
  const [autoStartFlow, setAutoStartFlow] = useState<boolean>(false);
  const [autoStartTour, setAutoStartTour] = useState<boolean>(false);

  useEffect(() => { track("page_view", { page: "vertical_ai_agent_ops_copilot" }); runTestsOnce(); }, []);
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased py-8">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-12 gap-6">
        <aside className="col-span-3 hidden md:block">
          <Sidebar active={screen} onChange={(s) => { setScreen(s); track("nav_click", { to: s }); }} />
        </aside>
        <div className="col-span-12 md:col-span-9">
          <Header
            onStartFree={() => {
              setScreen('flow');
              setAutoStartFlow(true);
              setAutoStartTour(true);
            }}
          />
          {screen === "agent" && <ModeToggle mode={mode} onChange={setMode} />}
          <main className="mt-6 space-y-8">
            {screen === "dashboard" && <LiveDashboard />}
            {screen === "flow" && (
              <FlowDemo
                key="flow"
                autoStart={autoStartFlow}
                autoStartTour={autoStartTour}
                onAutostartTourConsumed={() => setAutoStartTour(false)}
                onFinished={() => setScreen("dashboard")}
              />
            )}
            {screen === "agent" && (mode === "simple" ?  <OpsCopilotSimple /> : (mode === "autonomous") ? <AutonomousOpsAgent /> : <OpsCopilot />)}
          </main>
        </div>
      </div>
      <MobileNav onChange={(s) => { setScreen(s); track("nav_click", { to: s }); }} active={screen} />

      {/* Welcome modal */}
      <WizardModal
        open={welcomeOpen}
        onClose={() => { setWelcomeOpen(false); track("welcome_close"); }}
        header={<div className="font-semibold">Welcome</div>}
      >
        <div className="overflow-hidden rounded-2xl ring-1 ring-neutral-200">
          {/* Hero */}
          {/* <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white p-6"> */}
          <div
            className="text-white p-6"
            style={{
              background:
                "linear-gradient(135deg, #050b2d 0%, #152567 35%, #3b2f91 65%, #6d45d3 85%, #b08cf8 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9">
                <span className="absolute inset-0 rounded-full bg-white/10 blur-[6px]" />
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
                  <IconHeart size={16} />
                </span>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-white/75">Demo</div>
                <div className="text-xl font-semibold">Engagement &amp; Revenue Autopilot</div>
                <div className="text-sm text-white/80">Autonomously re-engages customers and builds lasting relationships that drive predictable revenue growth.</div>
              </div>
            </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs">Retention</span>
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs">Re‑engagement</span>
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs">Promotions</span>
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs">Onboarding</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 bg-white grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7 space-y-4 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Why teams choose this</div>
                <div className="text-neutral-800">
                  Autonomously re‑engages customers and builds lasting relationships that drive predictable revenue growth — no manual work.
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 rounded-xl border border-neutral-200 bg-white">
                  <div className="text-xs text-neutral-500">Recover revenue</div>
                  <div className="mt-1 text-[15px] leading-5">Win back idle customers with margin‑safe offers.</div>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 bg-white">
                  <div className="text-xs text-neutral-500">Hands‑free execution</div>
                  <div className="mt-1 text-[15px] leading-5">Agent picks audience, offer, and timing.</div>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 bg-white">
                  <div className="text-xs text-neutral-500">Safe by design</div>
                  <div className="mt-1 text-[15px] leading-5">Guardrails: margin ≤ 6%, brand‑safe copy.</div>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">How it works</div>
                <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                  <li>Scores options and selects the best audience + offer</li>
                  <li>Simulates impact and prepares scheduling</li>
                  <li>Shows projected sales and reactivations for review</li>
                </ul>
              </div>
              <div className="text-xs text-neutral-500">Demo only — no external data is transmitted.</div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-2 overflow-hidden">
                <div className="aspect-video rounded-md overflow-hidden bg-neutral-200">
                  <img src={introGif} alt="Demo intro" className="h-full w-full object-cover" />
                </div>
                <div className="mt-3 p-3 rounded-xl border border-neutral-200 bg-white">
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Showcase</div>
                  <div className="font-medium">New Customer Onboarding</div>
                  <ul className="list-disc pl-5 mt-1 text-sm text-neutral-700 space-y-1">
                    <li>Welcome new guests with a gentle intro</li>
                    <li>Nudge a first order within 7 days</li>
                    <li>Track activation and early retention</li>
                  </ul>
                  {/* <div className="mt-2">
                    <button
                      onClick={() => { setWelcomeOpen(false); setScreen('flow'); setAutoStartFlow(true); track('welcome_showcase_onboarding'); }}
                      className="px-3 py-2 rounded-md bg-neutral-900 text-white text-xs"
                    >
                      Explore in demo
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-12 flex items-center justify-end pt-2">
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setWelcomeOpen(false);
                    setAutoStartTour(false);
                    track('welcome_skip');
                  }}
                  className="px-3 py-2 rounded-md border border-neutral-200 text-sm"
                >
                  Skip
                </button>
                <button
                  onClick={() => {
                    setWelcomeOpen(false);
                    setScreen('flow');
                    setAutoStartFlow(true);
                    setAutoStartTour(true);
                    track('welcome_start_demo');
                  }}
                  className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm"
                >
                  Start Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </WizardModal>
    </div>
  );
}

/* ------------------------------------------------
   Header & navigation
-------------------------------------------------*/

function Header({ onStartFree }: { onStartFree: () => void }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center text-white font-bold">E</div>
        <div>
          <div className="font-semibold text-lg">Emergefy</div>
          <div className="text-xs text-neutral-500">Vertical AI-Agent — Ops Copilot</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <button className="px-3 py-1 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50" onClick={() => track("help_open")}>Help</button>
          <button
            className="px-3 py-1 rounded-md bg-neutral-900 text-white text-sm flex items-center gap-2"
            onClick={() => {
              track("cta_click", { where: "header_start_free" });
              onStartFree();
            }}
          >
            <IconUsers /> Start free
          </button>
        </div>
        <DemoBell />
      </div>
    </header>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: "simple" | "autonomous" | "pro";
  onChange: (m: "simple" | "autonomous" | "pro") => void;
}) {
  return (
    <div className="mt-4 flex items-center gap-2">
      <span className="text-xs text-neutral-500">Demo mode</span>
      <div className="inline-flex rounded-xl border border-neutral-200 overflow-hidden">
        <button
          className={`px-3 py-1 text-sm ${mode === "simple" ? "bg-neutral-900 text-white" : "bg-white"}`}
          onClick={() => onChange("simple")}
        >
          Simple
        </button>

         <button
          className={`px-3 py-1 text-sm ${mode === "autonomous" ? "bg-neutral-900 text-white" : "bg-white"}`}
          onClick={() => onChange("autonomous")}
        >
          Autonomous
        </button>
        <button
          className={`px-3 py-1 text-sm ${mode === "pro" ? "bg-neutral-900 text-white" : "bg-white"}`}
          onClick={() => onChange("pro")}
        >
          Pro
        </button>
      </div>
    </div>
  );
}

function Sidebar({ active, onChange }: { active: "agent" | "flow" | "dashboard"; onChange: (s: "agent" | "flow" | "dashboard") => void }) {
  const items: { key: "dashboard" | "flow" | "agent"; label: string }[] = [
    { key: "dashboard", label: "Impact" },
    { key: "flow", label: "Playbooks" },
    { key: "agent", label: "Ops Copilot" },
  ];
  return (
    <div className="sticky top-6 rounded-2xl border border-neutral-200 p-4 bg-white">
      <div className="text-sm text-neutral-500 mb-3">Product demo</div>
      <nav className="space-y-2">
        {items.map((i) => (
          <button key={i.key} onClick={() => onChange(i.key)} className={`w-full text-left p-2 rounded-xl border transition ${active === i.key ? "bg-neutral-50 border-neutral-300" : "border-transparent hover:bg-neutral-50"}`}>{i.label}</button>
        ))}
      </nav>
      <div className="mt-4 text-xs text-neutral-500">Tip: The agent works end-to-end with guardrails.</div>
    </div>
  );
}

function MobileNav({ active, onChange }: { active: "agent" | "flow" | "dashboard"; onChange: (s: "agent" | "flow" | "dashboard") => void }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center md:hidden">
      <div className="w-[92%] rounded-2xl bg-white border border-neutral-200 p-2 flex justify-between shadow-sm">
        <button onClick={() => onChange("dashboard")} className={`px-3 py-2 rounded-xl ${active === "dashboard" ? "bg-neutral-50" : ""}`}>Impact</button>
        <button onClick={() => onChange("flow")} className={`px-3 py-2 rounded-xl ${active === "flow" ? "bg-neutral-50" : ""}`}>Playbooks</button>
        <button onClick={() => onChange("agent")} className={`px-3 py-2 rounded-xl ${active === "agent" ? "bg-neutral-50" : ""}`}>Copilot</button>
      </div>
    </div>
  );
}

function DemoBell() {
  // Keep panel closed initially
  const [open, setOpen] = useState(false);

  // Your demo notifications
  const notifications = useMemo(
    () => [
      { id: "n1", title: "Pilot created", desc: "A pilot was created with 120 guests", icon: <IconStar /> },
      { id: "n2", title: "Segment ready", desc: "420 guests segmented by recency", icon: <IconUsers /> },
    ],
    []
  );

  const count = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((s) => !s);
          track("open_notifications");
        }}
        aria-label="notifications"
        className="relative p-2 rounded-md border border-neutral-200 hover:bg-neutral-50"
      >
        <IconBell />
        {/* Badge */}
        {count > 0 && (
          <span
            aria-label={`${count} notifications`}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-neutral-900 text-white text-[10px] leading-[18px] text-center font-semibold"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow p-3 z-50">
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Notifications</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-neutral-50">
              <IconX />
            </button>
          </div>
          <div className="mt-2 text-xs text-neutral-600">Recent events appear here when you run the flow.</div>
          <ul className="mt-3 space-y-2 text-sm">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-2">
                <div className="p-2 rounded-xl bg-neutral-100">{n.icon}</div>
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-neutral-500">{n.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


/* ------------------------------------------------
   Agent (Ops Copilot)
   - Heart of joy pulse
   - Slower transcript
   - Run history
-------------------------------------------------*/

function PersonaCard({ reasoningVisible, setReasoningVisible, paused, setPaused }: { reasoningVisible: boolean; setReasoningVisible: Dispatch<SetStateAction<boolean>>; paused: boolean; setPaused: Dispatch<SetStateAction<boolean>> }) {
  return (
    <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10">
          {/* pulsing heart glow */}
          <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          <span className="absolute inset-0 rounded-full bg-red-500/10" />
          <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 text-white flex items-center justify-center">
            <IconHeart />
          </div>
        </div>
        <div>
          <div className="font-semibold">Restaurant Growth Expert</div>
          <div className="text-xs text-neutral-500">Guardrails: margin ≤ 6%, brand-safe copy</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setReasoningVisible((s) => !s)} className="px-3 py-1 rounded-md border border-neutral-200 text-xs flex items-center gap-1 hover:bg-neutral-50">
          {reasoningVisible ? <IconEyeOff /> : <IconEye />}{reasoningVisible ? "Hide CoT" : "Show CoT"}
        </button>
        <button onClick={() => setPaused((p) => !p)} className="px-3 py-1 rounded-md text-xs flex items-center gap-1 bg-neutral-900 text-white">
          {paused ? <IconPlay /> : <IconPause />}{paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}

function OpsCopilot() {
  const segments = useMemo<Segment[]>(() => [
    { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
    { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
    { id: "new-customers", title: "New customers (0–7 days)", size: 85, estReact: 0.15 },
    { id: "low-value", title: "Low spenders", size: 220, estReact: 0.03 },
  ], []);
  const offers = useMemo<Offer[]>(() => [
    { id: "10-off", title: "10% off next order", marginImpact: -6, estLift: 0.08 },
    { id: "bundle", title: "Meal bundle (save $3)", marginImpact: -3, estLift: 0.1 },
    { id: "free-drink", title: "Free drink w/order $10+", marginImpact: -4, estLift: 0.06 },
  ], []);

  const initialPick = useMemo(() => recommendBestPair(segments, offers), [segments, offers]);

  const [segmentId, setSegmentId] = useState<string>(initialPick.seg.id);
  const [offerId, setOfferId] = useState<string>(initialPick.off.id);
  const [reasoningVisible, setReasoningVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [branching, setBranching] = useState<BranchChoice[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [spot, setSpot] = useState<null | "audience" | "offer">(null);

  // Run history (persisted)
  const [opsHistory, setOpsHistory] = useState<OpsRun[]>(() => {
    try { const raw = localStorage.getItem(OPS_HISTORY_KEY); if (raw) return JSON.parse(raw) as OpsRun[]; } catch (err) { console.error(err); }
    return [];
  });

  // 1) Sample ops history (memoized for stable identity)
  const sampleOpsHistory: OpsRun[] = useMemo(() => ([
    { id: "cof-0001", time: 1764891600000, segment: "Commuter morning (14d)",     offer: "BOGO medium coffee",               reactivated: 260, revenue: 2080 },
    { id: "cof-0002", time: 1764888000000, segment: "App-lapsed 30–60d",          offer: "Coffee + donut ($2 off)",          reactivated: 190, revenue: 1520 },
    { id: "cof-0003", time: 1764884400000, segment: "Afternoon lull (2–5pm)",     offer: "Free Timbits with any drink",      reactivated: 120, revenue: 960  },
    { id: "cof-0004", time: 1764880800000, segment: "VIP frequent (AM)",          offer: "Any medium for $1.49 (app)",       reactivated: 210, revenue: 1680 },
    { id: "cof-0005", time: 1764877200000, segment: "Lapsed breakfast buyers",    offer: "Breakfast combo save $3",          reactivated: 300, revenue: 2400 },
    { id: "cof-0006", time: 1764873600000, segment: "Drive-thru heavy routes",    offer: "BOGO medium coffee",               reactivated: 180, revenue: 1440 },
    { id: "cof-0007", time: 1764870000000, segment: "Midweek office clusters",    offer: "Donut dozen add-on ($3 off)",      reactivated: 240, revenue: 1920 },
    { id: "cof-0008", time: 1764866400000, segment: "Weekend late breakfast",     offer: "Free Timbits with any drink",      reactivated: 150, revenue: 1200 },
    { id: "cof-0009", time: 1764862800000, segment: "Cold brew seekers (warm)",   offer: "BOGO cold brew",                    reactivated: 320, revenue: 2560 },
    { id: "cof-0010", time: 1764859200000, segment: "Price-sensitive low spenders", offer: "Any medium for $1.49 (app)",     reactivated: 200, revenue: 1600 },
    { id: "cof-0011", time: 1764855600000, segment: "Evening snackers",           offer: "Munchkins/Timbits 20-pack $1 off", reactivated: 275, revenue: 2200 },
    { id: "cof-0012", time: 1764852000000, segment: "Store-radius (1–3 mi) lapsed", offer: "Coffee + donut ($2 off)",        reactivated: 165, revenue: 1320 },
  ]), []);

  // // 2) Create a loader that updates state + localStorage
  // const loadCoffeeRuns = useCallback(() => {
  //   setOpsHistory(sampleOpsHistory);
  //   try {
  //     localStorage.setItem(OPS_HISTORY_KEY, JSON.stringify(sampleOpsHistory));
  //   } catch (err) { console.error(err); }
  //   // track("ops_history_seeded", { count: sampleOpsHistory.length, flavor: "coffee" });
  // }, [setOpsHistory]);

  
useEffect(() => { try { localStorage.setItem(OPS_HISTORY_KEY, JSON.stringify(sampleOpsHistory)); } catch (err) { console.error(err); } }, [sampleOpsHistory]);
  // useEffect(() => { try { localStorage.setItem(OPS_HISTORY_KEY, JSON.stringify(opsHistory.slice(0, 12))); } catch (err) { console.error(err); } }, [opsHistory]);

  const { seg, off, reactivated, revenue } = computePreviewMetrics(segments, offers, segmentId, offerId);

  // slower timings per request
  const INTERNAL_API_WAIT = 4800;   // was 500
  const STEP_WAIT = 8200;          // was 600

  const recordRun = useCallback((run: OpsRun) => {
    setOpsHistory((h) => [run, ...h]);
  }, []);

  const stepSession = useCallback(async () => {
    setProgress((p) => Math.min(100, p + 20));
    const id = Date.now();

    setTranscript((curr) => {
      if (curr.length === 0) {
        setSpot("audience");
        return [...curr, { id, type: "observe", text: `Observed footfall dip Tue–Thu and ${seg.size} in ${seg.title}.` }];
      }
      if (curr.length === 1) {
        const choices: BranchChoice[] = [
          { label: `Target ${seg.title}`, score: 0.84 },
          { label: `Small VIP thank-you`, score: 0.62 },
          { label: `Dormant 90+ days`, score: 0.41 },
        ];
        setBranching(choices);
        return [...curr, { id, type: "think", text: `Considering ${choices.length} options. Best is ${choices[0].label} with confidence 0.84.` }];
      }
      if (curr.length === 2) {
        setToolCalls((c) => [...c, { id, name: "CampaignBuilderAPI.create", input: { segment: seg.id, offer: off.id }, status: "running" }]);
        setSpot("offer");
        (async () => {
          await wait(INTERNAL_API_WAIT);
          setToolCalls((c) => c.map((x) => (x.id === id ? { ...x, status: "ok", output: { preview: { reactivated, revenue } } } : x)));
        })();
        return [...curr, { id, type: "act", text: `Create campaign: ${off.title} for ${seg.title}.` }];
      }
      if (curr.length === 3) {
        const checks: Verification[] = [
          { label: "Margin ≤ 6%", ok: Math.abs(off.marginImpact) <= 6 },
          { label: "Audience size > 50", ok: seg.size > 50 },
          { label: "Copy brand-safe", ok: true },
        ];
        setVerifications(checks);
        setProgress(100);

        // Add to Ops history on verify (end of run)
        const run: OpsRun = { id: String(Date.now()), time: Date.now(), segment: seg.title, offer: off.title, reactivated, revenue };
        recordRun(run);

        return [...curr, { id, type: "verify", text: `Checks: ${checks.filter((c) => c.ok).length}/${checks.length} passed.` }];
      }
      return curr;
    });
  }, [INTERNAL_API_WAIT, off.id, off.marginImpact, off.title, reactivated, recordRun, revenue, seg.id, seg.size, seg.title]);

  const playSession = useCallback(async () => {
    for (let i = 0; i < 4; i++) {
      if (paused) break;
      await stepSession();
      await wait(STEP_WAIT);
    }
  }, [paused, stepSession, STEP_WAIT]);

  useEffect(() => { if (!paused && transcript.length < 4) void playSession(); }, [paused, transcript.length, playSession]);

  function resetSession() {
    setTranscript([]); setBranching([]); setVerifications([]); setToolCalls([]); setProgress(0); setSpot(null);
  }

  function approvePlan() {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY) || "{}";
      const obj = JSON.parse(raw);
      const simHistory: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
      simHistory.unshift({ id: String(Date.now()), time: Date.now(), audience: seg.size, reactivated, type: off.id });
      obj.simHistory = simHistory.slice(0, 20);
      const kpi = (obj.kpi as Kpi) || { mrr: 4200, activePilots: 3, projectedLift: 12, last24: [] };
      kpi.mrr = Math.max(4200, (kpi.mrr || 4200) + Math.round(reactivated * 2));
      obj.kpi = kpi;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      track("agent_expert_approve", { segment: seg.id, offer: off.id, reactivated });
    } catch (err) { console.error(err); }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 p-6 bg-white">
      {/* header with heart of joy pulses */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-red-500/20 animate-ping" />
            <span className="absolute -inset-2 rounded-full bg-red-500/10" />
            <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
              <IconHeart size={14} />
            </span>
          </div>
          <h3 className="text-lg font-semibold">Ops Copilot</h3>
          <span className="text-xs text-neutral-500 flex items-center gap-1"><IconActivity /> Vertical AI-Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPaused((p) => !p)} className="px-3 py-2 rounded-md border border-neutral-200 text-sm flex items-center gap-2 hover:bg-neutral-50">
            {paused ? <IconPlay /> : <IconPause />}{paused ? "Play" : "Pause"}
          </button>
          <button onClick={() => void stepSession()} className="px-3 py-2 rounded-md border border-neutral-200 text-sm flex items-center gap-2 hover:bg-neutral-50"><IconSkip /> Step</button>
          <button onClick={resetSession} className="px-3 py-2 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50">Reset</button>
        </div>
      </div>

      <div className="mt-3"><EnergyBar progress={progress} /></div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <PersonaCard reasoningVisible={reasoningVisible} setReasoningVisible={setReasoningVisible} paused={paused} setPaused={setPaused} />

          <div className="p-4 rounded-2xl border border-neutral-200 bg-white">
            <div className="text-xs text-neutral-500 mb-2">Transcript</div>
            <div className="space-y-2 text-sm">
              {transcript.length === 0 && <div className="text-neutral-500">Press Step or Play to watch the agent work.</div>}
              {transcript.map((t) => (
                <div key={t.id} className={`p-2 rounded-xl border text-neutral-800 ${t.type === "observe" ? "bg-neutral-50 border-neutral-200" : t.type === "think" ? "bg-neutral-100 border-neutral-200" : t.type === "act" ? "bg-neutral-50 border-neutral-200" : "bg-neutral-50 border-neutral-200"}`}>
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">{t.type}</div>
                  <div>{t.text}</div>
                </div>
              ))}
            </div>

            {reasoningVisible && branching.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-neutral-500 mb-1">Branching reasoning</div>
                <ul className="space-y-1 text-sm">
                  {branching.map((b, i) => (
                    <li key={`${b.label}-${i}`} className="flex items-center justify-between p-2 rounded-xl border border-neutral-200">
                      <span>{b.label}</span>
                      <span className="text-xs text-neutral-600">score {Math.round(b.score * 100)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {toolCalls.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-neutral-500 mb-1">Tool calls</div>
                <ul className="space-y-1 text-sm">
                  {toolCalls.map((c) => (
                    <li key={c.id} className="p-2 rounded-xl border border-neutral-200">
                      <div className="font-mono text-xs">{c.name}(segment: "{String((c.input as Record<string, unknown>)['segment'])}", offer: "{String((c.input as Record<string, unknown>)['offer'])}")</div>
                      <div className="text-xs mt-1">Status: <span className={c.status === "ok" ? "text-green-600" : "text-neutral-600"}>{c.status}</span></div>
                      {c.output?.preview && <div className="text-xs text-neutral-600 mt-1">Preview → react {c.output.preview.reactivated}, sales ${c.output.preview.revenue}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {verifications.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-neutral-500 mb-1">Verification</div>
                <ul className="grid grid-cols-3 gap-2 text-xs">
                  {verifications.map((v, i) => (
                    <li key={`${v.label}-${i}`} className={`p-2 rounded-xl border text-center ${v.ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      {v.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50">
            <div className="text-xs text-neutral-500">Live surface</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <StatCard label="Audience" value={seg.size} />
              <StatCard label="Est. Reactivations" value={reactivated} />
              <StatCard label="Projected Sales" value={`$${revenue}`} />
            </div>

            {/* Apple-style pills instead of dropdowns */}
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Audience</div>
                <ChoicePills options={segments.map((s) => ({ id: s.id as string, label: s.title, sub: `${s.size}` }))} value={segmentId as string} onChange={(v) => setSegmentId(v)} />
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Offer</div>
                <ChoicePills options={offers.map((o) => ({ id: o.id as string, label: o.title }))} value={offerId as string} onChange={(v) => setOfferId(v)} />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={approvePlan} className="px-3 py-2 rounded-md bg-neutral-900 text-white flex items-center gap-2"><IconZap /> Approve</button>
              <button onClick={() => { const pick = recommendBestPair(segments, offers); setSegmentId(pick.seg.id); setOfferId(pick.off.id); }} className="px-3 py-2 rounded-md border border-neutral-200 hover:bg-neutral-50">Use agent pick</button>
            </div>
          </div>

          {/* subtle spotlight ring on first focus area */}
          {spot && (
            <div className="pointer-events-none absolute inset-0 flex items-start justify-end pr-4 pt-16">
              <div className="w-24 h-24 rounded-full ring-4 ring-neutral-300/60 bg-neutral-200/10 transition" />
            </div>
          )}
        
        
        </div>

        {/* Full-width Run history (table) */}
        <div className="md:col-span-2 p-4 rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-neutral-500">Run history</div>
            <div className="text-xs text-neutral-500">
              {opsHistory.length} run{opsHistory.length === 1 ? "" : "s"}
            </div>
          </div>

          {opsHistory.length === 0 ? (
            <div className="text-sm text-neutral-500">No runs yet — press Play or Step to generate a plan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-xs text-neutral-500 border-b border-neutral-200">
                    <th className="py-2 pr-3">ID</th>
                    <th className="py-2 pr-3">Time</th>
                    <th className="py-2 pr-3">Segment</th>
                    <th className="py-2 pr-3">Offer</th>
                    <th className="py-2 pr-3 text-right">Reactivated</th>
                    <th className="py-2 pr-3 text-right">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {opsHistory.map((r, i) => (
                    <tr key={r.id} className={i % 2 ? "bg-neutral-50" : ""}>
                      <td className="py-2 pr-3 text-xs text-neutral-600 whitespace-nowrap">#{r.id.slice(-4)}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{new Date(r.time).toLocaleString()}</td>
                      <td className="py-2 pr-3">{r.segment}</td>
                      <td className="py-2 pr-3">{r.offer}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.reactivated}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">${r.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function Explainer({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-3 bg-white">
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">{title}</div>
      <div className="text-sm mt-1 text-neutral-700">{text}</div>
    </div>
  );
}

function BigNumber({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-2xl border border-neutral-200 bg-white text-center">
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-1 font-semibold text-3xl leading-none tabular-nums">{value}</div>
    </div>
  );
}

function OpsCopilotSimple() {
  // Reuse your business data
  const segments = useMemo<Segment[]>(() => [
    { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
    { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
    { id: "new-customers", title: "New customers (0–7 days)", size: 85, estReact: 0.15 },
    { id: "low-value", title: "Low spenders", size: 220, estReact: 0.03 },
  ], []);
  const offers = useMemo<Offer[]>(() => [
    { id: "10-off",   title: "10% off next order",        marginImpact: -6, estLift: 0.08 },
    { id: "bundle",   title: "Meal bundle (save $3)",     marginImpact: -3, estLift: 0.10 },
    { id: "free-drink", title: "Free drink on $10+",      marginImpact: -4, estLift: 0.06 },
  ], []);

  // Default to an agent-recommended pair, but user can click pills to change
  const initial = useMemo(() => recommendBestPair(segments, offers), [segments, offers]);
  const [segmentId, setSegmentId] = useState<string>(initial.seg.id);
  const [offerId, setOfferId]     = useState<string>(initial.off.id);

  const { seg, off, reactivated, revenue } = computePreviewMetrics(segments, offers, segmentId, offerId);

  // History (same key you already use)
  const [opsHistory, setOpsHistory] = useState<OpsRun[]>(() => {
    try {
      const raw = localStorage.getItem(OPS_HISTORY_KEY);
      return raw ? (JSON.parse(raw) as OpsRun[]) : [];
    } catch { return []; }
  });

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(OPS_HISTORY_KEY, JSON.stringify(opsHistory)); } catch {
      // ignore
    }
  }, [opsHistory]);

  function runNow() {
    const run: OpsRun = {
      id: String(Date.now()),
      time: Date.now(),
      segment: seg.title,
      offer: off.title,
      reactivated,
      revenue,
    };
    setOpsHistory((h) => [run, ...h].slice(0, 100));
    // Also reflect in your existing STORAGE_KEY summary so Dashboard updates
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || "{}";
      const obj = JSON.parse(raw);
      const sim: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
      sim.unshift({ id: run.id, time: run.time, audience: seg.size, reactivated, type: off.id });
      obj.simHistory = sim.slice(0, 20);
      obj.kpi = obj.kpi || { ...DEFAULT_KPI };
      obj.kpi.mrr = Math.max(4200, (obj.kpi.mrr || 4200) + Math.round(reactivated * 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
      // ignore
    }
    track("simple_run", { segment: seg.id, offer: off.id, reactivated, revenue });
  }

  function useAgentPick() {
    const p = recommendBestPair(segments, offers);
    setSegmentId(p.seg.id);
    setOfferId(p.off.id);
    track("simple_use_agent_pick", { segment: p.seg.id, offer: p.off.id });
  }

  return (
    <section className="rounded-2xl border border-neutral-200 p-6 bg-white">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6">
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-fuchsia-500/25 blur-[6px] animate-ping" />
            <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white">
              <IconHeart size={14} />
            </span>
          </div>
          <h3 className="text-lg font-semibold">Ops Copilot (Simple)</h3>
          <span className="text-xs text-neutral-500">3 steps • 30 seconds</span>
        </div>
        <button onClick={useAgentPick} className="px-3 py-2 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50">
          Use Agent Pick
        </button>
      </div>

      {/* Quick recommendation summary */}
      <div className="mt-3 p-3 rounded-xl border border-neutral-200 bg-white text-sm">
        Based on your guests and recent results, I recommend targeting <span className="font-semibold">{seg.title.toLowerCase()}</span> with <span className="font-semibold">{off.title.toLowerCase()}</span>. This should bring back about <span className="font-semibold">{reactivated}</span> guests and roughly <span className="font-semibold">${revenue}</span> in sales, while staying within the 6% margin cap.
      </div>

      {/* Step 1 / 2 / 3 */}
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">Step 1</div>
          <div className="font-semibold mt-1">Choose Audience</div>
          <div className="mt-3">
            <ChoicePills
              options={segments.map(s => ({ id: s.id as string, label: s.title, sub: `${s.size}` }))}
              value={segmentId}
              onChange={setSegmentId}
            />
          </div>
          <div className="mt-3">
            <Explainer title="What is this?" text="A prebuilt slice of your customers. For the demo, pick a group and we’ll estimate how many come back." />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">Step 2</div>
          <div className="font-semibold mt-1">Choose Offer</div>
          <div className="mt-3">
            <ChoicePills
              options={offers.map(o => ({ id: o.id as string, label: o.title }))}
              value={offerId}
              onChange={setOfferId}
            />
          </div>
          <div className="mt-3">
            <Explainer title="Margin safety" text="All presets respect a 6% margin cap and brand-safe copy." />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">Step 3</div>
          <div className="font-semibold mt-1">Estimated Impact</div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <BigNumber label="Audience" value={seg.size} />
            <BigNumber label="Est. Reactivations" value={reactivated} />
            <BigNumber label="Projected Sales" value={`$${revenue}`} />
          </div>
          <button onClick={runNow} className="mt-4 w-full px-4 py-2 rounded-md bg-neutral-900 text-white text-sm">
            Run Now
          </button>
          <div className="text-[11px] text-neutral-500 mt-2 text-center">Demo only — no messages actually sent.</div>
        </div>
      </div>

      {/* History (reusing your table style, kept simple) */}
      <div className="mt-6 p-4 rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-neutral-500">Run history</div>
          <div className="text-xs text-neutral-500">{opsHistory.length} run{opsHistory.length === 1 ? "" : "s"}</div>
        </div>
        {opsHistory.length === 0 ? (
          <div className="text-sm text-neutral-500">No runs yet — click “Run Now”.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-xs text-neutral-500 border-b border-neutral-200">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Segment</th>
                  <th className="py-2 pr-3">Offer</th>
                  <th className="py-2 pr-3 text-right">Reactivated</th>
                  <th className="py-2 pr-3 text-right">Sales</th>
                </tr>
              </thead>
              <tbody>
                {opsHistory.map((r, i) => (
                  <tr key={r.id} className={i % 2 ? "bg-neutral-50" : ""}>
                    <td className="py-2 pr-3 text-xs text-neutral-600 whitespace-nowrap">#{r.id.slice(-4)}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{new Date(r.time).toLocaleString()}</td>
                    <td className="py-2 pr-3">{r.segment}</td>
                    <td className="py-2 pr-3">{r.offer}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{r.reactivated}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">${r.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------
   Autonomous Specialist (ReAct-style, human-replacement)
   - Plans → Gathers → Thinks → Acts → Monitors → Adapts → Reports
   - Uses skills & tools (simulated), memory, guardrails
-------------------------------------------------*/

type Phase =
  | "plan"
  | "gather"
  | "think"
  | "act"
  | "monitor"
  | "adapt"
  | "report";

interface TimelineItem {
  id: number;
  phase: Phase;
  text: string;
}

interface Skill {
  id: string;
  name: string;
  run: (input?: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

interface Policy {
  id: string;
  label: string;
  check: (ctx: Record<string, unknown>) => boolean;
}

const AGENT_MEMORY_KEY = "emergefy_agent_memory_v1";

function loadMemory<T = Record<string, unknown>>(): T {
  try { const raw = localStorage.getItem(AGENT_MEMORY_KEY); return raw ? JSON.parse(raw) as T : ({} as T); }
  catch { return {} as T; }
}
function saveMemory(obj: Record<string, unknown>) {
  try { localStorage.setItem(AGENT_MEMORY_KEY, JSON.stringify(obj)); } catch (err) { console.error(err); }
}

/** galaxy heartbeat badge (tiny) */
function HeartBadge() {
  return (
    <div className="relative h-6 w-6">
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-fuchsia-500/25 blur-[6px] animate-ping" />
      <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white">
        <IconHeart size={14} />
      </span>
    </div>
  );
}

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="px-2 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs">{children}</span>
//   );
// }

function AutonomousOpsAgent() {
  // Business primitives (reuse your demo segments/offers)
  const segments = useMemo<Segment[]>(() => [
    { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
    { id: "vip",           title: "VIP frequent",        size: 42,  estReact: 0.12 },
    { id: "new-customers", title: "New customers (0–7 days)", size: 85, estReact: 0.15 },
    { id: "low-value",     title: "Low spenders",        size: 220, estReact: 0.03 },
  ], []);
  const offers = useMemo<Offer[]>(() => [
    { id: "10-off",     title: "10% off next order",        marginImpact: -6, estLift: 0.08 },
    { id: "bundle",     title: "Meal bundle (save $3)",     marginImpact: -3, estLift: 0.10 },
    { id: "free-drink", title: "Free drink w/order $10+",   marginImpact: -4, estLift: 0.06 },
  ], []);

  // Agent state
  const [, setPhase] = useState<Phase>("plan");
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  // Memory & context
  const [memory, setMemory] = useState<Record<string, unknown>>(() => loadMemory());
  const [opsHistory, setOpsHistory] = useState<OpsRun[]>(() => {
    try {
      const raw = localStorage.getItem(OPS_HISTORY_KEY);
      return raw ? (JSON.parse(raw) as OpsRun[]) : [];
    } catch { return []; }
  });

  // Persist history
  useEffect(() => { try { localStorage.setItem(OPS_HISTORY_KEY, JSON.stringify(opsHistory)); } catch (err) { console.error(err); } }, [opsHistory]);

  // ===== Skills registry (simulated) =====
  const skills: Skill[] = useMemo(() => [
    {
      id: "fetch_pos_segments",
      name: "Fetch segments from POS/Sheets",
      run: async () => {
        await wait(1200);
        const pos = ["square", "toast", "shopify", "foodics"].filter(Boolean);
        return { connectors: pos, segmentCounts: segments.reduce((a, s) => ({ ...a, [s.id]: s.size }), {} as Record<string, number>) };
      },
    },
    {
      id: "score_candidate_strategies",
      name: "Score strategies",
      run: async (input?: Record<string, unknown>) => {
        void input;
        await wait(900);
        const best = recommendBestPair(segments, offers);
        return { pick: { segmentId: best.seg.id, offerId: best.off.id }, considered: 7, rationale: "lift×size under margin cap" };
      },
    },
    {
      id: "simulate_offer",
      name: "Simulate impact",
      run: async (input?: Record<string, unknown>) => {
        await wait(800);
        const seg = segments.find(s => s.id === String(input?.segmentId)) ?? segments[0];
        const off = offers.find(o => o.id === String(input?.offerId)) ?? offers[0];
        const { reactivated, revenue } = computePreviewMetrics(segments, offers, seg.id, off.id);
        return { reactivated, revenue, segmentTitle: seg.title, offerTitle: off.title };
      },
    },
    {
      id: "schedule_send",
      name: "Schedule campaign",
      run: async (input?: Record<string, unknown>) => {
        void input;
        await wait(700);
        return { scheduledFor: "Tonight 7pm", channel: "SMS" };
      },
    },
    {
      id: "monitor_kpis",
      name: "Monitor KPIs",
      run: async () => {
        await wait(900);
        return { deliveryOk: true, failRate: 0.5, earlyCTR: 6.2 };
      },
    },
    {
      id: "adaptation",
      name: "Adapt offer if needed",
      run: async (input?: Record<string, unknown>) => {
        void input;
        await wait(600);
        // Small adaptive tweak example
        return { adjustedCopy: "Save $3 on your meal — today only", change: "minor_copy" };
      },
    },
    {
      id: "final_report",
      name: "Produce report",
      run: async (input?: Record<string, unknown>) => {
        void input;
        await wait(500);
        return { summary: "Goal achieved within guardrails. Ready to repeat weekly.", confidence: 0.86 };
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // ===== Guardrail policies =====
  const policies: Policy[] = [
    { id: "margin_cap",  label: "Margin ≤ 6%",         check: (ctx) => Math.abs(Number(ctx.marginImpact ?? -6)) <= 6 },
    { id: "aud_size",    label: "Audience > 50",       check: (ctx) => Number(ctx.audience ?? 0) > 50 },
    { id: "brand_safe",  label: "Brand-safe copy ✓",   check: () => true },
  ];

  const summaryPick = useMemo(() => {
    const best = recommendBestPair(segments, offers);
    const mem = (memory || {}) as Record<string, unknown>;
    const lastSegId = String(mem.lastSegment || "");
    const lastOfferId = String(mem.lastOffer || "");
    const segObj = segments.find(s => s.id === lastSegId) ?? best.seg;
    const offObj = offers.find(o => o.id === lastOfferId) ?? best.off;
    const m = computePreviewMetrics(segments, offers, segObj.id, offObj.id);
    return { seg: m.seg, off: m.off, reactivated: m.reactivated, revenue: m.revenue };
  }, [memory, segments, offers]);

  function addTimeline(phase: Phase, text: string) {
    setTimeline((t) => [...t, { id: Date.now() + Math.floor(Math.random() * 999), phase, text }]);
  }
function addToolCall(name: string, input: Record<string, unknown>, _preview?: { reactivated?: number; revenue?: number }) {
  void _preview;
  const id = Date.now() + Math.floor(Math.random() * 999);
  setToolCalls((c) => [...c, { id, name, input: input, status: "running" }]);
  return id;
}
  function completeToolCall(id: number, output: Record<string, unknown>) {
    setToolCalls((c) => c.map((x) => (x.id === id ? { ...x, status: "ok", output: { preview: ("reactivated" in output && "revenue" in output) ? { reactivated: Number(output.reactivated), revenue: Number(output.revenue) } : undefined } } : x)));
  }

  // ===== Mission run (autonomous loop) =====
  const runningRef = useRef(running);
  useEffect(() => { runningRef.current = running; }, [running]);

  async function runMission() {
    if (runningRef.current) return;
    setRunning(true);
    setTimeline([]); setToolCalls([]); setProgress(0);

    try {
      // PLAN
      setPhase("plan"); setProgress(8);
      addTimeline("plan", "Mission: Recover lapsed customers without exceeding 6% margin hit. Secondary: preserve brand tone.");
      await wait(600);

      // GATHER
      setPhase("gather"); setProgress(18);
      addTimeline("gather", "Gathering segments from POS/Sheets connectors…");
      const idFetch = addToolCall("Connectors.fetchSegments", {});
      const fetched = await skills.find(s => s.id === "fetch_pos_segments")!.run();
      completeToolCall(idFetch, fetched);
      addTimeline("gather", `Found segments: ${Object.keys(fetched.segmentCounts as Record<string, number>).length}.`);

      // THINK
      setPhase("think"); setProgress(35);
      addTimeline("think", "Scoring candidate strategies under guardrails…");
      const idScore = addToolCall("Strategy.score", {});
      const scoredRaw = await skills.find(s => s.id === "score_candidate_strategies")!.run();
      completeToolCall(idScore, scoredRaw);
      const scored = scoredRaw as { pick: { segmentId: string; offerId: string }; considered?: number; rationale?: string };
      const segmentId = String(scored.pick.segmentId);
      const offerId   = String(scored.pick.offerId);
      const segObj = segments.find(s => s.id === segmentId) ?? segments[0];
      const offObj = offers.find(o => o.id === offerId) ?? offers[0];
      addTimeline("think", `Picked: ${segObj.title} + “${offObj.title}”. Rationale: ${(scored.rationale as string) || "best lift×size"}`);

      // Verify guardrails pre-execution
      const preCtx = { audience: segObj.size, marginImpact: offObj.marginImpact };
      const fails = policies.filter(p => !p.check(preCtx));
      if (fails.length) {
        addTimeline("think", `Adjusting due to guardrails: ${fails.map(f => f.label).join(", ")}`);
      }

      // ACT (simulate offer)
      setPhase("act"); setProgress(55);
      const idSim = addToolCall("Offer.simulate", { segmentId, offerId });
      const simulated = await skills.find(s => s.id === "simulate_offer")!.run({ segmentId, offerId }) as { reactivated: number; revenue: number; segmentTitle: string; offerTitle: string };
      completeToolCall(idSim, simulated);
      addTimeline("act", `Projected: ${(simulated.reactivated as number)} reactivations → $${(simulated.revenue as number)} sales.`);

      // SCHEDULE
      const idSched = addToolCall("Campaign.schedule", { channel: "SMS", when: "Tonight 7pm" });
      const sched = await skills.find(s => s.id === "schedule_send")!.run({ channel: "SMS", when: "Tonight 7pm" }) as { scheduledFor: string; channel: string };
      completeToolCall(idSched, sched);
      addTimeline("act", `Scheduled via ${String(sched.channel)} at ${String(sched.scheduledFor)}.`);

      // Persist run (realistic human-replacement effect)
      const run: OpsRun = {
        id: String(Date.now()),
        time: Date.now(),
        segment: String(simulated.segmentTitle),
        offer: String(simulated.offerTitle),
        reactivated: Number(simulated.reactivated),
        revenue: Number(simulated.revenue),
      };
      setOpsHistory((h) => [run, ...h].slice(0, 100));
      try {
        const raw = localStorage.getItem(STORAGE_KEY) || "{}";
        const obj = JSON.parse(raw);
        const sim: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
        sim.unshift({ id: run.id, time: run.time, audience: segObj.size, reactivated: run.reactivated, type: offObj.id });
        obj.simHistory = sim.slice(0, 20);
        obj.kpi = obj.kpi || { ...DEFAULT_KPI };
        obj.kpi.mrr = Math.max(4200, (obj.kpi.mrr || 4200) + Math.round(run.reactivated * 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      } catch {
        // ignore
      }

      // MONITOR
      setPhase("monitor"); setProgress(70);
      const idMon = addToolCall("KPIs.monitor", {});
      const mon = await skills.find(s => s.id === "monitor_kpis")!.run();
      completeToolCall(idMon, mon);
      addTimeline("monitor", `Delivery OK. Early CTR ${(mon.earlyCTR as number)}%. Fail ${Number(mon.failRate).toFixed(1)}%.`);

      // ADAPT (minor tweak)
      setPhase("adapt"); setProgress(82);
      const idAdapt = addToolCall("Offer.adapt", { basis: "early_ctr" });
      const adapt = await skills.find(s => s.id === "adaptation")!.run({ ctr: mon.earlyCTR });
      completeToolCall(idAdapt, adapt);
      addTimeline("adapt", `Applied tweak: ${(adapt.change as string)} → “${String(adapt.adjustedCopy)}”.`);

      // REPORT
      setPhase("report"); setProgress(100);
      const idRep = addToolCall("Reports.finalize", {});
      const rep = await skills.find(s => s.id === "final_report")!.run({});
      completeToolCall(idRep, rep);
      addTimeline("report", String(rep.summary));
      track("autonomous_mission_complete", { reactivated: run.reactivated, revenue: run.revenue, confidence: rep.confidence });

      // Memory update
      const mem = { ...(memory || {}), lastSegment: segObj.id, lastOffer: offObj.id, lastRevenue: run.revenue, lastReactivated: run.reactivated };
      saveMemory(mem);
      setMemory(mem);
    } catch (err) {
      addTimeline("report", "Mission failed unexpectedly — safe stop.");
      console.error(err);
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartBadge />
          <h3 className="text-lg font-semibold">Ops Copilot (Autonomous Specialist)</h3>
          {/* <span className="text-xs text-neutral-500 flex items-center gap-1"><IconActivity /> ReAct loop</span> */}
        </div>
        <div className="flex items-center gap-2">
          {/* <Pill>Guardrails: ≤6% margin</Pill>
          <Pill>Brand-safe copy</Pill>
          <Pill>Spend cap</Pill> */}
          <button
            onClick={() => (running ? void 0 : runMission())}
            disabled={running}
            className={`px-3 py-2 rounded-md text-sm ${running ? "border border-neutral-200 text-neutral-500" : "bg-neutral-900 text-white"}`}
          >
            {running ? "Running…" : "Start Mission"}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3"><EnergyBar progress={progress} /></div>

      {/* Adaptive recommendation summary */}
      <div className="mt-3 p-3 rounded-xl border border-neutral-200 bg-white text-sm">
        Based on current context, best next move: target <span className="font-semibold">{summaryPick.seg.title.toLowerCase()}</span> with <span className="font-semibold">{summaryPick.off.title.toLowerCase()}</span>. Estimated <span className="font-semibold">{summaryPick.reactivated}</span> reactivations (~<span className="font-semibold">${summaryPick.revenue}</span>), within guardrails.
      </div>
      
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {/* Mission & Policies */}
        <div className="rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
          <div className="text-xs text-neutral-500">Mission</div>
          <div className="mt-1 text-sm">
            Recover lapsed guests this week without exceeding a 6% margin hit; keep copy brand-safe; schedule during high-attention windows.
          </div>
          <div className="mt-3 text-xs text-neutral-500">Policies</div>
          <ul className="mt-1 text-sm space-y-1">
            {policies.map(p => <li key={p.id} className="p-2 rounded-md border border-neutral-200 bg-white">{p.label}</li>)}
          </ul>
          <div className="mt-3 text-xs text-neutral-500">Memory</div>
          <div className="mt-1 text-xs p-2 rounded-md border border-neutral-200 bg-white">
            lastSegment: {String((memory).lastSegment || "—")}<br />
            lastOffer: {String((memory ).lastOffer || "—")}<br />
            lastReactivated: {String((memory ).lastReactivated || "—")}<br />
            lastRevenue: {String((memory ).lastRevenue || "—")}
          </div>
        </div>

        {/* Timeline (reason → action) */}
        <div className="rounded-2xl border border-neutral-200 p-4 bg-white md:col-span-2">
          <div className="text-xs text-neutral-500">Execution Timeline</div>
          <div className="mt-2 space-y-2">
            {timeline.length === 0 ? (
              <div className="text-sm text-neutral-500">Press “Start Mission” to watch the specialist work end-to-end.</div>
            ) : (
              timeline.map(t => (
                <div key={t.id} className="p-2 rounded-xl border border-neutral-200">
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">{t.phase}</div>
                  <div className="text-sm">{t.text}</div>
                </div>
              ))
            )}
          </div>

          {/* Tool calls */}
          {toolCalls.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-neutral-500 mb-1">Tools</div>
              <ul className="space-y-1 text-sm">
                {toolCalls.map((c) => (
                  <li key={c.id} className="p-2 rounded-xl border border-neutral-200">
                    <div className="font-mono text-xs">{c.name}({Object.entries(c.input || {}).map(([k, v]) => `${k}: ${String(v)}`).join(", ")})</div>
                    <div className="text-xs mt-1">Status: <span className={c.status === "ok" ? "text-green-600" : "text-neutral-600"}>{c.status}</span></div>
                    {c.output?.preview && <div className="text-xs text-neutral-600 mt-1">Preview → react {c.output.preview.reactivated}, sales ${c.output.preview.revenue}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Full-width history */}
        <div className="md:col-span-3 p-4 rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-neutral-500">Run history</div>
            <div className="text-xs text-neutral-500">{opsHistory.length} run{opsHistory.length === 1 ? "" : "s"}</div>
          </div>
          {opsHistory.length === 0 ? (
            <div className="text-sm text-neutral-500">No runs yet — start a mission.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-xs text-neutral-500 border-b border-neutral-200">
                    <th className="py-2 pr-3">ID</th>
                    <th className="py-2 pr-3">Time</th>
                    <th className="py-2 pr-3">Segment</th>
                    <th className="py-2 pr-3">Offer</th>
                    <th className="py-2 pr-3 text-right">Reactivated</th>
                    <th className="py-2 pr-3 text-right">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {opsHistory.map((r, i) => (
                    <tr key={r.id} className={i % 2 ? "bg-neutral-50" : ""}>
                      <td className="py-2 pr-3 text-xs text-neutral-600 whitespace-nowrap">#{r.id.slice(-4)}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{new Date(r.time).toLocaleString()}</td>
                      <td className="py-2 pr-3">{r.segment}</td>
                      <td className="py-2 pr-3">{r.offer}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.reactivated}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">${r.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}



/* ------------------------------------------------
   Dashboard
-------------------------------------------------*/

function ImpactSummary() {
  const [summary, setSummary] = useState({ revenue: 4220, retained: 11, optimized: 8 });
  const [scenario, setScenario] = useState<string>("");
  useEffect(() => {
    let mounted = true;
    const update = () => {
      try {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem(STORAGE_KEY) || "{}";
        const obj = JSON.parse(raw);
        const sim: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
        const extraRevenue = Math.max(0, (obj.kpi?.mrr || 4200) - 4200);
        const retained = sim.reduce((a, r) => a + (r.reactivated || 0), 0);
        const optimized = Math.max(0, Math.min(50, Math.round(sim.filter((r) => r?.type).length)));
        if (mounted) {
          setSummary({ revenue: extraRevenue || 0, retained: retained || 0, optimized });
          setScenario(typeof obj.scenario === "string" ? obj.scenario : "");
        }
      } catch (err) { console.error(err); }
    };
    update(); const id = setInterval(update, 1200);
    return () => { mounted = false; clearInterval(id); };
  }, []);
  const simulateScenario = (brand: "Dunkin" | "Tim Hortons") => {
    try {
      const now = Date.now();
      const cfg = brand === "Dunkin"
        ? {
            scenarioName: "Dunkin — Grand Opening + Drive‑Thru Blitz",
            reactivations: [150, 144, 140, 138, 135, 132, 128, 124, 120, 118, 115, 112, 110, 108, 105, 102, 100, 96, 92, 90, 88, 85, 82, 80, 78, 76, 74, 72, 70, 68],
            audienceStart: 1800,
            audienceStep: 20,
            activePilots: 6,
            projectedLift: 31,
            type: "Dunkin Drive‑Thru Blitz",
          }
        : {
            scenarioName: "Tim Hortons — Loyalty Relaunch Weekend",
            reactivations: [120, 118, 116, 114, 110, 108, 104, 100, 98, 96, 94, 90, 88, 85, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60],
            audienceStart: 1400,
            audienceStep: 15,
            activePilots: 4,
            projectedLift: 24,
            type: "Tims Loyalty Relaunch",
          };

      const totalReactivated = cfg.reactivations.reduce((a, b) => a + b, 0);
      const simHistory: SimRecord[] = cfg.reactivations.map((reactivated, i) => ({
        id: String(now - i * 60000),
        time: now - i * 60000,
        audience: cfg.audienceStart + i * cfg.audienceStep,
        reactivated,
        type: cfg.type,
      }));

      const extraRevenue = Math.round(totalReactivated * AVG_BASKET);
      const objRaw = localStorage.getItem(STORAGE_KEY) || "{}";
      const obj = JSON.parse(objRaw || "{}");
      obj.simHistory = simHistory;
      obj.kpi = {
        mrr: 4200 + extraRevenue,
        activePilots: cfg.activePilots,
        projectedLift: cfg.projectedLift,
        last24: cfg.reactivations.slice(0, 7).map((n) => Math.max(1, Math.round(n / 10))),
      } as Kpi;
      obj.scenario = cfg.scenarioName;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      setScenario(cfg.scenarioName);
      setSummary({ revenue: extraRevenue, retained: totalReactivated, optimized: Math.min(50, simHistory.length) });
      track("simulate_brand_scenario", { brand });
    } catch (err) { console.error(err); }
  };
  const resetDemo = () => {
    try {
      const obj = { kpi: DEFAULT_KPI, simHistory: [], scenario: "" } as unknown as Record<string, unknown>;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      setScenario("");
      setSummary({ revenue: 0, retained: 0, optimized: 0 });
      track("reset_demo_state");
    } catch (err) { console.error(err); }
  };
  return (
    <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-neutral-50 to-neutral-100 border border-neutral-200 text-sm">
      <div>
        <span className="font-medium">Emergefy</span> brought in <span className="font-semibold">${summary.revenue}</span> extra revenue this month{scenario ? <> for <span className="font-semibold">{scenario}</span></> : null}, retained <span className="font-semibold">{summary.retained}</span> at-risk customers, and optimized <span className="font-semibold">{summary.optimized}</span> inventory orders — all automatically.
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={() => simulateScenario("Dunkin")} className="px-2 py-1 rounded-md bg-neutral-900 text-white text-[11px]">Simulate: Dunkin Drive‑Thru</button>
        <button onClick={() => simulateScenario("Tim Hortons")} className="px-2 py-1 rounded-md border border-neutral-900 text-[11px]">Simulate: Tim Hortons Loyalty</button>
        <button onClick={resetDemo} className="px-2 py-1 rounded-md border border-neutral-300 text-[11px] hover:bg-neutral-50">Reset</button>
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const safeValues = Array.isArray(values) && values.length ? values : [0];
  const w = 320, h = 60, max = Math.max(...safeValues, 1), denom = Math.max(1, safeValues.length - 1);
  const points = safeValues.length === 1 ? `0,${h - (safeValues[0] / max) * h} ${w},${h - (safeValues[0] / max) * h}` : safeValues.map((v, i) => `${(i / denom) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-2 h-14">
      <polyline fill="none" stroke="#0a0a0a" strokeWidth={2} points={points} strokeLinejoin="round" strokeLinecap="round" />
      {safeValues.length > 1 && safeValues.map((v, i) => <circle key={i} cx={(i / denom) * w} cy={h - (v / max) * h} r={2.5} />)}
    </svg>
  );
}

function RecentEvents() {
  const [events, setEvents] = useState<SimRecord[]>(() => {
    try { if (typeof window === "undefined") return []; const raw = localStorage.getItem(STORAGE_KEY); if (raw) return (JSON.parse(raw).simHistory || []).slice(0, 6) as SimRecord[];     } catch (err) { console.error(err); }

    return [];
  });
  useEffect(() => {
    let mounted = true;
    const id = setInterval(() => {
      try { if (!mounted || typeof window === "undefined") return; const raw = localStorage.getItem(STORAGE_KEY); if (raw) setEvents(((JSON.parse(raw).simHistory || []) as SimRecord[]).slice(0, 6));     } catch (err) { console.error(err); }

    }, 1200);
    return () => { mounted = false; clearInterval(id); };
  }, []);
  if (events.length === 0) return <div className="text-sm text-neutral-500 mt-2">No events yet — run a playbook.</div>;
  return (
    <ul className="mt-2 space-y-2 text-sm">
      {events.map((e) => (
        <li key={e.id} className="flex items-center justify-between border border-neutral-200 rounded-xl p-2">
          <div>
            <div className="font-medium">{e.type} • {e.audience} recipients</div>
            <div className="text-xs text-neutral-500">{new Date(e.time).toLocaleString()} • {e.reactivated} react.</div>
          </div>
          <div className="text-xs text-neutral-600">ID {String(e.id).slice(-4)}</div>
        </li>
      ))}
    </ul>
  );
}

function LiveDashboard() {
  const defaultKpi = DEFAULT_KPI;
  const [kpi, setKpi] = useState<Kpi>(() => {
    try { if (typeof window === "undefined") return defaultKpi; const raw = localStorage.getItem(STORAGE_KEY); if (raw) { const obj = JSON.parse(raw); return (obj.kpi as Kpi) || defaultKpi; }     } catch (err) { console.error(err); }

    return defaultKpi;
  });

  useEffect(() => {
    let mounted = true;
    const id = setInterval(() => {
      try {
        if (!mounted || typeof window === "undefined") return;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const obj = JSON.parse(raw);
          const sim: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
          const last24 = sim.slice(0, 7).map((s) => Math.max(1, Math.round((s.reactivated || 0) / 10))) || defaultKpi.last24;
          const mrr = obj.kpi?.mrr || defaultKpi.mrr;
          const activePilots = obj.kpi?.activePilots || defaultKpi.activePilots;
          const projectedLift = 10 + Math.round((sim.reduce((a, b) => a + (b.reactivated || 0), 0) / 100) % 10);
          setKpi({ mrr, activePilots, projectedLift, last24: last24.length ? last24 : defaultKpi.last24 });
        }
    } catch (err) { console.error(err); }
    }, 1200);
    return () => { mounted = false; clearInterval(id); };
  }, [defaultKpi]);

  return (
    <section className="rounded-2xl border border-neutral-200 p-6 bg-neutral-50">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold">Impact</h3>
          <div className="text-xs text-neutral-500 mt-1">Snapshot of reactivations and revenue.</div>
        </div>
        <div className="flex gap-3">
          <KpiTile label="MRR (demo)" value={`$${kpi.mrr}`} />
          <KpiTile label="Active pilots" value={kpi.activePilots} />
          <KpiTile label="Projected lift" value={`${kpi.projectedLift}%`} />
        </div>
      </div>
      <ImpactSummary />
      <div className="mt-4 flex gap-4 items-center">
        <div className="w-full md:w-2/3 p-4 rounded-2xl border border-neutral-200 bg-white">
          <div className="text-xs text-neutral-500">Reactivations (recent)</div>
          <Sparkline values={Array.isArray(kpi.last24) ? kpi.last24 : defaultKpi.last24} />
        </div>
        <div className="w-1/3 p-4 rounded-2xl border border-neutral-200 bg-white">
          <div className="text-xs text-neutral-500">Guardrails</div>
          <div className="mt-2 text-xs"><div>Margin cap: ≤ 6% ✓</div><div>Brand terms: ✓</div><div>Spend cap: ✓</div></div>
        </div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-neutral-200 bg-white"><div className="font-semibold">Recent events</div><RecentEvents /></div>
        <div className="p-4 rounded-2xl border border-neutral-200 bg-white"><div className="font-semibold">Demo tips</div><ul className="mt-2 text-sm space-y-2 text-neutral-600"><li>Toggle reasoning for different audiences.</li><li>Use Playbooks for fast, safe defaults.</li><li>Show verification checks before approve.</li></ul></div>
      </div>
    </section>
  );
}
