import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import App from './App';
import './index.css';

const toastOptions = {
  duration: 3000,
  style: {
    background: '#2C211B',
    color: '#F8F5EF',
    borderRadius: '9999px',
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: 500,
  },
  success: { iconTheme: { primary: '#C58B55', secondary: '#FFFFFF' } },
  error: { duration: 4500, iconTheme: { primary: '#F87171', secondary: '#FFFFFF' } },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster position="top-center" toastOptions={toastOptions} containerStyle={{ top: 80 }} />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
