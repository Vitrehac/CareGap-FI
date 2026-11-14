import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const skip = new Set(["node_modules", ".next", ".git"]);
const missing = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full);
    else if (name.endsWith(".md")) check(full);
  }
}

function check(file) {
  const text = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  const re = /\[[^\]]+\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text))) {
    let href = m[1].trim();
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) continue;
    href = href.split("#")[0].split("?")[0];
    if (!href) continue;
    const target = path.resolve(dir, decodeURIComponent(href));
    if (!target.startsWith(root)) continue;
    if (!fs.existsSync(target)) missing.push(`${path.relative(root, file)} -> ${href}`);
  }
}

walk(root);
if (missing.length) {
  console.error(missing.join("\n"));
  process.exit(1);
}
console.log("markdown links ok");
