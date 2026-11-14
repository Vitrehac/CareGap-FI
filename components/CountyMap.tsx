"use client";

import { counties } from "@/lib/data";
import type { County } from "@/lib/types";

const CAPACITY_CEILING = 8;

type Props = {
  selected: string;
  onSelect: (slug: string) => void;
  className?: string;
};

export function CountyMap({ selected, onSelect, className = "" }: Props) {
  const selectable = counties.filter((c) => !c.tooSmall);

  return (
    <div className={className}>
      <svg
        viewBox="250 0 520 1000"
        role="img"
        aria-label="Wellbeing services counties map. Click a county to select it."
        className="h-auto w-full max-h-[28rem]"
      >
        {selectable.map((c) => {
          const active = c.slug === selected;
          const blocked = c.ctPerWeekEst > CAPACITY_CEILING;
          return (
            <path
              key={c.slug}
              d={c.path}
              tabIndex={0}
              role="button"
              aria-pressed={active}
              aria-label={`${c.name}, about ${c.ctPerWeekEst.toFixed(1)} extra CT scans per week${blocked ? ", over the safe limit" : ""}`}
              onClick={() => onSelect(c.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(c.slug);
                }
              }}
              className={`cursor-pointer stroke-paper stroke-[2] transition-[fill,opacity] duration-200 outline-none focus-visible:stroke-ink focus-visible:stroke-[3] ${
                active
                  ? blocked
                    ? "fill-alarm"
                    : "fill-accent"
                  : blocked
                    ? "fill-[#f3c4b8] hover:fill-[#e9a493]"
                    : "fill-[#c9e3d4] hover:fill-[#9fd0b4]"
              }`}
            />
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-ink-faint">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" />
          Your county
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#f3c4b8]" />
          Over the safe limit (8 extra scans a week)
        </span>
      </div>
    </div>
  );
}

export function capacityBlocked(county: County, ceiling = CAPACITY_CEILING) {
  return county.ctPerWeekEst > ceiling;
}

export { CAPACITY_CEILING };
