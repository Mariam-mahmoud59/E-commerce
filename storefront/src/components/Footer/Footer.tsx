import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Footer.css';

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const [ref, visible] = useScrollReveal();

  return (
    <footer className="footer" ref={ref}>
      <div className={`footer__inner ${visible ? 'footer__inner--visible' : ''}`}>
        
        {/* Top Row - 4 Columns */}
        <div className="footer__grid">
          {/* Column 1: Brand */}
          <div className="footer__col" style={{ transitionDelay: '0.1s' }}>
            <div className="footer__brand">{t('brand')}</div>
            <p className="footer__tagline">{t('tagline')}</p>
          </div>

          {/* Column 2: Shop */}
          <div className="footer__col" style={{ transitionDelay: '0.2s' }}>
            <h4 className="footer__col-title">{t('footer.shop')}</h4>
            <ul className="footer__links">
              <li><a href="/shop?category=Tees">{t('footer.shopTees')}</a></li>
              <li><a href="/shop?category=Hoodies">{t('footer.shopHoodies')}</a></li>
              <li><a href="/shop?category=Bottoms">{t('footer.shopBottoms')}</a></li>
              <li><a href="/shop?category=Accessories">{t('footer.shopAccessories')}</a></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer__col" style={{ transitionDelay: '0.3s' }}>
            <h4 className="footer__col-title">{t('footer.support')}</h4>
            <ul className="footer__links">
              <li><a href="#">{t('footer.faq')}</a></li>
              <li><a href="#">{t('footer.shipping')}</a></li>
              <li><a href="#">{t('footer.contact')}</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="footer__col" style={{ transitionDelay: '0.4s' }}>
            <h4 className="footer__col-title">{t('footer.company')}</h4>
            <ul className="footer__links">
              <li><a href="#">{t('footer.about')}</a></li>
              <li><a href="#">{t('footer.careers')}</a></li>
              <li><a href="#">{t('footer.terms')}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__divider" />

        {/* Bottom Row */}
        <div className="footer__bottom">
          <div className="footer__copy">{t('copyright')}</div>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" aria-label="Twitter"><TwitterIcon /></a>
            <a href="#" aria-label="TikTok"><TiktokIcon /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
