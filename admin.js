/* Suryah Medicals - admin panel (add / edit / delete products in Supabase) */

const CATEGORIES = [
  { id: "medicines",   name: "Medicines" },
  { id: "mother-baby", name: "Baby and mother care" },
  { id: "wellness",    name: "Wellness and supplements" },
  { id: "sports",      name: "Sports nutrition" },
  { id: "herbal",      name: "Herbal and traditional wellness" },
  { id: "surgical",    name: "Surgical and medical supplies" },
  { id: "foods",       name: "Health foods and nutrition" },
  { id: "personal",    name: "Personal care" }
];

const BUCKET = "product-images";
const MAX_IMAGES = 3;
const MAX_SIDE = 1000;        // photos are shrunk to this many pixels on the longest side
const JPEG_QUALITY = 0.82;

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const rupee = n => "₹" + Number(n).toLocaleString("en-IN");
const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || id;

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

const show = id => ["setupMsg", "loginView", "appView"].forEach(v => { $("#" + v).hidden = v !== id; });

/* ---------- Photo helpers ---------- */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read \"" + file.name + "\". Please use a JPG or PNG photo.")); };
    img.src = url;
  });
}

// Shrinks the photo and turns it into a JPEG (usually 60-150 KB), so the free storage lasts.
async function toJpegBlob(file) {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";                 // PNGs with transparent background become white
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not convert the photo.")), "image/jpeg", JPEG_QUALITY));
}

const randomName = () =>
  (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(16).slice(2)) + ".jpg";

function pathFromUrl(url) {
  const parts = String(url).split("/" + BUCKET + "/");
  return parts[1] ? decodeURIComponent(parts[1].split("?")[0]) : null;
}

/* ---------- Setup check ---------- */
if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || !window.supabase) {
  show("setupMsg");
} else {
  start();
}

