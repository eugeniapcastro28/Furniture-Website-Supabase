import img1 from '../assets/1.webp';
import img2 from '../assets/2.webp';
import img3 from '../assets/3.webp';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import rattanSala from '../assets/rattanSala.png';
import rattanSalaSet from '../assets/rattanSalaSet.png';
import rattanRocking from '../assets/rattanRocking.png';
import sofa from '../assets/sofa.png';
import woodRocking from '../assets/woodRocking.png';

export const categories = [
  { id: 'seating', label: 'Seating' },
  { id: 'tables',  label: 'Tables'  },
  { id: 'storage', label: 'Storage' },
  { id: 'beds',    label: 'Beds'    },
];

export const products = [
  {
    id: 'rattan-sala-set',
    name: 'Rattan Sala Set',
    category: 'seating',
    tag: 'Bestseller',
    description:
      'A complete living room set woven from premium natural rattan, bringing the warmth of handcraft into every corner of your sala.',
    image: rattanSalaSet,
    images: [rattanSalaSet, rattanSala, img1],
    price: '₱38,500',
    material: 'Natural Rattan & Abaca',
    dimensions: 'Sofa: 160 W × 75 D × 85 H cm | Armchair: 75 W × 75 D × 85 H cm',
    weight: '22 kg (set)',
    finish: 'Clear Lacquer',
    color: 'Natural Honey',
    origin: 'Cebu, Philippines',
    leadTime: '3–4 weeks',
    warranty: '2 Years',
    details:
      'Each piece in this set is hand-woven by Cebuano craftsmen using split rattan over a solid bamboo frame. The tight herringbone weave pattern is signature to our Cebu workshop. Cushions are included and upholstered in breathable cotton-linen blend fabric.',
    care: [
      'Dust weekly with a dry brush to prevent dust build-up in the weave.',
      'Wipe frame with a lightly damp cloth; dry immediately.',
      'Keep cushion covers machine-washable at 30°C.',
      'Avoid prolonged exposure to direct rain or strong sunlight.',
      'Re-lacquer once every two years to maintain the finish.',
    ],
  },
  {
    id: 'rattan-sala-chair',
    name: 'Rattan Sala Chair',
    category: 'seating',
    description:
      'A single accent sala chair hand-woven from natural rattan — the perfect companion piece or standalone statement for any room.',
    image: rattanSala,
    images: [rattanSala, rattanSalaSet],
    price: '₱12,500',
    material: 'Natural Rattan & Bamboo',
    dimensions: '75 W × 75 D × 85 H cm',
    weight: '8 kg',
    finish: 'Clear Lacquer',
    color: 'Natural Honey',
    origin: 'Cebu, Philippines',
    leadTime: '2–3 weeks',
    warranty: '1 Year',
    details:
      'Matching companion to the Rattan Sala Set, this chair is sold individually for those who want to mix it into an existing space. The frame uses traditional lashing joints — no nails or staples — making it lightweight yet remarkably sturdy.',
    care: [
      'Dust regularly with a dry brush or cloth.',
      'Wipe with a lightly damp cloth; dry immediately.',
      'Re-lacquer annually to maintain the finish.',
      'Avoid prolonged exposure to direct rain or humidity.',
    ],
  },
  {
    id: 'rattan-rocking-chair',
    name: 'Rattan Rocking Chair',
    category: 'seating',
    tag: 'New',
    description:
      'A classic rocking chair reimagined in natural rattan with ergonomic curves — slow living, beautifully made.',
    image: rattanRocking,
    images: [rattanRocking, img2],
    price: '₱16,800',
    material: 'Natural Rattan',
    dimensions: '68 W × 100 D × 110 H cm',
    weight: '9 kg',
    finish: 'Matte Lacquer',
    color: 'Natural Tan',
    origin: 'Cebu, Philippines',
    leadTime: '3–4 weeks',
    warranty: '1 Year',
    details:
      'The rocker runners are steam-bent from solid rattan poles for resilience under repeated flexing. The backrest height and seat pitch are tuned for comfortable reading posture. Available with or without a loose seat cushion.',
    care: [
      'Inspect rocker joints every six months and tighten if needed.',
      'Wipe with a lightly damp cloth; dry immediately.',
      'Apply furniture lacquer spray once a year.',
      'Do not leave outdoors overnight.',
    ],
  },
  {
    id: 'wooden-rocking-chair',
    name: 'Wooden Rocking Chair',
    category: 'seating',
    description:
      'A solid hardwood rocking chair with a slatted back and smooth rocker base — heirloom quality built to last generations.',
    image: woodRocking,
    images: [woodRocking, img3],
    price: '₱24,500',
    material: 'Solid Acacia Hardwood',
    dimensions: '65 W × 105 D × 112 H cm',
    weight: '14 kg',
    finish: 'Hand-Rubbed Tung Oil',
    color: 'Warm Walnut',
    origin: 'Batangas, Philippines',
    leadTime: '4–5 weeks',
    warranty: '3 Years',
    details:
      'Cut from sustainably sourced acacia with natural figuring left intact, each chair is finished by hand with successive coats of tung oil that penetrate deep into the grain. The mortise-and-tenon joinery requires no screws and tightens with use over time.',
    care: [
      'Re-oil with food-safe tung oil every 12–18 months.',
      'Wipe spills immediately with a dry cloth.',
      'Keep away from direct sunlight to prevent uneven fading.',
      'Avoid placing near heat sources.',
    ],
  },
  {
    id: 'fabric-sofa',
    name: 'Handcrafted Fabric Sofa',
    category: 'seating',
    description:
      'A three-seater sofa with a solid wood frame and hand-stitched fabric upholstery — generous proportions, quiet elegance.',
    image: sofa,
    images: [sofa, img4],
    price: '₱52,000',
    material: 'Solid Mahogany Frame, Cotton-Linen Upholstery',
    dimensions: '210 W × 92 D × 88 H cm',
    weight: '48 kg',
    finish: 'Antique Walnut Stain',
    color: 'Warm Sand',
    origin: 'Pampanga, Philippines',
    leadTime: '5–6 weeks',
    warranty: '3 Years',
    details:
      'The frame is jointed with double-dowel construction for rigidity, then wrapped in high-density foam and hand-stitched in a 55% cotton / 45% linen blend. Leg caps are solid brass with a brushed finish. Custom fabric colors available on request.',
    care: [
      'Vacuum cushions weekly using the upholstery attachment.',
      'Spot-clean fabric with a mild soap solution; blot, do not rub.',
      'Rotate cushions monthly for even wear.',
      'Keep away from direct sunlight to prevent fabric fading.',
    ],
  },
  {
    id: 'rattan-side-table',
    name: 'Rattan Side Table',
    category: 'tables',
    description:
      'A round side table with a woven rattan shelf base and solid wood top — functional accent piece for living rooms and bedrooms.',
    image: img5,
    images: [img5, img2],
    price: '₱8,900',
    material: 'Rattan & Solid Acacia Top',
    dimensions: '50 Ø × 55 H cm',
    weight: '5 kg',
    finish: 'Clear Lacquer / Natural Oil Top',
    color: 'Natural & Warm Brown',
    origin: 'Cebu, Philippines',
    leadTime: '2–3 weeks',
    warranty: '1 Year',
    details:
      'The round acacia top is turned on a lathe and finished with natural oil, while the lower shelf and leg structure are hand-woven rattan. The two materials are joined with concealed steel inserts for stability without visible hardware.',
    care: [
      'Wipe top with a lightly oiled cloth to maintain sheen.',
      'Dust rattan base weekly with a dry brush.',
      'Avoid placing directly on wet floors.',
    ],
  },
];

// Featured products shown on the HomePage hero/highlights section
// Picks the first 3 products, or tag the ones you want shown there
export const featuredProducts = products.filter(p => p.tag).slice(0, 3);