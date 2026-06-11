export type Category = 'Ceramics' | 'Textiles' | 'Jewelry' | 'Woodcraft' | 'Glasswork';

export type BadgeType = 'Bestseller' | 'New' | 'Sale';

export interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  oldPrice: number | null;
  category: Category;
  emoji: string;
  rating: number;
  reviews: number;
  badge: BadgeType | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
