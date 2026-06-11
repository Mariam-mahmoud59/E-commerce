import type { Product } from '../types/product';

export const products: Product[] = [
  { id: 1, nameEn: 'Artisan Clay Vase',  nameAr: 'مزهرية طينية حرفية',   price: 89,  oldPrice: 120, category: 'Ceramics',   emoji: '🏺', rating: 4.8, reviews: 124, badge: 'Bestseller' },
  { id: 2, nameEn: 'Silk Weave Throw',   nameAr: 'غطاء حرير منسوج',      price: 145, oldPrice: null, category: 'Textiles',   emoji: '🧵', rating: 4.6, reviews: 89,  badge: 'New' },
  { id: 3, nameEn: 'Bronze Pendant',     nameAr: 'قلادة برونزية',         price: 62,  oldPrice: 85,  category: 'Jewelry',    emoji: '📿', rating: 4.9, reviews: 201, badge: 'Sale' },
  { id: 4, nameEn: 'Olive Wood Bowl',    nameAr: 'وعاء خشب الزيتون',     price: 110, oldPrice: null, category: 'Woodcraft',  emoji: '🥣', rating: 4.7, reviews: 56,  badge: null },
  { id: 5, nameEn: 'Amber Glass Set',    nameAr: 'طقم زجاج كهرماني',     price: 78,  oldPrice: 98,  category: 'Glasswork',  emoji: '🍶', rating: 4.5, reviews: 143, badge: 'New' },
  { id: 6, nameEn: 'Hand-dyed Scarf',    nameAr: 'وشاح مصبوغ يدوياً',    price: 55,  oldPrice: null, category: 'Textiles',   emoji: '🧣', rating: 4.8, reviews: 77,  badge: null },
];
