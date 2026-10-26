import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { ToastProvider } from './context/ToastContext';
import { SaasPlanProvider } from './context/SaasPlanContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SaasPlanProvider>
      <AuthProvider>
        <DatabaseProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </DatabaseProvider>
      </AuthProvider>
    </SaasPlanProvider>
  </React.StrictMode>
);
