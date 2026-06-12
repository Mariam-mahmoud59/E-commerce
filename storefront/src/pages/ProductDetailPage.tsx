import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RevealBox } from '../components/RevealBox/RevealBox';
import { useCart } from '../hooks/useCart';
import { products } from '../data/products';
import './ProductDetailPage.css';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();

  const product = products.find((p) => p.id === Number(id));
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  // Reset quantity when product changes
  useEffect(() => {
    setQty(1);
  }, [id]);

  if (!product) {
    return (
      <div className="pdp page-enter">
        <div className="pdp__inner">
          <div className="pdp__not-found">
            <h1 className="pdp__not-found-title">{t('product.notFound')}</h1>
            <p className="pdp__not-found-desc">{t('product.notFoundDesc')}</p>
            <button className="pdp__not-found-btn" onClick={() => navigate('/shop')}>
              {t('product.goToShop')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const name = i18n.language === 'ar' ? product.nameAr : product.nameEn;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setJustAdded(true);
  };

  // Mock secondary images based on category (for demo purposes)
  const galleryImages = [
    product.image,
    product.image.replace('.jpg', '-detail.jpg').replace('.png', '-detail.png'), // mock detail image
  ];

  return (
    <div className="pdp page-enter">
      <div className="pdp__inner">
        <button className="pdp__back" onClick={() => navigate('/shop')}>
          {t('product.back')}
        </button>

        <div className="pdp__grid">
          {/* Image */}
          <RevealBox>
            <div className="pdp__image-main">
              <img src={mainImage || product.image} alt={name} className="pdp__image-img" />
            </div>
            <div className="pdp__thumbs">
              {galleryImages.map((img, i) => (
                <div 
                  key={i} 
                  className={`pdp__thumb ${mainImage === img ? 'pdp__thumb--active' : ''}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${name} thumbnail`} onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              ))}
            </div>
          </RevealBox>

          {/* Info */}
          <RevealBox delay={0.1}>
            <div className="pdp__category">{product.category.toUpperCase()}</div>
            <h1 className="pdp__title">{name}</h1>

            <div className="pdp__rating">
              <span className="pdp__stars">{'★'.repeat(Math.round(product.rating))}</span>
              <span className="pdp__rating-text">
                {product.rating} · {product.reviews} {t('product.reviews')}
              </span>
              <span className="pdp__in-stock">{t('product.inStock')}</span>
            </div>

            <div className="pdp__price-row">
              <span className="pdp__price">${product.price}</span>
              {product.oldPrice && <span className="pdp__old-price">${product.oldPrice}</span>}
            </div>

            <p className="pdp__desc">
              Constructed from premium heavyweight fabrics for maximum durability and comfort.
              Featuring an oversized drop-shoulder fit, double-stitched seams, and our signature branding.
              Designed for the streets, built to last.
            </p>

            {/* Quantity */}
            <div className="pdp__qty-row">
              <span className="pdp__qty-label">{t('product.qty')}</span>
              <div className="pdp__qty-controls">
                <button className="pdp__qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="pdp__qty-value">{qty}</span>
                <button className="pdp__qty-btn" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              className={`pdp__add-btn ${justAdded ? 'pdp__add-btn--added' : ''}`}
              onClick={handleAddToCart}
            >
              {justAdded ? (
                <span className="pdp__add-btn-inner">
                  <span className="pdp__add-btn-check">✓</span> {t('product.added')}
                </span>
              ) : (
                t('product.addToCart')
              )}
            </button>

            <div className="pdp__delivery">{t('product.deliveryTime')}</div>
          </RevealBox>
        </div>
      </div>
    </div>
  );
}
