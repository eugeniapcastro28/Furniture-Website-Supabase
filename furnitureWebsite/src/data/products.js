import img1 from '../assets/1.webp';
import img2 from '../assets/2.webp';
import img3 from '../assets/3.webp';
import img4 from '../assets/4.webp';
import img5 from '../assets/5.webp';
import rattanSala from '../assets/rattanSala.webp';
import rattanSalaSet from '../assets/rattanSalaSet.webp';
import rattanRocking from '../assets/rattanRocking.webp';
import sofa from '../assets/sofa.webp';
import woodRocking from '../assets/woodRocking.webp';

export const categories = [
  { id: 'seating', label: 'Seating' },
  { id: 'tables', label: 'Tables' },
  { id: 'storage', label: 'Storage' },
  { id: 'beds', label: 'Beds' },
  { id: 'decor-lighting', label: 'Decor & Lighting' } 
];

export const products = [
  {
    id: 'rattan-sala-set',
    name: 'Rattan Sala Set',
    category: 'seating',
    tag: 'Bestseller',
    inStock: true, // Added Stock Status
    description: 'A complete living room set woven from premium natural rattan, bringing the warmth of handcraft into every corner of your sala.',
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
    details: 'Each piece in this set is hand-woven by Cebuano craftsmen using split rattan over a solid bamboo frame.',
    care: ['Dust weekly with a dry brush to prevent dust build-up in the weave.']
  },
  {
    id: 'rattan-sala-chair',
    name: 'Rattan Sala Chair',
    category: 'seating',
    inStock: true, // Added Stock Status
    description: 'A single accent sala chair hand-woven from natural rattan — the perfect companion piece or standalone statement for any room.',
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
    details: 'Matching companion to the Rattan Sala Set, this chair is sold individually.',
    care: ['Dust regularly with a dry brush or cloth.']
  },
  {
    id: 'rattan-rocking-chair',
    name: 'Rattan Rocking Chair',
    category: 'seating',
    tag: 'New',
    inStock: false, // Marked Out of Stock
    description: 'A classic rocking chair reimagined in natural rattan with ergonomic curves — slow living, beautifully made.',
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
    details: 'The rocker runners are steam-bent from solid rattan poles.',
    care: ['Inspect rocker joints every six months.']
  },
  {
    id: 'wooden-rocking-chair',
    name: 'Wooden Rocking Chair',
    category: 'seating',
    inStock: true, // Added Stock Status
    description: 'A solid hardwood rocking chair with a slatted back and smooth rocker base — heirloom quality built to last generations.',
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
    details: 'Cut from sustainably sourced acacia with natural figuring left intact.',
    care: ['Re-oil with food-safe tung oil every 12–18 months.']
  },
  {
    id: 'fabric-sofa',
    name: 'Handcrafted Fabric Sofa',
    category: 'seating',
    inStock: false, // Marked Out of Stock
    description: 'A three-seater sofa with a solid wood frame and hand-stitched fabric upholstery — generous proportions, quiet elegance.',
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
    details: 'The frame is jointed with double-dowel construction for rigidity.',
    care: ['Vacuum cushions weekly using the upholstery attachment.']
  },
  {
    id: 'rattan-side-table',
    name: 'Rattan Side Table',
    category: 'tables',
    inStock: true, // Added Stock Status
    description: 'A round side table with a woven rattan shelf base and solid wood top — functional accent piece for living rooms and bedrooms.',
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
    details: 'The round acacia top is turned on a lathe and finished with natural oil.',
    care: ['Wipe top with a lightly oiled cloth to maintain sheen.']
  }
];

export const featuredProducts = products.filter(p => p.tag).slice(0, 3);