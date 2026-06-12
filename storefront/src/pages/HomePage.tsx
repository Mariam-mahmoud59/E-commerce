import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RevealBox } from '../components/RevealBox/RevealBox';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { Footer } from '../components/Footer/Footer';
import { products } from '../data/products';
import './HomePage.css';

const HERO_IMAGES = [
  '/images/product-cushion.jpg',
  '/images/product-plates.jpg',
  '/images/product-candles.jpg'
];

export function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setHeroIdx((i) => (i + 1) % 3), 4000);
    return () => clearInterval(iv);
  }, []);

  const isRtl = i18n.language === 'ar';

  return (
    <div className="page-enter">
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className={`hero hero--theme-${heroIdx}`}>
        {/* Grain overlay */}
        <div className="hero__grain" />

        <div className="hero__container">
          <div className="hero__grid">
            {/* Text */}
            <div className="hero__text-content">
              <h1 className="hero__title">
                <span className="text-reveal" style={{ animationDelay: '0.2s' }}>{t('hero.titleLine1')}</span>
                <br />
                <span className="hero__title-gradient text-reveal" style={{ animationDelay: '0.4s' }}>{t('hero.titleLine2')}</span>
              </h1>

              <p className="hero__subtitle text-reveal" style={{ animationDelay: '0.6s' }}>{t('hero.subtitle')}</p>

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
                <img src={HERO_IMAGES[heroIdx]} alt={t(`hero.product${heroIdx}`)} className="hero__card-img" />
                <div className="hero__card-overlay" />
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
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ─── MARQUEE ───────────────────────────────────────────── */}
      <div className="marquee">
        <div className="marquee__inner">
          <div className="marquee__content">
            {Array(4).fill(t('home.marquee')).map((text, i) => (
              <span key={i} className="marquee__text">{text}</span>
            ))}
          </div>
          <div className="marquee__content" aria-hidden="true">
            {Array(4).fill(t('home.marquee')).map((text, i) => (
              <span key={i} className="marquee__text">{text}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── COLLECTIONS ───────────────────────────────────────── */}
      <section className="collections">
        <div className="collections__inner">
          <RevealBox>
            <div className="collections__label">✦ {t('home.collectionsLabel')}</div>
            <h2 className="collections__title">{t('home.collectionsTitle')}</h2>
          </RevealBox>

          <div className="collections__grid">
            <RevealBox delay={0.1}>
              <div className="collection-card" onClick={() => navigate('/shop?category=Tees')}>
                <div className="collection-card__image">
                  <img src="/images/collection-ceramics.jpg" alt="Tees" />
                </div>
                <h3 className="collection-card__title">{t('home.col1Title')}</h3>
                <p className="collection-card__desc">{t('home.col1Desc')}</p>
                <span className="collection-card__cta">{t('home.col1Cta')} →</span>
              </div>
            </RevealBox>
            <RevealBox delay={0.2}>
              <div className="collection-card" onClick={() => navigate('/shop?category=Hoodies')}>
                <div className="collection-card__image">
                  <img src="/images/collection-textiles.jpg" alt="Hoodies" />
                </div>
                <h3 className="collection-card__title">{t('home.col2Title')}</h3>
                <p className="collection-card__desc">{t('home.col2Desc')}</p>
                <span className="collection-card__cta">{t('home.col2Cta')} →</span>
              </div>
            </RevealBox>
            <RevealBox delay={0.3}>
              <div className="collection-card" onClick={() => navigate('/shop?category=Accessories')}>
                <div className="collection-card__image">
                  <img src="/images/collection-lighting.jpg" alt="Accessories" />
                </div>
                <h3 className="collection-card__title">{t('home.col3Title')}</h3>
                <p className="collection-card__desc">{t('home.col3Desc')}</p>
                <span className="collection-card__cta">{t('home.col3Cta')} →</span>
              </div>
            </RevealBox>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section className="featured">
        <div className="featured__inner">
          <RevealBox>
            <div className="featured__header">
              <div>
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

      {/* ─── LOOKBOOK PARALLAX ─────────────────────────────────── */}
      <section className="lookbook">
        <div className="lookbook__sticky">
          <img src="/images/parallax-flatlay.jpg" alt="Lookbook" className="lookbook__bg" />
          
          <div className={`lookbook__overlay ${isRtl ? 'lookbook__overlay--rtl' : 'lookbook__overlay--ltr'}`}>
            <RevealBox>
              <div className="lookbook__label">✦ {t('home.parallaxLabel')}</div>
              <h2 className="lookbook__title">{t('home.parallaxTitle')}</h2>
              <p className="lookbook__body">{t('home.parallaxBody')}</p>
              <button className="lookbook__cta" onClick={() => navigate('/shop')}>
                {t('home.parallaxCta')}
              </button>
            </RevealBox>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="cta-banner__inner">
          <RevealBox>
            <h2 className="cta-banner__title">{t('home.ctaTitle')}</h2>
            <p className="cta-banner__subtitle">{t('home.ctaSubtitle')}</p>
            <button className="cta-banner__btn" onClick={() => navigate('/register')}>
              {t('home.ctaBtn')}
            </button>
          </RevealBox>
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
