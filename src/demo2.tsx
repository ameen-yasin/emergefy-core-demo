import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
//   type ChangeEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------
   Minimal inline icons (Tailwind-only, no deps)
-------------------------------------------------*/

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
const IconBot = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <rect x="3" y="7" width="18" height="12" rx="3" fill="none" strokeWidth="2" />
    <path d="M12 7V3M8 11h.01M16 11h.01" fill="none" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconActivity = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="stroke-current">
    <path d="M22 12h-4l-3 7-6-14-3 7H2" fill="none" strokeWidth="2" strokeLinecap="round" />
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
interface ToolCall { id: number; name: string; input: { segment: string; offer: string }; status: "running" | "ok" | "error"; output?: { preview?: { reactivated: number; revenue: number } } }

interface ConnectionMap {
  csv: boolean;
  gsheet: boolean;
  square: boolean;
  toast: boolean;
  shopifypos: boolean;
  foodics: boolean;
}

interface Kpi { mrr: number; activePilots: number; projectedLift: number; last24: number[] }
interface SimRecord { id: string; time: number; audience: number; reactivated: number; type: string }
interface DoneResult { audience: number; reactivated: number; revenue: number; segment: string; offer: string; when: string; channel: string }

declare global {
  interface Window {
    __EMERGEFY_TESTS_RAN__?: boolean;
    dataLayer?: { push?: (v: unknown) => void };
  }
}

const STORAGE_KEY = "emergefy_demo_state_v1";
const AVG_BASKET = 18;
const DEFAULT_KPI: Kpi = { mrr: 4200, activePilots: 3, projectedLift: 12, last24: [5, 12, 8, 10, 6, 9, 7] };

/* ------------------------------------------------
   Utilities
-------------------------------------------------*/

