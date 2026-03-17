import React, { useState } from 'react';
import { AuthProvider, useAuthStore } from './store/AuthStore';
import { OrdersProvider } from './store/OrdersStore';
import { Layout } from './components/Layout';
import { LoginScreen } from './features/auth/LoginScreen';
import { ProfileView } from './features/auth/ProfileView';
import { OrdersList } from './features/ordenes/OrdersList';
import { CalculadoraModule } from './features/calculadora/CalculadoraModule';
import './styles/variables.css';

const AppContent: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'calc'>('orders');

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'orders' && <OrdersList />}
      {activeTab === 'calc' && <CalculadoraModule />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <OrdersProvider>
        <AppContent />
      </OrdersProvider>
    </AuthProvider>
  );
};

export default App;
