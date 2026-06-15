const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5191/api';

export const adminApi = {
  getOrders: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/adminorders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },
  
  updateOrderStatus: async (token: string, orderId: string, status: number) => {
    const res = await fetch(`${API_BASE_URL}/adminorders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },
  
  createProduct: async (token: string, product: any) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },
  
  deleteProduct: async (token: string, productId: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  }
};