function track(event: string, payload: Payload = {}): void {
  try {
    const common = {
      event,
      ts: Date.now(),
      path: typeof window !== "undefined" ? window.location?.pathname ?? "/" : "/",
      ...payload,
    };
    if (typeof window !== "undefined" && window.dataLayer?.push) {
      window.dataLayer.push(common);
      return;
    }
    // eslint-disable-next-line no-console
    console.log("[demo-analytics]", common);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("track error", err);
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

function recommendBestPair(segments: Segment[], offers: Offer[]) {
  const pairs = segments.flatMap((s) =>
    offers.map((o) => ({
      seg: s,
      off: o,
      score: Math.round(Math.max(s.estReact, o.estLift) * 100 + s.size / 10 - Math.abs(o.marginImpact)),
    }))
  );
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
    if (typeof window === "undefined") return;
    if (window.__EMERGEFY_TESTS_RAN__) return;
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

    const p = wait(5);
    console.assert(typeof (p as Promise<void>).then === "function", "wait should return a promise");
    await p;
    // eslint-disable-next-line no-console
    console.log("[demo-tests] All runtime tests passed");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[demo-tests] Failure", err);
  }
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
              {o.sub && (
                <span className={`text-[11px] ${active ? "text-white/80" : "text-neutral-500"}`}>{o.sub}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Clean modal (no overlap, Tailwind-only) */
function WizardModal({
  open,
  onClose,
  stepText,
  children,
}: {
  open: boolean;
  onClose: () => void;
  stepText?: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) panelRef.current.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="relative w-[92%] md:w-[720px] bg-white border border-neutral-200 rounded-2xl shadow-xl outline-none transform transition-all"
        tabIndex={-1}
      >
        {/* Header fixes the step/X overlap */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 rounded-t-2xl bg-white/80 backdrop-blur">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">{stepText}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50"
          >
            <IconX />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------
   Root page
-------------------------------------------------*/

export default function InteractiveDemoPage() {
  const [screen, setScreen] = useState<"agent" | "flow" | "dashboard">("agent");

  useEffect(() => {
    track("page_view", { page: "vertical_ai_agent_ops_copilot" });
    runTestsOnce();
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased py-8">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-12 gap-6">
        <aside className="col-span-3 hidden md:block">
          <Sidebar
            active={screen}
            onChange={(s) => {
              setScreen(s);
              track("nav_click", { to: s });
            }}
          />
        </aside>
        <div className="col-span-12 md:col-span-9">
          <Header />
          <main className="mt-6 space-y-8">
            {screen === "dashboard" && <LiveDashboard />}
            {screen === "flow" && <FlowDemo key="flow" />}
            {screen === "agent" && <OpsCopilot />}
          </main>
        </div>
      </div>
      <MobileNav
        onChange={(s) => {
          setScreen(s);
          track("nav_click", { to: s });
        }}
        active={screen}
      />
    </div>
  );
}

/* ------------------------------------------------
   Header & navigation
-------------------------------------------------*/

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center text-white font-bold">
          E
        </div>
        <div>
          <div className="font-semibold text-lg">Emergefy</div>
          <div className="text-xs text-neutral-500">Vertical AI-Agent — Ops Copilot</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <button className="px-3 py-1 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50" onClick={() => track("help_open")}>
            Help
          </button>
          <button
            className="px-3 py-1 rounded-md bg-neutral-900 text-white text-sm flex items-center gap-2"
            onClick={() => track("cta_click", { where: "header_start_free" })}
          >
            <IconUsers /> Start free
          </button>
        </div>
        <DemoBell />
      </div>
    </header>
  );
}

function Sidebar({
  active,
  onChange,
}: {
  active: "agent" | "flow" | "dashboard";
  onChange: (s: "agent" | "flow" | "dashboard") => void;
}) {
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
          <button
            key={i.key}
            onClick={() => onChange(i.key)}
            className={`w-full text-left p-2 rounded-xl border transition ${
              active === i.key
                ? "bg-neutral-50 border-neutral-300"
                : "border-transparent hover:bg-neutral-50"
            }`}
          >
            {i.label}
          </button>
        ))}
      </nav>
      <div className="mt-4 text-xs text-neutral-500">Tip: The agent works end-to-end with guardrails.</div>
    </div>
  );
}

function MobileNav({
  active,
  onChange,
}: {
  active: "agent" | "flow" | "dashboard";
  onChange: (s: "agent" | "flow" | "dashboard") => void;
}) {
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
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((s) => !s);
          track("open_notifications");
        }}
        aria-label="notifications"
        className="p-2 rounded-md border border-neutral-200 hover:bg-neutral-50"
      >
        <IconBell />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow p-3 z-50">
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Demo notifications</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-neutral-50">
              <IconX />
            </button>
          </div>
          <div className="mt-2 text-xs text-neutral-600">Recent demo events appear here when you run the flow.</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="p-2 rounded-xl bg-neutral-100"><IconStar /></div>
              <div>
                <div className="font-medium">Pilot created</div>
                <div className="text-xs text-neutral-500">A pilot was created with 120 guests</div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="p-2 rounded-xl bg-neutral-100"><IconUsers /></div>
              <div>
                <div className="font-medium">Segment ready</div>
                <div className="text-xs text-neutral-500">420 guests segmented by recency</div>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------
   Agent (Ops Copilot)
-------------------------------------------------*/

function PersonaCard({
  reasoningVisible,
  setReasoningVisible,
  paused,
  setPaused,
}: {
  reasoningVisible: boolean;
  setReasoningVisible: Dispatch<SetStateAction<boolean>>;
  paused: boolean;
  setPaused: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center text-white">
          <IconBot />
        </div>
        <div>
          <div className="font-semibold">Restaurant Growth Expert</div>
          <div className="text-xs text-neutral-500">Guardrails: margin ≤ 6%, brand-safe copy</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setReasoningVisible((s) => !s)}
          className="px-3 py-1 rounded-md border border-neutral-200 text-xs flex items-center gap-1 hover:bg-neutral-50"
        >
          {reasoningVisible ? <IconEyeOff /> : <IconEye />}
          {reasoningVisible ? "Hide CoT" : "Show CoT"}
        </button>
        <button
          onClick={() => setPaused((p) => !p)}
          className="px-3 py-1 rounded-md text-xs flex items-center gap-1 bg-neutral-900 text-white"
        >
          {paused ? <IconPlay /> : <IconPause />}
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}

