import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/AuthContext';
import './Navbar.css';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const go = (path: string) => {
    if (path.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const id = path.substring(2);
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const id = path.substring(2);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
    setDrawerOpen(false);
  };



  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' && !window.location.hash;
    if (path.startsWith('/#')) return window.location.hash === path.substring(1);
    return location.pathname.startsWith(path.split('?')[0]);
  };

  const isAdmin = isAuthenticated && user?.roles?.includes('Admin');

  const getLinks = (isMobile: boolean = false) => {
    if (isMobile) {
      const links = [
        { path: '/', key: 'nav.home', defaultText: 'Home' },
        { path: '/shop', key: 'nav.categories', defaultText: 'Categories' },
        { path: '/shop?offers=true', key: 'nav.offers', defaultText: 'Offers' },
        { path: '/#contact', key: 'nav.contact', defaultText: 'Contact Us' }
      ];
      if (isAdmin) {
        links.push({ path: '/dashboard', key: 'nav.dashboard', defaultText: 'Dashboard' });
      }
      if (isAuthenticated) {
        links.push({ path: '/profile', key: 'nav.profile', defaultText: 'Profile' });
      }
      return links;
    } else {
      const links = [
        { path: '/', key: 'nav.home', defaultText: 'Home' },
        { path: '/#about', key: 'nav.about', defaultText: 'About' },
        { path: '/#contact', key: 'nav.contact', defaultText: 'Contact Us' },
      ];
      if (isAdmin) {
        links.push({ path: '/dashboard', key: 'nav.dashboard', defaultText: 'Dashboard' });
      }
      if (isAuthenticated) {
        links.push({ path: '/profile', key: 'nav.profile', defaultText: 'Profile' });
      }
      return links;
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Brand */}
          <button className="navbar__brand" onClick={() => go('/')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            {t('brand', 'THETATEACH STORE')}
          </button>

          {/* Desktop links */}
          <div className="navbar__links">
            {getLinks(false).map(({ path, key, defaultText }) => (
              <button
                key={path}
                className={`navbar__link ${isActive(path) ? 'navbar__link--active' : ''}`}
                onClick={() => go(path)}
              >
                {t(key, defaultText)}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="navbar__actions">
            <button className="navbar__icon-btn" onClick={() => go('/shop')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {!isAdmin && (
              <button className="navbar__cart-btn" onClick={openCart}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="navbar__cart-badge">{totalItems}</span>
              </button>
            )}

            {/* Auth Actions outside Navbar Links for Desktop */}
            {!isAuthenticated && (
              <div className="navbar__auth-buttons">
                <button className="navbar__login-btn" onClick={() => go('/login')}>
                  {t('auth.login', 'Sign in')}
                </button>
                <button className="navbar__register-btn" onClick={() => go('/register')}>
                  {t('auth.register', 'Register')}
                </button>
              </div>
            )}

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
        {getLinks(true).map(({ path, key, defaultText }) => (
          <button
            key={path}
            className={`navbar__drawer-link ${isActive(path) ? 'navbar__drawer-link--active' : ''}`}
            onClick={() => go(path)}
          >
            {t(key, defaultText)}
          </button>
        ))}

        {!isAuthenticated && (
          <>
            <button className={`navbar__drawer-link ${isActive('/login') ? 'navbar__drawer-link--active' : ''}`} onClick={() => go('/login')}>
              {t('auth.login', 'Sign in')}
            </button>
            <button className={`navbar__drawer-link ${isActive('/register') ? 'navbar__drawer-link--active' : ''}`} onClick={() => go('/register')}>
              {t('auth.register', 'Register')}
            </button>
          </>
        )}
      </div>
    </>
  );
}