function start() {
  const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  let products = [];
  let deleteProduct = null;

  async function uploadPhoto(file) {
    const blob = await toJpegBlob(file);
    const path = randomName();
    const { error } = await db.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
    if (error) throw error;
    return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async function removePhotos(urls) {
    const paths = (urls || []).map(pathFromUrl).filter(Boolean);
    if (!paths.length) return;
    try { await db.storage.from(BUCKET).remove(paths); } catch (e) { console.warn("Could not delete old photos", e); }
  }

  const friendly = msg => /column .*(images|description)|images.*column|description.*column/i.test(msg || "")
    ? msg + " (Run supabase-images.sql in the Supabase SQL Editor first.)"
    : /bucket not found/i.test(msg || "")
      ? msg + " (Run supabase-images.sql in the Supabase SQL Editor first.)"
      : msg;

  /* ---------- Auth ---------- */
  async function refreshSession() {
    const { data } = await db.auth.getSession();
    if (data.session) {
      $("#userEmail").textContent = data.session.user.email;
      show("appView");
      loadAll();
    } else {
      show("loginView");
    }
  }

  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const err = $("#loginError");
    err.hidden = true;
    $("#loginBtn").disabled = true;
    const { error } = await db.auth.signInWithPassword({
      email: $("#loginEmail").value.trim(),
      password: $("#loginPass").value
    });
    $("#loginBtn").disabled = false;
    if (error) { err.textContent = error.message; err.hidden = false; return; }
    $("#loginPass").value = "";
    refreshSession();
  });

  $("#logoutBtn").addEventListener("click", async () => {
    await db.auth.signOut();
    products = [];
    show("loginView");
  });

  /* ---------- Load + render ---------- */
  async function loadAll() {
    const { data, error } = await db.from("products").select("*").order("id", { ascending: true });
    if (error) { toast("Could not load products: " + error.message); return; }
    products = data;
    render();
  }

  function render() {
    const q = $("#q").value.trim().toLowerCase();
    const cat = $("#catFilter").value;
    const list = products.filter(p =>
      (cat === "all" || p.cat === cat) &&
      (!q || (p.name + " " + p.pack).toLowerCase().includes(q)));

    $("#rows").innerHTML = list.map(p => {
      const first = Array.isArray(p.images) && p.images[0];
      const n = Array.isArray(p.images) ? p.images.length : 0;
      return `
      <tr>
        <td>
          <div class="a-prod">
            ${first ? `<img class="a-thumb" src="${esc(first)}" alt="" loading="lazy">` : `<span class="a-thumb a-thumb-empty" title="No photo"></span>`}
            <span class="a-name">${esc(p.name)}</span>
          </div>
        </td>
        <td>${esc(catName(p.cat))}</td>
        <td>${esc(p.pack)}</td>
        <td class="num">${rupee(p.price)}</td>
        <td class="num">${p.mrp != null ? rupee(p.mrp) : "-"}</td>
        <td>${p.rx ? '<span class="a-flag rx">Rx</span>' : ""}${p.deal ? '<span class="a-flag">Deal</span>' : ""}${n ? `<span class="a-flag">${n} photo${n > 1 ? "s" : ""}</span>` : ""}</td>
        <td class="act">
          <button class="a-btn" data-edit="${p.id}" type="button">Edit</button>
          <button class="a-btn del" data-del="${p.id}" type="button">Delete</button>
        </td>
      </tr>`;
    }).join("");
    $("#empty").hidden = list.length > 0;
    $("#count").textContent = `${list.length} of ${products.length} products`;
  }

  /* ---------- Dropdowns ---------- */
  $("#catFilter").innerHTML = `<option value="all">All categories</option>` +
    CATEGORIES.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
  $("#fCat").innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
  $("#q").addEventListener("input", render);
  $("#catFilter").addEventListener("change", render);

  /* ---------- Photo slots in the form ---------- */
  // Each item is either { url } (already saved) or { file, preview } (picked, not uploaded yet)
  let formImages = [];
  let removedUrls = [];

  function renderImages() {
    const box = $("#fImages");
    box.innerHTML = formImages.map((im, i) => `
      <div class="a-img">
        <img src="${esc(im.url || im.preview)}" alt="Photo ${i + 1}">
        ${i === 0 ? '<span class="a-img-main">Main</span>' : ""}
        <button type="button" class="a-img-x" data-rmimg="${i}" aria-label="Remove photo ${i + 1}">&times;</button>
      </div>`).join("") +
      (formImages.length < MAX_IMAGES
        ? `<label class="a-img a-img-add"><input type="file" id="fImgInput" accept="image/*" multiple hidden><span>+ Add photo</span></label>`
        : "");
    $("#imgCount").textContent = `(${formImages.length} of ${MAX_IMAGES})`;
  }

  $("#fImages").addEventListener("change", e => {
    if (e.target.id !== "fImgInput") return;
    const files = Array.from(e.target.files || []);
    const room = MAX_IMAGES - formImages.length;
    if (files.length > room) toast(`Only ${MAX_IMAGES} photos per product. Extra photos were skipped.`);
    files.slice(0, room).forEach(file => {
      if (!file.type.startsWith("image/")) { toast(`"${file.name}" is not an image.`); return; }
      formImages.push({ file, preview: URL.createObjectURL(file) });
    });
    renderImages();
  });

  $("#fImages").addEventListener("click", e => {
    const rm = e.target.closest("[data-rmimg]");
    if (!rm) return;
    const [gone] = formImages.splice(Number(rm.dataset.rmimg), 1);
    if (gone.url) removedUrls.push(gone.url);
    if (gone.preview) URL.revokeObjectURL(gone.preview);
    renderImages();
  });

  /* ---------- Add / edit ---------- */
  const formDialog = $("#formDialog");

  function openForm(p) {
    $("#formTitle").textContent = p ? "Edit product" : "Add product";
    $("#fId").value = p ? p.id : "";
    $("#fName").value = p ? p.name : "";
    $("#fCat").value = p ? p.cat : ($("#catFilter").value !== "all" ? $("#catFilter").value : CATEGORIES[0].id);
    $("#fPack").value = p ? p.pack : "";
    $("#fPrice").value = p ? p.price : "";
    $("#fMrp").value = p && p.mrp != null ? p.mrp : "";
    $("#fShape").value = p ? p.shape : "box";
    $("#fRx").checked = p ? !!p.rx : false;
    $("#fDeal").checked = p ? !!p.deal : false;
    $("#fDesc").value = p ? (p.description || "") : "";
    formImages = (p && Array.isArray(p.images) ? p.images : []).map(url => ({ url }));
    removedUrls = [];
    renderImages();
    $("#formError").hidden = true;
    formDialog.showModal();
    $("#fName").focus();
  }

  $("#addBtn").addEventListener("click", () => openForm(null));
  $("#formClose").addEventListener("click", () => formDialog.close());

  $("#productForm").addEventListener("submit", async e => {
    e.preventDefault();
    const err = $("#formError");
    const fail = msg => { err.textContent = msg; err.hidden = false; };
    err.hidden = true;

    const price = parseFloat($("#fPrice").value);
    const mrpRaw = $("#fMrp").value.trim();
    const mrp = mrpRaw === "" ? null : parseFloat(mrpRaw);
    if (isNaN(price) || price < 0) return fail("Enter a valid price.");
    if (mrp !== null && (isNaN(mrp) || mrp < price)) return fail("MRP must be a number that is not lower than the price, or leave it empty.");

    const row = {
      name: $("#fName").value.trim(),
      cat: $("#fCat").value,
      pack: $("#fPack").value.trim(),
      price, mrp,
      shape: $("#fShape").value,
      rx: $("#fRx").checked,
      deal: $("#fDeal").checked,
      description: $("#fDesc").value.trim()
    };
    if (!row.name) return fail("Name is required.");

    const id = $("#fId").value;
    const saveBtn = $("#saveBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    const uploaded = [];            // photos uploaded in this save (so we can undo if the save fails)
    try {
      const urls = [];
      for (const im of formImages) {
        if (im.url) { urls.push(im.url); continue; }
        saveBtn.textContent = "Uploading photos...";
        const url = await uploadPhoto(im.file);
        uploaded.push(url);
        urls.push(url);
      }
      row.images = urls;

      saveBtn.textContent = "Saving...";
      const { error } = id
        ? await db.from("products").update(row).eq("id", id)
        : await db.from("products").insert(row);
      if (error) throw error;

      await removePhotos(removedUrls);   // photos the admin took out
      formImages.forEach(im => im.preview && URL.revokeObjectURL(im.preview));
      formDialog.close();
      toast(id ? "Product updated" : "Product added");
      loadAll();
    } catch (ex) {
      await removePhotos(uploaded);      // don't leave orphan photos behind
      fail(friendly(ex.message || String(ex)));
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save product";
    }
  });

  /* ---------- Delete ---------- */
  const delDialog = $("#delDialog");

  $("#rows").addEventListener("click", e => {
    const edit = e.target.closest("[data-edit]");
    if (edit) return openForm(products.find(p => String(p.id) === edit.dataset.edit));
    const del = e.target.closest("[data-del]");
    if (del) {
      deleteProduct = products.find(x => String(x.id) === del.dataset.del);
      $("#delText").textContent = `"${deleteProduct.name}" will be removed from the website, along with its photos. This cannot be undone.`;
      delDialog.showModal();
    }
  });

  $("#delConfirm").addEventListener("click", async () => {
    if (!deleteProduct) return;
    const target = deleteProduct;
    const btn = $("#delConfirm");
    btn.disabled = true;
    const { error } = await db.from("products").delete().eq("id", target.id);
    btn.disabled = false;
    delDialog.close();
    deleteProduct = null;
    if (error) { toast("Delete failed: " + error.message); return; }
    await removePhotos(target.images);
    toast("Product deleted");
    loadAll();
  });

  refreshSession();
}
