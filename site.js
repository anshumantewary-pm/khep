/* Khep website: shared header, footer, scroll behaviour and blog helpers.
   Every page includes <div id="site-header"></div> and <div id="site-footer"></div>,
   and sets <body data-page="home|stories|post">. */
(function(){
"use strict";

const CONFIG = {
  // Paste a form endpoint (for example a Formspree URL) to receive "Share your story" submissions.
  // Left empty, submissions are kept in the visitor's browser and the form says so.
  STORY_ENDPOINT: "",
  APK: "download/Khep.apk"
};

const page = document.body.dataset.page || "home";
const home = page === "home" ? "" : "./";
const NAV = [
  ["Ecosystem", home + "#ecosystem", "home"],
  ["How it works", home + "#how", "home"],
  ["Stories", "blog.html", "stories"],
  ["FAQ", home + "#faq", "home"]
];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- header ---------- */
const hdrSlot = document.getElementById("site-header");
if(hdrSlot){
  hdrSlot.outerHTML = `<a class="skip" href="#main">Skip to content</a>
  <header class="site-hdr" id="hdr">
    <div class="fringe" aria-hidden="true"></div>
    <div class="wrap hdr-in">
      <a class="logo" href="./" aria-label="Khep home"><img src="icons/icon-192.png" alt="" width="38" height="38"><b>Khep</b></a>
      <span class="permit" aria-hidden="true"><span><b>All India</b>Permit</span></span>
      <ul class="nav" id="nav">${NAV.map(([label, href, p]) => `<li><a href="${href}" ${p === page && p !== "home" ? 'aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul>
      <a class="hdr-cta" href="${home}#get">Get the app</a>
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div>
  </header>`;
}
const hdr = document.getElementById("hdr");
if(hdr){
  let lastY = window.scrollY, ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle("scrolled", y > 12);
    if(!hdr.classList.contains("open")){
      if(y > lastY + 4 && y > 140) hdr.classList.add("hide");      // scrolling down: slide away
      else if(y < lastY - 4 || y < 140) hdr.classList.remove("hide"); // scrolling up: come back
    }
    lastY = y; ticking = false;
  };
  window.addEventListener("scroll", () => { if(!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
  hdr.addEventListener("focusin", () => hdr.classList.remove("hide"));
  onScroll();
  const burger = document.getElementById("burger");
  const setOpen = o => { hdr.classList.toggle("open", o); burger.setAttribute("aria-expanded", String(o)); };
  burger.addEventListener("click", () => setOpen(!hdr.classList.contains("open")));
  document.getElementById("nav").addEventListener("click", e => { if(e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", e => { if(e.key === "Escape") setOpen(false); });
  document.addEventListener("click", e => { if(hdr.classList.contains("open") && !hdr.contains(e.target)) setOpen(false); });
}

/* ---------- garlands and nimbu-mirchi hanging from the header ---------- */
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
function swagSVG(w){
  const sag = Math.round(w * .2), n = Math.max(8, Math.round(w / 10.5)), out = [];
  for(let i = 0; i <= n; i++){
    const t = i / n, x = w * t, y = 4 + 4 * sag * t * (1 - t);
    const c = i % 3 === 1 ? "#ffd400" : "#ff8a00";
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.6" fill="${c}" stroke="#b34700" stroke-width="1"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="#b34700"/>`);
  }
  const mx = w / 2, my = 4 + sag;
  // a small pendant of leaves and a red bead at the low point
  out.push(`<path d="M${mx} ${my + 4} q-7 6 -3 14 q3 -6 3 -14z M${mx} ${my + 4} q7 6 3 14 q-3 -6 -3 -14z" fill="#1f9e46" stroke="#0f5a26" stroke-width="1"/><circle cx="${mx}" cy="${my + 21}" r="4" fill="#d7261e" stroke="#7a0e0e" stroke-width="1"/>`);
  out.push(`<circle cx="0" cy="4" r="3" fill="#d7261e"/><circle cx="${w}" cy="4" r="3" fill="#d7261e"/>`);
  return `<svg width="${w}" height="${sag + 34}" viewBox="0 0 ${w} ${sag + 34}">${out.join("")}</svg>`;
}
function nimbuSVG(){
  // thread, seven chillies and a lemon at the bottom: the classic nimbu-mirchi charm
  let s = `<svg width="36" height="118" viewBox="0 0 36 118"><path d="M18 0 V86" stroke="#2b1a10" stroke-width="1.6"/>`;
  for(let i = 0; i < 7; i++){
    const y = 14 + i * 9.5, rot = (i % 2 ? 1 : -1) * (16 + (i % 3) * 6);
    s += `<g transform="translate(18 ${y}) rotate(${rot})"><path d="M0 0 C6 3 6 14 1.5 22 C-1 14 -5 5 0 0Z" fill="${i % 3 === 2 ? "#3cb043" : "#2a8f34"}" stroke="#145c1c" stroke-width="1"/><rect x="-1.4" y="-3" width="2.8" height="4" rx="1" fill="#6b4a1a"/></g>`;
  }
  s += `<ellipse cx="18" cy="100" rx="11" ry="13" fill="#f7d83a" stroke="#a88a10" stroke-width="1.4"/><ellipse cx="14" cy="95" rx="3" ry="4.5" fill="#fff6b0" opacity=".8"/><path d="M18 86 v2" stroke="#2b1a10" stroke-width="1.6"/></svg>`;
  return s;
}
function buildDeco(){
  if(!hdr) return;
  let deco = hdr.querySelector(".hdr-deco");
  if(!deco){ deco = document.createElement("div"); deco.className = "hdr-deco"; deco.setAttribute("aria-hidden", "true"); hdr.appendChild(deco); }
  const W = document.documentElement.clientWidth, sw = W < 600 ? 92 : 128, n = Math.ceil(W / sw) + 1;
  // Each piece gets its own sway speed and starting point (CSS variables), so they don't move in lockstep.
  const v = (d, spread) => `--d:${(d + Math.random() * spread).toFixed(2)}s;--dl:-${(Math.random() * 3).toFixed(2)}s`;
  let html = "";
  for(let i = 0; i < n; i++) html += `<div class="swag" style="left:${i * sw - 4}px;width:${sw}px;${v(2.1, .9)}"><div class="jolt-in">${swagSVG(sw)}</div></div>`;
  (W < 700 ? [.07] : [.2, .8]).forEach(p => { html += `<div class="nimbu" style="left:${p * 100}%;${v(1.4, .5)}"><div class="jolt-in">${nimbuSVG()}</div></div>`; });
  deco.innerHTML = html;
}
/* The steady sway is pure CSS, run by the graphics card. Script only adds a short "jolt" class
   when you scroll quickly or, now and then, when the truck hits a pothole. */
let joltT = 0, lastScroll = window.scrollY, lastJolt = 0;
function jolt(){
  const deco = hdr && hdr.querySelector(".hdr-deco");
  if(!deco || hdr.classList.contains("hide") || performance.now() - lastJolt < 1700) return;
  lastJolt = performance.now();
  deco.classList.remove("jolt"); void deco.offsetWidth; deco.classList.add("jolt");
  clearTimeout(joltT); joltT = setTimeout(() => deco.classList.remove("jolt"), 1600);
}
if(!calm){
  window.addEventListener("scroll", () => { const y = window.scrollY; if(Math.abs(y - lastScroll) > 40) jolt(); lastScroll = y; }, {passive:true});
  setInterval(() => { if(!document.hidden && Math.random() < .45) jolt(); }, 3200);
}
buildDeco();
let decoT, lastW = document.documentElement.clientWidth;
window.addEventListener("resize", () => { clearTimeout(decoT); decoT = setTimeout(() => { const w = document.documentElement.clientWidth; if(w !== lastW){ lastW = w; buildDeco(); } }, 200); });

/* ---------- footer ---------- */
const ftrSlot = document.getElementById("site-footer");
if(ftrSlot){
  ftrSlot.outerHTML = `<footer class="site-ftr">
    <div class="stripes" aria-hidden="true"></div>
    <div class="wrap ftr-grid">
      <div class="ftr-brand"><a class="logo" href="./"><img src="icons/icon-192.png" alt="" width="38" height="38"><b>Khep</b></a>
        <p>India's truck network. Drivers find loads, companies find trucks, and everyone gets paid on time.</p></div>
      <div class="ftr-col"><h4>App</h4><ul><li><a href="${home}#get">Download</a></li><li><a href="app.html">Open in browser</a></li><li><a href="signup.html">Sign up</a></li></ul></div>
      <div class="ftr-col"><h4>Explore</h4><ul><li><a href="${home}#ecosystem">Ecosystem</a></li><li><a href="${home}#how">How it works</a></li><li><a href="${home}#faq">FAQ</a></li></ul></div>
      <div class="ftr-col"><h4>Stories</h4><ul><li><a href="blog.html">All stories</a></li><li><a href="blog.html?cat=guides">Guides</a></li><li><a href="blog.html#share">Share your story</a></li></ul></div>
    </div>
    <div class="wrap ftr-bottom"><span class="horn">HORN OK PLEASE</span><span>© ${new Date().getFullYear()} Khep · The map and activity on the home page are an illustration, not live data.</span></div>
  </footer>
  <button class="to-top" id="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button>`;
}
const toTop = document.getElementById("to-top");
if(toTop){
  let shown = false;
  window.addEventListener("scroll", () => { const s = window.scrollY > 900; if(s !== shown){ shown = s; toTop.classList.toggle("show", s); } }, {passive:true});
  toTop.addEventListener("click", () => window.scrollTo({top:0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"}));
}

/* ---------- blog helpers ---------- */
const CAT = {stories:"Story", guides:"Guide", news:"News"};
const COVER = {stories:"#8e2f23", guides:"#0b3d91", news:"#6d1a1f"};
let postsCache = null;
async function loadPosts(){
  if(postsCache) return postsCache;
  const res = await fetch("posts.json", {cache:"no-cache"});
  if(!res.ok) throw new Error("posts.json " + res.status);
  const data = await res.json();
  postsCache = (data.posts || []).filter(p => p && p.slug && p.title && !p.draft).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return postsCache;
}
const fmtDate = d => { const t = new Date(d + "T00:00:00"); return isNaN(t) ? "" : t.toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"}); };
const readMins = p => Math.max(1, Math.round(String(p.body || "").split(/\s+/).length / 200));
function coverHTML(p, big){
  if(p.cover) return `<div class="cover"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt || "")}" loading="lazy"></div>`;
  return `<div class="cover gen" style="--c1:${COVER[p.category] || "#0b3d91"}"${big ? ' data-big' : ""}><b>${esc(p.coverText || p.title)}</b></div>`;
}
function cardHTML(p){
  return `<a class="post-card" href="post.html?p=${encodeURIComponent(p.slug)}">
    ${coverHTML(p)}
    <div class="body">
      <div class="meta"><span class="chip ${esc(p.category)}">${CAT[p.category] || "Post"}</span><span>${fmtDate(p.date)}</span><span>${readMins(p)} min read</span></div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.excerpt || "")}</p>
      <div class="meta"><span>${esc(p.author || "Khep team")}${p.role ? " · " + esc(p.role) : ""}${p.city ? " · " + esc(p.city) : ""}</span></div>
    </div></a>`;
}
/* A small Markdown renderer for post bodies: headings, paragraphs, bold, italics, links, images, quotes and lists. */
function md(src){
  const safe = u => /^(https?:|mailto:|\.?\/|#|[\w-]+\.html|img\/)/i.test(u) ? u : "#";
  const inline = s => esc(s)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, u) => `<img src="${safe(u)}" alt="${a}" loading="lazy">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${safe(u)}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  const out = []; let para = [], list = null;
  const flushP = () => { if(para.length){ out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const flushL = () => { if(list){ out.push(`<${list.tag}>${list.items.map(i => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`); list = null; } };
  String(src || "").split(/\r?\n/).forEach(line => {
    const t = line.trim(); let m;
    if(!t){ flushP(); flushL(); return; }
    if((m = t.match(/^(#{2,4})\s+(.*)$/))){ flushP(); flushL(); const n = m[1].length; out.push(`<h${n}>${inline(m[2])}</h${n}>`); return; }
    if((m = t.match(/^>\s?(.*)$/))){ flushP(); flushL(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); return; }
    if((m = t.match(/^[-*]\s+(.*)$/))){ flushP(); if(!list || list.tag !== "ul"){ flushL(); list = {tag:"ul", items:[]}; } list.items.push(m[1]); return; }
    if((m = t.match(/^\d+[.)]\s+(.*)$/))){ flushP(); if(!list || list.tag !== "ol"){ flushL(); list = {tag:"ol", items:[]}; } list.items.push(m[1]); return; }
    flushL(); para.push(t);
  });
  flushP(); flushL();
  return out.join("\n");
}

window.Khep = {CONFIG, esc, loadPosts, cardHTML, coverHTML, md, fmtDate, readMins, CAT};

if("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
