export type Category = 'Tees' | 'Hoodies' | 'Womens' | 'Accessories' | 'Bottoms';

export type BadgeType = 'Bestseller' | 'New' | 'Sale';

export interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  oldPrice: number | null;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  badge: BadgeType | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
