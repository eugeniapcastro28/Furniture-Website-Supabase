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
  { id: 'rattan', label: 'Rattan', description: 'Lightweight & durable natural rattan weave' },
  { id: 'wooden', label: 'Wooden', description: 'Solid hardwood with premium finish' },
  { id: 'bamboo', label: 'Bamboo', description: 'Eco-friendly sustainable bamboo furniture' },
  { id: 'outdoor', label: 'Outdoor', description: 'Weather-resistant sets for open spaces' },
];

export const products = [
  {
    id: 1,
    name: 'Rattan Sala Set',
    category: 'rattan',
    tag: 'Best Seller',
    image: rattanSalaSet,
    fallbackImage: img1,
    description: 'Handcrafted comfort for your living room. Classic rattan weave with plush cushions.',
    dimensions: '3-seater + 2 armchairs + coffee table',
    material: 'Natural Rattan, Foam Cushion',
    featured: true,
  },
  {
    id: 2,
    name: 'Rattan Sala',
    category: 'rattan',
    tag: 'New',
    image: rattanSala,
    fallbackImage: img1,
    description: 'Compact sala set perfect for small spaces. Elegant and easy to maintain.',
    dimensions: '2-seater + 1 armchair + side table',
    material: 'Natural Rattan, Cotton Cushion',
    featured: false,
  },
  {
    id: 3,
    name: 'Rattan Rocking Chair',
    category: 'rattan',
    tag: null,
    image: rattanRocking,
    fallbackImage: img1,
    description: 'Relax in style with this handwoven rattan rocking chair. Smooth, rhythmic comfort.',
    dimensions: 'Single seat',
    material: 'Natural Rattan',
    featured: false,
  },
  {
    id: 4,
    name: 'Wooden Sala Set',
    category: 'wooden',
    tag: 'Popular',
    image: img2,
    fallbackImage: img2,
    description: 'Premium mahogany finish with durable cushions. Built to last generations.',
    dimensions: '3-seater + 2 armchairs + center table',
    material: 'Mahogany Wood, Velvet Cushion',
    featured: true,
  },
  {
    id: 5,
    name: 'Wooden Cleopatra',
    category: 'wooden',
    tag: 'Luxury',
    image: img3,
    fallbackImage: img3,
    description: 'Elegant vintage design for luxury lounging. An heirloom-quality statement piece.',
    dimensions: 'Single lounger',
    material: 'Narra Wood, Premium Foam',
    featured: true,
  },
  {
    id: 6,
    name: 'Wood Rocking Chair',
    category: 'wooden',
    tag: null,
    image: woodRocking,
    fallbackImage: img2,
    description: 'Solid hardwood rocking chair with smooth curves. Classic design, modern comfort.',
    dimensions: 'Single seat',
    material: 'Solid Mahogany',
    featured: false,
  },
  {
    id: 7,
    name: 'Bamboo Lounge Set',
    category: 'bamboo',
    tag: 'Eco-Friendly',
    image: img4,
    fallbackImage: img3,
    description: 'Sustainably sourced bamboo lounge set. Light, strong, and naturally beautiful.',
    dimensions: '2-seater + ottoman',
    material: 'Treated Bamboo, Cotton Cushion',
    featured: false,
  },
  {
    id: 8,
    name: 'Outdoor Garden Set',
    category: 'outdoor',
    tag: 'Weather-Resistant',
    image: img5,
    fallbackImage: img1,
    description: 'Built for the outdoors. UV-resistant finish and rust-proof hardware.',
    dimensions: '4-seater dining + umbrella',
    material: 'Powder-Coated Rattan, Outdoor Fabric',
    featured: false,
  },
  {
    id: 9,
    name: 'Sofa Set',
    category: 'wooden',
    tag: null,
    image: sofa,
    fallbackImage: img2,
    description: 'Contemporary sofa with hardwood frame. Clean lines and plush seating.',
    dimensions: '3-seater sofa + 2 throw pillows',
    material: 'Acacia Wood, Linen Fabric',
    featured: false,
  },
];

export const featuredProducts = products.filter(p => p.featured);
