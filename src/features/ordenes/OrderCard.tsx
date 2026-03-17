import React from 'react';
import type { IOrder } from '../../types/contracts';
import { OrderStatus } from '../../types/contracts';
import { Card } from '../../components/Card';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import './OrderCard.css';

interface OrderCardProps {
  order: IOrder;
  onClick: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'Pendiente';
      case OrderStatus.PAID: return 'Pagado';
      case OrderStatus.COMIZADA: return 'Cotizada';
      default: return status;
    }
  };

  return (
    <Card className="order-card" onClick={onClick}>
      <div className="order-header">
        <div className="order-client-info">
          <h3 className="client-name">{order.clientName}</h3>
          <span className={`status-badge status-${order.status.toLowerCase()}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
        <div className="order-total">${order.total.toLocaleString()}</div>
      </div>
      
      <div className="order-details">
        <div className="detail-item">
          <MapPin size={14} />
          <span>{order.location || 'Sin ubicación'}</span>
        </div>
        <div className="detail-item">
          <Calendar size={14} />
          <span>{order.visitDate}</span>
        </div>
      </div>

      <div className="order-footer">
        <div className="order-items-summary">
          <span>{order.items.length} persianas</span>
          {order.items.length > 0 && (
            <div className="items-names">
              {order.items.map(i => i.name).join(', ')}
            </div>
          )}
        </div>
        <ChevronRight size={18} />
      </div>
    </Card>
  );
};
