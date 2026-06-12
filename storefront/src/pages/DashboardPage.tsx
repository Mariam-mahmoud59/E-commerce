import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/AuthContext';
import { adminApi } from '../api/adminApi';
import './DashboardPage.css';

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [newProduct, setNewProduct] = useState({
    nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '', basePrice: 0, categoryId: '00000000-0000-0000-0000-000000000000'
  });

  const loadData = async () => {
    if (!user?.token) return;
    try {
      if (activeTab === 'orders') {
        const data = await adminApi.getOrders(user.token);
        setOrders(data);
      } else {
        const res = await fetch('http://localhost:5191/api/products');
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, user]);

  const handleUpdateOrderStatus = async (orderId: string, status: number) => {
    if (!user?.token) return;
    try {
      await adminApi.updateOrderStatus(user.token, orderId, status);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user?.token) return;
    try {
      await adminApi.deleteProduct(user.token, id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    try {
      await adminApi.createProduct(user.token, newProduct);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard page-enter">
      <div className="dashboard__inner">
        <h1 className="dashboard__title">Admin Dashboard</h1>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            style={{ padding: '0.5rem 1rem', background: activeTab === 'orders' ? '#333' : '#eee', color: activeTab === 'orders' ? '#fff' : '#333' }}
            onClick={() => setActiveTab('orders')}
          >
            Manage Orders
          </button>
          <button 
            style={{ padding: '0.5rem 1rem', background: activeTab === 'products' ? '#333' : '#eee', color: activeTab === 'products' ? '#fff' : '#333' }}
            onClick={() => setActiveTab('products')}
          >
            Manage Products
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="dashboard__table-card">
            <h2 className="dashboard__section-title">Orders</h2>
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.orderNumber || o.id.substring(0, 8)}</td>
                    <td>{o.customerName}</td>
                    <td>{o.totalAmount}</td>
                    <td>{o.status}</td>
                    <td>
                      <select 
                        value={o.status} 
                        onChange={(e) => handleUpdateOrderStatus(o.id, parseInt(e.target.value))}
                      >
                        <option value="0">Pending</option>
                        <option value="1">Contacted</option>
                        <option value="2">Confirmed</option>
                        <option value="3">Paid</option>
                        <option value="4">Processing</option>
                        <option value="5">Shipped</option>
                        <option value="6">Delivered</option>
                        <option value="7">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="dashboard__table-card">
              <h2 className="dashboard__section-title">Products</h2>
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name.en}</td>
                      <td>{p.basePrice}</td>
                      <td>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ color: 'red' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dashboard__table-card">
              <h2 className="dashboard__section-title">Add New Product</h2>
              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                <input placeholder="Name EN" value={newProduct.nameEn} onChange={e => setNewProduct({...newProduct, nameEn: e.target.value})} required />
                <input placeholder="Name AR" value={newProduct.nameAr} onChange={e => setNewProduct({...newProduct, nameAr: e.target.value})} required />
                <input placeholder="Desc EN" value={newProduct.descriptionEn} onChange={e => setNewProduct({...newProduct, descriptionEn: e.target.value})} required />
                <input placeholder="Desc AR" value={newProduct.descriptionAr} onChange={e => setNewProduct({...newProduct, descriptionAr: e.target.value})} required />
                <input type="number" placeholder="Price" value={newProduct.basePrice} onChange={e => setNewProduct({...newProduct, basePrice: parseFloat(e.target.value)})} required />
                <button type="submit" style={{ padding: '0.5rem', background: '#333', color: '#fff' }}>Add Product</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
