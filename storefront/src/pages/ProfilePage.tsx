import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Package, Calendar, DollarSign, MapPin, ChevronRight, Clock, CheckCircle, Truck, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import './ProfilePage.css';

const mockUser = {
  name: "Alex Designer",
  email: "alex@thetateach.local",
  memberSince: "2024",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  stats: {
    orders: 12,
    spent: "$1,240",
    points: 450
  }
};

const mockOrders = [
  {
    id: "TT-8839",
    date: "Oct 24, 2026",
    status: "Shipped",
    statusIcon: Truck,
    statusColor: "text-accent", // mapped to #ccff00 in CSS
    items: ["Nebula Hoodie", "Flux Tee"],
    total: "$134.00",
    tracking: "USPS 9400 1000 0000 0000"
  },
  {
    id: "TT-8712",
    date: "Sep 12, 2026",
    status: "Delivered",
    statusIcon: CheckCircle,
    statusColor: "text-gray-400",
    items: ["Cyber Cargo", "Orbit Jacket"],
    total: "$270.00",
    tracking: "Delivered on Sep 15"
  },
  {
    id: "TT-8901",
    date: "Nov 02, 2026",
    status: "Processing",
    statusIcon: Clock,
    statusColor: "text-secondary", // mapped to #8b5cf6 in CSS
    items: ["Nebula Hoodie (Black)"],
    total: "$89.00",
    tracking: "Preparing for shipment"
  }
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [filter, setFilter] = useState('All');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      
      {/* Background Elements (Consistent with Home) */}
      <div className="profile-bg-grid" />
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="profile-bg-glow"
      />
            
      {/* Top Navigation */}
      <nav className="profile-nav">
        <div className="profile-nav-inner">
          <motion.button 
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="profile-back-btn"
          >
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </motion.button>
          <div className="profile-title">
            Account<span className="profile-title-dot">.</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-grid">
          
          {/* Left Column: User Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="profile-left-col"
          >
            <div className="profile-card">
              <div className="profile-user-center">
                <div className="profile-avatar-container">
                  <div className="profile-avatar-glow" />
                  <img 
                    src={mockUser.avatar} 
                    alt="Profile" 
                    className="profile-avatar"
                  />
                </div>
                <h2 className="profile-name">{mockUser.name}</h2>
                <p className="profile-email">{mockUser.email}</p>
                <span className="profile-badge">
                  3D Pioneer Member
                </span>
              </div>

              <div className="profile-stats-grid">
                <div className="profile-stat-box">
                  <Package className="profile-stat-icon" />
                  <div className="profile-stat-val">{mockUser.stats.orders}</div>
                  <div className="profile-stat-label">Orders</div>
                </div>
                <div className="profile-stat-box">
                  <DollarSign className="profile-stat-icon" />
                  <div className="profile-stat-val">{mockUser.stats.spent}</div>
                  <div className="profile-stat-label">Spent</div>
                </div>
                <div className="profile-stat-box">
                  <User className="profile-stat-icon" />
                  <div className="profile-stat-val">{mockUser.stats.points}</div>
                  <div className="profile-stat-label">Points</div>
                </div>
              </div>

              <button className="profile-edit-btn">
                <User style={{ width: 16, height: 16 }} /> Edit Profile
              </button>
              
              <button 
                className="profile-edit-btn profile-logout-btn" 
                style={{ marginTop: '12px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                onClick={handleLogout}
              >
                <LogOut style={{ width: 16, height: 16 }} /> Logout
              </button>
            </div>
          </motion.div>

          {/* Right Column: Orders */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="profile-orders-header">
              <h3 className="profile-orders-title">
                <Package style={{ width: 24, height: 24, color: '#ccff00' }} /> Order History
              </h3>
              <div className="profile-orders-filters">
                {['All', 'Processing', 'Shipped', 'Delivered'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`profile-filter-btn ${filter === f ? 'profile-filter-btn--active' : 'profile-filter-btn--inactive'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="profile-orders-list">
              {mockOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  whileHover={{ y: -2, borderColor: 'rgba(204, 255, 0, 0.3)' }}
                  className="profile-order-card"
                >
                  <div className="profile-order-top">
                    <div className="profile-order-info-left">
                      <div className="profile-order-icon-box">
                        <order.statusIcon className={order.statusColor} style={{ width: 24, height: 24 }} />
                      </div>
                      <div>
                        <div className="profile-order-id">Order {order.id}</div>
                        <div className="profile-order-date">
                          <Calendar style={{ width: 12, height: 12 }} /> {order.date}
                        </div>
                      </div>
                    </div>
                    <div className="profile-order-info-right">
                      <div className={`profile-order-status ${order.statusColor}`}>
                        {order.status}
                      </div>
                      <div className="profile-order-total">{order.total}</div>
                    </div>
                  </div>

                  <div className="profile-order-bottom">
                    <div>
                      <div className="profile-order-items-label">Items</div>
                      <div className="profile-order-items">{order.items.join(", ")}</div>
                      <div className="profile-order-tracking">
                        <MapPin style={{ width: 12, height: 12 }} /> {order.tracking}
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="profile-order-view-btn"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View Details <ChevronRight style={{ width: 16, height: 16 }} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State / Bottom CTA */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="profile-empty-state"
            >
              <p className="profile-empty-text">Looking for your next dimensional drop?</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="profile-browse-btn"
              >
                Browse New Arrivals
              </motion.button>
            </motion.div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
