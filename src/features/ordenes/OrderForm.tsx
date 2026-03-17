import React, { useState } from 'react';
import type { IOrder } from '../../types/contracts';
import { OrderStatus } from '../../types/contracts';
import { useOrdersStore } from '../../store/OrdersStore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { ArrowLeft, Save } from 'lucide-react';
import { DatePicker } from '../../components/DatePicker';
import './OrderForm.css';

interface OrderFormProps {
  onBack: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onBack }) => {
  const { addOrder } = useOrdersStore();
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    location: '',
    visitDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName) return alert('El nombre es obligatorio');

    const newOrder: IOrder = {
      id: `ord-${Date.now()}`,
      clientId: `cli-${Date.now()}`,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      location: formData.location,
      visitDate: formData.visitDate,
      items: [],
      total: 0,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    addOrder(newOrder);
    alert('Orden creada con éxito');
    onBack();
  };

  return (
    <div className="order-form-container">
      <header className="form-header">
        <Button variant="ghost" onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
        </Button>
        <h2>Nueva Orden</h2>
      </header>

      <Card>
        <form onSubmit={handleSubmit} className="order-form">
          <Input 
            label="Nombre del Cliente" 
            placeholder="Ej. Juan Pérez"
            value={formData.clientName}
            onChange={(e) => setFormData({...formData, clientName: e.target.value})}
            required
          />
          
          <Input 
            label="Teléfono" 
            placeholder="55 1234 5678"
            type="tel"
            value={formData.clientPhone}
            onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
          />

          <Input 
            label="Dirección / Ubicación" 
            placeholder="Colonia, Calle, No."
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />

          <DatePicker 
            label="Fecha de Cita" 
            value={formData.visitDate}
            onChange={(val) => setFormData({...formData, visitDate: val})}
          />

          <Button type="submit" variant="success" fullWidth className="submit-btn">
            <Save size={18} />
            Crear Orden
          </Button>
        </form>
      </Card>
    </div>
  );
};
