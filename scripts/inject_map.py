"""Substitute the generated county SVG paths into the map canvas."""
import pathlib

CANVAS = pathlib.Path(
    r"C:\Users\rehac\.cursor\projects\c-Users-rehac-Downloads-HackJunction-2026"
    r"\canvases\nordic-care-gap-map.canvas.tsx"
)
PATHS = pathlib.Path("scripts/out/map_paths.ts")

paths_src = PATHS.read_text(encoding="utf-8").strip()
src = CANVAS.read_text(encoding="utf-8")

if "__COUNTY_PATHS__" not in src:
    raise SystemExit("placeholder already replaced; regenerate the canvas first")

CANVAS.write_text(src.replace("__COUNTY_PATHS__", paths_src), encoding="utf-8")
print(f"injected {len(paths_src):,} chars of path data into {CANVAS.name}")
