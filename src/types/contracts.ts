/**
 * Persianas Control - Domain Contracts
 * Arquitectura basanda en Contratos para asegurar LSP y extensibilidad.
 */

export const OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  COMIZADA: 'COMIZADA', // Cotizada
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface IMaterial {
  id: string;
  name: string;
  pricePerM2: number;
}

export interface IBlindItem {
  id: string;
  name: string;
  width: number; // in cm
  height: number; // in cm
  materialId: string;
  area: number; // in m2
  subtotal: number;
}

export interface IOrder {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  location?: string;
  visitDate: string;
  installationDate?: string;
  items: IBlindItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface IUser {
  id: string;
  name: string;
  profileColor: string;
}

/**
 * Interface para el motor de calculo
 */
export interface IPricingEngine {
  calculateSubtotal(width: number, height: number, pricePerM2: number): number;
  calculateArea(width: number, height: number): number;
}
