import { laptopProducts } from './laptopCatalog.js';

const legacyProducts = [
  {
    name: 'Nimbus Air Pro',
    slug: 'nimbus-air-pro',
    description:
      'Premium true wireless earbuds with adaptive noise cancellation, spatial audio, and 36-hour battery life with the charging case. Crafted for audiophiles who refuse to compromise.',
    price: 249,
    category: 'earbuds',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80',
    ],
    variants: [
      { color: 'Midnight Black', storage: 'Standard', priceModifier: 0 },
      { color: 'Cloud White', storage: 'Standard', priceModifier: 0 },
      { color: 'Arctic Silver', storage: 'Standard', priceModifier: 20 },
    ],
    specs: {
      'Driver Size': '11mm dynamic',
      'Battery Life': '9 hrs (36 hrs with case)',
      'Noise Cancellation': 'Adaptive ANC',
      Connectivity: 'Bluetooth 5.3',
      'Water Resistance': 'IPX5',
      Weight: '5.2g per earbud',
    },
    stock: 150,
    rating: 4.8,
    reviewCount: 342,
    featured: true,
    reviews: [
      { userName: 'Alex Chen', comment: 'Best earbuds I have ever owned. The ANC is incredible.', stars: 5 },
      { userName: 'Sarah Miller', comment: 'Comfortable for hours. Spatial audio is a game changer.', stars: 5 },
    ],
  },
  {
    name: 'Nimbus Sound Max',
    slug: 'nimbus-sound-max',
    description:
      'Studio-grade over-ear headphones with 40mm titanium drivers, memory foam cushions, and industry-leading 60-hour battery. Your personal concert hall.',
    price: 399,
    category: 'headphones',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    ],
    variants: [
      { color: 'Obsidian', storage: 'Standard', priceModifier: 0 },
      { color: 'Sandstone', storage: 'Standard', priceModifier: 0 },
    ],
    specs: {
      'Driver Size': '40mm titanium',
      'Battery Life': '60 hours',
      'Noise Cancellation': 'Hybrid ANC',
      Connectivity: 'Bluetooth 5.3 + 3.5mm',
      'Frequency Response': '4Hz - 40kHz',
      Weight: '250g',
    },
    stock: 80,
    rating: 4.9,
    reviewCount: 218,
    featured: true,
    reviews: [
      { userName: 'Marcus Johnson', comment: 'Reference-quality sound. Worth every penny.', stars: 5 },
    ],
  },
  {
    name: 'Nimbus Watch Ultra',
    slug: 'nimbus-watch-ultra',
    description:
      'The ultimate smartwatch for the modern professional. AMOLED display, health tracking, GPS, and seamless Nimbus audio integration. Titanium build, sapphire crystal.',
    price: 549,
    category: 'smart-watches',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    ],
    variants: [
      { color: 'Titanium', storage: '32GB', priceModifier: 0 },
      { color: 'Graphite', storage: '32GB', priceModifier: 0 },
      { color: 'Gold', storage: '64GB', priceModifier: 100 },
    ],
    specs: {
      Display: '1.9" AMOLED Always-On',
      'Battery Life': '72 hours',
      Sensors: 'HR, SpO2, ECG, GPS',
      'Water Resistance': '100m',
      Material: 'Titanium + Sapphire',
      Connectivity: 'Bluetooth 5.3, WiFi, LTE',
    },
    stock: 60,
    rating: 4.7,
    reviewCount: 156,
    featured: true,
    reviews: [
      { userName: 'Emily Park', comment: 'Beautiful design and the health features are spot on.', stars: 5 },
    ],
  },
  {
    name: 'Nimbus Station X',
    slug: 'nimbus-station-x',
    description:
      'A compact desktop workstation with serious graphics power. Ideal for editing, development, and immersive gaming at your desk.',
    price: 1899,
    category: 'desktops',
    images: [
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80',
    ],
    variants: [
      { color: 'Graphite', storage: '1TB', priceModifier: 0 },
      { color: 'Graphite', storage: '2TB', priceModifier: 300 },
    ],
    specs: {
      Processor: 'Nimbus M3 Max',
      RAM: '32GB unified memory',
      Storage: '1TB SSD',
      Graphics: 'Nimbus GPU 20-core',
      Ports: 'Thunderbolt 4, HDMI 2.1, 10Gb Ethernet',
      Form: 'Compact tower',
    },
    stock: 25,
    rating: 4.9,
    reviewCount: 41,
    featured: true,
    reviews: [
      { userName: 'Devon Mills', comment: 'Silent, fast, and takes up almost no desk space. Perfect workstation.', stars: 5 },
    ],
  },
  {
    name: 'Nimbus Pod Mini',
    slug: 'nimbus-pod-mini',
    description:
      'Compact wireless earbuds that punch above their weight. Perfect for workouts and daily commutes with secure fit, IPX7 rating, and punchy bass.',
    price: 129,
    category: 'earbuds',
    images: [
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    ],
    variants: [
      { color: 'Jet Black', storage: 'Standard', priceModifier: 0 },
      { color: 'Coral Pink', storage: 'Standard', priceModifier: 0 },
      { color: 'Ocean Blue', storage: 'Standard', priceModifier: 0 },
    ],
    specs: {
      'Driver Size': '8mm dynamic',
      'Battery Life': '6 hrs (24 hrs with case)',
      'Noise Cancellation': 'Passive',
      Connectivity: 'Bluetooth 5.2',
      'Water Resistance': 'IPX7',
      Weight: '4.1g per earbud',
    },
    stock: 200,
    rating: 4.5,
    reviewCount: 489,
    featured: false,
    reviews: [
      { userName: 'Jake Rivera', comment: 'Great value. Stay in place during runs.', stars: 4 },
    ],
  },
  {
    name: 'Nimbus SoundBar Elite',
    slug: 'nimbus-soundbar-elite',
    description:
      'Premium home audio soundbar with Dolby Atmos, wireless subwoofer, and room-adaptive EQ. Transform your living room into a cinematic experience.',
    price: 699,
    category: 'gadgets',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
      'https://images.unsplash.com/photo-1558083864-06fbf6462a8e?w=800&q=80',
    ],
    variants: [
      { color: 'Matte Black', storage: 'Standard', priceModifier: 0 },
    ],
    specs: {
      Channels: '5.1.2 Dolby Atmos',
      Output: '400W total',
      Subwoofer: 'Wireless 8" included',
      Connectivity: 'HDMI eARC, Bluetooth, WiFi',
      'Room Calibration': 'Auto EQ',
      Dimensions: '110cm x 8cm x 12cm',
    },
    stock: 45,
    rating: 4.6,
    reviewCount: 97,
    featured: true,
    reviews: [
      { userName: 'David Kim', comment: 'Movie nights will never be the same. Atmos is stunning.', stars: 5 },
    ],
  },
  {
    name: 'Nimbus Travel Shell',
    slug: 'nimbus-travel-shell',
    description:
      'A modular carry system for your everyday essentials — earbuds, cables, adapters, and small accessories. Water-resistant exterior with magnetic organizer trays.',
    price: 79,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    variants: [
      { color: 'Ink Black', storage: 'Standard', priceModifier: 0 },
      { color: 'Sandstone', storage: 'Standard', priceModifier: 0 },
    ],
    specs: {
      Material: 'Recycled nylon + TPU',
      Capacity: '2L modular layout',
      'Water Resistance': 'IPX4',
      Features: 'Magnetic trays, cable pass-through',
      Compatibility: 'Fits all Nimbus earbuds & accessories',
      Weight: '320g',
    },
    stock: 120,
    rating: 4.6,
    reviewCount: 84,
    featured: false,
    reviews: [
      { userName: 'Priya Shah', comment: 'Keeps my commute kit organized and looks premium on the desk too.', stars: 5 },
    ],
  },
  {
    name: 'Nimbus Charge Hub',
    slug: 'nimbus-charge-hub',
    description:
      'A minimalist desktop charging hub for phone, watch, and earbuds — with fast USB-C passthrough and a soft-touch surface that fits any workspace or bedside setup.',
    price: 149,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1587825140708-287187346344?w=800&q=80',
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80',
    ],
    variants: [
      { color: 'Cloud White', storage: 'Standard', priceModifier: 0 },
      { color: 'Graphite', storage: 'Standard', priceModifier: 0 },
    ],
    specs: {
      Outputs: 'Qi pad + 2x USB-C (65W total)',
      Material: 'Aluminum + soft-touch polymer',
      Compatibility: 'Phone, watch, Nimbus earbuds case',
      Features: 'Cable management channel',
      Dimensions: '18cm x 12cm x 2.8cm',
      Weight: '410g',
    },
    stock: 95,
    rating: 4.7,
    reviewCount: 112,
    featured: false,
    reviews: [
      { userName: 'Tom Walsh', comment: 'One dock for everything. Clean desk, fast charging.', stars: 5 },
    ],
  },
  {
    name: 'Nimbus Desk Mat',
    slug: 'nimbus-desk-mat',
    description:
      'An extended desk mat with integrated wireless charging zone and micro-texture surface — built for work, study, and everyday desktop utility.',
    price: 99,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    ],
    variants: [
      { color: 'Mist Gray', storage: 'Standard', priceModifier: 0 },
      { color: 'Ink Black', storage: 'Standard', priceModifier: 0 },
    ],
    specs: {
      Size: '80cm x 40cm',
      Surface: 'Micro-texture, spill-resistant',
      Charging: 'Built-in Qi zone (15W)',
      Material: 'Vegan leather + cork base',
      Thickness: '3mm',
      Weight: '680g',
    },
    stock: 140,
    rating: 4.5,
    reviewCount: 67,
    featured: false,
    reviews: [
      { userName: 'Nina Ortiz', comment: 'Looks great and the charging zone is genuinely useful every day.', stars: 4 },
    ],
  },
];

export const products = [
  ...laptopProducts,
  ...legacyProducts.filter((product) => product.slug !== 'nimbus-book-pro-14'),
];
