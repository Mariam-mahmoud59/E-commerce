import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Calendar, MapPin, Truck, CheckCircle, Clock, CreditCard } from 'lucide-react';
import './OrderDetailPage.css';

const MOCK_ORDERS: Record<string, any> = {
  "TT-8839": {
    id: "TT-8839",
    date: "Oct 24, 2026",
    status: "Shipped",
    statusIcon: Truck,
    statusColor: "text-accent",
    items: [
      { name: "Nebula Hoodie", price: "$89.00", qty: 1, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150&q=80" },
      { name: "Flux Tee", price: "$45.00", qty: 1, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80" }
    ],
    subtotal: "$134.00",
    shipping: "$0.00",
    total: "$134.00",
    tracking: "USPS 9400 1000 0000 0000",
    address: "123 Quantum Drive, Tech City, CA 94016",
    payment: "Visa ending in 4242"
  },
  "TT-8712": {
    id: "TT-8712",
    date: "Sep 12, 2026",
    status: "Delivered",
    statusIcon: CheckCircle,
    statusColor: "text-gray-400",
    items: [
      { name: "Cyber Cargo", price: "$120.00", qty: 1, image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=150&q=80" },
      { name: "Orbit Jacket", price: "$150.00", qty: 1, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=150&q=80" }
    ],
    subtotal: "$270.00",
    shipping: "$0.00",
    total: "$270.00",
    tracking: "Delivered on Sep 15",
    address: "123 Quantum Drive, Tech City, CA 94016",
    payment: "Mastercard ending in 8899"
  },
  "TT-8901": {
    id: "TT-8901",
    date: "Nov 02, 2026",
    status: "Processing",
    statusIcon: Clock,
    statusColor: "text-secondary",
    items: [
      { name: "Nebula Hoodie (Black)", price: "$89.00", qty: 1, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150&q=80" }
    ],
    subtotal: "$89.00",
    shipping: "$5.00",
    total: "$94.00",
    tracking: "Preparing for shipment",
    address: "123 Quantum Drive, Tech City, CA 94016",
    payment: "Apple Pay"
  }
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const order = id ? MOCK_ORDERS[id] : null;

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="order-not-found">
          <h2>Order Not Found</h2>
          <button className="order-back-btn" onClick={() => navigate('/profile')}>
            <ArrowLeft style={{ width: 16, height: 16, marginRight: 8 }} /> Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = order.statusIcon;

  return (
    <div className="order-detail-page">
      <div className="profile-bg-grid" />
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="profile-bg-glow"
      />

      <nav className="profile-nav">
        <div className="profile-nav-inner">
          <motion.button 
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="profile-back-btn"
          >
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </motion.button>
          <div className="profile-title">
            Order Details<span className="profile-title-dot">.</span>
          </div>
        </div>
      </nav>

      <main className="order-detail-main">
        <div className="order-detail-container">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-header-card"
          >
            <div className="order-header-top">
              <div>
                <h1 className="order-id">Order {order.id}</h1>
                <div className="order-date">
                  <Calendar style={{ width: 14, height: 14 }} /> {order.date}
                </div>
              </div>
              <div className="order-status-badge">
                <StatusIcon className={order.statusColor} style={{ width: 20, height: 20 }} />
                <span className={order.statusColor}>{order.status}</span>
              </div>
            </div>
          </motion.div>

          <div className="order-grid">
            {/* Left Column: Items */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="order-items-col"
            >
              <div className="order-card">
                <h3 className="order-card-title"><Package style={{ width: 18, height: 18 }} /> Items Ordered</h3>
                <div className="order-items-list">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="order-item-row">
                      <img src={item.image} alt={item.name} className="order-item-image" />
                      <div className="order-item-info">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-qty">Qty: {item.qty}</div>
                      </div>
                      <div className="order-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="order-card">
                <h3 className="order-card-title"><Truck style={{ width: 18, height: 18 }} /> Tracking Info</h3>
                <p className="order-tracking-text">{order.tracking}</p>
                <div className="order-timeline">
                  <div className="timeline-step completed">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-title">Order Placed</div>
                      <div className="timeline-date">{order.date}</div>
                    </div>
                  </div>
                  <div className={`timeline-step ${order.status !== 'Processing' ? 'completed' : 'active'}`}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-title">Processing</div>
                      <div className="timeline-date">We're preparing your order</div>
                    </div>
                  </div>
                  <div className={`timeline-step ${order.status === 'Delivered' ? 'completed' : order.status === 'Shipped' ? 'active' : ''}`}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-title">Shipped</div>
                      <div className="timeline-date">Handed over to carrier</div>
                    </div>
                  </div>
                  <div className={`timeline-step ${order.status === 'Delivered' ? 'completed' : ''} last`}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-title">Delivered</div>
                      <div className="timeline-date">Arrived at destination</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="order-summary-col"
            >
              <div className="order-card">
                <h3 className="order-card-title">Order Summary</h3>
                <div className="order-summary-row">
                  <span>Subtotal</span>
                  <span>{order.subtotal}</span>
                </div>
                <div className="order-summary-row">
                  <span>Shipping</span>
                  <span>{order.shipping}</span>
                </div>
                <div className="order-summary-row total">
                  <span>Total</span>
                  <span>{order.total}</span>
                </div>
              </div>

              <div className="order-card">
                <h3 className="order-card-title"><MapPin style={{ width: 18, height: 18 }} /> Shipping Address</h3>
                <p className="order-address-text">{order.address}</p>
              </div>

              <div className="order-card">
                <h3 className="order-card-title"><CreditCard style={{ width: 18, height: 18 }} /> Payment Method</h3>
                <p className="order-payment-text">{order.payment}</p>
              </div>

            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
