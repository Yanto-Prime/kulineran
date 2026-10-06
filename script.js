  function toggleMenu() {
    const drawer = document.getElementById("nav-drawer");
    const overlay = document.getElementById("nav-overlay");
    drawer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  const products = [
    { id: 1, name: "Roti Ganda", seller: "Toko Roti Ganda Malanton", area: "Jl. Sutomo, Siantar", price: "Rp 4.000/pcs", desc: "Roti legendaris Siantar sejak 1979, isi mentega & meses klasik.", tag: "Ikon Siantar", cat: "Roti & Jajanan" },
    { id: 2, name: "Kopi Kok Tong", seller: "Kedai Kopi Kok Tong", area: "Jl. Cipto, Siantar", price: "Rp 45.000/250gr", desc: "Kopi sangrai turun-temurun sejak 1925, aroma khas robusta lokal.", tag: "Sejak 1925", cat: "Minuman" },
    { id: 3, name: "Mie Gomak Siantar", seller: "Warung Mie Gomak Ka Ita", area: "Jl. Sriwijaya, Siantar", price: "Rp 15k - 20k", desc: "Mie lidi bumbu andaliman, pedas gurih khas Batak.", tag: "Pedas Andaliman", cat: "Makanan Berat" },
    { id: 4, name: "Nasi Lauk Gulai Siantar", seller: "Rumah Makan Bu Hikmah", area: "Jl. Sriwijaya, Siantar", price: "Rp 35k - 40k", desc: "Spesialisasi nasi gulai. Lauk besar, rasa autentik Siantar.", tag: "Nasi Gulai", cat: "Makanan Berat" },
    { id: 5, name: "Gulai Ayam Rempah", seller: "Rumah Makan Boru Siantar", area: "Jl. Asahan, Siantar", price: "Rp 28.000/porsi", desc: "Gulai rempah kental, resep keluarga tiga generasi.", tag: "Resep Keluarga", cat: "Makanan Berat" },
    { id: 6, name: "Bika Panggang Siantar", seller: "Toko Kue Siantar Manis", area: "Jl. Diponegoro, Siantar", price: "Rp 25.000/loyang", desc: "Bika gula aren panggang, tekstur lembut aroma pandan.", tag: "Tahan 3 Hari", cat: "Roti & Jajanan" },
    { id: 7, name: "Arsik Ikan Mas", seller: "Lapo Boru Tobing (contoh)", area: "Siantar", price: "Rp 45.000/porsi", desc: "Ikan mas bumbu andaliman kuning, masakan pesta Batak.", tag: "Khas Batak", cat: "Makanan Berat" },
    { id: 8, name: "Teh Susu Telur", seller: "Kedai Teh Siantar (contoh)", area: "Siantar", price: "Rp 12.000/gelas", desc: "Teh hangat kocok telur dan susu, favorit pagi hari.", tag: "Hangat", cat: "Minuman" },
    { id: 9, name: "Lemang Tapai", seller: "Dapur Mak Uda (contoh)", area: "Siantar", price: "Rp 30.000/batang", desc: "Lemang ketan bakar bambu dengan tapai manis.", tag: "Musiman", cat: "Roti & Jajanan" },
  ];

  let activeProduct = null;
  let toastTimer = null;

  function renderWeave(el){
    let html = "";
    for(let i=0;i<24;i++){
      const color = i%3===0 ? "var(--gold)" : i%3===1 ? "var(--maroon)" : "var(--cream)";
      html += `<span style="background:${color}"></span>`;
    }
    el.innerHTML = html;
  }
  ["weave1","weave2","weave3","weave4"].forEach(id => { const el=document.getElementById(id); if(el) renderWeave(el); });

  let activeCat = "Semua";
  function renderCatalog(){
    const grid = document.getElementById("card-grid");
    if(!grid) return;
    const limit = parseInt(grid.dataset.limit || "0");
    const q = (document.getElementById("search-input")?.value || "").toLowerCase();
    const sort = document.getElementById("sort-select")?.value || "default";
    let list = products.filter(p => (activeCat==="Semua" || p.cat===activeCat) && (p.name+p.seller+p.desc).toLowerCase().includes(q));
    if(sort==="az") list = [...list].sort((a,b)=>a.name.localeCompare(b.name));
    if(limit) list = list.slice(0, limit);
    const cnt = document.getElementById("katalog-count");
    if(cnt) cnt.textContent = list.length + " hidangan ditampilkan";
    grid.innerHTML = list.length ? list.map(p => `
      <div class="card">
        <div class="card-top">
          <span class="tag mono">${p.tag}</span>
          <span class="price mono">${p.price}</span>
        </div>
        <div class="card-body">
          <h3 class="serif">${p.name}</h3>
          <p class="desc">${p.desc}</p>
          <div class="seller-loc">📍 ${p.seller} &middot; ${p.area}</div>
        </div>
        <button class="card-btn" onclick="openOrderModal(${p.id})">💬 Pesan hidangan ini</button>
      </div>`).join("") : '<p class="empty">Hidangan tidak ditemukan. Coba kata kunci lain atau pilih kategori Semua.</p>';
  }
  function setCat(c, btn){
    activeCat = c;
    document.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x===btn));
    renderCatalog();
  }
  const statP = document.getElementById("stat-products"); if(statP) statP.textContent = products.length;
  renderCatalog();

  function openOrderModal(id){
    activeProduct = products.find(p => p.id === id);
    document.getElementById("order-product-name").textContent = activeProduct.name;
    document.getElementById("order-product-seller").textContent = activeProduct.seller;
    document.getElementById("order-form").reset();
    document.getElementById("order-qty").value = 1;
    document.getElementById("order-error").style.display = "none";
    document.getElementById("order-overlay").classList.add("open");
  }
  function closeOrderModal(){
    document.getElementById("order-overlay").classList.remove("open");
  }

  async function submitOrder(e){
    e.preventDefault();
    const name = document.getElementById("order-name").value.trim();
    const phone = document.getElementById("order-phone").value.trim();
    const qty = document.getElementById("order-qty").value;
    const note = document.getElementById("order-note").value.trim();
    const errorEl = document.getElementById("order-error");

    if(!name || !phone){
      errorEl.textContent = "Nama dan nomor WhatsApp wajib diisi.";
      errorEl.style.display = "block";
      return;
    }
    errorEl.style.display = "none";

    const btn = document.getElementById("order-submit-btn");
    btn.disabled = true;
    btn.textContent = "Menyiapkan pesan...";

    const order = { product: activeProduct.name, seller: activeProduct.seller, buyer: name, phone, qty, note, time: new Date().toISOString() };
    try{
      if(window.storage){
        await window.storage.set(`orders:${Date.now()}`, JSON.stringify(order), true);
      }
    }catch(err){
      console.error("Gagal menyimpan catatan pesanan:", err);
    }

    const msg = encodeURIComponent(
      `Halo, saya ${name} ingin pesan:\n\n` +
      `Menu: ${activeProduct.name} (${activeProduct.seller})\n` +
      `Jumlah: ${qty}\n` +
      `Catatan: ${note || "-"}\n` +
      `No. WA saya: ${phone}`
    );
    window.open(`https://wa.me/${window.CONNECTOR_PHONE}?text=${msg}`, "_blank");

    btn.disabled = false;
    btn.textContent = "Lanjut ke WhatsApp";
    closeOrderModal();
    showToast("Pesanan disiapkan — lanjutkan di WhatsApp");
  }

  function openSellerModal(){
    document.getElementById("seller-form").reset();
    document.getElementById("seller-error").style.display = "none";
    document.getElementById("seller-overlay").classList.add("open");
  }
  function closeSellerModal(){
    document.getElementById("seller-overlay").classList.remove("open");
  }

  async function submitSeller(e){
    e.preventDefault();
    const shop = document.getElementById("seller-shop").value.trim();
    const owner = document.getElementById("seller-owner").value.trim();
    const phone = document.getElementById("seller-phone").value.trim();
    const menu = document.getElementById("seller-menu").value.trim();
    const errorEl = document.getElementById("seller-error");

    if(!shop || !phone){
      errorEl.textContent = "Nama warung dan nomor WhatsApp wajib diisi.";
      errorEl.style.display = "block";
      return;
    }
    errorEl.style.display = "none";

    const btn = document.getElementById("seller-submit-btn");
    btn.disabled = true;
    btn.textContent = "Menyiapkan pesan...";

    const seller = { shop, owner, phone, menu, time: new Date().toISOString() };
    try{
      if(window.storage){
        await window.storage.set(`sellers:${Date.now()}`, JSON.stringify(seller), true);
      }
    }catch(err){
      console.error("Gagal menyimpan data mitra:", err);
    }

    const msg = encodeURIComponent(
      `Halo, saya ingin daftar sebagai mitra penjual Dapur Siantar.\n\n` +
      `Nama warung: ${shop}\n` +
      `Nama pemilik: ${owner}\n` +
      `Menu andalan: ${menu || "-"}\n` +
      `No. WA: ${phone}`
    );
    window.open(`https://wa.me/${window.CONNECTOR_PHONE}?text=${msg}`, "_blank");

    btn.disabled = false;
    btn.textContent = "Kirim pendaftaran";
    closeSellerModal();
    showToast("Pendaftaran dikirim — lanjutkan di WhatsApp");
  }

  function showToast(text){
    const toast = document.getElementById("toast");
    document.getElementById("toast-text").textContent = text;
    toast.classList.add("open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("open"), 4000);
  }
