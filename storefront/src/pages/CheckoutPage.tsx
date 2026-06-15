import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { ChevronRight, ArrowLeft, ShieldCheck, CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css?v=2'; // Force HMR reload

const FORM_FIELDS = [
  { key: 'firstName', i18nKey: 'checkout.firstName', type: 'text', icon: null },
  { key: 'lastName', i18nKey: 'checkout.lastName', type: 'text', icon: null },
  { key: 'email', i18nKey: 'checkout.email', type: 'email', icon: null },
  { key: 'address', i18nKey: 'checkout.address', type: 'text', icon: <MapPin size={18}/> },
  { key: 'city', i18nKey: 'checkout.city', type: 'text', icon: null },
] as const;

type FormKey = (typeof FORM_FIELDS)[number]['key'];
type FormData = Record<FormKey, string>;

const INITIAL_FORM: FormData = {
  firstName: '', lastName: '', email: '', address: '', city: '',
};

export function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [focused, setFocused] = useState<FormKey | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'cash'>('card');

  const shipping = subtotal > 0 ? 12 : 0;
  const total = subtotal + shipping;

  const handleOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      clearCart();
    }, 2200);
  };

  const nextStep = () => {
    if (step < 3) setStep(s => s + 1);
    else handleOrder();
  };

  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const stepFields = {
    1: ['email', 'firstName', 'lastName'],
    2: ['address', 'city'],
    3: [] // Payment is handled separately
  };

  const currentFields = FORM_FIELDS.filter(f => stepFields[step as keyof typeof stepFields].includes(f.key));

  if (items.length === 0 && !done) {
    return (
      <div className="checkout-empty">
        <div className="checkout-bg-grid" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="checkout-empty-content">
          <h2>{t('cart.empty', 'Your cart is empty')}</h2>
          <button onClick={() => navigate('/shop')} className="checkout-return-btn">
            {t('cart.continue', 'Continue Shopping')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="checkout-page page-enter">
      <div className="checkout-bg-grid" />
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="checkout-bg-glow"
      />

      <div className="checkout-container">
        
        {/* LEFT COLUMN: FORM */}
        <div className="checkout-left">
          <button onClick={() => navigate('/shop')} className="checkout-back-link">
            <ArrowLeft size={16} /> {t('cart.continue', 'Return to shop')}
          </button>
          
          <h1 className="checkout-title">
            {done ? t('checkout.orderPlaced', 'Order Complete') : t('checkout.title', 'Checkout')}
          </h1>

          {done ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="checkout-success"
            >
              <CheckCircle size={64} className="checkout-success-icon" />
              <h2>{t('checkout.orderSuccess', 'Thank you for your order!')}</h2>
              <p>We've received your order and will email you the receipt and tracking info shortly.</p>
              <button onClick={() => navigate('/')} className="checkout-primary-btn mt-6">
                Back to Home
              </button>
            </motion.div>
          ) : (
            <div className="checkout-form-container">
              {/* Stepper */}
              <div className="checkout-stepper">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`checkout-step ${step === i ? 'active' : step > i ? 'completed' : ''}`}>
                    <div className="checkout-step-number">{i}</div>
                    <span className="checkout-step-label">
                      {i === 1 ? 'Details' : i === 2 ? 'Shipping' : 'Payment'}
                    </span>
                    {i < 3 && <div className="checkout-step-line" />}
                  </div>
                ))}
              </div>

              {/* Form Fields */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="checkout-fields"
                >
                  {step === 3 ? (
                    <div className="checkout-payment-options">
                      {['card', 'wallet', 'cash'].map((method) => (
                        <div 
                          key={method} 
                          className={`checkout-payment-option ${paymentMethod === method ? 'selected' : ''}`}
                          onClick={() => setPaymentMethod(method as any)}
                        >
                          <div className="checkout-payment-radio">
                            {paymentMethod === method && <div className="checkout-payment-radio-inner" />}
                          </div>
                          <span className="checkout-payment-label">
                            {t(`checkout.payment.${method}`, method.charAt(0).toUpperCase() + method.slice(1))}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    currentFields.map(({ key, i18nKey, type, icon }) => {
                      const hasValue = form[key].length > 0;
                      const isFocused = focused === key;

                      return (
                        <div key={key} className={`checkout-input-group ${isFocused ? 'focused' : ''}`}>
                          <label className={`checkout-label ${hasValue || isFocused ? 'float' : ''}`}>
                            {t(i18nKey)}
                          </label>
                          <div className="checkout-input-wrapper">
                            {icon && <span className="checkout-input-icon">{icon}</span>}
                            <input
                              type={type}
                              className={`checkout-input ${icon ? 'with-icon' : ''}`}
                              value={form[key]}
                              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                              onFocus={() => setFocused(key)}
                              onBlur={() => setFocused(null)}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Form Controls */}
              <div className="checkout-controls">
                {step > 1 ? (
                  <button onClick={prevStep} className="checkout-secondary-btn">
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div />}
                
                <button onClick={nextStep} className="checkout-primary-btn" disabled={loading}>
                  {loading ? (
                    <span className="checkout-spinner" />
                  ) : step < 3 ? (
                    <>Continue <ChevronRight size={16} /></>
                  ) : (
                    <>Pay ${total} <ShieldCheck size={16} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        {!done && (
          <div className="checkout-right">
            <div className="checkout-summary sticky">
              <h2>{t('checkout.orderSummary', 'Order Summary')}</h2>
              
              <div className="checkout-summary-items">
                {items.map(item => (
                  <div key={item.product.id} className="checkout-summary-item">
                    <div className="checkout-item-img-wrapper">
                      <img src={item.product.image} alt="product" />
                      <span className="checkout-item-badge">{item.quantity}</span>
                    </div>
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">
                        {i18n.language === 'ar' ? item.product.nameAr : item.product.nameEn}
                      </span>
                    </div>
                    <div className="checkout-item-price">
                      ${item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-totals">
                <div className="checkout-total-row">
                  <span>{t('checkout.subtotal', 'Subtotal')}</span>
                  <span>${subtotal}</span>
                </div>
                <div className="checkout-total-row">
                  <span>{t('checkout.shipping', 'Shipping')}</span>
                  <span>{shipping > 0 ? `$${shipping}` : 'Free'}</span>
                </div>
                
                <div className="checkout-divider" />
                
                <div className="checkout-grand-total">
                  <span>{t('checkout.total', 'Total')}</span>
                  <span className="checkout-accent">${total}</span>
                </div>
              </div>

              <div className="checkout-secure-badge">
                <ShieldCheck size={18} />
                <span>{t('checkout.secure', 'Secure encrypted checkout')}</span>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
