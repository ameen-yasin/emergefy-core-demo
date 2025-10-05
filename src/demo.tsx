// import React, { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Users, Star, Bell, X } from "lucide-react";

// function track(event: string, payload = {}) {
//   try {
//     const common = { event, ts: Date.now(), path: typeof window !== "undefined" ? window.location.pathname : "/", ...payload };
//     if (typeof window !== "undefined" && window && window.dataLayer && typeof window.dataLayer.push === "function") {
//       window.dataLayer.push(common);
//     } else if (typeof console !== "undefined") {
//       console.log("[demo-analytics]", common);
//     }
//   } catch { /* ignore */ }
// }

// const STORAGE_KEY = "emergefy_demo_state_v1";

// export default function InteractiveDemoPage() {
//   const [screen, setScreen] = useState("agent");
//   useEffect(() => { track("page_view", { page: "interactive_demo_react_flow_agent_min" }); }, []);
//   return (
//     <div className="min-h-screen bg-white text-slate-800 antialiased py-8">
//       <div className="mx-auto max-w-7xl px-4 grid grid-cols-12 gap-6">
//         <aside className="col-span-3 hidden md:block">
//           <Sidebar active={screen} onChange={(s: React.SetStateAction<string>) => { setScreen(s); track("nav_click", { to: s }); }} />
//         </aside>
//         <div className="col-span-12 md:col-span-9">
//           <Header />
//           <main className="mt-6 space-y-8">
//             {screen === "dashboard" && <LiveDashboard />}
//             {screen === "flow" && <FlowDemo key="flow" />}
//             {screen === "agent" && <AgentStudio />}
//             {screen === "agent_pro" && <AgentStudioPro />}
//           </main>
//         </div>
//       </div>
//       <MobileNav onChange={(s: React.SetStateAction<string>) => { setScreen(s); track("nav_click", { to: s }); }} active={screen} />
//     </div>
//   );
// }

// function Header() {
//   return (
//     <header className="header">
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold">E</div>
//         <div>
//           <div className="brand">Emergefy</div>
//           <div className="text-xs text-neutral-500">Pilot playground — ReAct agent studio</div>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="hidden sm:flex items-center gap-2">
//           <button className="btn-ghost text-sm" onClick={() => track("help_open")}>Help</button>
//           <button className="btn text-sm flex items-center gap-2" onClick={() => track("cta_click", { where: "header_start_free" })}><Users size={14} /> Start free</button>
//         </div>
//         <DemoBell />
//       </div>
//     </header>
//   );
// }

// function Sidebar({ active, onChange }: { active: string, onChange: (s: string) => void }) {
//   const items = [
//     { key: "dashboard", label: "Dashboard" },
//     { key: "flow", label: "Campaign Builder" },
//     { key: "agent", label: "Agent Studio" },
//     { key: "agent_pro", label: "Agent Studio (Pro)" },
//   ];
//   return (
//     <div className="sticky top-6 card">
//       <div className="text-sm text-neutral-500 mb-3">Product demo</div>
//       <nav className="space-y-2">
//         {items.map((i) => (
//           <button key={i.key} onClick={() => onChange(i.key)} className={`w-full text-left p-2 rounded-md ${active === i.key ? "bg-indigo-50 border-indigo-200" : "hover:bg-slate-50"}`}>{i.label}</button>
//         ))}
//       </nav>
//       <div className="mt-4 text-xs text-neutral-500">Tip: Agent Studio shows the exact process behind each step.</div>
//     </div>
//   );
// }

// function MobileNav({ active, onChange }: { active: string, onChange: (s: string) => void }) {
//   return (
//     <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center md:hidden">
//       <div className="w-[92%] rounded-xl glass border p-2 flex justify-between">
//         <button onClick={() => onChange("dashboard")} className={`px-3 py-2 rounded ${active === "dashboard" ? "bg-indigo-50" : ""}`}>Dash</button>
//         <button onClick={() => onChange("flow")} className={`px-3 py-2 rounded ${active === "flow" ? "bg-indigo-50" : ""}`}>Flow</button>
//         <button onClick={() => onChange("agent")} className={`px-3 py-2 rounded ${active === "agent" ? "bg-indigo-50" : ""}`}>Agent</button>
//         <button onClick={() => onChange("agent_pro")} className={`px-3 py-2 rounded ${active === "agent_pro" ? "bg-indigo-50" : ""}`}>Agent+</button>
//       </div>
//     </div>
//   );
// }

