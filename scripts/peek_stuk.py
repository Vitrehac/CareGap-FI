"""Inspect the STUK radiology open-data workbook: sheets, headers, any regional axis."""
import zipfile
import sys

PATH = "raw/stuk_2024.xlsx"

with open(PATH, "rb") as f:
    sig = f.read(4)
print("signature:", sig)
if sig[:2] != b"PK":
    print("NOT a zip/xlsx -- probably an HTML error page")
    with open(PATH, "rb") as f:
        print(f.read(600))
    sys.exit(1)

try:
    import openpyxl
except ImportError:
    print("openpyxl missing; listing archive members instead")
    print(zipfile.ZipFile(PATH).namelist())
    sys.exit(0)

wb = openpyxl.load_workbook(PATH, read_only=True, data_only=True)
print("sheets:", wb.sheetnames)

for name in wb.sheetnames:
    ws = wb[name]
    print("\n" + "=" * 70)
    print(f"{name}  rows={ws.max_row} cols={ws.max_column}")
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        cells = ["" if c is None else str(c)[:28] for c in row[:10]]
        print("  ", " | ".join(cells))
        if i >= 11:
            print("   ...")
            break
