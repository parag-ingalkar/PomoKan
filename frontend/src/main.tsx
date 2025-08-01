import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './hooks/useAuth';

createRoot(document.getElementById('root')!).render(
  
    <AuthProvider>
      <App />
    </AuthProvider>
 
);
