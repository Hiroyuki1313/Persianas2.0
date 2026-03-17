import React, { useState, useEffect } from 'react';
import { pricingEngine } from '../../calculadora/PricingEngine';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { Button } from '../../../components/Button';
import materialsData from '../../../../data/materials.json';
import type { IMaterial, IBlindItem } from '../../../types/contracts';
import { Save, X, Calculator } from 'lucide-react';

interface BlindItemEditorProps {
  initialItem?: IBlindItem;
  onSave: (item: IBlindItem) => void;
  onCancel: () => void;
}

export const BlindItemEditor: React.FC<BlindItemEditorProps> = ({ initialItem, onSave, onCancel }) => {
  const [materials] = useState<IMaterial[]>(materialsData);
  
  const [name, setName] = useState(initialItem?.name || '');
  const [width, setWidth] = useState<number | ''>(initialItem?.width || '');
  const [height, setHeight] = useState<number | ''>(initialItem?.height || '');
  const [materialId, setMaterialId] = useState(initialItem?.materialId || materials[0]?.id || '');
  const [area, setArea] = useState(initialItem?.area || 0);
  const [subtotal, setSubtotal] = useState(initialItem?.subtotal || 0);

  const materialOptions = materials.map(m => ({ value: m.id, label: `${m.name} ($${m.pricePerM2}/m2)` }));

  useEffect(() => {
    const mat = materials.find(m => m.id === materialId);
    if (mat && typeof width === 'number' && typeof height === 'number') {
      const a = pricingEngine.calculateArea(width, height);
      const s = pricingEngine.calculateSubtotal(width, height, mat.pricePerM2);
      setArea(a);
      setSubtotal(s);
    }
  }, [width, height, materialId, materials]);

  const handleSave = () => {
    if (!name || !width || !height) return alert('Completa todos los campos');

    const item: IBlindItem = {
      id: initialItem?.id || Math.random().toString(36).substr(2, 9),
      name,
      width: Number(width),
      height: Number(height),
      materialId,
      area,
      subtotal
    };

    onSave(item);
  };

  return (
    <div className="blind-item-editor card-sub">
      <header className="editor-header">
        <h4><Calculator size={16} /> {initialItem ? 'Editar' : 'Nueva'} Persiana</h4>
        <Button variant="ghost" onClick={onCancel} className="close-btn">
          <X size={18} />
        </Button>
      </header>

      <div className="editor-fields">
        <Input 
          label="Identificador (ej. Ventana Cocina)" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la persiana"
        />
        
        <Select 
          label="Material" 
          options={materialOptions} 
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
        />

        <div className="editor-row">
          <Input 
            label="Ancho (cm)" 
            type="number" 
            value={width} 
            onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : '')} 
          />
          <Input 
            label="Alto (cm)" 
            type="number" 
            value={height} 
            onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')} 
          />
        </div>

        <div className="editor-results">
          <div className="res">
            <span>TOTAL M²:</span>
            <strong>{area} m²</strong>
          </div>
          <div className="res highlight">
            <span>SUBTOTAL:</span>
            <strong>${subtotal.toLocaleString()}</strong>
          </div>
        </div>

        <Button variant="success" fullWidth onClick={handleSave}>
          <Save size={18} />
          {initialItem ? 'Actualizar Partida' : 'Agregar a la Orden'}
        </Button>
      </div>
    </div>
  );
};
