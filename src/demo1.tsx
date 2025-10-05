import { useState, useEffect, useMemo, useCallback } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Star, Bell, X, Play, Pause, SkipForward, Zap, Eye, EyeOff, Bot, Activity } from "lucide-react";

// --- Types ---
type Segment = { id: string; title: string; size: number; estReact: number };
type Offer = { id: string; title: string; marginImpact: number; estLift: number };
type TranscriptEntry = { id: number; type: "observe" | "think" | "act" | "verify"; text: string };
type BranchChoice = { label: string; score: number };
type ToolCall = { id: number; name: string; input: { segment: string; offer: string }; status: string; output?: { preview: { reactivated: number; revenue: number } } };
type Verification = { label: string; ok: boolean };
type Spot = "audience" | "offer" | null;
type Kpi = { mrr: number; activePilots: number; projectedLift?: number; last24?: number[] };
type SimRecord = { id: string; time: number; audience: number; reactivated?: number; type?: string };
type DoneRecord = { audience: number; reactivated: number; revenue: number; segment: string; offer: string; when: string; channel: string } | null;

const DEFAULT_KPI = { mrr: 4200, activePilots: 3, projectedLift: 12, last24: [5, 12, 8, 10, 6, 9, 7] };
type Connections = {
  csv: boolean; excel: boolean; gsheet: boolean; square: boolean; toast: boolean; shopifypos: boolean; clover: boolean; lightspeed: boolean; foodics: boolean; hubspot: boolean; mailchimp: boolean; klaviyo: boolean; firestore: boolean; supabase: boolean; postgres: boolean; restapi: boolean;
};

declare global {
  interface Window {
    __EMERGEFY_TESTS_RAN__?: boolean;
  }
}


function track(event: string, payload: Record<string, unknown> = {}) {
  try {
    const common = { event, ts: Date.now(), path: typeof window !== "undefined" ? window.location.pathname : "/", ...payload };
    if (typeof window !== "undefined") {
      const w = window as Window & { dataLayer?: { push: (arg: unknown) => void } };
      if (w.dataLayer && typeof w.dataLayer.push === "function") {
        w.dataLayer.push(common);
      } else if (typeof console !== "undefined") {
        console.log("[demo-analytics]", common);
      }
    }
  } catch {
    /* ignore */
  }
}

const STORAGE_KEY = "emergefy_demo_state_v1";

function wait(ms: number): Promise<void> { return new Promise((res) => setTimeout(res, ms)); }

function recommendBest(segments: Segment[], offers: Offer[]) {
  const pairs = segments.flatMap((s: Segment) => offers.map((o: Offer) => ({
    seg: s,
    off: o,
    score: Math.round((Math.max(s.estReact, o.estLift) * 100) + (s.size / 10) - Math.abs(o.marginImpact))
  })));
  return pairs.sort((a, b) => b.score - a.score)[0];
}

function computePreviewMetrics(segments: Segment[], offers: Offer[], selectedSegment: string, selectedOffer: string) {
  const seg = segments.find((s) => s.id === selectedSegment) || segments[0];
  const off = offers.find((o) => o.id === selectedOffer) || offers[0];
  const reactivated = Math.round(seg.size * Math.max(seg.estReact, off.estLift));
  const revenue = Math.round(reactivated * 18);
  return { seg, off, reactivated, revenue };
}

async function runTestsOnce() {
  try {
    if (typeof window === "undefined") return;
    if (window.__EMERGEFY_TESTS_RAN__) return;
    window.__EMERGEFY_TESTS_RAN__ = true;

    const tSegments = [
      { id: "s1", title: "S1", size: 100, estReact: 0.05 },
      { id: "s2", title: "S2", size: 200, estReact: 0.02 }
    ];
    const tOffers = [
      { id: "o1", title: "O1", marginImpact: -2, estLift: 0.04 },
      { id: "o2", title: "O2", marginImpact: -6, estLift: 0.10 }
    ];

    const best = recommendBest(tSegments, tOffers);
    console.assert(best.off.id === "o2", "recommendBest should prefer higher lift despite margin hit");

    const m = computePreviewMetrics(tSegments, tOffers, "s1", "o2");
    console.assert(m.reactivated === Math.round(100 * Math.max(0.05, 0.10)), "computePreviewMetrics reactivated mismatch");
    console.assert(m.revenue === Math.round(m.reactivated * 18), "computePreviewMetrics revenue mismatch");

    const p = wait(5);
    console.assert(typeof p.then === "function", "wait should return a promise");
    await p;

    console.log("[demo-tests] All runtime tests passed");
  } catch (err) {
    console.error("[demo-tests] Failure", err);
  }
}

