import raw from "@/data/sources.json";

export type SourceRecord = {
  id: string;
  category: string;
  title: string;
  url: string | null;
  publisher: string;
  accessed: string | null;
  notes: string;
};

type SourcesFile = {
  meta: Record<string, string>;
  sources: SourceRecord[];
};

const data = raw as SourcesFile;

export const sourcesMeta = data.meta;
export const sources: SourceRecord[] = data.sources;

export function sourcesByCategory(): Record<string, SourceRecord[]> {
  return sources.reduce<Record<string, SourceRecord[]>>((acc, s) => {
    const key = s.category || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
}
