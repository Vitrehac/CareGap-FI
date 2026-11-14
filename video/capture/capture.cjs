// Captures the real Liwe app at 2x for the "software showcase" segments.
// Needs the app running on http://localhost:3000 (cd .. && npm run build && npm start).
// Run: node capture/capture.cjs   → public/app/*.png + src/app-rects.json
//
// Hidden during capture, per the pitch data rules: the floating mascot, every "Over capacity"
// badge, and any "cancers found" figure. Nothing else in the UI is changed.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.env.LIWE_URL || 'http://localhost:3000';
const OUT = path.join(__dirname, '../public/app');
const rects = {};

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const clean = async () => {
    await p.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
    await p.addStyleTag({ content: '.liwi-wander{display:none!important}*{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important}' });
    await p.evaluate(() => {
      const leaf = [...document.querySelectorAll('body *')].filter((e) => e.children.length === 0 || e.childElementCount <= 1);
      const hide = (el) => { if (el) el.style.visibility = 'hidden'; };
      for (const el of leaf) {
        const t = (el.textContent || '').trim();
        if (/^(✕|×)?\s*Over capacity$/.test(t) && el.offsetWidth < 220) hide(el.closest('span') || el);
      }
      // any "cancer(s) found" figure: hide the label together with its number (climb until the block holds a digit)
      const own = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ');
      const drop = (el) => { if (el) el.style.display = 'none'; }; // remove from layout so no hole is left
      const isNum = (e) => e && (e.innerText || '').trim().length < 14 && /\d/.test(e.innerText || '');
      for (const el of document.querySelectorAll('body *')) {
        const t = own(el);
        const hit = /cancers? (are )?found/i.test(t) || (/found (sooner|on the fast route)/i.test(t) && /cancer/i.test(el.innerText || ''));
        if (!hit) continue;
        let box = el;
        for (let i = 0; i < 2 && !/\d/.test(box.innerText || ''); i++) box = box.parentElement;
        if ((box.innerText || '').length > 90) box = el; // never take out neighbouring figures
        const li = el.closest('li'); if (li && (li.innerText || '').length < 320) box = li; // a list row goes as a whole
        drop(box);
        if (box === el) { if (isNum(el.previousElementSibling)) drop(el.previousElementSibling); if (isNum(el.nextElementSibling)) drop(el.nextElementSibling); }
      }
    });
    await p.waitForTimeout(300);
  };
  const rect = async (loc) => {
    const bb = await loc.first().boundingBox();
    const sy = await p.evaluate(() => scrollY);
    return bb ? [Math.round(bb.x), Math.round(bb.y + sy), Math.round(bb.width), Math.round(bb.height)] : null;
  };
  const shot = async (name, map = {}) => {
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(250);
    const r = {}; for (const [k, l] of Object.entries(map)) r[k] = await rect(l);
    await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    rects[name] = { pageH: await p.evaluate(() => document.documentElement.scrollHeight), ...r };
    console.log(name, JSON.stringify(rects[name]));
  };
  const go = async (u) => { await p.goto(BASE + u, { waitUntil: 'networkidle' }); await p.waitForTimeout(1000); await clean(); };

  // New plan wizard: Lapland → Kainuu → 2 scans a week
  await go('/dashboard/new');
  const sel = p.locator('select').first();
  const np = () => ({ select: sel, scans: p.locator('input').first(), map: p.locator('svg').filter({ has: p.locator('path[d]') }).last() });
  await sel.selectOption('lapland'); await p.waitForTimeout(600); await clean(); await shot('new_a', np());
  await sel.selectOption('kainuu'); await p.waitForTimeout(600); await clean(); await shot('new_b', np());
  await p.locator('input').first().fill('2'); await p.waitForTimeout(600); await clean(); await shot('new_c', np());

  // Plan, estimate view
  await go('/dashboard/plan/ex-kainuu');
  const target = p.getByText('Against the pilot target').locator('xpath=../..');
  await shot('plan', {
    ttd: p.getByText('Time to diagnosis').locator('xpath=../..'),
    fast: p.getByText('On the fast route'),
    target,
    cost: p.getByText('per person scanned').first(),
    days: p.getByText('visit → CT report · Estimate').first(),
  });

  // Actual view: weekly tracking
  await go('/dashboard/plan/ex-kainuu');
  await p.getByText('Actual', { exact: true }).first().click(); await p.waitForTimeout(1200); await clean();
  await shot('actual', { chart: p.getByText('Days from the GP visit to the CT report').locator('xpath=../..') });

  await go('/dashboard/plan/ex-kainuu');
  // Funding cut: open inputs, €17k → €10k a year
  await p.evaluate(() => { for (const d of document.querySelectorAll('details')) if (/Plan inputs and unit prices/.test(d.querySelector('summary')?.innerText || '')) d.open = true; });
  await p.waitForTimeout(500); await clean();
  const funding = p.getByText('Funding a year', { exact: true }).locator('xpath=..').locator('input').first();
  await funding.scrollIntoViewIfNeeded();
  const inputsMap = () => ({ funding, inputs: p.getByText('Plan inputs and unit prices'), target, days: p.getByText('visit → CT report · Estimate').first() });
  await shot('cut_a', inputsMap());
  await p.evaluate(() => { for (const d of document.querySelectorAll('details')) if (/Plan inputs and unit prices/.test(d.querySelector('summary')?.innerText || '')) d.open = true; });
  await p.waitForTimeout(300);
  await funding.fill('10000'); await funding.press('Tab'); await p.waitForTimeout(600); await clean();
  await p.evaluate(() => { for (const d of document.querySelectorAll('details')) if (/Plan inputs and unit prices/.test(d.querySelector('summary')?.innerText || '')) d.open = true; });
  await shot('cut_b', inputsMap());

  fs.writeFileSync(path.join(__dirname, '../src/app-rects.json'), JSON.stringify(rects, null, 1));
  await b.close();
})();
