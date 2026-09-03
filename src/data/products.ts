import { Product } from '../types';
import { SHOE_IMAGES } from './shoeImages';

export const PRODUCTS: Product[] = [
  // 1. Women's Canvas Cruiser - Sea Spray
  {
    id: '262364',
    name: "WOMEN'S CANVAS CRUISER",
    subtitle: 'Classic retro canvas silhouette upgraded with modern cushion comfort.',
    category: 'cruisers',
    gender: 'women',
    price: 2850,
    badge: 'New',
    colors: [
      {
        name: 'Sea Spray',
        colorCode: '#7298ac',
        image: SHOE_IMAGES.canvasCruiserSeaSpray,
        altImages: [
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=900&q=80'
        ]
      },
      {
        name: 'Warm White',
        colorCode: '#ebe6dc',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=80',
      },
      {
        name: 'Port',
        colorCode: '#662234',
        image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=900&q=80',
      },
      {
        name: 'Jet Black',
        colorCode: '#222222',
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80',
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'A timeless low-profile sneaker crafted from heavy-duty breathable cotton canvas and anti-slip vulcanized rubber sole. Lightweight, breezy, and effortlessly paired with any casual outfit.',
    materials: [
      'Heavy-duty breathable cotton canvas upper',
      'Anti-slip vulcanized rubber outsole with waffle grip',
      'High-resilience cushioned insole with arch support',
      'Reinforced double-stitched eyelets and seams'
    ],
    features: [
      'Ultra-breathable lightweight design',
      'Flexible shock-absorbing sole',
      'Removable cushioned insole for easy washing'
    ],
    idealFor: 'Daily Casual, College & City Walking',
    buildQuality: 'Premium Grade Canvas & Rubber',
    rating: 4.8,
    reviewCount: 980
  },

  // 2. Men's JUTU Slide - Anthracite
  {
    id: '262361',
    name: "MEN'S JUTU SLIDE",
    subtitle: 'Ultra-cushioned textured slip-on slide engineered for maximum comfort and foot recovery.',
    category: 'slides',
    gender: 'men',
    price: 1650,
    badge: 'New',
    colors: [
      {
        name: 'Anthracite',
        colorCode: '#464442',
        image: SHOE_IMAGES.slideAnthracite,
      },
      {
        name: 'Natural Black',
        colorCode: '#1a1a1a',
        image: SHOE_IMAGES.slideNaturalBlack,
      },
      {
        name: 'Sand',
        colorCode: '#c8bcab',
        image: SHOE_IMAGES.slideSand,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'The easiest slide you will ever own. Built with a supportive contoured footbed that reduces foot fatigue, paired with a soft padded strap for all-day comfort.',
    materials: [
      'High-elasticity shock-absorbing EVA foam footbed',
      'Padded quick-dry strap with soft inner lining',
      'Water-resistant textured non-slip outsole',
      'Ergonomic toe bar and deep heel cup'
    ],
    features: [
      'Ergonomic arch support for pressure relief',
      'Water-friendly, washable & quick-drying',
      'High-traction ribbed non-slip sole'
    ],
    idealFor: 'Home Lounging, Post-Workout & Travel',
    buildQuality: 'High-Density Injection Molded EVA',
    rating: 4.8,
    reviewCount: 512
  },

  // 3. Women's JUTU Flip Flop - Natural Black
  {
    id: '262362',
    name: "WOMEN'S JUTU FLIP FLOP",
    subtitle: 'Featherlight cushioned thong sandal with cloud-like arch support.',
    category: 'slides',
    gender: 'women',
    price: 1350,
    badge: 'New',
    colors: [
      {
        name: 'Natural Black',
        colorCode: '#1f1f1f',
        image: SHOE_IMAGES.flipFlopBlack,
      },
      {
        name: 'Sand',
        colorCode: '#c2b4a1',
        image: SHOE_IMAGES.flipFlopSand,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Lightweight flip flops designed with super soft anti-chafe toe straps and a shock-absorbing textured footbed for smooth, pain-free daily steps.',
    materials: [
      'High-resilience soft foam cushion sole',
      'Soft woven anti-chafe toe post strap',
      'Textured anti-slip grip pattern on footbed & sole',
      'Flexible lightweight contoured base'
    ],
    features: [
      'Zero-chafe woven toe post (no blisters)',
      'Contoured footbed cradles your feet',
      'Easy to rinse and water-resistant'
    ],
    idealFor: 'Everyday Casual, Beach & Home Wear',
    buildQuality: 'Comfort Foam & Reinforced Webbing',
    rating: 4.9,
    reviewCount: 780
  },

  // 4. Men's JUTU Slide - Natural Black
  {
    id: '262363',
    name: "MEN'S JUTU SLIDE",
    subtitle: 'Classic black everyday slide for recovery, lounging, and street comfort.',
    category: 'slides',
    gender: 'men',
    price: 1650,
    badge: 'New',
    colors: [
      {
        name: 'Natural Black',
        colorCode: '#181818',
        image: SHOE_IMAGES.slideNaturalBlack,
      },
      {
        name: 'Anthracite',
        colorCode: '#464442',
        image: SHOE_IMAGES.slideAnthracite,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Slip into instant comfort with our shock-absorbing cushioned slide sandals. Features a wide ergonomic upper band and anti-skid bottom tread.',
    materials: [
      'Dual-density cushioning EVA midsole',
      'Soft padded comfort band with reinforced border',
      'Deep grooved anti-slip grip outsole'
    ],
    features: [
      'Deep shock-absorbing cushion',
      'Wide supportive strap with snug fit',
      'Anti-slip tread for wet & dry surfaces'
    ],
    idealFor: 'Daily Casual Lounging & Outdoor Relax',
    buildQuality: 'High-Durability Molded EVA',
    rating: 4.8,
    reviewCount: 390
  },

  // 5. Women's JUTU Slide - Sand
  {
    id: '262365',
    name: "WOMEN'S JUTU SLIDE",
    subtitle: 'Subtle earthy tones with plush cushioning for all-day easy steps.',
    category: 'slides',
    gender: 'women',
    price: 1650,
    badge: 'New',
    colors: [
      {
        name: 'Sand',
        colorCode: '#c8bcab',
        image: SHOE_IMAGES.slideSand,
      },
      {
        name: 'Natural Black',
        colorCode: '#222222',
        image: SHOE_IMAGES.slideNaturalBlack,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Designed specifically for women’s feet with a sleek, flattering profile and a soft cushioned band that holds securely without pinching.',
    materials: [
      'Ergonomic contoured cushion footbed',
      'Soft-touch padded upper strap',
      'Non-slip grooved rubber base'
    ],
    features: [
      'Ultra-lightweight step feel',
      'Anti-slip bottom traction pattern',
      'Easy to wipe clean'
    ],
    idealFor: 'Indoor Lounging & Casual Outings',
    buildQuality: 'Plush EVA Comfort Construction',
    rating: 4.9,
    reviewCount: 420
  },

  // 6. Men's JUTU Slide - Natural Black 2
  {
    id: '262366',
    name: "MEN'S JUTU SLIDE",
    subtitle: 'Textured strap with shock-absorbing contoured arch support.',
    category: 'slides',
    gender: 'men',
    price: 1650,
    badge: 'New',
    colors: [
      {
        name: 'Natural Black',
        colorCode: '#1a1a1a',
        image: SHOE_IMAGES.slideNaturalBlack,
      },
      {
        name: 'Anthracite',
        colorCode: '#464442',
        image: SHOE_IMAGES.slideAnthracite,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Lightweight slide crafted with durable cushioning for everyday relaxation, gym recovery, and weekend wear.',
    materials: [
      'High-density comfort EVA foam',
      'Reinforced durable upper strap',
      'Traction grip pattern outsole'
    ],
    features: [
      'Quick rinse & dry cleanable',
      'Anatomical arched footbed',
      'Durable long-lasting build'
    ],
    idealFor: 'Gym Recovery, Pool & Weekend Comfort',
    buildQuality: 'Water-Resistant High-Density Foam',
    rating: 4.7,
    reviewCount: 290
  },

  // 7. Women's JUTU Flip Flop - Sand
  {
    id: '262367',
    name: "WOMEN'S JUTU FLIP FLOP",
    subtitle: 'Warm sand tone with cushioned arch support and soft woven toe strap.',
    category: 'slides',
    gender: 'women',
    price: 1350,
    badge: 'New',
    colors: [
      {
        name: 'Sand',
        colorCode: '#c2b4a1',
        image: SHOE_IMAGES.flipFlopSand,
      },
      {
        name: 'Natural Black',
        colorCode: '#1f1f1f',
        image: SHOE_IMAGES.flipFlopBlack,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Effortlessly comfortable flip flops designed for lightweight daily steps, beach walks, and home relaxation.',
    materials: [
      'Flexible contoured cushion sole',
      'Soft woven anti-friction toe strap',
      'Non-slip grip bottom sole'
    ],
    features: [
      'Zero chafing or blisters on toes',
      'Shock-absorbing footbed',
      'Water-friendly and quick-dry'
    ],
    idealFor: 'Beach, Vacation & Everyday Home Wear',
    buildQuality: 'Flexible High-Comfort Cushion',
    rating: 4.8,
    reviewCount: 310
  },

  // 8. Men's JUTU Flip Flop - Sand
  {
    id: '262368',
    name: "MEN'S JUTU FLIP FLOP",
    subtitle: 'Earthy neutral flip flop built with durable high-traction sole.',
    category: 'slides',
    gender: 'men',
    price: 1350,
    badge: 'New',
    colors: [
      {
        name: 'Sand',
        colorCode: '#c2b4a1',
        image: SHOE_IMAGES.flipFlopSand,
      },
      {
        name: 'Natural Black',
        colorCode: '#1f1f1f',
        image: SHOE_IMAGES.flipFlopBlack,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Rugged yet soft flip flops built for daily post-run comfort, casual strolls, and humid weather ease.',
    materials: [
      'High-durability EVA comfort sole',
      'Reinforced woven toe post strap',
      'Textured anti-skid bottom treads'
    ],
    features: [
      'Quick-drying and water resistant',
      'Flexible and durable sole',
      'Gentle on skin during long walks'
    ],
    idealFor: 'Casual Strolls, Home & Summer Wear',
    buildQuality: 'Heavy-Duty Lightweight Construction',
    rating: 4.7,
    reviewCount: 220
  },

  // 9. Women's Canvas Cruiser Slip On - Warm White
  {
    id: '262369',
    name: "WOMEN'S CANVAS CRUISER SLIP ON",
    subtitle: 'Classic retro canvas slip-on with modern comfort and elastic side stretch gore.',
    category: 'cruisers',
    gender: 'women',
    price: 2850,
    badge: 'New',
    colors: [
      {
        name: 'Warm White',
        colorCode: '#eae4d9',
        image: SHOE_IMAGES.canvasCruiserSlipOnWarmWhite,
      },
      {
        name: 'Sea Spray',
        colorCode: '#7298ac',
        image: SHOE_IMAGES.canvasCruiserSeaSpray,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'A timeless low-profile slip-on sneaker crafted with heavy-duty breathable canvas, flexible side stretch gores, and non-slip rubber grip.',
    materials: [
      'Heavy-duty breathable cotton canvas upper',
      'High-cushion responsive foam insole',
      'Vulcanized anti-slip rubber outsole',
      'Dual elastic stretch side gores'
    ],
    features: [
      'Easy hands-free slip-on fit',
      'Elastic side gore expands with movement',
      'Removable cushioned insole'
    ],
    idealFor: 'Daily Office, University & City Walking',
    buildQuality: 'Reinforced Vulcanized Canvas Build',
    rating: 4.9,
    reviewCount: 650
  },

  // 10. Women's Cruiser Slip On - Blizzard
  {
    id: '262370',
    name: "WOMEN'S CRUISER SLIP ON",
    subtitle: 'Streamlined textured knit slip-on in pure blizzard white.',
    category: 'cruisers',
    gender: 'women',
    price: 3250,
    badge: 'New',
    colors: [
      {
        name: 'Blizzard',
        colorCode: '#ffffff',
        image: SHOE_IMAGES.cruiserSlipOnBlizzard,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Pure blizzard white knit slip-on with cushioned arch support, padded heel collar, and lightweight step bounce.',
    materials: [
      'Breathable engineered diamond knit upper',
      'High-rebound shock-absorbing midsole',
      'Padded ankle collar prevents slipping',
      'Flexible non-slip rubber traction sole'
    ],
    features: [
      'Machine washable on gentle cycle',
      'Diamond textured knit breathes easily',
      'Zero break-in period comfort'
    ],
    idealFor: 'All-Day Standing, Travel & Casual Wear',
    buildQuality: 'Seamless Engineered Knit',
    rating: 4.8,
    reviewCount: 420
  },

  // 11. Women's Runner NZ Slip On - Mushroom
  {
    id: '262371',
    name: "WOMEN'S RUNNER NZ SLIP ON",
    subtitle: 'Everyday slip-on crafted with flexible stretch knit and cloud comfort.',
    category: 'runners',
    gender: 'women',
    price: 3450,
    badge: 'New',
    colors: [
      {
        name: 'Mushroom',
        colorCode: '#beb3a3',
        image: SHOE_IMAGES.runnerSlipOnMushroom,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Designed for barefoot freedom with instant slip-on ease, ribbed knit wave upper, and supportive arch cushion for smooth strides.',
    materials: [
      'High-stretch breathable weave upper',
      'High-rebound shock absorbing midsole',
      'Non-marking traction rubber grip pods',
      'Integrated pull tab on heel'
    ],
    features: [
      'Sock-like flexible knit fit',
      'Machine washable design',
      'Anatomical heel lock & arch support'
    ],
    idealFor: 'Daily Commutes, Walking & Workouts',
    buildQuality: 'High-Density Breathable Weave',
    rating: 4.9,
    reviewCount: 1420
  },

  // 12. Women's Runner NZ Slip On - Anthracite
  {
    id: '262372',
    name: "WOMEN'S RUNNER NZ SLIP ON",
    subtitle: 'Charcoal ribbed sock runner slip-on with cloud-like bouncy cushioning.',
    category: 'runners',
    gender: 'women',
    price: 3450,
    badge: 'New',
    colors: [
      {
        name: 'Anthracite',
        colorCode: '#403d39',
        image: SHOE_IMAGES.runnerSlipOnAnthracite,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Easy slip-on sock sneaker in anthracite charcoal with integrated heel pull tab and high-traction grooved outsole.',
    materials: [
      'Breathable multi-zone knit upper',
      'High-rebound shock absorbing midsole',
      'Reinforced heel and toe stability zones',
      'Padded anti-friction inner collar'
    ],
    features: [
      'Seamless glove-like sock fit',
      'Machine washable on cold cycle',
      'Enhanced torsional stability'
    ],
    idealFor: 'Casual, Gym Training & Travel',
    buildQuality: 'Multi-Zone Engineered Knit',
    rating: 4.9,
    reviewCount: 980
  },

  // 13. Women's Runner NZ Slip On - Dark Navy
  {
    id: '262373',
    name: "WOMEN'S RUNNER NZ SLIP ON",
    subtitle: 'Deep dark navy ribbed sock runner slip-on with supportive step bounce.',
    category: 'runners',
    gender: 'women',
    price: 3450,
    badge: 'New',
    colors: [
      {
        name: 'Dark Navy',
        colorCode: '#1d2638',
        image: SHOE_IMAGES.runnerSlipOnDarkNavy,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Easy slip-on sock sneaker in dark navy with integrated heel pull tab and engineered wave knit for superior airflow.',
    materials: [
      'Breathable multi-zone wave knit upper',
      'High-rebound shock absorbing midsole',
      'Durable high-traction rubber outsole',
      'Soft moisture-wicking sock liner'
    ],
    features: [
      'Seamless sock fit with high flexibility',
      'Machine washable',
      'Torsional arch stability'
    ],
    idealFor: 'Daily Walking, Commute & Exercise',
    buildQuality: 'High-Elasticity Performance Knit',
    rating: 4.9,
    reviewCount: 840
  },
  {
    id: '262374',
    name: "MEN'S TREE DASHER 2",
    subtitle: 'Responsive daily running and training shoe with high-grip traction.',
    category: 'dashers',
    gender: 'men',
    price: 4850,
    badge: 'Best',
    colors: [
      {
        name: 'Sage Green',
        colorCode: '#6d8073',
        image: SHOE_IMAGES.dasherSageGreen,
      },
      {
        name: 'Thunder Blue',
        colorCode: '#3c526b',
        image: SHOE_IMAGES.dasherSageGreen,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Engineered with active traction lugs and a responsive dual-density cushioning midsole for running, jogging, and gym sessions.',
    materials: [
      'Seamless one-piece breathable athletic mesh upper',
      'Dual-density responsive shock-absorbing midsole',
      'All-weather anti-skid rubber traction lugs',
      'Anatomical padded heel counter'
    ],
    features: [
      'Anatomical heel collar lock for zero slippage',
      'Reflective safety highlights for night visibility',
      'Enhanced torsional arch stability'
    ],
    idealFor: 'Running, Marathon Training & Gym Workouts',
    buildQuality: 'Athletic Performance Dual-Density Build',
    rating: 4.9,
    reviewCount: 3120
  },
  {
    id: '262375',
    name: "MEN'S RUNNER NZ SLIP ON",
    subtitle: 'Clean everyday sneaker slip-on with cushioned arch support.',
    category: 'runners',
    gender: 'men',
    price: 3450,
    colors: [
      {
        name: 'Anthracite',
        colorCode: '#383838',
        image: SHOE_IMAGES.runnerSlipOnAnthracite,
      },
      {
        name: 'Dark Navy',
        colorCode: '#1f293d',
        image: SHOE_IMAGES.runnerSlipOnDarkNavy,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Easy on, easy off. The Men’s Runner NZ Slip On features a streamlined knit silhouette with cushioned walking support.',
    materials: [
      'Stretch-engineered breathable knit upper',
      'High-density cushioned walking sole',
      'Reinforced non-marking grip outsole',
      'Padded comfort collar'
    ],
    features: [
      'Instant hands-free slip-on entry',
      'Machine washable construction',
      'Lightweight multi-directional flexibility'
    ],
    idealFor: 'Office Casual, Daily Walking & Travel',
    buildQuality: 'Reinforced Breathable Sock-Knit',
    rating: 4.8,
    reviewCount: 1105
  },
  {
    id: '262376',
    name: "WOMEN'S TREE RUNNER",
    subtitle: 'Our iconic breathable everyday sneaker with cloud-soft stride.',
    category: 'runners',
    gender: 'women',
    price: 3650,
    badge: 'Best',
    colors: [
      {
        name: 'Mist Blue',
        colorCode: '#7895a2',
        image: SHOE_IMAGES.treeRunnerMistBlue,
      },
      {
        name: 'Blush Pink',
        colorCode: '#cca4a4',
        image: SHOE_IMAGES.treeRunnerMistBlue,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'The sneaker designed for all-day comfort. Lightweight, wonderfully airy, and equipped with a shock-absorbing cushioned sole.',
    materials: [
      'Air-flow mesh breathable knit upper',
      'High-rebound shock absorption midsole',
      'Padded collar and anti-slip rubber traction pads',
      'Cushioned removable insole'
    ],
    features: [
      'Silky smooth and cool against skin',
      'Cushioned low-density walking sole',
      'Machine washable on cold cycle'
    ],
    idealFor: 'Daily Walking, Travel & Casual Outings',
    buildQuality: 'High-Flow Breathable Air Mesh',
    rating: 4.9,
    reviewCount: 8940
  },
  {
    id: '262377',
    name: "WOOL LOUNGER SLIP-ON",
    subtitle: 'Cozy slip-on sneaker crafted with ultra-plush comfort lining.',
    category: 'loungers',
    gender: 'unisex',
    price: 3850,
    colors: [
      {
        name: 'Dapple Grey',
        colorCode: '#787878',
        image: SHOE_IMAGES.woolLoungerDappleGrey,
      },
      {
        name: 'True Navy',
        colorCode: '#1a273b',
        image: SHOE_IMAGES.woolLoungerDappleGrey,
      }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    description: 'Soft, itch-free, and temperature-regulating. The Lounger provides instant step-in comfort for long hours at work or home.',
    materials: [
      'Premium soft textured comfort upper',
      'High-rebound cushioned shock-absorbing midsole',
      'Anti-slip flexible rubber outsole',
      'Plush padded interior lining'
    ],
    features: [
      'Naturally soft and odor-resistant lining',
      'Breathable all-season comfort',
      'Comfortable to wear with or without socks'
    ],
    idealFor: 'Home, Office & Casual Outings',
    buildQuality: 'Plush Textured Comfort Build',
    rating: 4.8,
    reviewCount: 4890
  },
  {
    id: '262378',
    name: "MEN'S TREE PIPER",
    subtitle: 'Classic low-top lace sneaker with crisp clean profile.',
    category: 'cruisers',
    gender: 'men',
    price: 3450,
    badge: 'New',
    colors: [
      {
        name: 'Chalk White',
        colorCode: '#f3f0ea',
        image: SHOE_IMAGES.treePiperChalkWhite,
      },
      {
        name: 'Obsidian Black',
        colorCode: '#1a1a1a',
        image: SHOE_IMAGES.treePiperChalkWhite,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'A versatile low-top lace sneaker engineered with breathable upper weave and supportive low-profile cushioning.',
    materials: [
      'Engineered breathable knit weave',
      'Cushioned dual-density walking sole',
      'Non-slip grip rubber pads'
    ],
    features: [
      'Low profile classic sneaker design',
      'Cushioned footbed for day-long walking',
      'Machine washable'
    ],
    idealFor: 'Daily Office, University & City Walking',
    buildQuality: 'Reinforced Dual-Density Soling',
    rating: 4.8,
    reviewCount: 760
  },
  {
    id: '262379',
    name: "WOMEN'S WOOL RUNNER MIZZLE",
    subtitle: 'Weather-resistant walking sneaker with water-repellent coating.',
    category: 'runners',
    gender: 'women',
    price: 3950,
    badge: 'New',
    colors: [
      {
        name: 'Storm Grey',
        colorCode: '#5a626a',
        image: SHOE_IMAGES.woolRunnerMizzleGrey,
      },
      {
        name: 'Natural White',
        colorCode: '#f5f5f0',
        image: SHOE_IMAGES.woolRunnerMizzleGrey,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Designed for drizzly wet days with water-shielding breathable finish and all-weather puddle traction.',
    materials: [
      'Water-repellent breathable treated upper',
      'Deep tread non-skid rubber outsole',
      'Plush padded interior'
    ],
    features: [
      'Water-shield barrier keeps feet dry',
      'Extra grip on slick pavements',
      'All-day thermal regulation'
    ],
    idealFor: 'Rainy Days, Commuting & Outdoor Walking',
    buildQuality: 'Weather-Shield High Grip Build',
    rating: 4.9,
    reviewCount: 1240
  },
  {
    id: '262380',
    name: "MEN'S TRAIL RUNNER SWT",
    subtitle: 'Rugged off-road trail running shoe with deep lug traction.',
    category: 'dashers',
    gender: 'men',
    price: 4950,
    badge: 'New',
    colors: [
      {
        name: 'Forest Green',
        colorCode: '#3b4d3c',
        image: SHOE_IMAGES.trailRunnerSWTGreen,
      },
      {
        name: 'Charcoal Terra',
        colorCode: '#2e2e2e',
        image: SHOE_IMAGES.trailRunnerSWTGreen,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Built to conquer uneven dirt tracks and rugged trails with multi-directional 4mm rubber lugs and reinforced mudguards.',
    materials: [
      'Ripstop durable upper mesh with mudguard',
      '4mm high-traction rugged grip lugs',
      'High-impact shock absorbing foam'
    ],
    features: [
      'Mudguard protection against debris',
      'Heavy-duty grip on gravel and grass',
      'Stabilizing heel counter'
    ],
    idealFor: 'Hiking, Trail Running & Outdoor Adventures',
    buildQuality: 'Heavy-Duty All-Terrain Construction',
    rating: 4.9,
    reviewCount: 880
  },
  {
    id: '262381',
    name: "WOMEN'S TREE BREEZER FLAT",
    subtitle: 'Silky smooth ballet flat engineered with bouncy arch cushion.',
    category: 'cruisers',
    gender: 'women',
    price: 2950,
    badge: 'New',
    colors: [
      {
        name: 'Jet Black',
        colorCode: '#1f1f1f',
        image: SHOE_IMAGES.treeBreezerJetBlack,
      },
      {
        name: 'Blush Sand',
        colorCode: '#d4bba7',
        image: SHOE_IMAGES.treeBreezerJetBlack,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'The elegant everyday flat you can walk miles in without discomfort. Features a flexible ribbed collar and supportive insole.',
    materials: [
      'Air-flow silky ribbed weave',
      'Flexible lightweight rubber sole',
      'Plush padded orthotic footbed'
    ],
    features: [
      'Elastic collar hugs your foot smoothly',
      'Packs flat for effortless travel',
      'Machine washable'
    ],
    idealFor: 'Office, Travel & Dressy Casual',
    buildQuality: 'Flexible Seamless Weave',
    rating: 4.8,
    reviewCount: 2310
  },
  {
    id: '262382',
    name: "MEN'S WOOL RUNNER GO",
    subtitle: 'Featherlight cushioned walking shoe with minimalist silhouette.',
    category: 'runners',
    gender: 'men',
    price: 3550,
    badge: 'New',
    colors: [
      {
        name: 'Natural Grey',
        colorCode: '#737373',
        image: SHOE_IMAGES.woolLoungerDappleGrey,
      },
      {
        name: 'Deep Slate',
        colorCode: '#2f3b48',
        image: SHOE_IMAGES.woolLoungerDappleGrey,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Designed for effortless strides with low-profile flexible cushioning and smooth, temperature-balanced lining.',
    materials: [
      'Breathable soft-knit upper weave',
      'Ultra-lightweight EVA cushion midsole',
      'Reinforced heel strike zone'
    ],
    features: [
      'Zero pinch points or hotspots',
      'Flexible sole mimics natural foot movement',
      'Machine washable'
    ],
    idealFor: 'All-Day Standing, Travel & Walking',
    buildQuality: 'Lightweight Comfort Foam',
    rating: 4.8,
    reviewCount: 950
  },
  {
    id: '262383',
    name: "WOMEN'S TREE FLYER TRAINING",
    subtitle: 'High-rebound workout sneaker with responsive bounce technology.',
    category: 'dashers',
    gender: 'women',
    price: 4650,
    badge: 'New',
    colors: [
      {
        name: 'Lavender Mist',
        colorCode: '#988ca3',
        image: SHOE_IMAGES.treeFlyerLavender,
      },
      {
        name: 'Cloud White',
        colorCode: '#f8f8f8',
        image: SHOE_IMAGES.treeFlyerLavender,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Engineered with high-rebound cushioning foam for energetic strides during cardio, HIIT, and fast-paced walking.',
    materials: [
      'High-ventilation breathable knit upper',
      'Responsive energy-return bounce midsole',
      'Zoned rubber traction pads'
    ],
    features: [
      'Springy energy return on every step',
      'Lateral stability support wings',
      'Ultra-breathable airflow mesh'
    ],
    idealFor: 'Gym, HIIT, Cardio & Fast Walking',
    buildQuality: 'Energy-Return Performance Foam',
    rating: 4.9,
    reviewCount: 1470
  },
  {
    id: '262384',
    name: "MEN'S TREE RUNNER BREEZE",
    subtitle: 'Ultra-airy mesh sneaker for daily city walking and warm weather.',
    category: 'runners',
    gender: 'men',
    price: 3650,
    badge: 'New',
    colors: [
      {
        name: 'Salt White',
        colorCode: '#faf9f6',
        image: SHOE_IMAGES.treeRunnerBreezeWhite,
      },
      {
        name: 'Navy Cobalt',
        colorCode: '#203254',
        image: SHOE_IMAGES.treeRunnerBreezeWhite,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Lightweight and exceptionally breathable daily sneaker with flexible cushioned outsole.',
    materials: [
      'High-ventilation knitted mesh',
      'Cushioned shock-absorbing EVA',
      'Non-slip grip pads'
    ],
    features: [
      'Breathable all-day airflow',
      'Cushioned stride',
      'Machine washable'
    ],
    idealFor: 'Daily Walking, Travel & Commutes',
    buildQuality: 'Breathable Knit Soling',
    rating: 4.9,
    reviewCount: 1820
  },
  {
    id: '262385',
    name: "MEN'S CANVAS CRUISER SLIP ON",
    subtitle: 'Effortless classic slip-on with dual stretch elastic side gores.',
    category: 'cruisers',
    gender: 'men',
    price: 2950,
    badge: 'New',
    colors: [
      {
        name: 'Washed Black',
        colorCode: '#292929',
        image: SHOE_IMAGES.canvasCruiserSlipOnWarmWhite,
      },
      {
        name: 'Warm Olive',
        colorCode: '#4a5342',
        image: SHOE_IMAGES.canvasCruiserSlipOnWarmWhite,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'A timeless slip-on sneaker crafted with heavy-duty breathable cotton canvas and vulcanized anti-slip rubber outsole.',
    materials: [
      'Heavy-duty breathable canvas',
      'High-rebound comfort insole',
      'Vulcanized waffle sole'
    ],
    features: [
      'Elastic side gore for easy slip-on',
      'Anti-slip waffle rubber grip',
      'Durable double stitching'
    ],
    idealFor: 'College, Office & Casual Wear',
    buildQuality: 'Vulcanized Canvas Construction',
    rating: 4.8,
    reviewCount: 930
  },
  {
    id: '262386',
    name: "MEN'S TREE DASHER RELAY",
    subtitle: 'Laceless performance running shoe with supportive lockdown fit.',
    category: 'dashers',
    gender: 'men',
    price: 4750,
    badge: 'New',
    colors: [
      {
        name: 'Graphite Night',
        colorCode: '#222222',
        image: SHOE_IMAGES.dasherSageGreen,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Slip on and sprint. Engineered with targeted compression knit for secure foot lockdown without laces.',
    materials: [
      'Targeted compression athletic knit',
      'Dual-density high-cushion midsole',
      'High-traction rubber traction pods'
    ],
    features: [
      'Laceless locked-in athletic fit',
      'High-rebound energy bounce',
      'Reflective heel safety accents'
    ],
    idealFor: 'Running, 5K Training & Workout',
    buildQuality: 'High-Tension Performance Weave',
    rating: 4.9,
    reviewCount: 1640
  },
  {
    id: '262387',
    name: "WOMEN'S WOOL PIPER WOVEN",
    subtitle: 'Low-profile minimalist sneaker with ultra-soft plush insole.',
    category: 'cruisers',
    gender: 'women',
    price: 3350,
    badge: 'New',
    colors: [
      {
        name: 'Cream Oatmeal',
        colorCode: '#dfd8ce',
        image: SHOE_IMAGES.treePiperChalkWhite,
      },
      {
        name: 'Soft Rose',
        colorCode: '#d2a7a7',
        image: SHOE_IMAGES.treePiperChalkWhite,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Chic low-profile sneaker that matches any dress or denim, offering cloud-cushioned comfort for long days out.',
    materials: [
      'Soft textured knit upper',
      'Flexible rubber outsole with traction grip',
      'Cushioned removable insole'
    ],
    features: [
      'Streamlined minimalist shape',
      'Cushioned footbed',
      'Machine washable'
    ],
    idealFor: 'Work, Travel & Weekend Brunch',
    buildQuality: 'Premium Soft-Touch Construction',
    rating: 4.8,
    reviewCount: 1110
  },
  {
    id: '262388',
    name: "WOMEN'S TREE DASHER GLIDE",
    subtitle: 'Responsive cushioned athletic trainer with arch stability.',
    category: 'dashers',
    gender: 'women',
    price: 4850,
    badge: 'New',
    colors: [
      {
        name: 'Mint Glaze',
        colorCode: '#a1c2b5',
        image: SHOE_IMAGES.dasherSageGreen,
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: 'Engineered for smooth transitions with anatomical heel collar and responsive bouncy cushion soles.',
    materials: [
      'Breathable engineered athletic weave',
      'Dual-density shock absorbing midsole',
      'All-surface rubber outsole'
    ],
    features: [
      'Anatomical heel lock prevents chafing',
      'High-impact shock absorption',
      'Ultra-breathable airflow'
    ],
    idealFor: 'Running, Gym & Power Walking',
    buildQuality: 'High-Performance Athletic Build',
    rating: 4.9,
    reviewCount: 2050
  },
  {
    id: '262389',
    name: "MEN'S WOOL LOUNGER CHROME",
    subtitle: 'Plush slip-on loafer sneaker with cushioned indoor-outdoor sole.',
    category: 'loungers',
    gender: 'men',
    price: 3850,
    badge: 'New',
    colors: [
      {
        name: 'Charcoal Chrome',
        colorCode: '#3a3a3a',
        image: SHOE_IMAGES.woolLoungerDappleGrey,
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: 'Effortlessly luxurious slip-on loafer silhouette with deep cushion arch support and flexible rubber base.',
    materials: [
      'Plush textured soft upper',
      'Cushioned dual-density walking base',
      'Non-marking traction rubber outsole'
    ],
    features: [
      'Hands-free slip-on entry',
      'Soft itch-free inner lining',
      'All-day comfort with or without socks'
    ],
    idealFor: 'Office Casual, Lounging & Weekend Travel',
    buildQuality: 'Dual-Density Luxury Soling',
    rating: 4.9,
    reviewCount: 1390
  }
];

export const UPSELL_ACCESSORIES = [
  {
    id: '262390',
    name: 'Everyday Cushion Crew Socks',
    price: 350,
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=400&q=80',
    color: 'Chalk White',
    description: 'Silky soft, odor-resistant breathable cotton blend with arch band.'
  },
  {
    id: '262391',
    name: 'Comfort Replacement Insoles',
    price: 450,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80',
    color: 'Cushion Foam',
    description: 'Restore that day-one bounce with fresh plush orthotic insoles.'
  },
  {
    id: '262392',
    name: 'Premium Shoe Cleaner Spray',
    price: 350,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    color: 'Foam Spray',
    description: 'Deep cleansing foam formula that cleans without damaging materials.'
  }
];

export const SLUG_TO_NUMERIC_ID: Record<string, string> = {
  'womens-canvas-cruiser-sea-spray': '262364',
  'mens-jutu-slide-anthracite': '262361',
  'womens-jutu-flip-flop-black': '262362',
  'mens-jutu-slide-natural-black': '262363',
  'womens-jutu-slide-sand': '262365',
  'mens-jutu-slide-black-alt': '262366',
  'womens-jutu-flip-flop-sand': '262367',
  'mens-jutu-flip-flop-sand-alt': '262368',
  'mens-allbirds-slide-anthracite': '262361',
  'womens-allbirds-flip-flop-black': '262362',
  'mens-allbirds-slide-natural-black': '262363',
  'womens-allbirds-slide-sand': '262365',
  'mens-allbirds-slide-black-alt': '262366',
  'womens-allbirds-flip-flop-sand': '262367',
  'mens-allbirds-flip-flop-sand-alt': '262368',
  'womens-canvas-cruiser-slip-on': '262369',
  'womens-cruiser-slip-on': '262370',
  'womens-runner-nz-slip-on-mushroom': '262371',
  'womens-runner-nz-slip-on-anthracite': '262372',
  'womens-runner-nz-slip-on-dark-navy': '262373',
  'tree-dasher-2-men': '262374',
  'runner-nz-slip-on-men': '262375',
  'tree-runner-women': '262376',
  'wool-lounger-unisex': '262377',
  'mens-tree-piper-classic': '262378',
  'womens-wool-runner-fluff': '262379',
  'mens-trail-runner-swt': '262380',
  'womens-tree-breezer-flat': '262381',
  'mens-wool-runner-go': '262382',
  'womens-tree-flyer-training': '262383',
  'mens-tree-runner-classic-white': '262384',
  'mens-cruiser-oxford-slip-on': '262385',
  'mens-dasher-relay-slip': '262386',
  'womens-wool-piper-woven': '262387',
  'womens-tree-dasher-glide': '262388',
  'mens-wool-lounger-charcoal': '262389',
  'trino-crew-socks': '262390',
  'natural-insole-set': '262391',
  'eco-shoe-cleaner': '262392',
};

export function findProductByIdOrSlug(idOrSlug: string): Product | undefined {
  if (!idOrSlug) return undefined;
  const cleanKey = decodeURIComponent(idOrSlug).trim().toLowerCase();
  const targetId = SLUG_TO_NUMERIC_ID[cleanKey] || cleanKey;

  const normalizeSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  let list: Product[] = [];
  let deletedIds = new Set<string>();

  if (typeof window !== 'undefined') {
    try {
      const deletedRaw = localStorage.getItem('jutu_admin_deleted_products_v2');
      if (deletedRaw) {
        const parsedDel = JSON.parse(deletedRaw);
        if (Array.isArray(parsedDel)) deletedIds = new Set(parsedDel);
      }
      const raw = localStorage.getItem('jutu_admin_products_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed.filter((p: Product) => p && !deletedIds.has(p.id) && !deletedIds.has((p as any).productId));
        }
      }
    } catch {
      // fallback
    }
  }

  // If the searched targetId itself is in deleted list, return undefined
  if (deletedIds.has(targetId) || deletedIds.has(cleanKey)) {
    return undefined;
  }

  const allProducts = list.length > 0 ? list : PRODUCTS.filter((p) => !deletedIds.has(p.id));

  // 1. Direct ID Match
  const directMatch = allProducts.find(
    (p) => (p.id === targetId || p.id.toLowerCase() === cleanKey) && !deletedIds.has(p.id)
  );
  if (directMatch) return directMatch;

  // 2. Slugified Name Match (e.g. "women-s-canvas-cruiser" or "mens-jutu-slide")
  const nameSlugMatch = allProducts.find((p) => {
    if (deletedIds.has(p.id)) return false;
    const slug = normalizeSlug(p.name);
    return slug === cleanKey || slug.replace(/-+/g, '') === cleanKey.replace(/-+/g, '');
  });
  if (nameSlugMatch) return nameSlugMatch;

  // 3. Fallback partial id match
  return allProducts.find((p) => p.id.includes(cleanKey) && !deletedIds.has(p.id));
}