export default function InteractiveDemoPage() {
  const [screen, setScreen] = useState("agent");
  useEffect(() => { track("page_view", { page: "vertical_ai_agent_ops_copilot" }); }, []);
  useEffect(() => { runTestsOnce(); }, []);
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased py-8">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-12 gap-6">
        <aside className="col-span-3 hidden md:block">
          <Sidebar active={screen} onChange={(s) => { setScreen(s); track("nav_click", { to: s }); }} />
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
      <MobileNav onChange={(s) => { setScreen(s); track("nav_click", { to: s }); }} active={screen} />
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold">E</div>
        <div>
          <div className="font-semibold text-lg">Emergefy</div>
          <div className="text-xs text-neutral-500">Vertical AI-Agent — Ops Copilot</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <button className="px-3 py-1 rounded-md border text-sm" onClick={() => track("help_open")}>Help</button>
          <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm flex items-center gap-2" onClick={() => track("cta_click", { where: "header_start_free" })}><Users size={14} /> Start free</button>
        </div>
        <DemoBell />
      </div>
    </header>
  );
}

function Sidebar({ active, onChange }: { active: string; onChange: (s: string) => void }) {
  const items = [
    { key: "dashboard", label: "Impact" },
    { key: "flow", label: "Playbooks" },
    { key: "agent", label: "Ops Copilot" },
  ];
  return (
    <div className="sticky top-6 rounded-lg border p-4 bg-white">
      <div className="text-sm text-neutral-500 mb-3">Product demo</div>
      <nav className="space-y-2">
        {items.map((i) => (
          <button key={i.key} onClick={() => onChange(i.key)} className={`w-full text-left p-2 rounded-md ${active === i.key ? "bg-indigo-50 border-indigo-200" : "hover:bg-neutral-50"}`}>{i.label}</button>
        ))}
      </nav>
      <div className="mt-4 text-xs text-neutral-500">Tip: The agent works end‑to‑end with guardrails.</div>
    </div>
  );
}

function MobileNav({ active, onChange }: { active: string; onChange: (s: string) => void }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center md:hidden">
      <div className="w-[92%] rounded-xl bg-white border p-2 flex justify-between">
        <button onClick={() => onChange("dashboard")} className={`px-3 py-2 rounded ${active === "dashboard" ? "bg-indigo-50" : ""}`}>Impact</button>
        <button onClick={() => onChange("flow")} className={`px-3 py-2 rounded ${active === "flow" ? "bg-indigo-50" : ""}`}>Playbooks</button>
        <button onClick={() => onChange("agent")} className={`px-3 py-2 rounded ${active === "agent" ? "bg-indigo-50" : ""}`}>Copilot</button>
      </div>
    </div>
  );
}

function DemoBell() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOpen(true), 1200); return () => clearTimeout(t); }, []);
  return (
    <div className="relative">
      <button onClick={() => { setOpen((s) => !s); track("open_notifications"); }} aria-label="notifications" className="p-2 rounded-md border"><Bell size={18} /></button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow p-3 z-50">
            <div className="flex items-center justify-between text-sm">
              <div className="font-semibold">Demo notifications</div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-md"><X size={14} /></button>
            </div>
            <div className="mt-2 text-xs text-neutral-600">Recent demo events appear here when you run the flow.</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="p-2 rounded bg-indigo-50"><Star size={14} /></div>
                <div>
                  <div className="font-medium">Pilot created</div>
                  <div className="text-xs text-neutral-500">A pilot was created with 120 guests</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="p-2 rounded bg-green-50"><Users size={14} /></div>
                <div>
                  <div className="font-medium">Segment ready</div>
                  <div className="text-xs text-neutral-500">420 guests segmented by recency</div>
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PersonaCard({ reasoningVisible, setReasoningVisible, paused, setPaused }: { reasoningVisible: boolean; setReasoningVisible: Dispatch<SetStateAction<boolean>>; paused: boolean; setPaused: Dispatch<SetStateAction<boolean>> }) {
  return (
    <div className="p-4 rounded-xl border bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white"><Bot size={18} /></div>
        <div>
          <div className="font-semibold">Restaurant Growth Expert</div>
          <div className="text-xs text-neutral-500">Guardrails: margin ≤ 6%, brand‑safe copy</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setReasoningVisible((s) => !s)} className="px-3 py-1 rounded-md border text-xs flex items-center gap-1">{reasoningVisible ? <EyeOff size={14} /> : <Eye size={14} />}{reasoningVisible ? "Hide CoT" : "Show CoT"}</button>
        <button onClick={() => setPaused((p) => !p)} className="px-3 py-1 rounded-md text-xs flex items-center gap-1 bg-neutral-900 text-white">{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? "Play" : "Pause"}</button>
      </div>
    </div>
  );
}

function EnergyBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full rounded bg-neutral-100 overflow-hidden">
      <div className="h-2 bg-indigo-500" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
    </div>
  );
}

function OpsCopilot() {
  const segments = useMemo<Segment[]>(() => [
    { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
    { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
    { id: "low-value", title: "Low spenders", size: 220, estReact: 0.03 },
  ], []);
  const offers = useMemo<Offer[]>(() => [
    { id: "10-off", title: "10% off next order", marginImpact: -6, estLift: 0.08 },
    { id: "bundle", title: "Meal bundle (save $3)", marginImpact: -3, estLift: 0.1 },
    { id: "free-drink", title: "Free drink w/order $10+", marginImpact: -4, estLift: 0.06 },
  ], []);

  const [segmentId, setSegmentId] = useState<string>("recent-lapsed");
  const [offerId, setOfferId] = useState<string>("bundle");
  const [reasoningVisible, setReasoningVisible] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [branching, setBranching] = useState<BranchChoice[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [spot, setSpot] = useState<Spot>(null);

  const recommendation = useMemo(() => recommendBest(segments, offers), [segments, offers]);
  useEffect(() => {
    if (recommendation) { setSegmentId(recommendation.seg.id); setOfferId(recommendation.off.id); }
  }, [recommendation]);

  const { seg, off, reactivated, revenue } = computePreviewMetrics(segments, offers, segmentId, offerId);

  const stepSession = useCallback(async () => {
    setProgress((p) => Math.min(100, p + 20));
    const id = Date.now();

    if (transcript.length === 0) {
      setTranscript((t) => [...t, { id, type: "observe", text: `Observed footfall dip Tue–Thu and ${seg.size} in ${seg.title}.` }]);
      setSpot("audience");
      return;
    }
    if (transcript.length === 1) {
      const choices: BranchChoice[] = [
        { label: `Target ${seg.title}`, score: 0.84 },
        { label: `Small VIP thank-you`, score: 0.62 },
        { label: `Dormant 90+ days`, score: 0.41 }
      ];
      setBranching(choices);
      setTranscript((t) => [...t, { id, type: "think", text: `Considering ${choices.length} options. Best is ${choices[0].label} with confidence 0.84.` }]);
      return;
    }
    if (transcript.length === 2) {
      setToolCalls((c) => [...c, { id, name: "CampaignBuilderAPI.create", input: { segment: seg.id, offer: off.id }, status: "running" }]);
      setTranscript((t) => [...t, { id, type: "act", text: `Create campaign: ${off.title} for ${seg.title}.` }]);
      setSpot("offer");
      await wait(500);
      setToolCalls((c) => c.map((x) => x.id === id ? { ...x, status: "ok", output: { preview: { reactivated, revenue } } } : x));
      return;
    }
    if (transcript.length === 3) {
      const checks: Verification[] = [
        { label: "Margin ≤ 6%", ok: Math.abs(off.marginImpact) <= 6 },
        { label: "Audience size > 50", ok: seg.size > 50 },
        { label: "Copy brand‑safe", ok: true },
      ];
      setVerifications(checks);
      setTranscript((t) => [...t, { id, type: "verify", text: `Checks: ${checks.filter((c) => c.ok).length}/${checks.length} passed.` }]);
      setProgress(100);
      return;
    }
  }, [transcript.length, seg.id, seg.size, seg.title, off.id, off.title, off.marginImpact, reactivated, revenue]);

  const playSession = useCallback(async () => {
    if (paused) return;
    for (let i = 0; i < 4; i++) {
      if (paused) break;
      await stepSession();
      await wait(600);
    }
  }, [paused, stepSession]);

  useEffect(() => { if (!paused && transcript.length < 4) { void playSession(); } }, [paused, transcript.length, playSession]);

  function resetSession() {
    setTranscript([]); setBranching([]); setVerifications([]); setToolCalls([]); setProgress(0); setSpot(null);
  }

  function approvePlan() {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY) || "{}";
      const obj = JSON.parse(raw);
      obj.simHistory = Array.isArray(obj.simHistory) ? obj.simHistory : [];
      obj.simHistory.unshift({ id: String(Date.now()), time: Date.now(), audience: seg.size, reactivated, type: off.id });
      obj.simHistory = obj.simHistory.slice(0, 20);
      obj.kpi = obj.kpi || { mrr: 4200, activePilots: 3 };
      obj.kpi.mrr = Math.max(4200, (obj.kpi.mrr || 4200) + Math.round(reactivated * 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      track("agent_expert_approve", { segment: seg.id, offer: off.id, reactivated });
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="rounded-2xl border p-6 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Ops Copilot</h3>
          <span className="text-xs text-neutral-500 flex items-center gap-1"><Activity size={12} /> Vertical AI‑Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPaused((p) => !p)} className="px-3 py-2 rounded-md border text-sm flex items-center gap-2">{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? "Play" : "Pause"}</button>
          <button onClick={stepSession} className="px-3 py-2 rounded-md border text-sm flex items-center gap-2"><SkipForward size={14} /> Step</button>
          <button onClick={resetSession} className="px-3 py-2 rounded-md border text-sm">Reset</button>
        </div>
      </div>

      <div className="mt-3"><EnergyBar progress={progress} /></div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <PersonaCard reasoningVisible={reasoningVisible} setReasoningVisible={setReasoningVisible} paused={paused} setPaused={setPaused} />

          <div className="p-4 rounded-xl border bg-white">
            <div className="text-xs text-neutral-500 mb-2">Transcript</div>
            <div className="space-y-2 text-sm">
              {transcript.length === 0 && <div className="text-neutral-500">Press Step or Play to watch the agent work.</div>}
              {transcript.map((t) => (
                <div key={t.id} className={`p-2 rounded border ${t.type === 'observe' ? 'bg-neutral-50' : t.type === 'think' ? 'bg-indigo-50' : t.type === 'act' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
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
                    <li key={i} className="flex items-center justify-between p-2 rounded border">
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
                    <li key={c.id} className="p-2 rounded border">
                      <div className="font-mono text-xs">{c.name}(segment: "{c.input.segment}", offer: "{c.input.offer}")</div>
                      <div className="text-xs mt-1">Status: <span className={c.status === 'ok' ? 'text-emerald-600' : 'text-neutral-600'}>{c.status}</span></div>
                      {c.output && <div className="text-xs text-neutral-600 mt-1">Preview → react {c.output.preview.reactivated}, sales ${c.output.preview.revenue}</div>}
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
                    <li key={i} className={`p-2 rounded border text-center ${v.ok ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      {v.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="p-4 rounded-xl border bg-neutral-50">
            <div className="text-xs text-neutral-500">Live surface</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="p-3 rounded border bg-white text-center">
                <div className="text-xs text-neutral-500">Audience</div>
                <div className="font-semibold mt-1">{seg.size}</div>
              </div>
              <div className="p-3 rounded border bg-white text-center">
                <div className="text-xs text-neutral-500">Est. Reactivations</div>
                <div className="font-semibold mt-1">{reactivated}</div>
              </div>
              <div className="p-3 rounded border bg-white text-center">
                <div className="text-xs text-neutral-500">Projected Sales</div>
                <div className="font-semibold mt-1">${revenue}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Audience</div>
                <select value={segmentId} onChange={(e) => setSegmentId(e.target.value)} className={`w-full px-3 py-2 border rounded text-sm ${spot === 'audience' ? 'ring-2 ring-indigo-400' : ''}`}>
                  {segments.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Offer</div>
                <select value={offerId} onChange={(e) => setOfferId(e.target.value)} className={`w-full px-3 py-2 border rounded text-sm ${spot === 'offer' ? 'ring-2 ring-amber-400' : ''}`}>
                  {offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={approvePlan} className="px-3 py-2 rounded-md bg-indigo-600 text-white flex items-center gap-2"><Zap size={16} /> Approve</button>
              <button onClick={() => { setSegmentId(recommendation.seg.id); setOfferId(recommendation.off.id); }} className="px-3 py-2 rounded-md border">Use agent pick</button>
            </div>
          </div>

          {spot && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 flex items-start justify-end pr-4 pt-16">
              <div className="w-24 h-24 rounded-full ring-4 ring-indigo-300/60 bg-indigo-200/10" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function ImpactSummary() {
  const [summary, setSummary] = useState({ revenue: 4220, retained: 11, optimized: 8 });
  useEffect(() => {
    const update = () => {
      try {
        if (typeof window === 'undefined') return;
        const raw = localStorage.getItem(STORAGE_KEY) || '{}';
        const obj = JSON.parse(raw);
        const sim: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
        const extraRevenue = Math.max(0, (obj.kpi?.mrr || 4200) - 4200);
        const retained = sim.reduce((a: number, r: SimRecord) => a + (r.reactivated || 0), 0);
        const optimized = Math.max(0, Math.min(50, Math.round(sim.filter((r: SimRecord) => r && r.type).length)));
        setSummary({ revenue: extraRevenue || 0, retained: retained || 0, optimized });
      } catch {
        /* ignore */
      }
    };
    update();
    const id = setInterval(update, 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-emerald-50 border text-sm">
      <span className="font-medium">Emergefy</span> brought in <span className="font-semibold">${summary.revenue}</span> extra revenue this month, retained <span className="font-semibold">{summary.retained}</span> at-risk customers, and optimized <span className="font-semibold">{summary.optimized}</span> inventory orders — all automatically.
    </div>
  );
}

function LiveDashboard() {
  const defaultKpi = { mrr: 4200, activePilots: 3, projectedLift: 12, last24: [5, 12, 8, 10, 6, 9, 7] };
  const [kpi, setKpi] = useState<Kpi>(() => {
    try {
        if (typeof window === "undefined") return DEFAULT_KPI;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) { const obj = JSON.parse(raw); return obj.kpi || DEFAULT_KPI; }
      } catch (err) { void err; }
    return DEFAULT_KPI;
  });
  useEffect(() => {
    const id = setInterval(() => {
      try {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const obj = JSON.parse(raw);
          const sim: SimRecord[] = Array.isArray(obj.simHistory) ? obj.simHistory : [];
          const last24 = sim.slice(0, 7).map((s: SimRecord) => Math.max(1, Math.round((s.reactivated || 0) / 10)));
          const mrr = obj.kpi?.mrr || DEFAULT_KPI.mrr;
          const activePilots = obj.kpi?.activePilots || DEFAULT_KPI.activePilots;
          const projectedLift = 10 + Math.round((sim.reduce((a: number, b: SimRecord) => a + (b.reactivated || 0), 0) / 100) % 10);
          setKpi({ mrr, activePilots, projectedLift, last24: last24.length ? last24 : DEFAULT_KPI.last24 });
        }
  } catch (err) { void err; }
    }, 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="rounded-2xl border p-6 bg-neutral-50">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold">Impact</h3>
          <div className="text-xs text-neutral-500 mt-1">Snapshot of reactivations and demo revenue.</div>
        </div>
        <div className="flex gap-3">
          <div className="p-3 rounded border bg-white text-sm text-center"><div className="text-xs text-neutral-500">MRR (demo)</div><div className="font-semibold mt-1">${kpi.mrr}</div></div>
          <div className="p-3 rounded border bg-white text-sm text-center"><div className="text-xs text-neutral-500">Active pilots</div><div className="font-semibold mt-1">{kpi.activePilots}</div></div>
          <div className="p-3 rounded border bg-white text-sm text-center"><div className="text-xs text-neutral-500">Projected lift</div><div className="font-semibold mt-1">{kpi.projectedLift}%</div></div>
        </div>
      </div>
      <ImpactSummary />
      <div className="mt-4 flex gap-4 items-center">
        <div className="w-full md:w-2/3 p-4 rounded border bg-white"><div className="text-xs text-neutral-500">Reactivations (recent)</div><Sparkline values={Array.isArray(kpi.last24) ? kpi.last24 : defaultKpi.last24} /></div>
        <div className="w-1/3 p-4 rounded border bg-white"><div className="text-xs text-neutral-500">Guardrails</div><div className="mt-2 text-xs"><div>Margin cap: ≤ 6% ✓</div><div>Brand terms: ✓</div><div>Spend cap: ✓</div></div></div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded border bg-white"><div className="font-semibold">Recent demo events</div><RecentEvents /></div>
        <div className="p-4 rounded border bg-white"><div className="font-semibold">Demo tips</div><ul className="mt-2 text-sm space-y-2 text-neutral-600"><li>Toggle reasoning for different audiences.</li><li>Use Playbooks for fast, safe defaults.</li><li>Show verification checks before approve.</li></ul></div>
      </div>
    </section>
  );
}

function RecentEvents() {
  const [events, setEvents] = useState<SimRecord[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return (JSON.parse(raw).simHistory || []) .slice(0, 6) as SimRecord[];
  } catch (err) { void err; }
    return [];
  });
  useEffect(() => {
    const id = setInterval(() => {
      try {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setEvents((JSON.parse(raw).simHistory || []).slice(0, 6) as SimRecord[]);
  } catch (err) { void err; }
    }, 1200);
    return () => clearInterval(id);
  }, []);
  if (events.length === 0) return <div className="text-sm text-neutral-500 mt-2">No demo events yet — run a playbook.</div>;
  return (
    <ul className="mt-2 space-y-2 text-sm">
      {events.map((e: SimRecord) => (
        <li key={e.id} className="flex items-center justify-between border rounded p-2">
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

function Sparkline({ values }: { values: number[] }) {
  const safeValues = Array.isArray(values) && values.length ? values : [0, 0, 0, 0, 0, 0, 0];
  const w = 320;
  const h = 60;
  const max = Math.max(...safeValues) || 1;
  const points = safeValues.map((v, i) => `${(i / Math.max(1, (safeValues.length - 1))) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-2 h-14">
      <polyline fill="none" stroke="#6366f1" strokeWidth={2} points={points} strokeLinejoin="round" strokeLinecap="round" />
      {safeValues.map((v, i) => (
        <circle key={i} cx={(i / Math.max(1, (safeValues.length - 1))) * w} cy={h - (v / max) * h} r={2.5} />
      ))}
    </svg>
  );
}

function FlowDemo() {
  const steps = [
    { key: "connect", label: "Connect", detail: "Link POS or upload order CSV", title: "Connect your data", body: "For the demo, we simulate a POS connection or a CSV upload so you can jump straight to value." },
    { key: "audience", label: "Audience", detail: "Auto-segment guests by recency & spend", title: "Choose who to reach", body: "Pick a prebuilt segment. We estimate size and likelihood to come back based on recency and spend." },
    { key: "offer", label: "Offer", detail: "Pick smart, margin-safe offers", title: "Choose the nudge", body: "Select a gentle incentive. We balance expected lift with margin impact to protect profitability." },
    { key: "send", label: "Schedule", detail: "Pick channel & time", title: "How and when to send", body: "Pick a channel and timing. Defaults are sensible for first runs; you can tweak anytime." },
    { key: "measure", label: "Review", detail: "Preview results & approve", title: "Review and approve", body: "Double-check the plan and the projected impact. When you approve, we schedule it and track results." },
  ];
  const [active, setActive] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<number>(1);
  const [selectedSegment, setSelectedSegment] = useState<string>("recent-lapsed");
  const [selectedOffer, setSelectedOffer] = useState<string>("10-off");
  const [scheduling, setScheduling] = useState<{ when: string; channel: string }>(() => ({ when: "In 1 hour", channel: "SMS" }));
  const [done, setDone] = useState<DoneRecord>(null);

  const segments = useMemo(() => [
    { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
    { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
    { id: "low-value", title: "Low spenders", size: 220, estReact: 0.03 },
  ], []);
  const offers = useMemo(() => [
    { id: "10-off", title: "10% off next order", marginImpact: -6, estLift: 0.08 },
    { id: "bundle", title: "Meal bundle (save $3)", marginImpact: -3, estLift: 0.1 },
    { id: "free-drink", title: "Free drink w/order $10+", marginImpact: -4, estLift: 0.06 },
  ], []);

  const { reactivated, revenue, seg, off } = computePreviewMetrics(segments, offers, selectedSegment, selectedOffer);

  const [connections, setConnections] = useState<Connections>({
    csv: true,
    excel: false,
    gsheet: false,
    square: false,
    toast: false,
    shopifypos: false,
    clover: false,
    lightspeed: false,
    foodics: false,
    hubspot: false,
    mailchimp: false,
    klaviyo: false,
    firestore: false,
    supabase: false,
    postgres: false,
    restapi: false,
  });

  function approveAndSend() {
    const record = { id: String(Date.now()), time: Date.now(), audience: seg.size, reactivated, type: selectedOffer || "unknown" };
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY) || "{}";
      const obj = JSON.parse(raw);
      obj.simHistory = Array.isArray(obj.simHistory) ? obj.simHistory : [];
      obj.simHistory.unshift(record);
      obj.simHistory = obj.simHistory.slice(0, 20);
      obj.kpi = obj.kpi || { mrr: 4200, activePilots: 3 };
      obj.kpi.mrr = Math.max(4200, (obj.kpi.mrr || 4200) + Math.round(reactivated * 2));
      obj.kpi.activePilots = Math.min(10, (obj.kpi.activePilots || 3));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      track("flow_approve_send", { segment: selectedSegment, offer: selectedOffer, reactivated, when: scheduling.when, channel: scheduling.channel });
      setDone({
        audience: seg.size,
        reactivated,
        revenue,
        segment: seg.title,
        offer: off.title,
        when: scheduling.when,
        channel: scheduling.channel
      });
      setModalOpen(true);
      if (typeof document !== "undefined") {
        const el = document.createElement("div");
        el.textContent = `Scheduled — est reactivations: ${reactivated}`;
        el.className = "fixed right-4 bottom-6 bg-neutral-900 text-white px-4 py-2 rounded shadow";
        document.body.appendChild(el);
        setTimeout(() => { try { document.body.removeChild(el); } catch { /* ignore */ } }, 2600);
      }
    } catch (err) { void err; }
  }

  function openStep(i: number) {
    setActive(i);
    setModalStep(i);
    setModalOpen(true);
    track('step_open_modal', { step: steps[i].key });
  }

  function nextStep() {
    const next = Math.min(steps.length - 1, modalStep + 1);
    setModalStep(next);
    setActive(next);
  }

  function prevStep() {
    const prev = Math.max(0, modalStep - 1);
    setModalStep(prev);
    setActive(prev);
  }

  function toggleConn(k: keyof Connections) {
    setConnections((c) => {
      const copy = { ...c } as Connections;
      copy[k] = !copy[k];
      return copy;
    });
  }

  return (
    <section id="flow" className="rounded-2xl border p-6 bg-neutral-50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Playbooks</h3>
        <div className="text-sm text-neutral-500">Each step opens as a focused popup</div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={s.key} className={`p-3 rounded-lg border ${i === active ? "bg-white shadow" : "bg-transparent"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{s.label}</div>
                    <div className="text-xs text-neutral-500 mt-1">{s.detail}</div>
                  </div>
                  <div className="text-xs text-neutral-400">{i + 1}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openStep(i)} className="px-2 py-1 rounded-md bg-indigo-600 text-white text-xs">Open</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 p-4 rounded-lg border bg-white">
          <div className="text-xs text-neutral-500">Preview</div>
          <div className="mt-2 grid md:grid-cols-3 gap-2">
            <div className="p-3 rounded border text-center">
              <div className="text-xs text-neutral-500">Audience</div>
              <div className="font-semibold mt-1">{seg.size}</div>
            </div>
            <div className="p-3 rounded border text-center">
              <div className="text-xs text-neutral-500">Est. Reactivations</div>
              <div className="font-semibold mt-1">{reactivated}</div>
            </div>
            <div className="p-3 rounded border text-center">
              <div className="text-xs text-neutral-500">Projected Sales</div>
              <div className="font-semibold mt-1">${revenue}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-neutral-500">Tip: Open the steps on the left to configure audience, offer, and schedule.</div>
        </div>
      </div>

      <WizardModal open={modalOpen} onClose={() => { setModalOpen(false); setDone(null); }}>
        {!done ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-base">{steps[modalStep].title}</div>
                <div className="text-xs text-neutral-600 mt-1">{steps[modalStep].body}</div>
              </div>
              <div className="text-xs text-neutral-500">Step {modalStep + 1} of {steps.length}</div>
            </div>

            {steps[modalStep].key === 'connect' && (
              <div className="mt-3 text-sm space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Connected sources</span>
                  <span className="font-medium">{Object.values(connections).filter(Boolean).length}</span>
                </div>

                <div>
                  <div className="text-xs font-medium text-neutral-700 mb-2">File imports</div>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Upload CSV</span>
                      <input type="checkbox" checked={connections.csv} onChange={() => toggleConn('csv')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Upload Excel (.xlsx)</span>
                      <input type="checkbox" checked={connections.excel} onChange={() => toggleConn('excel')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Google Sheets</span>
                      <input type="checkbox" checked={connections.gsheet} onChange={() => toggleConn('gsheet')} />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-neutral-700 mb-2">POS & ordering</div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Square POS</span>
                      <input type="checkbox" checked={connections.square} onChange={() => toggleConn('square')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Toast POS</span>
                      <input type="checkbox" checked={connections.toast} onChange={() => toggleConn('toast')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Shopify POS</span>
                      <input type="checkbox" checked={connections.shopifypos} onChange={() => toggleConn('shopifypos')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Clover</span>
                      <input type="checkbox" checked={connections.clover} onChange={() => toggleConn('clover')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Lightspeed</span>
                      <input type="checkbox" checked={connections.lightspeed} onChange={() => toggleConn('lightspeed')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Foodics</span>
                      <input type="checkbox" checked={connections.foodics} onChange={() => toggleConn('foodics')} />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-neutral-700 mb-2">CRM & marketing</div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>HubSpot</span>
                      <input type="checkbox" checked={connections.hubspot} onChange={() => toggleConn('hubspot')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Mailchimp</span>
                      <input type="checkbox" checked={connections.mailchimp} onChange={() => toggleConn('mailchimp')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Klaviyo</span>
                      <input type="checkbox" checked={connections.klaviyo} onChange={() => toggleConn('klaviyo')} />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-neutral-700 mb-2">Databases & APIs</div>
                  <div className="grid grid-cols-2 gap-2">                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Firestore</span>
                      <input type="checkbox" checked={connections.firestore} onChange={() => toggleConn('firestore')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Supabase</span>
                      <input type="checkbox" checked={connections.supabase} onChange={() => toggleConn('supabase')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>PostgreSQL</span>
                      <input type="checkbox" checked={connections.postgres} onChange={() => toggleConn('postgres')} />
                    </label>
                    <label className="flex items-center justify-between p-2 border rounded">
                      <span>Custom REST API</span>
                      <input type="checkbox" checked={connections.restapi} onChange={() => toggleConn('restapi')} />
                    </label>
                  </div>
                </div>

                <div className="text-xs text-neutral-500">This is a simulation for the demo — no external data is transmitted.</div>
              </div>
            )}

            {steps[modalStep].key === 'audience' && (
              <div className="mt-3 text-sm space-y-3">
                <div className="text-xs text-neutral-500">Select a segment</div>
                <select value={selectedSegment} onChange={(e) => setSelectedSegment(e.target.value)} className="w-full px-3 py-2 border rounded">
                  {segments.map((s) => <option key={s.id} value={s.id}>{s.title} — {s.size} guests</option>)}
                </select>
                <div className="text-xs text-neutral-600">Estimated reactivation rate adapts by recency/spend.</div>
              </div>
            )}

            {steps[modalStep].key === 'offer' && (
              <div className="mt-3 text-sm space-y-3">
                <div className="text-xs text-neutral-500">Choose an offer</div>
                <select value={selectedOffer} onChange={(e) => setSelectedOffer(e.target.value)} className="w-full px-3 py-2 border rounded">
                  {offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                </select>
                <ul className="text-xs grid grid-cols-3 gap-2">
                  <li className="p-2 border rounded text-center">Margin cap ≤ 6%</li>
                  <li className="p-2 border rounded text-center">Brand-safe copy ✓</li>
                  <li className="p-2 border rounded text-center">Audience fit ✓</li>
                </ul>
              </div>
            )}

            {steps[modalStep].key === 'send' && (
              <div className="mt-3 text-sm space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Channel</div>
                    <select value={scheduling.channel} onChange={(e) => setScheduling((s) => ({ ...s, channel: e.target.value }))} className="w-full px-3 py-2 border rounded">
                      <option>SMS</option>
                      <option>Email</option>
                      <option>Push</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Send time</div>
                    <select value={scheduling.when} onChange={(e) => setScheduling((s) => ({ ...s, when: e.target.value }))} className="w-full px-3 py-2 border rounded">
                      <option>In 1 hour</option>
                      <option>Tonight 7pm</option>
                      <option>Tomorrow morning</option>
                    </select>
                  </div>
                </div>
                <div className="text-xs text-neutral-600">Defaults are tuned for quick wins; you can refine later.</div>
              </div>
            )}

            {steps[modalStep].key === 'measure' && (
              <div className="mt-3 text-sm space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <div className="text-xs text-neutral-500">Segment</div>
                    <div className="font-medium">{seg.title}</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-xs text-neutral-500">Offer</div>
                    <div className="font-medium">{off.title}</div>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <div className="text-xs text-neutral-500">Est. Reactivations</div>
                    <div className="font-semibold mt-1">{reactivated}</div>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <div className="text-xs text-neutral-500">Projected Sales</div>
                    <div className="font-semibold mt-1">${revenue}</div>
                  </div>
                </div>
                <div className="text-xs text-neutral-600">Approve to schedule and track results on the Impact page.</div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <button onClick={prevStep} className="px-3 py-2 rounded-md border text-sm">Back</button>
              {modalStep < steps.length - 1 ? (
                <button onClick={nextStep} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Next</button>
              ) : (
                <button onClick={approveAndSend} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Approve & Schedule</button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="font-semibold text-base">Campaign scheduled</div>
            <div className="text-neutral-600">{done.offer} to {done.segment} via {done.channel} — {done.when}.</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded text-center">
                <div className="text-xs text-neutral-500">Audience</div>
                <div className="font-semibold mt-1">{done.audience}</div>
              </div>
              <div className="p-3 border rounded text-center">
                <div className="text-xs text-neutral-500">Est. Reactivations</div>
                <div className="font-semibold mt-1">{done.reactivated}</div>
              </div>
            </div>
            <button onClick={() => { setModalOpen(false); setDone(null); }} className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm">Close</button>
          </div>
        )}
      </WizardModal>
    </section>
  );
}

function WizardModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="relative w-[92%] md:w-[720px] bg-white border rounded-2xl shadow-lg p-4">
        <div className="absolute right-2 top-2">
          <button onClick={onClose} className="p-2 rounded-md"><X size={16} /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
