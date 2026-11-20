// Small progressive enhancements. Every page works without this script.
import { seg7 } from "../lib/seg7";
const $ = <T extends Element>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const isAr = document.documentElement.lang === "ar";

// Mobile menu
const menuBtn = $<HTMLButtonElement>("#menuBtn"), sheet = $("#sheetMenu");
const closeMenu = () => { menuBtn?.setAttribute("aria-expanded", "false"); sheet?.classList.remove("open"); };
menuBtn?.addEventListener("click", () => {
  const open = menuBtn.getAttribute("aria-expanded") !== "true";
  menuBtn.setAttribute("aria-expanded", String(open)); sheet?.classList.toggle("open", open);
});

// Toast
const toastEl = $<HTMLElement>("#toast");
let toastTimer = 0;
const toast = (msg: string) => {
  if (!toastEl) return;
  toastEl.textContent = msg; toastEl.classList.add("show");
  clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), 2600);
};

// Copy buttons
$$<HTMLButtonElement>("[data-copy]").forEach((b) => b.addEventListener("click", () => {
  const v = b.dataset.copy || "";
  navigator.clipboard?.writeText(v).then(() => toast(isAr ? "تم النسخ" : "Copied"), () => toast(v));
}));

// Figure lightbox
const lb = $<HTMLElement>("#lightbox");
const openLB = (src: string, cap: string) => {
  if (!lb) return;
  $<HTMLImageElement>("img", lb)!.src = src; $("p", lb)!.textContent = cap;
  lb.hidden = false; $<HTMLButtonElement>("button", lb)?.focus(); document.body.style.overflow = "hidden";
};
const closeLB = () => { if (lb && !lb.hidden) { lb.hidden = true; document.body.style.overflow = ""; } };
$$<HTMLButtonElement>("[data-lightbox]").forEach((b) => b.addEventListener("click", () => openLB(b.dataset.lightbox!, b.dataset.cap || "")));
$$<HTMLImageElement>(".pfig img").forEach((img) => {
  img.tabIndex = 0; img.setAttribute("role", "button");
  const go = () => openLB(img.currentSrc || img.src, img.closest("figure")?.querySelector("figcaption")?.textContent || "");
  img.addEventListener("click", go);
  img.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
});
lb?.addEventListener("click", closeLB);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenu(); closeLB(); } });

// "On this page" highlighting
const tocLinks = $$<HTMLAnchorElement>(".toc a[data-anchor]");
if (tocLinks.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) tocLinks.forEach((l) => l.classList.toggle("on", l.dataset.anchor === e.target.id));
  }), { rootMargin: "-30% 0px -60% 0px" });
  tocLinks.forEach((l) => { const t = document.getElementById(l.dataset.anchor!); if (t) io.observe(t); });
}

