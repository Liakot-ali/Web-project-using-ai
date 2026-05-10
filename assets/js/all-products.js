document.addEventListener('DOMContentLoaded', () => {
  function loadProducts() {
    try { const raw = localStorage.getItem('lds_products'); if (raw) return JSON.parse(raw); } catch(e){}
    return [];
  }

  const grid = document.getElementById('allProductsGrid');
  const products = loadProducts().slice().sort((a,b)=> (Number(b.priority)||0) - (Number(a.priority)||0));
  if (!products.length) {
    grid.innerHTML = '<p>No products found. Use admin editor to add products.</p>';
    return;
  }

  grid.innerHTML = products.map(p => {
    const img = p.image || 'assets/images/placeholder.svg';
    const price = p.price ? `৳ ${p.price}` : '';
    const details = `product.html?${new URLSearchParams({ name:p.name||'', category:p.category||'', price:p.price||'', length:p.length||'', width:p.width||'', height:p.height||'', boardDepth:p.boardDepth||'', frameSize:p.frameSize||'', material:p.material||'', weight:p.weight||'', color:p.color||'', desc:p.desc||'', image:p.image||'' }).toString()}`;
    return `
      <article class="prod-card">
        <img src="${img}" alt="${(p.name||'').replace(/"/g,'')}">
        <div class="prod-meta">
          <div class="top-badge">Priority ${p.priority||0}</div>
          <h4>${(p.name||'').replace(/</g,'&lt;')}</h4>
          <div class="price">${price}</div>
          <p class="prod-desc">${(p.desc||'').replace(/</g,'&lt;')}</p>
          <div style="margin-top:8px"><a class="btn" href="${details}">View</a></div>
        </div>
      </article>`;
  }).join('\n');

});
