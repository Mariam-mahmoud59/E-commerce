import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Star, Ruler, AlertCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { products } from '../data/products';
import './ProductDetailPage.css';

const defaultDetails = {
  colors: [
    { name: 'Void Black', hex: '#111111' },
    { name: 'Hyper Green', hex: '#ccff00' },
    { name: 'Cyber Violet', hex: '#8b5cf6' }
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  description: "Engineered for the urban grid. This piece features a heavyweight, premium blend fabric with oversized drop shoulders for that authentic streetwear silhouette. 3D-mapped seams ensure mobility while maintaining a rigid, structured look.",
  sizeRef: "Model is 6'1\" (185cm) wearing size Large for an oversized fit.",
  stock: 15
};

const MOCK_REVIEWS = [
  { id: 1, user: 'Alex D.', rating: 5, date: '2 weeks ago', comment: "Absolutely love the fit and the material. Super high quality for the price! Will buy again." },
  { id: 2, user: 'Sarah M.', rating: 4, date: '1 month ago', comment: "Great product, but runs slightly larger than expected. Definitely go true to size if you don't want it super baggy." },
  { id: 3, user: 'Jordan K.', rating: 5, date: '2 months ago', comment: "The 3D-mapped seams actually make a difference. Unbelievable comfort." }
];

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();

  const productBase = products.find((p) => p.id === Number(id));
  const product = productBase ? { ...productBase, ...defaultDetails } : null;

  const [selectedColor, setSelectedColor] = useState(defaultDetails.colors[0]);
  const [selectedSize, setSelectedSize] = useState(defaultDetails.sizes[2]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  if (!product) {
    return (
      <div className="pdp-page page-enter">
        <div className="pdp-not-found">
          <h1 className="pdp-not-found-title">{t('product.notFound')}</h1>
          <button className="pdp-not-found-btn" onClick={() => navigate('/shop')}>
            {t('product.goToShop')}
          </button>
        </div>
      </div>
    );
  }

  const name = i18n.language === 'ar' ? product.nameAr : product.nameEn;
  const isOutOfStock = product.stock === 0;

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) addItem(product);
    setJustAdded(true);
  };

  let relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);
  if (relatedProducts.length === 0) {
    // Fallback: show other random/popular products if none in the same category
    relatedProducts = products.filter(p => p.id !== product.id);
  }
  relatedProducts = relatedProducts.slice(0, 4);

  const galleryImages = [
    product.image,
    product.image.replace('.jpg', '-detail.jpg').replace('.png', '-detail.png')
  ];

  return (
    <div className="pdp-page page-enter">
      {/* Background Elements */}
      <div className="pdp-bg-grid" />
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
        className="pdp-bg-glow" 
      />

      <main className="pdp-main">
        {/* Breadcrumbs / Back button */}
        <div className="pdp-breadcrumbs">
          <motion.button 
            whileHover={{ x: -5 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => navigate('/shop')} 
            className="pdp-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="pdp-breadcrumb-text">
            {t('nav.shop')} <span className="pdp-breadcrumb-sep">/</span> {product.category.toUpperCase()} <span className="pdp-breadcrumb-sep">/</span> <span className="pdp-breadcrumb-current">{name}</span>
          </div>
        </div>

        {/* Product Hero Section */}
        <div className="pdp-grid-wrap">
          
          {/* Left: Imagery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="pdp-gallery">
            <div className="pdp-image-main-wrap">
              <img src={mainImage || product.image} alt={name} className="pdp-image-main-img" />
              {product.badge && (
                <div className="pdp-badge-wrap">
                  <span className={`pdp-badge pdp-badge--${product.badge.toLowerCase()}`}>
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="pdp-thumbnails">
              {galleryImages.map((img, i) => (
                <div 
                  key={i} 
                  className={`pdp-thumbnail ${mainImage === img ? 'pdp-thumbnail--active' : ''}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt="thumbnail" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="pdp-details">
            <div className="pdp-rating-row">
              <div className="pdp-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-600'}`} />)}
              </div>
              <span className="pdp-review-count">{product.rating} ({product.reviews} {t('product.reviews')})</span>
            </div>

            <h1 className="pdp-title">{name}</h1>
            
            {/* Pricing block */}
            <div className="pdp-price-block">
              <span className="pdp-price">${product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="pdp-old-price">${product.oldPrice}</span>
                  <span className="pdp-discount-badge">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="pdp-desc">
              {product.description}
            </p>

            {/* Colors */}
            <div className="pdp-section">
              <div className="pdp-section-header">
                <h3>{t('product.color', 'Color')}: <span>{selectedColor.name}</span></h3>
              </div>
              <div className="pdp-colors">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`pdp-color-btn ${selectedColor.name === color.name ? 'pdp-color-btn--active' : ''}`}
                  >
                    <div className="pdp-color-swatch" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="pdp-section">
              <div className="pdp-section-header">
                <h3>{t('product.size', 'Size')}</h3>
                <button className="pdp-size-guide-btn">Size Guide</button>
              </div>
              <div className="pdp-sizes">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`pdp-size-btn ${selectedSize === size ? 'pdp-size-btn--active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              {/* Size Reference Box */}
              <div className="pdp-size-ref">
                <Ruler className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p>{product.sizeRef}</p>
              </div>
            </div>

            {/* Stock Indicator */}
            <div className="pdp-stock-status">
              {isOutOfStock ? (
                <><div className="pdp-dot pdp-dot--red animate-pulse" /><span className="text-red">Out of Stock</span></>
              ) : product.stock <= 5 ? (
                <><AlertCircle className="w-4 h-4 text-orange" /><span className="text-orange">Low Stock - Only {product.stock} left</span></>
              ) : (
                <><div className="pdp-dot pdp-dot--green" /><span className="text-green">In Stock</span></>
              )}
            </div>

            {/* Add to Cart CTA */}
            <div className="pdp-actions">
              <div className="pdp-qty-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="pdp-qty-btn">-</button>
                <span className="pdp-qty-val">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="pdp-qty-btn">+</button>
              </div>
              
              <motion.button 
                whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`pdp-add-btn ${isOutOfStock ? 'pdp-add-btn--disabled' : ''} ${justAdded ? 'pdp-add-btn--added' : ''}`}
              >
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock ? 'Sold Out' : (justAdded ? t('product.added', 'Added') : t('product.addToCart', 'Add to Bag'))}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* --- REVIEWS SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }} 
          className="pdp-reviews-section"
        >
          <div className="pdp-reviews-header">
            <h2>{t('product.customerReviews', 'Customer Reviews')}</h2>
            <div className="pdp-reviews-summary">
              <div className="pdp-stars">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-600'}`} />)}
              </div>
              <span className="pdp-reviews-score">{product.rating} / 5</span>
              <span className="pdp-reviews-total">({product.reviews} {t('product.reviews')})</span>
            </div>
          </div>
          
          <div className="pdp-reviews-list">
            {MOCK_REVIEWS.map(review => (
              <div key={review.id} className="pdp-review-card">
                <div className="pdp-review-top">
                  <div className="pdp-review-user">
                    <div className="pdp-review-avatar">{review.user.charAt(0)}</div>
                    <div>
                      <h4 className="pdp-review-name">{review.user}</h4>
                      <span className="pdp-review-date">{review.date}</span>
                    </div>
                  </div>
                  <div className="pdp-stars">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />)}
                  </div>
                </div>
                <p className="pdp-review-text">{review.comment}</p>
              </div>
            ))}
          </div>
          <button className="pdp-reviews-more-btn">
            {t('product.loadMoreReviews', 'Load More Reviews')}
          </button>
        </motion.div>

        {/* --- SUGGESTIONS SECTION --- */}
        {relatedProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="pdp-related">
            <div className="pdp-related-header">
              <h2>Complete The Look</h2>
              <button onClick={() => navigate('/shop')} className="pdp-related-view-all">View All {product.category.toUpperCase()}</button>
            </div>
            
            <div className="pdp-related-grid">
              {relatedProducts.map((relProduct) => (
                <motion.div
                  key={relProduct.id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/product/${relProduct.id}`)}
                  className="pdp-related-card group"
                >
                  <div className="pdp-related-img-wrap">
                    <img src={relProduct.image} alt={relProduct.nameEn} className="pdp-related-img" />
                    {relProduct.badge && (
                      <div className="pdp-badge-wrap">
                        <span className={`pdp-badge pdp-badge--${relProduct.badge.toLowerCase()}`}>
                          {relProduct.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pdp-related-info">
                    <h3 className="pdp-related-name">{i18n.language === 'ar' ? relProduct.nameAr : relProduct.nameEn}</h3>
                    <div className="pdp-related-price-row">
                      <p className="pdp-related-price">${relProduct.price}</p>
                      {relProduct.oldPrice && <p className="pdp-related-old-price">${relProduct.oldPrice}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
