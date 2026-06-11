import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../types/product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  delay?: number;
}

export function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [ref, visible] = useScrollReveal();

  const [justAdded, setJustAdded] = useState(false);

  const name = i18n.language === 'ar' ? product.nameAr : product.nameEn;
  const badgeClass = product.badge ? `product-card__badge--${product.badge.toLowerCase()}` : '';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
  };

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  return (
    <div
      ref={ref}
      className="reveal-box"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}s`,
      }}
    >
      <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
        {/* Image zone */}
        <div className="product-card__image">
          <span className="product-card__emoji">{product.emoji}</span>

          {product.badge && (
            <span className={`product-card__badge ${badgeClass}`}>
              {product.badge}
            </span>
          )}

          <div className="product-card__overlay">
            <button
              className="product-card__overlay-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
            >
              {t('product.quickView')}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="product-card__info">
          <div className="product-card__category">{product.category.toUpperCase()}</div>
          <div className="product-card__name">{name}</div>

          <div className="product-card__rating">
            <span className="product-card__stars">
              {'★'.repeat(Math.round(product.rating))}
            </span>
            <span className="product-card__review-count">({product.reviews})</span>
          </div>

          <div className="product-card__price-row">
            <div className="product-card__prices">
              <span className="product-card__price">${product.price}</span>
              {product.oldPrice && (
                <span className="product-card__old-price">${product.oldPrice}</span>
              )}
            </div>

            <button
              className={`product-card__cart-btn ${justAdded ? 'product-card__cart-btn--added' : ''}`}
              onClick={handleAdd}
            >
              {justAdded ? '✓' : '+'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
