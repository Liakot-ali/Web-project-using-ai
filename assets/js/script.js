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
        // if productModal exists, prevent navigation and open modal instead
        if (document.getElementById('productModal')) {
          e.preventDefault();
          const card = e.currentTarget.closest('.product-card');
          if (card) openModalFromCard(card);
        }
      };
      link._ldsDetailsHandler = handler;
      link.addEventListener('click', handler);
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

  modalBackdrop.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ==========================
  // Contact form -> WhatsApp
  // ==========================
  const CONTACT_WHATSAPP_NUMBER = '8801XXXXXXXXX'; // international format without +

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
  const adminAdd = document.getElementById('adminAdd');
  const adminExport = document.getElementById('adminExport');
  const adminImport = document.getElementById('adminImport');
  const adminLogout = document.getElementById('adminLogout');

  function authAndOpenAdmin() {
    const logged = sessionStorage.getItem('lds_admin') === '1';
    if (!logged) {
      const pass = prompt('Admin passphrase:');
      if (!pass || pass !== ADMIN_PASSWORD) {
        alert('Authentication failed');
        return;
      }
      sessionStorage.setItem('lds_admin', '1');
    }
    openAdmin();
  }

  function openAdmin() {
    adminModal.setAttribute('aria-hidden', 'false');
    renderAdminList(loadProducts());
  }

  function closeAdmin() {
    adminModal.setAttribute('aria-hidden', 'true');
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
    localStorage.setItem('lds_products', JSON.stringify(products));
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
    const perGrid = Math.ceil(products.length / grids.length) || products.length;
    for (let i = 0; i < grids.length; i++) {
      const slice = products.slice(i * perGrid, (i + 1) * perGrid);
      grids[i].innerHTML = slice.map(p => {
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
    }
  }

  function renderAdminList(products) {
    adminList.innerHTML = '';
    products.forEach((p, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.dataset.index = idx;
      item.innerHTML = `
        <div class="admin-fields">
          <input data-key="name" value="${(p.name||'').replace(/"/g,'&quot;')}" placeholder="Product name">
          <input data-key="category" value="${(p.category||'').replace(/"/g,'&quot;')}" placeholder="Category">
          <input data-key="price" value="${(p.price||'').replace(/"/g,'&quot;')}" placeholder="Price">
          <input data-key="image" value="${(p.image||'').replace(/"/g,'&quot;')}" placeholder="Image URL">
          <textarea data-key="desc" placeholder="Short description">${(p.desc||'').replace(/</g,'&lt;')}</textarea>
        </div>
        <div class="admin-item-controls">
          <button class="btn admin-save">Save</button>
          <button class="btn admin-delete" style="background:#e06b6b">Delete</button>
        </div>`;
      adminList.appendChild(item);
    });

    // wire controls
    adminList.querySelectorAll('.admin-save').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.currentTarget.closest('.admin-item');
        const index = Number(item.dataset.index);
        const inputs = item.querySelectorAll('[data-key]');
        const prod = {};
        inputs.forEach(inp => { prod[inp.dataset.key] = inp.value; });
        const all = loadProducts();
        all[index] = Object.assign({}, all[index], prod);
        saveProducts(all);
        renderProductsToDOM(all);
        bindProductInteractions();
        alert('Saved — changes applied');
      });
    });

    adminList.querySelectorAll('.admin-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!confirm('Delete this product?')) return;
        const item = e.currentTarget.closest('.admin-item');
        const index = Number(item.dataset.index);
        const all = loadProducts();
        all.splice(index,1);
        saveProducts(all);
        renderAdminList(all);
        renderProductsToDOM(all);
        bindProductInteractions();
      });
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

  adminBackdrop.addEventListener('click', closeAdmin);
  adminClose.addEventListener('click', closeAdmin);

  adminAdd.addEventListener('click', () => {
    const all = loadProducts();
    all.unshift({ name: 'New Product', category:'General', price:'0', length:'', width:'', height:'', boardDepth:'', frameSize:'', material:'', weight:'', color:'', desc:'', image:'' });
    saveProducts(all);
    renderAdminList(all);
    renderProductsToDOM(all);
    bindProductInteractions();
  });

  adminExport.addEventListener('click', () => {
    const data = JSON.stringify(loadProducts(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'products-export.json'; a.click();
    URL.revokeObjectURL(url);
  });

  adminImport.addEventListener('click', () => {
    const txt = prompt('Paste products JSON here:');
    if (!txt) return;
    try {
      const data = JSON.parse(txt);
      if (!Array.isArray(data)) throw new Error('Expected array');
      saveProducts(data);
      renderAdminList(data);
      renderProductsToDOM(data);
      bindProductInteractions();
      alert('Imported and applied');
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  });

  adminLogout.addEventListener('click', () => { sessionStorage.removeItem('lds_admin'); closeAdmin(); alert('Logged out'); });

  // On load: if stored products exist, render them and bind interactions
  try {
    const stored = localStorage.getItem('lds_products');
    if (stored) {
      const products = JSON.parse(stored);
      if (Array.isArray(products) && products.length) {
        renderProductsToDOM(products);
        bindProductInteractions();
      }
    }
  } catch (e) { /* ignore parse errors */ }

});
