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
