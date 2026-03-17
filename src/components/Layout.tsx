import React from 'react';
import { User, ClipboardList, Calculator } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'profile' | 'orders' | 'calc';
  onTabChange: (tab: 'profile' | 'orders' | 'calc') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="layout-container">
      <main className="layout-content">
        {children}
      </main>
      
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <User size={24} />
          <span>Perfil</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => onTabChange('orders')}
        >
          <ClipboardList size={24} />
          <span>Ordenes</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => onTabChange('calc')}
        >
          <Calculator size={24} />
          <span>Calculadora</span>
        </button>
      </nav>
    </div>
  );
};
