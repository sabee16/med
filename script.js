/* =========================================================
   Suryah Medicals - storefront logic
   Edit CATEGORIES and PRODUCTS below to change the catalogue.
   NOTE: product names and prices here are SAMPLE data.
   ========================================================= */

const WHATSAPP_NUMBER = "919094798472"; // home delivery number, country code first, no "+"
const STORE_NAME = "Suryah Medicals";

/* ---------- Categories ---------- */
const CATEGORIES = [
  { id: "medicines",   name: "Medicines",                       blurb: "Prescription and over-the-counter medicines",
    icon: '<rect x="3" y="8.500" width="18" height="7" rx="3.500" transform="rotate(-45 12 12)"/><path d="M9.500 9.500l5 5"/>' },
  { id: "mother-baby", name: "Baby and mother care",            blurb: "Diapers, baby skincare, maternity essentials",
    icon: '<circle cx="12" cy="12" r="8"/><path d="M9 14c1 1.200 5 1.200 6 0M9.500 10h.01M14.500 10h.01M12 4c0-1 1-1.500 2-1"/>' },
  { id: "wellness",    name: "Wellness and supplements",        blurb: "Vitamins, minerals and daily supplements",
    icon: '<path d="M12 20s-7-4.400-7-10a4 4 0 017-2.600A4 4 0 0119 10c0 5.600-7 10-7 10z"/>' },
  { id: "sports",      name: "Sports nutrition",                blurb: "Protein, creatine and energy support",
    icon: '<path d="M6 7v10M18 7v10M3 9.500v5M21 9.500v5M6 12h12"/>' },
  { id: "herbal",      name: "Herbal and traditional wellness", blurb: "Ayurvedic and traditional remedies",
    icon: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c3-5 6-8 10-10"/>' },
  { id: "surgical",    name: "Surgical and medical supplies",   blurb: "Monitors, dressings and home-care devices",
    icon: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M12 10.500v6M9 13.500h6"/>' },
  { id: "foods",       name: "Health foods and nutrition",      blurb: "Oats, seeds and nutrition drinks",
    icon: '<path d="M3 11h18a9 9 0 01-18 0z"/><path d="M8 7c0-1.500 1-2 1-3.500M13 7c0-1.500 1-2 1-3.500"/>' },
  { id: "personal",    name: "Personal care",                   blurb: "Skin, hair and everyday hygiene",
    icon: '<path d="M10 3h4v3l1.500 2v11a2 2 0 01-2 2h-3a2 2 0 01-2-2V8L10 6z"/><path d="M8.500 12h7"/>' }
];

/* ---------- Products (sample data) ----------
   shape: bottle | strip | tube | jar | box | device
   rx: true  = needs a prescription
   mrp: optional original price, shows a "Save" tag and strike-through
   deal: true = appears in "Today's best deals"                       */
// FALLBACK_PRODUCTS is only used if Supabase is not set up or cannot be reached.
// Real products are managed from admin.html and stored in Supabase.
const FALLBACK_PRODUCTS = [
  { id: 1,  cat: "medicines",   name: "Paracetamol 500 mg tablets",        pack: "Strip of 15",     price: 30,   shape: "strip" },
  { id: 2,  cat: "medicines",   name: "Cetirizine 10 mg tablets",          pack: "Strip of 10",     price: 25,   shape: "strip" },
  { id: 3,  cat: "medicines",   name: "Amoxicillin 500 mg capsules",       pack: "Strip of 10",     price: 95,   shape: "strip", rx: true },
  { id: 4,  cat: "medicines",   name: "ORS electrolyte powder",            pack: "Pack of 5 sachets", price: 60, mrp: 70, shape: "box", deal: true },

  { id: 5,  cat: "mother-baby", name: "Baby diaper pants, medium",         pack: "36 pieces",       price: 549,  mrp: 599, shape: "box", deal: true },
  { id: 6,  cat: "mother-baby", name: "Baby moisturising lotion",          pack: "200 ml",          price: 210,  shape: "bottle" },
  { id: 7,  cat: "mother-baby", name: "Maternal multivitamin",             pack: "30 tablets",      price: 320,  shape: "jar" },
  { id: 8,  cat: "mother-baby", name: "Baby wipes, fragrance free",        pack: "72 wipes",        price: 149,  shape: "box" },

  { id: 9,  cat: "wellness",    name: "Vitamin C 500 mg chewable",         pack: "60 tablets",      price: 180,  mrp: 210, shape: "jar", deal: true },
  { id: 10, cat: "wellness",    name: "Calcium with vitamin D3",           pack: "30 tablets",      price: 210,  shape: "jar" },
  { id: 11, cat: "wellness",    name: "Omega-3 fish oil 1000 mg",          pack: "60 capsules",     price: 499,  mrp: 599, shape: "bottle", deal: true },

  { id: 12, cat: "sports",      name: "Whey protein, unflavoured",         pack: "1 kg",            price: 2199, shape: "jar" },
  { id: 13, cat: "sports",      name: "Creatine monohydrate",              pack: "250 g",           price: 899,  shape: "jar" },
  { id: 14, cat: "sports",      name: "Electrolyte energy powder",         pack: "500 g",           price: 349,  mrp: 399, shape: "jar", deal: true },

  { id: 15, cat: "herbal",      name: "Ashwagandha root capsules",         pack: "60 capsules",     price: 299,  shape: "bottle" },
  { id: 16, cat: "herbal",      name: "Triphala churna",                   pack: "100 g",           price: 120,  shape: "box" },
  { id: 17, cat: "herbal",      name: "Chyawanprash",                      pack: "500 g",           price: 210,  shape: "jar" },

  { id: 18, cat: "surgical",    name: "Digital thermometer",               pack: "1 unit",          price: 150,  shape: "device" },
  { id: 19, cat: "surgical",    name: "Pulse oximeter",                    pack: "1 unit",          price: 899,  mrp: 1099, shape: "device", deal: true },
  { id: 20, cat: "surgical",    name: "Automatic BP monitor",              pack: "1 unit",          price: 1499, shape: "device" },
  { id: 21, cat: "surgical",    name: "Crepe bandage, 6 cm",               pack: "1 roll",          price: 90,   shape: "box" },

  { id: 22, cat: "foods",       name: "Rolled oats",                       pack: "1 kg",            price: 180,  shape: "box" },
  { id: 23, cat: "foods",       name: "Nutrition drink for adults",        pack: "400 g",           price: 520,  shape: "jar" },
  { id: 24, cat: "foods",       name: "Mixed seeds",                       pack: "250 g",           price: 210,  shape: "box" },

  { id: 25, cat: "personal",    name: "Hand sanitiser",                    pack: "500 ml",          price: 180,  shape: "bottle" },
  { id: 26, cat: "personal",    name: "Body moisturising lotion",          pack: "400 ml",          price: 360,  shape: "bottle" },
  { id: 27, cat: "personal",    name: "Sunscreen SPF 50",                  pack: "50 g",            price: 399,  mrp: 450, shape: "tube", deal: true },
  { id: 28, cat: "personal",    name: "Anti-dandruff shampoo",             pack: "340 ml",          price: 290,  shape: "bottle" }
];
let PRODUCTS = FALLBACK_PRODUCTS;

/* ---------- Load products from Supabase ---------- */
async function loadProducts() {
  const url = window.SUPABASE_URL, key = window.SUPABASE_ANON_KEY;
  if (!url || !key) return;                       // not configured yet, keep fallback
  try {
    // Old-style anon keys are JWTs (start with "eyJ") and go in Authorization too.
    // New publishable keys (sb_publishable_...) are not JWTs and go in apikey only.
    const headers = { apikey: key };
    if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
    const res = await fetch(`${url}/rest/v1/products?select=*&order=id.asc`, { headers });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const rows = await res.json();
    PRODUCTS = rows.map(r => ({
      id: r.id, cat: r.cat, name: r.name, pack: r.pack || "",
      price: Number(r.price), mrp: r.mrp != null ? Number(r.mrp) : undefined,
      shape: r.shape || "box", rx: !!r.rx, deal: !!r.deal,
      images: Array.isArray(r.images) ? r.images.filter(Boolean) : [],
      description: r.description || ""
    }));
  } catch (err) {
    console.warn("Could not load products from Supabase, using fallback list.", err);
  }
}

/* ---------- Monochrome product illustrations ---------- */
const SHAPES = {
  bottle: `<svg viewBox="0 0 120 120"><rect x="46" y="8" width="28" height="14" rx="3" fill="#0b7fc0"/><rect x="38" y="22" width="44" height="90" rx="9" fill="#fff" stroke="#0b7fc0" stroke-width="3"/><rect x="38" y="52" width="44" height="32" fill="#0b7fc0"/><circle cx="60" cy="68" r="7" fill="#fff"/></svg>`,
  jar: `<svg viewBox="0 0 120 120"><rect x="30" y="12" width="60" height="20" rx="5" fill="#0b7fc0"/><rect x="26" y="32" width="68" height="78" rx="10" fill="#fff" stroke="#0b7fc0" stroke-width="3"/><rect x="26" y="52" width="68" height="34" fill="#0b7fc0"/><path d="M50 69h20" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`,
  tube: `<svg viewBox="0 0 120 120"><rect x="44" y="6" width="32" height="18" rx="4" fill="#0b7fc0"/><path d="M38 24h44l6 86H32z" fill="#fff" stroke="#0b7fc0" stroke-width="3" stroke-linejoin="round"/><path d="M35 70h50l3 40H32z" fill="#0b7fc0"/><circle cx="60" cy="90" r="6" fill="#fff"/></svg>`,
  box: `<svg viewBox="0 0 120 120"><rect x="22" y="14" width="76" height="92" rx="8" fill="#fff" stroke="#0b7fc0" stroke-width="3"/><rect x="22" y="40" width="76" height="30" fill="#0b7fc0"/><path d="M60 47v16M52 55h16" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M36 86h48" stroke="#0b7fc0" stroke-width="4" stroke-linecap="round"/></svg>`,
  device: `<svg viewBox="0 0 120 120"><rect x="28" y="10" width="64" height="100" rx="14" fill="#0b7fc0"/><rect x="38" y="22" width="44" height="34" rx="6" fill="#fff"/><path d="M44 40h8l4-8 6 14 4-6h6" fill="none" stroke="#0b7fc0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="82" r="13" fill="#fff"/><circle cx="60" cy="82" r="5" fill="#0b7fc0"/></svg>`,
  strip: (() => {
    let dots = "";
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
      dots += `<circle cx="${28 + c * 16}" cy="${46 + r * 28}" r="6" fill="#0b7fc0"/>`;
    }
    return `<svg viewBox="0 0 120 120"><rect x="14" y="26" width="92" height="68" rx="7" fill="#fff" stroke="#0b7fc0" stroke-width="3"/>${dots}<path d="M22 104h76" stroke="#0b7fc0" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7"/></svg>`;
  })()
};

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const rupee = n => "₹" + n.toLocaleString("en-IN");
const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || "";
const iconSVG = c => `<svg viewBox="0 0 24 24" aria-hidden="true">${c.icon}</svg>`;
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const CATEGORY_BANNERS = {
  medicines: "medicines-banner.png",
  "mother-baby": "baby-mother-care-banner.png",
  wellness: "wellness-supplements-banner.png",
  sports: "sports-nutrition-banner.png",
  herbal: "herbal-wellness-banner.png",
  surgical: "medical-supplies-banner.png",
  foods: "health-foods-banner.png",
  personal: "personal-care-banner.png"
};

const state = { cat: "all", q: "" };
let cart = {};
try { cart = JSON.parse(localStorage.getItem("suryah-cart") || "{}"); } catch (e) { cart = {}; }
const saveCart = () => { try { localStorage.setItem("suryah-cart", JSON.stringify(cart)); } catch (e) {} };

/* ---------- Pages ---------- */
// Every category has its own page: medicines.html, mother-baby.html, wellness.html, sports.html,
// herbal.html, surgical.html, foods.html, personal.html.  All products: products.html
const PAGE = document.body.dataset.page || "home";      // home | products | category
const PAGE_CAT = document.body.dataset.cat || "all";    // category id for category pages
const pageOf = id => (id === "all" ? "products.html" : id + ".html");

/* ---------- Render: categories ---------- */
function renderCategories() {
  const grid = $("#catGrid");
  if (grid) grid.innerHTML = CATEGORIES.map(c => {
    const banner = CATEGORY_BANNERS[c.id];
    return `
    <a class="cat${banner ? " cat-banner" : ""}" href="${pageOf(c.id)}"${banner ? ` aria-label="Shop ${esc(c.name)} products"` : ""}>
      ${banner
        ? `<img class="cat-feature-image" src="${banner}" alt="" loading="lazy" decoding="async">`
        : `<span class="cat-icon">${iconSVG(c)}</span><span><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p></span>`}
    </a>`;
  }).join("");

  const sel = $("#navCategory");
  if (sel) {
    sel.innerHTML =
      `<option value="products.html">All categories</option>` +
      CATEGORIES.map(c => `<option value="${pageOf(c.id)}">${esc(c.name)}</option>`).join("");
    if (PAGE !== "home") sel.value = pageOf(PAGE_CAT);
  }

  const tabs = $("#tabs");
  if (tabs) tabs.innerHTML =
    [{ id: "all", name: "All" }].concat(CATEGORIES).map(c =>
      `<a class="tab" href="${pageOf(c.id)}"${c.id === PAGE_CAT ? ' aria-current="page"' : ""}>${esc(c.name)}</a>`).join("");
}

/* ---------- Render: product cards ---------- */
function cardHTML(p) {
  const save = p.mrp ? Math.round(p.mrp - p.price) : 0;
  return `
  <article class="card">
    <div class="card-img" data-detail="${p.id}" role="button" tabindex="0" aria-label="View details of ${esc(p.name)}">
      ${save ? `<span class="tag tag-save">Save ${rupee(save)}</span>` : ""}
      ${p.rx ? `<span class="tag tag-rx">Rx</span>` : ""}
      ${p.images && p.images[0]
        ? `<img class="card-photo" src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" decoding="async">`
        : SHAPES[p.shape]}
    </div>
    <h3 class="card-title" data-detail="${p.id}" tabindex="0">${esc(p.name)}</h3>
    <p class="pack">${esc(p.pack)}${p.rx ? ", prescription needed" : ""}</p>
    ${p.description ? `<p class="card-desc">${esc(p.description)}</p><button type="button" class="card-more" data-detail="${p.id}">Details</button>` : ""}
    <p class="price">${rupee(p.price)} ${p.mrp ? `<s>${rupee(p.mrp)}</s>` : ""}</p>
    <div class="card-actions">
      <button class="add" data-add="${p.id}">Add to cart</button>
      <button class="heart" data-heart aria-pressed="false" aria-label="Save ${esc(p.name)}">
        <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.400-7-10a4 4 0 017-2.600A4 4 0 0119 10c0 5.600-7 10-7 10z"/></svg>
      </button>
    </div>
  </article>`;
}

function renderDeals() {
  const grid = $("#dealGrid");
  if (grid) grid.innerHTML = PRODUCTS.filter(p => p.deal).slice(0, 4).map(cardHTML).join("");
}

function renderShop() {
  const grid = $("#productGrid");
  if (!grid) return;                       // home page has no product list
  const q = state.q.trim().toLowerCase();
  const list = PRODUCTS.filter(p =>
    (PAGE_CAT === "all" || p.cat === PAGE_CAT) &&
    (!q || (p.name + " " + catName(p.cat)).toLowerCase().includes(q)));

  grid.innerHTML = list.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;
  const count = $("#shopCount");
  if (count) count.textContent = `${list.length} ${list.length === 1 ? "product" : "products"}`;
}

/* ---------- Cart ---------- */
const drawer = $("#drawer"), overlay = $("#overlay");

function cartLines() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id === Number(id)), qty }))
    .filter(l => l.p && l.qty > 0);
}

function renderCart() {
  const lines = cartLines();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.p.price, 0);

  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = rupee(total);
  $("#cartFoot").hidden = lines.length === 0;
  $("#rxNote").hidden = !lines.some(l => l.p.rx);

  $("#cartItems").innerHTML = lines.length ? lines.map(({ p, qty }) => `
    <div class="line">
      <div class="line-img">${p.images && p.images[0] ? `<img class="line-photo" src="${esc(p.images[0])}" alt="">` : SHAPES[p.shape]}</div>
      <div>
        <h4>${esc(p.name)}</h4>
        <small>${esc(p.pack)}</small><br>
        <span class="qty">
          <button data-dec="${p.id}" aria-label="Decrease quantity">&minus;</button>
          <span>${qty}</span>
          <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
        </span>
      </div>
      <div class="line-price">${rupee(p.price * qty)}</div>
    </div>`).join("")
    : `<p class="cart-empty">Your cart is empty. Add medicines or health products to start an order.</p>`;
}

function changeQty(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if (!cart[id]) delete cart[id];
  saveCart();
  renderCart();
}

function openCart() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  $("#closeCart").focus();
}
function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  $("#cartBtn").focus();
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

const waLink = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

function checkout() {
  const lines = cartLines();
  if (!lines.length) return;
  const total = lines.reduce((s, l) => s + l.qty * l.p.price, 0);
  const addr = $("#address").value.trim();
  let msg = `Hello ${STORE_NAME}, I would like to order:\n\n`;
  lines.forEach(({ p, qty }) => { msg += `- ${p.name} (${p.pack}) x ${qty} = ${rupee(p.price * qty)}${p.rx ? " [Rx]" : ""}\n`; });
  msg += `\nEstimated total: ${rupee(total)}`;
  if (lines.some(l => l.p.rx)) msg += `\nI will send the prescription photo in this chat.`;
  msg += addr ? `\n\nDelivery address: ${addr}` : `\n\nPlease confirm delivery details.`;
  window.open(waLink(msg), "_blank", "noopener");
}

/* ---------- Prescription dialog ---------- */
const rxDialog = $("#rxDialog");
$("#rxFile").addEventListener("change", e => {
  const f = e.target.files[0];
  const img = $("#rxPreview");
  if (f && f.type.startsWith("image/")) {
    img.src = URL.createObjectURL(f);
    img.hidden = false;
  } else {
    img.hidden = true;
  }
});
$("#rxSend").addEventListener("click", () => {
  const name = $("#rxName").value.trim();
  const phone = $("#rxPhone").value.trim();
  const msg = `Hello ${STORE_NAME}, I would like to order medicines against a prescription.` +
    (name ? `\nName: ${name}` : "") + (phone ? `\nPhone: ${phone}` : "") +
    `\nI am attaching the prescription photo here.`;
  window.open(waLink(msg), "_blank", "noopener");
  rxDialog.close();
});

/* ---------- Product details dialog (photos + description) ---------- */
const detailDialog = document.createElement("dialog");
detailDialog.id = "detailDialog";
detailDialog.setAttribute("aria-labelledby", "detailTitle");
document.body.appendChild(detailDialog);

function openDetail(id) {
  const p = PRODUCTS.find(x => x.id === Number(id));
  if (!p) return;
  const imgs = p.images || [];
  detailDialog.innerHTML = `
    <div class="drawer-head">
      <h2 id="detailTitle">${esc(p.name)}</h2>
      <button class="icon-btn" type="button" data-close-detail aria-label="Close">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </button>
    </div>
    <div class="detail-body">
      <div class="detail-main">${imgs[0] ? `<img id="detailMain" src="${esc(imgs[0])}" alt="${esc(p.name)}">` : SHAPES[p.shape]}</div>
      ${imgs.length > 1 ? `<div class="detail-thumbs">${imgs.map((u, i) => `<button type="button" class="detail-thumb${i === 0 ? " on" : ""}" data-thumb="${esc(u)}" aria-label="Photo ${i + 1}"><img src="${esc(u)}" alt=""></button>`).join("")}</div>` : ""}
      <p class="pack">${esc(p.pack)}${p.rx ? ", prescription needed" : ""}</p>
      <p class="price">${rupee(p.price)} ${p.mrp ? `<s>${rupee(p.mrp)}</s>` : ""}</p>
      ${p.description ? `<p class="detail-desc">${esc(p.description)}</p>` : ""}
      <button class="btn btn-dark btn-block" type="button" data-add="${p.id}" data-close-detail>Add to cart</button>
    </div>`;
  detailDialog.showModal();
}

detailDialog.addEventListener("click", e => {
  const th = e.target.closest("[data-thumb]");
  if (th) {
    $("#detailMain").src = th.dataset.thumb;
    detailDialog.querySelectorAll(".detail-thumb").forEach(b => b.classList.toggle("on", b === th));
    return;
  }
  if (e.target.closest("[data-close-detail]") || e.target === detailDialog) detailDialog.close();
});

document.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const d = e.target.closest && e.target.closest("[data-detail]");
  if (d && d.tagName !== "BUTTON") { e.preventDefault(); openDetail(d.dataset.detail); }
});

/* ---------- Events ---------- */
document.addEventListener("click", e => {
  const detail = e.target.closest("[data-detail]");
  if (detail && !e.target.closest("[data-add]")) return openDetail(detail.dataset.detail);
  const add = e.target.closest("[data-add]");
  if (add) {
    changeQty(Number(add.dataset.add), 1);
    const p = PRODUCTS.find(x => x.id === Number(add.dataset.add));
    toast(`${p.name} added to cart`);
    return;
  }
  const inc = e.target.closest("[data-inc]");
  if (inc) return changeQty(Number(inc.dataset.inc), 1);
  const dec = e.target.closest("[data-dec]");
  if (dec) return changeQty(Number(dec.dataset.dec), -1);

  const heart = e.target.closest("[data-heart]");
  if (heart) {
    heart.setAttribute("aria-pressed", String(heart.getAttribute("aria-pressed") !== "true"));
    return;
  }


  if (e.target.closest("[data-open-rx]")) return rxDialog.showModal();
});

$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) closeCart(); });
$("#checkoutBtn").addEventListener("click", checkout);

const navSel = $("#navCategory");
if (navSel) navSel.addEventListener("change", e => { location.href = e.target.value; });

const searchInput = $("#searchInput");
searchInput.addEventListener("input", e => { state.q = e.target.value; renderShop(); });
$("#searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if ($("#productGrid")) { const s = $("#shop"); if (s) s.scrollIntoView({ behavior: "smooth" }); }
  else location.href = "products.html" + (q ? "?q=" + encodeURIComponent(q) : "");
});

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
document.querySelectorAll("[data-wa]").forEach(a => { a.href = waLink(`Hello ${STORE_NAME}, I have a question.`); });
const startQ = new URLSearchParams(location.search).get("q");
if (startQ) { state.q = startQ; searchInput.value = startQ; }
renderCategories();
renderCart();
// Wait for live products from the database (no flash of sample data), then draw.
// If Supabase isn't configured, loadProducts returns straight away and the fallback list shows.
loadProducts().then(() => { renderDeals(); renderShop(); renderCart(); });