// function DemoBell() {
//   const [open, setOpen] = useState(false);
//   useEffect(() => { const t = setTimeout(() => setOpen(true), 1200); return () => clearTimeout(t); }, []);
//   return (
//     <div className="relative">
//       <button onClick={() => { setOpen((s) => !s); track("open_notifications"); }} aria-label="notifications" className="p-2 rounded-md border"><Bell size={18} /></button>
//       <AnimatePresence>
//         {open && (
//           <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow p-3 z-50">
//             <div className="flex items-center justify-between text-sm">
//               <div className="font-semibold">Demo notifications</div>
//               <button onClick={() => setOpen(false)} className="p-1 rounded-md"><X size={14} /></button>
//             </div>
//             <div className="mt-2 text-xs text-neutral-600">Recent demo events appear here when you run the flow.</div>
//             <ul className="mt-3 space-y-2 text-sm">
//               <li className="flex items-start gap-2">
//                 <div className="p-2 rounded bg-indigo-50"><Star size={14} /></div>
//                 <div>
//                   <div className="font-medium">Pilot created</div>
//                   <div className="text-xs text-neutral-500">A pilot was created with 120 guests</div>
//                 </div>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="p-2 rounded bg-green-50"><Users size={14} /></div>
//                 <div>
//                   <div className="font-medium">Segment ready</div>
//                   <div className="text-xs text-neutral-500">420 guests segmented by recency</div>
//                 </div>
//               </li>
//             </ul>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function AgentStudio() {
//   const segments = useMemo(() => [
//     { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
//     { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
//     { id: "low-value", title: "Low spenders", size: 220, estReact: 0.03 },
//   ], []);

//   const offers = useMemo(() => [
//     { id: "10-off", title: "10% off next order", marginImpact: -6, estLift: 0.08 },
//     { id: "bundle", title: "Meal bundle (save $3)", marginImpact: -3, estLift: 0.1 },
//     { id: "free-drink", title: "Free drink w/order $10+", marginImpact: -4, estLift: 0.06 },
//   ], []);

//   const [segmentId, setSegmentId] = useState("recent-lapsed");
//   const [offerId, setOfferId] = useState("bundle");
//   const [showEdit, setShowEdit] = useState(false);
//   const [confirm, setConfirm] = useState<string | null>(null);

//   const recommendation = useMemo(() => {
//     const best = segments
//       .flatMap((s) => offers.map((o) => ({
//         seg: s,
//         off: o,
//         score: Math.round((Math.max(s.estReact, o.estLift) * 100) + (s.size / 10) - Math.abs(o.marginImpact))
//       })))
//       .sort((a, b) => b.score - a.score)[0];
//     return best;
//   }, [segments, offers]);

//   useEffect(() => {
//     if (recommendation) {
//       setSegmentId(recommendation.seg.id);
//       setOfferId(recommendation.off.id);
//     }
//   }, [recommendation]);

//   const seg = segments.find((s) => s.id === segmentId) || segments[0];
//   const off = offers.find((o) => o.id === offerId) || offers[0];
//   const reactivated = Math.round(seg.size * Math.max(seg.estReact, off.estLift));
//   const revenue = Math.round(reactivated * 18);

//   function approvePlan() {
//     try {
//       if (typeof window === "undefined") return;
//       const raw = localStorage.getItem(STORAGE_KEY) || "{}";
//       const obj = JSON.parse(raw);
//       obj.simHistory = Array.isArray(obj.simHistory) ? obj.simHistory : [];
//       const record = { id: String(Date.now()), time: Date.now(), audience: seg.size, reactivated, type: off.id };
//       obj.simHistory.unshift(record);
//       obj.simHistory = obj.simHistory.slice(0, 20);
//       obj.kpi = obj.kpi || { mrr: 4200, activePilots: 3 };
//       obj.kpi.mrr = Math.max(4200, (obj.kpi.mrr || 4200) + Math.round(reactivated * 2));
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
//       setConfirm(`Scheduled for ${seg.title}. Est reactivations ${reactivated}.`);
//       setTimeout(() => setConfirm(null), 2600);
//       track("agent_expert_approve", { segment: seg.id, offer: off.id, reactivated });
//     } catch { /* ignore */ }
//   }

//   return (
//     <section className="rounded-2xl border p-6 bg-white">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-semibold">Your Restaurant Expert</h3>
//           <div className="text-xs text-neutral-500">Clear advice in plain language. Approve when ready.</div>
//         </div>
//       </div>

//       <div className="mt-4 grid md:grid-cols-3 gap-4">
//         <div className="md:col-span-2 p-4 rounded border bg-neutral-50">
//           <div className="text-sm">
//             Based on your guests and recent results, I recommend targeting <span className="font-semibold">{seg.title.toLowerCase()}</span> with <span className="font-semibold">{off.title.toLowerCase()}</span>. This should bring back about <span className="font-semibold">{reactivated}</span> guests and roughly <span className="font-semibold">${revenue}</span> in sales, while staying safe on margin.
//           </div>
//           <div className="mt-3 grid grid-cols-3 gap-2">
//             <div className="p-3 rounded border bg-white text-center">
//               <div className="text-xs text-neutral-500">Audience</div>
//               <div className="font-semibold mt-1">{seg.size}</div>
//             </div>
//             <div className="p-3 rounded border bg-white text-center">
//               <div className="text-xs text-neutral-500">Est. Reactivations</div>
//               <div className="font-semibold mt-1">{reactivated}</div>
//             </div>
//             <div className="p-3 rounded border bg-white text-center">
//               <div className="text-xs text-neutral-500">Projected Sales</div>
//               <div className="font-semibold mt-1">${revenue}</div>
//             </div>
//           </div>
//           <div className="mt-4 flex gap-2">
//             <button onClick={approvePlan} className="px-3 py-2 rounded-md bg-indigo-600 text-white">Approve</button>
//             <button onClick={() => setShowEdit((s) => !s)} className="px-3 py-2 rounded-md border">Change plan</button>
//           </div>
//           {confirm && <div className="mt-3 text-sm rounded-md bg-neutral-900 text-white px-3 py-2">{confirm}</div>}
//         </div>

