import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RevealBox } from '../components/RevealBox/RevealBox';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { ShiftButton } from '../components/ShiftButton/ShiftButton';
import { Background3D } from '../components/Background3D/Background3D';
import { NewArrivals } from '../components/NewArrivals/NewArrivals';
import { Footer } from '../components/Footer/Footer';
import { products } from '../data/products';
import './HomePage.css';

const CARDS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
  { id: 2, image: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=800&auto=format&fit=crop' },
  { id: 3, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop' },
  { id: 4, image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop' },
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

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <div className="page-enter">
      {/* ─── 3D LAYERED HERO ────────────────────────────────────── */}
      <section ref={containerRef} className="hero-3d-container">
        <div className="hero-3d-sticky">
          <Background3D />
          <div className="hero__container">
            <div className="hero__grid">
              
              {/* Text */}
              <div className="hero__text-content">
                <h1 className="hero__title">
                  <span className="text-reveal" style={{ animationDelay: '0.2s' }}>{t('hero.titleLine1')}</span>
                  <span className="hero__title-gradient text-reveal" style={{ animationDelay: '0.4s' }}>{t('hero.titleLine2')}</span>
                  <span className="hero__title-gradient text-reveal" style={{ animationDelay: '0.6s' }}>{t('hero.titleLine3')}</span>
                </h1>

                <p className="hero__subtitle text-reveal" style={{ animationDelay: '0.6s' }}>{t('hero.subtitle')}</p>

                <div className="hero__ctas text-reveal" style={{ animationDelay: '0.8s', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <ShiftButton 
                    variant="slide" 
                    text={t('hero.shopNow', 'Shop Now')} 
                    baseColor="var(--accent)" 
                    textColor="var(--dark)" 
                    onClick={() => navigate('/shop')} 
                  />
                  <ShiftButton 
                    variant="right" 
                    text={t('hero.exploreAll', 'Explore All')} 
                    baseColor="#2a2a2a" 
                    textColor="#ffffff" 
                    onClick={() => navigate('/shop')} 
                  />
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

      {/* ─── NEW ARRIVALS / FEATURED PRODUCTS ──────────────────── */}
      <NewArrivals />

      {/* ─── CTA BANNER ────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="cta-banner__inner">
          <RevealBox>
            <h2 className="cta-banner__title">{t('home.ctaTitle')}</h2>
            <p className="cta-banner__subtitle">{t('home.ctaSubtitle')}</p>
            <div style={{ marginTop: '40px' }}>
              <ShiftButton 
                variant="left" 
                text={t('home.ctaBtn', 'Join Now')} 
                baseColor="var(--accent)" 
                textColor="var(--dark)" 
                onClick={() => navigate('/register')} 
              />
            </div>
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

      {/* ─── ABOUT SECTION ─────────────────────────────────────── */}
      <section id="about" style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto', color: 'var(--light-text)', textAlign: 'center' }}>
        <RevealBox>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>{t('nav.about', 'About Us')}</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Thetateach Store brings you the best quality clothing and accessories. We focus on premium materials, ethical manufacturing, and cutting-edge designs to elevate your everyday style.
          </p>
        </RevealBox>
      </section>

      {/* ─── CONTACT SECTION ───────────────────────────────────── */}
      <section id="contact" style={{ padding: '80px 20px 120px', maxWidth: '1200px', margin: '0 auto', color: 'var(--light-text)', textAlign: 'center' }}>
        <RevealBox>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>{t('nav.contact', 'Contact Us')}</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6', marginBottom: '30px' }}>
            Have a question? We're here to help. Reach out to our customer support team for inquiries about orders, returns, or product details.
          </p>
          <a href="mailto:support@thetateach.com" style={{ display: 'inline-block', padding: '12px 30px', background: 'var(--accent)', color: 'var(--dark)', fontWeight: '600', borderRadius: '30px', textDecoration: 'none' }}>
            Email Support
          </a>
        </RevealBox>
      </section>

      <Footer />
    </div>
  );
}
