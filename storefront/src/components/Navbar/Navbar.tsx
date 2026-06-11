import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/', key: 'nav.home' },
  { path: '/shop', key: 'nav.shop' },
  { path: '/checkout', key: 'nav.checkout' },
  { path: '/dashboard', key: 'nav.dashboard' },
] as const;

export function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const go = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Brand */}
          <button className="navbar__brand" onClick={() => go('/')}>
            {t('brand')}
          </button>

          {/* Desktop links */}
          <div className="navbar__links">
            {NAV_LINKS.map(({ path, key }) => (
              <button
                key={path}
                className={`navbar__link ${isActive(path) ? 'navbar__link--active' : ''}`}
                onClick={() => go(path)}
              >
                {t(key)}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="navbar__actions">
            <button className="navbar__cart-btn" onClick={() => go('/checkout')}>
              🛍️ <span className="navbar__cart-badge">{totalItems}</span>
            </button>

            <button className="navbar__lang-btn" onClick={toggleLang}>
              {t('langToggle')}
            </button>

            {/* Hamburger (mobile only) */}
            <button
              className={`navbar__mobile-toggle ${drawerOpen ? 'navbar__mobile-toggle--open' : ''}`}
              onClick={() => setDrawerOpen((o) => !o)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`navbar__overlay ${drawerOpen ? 'navbar__overlay--open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${drawerOpen ? 'navbar__drawer--open' : ''}`}>
        {NAV_LINKS.map(({ path, key }) => (
          <button
            key={path}
            className={`navbar__drawer-link ${isActive(path) ? 'navbar__drawer-link--active' : ''}`}
            onClick={() => go(path)}
          >
            {t(key)}
          </button>
        ))}
      </div>
    </>
  );
}
