import React, { useState } from 'react';
import { useOrdersStore } from '../../store/OrdersStore';
import { OrderCard } from './OrderCard';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Plus } from 'lucide-react';
import { OrderForm } from './OrderForm';
import { OrderDetail } from './OrderDetail';
import './OrdersList.css';
import type { IOrder } from '../../types/contracts';

export const OrdersList: React.FC = () => {
  const { orders } = useOrdersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const filteredOrders = orders.filter(o => 
    o.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isCreating) {
    return <OrderForm onBack={() => setIsCreating(false)} />;
  }

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="orders-container">
      <header className="orders-header">
        <h2>Ordenes</h2>
        <Button variant="success" className="btn-fab" onClick={() => setIsCreating(true)}>
          <Plus size={20} />
          Nueva
        </Button>
      </header>

      <div className="search-bar">
        <Input 
          placeholder="Buscar cliente..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="list-content">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
          ))
        ) : (
          <div className="empty-state">
            <p>No hay órdenes registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};
