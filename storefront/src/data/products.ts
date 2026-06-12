import type { Product } from '../types/product';

export const products: Product[] = [
  { id: 1, nameEn: 'Urban Oversized Tee',  nameAr: 'تي شيرت حضري واسع',   price: 45,  oldPrice: 60, category: 'Tees',        image: '/images/product-bookends.jpg', rating: 4.8, reviews: 124, badge: 'Bestseller' },
  { id: 2, nameEn: 'Graphic Hoodie',       nameAr: 'هودي برسومات',         price: 85,  oldPrice: null, category: 'Hoodies',   image: '/images/product-cushion.jpg', rating: 4.6, reviews: 89,  badge: 'New' },
  { id: 3, nameEn: 'Cargo Joggers',        nameAr: 'بنطلون كارغو',         price: 65,  oldPrice: 85,  category: 'Bottoms',     image: '/images/product-plates.jpg', rating: 4.9, reviews: 201, badge: 'Sale' },
  { id: 4, nameEn: 'Snapback Cap',         nameAr: 'قبعة سناب باك',        price: 35,  oldPrice: null, category: 'Accessories', image: '/images/product-candles.jpg', rating: 4.7, reviews: 56,  badge: null },
  { id: 5, nameEn: 'High-Top Sneakers',    nameAr: 'حذاء رياضي عالي',     price: 120, oldPrice: 150, category: 'Accessories', image: '/images/product-vase.jpg', rating: 4.5, reviews: 143, badge: 'New' },
  { id: 6, nameEn: 'Layered Scarf',        nameAr: 'وشاح متعدد الطبقات',    price: 30,  oldPrice: null, category: 'Accessories', image: '/images/product-throw.jpg', rating: 4.8, reviews: 77,  badge: null },
];
