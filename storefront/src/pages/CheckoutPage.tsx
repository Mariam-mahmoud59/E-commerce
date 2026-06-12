import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';
import './CheckoutPage.css';

const FORM_FIELDS = [
  { key: 'firstName', i18nKey: 'checkout.firstName' },
  { key: 'lastName', i18nKey: 'checkout.lastName' },
  { key: 'email', i18nKey: 'checkout.email' },
  { key: 'address', i18nKey: 'checkout.address' },
  { key: 'city', i18nKey: 'checkout.city' },
  { key: 'card', i18nKey: 'checkout.payment' },
] as const;

type FormKey = (typeof FORM_FIELDS)[number]['key'];
type FormData = Record<FormKey, string>;

const INITIAL_FORM: FormData = {
  firstName: '', lastName: '', email: '', address: '', city: '', card: '',
};

export function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [focused, setFocused] = useState<FormKey | null>(null);

  const shipping = subtotal > 0 ? 12 : 0;
  const steps = [t('checkout.step1'), t('checkout.step2'), t('checkout.step3')];

  const handleOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 2200);
  };

  return (
    <div className="checkout page-enter">
      <div className="checkout__inner">
        <h1 className="checkout__title">
          {done ? t('checkout.orderPlaced') : t('checkout.title')}
        </h1>

        {done ? (
          <div className="checkout__success">
            <div className="checkout__success-emoji">✅</div>
            <h2 className="checkout__success-title">{t('checkout.orderPlaced')}</h2>
            <p className="checkout__success-desc">{t('checkout.orderSuccess')}</p>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="checkout__progress">
              <div className="checkout__steps">
                {steps.map((s, i) => (
                  <span
                    key={i}
                    className={`checkout__step-label ${i + 1 <= step ? 'checkout__step-label--active' : ''}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="checkout__bar-track">
                <div
                  className="checkout__bar-fill"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="checkout__grid">
              {/* Form */}
              <div>
                {FORM_FIELDS.map(({ key, i18nKey }) => {
                  const hasValue = form[key].length > 0;
                  const isFocused = focused === key;

                  return (
                    <div key={key} className="checkout__field">
                      <label
                        className={`checkout__label ${hasValue || isFocused ? 'checkout__label--float' : ''} ${isFocused ? 'checkout__label--focused' : ''}`}
                      >
                        {t(i18nKey)}
                      </label>
                      <input
                        className="checkout__input"
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        onFocus={() => setFocused(key)}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  );
                })}

                <div className="checkout__buttons">
                  {step > 1 && (
                    <button className="checkout__back-btn" onClick={() => setStep((s) => s - 1)}>
                      ←
                    </button>
                  )}
                  <button
                    className="checkout__next-btn"
                    onClick={step < 3 ? () => setStep((s) => s + 1) : handleOrder}
                  >
                    {loading ? (
                      <span className="checkout__spinner" />
                    ) : step < 3 ? (
                      `${t('continue')} →`
                    ) : (
                      t('checkout.placeOrder')
                    )}
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div>
                <div className="checkout__summary">
                  <h3 className="checkout__summary-title">{t('checkout.orderSummary')}</h3>

                  {items.length === 0 ? (
                    <p className="checkout__summary-empty">{t('checkout.cartEmpty')}</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.product.id} className="checkout__item">
                        <div className="checkout__item-left">
                          <img src={item.product.image} alt="product" className="checkout__item-img" />
                          <span className="checkout__item-name">
                            {i18n.language === 'ar' ? item.product.nameAr : item.product.nameEn}
                          </span>

                          {/* Quantity controls */}
                          <div className="checkout__item-qty-controls">
                            <button
                              className="checkout__item-qty-btn"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="checkout__item-qty-value">{item.quantity}</span>
                            <button
                              className="checkout__item-qty-btn"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="checkout__item-right">
                          <span className="checkout__item-price">
                            ${item.product.price * item.quantity}
                          </span>
                          <button
                            className="checkout__item-remove"
                            onClick={() => removeItem(item.product.id)}
                            title={t('cart.remove')}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  <hr className="checkout__divider" />

                  <div className="checkout__total-row">
                    <span className="checkout__total-label">{t('checkout.subtotal')}</span>
                    <span className="checkout__total-value">${subtotal}</span>
                  </div>
                  <div className="checkout__total-row">
                    <span className="checkout__total-label">{t('checkout.shipping')}</span>
                    <span className="checkout__total-value">
                      {shipping > 0 ? `$${shipping}` : '—'}
                    </span>
                  </div>

                  <div className="checkout__grand-total">
                    <span className="checkout__grand-label">{t('checkout.total')}</span>
                    <span className="checkout__grand-value">${subtotal + shipping}</span>
                  </div>

                  <div className="checkout__secure">🔒 {t('checkout.secure')}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