//         <div className="md:col-span-1 p-4 rounded border bg-white">
//           <div className="text-xs text-neutral-500">Plan details</div>
//           {!showEdit ? (
//             <div className="mt-2 text-sm">
//               <div className="font-medium">{seg.title}</div>
//               <div className="text-neutral-500">{seg.size} guests • est react {Math.round(seg.estReact * 100)}%</div>
//               <div className="mt-3 font-medium">{off.title}</div>
//               <div className="text-neutral-500">Margin impact {off.marginImpact}% • est lift {Math.round(off.estLift * 100)}%</div>
//             </div>
//           ) : (
//             <div className="mt-2 space-y-3">
//               <div>
//                 <div className="text-xs text-neutral-500 mb-1">Audience</div>
//                 <select value={segmentId} onChange={(e) => setSegmentId(e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
//                   {segments.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <div className="text-xs text-neutral-500 mb-1">Offer</div>
//                 <select value={offerId} onChange={(e) => setOfferId(e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
//                   {offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// interface IEvent {
//   ts: number;
//   agent: string;
//   kind: string;
//   text: string;
//   meta?: Record<string, unknown>;
// }

// interface ICandidate {
//   label: string;
//   score: number;
//   action: {
//     type: string;
//     segment: string;
//     offer: string;
//   };
//   pros: string[];
//   cons: string[];
// }

// function AgentStudioPro() {
//   const agents = useMemo(() => [
//     { id: "marketing", name: "Marketing Expert", color: "#6366f1" },
//     { id: "inventory", name: "Inventory Analyst", color: "#10b981" },
//   ], []);
//   const segments = useMemo(() => [
//     { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
//     { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
//     { id: "low-value", title: "Low spenders", size: 220, estReact: 0.03 },
//   ], []);
//   const offers = useMemo(() => [
//     { id: "10-off", title: "10% off next order", marginImpact: -6, estLift: 0.08 },
//     { id: "bundle", title: "Meal bundle (save $3)", marginImpact: -3, estLift: 0.1 },
//     { id: "free-drink", title: "Free drink w/order $10+", marginImpact: -4, estLift: 0.06 },
//   ], []);
//   const [events, setEvents] = useState<IEvent[]>([]);
//   const [running, setRunning] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const [showCoT, setShowCoT] = useState(true);
//   const [manualMode, setManualMode] = useState(false);
//   const [waitingChoice, setWaitingChoice] = useState(false);
//   const choiceResolverRef = React.useRef<((idx: number) => void) | null>(null);
//   const [candidates, setCandidates] = useState<ICandidate[]>([]);
//   const [highlight, setHighlight] = useState<string | null>(null);
//   const [energy, setEnergy] = useState(0);
//   const [timelineOpen, setTimelineOpen] = useState(true);
//   const [lastSession, setLastSession] = useState<IEvent[] | null>(null);
//   const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
//   const [activeSeg] = useState(segments[0]);

//   function record(agentId: string, kind: string, text: string, meta?: Record<string, unknown>) {
//     const ev: IEvent = { ts: Date.now(), agent: agentId, kind, text, meta };
//     setEvents((e) => [...e, ev]);
//     return ev;
//   }
//   function makeCandidates() {
//     const list = segments.flatMap((s) => offers.map((o) => {
//       const score = Math.round((Math.max(s.estReact, o.estLift) * 100) + (s.size / 10) - Math.abs(o.marginImpact));
//       const pros = [
//         `High intent ${Math.round(s.estReact * 100)}%`,
//         `Offer lift ${Math.round(o.estLift * 100)}%`
//       ];
//       const cons = [`Margin hit ${o.marginImpact}%`];
//       return { label: `${s.title} + ${o.title}`, score, action: { type: "campaign", segment: s.id, offer: o.id }, pros, cons };
//     }));
//     const sorted = list.sort((a, b) => b.score - a.score).slice(0, 4);
//     setCandidates(sorted);
//     return sorted;
//   }
//   function waitForChoice() {
//     setWaitingChoice(true);
//     return new Promise((resolve) => {
//       choiceResolverRef.current = (idx: unknown) => { setWaitingChoice(false); resolve(idx); };
//     });
//   }
//   function chooseCandidate(idx: number) {
//     const r = choiceResolverRef.current;
//     if (r) r(idx);
//     choiceResolverRef.current = null;
//   }
//   async function progressEnergy(ms: number) {
//     const steps = 10;
//     for (let i = 0; i < steps; i++) {
//       setEnergy(Math.round(((i + 1) / steps) * 100));
//       await wait(ms / steps);
//     }
//     setEnergy(0);
//   }
//   function agentCreateEventInternal(action: { type: string; }) {
//     try {
//       if (typeof window === "undefined") return;
//       const raw = localStorage.getItem(STORAGE_KEY) || "{}";
//       const obj = JSON.parse(raw);
//       obj.simHistory = Array.isArray(obj.simHistory) ? obj.simHistory : [];
//       const reactivated = action && action.type === "campaign" ? Math.round(120 * (0.06 + Math.random() * 0.12)) : 0;
//       const record = { id: String(Date.now()), time: Date.now(), audience: 120, reactivated, type: action.type || "agent" };
//       if (action.type === "campaign") obj.simHistory.unshift(record);
//       obj.simHistory = obj.simHistory.slice(0, 20);
//       obj.kpi = obj.kpi || { mrr: 4200, activePilots: 3 };
//       if (action.type === "campaign") obj.kpi.mrr = Math.max(4200, (obj.kpi.mrr || 4200) + Math.round(reactivated * 2));
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
//     } catch { /* ignore */ }
//   }
//   function verifyLastEvent() {
//     try {
//       if (typeof window === "undefined") return false;
//       const raw = localStorage.getItem(STORAGE_KEY) || "{}";
//       const obj = JSON.parse(raw);
//       const last = Array.isArray(obj.simHistory) && obj.simHistory.length ? obj.simHistory[0] : null;
//       if (!last) return false;
//       return last.reactivated > 0;
//     } catch { return false; }
//   }
//   async function performAction(agentId: string, action: { type: string; segment: string; offer: string; }) {
//     setHighlight("campaign-builder");
//     record(agentId, "tool", `Tool: CampaignBuilder.createCampaign(${JSON.stringify(action)})`, { tool: "CampaignBuilder", input: action });
//     await progressEnergy(600);
//     agentCreateEventInternal(action);
//     await wait(400);
//     setHighlight(null);
//   }
//   async function runSession(replayEvents?: IEvent[]) {
//     if (running) return;
//     setEvents([]);
//     setRunning(true);
//     setPaused(false);
//     setEnergy(0);
//     setSelectedIdx(null);

