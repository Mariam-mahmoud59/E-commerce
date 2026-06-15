import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import './CartDrawer.css';

export function CartDrawer() {
  const { t, i18n } = useTranslation();
  const { isCartOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="cart-backdrop"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="cart-drawer"
          >
            <div className="cart-header">
              <h2>{t('cart.title', 'Your Cart')}</h2>
              <button onClick={closeCart} className="cart-close-btn" aria-label="Close cart">
                <X />
              </button>
            </div>

            <div className="cart-content">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} className="cart-empty-icon" />
                  <p>{t('cart.empty', 'Your cart is empty.')}</p>
                  <button onClick={closeCart} className="cart-continue-btn">
                    {t('cart.continue', 'Continue Shopping')}
                  </button>
                </div>
              ) : (
                <div className="cart-items">
                  {items.map((item) => (
                    <div key={item.product.id} className="cart-item">
                      <img src={item.product.image} alt="Product" className="cart-item-image" />
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">
                          {i18n.language === 'ar' ? item.product.nameAr : item.product.nameEn}
                        </h3>
                        <p className="cart-item-price">${item.product.price}</p>
                        
                        <div className="cart-item-actions">
                          <div className="cart-qty-controls">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="cart-qty-btn"
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="cart-qty-btn"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="cart-remove-btn"
                          >
                            {t('cart.remove', 'Remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span>{t('cart.subtotal', 'Subtotal')}</span>
                  <span>${subtotal}</span>
                </div>
                <p className="cart-taxes">{t('cart.taxes', 'Taxes and shipping calculated at checkout')}</p>
                <button onClick={handleCheckout} className="cart-checkout-btn">
                  {t('cart.checkout', 'Proceed to Checkout')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
