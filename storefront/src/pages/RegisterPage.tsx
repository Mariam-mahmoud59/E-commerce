import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { useTranslation } from 'react-i18next';
import './LoginPage.css'; // Reusing the auth form styles

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({ 
        fullName, 
        email, 
        password, 
        phone: phoneNumber, 
        preferredLanguage: i18n.language || 'en' 
      });
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
        <h2>{t('auth.register', 'Create Account')}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="glass-input"
            />
          </div>

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
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
            {isLoading ? t('common.loading', 'Loading...') : t('auth.register', 'Register')}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">{t('auth.login', 'Login here')}</Link>
        </p>
      </div>
    </div>
  );
}
