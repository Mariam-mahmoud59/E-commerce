import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUp } from 'lucide-react';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { products } from '../data/products';
import './ShopPage.css';

const CATEGORIES = [
  { id: 'Tees', name: 'T-Shirts', key: 'nav.tees' },
  { id: 'Hoodies', name: 'Hoodies', key: 'nav.hoodies' },
  { id: 'Bottoms', name: 'Bottoms & Cargo', key: 'nav.bottoms' },
  { id: 'Accessories', name: 'Accessories', key: 'nav.accessories' }
];

export function ShopPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const groupedProducts = CATEGORIES.map(cat => {
    const items = products.filter(p => 
      p.category === cat.id && 
      (p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0); 

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const element = document.getElementById(`category-${catId}`);
    if (element) {
      // account for the fixed navs
      const y = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Small delay ensures DOM elements are rendered before scrolling
      setTimeout(() => {
        scrollToCategory(categoryParam);
      }, 100);
    }
  }, [searchParams]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="shop-page page-enter">
      {/* Background Elements */}
      <div className="shop-bg-grid" />
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="shop-bg-glow"
      />

      {/* Main Content */}
      <main className="shop-main">
        <div className="shop-container">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shop-header-wrap"
          >
            <h1 className="shop-page-title">{t('nav.shop', 'Shop')}</h1>
            
            <div className="shop-search-bar">
              <Search className="shop-search-icon" />
              <input 
                type="text" 
                placeholder={t('shop.searchPlaceholder', 'Search within categories...')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
            </div>
          </motion.div>

          {/* Sticky Category Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="shop-sticky-nav"
          >
            <div className="shop-category-tabs">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveCategory('all'); scrollToTop(); }}
                className={`shop-tab-btn ${activeCategory === 'all' ? 'shop-tab-btn--active' : ''}`}
              >
                {t('shop.allCategories', 'All Categories')}
              </motion.button>
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`shop-tab-btn ${activeCategory === cat.id ? 'shop-tab-btn--active' : ''}`}
                >
                  {t(cat.key, cat.name)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Category Sections */}
          <div className="shop-sections">
            <AnimatePresence mode="wait">
              {groupedProducts.length > 0 ? (
                groupedProducts.map((cat, index) => (
                  <motion.section
                    key={cat.id}
                    id={`category-${cat.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1 }}
                    className="shop-category-section"
                  >
                    {/* Category Header */}
                    <div className="shop-category-header">
                      <h2 className="shop-category-title">{t(cat.key, cat.name)}</h2>
                      <div className="shop-category-line" />
                      <span className="shop-category-count">{cat.items.length} {t('shop.items', 'Items')}</span>
                    </div>

                    {/* Category Items Grid */}
                    <div className="shop-grid">
                      {cat.items.map((product) => (
                        <ProductCard key={product.id} product={product} delay={0} />
                      ))}
                    </div>
                  </motion.section>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="shop-empty-state"
                >
                  <Search className="shop-empty-icon" />
                  <h3 className="shop-empty-title">{t('shop.noItemsFound', 'No items found')}</h3>
                  <p className="shop-empty-text">{t('shop.tryAdjusting', 'Try adjusting your search term.')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="shop-scroll-top"
      >
        <ArrowUp style={{ width: 20, height: 20 }} />
      </motion.button>
    </div>
  );
}