function OpsCopilot() {
  const segments = useMemo<Segment[]>(
    () => [
      { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
      { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
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

  const { seg, off, reactivated, revenue } = computePreviewMetrics(segments, offers, segmentId, offerId);

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
          await wait(500);
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
        return [...curr, { id, type: "verify", text: `Checks: 3/3 passed.` }];
      }
      return curr;
    });
  }, [off.id, off.marginImpact, off.title, reactivated, revenue, seg.id, seg.size, seg.title]);

  const playSession = useCallback(async () => {
    for (let i = 0; i < 4; i++) {
      if (paused) break;
      await stepSession();
      await wait(600);
    }
  }, [paused, stepSession]);

  useEffect(() => {
    if (!paused && transcript.length < 4) void playSession();
  }, [paused, transcript.length, playSession]);

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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 p-6 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Ops Copilot</h3>
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <IconActivity /> Vertical AI-Agent
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPaused((p) => !p)} className="px-3 py-2 rounded-md border border-neutral-200 text-sm flex items-center gap-2 hover:bg-neutral-50">
            {paused ? <IconPlay /> : <IconPause />}{paused ? "Play" : "Pause"}
          </button>
          <button onClick={() => void stepSession()} className="px-3 py-2 rounded-md border border-neutral-200 text-sm flex items-center gap-2 hover:bg-neutral-50">
            <IconSkip /> Step
          </button>
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
                <div
                  key={t.id}
                  className={`p-2 rounded-xl border text-neutral-800 ${
                    t.type === "observe" ? "bg-neutral-50 border-neutral-200" :
                    t.type === "think" ? "bg-neutral-100 border-neutral-200" :
                    t.type === "act" ? "bg-neutral-50 border-neutral-200" : "bg-neutral-50 border-neutral-200"
                  }`}
                >
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
                      <div className="font-mono text-xs">{c.name}(segment: "{c.input.segment}", offer: "{c.input.offer}")</div>
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
                <ChoicePills
                  options={segments.map((s) => ({ id: s.id as string, label: s.title, sub: `${s.size}` }))}
                  value={segmentId as string}
                  onChange={(v) => setSegmentId(v)}
                />
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Offer</div>
                <ChoicePills
                  options={offers.map((o) => ({ id: o.id as string, label: o.title }))}
                  value={offerId as string}
                  onChange={(v) => setOfferId(v)}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={approvePlan} className="px-3 py-2 rounded-md bg-neutral-900 text-white flex items-center gap-2">
                <IconZap /> Approve
              </button>
              <button
                onClick={() => {
                  const pick = recommendBestPair(segments, offers);
                  setSegmentId(pick.seg.id);
                  setOfferId(pick.off.id);
                }}
                className="px-3 py-2 rounded-md border border-neutral-200 hover:bg-neutral-50"
              >
                Use agent pick
              </button>
            </div>
          </div>

          {/* subtle spotlight ring on first focus area */}
          {spot && (
            <div className="pointer-events-none absolute inset-0 flex items-start justify-end pr-4 pt-16">
              <div className="w-24 h-24 rounded-full ring-4 ring-neutral-300/60 bg-neutral-200/10 transition" />
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
        if (mounted) setSummary({ revenue: extraRevenue || 0, retained: retained || 0, optimized });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    update();
    const id = setInterval(update, 1200);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-neutral-50 to-neutral-100 border border-neutral-200 text-sm">
      <span className="font-medium">Emergefy</span> brought in <span className="font-semibold">${summary.revenue}</span> extra revenue this month, retained <span className="font-semibold">{summary.retained}</span> at-risk customers, and optimized <span className="font-semibold">{summary.optimized}</span> inventory orders — all automatically.
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const safeValues = Array.isArray(values) && values.length ? values : [0];
  const w = 320, h = 60, max = Math.max(...safeValues, 1), denom = Math.max(1, safeValues.length - 1);
  const points =
    safeValues.length === 1
      ? `0,${h - (safeValues[0] / max) * h} ${w},${h - (safeValues[0] / max) * h}`
      : safeValues.map((v, i) => `${(i / denom) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-2 h-14">
      <polyline fill="none" stroke="#0a0a0a" strokeWidth={2} points={points} strokeLinejoin="round" strokeLinecap="round" />
      {safeValues.length > 1 &&
        safeValues.map((v, i) => <circle key={i} cx={(i / denom) * w} cy={h - (v / max) * h} r={2.5} />)}
    </svg>
  );
}

function RecentEvents() {
  const [events, setEvents] = useState<SimRecord[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return (JSON.parse(raw).simHistory || []).slice(0, 6) as SimRecord[];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    return [];
  });
  useEffect(() => {
    let mounted = true;
    const id = setInterval(() => {
      try {
        if (!mounted || typeof window === "undefined") return;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setEvents(((JSON.parse(raw).simHistory || []) as SimRecord[]).slice(0, 6));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }, 1200);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);
  if (events.length === 0) return <div className="text-sm text-neutral-500 mt-2">No demo events yet — run a playbook.</div>;
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
    try {
      if (typeof window === "undefined") return defaultKpi;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        return (obj.kpi as Kpi) || defaultKpi;
      }
    } catch { /* noop */ }
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
      } catch { /* noop */ }
    }, 1200);
    return () => { mounted = false; clearInterval(id); };
  }, [defaultKpi]);

  return (
    <section className="rounded-2xl border border-neutral-200 p-6 bg-neutral-50">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold">Impact</h3>
          <div className="text-xs text-neutral-500 mt-1">Snapshot of reactivations and demo revenue.</div>
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
          <div className="mt-2 text-xs">
            <div>Margin cap: ≤ 6% ✓</div>
            <div>Brand terms: ✓</div>
            <div>Spend cap: ✓</div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-neutral-200 bg-white">
          <div className="font-semibold">Recent demo events</div>
          <RecentEvents />
        </div>
        <div className="p-4 rounded-2xl border border-neutral-200 bg-white">
          <div className="font-semibold">Demo tips</div>
          <ul className="mt-2 text-sm space-y-2 text-neutral-600">
            <li>Toggle reasoning for different audiences.</li>
            <li>Use Playbooks for fast, safe defaults.</li>
            <li>Show verification checks before approve.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------
   Playbooks (Flow)
-------------------------------------------------*/

function FlowDemo() {
  const steps = [
    { key: "connect", label: "Connect", detail: "Link POS or upload order CSV", title: "Connect your data", body: "For the demo, we simulate a POS connection or a CSV upload so you can jump straight to value." },
    { key: "audience", label: "Audience", detail: "Auto-segment guests by recency & spend", title: "Choose who to reach", body: "Pick a prebuilt segment. We estimate size and likelihood to come back based on recency and spend." },
    { key: "offer", label: "Offer", detail: "Pick smart, margin-safe offers", title: "Choose the nudge", body: "Select a gentle incentive. We balance expected lift with margin impact to protect profitability." },
    { key: "send", label: "Schedule", detail: "Pick channel & time", title: "How and when to send", body: "Pick a channel and timing. Defaults are sensible for first runs; you can tweak anytime." },
    { key: "measure", label: "Review", detail: "Preview results & approve", title: "Review and approve", body: "Double-check the plan and the projected impact. When you approve, we schedule it and track results." },
  ] as const;

  const clampIndex = (i: number) => Math.min(steps.length - 1, Math.max(0, i));

  const [active, setActive] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<number>(1);
  const [selectedSegment, setSelectedSegment] = useState<string>("recent-lapsed");
  const [selectedOffer, setSelectedOffer] = useState<string>("10-off");
  const [scheduling, setScheduling] = useState<{ when: string; channel: string }>({ when: "In 1 hour", channel: "SMS" });
  const [done, setDone] = useState<DoneResult | null>(null);

  const segments = useMemo<Segment[]>(
    () => [
      { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
      { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
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

  // Slim list of connections per request: CSV, Google Sheets, Square, Toast, Shopify POS, Foodics
  const [connections, setConnections] = useState<ConnectionMap>({
    csv: true,
    gsheet: false,
    square: false,
    toast: false,
    shopifypos: false,
    foodics: false,
  });

  function approveAndSend() {
    const record: SimRecord = { id: String(Date.now()), time: Date.now(), audience: seg.size, reactivated, type: selectedOffer || "unknown" };
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY) || "{}";
      const obj = JSON.parse(raw);
      const simHistory: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
      simHistory.unshift(record);
      obj.simHistory = simHistory.slice(0, 20);

      const kpi = (obj.kpi as Kpi) || { mrr: 4200, activePilots: 3, projectedLift: 12, last24: [] };
      kpi.mrr = Math.max(4200, (kpi.mrr || 4200) + Math.round(reactivated * 2));
      kpi.activePilots = Math.min(10, kpi.activePilots || 3);
      obj.kpi = kpi;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      track("flow_approve_send", { segment: selectedSegment, offer: selectedOffer, reactivated, when: scheduling.when, channel: scheduling.channel });

      setDone({ audience: seg.size, reactivated, revenue, segment: seg.title, offer: off.title, when: scheduling.when, channel: scheduling.channel });
      setModalOpen(true);

      if (typeof document !== "undefined") {
        const el = document.createElement("div");
        el.textContent = `Scheduled — est reactivations: ${reactivated}`;
        el.className = "fixed right-4 bottom-6 bg-neutral-900 text-white px-4 py-2 rounded shadow";
        document.body.appendChild(el);
        setTimeout(() => { try { document.body.removeChild(el); } catch { /* noop */ } }, 2600);
      }
    } catch { /* noop */ }
  }

  const openStep = (i: number) => {
    const idx = clampIndex(i);
    setActive(idx);
    setModalStep(idx);
    setModalOpen(true);
    track("step_open_modal", { step: steps[idx].key });
  };

  const nextStep = () => setModalStep((s) => clampIndex(s + 1));
  const prevStep = () => setModalStep((s) => clampIndex(s - 1));
  const toggleConn = (k: keyof ConnectionMap) => setConnections((c) => ({ ...c, [k]: !c[k] }));

  return (
    <section id="flow" className="rounded-2xl border border-neutral-200 p-6 bg-neutral-50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Playbooks</h3>
        <div className="text-sm text-neutral-500">Each step opens as a focused popup</div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={s.key} className={`p-3 rounded-2xl border ${i === active ? "bg-white shadow-sm border-neutral-200" : "bg-transparent border-neutral-200"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{s.label}</div>
                    <div className="text-xs text-neutral-500 mt-1">{s.detail}</div>
                  </div>
                  <div className="text-xs text-neutral-400">{i + 1}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openStep(i)} className="px-2 py-1 rounded-md bg-neutral-900 text-white text-xs">Open</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 p-4 rounded-2xl border border-neutral-200 bg-white">
          <div className="text-xs text-neutral-500">Preview</div>
          <div className="mt-2 grid md:grid-cols-3 gap-2">
            <StatCard label="Audience" value={seg.size} />
            <StatCard label="Est. Reactivations" value={reactivated} />
            <StatCard label="Projected Sales" value={`$${revenue}`} />
          </div>
          <div className="mt-3 text-xs text-neutral-500">Tip: Open the steps on the left to configure audience, offer, and schedule.</div>
        </div>
      </div>

      <WizardModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setDone(null); }}
        stepText={`Step ${modalStep + 1} of ${steps.length}`}
      >
        {!done ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-base">{steps[modalStep].title}</div>
                <div className="text-xs text-neutral-600 mt-1">{steps[modalStep].body}</div>
              </div>
            </div>

            {/* CONNECT (slimmed list) */}
            {steps[modalStep].key === "connect" && (
              <div className="mt-3 text-sm space-y-4">
                <div>
                  <div className="text-xs font-medium text-neutral-700 mb-2">File imports</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { k: "csv", label: "Upload CSV" },
                      { k: "gsheet", label: "Google Sheets" },
                    ].map(({ k, label }) => {
                      const on = connections[k as keyof ConnectionMap];
                      return (
                        <button
                          key={k}
                          onClick={() => toggleConn(k as keyof ConnectionMap)}
                          className={`group flex items-center justify-between rounded-xl border px-3 py-2 transition
                            ${on ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                        >
                          <span className="text-[13px] font-medium">{label}</span>
                          <span className={`h-5 w-9 rounded-full transition ${on ? "bg-white/20" : "bg-neutral-200"}`}>
                            <span className={`block h-5 w-5 rounded-full bg-white shadow transform transition ${on ? "translate-x-4" : "translate-x-0"}`} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-neutral-700 mb-2">POS &amp; ordering</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { k: "square", label: "Square POS" },
                      { k: "toast", label: "Toast POS" },
                      { k: "shopifypos", label: "Shopify POS" },
                      { k: "foodics", label: "Foodics" },
                    ].map(({ k, label }) => {
                      const on = connections[k as keyof ConnectionMap];
                      return (
                        <button
                          key={k}
                          onClick={() => toggleConn(k as keyof ConnectionMap)}
                          className={`group flex items-center justify-between rounded-xl border px-3 py-2 transition
                            ${on ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                        >
                          <span className="text-[13px] font-medium">{label}</span>
                          <span className={`h-5 w-9 rounded-full transition ${on ? "bg-white/20" : "bg-neutral-200"}`}>
                            <span className={`block h-5 w-5 rounded-full bg-white shadow transform transition ${on ? "translate-x-4" : "translate-x-0"}`} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-xs text-neutral-500">This is a simulation for the demo — no external data is transmitted.</div>
              </div>
            )}

            {/* AUDIENCE (pills) */}
            {steps[modalStep].key === "audience" && (
              <div className="mt-3 text-sm space-y-3">
                <div className="text-xs text-neutral-500">Select a segment</div>
                <ChoicePills
                  options={segments.map((s) => ({ id: s.id as string, label: s.title, sub: `${s.size} guests` }))}
                  value={selectedSegment as string}
                  onChange={(v) => setSelectedSegment(v)}
                />
                <div className="text-xs text-neutral-600">Estimated reactivation rate adapts by recency/spend.</div>
              </div>
            )}

            {/* OFFER (pills) */}
            {steps[modalStep].key === "offer" && (
              <div className="mt-3 text-sm space-y-3">
                <div className="text-xs text-neutral-500">Choose an offer</div>
                <ChoicePills
                  options={offers.map((o) => ({ id: o.id as string, label: o.title }))}
                  value={selectedOffer as string}
                  onChange={(v) => setSelectedOffer(v)}
                />
                <ul className="text-xs grid grid-cols-3 gap-2">
                  <li className="p-2 border border-neutral-200 rounded-xl text-center">Margin cap ≤ 6%</li>
                  <li className="p-2 border border-neutral-200 rounded-xl text-center">Brand-safe copy ✓</li>
                  <li className="p-2 border border-neutral-200 rounded-xl text-center">Audience fit ✓</li>
                </ul>
              </div>
            )}

            {/* SEND */}
            {steps[modalStep].key === "send" && (
              <div className="mt-3 text-sm space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Channel</div>
                    <ChoicePills
                      options={[{ id: "SMS", label: "SMS" }, { id: "Email", label: "Email" }, { id: "Push", label: "Push" }]}
                      value={scheduling.channel as "SMS" | "Email" | "Push"}
                      onChange={(v) => setScheduling((s) => ({ ...s, channel: v }))}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Send time</div>
                    <ChoicePills
                      options={[{ id: "In 1 hour", label: "In 1 hour" }, { id: "Tonight 7pm", label: "Tonight 7pm" }, { id: "Tomorrow morning", label: "Tomorrow morning" }]}
                      value={scheduling.when as "In 1 hour" | "Tonight 7pm" | "Tomorrow morning"}
                      onChange={(v) => setScheduling((s) => ({ ...s, when: v }))}
                    />
                  </div>
                </div>
                <div className="text-xs text-neutral-600">Defaults are tuned for quick wins; you can refine later.</div>
              </div>
            )}

            {/* MEASURE */}
            {steps[modalStep].key === "measure" && (
              <div className="mt-3 text-sm space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-neutral-200 rounded-xl">
                    <div className="text-xs text-neutral-500">Segment</div>
                    <div className="font-medium">{seg.title}</div>
                  </div>
                  <div className="p-3 border border-neutral-200 rounded-xl">
                    <div className="text-xs text-neutral-500">Offer</div>
                    <div className="font-medium">{off.title}</div>
                  </div>
                  <div className="p-3 border border-neutral-200 rounded-xl text-center">
                    <div className="text-xs text-neutral-500">Est. Reactivations</div>
                    <div className="font-semibold mt-1">{reactivated}</div>
                  </div>
                  <div className="p-3 border border-neutral-200 rounded-xl text-center">
                    <div className="text-xs text-neutral-500">Projected Sales</div>
                    <div className="font-semibold mt-1">${revenue}</div>
                  </div>
                </div>
                <div className="text-xs text-neutral-600">Approve to schedule and track results on the Impact page.</div>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-5 flex items-center justify-between">
              <button onClick={prevStep} className="px-3 py-2 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50">Back</button>
              {modalStep < steps.length - 1 ? (
                <button onClick={nextStep} className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm">Next</button>
              ) : (
                <button onClick={approveAndSend} className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm">Approve & Schedule</button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="font-semibold text-base">Campaign scheduled</div>
            <div className="text-neutral-600">{done.offer} to {done.segment} via {done.channel} — {done.when}.</div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Audience" value={done.audience} />
              <StatCard label="Est. Reactivations" value={done.reactivated} />
            </div>
            <button onClick={() => { setModalOpen(false); setDone(null); }} className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm">Close</button>
          </div>
        )}
      </WizardModal>
    </section>
  );
}
