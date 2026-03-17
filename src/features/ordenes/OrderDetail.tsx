import React, { useState } from 'react';
import type { IOrder, IBlindItem } from '../../types/contracts';
import { useOrdersStore } from '../../store/OrdersStore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { DatePicker } from '../../components/DatePicker';
import { BlindItemEditor } from './components/BlindItemEditor';
import { ArrowLeft, Save, Trash2, Plus, Edit2 } from 'lucide-react';
import materialsData from '../../../data/materials.json';
import './OrderDetail.css';

interface OrderDetailProps {
  order: IOrder;
  onBack: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack }) => {
  const { updateOrder, deleteOrder } = useOrdersStore();
  
  const [formData, setFormData] = useState({
    clientName: order.clientName,
    clientPhone: order.clientPhone || '',
    location: order.location || '',
    visitDate: order.visitDate
  });

  const [items, setItems] = useState<IBlindItem[]>(order.items);
  const [editingItem, setEditingItem] = useState<IBlindItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const materials = materialsData;
  const total = items.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName) return alert('El nombre es obligatorio');

    updateOrder(order.id, {
      ...formData,
      items,
      total
    });
    
    alert('Orden actualizada con éxito');
    onBack();
  };

  const handleAddItem = (newItem: IBlindItem) => {
    setItems([...items, newItem]);
    setIsAdding(false);
  };

  const handleUpdateItem = (updatedItem: IBlindItem) => {
    setItems(items.map(it => it.id === updatedItem.id ? updatedItem : it));
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('¿Eliminar esta persiana?')) {
      setItems(items.filter(it => it.id !== itemId));
    }
  };

  const handleDeleteOrder = () => {
    if (window.confirm('¿ESTÁS SEGURO? Esta acción no se puede deshacer y eliminará toda la orden.')) {
      deleteOrder(order.id);
      onBack();
    }
  };

  return (
    <div className="order-detail-container">
      <header className="detail-header">
        <div className="header-left">
          <Button variant="ghost" onClick={onBack} className="back-btn">
            <ArrowLeft size={20} />
          </Button>
          <h2>Editar Orden</h2>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleDeleteOrder} 
          className="delete-action-btn"
          title="Eliminar Orden"
        >
          <Trash2 size={24} color="#D32F2F" />
        </Button>
      </header>

      <Card>
        <form onSubmit={handleSave} className="order-edit-form">
          <div className="form-section">
            <label className="section-label">Información del Cliente</label>
            <Input 
              label="Nombre del Cliente" 
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              required
            />
            
            <Input 
              label="Teléfono" 
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
            />

            <Input 
              label="Dirección / Ubicación" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="form-section">
            <label className="section-label">Logística</label>
            <DatePicker 
              label="Fecha de Cita" 
              value={formData.visitDate}
              onChange={(val) => setFormData({...formData, visitDate: val})}
            />
          </div>

          <div className="form-section">
            <div className="section-header-row">
              <label className="section-label">Persianas ({items.length})</label>
              <Button type="button" variant="outline" onClick={() => setIsAdding(true)}>
                <Plus size={16} /> Agregar
              </Button>
            </div>

            {isAdding && (
              <BlindItemEditor 
                onSave={handleAddItem}
                onCancel={() => setIsAdding(false)}
              />
            )}

            <div className="items-list-detail">
              {items.map(item => {
                const mat = materials.find(m => m.id === item.materialId);
                return (
                  <div key={item.id} className="detail-item-row">
                    {editingItem?.id === item.id ? (
                      <BlindItemEditor 
                        initialItem={item}
                        onSave={handleUpdateItem}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : (
                      <>
                        <div className="item-main-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-specs">{item.width}x{item.height}cm - {mat?.name}</span>
                        </div>
                        <div className="item-actions-row">
                          <span className="item-subtotal">${item.subtotal.toLocaleString()}</span>
                          <div className="action-btns">
                            <Button variant="ghost" onClick={() => setEditingItem(item)}>
                              <Edit2 size={16} />
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 size={16} color="var(--error)" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {items.length === 0 && !isAdding && (
                <p className="empty-msg">No hay persianas en esta orden todavía.</p>
              )}
            </div>
          </div>

          <div className="order-stats">
            <div className="stat highlight">
              <span>Total Orden:</span>
              <strong>${total.toLocaleString()}</strong>
            </div>
          </div>

          <Button type="submit" variant="success" fullWidth className="save-btn">
            <Save size={18} />
            Guardar Cambios
          </Button>
        </form>
      </Card>
    </div>
  );
};
