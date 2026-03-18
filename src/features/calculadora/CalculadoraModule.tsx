import React, { useState } from 'react';
import { pricingEngine } from './PricingEngine';
import { useOrdersStore } from '../../store/OrdersStore';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import materialsData from '../../../data/materials.json';
import type { IMaterial, IBlindItem } from '../../types/contracts';
import { OrderStatus } from '../../types/contracts';
import { Save, Calculator as CalcIcon, Plus, Trash2 } from 'lucide-react';
import './CalculadoraModule.css';

export const CalculadoraModule: React.FC = () => {
  const { orders, addItemToOrder } = useOrdersStore();
  const [materials] = useState<IMaterial[]>(materialsData);
  const [selectedOrderId, setSelectedOrderId] = useState('');

  // Initial empty item helper
  const createEmptyItem = (): IBlindItem => ({
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    width: 0,
    height: 0,
    materialId: materials[0]?.id || '',
    area: 0,
    subtotal: 0
  });

  // Staged Items (Workspace)
  const [stagedItems, setStagedItems] = useState<IBlindItem[]>([createEmptyItem()]);

  const materialOptions = materials.map(m => ({ value: m.id, label: `${m.name} ($${m.pricePerM2}/m2)` }));
  const orderOptions = [
    { value: '', label: '-- Seleccionar Orden --' },
    ...orders.filter(o => o.status !== OrderStatus.PAID).map(o => ({ value: o.id, label: o.clientName }))
  ];

  const updateItem = (id: string, updates: Partial<IBlindItem>) => {
    setStagedItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const updated = { ...item, ...updates };
      const mat = materials.find(m => m.id === updated.materialId);
      
      if (mat && updated.width > 0 && updated.height > 0) {
        updated.area = pricingEngine.calculateArea(updated.width, updated.height);
        updated.subtotal = pricingEngine.calculateSubtotal(updated.width, updated.height, mat.pricePerM2);
      } else {
        updated.area = 0;
        updated.subtotal = 0;
      }
      
      return updated;
    }));
  };

  const handleAddBlank = () => {
    setStagedItems([...stagedItems, createEmptyItem()]);
  };

  const handleRemoveItem = (id: string) => {
    setStagedItems(prev => prev.length > 1 ? prev.filter(item => item.id !== id) : [createEmptyItem()]);
  };

  const handleSaveAllToOrder = () => {
    if (!selectedOrderId) return alert('Selecciona una orden primero');
    
    // Validation
    const invalidItems = stagedItems.filter(i => !i.name || i.width <= 0 || i.height <= 0);
    if (invalidItems.length > 0) {
      return alert('Hay persianas incompletas en la lista');
    }

    stagedItems.forEach(item => {
      addItemToOrder(selectedOrderId, item);
    });

    alert(`Se agregaron ${stagedItems.length} persianas a la orden`);
    setStagedItems([createEmptyItem()]);
  };

  const totalArea = stagedItems.reduce((acc, curr) => acc + curr.area, 0);
  const totalSubtotal = stagedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const isListValid = stagedItems.every(i => i.name && i.width > 0 && i.height > 0);

  return (
    <div className="calc-container">
      <header className="calc-header">
        <h2><CalcIcon size={20} /> Armar Orden</h2>
      </header>

      <div className="staged-list scrolling-area">
        {stagedItems.map((item, index) => (
          <Card key={item.id} className="calc-card staged-card">
            <div className="card-header-actions">
              <span className="item-number">#{index + 1}</span>
              <Button variant="ghost" onClick={() => handleRemoveItem(item.id)} className="delete-btn">
                <Trash2 size={16} color="var(--error)" />
              </Button>
            </div>
            
            <div className="calc-form">
              <Input
                label="Ubicación / Nombre"
                placeholder="Ej. Sala, Recámara..."
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
              />
              
              <div className="dimensions-row">
                <Input
                  label="Ancho"
                  type="number"
                  placeholder="0"
                  value={item.width || ''}
                  onChange={(e) => updateItem(item.id, { width: Number(e.target.value) })}
                  className="compact-input"
                />
                <span className="dim-separator">×</span>
                <Input
                  label="Alto"
                  type="number"
                  placeholder="0"
                  value={item.height || ''}
                  onChange={(e) => updateItem(item.id, { height: Number(e.target.value) })}
                  className="compact-input"
                />
              </div>

              <Select
                label="Material"
                options={materialOptions}
                value={item.materialId}
                onChange={(e) => updateItem(item.id, { materialId: e.target.value })}
              />

              <div className="item-mini-footer">
                <span>Subtotal: ${item.subtotal.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        ))}

        <Button
          variant="outline"
          fullWidth
          onClick={handleAddBlank}
          className="add-blank-btn"
        >
          <Plus size={18} />
          Agregar persiana
        </Button>
      </div>

      <footer className="calc-sticky-footer">
        <div className="footer-summary-list">
          {stagedItems.map((item, idx) => (
            <div key={item.id} className="summary-row">
              <span className="summary-name">#{idx + 1} {item.name || 'Persiana'}</span>
              <span className="summary-total">${item.subtotal.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="footer-stats">
          <div className="stat-item">
            <span className="stat-label">TOTAL M²</span>
            <span className="stat-value">{totalArea.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">GRAN TOTAL</span>
            <span className="stat-value">${totalSubtotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="footer-actions">
          <Select
            options={orderOptions}
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="order-select-footer"
          />
          <Button
            variant="primary"
            fullWidth
            onClick={handleSaveAllToOrder}
            disabled={!selectedOrderId || !isListValid}
          >
            <Save size={18} />
            Guardar en Orden
          </Button>
        </div>
      </footer>
    </div>
  );
};