// Project register filters
const register = $("#register");
if (register) {
  const state = { domain: new URLSearchParams(location.search).get("domain") || "all", status: "all" };
  const apply = () => {
    let shown = 0;
    $$<HTMLElement>("li[data-domain]", register).forEach((li) => {
      const ok = (state.domain === "all" || (li.dataset.domain || "").split(" ").includes(state.domain)) &&
        (state.status === "all" || (li.dataset.levels || "").split(" ").includes(state.status));
      li.hidden = !ok; if (ok) shown++;
    });
    const empty = $<HTMLElement>("#registerEmpty"); if (empty) empty.hidden = shown > 0;
    $$<HTMLButtonElement>("[data-fd]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.fd === state.domain)));
    $$<HTMLButtonElement>("[data-fs]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.fs === state.status)));
  };
  $$<HTMLButtonElement>("[data-fd]").forEach((b) => b.addEventListener("click", () => { state.domain = b.dataset.fd!; apply(); }));
  $$<HTMLButtonElement>("[data-fs]").forEach((b) => b.addEventListener("click", () => { state.status = b.dataset.fs!; apply(); }));
  apply();
}

// Remember the chosen language for the next visit
$$<HTMLAnchorElement>(".lang a[data-lang]").forEach((a) => a.addEventListener("click", () => {
  try { localStorage.setItem("aaq-lang", a.dataset.lang!); } catch { /* storage unavailable */ }
}));

// Reveal content as it scrolls into view (only below the fold, so nothing visible ever flickers)
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const els = $$<HTMLElement>(".sec-head, .wplate, .thread, .log li, .skill-row, .learning li, .log-filter, #register li, .pfig, .feature-research, .cv-entry, .role-card, .rmap > *, .box, .facts, .verif");
  const ro = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target as HTMLElement; ro.unobserve(el);
    const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("rv") && !c.classList.contains("in")) : [];
    el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 4) * 70}ms`;
    el.classList.add("in");
  }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => { if (el.getBoundingClientRect().top > innerHeight * 0.92) { el.classList.add("rv"); ro.observe(el); } });
}

// Light / dark switch, drawn as a miniature circuit breaker: lever up (I) = lights on, lever down (O) = dark.
// Follows the system until the visitor chooses. The lever moves first, then the lights change.
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
const breaker = $<HTMLButtonElement>("#themeBtn");
const syncBreaker = () => { breaker?.setAttribute("data-on", String(!isDark())); breaker?.setAttribute("aria-pressed", String(!isDark())); };
syncBreaker();
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncBreaker);
breaker?.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  breaker.setAttribute("data-on", String(next === "light"));
  const set = () => { root.dataset.theme = next; syncBreaker(); };
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  setTimeout(() => { if (d.startViewTransition && !reduced) d.startViewTransition(set); else set(); }, reduced ? 0 : 170);
  try { localStorage.setItem("aaq-theme", next); } catch { /* storage unavailable */ }
});

// Local time in Yogyakarta, for visitors in other time zones
const clocks = $$<HTMLElement>("[data-clock]");
if (clocks.length) {
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false });
  const tick = () => { const t = fmt.format(new Date()); clocks.forEach((c) => { c.textContent = t; c.setAttribute("datetime", t); }); };
  tick(); setInterval(tick, 15000);
}

// Hero focus readout: an instrument display that steps through channels
const ro = $<HTMLElement>("[data-readout]");
if (ro) {
  const roles: string[] = JSON.parse(ro.dataset.readout || "[]");
  const txt = $<HTMLElement>("[data-ro-txt]", ro), ch = $<HTMLElement>("[data-ro-ch]", ro), dots = $$<HTMLElement>(".ro-dots i", ro);
  let i = 0, paused = false;
  ro.addEventListener("pointerenter", () => { paused = true; });
  ro.addEventListener("pointerleave", () => { paused = false; });
  if (roles.length > 1) setInterval(() => {
    if (paused || document.hidden) return;
    i = (i + 1) % roles.length;
    const show = () => {
      if (txt) txt.textContent = roles[i];
      if (ch) ch.innerHTML = seg7(String(i + 1).padStart(2, "0"));
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
    };
    if (reduced) { show(); return; }
    ro.classList.add("switching");
    setTimeout(() => { show(); ro.classList.remove("switching"); ro.classList.add("settle"); setTimeout(() => ro.classList.remove("settle"), 450); }, 180);
  }, reduced ? 5000 : 2900);
}

// Identity card tilts in 3D toward the pointer (desktop only). The photo itself is never moved or altered.
const card = $<HTMLElement>("[data-tilt]");
if (card && !reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const loop = () => {
    cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
    card.style.setProperty("--rx", `${(-cy * 7).toFixed(2)}deg`); card.style.setProperty("--ry", `${(cx * 9).toFixed(2)}deg`);
    card.style.setProperty("--gx", `${((cx + 1) * 50).toFixed(1)}%`); card.style.setProperty("--gy", `${((cy + 1) * 50).toFixed(1)}%`);
    raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
  };
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width) * 2 - 1; ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    card.classList.add("tilting"); if (!raf) raf = requestAnimationFrame(loop);
  });
  card.addEventListener("pointerleave", () => { tx = 0; ty = 0; card.classList.remove("tilting"); if (!raf) raf = requestAnimationFrame(loop); });
}

// Logbook filter with a seven-segment entry counter
const log = $("#logbook");
if (log) {
  const count = $<HTMLElement>("[data-log-count]");
  $$<HTMLButtonElement>("[data-lf]").forEach((b) => b.addEventListener("click", () => {
    const f = b.dataset.lf!;
    let n = 0;
    $$<HTMLElement>("li[data-tag]", log).forEach((li) => { const ok = f === "all" || li.dataset.tag === f; li.hidden = !ok; if (ok) n++; });
    $$<HTMLButtonElement>("[data-lf]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    if (count) { count.innerHTML = seg7(String(n).padStart(2, "0")); if (!reduced) { count.classList.remove("blink"); void count.offsetWidth; count.classList.add("blink"); } }
  }));
}

// Skills: two-position slide switch
$$<HTMLElement>("[data-skillset]").forEach((set) => {
  const btns = $$<HTMLButtonElement>("[data-sv]", set), sw = $<HTMLElement>(".slide-sw", set);
  btns.forEach((b, k) => b.addEventListener("click", () => {
    btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $$<HTMLElement>("[data-sp]", set).forEach((p) => { p.hidden = p.dataset.sp !== b.dataset.sv; });
    sw?.style.setProperty("--pos", String(k));
  }));
});