//     if (replayEvents && replayEvents.length) {
//       for (let i = 0; i < replayEvents.length; i++) {
//         if (paused) { while (paused) { /* pause loop */ await wait(200); } }
//         const ev = replayEvents[i];
//         setEvents((e) => [...e, ev]);
//         await progressEnergy(300);
//       }
//       setRunning(false);
//       setLastSession(replayEvents);
//       return;
//     }

//     const add = (agentId: string, kind: string, text: string, meta?: Record<string, unknown>) => {
//       const ev = record(agentId, kind, text, meta);
//       return ev;
//     };

//     add("marketing", "observation", "Reviewing segments, historic lift and offer economics.", { focus: activeSeg });
//     await progressEnergy(400);

//     const cand = makeCandidates();
//     add("marketing", "candidates", `Options: ${cand.map(c => `${c.label} (${c.score})`).join("; ")}`, { candidates: cand });
//     await progressEnergy(500);

//     const first = cand[0];
//     add("marketing", "thought", `Reactivate using ${first.label}.`, { pros: first.pros, cons: first.cons });

//     let chosen = first;
//     if (manualMode) {
//       const idx = await waitForChoice();
//       chosen = cand[idx as number] || first;
//       add("marketing", "action", `Select: ${chosen.label}`, { manual: true, chosen });
//     } else {
//       await wait(400);
//       add("marketing", "action", `Select: ${chosen.label}`, { manual: false, chosen });
//     }

//     add("inventory", "observation", "Checking stock levels, velocity, and waste risk.");
//     await progressEnergy(300);
//     if (chosen.action.offer === "free-drink") {
//       const alt = cand.find(c => c.label.includes("bundle")) || chosen;
//       add("inventory", "debate", `Counter: swap to ${alt.label} due to drink stock.`);
//       add("marketing", "debate", `Acknowledged. Switching to ${alt.label} – maintains lift with safer margin.`);
//       chosen = alt;
//     } else {
//       add("inventory", "thought", `Inventory risk acceptable for ${chosen.label}.`);
//     }

//     await performAction("marketing", chosen.action);
//     add("marketing", "verification", "Check KPIs and events.");
//     const ok = verifyLastEvent();
//     add("marketing", "verification_result", ok ? "Verification passed" : "Verification failed", { ok });

//     setRunning(false);
//     setLastSession(events);
//   }

//   useEffect(() => { return () => { choiceResolverRef.current = null; }; }, []);

//   return (
//     <section className="rounded-2xl border p-6 bg-white">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-semibold">Agent Studio (Pro)</h3>
//           <div className="text-xs text-neutral-500">Transparent ReAct with expert debate, scoring, verification, and replay.</div>
//         </div>
//         <div className="flex items-center gap-2">
//           <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={showCoT} onChange={() => setShowCoT((s) => !s)} /> Show CoT</label>
//           <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={manualMode} onChange={() => setManualMode((s) => !s)} /> Manual</label>
//           <button onClick={() => { setEvents([]); }} className="px-3 py-1 rounded-md border text-sm">Clear</button>
//           <button onClick={() => { if (running) { setPaused((p) => !p); } else { runSession(); } }} className={`px-3 py-1 rounded-md ${running ? 'bg-neutral-200' : 'bg-indigo-600 text-white'}`}>{running ? (paused ? 'Resume' : 'Pause') : 'Start'}</button>
//           <button onClick={() => { if (lastSession) runSession(lastSession); }} disabled={!lastSession} className="px-3 py-1 rounded-md border text-sm disabled:opacity-50">Replay</button>
//         </div>
//       </div>

