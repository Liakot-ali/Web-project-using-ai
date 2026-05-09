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

  // --- Related products data and rendering ---
  // Simple catalog grouped by category. Add more items as needed.
  const catalog = {
    Office: [
      { name: 'Office Workstation Desk', price: '5500', length: '120 cm', width: '60 cm', height: '75 cm', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop', desc: 'Sturdy GI pipe frame with spacious melamine tabletop, cable management hole, and premium finish suitable for offices.' },
      { name: 'Corner Office Desk', price: '6500', length: '150 cm', width: '80 cm', height: '75 cm', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop', desc: 'L-shaped desk to maximize corner space with reinforced frame and integrated shelving for documents.' },
      { name: 'Executive Wooden Desk', price: '9500', length: '160 cm', width: '75 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop', desc: 'Large executive desk with drawer set, premium melamine finish and solid GI support for heavy loads.' },
      { name: 'Adjustable Standing Desk', price: '12000', length: '140 cm', width: '70 cm', height: '72-110 cm', image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop', desc: 'Height-adjustable desk with sturdy frame, ideal for alternating between sitting and standing work.' },
      { name: 'Compact Console Table', price: '2900', length: '90 cm', width: '30 cm', height: '75 cm', image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop', desc: 'Slim console table for receptions or hallways, easy to move and great for small spaces.' },
      { name: 'Manager Desk with Drawers', price: '11500', length: '150 cm', width: '70 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop', desc: 'Manager-grade desk with integrated drawer units and lockable storage, professional finish.' }
    ],
    Study: [
      { name: 'Minimal Study Table', price: '4200', length: '100 cm', width: '50 cm', height: '72 cm', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop', desc: 'Simple clean design study table with enough space for a laptop and books.' },
      { name: 'Student Study Desk', price: '3200', length: '90 cm', width: '45 cm', height: '72 cm', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop', desc: 'Affordable student desk with durable finish and compact footprint.' },
      { name: 'Compact Study Corner', price: '3800', length: '80 cm', width: '40 cm', height: '72 cm', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop', desc: 'Corner-friendly study solution with a small shelf for stationery.' },
      { name: 'Floating Wall Desk', price: '3500', length: '90 cm', width: '40 cm', height: '70 cm', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop', desc: 'Space-saving wall-mounted desk perfect for tight rooms and apartments.' },
      { name: 'Study Desk with Shelves', price: '4800', length: '110 cm', width: '55 cm', height: '72 cm', image: 'https://images.unsplash.com/photo-1524758631624-3f1f1e6a6b6b?q=80&w=800&auto=format&fit=crop', desc: 'Study desk with built-in shelves to keep books and accessories organized.' },
      { name: 'Kids Study Table', price: '2600', length: '80 cm', width: '45 cm', height: '65 cm', image: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac2?q=80&w=800&auto=format&fit=crop', desc: 'Sized-for-kids table with rounded edges and child-friendly finish.' }
    ],
    Gaming: [
      { name: 'Gaming Setup Table', price: '7000', length: '140 cm', width: '70 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop', desc: 'Wide tabletop for multiple monitors, cable pass-through and sturdy frame for peripherals.' },
      { name: 'Pro Gamer Desk', price: '9800', length: '160 cm', width: '80 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1552905858-50f8a1b6b9f5?q=80&w=800&auto=format&fit=crop', desc: 'Premium gaming desk with reinforced supports, headset hook and dedicated mouse surface.' },
      { name: 'Compact Gaming Desk', price: '6000', length: '120 cm', width: '60 cm', height: '75 cm', image: 'https://images.unsplash.com/photo-1603898037225-1b2a3a1b3bb3?q=80&w=800&auto=format&fit=crop', desc: 'Smaller footprint gaming desk with strong frame and cable management.' },
      { name: 'RGB Gaming Desk', price: '8500', length: '150 cm', width: '70 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1621368536039-7b7d4f4f7a29?q=80&w=800&auto=format&fit=crop', desc: 'Stylish desk with optional RGB lighting strip and durable surface.' },
      { name: 'L-Shaped Gaming Desk', price: '13500', length: '200 cm', width: '150 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1585386959984-a4155222e6f6?q=80&w=800&auto=format&fit=crop', desc: 'Expansive L-shaped desk for immersive multi-monitor setups and accessories.' },
      { name: 'Mobile Gaming Stand', price: '4200', length: '100 cm', width: '55 cm', height: '75 cm', image: 'https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=800&auto=format&fit=crop', desc: 'Portable gaming stand for compact spaces, easy to reposition and store.' }
    ]
  };

  const currentCategory = get('category', 'Office');
  const relatedContainer = document.getElementById('relatedList');

  if (relatedContainer && catalog[currentCategory]) {
    // pick up to 5 items from the same category, excluding the current product name
    const related = catalog[currentCategory].filter(p => p.name !== name).slice(0, 5);

    related.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'related-card';

      const img = document.createElement('img');
      img.alt = prod.name;
      img.loading = 'lazy';
      // Use remote images in production unless explicitly disabled by ALLOW_REMOTE_IMAGES
      img.src = (isExternal(prod.image) && !ALLOW_REMOTE_IMAGES) ? placeholder : prod.image;
      img.onerror = () => { img.src = placeholder; };

      const info = document.createElement('div');
      info.className = 'related-info';
      info.innerHTML = `<h4>${prod.name}</h4><div class="price">৳ ${prod.price}</div>`;

      // short matched description
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
      // build relative URL with product params (works with file:// and http://)
      const params = new URLSearchParams();
      params.set('name', prod.name);
      params.set('category', currentCategory);
      params.set('price', prod.price);
      params.set('length', prod.length);
      params.set('width', prod.width);
      params.set('height', prod.height);
      if (prod.image) params.set('image', prod.image);
      if (prod.desc) params.set('desc', prod.desc);
      const urlStr = 'product.html?' + params.toString();
      viewBtn.href = urlStr;

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
  }

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
