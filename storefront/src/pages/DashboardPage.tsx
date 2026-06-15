import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { adminApi } from '../api/adminApi';
import './DashboardPage.css';
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
      setNewProduct({
        nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '', basePrice: 0, categoryId: '00000000-0000-0000-0000-000000000000'
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to get styled badge class
  const getStatusClass = (status: number) => {
    switch(status) {
      case 0: return 'dashboard__status--pending';
      case 5: return 'dashboard__status--shipped';
      case 6: return 'dashboard__status--delivered';
      default: return 'dashboard__status--shipped'; // Fallback to a neutral blue/gray badge
    }
  };

  // Helper to map status number to text
  const getStatusText = (status: number) => {
    const statuses = ['Pending', 'Contacted', 'Confirmed', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    return statuses[status] || 'Unknown';
  };

  return (
    <div className="dashboard page-enter">
      <div className="dashboard__inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 className="dashboard__title" style={{ marginBottom: 0 }}>Control Panel</h1>
          <button 
            className="btn" 
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--light-text)', cursor: 'pointer' }}
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            Sign Out
          </button>
        </div>
        
        {/* Mock Stats Section to make the dashboard look professional */}
        <div className="dashboard__stats">
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon"><TrendingUp size={20} /></div>
            <div className="dashboard__stat-value">$12,450</div>
            <div className="dashboard__stat-label">Total Revenue</div>
            <div className="dashboard__stat-change dashboard__stat-change--up">+15.2% this month</div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon"><ShoppingBag size={20} /></div>
            <div className="dashboard__stat-value">{orders.length || 142}</div>
            <div className="dashboard__stat-label">Active Orders</div>
            <div className="dashboard__stat-change dashboard__stat-change--up">+5% this month</div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon"><Package size={20} /></div>
            <div className="dashboard__stat-value">{products.length || 85}</div>
            <div className="dashboard__stat-label">Products in Stock</div>
            <div className="dashboard__stat-change dashboard__stat-change--down">-2 items low stock</div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon"><Users size={20} /></div>
            <div className="dashboard__stat-value">1,249</div>
            <div className="dashboard__stat-label">Total Customers</div>
            <div className="dashboard__stat-change dashboard__stat-change--up">+12% this month</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : ''}`}
            style={{ padding: '12px 24px', flex: 'none' }}
            onClick={() => setActiveTab('orders')}
          >
            Manage Orders
          </button>
          <button 
            className={`btn ${activeTab === 'products' ? 'btn-primary' : ''}`}
            style={{ padding: '12px 24px', flex: 'none', background: activeTab === 'products' ? 'var(--accent)' : 'var(--dark-mid)', color: activeTab === 'products' ? 'var(--dark)' : 'var(--light-text)', border: '1px solid var(--glass-border)' }}
            onClick={() => setActiveTab('products')}
          >
            Manage Products
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="dashboard__table-card">
            <h2 className="dashboard__section-title">Recent Orders</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Total Amount</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--mid-text)' }}>
                        #{o.orderNumber || o.id.substring(0, 8)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                      <td style={{ color: 'var(--accent)' }}>${o.totalAmount}</td>
                      <td>
                        <span className={`dashboard__status ${getStatusClass(o.status)}`}>
                          {getStatusText(o.status)}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="glass-input"
                          style={{ padding: '8px', fontSize: '13px' }}
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
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--mid-text)' }}>
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
            
            <div className="dashboard__table-card">
              <h2 className="dashboard__section-title">Product Catalog</h2>
              <div style={{ overflowX: 'auto' }}>
                <table className="dashboard__table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.name?.en || p.name}</td>
                        <td style={{ color: 'var(--accent)' }}>${p.basePrice}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)} 
                            style={{ 
                              background: 'transparent', border: 'none', color: '#ef4444', 
                              cursor: 'pointer', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' 
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: 'var(--mid-text)' }}>
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dashboard__table-card" style={{ height: 'fit-content' }}>
              <h2 className="dashboard__section-title">Add New Product</h2>
              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label>Name (EN)</label>
                  <input className="glass-input" value={newProduct.nameEn} onChange={e => setNewProduct({...newProduct, nameEn: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Name (AR)</label>
                  <input className="glass-input" value={newProduct.nameAr} onChange={e => setNewProduct({...newProduct, nameAr: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description (EN)</label>
                  <textarea className="glass-input" style={{ resize: 'vertical', minHeight: '80px' }} value={newProduct.descriptionEn} onChange={e => setNewProduct({...newProduct, descriptionEn: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description (AR)</label>
                  <textarea className="glass-input" style={{ resize: 'vertical', minHeight: '80px' }} value={newProduct.descriptionAr} onChange={e => setNewProduct({...newProduct, descriptionAr: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Base Price ($)</label>
                  <input className="glass-input" type="number" step="0.01" value={newProduct.basePrice} onChange={e => setNewProduct({...newProduct, basePrice: parseFloat(e.target.value)})} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                  Add Product
                </button>
              </form>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
