"use client";

import { useEffect, useRef, useState } from "react";

// Liwi — the Liwe mascot. A fluffy little helper that hops in the corner and opens a chat.
// The chat is scripted for now (no API): it answers the common questions from a small playbook.

/** fluffy outline: an ellipse made of little tufts */
function fluff(cx: number, cy: number, rx: number, ry: number, tufts: number, puff: number) {
  let d = "";
  for (let i = 0; i <= tufts; i++) {
    const a = (i / tufts) * Math.PI * 2 - Math.PI / 2;
    const x = cx + rx * Math.cos(a);
    const y = cy + ry * Math.sin(a);
    if (i === 0) {
      d += `M${x.toFixed(1)} ${y.toFixed(1)}`;
      continue;
    }
    const m = a - Math.PI / tufts;
    const qx = cx + rx * puff * Math.cos(m);
    const qy = cy + ry * puff * Math.sin(m);
    d += `Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + "Z";
}
const BODY = fluff(50, 58, 34, 31, 26, 1.13);
const INNER = fluff(50, 60, 26, 23, 20, 1.1);

export function Liwi({ className = "", happy = false }: { className?: string; happy?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {/* sprout */}
      <path d="M50 30 C50 22 50 18 51 14" stroke="#1f8a5c" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M51 16 C44 6 33 8 32 13 C38 19 46 19 51 16Z" fill="#1f8a5c" />
      <path d="M51 15 C56 5 67 6 68 11 C63 18 55 18 51 15Z" fill="#9fd0b4" />
      {/* feet */}
      <ellipse cx="37" cy="90" rx="8" ry="4.5" fill="#3f9a6d" />
      <ellipse cx="63" cy="90" rx="8" ry="4.5" fill="#3f9a6d" />
      {/* body */}
      <path d={BODY} fill="#5fb488" />
      <path d={INNER} fill="#7cc79f" />
      <ellipse cx="50" cy="76" rx="14" ry="9.5" fill="#f6ead8" />
      {/* little arms */}
      <ellipse cx="17" cy="67" rx="5" ry="8.5" fill="#5fb488" transform="rotate(28 17 67)" />
      <ellipse cx="83" cy="67" rx="5" ry="8.5" fill="#5fb488" transform="rotate(-28 83 67)" />
      {/* eyes */}
      {[38, 62].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="50" rx="5.2" ry="6" fill="#1d2b25">
            <animate attributeName="ry" values="6;6;0.6;6;6" keyTimes="0;0.9;0.94;0.98;1" dur="4.2s" repeatCount="indefinite" />
          </ellipse>
          <circle cx={x + 1.8} cy="47.6" r="1.7" fill="#fff">
            <animate attributeName="opacity" values="1;1;0;1;1" keyTimes="0;0.9;0.94;0.98;1" dur="4.2s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* cheeks */}
      <ellipse cx="30" cy="58" rx="4.5" ry="2.8" fill="#f4a08c" opacity="0.85" />
      <ellipse cx="70" cy="58" rx="4.5" ry="2.8" fill="#f4a08c" opacity="0.85" />
      {/* mouth */}
      {happy ? (
        <path d="M44.5 57.5 Q50 65 55.5 57.5 Z" fill="#1d2b25" />
      ) : (
        <path d="M45 58 Q50 62.5 55 58" stroke="#1d2b25" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

type Msg = { from: "liwi" | "you"; text: string };

const SUGGESTIONS = ["Why does the first door matter?", "What does the endpoint mean?", "Where does the data come from?", "How do I make a plan?"];

const PLAYBOOK: { keys: string[]; answer: string }[] = [
  {
    keys: ["door", "occupational", "public health", "first door"],
    answer:
      "At a public health centre a chest CT usually waits for a specialist referral; a GP referral is enough in occupational or private care. Acta Oncologica 2025 found only one Finnish respondent with CT access from primary care, the lowest in the Nordics. A lymphoma study, not lung cancer, saw 76 versus 127 days from symptoms to treatment (Kuitunen et al. 2026, n=160). Nobody publishes that gap for lung cancer.",
  },
  {
    keys: ["endpoint", "day", "count", "calculat", "number", "target"],
    answer:
      "The pilot target is a median of 10 days or less from the symptomatic GP visit to the CT report. I also show cost per person scanned, cost per cancer on the fast CT route, and what share of the county's chest CT the route would use. I do not estimate deaths avoided. Open a plan and scroll to “How this plan is calculated”.",
  },
  {
    keys: ["data", "source", "where", "kanta", "record", "connect"],
    answer:
      "Estimates come from public data: Statistics Finland, NORDCAN, Finnish studies on waiting times and the Tyks price list. A live Actual view would take a weekly aggregate from the county's own reporting (Lifecare, Omni360, Apotti or Esko). Until then the charts are mock data.",
  },
  {
    keys: ["plan", "create", "new", "start", "how do i"],
    answer: "Click “New plan” in the menu: pick a county, set how many chest-CT scans a week you'll reserve, your budget and staff. The panel on the right shows what that buys while you type. 🌱",
  },
  {
    keys: ["worth", "money", "cost", "price", "euro", "€", "budget"],
    answer:
      "Each plan shows cost per person scanned and cost per cancer on the fast CT route. The badge says whether the visit-to-CT clock is within 10 days and inside capacity. I do not estimate deaths avoided. Enter real supplier prices in the Investments table and the costs recalculate.",
  },
  {
    keys: ["actual", "track", "real", "estimate"],
    answer: "Flip a plan from Estimate to Actual. The charts are mock weekly totals: pathways started, median days to the CT report, scans used, and spend.",
  },
  {
    keys: ["scan", "ct", "slot", "radiolog"],
    answer: "A scan slot is one chest CT a week reserved for the family-doctor route. More slots reach more patients, until there are no more cancers left to find — the plan builder tells you where that point is for each county.",
  },
  { keys: ["hi", "hello", "hey", "ahoj", "moi"], answer: "Hi, I'm Liwi. I can explain the public-door CT pilot, the 10-day target, or how to make a plan." },
  { keys: ["who are you", "name", "liwi"], answer: "I'm Liwi. I explain the Liwe county pilot: who can order the CT, how long it takes, and what the weekly report measures." },
];

function reply(q: string) {
  const words = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const hit = PLAYBOOK.find((p) => p.keys.some((k) => (k.includes(" ") ? q.toLowerCase().includes(k) : words.includes(k))));
  return hit?.answer ?? "I only answer questions about the Liwe county pilot. Ask about the public-door CT wait, the 10-day target, or how to make a plan.";
}

export function Mascot() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "liwi", text: "Hi, I'm Liwi! 🌱 Want help with your plan or the numbers?" }]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = setTimeout(() => setHint(true), 2500);
    const hide = setTimeout(() => setHint(false), 9000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question) return;
    const history = msgs.slice(-8).map((m) => ({ from: m.from, text: m.text }));
    setMsgs((m) => [...m, { from: "you", text: question }]);
    setText("");
    setTyping(true);
    let answer = reply(question);
    try {
      const res = await fetch("/api/liwi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });
      const data = (await res.json()) as { answer?: string };
      if (res.ok && data.answer) answer = data.answer;
    } catch {
      /* keep the short local answer */
    }
    setTyping(false);
    setMsgs((m) => [...m, { from: "liwi", text: answer }]);
  };

  return (
    <div className="no-print">
      {open && (
        <div className="fixed right-4 bottom-28 z-50 flex max-h-[min(34rem,calc(100dvh-9rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-rule bg-paper shadow-[0_30px_70px_-30px_rgb(29_43_37/0.5)]" role="dialog" aria-label="Chat with Liwi">
          <div className="flex items-center gap-3 border-b border-rule bg-accent-soft px-4 py-3">
            <Liwi className="h-10 w-10" happy />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">Liwi</p>
              <p className="text-xs text-ink-faint">Liwe helper</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-paper" aria-label="Close chat">
              ✕
            </button>
          </div>
          <div ref={list} className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <p key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${m.from === "liwi" ? "rounded-bl-md bg-sand-soft text-ink" : "ml-auto rounded-br-md bg-accent text-paper"}`}>
                {m.text}
              </p>
            ))}
            {typing && (
              <p className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-sand-soft px-3.5 py-3" aria-label="Liwi is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="liwi-dot h-1.5 w-1.5 rounded-full bg-ink-faint" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </p>
            )}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-accent/40 px-3 py-1.5 text-left text-xs font-semibold text-accent hover:bg-accent-soft">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            className="flex gap-2 border-t border-rule p-3"
            onSubmit={(e) => {
              e.preventDefault();
              ask(text);
            }}
          >
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Liwi…" className="min-w-0 flex-1 rounded-full border border-rule px-4 py-2 text-sm text-ink outline-none focus:border-accent" />
            <button type="submit" className="cta bg-accent px-4 py-2 text-sm text-paper" aria-label="Send">
              ↳
            </button>
          </form>
        </div>
      )}

      <div className="liwi-wander fixed right-4 bottom-3 z-50">
        {hint && !open && (
          <button type="button" onClick={() => setOpen(true)} className="liwi-pop absolute right-14 bottom-[4.6rem] w-max max-w-48 rounded-2xl rounded-br-md bg-paper px-3 py-2 text-left text-sm font-semibold text-ink shadow-lg">
            Need a hand? 🌱
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o);
            setHint(false);
          }}
          className="liwi-hop block h-[5.5rem] w-[5.5rem] cursor-pointer drop-shadow-[0_10px_12px_rgb(29_43_37/0.25)] focus-visible:outline-offset-4"
          aria-label={open ? "Close chat with Liwi" : "Chat with Liwi, the Liwe helper"}
        >
          <Liwi className="h-full w-full" happy={open} />
        </button>
        <span className="liwi-shadow pointer-events-none absolute bottom-0.5 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-ink/15 blur-[2px]" />
      </div>
    </div>
  );
}