//       <div className="mt-3 grid md:grid-cols-3 gap-3">
//         <div className="md:col-span-2 p-3 rounded border bg-neutral-50">
//           <div className="flex items-center justify-between mb-2">
//             <div className="font-semibold">Transcript & Timeline</div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => setTimelineOpen((s) => !s)} className="px-2 py-1 rounded-md border text-xs">{timelineOpen ? 'Hide timeline' : 'Show timeline'}</button>
//               <div className="w-36 text-xs">Energy</div>
//               <div className="w-32 bg-neutral-100 rounded overflow-hidden h-2"><div style={{ width: `${energy}%` }} className="h-2 bg-indigo-500 transition-all" /></div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-3 gap-3">
//             <div className="md:col-span-2">
//               <div className="h-64 bg-white p-3 rounded overflow-auto shadow-inner">
//                 {events.length === 0 && <div className="text-sm text-neutral-500">No transcript yet. Start the agent to generate a session.</div>}
//                 <ul className="space-y-2">
//                   {events.map((ev, i) => {
//                     const color = (agents.find(a => a.id === ev.agent) || {}).color || '#cbd5e1';
//                     const isVerify = ev.kind === 'verification_result';
//                     return (
//                       <li key={i} onClick={() => setSelectedIdx(i)} className={`p-2 rounded border cursor-pointer ${selectedIdx === i ? 'ring-2 ring-indigo-300' : ''}`} style={{ borderLeft: `4px solid ${color}` }}>
//                         <div className="flex items-center justify-between">
//                           <div className="text-xs text-neutral-500">{new Date(ev.ts).toLocaleTimeString()} • {(agents.find(a => a.id === ev.agent) || {}).name || ev.agent}</div>
//                           {isVerify && <span className={`text-xxs px-2 py-0.5 rounded ${(ev.meta && ev.meta.ok) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{(ev.meta && ev.meta.ok) ? 'PASS' : 'FAIL'}</span>}
//                         </div>
//                         <div className="mt-1 text-sm">{showCoT || ev.kind !== 'thought' ? ev.text : <span className="text-neutral-400">(hidden)</span>}</div>
//                         {ev.meta && <div className="text-xs text-neutral-500 mt-1 overflow-hidden text-ellipsis">{JSON.stringify(ev.meta)}</div>}
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>

//               <div className="mt-3 flex items-center gap-2">
//                 {waitingChoice && candidates.map((c, idx) => (
//                   <button key={idx} onClick={() => { chooseCandidate(idx); track('agent_choice', { choice: c.label }); }} className="px-2 py-1 rounded-md border text-xs">{c.label} ({c.score})</button>
//                 ))}
//               </div>
//             </div>

//             <div className="md:col-span-1">
//               <div className="p-2 rounded border bg-white text-sm">
//                 <div className="font-semibold">Timeline</div>
//                 {timelineOpen ? (
//                   <div className="mt-2 text-xs text-neutral-600 h-56 overflow-auto">
//                     {events.map((ev, i) => (
//                       <div key={i} className="flex items-start gap-2 mb-2">
//                         <div className="w-10 text-right text-xs text-neutral-500">{new Date(ev.ts).toLocaleTimeString()}</div>
//                         <div className="flex-1">
//                           <div className="text-xs font-medium" style={{ color: (agents.find(a => a.id === ev.agent) || {}).color }}>{(agents.find(a => a.id === ev.agent) || {}).name || ev.agent}</div>
//                           <div className="text-sm">{ev.kind.toUpperCase()}: {ev.text}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : <div className="mt-2 text-xs text-neutral-500">Timeline hidden</div>}
//               </div>

//               <div className="mt-3 p-2 rounded border bg-white text-sm">
//                 <div className="font-semibold">Step Inspector</div>
//                 {selectedIdx === null ? (
//                   <div className="mt-2 text-xs text-neutral-500">Select a transcript row to see inputs, tool calls and outputs.</div>
//                 ) : (
//                   <StepInspector ev={events[selectedIdx]} />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="md:col-span-1 p-3 rounded border bg-neutral-50">
//           <div className="font-semibold mb-2">Live preview</div>
//           <LivePreview highlight={highlight} />
//           <div className="mt-3 text-xs text-neutral-500">Split view: left = process, right = UI highlights.</div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function StepInspector({ ev }: { ev: IEvent }) {
//   if (!ev) return null;
//   return (
//     <div className="text-xs">
//       <div><span className="text-neutral-500">Agent:</span> {ev.agent}</div>
//       <div className="mt-1"><span className="text-neutral-500">Kind:</span> {ev.kind}</div>
//       <div className="mt-1"><span className="text-neutral-500">Text:</span> {ev.text}</div>
//       {ev.meta && <pre className="mt-2 bg-neutral-50 p-2 rounded border overflow-auto">{JSON.stringify(ev.meta, null, 2)}</pre>}
//     </div>
//   );
// }

