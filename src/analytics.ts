// src/analytics.ts

// ---- Types (no `any`) ----
type ConsentVerb = "update" | "default";
type GAParamsValue = string | number | boolean | null | undefined;
export type GAParams = Record<string, GAParamsValue>;

type GtagArgs =
  | ["js", Date]
  | ["config", string, GAParams?]
  | ["event", string, GAParams?]
  | ["consent", ConsentVerb, Record<string, string>];

type GtagFn = (...args: GtagArgs) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

// ---- Safe gtag wrapper ----
function gtagSafe(...args: GtagArgs): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
    return;
  }
  // Queue until gtag.js is ready
  if (typeof window !== "undefined") {
    (window.dataLayer = window.dataLayer || []).push(args as unknown);
  }
}

// ---- Public API ----

/** Fire a GA4 event with strongly-typed params (no `any`). */
export function track(action: string, params: GAParams = {}): void {
  const payload: GAParams = {
    // Conventional fields used in our simulation
    event_category: params["event_category"] ?? (params["category"] as GAParamsValue),
    event_label:
      (params["event_label"] as GAParamsValue) ??
      (params["label"] as GAParamsValue) ??
      (params["location"] as GAParamsValue) ??
      (params["href"] as GAParamsValue),
    value: typeof params["value"] === "number" ? params["value"] : undefined,
    non_interaction:
      (params["non_interaction"] as GAParamsValue) ??
      (params["nonInteraction"] as GAParamsValue),
    // Spread the rest (keeps everything typed as GAParamsValue)
    ...params,
  };

  gtagSafe("event", action, payload);
}

/** One-time section impression when element is ≥40% visible. */
export function observeSection(el: HTMLElement, id: string): () => void {
  const attr = `data-seen-${id}`;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const already = el.getAttribute(attr) === "1";
        if (e.isIntersecting && e.intersectionRatio >= 0.4 && !already) {
          el.setAttribute(attr, "1");
          track("section_view", {
            event_category: "Scroll",
            event_label: id,
            non_interaction: true,
          });
        }
      }
    },
    { threshold: [0.4] }
  );
  io.observe(el);
  return () => io.disconnect();
}

// /** Optional: persist first-touch UTM params for later forms/CRM. */
// export function persistUTM(): void {
//   const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
//   const q = new URLSearchParams(location.search);
//   let changed = false;

//   for (const k of KEYS) {
//     const v = q.get(k);
//     if (v && !localStorage.getItem(k)) {
//       localStorage.setItem(k, v);
//       changed = true;
//     }
//   }

//   if (changed) {
//     const blob: Record<string, string> = {};
//     for (const k of KEYS) {
//       const v = localStorage.getItem(k);
//       if (v) blob[k] = v;
//     }
//     localStorage.setItem("utm_blob", JSON.stringify(blob));
//   }
// }

/** (Optional) Consent helper if you need to toggle analytics on/off later. */
export function setAnalyticsConsent(granted: boolean): void {
  const update: Record<string, string> = {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  gtagSafe("consent", "update", update);
}

// src/analytics.ts
export type UTMMap = Partial<
  Record<
    "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content",
    string
  >
>;

const UTM_KEYS: Array<keyof UTMMap> = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export function persistUTM(loc: Location = window.location): void {
  const params = new URLSearchParams(loc.search);
  const utm: UTMMap = {};
  let hasAny = false;

  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) {
      utm[k] = v;
      hasAny = true;
    }
  });

  // Only overwrite if present in URL; otherwise keep previous first-touch.
  if (hasAny) {
    localStorage.setItem("utm_blob", JSON.stringify(utm));
  }
}

export function readUTM(): UTMMap {
  try {
    const raw = localStorage.getItem("utm_blob");
    return raw ? (JSON.parse(raw) as UTMMap) : {};
  } catch {
    return {};
  }
}
