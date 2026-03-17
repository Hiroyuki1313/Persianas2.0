import type { IPricingEngine } from '../../types/contracts';

/**
 * PricingEngine - Motor de cálculo industrial.
 * 
 * Regla de negocio:
 * 1. El área se calcula en m2 (ancho cm / 100 * alto cm / 100).
 * 2. El subtotal es área * precio del material.
 */
export class PricingEngine implements IPricingEngine {
  calculateArea(width: number, height: number): number {
    if (width <= 0 || height <= 0) return 0;
    const area = (width / 100) * (height / 100);
    return Number(area.toFixed(2));
  }

  calculateSubtotal(width: number, height: number, pricePerM2: number): number {
    const area = this.calculateArea(width, height);
    const subtotal = area * pricePerM2;
    return Number(subtotal.toFixed(2));
  }
}

export const pricingEngine = new PricingEngine();
