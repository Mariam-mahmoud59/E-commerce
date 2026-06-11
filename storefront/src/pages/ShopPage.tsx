import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RevealBox } from '../components/RevealBox/RevealBox';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { products } from '../data/products';
import type { Category } from '../types/product';
import './ShopPage.css';

const CATEGORIES: Array<Category | 'All'> = ['All', 'Ceramics', 'Textiles', 'Jewelry', 'Woodcraft', 'Glasswork'];

export function ShopPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Category | 'All'>('All');

  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter);

  return (
    <div className="shop page-enter">
      <div className="shop__inner">
        <RevealBox>
          <h1 className="shop__title">{t('nav.shop')}</h1>
          <p className="shop__subtitle">{t('hero.subtitle')}</p>
        </RevealBox>

        {/* Category filter */}
        <div className="shop__filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`shop__filter-btn ${filter === c ? 'shop__filter-btn--active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="shop__grid">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </div>
  );
}
