// Admin single-product editor
(function(){
  function qs(id){ return document.getElementById(id); }
  function getIdx(){ const url = new URL(location.href); const v = url.searchParams.get('idx'); return v===null? null: Number(v); }

  function loadProductsLocal() {
    try {
      const raw = localStorage.getItem('lds_products');
      if (raw) return JSON.parse(raw);
    } catch(e){}
    return [];
  }
  function saveProducts(products) {
    try { localStorage.setItem('lds_products', JSON.stringify(products)); } catch(e){}
    try {
      fetch('/api/products', { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(products) })
        .then(res => { if (!res.ok) console.warn('Failed to persist products', res.status); })
        .catch(err => console.warn('Persist failed', err && err.message));
    } catch(e){}
  }

  function populateForm(prod){
    qs('p_name').value = prod.name || '';
      qs('p_category').value = prod.category || '';
    qs('p_price').value = prod.price || '';
    qs('p_priority').value = prod.priority || '';
    qs('p_image').value = prod.image || '';
    qs('p_desc').value = prod.desc || '';
    qs('p_length').value = prod.length || '';
    qs('p_width').value = prod.width || '';
    qs('p_height').value = prod.height || '';
    qs('p_boardDepth').value = prod.boardDepth || '';
    qs('p_frameSize').value = prod.frameSize || '';
    qs('p_material').value = prod.material || '';
    qs('p_weight').value = prod.weight || '';
    qs('p_color').value = prod.color || '';
  }

  async function init(){
    const idx = getIdx();
    const status = qs('editStatus');
    let localProducts = loadProductsLocal();
    let products = [];
    // Try fetching server copy; but prefer local if it has newer items (length greater)
    try {
      const res = await fetch('/api/products', { cache:'no-store' });
      if (res.ok) {
        const srv = await res.json();
        if (Array.isArray(srv)) products = srv;
      }
    } catch(e) {
      // ignore
    }
    // If local has more items (e.g., newly added locally), prefer local
    if (Array.isArray(localProducts) && localProducts.length > (products.length || 0)) {
      products = localProducts;
    }
    // fallback to local if server empty
    if (!Array.isArray(products) || products.length === 0) products = localProducts;

    if (idx === null || idx < 0 || idx >= products.length) {
      status.textContent = 'Invalid product index. Back to list to select a product.';
      return;
    }

    let prod = products[idx] || {};
      // populate category select from products (local preferred)
      try {
        const cats = uniqueCategories(Array.isArray(localProducts) && localProducts.length ? localProducts : products);
        if (cats.length) populateCategoryOptions(cats);
      } catch(e){}
    populateForm(prod);

      // wire image preview update when admin edits image url
      const imgInput = qs('p_image'); if (imgInput) {
        imgInput.addEventListener('input', () => {
          const val = imgInput.value || '';
          const prev = qs('p_image_preview'); if (prev) prev.src = val || 'assets/images/placeholder.svg';
        });
      }

    function populateCategoryOptions(categories) {
      const sel = qs('p_category'); if (!sel) return;
      // clear but keep placeholder
      const placeholder = sel.querySelector('option[value=""]') ? '' : '""';
      sel.innerHTML = '<option value="">— Select category —</option>' + (categories || []).map(c => `<option>${c.replace(/</g,'&lt;')}</option>`).join('');
    }

    function uniqueCategories(arr) {
      const s = new Set();
      (arr||[]).forEach(p => { if (p && p.category) s.add(String(p.category)); });
      return Array.from(s).sort();
    }

    qs('saveContinue').addEventListener('click', (e)=>{
      e.preventDefault();
      const updated = {
        name: qs('p_name').value,
        category: qs('p_category').value,
        price: qs('p_price').value,
        priority: qs('p_priority').value,
        image: qs('p_image').value,
        desc: qs('p_desc').value,
        length: qs('p_length').value,
        width: qs('p_width').value,
        height: qs('p_height').value,
        boardDepth: qs('p_boardDepth').value,
        frameSize: qs('p_frameSize').value,
        material: qs('p_material').value,
        weight: qs('p_weight').value,
        color: qs('p_color').value
      };
      products[idx] = Object.assign({}, products[idx] || {}, updated);
      saveProducts(products);
      status.textContent = 'Saved. Changes applied.';
    });

    qs('deleteProduct').addEventListener('click', (e)=>{
      if (!confirm('Delete this product permanently?')) return;
      products.splice(idx,1);
      saveProducts(products);
      // redirect back to admin list
      location.href = 'admin.html';
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
