import raw from "@/data/counties.json";
import type { CountyData, County } from "./types";

const data = raw as CountyData;

export const national = data.national;
export const meta = data.meta;

/** Åland is carried in the data but excluded from rankings and headline figures. */
export const counties: County[] = data.counties;

export const rankedByNeed: County[] = counties
  .filter((c) => !c.tooSmall && c.need !== null)
  .sort((a, b) => (b.need as number) - (a.need as number));

export const DEFAULT_COUNTY = "kainuu";

export function getCounty(slug: string): County {
  return counties.find((c) => c.slug === slug) ?? rankedByNeed[0];
}

export function comparatorFor(county: County): County {
  // The closest match on the need index that is not the pilot site itself and
  // has no existing direct-CT route, so it can act as an untouched control.
  const pool = rankedByNeed.filter(
    (c) => c.slug !== county.slug && !c.hasPrecedent,
  );
  return pool.reduce((best, c) =>
    Math.abs((c.need as number) - (county.need as number)) <
    Math.abs((best.need as number) - (county.need as number))
      ? c
      : best,
  );
}
