import type { Metadata } from "next";

export const metadata: Metadata = { title: "Logo concepts: Liwe", robots: { index: false } };

// Ten mark concepts, each drawn in a 64×64 box. svg(c, c2, c3) returns the inner SVG markup.
const G = '#1f8a5c', MINT = '#c9e3d4', SAND = '#e6d3b8', CORAL = '#e9785f';
const LOGOS: { name: string; idea: string; svg: (c: string, c2: string, c3: string) => string }[] = [
  {
    name: 'Leaf lungs',
    idea: 'Two leaves meeting at one stem read as a pair of lungs — breath and growth in one calm shape.',
    svg: (c, c2) => `<path d="M32 10v14" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M29.5 22C14 22 7 36 9.5 52c14 2.5 22-9 20-30z" fill="${c}"/>
      <path d="M34.5 22C50 22 57 36 54.5 52c-14 2.5-22-9-20-30z" fill="${c2}"/>`,
  },
  {
    name: 'Breath wave',
    idea: 'The “w” of Liwe drawn as one soft breath — in, out, in. Works as a single stroke at any size.',
    svg: (c) => `<path d="M7 24c7 0 8 18 13 18s6-18 12-18 7 18 12 18 6-18 13-18" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    name: 'Early sun',
    idea: 'A sun clearing the horizon: catching things early, a new start. The simplest mark in the set.',
    svg: (c, c2) => `<path d="M14 40a18 18 0 0 1 36 0z" fill="${c}"/>
      <rect x="8" y="44" width="48" height="5" rx="2.5" fill="${c2}"/>`,
  },
  {
    name: 'Sprout',
    idea: 'A seedling growing out of the “i” — life getting a head start. Friendly, optimistic, very memorable.',
    svg: (c, c2) => `<rect x="29" y="28" width="6" height="26" rx="3" fill="${c}"/>
      <path d="M32 30C32 18 22 12 12 14c0 10 8 16 20 16z" fill="${c}"/>
      <path d="M32 26c0-10 9-15 19-13 0 9-8 13-19 13z" fill="${c2}"/>`,
  },
  {
    name: 'Together',
    idea: 'Two circles overlapping — patient and doctor, “li” and “we”. The shared middle is where care happens.',
    svg: (c, c2, c3) => `<circle cx="24" cy="32" r="16" fill="${c2}"/>
      <circle cx="40" cy="32" r="16" fill="${c}" fill-opacity=".85"/>
      <path d="M32 18.1a16 16 0 0 1 0 27.8 16 16 0 0 1 0-27.8z" fill="${c3}"/>`,
  },
  {
    name: 'Shortcut',
    idea: 'The long way round (dotted) and the short way (solid) between two points — exactly what Liwe does to the path to diagnosis.',
    svg: (c, c2, c3) => `<path d="M14 46C14 14 50 14 50 46" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 7"/>
      <path d="M14 46h36" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="14" cy="46" r="6" fill="${c3}"/><circle cx="50" cy="46" r="6" fill="${c}"/>`,
  },
  {
    name: 'Pebble l',
    idea: 'A smooth pebble with the “l” carved out of it. Organic, calm, and stands alone as an app icon.',
    svg: (c, c2) => `<path d="M33 8c14 0 24 9 24 23 0 15-11 25-26 25S7 47 8 32C9 18 19 8 33 8z" fill="${c}"/>
      <rect x="28.5" y="19" width="7" height="26" rx="3.5" fill="${c2}"/>`,
  },
  {
    name: 'Air',
    idea: 'A point of breath with two rings spreading out — fresh air, and news travelling faster.',
    svg: (c, c2) => `<circle cx="18" cy="32" r="7" fill="${c}"/>
      <path d="M30 19a18 18 0 0 1 0 26" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <path d="M41 12a28 28 0 0 1 0 40" fill="none" stroke="${c2}" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    name: 'Rising dots',
    idea: 'Three dots climbing like bubbles of air — or a chart going the right way. Reads as progress at a glance.',
    svg: (c, c2, c3) => `<circle cx="16" cy="46" r="7" fill="${c3}"/>
      <circle cx="32" cy="34" r="8" fill="${c2}"/>
      <circle cx="48" cy="20" r="9" fill="${c}"/>`,
  },
  {
    name: 'Open door',
    idea: 'A rounded arch with a light inside — care that is open to everyone, the way in made easier.',
    svg: (c, c2) => `<path d="M14 54V30a18 18 0 0 1 36 0v24" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="32" cy="34" r="6" fill="${c2}"/>
      <rect x="8" y="51" width="48" height="5" rx="2.5" fill="${c}"/>`,
  },
];

function Svg({ markup, className }: { markup: string; className: string }) {
  return <svg viewBox="0 0 64 64" className={className} aria-hidden dangerouslySetInnerHTML={{ __html: markup }} />;
}

export default function LogosPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl text-ink">Liwe: 10 logo concepts</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Same palette as the app: green as the lead, beige and coral as accents, Figtree for the wordmark.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LOGOS.map((l, i) => {
          const color = l.svg(G, i === 2 ? SAND : MINT, i === 5 || i === 8 ? CORAL : "#9fd0b4");
          const light = l.svg("#ffffff", "rgba(255,255,255,.55)", "rgba(255,255,255,.8)");
          return (
            <article key={l.name} className="overflow-hidden rounded-3xl border border-rule bg-paper shadow-[0_20px_50px_-34px_rgb(29_43_37/0.35)]">
              <div className="flex items-center gap-5 p-6">
                <div className="grid h-24 w-24 flex-none place-items-center rounded-3xl bg-sand-soft">
                  <Svg markup={color} className="h-16 w-16" />
                </div>
                <div className="flex items-center gap-2.5">
                  <Svg markup={color} className="h-9 w-9 flex-none" />
                  <span className="text-[2.4rem] font-[750] leading-none tracking-[-0.035em] text-ink">liwe</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-accent px-6 py-4 text-white">
                <Svg markup={light} className="h-7 w-7" />
                <span className="text-[1.7rem] font-[750] leading-none tracking-[-0.035em]">liwe</span>
              </div>
              <div className="border-t border-rule px-6 py-5">
                <span className="text-sm font-semibold text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-0.5 font-semibold text-ink">{l.name}</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{l.idea}</p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
