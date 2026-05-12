 (function(){
  try { if (localStorage.getItem('lds_products')) return; } catch(e) {}

  const jsonPath = 'assets/data/seed-products.json';

  function saveProducts(products){
    try{ localStorage.setItem('lds_products', JSON.stringify(products)); console.log('Seeded lds_products with', products.length, 'items'); } catch(e){ console.error('Failed to save lds_products', e); }
  }

  // Try to fetch the JSON file first. If that fails (file:// or network), fall back to embedded array.
  fetch(jsonPath).then(res => {
    if (!res.ok) throw new Error('Failed to fetch: ' + res.status);
    return res.json();
  }).then(saveProducts).catch(err => {
    console.warn('Fetching seed JSON failed, using embedded fallback. Error:', err);

    const products = [
      { name: 'Classic Office Desk', category: 'Office', price: '5500', priority: 9, image: 'assets/images/office-pro-120.jpg', length: '120 cm', width: '60 cm', height: '75 cm', boardDepth: '2.5 cm', frameSize: 'GI Pipe 25mm', material: 'Melamine Board + GI Pipe', weight: '15 kg', color: 'Natural Wood Finish', desc: 'Strong GI pipe structure with premium wooden finish.' },
      { name: 'Executive Work Desk', category: 'Office', price: '8500', priority: 8, image: 'assets/images/office-exec-160.jpg', length: '150 cm', width: '70 cm', height: '76 cm', boardDepth: '3 cm', frameSize: 'GI Pipe 32mm', material: 'Thick Melamine + GI Pipe', weight: '22 kg', color: 'Dark Oak', desc: 'Spacious executive desk with cable management and premium finish.' },
      { name: 'Compact Office Table', category: 'Office', price: '4200', priority: 6, image: 'assets/images/office-compact-80.jpg', length: '100 cm', width: '50 cm', height: '75 cm', boardDepth: '2 cm', frameSize: 'GI Pipe 20mm', material: 'Melamine Board + GI Pipe', weight: '12 kg', color: 'Matte White', desc: 'Compact table ideal for small offices and home workspaces.' },
      { name: 'Corner Office Desk', category: 'Office', price: '7200', priority: 5, image: 'assets/images/office-plus-140.jpg', length: '140 cm', width: '80 cm', height: '75 cm', boardDepth: '3 cm', frameSize: 'GI Pipe 32mm', material: 'Melamine + Reinforced Frame', weight: '24 kg', color: 'Walnut', desc: 'Corner desk for efficient space use with sturdy frame.' },
      { name: 'Standing Height Desk', category: 'Office', price: '9800', priority: 4, image: 'assets/images/office-exec-160.jpg', length: '140 cm', width: '70 cm', height: '90 cm (adjustable)', boardDepth: '2.5 cm', frameSize: 'Adjustable GI Frame', material: 'Melamine + Adjustable Frame', weight: '28 kg', color: 'Grey', desc: 'Adjustable standing desk for ergonomic working.' },

      { name: 'Minimal Study Table', category: 'Study', price: '4200', priority: 8, image: 'assets/images/study-mini-90.jpg', length: '100 cm', width: '50 cm', height: '72 cm', boardDepth: '2.5 cm', frameSize: 'GI Pipe 25mm', material: 'Melamine Board', weight: '12 kg', color: 'Matte White', desc: 'Compact and stylish design for study and remote work.' },
      { name: 'Student Desk with Shelf', category: 'Study', price: '3600', priority: 6, image: 'assets/images/study-shelf-110.jpg', length: '90 cm', width: '50 cm', height: '72 cm', boardDepth: '2 cm', frameSize: 'GI Pipe 20mm', material: 'Melamine + Shelf', weight: '10 kg', color: 'Light Oak', desc: 'Affordable student desk with integrated shelf for textbooks.' },
      { name: 'Study Corner Table', category: 'Study', price: '4800', priority: 5, image: 'assets/images/study-corner-120.jpg', length: '120 cm', width: '60 cm', height: '75 cm', boardDepth: '2.5 cm', frameSize: 'GI Pipe 25mm', material: 'Melamine', weight: '14 kg', color: 'Natural Wood', desc: 'Corner table optimized for quiet study sessions.' },
      { name: 'Kids Activity Table', category: 'Study', price: '2800', priority: 4, image: 'assets/images/study-fold-100.jpg', length: '80 cm', width: '45 cm', height: '60 cm', boardDepth: '1.8 cm', frameSize: 'GI Pipe 20mm', material: 'Melamine', weight: '8 kg', color: 'Pastel Blue', desc: 'Child-friendly activity table with rounded edges.' },
      { name: 'Study Desk with Drawer', category: 'Study', price: '5200', priority: 3, image: 'assets/images/study-height-100.jpg', length: '110 cm', width: '55 cm', height: '74 cm', boardDepth: '2.5 cm', frameSize: 'GI Pipe 25mm', material: 'Melamine + Drawer', weight: '16 kg', color: 'Oak', desc: 'Neat study desk with a drawer for small storage.' },

      { name: 'Gaming Setup Table', category: 'Gaming', price: '7000', priority: 9, image: 'assets/images/gaming-pro.jpg', length: '140 cm', width: '70 cm', height: '76 cm', boardDepth: '3 cm', frameSize: 'GI Pipe 32mm', material: 'Melamine Board + Heavy GI Pipe', weight: '20 kg', color: 'Dark Oak', desc: 'Spacious tabletop designed for modern gaming setups.' },
      { name: 'RGB Gaming Desk', category: 'Gaming', price: '9200', priority: 8, image: 'assets/images/gaming-lite-120.jpg', length: '150 cm', width: '70 cm', height: '76 cm', boardDepth: '3 cm', frameSize: 'Reinforced Frame', material: 'Composite Board', weight: '24 kg', color: 'Black', desc: 'Gaming desk with RGB strip-ready channels and headphone hook.' },
      { name: 'L-Desk for Gamers', category: 'Gaming', price: '13500', priority: 7, image: 'assets/images/gaming-corner-150.jpg', length: '200 cm', width: '150 cm', height: '76 cm', boardDepth: '3 cm', frameSize: 'GI Pipe 32mm', material: 'Melamine + Heavy Frame', weight: '28 kg', color: 'Black', desc: 'Large L-shaped desk ideal for multi-monitor gaming setups.' },
      { name: 'Compact Gaming Table', category: 'Gaming', price: '4800', priority: 5, image: 'assets/images/gaming-stand-110.jpg', length: '110 cm', width: '55 cm', height: '74 cm', boardDepth: '2.5 cm', frameSize: 'GI Pipe 25mm', material: 'Melamine', weight: '15 kg', color: 'Carbon', desc: 'Compact gaming table for small rooms with monitor riser.' },
      { name: 'Corner Gaming Desk', category: 'Gaming', price: '8200', priority: 4, image: 'assets/images/gaming-rack-130.jpg', length: '160 cm', width: '110 cm', height: '76 cm', boardDepth: '3 cm', frameSize: 'Reinforced Frame', material: 'Melamine', weight: '26 kg', color: 'Matte Black', desc: 'Corner gaming desk with cable channels and cup holder.' },

      { name: 'L-Shaped Office Desk', category: 'L-Shaped', price: '13500', priority: 9, image: 'assets/images/lshaped-duo-160.jpg', length: '200 cm', width: '150 cm', height: '76 cm', boardDepth: '3 cm', frameSize: 'GI Pipe 32mm', material: 'Melamine Board + Heavy GI Pipe', weight: '30 kg', color: 'Black', desc: 'Spacious L-shaped desk for multi-tasking workstations.' },
      { name: 'Budget L-Desk', category: 'L-Shaped', price: '9800', priority: 7, image: 'assets/images/lshaped-compact-140.jpg', length: '180 cm', width: '130 cm', height: '75 cm', boardDepth: '2.8 cm', frameSize: 'GI Pipe 32mm', material: 'Melamine', weight: '26 kg', color: 'Walnut', desc: 'Affordable L-shaped desk with strong frame.' },
      { name: 'Executive L-Workstation', category: 'L-Shaped', price: '15800', priority: 6, image: 'assets/images/lshaped-corner-170.jpg', length: '210 cm', width: '160 cm', height: '76 cm', boardDepth: '3.2 cm', frameSize: 'Reinforced GI', material: 'Thick Melamine', weight: '34 kg', color: 'Dark Oak', desc: 'Executive grade L-shaped workstation with cable tray.' },
      { name: 'Compact L-Corner', category: 'L-Shaped', price: '11200', priority: 4, image: 'assets/images/lshaped-office-150.jpg', length: '160 cm', width: '120 cm', height: '75 cm', boardDepth: '2.8 cm', frameSize: 'GI Pipe 32mm', material: 'Melamine', weight: '28 kg', color: 'Natural Wood', desc: 'Space-saving L-shaped desk for corner setups.' },

      { name: 'Floating Wall Desk', category: 'Compact', price: '3500', priority: 6, image: 'assets/images/compact-fold-80.jpg', length: '90 cm', width: '40 cm', height: '70 cm', boardDepth: '2 cm', frameSize: 'Wall Bracket', material: 'Melamine Board', weight: '8 kg', color: 'Light Oak', desc: 'Space-saving wall-mounted desk for small rooms and apartments.' },
      { name: 'Foldable Compact Table', category: 'Compact', price: '2900', priority: 5, image: 'assets/images/compact-wall-100.jpg', length: '100 cm', width: '50 cm', height: '74 cm', boardDepth: '1.8 cm', frameSize: 'Foldable Frame', material: 'Plywood + Hinges', weight: '9 kg', color: 'White', desc: 'Foldable table for quick storage and small flats.' },
      { name: 'Slim Console Table', category: 'Compact', price: '3100', priority: 4, image: 'assets/images/compact-draw-90.jpg', length: '100 cm', width: '35 cm', height: '75 cm', boardDepth: '1.5 cm', frameSize: 'Slim Frame', material: 'MDF', weight: '7 kg', color: 'Black', desc: 'Slim console table for hallways and small spaces.' },
      { name: 'Portable Laptop Table', category: 'Compact', price: '2400', priority: 3, image: 'assets/images/compact-corner-110.jpg', length: '60 cm', width: '40 cm', height: '60 cm', boardDepth: '1.2 cm', frameSize: 'Light Frame', material: 'Plastic + Metal', weight: '4 kg', color: 'Grey', desc: 'Lightweight portable table for laptops and tablets.' }
    ];

    saveProducts(products);
  });
})();
