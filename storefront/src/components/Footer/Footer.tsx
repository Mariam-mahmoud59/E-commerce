import { useTranslation } from 'react-i18next';
import './Footer.css';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">{t('brand')}</div>
        <div className="footer__copy">{t('copyright')}</div>
      </div>
    </footer>
  );
}
