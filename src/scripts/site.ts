// Small progressive enhancements. Every page works without this script.
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
  const els = $$<HTMLElement>(".sec-head, .wplate, .thread, .log li, #register li, .pfig, .feature-research, .cv-entry, .role-card, .rmap > *, .box, .facts, .verif");
  const ro = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target as HTMLElement; ro.unobserve(el);
    const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("rv") && !c.classList.contains("in")) : [];
    el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 4) * 70}ms`;
    el.classList.add("in");
  }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => { if (el.getBoundingClientRect().top > innerHeight * 0.92) { el.classList.add("rv"); ro.observe(el); } });
}

// Light / dark switch. Follows the system until the visitor chooses.
$<HTMLButtonElement>("#themeBtn")?.addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const next = dark ? "light" : "dark";
  const set = () => { root.dataset.theme = next; };
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (d.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) d.startViewTransition(set); else set();
  try { localStorage.setItem("aaq-theme", next); } catch { /* storage unavailable */ }
});
