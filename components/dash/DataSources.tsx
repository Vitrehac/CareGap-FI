import { Card, Page } from "./ui";

type Source = {
  name: string;
  owner: string;
  gives: string;
  access: string;
  lag: string;
  role: "primary" | "context" | "outcome";
  status: "demo" | "not-connected";
  links: { label: string; url: string }[];
};

const SOURCES: Source[] = [
  {
    name: "The county's own patient record system",
    owner: "Wellbeing-services county (data controller)",
    gives: "Every step of each patient's pathway: GP visit, CT order, CT result, referral, diagnosis code (C34). This is the feed the Actual view needs.",
    access: "Lifecare (≈ 61% of organisations), Omni360, Apotti (built on Epic) or Esko. Read via the system's reporting database or its FHIR API; Liwe receives pseudonymised dates and codes only.",
    lag: "Daily",
    role: "primary",
    status: "demo",
    links: [
      { label: "EHR market in Finland (Springer 2026)", url: "https://link.springer.com/chapter/10.1007/978-3-032-28812-7_4" },
      { label: "Oulu thesis on EHR vendors", url: "https://oulurepo.oulu.fi/bitstream/handle/10024/64176/nbnfioulu-202606305025.pdf?sequence=1&isAllowed=y" },
    ],
  },
  {
    name: "Kanta — Patient Data Repository",
    owner: "Kela",
    gives: "The national archive every provider must store records in. The complete record, but stored as documents (HL7 CDA R2).",
    access: "A FHIR search interface exists for wellbeing apps acting for one patient. Population use goes through secondary-use permits, which take time.",
    lag: "Near real time (archive); months for permits",
    role: "context",
    status: "not-connected",
    links: [
      { label: "Kanta: FHIR search interface", url: "https://www.kanta.fi/tiedote/-/asset_publisher/cf6QCnduV1x6/content/potilastietojen-luovutus-hyvinvointisovelluksille-toteutetaan-fhir-hakurajapinnalla" },
      { label: "Kanta FHIR roadmap", url: "https://www.kanta.fi/documents/portlet_file_entry/20143/8.+Kanta+FHIR+kehitt%C3%A4misen+tilanne+ja+tiekartan+suunnittelun+yhteisty%C3%B6.pdf/78e085e8-0107-6905-db0e-0c51f1f84729" },
    ],
  },
  {
    name: "THL registers — Avohilmo and primary-care access",
    owner: "Finnish Institute for Health and Welfare (THL)",
    gives: "Primary-care visits from every health centre and how long people wait for a GP — the baseline for the GP-wait lever.",
    access: "Aggregated open statistics; record-level data via Findata.",
    lag: "Monthly",
    role: "context",
    status: "not-connected",
    links: [{ label: "THL: Kanta secondary use", url: "https://yhteistyotilat.fi/wiki08/download/attachments/152096290/2024-02-15%20Kanta-toisiok%C3%A4ytt%C3%B6_L%C3%A4hdesm%C3%A4ki_KA-ryhm%C3%A4.pdf?version=1&modificationDate=1707978208756&api=v2" }],
  },
  {
    name: "Finnish Cancer Registry",
    owner: "Cancer Society of Finland / THL",
    gives: "Confirmed diagnoses, stage and survival — the final check of whether earlier diagnosis saved lives, and a control group of counties without the plan.",
    access: "Aggregated statistics openly; record-level data via a Findata permit.",
    lag: "1–2 years",
    role: "outcome",
    status: "not-connected",
    links: [{ label: "Finnish Cancer Registry", url: "https://syoparekisteri.fi/" }],
  },
  {
    name: "Findata",
    owner: "Social and Health Data Permit Authority",
    gives: "One permit for data from several controllers (Kanta, THL registers, Cancer Registry) — needed to compare counties.",
    access: "Permit under the Secondary Use Act (552/2019), delivered in Findata's secure environment.",
    lag: "Months to get a permit",
    role: "outcome",
    status: "not-connected",
    links: [{ label: "Findata", url: "https://findata.fi/en/" }],
  },
];

const FIELDS = [
  ["pathway_id", "Pseudonym, rotates per county", "—"],
  ["gp_visit_date", "First visit with lung symptoms", "Encounter.period.start"],
  ["ct_ordered_date", "Chest CT ordered (THL code GD1AD)", "ServiceRequest.authoredOn"],
  ["ct_result_date", "Radiologist's report signed", "DiagnosticReport.issued"],
  ["diagnosis_date", "Lung cancer confirmed (ICD-10 C34)", "Condition.recordedDate"],
  ["outcome", "cancer · ruled out · in progress", "Condition / DiagnosticReport.conclusion"],
  ["stage", "TNM stage at diagnosis, if recorded", "Condition.stage"],
];

const ROLE = { primary: "Live pathway data", context: "Context & baseline", outcome: "Outcomes & comparison" };

export function DataSources() {
  return (
    <Page title="Data sources" sub="Where Finnish lung-cancer pathway data lives, and how Liwe would read it.">
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          {SOURCES.map((s) => (
            <Card key={s.name}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-ink-faint">{ROLE[s.role]}</p>
                  <h2 className="font-semibold text-ink">{s.name}</h2>
                  <p className="text-sm text-ink-faint">{s.owner}</p>
                </div>
                {s.status === "demo" ? (
                  <span className="rounded-full bg-[#eef2fb] px-2.5 py-1 text-xs font-semibold text-[#2c4a8c]">Demo feed active</span>
                ) : (
                  <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-ink-soft">Not connected</span>
                )}
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[7rem_1fr]">
                <dt className="text-ink-faint">What it gives</dt>
                <dd className="text-ink">{s.gives}</dd>
                <dt className="text-ink-faint">How to access</dt>
                <dd className="text-ink">{s.access}</dd>
                <dt className="text-ink-faint">Delay</dt>
                <dd className="text-ink">{s.lag}</dd>
              </dl>
              <p className="mt-3 text-xs text-ink-faint">
                {s.links.map((l, i) => (
                  <span key={l.url}>
                    {i > 0 && " · "}
                    <a href={l.url} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-accent">{l.label}</a>
                  </span>
                ))}
              </p>
            </Card>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card title="Recommended route">
            <ol className="space-y-3 text-sm leading-relaxed text-ink-soft">
              <li><b className="text-ink">1. The county&apos;s own records first.</b> The county is the data controller and can use its own data to manage its services — confirm with its data protection officer. Fastest path to live numbers.</li>
              <li><b className="text-ink">2. THL statistics</b> for the GP-wait baseline.</li>
              <li><b className="text-ink">3. A Findata permit</b> for the Cancer Registry, to compare with counties that did nothing and to confirm survival.</li>
            </ol>
          </Card>
          <Card title="What Liwe needs per patient">
            <p className="mb-3 text-sm text-ink-soft">Dates and codes only — no names, no personal ID numbers.</p>
            <ul className="divide-y divide-rule text-sm">
              {FIELDS.map(([f, d, fhir]) => (
                <li key={f} className="py-2">
                  <code className="text-xs text-ink">{f}</code>
                  <p className="text-ink-soft">{d}</p>
                  <p className="text-xs text-ink-faint">FHIR: {fhir}</p>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </Page>
  );
}
