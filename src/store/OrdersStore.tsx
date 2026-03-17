import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { IOrder, IBlindItem } from '../types/contracts';

interface OrdersContextType {
  orders: IOrder[];
  addOrder: (order: IOrder) => void;
  updateOrder: (id: string, updates: Partial<IOrder>) => void;
  addItemToOrder: (orderId: string, item: IBlindItem) => void;
  deleteOrder: (id: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const STORAGE_KEY = 'persianas_orders_v1';

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem(STORAGE_KEY);
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Error parsing orders from LocalStorage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  const addOrder = (order: IOrder) => {
    setOrders((prev) => [...prev, order]);
  };

  const updateOrder = (id: string, updates: Partial<IOrder>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  };

  const addItemToOrder = (orderId: string, item: IBlindItem) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newItems = [...o.items, item];
          const newTotal = newItems.reduce((acc, curr) => acc + curr.subtotal, 0);
          return { ...o, items: newItems, total: newTotal };
        }
        return o;
      })
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrder, addItemToOrder, deleteOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersStore = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrdersStore must be used within OrdersProvider');
  return context;
};