// function LivePreview({ highlight }: { highlight: string | null }) {
//   return (
//     <div className="space-y-2 text-sm">
//       <div className={`p-3 rounded border ${highlight === 'campaign-builder' ? 'ring-2 ring-indigo-400' : ''}`}>
//         <div className="font-medium">Campaign Builder</div>
//         <div className="text-neutral-500 text-xs">Agent is creating a campaign with selected audience & offer…</div>
//       </div>
//       <div className="p-3 rounded border">
//         <div className="font-medium">Dashboard KPIs</div>
//         <div className="text-neutral-500 text-xs">MRR and reactivations will update after action verification.</div>
//       </div>
//     </div>
//   );
// }

// function ImpactSummary() {
//   const [summary, setSummary] = useState({ revenue: 4220, retained: 11, optimized: 8 });
//   useEffect(() => {
//     const update = () => {
//       try {
//         if (typeof window === 'undefined') return;
//         const raw = localStorage.getItem(STORAGE_KEY) || '{}';
//         const obj = JSON.parse(raw);
//         const sim = Array.isArray(obj.simHistory) ? obj.simHistory : [];
//         const extraRevenue = Math.max(0, (obj.kpi?.mrr || 4200) - 4200);
//         const retained = sim.reduce((a: number, r: { reactivated: number; }) => a + (r.reactivated || 0), 0);
//         const optimized = Math.max(0, Math.min(50, Math.round(sim.filter((r: { type: string; }) => r && r.type).length)));
//         setSummary({ revenue: extraRevenue || 0, retained: retained || 0, optimized });
//       } catch { /* ignore */ }
//     };
//     update();
//     const id = setInterval(update, 1200);
//     return () => clearInterval(id);
//   }, []);
//   return (
//     <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-emerald-50 border text-sm">
//       <span className="font-medium">Emergefy</span> brought in <span className="font-semibold">${summary.revenue}</span> extra revenue this month, retained <span className="font-semibold">{summary.retained}</span> at-risk customers, and optimized <span className="font-semibold">{summary.optimized}</span> inventory orders — all automatically.
//     </div>
//   );
// }

// function LiveDashboard() {
//   const defaultKpi = { mrr: 4200, activePilots: 3, projectedLift: 12, last24: [5, 12, 8, 10, 6, 9, 7] };
//   const [kpi, setKpi] = useState(() => {
//     try { if (typeof window === "undefined") return defaultKpi; const raw = localStorage.getItem(STORAGE_KEY); if (raw) { const obj = JSON.parse(raw); return obj.kpi || defaultKpi; } } catch { /* ignore */ }
//     return defaultKpi;
//   });
//   useEffect(() => {
//     const id = setInterval(() => {
//       try {
//         if (typeof window === "undefined") return;
//         const raw = localStorage.getItem(STORAGE_KEY);
//         if (raw) {
//           const obj = JSON.parse(raw);
//           const sim = Array.isArray(obj.simHistory) ? obj.simHistory : [];
//           const last24 = sim.slice(0, 7).map((s: { reactivated: number; }) => Math.max(1, Math.round((s.reactivated || 0) / 10)));
//           const mrr = obj.kpi?.mrr || defaultKpi.mrr;
//           const activePilots = obj.kpi?.activePilots || defaultKpi.activePilots;
//           const projectedLift = 10 + Math.round((sim.reduce((a: number, b: { reactivated: number; }) => a + (b.reactivated || 0), 0) / 100) % 10);
//           setKpi({ mrr, activePilots, projectedLift, last24: last24.length ? last24 : defaultKpi.last24 });
//         }
//       } catch { /* ignore */ }
//     }, 1200);
//     return () => clearInterval(id);
//   }, [defaultKpi.activePilots, defaultKpi.last24, defaultKpi.mrr]);
//   return (
//     <section className="rounded-2xl border p-6 bg-neutral-50">
//       <div className="flex items-start justify-between gap-6">
//         <div>
//           <h3 className="text-lg font-semibold">Dashboard</h3>
//           <div className="text-xs text-neutral-500 mt-1">Snapshot of pilots, reactivations and demo revenue.</div>
//         </div>
//         <div className="flex gap-3">
//           <div className="p-3 rounded border bg-white text-sm text-center"><div className="text-xs text-neutral-500">MRR (demo)</div><div className="font-semibold mt-1">${kpi.mrr}</div></div>
//           <div className="p-3 rounded border bg-white text-sm text-center"><div className="text-xs text-neutral-500">Active pilots</div><div className="font-semibold mt-1">{kpi.activePilots}</div></div>
//           <div className="p-3 rounded border bg-white text-sm text-center"><div className="text-xs text-neutral-500">Projected lift</div><div className="font-semibold mt-1">{kpi.projectedLift}%</div></div>
//         </div>
//       </div>
//       <ImpactSummary />
//       <div className="mt-4 flex gap-4 items-center">
//         <div className="w-full md:w-2/3 p-4 rounded border bg-white"><div className="text-xs text-neutral-500">Reactivations (recent)</div><Sparkline values={Array.isArray(kpi.last24) ? kpi.last24 : defaultKpi.last24} /></div>
//         <div className="w-1/3 p-4 rounded border bg-white"><div className="text-xs text-neutral-500">Top performing pilot</div><div className="mt-2 font-semibold">Downtown Deli</div><div className="text-xs text-neutral-500">+18% reactivation</div></div>
//       </div>
//       <div className="mt-4 grid md:grid-cols-2 gap-4">
//         <div className="p-4 rounded border bg-white"><div className="font-semibold">Recent demo events</div><RecentEvents /></div>
//         <div className="p-4 rounded border bg-white"><div className="font-semibold">Demo tips</div><ul className="mt-2 text-sm space-y-2 text-neutral-600"><li>Show how offer sizing protects margin.</li><li>Highlight fast time-to-value (first reactivations in hours).</li><li>Emphasize owner control: approve before sending.</li></ul></div>
//       </div>
//     </section>
//   );
// }

