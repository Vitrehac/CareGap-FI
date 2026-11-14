import Link from "next/link";
import { People } from "@/components/People";
import { Tip } from "@/components/mithril/Tip";

const NORDIC_MEN = [
  { country: "Sweden", value: 31.3 },
  { country: "Norway", value: 30.8 },
  { country: "Iceland", value: 29.0 },
  { country: "Denmark", value: 28.1 },
  { country: "Finland", value: 17.9 },
];

const STEPS = [
  {
    n: "1",
    t: "Plan",
    d: "Pick a county, how far you want to go, your budget, scanners and staff. Liwe works out what that buys.",
  },
  {
    n: "2",
    t: "Decide",
    d: "See what it costs, how many days it saves and whether it meets the pilot target.",
  },
  {
    n: "3",
    t: "Track",
    d: "Once it runs, weekly pathway reports flow in from the county’s own reporting. Compare what happens with the plan and with doing nothing.",
  },
];

export function HomeCockpit() {
  return (
    <div>
      <section className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col justify-center border-b border-rule py-16">
        <div className="pointer-events-none absolute inset-y-0 right-[-1rem] hidden w-[44%] items-center lg:flex" aria-hidden>
          <People className="w-full" />
        </div>
        <div className="relative max-w-2xl">
          <p className="label inline-flex rounded-full bg-accent-soft px-3 py-1.5 text-accent">For wellbeing-services counties in Finland</p>
          <h1 className="font-display mt-6 text-[clamp(2.6rem,6vw,4.75rem)] text-ink">
            Same symptoms, different door, different wait.
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-snug text-ink-soft">
            Finland&apos;s 2026 lung pathway targets apply to every door. Liwe helps a county close the gap at the public one, and measure it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/dashboard" className="cta bg-accent px-6 py-3.5 text-paper">
              Open the dashboard
            </Link>
            <Link href="/sources" className="hack border border-rule px-6 py-3.5 text-ink-soft">
              Where the numbers come from
            </Link>
          </div>
          <People className="mt-10 w-full max-w-sm lg:hidden" />
        </div>
      </section>

      <section className="grid gap-10 border-b border-rule py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] text-ink">The problem</h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
            In Satakunta in 2021–22, one study measured about 14 days from the first GP visit to referral and 55 days from referral to diagnosis. A family doctor usually cannot order the chest CT. Nobody has published whether Satakunta’s direct-CT change worked.
          </p>
        </div>
        <div>
          <p className="text-sm text-ink-soft">
            <Tip align="left" title="5-year relative survival" body="Out of 100 men diagnosed with lung cancer (2020–2024), how many are alive 5 years later, after removing deaths from other causes. Source: NORDCAN.">
              Men alive 5 years after a lung-cancer diagnosis, per 100
            </Tip>
          </p>
          <ul className="mt-4 space-y-2.5">
            {NORDIC_MEN.map((c) => {
              const fi = c.country === "Finland";
              return (
                <li key={c.country} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3">
                  <span className={`text-sm ${fi ? "font-semibold text-ink" : "text-ink-soft"}`}>{c.country}</span>
                  <span className="h-3.5 rounded-r-[4px]" style={{ width: `${(c.value / 32) * 100}%`, background: fi ? "#d4553f" : "#b7d6c4" }} />
                  <span className={`text-right text-sm ${fi ? "font-semibold text-ink" : "text-ink-soft"}`}>{c.value.toFixed(1)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-b border-rule py-16">
        <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] text-ink">Two doors</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">The public door hasn&apos;t caught up. This is about the rule at the health centre, not about private care being unfair.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl border border-rule bg-paper p-6">
            <p className="label text-ink-faint">Door A · occupational or private care</p>
            <p className="mt-3 text-lg text-ink">A GP referral is enough for a chest CT.</p>
          </article>
          <article className="rounded-3xl border border-rule bg-paper p-6">
            <p className="label text-accent">Door B · public health centre</p>
            <p className="mt-3 text-lg text-ink">CT usually only after referral to specialist care. Health centres can order a chest X-ray, not a CT.</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Acta Oncologica 2025: only one Finnish respondent reported CT access from primary care, the lowest in the Nordics. Sourced.
            </p>
          </article>
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-faint">
          Lymphoma, not lung cancer. In one Finnish study the median from symptoms to treatment was 76 days after a private or occupational first contact and 127 days after a public primary-care appointment (Kuitunen et al. 2026, Cancer Medicine, n=160, 2014–2020). Sourced.
        </p>
        <p className="mt-3 font-semibold text-ink">Nobody publishes this gap for lung cancer.</p>
      </section>

      <section className="py-16">
        <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] text-ink">How Liwe works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-3xl border border-rule bg-paper p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft font-semibold text-accent">{s.n}</span>
              <p className="font-display mt-4 text-2xl text-ink">{s.t}</p>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.d}</p>
            </li>
          ))}
        </ol>
        <Link href="/dashboard/new" className="cta mt-10 inline-block bg-accent px-6 py-3.5 text-paper">
          Create a plan
        </Link>
      </section>
    </div>
  );
}
