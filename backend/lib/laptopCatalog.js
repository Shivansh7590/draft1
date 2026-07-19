import { getProductImages } from './productAssets.js';

const chipOption = (value, label, description, priceModifier, extraSpecs = {}) => ({
  value,
  label,
  description,
  priceModifier,
  specs: extraSpecs,
});

const memOption = (value, label, priceModifier) => ({ value, label, priceModifier });
const storageOption = (value, label, priceModifier) => ({ value, label, priceModifier });
const colorOption = (value, label, priceModifier = 0) => ({ value, label, priceModifier });

export const laptopProducts = [
  {
    name: 'Powerbook Lite 1',
    slug: 'powerbook-lite-1',
    description:
      'Remarkably thin and light. The Powerbook Lite 1 combines a brilliant Lumina display with the efficiency of the Nimbus chip — fanless, silent, and built to go all day.',
    price: 999,
    category: 'laptops',
    images: getProductImages('computers/laptops/powerbook lite 1'),
    featured: true,
    stock: 120,
    rating: 4.8,
    reviewCount: 214,
    reviews: [
      { userName: 'Avery Kim', comment: 'Light, fast, and the display is gorgeous for travel work.', stars: 5 },
    ],
    specs: {
      Display: '13.6" Lumina Display',
      Resolution: '2560 × 1664',
      'Battery Life': 'Up to 18 hours video playback',
      Weight: '1.24 kg (2.7 lb)',
      Thickness: '11.3 mm',
      Ports: '2 × Thunderbolt / USB 4, SnapCharge, 3.5 mm audio',
      Camera: '1080p HD camera with studio mic array',
      Wireless: 'Wi-Fi 6E, Bluetooth 5.3',
      Cooling: 'Fanless design',
    },
    configurator: {
      groups: [
        {
          id: 'chip',
          label: 'Processor',
          subtitle: 'Choose your Nimbus chip.',
          options: [
            chipOption('m1', 'Nimbus M1', '8-core CPU · 7-core GPU · 16-core Neural Engine', 0, {
              Processor: 'Nimbus M1 — 8-core CPU, 7-core GPU',
              'Neural Engine': '16-core',
            }),
            chipOption('m2', 'Nimbus M2', '8-core CPU · 8-core GPU · 16-core Neural Engine', 100, {
              Processor: 'Nimbus M2 — 8-core CPU, 8-core GPU',
              'Neural Engine': '16-core',
            }),
            chipOption('m3', 'Nimbus M3', '8-core CPU · 10-core GPU · 16-core Neural Engine', 200, {
              Processor: 'Nimbus M3 — 8-core CPU, 10-core GPU',
              'Neural Engine': '16-core',
            }),
            chipOption('m4', 'Nimbus M4', '10-core CPU · 10-core GPU · 16-core Neural Engine', 300, {
              Processor: 'Nimbus M4 — 10-core CPU, 10-core GPU',
              'Neural Engine': '16-core',
            }),
            chipOption('m5', 'Nimbus M5', '10-core CPU · 12-core GPU · 18-core Neural Engine', 400, {
              Processor: 'Nimbus M5 — 10-core CPU, 12-core GPU',
              'Neural Engine': '18-core',
            }),
          ],
        },
        {
          id: 'memory',
          label: 'Memory',
          subtitle: 'Unified memory — configure once. Choose wisely.',
          options: [
            memOption('8gb', '8GB unified memory', 0),
            memOption('16gb', '16GB unified memory', 200),
            memOption('24gb', '24GB unified memory', 400),
          ],
        },
        {
          id: 'storage',
          label: 'Storage',
          subtitle: 'How much space do you need?',
          options: [
            storageOption('256gb', '256GB SSD storage', 0),
            storageOption('512gb', '512GB SSD storage', 200),
            storageOption('1tb', '1TB SSD storage', 400),
            storageOption('2tb', '2TB SSD storage', 800),
          ],
        },
        {
          id: 'color',
          label: 'Finish',
          subtitle: 'Choose your finish.',
          options: [
            colorOption('midnight', 'Midnight'),
            colorOption('starlight', 'Starlight'),
            colorOption('space-gray', 'Space Gray'),
            colorOption('silver', 'Silver'),
          ],
        },
      ],
    },
  },
  {
    name: 'Powerbook',
    slug: 'powerbook',
    description:
      'The ultimate pro notebook. Choose 14- or 16-inch Liquid XDR, Nimbus Pro or Max silicon, and the memory and storage your workflow demands.',
    price: 1999,
    category: 'laptops',
    images: getProductImages('computers/laptops/powerbook'),
    featured: true,
    stock: 85,
    rating: 4.9,
    reviewCount: 328,
    reviews: [
      { userName: 'Jordan Lee', comment: 'Handles 4K timelines without breaking a sweat. Best pro laptop I have used.', stars: 5 },
    ],
    specs: {
      Display: '14.2" or 16.2" Liquid XDR',
      Resolution: '3024 × 1964 (14") / 3456 × 2234 (16")',
      'Peak Brightness': '1600 nits HDR / 1000 nits sustained',
      'Battery Life': 'Up to 22 hours',
      Ports: '3 × Thunderbolt 4, HDMI, SDXC, SnapCharge, 3.5 mm audio',
      Camera: '1080p HD camera with studio three-mic array',
      Wireless: 'Wi-Fi 6E, Bluetooth 5.3',
    },
    configurator: {
      groups: [
        {
          id: 'size',
          label: 'Model',
          subtitle: 'Choose your screen size.',
          options: [
            { value: '14', label: '14-inch Powerbook', description: 'More portable pro performance', priceModifier: 0, specs: { Size: '14.2-inch', Weight: '1.55 kg (3.4 lb)' } },
            { value: '16', label: '16-inch Powerbook', description: 'Largest display and longest battery', priceModifier: 500, specs: { Size: '16.2-inch', Weight: '2.14 kg (4.7 lb)' } },
          ],
        },
        {
          id: 'chip',
          label: 'Processor',
          subtitle: 'Nimbus Pro or Max — how much power do you need?',
          options: [
            chipOption('m1-pro', 'Nimbus M1 Pro', '8-core CPU · 14-core GPU · 16-core Neural Engine', 0, {
              Processor: 'Nimbus M1 Pro — 8-core CPU, 14-core GPU',
            }),
            chipOption('m1-max', 'Nimbus M1 Max', '10-core CPU · 32-core GPU · 16-core Neural Engine', 500, {
              Processor: 'Nimbus M1 Max — 10-core CPU, 32-core GPU',
            }),
            chipOption('m2-pro', 'Nimbus M2 Pro', '10-core CPU · 16-core GPU · 16-core Neural Engine', 200, {
              Processor: 'Nimbus M2 Pro — 10-core CPU, 16-core GPU',
            }),
            chipOption('m2-max', 'Nimbus M2 Max', '12-core CPU · 38-core GPU · 16-core Neural Engine', 700, {
              Processor: 'Nimbus M2 Max — 12-core CPU, 38-core GPU',
            }),
            chipOption('m3-pro', 'Nimbus M3 Pro', '11-core CPU · 14-core GPU · 16-core Neural Engine', 300, {
              Processor: 'Nimbus M3 Pro — 11-core CPU, 14-core GPU',
            }),
            chipOption('m3-max', 'Nimbus M3 Max', '14-core CPU · 30-core GPU · 16-core Neural Engine', 800, {
              Processor: 'Nimbus M3 Max — 14-core CPU, 30-core GPU',
            }),
            chipOption('m4-pro', 'Nimbus M4 Pro', '12-core CPU · 16-core GPU · 16-core Neural Engine', 500, {
              Processor: 'Nimbus M4 Pro — 12-core CPU, 16-core GPU',
            }),
            chipOption('m4-max', 'Nimbus M4 Max', '16-core CPU · 40-core GPU · 16-core Neural Engine', 1000, {
              Processor: 'Nimbus M4 Max — 16-core CPU, 40-core GPU',
            }),
            chipOption('m5-pro', 'Nimbus M5 Pro', '14-core CPU · 20-core GPU · 18-core Neural Engine', 700, {
              Processor: 'Nimbus M5 Pro — 14-core CPU, 20-core GPU',
            }),
            chipOption('m5-max', 'Nimbus M5 Max', '18-core CPU · 48-core GPU · 18-core Neural Engine', 1200, {
              Processor: 'Nimbus M5 Max — 18-core CPU, 48-core GPU',
            }),
          ],
        },
        {
          id: 'memory',
          label: 'Memory',
          subtitle: 'Unified memory for pro workflows.',
          options: [
            memOption('16gb', '16GB unified memory', 0),
            memOption('32gb', '32GB unified memory', 400),
            memOption('64gb', '64GB unified memory', 800),
            memOption('128gb', '128GB unified memory', 1600),
          ],
        },
        {
          id: 'storage',
          label: 'Storage',
          subtitle: 'Up to 8TB SSD storage.',
          options: [
            storageOption('512gb', '512GB SSD storage', 0),
            storageOption('1tb', '1TB SSD storage', 200),
            storageOption('2tb', '2TB SSD storage', 600),
            storageOption('4tb', '4TB SSD storage', 1200),
            storageOption('8tb', '8TB SSD storage', 2400),
          ],
        },
        {
          id: 'color',
          label: 'Finish',
          subtitle: 'Choose your finish.',
          options: [
            colorOption('space-black', 'Space Black'),
            colorOption('silver', 'Silver'),
          ],
        },
      ],
    },
  },
  {
    name: 'Gameripper',
    slug: 'gameripper',
    description:
      'Desktop-class power, laptop form. The Gameripper is a flagship gaming and creator rig with vapor-chamber cooling, a 300Hz panel, and fully configurable Overdrive CPUs and NovaGraph graphics.',
    price: 3799,
    category: 'laptops',
    images: getProductImages('computers/laptops/gameripper'),
    featured: true,
    stock: 35,
    rating: 4.7,
    reviewCount: 89,
    reviews: [
      { userName: 'Chris Vega', comment: 'Absolute beast for AAA gaming and streaming at the same time.', stars: 5 },
    ],
    specs: {
      Display: '18" QHD+ 300Hz Vivid Panel',
      Resolution: '2560 × 1600',
      'Refresh Rate': '300Hz',
      'Battery Life': 'Up to 5 hours (mobile use)',
      Weight: '4.2 kg (9.3 lb)',
      Cooling: 'Vapor chamber + quad-fan HyperCool',
      Ports: '2 × USB-C, 3 × USB-A, HDMI 2.1, RJ-45, SD reader, 3.5 mm combo',
      Wireless: 'Wi-Fi 7, Bluetooth 5.4',
      Keyboard: 'Per-key RGB mechanical-style',
    },
    configurator: {
      groups: [
        {
          id: 'processor',
          label: 'Processor',
          subtitle: 'Flagship Overdrive CPUs for maximum throughput.',
          options: [
            chipOption('x9-hx', 'Overdrive X9 HX', '24 cores · up to 5.8 GHz · 55W base', 0, {
              Processor: 'Overdrive X9 HX — 24 cores, up to 5.8 GHz',
            }),
            chipOption('ultra9-hx', 'Overdrive Ultra 9 HX', '24 cores · up to 5.5 GHz · AI Boost', 300, {
              Processor: 'Overdrive Ultra 9 HX — 24 cores with AI Boost',
            }),
            chipOption('vortex9-hx', 'VortexCore 9 HX', '16 cores · up to 5.4 GHz · 3D cache', 200, {
              Processor: 'VortexCore 9 HX — 16 cores, 3D cache',
            }),
          ],
        },
        {
          id: 'gpu',
          label: 'Graphics',
          subtitle: 'NovaGraph discrete graphics for gaming and rendering.',
          options: [
            chipOption('ng-4080', 'NovaGraph 4080', '12GB GDDR6 · 742 AI TOPS', 0, {
              Graphics: 'NovaGraph 4080 — 12GB GDDR6',
            }),
            chipOption('ng-4090', 'NovaGraph 4090', '16GB GDDR6 · 972 AI TOPS', 600, {
              Graphics: 'NovaGraph 4090 — 16GB GDDR6',
            }),
          ],
        },
        {
          id: 'memory',
          label: 'Memory',
          subtitle: 'Dual-channel DDR5 for heavy workloads.',
          options: [
            memOption('32gb', '32GB DDR5-5600', 0),
            memOption('64gb', '64GB DDR5-5600', 450),
          ],
        },
        {
          id: 'storage',
          label: 'Storage',
          subtitle: 'Dual M.2 slots — configure primary storage.',
          options: [
            storageOption('1tb', '1TB PCIe Gen5 NVMe SSD', 0),
            storageOption('2tb', '2TB PCIe Gen5 NVMe SSD', 350),
            storageOption('4tb', '4TB PCIe Gen5 NVMe SSD', 900),
          ],
        },
        {
          id: 'color',
          label: 'Finish',
          subtitle: 'Choose your chassis look.',
          options: [
            colorOption('lunar-silver', 'Lunar Silver'),
            colorOption('dark-moon', 'Dark Moon'),
          ],
        },
      ],
    },
  },
];
