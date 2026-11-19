/* =========================================
   BULLBURRY – products.js
   Products data array (12 products with INR pricing)
   ========================================= */

window.PRODUCTS = [
  {
    id: 'bb-001',
    name: 'Obsidian Utility Jacket',
    category: 'outerwear',
    price: 8499,
    tag: 'New',
    colors: [
      { name: 'Obsidian', hex: '#0B0B0C' },
      { name: 'Ash', hex: '#8A8A8F' },
      { name: 'Bull Berry', hex: '#8B1A2F' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-001-a.jpg',
      'assets/images/bb-001-b.jpg',
      'assets/images/bb-001-c.jpg'
    ],
    description: 'A heavyweight utility jacket crafted from deadstock waxed cotton. Four cargo pockets, storm-sealed zipper, and a dropped shoulder cut built for the city and beyond.',
    details: 'Shell: 100% Deadstock Waxed Cotton. Lining: Recycled Polyester Taffeta. YKK zippers throughout. Fit: Oversized.',
    care: 'Spot clean only. Do not machine wash. Re-wax annually.',
    featured: true
  },
  {
    id: 'bb-002',
    name: 'Horn Graphic Oversized Tee',
    category: 'tops',
    price: 2499,
    tag: 'Bestseller',
    colors: [
      { name: 'Bone', hex: '#F0EDE5' },
      { name: 'Obsidian', hex: '#0B0B0C' },
      { name: 'Bull Berry', hex: '#8B1A2F' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-002-a.jpg',
      'assets/images/bb-002-b.jpg'
    ],
    description: 'The original Bullburry horn mark, screenprinted on heavyweight 280gsm cotton jersey. Relaxed fit, ribbed collar, and dropped shoulders.',
    details: '100% Ring-spun Cotton, 280gsm. Pre-shrunk. Fit: Relaxed/Oversized.',
    care: 'Machine wash cold, inside out. Tumble dry low.',
    featured: true
  },
  {
    id: 'bb-003',
    name: 'Charcoal Cargo Trousers',
    category: 'bottoms',
    price: 4999,
    tag: null,
    colors: [
      { name: 'Charcoal', hex: '#1C1C1F' },
      { name: 'Khaki', hex: '#7A6D5A' }
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    unavailableSizes: ['28'],
    images: [
      'assets/images/bb-003-a.jpg',
      'assets/images/bb-003-b.jpg'
    ],
    description: 'Technical cargo trousers with six pockets, articulated knees, and a tapered silhouette. Crafted from a durable twill cotton blend.',
    details: '98% Cotton, 2% Elastane Twill. YKK zippers. Fit: Slim Tapered.',
    care: 'Machine wash cold. Do not bleach. Iron on low.',
    featured: true
  },
  {
    id: 'bb-004',
    name: 'Embossed Logo Heavyweight Hoodie',
    category: 'tops',
    price: 5299,
    tag: 'New',
    colors: [
      { name: 'Obsidian', hex: '#0B0B0C' },
      { name: 'Ash', hex: '#8A8A8F' },
      { name: 'Bone', hex: '#F0EDE5' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-004-a.jpg',
      'assets/images/bb-004-b.jpg'
    ],
    description: 'Triple-stitched French terry hoodie with an embossed rubber Bullburry wordmark across the chest. Kangaroo pocket, ribbed cuffs.',
    details: '80% Cotton, 20% Recycled Polyester French Terry, 420gsm. Fit: Oversized.',
    care: 'Machine wash cold, inside out. Do not tumble dry.',
    featured: true
  },
  {
    id: 'bb-005',
    name: 'Tactical Urban Vest',
    category: 'outerwear',
    price: 5999,
    tag: 'Limited',
    colors: [
      { name: 'Obsidian', hex: '#0B0B0C' },
      { name: 'Olive', hex: '#4A4E3B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    unavailableSizes: ['XS'],
    images: [
      'assets/images/bb-005-a.jpg',
      'assets/images/bb-005-b.jpg'
    ],
    description: 'A modular tactical vest with MOLLE webbing and six zippered compartments. Wear it over hoodies or under jackets.',
    details: '100% Nylon Ripstop. Polyfill insulation. YKK zippers. Fit: Regular.',
    care: 'Machine wash cold. Tumble dry low.',
    featured: false
  },
  {
    id: 'bb-006',
    name: 'Selvedge Wide Leg Denim',
    category: 'bottoms',
    price: 6499,
    tag: null,
    colors: [
      { name: 'Raw Indigo', hex: '#2B3B5B' },
      { name: 'Washed Black', hex: '#2A2A2A' }
    ],
    sizes: ['28', '30', '32', '34', '36'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-006-a.jpg',
      'assets/images/bb-006-b.jpg'
    ],
    description: 'Japanese selvedge denim in an ultra-wide silhouette. High-rise waist, clean front crease, and an extended hem.',
    details: '100% Japanese Selvedge Denim, 14oz. Copper rivets. Chain stitch hem. Fit: Wide Leg.',
    care: 'Wash sparingly. Cold water only, inside out. Air dry.',
    featured: true
  },
  {
    id: 'bb-007',
    name: 'Leather Bull Cap',
    category: 'accessories',
    price: 2799,
    tag: 'New',
    colors: [
      { name: 'Obsidian', hex: '#0B0B0C' },
      { name: 'Tan', hex: '#B08050' }
    ],
    sizes: ['One Size'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-007-a.jpg',
      'assets/images/bb-007-b.jpg'
    ],
    description: 'Vegetable-tanned leather cap with a structured 6-panel crown and embossed horn mark. Adjustable buckle strap.',
    details: 'Full-grain Vegetable-tanned Leather. Adjustable back strap.',
    care: 'Spot clean with damp cloth. Condition leather annually.',
    featured: false
  },
  {
    id: 'bb-008',
    name: 'Oversized Tailored Trench',
    category: 'outerwear',
    price: 11999,
    tag: 'Drop 02',
    colors: [
      { name: 'Camel', hex: '#C4954A' },
      { name: 'Obsidian', hex: '#0B0B0C' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    unavailableSizes: ['XS', 'S'],
    images: [
      'assets/images/bb-008-a.jpg',
      'assets/images/bb-008-b.jpg'
    ],
    description: 'An elongated trench coat reaching the mid-calf. Raglan sleeves, epaulettes, and a removable belt.',
    details: '65% Polyester, 35% Cotton Gabardine. Lining: 100% Recycled Polyester. Fit: Oversized.',
    care: 'Dry clean only.',
    featured: false
  },
  {
    id: 'bb-009',
    name: 'Ribbed Merino Knit Crewneck',
    category: 'tops',
    price: 4499,
    tag: null,
    colors: [
      { name: 'Bone', hex: '#F0EDE5' },
      { name: 'Bull Berry', hex: '#8B1A2F' },
      { name: 'Ash', hex: '#8A8A8F' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-009-a.jpg',
      'assets/images/bb-009-b.jpg'
    ],
    description: 'A dense ribbed-knit crewneck in merino-blend yarn. Minimal Bullburry embroidery at the chest. Seasonless weight.',
    details: '70% Merino Wool, 30% Recycled Nylon. Gauge: 12. Fit: Regular.',
    care: 'Hand wash cold. Lay flat to dry.',
    featured: false
  },
  {
    id: 'bb-010',
    name: 'Crossbody Leather Pouch',
    category: 'accessories',
    price: 3299,
    tag: 'Bestseller',
    colors: [
      { name: 'Obsidian', hex: '#0B0B0C' },
      { name: 'Tan', hex: '#B08050' }
    ],
    sizes: ['One Size'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-010-a.jpg',
      'assets/images/bb-010-b.jpg'
    ],
    description: 'Compact crossbody bag in full-grain leather. Main zip compartment, internal card slots, adjustable webbing strap.',
    details: 'Full-grain Cowhide Leather. YKK zipper. Adjustable 100% Nylon webbing strap.',
    care: 'Spot clean. Apply leather conditioner as needed.',
    featured: false
  },
  {
    id: 'bb-011',
    name: 'Patchwork Coach Jacket',
    category: 'outerwear',
    price: 7999,
    tag: 'Limited',
    colors: [
      { name: 'Mixed', hex: '#5A3A2A' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-011-a.jpg',
      'assets/images/bb-011-b.jpg'
    ],
    description: 'A patchwork coach jacket constructed from deadstock fabrics in coordinated earth tones. Each piece is unique.',
    details: 'Mixed deadstock fabrics. Snap buttons. Fit: Relaxed. Limited run of 100 pieces.',
    care: 'Spot clean recommended. Dry clean if needed.',
    featured: false
  },
  {
    id: 'bb-012',
    name: 'Bullburry Heavy Tote Bag',
    category: 'accessories',
    price: 1899,
    tag: null,
    colors: [
      { name: 'Obsidian', hex: '#0B0B0C' },
      { name: 'Bone', hex: '#F0EDE5' }
    ],
    sizes: ['One Size'],
    unavailableSizes: [],
    images: [
      'assets/images/bb-012-a.jpg',
      'assets/images/bb-012-b.jpg'
    ],
    description: 'Heavy 16oz cotton canvas tote with reinforced box-stitched straps, internal zippered key pocket, and screenprinted horn logo.',
    details: '100% Heavyweight Cotton Canvas 16oz. Reinforced straps.',
    care: 'Spot clean with cool water.',
    featured: false
  }
];
