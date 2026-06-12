import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { useTranslation } from 'react-i18next';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || t('common.error', 'An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container glass-panel">
        <h2>{t('auth.login', 'Login')}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">{t('auth.email', 'Email Address')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('auth.password', 'Password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-input"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary full-width"
            disabled={isLoading}
          >
            {isLoading ? t('common.loading', 'Loading...') : t('auth.login', 'Login')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth.noAccount', 'Don\'t have an account?')} <Link to="/register">{t('auth.register', 'Register here')}</Link>
        </p>
      </div>
    </div>
  );
}
