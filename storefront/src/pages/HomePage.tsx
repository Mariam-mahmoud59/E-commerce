import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RevealBox } from '../components/RevealBox/RevealBox';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { Footer } from '../components/Footer/Footer';
import { products } from '../data/products';
import './HomePage.css';

const HERO_EMOJIS = ['🏺', '🧵', '📿'];

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setHeroIdx((i) => (i + 1) % 3), 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="page-enter">
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className={`hero hero--theme-${heroIdx}`}>
        {/* Ambient orbs */}
        <div className="hero__orb" style={{ top: '15%', right: '12%', width: 320, height: 320, background: 'rgba(192,64,0,0.12)' }} />
        <div className="hero__orb" style={{ top: '55%', left: '5%', width: 220, height: 220, background: 'rgba(255,140,0,0.08)' }} />
        <div className="hero__orb" style={{ bottom: '10%', right: '30%', width: 180, height: 180, background: 'rgba(184,134,11,0.1)' }} />

        <div className="hero__container">
          <div className="hero__grid">
            {/* Text */}
            <div>
              <div className="hero__tagline">✦ {t('tagline')}</div>

              <h1 className="hero__title">
                <span>{t('hero.titleLine1')}</span>
                <br />
                <span className="hero__title-gradient">{t('hero.titleLine2')}</span>
              </h1>

              <p className="hero__subtitle">{t('hero.subtitle')}</p>

              <div className="hero__ctas">
                <button className="hero__cta-primary" onClick={() => navigate('/shop')}>
                  {t('hero.shopNow')}
                </button>
                <button className="hero__cta-secondary" onClick={() => navigate('/shop')}>
                  {t('hero.exploreAll')}
                </button>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hero__visual">
              <div className="hero__card">
                <span className="hero__card-emoji">{HERO_EMOJIS[heroIdx]}</span>
                <span className="hero__card-label">{t(`hero.product${heroIdx}`)}</span>

                <div className="hero__dots">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      className={`hero__dot ${i === heroIdx ? 'hero__dot--active' : ''}`}
                      onClick={() => setHeroIdx(i)}
                    />
                  ))}
                </div>

                <div className="hero__card-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <div className="hero__scroll-text">{t('scroll')}</div>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section className="featured">
        <div className="featured__inner">
          <RevealBox>
            <div className="featured__header">
              <div>
                <div className="featured__label">✦ {t('collections')}</div>
                <h2 className="featured__title">{t('product.featured')}</h2>
              </div>
              <button className="featured__explore-btn" onClick={() => navigate('/shop')}>
                {t('hero.exploreAll')} →
              </button>
            </div>
          </RevealBox>

          <div className="featured__grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAND ────────────────────────────────────────── */}
      <section className="stats-band">
        <div className="stats-band__inner">
          <div className="stats-band__grid">
            {[
              { val: '14,200+', label: t('dashboard.totalOrders') },
              { val: '98%', label: t('satisfaction') },
              { val: '62', label: t('countries') },
              { val: '500+', label: t('artisans') },
            ].map((s, i) => (
              <RevealBox key={i} delay={i * 0.1}>
                <div className="stats-band__item">
                  <div className="stats-band__value">{s.val}</div>
                  <div className="stats-band__label">{s.label}</div>
                </div>
              </RevealBox>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
