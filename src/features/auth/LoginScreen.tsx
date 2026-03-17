import React from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { Card } from '../../components/Card';
import './LoginScreen.css';

export const LoginScreen: React.FC = () => {
  const { users, login } = useAuthStore();

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Persianas <span className="highlight">Control</span></h1>
        <p>Selecciona tu perfil industrial</p>
      </header>
      
      <div className="profile-grid">
        {users.map((user) => (
          <Card 
            key={user.id} 
            className="profile-card"
            onClick={() => login(user.id)}
          >
            <div 
              className="profile-avatar" 
              style={{ backgroundColor: user.profileColor }}
            >
              {user.name.charAt(0)}
            </div>
            <span className="profile-name">{user.name}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};
