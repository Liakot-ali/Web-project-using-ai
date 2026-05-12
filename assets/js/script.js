// ===============================
// BUSINESS WEBSITE MAIN SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const orderButtons = document.querySelectorAll(".order-btn");
  // bind interactions for product cards (order buttons, details modal)
  function bindProductInteractions() {
    const orderButtonsNow = document.querySelectorAll('.order-btn');
    orderButtonsNow.forEach(btn => {
      btn.removeEventListener('click', btn._ldsOrderHandler);
      const handler = () => {
        alert('Thank you for your interest!\n\nWhatsApp ordering system will be connected here later.');
      };
      btn._ldsOrderHandler = handler;
      btn.addEventListener('click', handler);
    });

    // details: open modal from card if present, otherwise let link navigate
    const detailsLinks = document.querySelectorAll('.details-link');
    detailsLinks.forEach(link => {
      link.removeEventListener('click', link._ldsDetailsHandler);
      const handler = (e) => {
        const href = (link.getAttribute('href') || '').trim();
        // Allow normal navigation for explicit product page links and anchors
        if (href.includes('product.html') || href.startsWith('#') || href.startsWith('http')) {
          return;
        }
        // For other links (or missing href), open the modal when available
        if (document.getElementById('productModal')) {
          e.preventDefault();
          const card = e.currentTarget.closest('.product-card');
          if (card) openModalFromCard(card);
        }
      };
      link._ldsDetailsHandler = handler;
      link.addEventListener('click', handler);
    });

    // make entire product card clickable: navigate to details page or open modal
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.removeEventListener('click', card._ldsCardHandler);
      const handler = (e) => {
        // ignore clicks on interactive elements inside the card
        if (e.target.closest('a, button, input, textarea, select')) return;
        const link = card.querySelector('.details-link');
        if (!link) return;
        const href = (link.getAttribute('href') || '').trim();
        // if details link points to a dedicated product page, navigate
        if (href.includes('product.html')) {
          if (e.metaKey || e.ctrlKey) {
            window.open(href, '_blank');
          } else {
            window.location.href = href;
          }
          return;
        }
        // otherwise, if a product modal exists, open it
        if (document.getElementById('productModal')) {
          openModalFromCard(card);
        }
      };
      card._ldsCardHandler = handler;
      card.addEventListener('click', handler);
    });
  }

  // Details modal functionality
  const detailsButtons = document.querySelectorAll('.details-btn');
  const productModal = document.getElementById('productModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');

  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const specLength = document.getElementById('specLength');
  const specWidth = document.getElementById('specWidth');
  const specHeight = document.getElementById('specHeight');
  const specBoardDepth = document.getElementById('specBoardDepth');
  const specFrameSize = document.getElementById('specFrameSize');
  const specMaterial = document.getElementById('specMaterial');
  const specWeight = document.getElementById('specWeight');
  const specColor = document.getElementById('specColor');

  function openModalFromCard(card) {
    const titleEl = card.querySelector('.product-content h3');
    const descEl = card.querySelector('.product-content p');

    modalTitle.textContent = titleEl ? titleEl.textContent : 'Product Details';
    modalDescription.textContent = descEl ? descEl.textContent.trim() : '';

    const ds = card.dataset;
    specLength.textContent = ds.length || '—';
    specWidth.textContent = ds.width || '—';
    specHeight.textContent = ds.height || '—';
    specBoardDepth.textContent = ds.boardDepth || '—';
    specFrameSize.textContent = ds.frameSize || '—';
    specMaterial.textContent = ds.material || '—';
    specWeight.textContent = ds.weight || '—';
    specColor.textContent = ds.color || '—';

    productModal.setAttribute('aria-hidden', 'false');
    // trap focus could be added later
  }

  function closeModal() {
    productModal.setAttribute('aria-hidden', 'true');
  }

  detailsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      if (!card) return;
      openModalFromCard(card);
    });
  });

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ==========================
  // Contact form -> WhatsApp
  // ==========================
  let CONTACT_WHATSAPP_NUMBER = '8801XXXXXXXXX'; // international format without +

  function openWhatsAppWithMessage(number, text) {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${number}?text=${encoded}`;
    window.open(url, '_blank');
  }

  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  const waPrimary = document.getElementById('waPrimary');
  const waDirect = document.getElementById('waDirect');
  const emailFallback = document.getElementById('emailFallback');

  if (waPrimary) {
    waPrimary.addEventListener('click', (e) => {
      e.preventDefault();
      // focus the form for quick fill
      const n = document.getElementById('cName');
      if (n) n.focus();
    });
  }

  if (waDirect) {
    waDirect.addEventListener('click', (e) => {
      e.preventDefault();
      const txt = `Hello Liton Desk Studio! I'm reaching out via your website.`;
      openWhatsAppWithMessage(CONTACT_WHATSAPP_NUMBER, txt);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactStatus.textContent = '';

      const name = (document.getElementById('cName') || {}).value || '';
      const phone = (document.getElementById('cPhone') || {}).value || '';
      const email = (document.getElementById('cEmail') || {}).value || '';
      const message = (document.getElementById('cMessage') || {}).value || '';

      if (!name.trim() || !message.trim()) {
        contactStatus.textContent = 'Please add your name and a short message.';
        return;
      }

      const payload = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
      contactStatus.textContent = 'Opening WhatsApp…';
      setTimeout(() => {
        openWhatsAppWithMessage(CONTACT_WHATSAPP_NUMBER, payload);
        contactStatus.textContent = '';
      }, 250);
    });
  }

  if (emailFallback) {
    emailFallback.addEventListener('click', () => {
      const name = (document.getElementById('cName') || {}).value || '';
      const email = (document.getElementById('cEmail') || {}).value || '';
      const message = (document.getElementById('cMessage') || {}).value || '';
      const subject = encodeURIComponent(`Contact from website: ${name || 'Visitor'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:yourmail@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // ==========================
  // Admin editor (hidden shortcut + password)
  // Ctrl/Cmd + Shift + A to open
  // Stores products in localStorage under 'lds_products'
  // ==========================
  const ADMIN_PASSWORD = 'change-me-please'; // change this value to a strong passphrase
  const adminModal = document.getElementById('adminModal');
  const adminBackdrop = document.getElementById('adminBackdrop');
  const adminClose = document.getElementById('adminClose');
  const adminList = document.getElementById('adminList');
  const adminReviewsEl = document.getElementById('adminReviews');
  const adminSiteEl = document.getElementById('adminSite');
  const adminAdd = document.getElementById('adminAdd');
  const adminExport = document.getElementById('adminExport');
  const adminImport = document.getElementById('adminImport');
  const adminLogout = document.getElementById('adminLogout');
  const adminAddReview = document.getElementById('adminAddReview');

  const ADMIN_LOCK_KEY = 'lds_admin_lock';
  const ADMIN_LOCK_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  const ADMIN_HEARTBEAT_MS = 25 * 1000; // refresh lock every 25s
  let adminHeartbeatInterval = null;

  function authAndOpenAdmin() {
    // Always require passphrase on each entry
    const passRaw = prompt('Admin passphrase:');
    const pass = passRaw ? passRaw.trim() : '';
    if (!pass) { alert('Authentication cancelled'); return; }
    if (pass !== ADMIN_PASSWORD) { alert('Authentication failed — incorrect passphrase'); return; }

    // generate a local owner id for this session
    const owner = sessionStorage.getItem('lds_admin_owner') || (`owner-${Date.now()}-${Math.floor(Math.random()*100000)}`);
    sessionStorage.setItem('lds_admin_owner', owner);

    // attempt to acquire lock
    const now = Date.now();
    try {
      const raw = localStorage.getItem(ADMIN_LOCK_KEY);
      if (raw) {
        try {
          const lock = JSON.parse(raw);
          // if another owner holds a fresh lock, deny entry
          if (lock && lock.ts && (now - lock.ts) < ADMIN_LOCK_TIMEOUT && lock.owner && lock.owner !== owner) {
            alert('Admin panel is currently in use by another user. Try again later.');
            return;
          }
        } catch (e) {
          // continue if parse fails
        }
      }
      // set lock for this owner
      const newLock = { owner, ts: now };
      localStorage.setItem(ADMIN_LOCK_KEY, JSON.stringify(newLock));
      // navigate to admin page
      window.location.href = 'admin.html';
    } catch (e) {
      alert('Unable to open admin page: ' + (e && e.message));
    }
  }

  // lock helpers used on admin page to refresh and release lock
  function refreshAdminLock() {
    try {
      const owner = sessionStorage.getItem('lds_admin_owner');
      if (!owner) return false;
      const now = Date.now();
      const lock = { owner, ts: now };
      localStorage.setItem(ADMIN_LOCK_KEY, JSON.stringify(lock));
      return true;
    } catch (e) { return false; }
  }

  function releaseAdminLock() {
    try {
      const owner = sessionStorage.getItem('lds_admin_owner');
      if (!owner) return;
      const raw = localStorage.getItem(ADMIN_LOCK_KEY);
      if (!raw) return;
      const lock = JSON.parse(raw);
      if (lock && lock.owner === owner) {
        localStorage.removeItem(ADMIN_LOCK_KEY);
      }
    } catch (e) {}
  }

  // start heartbeat to keep lock alive while on admin page
  function startAdminHeartbeat() {
    stopAdminHeartbeat();
    refreshAdminLock();
    adminHeartbeatInterval = setInterval(refreshAdminLock, ADMIN_HEARTBEAT_MS);
  }

  function stopAdminHeartbeat() {
    if (adminHeartbeatInterval) { clearInterval(adminHeartbeatInterval); adminHeartbeatInterval = null; }
  }

  function openAdmin() {
    if (adminModal) {
      adminModal.setAttribute('aria-hidden', 'false');
      const content = adminModal.querySelector('.admin-content');
      if (content && !content.hasAttribute('tabindex')) content.setAttribute('tabindex', '-1');
      try { content.focus(); } catch (e) {}
    }
    renderAdminList(loadProducts());
  }

  function closeAdmin() {
    if (adminModal) adminModal.setAttribute('aria-hidden', 'true');
  }

  function loadProducts() {
    try {
      const raw = localStorage.getItem('lds_products');
      if (raw) return JSON.parse(raw);
    } catch(e){}
    // fallback: build from DOM product-cards
    const cards = Array.from(document.querySelectorAll('.product-card'));
    const items = cards.map(c => {
      const img = c.querySelector('img');
      const title = c.querySelector('.product-content h3')?.textContent || '';
      const desc = c.querySelector('.product-content p')?.textContent || '';
      const price = c.querySelector('.price')?.textContent?.replace(/[^0-9.]/g,'') || '';
      const ds = c.dataset || {};
      return {
        name: title,
        category: ds.category || ds.category || 'General',
        price: price,
        length: ds.length || '',
        width: ds.width || '',
        height: ds.height || '',
        boardDepth: ds.boardDepth || '',
        frameSize: ds.frameSize || '',
        material: ds.material || '',
        weight: ds.weight || '',
        color: ds.color || '',
        desc: desc,
        image: img ? img.getAttribute('src') : ''
      };
    });
    return items;
  }

  function saveProducts(products) {
    // keep local copy for immediate UI updates
    try { localStorage.setItem('lds_products', JSON.stringify(products)); } catch (e) {}
    // attempt to persist to server if available
    try {
      fetch('/api/products', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      }).then(res => {
        if (!res.ok) console.warn('Failed to persist to /api/products', res.status);
      }).catch(err => {
        console.warn('Persist to server failed', err && err.message);
      });
    } catch (e) { /* ignore */ }
  }

  // Site data (contact, reviews)
  function loadSite() {
    try {
      const raw = localStorage.getItem('lds_site');
      if (raw) return JSON.parse(raw);
    } catch(e){}
    // fallback: derive from DOM
    const phone = document.getElementById('contactPhone')?.textContent?.trim() || '';
    const email = document.getElementById('contactEmail')?.textContent?.trim() || '';
    const address = document.getElementById('contactAddress')?.textContent?.trim() || '';
    const hours = document.getElementById('contactHours')?.textContent?.trim() || '';
    // reviews from DOM
    const reviews = [];
    document.querySelectorAll('#reviewsList .review-card').forEach(rc => {
      const name = rc.querySelector('.review-name')?.textContent || '';
      const text = rc.querySelector('.review-text')?.textContent || '';
      const meta = rc.querySelector('.review-meta small')?.textContent || '';
      const footer = rc.querySelector('.review-footer')?.textContent || '';
      reviews.push({ name, meta, text, footer });
    });
    return { contact: { phone, email, address, hours }, reviews };
  }

  function saveSite(site) {
    try { localStorage.setItem('lds_site', JSON.stringify(site)); } catch(e){}
    // attempt to persist to server
    try {
      fetch('/api/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) })
        .then(res => { if (!res.ok) console.warn('Failed to persist site', res.status); })
        .catch(err => console.warn('Persist site failed', err && err.message));
    } catch (e) {}
    // update live DOM
    try { applySiteToDOM(site); } catch(e){}
  }

  function applySiteToDOM(site) {
    if (!site) return;
    const c = site.contact || {};
    if (c.whatsapp) CONTACT_WHATSAPP_NUMBER = String(c.whatsapp).replace(/^\+/, '').replace(/[^0-9]/g,'');
    if (c.phone) {
      const p = document.getElementById('contactPhone'); if (p) { p.textContent = c.phone; p.href = 'tel:' + c.phone.replace(/\s+/g,''); }
    }
    if (c.email) { const e = document.getElementById('contactEmail'); if (e) { e.textContent = c.email; e.href = 'mailto:' + c.email; } }
    if (c.address) { const a = document.getElementById('contactAddress'); if (a) a.textContent = c.address; }
    if (c.hours) { const h = document.getElementById('contactHours'); if (h) h.textContent = c.hours; }
    // reviews
    if (Array.isArray(site.reviews)) renderReviewsList(site.reviews);
  }

  function renderReviewsList(reviews) {
    const container = document.getElementById('reviewsList'); if (!container) return;
    container.innerHTML = (reviews || []).map(r => `
      <article class="review-card" role="listitem">
        <div class="review-avatar"><img src="${r.avatar||'assets/images/avatar-1.svg'}" alt="Avatar of ${r.name||''}" width="72" height="72"></div>
        <div class="review-body">
          <div class="review-name">${(r.name||'').replace(/</g,'&lt;')} <span class="review-meta">${(r.meta||'')}</span></div>
          <div class="review-meta">${r.stars?`<span class="review-stars">${r.stars}</span>`:''} <small>${r.rating? r.rating + '/5' : ''}</small></div>
          <div class="review-text">${(r.text||'').replace(/</g,'&lt;')}</div>
          <div class="review-footer">${(r.footer||'')}</div>
        </div>
      </article>
    `).join('\n');
  }

  function createDetailsUrl(p) {
    const params = new URLSearchParams();
    params.set('name', p.name || 'Product');
    params.set('category', p.category || 'General');
    params.set('price', p.price || '0');
    params.set('length', p.length || '');
    params.set('width', p.width || '');
    params.set('height', p.height || '');
    params.set('boardDepth', p.boardDepth || '');
    params.set('frameSize', p.frameSize || '');
    params.set('material', p.material || '');
    params.set('weight', p.weight || '');
    params.set('color', p.color || '');
    params.set('desc', p.desc || '');
    params.set('image', p.image || '');
    return `product.html?${params.toString()}`;
  }

  function renderProductsToDOM(products) {
    const grids = Array.from(document.querySelectorAll('.product-grid'));
    if (!grids.length) return;
    // sort by priority desc (higher priority first). Missing priority -> 0
    const sorted = (products || []).slice().sort((a,b)=> (Number(b.priority)||0) - (Number(a.priority)||0));
    // Homepage: show top 6 only in the first product grid
    const top = sorted.slice(0,6);
    grids[0].innerHTML = top.map(p => {
        const img = p.image || 'assets/images/placeholder.svg';
        const priceLabel = p.price ? `৳ ${p.price}` : '';
        const details = createDetailsUrl(p);
        return `
          <div class="product-card" data-length="${p.length || ''}" data-width="${p.width || ''}" data-height="${p.height || ''}" data-board-depth="${p.boardDepth || ''}" data-frame-size="${p.frameSize || ''}" data-material="${p.material || ''}" data-weight="${p.weight || ''}" data-color="${p.color || ''}">
            <img src="${img}" alt="${(p.name||'Product').replace(/"/g,'')}">
            <div class="product-content">
              <h3>${(p.name||'Product').replace(/</g,'&lt;')}</h3>
              <p>${(p.desc||'').replace(/</g,'&lt;')}</p>
              <div class="price">${priceLabel}</div>
              <div class="product-actions">
                <button class="btn order-btn">Order Now</button>
                <a class="btn details-link" href="${details}">Details</a>
              </div>
            </div>
          </div>`;
    }).join('\n');

    // Clear other grids so duplicates don't appear
    for (let i = 1; i < grids.length; i++) grids[i].innerHTML = '';
  }

  function renderAdminList(products) {
    // Render concise list with Edit link for each product (opens admin-edit.html?idx=N)
    adminList.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'admin-list-compact';
    products.forEach((p, idx) => {
      const row = document.createElement('div');
      row.className = 'admin-list-row';
      row.dataset.index = idx;
      row.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center;">
          <div style="width:40px"><img src="${(p.image||'assets/images/placeholder.svg')}" alt="" style="max-width:40px;max-height:40px"></div>
          <div style="flex:1"><strong>${(p.name||'Untitled').replace(/</g,'&lt;')}</strong><div style="font-size:13px;color:#666">${(p.category||'').replace(/</g,'&lt;')} • ৳ ${p.price||''}</div></div>
          <div style="display:flex;gap:8px">
            <a class="btn" href="admin-edit.html?idx=${idx}">Edit</a>
            <button class="btn admin-delete" style="background:#e06b6b">Delete</button>
          </div>
        </div>
      `;
      list.appendChild(row);
    });
    adminList.appendChild(list);

    // wire delete buttons
    adminList.querySelectorAll('.admin-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!confirm('Delete this product from database?')) return;
        const row = e.currentTarget.closest('.admin-list-row');
        const idx = Number(row.dataset.index);
        const all = loadProducts();
        all.splice(idx,1);
        saveProducts(all);
        renderAdminList(all);
        renderProductsToDOM(all);
        bindProductInteractions();
      });
    });
  }

  function renderAdminReviews(site) {
    if (!adminReviewsEl) return;
    const reviews = (site && Array.isArray(site.reviews)) ? site.reviews : [];
    adminReviewsEl.innerHTML = '';
    reviews.forEach((r, i) => {
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.dataset.index = i;
      item.innerHTML = `
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <label style="flex:1">Name<br><input data-key="name" value="${(r.name||'').replace(/"/g,'&quot;')}"></label>
          <label style="flex:1">Location/meta<br><input data-key="meta" value="${(r.meta||'').replace(/"/g,'&quot;')}"></label>
          <label style="width:120px">Rating (1-5)<br><input data-key="rating" value="${(r.rating||'').replace(/"/g,'&quot;')}"></label>
          <label style="width:140px">Avatar URL<br><input data-key="avatar" value="${(r.avatar||'').replace(/"/g,'&quot;')}"></label>
        </div>
        <label>Review text<br><textarea data-key="text">${(r.text||'').replace(/</g,'&lt;')}</textarea></label>
        <label>Footer<br><input data-key="footer" value="${(r.footer||'').replace(/"/g,'&quot;')}"></label>
        <div style="margin-top:8px"><button class="btn review-save">Save</button> <button class="btn review-delete" style="background:#e06b6b">Delete</button></div>
      `;
      adminReviewsEl.appendChild(item);
    });

    // wire buttons
    adminReviewsEl.querySelectorAll('.review-save').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.currentTarget.closest('.admin-item');
        const idx = Number(item.dataset.index);
        const inputs = item.querySelectorAll('[data-key]');
        const obj = {};
        inputs.forEach(inp => obj[inp.dataset.key] = inp.value);
        const site = loadSite();
        site.reviews = site.reviews || [];
        site.reviews[idx] = obj;
        saveSite(site);
        renderAdminReviews(site);
        alert('Review saved');
      });
    });

    adminReviewsEl.querySelectorAll('.review-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!confirm('Delete this review?')) return;
        const item = e.currentTarget.closest('.admin-item');
        const idx = Number(item.dataset.index);
        const site = loadSite();
        site.reviews = site.reviews || [];
        site.reviews.splice(idx,1);
        saveSite(site);
        renderAdminReviews(site);
      });
    });
  }

  function renderAdminSite(site) {
    if (!adminSiteEl) return;
    const c = (site && site.contact) ? site.contact : { phone: '', whatsapp: '', email:'', address:'', hours: '' };
    adminSiteEl.innerHTML = `
      <label>Phone<br><input id="_admin_site_phone" value="${(c.phone||'').replace(/"/g,'&quot;')}"></label>
      <label>WhatsApp (number)<br><input id="_admin_site_wa" value="${(c.whatsapp||'').replace(/"/g,'&quot;')}"></label>
      <label>Email<br><input id="_admin_site_email" value="${(c.email||'').replace(/"/g,'&quot;')}"></label>
      <label>Address<br><input id="_admin_site_address" value="${(c.address||'').replace(/"/g,'&quot;')}"></label>
      <label>Hours<br><input id="_admin_site_hours" value="${(c.hours||'').replace(/"/g,'&quot;')}"></label>
      <div style="margin-top:8px"><button id="_admin_site_save" class="btn">Save Site Info</button></div>
    `;
    document.getElementById('_admin_site_save').addEventListener('click', () => {
      const siteNow = loadSite();
      siteNow.contact = {
        phone: document.getElementById('_admin_site_phone').value,
        whatsapp: document.getElementById('_admin_site_wa').value,
        email: document.getElementById('_admin_site_email').value,
        address: document.getElementById('_admin_site_address').value,
        hours: document.getElementById('_admin_site_hours').value
      };
      saveSite(siteNow);
      renderAdminSite(siteNow);
      alert('Site info saved');
    });
  }

  // shortcut
  document.addEventListener('keydown', (ev) => {
    const mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ok = ((mac && ev.metaKey) || (!mac && ev.ctrlKey)) && ev.shiftKey && ev.key.toLowerCase() === 'a';
    if (ok) {
      ev.preventDefault();
      authAndOpenAdmin();
    }
  });

  // admin entry button (visible control)
  const adminEntryBtn = document.getElementById('adminEntryBtn');
  if (adminEntryBtn) {
    adminEntryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      authAndOpenAdmin();
    });
  }

  if (adminBackdrop) adminBackdrop.addEventListener('click', closeAdmin);
  if (adminClose) adminClose.addEventListener('click', closeAdmin);

  if (adminAdd) {
    adminAdd.addEventListener('click', () => {
      const all = loadProducts();
      all.unshift({ name: 'New Product', category:'General', price:'0', priority:'0', length:'', width:'', height:'', boardDepth:'', frameSize:'', material:'', weight:'', color:'', desc:'', image:'' });
      saveProducts(all);
      renderAdminList(all);
      renderProductsToDOM(all);
      bindProductInteractions();
    });
  }

  if (adminAddReview) {
    adminAddReview.addEventListener('click', () => {
      const site = loadSite();
      site.reviews = site.reviews || [];
      site.reviews.unshift({ name: 'New Reviewer', meta: '', rating: '5', text: 'New review content', footer: '' });
      saveSite(site);
      renderAdminReviews(site);
    });
  }

  if (adminExport) {
    adminExport.addEventListener('click', () => {
      const data = JSON.stringify(loadProducts(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'products-export.json'; a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (adminImport) {
    adminImport.addEventListener('click', async () => {
      const filePath = 'assets/data/seed-products.json';
      // Try to fetch the JSON file bundled in the repo first
      try {
        const res = await fetch(filePath, { cache: 'no-store' });
        if (res.ok) {
          const proceed = confirm('Import products from "' + filePath + '"? This will overwrite current products. Continue?');
          if (!proceed) return;
          const data = await res.json();
          if (!Array.isArray(data)) throw new Error('Expected JSON array');
          saveProducts(data);
          renderAdminList(data);
          renderProductsToDOM(data);
          bindProductInteractions();
          alert('Imported products from file and applied.');
          return;
        }
      } catch (e) {
        console.warn('Fetch of', filePath, 'failed:', e && e.message);
      }

      // Fallback to manual paste if file fetch not available (file:// or missing)
      const txt = prompt('Paste products JSON here:');
      if (!txt) return;
      try {
        const data = JSON.parse(txt);
        if (!Array.isArray(data)) throw new Error('Expected array');
        if (!confirm('Import pasted JSON and overwrite current products?')) return;
        saveProducts(data);
        renderAdminList(data);
        renderProductsToDOM(data);
        bindProductInteractions();
        alert('Imported and applied');
      } catch (e) {
        alert('Invalid JSON: ' + e.message);
      }
    });
  }

  if (adminLogout) {
    adminLogout.addEventListener('click', () => {
      try { releaseAdminLock(); stopAdminHeartbeat(); } catch (e) {}
      sessionStorage.removeItem('lds_admin');
      sessionStorage.removeItem('lds_admin_owner');
      closeAdmin();
      alert('Logged out');
      // if we're on admin page, go back to site
      if (window.location.pathname && window.location.pathname.endsWith('admin.html')) {
        window.location.href = 'index.html';
      }
    });
  }

  // If running on admin.html, validate/claim lock and start heartbeat
  try {
    if (window.location.pathname && window.location.pathname.endsWith('admin.html')) {
      const owner = sessionStorage.getItem('lds_admin_owner');
      const raw = localStorage.getItem(ADMIN_LOCK_KEY);
      const now = Date.now();
      let allowed = false;
      if (raw) {
        try {
          const lock = JSON.parse(raw);
          if (lock && lock.owner === owner) allowed = true;
          if (lock && (now - lock.ts) >= ADMIN_LOCK_TIMEOUT) allowed = true; // expired
        } catch (e) { allowed = true; }
      } else {
        allowed = true;
      }
      if (!allowed) {
        alert('Admin panel is currently in use by another user. You cannot open it now.');
        window.location.href = 'index.html';
      } else {
        // claim and start heartbeat
        refreshAdminLock();
        startAdminHeartbeat();
        // render admin UI now that lock is claimed
        try { 
          renderAdminList(loadProducts()); 
          // load site info from server if available
          (async ()=>{
            try {
              const res = await fetch('/api/site', { cache: 'no-store' });
              if (res.ok) {
                const site = await res.json();
                try { localStorage.setItem('lds_site', JSON.stringify(site)); } catch(e){}
                renderAdminReviews(site);
                renderAdminSite(site);
                return;
              }
            } catch(e){}
            // fallback to local
            const s = loadSite();
            renderAdminReviews(s);
            renderAdminSite(s);
          })();
        } catch (e) {}
      }
    }
  } catch (e) {}

  // ensure lock released when leaving admin page
  window.addEventListener('beforeunload', () => {
    try { releaseAdminLock(); stopAdminHeartbeat(); } catch (e) {}
  });

  // On load: if stored products exist, render them and bind interactions
  try {
    // First try to load products from server API; if unavailable, fall back to localStorage
    (async function(){
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            saveProducts(data); // saves to localStorage and attempts server persist
            renderProductsToDOM(data);
            bindProductInteractions();
            return;
          }
        }
      } catch(e) {
        // fetch failed; fall back
      }
      const stored = localStorage.getItem('lds_products');
      if (stored) {
        const products = JSON.parse(stored);
        if (Array.isArray(products) && products.length) {
          renderProductsToDOM(products);
          bindProductInteractions();
        }
      }
    })();
    // load site info (contact & reviews) from server if available
    (async function(){
      try {
        const res = await fetch('/api/site', { cache: 'no-store' });
        if (res.ok) {
          const site = await res.json();
          try { localStorage.setItem('lds_site', JSON.stringify(site)); } catch(e){}
          applySiteToDOM(site);
          return;
        }
      } catch(e) {}
      // fallback to local/site derived from DOM
      try { applySiteToDOM(loadSite()); } catch(e){}
    })();
  } catch (e) { /* ignore parse errors */ }

});
