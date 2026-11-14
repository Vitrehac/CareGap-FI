"""National volume of thorax/chest CT and plain chest X-ray, from STUK 2024 open data.

Codes follow THL's procedure classification. We match on the Finnish study name
rather than hardcoding codes, then print what matched so the numbers stay auditable.
"""
import openpyxl

wb = openpyxl.load_workbook("raw/stuk_2024.xlsx", read_only=True, data_only=True)
ws = wb["Radiologia2024"]

rows = []
for row in ws.iter_rows(values_only=True):
    if row[0] and row[1] and isinstance(row[7], (int, float)):
        rows.append((str(row[0]), str(row[1]), row[2], row[7]))

def show(label, needle):
    hits = [r for r in rows if needle.lower() in r[1].lower()]
    total = sum(r[3] for r in hits)
    adults = sum(r[2] for r in hits if isinstance(r[2], (int, float)))
    print(f"\n{label}: total={total:,}  adults={adults:,}")
    for code, name, ad, tot in sorted(hits, key=lambda r: -r[3]):
        print(f"   {code:8} {name[:52]:54} {tot:>9,}")

show("Thorax CT (tietokonetomografia, thorax)", "thorax")
show("Keuhko (lung) studies", "keuhko")
print(f"\nrows parsed: {len(rows)}")
