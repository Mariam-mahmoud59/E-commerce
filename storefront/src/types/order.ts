export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  customer: string;
  amount: string;
  status: OrderStatus;
}
