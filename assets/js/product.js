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

  if (image) document.getElementById('prodImage').src = image;

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
      { name: 'Office Workstation Desk', price: '5500', length: '120 cm', width: '60 cm', height: '75 cm', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop' },
      { name: 'Corner Office Desk', price: '6500', length: '150 cm', width: '80 cm', height: '75 cm', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop' },
      { name: 'Executive Wooden Desk', price: '9500', length: '160 cm', width: '75 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop' },
      { name: 'Adjustable Standing Desk', price: '12000', length: '140 cm', width: '70 cm', height: '72-110 cm', image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop' }
    ],
    Study: [
      { name: 'Minimal Study Table', price: '4200', length: '100 cm', width: '50 cm', height: '72 cm', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop' },
      { name: 'Student Study Desk', price: '3200', length: '90 cm', width: '45 cm', height: '72 cm', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop' },
      { name: 'Compact Study Corner', price: '3800', length: '80 cm', width: '40 cm', height: '72 cm', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop' }
    ],
    Gaming: [
      { name: 'Gaming Setup Table', price: '7000', length: '140 cm', width: '70 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop' },
      { name: 'Pro Gamer Desk', price: '9800', length: '160 cm', width: '80 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1552905858-50f8a1b6b9f5?q=80&w=800&auto=format&fit=crop' },
      { name: 'Compact Gaming Desk', price: '6000', length: '120 cm', width: '60 cm', height: '75 cm', image: 'https://images.unsplash.com/photo-1603898037225-1b2a3a1b3bb3?q=80&w=800&auto=format&fit=crop' },
      { name: 'RGB Gaming Desk', price: '8500', length: '150 cm', width: '70 cm', height: '76 cm', image: 'https://images.unsplash.com/photo-1621368536039-7b7d4f4f7a29?q=80&w=800&auto=format&fit=crop' }
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
      img.src = prod.image;
      img.alt = prod.name;

      const info = document.createElement('div');
      info.className = 'related-info';
      info.innerHTML = `<h4>${prod.name}</h4><div class="price">৳ ${prod.price}</div>`;

      const actions = document.createElement('div');
      actions.className = 'related-actions';

      const viewBtn = document.createElement('a');
      viewBtn.className = 'btn';
      viewBtn.textContent = 'View';
      // build URL with product params
      const url = new URL(window.location.origin + window.location.pathname.replace(/[^\/]*$/, 'product.html'));
      url.searchParams.set('name', prod.name);
      url.searchParams.set('category', currentCategory);
      url.searchParams.set('price', prod.price);
      url.searchParams.set('length', prod.length);
      url.searchParams.set('width', prod.width);
      url.searchParams.set('height', prod.height);
      url.searchParams.set('image', prod.image);
      url.searchParams.set('desc', prod.name + ' - high quality and durable.');
      viewBtn.href = url.toString();

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