// function RecentEvents() {
//   const [events, setEvents] = useState(() => {
//     try {
//       if (typeof window === "undefined") return [];
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (raw) return (JSON.parse(raw).simHistory || []).slice(0, 6);
//     } catch { /* ignore */ }
//     return [];
//   });
//   useEffect(() => {
//     const id = setInterval(() => {
//       try {
//         if (typeof window === "undefined") return;
//         const raw = localStorage.getItem(STORAGE_KEY);
//         if (raw) setEvents((JSON.parse(raw).simHistory || []).slice(0, 6));
//       } catch { /* ignore */ }
//     }, 1200);
//     return () => clearInterval(id);
//   }, []);
//   if (events.length === 0) return <div className="text-sm text-neutral-500 mt-2">No demo events yet — run the flow.</div>;
//   return (
//     <ul className="mt-2 space-y-2 text-sm">
//       {events.map((e: { id: React.Key | null | undefined; type: string; audience: number; time: number; reactivated: number; }) => (
//         <li key={e.id} className="flex items-center justify-between border rounded p-2">
//           <div>
//             <div className="font-medium">{e.type} • {e.audience} recipients</div>
//             <div className="text-xs text-neutral-500">{new Date(e.time).toLocaleString()} • {e.reactivated} react.</div>
//           </div>
//           <div className="text-xs text-neutral-600">ID {String(e.id).slice(-4)}</div>
//         </li>
//       ))}
//     </ul>
//   );
// }

// function Sparkline({ values }: { values: number[] }) {
//   const safeValues = Array.isArray(values) && values.length ? values : [0, 0, 0, 0, 0, 0, 0];
//   const w = 320;
//   const h = 60;
//   const max = Math.max(...safeValues) || 1;
//   const points = safeValues
//     .map((v, i) => `${(i / Math.max(1, safeValues.length - 1)) * w},${h - (v / max) * h}`)
//     .join(" ");
//   return (
//     <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-2 h-14">
//       <polyline fill="none" stroke="#6366f1" strokeWidth={2} points={points} strokeLinejoin="round" strokeLinecap="round" />
//       {safeValues.map((v, i) => (
//         <circle key={i} cx={(i / Math.max(1, safeValues.length - 1)) * w} cy={h - (v / max) * h} r={2.5} />
//       ))}
//     </svg>
//   );
// }

// function FlowDemo() {
//   const steps = [
//     { key: "connect", label: "Connect", detail: "Link POS or upload order CSV" },
//     { key: "audience", label: "Audience", detail: "Auto-segment guests by recency & spend" },
//     { key: "offer", label: "Offer", detail: "Pick smart, margin-safe offers" },
//     { key: "send", label: "Send", detail: "Schedule or autodeploy nudges" },
//     { key: "measure", label: "Measure", detail: "See lift and repeat visits" },
//   ];
//   const [active, setActive] = useState(1);
//   const [selectedSegment, setSelectedSegment] = useState("recent-lapsed");
//   const [selectedOffer, setSelectedOffer] = useState("10-off");
//   const [scheduling, setScheduling] = useState(() => ({ when: "In 1 hour", channel: "SMS" }));
//   const segments = useMemo(() => [
//     { id: "recent-lapsed", title: "Lapsed (30–60 days)", size: 120, estReact: 0.09 },
//     { id: "vip", title: "VIP frequent", size: 42, estReact: 0.12 },
//     { id: "low-value", title: "Low spenders", size: 220, estReact: 0.03 },
//   ], []);
//   const offers = useMemo(() => [
//     { id: "10-off", title: "10% off next order", marginImpact: -6, estLift: 0.08 },
//     { id: "bundle", title: "Meal bundle (save $3)", marginImpact: -3, estLift: 0.1 },
//     { id: "free-drink", title: "Free drink w/order $10+", marginImpact: -4, estLift: 0.06 },
//   ], []);

//   function previewMetrics() {
//     const seg = segments.find((s) => s.id === selectedSegment) || segments[0];
//     const off = offers.find((o) => o.id === selectedOffer) || offers[0];
//     const reactivated = Math.round(seg.size * Math.max(seg.estReact, off.estLift));
//     const revenue = Math.round(reactivated * 18);
//     return { reactivated, revenue, seg, off };
//   }

