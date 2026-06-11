import { useTranslation } from 'react-i18next';
import { RevealBox } from '../components/RevealBox/RevealBox';
import { orders } from '../data/orders';
import type { OrderStatus } from '../types/order';
import './DashboardPage.css';

const CHART_DATA = [65, 82, 71, 90, 84, 96, 88, 104, 98, 115, 108, 124];
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MAX_CHART = Math.max(...CHART_DATA);

interface StatCard {
  label: string;
  value: string;
  icon: string;
  change: string;
  up: boolean;
}

export function DashboardPage() {
  const { t } = useTranslation();

  const stats: StatCard[] = [
    { label: t('dashboard.totalRevenue'), value: '$12,426', icon: '💰', change: '+12.5%', up: true },
    { label: t('dashboard.totalOrders'), value: '284', icon: '📦', change: '+8.2%', up: true },
    { label: t('dashboard.activeUsers'), value: '1,420', icon: '👥', change: '+15.3%', up: true },
    { label: t('dashboard.pendingOrders'), value: '23', icon: '⏳', change: '-4.1%', up: false },
  ];

  const statusLabel = (status: OrderStatus) =>
    t(`dashboard.${status}`) as string;

  return (
    <div className="dashboard page-enter">
      <div className="dashboard__inner">
        <h1 className="dashboard__title">{t('dashboard.title')}</h1>

        {/* Stats */}
        <div className="dashboard__stats">
          {stats.map((s, i) => (
            <RevealBox key={i} delay={i * 0.08}>
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">{s.icon}</div>
                <div className="dashboard__stat-value">{s.value}</div>
                <div className="dashboard__stat-label">{s.label}</div>
                <div
                  className={`dashboard__stat-change ${s.up ? 'dashboard__stat-change--up' : 'dashboard__stat-change--down'}`}
                >
                  {s.change}
                </div>
              </div>
            </RevealBox>
          ))}
        </div>

        {/* Chart */}
        <RevealBox delay={0.1}>
          <div className="dashboard__chart-card">
            <h2 className="dashboard__section-title">{t('dashboard.revenue')}</h2>
            <div className="dashboard__chart">
              {CHART_DATA.map((val, i) => (
                <div key={i} className="dashboard__chart-bar-wrap">
                  <div
                    className="dashboard__chart-bar"
                    style={{
                      height: `${(val / MAX_CHART) * 100}%`,
                      animationDelay: `${i * 0.06}s`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="dashboard__chart-labels">
              {MONTHS.map((m) => (
                <span key={m} className="dashboard__chart-label">{m}</span>
              ))}
            </div>
          </div>
        </RevealBox>

        {/* Orders table */}
        <RevealBox delay={0.2}>
          <div className="dashboard__table-card">
            <h2 className="dashboard__section-title">{t('dashboard.recentOrders')}</h2>
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t('dashboard.customer')}</th>
                  <th>{t('dashboard.amount')}</th>
                  <th>{t('dashboard.status')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.amount}</td>
                    <td>
                      <span className={`dashboard__status dashboard__status--${o.status}`}>
                        {statusLabel(o.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealBox>
      </div>
    </div>
  );
}
