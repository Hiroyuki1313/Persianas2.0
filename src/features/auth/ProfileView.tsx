import React from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useOrdersStore } from '../../store/OrdersStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { OrderStatus } from '../../types/contracts';
import { LogOut, TrendingUp, Clock } from 'lucide-react';
import './ProfileView.css';

export const ProfileView: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const { orders } = useOrdersStore();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const pendingList = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.COMIZADA);
  const pendingCount = pendingList.length;
  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.PAID)
    .reduce((acc, curr) => acc + curr.total, 0);

  const formattedRevenue = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(totalRevenue);

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div 
          className="user-avatar" 
          style={{ backgroundColor: currentUser?.profileColor }}
        >
          {currentUser?.name.charAt(0)}
        </div>
        <div className="header-info">
          <h1>{currentUser?.name}</h1>
          <p>Socio Senior</p>
        </div>
        <Button variant="ghost" onClick={logout} className="logout-btn">
          <LogOut size={20} />
        </Button>
      </header>

      <section className="stats-grid">
        <Card 
          className={`stat-card clickable ${isExpanded ? 'expanded' : ''}`} 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="stat-main">
            <Clock className="stat-icon" color="#E65100" />
            <div className="stat-info">
              <span className="stat-label">Citas Pendientes</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
          </div>
          
          {isExpanded && pendingList.length > 0 && (
            <div className="appointments-dropdown">
              {pendingList.map(order => (
                <div key={order.id} className="appointment-mini-card">
                  <div className="apt-header">
                    <strong>{order.clientName}</strong>
                    <span className="apt-date">{new Date(order.visitDate + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</span>
                  </div>
                  <p className="apt-loc">{order.location || 'Ver detalles...'}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="stat-card">
          <TrendingUp className="stat-icon" color="#2E7D32" />
          <div className="stat-info">
            <span className="stat-label">Ganancia Mensual</span>
            <span className="stat-value">{formattedRevenue}</span>
          </div>
        </Card>
      </section>

      <Card className="banner-card">
        <h3>Meta del Mes</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '65%' }}></div>
        </div>
        <p>65% de la producción industrial completada</p>
      </Card>
    </div>
  );
};
