import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RevealBox } from '../components/RevealBox/RevealBox';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { Footer } from '../components/Footer/Footer';
import { products } from '../data/products';
import './HomePage.css';

const CARDS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
  { id: 2, image: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=800&auto=format&fit=crop' },
  { id: 3, image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?q=80&w=800&auto=format&fit=crop' },
  { id: 4, image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop' },
  { id: 5, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop' },
  { id: 6, image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop' },
  { id: 7, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' },
  { id: 8, image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop' },
  { id: 9, image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop' },
  { id: 10, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop' },
  { id: 11, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
  { id: 12, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
];

export function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;
      
      const scrolled = -rect.top;
      let p = scrolled / maxScroll;
      p = Math.max(0, Math.min(1, p));
      
      targetScroll.current = p * (CARDS.length - 1);
    };

    const renderLoop = () => {
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.08;
      
      if (Math.abs(targetScroll.current - currentScroll.current) > 0.001) {
        setProgress(currentScroll.current);
      }
      
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId.current = requestAnimationFrame(renderLoop);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="page-enter">
      {/* ─── 3D LAYERED HERO ────────────────────────────────────── */}
      <section ref={containerRef} className="hero-3d-container">
        <div className="hero-3d-sticky">
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

              {/* 3D Visual */}
              <div className="hero__visual">
                <div className="hero-3d-scene">
                  {CARDS.map((card, index) => {
                    const r = index - progress;
                    let z = r * -280; 
                    let x = r * 140;  
                    let y = r * -40;  
                    let opacity = 1;

                    if (r < 0) {
                      z = r * 800; 
                      x = r * 200; 
                      y = r * 150; 
                      opacity = 1 + r; 
                    }

                    if (r > 6) {
                      opacity = Math.max(0, 1 - (r - 6) * 0.5);
                    }

                    const isVisible = r > -1.5 && r < 10;

                    return (
                      <div
                        key={card.id}
                        className="hero-3d-card"
                        style={{
                          display: isVisible ? 'block' : 'none',
                          transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                          zIndex: 100 - index,
                          opacity: opacity,
                          boxShadow: r > -0.5 ? '0 20px 50px rgba(0, 0, 0, 0.7)' : 'none',
                          willChange: 'transform, opacity'
                        }}
                      >
                        <img 
                          src={card.image} 
                          alt={`Layer ${index + 1}`}
                          className="hero-3d-img"
                        />
                        
                        <div 
                          style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: `linear-gradient(135deg, rgba(255,255,255,${r === 0 ? 0.05 : 0}) 0%, rgba(0,0,0,${Math.min(r * 0.1, 0.6)}) 100%)`
                          }}
                        />

                        <div className="hero-3d-gradient" />

                        <div className="hero-3d-content">
                          <h3 className="hero-3d-title">
                            Oversized Fits
                          </h3>
                          
                          <div className="hero-3d-dots">
                            <div className="hero-3d-dot-active"></div>
                            <div className="hero-3d-dot"></div>
                            <div className="hero-3d-dot"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
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
