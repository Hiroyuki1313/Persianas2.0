import React, { useState, useEffect } from 'react';
import { pricingEngine } from './PricingEngine';
import { useOrdersStore } from '../../store/OrdersStore';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import materialsData from '../../../data/materials.json';
import type { IMaterial, IBlindItem } from '../../types/contracts';
import { OrderStatus } from '../../types/contracts';
import { Save, Calculator as CalcIcon, Plus, Trash2, List } from 'lucide-react';
import './CalculadoraModule.css';

export const CalculadoraModule: React.FC = () => {
  const { orders, addItemToOrder } = useOrdersStore();
  const [materials] = useState<IMaterial[]>(materialsData);

  // Current Item State
  const [itemName, setItemName] = useState('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '');
  const [area, setArea] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Staging Area (Lista para la orden)
  const [stagedItems, setStagedItems] = useState<IBlindItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');

  const materialOptions = materials.map(m => ({ value: m.id, label: `${m.name} ($${m.pricePerM2}/m2)` }));
  const orderOptions = [
    { value: '', label: '-- Seleccionar Orden --' },
    ...orders.filter(o => o.status !== OrderStatus.PAID).map(o => ({ value: o.id, label: o.clientName }))
  ];

  useEffect(() => {
    const mat = materials.find(m => m.id === selectedMaterialId);
    if (mat && typeof width === 'number' && typeof height === 'number') {
      const a = pricingEngine.calculateArea(width, height);
      const s = pricingEngine.calculateSubtotal(width, height, mat.pricePerM2);
      setArea(a);
      setSubtotal(s);
    } else {
      setArea(0);
      setSubtotal(0);
    }
  }, [width, height, selectedMaterialId, materials]);

  const handleAddToList = () => {
    if (!itemName) return alert('Dale un nombre a la persiana (ej. Sala)');
    if (!width || !height) return alert('Ingresa dimensiones válidas');

    const newItem: IBlindItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: itemName,
      width: Number(width),
      height: Number(height),
      materialId: selectedMaterialId,
      area,
      subtotal
    };

    setStagedItems([...stagedItems, newItem]);

    // Reset individual form
    setItemName('');
    setWidth('');
    setHeight('');
  };

  const handleRemoveFromList = (id: string) => {
    setStagedItems(stagedItems.filter(item => item.id !== id));
  };

  const handleSaveAllToOrder = () => {
    if (!selectedOrderId) return alert('Selecciona una orden primero');
    if (stagedItems.length === 0) return alert('No hay persianas en la lista');

    stagedItems.forEach(item => {
      addItemToOrder(selectedOrderId, item);
    });

    alert(`Se agregaron ${stagedItems.length} persianas a la orden`);
    setStagedItems([]);
  };

  const stagedTotal = stagedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  return (
    <div className="calc-container">
      <header className="calc-header">
        <h2><CalcIcon size={20} /> Nueva Persiana</h2>
      </header>

      <Card className="calc-card">
        <div className="calc-form">
          <Input
            label="Nombre / Identificador"
            placeholder="Ej. Window Sala, Recámara Principal..."
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <div className="dimensions-row">
            <Input
              label="Ancho"
              type="number"
              placeholder="0"
              value={width}
              onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : '')}
              className="compact-input"
            />
            <span className="dim-separator">×</span>
            <Input
              label="Alto"
              type="number"
              placeholder="0"
              value={height}
              onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
              className="compact-input"
            />
          </div>
          <Select
            label="Material / Tela"
            options={materialOptions}
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
          />

          <div className="calc-results">
            <div className="result-item">
              <span className="result-label">TOTAL M²</span>
              <span className="result-value">{area} m²</span>
            </div>
            <div className="result-item highlight">
              <span className="result-label">SUBTOTAL</span>
              <span className="result-value">${subtotal.toLocaleString()}</span>
            </div>
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={handleAddToList}
            disabled={!itemName || !width || !height}
          >
            <Plus size={18} />
            Agregar a la lista
          </Button>
        </div>
      </Card>

      {stagedItems.length > 0 && (
        <div className="staged-section">
          <header className="section-header">
            <h3><List size={16} /> Persianas en lista ({stagedItems.length})</h3>
          </header>

          <div className="staged-list">
            {stagedItems.map(item => {
              const mat = materials.find(m => m.id === item.materialId);
              return (
                <div key={item.id} className="staged-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-desc">{item.width}x{item.height}cm - {mat?.name}</span>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">${item.subtotal.toLocaleString()}</span>
                    <Button variant="ghost" onClick={() => handleRemoveFromList(item.id)} className="delete-btn">
                      <Trash2 size={16} color="var(--error)" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="staged-summary">
            <span>Total Lista:</span>
            <strong>${stagedTotal.toLocaleString()}</strong>
          </div>

          <div className="injection-area">
            <Select
              options={orderOptions}
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
            />
            <Button
              variant="primary"
              fullWidth
              onClick={handleSaveAllToOrder}
              disabled={!selectedOrderId}
              className="save-btn"
            >
              <Save size={18} />
              Guardar todo en Orden
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
