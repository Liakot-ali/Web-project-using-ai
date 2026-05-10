document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  const get = (key, fallback = '') => params.get(key) || fallback;

  const name = get('name', 'Product');
  const price = get('price', '0');
  const length = get('length', '—');
  const width = get('width', '—');
  const height = get('height', '—');
  const boardDepth = get('boardDepth', '—');
  const frameSize = get('frameSize', '—');
  const material = get('material', '—');
  const weight = get('weight', '—');
  const color = get('color', '—');
  const shortDesc = get('desc', '');
  const longDesc = get('longDesc', shortDesc);
  const sku = get('sku', name.replace(/\s+/g, '-').toUpperCase());
  const warranty = get('warranty', '1 year');
  const assembly = get('assembly', 'Required');
  const finish = get('finish', 'Matte');
  const capacity = get('capacity', '50 kg');
  const image = get('image', '');

  document.getElementById('prodName').textContent = name;
  document.getElementById('prodPrice').textContent = '৳ ' + price;
  document.getElementById('prodShortDesc').textContent = shortDesc;
  document.getElementById('prodLongDesc').textContent = longDesc;

  const placeholder = 'assets/images/placeholder.svg';

  // Helper: avoid loading external (remote) images during local/headless checks.
  const isExternal = (url) => /^https?:\/\//i.test(url);
  // Toggle: allow remote images in production. Set to false for offline/headless runs.
  const ALLOW_REMOTE_IMAGES = true;

  const prodImageEl = document.getElementById('prodImage');
  if (prodImageEl) {
    if (image) {
      if (isExternal(image) && !ALLOW_REMOTE_IMAGES) {
        prodImageEl.src = placeholder;
      } else {
        // preload image (remote or local) and fallback to placeholder
        const preload = new Image();
        preload.onload = () => { prodImageEl.src = image; };
        preload.onerror = () => { prodImageEl.src = placeholder; };
        preload.src = image;
      }
    } else {
      prodImageEl.src = placeholder;
    }
  }

  const specs = [
    ['SKU', sku],
    ['Length', length],
    ['Width', width],
    ['Height', height],
    ['Board Depth', boardDepth],
    ['Frame Size', frameSize],
    ['Material', material],
    ['Weight', weight],
    ['Color / Finish', color],
    ['Surface Finish', finish],
    ['Load Capacity', capacity],
    ['Warranty', warranty],
    ['Assembly', assembly]
  ];

  const specsList = document.getElementById('prodSpecs');
  specs.forEach(([k, v]) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${k}:</strong> ${v}`;
    specsList.appendChild(li);
  });

  // fallback empty catalog (used if no stored products exist)
  const catalog = {};

  // --- Related products: use stored products when available ---
  const relatedContainer = document.getElementById('relatedList');
  (function renderRelated() {
    try {
      const raw = localStorage.getItem('lds_products');
      let all = [];
      if (raw) all = JSON.parse(raw);
      // fallback: build from built-in catalog (previous hardcoded data)
      if (!all || !all.length) {
        // build a flattened list from earlier static catalog for fallback
        Object.keys(catalog || {}).forEach(cat => {
          (catalog[cat]||[]).forEach(it => all.push(Object.assign({}, it, { category: cat })));
        });
      }

      if (!relatedContainer || !all.length) return;

      // filter by same category, exclude current product, sort by priority then slice
      const currentCat = get('category', 'Office');
      const related = all.filter(p => (p.category||currentCat) === currentCat && (p.name || '') !== name)
                         .sort((a,b)=> (Number(b.priority)||0) - (Number(a.priority)||0))
                         .slice(0,5);

      related.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'related-card';

        const img = document.createElement('img');
        img.alt = prod.name || '';
        img.loading = 'lazy';
        img.src = (isExternal(prod.image) && !ALLOW_REMOTE_IMAGES) ? placeholder : (prod.image || placeholder);
        img.onerror = () => { img.src = placeholder; };

        const info = document.createElement('div');
        info.className = 'related-info';
        info.innerHTML = `<h4>${prod.name || ''}</h4><div class="price">${prod.price ? '৳ ' + prod.price : ''}</div>`;

        if (prod.desc) {
          const pd = document.createElement('p');
          pd.className = 'related-desc';
          pd.textContent = prod.desc;
          info.appendChild(pd);
        }

        const actions = document.createElement('div');
        actions.className = 'related-actions';

        const viewBtn = document.createElement('a');
        viewBtn.className = 'btn';
        viewBtn.textContent = 'View';
        const params = new URLSearchParams();
        params.set('name', prod.name || 'Product');
        params.set('category', prod.category || currentCat);
        if (prod.price) params.set('price', prod.price);
        if (prod.length) params.set('length', prod.length);
        if (prod.width) params.set('width', prod.width);
        if (prod.height) params.set('height', prod.height);
        if (prod.boardDepth) params.set('boardDepth', prod.boardDepth);
        if (prod.frameSize) params.set('frameSize', prod.frameSize);
        if (prod.material) params.set('material', prod.material);
        if (prod.weight) params.set('weight', prod.weight);
        if (prod.color) params.set('color', prod.color);
        if (prod.image) params.set('image', prod.image);
        if (prod.desc) params.set('desc', prod.desc);
        viewBtn.href = 'product.html?' + params.toString();

        const orderBtn = document.createElement('button');
        orderBtn.className = 'btn';
        orderBtn.textContent = 'Order';
        orderBtn.addEventListener('click', () => {
          const phone = '8801XXXXXXXXX';
          const waText = `Hello, I would like to order the ${prod.name} (Price: ৳ ${prod.price}).`;
          window.location.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(waText);
        });

        actions.appendChild(viewBtn);
        actions.appendChild(orderBtn);

        card.appendChild(img);
        card.appendChild(info);
        card.appendChild(actions);

        relatedContainer.appendChild(card);
      });
    } catch (e) {
      // ignore
    }
  })();

  const orderNowBtn = document.getElementById('orderNowBtn');
  const whatsappLink = document.getElementById('whatsappLink');

  const phone = '8801XXXXXXXXX';
  const waText = `Hello, I would like to order the ${name} (Price: ৳ ${price}). Please provide ordering details.`;
  const waHref = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(waText);

  whatsappLink.href = waHref;

  orderNowBtn.addEventListener('click', () => {
    window.location.href = waHref;
  });

});