//   function approveAndSend() {
//     const { reactivated } = previewMetrics();
//     const seg = segments.find((s) => s.id === selectedSegment) || segments[0];
//     const record = { id: String(Date.now()), time: Date.now(), audience: seg.size, reactivated, type: selectedOffer || "unknown" };
//     try {
//       if (typeof window === "undefined") return;
//       const raw = localStorage.getItem(STORAGE_KEY) || "{}";
//       const obj = JSON.parse(raw);
//       obj.simHistory = Array.isArray(obj.simHistory) ? obj.simHistory : [];
//       obj.simHistory.unshift(record);
//       obj.simHistory = obj.simHistory.slice(0, 20);
//       obj.kpi = obj.kpi || { mrr: 4200, activePilots: 3 };
//       obj.kpi.mrr = Math.max(4200, (obj.kpi.mrr || 4200) + Math.round(reactivated * 2));
//       obj.kpi.activePilots = Math.min(10, (obj.kpi.activePilots || 3));
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
//       track("flow_approve_send", { segment: selectedSegment, offer: selectedOffer, reactivated });
//       if (typeof document !== "undefined") {
//         const el = document.createElement("div");
//         el.textContent = `Scheduled — est reactivations: ${reactivated}`;
//         el.className = "fixed right-4 bottom-6 bg-neutral-900 text-white px-4 py-2 rounded shadow";
//         document.body.appendChild(el);
//         setTimeout(() => { try { document.body.removeChild(el); } catch { /* ignore */ } }, 2600);
//       }
//     } catch { /* ignore */ }
//   }

//   function renderContent() {
//     const { reactivated, revenue, seg, off } = previewMetrics();
//     switch (active) {
//       case 0: return <div>Connect your data source. This can be a POS system or a CSV file of orders.</div>;
//       case 1: return (
//         <div>
//           <div className="font-medium mb-2">Select audience</div>
//           {segments.map((s) => (
//             <label key={s.id} className="flex items-center gap-2 p-2 border rounded mb-2">
//               <input type="radio" name="segment" value={s.id} checked={selectedSegment === s.id} onChange={(e) => setSelectedSegment(e.target.value)} />
//               <span>{s.title} ({s.size} guests)</span>
//             </label>
//           ))}
//         </div>
//       );
//       case 2: return (
//         <div>
//           <div className="font-medium mb-2">Select offer</div>
//           {offers.map((o) => (
//             <label key={o.id} className="flex items-center gap-2 p-2 border rounded mb-2">
//               <input type="radio" name="offer" value={o.id} checked={selectedOffer === o.id} onChange={(e) => setSelectedOffer(e.target.value)} />
//               <span>{o.title} (lift {Math.round(o.estLift * 100)}%)</span>
//             </label>
//           ))}
//         </div>
//       );
//       case 3: return (
//         <div>
//           <div className="font-medium mb-2">Schedule</div>
//           <select value={scheduling.when} onChange={(e) => setScheduling(s => ({ ...s, when: e.target.value }))} className="w-full p-2 border rounded mb-2">
//             <option>In 1 hour</option>
//             <option>Tomorrow at 9am</option>
//             <option>Next Monday</option>
//           </select>
//           <select value={scheduling.channel} onChange={(e) => setScheduling(s => ({ ...s, channel: e.target.value }))} className="w-full p-2 border rounded">
//             <option>SMS</option>
//             <option>Email</option>
//           </select>
//         </div>
//       );
//       case 4: return (
//         <div>
//           <div className="font-medium mb-2">Review & Send</div>
//           <div className="p-3 rounded border bg-neutral-50 text-sm">
//             <div>To: <span className="font-semibold">{seg.title}</span> ({seg.size} guests)</div>
//             <div>Offer: <span className="font-semibold">{off.title}</span></div>
//             <div>Est. reactivations: <span className="font-semibold">{reactivated}</span></div>
//             <div>Est. revenue: <span className="font-semibold">${revenue}</span></div>
//           </div>
//           <button onClick={approveAndSend} className="mt-3 w-full px-3 py-2 rounded-md bg-indigo-600 text-white">Approve & Send</button>
//         </div>
//       );
//       default: return null;
//     }
//   }

//   return (
//     <section className="rounded-2xl border p-6 bg-white">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-semibold">Campaign Builder</h3>
//           <div className="text-xs text-neutral-500">5-step flow to create and measure a campaign.</div>
//         </div>
//       </div>
//       <div className="mt-4 grid md:grid-cols-3 gap-4">
//         <div className="md:col-span-1">
//           <div className="space-y-2">
//             {steps.map((s, i) => (
//               <div key={s.key} className={`p-3 rounded border cursor-pointer ${active === i ? 'bg-indigo-50' : ''}`} onClick={() => setActive(i)}>
//                 <div className="font-semibold">{s.label}</div>
//                 <div className="text-xs text-neutral-500">{s.detail}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="md:col-span-2 p-4 rounded border bg-neutral-50">
//           {renderContent()}
//         </div>
//       </div>
//     </section>
//   );
// }

// function wait(ms: number) { return new Promise((res) => setTimeout(res, ms)); }